import { BENCHMARK_KG_CO2 } from "../constants/emissionFactors.js";
import type { PlanetHealth } from "../types/domain.js";

export function round(value: number): number {
  return Math.round(value * 100) / 100;
}

export function calculateCarbonScore(totalCO2Monthly: number): number {
  let score = 100 - (totalCO2Monthly / BENCHMARK_KG_CO2) * 50;
  score = Math.max(0, Math.min(100, score));
  return Math.round(score);
}

export function getPlanetHealth(score: number | null): PlanetHealth {
  if (score === null) return "unknown";
  if (score >= 90) return "excellent";
  if (score >= 75) return "very_good";
  if (score >= 60) return "good";
  if (score >= 40) return "moderate";
  if (score >= 20) return "poor";
  return "critical";
}

export function getComparisonPercentage(totalMonthlyEmission: number): string | null {
  if (totalMonthlyEmission <= 0) return null;
  const percentage = Math.round(((BENCHMARK_KG_CO2 - totalMonthlyEmission) / BENCHMARK_KG_CO2) * 100);
  const label = percentage >= 0 ? "Better Than Average" : "Above Average";
  return `${Math.abs(percentage)}% ${label}`;
}
