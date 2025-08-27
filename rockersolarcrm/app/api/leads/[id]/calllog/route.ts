import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromAuthHeader } from "@/utils/auth";
import { z } from "zod";

const callLogSchema = z.object({
  date: z.string(), // ISO string
  duration: z.number().int().min(1),
  notes: z.string().min(1),
  action: z.string().optional().nullable(),
});

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const auth = getUserFromAuthHeader(req);
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const leadId = params.id;
    if (!leadId) return NextResponse.json({ error: "Missing lead id" }, { status: 400 });
    const body = await req.json();
    const data = callLogSchema.parse(body);
    const callLog = await prisma.callLog.create({
      data: {
        leadId,
        date: new Date(data.date),
        duration: data.duration,
        notes: data.notes,
        action: data.action ?? null,
      },
    });
    return NextResponse.json(callLog, { status: 201 });
  } catch (err: any) {
    console.error("Add call log failed:", err);
    return NextResponse.json({ error: err?.message ?? "Failed to add call log" }, { status: 400 });
  }
}
