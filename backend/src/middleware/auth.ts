import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import type { AuthenticatedUser } from "../types/domain.js";

type AuthRequest = Request & { user?: AuthenticatedUser };
import { env } from "../config/env.js";
import { UserModel } from "../models/User.js";
import type { AuthTokenPayload } from "../types/domain.js";
import { ApiError } from "../utils/ApiError.js";

export const authenticate = async (request: AuthRequest, _response: Response, next: NextFunction) => {
  try {
    const header = request.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      next(new ApiError(401, "Authentication token missing"));
      return;
    }

    const token = header.slice("Bearer ".length);
    const payload = jwt.verify(token, env.jwtSecret) as AuthTokenPayload;
    const user = await UserModel.findById(payload.userId).select("name email").lean();

    if (!user) {
      next(new ApiError(401, "User no longer exists"));
      return;
    }

    request.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    };

    next();
  } catch {
    next(new ApiError(401, "Invalid or expired authentication token"));
  }
};
