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


const defaultValues = {
   mobile:"01617134236",
    password:"sajukhan"
}
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
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden py-0">
          {/* Header */}
          <div className="bg-indigo-600 dark:bg-indigo-500 text-white text-center py-8 px-6">
            <h1 className="text-3xl font-bold">Digital Seba</h1>
            <p className="mt-2 text-sm opacity-90">
              Audit Management System
            </p>
            <p className="mt-1 text-xs opacity-75">
              Please login to continue
            </p>
          </div>

          {/* Form */}
          <CardContent className="p-6">
            <FormWrapper
              schema={loginSchema}
              onSubmit={handleLogin}
              defaultValues={defaultValues}
              className="bg-white dark:bg-gray-900"
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
                    <p className="text-red-600 text-sm font-medium mt-2">
                      {error}
                    </p>
                  )}

                  {/* Submit Button */}
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
            <p className="mt-4 text-center text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Digital Seba. All rights
              reserved.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
