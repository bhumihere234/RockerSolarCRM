"use client"

import { useState } from "react"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AddNewLead() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    averageMonthlyElectricityBill: "",
    shadowFreeRooftop: "yes", // Default to "yes"
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
                    Average Monthly Electricity Bill (₹)
                  </label>
                  <input
                    type="number"
                    name="averageMonthlyElectricityBill"
                    value={formData.averageMonthlyElectricityBill}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#D9D9D9",
                      color: "#1F1F1E",
                    }}
                    placeholder="Enter average monthly bill"
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
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#D9D9D9",
                      color: "#1F1F1E",
                    }}
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
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
