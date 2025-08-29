"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowLeft, Calendar, Clock, User, FileText, Save, Search } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Customer {
  id: string
  name: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  company: string
}

export default function ScheduleSiteVisit() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showCustomerSearch, setShowCustomerSearch] = useState(false)

  const [formData, setFormData] = useState({
    customerId: "",
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    customerAddress: "",

    visitDate: "",
    visitTime: "",
    estimatedDuration: "2",

    visitType: "initial",
    visitPurpose: "",
    specialRequirements: "",

    teamMembers: "",
    equipmentNeeded: "",

    notes: "",
    internalNotes: "",

    reminderTime: "1day",
    notifyCustomer: true,
  })

  // Mock customer data
  const mockCustomers: Customer[] = [
    {
      id: "1",
      name: "John Doe",
      phone: "+91 9876543210",
      email: "john.doe@email.com",
      address: "123 Solar Street, Green Colony",
      city: "Mumbai",
      state: "Maharashtra",
      company: "Tech Solutions Pvt Ltd",
    },
    {
      id: "2",
      name: "Jane Smith",
      phone: "+91 9876543211",
      email: "jane.smith@email.com",
      address: "456 Energy Avenue, Eco Park",
      city: "Pune",
      state: "Maharashtra",
      company: "Green Energy Corp",
    },
    {
      id: "3",
      name: "Mike Johnson",
      phone: "+91 9876543212",
      email: "mike.johnson@email.com",
      address: "789 Power Lane, Solar City",
      city: "Bangalore",
      state: "Karnataka",
      company: "Solar Innovations Ltd",
    },
    {
      id: "4",
      name: "Sarah Wilson",
      phone: "+91 9876543213",
      email: "sarah.wilson@email.com",
      address: "321 Renewable Road, Clean Colony",
      city: "Chennai",
      state: "Tamil Nadu",
      company: "Eco Solutions Inc",
    },
    {
      id: "5",
      name: "David Brown",
      phone: "+91 9876543214",
      email: "david.brown@email.com",
      address: "654 Sustainable Street, Future Park",
      city: "Hyderabad",
      state: "Telangana",
      company: "Renewable Tech Pvt Ltd",
    },
  ]

  const visitTypes = [
    { value: "initial", label: "Initial Site Assessment" },
    { value: "technical", label: "Technical Survey" },
    { value: "followup", label: "Follow-up Visit" },
    { value: "installation", label: "Installation Planning" },
    { value: "maintenance", label: "Maintenance Check" },
  ]

  const reminderOptions = [
    { value: "1hour", label: "1 Hour Before" },
    { value: "2hours", label: "2 Hours Before" },
    { value: "1day", label: "1 Day Before" },
    { value: "2days", label: "2 Days Before" },
  ]

  const filteredCustomers = mockCustomers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.company.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer)
    setFormData((prev) => ({
      ...prev,
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      customerAddress: `${customer.address}, ${customer.city}, ${customer.state}`,
    }))
    setShowCustomerSearch(false)
    setSearchTerm("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!selectedCustomer || !formData.visitDate) {
      alert("Please select a customer and a visit date.");
      setIsSubmitting(false);
      return;
    }

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      // Combine date and time into ISO string (if time provided)
      let siteVisitDateISO = formData.visitDate;
      if (formData.visitTime) {
        siteVisitDateISO = new Date(`${formData.visitDate}T${formData.visitTime}`).toISOString();
      }
      const res = await fetch(`/api/leads/${selectedCustomer.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ siteVisitDate: siteVisitDateISO }),
      });
      if (!res.ok) throw new Error("Failed to schedule site visit");
      setIsSubmitting(false);
      alert("Site visit scheduled successfully! Customer will be notified.");
      router.push("/dashboard/salesperson");
    } catch (err) {
      setIsSubmitting(false);
      alert("Failed to schedule site visit. Please try again.");
    }
  } 

  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split("T")[0]
  }

  const getDefaultTime = () => {
    return "10:00"
  }

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      visitDate: getMinDate(),
      visitTime: getDefaultTime(),
    }))
  }, [])

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
              Schedule Site Visit
            </h1>
            <p style={{ color: "#888886" }}>Plan and schedule customer site visits</p>
          </div>
        </div>
      </header>

      <main className="p-6">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Customer Selection */}
            <div className="lg:col-span-2">
              <div className="p-6 rounded-lg border" style={{ backgroundColor: "#F4F4F1", borderColor: "#D9D9D9" }}>
                <h2 className="text-xl font-bold mb-6 flex items-center" style={{ color: "#1F1F1E" }}>
                  <User size={20} className="mr-2" />
                  Customer Selection
                </h2>

                {!selectedCustomer ? (
                  <div>
                    <div className="relative mb-4">
                      <Search
                        size={20}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2"
                        style={{ color: "#888886" }}
                      />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value)
                          setShowCustomerSearch(e.target.value.length > 0)
                        }}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                        style={{
                          backgroundColor: "#FFFFFF",
                          borderColor: "#D9D9D9",
                          color: "#1F1F1E",
                        }}
                        placeholder="Search customers by name, phone, email, or company..."
                      />
                    </div>

                    {showCustomerSearch && searchTerm && (
                      <div
                        className="max-h-60 overflow-y-auto border rounded-lg"
                        style={{ backgroundColor: "#FFFFFF", borderColor: "#D9D9D9" }}
                      >
                        {filteredCustomers.length > 0 ? (
                          filteredCustomers.map((customer) => (
                            <div
                              key={customer.id}
                              onClick={() => handleCustomerSelect(customer)}
                              className="p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                              style={{ borderColor: "#E5E7EB" }}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-semibold" style={{ color: "#1F1F1E" }}>
                                    {customer.name}
                                  </h3>
                                  <p className="text-sm" style={{ color: "#888886" }}>
                                    {customer.company}
                                  </p>
                                  <p className="text-sm" style={{ color: "#888886" }}>
                                    {customer.phone} • {customer.email}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm" style={{ color: "#888886" }}>
                                    {customer.city}, {customer.state}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center" style={{ color: "#888886" }}>
                            No customers found matching your search.
                          </div>
                        )}
                      </div>
                    )}

                    {!showCustomerSearch && (
                      <div className="text-center py-8" style={{ color: "#888886" }}>
                        <User size={48} className="mx-auto mb-4" style={{ color: "#D9D9D9" }} />
                        <p>Start typing to search for existing customers</p>
                        <p className="text-sm mt-2">You can search by name, phone, email, or company</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 rounded-lg border" style={{ backgroundColor: "#FFFFFF", borderColor: "#D9D9D9" }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-lg" style={{ color: "#1F1F1E" }}>
                          {selectedCustomer.name}
                        </h3>
                        <p style={{ color: "#888886" }}>{selectedCustomer.company}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm" style={{ color: "#888886" }}>
                          <span>{selectedCustomer.phone}</span>
                          <span>{selectedCustomer.email}</span>
                        </div>
                        <p className="text-sm mt-1" style={{ color: "#888886" }}>
                          {selectedCustomer.address}, {selectedCustomer.city}, {selectedCustomer.state}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCustomer(null)
                          setFormData((prev) => ({
                            ...prev,
                            customerId: "",
                            customerName: "",
                            customerPhone: "",
                            customerEmail: "",
                            customerAddress: "",
                          }))
                        }}
                        className="px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 border"
                        style={{
                          backgroundColor: "transparent",
                          color: "#888886",
                          borderColor: "#D9D9D9",
                        }}
                      >
                        Change Customer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Visit Details */}
            <div className="p-6 rounded-lg border" style={{ backgroundColor: "#F4F4F1", borderColor: "#D9D9D9" }}>
              <h2 className="text-xl font-bold mb-6 flex items-center" style={{ color: "#1F1F1E" }}>
                <Calendar size={20} className="mr-2" />
                Visit Details
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                      Visit Date *
                    </label>
                    <input
                      type="date"
                      name="visitDate"
                      value={formData.visitDate}
                      onChange={handleInputChange}
                      min={getMinDate()}
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderColor: "#D9D9D9",
                        color: "#1F1F1E",
                      }}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                      Visit Time *
                    </label>
                    <div className="relative">
                      <Clock
                        size={16}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2"
                        style={{ color: "#888886" }}
                      />
                      <input
                        type="time"
                        name="visitTime"
                        value={formData.visitTime}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                        style={{
                          backgroundColor: "#FFFFFF",
                          borderColor: "#D9D9D9",
                          color: "#1F1F1E",
                        }}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                      Visit Type *
                    </label>
                    <select
                      name="visitType"
                      value={formData.visitType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderColor: "#D9D9D9",
                        color: "#1F1F1E",
                      }}
                      required
                    >
                      {visitTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                      Estimated Duration (hours)
                    </label>
                    <select
                      name="estimatedDuration"
                      value={formData.estimatedDuration}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderColor: "#D9D9D9",
                        color: "#1F1F1E",
                      }}
                    >
                      <option value="1">1 Hour</option>
                      <option value="2">2 Hours</option>
                      <option value="3">3 Hours</option>
                      <option value="4">4 Hours</option>
                      <option value="6">Half Day (6 Hours)</option>
                      <option value="8">Full Day (8 Hours)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                    Visit Purpose *
                  </label>
                  <input
                    type="text"
                    name="visitPurpose"
                    value={formData.visitPurpose}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#D9D9D9",
                      color: "#1F1F1E",
                    }}
                    placeholder="e.g., Roof assessment and solar panel placement planning"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Team & Equipment */}
            <div className="p-6 rounded-lg border" style={{ backgroundColor: "#F4F4F1", borderColor: "#D9D9D9" }}>
              <h2 className="text-xl font-bold mb-6 flex items-center" style={{ color: "#1F1F1E" }}>
                <FileText size={20} className="mr-2" />
                Team & Equipment
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                    Team Members
                  </label>
                  <input
                    type="text"
                    name="teamMembers"
                    value={formData.teamMembers}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#D9D9D9",
                      color: "#1F1F1E",
                    }}
                    placeholder="e.g., John (Sales), Mike (Technical), Sarah (Engineer)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                    Equipment Needed
                  </label>
                  <textarea
                    name="equipmentNeeded"
                    value={formData.equipmentNeeded}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all resize-none"
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#D9D9D9",
                      color: "#1F1F1E",
                    }}
                    placeholder="e.g., Measuring tape, Solar irradiance meter, Laptop, Camera, Safety equipment"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                    Special Requirements
                  </label>
                  <textarea
                    name="specialRequirements"
                    value={formData.specialRequirements}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all resize-none"
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#D9D9D9",
                      color: "#1F1F1E",
                    }}
                    placeholder="e.g., Roof access requirements, parking arrangements, safety considerations"
                  />
                </div>
              </div>
            </div>

            {/* Notes & Reminders */}
            <div className="lg:col-span-2">
              <div className="p-6 rounded-lg border" style={{ backgroundColor: "#F4F4F1", borderColor: "#D9D9D9" }}>
                <h2 className="text-xl font-bold mb-6 flex items-center" style={{ color: "#1F1F1E" }}>
                  <FileText size={20} className="mr-2" />
                  Notes & Reminders
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                      Customer Notes
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
                      placeholder="Notes that will be shared with the customer..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                      Internal Notes
                    </label>
                    <textarea
                      name="internalNotes"
                      value={formData.internalNotes}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all resize-none"
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderColor: "#D9D9D9",
                        color: "#1F1F1E",
                      }}
                      placeholder="Internal team notes (not shared with customer)..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                      Reminder Time
                    </label>
                    <select
                      name="reminderTime"
                      value={formData.reminderTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderColor: "#D9D9D9",
                        color: "#1F1F1E",
                      }}
                    >
                      {reminderOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center space-x-3 pt-8">
                    <input
                      type="checkbox"
                      name="notifyCustomer"
                      checked={formData.notifyCustomer}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <label className="text-sm font-medium" style={{ color: "#1F1F1E" }}>
                      Send confirmation to customer
                    </label>
                  </div>
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
              disabled={isSubmitting || !selectedCustomer}
              className="flex items-center space-x-2 px-8 py-3 rounded-lg font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "#F16336",
                color: "#FFFFFF",
              }}
            >
              <Save size={16} />
              <span>{isSubmitting ? "Scheduling Visit..." : "Schedule Visit"}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
