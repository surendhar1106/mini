import { useEffect, useState } from "react";
import { Briefcase, FileText, UserCheck, CheckCircle, XCircle, Calendar, TrendingUp } from "lucide-react";
import AppLayout from "@/layouts/AppLayout";
import StatCard from "@/components/ui/StatCard";
import ErrorState from "@/components/ui/ErrorState";
import { getCompanyDashboard } from "@/api/companyApi";
import type { CompanyDashboard } from "@/types";

export default function CompanyDashboardPage() {
  const [data, setData] = useState<CompanyDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetch = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getCompanyDashboard();
      setData(res.data);
    } catch {
      setError("Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  return (
    <AppLayout breadcrumb={["Company", "Dashboard"]}>
      <div className="p-6 max-w-[1400px]">
        <div className="mb-6">
          {loading ? (
            <div className="h-6 w-48 bg-gray-100 rounded animate-pulse" />
          ) : (
            <h1 className="text-xl font-semibold text-[#111827]">{data?.companyName ?? "Company Dashboard"}</h1>
          )}
          <p className="text-sm text-[#6B7280] mt-0.5">Recruitment overview and drive performance.</p>
        </div>

        {error ? (
          <ErrorState message={error} onRetry={fetch} />
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <StatCard label="Total Drives" value={data?.totalDrives} icon={<Briefcase className="w-5 h-5" />} loading={loading} />
              <StatCard label="Total Applications" value={data?.totalApplications} icon={<FileText className="w-5 h-5" />} loading={loading} />
              <StatCard label="Scheduled Interviews" value={data?.scheduledInterviews} icon={<Calendar className="w-5 h-5" />} accent="bg-blue-50 text-blue-600" loading={loading} />
              <StatCard label="Selected Candidates" value={data?.selectedCount} icon={<CheckCircle className="w-5 h-5" />} accent="bg-emerald-50 text-emerald-600" loading={loading} />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Applied" value={data?.appliedCount} icon={<TrendingUp className="w-5 h-5" />} loading={loading} />
              <StatCard label="Shortlisted" value={data?.shortlistedCount} icon={<UserCheck className="w-5 h-5" />} accent="bg-purple-50 text-purple-600" loading={loading} />
              <StatCard label="Selected" value={data?.selectedCount} icon={<CheckCircle className="w-5 h-5" />} accent="bg-emerald-50 text-emerald-600" loading={loading} />
              <StatCard label="Rejected" value={data?.rejectedCount} icon={<XCircle className="w-5 h-5" />} accent="bg-red-50 text-red-500" loading={loading} />
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
