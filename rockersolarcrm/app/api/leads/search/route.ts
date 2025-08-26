import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";

// GET /api/leads/search?query=alice
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const rawQ = (url.searchParams.get("query") || "").trim();

    // auth
    const token = req.headers.get("authorization")?.split(" ")[1];
    const auth = token ? verifyToken(token) : null;
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Gracefully handle empty or too-short queries (return empty hits, not 500)
    if (!rawQ || rawQ.length < 2) {
      return NextResponse.json({ hits: [] });
    }

    const q = rawQ.toLowerCase();

    const hits = await prisma.lead.findMany({
      where: {
        userId: auth.id,
        OR: [
          { name: { contains: q } },
          { email: { contains: q } },
          { phone: { contains: q } },
          { city: { contains: q } },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        city: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ hits });
  } catch (err) {
    console.error("GET /api/leads/search error:", err);
    // Always return a structured error (prevents the UI from showing generic “Server error”)
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
