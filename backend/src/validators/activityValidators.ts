import { body, param } from "express-validator";
import {
  ACTIVITY_CATEGORIES,
  COOKING_FUEL_FACTORS,
  FOOD_FACTORS,
  STATE_REGION_FACTORS,
  TRANSPORT_FACTORS,
} from "../constants/emissionFactors.js";
import type { ActivityCategory } from "../types/domain.js";

export const createActivityValidator = [
  body("category").isIn(ACTIVITY_CATEGORIES).withMessage("Invalid category"),
  body("subtype").isString().trim().notEmpty().withMessage("Subtype is required"),
  body("inputData").isObject({ strict: true }).withMessage("inputData must be an object"),
  body("subtype").custom((subtype: string, { req }) => {
    const category = req.body.category as ActivityCategory;
    if (category === "transportation") return Boolean(TRANSPORT_FACTORS[subtype]);
    if (category === "food") return Boolean(FOOD_FACTORS[subtype]);
    if (category === "cookingFuel") return Boolean(COOKING_FUEL_FACTORS[subtype]);
    if (category === "electricity") return true;
    return false;
  }).withMessage("Invalid subtype for selected category"),
  body("inputData.distance").if(body("category").equals("transportation")).isFloat({ gt: 0 }).withMessage("Distance must be greater than zero"),
  body("inputData.monthlyConsumption").if(body("category").equals("electricity")).isFloat({ gt: 0 }).withMessage("Monthly consumption must be greater than zero"),
  body("inputData.state")
    .if(body("category").equals("electricity"))
    .isString()
    .trim()
    .custom((state: string) => Boolean(STATE_REGION_FACTORS[state]))
    .withMessage("Valid Indian state or union territory is required"),
  body("inputData.meals").if(body("category").equals("food")).isInt({ gt: 0 }).withMessage("Meal count must be greater than zero"),
  body("inputData.quantity").if(body("category").equals("cookingFuel")).isFloat({ gt: 0 }).withMessage("Fuel quantity must be greater than zero"),
];

export const activityIdValidator = [param("id").isMongoId().withMessage("Valid activity id is required")];
