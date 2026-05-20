// app/api/cart/route.ts — GET (fetch cart) + POST (add item)
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth, ApiError } from "@/lib/auth";
import { apiRoute, ok } from "@/lib/api";

const cartSelect = {
  id: true,
  items: {
    include: { product: true },
    orderBy: { id: "asc" as const },
  },
};

async function getOrCreateCart(userId: string) {
  return prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
    select: cartSelect,
  });
}

// GET /api/cart
export const GET = apiRoute(async () => {
  const user = await requireAuth();
  const cart = await getOrCreateCart(user.id);
  return ok(cart);
});

// POST /api/cart — add item
const AddItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().min(1).max(99),
});

export const POST = apiRoute(async (req) => {
  const user = await requireAuth();
  const body = AddItemSchema.parse(await req.json());

  const product = await prisma.product.findUnique({
    where: { id: body.productId },
  });
  if (!product) throw new ApiError("Product not found", 404);
  if (product.stock < body.quantity)
    throw new ApiError("Insufficient stock", 400);

  const cart = await getOrCreateCart(user.id);

  const existing = cart.items.find((i) => i.productId === body.productId);
  const newQty = (existing?.quantity ?? 0) + body.quantity;

  if (newQty > product.stock)
    throw new ApiError("Exceeds available stock", 400);

  await prisma.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId: body.productId } },
    update: { quantity: newQty },
    create: {
      cartId: cart.id,
      productId: body.productId,
      quantity: body.quantity,
    },
  });

  const updated = await prisma.cart.findUnique({
    where: { id: cart.id },
    select: cartSelect,
  });
  return ok(updated, 201);
});
