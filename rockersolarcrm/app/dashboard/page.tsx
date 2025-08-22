"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const router = useRouter()

  useEffect(() => {
    // In a real app, you would get this from authentication context or API
    // For now, we'll simulate getting user designation from localStorage or session
    const getUserDesignation = () => {
      // This would typically come from your auth system
      // For demo purposes, you can set this in localStorage
      return localStorage.getItem("userDesignation") || "SalesPerson"
    }

    const designation = getUserDesignation()

    // Route to appropriate dashboard based on designation
    switch (designation) {
      case "SalesPerson":
        router.replace("/dashboard/salesperson")
        break
      case "HR":
        router.replace("/dashboard/hr")
        break
      case "Director":
        router.replace("/dashboard/director")
        break
      case "Manager":
        router.replace("/dashboard/manager")
        break
      case "Team Lead":
        router.replace("/dashboard/teamlead")
        break
      case "Executive":
        router.replace("/dashboard/executive")
        break
      case "Administrator":
        router.replace("/dashboard/administrator")
        break
      case "Analyst":
        router.replace("/dashboard/analyst")
        break
      default:
        // Default to salesperson dashboard
        router.replace("/dashboard/salesperson")
        break
    }
  }, [router])

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#1F1F1E" }}>
      <div className="text-center">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
          style={{ borderColor: "#F16336" }}
        ></div>
        <p style={{ color: "#F4F4F1" }}>Loading your dashboard...</p>
      </div>
    </div>
  )
}
