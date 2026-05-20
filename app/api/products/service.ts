import type { Prisma } from "@prisma/client";

import { countProducts, findProducts } from "./repository";

import { ProductsQuerySchema } from "./schema";

function buildProductsWhere(data: {
  category?: string;
  search?: string;
}): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {};

  if (data.category) {
    where.category = data.category;
  }

  if (data.search) {
    where.OR = [
      {
        name: {
          contains: data.search,

          mode: "insensitive",
        },
      },
      {
        description: {
          contains: data.search,

          mode: "insensitive",
        },
      },
    ];
  }

  return where;
}

export async function getProducts(input: unknown) {
  const data = ProductsQuerySchema.parse(input);

  const skip = (data.page - 1) * data.limit;

  const where = buildProductsWhere(data);

  const [products, total] = await Promise.all([
    findProducts(where, skip, data.limit),

    countProducts(where),
  ]);

  return {
    products,
    total,

    page: data.page,

    totalPages: Math.ceil(total / data.limit),
  };
}
