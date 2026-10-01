import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PlanCraft — Free 2D/3D Home Design Studio",
  description: "Draw floor plans, drag-and-drop furniture, and walk through your designs in immersive 3D. Free, browser-based home design tool. No signup required.",
  keywords: ["home design", "floor plan", "3D planner", "interior design", "room planner", "PlanCraft"],
  authors: [{ name: "PlanCraft" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "PlanCraft — Free 2D/3D Home Design Studio",
    description: "Draw floor plans and walk through your designs in 3D. Free, browser-based, no signup.",
    url: "https://chat.z.ai",
    siteName: "PlanCraft",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PlanCraft — Free 2D/3D Home Design Studio",
    description: "Draw floor plans and walk through your designs in 3D. Free, browser-based, no signup.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
