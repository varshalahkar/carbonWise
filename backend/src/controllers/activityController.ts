import type { CreateActivityInput } from "../types/domain.js";
import { createActivity, deleteActivity, getActivity, getActivitySummary, listActivities } from "../services/activityService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getUserId } from "../utils/requestUser.js";
import { sendMessage, sendSuccess } from "../utils/responses.js";

export const create = asyncHandler(async (request, response) => {
  const input = request.body as CreateActivityInput;
  const activity = await createActivity(getUserId(request), input);
  sendSuccess(response, activity, 201);
});

export const list = asyncHandler(async (request, response) => {
  const activities = await listActivities(getUserId(request));
  sendSuccess(response, activities);
});

export const getById = asyncHandler(async (request, response) => {
  const activity = await getActivity(getUserId(request), String(request.params.id ?? ""));
  sendSuccess(response, activity);
});

export const remove = asyncHandler(async (request, response) => {
  await deleteActivity(getUserId(request), String(request.params.id ?? ""));
  sendMessage(response, "Activity deleted");
});

export const summary = asyncHandler(async (request, response) => {
  const result = await getActivitySummary(getUserId(request));
  sendSuccess(response, result);
});
