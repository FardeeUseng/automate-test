import { apiRoute, ok } from "@/lib/api";

import { getProducts } from "./service";

export const GET = apiRoute(async (req) => {
  const { searchParams } = new URL(req.url);

  const result = await getProducts({
    category: searchParams.get("category") ?? undefined,

    search: searchParams.get("search") ?? undefined,

    page: searchParams.get("page") ?? undefined,

    limit: searchParams.get("limit") ?? undefined,
  });

  return ok(result);
});
