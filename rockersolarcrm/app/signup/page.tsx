"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, User, Mail, Phone, Briefcase, Shield, Lock } from "lucide-react"

const designations = ["SalesPerson", "HR", "Director", "Manager", "Team Lead", "Executive", "Administrator", "Analyst"]

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    designation: "",
    password: "",
  })
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate sending OTP
    setTimeout(() => {
      setOtpSent(true)
      setIsLoading(false)
    }, 1000)
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate OTP verification and account creation
    setTimeout(() => {
      setIsLoading(false)

      // Store user designation in localStorage for dashboard routing
      localStorage.setItem("userDesignation", formData.designation)
      localStorage.setItem("userName", formData.name)
      localStorage.setItem("userEmail", formData.email)

      router.push("/dashboard")
    }, 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#1F1F1E" }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center mb-6 transition-colors hover:opacity-80"
            style={{ color: "#F16336" }}
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#F4F4F1" }}>
            {otpSent ? "Verify Your Account" : "Create Account"}
          </h1>
          <p style={{ color: "#888886" }}>
            {otpSent ? "Enter the OTP sent to your mobile number" : "Join RockerSolar CRM today"}
          </p>
        </div>

        {!otpSent ? (
          /* Signup Form */
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#D9D9D9" }}>
                Full Name
              </label>
              <div className="relative">
                <User
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: "#888886" }}
                />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: "#F4F4F1",
                    borderColor: "#888886",
                    color: "#1F1F1E",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#F16336")}
                  onBlur={(e) => (e.target.style.borderColor = "#888886")}
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#D9D9D9" }}>
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: "#888886" }}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: "#F4F4F1",
                    borderColor: "#888886",
                    color: "#1F1F1E",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#F16336")}
                  onBlur={(e) => (e.target.style.borderColor = "#888886")}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#D9D9D9" }}>
                Mobile Number
              </label>
              <div className="relative">
                <Phone
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: "#888886" }}
                />
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: "#F4F4F1",
                    borderColor: "#888886",
                    color: "#1F1F1E",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#F16336")}
                  onBlur={(e) => (e.target.style.borderColor = "#888886")}
                  placeholder="Enter your mobile number"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#D9D9D9" }}>
                Password
              </label>
              <div className="relative">
                <Lock
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: "#888886" }}
                />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: "#F4F4F1",
                    borderColor: "#888886",
                    color: "#1F1F1E",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#F16336")}
                  onBlur={(e) => (e.target.style.borderColor = "#888886")}
                  placeholder="Create a password"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#D9D9D9" }}>
                Designation
              </label>
              <div className="relative">
                <Briefcase
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: "#888886" }}
                />
                <select
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all appearance-none"
                  style={{
                    backgroundColor: "#F4F4F1",
                    borderColor: "#888886",
                    color: "#1F1F1E",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#F16336")}
                  onBlur={(e) => (e.target.style.borderColor = "#888886")}
                  required
                >
                  <option value="">Select your designation</option>
                  {designations.map((designation) => (
                    <option key={designation} value={designation}>
                      {designation}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "#F16336",
                color: "#FFFFFF",
              }}
            >
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          /* OTP Verification Form */
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="text-center mb-6">
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                style={{ backgroundColor: "#F16336" }}
              >
                <Shield size={32} style={{ color: "#FFFFFF" }} />
              </div>
              <p style={{ color: "#888886" }}>We've sent a 6-digit verification code to</p>
              <p className="font-semibold" style={{ color: "#F4F4F1" }}>
                {formData.mobile}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#D9D9D9" }}>
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all text-center text-2xl tracking-widest"
                style={{
                  backgroundColor: "#F4F4F1",
                  borderColor: "#888886",
                  color: "#1F1F1E",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#F16336")}
                onBlur={(e) => (e.target.style.borderColor = "#888886")}
                placeholder="000000"
                maxLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "#F16336",
                color: "#FFFFFF",
              }}
            >
              {isLoading ? "Creating Account..." : "Verify & Create Account"}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="text-sm hover:underline transition-colors"
                style={{ color: "#888886" }}
              >
                Didn't receive OTP? Resend
              </button>
            </div>
          </form>
        )}

        {/* Login Link */}
        {!otpSent && (
          <div className="text-center mt-8">
            <p style={{ color: "#888886" }}>
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold hover:underline transition-colors"
                style={{ color: "#F16336" }}
              >
                Sign in here
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
