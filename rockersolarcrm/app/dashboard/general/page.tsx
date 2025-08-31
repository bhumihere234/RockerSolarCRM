
"use client";

import Link from "next/link";

import { useState, useEffect } from "react"
import { BarChart3, Users, Settings, LogOut, Menu, X, Bell } from "lucide-react"

export default function GeneralDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userInfo, setUserInfo] = useState({ designation: "", name: "", email: "" })

  useEffect(() => {
    // Get user info from localStorage
    setUserInfo({
      designation: localStorage.getItem("userDesignation") || "",
      name: localStorage.getItem("userName") || "User",
      email: localStorage.getItem("userEmail") || "",
    })
  }, [])

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#1F1F1E" }}>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ backgroundColor: "#1F1F1E", borderRight: "1px solid #888886" }}
      >
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "#888886" }}>
          <h2 className="text-xl font-bold" style={{ color: "#F16336" }}>
            ROCKER SOLAR
          </h2>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden" style={{ color: "#888886" }}>
            <X size={24} />
          </button>
        </div>

        <nav className="mt-8">
          <div className="px-4 space-y-2">
            <a
              href="#"
              className="flex items-center px-4 py-3 rounded-lg transition-colors"
              style={{ backgroundColor: "#F16336", color: "#FFFFFF" }}
            >
              <BarChart3 size={20} className="mr-3" />
              Dashboard
            </a>
            <a
              href="#"
              className="flex items-center px-4 py-3 rounded-lg transition-colors hover:bg-gray-800"
              style={{ color: "#D9D9D9" }}
            >
              <Users size={20} className="mr-3" />
              Team
            </a>
              {/* Example: <Link href='/somewhere'>Go</Link> */}
              <Link href='/somewhere' className="flex items-center px-4 py-3 rounded-lg transition-colors">
                Go
              </Link>
          </div>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t" style={{ borderColor: "#888886" }}>
          <div className="space-y-2">
            <a
              href="#"
              className="flex items-center px-4 py-2 rounded-lg transition-colors hover:bg-gray-800"
              style={{ color: "#888886" }}
            >
              <Settings size={20} className="mr-3" />
              Settings
            </a>
            <Link
              href="/"
              className="flex items-center px-4 py-2 rounded-lg transition-colors hover:bg-gray-800"
              style={{ color: "#888886" }}
            >
              <LogOut size={20} className="mr-3" />
              Logout
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header
          className="flex items-center justify-between p-4 border-b backdrop-blur-sm"
          style={{
            background: `linear-gradient(135deg, #1F1F1E 0%, #2A2A28 100%)`,
            borderColor: "#888886",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="flex items-center">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden mr-4" style={{ color: "#888886" }}>
              <Menu size={24} />
            </button>
            <h1 className="text-2xl font-bold" style={{ color: "#F4F4F1" }}>
              {userInfo.designation} Dashboard
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <button
              className="relative p-2 rounded-lg transition-colors hover:bg-gray-800"
              style={{ color: "#888886" }}
            >
              <Bell size={20} />
            </button>
            <div className="flex items-center space-x-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#F16336" }}
              >
                <span className="text-sm font-semibold" style={{ color: "#FFFFFF" }}>
                  {userInfo.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span style={{ color: "#D9D9D9" }}>{userInfo.name}</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          <div className="text-center py-20">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: "#F16336" }}
            >
              <BarChart3 size={48} style={{ color: "#FFFFFF" }} />
            </div>
            <h2 className="text-3xl font-bold mb-4" style={{ color: "#F4F4F1" }}>
              Welcome to your {userInfo.designation} Dashboard
            </h2>
            <p className="text-lg mb-8" style={{ color: "#888886" }}>
              Your personalized dashboard is being prepared. This area will contain role-specific features and
              analytics.
            </p>
            <div
              className="p-6 rounded-lg border max-w-md mx-auto"
              style={{ backgroundColor: "#F4F4F1", borderColor: "#D9D9D9" }}
            >
              <h3 className="text-lg font-bold mb-2" style={{ color: "#1F1F1E" }}>
                Coming Soon
              </h3>
              <p style={{ color: "#888886" }}>
                Role-specific features and KPIs tailored for {userInfo.designation} users are under development.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
