"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, User, Mail, Phone, MapPin, Building, FileText, Calendar, DollarSign, Save } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AddNewLead() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    // Personal Information
    name: "",
    email: "",
    phone: "",
    alternatePhone: "",

    // Address Information
    address: "",
    city: "",
    state: "",
    pincode: "",

    // Professional Information
    company: "",
    designation: "",

    // Solar Requirements
    roofArea: "",
    monthlyBill: "",
    energyRequirement: "",
    roofType: "",
    propertyType: "",

    // Lead Information
    leadSource: "",
    budget: "",
    timeline: "",
    priority: "medium",
    notes: "",

    // Follow-up
    preferredContactTime: "",
    preferredContactMethod: "phone",
    nextFollowUpDate: "",
  })

  const leadSources = [
    "Website Form",
    "Google Ads",
    "Facebook Ads",
    "Referral",
    "Cold Call",
    "Email Campaign",
    "Trade Show",
    "Walk-in",
    "Other",
  ]

  const roofTypes = ["Concrete", "Metal Sheet", "Tile", "Asbestos", "Other"]

  const propertyTypes = ["Residential", "Commercial", "Industrial", "Agricultural"]

  const states = [
    "Maharashtra",
    "Gujarat",
    "Karnataka",
    "Tamil Nadu",
    "Rajasthan",
    "Uttar Pradesh",
    "Madhya Pradesh",
    "West Bengal",
    "Andhra Pradesh",
    "Telangana",
    "Kerala",
    "Punjab",
    "Haryana",
    "Delhi",
    "Other",
  ]

  const priorities = [
    { value: "high", label: "High Priority", color: "#DC2626" },
    { value: "medium", label: "Medium Priority", color: "#F59E0B" },
    { value: "low", label: "Low Priority", color: "#059669" },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      // Create new lead object
      const newLead = {
        id: Date.now().toString(),
        ...formData,
        createdDate: new Date().toISOString().split("T")[0],
        createdBy: localStorage.getItem("userName") || "Sales Person",
        status: "newlead",
        callStatus: "followup",
      }

      // In a real app, this would be an API call
      console.log("New lead created:", newLead)

      setIsSubmitting(false)
      alert("Lead added successfully!")
      router.push("/dashboard/salesperson")
    }, 2000)
  }

  const getCurrentDate = () => {
    const today = new Date()
    today.setDate(today.getDate() + 1) // Tomorrow as default
    return today.toISOString().split("T")[0]
  }

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
                <User size={20} className="mr-2" />
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail
                        size={16}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2"
                        style={{ color: "#888886" }}
                      />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                        style={{
                          backgroundColor: "#FFFFFF",
                          borderColor: "#D9D9D9",
                          color: "#1F1F1E",
                        }}
                        placeholder="customer@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone
                        size={16}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2"
                        style={{ color: "#888886" }}
                      />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                        style={{
                          backgroundColor: "#FFFFFF",
                          borderColor: "#D9D9D9",
                          color: "#1F1F1E",
                        }}
                        placeholder="+91 9876543210"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                    Alternate Phone (Optional)
                  </label>
                  <div className="relative">
                    <Phone
                      size={16}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2"
                      style={{ color: "#888886" }}
                    />
                    <input
                      type="tel"
                      name="alternatePhone"
                      value={formData.alternatePhone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderColor: "#D9D9D9",
                        color: "#1F1F1E",
                      }}
                      placeholder="+91 9876543211"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="p-6 rounded-lg border" style={{ backgroundColor: "#F4F4F1", borderColor: "#D9D9D9" }}>
              <h2 className="text-xl font-bold mb-6 flex items-center" style={{ color: "#1F1F1E" }}>
                <Building size={20} className="mr-2" />
                Professional Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#D9D9D9",
                      color: "#1F1F1E",
                    }}
                    placeholder="Company or organization name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                    Designation
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#D9D9D9",
                      color: "#1F1F1E",
                    }}
                    placeholder="Job title or designation"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                    Lead Source *
                  </label>
                  <select
                    name="leadSource"
                    value={formData.leadSource}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#D9D9D9",
                      color: "#1F1F1E",
                    }}
                    required
                  >
                    <option value="">Select lead source</option>
                    {leadSources.map((source) => (
                      <option key={source} value={source}>
                        {source}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                    Priority Level
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#D9D9D9",
                      color: "#1F1F1E",
                    }}
                  >
                    {priorities.map((priority) => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="p-6 rounded-lg border" style={{ backgroundColor: "#F4F4F1", borderColor: "#D9D9D9" }}>
              <h2 className="text-xl font-bold mb-6 flex items-center" style={{ color: "#1F1F1E" }}>
                <MapPin size={20} className="mr-2" />
                Address Information
              </h2>

              <div className="space-y-4">
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
                    placeholder="Street address"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      placeholder="City name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                      State *
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderColor: "#D9D9D9",
                        color: "#1F1F1E",
                      }}
                      required
                    >
                      <option value="">Select state</option>
                      {states.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>
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
                    placeholder="6-digit pincode"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Solar Requirements */}
            <div className="p-6 rounded-lg border" style={{ backgroundColor: "#F4F4F1", borderColor: "#D9D9D9" }}>
              <h2 className="text-xl font-bold mb-6 flex items-center" style={{ color: "#1F1F1E" }}>
                <FileText size={20} className="mr-2" />
                Solar Requirements
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                      Property Type
                    </label>
                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderColor: "#D9D9D9",
                        color: "#1F1F1E",
                      }}
                    >
                      <option value="">Select property type</option>
                      {propertyTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                      Roof Type
                    </label>
                    <select
                      name="roofType"
                      value={formData.roofType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderColor: "#D9D9D9",
                        color: "#1F1F1E",
                      }}
                    >
                      <option value="">Select roof type</option>
                      {roofTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                      Roof Area (sq ft)
                    </label>
                    <input
                      type="text"
                      name="roofArea"
                      value={formData.roofArea}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderColor: "#D9D9D9",
                        color: "#1F1F1E",
                      }}
                      placeholder="e.g., 1200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                      Monthly Bill (₹)
                    </label>
                    <div className="relative">
                      <DollarSign
                        size={16}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2"
                        style={{ color: "#888886" }}
                      />
                      <input
                        type="text"
                        name="monthlyBill"
                        value={formData.monthlyBill}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                        style={{
                          backgroundColor: "#FFFFFF",
                          borderColor: "#D9D9D9",
                          color: "#1F1F1E",
                        }}
                        placeholder="8500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                      Energy Requirement (kW)
                    </label>
                    <input
                      type="text"
                      name="energyRequirement"
                      value={formData.energyRequirement}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderColor: "#D9D9D9",
                        color: "#1F1F1E",
                      }}
                      placeholder="e.g., 5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                      Budget Range (₹)
                    </label>
                    <input
                      type="text"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderColor: "#D9D9D9",
                        color: "#1F1F1E",
                      }}
                      placeholder="e.g., 2-3 Lakhs"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                      Installation Timeline
                    </label>
                    <input
                      type="text"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderColor: "#D9D9D9",
                        color: "#1F1F1E",
                      }}
                      placeholder="e.g., Within 3 months"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Follow-up Information */}
            <div className="lg:col-span-2">
              <div className="p-6 rounded-lg border" style={{ backgroundColor: "#F4F4F1", borderColor: "#D9D9D9" }}>
                <h2 className="text-xl font-bold mb-6 flex items-center" style={{ color: "#1F1F1E" }}>
                  <Calendar size={20} className="mr-2" />
                  Follow-up Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                      Preferred Contact Method
                    </label>
                    <select
                      name="preferredContactMethod"
                      value={formData.preferredContactMethod}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderColor: "#D9D9D9",
                        color: "#1F1F1E",
                      }}
                    >
                      <option value="phone">Phone Call</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="email">Email</option>
                    </select>
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
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderColor: "#D9D9D9",
                        color: "#1F1F1E",
                      }}
                      placeholder="e.g., 10 AM - 6 PM"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                      Next Follow-up Date
                    </label>
                    <input
                      type="date"
                      name="nextFollowUpDate"
                      value={formData.nextFollowUpDate || getCurrentDate()}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderColor: "#D9D9D9",
                        color: "#1F1F1E",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all resize-none"
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#D9D9D9",
                      color: "#1F1F1E",
                    }}
                    placeholder="Any additional information about the lead, special requirements, or conversation notes..."
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
