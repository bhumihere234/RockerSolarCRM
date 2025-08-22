"use client"

import type React from "react"

import { useState } from "react"
import { X, Calendar, Clock, FileText } from "lucide-react"

interface CallLog {
  id: string
  date: string
  time: string
  duration: string
  notes: string
  outcome: string
}

interface AddCallLogModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (callLog: CallLog) => void
}

export default function AddCallLogModal({ isOpen, onClose, onSave }: AddCallLogModalProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    time: new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }),
    duration: "",
    notes: "",
    outcome: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newCallLog: CallLog = {
      id: Date.now().toString(),
      date: formData.date,
      time: formData.time,
      duration: formData.duration,
      notes: formData.notes,
      outcome: formData.outcome,
    }
    onSave(newCallLog)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }} onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 rounded-lg shadow-xl" style={{ backgroundColor: "#F4F4F1" }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "#D9D9D9" }}>
          <h2 className="text-2xl font-bold" style={{ color: "#1F1F1E" }}>
            Add Call Log
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
            <X size={24} style={{ color: "#888886" }} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                Date
              </label>
              <div className="relative">
                <Calendar
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: "#888886" }}
                />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "#D9D9D9",
                    color: "#1F1F1E",
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                Time
              </label>
              <div className="relative">
                <Clock
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: "#888886" }}
                />
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "#D9D9D9",
                    color: "#1F1F1E",
                  }}
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
              Duration
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              placeholder="e.g., 15 mins"
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: "#FFFFFF",
                borderColor: "#D9D9D9",
                color: "#1F1F1E",
              }}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
              Call Notes
            </label>
            <div className="relative">
              <FileText size={20} className="absolute left-3 top-3" style={{ color: "#888886" }} />
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                placeholder="Enter detailed notes about the call..."
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

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
              Call Outcome
            </label>
            <select
              name="outcome"
              value={formData.outcome}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: "#FFFFFF",
                borderColor: "#D9D9D9",
                color: "#1F1F1E",
              }}
              required
            >
              <option value="">Select outcome</option>
              <option value="Follow-up scheduled">Follow-up scheduled</option>
              <option value="Information sent via email">Information sent via email</option>
              <option value="Site visit scheduled">Site visit scheduled</option>
              <option value="Quote requested">Quote requested</option>
              <option value="Not interested">Not interested</option>
              <option value="Call back later">Call back later</option>
              <option value="Deal closed">Deal closed</option>
            </select>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 border"
              style={{
                backgroundColor: "transparent",
                color: "#888886",
                borderColor: "#D9D9D9",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: "#F16336",
                color: "#FFFFFF",
              }}
            >
              Save Call Log
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
