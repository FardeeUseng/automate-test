import { apiRoute, ok } from "@/lib/api";

import { auth } from "./service";

export const POST = apiRoute(async (req) => {
  const body = await req.json();

  const result = await auth(body);

  return ok(
    {
      user: result.user,
    },

    result.status ?? 200,
  );
});
