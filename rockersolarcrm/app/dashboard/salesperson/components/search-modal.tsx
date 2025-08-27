"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

type Lead = {
  id: string;
  name?: string | null;
  fullName?: string | null;
  email?: string | null;
  phone?: string | null;
  createdAt?: string | Date | null;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SearchModal({ isOpen, onClose }: Props) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string>("");
  const [results, setResults] = useState<Lead[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setQ("");
      setResults([]);
      setErr("");
      setLoading(false);
    }
  }, [isOpen]);

  const normalizedQ = useMemo(() => q.trim().toLowerCase(), [q]);

  async function handleSearch(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token") || "";
      const url = `/api/leads/search?query=${encodeURIComponent(q)}`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        const payload = await res.json();
        const items: Lead[] = Array.isArray(payload?.hits) ? payload.hits : [];
        setResults(items);
      } else {
        setErr("No customers found");
      }
    } catch {
      setErr("Search failed");
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setQ("");
    setResults([]);
    setErr("");
  }

  function openCustomer(id: string) {
    onClose();
    router.push(`/dashboard/salesperson/customer/${id}`);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} role="dialog" aria-modal="true">
      <div className="w-full max-w-3xl rounded-lg shadow-lg overflow-hidden" style={{ backgroundColor: "#F4F4F1", color: "#1F1F1E", border: "1px solid #D9D9D9" }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "#D9D9D9" }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#F16336", color: "#fff" }}>
              <Search size={18} />
            </div>
            <div>
              <div className="font-semibold">Search Customers</div>
              <div className="text-xs" style={{ color: "#888886" }}>
                Find customers by their name
              </div>
            </div>
          </div>
          <button onClick={onClose} className="px-2 py-1 rounded text-sm" style={{ color: "#888886" }} aria-label="Close" title="Close">✕</button>
        </div>

        <form onSubmit={handleSearch} className="px-5 py-4 flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#888886" }}>
              <Search size={16} />
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name…"
              className="w-full pl-9 pr-3 py-2 rounded border outline-none"
              style={{ backgroundColor: "#fff", borderColor: "#D9D9D9", color: "#1F1F1E" }}
            />
          </div>
          <button type="submit" disabled={loading || q.trim().length === 0} className="px-4 py-2 rounded font-medium disabled:opacity-60" style={{ backgroundColor: "#F16336", color: "#fff" }}>
            {loading ? "Searching…" : "Search"}
          </button>
          <button type="button" onClick={handleClear} className="px-3 py-2 rounded border" style={{ backgroundColor: "#fff", borderColor: "#D9D9D9", color: "#1F1F1E" }}>
            Clear
          </button>
        </form>

        {err && (
          <div className="mx-5 mb-3 px-3 py-2 rounded text-sm" style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}>
            {err}
          </div>
        )}

        <div className="px-5 pb-5 max-h-[50vh] overflow-auto">
          {results.length === 0 ? (
            <div className="py-10 text-center text-sm" style={{ color: "#888886" }}>
              No results to show.
            </div>
          ) : (
            <ul className="divide-y" style={{ borderColor: "#E5E5E5" }}>
              {results.map((c) => {
                const name = (c.name || c.fullName || "Customer").trim();
                return (
                  <li key={c.id} className="py-3">
                    <button onClick={() => openCustomer(c.id)} className="w-full text-left flex items-center justify-between" style={{ color: "#1F1F1E" }}>
                      <div>
                        <div className="font-medium">{name}</div>
                        <div className="text-xs" style={{ color: "#888886" }}>
                          {c.email || "-"} • {c.phone || "-"}
                        </div>
                      </div>
                      <span className="text-sm" style={{ color: "#F16336" }}>
                        View
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
