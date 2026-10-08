import { useEffect, useState } from "react";
import { GraduationCap, Building2, Users, Briefcase, FileText, Calendar, Clock, AlertCircle } from "lucide-react";
import AppLayout from "@/layouts/AppLayout";
import StatCard from "@/components/ui/StatCard";
import ErrorState from "@/components/ui/ErrorState";
import { getOwnerDashboard } from "@/api/ownerApi";
import type { OwnerDashboard } from "@/types";

export default function OwnerDashboard() {
  const [data, setData] = useState<OwnerDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getOwnerDashboard();
      setData(res.data);
    } catch {
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <AppLayout breadcrumb={["Owner", "Dashboard"]}>
      <div className="p-6 max-w-[1400px]">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-[#111827]">Platform Overview</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">Real-time snapshot of platform activity and health.</p>
        </div>

        {error ? (
          <ErrorState message={error} onRetry={fetchData} />
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard label="Total Colleges" value={data?.totalColleges} icon={<GraduationCap className="w-5 h-5" />} accent="bg-blue-50 text-blue-600" loading={loading} />
              <StatCard label="Total Companies" value={data?.totalCompanies} icon={<Building2 className="w-5 h-5" />} accent="bg-purple-50 text-purple-600" loading={loading} />
              <StatCard label="Total Students" value={data?.totalStudents} icon={<Users className="w-5 h-5" />} accent="bg-emerald-50 text-emerald-600" loading={loading} />
              <StatCard label="Placement Drives" value={data?.totalPlacementDrives} icon={<Briefcase className="w-5 h-5" />} accent="bg-amber-50 text-amber-600" loading={loading} />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <StatCard label="Applications" value={data?.totalApplications} icon={<FileText className="w-5 h-5" />} loading={loading} />
              <StatCard label="Interviews" value={data?.totalInterviews} icon={<Calendar className="w-5 h-5" />} loading={loading} />
              <StatCard label="Pending Approvals" value={(data?.pendingCollegeApprovals ?? 0) + (data?.pendingCompanyApprovals ?? 0)} icon={<Clock className="w-5 h-5" />} accent="bg-amber-50 text-amber-600" loading={loading} sub={`${data?.pendingCollegeApprovals ?? 0} colleges · ${data?.pendingCompanyApprovals ?? 0} companies`} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Pending Approvals Widget */}
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                <h3 className="text-sm font-semibold text-[#111827] mb-4">Pending Approvals</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-4 h-4 text-amber-600" />
                      <div>
                        <p className="text-sm font-medium text-[#374151]">College Approvals</p>
                        <p className="text-xs text-[#9CA3AF]">Awaiting administrator review</p>
                      </div>
                    </div>
                    <span className="text-lg font-semibold text-amber-700">{loading ? "—" : data?.pendingCollegeApprovals}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-4 h-4 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium text-[#374151]">Company Approvals</p>
                        <p className="text-xs text-[#9CA3AF]">Awaiting administrator review</p>
                      </div>
                    </div>
                    <span className="text-lg font-semibold text-purple-700">{loading ? "—" : data?.pendingCompanyApprovals}</span>
                  </div>
                </div>
              </div>

              {/* Platform Health */}
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                <h3 className="text-sm font-semibold text-[#111827] mb-4">Platform Health</h3>
                <div className="space-y-3">
                  {[
                    { label: "API Services", status: "Operational", color: "bg-emerald-400" },
                    { label: "Database", status: "Operational", color: "bg-emerald-400" },
                    { label: "Background Jobs", status: "Operational", color: "bg-emerald-400" },
                    { label: "Authentication", status: "Operational", color: "bg-emerald-400" },
                  ].map((h) => (
                    <div key={h.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${h.color}`} />
                        <span className="text-sm text-[#374151]">{h.label}</span>
                      </div>
                      <span className="text-xs text-emerald-600 font-medium">{h.status}</span>
                    </div>
                  ))}
                  <div className="mt-3 pt-3 border-t border-[#E5E7EB] flex items-center gap-1.5 text-xs text-[#9CA3AF]">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Last checked: just now
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
