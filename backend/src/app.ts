import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { apiRoutes } from "./routes/index.js";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_request, response) => {
  response.json({
    success: true,
    data: {
      service: "CarbonWise API",
      status: "ok",
    },
  });
});

app.use("/api", apiRoutes);
app.use(notFoundHandler);
app.use(errorHandler);
