// app/api/products/[id]/route.ts — GET /api/products/:id
import { prisma } from "@/lib/prisma";
import { apiRoute, ok } from "@/lib/api";
import { ApiError } from "@/lib/auth";

export const GET = apiRoute(async (_req, ctx) => {
  const { id: idStr } = await (ctx as { params: Promise<{ id: string }> })
    .params;
  const id = parseInt(idStr);
  if (isNaN(id)) {
    throw new ApiError("Invalid product id", 400);
  }

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    throw new ApiError("Product not found", 404);
  }

  return ok(product);
});
