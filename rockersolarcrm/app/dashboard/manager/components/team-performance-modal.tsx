"use client"

import { useState } from "react"
import { X, Trophy, Target, Phone, DollarSign, TrendingUp, Star } from "lucide-react"

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

interface TeamPerformance {
  totalCalls: number
  totalLeads: number
  totalRevenue: number
  totalTarget: number
}

interface TeamPerformanceModalProps {
  isOpen: boolean
  onClose: () => void
  teamMembers: TeamMember[]
  teamPerformance: TeamPerformance
}

export default function TeamPerformanceModal({
  isOpen,
  onClose,
  teamMembers,
  teamPerformance,
}: TeamPerformanceModalProps) {
  const [sortBy, setSortBy] = useState<"revenue" | "calls" | "leads">("revenue")

  if (!isOpen) return null

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`
    }
    return `₹${(amount / 1000).toFixed(0)}K`
  }

  const sortedMembers = [...teamMembers].sort((a, b) => {
    switch (sortBy) {
      case "revenue":
        return b.performance.revenue - a.performance.revenue
      case "calls":
        return b.performance.callsMade - a.performance.callsMade
      case "leads":
        return b.performance.leadsConverted - a.performance.leadsConverted
      default:
        return 0
    }
  })

  const getMedalIcon = (index: number) => {
    switch (index) {
      case 0:
        return "🥇"
      case 1:
        return "🥈"
      case 2:
        return "🥉"
      default:
        return null
    }
  }

  const getPerformanceColor = (achieved: number, target: number) => {
    const percentage = (achieved / target) * 100
    if (percentage >= 100) return "#059669"
    if (percentage >= 80) return "#F59E0B"
    return "#EF4444"
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
              <Trophy size={24} style={{ color: "#FFFFFF" }} />
            </div>
            <div>
              <h2 className="text-2xl font-bold" style={{ color: "#1F1F1E" }}>
                Team Performance Analytics
              </h2>
              <p className="text-sm" style={{ color: "#888886" }}>
                Detailed performance metrics and rankings
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
            {/* Team Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div
                className="p-6 rounded-lg border text-center"
                style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB" }}
              >
                <Phone size={32} style={{ color: "#F16336" }} className="mx-auto mb-3" />
                <p className="text-3xl font-bold" style={{ color: "#1F1F1E" }}>
                  {teamPerformance.totalCalls}
                </p>
                <p className="text-sm font-medium" style={{ color: "#888886" }}>
                  Total Calls Made
                </p>
              </div>
              <div
                className="p-6 rounded-lg border text-center"
                style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB" }}
              >
                <Target size={32} style={{ color: "#3B82F6" }} className="mx-auto mb-3" />
                <p className="text-3xl font-bold" style={{ color: "#1F1F1E" }}>
                  {teamPerformance.totalLeads}
                </p>
                <p className="text-sm font-medium" style={{ color: "#888886" }}>
                  Leads Converted
                </p>
              </div>
              <div
                className="p-6 rounded-lg border text-center"
                style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB" }}
              >
                <DollarSign size={32} style={{ color: "#10B981" }} className="mx-auto mb-3" />
                <p className="text-3xl font-bold" style={{ color: "#1F1F1E" }}>
                  {formatCurrency(teamPerformance.totalRevenue)}
                </p>
                <p className="text-sm font-medium" style={{ color: "#888886" }}>
                  Total Revenue
                </p>
              </div>
              <div
                className="p-6 rounded-lg border text-center"
                style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB" }}
              >
                <TrendingUp size={32} style={{ color: "#8B5CF6" }} className="mx-auto mb-3" />
                <p className="text-3xl font-bold" style={{ color: "#1F1F1E" }}>
                  {Math.round((teamPerformance.totalRevenue / teamPerformance.totalTarget) * 100)}%
                </p>
                <p className="text-sm font-medium" style={{ color: "#888886" }}>
                  Target Achievement
                </p>
              </div>
            </div>

            {/* Sort Controls */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold" style={{ color: "#1F1F1E" }}>
                Individual Performance Rankings
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium" style={{ color: "#888886" }}>
                  Sort by:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "revenue" | "calls" | "leads")}
                  className="px-3 py-2 rounded-lg border text-sm"
                  style={{ backgroundColor: "#FFFFFF", borderColor: "#D9D9D9", color: "#1F1F1E" }}
                >
                  <option value="revenue">Revenue</option>
                  <option value="calls">Calls Made</option>
                  <option value="leads">Leads Converted</option>
                </select>
              </div>
            </div>

            {/* Performance Rankings */}
            <div className="space-y-4">
              {sortedMembers.map((member, index) => {
                const achievementPercentage = Math.round((member.performance.revenue / member.performance.target) * 100)
                const performanceColor = getPerformanceColor(member.performance.revenue, member.performance.target)
                const medal = getMedalIcon(index)

                return (
                  <div
                    key={member.id}
                    className="p-6 rounded-lg border"
                    style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB" }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
                            style={{ backgroundColor: "#F16336", color: "#FFFFFF" }}
                          >
                            {medal || index + 1}
                          </div>
                          <div>
                            <h4 className="text-lg font-bold" style={{ color: "#1F1F1E" }}>
                              {member.name}
                            </h4>
                            <p className="text-sm" style={{ color: "#888886" }}>
                              {member.designation}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-8">
                        {/* Performance Metrics */}
                        <div className="text-center">
                          <p className="text-2xl font-bold" style={{ color: "#F16336" }}>
                            {member.performance.callsMade}
                          </p>
                          <p className="text-xs" style={{ color: "#888886" }}>
                            Calls
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold" style={{ color: "#3B82F6" }}>
                            {member.performance.leadsConverted}
                          </p>
                          <p className="text-xs" style={{ color: "#888886" }}>
                            Leads
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold" style={{ color: "#10B981" }}>
                            {formatCurrency(member.performance.revenue)}
                          </p>
                          <p className="text-xs" style={{ color: "#888886" }}>
                            Revenue
                          </p>
                        </div>

                        {/* Target Achievement */}
                        <div className="text-center min-w-[120px]">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-lg font-bold" style={{ color: performanceColor }}>
                              {achievementPercentage}%
                            </span>
                            {achievementPercentage >= 100 && <Star size={16} style={{ color: "#F59E0B" }} />}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${Math.min(achievementPercentage, 100)}%`,
                                backgroundColor: performanceColor,
                              }}
                            />
                          </div>
                          <p className="text-xs mt-1" style={{ color: "#888886" }}>
                            Target: {formatCurrency(member.performance.target)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Performance Insights */}
                    <div className="mt-4 pt-4 border-t" style={{ borderColor: "#E5E7EB" }}>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#3B82F6" }} />
                          <span style={{ color: "#888886" }}>
                            Conversion Rate:{" "}
                            {member.performance.leadsConverted > 0
                              ? Math.round((member.performance.leadsConverted / member.performance.callsMade) * 100)
                              : 0}
                            %
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#10B981" }} />
                          <span style={{ color: "#888886" }}>
                            Revenue per Lead:{" "}
                            {member.performance.leadsConverted > 0
                              ? formatCurrency(member.performance.revenue / member.performance.leadsConverted)
                              : "₹0"}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: performanceColor }} />
                          <span style={{ color: "#888886" }}>
                            Status:{" "}
                            {achievementPercentage >= 100
                              ? "Exceeded Target"
                              : achievementPercentage >= 80
                                ? "On Track"
                                : "Needs Attention"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Team Performance Summary */}
            <div className="mt-8 p-6 rounded-lg border" style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB" }}>
              <h3 className="text-xl font-bold mb-4" style={{ color: "#1F1F1E" }}>
                Team Performance Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3" style={{ color: "#1F1F1E" }}>
                    Top Performers
                  </h4>
                  <div className="space-y-2">
                    {sortedMembers.slice(0, 3).map((member, index) => (
                      <div key={member.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getMedalIcon(index)}</span>
                          <span className="text-sm font-medium" style={{ color: "#1F1F1E" }}>
                            {member.name}
                          </span>
                        </div>
                        <span className="text-sm font-bold" style={{ color: "#F16336" }}>
                          {formatCurrency(member.performance.revenue)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3" style={{ color: "#1F1F1E" }}>
                    Key Insights
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span style={{ color: "#888886" }}>Average Calls per Person:</span>
                      <span className="font-medium" style={{ color: "#1F1F1E" }}>
                        {Math.round(teamPerformance.totalCalls / teamMembers.length)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={{ color: "#888886" }}>Average Revenue per Person:</span>
                      <span className="font-medium" style={{ color: "#1F1F1E" }}>
                        {formatCurrency(teamPerformance.totalRevenue / teamMembers.length)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={{ color: "#888886" }}>Team Conversion Rate:</span>
                      <span className="font-medium" style={{ color: "#1F1F1E" }}>
                        {Math.round((teamPerformance.totalLeads / teamPerformance.totalCalls) * 100)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={{ color: "#888886" }}>Members Exceeding Target:</span>
                      <span className="font-medium" style={{ color: "#10B981" }}>
                        {teamMembers.filter((member) => member.performance.revenue >= member.performance.target).length}{" "}
                        / {teamMembers.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
