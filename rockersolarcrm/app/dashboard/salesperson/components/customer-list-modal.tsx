"use client"

import { X, Phone, Mail, User, Calendar, Clock } from "lucide-react"
import { useRouter } from "next/navigation"

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
  const router = useRouter()

  // Helper function to calculate days difference
  const getDaysDifference = (date1: string, date2: string = new Date().toISOString().split("T")[0]) => {
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    const diffTime = d2.getTime() - d1.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  // Helper function to determine call status based on dates and interactions
  const determineCallStatus = (customer: any) => {
    const today = new Date().toISOString().split("T")[0]
    const daysSinceSubmission = getDaysDifference(customer.formSubmissionDate, today)

    // If there's a scheduled next call date
    if (customer.nextCallDate) {
      const daysToNextCall = getDaysDifference(today, customer.nextCallDate)
      if (daysToNextCall > 0) return "upcoming"
      if (daysToNextCall < 0) return "overdue"
    }

    // If no contact has been made and form was submitted more than 2 days ago
    if (!customer.lastContactDate && daysSinceSubmission > 2) {
      return "overdue"
    }

    // If last contact was more than 7 days ago
    if (customer.lastContactDate) {
      const daysSinceContact = getDaysDifference(customer.lastContactDate, today)
      if (daysSinceContact > 7) return "overdue"
    }

    // Default to followup for new submissions or recent contacts
    return "followup"
  }

  // Mock customer data with realistic Google form submission scenarios
  const mockCustomers: Customer[] = [
    {
      id: "1",
      serialNo: 1,
      name: "John Doe",
      phone: "+91 9876543210",
      email: "john.doe@email.com",
      callStatus: "followup",
      leadStatus: "newlead",
      company: "Tech Solutions Pvt Ltd",
      formSubmissionDate: "2024-01-18", // 2 days ago
      lastContactDate: "2024-01-19", // 1 day ago
      nextCallDate: "2024-01-22",
      salespersonNotes: "Interested in 5kW system, requested callback",
    },
    {
      id: "2",
      serialNo: 2,
      name: "Jane Smith",
      phone: "+91 9876543211",
      email: "jane.smith@email.com",
      callStatus: "upcoming",
      leadStatus: "inprocess",
      company: "Green Energy Corp",
      formSubmissionDate: "2024-01-15",
      lastContactDate: "2024-01-17",
      nextCallDate: "2024-01-23", // Tomorrow
      salespersonNotes: "Site visit scheduled for next week",
    },
    {
      id: "3",
      serialNo: 3,
      name: "Mike Johnson",
      phone: "+91 9876543212",
      email: "mike.johnson@email.com",
      callStatus: "overdue",
      leadStatus: "sitevisits",
      company: "Solar Innovations Ltd",
      formSubmissionDate: "2024-01-10", // 10 days ago
      lastContactDate: "2024-01-12", // 8 days ago - overdue
      daysOverdue: 8,
      salespersonNotes: "No response to last 3 calls",
    },
    {
      id: "4",
      serialNo: 4,
      name: "Sarah Wilson",
      phone: "+91 9876543213",
      email: "sarah.wilson@email.com",
      callStatus: "followup",
      leadStatus: "estimatesent",
      company: "Eco Solutions Inc",
      formSubmissionDate: "2024-01-16",
      lastContactDate: "2024-01-18",
      salespersonNotes: "Estimate sent, waiting for approval",
    },
    {
      id: "5",
      serialNo: 5,
      name: "David Brown",
      phone: "+91 9876543214",
      email: "david.brown@email.com",
      callStatus: "upcoming",
      leadStatus: "leadwon",
      company: "Renewable Tech Pvt Ltd",
      formSubmissionDate: "2024-01-14",
      lastContactDate: "2024-01-19",
      nextCallDate: "2024-01-25",
      salespersonNotes: "Deal closed, installation planning call",
    },
    {
      id: "6",
      serialNo: 6,
      name: "Lisa Anderson",
      phone: "+91 9876543215",
      email: "lisa.anderson@email.com",
      callStatus: "overdue",
      leadStatus: "newlead",
      company: "Smart Energy Solutions",
      formSubmissionDate: "2024-01-08", // 12 days ago
      // No last contact date - never contacted
      daysOverdue: 12,
      salespersonNotes: "Form submitted but never contacted",
    },
    {
      id: "7",
      serialNo: 7,
      name: "Robert Taylor",
      phone: "+91 9876543216",
      email: "robert.taylor@email.com",
      callStatus: "followup",
      leadStatus: "inprocess",
      company: "Future Power Systems",
      formSubmissionDate: "2024-01-17",
      lastContactDate: "2024-01-18",
      salespersonNotes: "Requested to call back after budget approval",
    },
    {
      id: "8",
      serialNo: 8,
      name: "Emily Davis",
      phone: "+91 9876543217",
      email: "emily.davis@email.com",
      callStatus: "upcoming",
      leadStatus: "sitevisits",
      company: "Clean Energy Partners",
      formSubmissionDate: "2024-01-16",
      lastContactDate: "2024-01-19",
      nextCallDate: "2024-01-24",
      salespersonNotes: "Site visit completed, quote preparation call scheduled",
    },
    {
      id: "9",
      serialNo: 9,
      name: "Alex Kumar",
      phone: "+91 9876543218",
      email: "alex.kumar@email.com",
      callStatus: "followup",
      leadStatus: "newlead",
      company: "Tech Innovations",
      formSubmissionDate: "2024-01-19", // Yesterday - new submission
      salespersonNotes: "New Google form submission - needs initial contact",
    },
    {
      id: "10",
      serialNo: 10,
      name: "Priya Sharma",
      phone: "+91 9876543219",
      email: "priya.sharma@email.com",
      callStatus: "overdue",
      leadStatus: "estimatesent",
      company: "Green Solutions Ltd",
      formSubmissionDate: "2024-01-05",
      lastContactDate: "2024-01-10", // 10 days ago
      daysOverdue: 10,
      salespersonNotes: "Estimate sent but no response for 10 days",
    },
  ]

  // Update call status dynamically based on business logic
  const customersWithUpdatedStatus = mockCustomers.map((customer) => ({
    ...customer,
    callStatus: determineCallStatus(customer),
  }))

  // Filter customers based on KPI type
  const filteredCustomers = customersWithUpdatedStatus.filter((customer) => {
    if (kpiType === "followup" || kpiType === "overdue" || kpiType === "upcoming") {
      return customer.callStatus === kpiType
    } else {
      return customer.leadStatus === kpiType
    }
  })

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
                {filteredCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    onClick={() => handleCustomerClick(customer.id)}
                    className="p-5 rounded-lg border cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] hover:border-orange-300"
                    style={{ backgroundColor: "#FFFFFF", borderColor: "#D9D9D9" }}
                  >
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

                      {/* Status and Priority */}
                      <div className="text-right">
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
      </div>
    </div>
  )
}
