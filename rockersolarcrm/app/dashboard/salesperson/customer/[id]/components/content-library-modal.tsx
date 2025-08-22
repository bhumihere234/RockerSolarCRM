"use client"

import { useState } from "react"
import { X, MessageSquare, FileText, Send, Copy } from "lucide-react"

interface ContentLibraryModalProps {
  isOpen: boolean
  onClose: () => void
  onSend: (content: string, files?: string[]) => void
  customerName: string
}

export default function ContentLibraryModal({ isOpen, onClose, onSend, customerName }: ContentLibraryModalProps) {
  const [activeTab, setActiveTab] = useState("templates")
  const [selectedContent, setSelectedContent] = useState("")
  const [customMessage, setCustomMessage] = useState("")

  // Mock content data
  const whatsappTemplates = [
    {
      id: "1",
      title: "Welcome Message",
      content: `Hello ${customerName}! 👋\n\nThank you for your interest in ROCKER SOLAR! ☀️\n\nWe're excited to help you switch to clean, renewable energy and save on your electricity bills.\n\nOur team will contact you shortly to discuss your solar requirements.\n\nBest regards,\nROCKER SOLAR Team`,
    },
    {
      id: "2",
      title: "Follow-up Message",
      content: `Hi ${customerName}! 🌟\n\nI hope you're doing well. I wanted to follow up on our previous conversation about solar installation for your property.\n\nDo you have any questions about our solar solutions? I'm here to help!\n\nWould you like to schedule a site visit to assess your requirements?\n\nLooking forward to hearing from you!\n\nBest regards,\nROCKER SOLAR Team`,
    },
    {
      id: "3",
      title: "Quote Ready",
      content: `Great news, ${customerName}! 🎉\n\nYour customized solar quote is ready! Based on your requirements, we've prepared a detailed proposal that includes:\n\n✅ System specifications\n✅ Cost breakdown\n✅ Savings projection\n✅ Installation timeline\n\nWould you like me to send it over WhatsApp or email?\n\nBest regards,\nROCKER SOLAR Team`,
    },
  ]

  const documents = [
    {
      id: "1",
      title: "Solar Panel Brochure",
      type: "PDF",
      description: "Complete guide to our solar panel systems",
    },
    {
      id: "2",
      title: "Price List 2024",
      type: "PDF",
      description: "Updated pricing for all solar products",
    },
    {
      id: "3",
      title: "Installation Process",
      type: "PDF",
      description: "Step-by-step installation guide",
    },
    {
      id: "4",
      title: "Customer Testimonials",
      type: "PDF",
      description: "Success stories from our customers",
    },
  ]

  const handleSendContent = () => {
    const contentToSend = selectedContent || customMessage
    if (contentToSend.trim()) {
      onSend(contentToSend)
      onClose()
    }
  }

  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content)
    // You could add a toast notification here
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }} onClick={onClose} />

      {/* Modal */}
      <div
        className="relative w-full max-w-4xl mx-4 rounded-lg shadow-xl max-h-[80vh] overflow-hidden"
        style={{ backgroundColor: "#F4F4F1" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "#D9D9D9" }}>
          <h2 className="text-2xl font-bold" style={{ color: "#1F1F1E" }}>
            Content Library
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
            <X size={24} style={{ color: "#888886" }} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b" style={{ borderColor: "#D9D9D9" }}>
          <button
            onClick={() => setActiveTab("templates")}
            className={`px-6 py-3 font-medium transition-colors ${activeTab === "templates" ? "border-b-2" : ""}`}
            style={{
              color: activeTab === "templates" ? "#F16336" : "#888886",
              borderColor: activeTab === "templates" ? "#F16336" : "transparent",
            }}
          >
            <MessageSquare size={16} className="inline mr-2" />
            WhatsApp Templates
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`px-6 py-3 font-medium transition-colors ${activeTab === "documents" ? "border-b-2" : ""}`}
            style={{
              color: activeTab === "documents" ? "#F16336" : "#888886",
              borderColor: activeTab === "documents" ? "#F16336" : "transparent",
            }}
          >
            <FileText size={16} className="inline mr-2" />
            Documents
          </button>
          <button
            onClick={() => setActiveTab("custom")}
            className={`px-6 py-3 font-medium transition-colors ${activeTab === "custom" ? "border-b-2" : ""}`}
            style={{
              color: activeTab === "custom" ? "#F16336" : "#888886",
              borderColor: activeTab === "custom" ? "#F16336" : "transparent",
            }}
          >
            Custom Message
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[50vh]">
          {activeTab === "templates" && (
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4">
                {whatsappTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedContent === template.content ? "ring-2" : ""
                    }`}
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor: selectedContent === template.content ? "#F16336" : "#D9D9D9",
                      ringColor: "#F16336",
                    }}
                    onClick={() => setSelectedContent(template.content)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold" style={{ color: "#1F1F1E" }}>
                        {template.title}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCopyContent(template.content)
                        }}
                        className="p-1 rounded hover:bg-gray-100 transition-colors"
                      >
                        <Copy size={16} style={{ color: "#888886" }} />
                      </button>
                    </div>
                    <p className="text-sm whitespace-pre-line" style={{ color: "#888886" }}>
                      {template.content.substring(0, 150)}...
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "documents" && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md"
                    style={{ backgroundColor: "#FFFFFF", borderColor: "#D9D9D9" }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded" style={{ backgroundColor: "#F16336" }}>
                        <FileText size={20} style={{ color: "#FFFFFF" }} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold" style={{ color: "#1F1F1E" }}>
                          {doc.title}
                        </h3>
                        <p className="text-sm" style={{ color: "#888886" }}>
                          {doc.description}
                        </p>
                        <span
                          className="text-xs px-2 py-1 rounded mt-1 inline-block"
                          style={{ backgroundColor: "#E0F2FE", color: "#0369A1" }}
                        >
                          {doc.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "custom" && (
            <div className="p-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#1F1F1E" }}>
                  Custom Message
                </label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={8}
                  placeholder={`Type your custom message for ${customerName}...`}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all resize-none"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "#D9D9D9",
                    color: "#1F1F1E",
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t" style={{ borderColor: "#D9D9D9" }}>
          <div className="text-sm" style={{ color: "#888886" }}>
            {selectedContent || customMessage ? "Content selected" : "Select content to send"}
          </div>
          <div className="flex space-x-4">
            <button
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
              onClick={handleSendContent}
              disabled={!selectedContent && !customMessage.trim()}
              className="flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "#25D366",
                color: "#FFFFFF",
              }}
            >
              <Send size={16} />
              <span>Send via WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
