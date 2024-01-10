import type { Metadata } from "next";
import "./globals.css";

import { Inter } from "next/font/google";

import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TOMPI MVP",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "w-[100svw] h-[100svh] flex")}>
        <main className="flex-1 flex p-5">{children}</main>
      </body>
    </html>
  );
}
