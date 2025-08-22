"use client"

import { useState } from "react"
import { ArrowLeft, Phone, Mail, MapPin, Calendar, Plus, Send, FileText, MessageSquare, Paperclip } from "lucide-react"
import Link from "next/link"
import AddCallLogModal from "./components/add-call-log-modal"
import ContentLibraryModal from "./components/content-library-modal"

interface CustomerProfile {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
  roofArea: string
  monthlyBill: string
  energyRequirement: string
  roofType: string
  leadSource: string
  designation: string
  company: string
  callStatus: string
  leadStatus: string
}

interface CallLog {
  id: string
  date: string
  time: string
  duration: string
  notes: string
  outcome: string
}

export default function CustomerProfile({ params }: { params: { id: string } }) {
  const [showAddCallLog, setShowAddCallLog] = useState(false)
  const [showContentLibrary, setShowContentLibrary] = useState(false)

  // Mock customer data with complete profile
  const customer: CustomerProfile = {
    id: params.id,
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+91 9876543210",
    address: "123 Solar Street, Green Colony",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    roofArea: "1200 sq ft",
    monthlyBill: "₹8,500",
    energyRequirement: "5 kW",
    roofType: "Concrete",
    leadSource: "Website",
    designation: "Manager",
    company: "Tech Solutions Pvt Ltd",
    callStatus: "upcoming",
    leadStatus: "inprocess",
  }

  // Mock call logs
  const [callLogs, setCallLogs] = useState<CallLog[]>([
    {
      id: "1",
      date: "2024-01-15",
      time: "10:30 AM",
      duration: "15 mins",
      notes: "Discussed solar panel requirements. Customer interested in 5kW system.",
      outcome: "Follow-up scheduled",
    },
    {
      id: "2",
      date: "2024-01-12",
      time: "2:15 PM",
      duration: "8 mins",
      notes: "Initial inquiry call. Explained our services and pricing structure.",
      outcome: "Information sent via email",
    },
  ])

  const handleWhatsAppSend = (content: string, files?: string[]) => {
    const message = encodeURIComponent(content)
    const whatsappUrl = `https://wa.me/${customer.phone.replace(/[^0-9]/g, "")}?text=${message}`
    window.open(whatsappUrl, "_blank")
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
              {customer.name}
            </h1>
            <p style={{ color: "#888886" }}>Customer Profile</p>
          </div>
        </div>
      </header>

      <main className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="p-6 rounded-lg border" style={{ backgroundColor: "#F4F4F1", borderColor: "#D9D9D9" }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: "#1F1F1E" }}>
                Customer Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Phone size={16} style={{ color: "#888886" }} />
                    <span style={{ color: "#1F1F1E" }}>{customer.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail size={16} style={{ color: "#888886" }} />
                    <span style={{ color: "#1F1F1E" }}>{customer.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin size={16} style={{ color: "#888886" }} />
                    <span style={{ color: "#1F1F1E" }}>
                      {customer.address}, {customer.city}, {customer.state} - {customer.pincode}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium" style={{ color: "#888886" }}>
                      Company:
                    </span>
                    <p style={{ color: "#1F1F1E" }}>{customer.company}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium" style={{ color: "#888886" }}>
                      Designation:
                    </span>
                    <p style={{ color: "#1F1F1E" }}>{customer.designation}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium" style={{ color: "#888886" }}>
                      Lead Source:
                    </span>
                    <p style={{ color: "#1F1F1E" }}>{customer.leadSource}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Solar Requirements */}
            <div className="p-6 rounded-lg border" style={{ backgroundColor: "#F4F4F1", borderColor: "#D9D9D9" }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: "#1F1F1E" }}>
                Solar Requirements
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-sm font-medium" style={{ color: "#888886" }}>
                    Roof Area:
                  </span>
                  <p className="font-semibold" style={{ color: "#1F1F1E" }}>
                    {customer.roofArea}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium" style={{ color: "#888886" }}>
                    Monthly Bill:
                  </span>
                  <p className="font-semibold" style={{ color: "#1F1F1E" }}>
                    {customer.monthlyBill}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium" style={{ color: "#888886" }}>
                    Energy Req:
                  </span>
                  <p className="font-semibold" style={{ color: "#1F1F1E" }}>
                    {customer.energyRequirement}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium" style={{ color: "#888886" }}>
                    Roof Type:
                  </span>
                  <p className="font-semibold" style={{ color: "#1F1F1E" }}>
                    {customer.roofType}
                  </p>
                </div>
              </div>
            </div>

            {/* Call Logs */}
            <div className="p-6 rounded-lg border" style={{ backgroundColor: "#F4F4F1", borderColor: "#D9D9D9" }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold" style={{ color: "#1F1F1E" }}>
                  Call Logs
                </h2>
                <button
                  onClick={() => setShowAddCallLog(true)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105"
                  style={{ backgroundColor: "#F16336", color: "#FFFFFF" }}
                >
                  <Plus size={16} />
                  <span>Add Call Log</span>
                </button>
              </div>
              <div className="space-y-4">
                {callLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 rounded-lg border"
                    style={{ backgroundColor: "#FFFFFF", borderColor: "#D9D9D9" }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-4">
                        <Calendar size={16} style={{ color: "#888886" }} />
                        <span className="font-medium" style={{ color: "#1F1F1E" }}>
                          {log.date} at {log.time}
                        </span>
                        <span className="text-sm" style={{ color: "#888886" }}>
                          Duration: {log.duration}
                        </span>
                      </div>
                    </div>
                    <p className="mb-2" style={{ color: "#1F1F1E" }}>
                      {log.notes}
                    </p>
                    <span
                      className="px-2 py-1 rounded text-xs font-medium"
                      style={{ backgroundColor: "#E0F2FE", color: "#0369A1" }}
                    >
                      {log.outcome}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <div className="p-6 rounded-lg border" style={{ backgroundColor: "#F4F4F1", borderColor: "#D9D9D9" }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: "#1F1F1E" }}>
                Status
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium" style={{ color: "#888886" }}>
                    Call Status:
                  </span>
                  <p
                    className="px-2 py-1 rounded text-xs font-medium inline-block mt-1"
                    style={{
                      backgroundColor: customer.callStatus === "followup" ? "#FEF3C7" : "#D1FAE5",
                      color: customer.callStatus === "followup" ? "#92400E" : "#065F46",
                    }}
                  >
                    {customer.callStatus.charAt(0).toUpperCase() + customer.callStatus.slice(1)}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium" style={{ color: "#888886" }}>
                    Lead Status:
                  </span>
                  <p
                    className="px-2 py-1 rounded text-xs font-medium inline-block mt-1"
                    style={{ backgroundColor: "#E0F2FE", color: "#0369A1" }}
                  >
                    {customer.leadStatus.charAt(0).toUpperCase() + customer.leadStatus.slice(1)}
                  </p>
                </div>
              </div>
            </div>

            {/* Content & Communication */}
            <div className="p-6 rounded-lg border" style={{ backgroundColor: "#F4F4F1", borderColor: "#D9D9D9" }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: "#1F1F1E" }}>
                Content & Communication
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowContentLibrary(true)}
                  className="w-full flex items-center space-x-2 p-3 rounded-lg font-medium transition-all hover:scale-105 border"
                  style={{ backgroundColor: "transparent", color: "#1F1F1E", borderColor: "#888886" }}
                >
                  <MessageSquare size={16} />
                  <span>WhatsApp Templates</span>
                </button>
                <button
                  onClick={() => setShowContentLibrary(true)}
                  className="w-full flex items-center space-x-2 p-3 rounded-lg font-medium transition-all hover:scale-105 border"
                  style={{ backgroundColor: "transparent", color: "#1F1F1E", borderColor: "#888886" }}
                >
                  <FileText size={16} />
                  <span>Brochures & Quotes</span>
                </button>
                <button
                  onClick={() => setShowContentLibrary(true)}
                  className="w-full flex items-center space-x-2 p-3 rounded-lg font-medium transition-all hover:scale-105 border"
                  style={{ backgroundColor: "transparent", color: "#1F1F1E", borderColor: "#888886" }}
                >
                  <Paperclip size={16} />
                  <span>Files & Documents</span>
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-6 rounded-lg border" style={{ backgroundColor: "#F4F4F1", borderColor: "#D9D9D9" }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: "#1F1F1E" }}>
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => window.open(`tel:${customer.phone}`, "_self")}
                  className="w-full flex items-center space-x-2 p-3 rounded-lg font-medium transition-all hover:scale-105"
                  style={{ backgroundColor: "#F16336", color: "#FFFFFF" }}
                >
                  <Phone size={16} />
                  <span>Call Customer</span>
                </button>
                <button
                  onClick={() => handleWhatsAppSend("Hello! This is from ROCKER SOLAR. How can I help you today?")}
                  className="w-full flex items-center space-x-2 p-3 rounded-lg font-medium transition-all hover:scale-105"
                  style={{ backgroundColor: "#25D366", color: "#FFFFFF" }}
                >
                  <Send size={16} />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {showAddCallLog && (
        <AddCallLogModal
          isOpen={showAddCallLog}
          onClose={() => setShowAddCallLog(false)}
          onSave={(newLog) => {
            setCallLogs([newLog, ...callLogs])
            setShowAddCallLog(false)
          }}
        />
      )}

      {showContentLibrary && (
        <ContentLibraryModal
          isOpen={showContentLibrary}
          onClose={() => setShowContentLibrary(false)}
          onSend={handleWhatsAppSend}
          customerName={customer.name}
        />
      )}
    </div>
  )
}
