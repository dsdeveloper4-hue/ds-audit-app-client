import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AllProviders from "@/providers";
import { Toaster } from "@/components/ui/toaster";
import ApiConnectionCheck from "@/components/shared/ApiConnectionCheck";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Digital Seba - Audit Management",
    template: "%s | Digital Seba",
  },
  description:
    "Digital Seba Audit Management System - Track inventory audits, manage rooms, items, and monitor stock levels across your organization.",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AllProviders>
          {children}
          <Toaster />
          <ApiConnectionCheck />
        </AllProviders>
      </body>
    </html>
  );
}
