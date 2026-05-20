import { z } from "zod";

export const ProductsQuerySchema = z.object({
  category: z.string().optional(),

  search: z.string().optional(),

  page: z.coerce.number().min(1).default(1),

  limit: z.coerce.number().min(1).max(50).default(12),
});

export type ProductsQuery = z.infer<typeof ProductsQuerySchema>;
