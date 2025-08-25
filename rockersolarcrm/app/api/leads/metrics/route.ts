// app/api/leads/metrics/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";

export async function GET(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    const auth = token ? verifyToken(token) : null;
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const thisMonth = await prisma.lead.count({
      where: { userId: auth.id, createdAt: { gte: startOfMonth } },
    });
    const total = await prisma.lead.count({ where: { userId: auth.id } });

    return NextResponse.json({ thisMonth, total }, { status: 200 });
  } catch (err) {
    console.error("GET /api/leads/metrics error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
