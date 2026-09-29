import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ReviewMind - Code reviews that learn your team's standards",
  description: "ReviewMind uses AI + Hindsight to remember your team's coding conventions and apply them to future reviews.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen bg-[#F7F3EA] text-[#171717]">{children}</body>
    </html>
  );
}
