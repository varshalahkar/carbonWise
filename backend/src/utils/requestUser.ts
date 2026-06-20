import type { Request } from "express";
import { ApiError } from "./ApiError.js";

export function getUserId(request: Request): string {
  if (!request.user) {
    throw new ApiError(401, "Authentication required");
  }

  return request.user.id;
}
