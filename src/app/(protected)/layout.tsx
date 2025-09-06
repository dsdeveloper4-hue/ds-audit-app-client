import type { Metadata } from "next";

import Sidebar from "@/components/shared/Sidebar";
import Navbar from "@/components/shared/Navbar";


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
    <>
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
    </>
  );
}
