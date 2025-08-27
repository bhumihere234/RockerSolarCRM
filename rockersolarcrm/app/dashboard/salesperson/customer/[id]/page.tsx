
"use client";

import { useEffect, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import AddCallLogModal from "./components/add-call-log-modal";
import { useParams, useRouter } from "next/navigation";

// Dropdown options (copied from customer-list-modal)
const CALL_STATUS_OPTIONS = [
  { value: "upcoming", label: "Upcoming Calls" },
  { value: "overdue", label: "Overdue Calls" },
  { value: "followup", label: "Followup Calls" },
];
const LEAD_PROGRESS_OPTIONS = [
  { value: "newlead", label: "New Leads" },
  { value: "inprocess", label: "In Process" },
  { value: "sitevisit", label: "Site Visits" },
  { value: "estimatesent", label: "Estimate Sent" },
  { value: "leadwon", label: "Lead Won" },
];


type Lead = {
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
  // KPI Dropdown state and handlers
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [kpiSelection, setKpiSelection] = useState<{ callStatus?: string; leadStatus?: string }>({});
  const [savingKpi, setSavingKpi] = useState(false);

  // Handle dropdown selection
  const handleKpiChange = (type: "callStatus" | "leadStatus", value: string) => {
    setKpiSelection(prev => ({ ...prev, [type]: value }));
  };

  // Save KPI change (PATCH both callStatus and leadStatus if either is selected)
  const handleSaveKpi = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!lead || (!kpiSelection.leadStatus && !kpiSelection.callStatus)) return;
    setSavingKpi(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const patchBody: Record<string, string> = {};
      if (kpiSelection.leadStatus) patchBody.leadStatus = kpiSelection.leadStatus;
      if (kpiSelection.callStatus) patchBody.callStatus = kpiSelection.callStatus;
      const res = await fetch(`/api/leads/${lead.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(patchBody),
      });
      if (!res.ok) throw new Error("Failed to update KPI");
      // Reload lead data
      setDropdownOpen(false);
      setKpiSelection({});
      setLoading(true);
      // reload lead
      const reload = await fetch(`/api/leads/${lead.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        cache: "no-store",
      });
      if (reload.ok) {
        const data = await reload.json();
        setLead(data);
      }
    } catch (err) {
      alert("Failed to update KPI. Please try again.");
    } finally {
      setSavingKpi(false);
      setLoading(false);
    }
  };
  // Call logs state (fetched from backend)
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [isCallLogModalOpen, setIsCallLogModalOpen] = useState(false);
  // Custom confirmation modal state (must be before any return)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Handler to add a new call log (persist to backend)
  const handleAddCallLog = async (log: Omit<CallLog, "id">) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch(`/api/leads/${id}/calllog`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(log),
      });
      if (!res.ok) throw new Error("Failed to add call log");
      const newLog = await res.json();
      setCallLogs((prev) => [newLog, ...prev]);
      setIsCallLogModalOpen(false);
    } catch (e) {
      alert("Failed to add call log");
    }
  };
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

  // load lead and call logs
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
        const data = await res.json();
        if (isMounted) {
          setLead(data);
          setCallLogs(Array.isArray(data.callLogs) ? data.callLogs : []);
        }
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
      if (!exists) {
        // Save if not already saved
        const normalized: Lead = {
          ...lead,
          name: lead.name ?? lead.fullName ?? "Customer",
        };
        const next = [...list, normalized];
        localStorage.setItem("savedCustomers", JSON.stringify(next));
        setIsSaved(true);
      } else {
        // Unsave if already saved (optional, or just keep as is)
        // const next = list.filter((c) => c.id !== lead.id);
        // localStorage.setItem("savedCustomers", JSON.stringify(next));
        // setIsSaved(false);
      }
      // Always redirect to dashboard
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

  // Delete client handler (remains here, not a hook)
  const handleDeleteClient = async () => {
    if (!lead) return;
    setDeleting(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch(`/api/leads/${lead.id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Failed to delete client");
      router.push("/dashboard/salesperson");
    } catch (err) {
      alert("Failed to delete client. Please try again.");
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-[#181818]">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
          <h1 className="text-3xl font-bold text-[#F4F4F1] tracking-tight">{displayName}</h1>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded text-sm bg-[#232323] text-[#F4F4F1] border border-[#333]">
              Created: {fmtDate(lead?.createdAt)}
            </span>
            {/* KPI Dropdown */}
            <div className="relative">
              <button
                className="px-3 py-2 rounded bg-gray-100 border border-gray-300 text-xs font-semibold hover:bg-orange-100"
                onClick={() => setDropdownOpen((v) => !v)}
              >
                Change KPI
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-30 p-3">
                  <div className="mb-2 font-bold text-xs text-gray-700">Call Status</div>
                  {CALL_STATUS_OPTIONS.map(opt => (
                    <label key={opt.value} className="flex items-center mb-1 cursor-pointer text-sm">
                      <input
                        type="radio"
                        name="callStatus"
                        value={opt.value}
                        checked={kpiSelection.callStatus === opt.value}
                        onChange={() => handleKpiChange("callStatus", opt.value)}
                        className="mr-2 accent-orange-500"
                      />
                      {opt.label}
                    </label>
                  ))}
                  <div className="mt-3 mb-2 font-bold text-xs text-gray-700">Lead Progress</div>
                  {LEAD_PROGRESS_OPTIONS.map(opt => (
                    <label key={opt.value} className="flex items-center mb-1 cursor-pointer text-sm">
                      <input
                        type="radio"
                        name="leadStatus"
                        value={opt.value}
                        checked={kpiSelection.leadStatus === opt.value}
                        onChange={() => handleKpiChange("leadStatus", opt.value)}
                        className="mr-2 accent-orange-500"
                      />
                      {opt.label}
                    </label>
                  ))}
                  <div className="flex justify-end mt-3 gap-2">
                    <button
                      className="px-3 py-1 rounded bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 text-xs"
                      onClick={() => { setDropdownOpen(false); setKpiSelection({}); }}
                      disabled={savingKpi}
                    >Cancel</button>
                    <button
                      className="px-3 py-1 rounded bg-orange-500 text-white font-semibold hover:bg-orange-600 text-xs"
                      onClick={handleSaveKpi}
                      disabled={savingKpi || !(kpiSelection.leadStatus || kpiSelection.callStatus)}
                    >{savingKpi ? "Saving..." : "Save"}</button>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={toggleSave}
              className={`px-8 py-4 rounded-lg text-lg font-bold transition-colors shadow-md ${isSaved ? "bg-[#232323] border border-[#333] text-white" : "bg-[#F16336] text-white"}`}
              style={{ minWidth: 120 }}
              title={isSaved ? "Unsave" : "Save & go back to dashboard"}
            >
              {isSaved ? "Saved" : "Save"}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-3 rounded-full hover:bg-red-100 ml-2"
              title="Delete client"
            >
              <Trash2 size={28} className="text-red-500" />
            </button>
      {/* Custom Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full flex flex-col items-center">
            <h3 className="text-lg font-bold mb-4 text-red-600">Delete Client?</h3>
            <p className="mb-6 text-center text-gray-700">Are you sure you want to delete this client? This action cannot be undone.</p>
            <div className="flex gap-4 w-full justify-center">
              <button
                className="px-5 py-2 rounded bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600"
                onClick={handleDeleteClient}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
          </div>
        </div>

        {/* Customer Information */}
        <section className="w-full rounded-2xl shadow-lg bg-[#F4F4F1] p-6 border border-[#e5e5e5]">
          <h2 className="font-semibold text-lg mb-4 text-[#181818]">Customer Information</h2>
          <div className="space-y-1 text-base">
            <div><span className="opacity-60">Email:</span> {fmt(lead?.email)}</div>
            <div><span className="opacity-60">Phone:</span> {fmt(lead?.phone)}</div>
            <div>
              <span className="opacity-60">Address:</span> {[
                fmt(lead?.address),
                fmt(lead?.city),
                fmt(lead?.state),
                fmt(lead?.pincode),
              ].filter((x) => x !== "-").join(", ") || "-"}
            </div>
          </div>
        </section>

        {/* Status & Meta */}
        <section className="w-full rounded-2xl shadow-lg bg-[#F4F4F1] p-6 border border-[#e5e5e5]">
          <h2 className="font-semibold text-lg mb-4 text-[#181818]">Status & Meta</h2>
          <div className="space-y-1 text-base">
            <div><span className="opacity-60">Priority:</span> {fmt(lead?.priority)}</div>
            <div><span className="opacity-60">Lead Source:</span> {fmt(lead?.leadSource)}</div>
            <div><span className="opacity-60">Next Follow-up:</span> {fmtDate(lead?.nextFollowUpDate)}</div>
            <div>
              <span className="opacity-60">Preferred Contact:</span> {[
                fmt(lead?.preferredContactMethod),
                fmt(lead?.preferredContactTime),
              ].filter((x) => x !== "-").join(" • ") || "-"}
            </div>
          </div>
        </section>

        {/* Solar Requirements */}
        <section className="w-full rounded-2xl shadow-lg bg-[#F4F4F1] p-6 border border-[#e5e5e5]">
          <h2 className="font-semibold text-lg mb-4 text-[#181818]">Solar Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-base">
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
        <section className="w-full rounded-2xl shadow-lg bg-[#F4F4F1] p-6 border border-[#e5e5e5]">
          <h2 className="font-semibold text-lg mb-4 text-[#181818]">Notes</h2>
          <p className="text-base text-[#232323]">{fmt(lead?.notes)}</p>
        </section>

        {/* Call Logs */}
        <section className="w-full rounded-2xl shadow-lg bg-[#F4F4F1] p-6 border border-[#e5e5e5]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-xl text-[#181818]">Call Logs</h2>
            <button
              className="px-5 py-2 rounded-lg font-semibold text-white bg-[#F16336] hover:bg-[#d94e1f] transition-colors"
              onClick={() => setIsCallLogModalOpen(true)}
            >
              + Add Call Log
            </button>
          </div>
          {callLogs.length === 0 ? (
            <div className="text-gray-400 text-center py-8">No call logs yet.</div>
          ) : (
            <div className="space-y-6">
              {callLogs.map((log) => (
                <div key={log.id} className="rounded-xl border p-4 bg-white flex flex-col gap-2 shadow-sm" style={{ borderColor: "#E5E5E5" }}>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-semibold text-base text-[#181818]">
                      <span role="img" aria-label="calendar">📅</span> {new Date(log.date).toLocaleDateString()} at {new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="ml-2 text-gray-500 text-sm">Duration: {log.duration} mins</span>
                  </div>
                  <div className="mb-1 text-base text-[#232323]">{log.notes}</div>
                  {log.action && (
                    <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs font-semibold">
                      {log.action}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
          <AddCallLogModal
            isOpen={isCallLogModalOpen}
            onClose={() => setIsCallLogModalOpen(false)}
            onSave={handleAddCallLog}
          />
        </section>
                  </div>
                </div>
  );
}
