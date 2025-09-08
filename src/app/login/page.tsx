import LoginPage from "@/components/login/Login";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "Login",
  description:
    "Login to Digital Seba to access your personalized dashboard and manage your digital services securely.",
};
const page = () => {
  return <LoginPage />;
};

export default page;
