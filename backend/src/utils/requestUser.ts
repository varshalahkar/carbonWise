import type { AuthRequest } from "../types/authRequest.js";
import { ApiError } from "./ApiError.js";

export function getUserId(request: AuthRequest): string {
  if (!request.user) {
    throw new ApiError(401, "Authentication required");
  }

  return request.user.id;
}
