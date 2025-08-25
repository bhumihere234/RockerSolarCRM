"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type Lead = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  company: string | null;
  status: "OPEN" | "INPROCESS" | "WON" | "LOST";
  createdAt: string;
};

type ApiResponse = {
  data: Lead[];
  pageInfo: { page: number; pageSize: number; total: number; totalPages: number };
  kpis?: {
    totalLeads: number; leadsToday: number; leadsThisWeek: number;
    openLeads: number; wonLeads: number; conversionRate: number;
  };
};

const STATUSES = ["OPEN", "INPROCESS", "WON", "LOST"] as const;
const clsx = (...p: Array<string | false | null | undefined>) => p.filter(Boolean).join(" ");
const toIsoStart = (d: string | null) => (d ? new Date(d + "T00:00:00").toISOString() : undefined);
const toIsoEnd = (d: string | null) => (d ? new Date(d + "T23:59:59.999").toISOString() : undefined);
function useDebounced<T>(v: T, delay = 400) { const [x, setX] = useState(v); useEffect(() => { const t = setTimeout(() => setX(v), delay); return () => clearTimeout(t); }, [v, delay]); return x; }

export default function LeadsPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [q, setQ] = useState(sp.get("q") ?? "");
  const [status, setStatus] = useState(sp.get("status") ?? "");
  const [page, setPage] = useState(Number(sp.get("page") ?? 1));
  const [pageSize, setPageSize] = useState(Number(sp.get("pageSize") ?? 20));
  const [sort, setSort] = useState(sp.get("sort") ?? "createdAt");
  const [order, setOrder] = useState(sp.get("order") ?? "desc");
  const [dateFrom, setDateFrom] = useState(sp.get("dateFromLocal") ?? "");
  const [dateTo, setDateTo] = useState(sp.get("dateToLocal") ?? "");

  const [loading, setLoading] = useState(true);
  const [resp, setResp] = useState<ApiResponse | null>(null);
  const [err, setErr] = useState("");

  const debouncedQ = useDebounced(q, 400);

  const buildApiUrl = useCallback(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("pageSize", String(pageSize));
    params.set("sort", sort);
    params.set("order", order);
    params.set("includeKpis", "1");
    if (debouncedQ.trim()) params.set("q", debouncedQ.trim());
    if (status) params.set("status", status);
    if (dateFrom) params.set("dateFrom", toIsoStart(dateFrom)!);
    if (dateTo) params.set("dateTo", toIsoEnd(dateTo)!);
    return `/api/leads?${params.toString()}`;
  }, [page, pageSize, sort, order, debouncedQ, status, dateFrom, dateTo]);

  const syncUrl = useCallback(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("pageSize", String(pageSize));
    params.set("sort", sort);
    params.set("order", order);
    if (q.trim()) params.set("q", q.trim());
    if (status) params.set("status", status);
    if (dateFrom) params.set("dateFromLocal", dateFrom);
    if (dateTo) params.set("dateToLocal", dateTo);
    router.replace(`?${params.toString()}`);
  }, [router, page, pageSize, sort, order, q, status, dateFrom, dateTo]);

  useEffect(() => {
    setLoading(true); setErr("");
    fetch(buildApiUrl())
      .then(async r => { if (!r.ok) throw new Error((await r.json())?.error || "Failed to fetch"); return r.json(); })
      .then((data: ApiResponse) => setResp(data))
      .catch((e: any) => setErr(e?.message ?? "Failed to fetch"))
      .finally(() => setLoading(false));
  }, [buildApiUrl]);

  useEffect(() => { syncUrl(); }, [syncUrl]);

  const totalPages = useMemo(() => resp?.pageInfo.totalPages ?? 1, [resp]);

  function onSortClick(key: "createdAt" | "name") {
    if (sort === key) setOrder(order === "asc" ? "desc" : "asc");
    else { setSort(key); setOrder(key === "name" ? "asc" : "desc"); }
  }

  return (
    <div className="min-h-screen bg-[#1F1F1E] text-white p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Leads</h1>
        {resp?.kpis && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
            <Kpi label="Total" value={resp.kpis.totalLeads} />
            <Kpi label="Today" value={resp.kpis.leadsToday} />
            <Kpi label="This Week" value={resp.kpis.leadsThisWeek} />
            <Kpi label="Open" value={resp.kpis.openLeads} />
            <Kpi label="Conv. Rate" value={`${resp.kpis.conversionRate}%`} />
          </div>
        )}
      </div>

      <div className="bg-[#2A2A29] rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <input value={q} onChange={(e)=>{setQ(e.target.value); setPage(1);} }
            placeholder="Search name/email/phone/city/state/company"
            className="col-span-2 rounded-lg px-3 py-2 bg-[#1F1F1E] border border-[#3a3a39] outline-none" />
          <select value={status} onChange={(e)=>{setStatus(e.target.value); setPage(1);}}
            className="rounded-lg px-3 py-2 bg-[#1F1F1E] border border-[#3a3a39] outline-none">
            <option value="">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <input type="date" value={dateFrom} onChange={(e)=>{setDateFrom(e.target.value); setPage(1);}}
            className="rounded-lg px-3 py-2 bg-[#1F1F1E] border border-[#3a3a39] outline-none" />
          <input type="date" value={dateTo} onChange={(e)=>{setDateTo(e.target.value); setPage(1);}}
            className="rounded-lg px-3 py-2 bg-[#1F1F1E] border border-[#3a3a39] outline-none" />
          <div className="flex items-center gap-2">
            <select value={pageSize} onChange={(e)=>{setPageSize(Number(e.target.value)); setPage(1);}}
              className="rounded-lg px-3 py-2 bg-[#1F1F1E] border border-[#3a3a39] outline-none">
              {[10,20,30,50,100].map(n => <option key={n} value={n}>{n}/page</option>)}
            </select>
            <button onClick={() => { setQ(""); setStatus(""); setDateFrom(""); setDateTo("");
              setSort("createdAt"); setOrder("desc"); setPage(1); setPageSize(20); }}
              className="px-3 py-2 rounded-lg bg-[#3a3a39] hover:bg-[#454543] transition">Reset</button>
          </div>
        </div>
      </div>

      <div className="hidden md:grid grid-cols-12 px-4 text-xs uppercase tracking-wide text-gray-400 mb-2">
        <button className="text-left col-span-3 hover:underline" onClick={()=>onSortClick("name")}>
          Name / Contact {sort==="name" ? (order==="asc" ? "▲":"▼") : ""}
        </button>
        <div className="col-span-3">Location / Company</div>
        <button className="text-left col-span-3 hover:underline" onClick={()=>onSortClick("createdAt")}>
          Created {sort==="createdAt" ? (order==="asc" ? "▲":"▼") : ""}
        </button>
        <div className="col-span-3">Status</div>
      </div>

      <div className="space-y-2">
        {loading && <div className="bg-[#2A2A29] rounded-xl p-6 text-gray-300">Loading leads…</div>}
        {err && !loading && <div className="bg-red-900/40 border border-red-600 rounded-xl p-4">{err}</div>}
        {!loading && !err && resp?.data.length === 0 && (
          <div className="bg-[#2A2A29] rounded-xl p-6 text-gray-400">No leads found for current filters.</div>
        )}
        {!loading && !err && resp?.data.map(lead => <LeadRow key={lead.id} lead={lead} />)}
      </div>

      {!loading && resp && resp.pageInfo.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <span className="text-sm text-gray-400">
            Page {resp.pageInfo.page} of {resp.pageInfo.totalPages} • {resp.pageInfo.total} leads
          </span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={()=>setPage(p=>Math.max(1,p-1))}
              className={clsx("px-3 py-2 rounded-lg border border-[#3a3a39]", page<=1 && "opacity-40 cursor-not-allowed")}>
              Prev
            </button>
            <button disabled={page >= totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))}
              className={clsx("px-3 py-2 rounded-lg border border-[#3a3a39]", page>=totalPages && "opacity-40 cursor-not-allowed")}>
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function LeadRow({ lead }: { lead: Lead }) {
  const created = new Date(lead.createdAt);
  const href = `/dashboard/salesperson/customer/${lead.id}`;
  return (
    <Link href={href} className="block bg-[#2A2A29] hover:bg-[#333] transition rounded-xl px-4 py-3">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
        <div className="md:col-span-3">
          <div className="font-semibold">{lead.name || "Unnamed Lead"}</div>
          <div className="text-sm text-gray-400">{(lead.email || "—") + " • " + (lead.phone || "—")}</div>
        </div>
        <div className="md:col-span-3 text-sm text-gray-300">
          <div>{[lead.city, lead.state].filter(Boolean).join(", ") || "—"}</div>
          <div className="text-gray-400">{lead.company || "—"}</div>
        </div>
        <div className="md:col-span-3 text-sm text-gray-300">
          <div>{created.toLocaleDateString()}</div>
          <div className="text-gray-400">{created.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
        </div>
        <div className="md:col-span-3">
          <span className={clsx(
            "px-2 py-1 rounded-md text-xs",
            lead.status === "OPEN" && "bg-yellow-500/20 text-yellow-300",
            lead.status === "INPROCESS" && "bg-blue-500/20 text-blue-300",
            lead.status === "WON" && "bg-green-600/20 text-green-300",
            lead.status === "LOST" && "bg-red-600/20 text-red-300"
          )}>
            {lead.status}
          </span>
        </div>
      </div>
    </Link>
  );
}

function Kpi({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-[#2A2A29] rounded-lg px-3 py-2 text-center">
      <div className="text-gray-400 text-[11px]">{label}</div>
      <div className="text-base font-semibold">{value}</div>
    </div>
  );
}
