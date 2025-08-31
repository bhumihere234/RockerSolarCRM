"use client";

import { X, Phone, Mail, User, Calendar, Clock, Trash2 } from "lucide-react"

import { useRouter } from "next/navigation"
import { useLeads } from "../LeadsContext"
import React, { useState } from "react"

// KPI options
const CALL_STATUS_OPTIONS = [
  { value: "upcoming", label: "Upcoming Calls" },
  { value: "overdue", label: "Overdue Calls" },
  { value: "followup", label: "Followup Calls" },
];
const LEAD_PROGRESS_OPTIONS = [
  { value: "newlead", label: "New Leads" },
  { value: "inprocess", label: "In Process" },
  { value: "sitevisit", label: "Site Visits" },
  { value: "sitevisitcompleted", label: "Site Visit Completed" },
  { value: "estimatesent", label: "Estimate Sent" },
  { value: "leadwon", label: "Lead Won" },
  { value: "leadlost", label: "Lead Lost" },
];

interface Customer {
  id: string
  serialNo: number
  name: string
  phone: string
  email: string
  callStatus: string
  leadStatus: string
  company: string
  formSubmissionDate: string
  lastContactDate?: string
  nextCallDate?: string
  salespersonNotes?: string
  daysOverdue?: number
}

interface CustomerListModalProps {
  isOpen: boolean
  onClose: () => void
  kpiType: string | null
  title: string
}

