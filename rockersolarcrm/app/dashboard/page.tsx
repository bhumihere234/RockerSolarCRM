"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SalespersonDashboard() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [leadsThisMonth, setLeadsThisMonth] = useState<number>(0);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const token = localStorage.getItem("token") || "";
        const res = await fetch("/api/leads/metrics", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          cache: "no-store",
        });
        if (!res.ok) {
          if (mounted) setLeadsThisMonth(0);
          return;
        }
        const data = await res.json();
        if (mounted) setLeadsThisMonth(Number(data?.leadsThisMonth ?? 0));
      } catch {
        if (mounted) setLeadsThisMonth(0);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const onSearch = () => {
    const q = query.trim();
    if (!q) return;
    router.push(`/dashboard/salesperson/search?query=${encodeURIComponent(q)}`);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#1F1F1E" }}>
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <h1 className="text-lg font-semibold mb-4" style={{ color: "#F4F4F1" }}>
          Salesperson Dashboard
        </h1>

        {/* Search row (as before: wide input with a small search action on the right) */}
        <div className="flex items-center gap-3 mb-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            placeholder="Search leads by name, email, phone..."
            className="w-full rounded-md px-4 py-3 border"
            style={{
              backgroundColor: "#EDEDEB",
              color: "#1F1F1E",
              borderColor: "#D9D9D9",
            }}
          />
          <button
            onClick={onSearch}
            className="px-3 py-2 rounded-md text-sm font-medium"
            style={{ backgroundColor: "#F16336", color: "#FFFFFF" }}
          >
            Search
          </button>
        </div>

        {/* Single KPI card (as before) */}
        <div
          className="inline-block rounded-md border p-4"
          style={{ backgroundColor: "#F4F4F1", borderColor: "#D9D9D9", color: "#1F1F1E" }}
        >
          <div className="text-xs mb-1" style={{ opacity: 0.7 }}>
            Leads This Month
          </div>
          <div className="text-2xl font-semibold">{leadsThisMonth}</div>
        </div>
      </div>
    </div>
  );
}
