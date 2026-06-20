import type { NextFunction, Request, Response } from "express";

type AsyncRouteHandler = (request: Request, response: Response, next: NextFunction) => Promise<void>;

export function asyncHandler(handler: AsyncRouteHandler): AsyncRouteHandler {
  return async (request, response, next) => {
    try {
      await handler(request, response, next);
    } catch (error) {
      next(error);
    }
  };
}
