import { Router } from "express";
import { breakdown, monthly, score, weekly } from "../controllers/insightController.js";
import { authenticate } from "../middleware/auth.js";

export const insightRoutes = Router();

insightRoutes.use(authenticate);
insightRoutes.get("/weekly", weekly);
insightRoutes.get("/monthly", monthly);
insightRoutes.get("/breakdown", breakdown);
insightRoutes.get("/score", score);
