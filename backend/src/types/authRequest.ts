import type { Request } from "express";
import type { AuthenticatedUser } from "./domain.js";

export type AuthRequest = Request & { user?: AuthenticatedUser };
