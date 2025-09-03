"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

interface LoginFormData {
  username: string;
  mobile: string;
}

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onSubmit: SubmitHandler<LoginFormData> = (data) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Hardcoded login logic
    setTimeout(() => {
      setLoading(false);
      if (data.username === "admin" && data.mobile === "1234567890") {
        setSuccess(true);
        router.push("/sales"); // redirect on success
      } else {
        setError("Login failed. Invalid Username or Mobile!");
      }
    }, 1000);
  };

  return (
    <MaxWidthWrapper className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">🔐 Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              {...register("username", { required: true })}
              type="text"
              placeholder="Username"
            />
            {errors.username && (
              <p className="text-sm text-red-500">Username is required</p>
            )}

            <Input
              {...register("mobile", { required: true })}
              type="tel"
              placeholder="Mobile Number"
            />
            {errors.mobile && (
              <p className="text-sm text-red-500">Mobile number is required</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>

            {success && (
              <p className="text-center text-sm text-green-600">
                ✅ Login successful
              </p>
            )}
            {error && (
              <p className="text-center text-sm text-red-600">{error}</p>
            )}
          </form>
        </CardContent>
      </Card>
    </MaxWidthWrapper>
  );
}
