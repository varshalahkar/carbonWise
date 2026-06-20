import mongoose from "mongoose";
import type { ErrorRequestHandler, RequestHandler } from "express";
import { ApiError } from "../utils/ApiError.js";

export const notFoundHandler: RequestHandler = (request, _response, next) => {
  next(new ApiError(404, `Route not found: ${request.method} ${request.originalUrl}`));
};

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof ApiError) {
    response.status(error.statusCode).json({
      success: false,
      message: error.message,
      details: error.details,
    });
    return;
  }

  if (error instanceof mongoose.Error.ValidationError) {
    response.status(400).json({
      success: false,
      message: "Validation failed",
      details: error.errors,
    });
    return;
  }

  if (error instanceof mongoose.Error.CastError) {
    response.status(400).json({
      success: false,
      message: "Invalid identifier",
    });
    return;
  }

  response.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
