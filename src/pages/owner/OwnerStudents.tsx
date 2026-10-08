import { useEffect, useState } from "react";
import { Search, Users } from "lucide-react";
import AppLayout from "@/layouts/AppLayout";
import StatusBadge from "@/components/ui/StatusBadge";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import { getStudents } from "@/api/ownerApi";
import type { Student } from "@/types";

export default function OwnerStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetch = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getStudents();
      setStudents(res.data);
    } catch {
      setError("Failed to load students.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const filtered = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.registerNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout breadcrumb={["Owner", "Students"]}>
      <div className="p-6 max-w-[1400px]">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-[#111827]">Students</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">Monitor all registered students across colleges.</p>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 mb-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, register number, or department..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#374151]/20 focus:border-[#374151]"
            />
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-6"><LoadingSkeleton /></div>
          ) : error ? (
            <ErrorState message={error} onRetry={fetch} />
          ) : filtered.length === 0 ? (
            <EmptyState icon={<Users className="w-10 h-10 text-gray-300" />} title="No students found" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                    {["Name", "Register No.", "Department", "Course", "Year", "College", "Status"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F4F6]">
                  {filtered.map((s) => (
                    <tr key={s.id} className="hover:bg-[#F9FAFB] transition-colors">
                      <td className="px-4 py-3 font-medium text-[#111827]">{s.fullName}</td>
                      <td className="px-4 py-3 font-mono text-xs text-[#6B7280]">{s.registerNumber}</td>
                      <td className="px-4 py-3 text-[#6B7280]">{s.department}</td>
                      <td className="px-4 py-3 text-[#6B7280]">{s.course}</td>
                      <td className="px-4 py-3 text-[#6B7280]">{s.graduationYear}</td>
                      <td className="px-4 py-3 text-[#6B7280]">{s.collegeName ?? "—"}</td>
                      <td className="px-4 py-3"><StatusBadge status={s.verificationStatus} /></td>
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
