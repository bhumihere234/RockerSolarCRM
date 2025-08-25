import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";
import { z } from "zod";

/* ------------------------------------------------------------------ */
/*                         Validation Schemas                          */
/* ------------------------------------------------------------------ */

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
  budget: z.coerce.number().optional().nullable(),
});

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(200).default(20),
  q: z.string().trim().optional(),
  status: z.enum(["OPEN", "INPROCESS", "WON", "LOST"]).optional(),
  dateFrom: z.string().optional(), // ISO string (we’ll treat as IST day)
  dateTo: z.string().optional(),   // ISO string
  sort: z.enum(["createdAt", "name"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  includeKpis: z.coerce.boolean().default(false),
});

/* ------------------------------------------------------------------ */
/*                        Plain-JS IST Time Helpers                    */
/* ------------------------------------------------------------------ */

// +05:30 in minutes
const IST_OFFSET_MIN = 5 * 60 + 30;

/** Convert an IST date-time to UTC date-time (for storing/querying). */
function toUtcFromIst(ist: Date) {
  return new Date(ist.getTime() - IST_OFFSET_MIN * 60_000);
}

/** Now in IST. */
function nowIst() {
  const n = new Date();
  return new Date(n.getTime() + IST_OFFSET_MIN * 60_000);
}

/** Start of the day in IST for a given IST date. */
function startOfIstDay(d: Date) {
  const ist = new Date(d);
  ist.setHours(0, 0, 0, 0);
  return ist;
}

/** End of the day in IST for a given IST date. */
function endOfIstDay(d: Date) {
  const ist = new Date(d);
  ist.setHours(23, 59, 59, 999);
  return ist;
}

/** Monday-start week range in IST, returned as UTC. */
function istRangeForThisWeek() {
  const istNow = nowIst();
  // Find Monday (0..6 with Monday=0)
  const dow = (istNow.getDay() + 6) % 7;
  const startIst = new Date(istNow);
  startIst.setDate(startIst.getDate() - dow);
  startIst.setHours(0, 0, 0, 0);

  const endIst = new Date(startIst);
  endIst.setDate(startIst.getDate() + 6);
  endIst.setHours(23, 59, 59, 999);

  return { start: toUtcFromIst(startIst), end: toUtcFromIst(endIst) };
}

/** Today’s IST day bounds, returned as UTC. */
function istRangeForToday() {
  const istNow = nowIst();
  return {
    start: toUtcFromIst(startOfIstDay(istNow)),
    end: toUtcFromIst(endOfIstDay(istNow)),
  };
}

/* ------------------------------------------------------------------ */
/*                               KPIs                                  */
/* ------------------------------------------------------------------ */

async function computeKPIs(userOrgId?: string) {
  const whereOrg = userOrgId ? { orgId: userOrgId } : {};

  const { start: todayStart, end: todayEnd } = istRangeForToday();
  const { start: weekStart, end: weekEnd } = istRangeForThisWeek();

  const [totalLeads, leadsToday, leadsThisWeek, openLeads, wonLeads] =
    await Promise.all([
      prisma.lead.count({ where: { ...whereOrg } }),
      prisma.lead.count({
        where: { ...whereOrg, createdAt: { gte: todayStart, lte: todayEnd } },
      }),
      prisma.lead.count({
        where: { ...whereOrg, createdAt: { gte: weekStart, lte: weekEnd } },
      }),
      prisma.lead.count({ where: { ...whereOrg, status: "OPEN" } }),
      prisma.lead.count({ where: { ...whereOrg, status: "WON" } }),
    ]);

  const conversionRate =
    totalLeads === 0 ? 0 : Number(((wonLeads / totalLeads) * 100).toFixed(1));

  return {
    totalLeads,
    leadsToday,
    leadsThisWeek,
    openLeads,
    wonLeads,
    conversionRate,
  };
}

/* ------------------------------------------------------------------ */
/*                                 GET                                 */
/*     List leads with search / filters / pagination / sorting         */
/* ------------------------------------------------------------------ */

export async function GET(req: Request) {
  try {
    const auth = await verifyToken(req);
    if (!auth?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const parsed = listQuerySchema.parse(Object.fromEntries(url.searchParams));
    const { page, pageSize, q, status, dateFrom, dateTo, sort, order, includeKpis } =
      parsed;

    const where: any = { orgId: auth.user.orgId };

    if (status) where.status = status;

    if (q && q.trim().length) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { phone: { contains: q, mode: "insensitive" } },
        { city: { contains: q, mode: "insensitive" } },
        { state: { contains: q, mode: "insensitive" } },
        { company: { contains: q, mode: "insensitive" } },
      ];
    }

    // Date filter (treat the incoming timestamps as “dates for IST day”)
    if (dateFrom || dateTo) {
      // parse ISO safely; if invalid, ignore
      const fromUtc =
        dateFrom && !Number.isNaN(new Date(dateFrom).getTime())
          ? toUtcFromIst(startOfIstDay(new Date(dateFrom)))
          : undefined;
      const toUtcVal =
        dateTo && !Number.isNaN(new Date(dateTo).getTime())
          ? toUtcFromIst(endOfIstDay(new Date(dateTo)))
          : undefined;

      if (fromUtc || toUtcVal) {
        where.createdAt = {
          ...(fromUtc ? { gte: fromUtc } : {}),
          ...(toUtcVal ? { lte: toUtcVal } : {}),
        };
      }
    }

    const skip = (page - 1) * pageSize;

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

    const response: any = {
      data: items,
      pageInfo: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };

    if (includeKpis) {
      response.kpis = await computeKPIs(auth.user.orgId);
    }

    return NextResponse.json(response);
  } catch (err: any) {
    console.error("List leads failed:", err);
    return NextResponse.json(
      { error: err?.message ?? "Failed to list leads" },
      { status: 400 }
    );
  }
}

/* ------------------------------------------------------------------ */
/*                                 POST                                */
/*            Create a lead and return fresh KPIs atomically           */
/* ------------------------------------------------------------------ */

export async function POST(req: Request) {
  try {
    const auth = await verifyToken(req);
    if (!auth?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = leadSchema.parse(body);

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
          orgId: auth.user.orgId, // multi-tenant guard
        },
      });

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
