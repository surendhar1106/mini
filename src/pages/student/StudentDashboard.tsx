import { useEffect, useState } from "react";
import { FileText, CheckCircle, XCircle, Calendar, TrendingUp, UserCheck, AlertCircle } from "lucide-react";
import AppLayout from "@/layouts/AppLayout";
import StatCard from "@/components/ui/StatCard";
import StatusBadge from "@/components/ui/StatusBadge";
import ErrorState from "@/components/ui/ErrorState";
import { getStudentDashboard } from "@/api/studentApi";
import type { StudentDashboard } from "@/types";

export default function StudentDashboardPage() {
  const [data, setData] = useState<StudentDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetch = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getStudentDashboard();
      setData(res.data);
    } catch {
      setError("Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  return (
    <AppLayout breadcrumb={["Student", "Dashboard"]}>
      <div className="p-6 max-w-[1400px]">
        <div className="mb-6">
          {loading ? (
            <div className="h-6 w-48 bg-gray-100 rounded animate-pulse" />
          ) : (
            <>
              <h1 className="text-xl font-semibold text-[#111827]">Welcome, {data?.studentName}</h1>
              <p className="text-sm text-[#6B7280] mt-0.5">{data?.department} · {data?.course} · Class of {data?.graduationYear}</p>
            </>
          )}
        </div>

        {error ? (
          <ErrorState message={error} onRetry={fetch} />
        ) : (
          <>
            {/* Status banner */}
            {!loading && data && (
              <div className={`flex items-center gap-3 p-4 rounded-xl border mb-5 ${
                data.verificationStatus === "VERIFIED"
                  ? "bg-emerald-50 border-emerald-200"
                  : data.verificationStatus === "PENDING"
                  ? "bg-amber-50 border-amber-200"
                  : "bg-red-50 border-red-200"
              }`}>
                <AlertCircle className={`w-4 h-4 flex-shrink-0 ${data.verificationStatus === "VERIFIED" ? "text-emerald-600" : data.verificationStatus === "PENDING" ? "text-amber-600" : "text-red-500"}`} />
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-sm font-medium text-[#374151]">Verification Status:</span>
                  <StatusBadge status={data.verificationStatus} />
                  {!data.resumeStatus && <span className="ml-4 text-sm text-[#6B7280]">· Resume: <span className="font-medium text-amber-600">Not uploaded</span></span>}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <StatCard label="Total Applications" value={data?.totalApplications} icon={<FileText className="w-5 h-5" />} loading={loading} />
              <StatCard label="Shortlisted" value={data?.shortlistedCount} icon={<UserCheck className="w-5 h-5" />} accent="bg-purple-50 text-purple-600" loading={loading} />
              <StatCard label="Selected" value={data?.selectedCount} icon={<CheckCircle className="w-5 h-5" />} accent="bg-emerald-50 text-emerald-600" loading={loading} />
              <StatCard label="Applied" value={data?.appliedCount} icon={<TrendingUp className="w-5 h-5" />} loading={loading} />
              <StatCard label="Rejected" value={data?.rejectedCount} icon={<XCircle className="w-5 h-5" />} accent="bg-red-50 text-red-500" loading={loading} />
              <StatCard label="Interviews" value={data?.interviews} icon={<Calendar className="w-5 h-5" />} accent="bg-blue-50 text-blue-600" loading={loading} />
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
