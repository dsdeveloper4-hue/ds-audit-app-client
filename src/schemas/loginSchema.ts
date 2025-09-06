import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  mobile: z.string().regex(/^\d{11}$/, "Mobile number must be 11 digits"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
