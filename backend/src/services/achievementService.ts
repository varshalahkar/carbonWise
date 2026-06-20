import { Types } from "mongoose";
import { BENCHMARK_KG_CO2 } from "../constants/emissionFactors.js";
import { ActivityModel } from "../models/Activity.js";
import { AchievementModel } from "../models/Achievement.js";
import type { AchievementDocument, AchievementKey } from "../types/domain.js";
import { getDayKey, getMonthKey } from "../utils/dates.js";

export async function evaluateAchievements(userId: string): Promise<AchievementDocument[]> {
  const objectUserId = new Types.ObjectId(userId);
  const activities = await ActivityModel.find({ userId: objectUserId }).sort({ createdAt: 1 });
  const existing = await AchievementModel.find({ userId: objectUserId });
  const existingKeys = new Set(existing.map((achievement) => achievement.achievementKey));
  const keysToUnlock = getUnlockedKeys(activities, existingKeys);

  if (keysToUnlock.length > 0) {
    await AchievementModel.insertMany(
      keysToUnlock.map((achievementKey) => ({
        userId: objectUserId,
        achievementKey,
        unlockedAt: new Date(),
      })),
      { ordered: false },
    );
  }

  return AchievementModel.find({ userId: objectUserId }).sort({ unlockedAt: -1 });
}

export async function listAchievements(userId: string): Promise<AchievementDocument[]> {
  return AchievementModel.find({ userId: new Types.ObjectId(userId) }).sort({ unlockedAt: -1 });
}

function getUnlockedKeys(activities: Awaited<ReturnType<typeof ActivityModel.find>>, existingKeys: Set<AchievementKey>): AchievementKey[] {
  const keys: AchievementKey[] = [];
  const activityCount = activities.length;
  const saved = cumulativeSavedAgainstBenchmark(activities);
  const streak = calculateStreak(activities.map((activity) => activity.createdAt));

  addIfEligible(keys, existingKeys, "first_activity", activityCount >= 1);
  addIfEligible(keys, existingKeys, "seven_day_streak", streak >= 7);
  addIfEligible(keys, existingKeys, "twenty_five_activities", activityCount >= 25);
  addIfEligible(keys, existingKeys, "fifty_activities", activityCount >= 50);
  addIfEligible(keys, existingKeys, "hundred_kg_saved", saved >= 100);
  addIfEligible(keys, existingKeys, "five_hundred_kg_saved", saved >= 500);

  return keys;
}

function addIfEligible(keys: AchievementKey[], existingKeys: Set<AchievementKey>, key: AchievementKey, eligible: boolean): void {
  if (eligible && !existingKeys.has(key)) {
    keys.push(key);
  }
}

function cumulativeSavedAgainstBenchmark(activities: Awaited<ReturnType<typeof ActivityModel.find>>): number {
  const monthlyTotals = new Map<string, number>();
  activities.forEach((activity) => {
    const key = getMonthKey(activity.createdAt);
    monthlyTotals.set(key, (monthlyTotals.get(key) ?? 0) + activity.co2Emission);
  });

  return Array.from(monthlyTotals.values()).reduce((sum, total) => sum + Math.max(0, BENCHMARK_KG_CO2 - total), 0);
}

function calculateStreak(dates: Date[]): number {
  const dayTimestamps = Array.from(new Set(dates.map((date) => getDayKey(date))))
    .map((key) => new Date(`${key}T00:00:00.000Z`).getTime())
    .sort((a, b) => b - a);

  if (dayTimestamps.length === 0) return 0;

  let streak = 1;
  for (let index = 1; index < dayTimestamps.length; index += 1) {
    const previous = dayTimestamps[index - 1];
    const current = dayTimestamps[index];
    if (previous === undefined || current === undefined) continue;
    const diffDays = Math.round((previous - current) / 86400000);
    if (diffDays === 1) streak += 1;
    if (diffDays > 1) break;
  }

  return streak;
}
