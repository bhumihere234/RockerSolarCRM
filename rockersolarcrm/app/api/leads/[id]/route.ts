// app/api/leads/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";
import { z } from "zod";

// Validation schema for PATCH
const updateLeadSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(5).optional(),
  alternatePhone: z.string().nullable().optional(),

  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),

  company: z.string().nullable().optional(),
  designation: z.string().nullable().optional(),

  roofArea: z.coerce.number().nullable().optional(),
  monthlyBill: z.coerce.number().nullable().optional(),
  energyRequirement: z.coerce.number().nullable().optional(),
  roofType: z.string().nullable().optional(),
  propertyType: z.string().nullable().optional(),

  leadSource: z.string().nullable().optional(),
  budget: z.string().nullable().optional(),
  timeline: z.string().nullable().optional(),
  priority: z.enum(["high", "medium", "low"]).optional(),
  notes: z.string().nullable().optional(),

  preferredContactTime: z.string().nullable().optional(),
  preferredContactMethod: z.string().nullable().optional(),
  nextFollowUpDate: z.string().nullable().optional(),
});

// GET a single lead
export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> } // 👈 params is a Promise in Next 15+
) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    const auth = token ? verifyToken(token) : null;
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await ctx.params; // 👈 await params
    const lead = await prisma.lead.findFirst({ where: { id, userId: auth.id } });
    if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

    return NextResponse.json(lead, { status: 200 });
  } catch (err) {
    console.error("GET /api/leads/[id] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PATCH update lead
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> } // 👈 params is a Promise
) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    const auth = token ? verifyToken(token) : null;
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await ctx.params; // 👈 await params

    const body = await req.json().catch(() => ({}));
    const parsed = updateLeadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const b = parsed.data;
    const nextDate =
      b.nextFollowUpDate && b.nextFollowUpDate.trim()
        ? new Date(b.nextFollowUpDate)
        : undefined; // undefined = don't change; null = clear

    // ensure lead belongs to user
    const exists = await prisma.lead.findFirst({ where: { id, userId: auth.id } });
    if (!exists) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

    const updated = await prisma.lead.update({
      where: { id },
      data: {
        ...(b.name !== undefined ? { name: b.name } : {}),
        ...(b.email !== undefined ? { email: b.email } : {}),
        ...(b.phone !== undefined ? { phone: b.phone } : {}),
        ...(b.alternatePhone !== undefined ? { alternatePhone: b.alternatePhone } : {}),

        ...(b.address !== undefined ? { address: b.address } : {}),
        ...(b.city !== undefined ? { city: b.city } : {}),
        ...(b.state !== undefined ? { state: b.state } : {}),
        ...(b.pincode !== undefined ? { pincode: b.pincode } : {}),

        ...(b.company !== undefined ? { company: b.company } : {}),
        ...(b.designation !== undefined ? { designation: b.designation } : {}),

        ...(b.roofArea !== undefined ? { roofArea: b.roofArea } : {}),
        ...(b.monthlyBill !== undefined ? { monthlyBill: b.monthlyBill } : {}),
        ...(b.energyRequirement !== undefined ? { energyRequirement: b.energyRequirement } : {}),
        ...(b.roofType !== undefined ? { roofType: b.roofType } : {}),
        ...(b.propertyType !== undefined ? { propertyType: b.propertyType } : {}),

        ...(b.leadSource !== undefined ? { leadSource: b.leadSource } : {}),
        ...(b.budget !== undefined ? { budget: b.budget } : {}),
        ...(b.timeline !== undefined ? { timeline: b.timeline } : {}),
        ...(b.priority !== undefined ? { priority: b.priority } : {}),
        ...(b.notes !== undefined ? { notes: b.notes } : {}),

        ...(b.preferredContactTime !== undefined ? { preferredContactTime: b.preferredContactTime } : {}),
        ...(b.preferredContactMethod !== undefined ? { preferredContactMethod: b.preferredContactMethod } : {}),
        ...(nextDate !== undefined ? { nextFollowUpDate: nextDate } : {}),
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error("PATCH /api/leads/[id] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
