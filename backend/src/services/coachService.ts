import { Types } from "mongoose";
import { ActivityModel } from "../models/Activity.js";
import type { ActivityCategory } from "../types/domain.js";
import { ApiError } from "../utils/ApiError.js";
import { round } from "./scoreService.js";

type Recommendation = {
  recommendation: string;
  reason: string;
  estimatedSaving: number;
};

const recommendations: Record<ActivityCategory, Omit<Recommendation, "estimatedSaving">> = {
  transportation: {
    recommendation: "Use public transport, walking, cycling, or grouped trips for recurring travel.",
    reason: "Transportation is your highest recorded emission source.",
  },
  electricity: {
    recommendation: "Reduce electricity usage by targeting high-consumption appliances and idle loads.",
    reason: "Electricity is your highest recorded emission source.",
  },
  food: {
    recommendation: "Reduce non-vegetarian meals where practical and track the change over time.",
    reason: "Food is your highest recorded emission source.",
  },
  cookingFuel: {
    recommendation: "Improve cooking efficiency with batch cooking, covered pots, and efficient burners.",
    reason: "Cooking fuel is your highest recorded emission source.",
  },
};

export async function getCoachRecommendation(userId: string): Promise<Recommendation> {
  const result = await ActivityModel.aggregate<{ _id: ActivityCategory; total: number }>([
    { $match: { userId: new Types.ObjectId(userId) } },
    { $group: { _id: "$category", total: { $sum: "$co2Emission" } } },
    { $sort: { total: -1 } },
    { $limit: 1 },
  ]);

  const top = result[0];
  if (!top) throw new ApiError(404, "No recommendations available yet. Add activities to unlock personalized sustainability insights.");

  return {
    ...recommendations[top._id],
    estimatedSaving: round(top.total * 0.1),
  };
}
