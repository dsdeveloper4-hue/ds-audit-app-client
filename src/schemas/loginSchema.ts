import { z } from "zod";

export const loginSchema = z.object({
  mobile: z.string().regex(/^\d{11}$/, "Mobile number must be 11 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
