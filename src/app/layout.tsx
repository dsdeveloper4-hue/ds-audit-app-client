import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/shared/Sidebar";
import Navbar from "@/components/shared/Navbar";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DIGITAL SEBA",
  description: "This is product dashboard.",
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
        {/* Top Navbar */}
        <Navbar />

        <div className="flex">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <main className="flex-1 min-h-screen bg-gray-50 dark:bg-gray-950 p-6 pt-20 lg:ml-64">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
