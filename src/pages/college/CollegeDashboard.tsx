import { useEffect, useState } from "react";
import { Users, CheckCircle, Clock, XCircle, FileText, UserCheck, TrendingUp } from "lucide-react";
import AppLayout from "@/layouts/AppLayout";
import StatCard from "@/components/ui/StatCard";
import ErrorState from "@/components/ui/ErrorState";
import { getCollegeDashboard } from "@/api/collegeApi";
import type { CollegeDashboard } from "@/types";

export default function CollegeDashboardPage() {
  const [data, setData] = useState<CollegeDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetch = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getCollegeDashboard();
      setData(res.data);
    } catch {
      setError("Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  return (
    <AppLayout breadcrumb={["College", "Dashboard"]}>
      <div className="p-6 max-w-[1400px]">
        <div className="mb-6">
          {loading ? (
            <div className="h-6 w-48 bg-gray-100 rounded animate-pulse" />
          ) : (
            <>
              <h1 className="text-xl font-semibold text-[#111827]">{data?.collegeName ?? "College Dashboard"}</h1>
              <p className="text-sm text-[#6B7280] mt-0.5">Code: <span className="font-mono">{data?.collegeCode}</span></p>
            </>
          )}
        </div>

        {error ? (
          <ErrorState message={error} onRetry={fetch} />
        ) : (
          <>
            <div className="mb-2">
              <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-widest mb-3">Students</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Students" value={data?.totalStudents} icon={<Users className="w-5 h-5" />} loading={loading} />
                <StatCard label="Verified" value={data?.verifiedStudents} icon={<CheckCircle className="w-5 h-5" />} accent="bg-emerald-50 text-emerald-600" loading={loading} />
                <StatCard label="Pending Verification" value={data?.pendingStudents} icon={<Clock className="w-5 h-5" />} accent="bg-amber-50 text-amber-600" loading={loading} />
                <StatCard label="Rejected" value={data?.rejectedStudents} icon={<XCircle className="w-5 h-5" />} accent="bg-red-50 text-red-500" loading={loading} />
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-widest mb-3">Applications</p>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard label="Total Applications" value={data?.totalApplications} icon={<FileText className="w-5 h-5" />} loading={loading} />
                <StatCard label="Applied" value={data?.appliedApplications} icon={<TrendingUp className="w-5 h-5" />} loading={loading} />
                <StatCard label="Shortlisted" value={data?.shortlistedStudents} icon={<UserCheck className="w-5 h-5" />} accent="bg-purple-50 text-purple-600" loading={loading} />
                <StatCard label="Selected" value={data?.selectedStudents} icon={<CheckCircle className="w-5 h-5" />} accent="bg-emerald-50 text-emerald-600" loading={loading} />
                <StatCard label="Rejected" value={data?.rejectedApplications} icon={<XCircle className="w-5 h-5" />} accent="bg-red-50 text-red-500" loading={loading} />
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
