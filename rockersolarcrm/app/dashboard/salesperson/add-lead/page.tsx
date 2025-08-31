"use client"

import { useState } from "react"
import { useLeads } from "../LeadsContext"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"


function AddNewLeadInner() {
  const router = useRouter()
  const { refreshLeads } = useLeads();
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    email: "",
    phone: "",
    pincode: "",
    roofArea: "",
    monthlyBill: "",
    energyRequirement: "",
    roofType: "",
    propertyType: "",
    leadSource: "",
    budget: "",
    timeline: "",
    priority: "",
    notes: "",
    preferredContactTime: "",
    preferredContactMethod: "",
  // nextFollowUpDate removed from main form, handled in call log only
    shadowFreeRooftop: "yes", // Default to "yes"
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        email: formData.email,
        phone: formData.phone,
        pincode: formData.pincode,
        roofArea: formData.roofArea,
        monthlyBill: formData.monthlyBill,
        energyRequirement: formData.energyRequirement,
        roofType: formData.roofType,
        propertyType: formData.propertyType,
        leadSource: formData.leadSource,
        budget: formData.budget,
        timeline: formData.timeline,
        priority: formData.priority,
        notes: formData.notes,
        preferredContactTime: formData.preferredContactTime,
        preferredContactMethod: formData.preferredContactMethod,
  // nextFollowUpDate is not part of the lead payload, handled in call log only
        leadStatus: "newlead",
      };
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to add lead");
      }
      await refreshLeads();
      setIsSubmitting(false);
      alert("Lead added successfully!");
      router.push("/dashboard/salesperson");
  } catch (err: unknown) {
      setIsSubmitting(false);
  alert(typeof err === 'object' && err && 'message' in err ? (err as { message?: string }).message : "Failed to add lead");
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#1F1F1E" }}>
      {/* Header */}
      <header
        className="p-6 border-b"
        style={{
          background: `linear-gradient(135deg, #1F1F1E 0%, #2A2A28 100%)`,
          borderColor: "#888886",
        }}
      >
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/salesperson" className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
            <ArrowLeft size={24} style={{ color: "#F16336" }} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#F4F4F1" }}>
              Add New Lead
            </h1>
            <p style={{ color: "#888886" }}>Create a new customer lead in the system</p>
          </div>
        </div>
      </header>

      <main className="p-6">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="p-6 rounded-lg border" style={{ backgroundColor: "#F4F4F1", borderColor: "#D9D9D9" }}>
              <h2 className="text-xl font-bold mb-6 flex items-center" style={{ color: "#1F1F1E" }}>
                Personal Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#D9D9D9",
                      color: "#1F1F1E",
                    }}
                    placeholder="Enter customer's full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#D9D9D9",
                      color: "#1F1F1E",
                    }}
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                    Phone *
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#D9D9D9",
                      color: "#1F1F1E",
                    }}
                    placeholder="Enter phone number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#D9D9D9",
                      color: "#1F1F1E",
                    }}
                    placeholder="Enter address"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#D9D9D9",
                      color: "#1F1F1E",
                    }}
                    placeholder="Enter pincode"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="p-6 rounded-lg border" style={{ backgroundColor: "#F4F4F1", borderColor: "#D9D9D9" }}>
              <h2 className="text-xl font-bold mb-6 flex items-center" style={{ color: "#1F1F1E" }}>
                Location Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#D9D9D9",
                      color: "#1F1F1E",
                    }}
                    placeholder="Enter city"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#D9D9D9",
                      color: "#1F1F1E",
                    }}
                    placeholder="Enter state"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Solar Requirements */}
            <div className="p-6 rounded-lg border" style={{ backgroundColor: "#F4F4F1", borderColor: "#D9D9D9" }}>
              <h2 className="text-xl font-bold mb-6 flex items-center" style={{ color: "#1F1F1E" }}>
                Solar Requirements
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                    Roof Area (sq ft)
                  </label>
                  <input
                    type="number"
                    name="roofArea"
                    value={formData.roofArea}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                    style={{ backgroundColor: "#FFFFFF", borderColor: "#D9D9D9", color: "#1F1F1E" }}
                    placeholder="Enter roof area"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                    Average Monthly Electricity Bill (₹)
                  </label>
                  <input
                    type="number"
                    name="monthlyBill"
                    value={formData.monthlyBill}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                    style={{ backgroundColor: "#FFFFFF", borderColor: "#D9D9D9", color: "#1F1F1E" }}
                    placeholder="Enter average monthly bill"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                    Energy Requirement (kW)
                  </label>
                  <input
                    type="number"
                    name="energyRequirement"
                    value={formData.energyRequirement}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                    style={{ backgroundColor: "#FFFFFF", borderColor: "#D9D9D9", color: "#1F1F1E" }}
                    placeholder="Enter energy requirement"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                    Roof Type
                  </label>
                  <input
                    type="text"
                    name="roofType"
                    value={formData.roofType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                    style={{ backgroundColor: "#FFFFFF", borderColor: "#D9D9D9", color: "#1F1F1E" }}
                    placeholder="Enter roof type"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                    Property Type
                  </label>
                  <input
                    type="text"
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                    style={{ backgroundColor: "#FFFFFF", borderColor: "#D9D9D9", color: "#1F1F1E" }}
                    placeholder="Enter property type"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                    Do you have a shadow-free rooftop? *
                  </label>
                  <select
                    name="shadowFreeRooftop"
                    value={formData.shadowFreeRooftop}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                    style={{ backgroundColor: "#FFFFFF", borderColor: "#D9D9D9", color: "#1F1F1E" }}
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>
            </div>
            {/* Meta Fields */}
            <div className="p-6 rounded-lg border" style={{ backgroundColor: "#F4F4F1", borderColor: "#D9D9D9" }}>
              <h2 className="text-xl font-bold mb-6 flex items-center" style={{ color: "#1F1F1E" }}>
                Meta & Notes
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                    Lead Source
                  </label>
                  <input
                    type="text"
                    name="leadSource"
                    value={formData.leadSource}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                    style={{ backgroundColor: "#FFFFFF", borderColor: "#D9D9D9", color: "#1F1F1E" }}
                    placeholder="Enter lead source"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                    Budget
                  </label>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                    style={{ backgroundColor: "#FFFFFF", borderColor: "#D9D9D9", color: "#1F1F1E" }}
                    placeholder="Enter budget"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                    Timeline
                  </label>
                  <input
                    type="text"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                    style={{ backgroundColor: "#FFFFFF", borderColor: "#D9D9D9", color: "#1F1F1E" }}
                    placeholder="Enter timeline"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                    Priority
                  </label>
                  <input
                    type="text"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                    style={{ backgroundColor: "#FFFFFF", borderColor: "#D9D9D9", color: "#1F1F1E" }}
                    placeholder="Enter priority (e.g. high, medium, low)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                    Preferred Contact Time
                  </label>
                  <input
                    type="text"
                    name="preferredContactTime"
                    value={formData.preferredContactTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                    style={{ backgroundColor: "#FFFFFF", borderColor: "#D9D9D9", color: "#1F1F1E" }}
                    placeholder="Enter preferred contact time"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                    Preferred Contact Method
                  </label>
                  <input
                    type="text"
                    name="preferredContactMethod"
                    value={formData.preferredContactMethod}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                    style={{ backgroundColor: "#FFFFFF", borderColor: "#D9D9D9", color: "#1F1F1E" }}
                    placeholder="Enter preferred contact method"
                  />
                </div>
                {/* Next Follow-up Date removed from main form, handled in call log modal only */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                    style={{ backgroundColor: "#FFFFFF", borderColor: "#D9D9D9", color: "#1F1F1E" }}
                    placeholder="Enter notes"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end space-x-4">
            <Link
              href="/dashboard/salesperson"
              className="px-8 py-3 rounded-lg font-medium transition-all hover:scale-105 border"
              style={{
                backgroundColor: "transparent",
                color: "#888886",
                borderColor: "#D9D9D9",
              }}
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-8 py-3 rounded-lg font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "#F16336",
                color: "#FFFFFF",
              }}
            >
              <Save size={16} />
              <span>{isSubmitting ? "Creating Lead..." : "Create Lead"}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default function AddNewLead() {
  return <AddNewLeadInner />;
}
