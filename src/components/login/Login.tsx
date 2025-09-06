"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import FormWrapper from "@/components/forms/FormWrapper";
import FormInput from "@/components/forms/FormInput";
import { loginSchema, LoginFormData } from "@/schemas/loginSchema";
import { Card, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (data: LoginFormData) => {
    setLoading(true);
    setError(null);

    setTimeout(() => {
      setLoading(false);
      if (data.username === "admin" && data.mobile === "1234567890") {
        router.push("/sales");
      } else {
        setError("Invalid username or mobile number");
      }
    }, 1000);
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
              Welcome back! Please login to continue
            </p>
          </div>

          {/* Form */}
          <CardContent className="p-6">
            <FormWrapper
              schema={loginSchema}
              onSubmit={handleLogin}
              submitLabel={loading ? "Logging in..." : "Login"}
              className="bg-white dark:bg-gray-900"
            >
              {(control) => (
                <>
                  <FormInput
                    name="username"
                    label="Username"
                    placeholder="Enter your username"
                    control={control}
                  />
                  <FormInput
                    name="mobile"
                    label="Mobile Number"
                    placeholder="Enter 10-digit mobile number"
                    type="tel"
                    control={control}
                  />

                  {error && (
                    <p className="text-red-600 text-center text-sm font-medium mt-2">
                      {error}
                    </p>
                  )}
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
