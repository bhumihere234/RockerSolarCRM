"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react"
import { sendOtp, verifyOtp, login } from "@/utils/auth"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [showResetForm, setShowResetForm] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isAccountLocked, setIsAccountLocked] = useState(false)
  const [lockoutTime, setLockoutTime] = useState<number | null>(null)
  const router = useRouter()

  // Handle login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isAccountLocked && lockoutTime) {
      const remainingTime = Math.ceil((lockoutTime - Date.now()) / 1000)
      if (remainingTime > 0) {
        setLoginError(`Account temporarily locked. Please try again in ${remainingTime} seconds.`)
        return
      } else {
        setIsAccountLocked(false)
        setLockoutTime(null)
        setLoginAttempts(0)
      }
    }

    setIsLoading(true)
    setLoginError("")

    setTimeout(async () => {
      try {
        const validation = await login(email, password)
        if (validation.ok) {
          setIsLoading(false)
          setLoginAttempts(0)
          setLoginError("")
          localStorage.setItem("userEmail", validation.user.email)
          router.push("/dashboard")
        } else {
          const newAttempts = loginAttempts + 1
          setLoginAttempts(newAttempts)
          setLoginError(validation.error)

          if (newAttempts >= 3) {
            setIsAccountLocked(true)
            setLockoutTime(Date.now() + 30000) // 30 seconds lockout
            setLoginError("Too many failed attempts. Account locked for 30 seconds.")

            setTimeout(() => {
              setIsAccountLocked(false)
              setLockoutTime(null)
              setLoginAttempts(0)
              setLoginError("")
            }, 30000)
          } else {
            setLoginError(`${validation.error} (${3 - newAttempts} attempts remaining)`)
          }
        }
      } catch (error: any) {
        setIsLoading(false)
        setLoginError("Server error, please try again.")
      }
    }, 1500)
  }

  // Handle sending OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await sendOtp(email) // sendOtp function to hit the backend API
      setOtpSent(true)
      setIsLoading(false)
      alert(res.message)  // Show OTP message or devCode in development
    } catch (error: any) {
      setIsLoading(false)
      setLoginError("Error sending OTP. Please try again.")
    }
  }

  // Handle OTP verification
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await verifyOtp(email, otp) // verifyOtp function to hit the backend API
      setIsLoading(false)
      alert(res.message)
      if (res.ok) {
        setShowResetForm(true) // Show password reset form after OTP verification
      }
    } catch (error: any) {
      setIsLoading(false)
      setLoginError("Invalid OTP. Please try again.")
    }
  }

  // Handle password reset (new password)
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match!")
      return
    }
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long!")
      return
    }
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      alert("Password reset successfully!")
      // Reset states
      setShowForgotPassword(false)
      setOtpSent(false)
      setShowResetForm(false)
      setNewPassword("")
      setConfirmPassword("")
    }, 1500)
  }

  // Toggle forgot password form
  const handleForgotPasswordToggle = () => {
    setShowForgotPassword(!showForgotPassword)
    setOtpSent(false)
    setShowResetForm(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#1F1F1E" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center mb-6 transition-colors hover:opacity-80" style={{ color: "#F16336" }}>
            <ArrowLeft size={20} className="mr-2" /> Back to Home
          </Link>
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#F4F4F1" }}>
            {showForgotPassword ? (showResetForm ? "Create New Password" : "Reset Password") : "Welcome Back"}
          </h1>
          <p style={{ color: "#888886" }}>
            {showForgotPassword
              ? showResetForm
                ? "Enter your new password"
                : otpSent
                ? "Enter the OTP sent to your mobile"
                : "Enter your mobile number to reset password"
              : "Sign in to your RockerSolar account"}
          </p>
        </div>

        {!showForgotPassword ? (
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email input */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#D9D9D9" }}>Email Address</label>
              <div className="relative">
                <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: "#888886" }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                  style={{ backgroundColor: "#F4F4F1", borderColor: "#888886", color: "#1F1F1E" }}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password input */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#D9D9D9" }}>Password</label>
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: "#888886" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                  style={{ backgroundColor: "#F4F4F1", borderColor: "#888886", color: "#1F1F1E" }}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: "#888886" }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={handleForgotPasswordToggle}
                className="text-sm hover:underline transition-colors"
                style={{ color: "#F16336" }}
              >
                Forgot Password?
              </button>
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
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Send OTP form */}
            {!otpSent ? (
              <form onSubmit={handleSendOtp}>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2" style={{ color: "#D9D9D9" }}>Mobile Number</label>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: "#F4F4F1",
                      borderColor: "#888886",
                      color: "#1F1F1E",
                    }}
                    placeholder="Enter your mobile number"
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
                  {isLoading ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>
            ) : !showResetForm ? (
              <form onSubmit={handleVerifyOtp}>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2" style={{ color: "#D9D9D9" }}>Enter OTP</label>
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
                    placeholder="000000"
                    maxLength={6}
                    required
                  />
                  <p className="text-sm mt-2" style={{ color: "#888886" }}>
                    OTP sent to {mobileNumber}
                  </p>
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
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </button>
              </form>
            ) : (
              <form onSubmit={handlePasswordReset}>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#D9D9D9" }}>New Password</label>
                    <div className="relative">
                      <Lock
                        size={20}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2"
                        style={{ color: "#888886" }}
                      />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-10 pr-12 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                        style={{
                          backgroundColor: "#F4F4F1",
                          borderColor: "#888886",
                          color: "#1F1F1E",
                        }}
                        placeholder="Enter new password"
                        minLength={6}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        style={{ color: "#888886" }}
                      >
                        {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#D9D9D9" }}>Confirm Password</label>
                    <div className="relative">
                      <Lock
                        size={20}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2"
                        style={{ color: "#888886" }}
                      />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-12 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                        style={{
                          backgroundColor: "#F4F4F1",
                          borderColor: "#888886",
                          color: "#1F1F1E",
                        }}
                        placeholder="Confirm new password"
                        minLength={6}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        style={{ color: "#888886" }}
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
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
                  {isLoading ? "Resetting Password..." : "Reset Password"}
                </button>
              </form>
            )}

            <button
              type="button"
              onClick={() => {
                setShowForgotPassword(false)
                setOtpSent(false)
                setShowResetForm(false)
                setMobileNumber("")
                setOtp("")
                setNewPassword("")
                setConfirmPassword("")
                setLoginError("")
                setLoginAttempts(0)
              }}
              className="w-full py-2 text-sm hover:underline transition-colors"
              style={{ color: "#888886" }}
            >
              Back to Login
            </button>
          </div>
        )}

        {/* Sign Up Link */}
        {!showForgotPassword && (
          <div className="text-center mt-8">
            <p style={{ color: "#888886" }}>
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold hover:underline transition-colors"
                style={{ color: "#F16336" }}
              >
                Sign up here
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
