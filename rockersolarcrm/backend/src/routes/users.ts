import { Router } from "express";
import { prisma } from "../lib/prisma";

const r = Router();

// Get all users (for admin or debug)
r.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ ok: true, users });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

export default r;
