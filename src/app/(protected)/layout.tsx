import Sidebar from "@/components/shared/Sidebar";
import Navbar from "@/components/shared/Navbar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ Read cookies on the server
  const cookieStore = await cookies()
  const token =  cookieStore.get("refreshToken")?.value;
  // ✅ Redirect if no token
  if (!token) {
    redirect("/login");
  }

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
