import { body } from "express-validator";

export const registerValidator = [
  body("name").isString().trim().isLength({ min: 2, max: 80 }).withMessage("Name must be between 2 and 80 characters"),
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("password")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage("Password must be at least 8 characters and include uppercase, lowercase, number, and symbol"),
];

export const loginValidator = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("password").isString().notEmpty().withMessage("Password is required"),
];
