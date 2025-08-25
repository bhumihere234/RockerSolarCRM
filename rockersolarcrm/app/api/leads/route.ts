import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";
import { z } from "zod";

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
  budget: z.string().optional().nullable(),
  timeline: z.string().optional().nullable(),
  priority: z.enum(["high", "medium", "low"]).default("medium"),
  notes: z.string().optional().nullable(),
  preferredContactTime: z.string().optional().nullable(),
  preferredContactMethod: z.string().optional().nullable(),
  nextFollowUpDate: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  try {
    console.log("Received a request to create a new lead.");  // Log before processing

    // Extract token and verify user
    const token = req.headers.get("authorization")?.split(" ")[1];
    const auth = token ? verifyToken(token) : null;
    
    if (!auth) {
      console.log("Unauthorized user attempted to submit the lead.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate the incoming request data
    const parsed = leadSchema.safeParse(await req.json());
    if (!parsed.success) {
      console.log("Validation failed:", parsed.error.format()); // Log validation errors
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const b = parsed.data;

    // Log the validated lead data
    console.log("Validated lead data:", b);

    // Create the lead
    const lead = await prisma.lead.create({
      data: {
        name: b.name,
        email: b.email,
        phone: b.phone,
        alternatePhone: b.alternatePhone ?? null,
        address: b.address,
        city: b.city,
        state: b.state,
        pincode: b.pincode,
        company: b.company ?? null,
        designation: b.designation ?? null,
        roofArea: b.roofArea ?? null,
        monthlyBill: b.monthlyBill ?? null,
        energyRequirement: b.energyRequirement ?? null,
        roofType: b.roofType ?? null,
        propertyType: b.propertyType ?? null,
        leadSource: b.leadSource ?? null,
        budget: b.budget ?? null,
        timeline: b.timeline ?? null,
        priority: b.priority,
        notes: b.notes ?? null,
        preferredContactTime: b.preferredContactTime ?? null,
        preferredContactMethod: b.preferredContactMethod ?? null,
        nextFollowUpDate: b.nextFollowUpDate ? new Date(b.nextFollowUpDate) : null,
        userId: auth.id, // Associate lead with the logged-in user
      },
    });

    console.log("Lead created successfully:", lead);

    // Update the dashboard KPI for the logged-in user
    const dashboard = await prisma.dashboard.upsert({
      where: { userId: auth.id },
      update: {
        newLeads: {
          increment: 1, // Increment the newLeads KPI by 1
        },
      },
      create: {
        userId: auth.id,
        newLeads: 1, // Initialize newLeads if this is the first lead for the user
      },
    });

    console.log("Updated Dashboard after new lead:", dashboard);

    return NextResponse.json({ id: lead.id, lead }, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/leads error:", err);  // Log the error
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
