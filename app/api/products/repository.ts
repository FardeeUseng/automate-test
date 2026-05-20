import { prisma } from "@/lib/prisma";

import type { Prisma } from "@prisma/client";

export function findProducts(
  where: Prisma.ProductWhereInput,
  skip: number,
  take: number,
) {
  return prisma.product.findMany({
    where,
    skip,
    take,
    orderBy: {
      createdAt: "desc",
    },
  });
}

export function countProducts(where: Prisma.ProductWhereInput) {
  return prisma.product.count({
    where,
  });
}
