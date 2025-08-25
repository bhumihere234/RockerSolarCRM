// app/dashboard/salesperson/view-leads.tsx

import { useState, useEffect } from "react";
import { prisma } from "@/lib/prisma";  // Import Prisma client for server-side fetching

const ViewLeads = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>(""); // Store selected filter value

  // Fetch all leads from the backend
  const fetchLeads = async () => {
    try {
      const response = await fetch(`/api/leads?filter=${filter}`);  // Pass filter as query param
      const data = await response.json();
      setLeads(data); // Store the leads in state
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [filter]);  // Re-fetch when the filter changes

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Current Leads</h1>
      
      {/* Dropdown for filtering leads */}
      <div className="mb-6">
        <label htmlFor="filter" className="mr-4">Filter by:</label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-gray-700 text-white p-2 rounded-lg"
        >
          <option value="">Select Filter</option>
          <option value="priority">Priority</option>
          <option value="leadSource">Lead Source</option>
          <option value="status">Status</option>
        </select>
      </div>
      
      {/* Display Leads */}
      <div className="space-y-4">
        {leads.length === 0 ? (
          <p>No leads found.</p>
        ) : (
          leads.map((lead) => (
            <div
              key={lead.id}
              className="bg-gray-800 p-4 rounded-lg flex justify-between items-center"
            >
              <div>
                <h3 className="text-xl font-bold">{lead.name}</h3>
                <p>{lead.email}</p>
                <p>{lead.phone}</p>
              </div>
              <div className="text-sm text-gray-400">
                <p>Status: {lead.status}</p>
                <p>Priority: {lead.priority}</p>
                <p>Lead Source: {lead.leadSource}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewLeads;
