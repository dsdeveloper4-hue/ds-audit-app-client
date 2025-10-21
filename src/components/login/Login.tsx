"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import FormWrapper from "@/components/forms/FormWrapper";
import FormInput from "@/components/forms/FormInput";
import { loginSchema, LoginFormData } from "@/schemas/loginSchema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { useAppDispatch } from "@/redux/hook";
import { setUser } from "@/redux/features/auth/authSlice";
import { verifyToken } from "@/utils/verifyToken";
import Image from "next/image";


export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();

  const handleLogin = async (data: LoginFormData) => {
    setError(null);
    try {
      const res = await login(data).unwrap();
      dispatch(
        setUser({
          user: verifyToken(res.data.accessToken),
          token: res.data.accessToken,
        })
      );
      router.push("/"); // redirect after login
    } catch (err: any) {
      setError(err?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 px-4 relative">
      {/* Optional subtle background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 opacity-30 blur-3xl -z-10"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        whileHover={{ scale: 1.02 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl rounded-3xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className=" text-center px-6 relative">
            <Image
              src="/logo.png"
              width={100}
              height={100}
              alt="Logo"
              className="mx-auto mb-5"
            />
            <h2 className="text-2xl font-semibold tracking-tight">
              Audit Management System
            </h2>
            <p className="mt-1 text-sm opacity-80">Please login to continue</p>
          </div>

          {/* Form */}
          <CardContent className="p-8 bg-white dark:bg-gray-900">
            <FormWrapper
              schema={loginSchema}
              onSubmit={handleLogin}
              className="space-y-4"
            >
              {(control, handleSubmit) => (
                <>
                  <FormInput
                    name="mobile"
                    label="Mobile Number"
                    placeholder="Enter 11-digit mobile number"
                    type="tel"
                    control={control}
                  />
                  <FormInput
                    name="password"
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    control={control}
                  />

                  {error && (
                    <p className="text-red-600 text-sm font-medium mt-1">
                      {error}
                    </p>
                  )}

                  <Button
                    type="submit"
                    onClick={(e) => handleSubmit(e as any)}
                    className="w-full py-3 text-lg mt-4"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </>
              )}
            </FormWrapper>

            {/* Footer */}
            <p className="mt-6 text-center text-gray-400 dark:text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Digital Seba. All rights
              reserved.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
