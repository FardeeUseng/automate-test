import { NextResponse } from "next/server";

import { ZodError } from "zod";

import { ApiError, AuthError } from "./auth";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json(
    {
      data,
      error: null,
    },
    { status },
  );
}

export function err(message: string, status = 400) {
  return NextResponse.json(
    {
      data: null,
      error: message,
    },
    { status },
  );
}

type RouteHandler = (req: Request, ctx?: unknown) => Promise<NextResponse>;

export function apiRoute(handler: RouteHandler) {
  return async (req: Request, ctx?: unknown) => {
    try {
      return await handler(req, ctx);
    } catch (error) {
      console.error(error);

      if (error instanceof AuthError) {
        return err(error.message, error.status);
      }

      if (error instanceof ApiError) {
        return err(error.message, error.status);
      }

      if (error instanceof ZodError) {
        return err(error.issues.map((x) => x.message).join(", "), 422);
      }

      return err("Internal server error", 500);
    }
  };
}
