import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AppShell } from "@/components/AppShell";
import { Providers } from "@/components/Providers";

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
  title: "Learnnova — तुझा स्मार्ट अभ्यास साथी",
  description:
    "Learnnova हा विद्यार्थ्यांसाठी AI आधारित वैयक्तिक सहाय्यक आहे जो अभ्यास, झोप आणि सवयींची निगराणी करतो आणि बुद्धिमान मार्गदर्शन देतो.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
