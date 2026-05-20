import {
  ApiError,
  hashPassword,
  setAuthCookie,
  signToken,
  verifyPassword,
} from "@/lib/auth";

import { AuthSchema } from "./schema";

import { createUser, findUserByEmail } from "./repository";

export async function auth(input: unknown) {
  const data = AuthSchema.parse(input);

  const email = data.email.toLowerCase().trim();

  if (data.action === "login") {
    const user = await findUserByEmail(email);

    if (!user) {
      throw new ApiError("Invalid credentials", 401);
    }

    const valid = await verifyPassword(data.password, user.password);

    if (!valid) {
      throw new ApiError("Invalid credentials", 401);
    }

    const token = await signToken({
      userId: user.id,
    });

    await setAuthCookie(token);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  const existing = await findUserByEmail(email);

  if (existing) {
    throw new ApiError("Email already registered", 409);
  }

  const hashed = await hashPassword(data.password);

  const user = await createUser({
    email,
    name: data.name,
    password: hashed,
  });

  const token = await signToken({
    userId: user.id,
  });

  await setAuthCookie(token);

  return {
    user,
    status: 201,
  };
}
