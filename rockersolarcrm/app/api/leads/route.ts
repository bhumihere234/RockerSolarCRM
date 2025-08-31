const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(200).default(20),
  q: z.string().trim().optional(),
  status: z.enum(["OPEN", "INPROCESS", "WON", "LOST"]).optional(),
  dateFrom: z.string().datetime().optional(), // ISO string
  dateTo: z.string().datetime().optional(),   // ISO string
  sort: z.enum(["createdAt", "name"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  includeKpis: z.coerce.boolean().default(false),
});
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromAuthHeader } from "@/utils/auth";
import { parseISO, startOfDay, endOfDay } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { z } from "zod";
import { computeKPIs } from "./[id]/route";

const IST = "Asia/Kolkata";

const leadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(5),
  alternatePhone: z.string().optional().nullable(),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().min(4),
  company: z.string().optional().nullable(),
  designation: z.string().optional().nullable(),
  roofArea: z.string().optional().nullable(),
  monthlyBill: z.string().optional().nullable(),
  energyRequirement: z.string().optional().nullable(),
  roofType: z.string().optional().nullable(),
  propertyType: z.string().optional().nullable(),
  leadStatus: z.string().optional(),
  callStatus: z.string().optional(),
  leadSource: z.string().optional().nullable(),
  budget: z.string().optional().nullable(),
  timeline: z.string().optional().nullable(),
  priority: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  preferredContactTime: z.string().optional().nullable(),
  preferredContactMethod: z.string().optional().nullable(),
  nextFollowUpDate: z.string().optional().nullable(),
  siteVisitDate: z.string().optional().nullable(),
});

// Removed unused listQuerySchema and istRangeForToday to fix lint errors
export async function GET(req: Request) {
  try {
    const auth = getUserFromAuthHeader(req);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const parsed = listQuerySchema.parse(Object.fromEntries(url.searchParams));
    const { page, pageSize, q, dateFrom, dateTo, sort, order, includeKpis } = parsed;
    const skip = (page - 1) * pageSize;
  const where: Record<string, unknown> = { userId: auth.id };

    // Search filter (case-insensitive)
    if (q && q.length > 0) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { phone: { contains: q, mode: "insensitive" } },
        { city: { contains: q, mode: "insensitive" } },
        { state: { contains: q, mode: "insensitive" } },
        { company: { contains: q, mode: "insensitive" } },
      ];
    }

    // Date range filter (interpret input as IST day bounds)
    if (dateFrom || dateTo) {
      const istStart = dateFrom
        ? startOfDay(toZonedTime(parseISO(dateFrom), IST))
        : undefined;
      const istEnd = dateTo
        ? endOfDay(toZonedTime(parseISO(dateTo), IST))
        : undefined;

      where.createdAt = {
        ...(istStart ? { gte: istStart } : {}),
        ...(istEnd ? { lte: istEnd } : {}),
      };
    }

    const [items, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { [sort]: order },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          city: true,
          state: true,
          company: true,
          createdAt: true,
          leadStatus: true,
          // callStatus: true, // Not a model field, do not select
          nextFollowUpDate: true,
          // siteVisitDate: true, // Not a model field, do not select
          alternatePhone: true,
          designation: true,
          roofArea: true,
          monthlyBill: true,
          energyRequirement: true,
          roofType: true,
          propertyType: true,
          leadSource: true,
          budget: true,
          timeline: true,
          priority: true,
          notes: true,
          preferredContactTime: true,
          preferredContactMethod: true,
          updatedAt: true,
        },
      }),
      prisma.lead.count({ where }),
    ]);

    const base: any = {
      data: items,
      pageInfo: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };

    // Optionally add KPIs if requested and function exists
    if (includeKpis && typeof computeKPIs === 'function') {
      base.kpis = await computeKPIs(auth.id);
    }

    return NextResponse.json(base);
  } catch (err: unknown) {
    console.error("List leads failed:", err);
    let errorMsg = "Failed to list leads";
    if (typeof err === 'object' && err && 'message' in err) {
      errorMsg = (err as any).message;
    }
    return NextResponse.json(
      { error: errorMsg },
      { status: 400 }
    );
  }
}
export async function POST(req: Request) {
  try {
    const auth = getUserFromAuthHeader(req);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = leadSchema.parse(body);

    // wrap in a transaction: create lead then recompute KPIs atomically
    const result = await prisma.$transaction(async (tx) => {
      const lead = await tx.lead.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          alternatePhone: data.alternatePhone ?? null,
          address: data.address,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          company: data.company ?? null,
          designation: data.designation ?? null,
          roofArea: data.roofArea !== undefined && data.roofArea !== null ? String(data.roofArea) : null,
          monthlyBill: data.monthlyBill !== undefined && data.monthlyBill !== null ? String(data.monthlyBill) : null,
          energyRequirement: data.energyRequirement !== undefined && data.energyRequirement !== null ? String(data.energyRequirement) : null,
          roofType: data.roofType ?? null,
          propertyType: data.propertyType ?? null,
          leadSource: data.leadSource ?? null,
          budget: data.budget !== undefined && data.budget !== null ? String(data.budget) : null,
          timeline: data.timeline ?? null,
          priority: data.priority ?? "medium",
          notes: data.notes ?? null,
          preferredContactTime: data.preferredContactTime ?? null,
          preferredContactMethod: data.preferredContactMethod ?? null,
          nextFollowUpDate: data.nextFollowUpDate ? new Date(data.nextFollowUpDate) : null,
          // callStatus: data.callStatus ?? "followup", // Not a model field, do not set
          leadStatus: data.leadStatus || "newlead",
          // siteVisitDate: data.siteVisitDate ? new Date(data.siteVisitDate) : null, // Not a model field, do not set
          userId: auth.id,
        }
      });

      // Optionally compute KPIs if function exists
      let kpis = undefined;
      if (typeof computeKPIs === 'function') {
        kpis = await computeKPIs(auth.id);
      }
      return { lead, kpis };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err: any) {
    console.error("Create lead failed:", err);
    return NextResponse.json(
      { error: err?.message ?? "Failed to create lead" },
      { status: 400 }
    );
  }
}

