import {
  COOKING_FUEL_FACTORS,
  ELECTRICITY_DEFAULT_FACTOR,
  FOOD_FACTORS,
  STATE_REGION_FACTORS,
  TRANSPORT_FACTORS,
} from "../constants/emissionFactors.js";
import type { ActivityCategory, CreateActivityInput, InputData } from "../types/domain.js";
import { ApiError } from "../utils/ApiError.js";
import { round } from "./scoreService.js";

type CalculationResult = {
  category: ActivityCategory;
  subtype: string;
  inputData: InputData;
  emissionFactor: number;
  co2Emission: number;
};

export function calculateEmission(input: CreateActivityInput): CalculationResult {
  if (input.category === "transportation") return calculateTransportation(input);
  if (input.category === "electricity") return calculateElectricity(input);
  if (input.category === "food") return calculateFood(input);
  if (input.category === "cookingFuel") return calculateCookingFuel(input);
  throw new ApiError(400, "Invalid activity category");
}

function calculateTransportation(input: CreateActivityInput): CalculationResult {
  const factor = TRANSPORT_FACTORS[input.subtype];
  if (!factor) throw new ApiError(400, "Invalid transportation subtype");

  const distance = readPositiveNumber(input.inputData, "distance", true);
  return {
    category: "transportation",
    subtype: input.subtype,
    inputData: { distance },
    emissionFactor: factor.factor,
    co2Emission: round(distance * factor.factor),
  };
}

function calculateElectricity(input: CreateActivityInput): CalculationResult {
  const state = readString(input.inputData, "state");
  const monthlyConsumption = readPositiveNumber(input.inputData, "monthlyConsumption", true);
  const emissionFactor = STATE_REGION_FACTORS[state] ?? ELECTRICITY_DEFAULT_FACTOR;

  return {
    category: "electricity",
    subtype: state,
    inputData: { state, monthlyConsumption },
    emissionFactor,
    co2Emission: round(monthlyConsumption * emissionFactor),
  };
}

function calculateFood(input: CreateActivityInput): CalculationResult {
  const factor = FOOD_FACTORS[input.subtype];
  if (!factor) throw new ApiError(400, "Invalid food subtype");

  const meals = readPositiveNumber(input.inputData, "meals", true);
  return {
    category: "food",
    subtype: input.subtype,
    inputData: { meals },
    emissionFactor: factor.factor,
    co2Emission: round(meals * factor.factor),
  };
}

function calculateCookingFuel(input: CreateActivityInput): CalculationResult {
  const factor = COOKING_FUEL_FACTORS[input.subtype];
  if (!factor) throw new ApiError(400, "Invalid cooking fuel subtype");

  const quantity = readPositiveNumber(input.inputData, "quantity", true);
  return {
    category: "cookingFuel",
    subtype: input.subtype,
    inputData: { quantity, unit: factor.unit },
    emissionFactor: factor.factor,
    co2Emission: round(quantity * factor.factor),
  };
}

function readPositiveNumber(inputData: InputData, key: string, requireAboveZero: boolean): number {
  const value = inputData[key];
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new ApiError(400, `${key} must be a number`);
  }
  if (value < 0 || (requireAboveZero && value === 0)) {
    throw new ApiError(400, `${key} must be greater than zero`);
  }
  return value;
}

function readString(inputData: InputData, key: string): string {
  const value = inputData[key];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ApiError(400, `${key} must be a non-empty string`);
  }
  return value.trim();
}
