import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Invalid email"),

  password: z.string().min(8, "Password must be at least 8 characters"),

  action: z.literal("login"),
});

export const RegisterSchema = z.object({
  email: z.string().email("Invalid email"),

  name: z.string().min(2, "Name must be at least 2 characters"),

  password: z.string().min(8, "Password must be at least 8 characters"),

  action: z.literal("register"),
});

export const AuthSchema = z.discriminatedUnion("action", [
  LoginSchema,
  RegisterSchema,
]);

export type AuthInput = z.infer<typeof AuthSchema>;
