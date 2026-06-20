import { UserModel } from "../models/User.js";
import type { AuthenticatedUser } from "../types/domain.js";
import { ApiError } from "../utils/ApiError.js";
import { listAchievements } from "./achievementService.js";

export async function getProfile(userId: string): Promise<AuthenticatedUser> {
  const user = await UserModel.findById(userId).select("name email").lean();
  if (!user) throw new ApiError(404, "User not found");

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  };
}

export async function updateProfile(userId: string, name: string): Promise<AuthenticatedUser> {
  const user = await UserModel.findByIdAndUpdate(userId, { name: name.trim() }, { new: true, runValidators: true })
    .select("name email")
    .lean();
  if (!user) throw new ApiError(404, "User not found");

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  };
}

export async function getProfileAchievements(userId: string) {
  return listAchievements(userId);
}
