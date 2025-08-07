"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import api from "@/lib/api";
import { useAppDispatch } from "@/redux/hook";
import { setUser } from "@/redux/slices/authSlice";

interface LoginFormData {
  username: string;
  mobile: string;
}

interface UserType {
  userId: string;
  role: number;
  name: string;
}

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const dispatch = useAppDispatch();

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const res = await api.post<{ user: UserType; token: string }>(
        "/api/auth/login",
        data,
        { withCredentials: true }
      );

      const { user } = res.data;

      dispatch(setUser(user));

      setSuccess(true);
      router.push("/sales");
    } catch (err: any) {
      console.log(err);
      setError("Login failed. Please check your credentials.");
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
