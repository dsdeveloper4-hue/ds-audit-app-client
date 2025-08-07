"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// ✅ Define the shape of the login form data
interface LoginFormData {
  username: string;
  mobile: string;
}

interface UserType {
  token: string;
  user: {
    userId: string;
    role: number;
    name: string;
  };
}

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const router = useRouter();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async (
      data: LoginFormData
    ): Promise<{ user: UserType["user"]; token: string }> => {
      const res = await api.post("api/auth/login", data, {
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: ({ user, token }) => {
      queryClient.invalidateQueries({ queryKey: ["auth-status"] });
      localStorage.setItem("user", JSON.stringify(user));
      router.push("/sales");
    },
    onError: (error) => {
      console.error("Login Error:", error); // Optional: Keep for debugging
    },
  });

  const onSubmit: SubmitHandler<LoginFormData> = (data) => {
    loginMutation.mutate(data);
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

            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </Button>

            {loginMutation.isSuccess && (
              <p className="text-center text-sm text-green-600">
                ✅ &quot;Login successful&quot;
              </p>
            )}
            {loginMutation.isError && (
              <p className="text-center text-sm text-red-600">
                &quot;Login failed&quot;
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </MaxWidthWrapper>
  );
}
