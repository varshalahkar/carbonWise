export type Category = "transport" | "electricity" | "food" | "fuel";

export type ActivityEntry = {
  id: string;
  category: Category;
  label: string;
  quantity: number;
  unit: string;
  co2Kg: number;
  createdAt: string;
};

export type HealthStatus =
  | "Excellent"
  | "Very Good"
  | "Good"
  | "Moderate"
  | "Poor"
  | "Critical"
  | "Unknown";

export type AuthMode = "login" | "signup";

export type ChartPoint = {
  name: string;
  emissions: number;
};

export type CategoryTotal = {
  category: Category;
  label: string;
  value: number;
};
