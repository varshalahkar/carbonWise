import type { Response } from "express";

export function sendSuccess<T>(response: Response, data: T, statusCode = 200): void {
  response.status(statusCode).json({
    success: true,
    data,
  });
}

export function sendMessage(response: Response, message: string, statusCode = 200): void {
  response.status(statusCode).json({
    success: true,
    data: { message },
  });
}
