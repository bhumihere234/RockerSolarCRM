/* ------------------------------------------------------------------ */
/*                                 PATCH                              */
/* ------------------------------------------------------------------ */

export async function PATCH(req: Request) {
  try {
    const auth = getUserFromAuthHeader(req);
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Extract id from URL
    const urlParts = req.url.split("/");
    const id = urlParts[urlParts.length - 1];
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const body = await req.json();
    const updateData: any = {};
    if (body.leadStatus !== undefined) updateData.leadStatus = body.leadStatus;
    if (body.callStatus !== undefined) updateData.callStatus = body.callStatus;
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const updated = await prisma.lead.update({
      where: { id },
      data: updateData,
    });
    return NextResponse.json({ success: true, lead: updated });
  } catch (err: any) {
    console.error("Update lead failed:", err);
    return NextResponse.json({ error: err?.message ?? "Failed to update lead" }, { status: 400 });
  }
}
/* ------------------------------------------------------------------ */
/*                                 DELETE                              */
/* ------------------------------------------------------------------ */

export async function DELETE(req: Request) {
  try {
    const auth = getUserFromAuthHeader(req);
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Extract id from URL
    const urlParts = req.url.split("/");
    const id = urlParts[urlParts.length - 1];
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    // Delete the lead and all related call logs (onDelete: Cascade in schema)
    await prisma.lead.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Delete lead failed:", err);
    return NextResponse.json({ error: err?.message ?? "Failed to delete lead" }, { status: 400 });
  }
}
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

    // Extract id from URL
    const urlParts = req.url.split("/");
    const id = urlParts[urlParts.length - 1];
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        callLogs: {
          orderBy: { date: 'desc' },
        },
      },
    });
    if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    return NextResponse.json(lead);
  } catch (err: any) {
    console.error("Get lead failed:", err);
    return NextResponse.json({ error: err?.message ?? "Failed to get lead" }, { status: 400 });
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
