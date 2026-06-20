import type { ActivityEntry, Category, CategoryTotal, ChartPoint, HealthStatus } from "../types";

export const BENCHMARK_KG_CO2 = 167;

export const categoryLabels: Record<Category, string> = {
  transport: "Transportation",
  electricity: "Electricity",
  food: "Food",
  fuel: "Cooking Fuel",
};

export const categoryColors: Record<Category, string> = {
  transport: "#50C878",
  electricity: "#40E0D0",
  food: "#9FE2BF",
  fuel: "#7DF9FF",
};

export const transportFactors = [
  { label: "Scooter (<110 CC)", value: "scooter", factor: 0.0334 },
  { label: "Motorcycle (<125 CC)", value: "motorcycle125", factor: 0.029 },
  { label: "Motorcycle (150-200 CC)", value: "motorcycle200", factor: 0.0417 },
  { label: "Motorcycle (<350 CC)", value: "motorcycle350", factor: 0.054 },
  { label: "Auto Rickshaw (Petrol)", value: "autoPetrol", factor: 0.1135 },
  { label: "Auto Rickshaw (Diesel)", value: "autoDiesel", factor: 0.1322 },
  { label: "Auto Rickshaw (CNG)", value: "autoCng", factor: 0.1077 },
  { label: "Small Car <800CC (Petrol)", value: "smallCarPetrol", factor: 0.103 },
  { label: "Small Car <800CC (CNG)", value: "smallCarCng", factor: 0.063 },
  { label: "Hatchback <1000CC", value: "hatchback1000", factor: 0.117 },
  { label: "Hatchback <1400CC", value: "hatchback1400", factor: 0.13 },
  { label: "Sedan <1600CC", value: "sedan1600", factor: 0.142 },
  { label: "Sedan <2000CC Diesel", value: "sedanDiesel", factor: 0.148 },
  { label: "SUV <3000CC", value: "suv", factor: 0.197 },
  { label: "Hybrid Car", value: "hybrid", factor: 0.095 },
  { label: "Bus", value: "bus", factor: 0.0152 },
  { label: "Walking", value: "walking", factor: 0 },
  { label: "Cycling", value: "cycling", factor: 0 },
] as const;

export const stateFactors = [
  { label: "Delhi", factor: 0.73 },
  { label: "Punjab", factor: 0.73 },
  { label: "Haryana", factor: 0.73 },
  { label: "Rajasthan", factor: 0.73 },
  { label: "UP", factor: 0.73 },
  { label: "Himachal Pradesh", factor: 0.73 },
  { label: "Uttarakhand", factor: 0.73 },
  { label: "J&K", factor: 0.73 },
  { label: "Ladakh", factor: 0.73 },
  { label: "Chandigarh", factor: 0.73 },
  { label: "Maharashtra", factor: 0.89 },
  { label: "Gujarat", factor: 0.89 },
  { label: "Madhya Pradesh", factor: 0.89 },
  { label: "Goa", factor: 0.89 },
  { label: "DNHDD", factor: 0.89 },
  { label: "Tamil Nadu", factor: 0.81 },
  { label: "Kerala", factor: 0.81 },
  { label: "Karnataka", factor: 0.81 },
  { label: "Andhra Pradesh", factor: 0.81 },
  { label: "Telangana", factor: 0.81 },
  { label: "Puducherry", factor: 0.81 },
  { label: "Lakshadweep", factor: 0.81 },
  { label: "Bihar", factor: 0.93 },
  { label: "Jharkhand", factor: 0.93 },
  { label: "Odisha", factor: 0.93 },
  { label: "West Bengal", factor: 0.93 },
  { label: "Assam", factor: 0.43 },
  { label: "Tripura", factor: 0.43 },
  { label: "Meghalaya", factor: 0.43 },
  { label: "Nagaland", factor: 0.43 },
  { label: "Manipur", factor: 0.43 },
  { label: "Mizoram", factor: 0.43 },
  { label: "Arunachal Pradesh", factor: 0.43 },
  { label: "Sikkim", factor: 0.43 },
] as const;

