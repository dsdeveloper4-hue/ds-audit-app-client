"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();
  const queryClient = useQueryClient();

  // ✅ Mutation to handle login
  const loginMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post("api/auth/login", data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["auth-status"] });
      router.push("/sales");
    },
  });

  const onSubmit = (data: any) => {
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
                ✅ "Login successful"
              </p>
            )}
            {loginMutation.isError && (
              <p className="text-center text-sm text-red-600">"Login failed"</p>
            )}
          </form>
        </CardContent>
      </Card>
    </MaxWidthWrapper>
  );
}
