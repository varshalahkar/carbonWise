import { validationResult } from "express-validator";
import type { RequestHandler } from "express";
import { ApiError } from "../utils/ApiError.js";

export const validateRequest: RequestHandler = (request, _response, next) => {
  const result = validationResult(request);
  if (!result.isEmpty()) {
    next(new ApiError(422, "Request validation failed", result.array()));
    return;
  }

  next();
};
