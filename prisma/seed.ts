// prisma/seed.ts — run with: npm run db:seed
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Seed user
  const password = await bcrypt.hash("Test@1234", 12);
  await prisma.user.upsert({
    where: { email: "qa@example.com" },
    update: {},
    create: { email: "qa@example.com", name: "QA Tester", password },
  });

  // Seed products
  const products = [
    {
      name: "iPhone 15 Pro",
      description: "Apple iPhone 15 Pro 256GB Titanium",
      price: 42900,
      image: "/images/iphone15.jpg",
      stock: 10,
      category: "electronics",
    },
    {
      name: "AirPods Pro",
      description: "Apple AirPods Pro 2nd Gen with USB-C",
      price: 8990,
      image: "/images/airpods.jpg",
      stock: 0,
      category: "electronics",
    },
    {
      name: "MacBook Air M3",
      description: 'Apple MacBook Air 13" M3 8GB 256GB',
      price: 42900,
      image: "/images/macbook.jpg",
      stock: 5,
      category: "electronics",
    },
    {
      name: "Nike Air Max 270",
      description: "รองเท้าวิ่ง Nike Air Max 270",
      price: 4290,
      image: "/images/nike.jpg",
      stock: 20,
      category: "sports",
    },
    {
      name: "กระเป๋า Tote Canvas",
      description: "กระเป๋าผ้าแคนวาสทรง Tote พิมพ์ลาย",
      price: 590,
      image: "/images/tote.jpg",
      stock: 15,
      category: "fashion",
    },
    {
      name: "หูฟัง Sony WH-1000XM5",
      description: "หูฟัง Over-ear Noise Cancelling",
      price: 12900,
      image: "/images/sony.jpg",
      stock: 8,
      category: "electronics",
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { id: products.indexOf(p) + 1 },
      update: p,
      create: p,
    });
  }

  console.log("✅ Seed completed");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
