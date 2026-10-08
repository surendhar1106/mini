import { useEffect, useState } from "react";
import { Search, Briefcase } from "lucide-react";
import AppLayout from "@/layouts/AppLayout";
import StatusBadge from "@/components/ui/StatusBadge";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import { getDrives } from "@/api/driveApi";
import type { PlacementDrive } from "@/types";

export default function OwnerDrives() {
  const [drives, setDrives] = useState<PlacementDrive[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetch = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getDrives();
      setDrives(res.data);
    } catch {
      setError("Failed to load placement drives.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const filtered = drives.filter((d) => {
    const matchSearch =
      d.driveTitle.toLowerCase().includes(search.toLowerCase()) ||
      (d.companyName ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <AppLayout breadcrumb={["Owner", "Placement Drives"]}>
      <div className="p-6 max-w-[1400px]">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-[#111827]">Placement Drives</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">Platform-wide monitoring of all placement drives.</p>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 mb-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search drives or companies..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#374151]/20 focus:border-[#374151]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white text-[#374151] focus:outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="DRAFT">Draft</option>
            <option value="OPEN">Open</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-6"><LoadingSkeleton /></div>
          ) : error ? (
            <ErrorState message={error} onRetry={fetch} />
          ) : filtered.length === 0 ? (
            <EmptyState icon={<Briefcase className="w-10 h-10 text-gray-300" />} title="No placement drives found" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                    {["Company", "Drive Title", "Job Role", "Location", "Applications", "Deadline", "Status"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F4F6]">
                  {filtered.map((d) => (
                    <tr key={d.id} className="hover:bg-[#F9FAFB] transition-colors">
                      <td className="px-4 py-3 text-[#6B7280]">{d.companyName ?? `Company #${d.companyId}`}</td>
                      <td className="px-4 py-3 font-medium text-[#111827]">{d.driveTitle}</td>
                      <td className="px-4 py-3 text-[#6B7280]">{d.jobRole}</td>
                      <td className="px-4 py-3 text-[#6B7280]">{d.location ?? "—"}</td>
                      <td className="px-4 py-3 text-[#6B7280]">{d.applicationsCount ?? "—"}</td>
                      <td className="px-4 py-3 text-[#6B7280] whitespace-nowrap">{d.applicationDeadline?.split("T")[0]}</td>
                      <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
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
