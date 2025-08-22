"use client"

import { useState } from "react"
import { X, Calendar, CheckCircle, XCircle, Clock, User, Mail } from "lucide-react"

interface TeamMember {
  id: string
  name: string
  email: string
  designation: string
  status: "present" | "absent" | "late"
  checkInTime?: string
  absenceReason?: string
  absenceType?: string
  performance: {
    callsMade: number
    leadsConverted: number
    revenue: number
    target: number
  }
}

interface AttendanceStats {
  present: number
  absent: number
  late: number
  total: number
}

interface AttendanceModalProps {
  isOpen: boolean
  onClose: () => void
  teamMembers: TeamMember[]
  attendanceStats: AttendanceStats
}

export default function AttendanceModal({ isOpen, onClose, teamMembers, attendanceStats }: AttendanceModalProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)

  if (!isOpen) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return { bg: "#D1FAE5", text: "#065F46", dot: "#10B981" }
      case "absent":
        return { bg: "#FEE2E2", text: "#991B1B", dot: "#EF4444" }
      case "late":
        return { bg: "#FEF3C7", text: "#92400E", dot: "#F59E0B" }
      default:
        return { bg: "#F3F4F6", text: "#374151", dot: "#6B7280" }
    }
  }

  const handleApproveAbsence = (memberId: string) => {
    // Handle absence approval logic
    console.log("Approving absence for member:", memberId)
  }

  const handleRejectAbsence = (memberId: string) => {
    // Handle absence rejection logic
    console.log("Rejecting absence for member:", memberId)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }} onClick={onClose} />

      {/* Modal */}
      <div
        className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-xl"
        style={{ backgroundColor: "#F4F4F1" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: "#D9D9D9", backgroundColor: "#FFFFFF" }}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg" style={{ backgroundColor: "#F16336" }}>
              <Calendar size={24} style={{ color: "#FFFFFF" }} />
            </div>
            <div>
              <h2 className="text-2xl font-bold" style={{ color: "#1F1F1E" }}>
                Team Attendance Management
              </h2>
              <p className="text-sm" style={{ color: "#888886" }}>
                Monitor and manage team attendance and absence requests
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors hover:bg-gray-100"
            style={{ color: "#888886" }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6">
            {/* Date Selector and Stats */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium" style={{ color: "#1F1F1E" }}>
                  Select Date:
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 rounded-lg border"
                  style={{ backgroundColor: "#FFFFFF", borderColor: "#D9D9D9", color: "#1F1F1E" }}
                />
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm font-medium" style={{ color: "#1F1F1E" }}>
                    Present: {attendanceStats.present}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm font-medium" style={{ color: "#1F1F1E" }}>
                    Absent: {attendanceStats.absent}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-sm font-medium" style={{ color: "#1F1F1E" }}>
                    Late: {attendanceStats.late}
                  </span>
                </div>
              </div>
            </div>

            {/* Team Members List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="p-6 rounded-lg border"
                  style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB" }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "#F16336" }}
                      >
                        <User size={20} style={{ color: "#FFFFFF" }} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold" style={{ color: "#1F1F1E" }}>
                          {member.name}
                        </h3>
                        <p className="text-sm" style={{ color: "#888886" }}>
                          {member.designation}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Mail size={12} style={{ color: "#888886" }} />
                          <span className="text-xs" style={{ color: "#888886" }}>
                            {member.email}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: getStatusColor(member.status).bg,
                        color: getStatusColor(member.status).text,
                      }}
                    >
                      {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                    </span>
                  </div>

                  {/* Status Details */}
                  <div className="space-y-3">
                    {member.checkInTime && (
                      <div className="flex items-center space-x-2">
                        <Clock size={16} style={{ color: "#888886" }} />
                        <span className="text-sm" style={{ color: "#1F1F1E" }}>
                          Check-in: {member.checkInTime}
                        </span>
                      </div>
                    )}

                    {member.absenceReason && (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <XCircle size={16} style={{ color: "#DC2626" }} />
                          <span className="text-sm font-medium" style={{ color: "#DC2626" }}>
                            Absence Request
                          </span>
                        </div>
                        <div className="ml-6 space-y-1">
                          <p className="text-sm" style={{ color: "#1F1F1E" }}>
                            <strong>Type:</strong> {member.absenceType}
                          </p>
                          <p className="text-sm" style={{ color: "#1F1F1E" }}>
                            <strong>Reason:</strong> {member.absenceReason}
                          </p>
                        </div>
                        <div className="ml-6 flex space-x-2 mt-3">
                          <button
                            onClick={() => handleApproveAbsence(member.id)}
                            className="flex items-center space-x-1 px-3 py-1 rounded-lg text-sm font-medium transition-all hover:scale-105"
                            style={{ backgroundColor: "#10B981", color: "#FFFFFF" }}
                          >
                            <CheckCircle size={14} />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleRejectAbsence(member.id)}
                            className="flex items-center space-x-1 px-3 py-1 rounded-lg text-sm font-medium transition-all hover:scale-105"
                            style={{ backgroundColor: "#EF4444", color: "#FFFFFF" }}
                          >
                            <XCircle size={14} />
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Performance Summary */}
                    <div className="pt-3 border-t" style={{ borderColor: "#E5E7EB" }}>
                      <h4 className="text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                        Today's Performance
                      </h4>
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div>
                          <p className="text-lg font-bold" style={{ color: "#F16336" }}>
                            {member.performance.callsMade}
                          </p>
                          <p className="text-xs" style={{ color: "#888886" }}>
                            Calls
                          </p>
                        </div>
                        <div>
                          <p className="text-lg font-bold" style={{ color: "#3B82F6" }}>
                            {member.performance.leadsConverted}
                          </p>
                          <p className="text-xs" style={{ color: "#888886" }}>
                            Leads
                          </p>
                        </div>
                        <div>
                          <p className="text-lg font-bold" style={{ color: "#10B981" }}>
                            ₹{(member.performance.revenue / 100000).toFixed(1)}L
                          </p>
                          <p className="text-xs" style={{ color: "#888886" }}>
                            Revenue
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Attendance Summary */}
            <div className="mt-8 p-6 rounded-lg border" style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB" }}>
              <h3 className="text-xl font-bold mb-4" style={{ color: "#1F1F1E" }}>
                Attendance Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="p-4 rounded-lg" style={{ backgroundColor: "#D1FAE5" }}>
                    <CheckCircle size={32} style={{ color: "#059669" }} className="mx-auto mb-2" />
                    <p className="text-2xl font-bold" style={{ color: "#059669" }}>
                      {attendanceStats.present}
                    </p>
                    <p className="text-sm" style={{ color: "#065F46" }}>
                      Present
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="p-4 rounded-lg" style={{ backgroundColor: "#FEE2E2" }}>
                    <XCircle size={32} style={{ color: "#DC2626" }} className="mx-auto mb-2" />
                    <p className="text-2xl font-bold" style={{ color: "#DC2626" }}>
                      {attendanceStats.absent}
                    </p>
                    <p className="text-sm" style={{ color: "#991B1B" }}>
                      Absent
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="p-4 rounded-lg" style={{ backgroundColor: "#FEF3C7" }}>
                    <Clock size={32} style={{ color: "#F59E0B" }} className="mx-auto mb-2" />
                    <p className="text-2xl font-bold" style={{ color: "#F59E0B" }}>
                      {attendanceStats.late}
                    </p>
                    <p className="text-sm" style={{ color: "#92400E" }}>
                      Late
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="p-4 rounded-lg" style={{ backgroundColor: "#E0F2FE" }}>
                    <User size={32} style={{ color: "#0369A1" }} className="mx-auto mb-2" />
                    <p className="text-2xl font-bold" style={{ color: "#0369A1" }}>
                      {attendanceStats.total}
                    </p>
                    <p className="text-sm" style={{ color: "#0C4A6E" }}>
                      Total Team
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-lg font-medium" style={{ color: "#1F1F1E" }}>
                  Attendance Rate:{" "}
                  <span style={{ color: "#059669" }}>
                    {Math.round((attendanceStats.present / attendanceStats.total) * 100)}%
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
