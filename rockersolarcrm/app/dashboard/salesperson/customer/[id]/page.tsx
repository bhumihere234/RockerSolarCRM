"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Lead = {
  id: string;

  // core
  name?: string | null;         // API field
  fullName?: string | null;     // older UI field
  email?: string | null;
  phone?: string | null;
  alternatePhone?: string | null;

  // address
  address?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;

  // solar reqs
  roofArea?: number | string | null;
  monthlyBill?: number | string | null;
  energyRequirement?: number | string | null;
  roofType?: string | null;
  propertyType?: string | null;

  // meta
  leadSource?: string | null;
  budget?: string | null;
  timeline?: string | null;
  priority?: string | null;
  notes?: string | null;

  preferredContactTime?: string | null;
  preferredContactMethod?: string | null;
  nextFollowUpDate?: string | Date | null;

  // prisma timestamps
  createdAt?: string | Date | null;
  updatedAt?: string | Date | null;
};

function fmt(v?: string | number | null) {
  if (v === null || v === undefined) return "-";
  const s = String(v).trim();
  return s.length ? s : "-";
}

function fmtDate(d?: string | Date | null) {
  if (!d) return "-";
  const date = typeof d === "string" ? new Date(d) : d;
  const t = date?.getTime?.();
  if (!t || Number.isNaN(t)) return "-";
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
}

