import { getCoachRecommendation } from "../services/coachService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getUserId } from "../utils/requestUser.js";
import { sendSuccess } from "../utils/responses.js";

export const recommendations = asyncHandler(async (request, response) => {
  sendSuccess(response, await getCoachRecommendation(getUserId(request)));
});
