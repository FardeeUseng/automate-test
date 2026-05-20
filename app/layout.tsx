import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { getCurrentUser } from "@/lib/auth";

import { prompt, sarabun } from "./fonts";

export const metadata: Metadata = {
  title: "ShopQA",
  description: "QA Portfolio E-Commerce",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html
      lang="th"
      className={`
          ${prompt.variable}
          ${sarabun.variable}
        `}
    >
      <body>
        <Navbar user={user} />
        <main>{children}</main>
      </body>
    </html>
  );
}
