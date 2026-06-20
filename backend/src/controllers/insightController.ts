import { getCategoryBreakdown, getMonthlyEmissions, getScoreInsight, getWeeklyEmissions } from "../services/insightService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getUserId } from "../utils/requestUser.js";
import { sendSuccess } from "../utils/responses.js";

export const weekly = asyncHandler(async (request, response) => {
  sendSuccess(response, await getWeeklyEmissions(getUserId(request)));
});

export const monthly = asyncHandler(async (request, response) => {
  sendSuccess(response, await getMonthlyEmissions(getUserId(request)));
});

export const breakdown = asyncHandler(async (request, response) => {
  sendSuccess(response, await getCategoryBreakdown(getUserId(request)));
});

export const score = asyncHandler(async (request, response) => {
  sendSuccess(response, await getScoreInsight(getUserId(request)));
});
