import { Router } from "express";
import { create, getById, list, remove, summary } from "../controllers/activityController.js";
import { authenticate } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { activityIdValidator, createActivityValidator } from "../validators/activityValidators.js";

export const activityRoutes = Router();

activityRoutes.use(authenticate);
activityRoutes.post("/", createActivityValidator, validateRequest, create);
activityRoutes.get("/", list);
activityRoutes.get("/summary", summary);
activityRoutes.get("/:id", activityIdValidator, validateRequest, getById);
activityRoutes.delete("/:id", activityIdValidator, validateRequest, remove);
