"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  TrendingUp,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  UserCheck,
  UserX,
  Target,
  DollarSign,
  Phone,
  Activity,
  Bell,
  BarChart3,
} from "lucide-react"
import AttendanceModal from "./components/attendance-modal"
import TeamPerformanceModal from "./components/team-performance-modal"
import GrowthAnalyticsModal from "./components/growth-analytics-modal"
import AnalyticsDashboard from "./components/analytics-dashboard"

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

interface CompanyMetrics {
  totalRevenue: number
  monthlyGrowth: number
  totalLeads: number
  conversionRate: number
  activeCustomers: number
  teamSize: number
}

export default function ManagerDashboard() {
  const router = useRouter()
  const [selectedModal, setSelectedModal] = useState<string | null>(null)
  const [selectedTeamMember, setSelectedTeamMember] = useState<TeamMember | null>(null)
  const [managerInfo, setManagerInfo] = useState({ name: "", email: "", team: "" })
  const [currentDate, setCurrentDate] = useState("")
  const [showAnalytics, setShowAnalytics] = useState(false)

  // Mock team data - in real app this would come from API
  const [teamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "John Sales",
      email: "john.sales@rockersolar.com",
      designation: "SalesPerson",
      status: "present",
      checkInTime: "09:15 AM",
      performance: {
        callsMade: 45,
        leadsConverted: 12,
        revenue: 850000,
        target: 1000000,
      },
    },
    {
      id: "2",
      name: "Sarah Wilson",
      email: "sarah.wilson@rockersolar.com",
      designation: "SalesPerson",
      status: "absent",
      absenceReason: "Medical Appointment",
      absenceType: "Sick Leave",
      performance: {
        callsMade: 38,
        leadsConverted: 9,
        revenue: 720000,
        target: 800000,
      },
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike.johnson@rockersolar.com",
      designation: "SalesPerson",
      status: "present",
      checkInTime: "08:45 AM",
      performance: {
        callsMade: 52,
        leadsConverted: 15,
        revenue: 1200000,
        target: 1100000,
      },
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily.davis@rockersolar.com",
      designation: "SalesPerson",
      status: "late",
      checkInTime: "10:30 AM",
      performance: {
        callsMade: 35,
        leadsConverted: 8,
        revenue: 640000,
        target: 900000,
      },
    },
    {
      id: "5",
      name: "David Brown",
      email: "david.brown@rockersolar.com",
      designation: "SalesPerson",
      status: "present",
      checkInTime: "09:00 AM",
      performance: {
        callsMade: 41,
        leadsConverted: 11,
        revenue: 890000,
        target: 950000,
      },
    },
  ])

  // Mock company metrics
  const [companyMetrics] = useState<CompanyMetrics>({
    totalRevenue: 4300000,
    monthlyGrowth: 15.8,
    totalLeads: 248,
    conversionRate: 22.3,
    activeCustomers: 156,
    teamSize: 5,
  })

  useEffect(() => {
    // Get manager info from localStorage
    setManagerInfo({
      name: localStorage.getItem("userName") || "Manager",
      email: localStorage.getItem("userEmail") || "manager@rockersolar.com",
      team: "Sales Team Alpha", // This could be dynamic based on manager
    })

    // Set current date
    setCurrentDate(
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    )
  }, [])

  // Calculate attendance statistics
  const attendanceStats = {
    present: teamMembers.filter((member) => member.status === "present").length,
    absent: teamMembers.filter((member) => member.status === "absent").length,
    late: teamMembers.filter((member) => member.status === "late").length,
    total: teamMembers.length,
  }

  // Calculate team performance
  const teamPerformance = {
    totalCalls: teamMembers.reduce((sum, member) => sum + member.performance.callsMade, 0),
    totalLeads: teamMembers.reduce((sum, member) => sum + member.performance.leadsConverted, 0),
    totalRevenue: teamMembers.reduce((sum, member) => sum + member.performance.revenue, 0),
    totalTarget: teamMembers.reduce((sum, member) => sum + member.performance.target, 0),
  }

  const performancePercentage = Math.round((teamPerformance.totalRevenue / teamPerformance.totalTarget) * 100)

  // Dashboard KPIs
  const dashboardKPIs = [
    {
      title: "Team Attendance",
      value: `${attendanceStats.present}/${attendanceStats.total}`,
      subtitle: `${Math.round((attendanceStats.present / attendanceStats.total) * 100)}% Present`,
      icon: UserCheck,
      color: "#059669",
      onClick: () => setSelectedModal("attendance"),
    },
    {
      title: "Monthly Revenue",
      value: `₹${(teamPerformance.totalRevenue / 100000).toFixed(1)}L`,
      subtitle: `${performancePercentage}% of Target`,
      icon: DollarSign,
      color: "#F16336",
      onClick: () => setSelectedModal("performance"),
    },
    {
      title: "Total Leads",
      value: companyMetrics.totalLeads.toString(),
      subtitle: `${companyMetrics.conversionRate}% Conversion`,
      icon: Target,
      color: "#3B82F6",
      onClick: () => setSelectedModal("analytics"),
    },
    {
      title: "Growth Rate",
      value: `+${companyMetrics.monthlyGrowth}%`,
      subtitle: "Month over Month",
      icon: TrendingUp,
      color: "#10B981",
      onClick: () => setSelectedModal("analytics"),
    },
    {
      title: "Advanced Analytics",
      value: "View",
      subtitle: "PowerBI Dashboard",
      icon: BarChart3,
      color: "#8B5CF6",
      onClick: () => setShowAnalytics(true),
    },
  ]

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

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`
    }
    return `₹${(amount / 1000).toFixed(0)}K`
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "#F4F4F1" }}>
              Manager Dashboard
            </h1>
            <p style={{ color: "#888886" }}>
              {managerInfo.team} • {currentDate}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button
              className="relative p-2 rounded-lg transition-colors hover:bg-gray-800"
              style={{ color: "#888886" }}
            >
              <Bell size={20} />
              {attendanceStats.absent > 0 && (
                <div
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: "#EF4444", color: "#FFFFFF" }}
                >
                  {attendanceStats.absent}
                </div>
              )}
            </button>

            <div className="flex items-center space-x-2">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#F16336" }}
              >
                <span className="text-sm font-semibold" style={{ color: "#FFFFFF" }}>
                  {managerInfo.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <span className="font-medium" style={{ color: "#D9D9D9" }}>
                  {managerInfo.name}
                </span>
                <p className="text-xs" style={{ color: "#888886" }}>
                  Manager
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6">
        {/* Key Metrics */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6" style={{ color: "#F4F4F1" }}>
            Key Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dashboardKPIs.map((kpi, index) => (
              <div
                key={index}
                onClick={kpi.onClick}
                className="p-6 rounded-xl border transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, #F4F4F1 0%, #FFFFFF 100%)`,
                  borderColor: "#D9D9D9",
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: kpi.color }}>
                    <kpi.icon size={24} style={{ color: "#FFFFFF" }} />
                  </div>
                  <Activity size={16} style={{ color: kpi.color }} />
                </div>
                <h3 className="text-2xl font-bold mb-1" style={{ color: "#1F1F1E" }}>
                  {kpi.value}
                </h3>
                <p className="text-sm font-medium" style={{ color: "#888886" }}>
                  {kpi.title}
                </p>
                <p className="text-xs mt-1" style={{ color: kpi.color }}>
                  {kpi.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Attendance Overview */}
          <div className="lg:col-span-2">
            <div className="p-6 rounded-lg border" style={{ backgroundColor: "#F4F4F1", borderColor: "#D9D9D9" }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold" style={{ color: "#1F1F1E" }}>
                  Team Attendance Today
                </h3>
                <button
                  onClick={() => setSelectedModal("attendance")}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105"
                  style={{ backgroundColor: "#F16336", color: "#FFFFFF" }}
                >
                  <Calendar size={16} />
                  <span>View All</span>
                </button>
              </div>

              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                    style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB" }}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getStatusColor(member.status).dot }}
                      />
                      <div>
                        <h4 className="font-semibold" style={{ color: "#1F1F1E" }}>
                          {member.name}
                        </h4>
                        <p className="text-sm" style={{ color: "#888886" }}>
                          {member.designation}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: getStatusColor(member.status).bg,
                          color: getStatusColor(member.status).text,
                        }}
                      >
                        {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                      </span>
                      {member.checkInTime && (
                        <p className="text-xs mt-1" style={{ color: "#888886" }}>
                          {member.checkInTime}
                        </p>
                      )}
                      {member.absenceReason && (
                        <p className="text-xs mt-1" style={{ color: "#DC2626" }}>
                          {member.absenceReason}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            {/* Attendance Summary */}
            <div className="p-6 rounded-lg border" style={{ backgroundColor: "#F4F4F1", borderColor: "#D9D9D9" }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: "#1F1F1E" }}>
                Attendance Summary
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm" style={{ color: "#1F1F1E" }}>
                      Present
                    </span>
                  </div>
                  <span className="font-semibold" style={{ color: "#1F1F1E" }}>
                    {attendanceStats.present}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-sm" style={{ color: "#1F1F1E" }}>
                      Absent
                    </span>
                  </div>
                  <span className="font-semibold" style={{ color: "#1F1F1E" }}>
                    {attendanceStats.absent}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-sm" style={{ color: "#1F1F1E" }}>
                      Late
                    </span>
                  </div>
                  <span className="font-semibold" style={{ color: "#1F1F1E" }}>
                    {attendanceStats.late}
                  </span>
                </div>
              </div>
            </div>

            {/* Performance Summary */}
            <div className="p-6 rounded-lg border" style={{ backgroundColor: "#F4F4F1", borderColor: "#D9D9D9" }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: "#1F1F1E" }}>
                Team Performance
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: "#888886" }}>
                    Total Calls
                  </span>
                  <span className="font-semibold" style={{ color: "#1F1F1E" }}>
                    {teamPerformance.totalCalls}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: "#888886" }}>
                    Leads Converted
                  </span>
                  <span className="font-semibold" style={{ color: "#1F1F1E" }}>
                    {teamPerformance.totalLeads}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: "#888886" }}>
                    Revenue
                  </span>
                  <span className="font-semibold" style={{ color: "#1F1F1E" }}>
                    {formatCurrency(teamPerformance.totalRevenue)}
                  </span>
                </div>
                <div className="pt-2 border-t" style={{ borderColor: "#E5E7EB" }}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium" style={{ color: "#1F1F1E" }}>
                      Target Achievement
                    </span>
                    <span className="font-bold" style={{ color: performancePercentage >= 100 ? "#059669" : "#F16336" }}>
                      {performancePercentage}%
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(performancePercentage, 100)}%`,
                        backgroundColor: performancePercentage >= 100 ? "#059669" : "#F16336",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activities */}
          <div className="p-6 rounded-lg border" style={{ backgroundColor: "#F4F4F1", borderColor: "#D9D9D9" }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: "#1F1F1E" }}>
              Recent Activities
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 rounded-lg" style={{ backgroundColor: "#FFFFFF" }}>
                <div className="p-2 rounded-full" style={{ backgroundColor: "#D1FAE5" }}>
                  <CheckCircle size={16} style={{ color: "#059669" }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: "#1F1F1E" }}>
                    Mike Johnson closed a deal worth ₹12L
                  </p>
                  <p className="text-xs" style={{ color: "#888886" }}>
                    2 hours ago
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg" style={{ backgroundColor: "#FFFFFF" }}>
                <div className="p-2 rounded-full" style={{ backgroundColor: "#FEE2E2" }}>
                  <AlertCircle size={16} style={{ color: "#DC2626" }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: "#1F1F1E" }}>
                    Sarah Wilson submitted absence request
                  </p>
                  <p className="text-xs" style={{ color: "#888886" }}>
                    4 hours ago
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg" style={{ backgroundColor: "#FFFFFF" }}>
                <div className="p-2 rounded-full" style={{ backgroundColor: "#E0F2FE" }}>
                  <Phone size={16} style={{ color: "#0369A1" }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: "#1F1F1E" }}>
                    John Sales completed 15 calls today
                  </p>
                  <p className="text-xs" style={{ color: "#888886" }}>
                    6 hours ago
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Alerts & Notifications */}
          <div className="p-6 rounded-lg border" style={{ backgroundColor: "#F4F4F1", borderColor: "#D9D9D9" }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: "#1F1F1E" }}>
              Alerts & Notifications
            </h3>
            <div className="space-y-4">
              {attendanceStats.absent > 0 && (
                <div
                  className="p-4 rounded-lg border-l-4"
                  style={{ backgroundColor: "#FEF2F2", borderColor: "#DC2626" }}
                >
                  <div className="flex items-center space-x-2">
                    <UserX size={16} style={{ color: "#DC2626" }} />
                    <h4 className="font-semibold" style={{ color: "#DC2626" }}>
                      Attendance Alert
                    </h4>
                  </div>
                  <p className="text-sm mt-1" style={{ color: "#991B1B" }}>
                    {attendanceStats.absent} team member(s) are absent today. Review absence requests.
                  </p>
                </div>
              )}
              <div className="p-4 rounded-lg border-l-4" style={{ backgroundColor: "#F0FDF4", borderColor: "#059669" }}>
                <div className="flex items-center space-x-2">
                  <Target size={16} style={{ color: "#059669" }} />
                  <h4 className="font-semibold" style={{ color: "#059669" }}>
                    Performance Update
                  </h4>
                </div>
                <p className="text-sm mt-1" style={{ color: "#065F46" }}>
                  Team is at {performancePercentage}% of monthly target. Great progress!
                </p>
              </div>
              <div className="p-4 rounded-lg border-l-4" style={{ backgroundColor: "#FFFBEB", borderColor: "#F59E0B" }}>
                <div className="flex items-center space-x-2">
                  <Clock size={16} style={{ color: "#F59E0B" }} />
                  <h4 className="font-semibold" style={{ color: "#F59E0B" }}>
                    Follow-up Reminder
                  </h4>
                </div>
                <p className="text-sm mt-1" style={{ color: "#92400E" }}>
                  15 leads require follow-up calls this week. Assign to team members.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {selectedModal === "attendance" && (
        <AttendanceModal
          isOpen={true}
          onClose={() => setSelectedModal(null)}
          teamMembers={teamMembers}
          attendanceStats={attendanceStats}
        />
      )}

      {selectedModal === "performance" && (
        <TeamPerformanceModal
          isOpen={true}
          onClose={() => setSelectedModal(null)}
          teamMembers={teamMembers}
          teamPerformance={teamPerformance}
        />
      )}

      {selectedModal === "analytics" && (
        <GrowthAnalyticsModal isOpen={true} onClose={() => setSelectedModal(null)} companyMetrics={companyMetrics} />
      )}
      {showAnalytics && <AnalyticsDashboard isOpen={true} onClose={() => setShowAnalytics(false)} />}
    </div>
  )
}