export default function CustomerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string>("");

  // isSaved state for the Save button
  const [isSaved, setIsSaved] = useState(false);

  // a safe display name that matches both old/new fields
  const displayName = useMemo(
    () => (lead?.fullName?.trim() || lead?.name?.trim() || "Customer"),
    [lead]
  );

  // load lead
  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const res = await fetch(`/api/leads/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          cache: "no-store",
        });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error || `HTTP ${res.status}`);
        }
        const data = (await res.json()) as Lead;
        if (isMounted) setLead(data);
      } catch (e: any) {
        if (isMounted) setErr(e?.message || "Failed to load lead");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [id]);

  // determine saved state from localStorage whenever lead changes
  useEffect(() => {
    if (!lead) return;
    try {
      const raw = localStorage.getItem("savedCustomers");
      const arr: Lead[] = raw ? JSON.parse(raw) : [];
      setIsSaved(arr.some((c) => c.id === lead.id));
    } catch {
      // ignore
    }
  }, [lead]);

  // Save (or Unsave) the current customer.
  // On first save, redirect back to salesperson dashboard as requested.
  const toggleSave = () => {
    if (!lead) return;

    try {
      const raw = localStorage.getItem("savedCustomers");
      const list: Lead[] = raw ? JSON.parse(raw) : [];

      const exists = list.some((c) => c.id === lead.id);
      if (exists) {
        // Unsave, stay on page
        const next = list.filter((c) => c.id !== lead.id);
        localStorage.setItem("savedCustomers", JSON.stringify(next));
        setIsSaved(false);
        return;
      }

      // Normalize minimum fields needed for search & list
      const normalized: Lead = {
        ...lead,
        // ensure `name` present for searching by name in the modal
        name: lead.name ?? lead.fullName ?? "Customer",
      };

      const next = [...list, normalized];
      localStorage.setItem("savedCustomers", JSON.stringify(next));
      setIsSaved(true);

      // after save -> go back to dashboard
      router.push("/dashboard/salesperson");
    } catch (e) {
      console.error("Failed to toggle save:", e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: "#1F1F1E", color: "#F4F4F1" }}>
        <div className="max-w-6xl mx-auto">Loading customer…</div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: "#1F1F1E", color: "#F4F4F1" }}>
        <div className="max-w-6xl mx-auto">
          <p className="mb-4">Error: {err}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 rounded"
            style={{ backgroundColor: "#F16336", color: "#fff" }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: "#1F1F1E" }}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold" style={{ color: "#F4F4F1" }}>
            {displayName}
          </h1>

          <div className="flex items-center gap-3">
            <span
              className="px-3 py-1 rounded text-sm"
              style={{ backgroundColor: "#2A2A28", color: "#F4F4F1", border: "1px solid #3a3a38" }}
            >
              Created: {fmtDate(lead?.createdAt)}
            </span>

            <button
              onClick={toggleSave}
              className="px-4 py-2 rounded text-sm font-medium"
              style={{
                backgroundColor: isSaved ? "#2A2A28" : "#F16336",
                color: "#fff",
                border: isSaved ? "1px solid #3a3a38" : "none",
              }}
              title={isSaved ? "Unsave" : "Save & go back to dashboard"}
            >
              {isSaved ? "Saved" : "Save"}
            </button>
          </div>
        </div>

        {/* Customer Information + Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section
            className="rounded border p-4"
            style={{ backgroundColor: "#F4F4F1", borderColor: "#D9D9D9", color: "#1F1F1E" }}
          >
            <h2 className="font-semibold mb-3">Customer Information</h2>
            <div className="space-y-1 text-sm">
              <div><span className="opacity-60">Email:</span> {fmt(lead?.email)}</div>
              <div><span className="opacity-60">Phone:</span> {fmt(lead?.phone)}</div>
              <div>
                <span className="opacity-60">Address:</span>{" "}
                {[
                  fmt(lead?.address),
                  fmt(lead?.city),
                  fmt(lead?.state),
                  fmt(lead?.pincode),
                ]
                  .filter((x) => x !== "-")
                  .join(", ") || "-"}
              </div>
            </div>
          </section>

          <section
            className="rounded border p-4"
            style={{ backgroundColor: "#F4F4F1", borderColor: "#D9D9D9", color: "#1F1F1E" }}
          >
            <h2 className="font-semibold mb-3">Status & Meta</h2>
            <div className="space-y-1 text-sm">
              <div><span className="opacity-60">Priority:</span> {fmt(lead?.priority)}</div>
              <div><span className="opacity-60">Lead Source:</span> {fmt(lead?.leadSource)}</div>
              <div><span className="opacity-60">Next Follow-up:</span> {fmtDate(lead?.nextFollowUpDate)}</div>
              <div>
                <span className="opacity-60">Preferred Contact:</span>{" "}
                {[fmt(lead?.preferredContactMethod), fmt(lead?.preferredContactTime)]
                  .filter((x) => x !== "-")
                  .join(" • ") || "-"}
              </div>
            </div>
          </section>
        </div>

        {/* Solar Requirements */}
        <section
          className="rounded border p-4"
          style={{ backgroundColor: "#F4F4F1", borderColor: "#D9D9D9", color: "#1F1F1E" }}
        >
          <h2 className="font-semibold mb-3">Solar Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="opacity-60">Roof Area</div>
              <div>{fmt(lead?.roofArea)}</div>
            </div>
            <div>
              <div className="opacity-60">Monthly Bill</div>
              <div>{fmt(lead?.monthlyBill)}</div>
            </div>
            <div>
              <div className="opacity-60">Energy (kW)</div>
              <div>{fmt(lead?.energyRequirement)}</div>
            </div>
            <div>
              <div className="opacity-60">Roof Type</div>
              <div>{fmt(lead?.roofType)}</div>
            </div>
            <div>
              <div className="opacity-60">Property Type</div>
              <div>{fmt(lead?.propertyType)}</div>
            </div>
            <div>
              <div className="opacity-60">Budget</div>
              <div>{fmt(lead?.budget)}</div>
            </div>
            <div>
              <div className="opacity-60">Timeline</div>
              <div>{fmt(lead?.timeline)}</div>
            </div>
          </div>
        </section>

        {/* Notes */}
        <section
          className="rounded border p-4"
          style={{ backgroundColor: "#F4F4F1", borderColor: "#D9D9D9", color: "#1F1F1E" }}
        >
          <h2 className="font-semibold mb-3">Notes</h2>
          <p className="text-sm">{fmt(lead?.notes)}</p>
        </section>
      </div>
    </div>
  );
}
