"use client"

import type React from "react"

import { useState } from "react"
import { X, Search, User, Phone, Mail, MapPin, Building, Eye } from "lucide-react"
import { useRouter } from "next/navigation"

interface Customer {
  id: string
  serialNo: number
  name: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  pincode: string
  company: string
  designation: string
  leadStatus: string
  callStatus: string
  formSubmissionDate: string
  lastContactDate?: string
  nextCallDate?: string
  roofArea?: string
  monthlyBill?: string
  energyRequirement?: string
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<Customer[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  // Mock customer database - in real app this would come from API
  const mockCustomers: Customer[] = [
    {
      id: "1",
      serialNo: 1,
      name: "John Doe",
      phone: "+91 9876543210",
      email: "john.doe@email.com",
      address: "123 Solar Street, Green Colony",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      company: "Tech Solutions Pvt Ltd",
      designation: "Manager",
      leadStatus: "newlead",
      callStatus: "followup",
      formSubmissionDate: "2024-01-18",
      lastContactDate: "2024-01-19",
      nextCallDate: "2024-01-22",
      roofArea: "1200 sq ft",
      monthlyBill: "₹8,500",
      energyRequirement: "5 kW",
    },
    {
      id: "2",
      serialNo: 2,
      name: "Jane Smith",
      phone: "+91 9876543211",
      email: "jane.smith@email.com",
      address: "456 Energy Avenue, Eco Park",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411001",
      company: "Green Energy Corp",
      designation: "Director",
      leadStatus: "inprocess",
      callStatus: "upcoming",
      formSubmissionDate: "2024-01-15",
      lastContactDate: "2024-01-17",
      nextCallDate: "2024-01-23",
      roofArea: "800 sq ft",
      monthlyBill: "₹6,200",
      energyRequirement: "3 kW",
    },
    {
      id: "3",
      serialNo: 3,
      name: "Mike Johnson",
      phone: "+91 9876543212",
      email: "mike.johnson@email.com",
      address: "789 Power Lane, Solar City",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
      company: "Solar Innovations Ltd",
      designation: "CEO",
      leadStatus: "sitevisits",
      callStatus: "overdue",
      formSubmissionDate: "2024-01-10",
      lastContactDate: "2024-01-12",
      roofArea: "2000 sq ft",
      monthlyBill: "₹12,000",
      energyRequirement: "8 kW",
    },
    {
      id: "4",
      serialNo: 4,
      name: "Sarah Wilson",
      phone: "+91 9876543213",
      email: "sarah.wilson@email.com",
      address: "321 Renewable Road, Clean Colony",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600001",
      company: "Eco Solutions Inc",
      designation: "Operations Manager",
      leadStatus: "estimatesent",
      callStatus: "followup",
      formSubmissionDate: "2024-01-16",
      lastContactDate: "2024-01-18",
      roofArea: "1500 sq ft",
      monthlyBill: "₹9,800",
      energyRequirement: "6 kW",
    },
    {
      id: "5",
      serialNo: 5,
      name: "David Brown",
      phone: "+91 9876543214",
      email: "david.brown@email.com",
      address: "654 Sustainable Street, Future Park",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500001",
      company: "Renewable Tech Pvt Ltd",
      designation: "Technical Head",
      leadStatus: "leadwon",
      callStatus: "upcoming",
      formSubmissionDate: "2024-01-14",
      lastContactDate: "2024-01-19",
      nextCallDate: "2024-01-25",
      roofArea: "1800 sq ft",
      monthlyBill: "₹11,200",
      energyRequirement: "7 kW",
    },
    {
      id: "6",
      serialNo: 6,
      name: "Lisa Anderson",
      phone: "+91 9876543215",
      email: "lisa.anderson@email.com",
      address: "987 Clean Energy Boulevard, Green Valley",
      city: "Delhi",
      state: "Delhi",
      pincode: "110001",
      company: "Smart Energy Solutions",
      designation: "Project Manager",
      leadStatus: "newlead",
      callStatus: "overdue",
      formSubmissionDate: "2024-01-08",
      roofArea: "1000 sq ft",
      monthlyBill: "₹7,500",
      energyRequirement: "4 kW",
    },
    {
      id: "7",
      serialNo: 7,
      name: "Robert Taylor",
      phone: "+91 9876543216",
      email: "robert.taylor@email.com",
      address: "147 Solar Avenue, Tech Park",
      city: "Ahmedabad",
      state: "Gujarat",
      pincode: "380001",
      company: "Future Power Systems",
      designation: "VP Engineering",
      leadStatus: "inprocess",
      callStatus: "followup",
      formSubmissionDate: "2024-01-17",
      lastContactDate: "2024-01-18",
      roofArea: "2200 sq ft",
      monthlyBill: "₹13,500",
      energyRequirement: "9 kW",
    },
    {
      id: "8",
      serialNo: 8,
      name: "Emily Davis",
      phone: "+91 9876543217",
      email: "emily.davis@email.com",
      address: "258 Renewable Street, Innovation Hub",
      city: "Kolkata",
      state: "West Bengal",
      pincode: "700001",
      company: "Clean Energy Partners",
      designation: "Business Head",
      leadStatus: "sitevisits",
      callStatus: "upcoming",
      formSubmissionDate: "2024-01-16",
      lastContactDate: "2024-01-19",
      nextCallDate: "2024-01-24",
      roofArea: "1600 sq ft",
      monthlyBill: "₹10,200",
      energyRequirement: "6.5 kW",
    },
    {
      id: "9",
      serialNo: 9,
      name: "Alex Kumar",
      phone: "+91 9876543218",
      email: "alex.kumar@email.com",
      address: "369 Green Power Lane, Eco City",
      city: "Jaipur",
      state: "Rajasthan",
      pincode: "302001",
      company: "Tech Innovations",
      designation: "Founder",
      leadStatus: "newlead",
      callStatus: "followup",
      formSubmissionDate: "2024-01-19",
      roofArea: "1400 sq ft",
      monthlyBill: "₹8,900",
      energyRequirement: "5.5 kW",
    },
    {
      id: "10",
      serialNo: 10,
      name: "Priya Sharma",
      phone: "+91 9876543219",
      email: "priya.sharma@email.com",
      address: "741 Solar Solutions Road, Green District",
      city: "Lucknow",
      state: "Uttar Pradesh",
      pincode: "226001",
      company: "Green Solutions Ltd",
      designation: "General Manager",
      leadStatus: "estimatesent",
      callStatus: "overdue",
      formSubmissionDate: "2024-01-05",
      lastContactDate: "2024-01-10",
      roofArea: "1300 sq ft",
      monthlyBill: "₹8,200",
      energyRequirement: "5.2 kW",
    },
  ]

  const handleSearch = async () => {
    if (!searchTerm.trim()) return

    setIsSearching(true)
    setHasSearched(true)

    // Simulate API call delay
    setTimeout(() => {
      const results = mockCustomers.filter((customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase().trim()),
      )
      setSearchResults(results)
      setIsSearching(false)
    }, 800)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handleCustomerClick = (customerId: string) => {
    router.push(`/dashboard/salesperson/customer/${customerId}`)
    onClose()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return { bg: "#D1FAE5", text: "#065F46" }
      case "overdue":
        return { bg: "#FEE2E2", text: "#991B1B" }
      case "followup":
        return { bg: "#FEF3C7", text: "#92400E" }
      case "newlead":
        return { bg: "#DBEAFE", text: "#1E40AF" }
      case "inprocess":
        return { bg: "#FEF3C7", text: "#92400E" }
      case "sitevisits":
        return { bg: "#F3E8FF", text: "#7C3AED" }
      case "estimatesent":
        return { bg: "#E0F2FE", text: "#0369A1" }
      case "leadwon":
        return { bg: "#D1FAE5", text: "#065F46" }
      default:
        return { bg: "#F3F4F6", text: "#374151" }
    }
  }

  const clearSearch = () => {
    setSearchTerm("")
    setSearchResults([])
    setHasSearched(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }} onClick={onClose} />

      {/* Modal */}
      <div
        className="relative w-full max-w-4xl mx-4 rounded-lg shadow-xl max-h-[85vh] overflow-hidden"
        style={{ backgroundColor: "#F4F4F1" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "#D9D9D9" }}>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: "#F16336" }}>
              <Search size={24} style={{ color: "#FFFFFF" }} />
            </div>
            <div>
              <h2 className="text-2xl font-bold" style={{ color: "#1F1F1E" }}>
                Search Customers
              </h2>
              <p className="text-sm" style={{ color: "#888886" }}>
                Find customers by their name
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
            <X size={24} style={{ color: "#888886" }} />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-6 border-b" style={{ borderColor: "#D9D9D9" }}>
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                style={{ color: "#888886" }}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#D9D9D9",
                  color: "#1F1F1E",
                }}
                placeholder="Enter customer name to search..."
                autoFocus
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={!searchTerm.trim() || isSearching}
              className="px-6 py-3 rounded-lg font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "#F16336",
                color: "#FFFFFF",
              }}
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
            {hasSearched && (
              <button
                onClick={clearSearch}
                className="px-4 py-3 rounded-lg font-medium transition-all hover:scale-105 border"
                style={{
                  backgroundColor: "transparent",
                  color: "#888886",
                  borderColor: "#D9D9D9",
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Search Results */}
        <div className="overflow-y-auto max-h-[50vh]">
          {isSearching ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "#F16336" }}></div>
              <span className="ml-3" style={{ color: "#888886" }}>
                Searching customers...
              </span>
            </div>
          ) : hasSearched ? (
            searchResults.length > 0 ? (
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold" style={{ color: "#1F1F1E" }}>
                    Search Results ({searchResults.length} found)
                  </h3>
                </div>
                <div className="space-y-4">
                  {searchResults.map((customer) => (
                    <div
                      key={customer.id}
                      onClick={() => handleCustomerClick(customer.id)}
                      className="p-5 rounded-lg border cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] hover:border-orange-300"
                      style={{ backgroundColor: "#FFFFFF", borderColor: "#D9D9D9" }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {/* Serial Number */}
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center font-bold"
                            style={{ backgroundColor: "#F16336", color: "#FFFFFF" }}
                          >
                            {customer.serialNo}
                          </div>

                          {/* Customer Info */}
                          <div className="flex-1">
                            <h3 className="font-bold text-lg" style={{ color: "#1F1F1E" }}>
                              {customer.name}
                            </h3>
                            <div className="flex items-center space-x-2 mb-2">
                              <Building size={14} style={{ color: "#888886" }} />
                              <span className="text-sm" style={{ color: "#888886" }}>
                                {customer.company} • {customer.designation}
                              </span>
                            </div>
                            <div className="flex items-center space-x-6 mb-2">
                              <div className="flex items-center space-x-2">
                                <Phone size={14} style={{ color: "#888886" }} />
                                <span className="text-sm" style={{ color: "#1F1F1E" }}>
                                  {customer.phone}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Mail size={14} style={{ color: "#888886" }} />
                                <span className="text-sm" style={{ color: "#1F1F1E" }}>
                                  {customer.email}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin size={14} style={{ color: "#888886" }} />
                              <span className="text-sm" style={{ color: "#888886" }}>
                                {customer.city}, {customer.state} - {customer.pincode}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status and Action */}
                        <div className="text-right">
                          <div className="flex flex-col space-y-2 mb-3">
                            <span
                              className="px-3 py-1 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: getStatusColor(customer.callStatus).bg,
                                color: getStatusColor(customer.callStatus).text,
                              }}
                            >
                              {customer.callStatus.charAt(0).toUpperCase() + customer.callStatus.slice(1)}
                            </span>
                            <span
                              className="px-3 py-1 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: getStatusColor(customer.leadStatus).bg,
                                color: getStatusColor(customer.leadStatus).text,
                              }}
                            >
                              {customer.leadStatus.charAt(0).toUpperCase() + customer.leadStatus.slice(1)}
                            </span>
                          </div>
                          <button
                            className="flex items-center space-x-1 px-3 py-1 rounded-lg font-medium transition-all hover:scale-105 text-xs"
                            style={{ backgroundColor: "#F16336", color: "#FFFFFF" }}
                          >
                            <Eye size={12} />
                            <span>View Profile</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <User size={48} className="mx-auto mb-4" style={{ color: "#D9D9D9" }} />
                <h3 className="text-lg font-medium mb-2" style={{ color: "#1F1F1E" }}>
                  No customers found
                </h3>
                <p style={{ color: "#888886" }}>
                  No customers match the name "{searchTerm}". Try searching with a different name.
                </p>
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <Search size={48} className="mx-auto mb-4" style={{ color: "#D9D9D9" }} />
              <h3 className="text-lg font-medium mb-2" style={{ color: "#1F1F1E" }}>
                Search for Customers
              </h3>
              <p style={{ color: "#888886" }}>
                Enter a customer name in the search box above to find their profile and details.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {hasSearched && searchResults.length > 0 && (
          <div className="flex items-center justify-between p-6 border-t" style={{ borderColor: "#D9D9D9" }}>
            <div className="text-sm" style={{ color: "#888886" }}>
              Click on any customer card to view their detailed profile
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg font-medium transition-all hover:scale-105"
              style={{ backgroundColor: "#F16336", color: "#FFFFFF" }}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
