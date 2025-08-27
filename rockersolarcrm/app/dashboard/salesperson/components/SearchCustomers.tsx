"use client";

import { useState, useEffect } from "react";
import { Input, Select, Option } from "@material-tailwind/react";
import { useRouter } from "next/navigation";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

type Customer = {
  id: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
};

export default function SearchCustomers({ isOpen, onClose }: Props) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [selectedKPI, setSelectedKPI] = useState("New Lead");
  const [error, setError] = useState<string>("");

  const fetchCustomers = async (kpi: string) => {
    try {
      const response = await fetch(`/api/leads?status=${encodeURIComponent(kpi)}`);
      const data = await response.json();
      if (response.ok) {
        setCustomers(data ?? []);
        setError("");
      } else {
        setError(data?.message || "Failed to fetch leads");
      }
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError("Error fetching customer data");
    }
  };

  useEffect(() => {
    fetchCustomers(selectedKPI);
  }, [selectedKPI]);

  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length) {
      const result = customers.filter((c) => {
        const name = (c.name ?? "").toLowerCase();
        const email = (c.email ?? "").toLowerCase();
        const phone = c.phone ?? "";
        return name.includes(q) || email.includes(q) || phone.includes(searchQuery);
      });
      setFilteredCustomers(result);
    } else {
      setFilteredCustomers(customers);
    }
  }, [searchQuery, customers]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Material Tailwind Select passes the value directly, not an event
  const handleKPIChange = (value: string | undefined) => {
    if (value) setSelectedKPI(value);
  };

  const handleCustomerClick = (customerId: string) => {
    router.push(`/dashboard/salesperson/customer/${customerId}`);
  };

  const handleDelete = async (customerId: string) => {
    try {
      const response = await fetch("/api/leads", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: customerId }),
      });

      if (response.ok) {
        setCustomers((prev) => prev.filter((c) => c.id !== customerId));
        setFilteredCustomers((prev) => prev.filter((c) => c.id !== customerId));
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
      className={`${isOpen ? "block" : "hidden"} fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center`}
    >
      <div
        className="relative bg-white rounded-lg p-6 w-full max-w-md"
        style={{ maxHeight: "80vh", overflowY: "auto" }}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✖
        </button>

        <h3 className="text-xl font-semibold text-center">Search Customers</h3>

        <div className="mt-4 space-y-4">
          {/* KPI Dropdown */}
          <Select
            label="Select KPI"
            value={selectedKPI}
            onChange={handleKPIChange}
            name="kpi"
            id="kpi-select"
            placeholder="Select KPI"
            onResize={() => {}}
            onResizeCapture={() => {}}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
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
            name="customer-search"
            id="customer-search"
            placeholder="Search by name, email, or phone"
            crossOrigin="anonymous"
            onResize={() => {}}
            onResizeCapture={() => {}}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          />
        </div>

        {error && (
          <div className="p-4 mt-4 rounded bg-red-100 text-red-600">{error}</div>
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
                  {(customer.name ?? "No Name")} - {(customer.email ?? "No Email")} - {(customer.phone ?? "No Phone")}
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
