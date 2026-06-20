import { Router } from "express";
import { achievements, profile, update } from "../controllers/profileController.js";
import { authenticate } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { updateProfileValidator } from "../validators/profileValidators.js";

export const profileRoutes = Router();

profileRoutes.use(authenticate);
profileRoutes.get("/", profile);
profileRoutes.put("/", updateProfileValidator, validateRequest, update);
profileRoutes.get("/achievements", achievements);
