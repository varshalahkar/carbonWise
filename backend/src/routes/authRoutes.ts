import { Router } from "express";
import { login, logout, me, register } from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { loginValidator, registerValidator } from "../validators/authValidators.js";

export const authRoutes = Router();

authRoutes.post("/register", registerValidator, validateRequest, register);
authRoutes.post("/login", loginValidator, validateRequest, login);
authRoutes.get("/me", authenticate, me);
authRoutes.post("/logout", authenticate, logout);
