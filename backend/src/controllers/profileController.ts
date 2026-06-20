import { getProfile, getProfileAchievements, updateProfile } from "../services/profileService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getUserId } from "../utils/requestUser.js";
import { sendSuccess } from "../utils/responses.js";

export const profile = asyncHandler(async (request, response) => {
  sendSuccess(response, await getProfile(getUserId(request)));
});

export const update = asyncHandler(async (request, response) => {
  sendSuccess(response, await updateProfile(getUserId(request), String(request.body.name)));
});

export const achievements = asyncHandler(async (request, response) => {
  sendSuccess(response, await getProfileAchievements(getUserId(request)));
});
