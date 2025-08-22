"use client"

import { useState } from "react"
import { X, TrendingUp, BarChart3, PieChart, Calendar, MapPin, Users, DollarSign } from "lucide-react"

interface CompanyMetrics {
  totalRevenue: number
  monthlyGrowth: number
  totalLeads: number
  conversionRate: number
  activeCustomers: number
  teamSize: number
}

interface GrowthAnalyticsModalProps {
  isOpen: boolean
  onClose: () => void
  companyMetrics: CompanyMetrics
}

export default function GrowthAnalyticsModal({ isOpen, onClose, companyMetrics }: GrowthAnalyticsModalProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<"weekly" | "monthly" | "quarterly">("monthly")
  const [selectedView, setSelectedView] = useState<"revenue" | "leads" | "customers">("revenue")

  if (!isOpen) return null

  // Mock data for different periods
  const analyticsData = {
    weekly: {
      revenue: [850000, 920000, 1100000, 1250000],
      leads: [45, 52, 68, 83],
      customers: [12, 15, 18, 22],
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    },
    monthly: {
      revenue: [3200000, 3800000, 4100000, 4300000],
      leads: [180, 210, 235, 248],
      customers: [45, 58, 72, 85],
      labels: ["Jan", "Feb", "Mar", "Apr"],
    },
    quarterly: {
      revenue: [9500000, 11200000, 12800000, 14100000],
      leads: [520, 640, 780, 890],
      customers: [125, 165, 210, 265],
      labels: ["Q1", "Q2", "Q3", "Q4"],
    },
  }

  const regionalData = [
    { city: "Mumbai", revenue: 1200000, growth: 18.5, customers: 32 },
    { city: "Delhi", revenue: 1150000, growth: 16.8, customers: 28 },
    { city: "Bangalore", revenue: 850000, growth: 22.1, customers: 24 },
    { city: "Chennai", revenue: 920000, growth: 19.3, customers: 26 },
    { city: "Nashik", revenue: 680000, growth: 14.7, customers: 18 },
    { city: "Pune", revenue: 550000, growth: 25.3, customers: 15 },
  ]

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`
    }
    return `₹${(amount / 1000).toFixed(0)}K`
  }

  const currentData = analyticsData[selectedPeriod]
  const maxValue = Math.max(...currentData[selectedView])

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
              <TrendingUp size={24} style={{ color: "#FFFFFF" }} />
            </div>
            <div>
              <h2 className="text-2xl font-bold" style={{ color: "#1F1F1E" }}>
                Growth Analytics Dashboard
              </h2>
              <p className="text-sm" style={{ color: "#888886" }}>
                Comprehensive business growth insights and trends
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
            {/* Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Calendar size={16} style={{ color: "#888886" }} />
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value as "weekly" | "monthly" | "quarterly")}
                    className="px-3 py-2 rounded-lg border text-sm"
                    style={{ backgroundColor: "#FFFFFF", borderColor: "#D9D9D9", color: "#1F1F1E" }}
                  >
                    <option value="weekly">Weekly View</option>
                    <option value="monthly">Monthly View</option>
                    <option value="quarterly">Quarterly View</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-2">
                {["revenue", "leads", "customers"].map((view) => (
                  <button
                    key={view}
                    onClick={() => setSelectedView(view as "revenue" | "leads" | "customers")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedView === view ? "scale-105" : ""
                    }`}
                    style={{
                      backgroundColor: selectedView === view ? "#F16336" : "transparent",
                      color: selectedView === view ? "#FFFFFF" : "#888886",
                      border: selectedView === view ? "none" : "1px solid #D9D9D9",
                    }}
                  >
                    {view.charAt(0).toUpperCase() + view.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div
                className="p-6 rounded-lg border text-center"
                style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB" }}
              >
                <DollarSign size={32} style={{ color: "#F16336" }} className="mx-auto mb-3" />
                <p className="text-3xl font-bold" style={{ color: "#1F1F1E" }}>
                  {formatCurrency(companyMetrics.totalRevenue)}
                </p>
                <p className="text-sm font-medium" style={{ color: "#888886" }}>
                  Total Revenue
                </p>
                <div className="flex items-center justify-center space-x-1 mt-2">
                  <TrendingUp size={14} style={{ color: "#10B981" }} />
                  <span className="text-sm font-medium" style={{ color: "#10B981" }}>
                    +{companyMetrics.monthlyGrowth}%
                  </span>
                </div>
              </div>
              <div
                className="p-6 rounded-lg border text-center"
                style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB" }}
              >
                <BarChart3 size={32} style={{ color: "#3B82F6" }} className="mx-auto mb-3" />
                <p className="text-3xl font-bold" style={{ color: "#1F1F1E" }}>
                  {companyMetrics.totalLeads}
                </p>
                <p className="text-sm font-medium" style={{ color: "#888886" }}>
                  Total Leads
                </p>
                <div className="flex items-center justify-center space-x-1 mt-2">
                  <span className="text-sm font-medium" style={{ color: "#3B82F6" }}>
                    {companyMetrics.conversionRate}% Conversion
                  </span>
                </div>
              </div>
              <div
                className="p-6 rounded-lg border text-center"
                style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB" }}
              >
                <Users size={32} style={{ color: "#10B981" }} className="mx-auto mb-3" />
                <p className="text-3xl font-bold" style={{ color: "#1F1F1E" }}>
                  {companyMetrics.activeCustomers}
                </p>
                <p className="text-sm font-medium" style={{ color: "#888886" }}>
                  Active Customers
                </p>
                <div className="flex items-center justify-center space-x-1 mt-2">
                  <span className="text-sm font-medium" style={{ color: "#10B981" }}>
                    {companyMetrics.teamSize} Team Members
                  </span>
                </div>
              </div>
            </div>

            {/* Main Chart */}
            <div className="mb-8">
              <div className="p-6 rounded-lg border" style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB" }}>
                <h3 className="text-xl font-bold mb-6" style={{ color: "#1F1F1E" }}>
                  {selectedView.charAt(0).toUpperCase() + selectedView.slice(1)} Trend ({selectedPeriod})
                </h3>
                <div className="h-64 relative">
                  <div className="absolute inset-0 flex items-end justify-between px-4">
                    {currentData[selectedView].map((value, index) => (
                      <div key={index} className="flex flex-col items-center space-y-2">
                        <div className="text-xs font-medium" style={{ color: "#1F1F1E" }}>
                          {selectedView === "revenue" ? formatCurrency(value) : value}
                        </div>
                        <div
                          className="w-16 rounded-t transition-all duration-500"
                          style={{
                            height: `${(value / maxValue) * 200}px`,
                            backgroundColor: "#F16336",
                          }}
                        />
                        <span className="text-sm" style={{ color: "#888886" }}>
                          {currentData.labels[index]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Regional Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-6 rounded-lg border" style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB" }}>
                <div className="flex items-center space-x-2 mb-6">
                  <MapPin size={20} style={{ color: "#F16336" }} />
                  <h3 className="text-xl font-bold" style={{ color: "#1F1F1E" }}>
                    Regional Performance
                  </h3>
                </div>
                <div className="space-y-4">
                  {regionalData.map((region, index) => (
                    <div key={region.city} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                          style={{ backgroundColor: "#F16336", color: "#FFFFFF" }}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold" style={{ color: "#1F1F1E" }}>
                            {region.city}
                          </h4>
                          <p className="text-xs" style={{ color: "#888886" }}>
                            {region.customers} customers
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold" style={{ color: "#1F1F1E" }}>
                          {formatCurrency(region.revenue)}
                        </p>
                        <div className="flex items-center space-x-1">
                          <TrendingUp size={12} style={{ color: "#10B981" }} />
                          <span className="text-xs" style={{ color: "#10B981" }}>
                            +{region.growth}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Growth Insights */}
              <div className="p-6 rounded-lg border" style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB" }}>
                <div className="flex items-center space-x-2 mb-6">
                  <PieChart size={20} style={{ color: "#F16336" }} />
                  <h3 className="text-xl font-bold" style={{ color: "#1F1F1E" }}>
                    Growth Insights
                  </h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3" style={{ color: "#1F1F1E" }}>
                      Revenue Distribution
                    </h4>
                    <div className="space-y-2">
                      {regionalData.slice(0, 4).map((region) => {
                        const percentage = Math.round(
                          (region.revenue / regionalData.reduce((sum, r) => sum + r.revenue, 0)) * 100,
                        )
                        return (
                          <div key={region.city} className="flex items-center justify-between">
                            <span className="text-sm" style={{ color: "#888886" }}>
                              {region.city}
                            </span>
                            <div className="flex items-center space-x-3">
                              <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${percentage}%`,
                                    backgroundColor: "#F16336",
                                  }}
                                />
                              </div>
                              <span className="text-sm font-medium" style={{ color: "#1F1F1E" }}>
                                {percentage}%
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3" style={{ color: "#1F1F1E" }}>
                      Key Metrics
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span style={{ color: "#888886" }}>Average Deal Size:</span>
                        <span className="font-medium" style={{ color: "#1F1F1E" }}>
                          {formatCurrency(companyMetrics.totalRevenue / companyMetrics.activeCustomers)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span style={{ color: "#888886" }}>Customer Acquisition Cost:</span>
                        <span className="font-medium" style={{ color: "#1F1F1E" }}>
                          ₹15,000
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span style={{ color: "#888886" }}>Monthly Recurring Revenue:</span>
                        <span className="font-medium" style={{ color: "#1F1F1E" }}>
                          {formatCurrency(companyMetrics.totalRevenue * 0.3)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span style={{ color: "#888886" }}>Lead to Customer Rate:</span>
                        <span className="font-medium" style={{ color: "#1F1F1E" }}>
                          {companyMetrics.conversionRate}%
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
    </div>
  )
}
