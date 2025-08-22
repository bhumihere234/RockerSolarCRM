"use client"

import type React from "react"

import { useState } from "react"
import { X, Clock, FileText, Send, AlertTriangle } from "lucide-react"

interface AbsenceModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (absenceData: any) => void
}

export default function AbsenceModal({ isOpen, onClose, onSubmit }: AbsenceModalProps) {
  const [formData, setFormData] = useState({
    type: "",
    reason: "",
    startTime: "",
    endTime: "",
    isFullDay: false,
    emergencyContact: "",
    additionalNotes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const absenceTypes = [
    "Sick Leave",
    "Personal Emergency",
    "Family Emergency",
    "Medical Appointment",
    "Personal Work",
    "Other",
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      onSubmit(formData)
      setIsSubmitting(false)
      onClose()

      // Show success message
      alert("Absence request submitted successfully! Your manager has been notified.")
    }, 1500)
  }

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }} onClick={onClose} />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl mx-4 rounded-lg shadow-xl max-h-[90vh] overflow-hidden"
        style={{ backgroundColor: "#F4F4F1" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "#D9D9D9" }}>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: "#DC2626" }}>
              <AlertTriangle size={24} style={{ color: "#FFFFFF" }} />
            </div>
            <div>
              <h2 className="text-2xl font-bold" style={{ color: "#1F1F1E" }}>
                Mark Absence
              </h2>
              <p className="text-sm" style={{ color: "#888886" }}>
                Notify your manager about your absence
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
            <X size={24} style={{ color: "#888886" }} />
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto max-h-[70vh]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Absence Type */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                Absence Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#D9D9D9",
                  color: "#1F1F1E",
                }}
                required
              >
                <option value="">Select absence type</option>
                {absenceTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                Reason for Absence *
              </label>
              <div className="relative">
                <FileText size={20} className="absolute left-3 top-3" style={{ color: "#888886" }} />
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Please provide a brief explanation..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all resize-none"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "#D9D9D9",
                    color: "#1F1F1E",
                  }}
                  required
                />
              </div>
            </div>

            {/* Full Day Toggle */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="isFullDay"
                checked={formData.isFullDay}
                onChange={handleInputChange}
                className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <label className="text-sm font-medium" style={{ color: "#1F1F1E" }}>
                Full day absence
              </label>
            </div>

            {/* Time Range (if not full day) */}
            {!formData.isFullDay && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                    Start Time
                  </label>
                  <div className="relative">
                    <Clock
                      size={20}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2"
                      style={{ color: "#888886" }}
                    />
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime || getCurrentTime()}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderColor: "#D9D9D9",
                        color: "#1F1F1E",
                      }}
                      required={!formData.isFullDay}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                    End Time (Expected)
                  </label>
                  <div className="relative">
                    <Clock
                      size={20}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2"
                      style={{ color: "#888886" }}
                    />
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderColor: "#D9D9D9",
                        color: "#1F1F1E",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Emergency Contact */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                Emergency Contact (Optional)
              </label>
              <input
                type="tel"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleInputChange}
                placeholder="Phone number for urgent matters"
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#D9D9D9",
                  color: "#1F1F1E",
                }}
              />
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                Additional Notes (Optional)
              </label>
              <textarea
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleInputChange}
                rows={2}
                placeholder="Any additional information for your manager..."
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all resize-none"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#D9D9D9",
                  color: "#1F1F1E",
                }}
              />
            </div>

            {/* Warning Message */}
            <div className="p-4 rounded-lg border" style={{ backgroundColor: "#FEF3C7", borderColor: "#F59E0B" }}>
              <div className="flex items-start space-x-3">
                <AlertTriangle size={20} style={{ color: "#F59E0B" }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: "#92400E" }}>
                    Important Notice
                  </p>
                  <p className="text-sm mt-1" style={{ color: "#92400E" }}>
                    Your manager will be immediately notified of this absence request. Please ensure all urgent tasks
                    are delegated or rescheduled.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t" style={{ borderColor: "#D9D9D9" }}>
          <div className="text-sm" style={{ color: "#888886" }}>
            This will notify your manager immediately
          </div>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg font-medium transition-all hover:scale-105 border"
              style={{
                backgroundColor: "transparent",
                color: "#888886",
                borderColor: "#D9D9D9",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.type || !formData.reason}
              className="flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "#DC2626",
                color: "#FFFFFF",
              }}
            >
              <Send size={16} />
              <span>{isSubmitting ? "Submitting..." : "Submit Absence"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
