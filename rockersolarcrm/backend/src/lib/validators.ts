import { z } from "zod";

export type Channel = "EMAIL" | "PHONE";

export const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().regex(/^\d{10,14}$/).optional(),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  identifier: z.string().min(3), // email or phone
  password: z.string().min(6),
});

export const sendOtpSchema = z.object({
  target: z.string().min(1).refine(
    (val) => z.string().email().safeParse(val).success || z.string().regex(/^\d{10,14}$/).safeParse(val).success,
    { message: "Target must be a valid email or phone number" }
  ),
  channel: z.enum(["EMAIL", "PHONE"]),
});

export const verifyOtpSchema = z.object({
  target: z.string().min(1).refine(
    (val) => z.string().email().safeParse(val).success || z.string().regex(/^\d{10,14}$/).safeParse(val).success,
    { message: "Target must be a valid email or phone number" }
  ),
  channel: z.enum(["EMAIL", "PHONE"]),
  code: z.string().length(6),
});