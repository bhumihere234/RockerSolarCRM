"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [mobileNumber, setMobileNumber] = useState("")
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    // lockout guard
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

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const payload = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(payload?.error || "Login failed")

      // save auth
      if (payload?.token) localStorage.setItem("token", payload.token)
      if (payload?.user) {
        localStorage.setItem("userName", payload.user.name ?? "")
        localStorage.setItem("userEmail", payload.user.email ?? "")
        // keep existing key; default label doesn't matter for redirect now
        const designation =
          payload.user.designation ??
          payload.user.role ??
          "Salesperson"
        localStorage.setItem("userDesignation", designation)
      }

      // reset UI state
      setIsLoading(false)
      setLoginAttempts(0)
      setLoginError("")

      // ✅ Always go to Salesperson Dashboard
      router.push("/dashboard/salesperson")
  } catch (err) {
      setIsLoading(false)
      const newAttempts = loginAttempts + 1
      setLoginAttempts(newAttempts)
  const msg = typeof err === 'object' && err && 'message' in err ? (err as { message?: string }).message : "Login failed. Please try again."
      if (newAttempts >= 3) {
        setIsAccountLocked(true)
        const until = Date.now() + 30000
        setLockoutTime(until)
        setLoginError("Too many failed attempts. Account locked for 30 seconds.")
        setTimeout(() => {
          setIsAccountLocked(false)
          setLockoutTime(null)
          setLoginAttempts(0)
          setLoginError("")
        }, 30000)
      } else {
        setLoginError(`${msg} (${3 - newAttempts} attempts remaining)`)
      }
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setOtpSent(true)
      setIsLoading(false)
    }, 1000)
  }

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setShowResetForm(true)
      setIsLoading(false)
    }, 1000)
  }

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
      setShowForgotPassword(false)
      setOtpSent(false)
      setShowResetForm(false)
      setMobileNumber("")
      setOtp("")
      setNewPassword("")
      setConfirmPassword("")
    }, 1500)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (loginError && !isAccountLocked) setLoginError("")
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (loginError && !isAccountLocked) setLoginError("")
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

        {/* Demo Credentials Info (kept) */}
        {!showForgotPassword && (
          <div className="mb-6 p-4 rounded-lg border" style={{ backgroundColor: "#F4F4F1", borderColor: "#D9D9D9" }}>
            <h3 className="text-sm font-semibold mb-2" style={{ color: "#1F1F1E" }}>
              Demo Credentials:
            </h3>
            <div className="text-xs space-y-1" style={{ color: "#888886" }}>
              <p>• salesperson@rockersolar.com / sales123</p>
              <p>• hr@rockersolar.com / hr123</p>
              <p>• director@rockersolar.com / director123</p>
              <p>• manager@rockersolar.com / manager123</p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {loginError && (
          <div
            className="mb-6 p-4 rounded-lg border flex items-center space-x-3"
            style={{
              backgroundColor: isAccountLocked ? "#FEE2E2" : "#FEF3C7",
              borderColor: isAccountLocked ? "#F87171" : "#F59E0B",
              color: isAccountLocked ? "#991B1B" : "#92400E",
            }}
          >
            <AlertCircle size={20} />
            <div className="flex-1">
              <p className="font-medium">{loginError}</p>
              {loginAttempts > 0 && loginAttempts < 3 && !isAccountLocked && (
                <p className="text-xs mt-1">Tip: Check your email and password carefully</p>
              )}
            </div>
          </div>
        )}

        {/* Login Form */}
        {!showForgotPassword ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#D9D9D9" }}>
                Email Address
              </label>
              <div className="relative">
                <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: "#888886" }} />
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all ${
                    loginError && !isAccountLocked ? "border-red-400" : ""
                  }`}
                  style={{ backgroundColor: "#F4F4F1", borderColor: loginError && !isAccountLocked ? "#F87171" : "#888886", color: "#1F1F1E" }}
                  onFocus={(e) => (e.target.style.borderColor = "#F16336")}
                  onBlur={(e) => (e.target.style.borderColor = loginError && !isAccountLocked ? "#F87171" : "#888886")}
                  placeholder="Enter your email"
                  required
                  disabled={isAccountLocked}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#D9D9D9" }}>
                Password
              </label>
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: "#888886" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  className={`w-full pl-10 pr-12 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all ${
                    loginError && !isAccountLocked ? "border-red-400" : ""
                  }`}
                  style={{ backgroundColor: "#F4F4F1", borderColor: loginError && !isAccountLocked ? "#F87171" : "#888886", color: "#1F1F1E" }}
                  onFocus={(e) => (e.target.style.borderColor = "#F16336")}
                  onBlur={(e) => (e.target.style.borderColor = loginError && !isAccountLocked ? "#F87171" : "#888886")}
                  placeholder="Enter your password"
                  required
                  disabled={isAccountLocked}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: "#888886" }}
                  disabled={isAccountLocked}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm hover:underline transition-colors"
                style={{ color: "#F16336" }}
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading || isAccountLocked}
              className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: isAccountLocked ? "#888886" : "#F16336", color: "#FFFFFF" }}
            >
              {isLoading ? "Signing In..." : isAccountLocked ? "Account Locked" : "Sign In"}
            </button>

            {loginAttempts > 0 && loginAttempts < 3 && !isAccountLocked && (
              <div className="flex justify-center space-x-2">
                {[1, 2, 3].map((attempt) => (
                  <div key={attempt} className="w-2 h-2 rounded-full" style={{ backgroundColor: attempt <= loginAttempts ? "#DC2626" : "#D9D9D9" }} />
                ))}
              </div>
            )}
          </form>
        ) : (
          /* Forgot Password Flow */
          <div className="space-y-6">
            {!otpSent ? (
              <form onSubmit={handleForgotPassword}>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2" style={{ color: "#D9D9D9" }}>
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                    style={{ backgroundColor: "#F4F4F1", borderColor: "#888886", color: "#1F1F1E" }}
                    onFocus={(e) => (e.target.style.borderColor = "#F16336")}
                    onBlur={(e) => (e.target.style.borderColor = "#888886")}
                    placeholder="Enter your mobile number"
                    required
                  />
                </div>
                <button type="submit" disabled={isLoading} className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed" style={{ backgroundColor: "#F16336", color: "#FFFFFF" }}>
                  {isLoading ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>
            ) : !showResetForm ? (
              <form onSubmit={handleOtpVerification}>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2" style={{ color: "#D9D9D9" }}>
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all text-center text-2xl tracking-widest"
                    style={{ backgroundColor: "#F4F4F1", borderColor: "#888886", color: "#1F1F1E" }}
                    onFocus={(e) => (e.target.style.borderColor = "#F16336")}
                    onBlur={(e) => (e.target.style.borderColor = "#888886")}
                    placeholder="000000"
                    maxLength={6}
                    required
                  />
                  <p className="text-sm mt-2" style={{ color: "#888886" }}>
                    OTP sent to {mobileNumber}
                  </p>
                </div>
                <button type="submit" disabled={isLoading} className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed" style={{ backgroundColor: "#F16336", color: "#FFFFFF" }}>
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </button>
              </form>
            ) : (
              <form onSubmit={handlePasswordReset}>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#D9D9D9" }}>
                      New Password
                    </label>
                    <div className="relative">
                      <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: "#888886" }} />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-10 pr-12 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                        style={{ backgroundColor: "#F4F4F1", borderColor: "#888886", color: "#1F1F1E" }}
                        onFocus={(e) => (e.target.style.borderColor = "#F16336")}
                        onBlur={(e) => (e.target.style.borderColor = "#888886")}
                        placeholder="Enter new password"
                        minLength={6}
                        required
                      />
                      <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2" style={{ color: "#888886" }}>
                        {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#D9D9D9" }}>
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: "#888886" }} />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-12 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                        style={{ backgroundColor: "#F4F4F1", borderColor: "#888886", color: "#1F1F1E" }}
                        onFocus={(e) => (e.target.style.borderColor = "#F16336")}
                        onBlur={(e) => (e.target.style.borderColor = "#888886")}
                        placeholder="Confirm new password"
                        minLength={6}
                        required
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2" style={{ color: "#888886" }}>
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={isLoading} className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed" style={{ backgroundColor: "#F16336", color: "#FFFFFF" }}>
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

        {!showForgotPassword && (
          <div className="text-center mt-8">
            <p style={{ color: "#888886" }}>
              Don&apos;t have an account?&nbsp;
              <Link href="/signup" className="font-semibold hover:underline transition-colors" style={{ color: "#F16336" }}>
                Sign up here
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
