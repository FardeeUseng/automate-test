import { prisma } from "@/lib/prisma";

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },

    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      password: true,
    },
  });
}

export function createUser(data: {
  email: string;
  name: string;
  password: string;
}) {
  return prisma.user.create({
    data,

    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });
}
