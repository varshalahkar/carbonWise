import type { ActivityCategory } from "../types/domain.js";

export const BENCHMARK_KG_CO2 = 167;

export const ACTIVITY_CATEGORIES: ActivityCategory[] = ["transportation", "electricity", "food", "cookingFuel"];

export const TRANSPORT_FACTORS: Record<string, { label: string; factor: number }> = {
  scooter: { label: "Scooter (<110 CC)", factor: 0.0334 },
  motorcycle125: { label: "Motorcycle (<125 CC)", factor: 0.029 },
  motorcycle200: { label: "Motorcycle (150-200 CC)", factor: 0.0417 },
  motorcycle350: { label: "Motorcycle (<350 CC)", factor: 0.054 },
  autoPetrol: { label: "Auto-rickshaw (Petrol)", factor: 0.1135 },
  autoDiesel: { label: "Auto-rickshaw (Diesel)", factor: 0.1322 },
  autoCng: { label: "Auto-rickshaw (CNG)", factor: 0.1077 },
  smallCarPetrol: { label: "Small Car <800CC (Petrol)", factor: 0.103 },
  smallCarCng: { label: "Small Car <800CC (CNG)", factor: 0.063 },
  hatchback1000: { label: "Hatchback <1000CC", factor: 0.117 },
  hatchback1400: { label: "Hatchback <1400CC", factor: 0.13 },
  sedan1600: { label: "Sedan <1600CC", factor: 0.142 },
  sedanDiesel: { label: "Sedan <2000CC Diesel", factor: 0.148 },
  suv: { label: "SUV <3000CC", factor: 0.197 },
  hybrid: { label: "Hybrid Car", factor: 0.095 },
  bus: { label: "Bus", factor: 0.0152 },
  walking: { label: "Walking", factor: 0 },
  cycling: { label: "Cycling", factor: 0 },
};

export const FOOD_FACTORS: Record<string, { label: string; factor: number }> = {
  vegetarian: { label: "Vegetarian", factor: 0.5 },
  nonVegetarian: { label: "Non-Vegetarian", factor: 1.5 },
};

export const COOKING_FUEL_FACTORS: Record<string, { label: string; factor: number; unit: string }> = {
  lpg: { label: "LPG", factor: 2.98, unit: "kg" },
  png: { label: "PNG", factor: 2, unit: "m3" },
};

export const ELECTRICITY_DEFAULT_FACTOR = 0.71;

export const STATE_REGION_FACTORS: Record<string, number> = {
  Delhi: 0.73,
  Punjab: 0.73,
  Haryana: 0.73,
  Rajasthan: 0.73,
  "Uttar Pradesh": 0.73,
  UP: 0.73,
  "Himachal Pradesh": 0.73,
  Uttarakhand: 0.73,
  "Jammu & Kashmir": 0.73,
  "J&K": 0.73,
  Ladakh: 0.73,
  Chandigarh: 0.73,
  Maharashtra: 0.89,
  Gujarat: 0.89,
  "Madhya Pradesh": 0.89,
  Goa: 0.89,
  "Dadra & Nagar Haveli and Daman & Diu": 0.89,
  DNHDD: 0.89,
  "Tamil Nadu": 0.81,
  Kerala: 0.81,
  Karnataka: 0.81,
  "Andhra Pradesh": 0.81,
  Telangana: 0.81,
  Puducherry: 0.81,
  Lakshadweep: 0.81,
  Bihar: 0.93,
  Jharkhand: 0.93,
  Odisha: 0.93,
  "West Bengal": 0.93,
  Assam: 0.43,
  Tripura: 0.43,
  Meghalaya: 0.43,
  Nagaland: 0.43,
  Manipur: 0.43,
  Mizoram: 0.43,
  "Arunachal Pradesh": 0.43,
  Sikkim: 0.43,
};
