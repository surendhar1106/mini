import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import AppLayout from "@/layouts/AppLayout";
import StatusBadge from "@/components/ui/StatusBadge";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import { getCollegeApplications } from "@/api/collegeApi";
import type { Application } from "@/types";

export default function CollegeApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetch = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getCollegeApplications();
      setApplications(res.data);
    } catch {
      setError("Failed to load applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  return (
    <AppLayout breadcrumb={["College", "Applications"]}>
      <div className="p-6 max-w-[1400px]">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-[#111827]">Applications</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">Track all placement applications from your students.</p>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-6"><LoadingSkeleton /></div>
          ) : error ? (
            <ErrorState message={error} onRetry={fetch} />
          ) : applications.length === 0 ? (
            <EmptyState icon={<FileText className="w-10 h-10 text-gray-300" />} title="No applications yet" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                    {["Student", "Register No.", "Company", "Drive", "Job Role", "Applied Date", "Status"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F4F6]">
                  {applications.map((a) => (
                    <tr key={a.id} className="hover:bg-[#F9FAFB] transition-colors">
                      <td className="px-4 py-3 font-medium text-[#111827]">{a.studentName}</td>
                      <td className="px-4 py-3 font-mono text-xs text-[#6B7280]">{a.registerNumber}</td>
                      <td className="px-4 py-3 text-[#6B7280]">{a.companyName ?? "—"}</td>
                      <td className="px-4 py-3 text-[#6B7280]">{a.driveTitle}</td>
                      <td className="px-4 py-3 text-[#6B7280]">{a.jobRole}</td>
                      <td className="px-4 py-3 text-[#6B7280] whitespace-nowrap">{a.applicationDate?.split("T")[0]}</td>
                      <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
