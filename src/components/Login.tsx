"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const onSubmit = async (data: any) => {
    setLoading(true);
    setMessage("");
    try {
      const res = await api.post("api/auth/login", data); // endpoint should accept username & mobile
      setMessage(res.data.message || "✅ Login successful");
      router.push("/sales");
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "❌ Login failed");
    } finally {
      setLoading(false);
    }
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

            {message && (
              <p
                className={`text-center text-sm ${
                  message.startsWith("✅") ? "text-green-600" : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </MaxWidthWrapper>
  );
}
