"use client";
import { useState, useEffect } from "react";
import { LeadsProvider, useLeads } from "./LeadsContext";
import { useRouter } from "next/navigation";
import {
  Users,
  Phone,
  Calendar,
  Clock,
  AlertCircle,
  TrendingUp,
  FileText,
  CheckCircle,
  Target,
  UserX,
  Search,
} from "lucide-react";
import CustomerListModal from "./components/customer-list-modal";
import AbsenceModal from "./components/absence-modal";
import SearchModal from "./components/search-modal";

// Helper function to calculate days difference
function getDaysDifference(date1: string, date2: string = new Date().toISOString().split("T")[0]) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = d2.getTime() - d1.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Helper function to determine call status based on dates and interactions
function determineCallStatus(customer: any) {
  const today = new Date().toISOString().split("T")[0];
  const daysSinceSubmission = getDaysDifference(customer.formSubmissionDate, today);
  if (customer.nextCallDate) {
    const daysToNextCall = getDaysDifference(today, customer.nextCallDate);
    if (daysToNextCall > 0) return "upcoming";
    if (daysToNextCall < 0) return "overdue";
  }
  if (!customer.lastContactDate && daysSinceSubmission > 2) {
    return "overdue";
  }
  if (customer.lastContactDate) {
    const daysSinceContact = getDaysDifference(customer.lastContactDate, today);
    if (daysSinceContact > 7) return "overdue";
  }
  if (customer.followupRequested) {
    return "followup";
  }
  if (customer.leadStatus === "newlead") {
    return "followup";
  }
  return "";
}

