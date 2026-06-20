import { Router } from "express";
import { recommendations } from "../controllers/coachController.js";
import { authenticate } from "../middleware/auth.js";

export const coachRoutes = Router();

coachRoutes.get("/recommendations", authenticate, recommendations);
