import { Types } from "mongoose";
import { BENCHMARK_KG_CO2 } from "../constants/emissionFactors.js";
import { ActivityModel } from "../models/Activity.js";
import type { DashboardSummary } from "../types/domain.js";
import { startOfCurrentMonth } from "../utils/dates.js";
import { calculateCarbonScore, getComparisonPercentage, getPlanetHealth, round } from "./scoreService.js";

export async function getDashboard(userId: string): Promise<DashboardSummary> {
  const totalMonthlyEmission = await getMonthlyTotal(userId);
  const carbonScore = totalMonthlyEmission > 0 ? calculateCarbonScore(totalMonthlyEmission) : null;
  const planetHealth = getPlanetHealth(carbonScore);

  return {
    carbonScore,
    planetHealth,
    totalMonthlyEmission,
    benchmark: BENCHMARK_KG_CO2,
    comparisonPercentage: getComparisonPercentage(totalMonthlyEmission),
    earthState: planetHealth,
  };
}

async function getMonthlyTotal(userId: string): Promise<number> {
  const result = await ActivityModel.aggregate<{ total: number }>([
    {
      $match: {
        userId: new Types.ObjectId(userId),
        createdAt: { $gte: startOfCurrentMonth() },
      },
    },
    { $group: { _id: null, total: { $sum: "$co2Emission" } } },
  ]);

  return round(result[0]?.total ?? 0);
}
