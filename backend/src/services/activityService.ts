import { Types } from "mongoose";
import { ActivityModel } from "../models/Activity.js";
import type { ActivityDocument, CreateActivityInput } from "../types/domain.js";
import { ApiError } from "../utils/ApiError.js";
import { calculateEmission } from "./emissionService.js";
import { evaluateAchievements } from "./achievementService.js";

export async function createActivity(userId: string, input: CreateActivityInput): Promise<ActivityDocument> {
  const calculated = calculateEmission(input);
  const activity = await ActivityModel.create({
    userId: new Types.ObjectId(userId),
    ...calculated,
  });

  await evaluateAchievements(userId);
  return activity;
}

export async function listActivities(userId: string): Promise<ActivityDocument[]> {
  return ActivityModel.find({ userId: new Types.ObjectId(userId) }).sort({ createdAt: -1 });
}

export async function getActivity(userId: string, activityId: string): Promise<ActivityDocument> {
  const activity = await ActivityModel.findOne({ _id: activityId, userId: new Types.ObjectId(userId) });
  if (!activity) throw new ApiError(404, "Activity not found");
  return activity;
}

export async function deleteActivity(userId: string, activityId: string): Promise<void> {
  const result = await ActivityModel.deleteOne({ _id: activityId, userId: new Types.ObjectId(userId) });
  if (result.deletedCount === 0) throw new ApiError(404, "Activity not found");
}

export async function getActivitySummary(userId: string): Promise<{ totalEmission: number; activityCount: number }> {
  const result = await ActivityModel.aggregate<{ totalEmission: number; activityCount: number }>([
    { $match: { userId: new Types.ObjectId(userId) } },
    {
      $group: {
        _id: "$userId",
        totalEmission: { $sum: "$co2Emission" },
        activityCount: { $sum: 1 },
      },
    },
  ]);

  return result[0] ?? { totalEmission: 0, activityCount: 0 };
}
