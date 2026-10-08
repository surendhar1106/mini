import { useState } from "react";
import { AlertTriangle, AlertCircle, Info, Shield } from "lucide-react";
import AppLayout from "@/layouts/AppLayout";

const alerts = [
  { id: 1, priority: "CRITICAL", title: "Multiple failed login attempts detected", description: "Account bruteforce attempt identified on 3 college accounts. Accounts temporarily locked.", time: "2 min ago" },
  { id: 2, priority: "HIGH", title: "Company approval backlog growing", description: "12 company registrations have been pending for more than 48 hours without review.", time: "1 hr ago" },
  { id: 3, priority: "HIGH", title: "Placement drive deadline approaching", description: "4 open drives have application deadlines within 24 hours with low application counts.", time: "3 hrs ago" },
  { id: 4, priority: "MEDIUM", title: "Student verification queue", description: "35 student profiles awaiting college verification for more than 72 hours.", time: "5 hrs ago" },
  { id: 5, priority: "MEDIUM", title: "Resume upload failures detected", description: "6 students reported PDF upload failures in the last 4 hours.", time: "6 hrs ago" },
  { id: 6, priority: "LOW", title: "College profile incomplete", description: "14 approved colleges have not completed their profile setup.", time: "1 day ago" },
  { id: 7, priority: "LOW", title: "Inactive company accounts", description: "8 approved companies have not created any placement drives in 30+ days.", time: "2 days ago" },
];

const priorityConfig: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  CRITICAL: { color: "text-red-700", bg: "bg-red-50 border-red-200", icon: <AlertTriangle className="w-4 h-4 text-red-600" /> },
  HIGH: { color: "text-orange-700", bg: "bg-orange-50 border-orange-200", icon: <AlertCircle className="w-4 h-4 text-orange-600" /> },
  MEDIUM: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: <AlertCircle className="w-4 h-4 text-amber-500" /> },
  LOW: { color: "text-blue-700", bg: "bg-blue-50 border-blue-100", icon: <Info className="w-4 h-4 text-blue-500" /> },
};

export default function OwnerGovernance() {
  const [filter, setFilter] = useState("ALL");

  const filtered = filter === "ALL" ? alerts : alerts.filter((a) => a.priority === filter);

  return (
    <AppLayout breadcrumb={["Owner", "Governance"]}>
      <div className="p-6 max-w-[1400px]">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-[#111827]">Platform Governance</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">Monitor compliance alerts and governance issues.</p>
        </div>

        <div className="flex items-center gap-2 mb-5">
          <Shield className="w-4 h-4 text-[#6B7280]" />
          <span className="text-sm text-[#6B7280]">Active alerts: <span className="font-semibold text-[#111827]">{alerts.length}</span></span>
          <div className="ml-auto flex gap-2">
            {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((p) => (
              <button
                key={p}
                onClick={() => setFilter(p)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${filter === p ? "bg-[#374151] text-white" : "bg-white border border-[#E5E7EB] text-[#6B7280] hover:bg-gray-50"}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((alert) => {
            const cfg = priorityConfig[alert.priority];
            return (
              <div key={alert.id} className={`flex items-start gap-4 p-4 rounded-xl border ${cfg.bg}`}>
                <div className="mt-0.5">{cfg.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className={`text-[10px] font-semibold uppercase tracking-wider ${cfg.color} mr-2`}>{alert.priority}</span>
                      <span className="text-sm font-medium text-[#111827]">{alert.title}</span>
                    </div>
                    <span className="text-xs text-[#9CA3AF] flex-shrink-0">{alert.time}</span>
                  </div>
                  <p className="text-sm text-[#6B7280] mt-1">{alert.description}</p>
                </div>
                <button className="flex-shrink-0 px-3 py-1.5 text-xs font-medium bg-white border border-[#E5E7EB] rounded-lg hover:bg-gray-50 transition-colors text-[#374151]">
                  Review
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
