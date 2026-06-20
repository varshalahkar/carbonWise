import type { Document, Types } from "mongoose";

export type ActivityCategory = "transportation" | "electricity" | "food" | "cookingFuel";

export type PlanetHealth = "excellent" | "very_good" | "good" | "moderate" | "poor" | "critical" | "unknown";

export type AchievementKey =
  | "first_activity"
  | "seven_day_streak"
  | "twenty_five_activities"
  | "fifty_activities"
  | "hundred_kg_saved"
  | "five_hundred_kg_saved";

export type InputData = Record<string, string | number>;

export type AuthTokenPayload = {
  userId: string;
};

export type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
};

export type UserDocument = Document<Types.ObjectId> & {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ActivityDocument = Document<Types.ObjectId> & {
  userId: Types.ObjectId;
  category: ActivityCategory;
  subtype: string;
  inputData: InputData;
  emissionFactor: number;
  co2Emission: number;
  createdAt: Date;
  updatedAt: Date;
};

export type AchievementDocument = Document<Types.ObjectId> & {
  userId: Types.ObjectId;
  achievementKey: AchievementKey;
  unlockedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateActivityInput = {
  category: ActivityCategory;
  subtype: string;
  inputData: InputData;
};

export type DashboardSummary = {
  carbonScore: number | null;
  planetHealth: PlanetHealth;
  totalMonthlyEmission: number;
  benchmark: number;
  comparisonPercentage: string | null;
  earthState: PlanetHealth;
};

export type CategoryTotal = {
  category: ActivityCategory;
  total: number;
  percentage: number;
};

export type TrendPoint = {
  label: string;
  total: number;
};