export default function CustomerListModal({ isOpen, onClose, kpiType, title }: CustomerListModalProps) {
  // Dropdown and KPI state (must be inside the component)
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);
  const [kpiSelections, setKpiSelections] = useState<Record<string, { callStatus: string; leadStatus: string }>>({});
  const [savingKpiId, setSavingKpiId] = useState<string | null>(null);

  // Handle dropdown open/close
  const handleDropdownToggle = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDropdownOpenId(dropdownOpenId === id ? null : id);
  };
  // Handle selection change
  const handleKpiChange = (id: string, type: "callStatus" | "leadStatus", value: string) => {
    setKpiSelections(prev => ({
      ...prev,
      [id]: {
        callStatus: type === "callStatus" ? value : prev[id]?.callStatus || "",
        leadStatus: type === "leadStatus" ? value : prev[id]?.leadStatus || "",
      }
    }));
  };
  // Save KPI change (PATCH both callStatus and leadStatus if either is selected)
  const handleSaveKpi = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSavingKpiId(id);
    const sel = kpiSelections[id];
    // Only proceed if at least one of the fields is selected
    if (!sel || (!sel.leadStatus && !sel.callStatus)) {
      setSavingKpiId(null);
      return;
    }
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      // Build PATCH body with only selected fields
      const patchBody: Record<string, string> = {};
      if (sel.leadStatus) patchBody.leadStatus = sel.leadStatus;
      if (sel.callStatus) patchBody.callStatus = sel.callStatus;
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(patchBody),
      });
      if (!res.ok) throw new Error("Failed to update KPI");
      await refreshLeads();
      setDropdownOpenId(null);
      setKpiSelections(prev => ({ ...prev, [id]: { callStatus: "", leadStatus: "" } }));
  } catch {
      alert("Failed to update KPI. Please try again.");
    } finally {
      setSavingKpiId(null);
    }
  };
  const router = useRouter()

  // Helper function to calculate days difference
  const getDaysDifference = (date1: string, date2: string = new Date().toISOString().split("T")[0]) => {
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    const diffTime = d2.getTime() - d1.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  // Use the exact same call status logic as the dashboard
  const determineCallStatus = (lead: any) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const nextFollowUp = lead.nextFollowUpDate ? new Date(lead.nextFollowUpDate) : null;
    if (nextFollowUp) {
      nextFollowUp.setHours(0,0,0,0);
      if (nextFollowUp.getTime() === today.getTime()) {
        return "upcoming";
      } else if (nextFollowUp.getTime() < today.getTime()) {
        return "overdue";
      }
    }
    // If no nextFollowUpDate and not won, treat as overdue
    if (lead.leadStatus !== "leadwon") return "overdue";
    return "";
  }


  // Use live leads from context
  const { leads, refreshLeads } = useLeads();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

  // Single delete
  const handleDeleteCustomer = (e: React.MouseEvent, customerId: string) => {
    e.stopPropagation();
    setConfirmDeleteId(customerId);
  };
  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    setDeleting(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch(`/api/leads/${confirmDeleteId}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Failed to delete client");
      await refreshLeads();
      setConfirmDeleteId(null);
    } catch (err) {
      alert("Failed to delete client. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  // Bulk select logic
  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    e.stopPropagation();
    setSelectedIds((prev) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const handleSelectAll = () => {
    if (selectedIds.length === filteredCustomers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCustomers.map(c => c.id));
    }
  };
  const handleBulkDelete = () => {
    setShowBulkDeleteConfirm(true);
  };
  const confirmBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setDeleting(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      for (const id of selectedIds) {
        const res = await fetch(`/api/leads/${id}`, {
          method: "DELETE",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error("Failed to delete client");
      }
      await refreshLeads();
      setSelectedIds([]);
      setShowBulkDeleteConfirm(false);
    } catch (err) {
      alert("Failed to delete one or more clients. Please try again.");
    } finally {
      setDeleting(false);
    }
  };


  // Map leads to Customer type and add serialNo
  const customersWithUpdatedStatus: Customer[] = leads.map((lead, idx) => {
    const leadStatus = lead.leadStatus || 'newlead';
    // Ensure formSubmissionDate is always a string
    let formSubmissionDate: string = '';
    if (typeof lead.formSubmissionDate === 'string' && lead.formSubmissionDate) {
      formSubmissionDate = lead.formSubmissionDate;
    } else if (typeof lead.createdAt === 'string' && lead.createdAt) {
      formSubmissionDate = lead.createdAt;
    } else {
      formSubmissionDate = new Date().toISOString().split('T')[0];
    }
    // Always recalculate callStatus using the synced logic
    const callStatus = determineCallStatus(lead);
    let daysOverdue: number | undefined = undefined;
    if (callStatus === "overdue") {
      if (lead.lastContactDate) {
        daysOverdue = getDaysDifference(lead.lastContactDate);
      } else if (formSubmissionDate) {
        daysOverdue = getDaysDifference(formSubmissionDate);
      }
    }
    return {
      id: lead.id,
      serialNo: idx + 1,
      name: lead.name || "-",
      phone: lead.phone || "-",
      email: lead.email || "-",
      callStatus,
      leadStatus,
      company: lead.company || "-",
      formSubmissionDate,
      lastContactDate: lead.lastContactDate || undefined,
      nextCallDate: lead.nextFollowUpDate || lead.nextCallDate || undefined,
  salespersonNotes: typeof lead.salespersonNotes === 'string' ? lead.salespersonNotes : undefined,
      daysOverdue,
    };
  });


  // Filter customers based on KPI type
  const filteredCustomers = customersWithUpdatedStatus.filter((customer) => {
    if (kpiType === "total" || !kpiType) {
      return true; // Show all leads for Total Leads KPI
    }
    if (kpiType === "upcoming") {
      // Only show calls scheduled for today
      const today = new Date();
      today.setHours(0,0,0,0);
      const nextFollowUp = customer.nextCallDate ? new Date(customer.nextCallDate) : null;
      if (nextFollowUp) {
        nextFollowUp.setHours(0,0,0,0);
        return nextFollowUp.getTime() === today.getTime();
      }
      return false;
    }
    if (kpiType === "overdue") {
      // Only show calls where nextFollowUpDate is before today
      const today = new Date();
      today.setHours(0,0,0,0);
      const nextFollowUp = customer.nextCallDate ? new Date(customer.nextCallDate) : null;
      if (nextFollowUp) {
        nextFollowUp.setHours(0,0,0,0);
        return nextFollowUp.getTime() < today.getTime();
      }
      return false;
    }
    if (kpiType === "followup") {
      return customer.callStatus === kpiType;
    } else if (kpiType) {
      return customer.leadStatus === kpiType;
    }
    return true;
  });

  const handleCustomerClick = (customerId: string) => {
    router.push(`/dashboard/salesperson/customer/${customerId}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return { bg: "#D1FAE5", text: "#065F46" }
      case "overdue":
        return { bg: "#FEE2E2", text: "#991B1B" }
      case "followup":
        return { bg: "#FEF3C7", text: "#92400E" }
      default:
        return { bg: "#E0F2FE", text: "#0369A1" }
    }
  }

  const getFormSubmissionInfo = (customer: Customer) => {
    const daysSinceSubmission = getDaysDifference(customer.formSubmissionDate)
    if (daysSinceSubmission === 0) return "Form submitted today"
    if (daysSinceSubmission === 1) return "Form submitted yesterday"
    return `Form submitted ${daysSinceSubmission} days ago`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }} onClick={onClose} />

      {/* Modal */}
      <div
        className="relative w-full max-w-6xl mx-4 rounded-lg shadow-xl max-h-[85vh] overflow-hidden"
        style={{ backgroundColor: "#F4F4F1" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "#D9D9D9" }}>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: "#1F1F1E" }}>
              {title}
            </h2>
            <p className="text-sm mt-1" style={{ color: "#888886" }}>
              {filteredCustomers.length} customers found
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
            <X size={24} style={{ color: "#888886" }} />
          </button>
        </div>

        {/* Customer List */}
        <div className="overflow-y-auto max-h-[65vh]">
          <div className="p-6">
            {filteredCustomers.length === 0 ? (
              <div className="text-center py-12">
                <User size={48} className="mx-auto mb-4" style={{ color: "#888886" }} />
                <p className="text-lg font-medium" style={{ color: "#1F1F1E" }}>
                  No customers found
                </p>
                <p style={{ color: "#888886" }}>No customers match the selected criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {/* Select All Checkbox */}
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredCustomers.length && filteredCustomers.length > 0}
                    onChange={handleSelectAll}
                    className="mr-2 w-4 h-4 accent-orange-500"
                  />
                  <span className="text-sm text-gray-700">Select All</span>
                  {selectedIds.length > 0 && (
                    <button
                      className="ml-4 px-4 py-1 rounded bg-red-500 text-white font-semibold hover:bg-red-600 text-sm"
                      onClick={handleBulkDelete}
                    >
                      Delete Selected ({selectedIds.length})
                    </button>
                  )}
                </div>
                {filteredCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className="p-5 rounded-lg border cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] hover:border-orange-300 flex items-center"
                    style={{ backgroundColor: "#FFFFFF", borderColor: "#D9D9D9" }}
                    onClick={e => {
                      // Only navigate if not clicking on dropdown or checkbox
                      if (
                        (e.target as HTMLElement).closest('.kpi-dropdown') ||
                        (e.target as HTMLElement).tagName === 'INPUT'
                      ) return;
                      handleCustomerClick(customer.id);
                    }}
                  >
                    {/* Checkbox for selection */}
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(customer.id)}
                      onClick={e => e.stopPropagation()}
                      onChange={e => handleSelect(e, customer.id)}
                      className="mr-4 w-4 h-4 accent-orange-500"
                    />
                    <div className="flex-1 relative">
                        {/* KPI Dropdown Button */}
                        <div className="absolute top-0 right-0 z-20 kpi-dropdown">
                          <button
                            className="px-2 py-1 rounded bg-gray-100 border border-gray-300 text-xs font-semibold hover:bg-orange-100"
                            onClick={e => handleDropdownToggle(e, customer.id)}
                          >
                            update progress
                          </button>
                          {/* Dropdown Menu */}
                          {dropdownOpenId === customer.id && (
                            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-30 p-3">
                              <div className="mb-2 font-bold text-xs text-blue-700 uppercase tracking-wide">Call Status</div>
                              {CALL_STATUS_OPTIONS.map(opt => (
                                <label key={opt.value} className="flex items-center mb-1 cursor-pointer text-sm">
                                  <input
                                    type="radio"
                                    name={`callStatus-${customer.id}`}
                                    value={opt.value}
                                    checked={kpiSelections[customer.id]?.callStatus === opt.value}
                                    onChange={() => handleKpiChange(customer.id, "callStatus", opt.value)}
                                    className="mr-2 accent-orange-500"
                                  />
                                  {opt.label}
                                </label>
                              ))}
                              <div className="mt-3 mb-2 font-bold text-xs text-blue-700 uppercase tracking-wide">Lead Progress</div>
                              {LEAD_PROGRESS_OPTIONS.map(opt => (
                                <label key={opt.value} className="flex items-center mb-1 cursor-pointer text-sm">
                                  <input
                                    type="radio"
                                    name={`leadStatus-${customer.id}`}
                                    value={opt.value}
                                    checked={kpiSelections[customer.id]?.leadStatus === opt.value}
                                    onChange={() => handleKpiChange(customer.id, "leadStatus", opt.value)}
                                    className="mr-2 accent-orange-500"
                                  />
                                  {opt.label}
                                </label>
                              ))}
                              <div className="flex justify-end mt-3 gap-2">
                                <button
                                  className="px-3 py-1 rounded bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 text-xs"
                                  onClick={e => { e.stopPropagation(); setDropdownOpenId(null); }}
                                  disabled={savingKpiId === customer.id}
                                >Cancel</button>
                                <button
                                  className="px-3 py-1 rounded bg-orange-500 text-white font-semibold hover:bg-orange-600 text-xs"
                                  onClick={e => handleSaveKpi(e, customer.id)}
                                  disabled={
                                    savingKpiId === customer.id ||
                                    !(kpiSelections[customer.id]?.leadStatus || kpiSelections[customer.id]?.callStatus)
                                  }
                                >{savingKpiId === customer.id ? "Saving..." : "Save"}</button>
                              </div>
                            </div>
                          )}
                        </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {/* Serial Number */}
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center font-bold"
                            style={{ backgroundColor: "#F16336", color: "#FFFFFF" }}
                          >
                            {customer.serialNo}
                          </div>

                          {/* Customer Info */}
                          <div className="flex-1">
                            <h3 className="font-bold text-lg" style={{ color: "#1F1F1E" }}>
                              {customer.name}
                            </h3>
                            <p className="text-sm mb-2" style={{ color: "#888886" }}>
                              {customer.company}
                            </p>
                            <div className="flex items-center space-x-6 mb-2">
                              <div className="flex items-center space-x-2">
                                <Phone size={16} style={{ color: "#888886" }} />
                                <span className="text-sm" style={{ color: "#1F1F1E" }}>
                                  {customer.phone}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Mail size={16} style={{ color: "#888886" }} />
                                <span className="text-sm" style={{ color: "#1F1F1E" }}>
                                  {customer.email}
                                </span>
                              </div>
                            </div>

                            {/* Form Submission & Contact Info */}
                            <div className="flex items-center space-x-4 text-xs" style={{ color: "#888886" }}>
                              <div className="flex items-center space-x-1">
                                <Calendar size={12} />
                                <span>{getFormSubmissionInfo(customer)}</span>
                              </div>
                              {customer.lastContactDate && (
                                <div className="flex items-center space-x-1">
                                  <Clock size={12} />
                                  <span>Last contact: {customer.lastContactDate}</span>
                                </div>
                              )}
                            </div>

                            {/* Salesperson Notes */}
                            {customer.salespersonNotes && (
                              <p className="text-xs mt-2 italic" style={{ color: "#666" }}>
                                "{customer.salespersonNotes}"
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Status, Priority, Delete */}
                        <div className="text-right flex flex-col items-end gap-2">
                          {/* Delete icon */}
                          <button
                            className="p-2 rounded-full hover:bg-red-100"
                            title="Delete client"
                            onClick={e => handleDeleteCustomer(e, customer.id)}
                          >
                            <Trash2 size={20} className="text-red-500" />
                          </button>
                          <span
                            className="px-3 py-1 rounded-full text-xs font-medium inline-block mb-2"
                            style={{
                              backgroundColor: getStatusColor(customer.callStatus).bg,
                              color: getStatusColor(customer.callStatus).text,
                            }}
                          >
                            {customer.callStatus.charAt(0).toUpperCase() + customer.callStatus.slice(1)}
                          </span>

                          {/* Overdue indicator */}
                          {customer.callStatus === "overdue" && customer.daysOverdue && (
                            <p className="text-xs font-semibold" style={{ color: "#DC2626" }}>
                              {customer.daysOverdue} days overdue
                            </p>
                          )}

                          {/* Next call date */}
                          {customer.nextCallDate && customer.callStatus === "upcoming" && (
                            <p className="text-xs" style={{ color: "#059669" }}>
                              Next call: {customer.nextCallDate}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t" style={{ borderColor: "#D9D9D9" }}>
          <div className="text-sm" style={{ color: "#888886" }}>
            Click on any customer to view their detailed profile and update call status
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg font-medium transition-all hover:scale-105"
            style={{ backgroundColor: "#F16336", color: "#FFFFFF" }}
          >
            Close
          </button>
        </div>
      {/* Custom Delete Confirmation Modal (single) */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-60 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full flex flex-col items-center">
            <h3 className="text-lg font-bold mb-4 text-red-600">Delete Client?</h3>
            <p className="mb-6 text-center text-gray-700">Are you sure you want to delete this client? This action cannot be undone.</p>
            <div className="flex gap-4 w-full justify-center">
              <button
                className="px-5 py-2 rounded bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300"
                onClick={() => setConfirmDeleteId(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600"
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Bulk Delete Confirmation Modal */}
      {showBulkDeleteConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full flex flex-col items-center">
            <h3 className="text-lg font-bold mb-4 text-red-600">Delete Selected Clients?</h3>
            <p className="mb-6 text-center text-gray-700">Are you sure you want to delete {selectedIds.length} selected client(s)? This action cannot be undone.</p>
            <div className="flex gap-4 w-full justify-center">
              <button
                className="px-5 py-2 rounded bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300"
                onClick={() => setShowBulkDeleteConfirm(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600"
                onClick={confirmBulkDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : `Delete (${selectedIds.length})`}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}
