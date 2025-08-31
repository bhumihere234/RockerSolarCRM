"use client"

import { useState } from "react"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  RefreshCw,
  Calendar,
  Target,
  DollarSign,
  Phone,
  MapPin,
  Clock,
  Zap,
  Activity,
} from "lucide-react"

interface AnalyticsDashboardProps {
  isOpen: boolean
  onClose: () => void
}

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor: string
    borderColor: string
    borderWidth: number
  }[]
}

// Removed unused KPICard interface to fix lint error

export default function AnalyticsDashboard({ isOpen, onClose }: AnalyticsDashboardProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState<"7d" | "30d" | "90d" | "1y">("30d")
  const [selectedMetric, setSelectedMetric] = useState<"revenue" | "leads" | "calls" | "customers">("revenue")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState<"all" | "mumbai" | "delhi" | "bangalore" | "chennai" | "nashik">(
    "all",
  )

  // Mock data that changes based on filters
  const [dashboardData] = useState({
    kpis: [
      {
        title: "Total Revenue",
        value: "₹43.2L",
        change: 15.8,
        changeType: "increase" as const,
        icon: DollarSign,
        color: "#F16336",
        trend: [32, 35, 38, 42, 45, 43, 47],
      },
      {
        title: "Active Leads",
        value: "248",
        change: 8.2,
        changeType: "increase" as const,
        icon: Target,
        color: "#3B82F6",
        trend: [180, 195, 210, 225, 240, 235, 248],
      },
      {
        title: "Total Calls",
        value: "1,247",
        change: -2.1,
        changeType: "decrease" as const,
        icon: Phone,
        color: "#10B981",
        trend: [1100, 1150, 1200, 1280, 1300, 1270, 1247],
      },
      {
        title: "Conversion Rate",
        value: "22.3%",
        change: 4.5,
        changeType: "increase" as const,
        icon: TrendingUp,
        color: "#8B5CF6",
        trend: [18, 19, 20, 21, 22, 21, 22.3],
      },
    ],
    chartData: {
      revenue: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [
          {
            label: "Revenue",
            data: [850000, 920000, 1100000, 1250000],
            backgroundColor: "rgba(241, 99, 54, 0.1)",
            borderColor: "#F16336",
            borderWidth: 3,
          },
          {
            label: "Target",
            data: [1000000, 1000000, 1000000, 1000000],
            backgroundColor: "rgba(156, 163, 175, 0.1)",
            borderColor: "#9CA3AF",
            borderWidth: 2,
          },
        ],
      },
      leads: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [
          {
            label: "New Leads",
            data: [45, 52, 68, 83],
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            borderColor: "#3B82F6",
            borderWidth: 3,
          },
          {
            label: "Converted",
            data: [12, 15, 18, 22],
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            borderColor: "#10B981",
            borderWidth: 3,
          },
        ],
      },
    },
    regionalData: [
      { region: "Mumbai", revenue: 1200000, leads: 65, calls: 320, growth: 18.5, lat: 19.076, lng: 72.8777 },
      { region: "Delhi", revenue: 1150000, leads: 58, calls: 295, growth: 16.8, lat: 28.7041, lng: 77.1025 },
      { region: "Bangalore", revenue: 850000, leads: 48, calls: 245, growth: 22.1, lat: 12.9716, lng: 77.5946 },
      { region: "Chennai", revenue: 920000, leads: 52, calls: 268, growth: 19.3, lat: 13.0827, lng: 80.2707 },
      { region: "Nashik", revenue: 680000, leads: 38, calls: 185, growth: 14.7, lat: 19.9975, lng: 73.7898 },
      { region: "Pune", revenue: 550000, leads: 42, calls: 192, growth: 25.3, lat: 18.5204, lng: 73.8567 },
    ],
    heatmapData: [
      { hour: "9 AM", day: "Mon", calls: 25, intensity: 0.8 },
      { hour: "10 AM", day: "Mon", calls: 32, intensity: 1.0 },
      { hour: "11 AM", day: "Mon", calls: 28, intensity: 0.9 },
      { hour: "2 PM", day: "Mon", calls: 35, intensity: 1.0 },
      { hour: "3 PM", day: "Mon", calls: 22, intensity: 0.7 },
      { hour: "4 PM", day: "Mon", calls: 18, intensity: 0.6 },
      { hour: "9 AM", day: "Tue", calls: 28, intensity: 0.9 },
      { hour: "10 AM", day: "Tue", calls: 30, intensity: 0.95 },
      { hour: "11 AM", day: "Tue", calls: 26, intensity: 0.85 },
      { hour: "2 PM", day: "Tue", calls: 33, intensity: 1.0 },
      { hour: "3 PM", day: "Tue", calls: 24, intensity: 0.75 },
      { hour: "4 PM", day: "Tue", calls: 20, intensity: 0.65 },
      { hour: "9 AM", day: "Wed", calls: 30, intensity: 0.95 },
      { hour: "10 AM", day: "Wed", calls: 35, intensity: 1.0 },
      { hour: "11 AM", day: "Wed", calls: 31, intensity: 0.95 },
      { hour: "2 PM", day: "Wed", calls: 38, intensity: 1.0 },
      { hour: "3 PM", day: "Wed", calls: 27, intensity: 0.8 },
      { hour: "4 PM", day: "Wed", calls: 22, intensity: 0.7 },
      { hour: "9 AM", day: "Thu", calls: 26, intensity: 0.85 },
      { hour: "10 AM", day: "Thu", calls: 29, intensity: 0.9 },
      { hour: "11 AM", day: "Thu", calls: 25, intensity: 0.8 },
      { hour: "2 PM", day: "Thu", calls: 31, intensity: 0.95 },
      { hour: "3 PM", day: "Thu", calls: 23, intensity: 0.75 },
      { hour: "4 PM", day: "Thu", calls: 19, intensity: 0.6 },
      { hour: "9 AM", day: "Fri", calls: 33, intensity: 1.0 },
      { hour: "10 AM", day: "Fri", calls: 37, intensity: 1.0 },
      { hour: "11 AM", day: "Fri", calls: 34, intensity: 1.0 },
      { hour: "2 PM", day: "Fri", calls: 40, intensity: 1.0 },
      { hour: "3 PM", day: "Fri", calls: 29, intensity: 0.9 },
      { hour: "4 PM", day: "Fri", calls: 25, intensity: 0.8 },
    ],
  })

  const refreshData = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const exportData = () => {
    // Simulate data export
    const dataStr = JSON.stringify(dashboardData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `analytics-${selectedTimeRange}-${Date.now()}.json`
    link.click()
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`
    }
    return `₹${(amount / 1000).toFixed(0)}K`
  }

  const MiniChart = ({ data, color }: { data: number[]; color: string }) => {
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min

    return (
      <div className="flex items-end space-x-1 h-8">
        {data.map((value, index) => (
          <div
            key={index}
            className="w-2 rounded-t"
            style={{
              height: `${((value - min) / range) * 100}%`,
              backgroundColor: color,
              opacity: 0.7,
            }}
          />
        ))}
      </div>
    )
  }

  const HeatmapCell = ({ intensity, value }: { intensity: number; value: number }) => (
    <div
      className="w-8 h-8 rounded flex items-center justify-center text-xs font-medium"
      style={{
        backgroundColor: `rgba(241, 99, 54, ${intensity})`,
        color: intensity > 0.5 ? "#FFFFFF" : "#1F1F1E",
      }}
    >
      {value}
    </div>
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }} onClick={onClose} />

      {/* Dashboard */}
      <div
        className="relative w-full h-full overflow-hidden"
        style={{ backgroundColor: "#1F1F1E", maxWidth: "100vw", maxHeight: "100vh" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: "#374151", backgroundColor: "#111111" }}
        >
          <div className="flex items-center space-x-4">
            <div className="p-2 rounded-lg" style={{ backgroundColor: "#F16336" }}>
              <BarChart3 size={24} style={{ color: "#FFFFFF" }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: "#F4F4F1" }}>
                Advanced Analytics Dashboard
              </h1>
              <p className="text-sm" style={{ color: "#9CA3AF" }}>
                Real-time business intelligence and insights
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Time Range Selector */}
            <div className="flex items-center space-x-2">
              <Calendar size={16} style={{ color: "#9CA3AF" }} />
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value as "7d" | "30d" | "90d" | "1y")}
                className="px-3 py-2 rounded-lg border text-sm"
                style={{
                  backgroundColor: "#374151",
                  borderColor: "#4B5563",
                  color: "#F4F4F1",
                }}
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="1y">Last Year</option>
              </select>
            </div>

            {/* Region Filter */}
            <div className="flex items-center space-x-2">
              <MapPin size={16} style={{ color: "#9CA3AF" }} />
              <select
                value={selectedRegion}
                onChange={(e) =>
                  setSelectedRegion(e.target.value as "all" | "mumbai" | "delhi" | "bangalore" | "chennai" | "nashik")
                }
                className="px-3 py-2 rounded-lg border text-sm"
                style={{
                  backgroundColor: "#374151",
                  borderColor: "#4B5563",
                  color: "#F4F4F1",
                }}
              >
                <option value="all">All Regions</option>
                <option value="mumbai">Mumbai</option>
                <option value="delhi">Delhi</option>
                <option value="bangalore">Bangalore</option>
                <option value="chennai">Chennai</option>
                <option value="nashik">Nashik</option>
              </select>
            </div>

            {/* Action Buttons */}
            <button
              onClick={refreshData}
              disabled={isLoading}
              className="p-2 rounded-lg transition-colors hover:bg-gray-700"
              style={{ color: "#9CA3AF" }}
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            </button>

            <button
              onClick={exportData}
              className="p-2 rounded-lg transition-colors hover:bg-gray-700"
              style={{ color: "#9CA3AF" }}
            >
              <Download size={16} />
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-medium transition-all hover:scale-105"
              style={{ backgroundColor: "#F16336", color: "#FFFFFF" }}
            >
              Close
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="overflow-y-auto h-full pb-20">
          {/* KPI Cards */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {dashboardData.kpis.map((kpi, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl border transform transition-all duration-300 hover:scale-105 cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #374151 0%, #4B5563 100%)",
                    borderColor: "#4B5563",
                    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: kpi.color }}>
                      <kpi.icon size={24} style={{ color: "#FFFFFF" }} />
                    </div>
                    <div className="flex items-center space-x-2">
                      {kpi.changeType === "increase" ? (
                        <TrendingUp size={16} style={{ color: "#10B981" }} />
                      ) : (
                        <TrendingDown size={16} style={{ color: "#EF4444" }} />
                      )}
                      <span
                        className="text-sm font-medium"
                        style={{ color: kpi.changeType === "increase" ? "#10B981" : "#EF4444" }}
                      >
                        {kpi.changeType === "increase" ? "+" : ""}
                        {kpi.change}%
                      </span>
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold mb-2" style={{ color: "#F4F4F1" }}>
                    {kpi.value}
                  </h3>
                  <p className="text-sm font-medium mb-3" style={{ color: "#9CA3AF" }}>
                    {kpi.title}
                  </p>
                  <div className="flex items-center justify-between">
                    <MiniChart data={kpi.trend} color={kpi.color} />
                    <span className="text-xs" style={{ color: "#6B7280" }}>
                      7 days
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Revenue Chart */}
              <div
                className="lg:col-span-2 p-6 rounded-xl border"
                style={{ backgroundColor: "#374151", borderColor: "#4B5563" }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold" style={{ color: "#F4F4F1" }}>
                    Revenue vs Target
                  </h3>
                  <div className="flex space-x-2">
                    {["revenue", "leads", "calls", "customers"].map((metric) => (
                      <button
                        key={metric}
                        onClick={() => {
                          // Only allow valid metric types
                          const validMetrics = ["revenue", "leads", "calls", "customers"] as const;
                          if (validMetrics.includes(metric as any)) {
                            setSelectedMetric(metric as typeof validMetrics[number]);
                          }
                        }}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                          selectedMetric === metric ? "scale-105" : ""
                        }`}
                        style={{
                          backgroundColor: selectedMetric === metric ? "#F16336" : "transparent",
                          color: selectedMetric === metric ? "#FFFFFF" : "#9CA3AF",
                          border: selectedMetric === metric ? "none" : "1px solid #4B5563",
                        }}
                      >
                        {metric.charAt(0).toUpperCase() + metric.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Simulated Chart Area */}
                <div className="h-64 relative">
                  <div className="absolute inset-0 flex items-end justify-between px-4">
                    {dashboardData.chartData.revenue.datasets[0].data.map((value, index) => (
                      <div key={index} className="flex flex-col items-center space-y-2">
                        <div
                          className="w-12 rounded-t transition-all duration-500"
                          style={{
                            height: `${(value / 1500000) * 200}px`,
                            backgroundColor: "#F16336",
                          }}
                        />
                        <span className="text-xs" style={{ color: "#9CA3AF" }}>
                          {dashboardData.chartData.revenue.labels[index]}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="absolute top-0 right-0 p-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#F16336" }} />
                        <span className="text-sm" style={{ color: "#9CA3AF" }}>
                          Actual
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#9CA3AF" }} />
                        <span className="text-sm" style={{ color: "#9CA3AF" }}>
                          Target
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Regional Performance */}
              <div className="p-6 rounded-xl border" style={{ backgroundColor: "#374151", borderColor: "#4B5563" }}>
                <h3 className="text-xl font-bold mb-6" style={{ color: "#F4F4F1" }}>
                  Regional Performance
                </h3>
                <div className="space-y-4">
                  {dashboardData.regionalData
                    .sort((a, b) => b.revenue - a.revenue)
                    .slice(0, 6)
                    .map((region, index) => (
                      <div key={region.region} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                            style={{ backgroundColor: "#F16336", color: "#FFFFFF" }}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold" style={{ color: "#F4F4F1" }}>
                              {region.region}
                            </h4>
                            <p className="text-xs" style={{ color: "#9CA3AF" }}>
                              {region.leads} leads • {region.calls} calls
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold" style={{ color: "#F4F4F1" }}>
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
            </div>

            {/* Activity Heatmap */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="p-6 rounded-xl border" style={{ backgroundColor: "#374151", borderColor: "#4B5563" }}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold" style={{ color: "#F4F4F1" }}>
                    Call Activity Heatmap
                  </h3>
                  <Clock size={20} style={{ color: "#9CA3AF" }} />
                </div>
                <div className="space-y-2">
                  <div className="grid grid-cols-8 gap-1">
                    <div className="text-xs" style={{ color: "#9CA3AF" }}>
                      Time
                    </div>
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                      <div key={day} className="text-xs text-center" style={{ color: "#9CA3AF" }}>
                        {day}
                      </div>
                    ))}
                  </div>
                  {["9 AM", "10 AM", "11 AM", "2 PM", "3 PM", "4 PM"].map((hour) => (
                    <div key={hour} className="grid grid-cols-8 gap-1 items-center">
                      <div className="text-xs" style={{ color: "#9CA3AF" }}>
                        {hour}
                      </div>
                      {Array.from({ length: 7 }).map((_, dayIndex) => {
                        const heatmapEntry = dashboardData.heatmapData.find(
                          (entry) =>
                            entry.hour === hour &&
                            entry.day === ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][dayIndex],
                        )
                        return (
                          <HeatmapCell
                            key={dayIndex}
                            intensity={heatmapEntry?.intensity || Math.random() * 0.8 + 0.2}
                            value={heatmapEntry?.calls || Math.floor(Math.random() * 30) + 10}
                          />
                        )
                      })}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-4 text-xs" style={{ color: "#9CA3AF" }}>
                  <span>Less</span>
                  <div className="flex space-x-1">
                    {[0.2, 0.4, 0.6, 0.8, 1.0].map((intensity) => (
                      <div
                        key={intensity}
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: `rgba(241, 99, 54, ${intensity})` }}
                      />
                    ))}
                  </div>
                  <span>More</span>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="p-6 rounded-xl border" style={{ backgroundColor: "#374151", borderColor: "#4B5563" }}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold" style={{ color: "#F4F4F1" }}>
                    Performance Insights
                  </h3>
                  <Activity size={20} style={{ color: "#9CA3AF" }} />
                </div>
                <div className="space-y-6">
                  {/* Conversion Funnel */}
                  <div>
                    <h4 className="font-semibold mb-3" style={{ color: "#F4F4F1" }}>
                      Conversion Funnel
                    </h4>
                    <div className="space-y-2">
                      {[
                        { stage: "Leads Generated", value: 248, percentage: 100 },
                        { stage: "Qualified Leads", value: 186, percentage: 75 },
                        { stage: "Proposals Sent", value: 124, percentage: 50 },
                        { stage: "Deals Closed", value: 55, percentage: 22 },
                      ].map((stage) => (
                        <div key={stage.stage} className="flex items-center justify-between">
                          <span className="text-sm" style={{ color: "#9CA3AF" }}>
                            {stage.stage}
                          </span>
                          <div className="flex items-center space-x-3">
                            <div className="w-24 h-2 bg-gray-600 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${stage.percentage}%`,
                                  backgroundColor: "#F16336",
                                }}
                              />
                            </div>
                            <span className="text-sm font-medium" style={{ color: "#F4F4F1" }}>
                              {stage.value}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Performers */}
                  <div>
                    <h4 className="font-semibold mb-3" style={{ color: "#F4F4F1" }}>
                      Top Performers
                    </h4>
                    <div className="space-y-2">
                      {[
                        { name: "Mike Johnson", score: 95, badge: "🥇" },
                        { name: "John Sales", score: 88, badge: "🥈" },
                        { name: "David Brown", score: 82, badge: "🥉" },
                      ].map((performer) => (
                        <div key={performer.name} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{performer.badge}</span>
                            <span className="text-sm" style={{ color: "#F4F4F1" }}>
                              {performer.name}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 h-2 bg-gray-600 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${performer.score}%`,
                                  backgroundColor: "#10B981",
                                }}
                              />
                            </div>
                            <span className="text-sm font-medium" style={{ color: "#10B981" }}>
                              {performer.score}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-time Alerts */}
            <div className="p-6 rounded-xl border" style={{ backgroundColor: "#374151", borderColor: "#4B5563" }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold" style={{ color: "#F4F4F1" }}>
                  Real-time Alerts & Insights
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm" style={{ color: "#9CA3AF" }}>
                    Live
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  className="p-4 rounded-lg border-l-4"
                  style={{ backgroundColor: "#1F2937", borderColor: "#10B981" }}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap size={16} style={{ color: "#10B981" }} />
                    <h4 className="font-semibold" style={{ color: "#10B981" }}>
                      High Performance
                    </h4>
                  </div>
                  <p className="text-sm" style={{ color: "#9CA3AF" }}>
                    Delhi region exceeded monthly target by 115%
                  </p>
                </div>
                <div
                  className="p-4 rounded-lg border-l-4"
                  style={{ backgroundColor: "#1F2937", borderColor: "#F59E0B" }}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock size={16} style={{ color: "#F59E0B" }} />
                    <h4 className="font-semibold" style={{ color: "#F59E0B" }}>
                      Follow-up Required
                    </h4>
                  </div>
                  <p className="text-sm" style={{ color: "#9CA3AF" }}>
                    Chennai has 18 leads requiring immediate follow-up
                  </p>
                </div>
                <div
                  className="p-4 rounded-lg border-l-4"
                  style={{ backgroundColor: "#1F2937", borderColor: "#EF4444" }}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingDown size={16} style={{ color: "#EF4444" }} />
                    <h4 className="font-semibold" style={{ color: "#EF4444" }}>
                      Attention Needed
                    </h4>
                  </div>
                  <p className="text-sm" style={{ color: "#9CA3AF" }}>
                    Nashik call volume down 8% this week
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
