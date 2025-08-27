"use client";
import React, { createContext, useContext } from "react";
import useSWR from "swr";

export type Lead = {
  id: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  company?: string | null;
  leadStatus?: string | null;
  formSubmissionDate?: string | null;
  lastContactDate?: string | null;
  nextCallDate?: string | null;
  [key: string]: any;
};

type LeadsContextType = {
  leads: Lead[];
  refreshLeads: () => Promise<void>;
  loading: boolean;
};

const LeadsContext = createContext<LeadsContextType | undefined>(undefined);

export function useLeads() {
  const ctx = useContext(LeadsContext);
  if (!ctx) throw new Error("useLeads must be used within a LeadsProvider");
  return ctx;
}

export const LeadsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // SWR fetcher with auth
  const fetcher = async (url: string) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const res = await fetch(url, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch leads");
    const data = await res.json();
    return data.data || [];
  };

  const { data: leads = [], isLoading: loading, mutate: refreshLeads } = useSWR("/api/leads?page=1&pageSize=200", fetcher, { refreshInterval: 5000 });

  return (
    <LeadsContext.Provider value={{ leads, refreshLeads, loading }}>
      {children}
    </LeadsContext.Provider>
  );
};
