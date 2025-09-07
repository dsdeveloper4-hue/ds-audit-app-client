import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


export const metadata: Metadata = {
  title: "Login",
  description:
    "Login to Digital Seba to access your personalized dashboard and manage your digital services securely.",
};

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
   const cookieStore = await cookies();
   const token = cookieStore.get("refreshToken")?.value;

  // ✅ If token exists, redirect to dashboard (or home)
  if (token) {
    redirect("/");
  }

  return children
}
