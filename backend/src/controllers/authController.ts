import { asyncHandler } from "../utils/asyncHandler.js";
import { sendMessage, sendSuccess } from "../utils/responses.js";
import { getUserId } from "../utils/requestUser.js";
import { getCurrentUser, loginUser, registerUser } from "../services/authService.js";

export const register = asyncHandler(async (request, response) => {
  const result = await registerUser(String(request.body.name), String(request.body.email), String(request.body.password));
  sendSuccess(response, result, 201);
});

export const login = asyncHandler(async (request, response) => {
  const result = await loginUser(String(request.body.email), String(request.body.password));
  sendSuccess(response, result);
});

export const me = asyncHandler(async (request, response) => {
  const user = await getCurrentUser(getUserId(request));
  sendSuccess(response, user);
});

export const logout = asyncHandler(async (_request, response) => {
  sendMessage(response, "Logged out successfully");
});
