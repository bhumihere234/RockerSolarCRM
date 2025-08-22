import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import {
  signupSchema,
  loginSchema,
  sendOtpSchema,
  verifyOtpSchema,
} from "../lib/validators";
import {
  isEmail,
  isPhone,
  genOtp,
  hashOtp,
  checkOtp,
  expireIn,
} from "../lib/otp";
import { sendEmailOtp } from "../lib/mail";
import { sendSms } from "../lib/sms"; // Import the correct SMS function

const r = Router();

const COOKIE = "rs_session";
const cookieOpts = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 7 * 24 * 60 * 60, // 7 days
};

type Channel = "EMAIL" | "PHONE"; // Define a type for channel

function signToken(userId: string) {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "7d" });
}

// --- SIGNUP ---
r.post("/signup", async (req, res) => {
  try {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

    const { name, email, phone, password } = parsed.data;

    if (!email && !phone)
      return res.status(400).json({ error: "Email or phone required" });
    if (email && !isEmail(email))
      return res.status(400).json({ error: "Invalid email" });
    if (phone && !isPhone(phone))
      return res.status(400).json({ error: "Invalid phone" });

    // Ensure email or phone is unique
    if (email && (await prisma.user.findUnique({ where: { email } })))
      return res
        .status(409)
        .json({ error: "Email already registered. Please sign in." });

    if (phone && (await prisma.user.findUnique({ where: { phone } })))
      return res
        .status(409)
        .json({ error: "Phone already registered. Please sign in." });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, phone, passwordHash },
      select: { id: true, name: true, email: true, phone: true },
    });

    res.json({
      ok: true,
      user,
      message: "Account created. Verify via OTP.",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

// --- SEND OTP (EMAIL or PHONE) ---
r.post("/send-otp", async (req, res) => {
  try {
    const parsed = sendOtpSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
    const { target, channel }: { target: string; channel: Channel } = parsed.data;

    // Check if email or phone is already associated with an account
    const user =
      (await prisma.user.findFirst({ where: { email: target } })) ||
      (await prisma.user.findFirst({ where: { phone: target } }));

    if (user)
      return res
        .status(409)
        .json({ error: `This ${channel} is already associated with another account. Please use another email or phone.` });

    // Invalidate prior active OTPs
    await prisma.otp.updateMany({
      where: {
        target,
        type: channel === "PHONE" ? "PHONE" : "EMAIL", // Explicit handling
        consumed: false,
      },
      data: { consumed: true },
    });

    const code = genOtp(); // Generate OTP
    const codeHash = await hashOtp(code); // Hash the OTP for security
    await prisma.otp.create({
      data: {
        target,
        type: channel === "PHONE" ? "PHONE" : "EMAIL", // Explicitly handle the type (PHONE/EMAIL)
        codeHash,
        expiresAt: expireIn(10), // OTP expires in 10 minutes
      },
    });

    // Send OTP via SMS (for phone) or Email (for email)
    if (channel === "PHONE") {
      sendSms(target, code); // Send OTP via SMS
    } else {
      await sendEmailOtp(target, code); // Send OTP via Email
    }

    return res.json({ ok: true, message: "OTP sent to your selected channel" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

// --- VERIFY OTP (EMAIL or PHONE) ---
r.post("/verify-otp", async (req, res) => {
  try {
    const parsed = verifyOtpSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
    const { target, code, channel }: { target: string; code: string; channel: Channel } = parsed.data;

    const otp = await prisma.otp.findFirst({
      where: {
        target,
        type: channel === "PHONE" ? "PHONE" : "EMAIL", // Handle channel-specific OTP
        consumed: false,
      },
      orderBy: { createdAt: "desc" },
    });

    // No OTP found or expired OTP
    if (!otp) return res.status(404).json({ error: "No active OTP. Please resend." });
    if (otp.expiresAt < new Date()) return res.status(410).json({ error: "OTP expired" });

    // Validate OTP
    const ok = await checkOtp(code, otp.codeHash);
    if (!ok) {
      // If OTP is invalid, increase the attempts
      await prisma.otp.update({
        where: { id: otp.id },
        data: { attempts: { increment: 1 } },
      });
      return res.status(401).json({ error: "Invalid OTP" });
    }

    // Mark OTP as consumed
    await prisma.otp.update({ where: { id: otp.id }, data: { consumed: true } });

    // Find the user and verify email/phone
    const user = await prisma.user.findFirst({
      where: channel === "EMAIL" ? { email: target } : { phone: target },
      select: { id: true },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    // Mark the user's email/phone as verified
    await prisma.user.update({
      where: { id: user.id },
      data: channel === "PHONE" ? { phoneVerifiedAt: new Date() } : { emailVerifiedAt: new Date() },
    });

    // Create JWT token
    const token = signToken(user.id);
    res.cookie(COOKIE, token, cookieOpts);
    res.json({ ok: true, message: "Verified & signed in" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

export default r;
