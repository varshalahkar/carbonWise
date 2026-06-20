import { Router } from "express";
import { activityRoutes } from "./activityRoutes.js";
import { authRoutes } from "./authRoutes.js";
import { coachRoutes } from "./coachRoutes.js";
import { dashboardRoutes } from "./dashboardRoutes.js";
import { insightRoutes } from "./insightRoutes.js";
import { profileRoutes } from "./profileRoutes.js";

export const apiRoutes = Router();

apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/activities", activityRoutes);
apiRoutes.use("/dashboard", dashboardRoutes);
apiRoutes.use("/insights", insightRoutes);
apiRoutes.use("/coach", coachRoutes);
apiRoutes.use("/profile", profileRoutes);
