import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";
import { UserModel } from "../models/User.js";
import type { AuthenticatedUser, UserDocument } from "../types/domain.js";
import { ApiError } from "../utils/ApiError.js";

type AuthResult = {
  user: AuthenticatedUser;
  token: string;
};

export async function registerUser(name: string, email: string, password: string): Promise<AuthResult> {
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await UserModel.findOne({ email: normalizedEmail }).lean();
  if (existingUser) throw new ApiError(409, "Email is already registered");

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await UserModel.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
  });

  return buildAuthResult(user);
}

export async function loginUser(email: string, password: string): Promise<AuthResult> {
  const user = await UserModel.findOne({ email: email.trim().toLowerCase() }).select("+password");
  if (!user) throw new ApiError(401, "Invalid email or password");

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) throw new ApiError(401, "Invalid email or password");

  return buildAuthResult(user);
}

export async function getCurrentUser(userId: string): Promise<AuthenticatedUser> {
  const user = await UserModel.findById(userId).select("name email").lean();
  if (!user) throw new ApiError(404, "User not found");

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  };
}

function buildAuthResult(user: UserDocument): AuthResult {
  const safeUser = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  };

  return {
    user: safeUser,
    token: jwt.sign({ userId: safeUser.id }, env.jwtSecret, { expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"] }),
  };
}
