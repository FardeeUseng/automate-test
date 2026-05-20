import { Prompt, Sarabun } from "next/font/google";

export const prompt = Prompt({
  subsets: ["latin", "thai"],

  weight: ["400", "500", "600", "700"],

  variable: "--font-prompt",
});

export const sarabun = Sarabun({
  subsets: ["latin", "thai"],

  weight: ["300", "400", "500", "600"],

  variable: "--font-sarabun",
});
