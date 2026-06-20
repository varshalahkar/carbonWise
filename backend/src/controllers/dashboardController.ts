import { getDashboard } from "../services/dashboardService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getUserId } from "../utils/requestUser.js";
import { sendSuccess } from "../utils/responses.js";

export const dashboard = asyncHandler(async (request, response) => {
  const result = await getDashboard(getUserId(request));
  sendSuccess(response, result);
});
