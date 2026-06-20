import { Types } from "mongoose";
import { ActivityModel } from "../models/Activity.js";
import type { ActivityCategory, CategoryTotal, TrendPoint } from "../types/domain.js";
import { startOfCurrentMonth, startOfCurrentWeek } from "../utils/dates.js";
import { getDashboard } from "./dashboardService.js";
import { round } from "./scoreService.js";

export async function getWeeklyEmissions(userId: string): Promise<TrendPoint[]> {
  const activities = await ActivityModel.find({
    userId: new Types.ObjectId(userId),
    createdAt: { $gte: startOfCurrentWeek() },
  }).sort({ createdAt: 1 });

  return groupByLabel(activities.map((activity) => ({ label: activity.createdAt.toLocaleDateString("en-US", { weekday: "short" }), value: activity.co2Emission })));
}

export async function getMonthlyEmissions(userId: string): Promise<TrendPoint[]> {
  const activities = await ActivityModel.find({
    userId: new Types.ObjectId(userId),
    createdAt: { $gte: startOfCurrentMonth() },
  }).sort({ createdAt: 1 });

  return groupByLabel(activities.map((activity) => ({ label: activity.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric" }), value: activity.co2Emission })));
}

export async function getCategoryBreakdown(userId: string): Promise<CategoryTotal[]> {
  const result = await ActivityModel.aggregate<{ _id: ActivityCategory; total: number }>([
    { $match: { userId: new Types.ObjectId(userId) } },
    { $group: { _id: "$category", total: { $sum: "$co2Emission" } } },
    { $sort: { total: -1 } },
  ]);

  const overall = result.reduce((sum, item) => sum + item.total, 0);
  return result.map((item) => ({
    category: item._id,
    total: round(item.total),
    percentage: overall > 0 ? round((item.total / overall) * 100) : 0,
  }));
}

export async function getScoreInsight(userId: string) {
  return getDashboard(userId);
}

function groupByLabel(items: { label: string; value: number }[]): TrendPoint[] {
  const groups = new Map<string, number>();
  items.forEach((item) => {
    groups.set(item.label, round((groups.get(item.label) ?? 0) + item.value));
  });

  return Array.from(groups.entries()).map(([label, total]) => ({ label, total }));
}
