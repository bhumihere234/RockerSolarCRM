"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type SearchItem = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  city?: string | null;
  company?: string | null;
  createdAt?: string;
};

type Props = {
  /** Placeholder text for the input */
  placeholder?: string;
  /** Wrapper class so it fits your page layout */
  className?: string;
  /** Input classes so it matches your existing input styling */
  inputClassName?: string;
  /** Button classes so it matches your existing button styling */
  buttonClassName?: string;
};

export default function LeadSearch({
  placeholder = "Search leads by name, email, phone…",
  className = "",
  inputClassName = "",
  buttonClassName = "",
}: Props) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [items, setItems] = useState<SearchItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Debounce search text (250 ms)
  const debounced = useDebounce(q.trim(), 250);

  useEffect(() => {
    let abort = false;

    async function run() {
      if (!debounced) {
        setItems([]);
        setOpen(false);
        return;
      }
      setLoading(true);
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const res = await fetch(`/api/leads/search?q=${encodeURIComponent(debounced)}&take=10`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          cache: "no-store",
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
        if (!abort) {
          const list: SearchItem[] = Array.isArray(data?.items) ? data.items : [];
          setItems(list);
          setOpen(true);
        }
      } catch (e) {
        if (!abort) {
          setItems([]);
          setOpen(false);
        }
      } finally {
        if (!abort) setLoading(false);
      }
    }

    run();
    return () => {
      abort = true;
    };
  }, [debounced]);

  // Close dropdown on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function navigateTo(item: SearchItem) {
    router.push(`/dashboard/salesperson/customer/${item.id}`);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // If there is exactly one match, go directly; otherwise open dropdown
    if (items.length === 1) {
      navigateTo(items[0]);
      return;
    }
    if (!open) setOpen(true);
  }

  return (
    <div ref={containerRef} className={className} style={{ position: "relative" }}>
      <form onSubmit={onSubmit} style={{ display: "flex", gap: 8 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          className={inputClassName}
        />
        <button type="submit" className={buttonClassName} disabled={loading}>
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      {/* Results dropdown (unstyled so it inherits your theme; tweak as needed) */}
      {open && items.length > 0 && (
        <div
          style={{
            position: "absolute",
            zIndex: 20,
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: 8,
            overflow: "hidden",
            maxHeight: 320,
            overflowY: "auto",
          }}
        >
          {items.map((it) => (
            <button
              key={it.id}
              onClick={() => navigateTo(it)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "10px 12px",
                borderBottom: "1px solid #eee",
              }}
            >
              <div style={{ fontWeight: 600 }}>{it.name || "(No name)"}</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>
                {[it.email, it.phone, it.city, it.company].filter(Boolean).join(" • ")}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results state */}
      {open && !loading && debounced && items.length === 0 && (
        <div
          style={{
            position: "absolute",
            zIndex: 20,
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 12,
            fontSize: 14,
            opacity: 0.8,
          }}
        >
          No results for “{debounced}”.
        </div>
      )}
    </div>
  );
}

/** Small debounce hook (client-side only) */
function useDebounce<T>(value: T, delay = 250) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const h = setTimeout(() => setV(value), delay);
    return () => clearTimeout(h);
  }, [value, delay]);
  return v;
}
