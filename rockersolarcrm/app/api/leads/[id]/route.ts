import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromAuthHeader } from "@/utils/auth";
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
  // accept any string; we'll normalize to enum later
  status: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  sort: z.enum(["createdAt", "name"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  includeKpis: z.coerce.boolean().default(false),
});

/* ------------------------------------------------------------------ */
/*                        Plain-JS IST Time Helpers                    */
/* ------------------------------------------------------------------ */

const IST_OFFSET_MIN = 5 * 60 + 30;
function toUtcFromIst(ist: Date) { return new Date(ist.getTime() - IST_OFFSET_MIN * 60_000); }
function nowIst() { const n = new Date(); return new Date(n.getTime() + IST_OFFSET_MIN * 60_000); }
function startOfIstDay(d: Date) { const ist = new Date(d); ist.setHours(0,0,0,0); return ist; }
function endOfIstDay(d: Date) { const ist = new Date(d); ist.setHours(23,59,59,999); return ist; }
function istRangeForThisWeek() {
  const istNow = nowIst();
  const dow = (istNow.getDay() + 6) % 7; // Monday=0
  const startIst = new Date(istNow); startIst.setDate(startIst.getDate() - dow); startIst.setHours(0,0,0,0);
  const endIst = new Date(startIst); endIst.setDate(startIst.getDate() + 6); endIst.setHours(23,59,59,999);
  return { start: toUtcFromIst(startIst), end: toUtcFromIst(endIst) };
}
function istRangeForToday() {
  const istNow = nowIst();
  return { start: toUtcFromIst(startOfIstDay(istNow)), end: toUtcFromIst(endOfIstDay(istNow)) };
}

/* ------------------------------------------------------------------ */
/*                               KPIs                                  */
/* ------------------------------------------------------------------ */

export async function computeKPIs(userId?: string) {
  const whereUser = userId ? { userId } : {};
  const { start: todayStart, end: todayEnd } = istRangeForToday();
  const { start: weekStart, end: weekEnd } = istRangeForThisWeek();

  const [totalLeads, leadsToday, leadsThisWeek] = await Promise.all([
    prisma.lead.count({ where: { ...whereUser } }),
    prisma.lead.count({ where: { ...whereUser, createdAt: { gte: todayStart, lte: todayEnd } } }),
    prisma.lead.count({ where: { ...whereUser, createdAt: { gte: weekStart, lte: weekEnd } } }),
  ]);
  // No status field in schema, so skip openLeads/wonLeads
  const openLeads = 0;
  const wonLeads = 0;

  const conversionRate = totalLeads === 0 ? 0 : Number(((wonLeads / totalLeads) * 100).toFixed(1));
  return { totalLeads, leadsToday, leadsThisWeek, openLeads, wonLeads, conversionRate };
}

/* ------------------------------------------------------------------ */
/*                             Normalizers                             */
/* ------------------------------------------------------------------ */

function normalizeStatus(s?: string): "OPEN" | "INPROCESS" | "WON" | "LOST" | undefined {
  if (!s) return undefined;
  const v = s.trim().toUpperCase();
  if (["OPEN", "INPROCESS", "WON", "LOST"].includes(v)) return v as any;
  const map: Record<string, "OPEN"|"INPROCESS"|"WON"|"LOST"> = {
    "NEW LEAD": "OPEN",
    "OVERDUE": "INPROCESS",
    "FOLLOW UP": "INPROCESS",
    "CLOSED": "WON", // change to "LOST" if that's how you use Closed
    "LOST": "LOST",
  };
  return map[v];
}

/* ------------------------------------------------------------------ */
/*                                 GET                                 */
/* ------------------------------------------------------------------ */

export async function GET(req: Request) {
  try {
    const auth = getUserFromAuthHeader(req);
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(req.url);
    const parsed = listQuerySchema.parse(Object.fromEntries(url.searchParams));
    const { page, pageSize, q, dateFrom, dateTo, sort, order, includeKpis } = parsed;

    const where: any = { userId: auth.id };

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

    if (dateFrom || dateTo) {
      const fromUtc =
        dateFrom && !Number.isNaN(new Date(dateFrom).getTime())
          ? toUtcFromIst(startOfIstDay(new Date(dateFrom)))
          : undefined;
      const toUtcVal =
        dateTo && !Number.isNaN(new Date(dateTo).getTime())
          ? toUtcFromIst(endOfIstDay(new Date(dateTo)))
          : undefined;

      if (fromUtc || toUtcVal) {
        where.createdAt = { ...(fromUtc ? { gte: fromUtc } : {}), ...(toUtcVal ? { lte: toUtcVal } : {}) };
      }
    }

    const skip = (page - 1) * pageSize;
    const sortKey = sort === "name" ? "name" : "createdAt";
    const sortOrder: "asc" | "desc" = order === "asc" ? "asc" : "desc";

    const [items, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { [sortKey]: sortOrder },
        select: {
          id: true, name: true, email: true, phone: true,
          city: true, state: true, company: true, createdAt: true,
        },
      }),
      prisma.lead.count({ where }),
    ]);

    const response: any = {
      data: items,
      pageInfo: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };

    if (includeKpis) response.kpis = await computeKPIs(auth.id);

    return NextResponse.json(response);
  } catch (err: any) {
    console.error("List leads failed:", err);
    return NextResponse.json({ error: err?.message ?? "Failed to list leads" }, { status: 400 });
  }
}

/* ------------------------------------------------------------------ */
/*                                 POST                                */
/* ------------------------------------------------------------------ */

export async function POST(req: Request) {
  try {
    const auth = getUserFromAuthHeader(req);
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
          roofArea: data.roofArea != null ? String(data.roofArea) : null,
          monthlyBill: data.monthlyBill != null ? String(data.monthlyBill) : null,
          energyRequirement: data.energyRequirement != null ? String(data.energyRequirement) : null,
          roofType: data.roofType ?? null,
          propertyType: data.propertyType ?? null,
          leadSource: data.leadSource ?? null,
          budget: data.budget != null ? String(data.budget) : null,
          userId: auth.id,
        },
      });

      const kpis = await computeKPIs(auth.id);
      return { lead, kpis };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err: any) {
    console.error("Create lead failed:", err);
    return NextResponse.json({ error: err?.message ?? "Failed to create lead" }, { status: 400 });
  }
}
