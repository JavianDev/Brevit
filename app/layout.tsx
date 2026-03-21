import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Brevit — LLM Token Optimization",
    template: "%s | Brevit",
  },
  description:
    "Brevit is a multi-language library (JS, Python, .NET) that compresses structured data before sending it to LLMs — reducing token costs by 40–60% without losing meaning.",
  keywords: ["LLM", "token optimization", "AI", "prompt engineering", "brevit", "JSON compression", "NLP"],
  authors: [{ name: "JavianDev" }],
  creator: "JavianDev",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://brevit.dev",
    title: "Brevit — LLM Token Optimization",
    description: "Cut LLM costs by 60%. Without losing meaning.",
    siteName: "Brevit",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brevit — LLM Token Optimization",
    description: "Cut LLM costs by 60%. Without losing meaning.",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
        style={{ background: "var(--bg)", color: "var(--text-primary)" }}
      >
        {children}
      </body>
    </html>
  );
}
