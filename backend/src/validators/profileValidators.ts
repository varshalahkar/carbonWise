import { body } from "express-validator";

export const updateProfileValidator = [
  body("name").isString().trim().isLength({ min: 2, max: 80 }).withMessage("Name must be between 2 and 80 characters"),
];
