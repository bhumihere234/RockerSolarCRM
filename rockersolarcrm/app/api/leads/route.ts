import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";
import { z } from "zod";

const IST = "Asia/Kolkata";

/* ----------------------------- Validation ----------------------------- */

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
  roofArea: z.coerce.number().optional().nullable(),
  monthlyBill: z.coerce.number().optional().nullable(),
  energyRequirement: z.coerce.number().optional().nullable(),
  roofType: z.string().optional().nullable(),
  propertyType: z.string().optional().nullable(),
  leadSource: z.string().optional().nullable(),
  budget: z.coerce.number().optional().nullable()
});

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

/* ----------------------------- Time Helpers ---------------------------- */

function istRangeForToday() {
  const now = new Date();
  const istNow = utcToZonedTime(now, IST);
  const start = zonedTimeToUtc(startOfDay(istNow), IST);
  const end = zonedTimeToUtc(endOfDay(istNow), IST);
  return { start, end };
}

function istRangeForThisWeek() {
  const now = new Date();
  const istNow = utcToZonedTime(now, IST);
  const start = zonedTimeToUtc(startOfWeek(istNow, { weekStartsOn: 1 }), IST); // Monday
  const end = zonedTimeToUtc(endOfWeek(istNow, { weekStartsOn: 1 }), IST);
  return { start, end };
}

async function computeKPIs(userOrgId?: string) {
  const whereOrg = userOrgId ? { orgId: userOrgId } : {};

  const { start: todayStart, end: todayEnd } = istRangeForToday();
  const { start: weekStart, end: weekEnd } = istRangeForThisWeek();

  const [totalLeads, leadsToday, leadsThisWeek, openLeads, wonLeads] =
    await Promise.all([
      prisma.lead.count({ where: { ...whereOrg } }),
      prisma.lead.count({
        where: { ...whereOrg, createdAt: { gte: todayStart, lte: todayEnd } }
      }),
      prisma.lead.count({
        where: { ...whereOrg, createdAt: { gte: weekStart, lte: weekEnd } }
      }),
      prisma.lead.count({ where: { ...whereOrg, status: "OPEN" } }),
      prisma.lead.count({ where: { ...whereOrg, status: "WON" } })
    ]);

  const conversionRate =
    totalLeads === 0 ? 0 : Number(((wonLeads / totalLeads) * 100).toFixed(1));

  return {
    totalLeads,
    leadsToday,
    leadsThisWeek,
    openLeads,
    wonLeads,
    conversionRate
  };
}

/* --------------------------------- GET --------------------------------- */
/**
 * List leads for the Lead List page:
 *   /api/leads?page=1&pageSize=20&q=delhi&status=OPEN&sort=createdAt&order=desc&includeKpis=1
 */
export async function GET(req: Request) {
  try {
    const auth = await verifyToken(req);
    if (!auth?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const parsed = listQuerySchema.parse(Object.fromEntries(url.searchParams));

    const { page, pageSize, q, status, dateFrom, dateTo, sort, order, includeKpis } = parsed;
    const skip = (page - 1) * pageSize;

    const where: any = { orgId: auth.user.orgId };

    // Status filter
    if (status) where.status = status;

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
        ? zonedTimeToUtc(startOfDay(utcToZonedTime(parseISO(dateFrom), IST)), IST)
        : undefined;
      const istEnd = dateTo
        ? zonedTimeToUtc(endOfDay(utcToZonedTime(parseISO(dateTo), IST)), IST)
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
          status: true,
          createdAt: true,
        },
      }),
      prisma.lead.count({ where }),
    ]);

    const base = {
      data: items,
      pageInfo: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    } as any;

    if (includeKpis) {
      base.kpis = await computeKPIs(auth.user.orgId);
    }

    return NextResponse.json(base);
  } catch (err: any) {
    console.error("List leads failed:", err);
    return NextResponse.json(
      { error: err?.message ?? "Failed to list leads" },
      { status: 400 }
    );
  }
}

/* --------------------------------- POST -------------------------------- */
export async function POST(req: Request) {
  try {
    const auth = await verifyToken(req);
    if (!auth?.user) {
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
          roofArea: data.roofArea ?? null,
          monthlyBill: data.monthlyBill ?? null,
          energyRequirement: data.energyRequirement ?? null,
          roofType: data.roofType ?? null,
          propertyType: data.propertyType ?? null,
          leadSource: data.leadSource ?? null,
          budget: data.budget ?? null,
          status: "OPEN",
          createdById: auth.user.id,
          orgId: auth.user.orgId // make sure your model has this if you multi-tenant
        }
      });

      // compute KPIs using the same connection for consistency
      const kpis = await computeKPIs(auth.user.orgId);
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
