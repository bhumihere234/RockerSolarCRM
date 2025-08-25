"use client";

import { useState, useEffect } from "react";
import { Input, Select, Option } from "@material-tailwind/react"; // Updated to use Select component for KPIs
import { useRouter } from "next/navigation";

export default function SearchCustomers({ isOpen, onClose }: Props) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState<any[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<any[]>([]);
  const [selectedKPI, setSelectedKPI] = useState("New Lead"); // Default KPI
  const [error, setError] = useState<string>("");

  // Fetching customer data from API based on KPI
  const fetchCustomers = async (kpi: string) => {
    try {
      const response = await fetch(`/api/leads?status=${kpi}`);
      const data = await response.json();
      if (response.ok) {
        setCustomers(data);
      } else {
        setError("Failed to fetch leads");
      }
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError("Error fetching customer data");
    }
  };

  useEffect(() => {
    fetchCustomers(selectedKPI); // Fetch leads when the KPI changes
  }, [selectedKPI]);

  useEffect(() => {
    // Filter customers based on name, email, or phone
    if (searchQuery.length > 0) {
      const result = customers.filter((customer) => {
        return (
          customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.phone.includes(searchQuery)
        );
      });
      setFilteredCustomers(result);
    } else {
      setFilteredCustomers(customers);
    }
  }, [searchQuery, customers]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleKPIChange = (e: React.ChangeEvent<{ value: string }>) => {
    setSelectedKPI(e.target.value); // Update the KPI and fetch filtered customers
  };

  const handleCustomerClick = (customerId: string) => {
    // Handle click, redirect or open customer detail
    console.log("Redirecting to customer:", customerId);
    router.push(`/dashboard/salesperson/customer/${customerId}`);
  };

  const handleDelete = async (customerId: string) => {
    try {
      const response = await fetch("/api/leads", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ leadId: customerId }),
      });

      if (response.ok) {
        setCustomers((prevCustomers) =>
          prevCustomers.filter((customer) => customer.id !== customerId)
        );
        setFilteredCustomers((prevFilteredCustomers) =>
          prevFilteredCustomers.filter((customer) => customer.id !== customerId)
        );
      } else {
        setError("Failed to delete lead");
      }
    } catch (err) {
      console.error("Error deleting customer:", err);
      setError("Error deleting customer");
    }
  };

  return (
    <div
      className={`${
        isOpen ? "block" : "hidden"
      } fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center`}
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-md"
        style={{ maxHeight: "80vh", overflowY: "auto" }}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✖
        </button>
        <h3 className="text-xl font-semibold text-center">Search Customers</h3>

        {/* KPI Dropdown */}
        <Select
          label="Select KPI"
          value={selectedKPI}
          onChange={handleKPIChange}
          className="mb-4"
        >
          <Option value="New Lead">New Lead</Option>
          <Option value="Overdue">Overdue</Option>
          <Option value="Follow Up">Follow Up</Option>
          <Option value="Closed">Closed</Option>
        </Select>

        <Input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          label="Search by name, email, or phone"
          fullWidth
        />

        {error && (
          <div
            className="p-4 mt-4 rounded bg-red-100 text-red-500"
            style={{ backgroundColor: "#FEE2E2" }}
          >
            {error}
          </div>
        )}

        {filteredCustomers.length === 0 ? (
          <div className="text-center mt-4">No customers found</div>
        ) : (
          <ul className="mt-4 space-y-4">
            {filteredCustomers.map((customer) => (
              <li
                key={customer.id}
                className="flex justify-between items-center border-b py-2 cursor-pointer"
                onClick={() => handleCustomerClick(customer.id)}
              >
                <span>
                  {customer.name} - {customer.email} - {customer.phone}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    className="text-orange-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(customer.id);
                    }}
                  >
                    Delete
                  </button>
                  <button className="text-blue-500">View</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