export const foodFactors = [
  { label: "Vegetarian", value: "vegetarian", factor: 0.5 },
  { label: "Non-Vegetarian", value: "nonVegetarian", factor: 1.5 },
] as const;

export const fuelFactors = [
  { label: "LPG", value: "lpg", factor: 2.98, unit: "kg" },
  { label: "PNG", value: "png", factor: 2, unit: "m3" },
] as const;

export function calculateCarbonScore(totalCO2Monthly: number): number {
  let score = 100 - (totalCO2Monthly / BENCHMARK_KG_CO2) * 50;
  score = Math.max(0, Math.min(100, score));
  return Math.round(score);
}

export function getPlanetHealth(score: number | null): HealthStatus {
  if (score === null) return "Unknown";
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Very Good";
  if (score >= 60) return "Good";
  if (score >= 40) return "Moderate";
  if (score >= 20) return "Poor";
  return "Critical";
}

export function totalEmissions(entries: ActivityEntry[]): number {
  return round(entries.reduce((sum, entry) => sum + entry.co2Kg, 0));
}

export function currentMonthEntries(entries: ActivityEntry[]): ActivityEntry[] {
  const now = new Date();
  return entries.filter((entry) => {
    const date = new Date(entry.createdAt);
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  });
}

export function cumulativeSavedAgainstBenchmark(entries: ActivityEntry[]): number {
  const monthlyTotals = new Map<string, number>();

  entries.forEach((entry) => {
    const date = new Date(entry.createdAt);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    monthlyTotals.set(key, (monthlyTotals.get(key) ?? 0) + entry.co2Kg);
  });

  return round(
    Array.from(monthlyTotals.values()).reduce((sum, monthlyTotal) => {
      return sum + Math.max(0, BENCHMARK_KG_CO2 - monthlyTotal);
    }, 0),
  );
}

export function round(value: number): number {
  return Math.round(value * 100) / 100;
}

export function getCategoryTotals(entries: ActivityEntry[]): CategoryTotal[] {
  return (Object.keys(categoryLabels) as Category[])
    .map((category) => ({
      category,
      label: categoryLabels[category],
      value: round(
        entries
          .filter((entry) => entry.category === category)
          .reduce((sum, entry) => sum + entry.co2Kg, 0),
      ),
    }))
    .filter((item) => item.value > 0);
}

export function getTrend(entries: ActivityEntry[], unit: "week" | "month"): ChartPoint[] {
  const formatter = new Intl.DateTimeFormat("en", unit === "week" ? { weekday: "short" } : { month: "short" });
  const groups = new Map<string, number>();

  entries.forEach((entry) => {
    const label = formatter.format(new Date(entry.createdAt));
    groups.set(label, round((groups.get(label) ?? 0) + entry.co2Kg));
  });

  return Array.from(groups.entries()).map(([name, emissions]) => ({ name, emissions }));
}

export function highestCategory(entries: ActivityEntry[]): CategoryTotal | null {
  const totals = getCategoryTotals(entries);
  if (totals.length === 0) return null;
  return totals.reduce((highest, item) => (item.value > highest.value ? item : highest), totals[0]);
}

export function getComparison(total: number): string {
  if (total === 0) return "No comparison available";
  const delta = ((BENCHMARK_KG_CO2 - total) / BENCHMARK_KG_CO2) * 100;
  const label = delta >= 0 ? "Better Than Average" : "Above Average";
  return `${Math.abs(Math.round(delta))}% ${label}`;
}

export function createActivity(
  category: Category,
  label: string,
  quantity: number,
  unit: string,
  factor: number,
): ActivityEntry {
  return {
    id: crypto.randomUUID(),
    category,
    label,
    quantity,
    unit,
    co2Kg: round(quantity * factor),
    createdAt: new Date().toISOString(),
  };
}