function SalespersonDashboardInner() {
  const router = useRouter();
  const [selectedKPI, setSelectedKPI] = useState<string | null>(null);
  const [showCustomerList, setShowCustomerList] = useState(false);
  const [showAbsenceModal, setShowAbsenceModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState<"present" | "absent" | null>(null);
  const [todayAbsenceRequest, setTodayAbsenceRequest] = useState<any>(null);
  const { leads: customers, refreshLeads } = useLeads();
  const [kpiCounts, setKpiCounts] = useState({
    upcoming: 0,
    overdue: 0,
    followup: 0,
    newlead: 0,
    inprocess: 0,
    sitevisit: 0,
    estimatesent: 0,
    leadwon: 0,
  });

  useEffect(() => {
    // Debug: log all leads fetched
    console.log("[DEBUG] All leads fetched:", customers);
    if (customers.length > 0) {
      console.log("[DEBUG] First lead object:", customers[0]);
    }

    // Helper function to calculate days difference
    function getDaysDifference(date1, date2 = new Date().toISOString().split("T")[0]) {
      const d1 = new Date(date1);
      const d2 = new Date(date2);
      const diffTime = d2.getTime() - d1.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    // Helper function to determine call status based on dates and interactions
    function determineCallStatus(customer) {
      const today = new Date().toISOString().split("T")[0];
      const daysSinceSubmission = getDaysDifference(customer.formSubmissionDate, today);
      if (customer.nextCallDate) {
        const daysToNextCall = getDaysDifference(today, customer.nextCallDate);
        if (daysToNextCall > 0) return "upcoming";
        if (daysToNextCall < 0) return "overdue";
      }
      if (!customer.lastContactDate && daysSinceSubmission > 2) {
        return "overdue";
      }
      if (customer.lastContactDate) {
        const daysSinceContact = getDaysDifference(customer.lastContactDate, today);
        if (daysSinceContact > 7) return "overdue";
      }
      if (customer.followupRequested) {
        return "followup";
      }
      if (customer.leadStatus === "newlead") {
        return "followup";
      }
      return "";
    }

    // Map leads to include callStatus: use backend value if present, else fallback to calculated
    const leadsWithStatus = customers.map((lead) => {
      const leadStatus = lead.leadStatus || 'newlead';
      const formSubmissionDate = lead.formSubmissionDate || lead.createdAt || new Date().toISOString().split('T')[0];
      // Use backend callStatus if present, else fallback to calculated
      const callStatus = lead.callStatus || determineCallStatus({ ...lead, leadStatus, formSubmissionDate });
      return {
        ...lead,
        leadStatus,
        formSubmissionDate,
        callStatus,
      };
    });

    // Only 'newlead' KPI should increase on new lead creation
    setKpiCounts({
      newlead: leadsWithStatus.filter((c) => c.leadStatus === "newlead").length,
      inprocess: leadsWithStatus.filter((c) => c.leadStatus === "inprocess").length,
      sitevisit: leadsWithStatus.filter((c) => c.leadStatus === "sitevisit").length,
      estimatesent: leadsWithStatus.filter((c) => c.leadStatus === "estimatesent").length,
      leadwon: leadsWithStatus.filter((c) => c.leadStatus === "leadwon").length,
      // Call status KPIs only update if a lead matches their logic
      followup: leadsWithStatus.filter((c) => c.callStatus === "followup").length,
      upcoming: leadsWithStatus.filter((c) => c.callStatus === "upcoming").length,
      overdue: leadsWithStatus.filter((c) => c.callStatus === "overdue").length,
    });

    const today = new Date().toISOString().split("T")[0];
    const storedAbsence = localStorage.getItem(`absence_${today}`);
    if (storedAbsence) {
      const absenceData = JSON.parse(storedAbsence);
      setTodayAbsenceRequest(absenceData);
      setAttendanceStatus("absent");
    } else {
      setAttendanceStatus("present");
    }
  }, [customers]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        refreshLeads();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [refreshLeads]);

  const callStatusKPIs = [
    {
      title: "Upcoming Calls",
      value: kpiCounts.upcoming.toString(),
      icon: Calendar,
      color: "#059669",
      type: "upcoming",
    },
    {
      title: "Overdue Calls",
      value: kpiCounts.overdue.toString(),
      icon: AlertCircle,
      color: "#DC2626",
      type: "overdue",
    },
    { title: "Followup Calls", value: kpiCounts.followup.toString(), icon: Phone, color: "#F16336", type: "followup" },
  ];

  const progressKPIs = [
    { title: "New Lead", value: kpiCounts.newlead.toString(), icon: Users, color: "#3B82F6", type: "newlead" },
    { title: "In Process", value: kpiCounts.inprocess.toString(), icon: Clock, color: "#F59E0B", type: "inprocess" },
    { title: "Site Visits",
      value: kpiCounts.sitevisit.toString(),
      icon: Target,
      color: "#8B5CF6",
      type: "sitevisit",
    },
    {
      title: "Estimate Sent",
      value: kpiCounts.estimatesent.toString(),
      icon: FileText,
      color: "#06B6D4",
      type: "estimatesent",
    },
    { title: "Lead Won", value: kpiCounts.leadwon.toString(), icon: CheckCircle, color: "#10B981", type: "leadwon" },
  ];

  const handleKPIClick = (type: string, title: string) => {
    setSelectedKPI(type);
    setShowCustomerList(true);
  };

  const handleAbsenceSubmit = (absenceData: any) => {
    const today = new Date().toISOString().split("T")[0];
    const absenceRequest = {
      ...absenceData,
      date: today,
      timestamp: new Date().toISOString(),
      salespersonName: localStorage.getItem("userName") || "Sales Person",
      salespersonEmail: localStorage.getItem("userEmail") || "salesperson@rockersolar.com",
      status: "pending",
    };
    localStorage.setItem(`absence_${today}`, JSON.stringify(absenceRequest));
    setTodayAbsenceRequest(absenceRequest);
    setAttendanceStatus("absent");
    console.log("Absence notification sent to manager:", absenceRequest);
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#1F1F1E" }}>
      {/* Header */}
      <header className="p-6 border-b" style={{ background: `linear-gradient(135deg, #1F1F1E 0%, #2A2A28 100%)`, borderColor: "#888886" }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "#F4F4F1" }}>Salesperson Dashboard</h1>
            <p style={{ color: "#888886" }}>Track your leads and manage customer relationships</p>
            <p className="text-sm mt-1" style={{ color: "#D9D9D9" }}>{getCurrentDate()}</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Attendance Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${attendanceStatus === "present" ? "bg-green-500" : "bg-red-500"}`} />
              <span className="text-sm" style={{ color: "#D9D9D9" }}>{attendanceStatus === "present" ? "Present" : "Absent"}</span>
            </div>
            {/* Search Functionality */}
            <div className="flex items-center space-x-2">
              <button onClick={() => setShowSearchModal(true)} className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 border" style={{ backgroundColor: "transparent", color: "#F4F4F1", borderColor: "#888886" }}>
                <Search size={16} />
                <span>Search Customers</span>
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#F16336" }}>
                <span className="text-sm font-semibold" style={{ color: "#FFFFFF" }}>SP</span>
              </div>
              <span style={{ color: "#D9D9D9" }}>Sales Person</span>
            </div>
          </div>
        </div>
      </header>
      <main className="p-6">
        {/* Attendance Section */}
        <div className="mb-8">
          <div className="p-6 rounded-lg border" style={{ backgroundColor: "#F4F4F1", borderColor: "#D9D9D9" }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold mb-2" style={{ color: "#1F1F1E" }}>Attendance Status</h3>
                {attendanceStatus === "present" ? (
                  <p style={{ color: "#059669" }}>✅ You are marked as present today</p>
                ) : todayAbsenceRequest ? (
                  <div>
                    <p style={{ color: "#DC2626" }}>❌ You are marked as absent today</p>
                    <div className="mt-2 p-3 rounded" style={{ backgroundColor: "#FEE2E2" }}>
                      <p className="text-sm font-medium" style={{ color: "#991B1B" }}>Absence Request Details:</p>
                      <p className="text-sm" style={{ color: "#991B1B" }}>Type: {todayAbsenceRequest.type}</p>
                      <p className="text-sm" style={{ color: "#991B1B" }}>Reason: {todayAbsenceRequest.reason}</p>
                      <p className="text-sm" style={{ color: "#991B1B" }}>Status: {todayAbsenceRequest.status}</p>
                    </div>
                  </div>
                ) : null}
              </div>
              {attendanceStatus === "present" && (
                <button onClick={() => setShowAbsenceModal(true)} className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105" style={{ backgroundColor: "#DC2626", color: "#FFFFFF" }}>
                  <UserX size={16} />
                  <span>Mark Absent</span>
                </button>
              )}
            </div>
          </div>
        </div>
        {/* Call Status Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6" style={{ color: "#F4F4F1" }}>
            Call Status
            <span className="text-sm font-normal ml-2" style={{ color: "#888886" }}>(Auto-updated based on Google form submissions and interactions)</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {callStatusKPIs.map((kpi, index) => (
              <div key={index} onClick={() => handleKPIClick(kpi.type, kpi.title)} className="p-6 rounded-xl border transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer" style={{ background: `linear-gradient(135deg, #F4F4F1 0%, #FFFFFF 100%)`, borderColor: "#D9D9D9", boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)" }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: kpi.color }}>
                    <kpi.icon size={28} style={{ color: "#FFFFFF" }} />
                  </div>
                  <TrendingUp size={20} style={{ color: kpi.color }} />
                </div>
                <h3 className="text-3xl font-bold mb-2" style={{ color: "#1F1F1E" }}>{kpi.value}</h3>
                <p className="text-sm font-medium" style={{ color: "#888886" }}>{kpi.title}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Progress Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6" style={{ color: "#F4F4F1" }}>Lead Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {progressKPIs.map((kpi, index) => (
              <div key={index} onClick={() => handleKPIClick(kpi.type, kpi.title)} className="p-6 rounded-xl border transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer" style={{ background: `linear-gradient(135deg, #F4F4F1 0%, #FFFFFF 100%)`, borderColor: "#D9D9D9", boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)" }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: kpi.color }}>
                    <kpi.icon size={24} style={{ color: "#FFFFFF" }} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: "#1F1F1E" }}>{kpi.value}</h3>
                <p className="text-sm font-medium" style={{ color: "#888886" }}>{kpi.title}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Business Logic Explanation */}
        <div className="mb-8">
          <div className="p-6 rounded-lg border" style={{ backgroundColor: "#F4F4F1", borderColor: "#D9D9D9" }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: "#1F1F1E" }}>📋 Call Status Logic</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 rounded" style={{ backgroundColor: "#FEF3C7" }}>
                <h4 className="font-semibold mb-2" style={{ color: "#92400E" }}>Followup Calls</h4>
                <ul style={{ color: "#92400E" }}>
                  <li>• New Google form submissions</li>
                  <li>• Recent customer interactions</li>
                  <li>• Customer requested callback</li>
                </ul>
              </div>
              <div className="p-3 rounded" style={{ backgroundColor: "#FEE2E2" }}>
                <h4 className="font-semibold mb-2" style={{ color: "#991B1B" }}>Overdue Calls</h4>
                <ul style={{ color: "#991B1B" }}>
                  <li>• Form submitted &gt;2 days ago, no contact</li>
                  <li>• Last contact &gt;7 days ago</li>
                  <li>• Missed scheduled call dates</li>
                </ul>
              </div>
              <div className="p-3 rounded" style={{ backgroundColor: "#D1FAE5" }}>
                <h4 className="font-semibold mb-2" style={{ color: "#065F46" }}>Upcoming Calls</h4>
                <ul style={{ color: "#065F46" }}>
                  <li>• Scheduled future calls</li>
                  <li>• Site visit appointments</li>
                  <li>• Follow-up meetings</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg border" style={{ backgroundColor: "#F4F4F1", borderColor: "#D9D9D9" }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: "#1F1F1E" }}>Today's Priority Tasks</h3>
            <div className="space-y-3">
              {kpiCounts.overdue > 0 && (
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#DC2626" }}></div>
                  <span style={{ color: "#1F1F1E" }}>
                    Contact {kpiCounts.overdue} overdue customer{kpiCounts.overdue === 1 ? '' : 's'}
                  </span>
                </div>
              )}
              {kpiCounts.followup > 0 && (
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#F16336" }}></div>
                  <span style={{ color: "#1F1F1E" }}>
                    Follow up with {kpiCounts.followup} pending lead{kpiCounts.followup === 1 ? '' : 's'}
                  </span>
                </div>
              )}
              {kpiCounts.upcoming > 0 && (
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#059669" }}></div>
                  <span style={{ color: "#1F1F1E" }}>
                    Prepare for {kpiCounts.upcoming} upcoming call{kpiCounts.upcoming === 1 ? '' : 's'}
                  </span>
                </div>
              )}
              {kpiCounts.overdue === 0 && kpiCounts.followup === 0 && kpiCounts.upcoming === 0 && (
                <div className="text-gray-500">No urgent tasks for today. Great job!</div>
              )}
            </div>
          </div>
          <div className="p-6 rounded-lg border" style={{ backgroundColor: "#F4F4F1", borderColor: "#D9D9D9" }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: "#1F1F1E" }}>Quick Actions</h3>
            <div className="space-y-3">
              <button onClick={() => router.push("/dashboard/salesperson/add-lead")} className="w-full p-3 rounded-lg font-medium transition-all hover:scale-105 text-left" style={{ backgroundColor: "#F16336", color: "#FFFFFF" }}>Add New Lead</button>
              <button onClick={() => router.push("/dashboard/salesperson/schedule-visit")} className="w-full p-3 rounded-lg font-medium transition-all hover:scale-105 border text-left" style={{ backgroundColor: "transparent", color: "#1F1F1E", borderColor: "#888886" }}>Schedule Site Visit</button>
            </div>
          </div>
        </div>
      </main>
      {/* Customer List Modal */}
      {showCustomerList && (
        <CustomerListModal
          isOpen={showCustomerList}
          onClose={() => setShowCustomerList(false)}
          kpiType={selectedKPI}
          title={
            callStatusKPIs.find((k) => k.type === selectedKPI)?.title ||
            progressKPIs.find((k) => k.type === selectedKPI)?.title ||
            ""
          }
        />
      )}
      {/* Absence Modal */}
      {showAbsenceModal && (
        <AbsenceModal
          isOpen={showAbsenceModal}
          onClose={() => setShowAbsenceModal(false)}
          onSubmit={handleAbsenceSubmit}
        />
      )}
      {/* Search Modal */}
      {showSearchModal && <SearchModal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} />}
    </div>
  );
}

export default function SalespersonDashboard() {
  return <SalespersonDashboardInner />;
}
// End of file
