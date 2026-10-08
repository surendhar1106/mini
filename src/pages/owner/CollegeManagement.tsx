import { useEffect, useState } from "react";
import { Search, Check, X, Eye, GraduationCap } from "lucide-react";
import AppLayout from "@/layouts/AppLayout";
import StatusBadge from "@/components/ui/StatusBadge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Drawer from "@/components/ui/Drawer";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";
import { getColleges, approveCollege, rejectCollege } from "@/api/ownerApi";
import type { College } from "@/types";

export default function CollegeManagement() {
  const { toast } = useToast();

  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selected, setSelected] = useState<College | null>(null);

  const [confirm, setConfirm] = useState<{
    action: "approve" | "reject";
    college: College;
  } | null>(null);

  const [actionLoading, setActionLoading] = useState(false);

  const fetchColleges = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await getColleges();
      setColleges(res.data);
    } catch (err) {
      console.error("Failed to load colleges:", err);
      setError("Failed to load colleges.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  const filtered = colleges.filter((c) => {
    const collegeName = c.name ?? "";
    const collegeCode = c.collegeCode ?? "";

    const matchSearch =
  String(collegeName ?? "").toLowerCase().includes(String(search ?? "").toLowerCase()) ||
  String(collegeCode ?? "").toLowerCase().includes(String(search ?? "").toLowerCase());

    const matchStatus =
      statusFilter === "ALL" ||
      c.approvalStatus === statusFilter;

    return matchSearch && matchStatus;
  });

  const handleAction = async () => {
    if (!confirm) return;

    setActionLoading(true);

    try {
      if (confirm.action === "approve") {
        await approveCollege(confirm.college.id);

        toast(`${confirm.college.name} approved.`);
      } else {
        await rejectCollege(confirm.college.id);

        toast(
          `${confirm.college.name} rejected.`,
          "error"
        );
      }

      await fetchColleges();
    } catch (err) {
      console.error("College action failed:", err);

      toast(
        "Action failed. Please try again.",
        "error"
      );
    } finally {
      setActionLoading(false);
      setConfirm(null);
    }
  };

  return (
    <AppLayout breadcrumb={["Owner", "Colleges"]}>
      <div className="p-6 max-w-[1400px]">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-[#111827]">
              College Management
            </h1>

            <p className="text-sm text-[#6B7280] mt-0.5">
              Review and approve college registrations.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 mb-4 flex flex-wrap gap-3">

          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search colleges..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#374151]/20 focus:border-[#374151]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#374151]/20"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {/* College table */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">

          {loading ? (
            <div className="p-6">
              <LoadingSkeleton />
            </div>

          ) : error ? (
            <ErrorState
              message={error}
              onRetry={fetchColleges}
            />

          ) : filtered.length === 0 ? (
            <EmptyState
              icon={
                <GraduationCap className="w-10 h-10 text-gray-300" />
              }
              title="No colleges found"
              description="Colleges registered on the platform will appear here."
            />

          ) : (
            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">

                    {[
                      "College",
                      "Code",
                      "University",
                      "State",
                      "Officer",
                      "Registered",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wide whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}

                  </tr>
                </thead>

                <tbody className="divide-y divide-[#F3F4F6]">

                  {filtered.map((c) => (

                    <tr
                      key={c.id}
                      className="hover:bg-[#F9FAFB] transition-colors"
                    >

                      {/* College */}
                      <td className="px-4 py-3 font-medium text-[#111827] whitespace-nowrap">
                        {c.name}
                      </td>

                      {/* Code */}
                      <td className="px-4 py-3 text-[#6B7280] font-mono text-xs">
                        {c.collegeCode}
                      </td>

                      {/* University */}
                      <td className="px-4 py-3 text-[#6B7280] max-w-[180px] truncate">
                        {c.university}
                      </td>

                      {/* State */}
                      <td className="px-4 py-3 text-[#6B7280]">
                        {c.state}
                      </td>

                      {/* Placement Officer */}
                      <td className="px-4 py-3 text-[#6B7280]">
                        {c.placementOfficerName ?? "—"}
                      </td>

                      {/* Registered */}
                      <td className="px-4 py-3 text-[#6B7280] whitespace-nowrap">
                        {c.createdAt
                          ? c.createdAt.split("T")[0]
                          : "—"}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <StatusBadge
                          status={c.approvalStatus}
                        />
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">

                        <div className="flex items-center gap-1.5">

                          <button
                            onClick={() => setSelected(c)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {c.approvalStatus === "PENDING" && (
                            <>
                              <button
                                onClick={() =>
                                  setConfirm({
                                    action: "approve",
                                    college: c,
                                  })
                                }
                                className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-colors"
                                title="Approve"
                              >
                                <Check className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() =>
                                  setConfirm({
                                    action: "reject",
                                    college: c,
                                  })
                                }
                                className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                                title="Reject"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}

                        </div>
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>
      </div>

      {/* Details Drawer */}
      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title="College Details"
      >

        {selected && (
          <div className="p-6 space-y-5">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>

              <div>
                <h3 className="font-semibold text-[#111827]">
                  {selected.name}
                </h3>

                <StatusBadge
                  status={selected.approvalStatus}
                />
              </div>

            </div>

            <div className="grid grid-cols-2 gap-4">

              {[
                ["College Code", selected.collegeCode],
                ["Accreditation", selected.accreditation ?? "—"],
                ["University", selected.university],
                ["State", selected.state],
                [
                  "Placement Officer",
                  selected.placementOfficerName ?? "—",
                ],
                ["Website", selected.website ?? "—"],
                [
                  "Registered",
                  selected.createdAt
                    ? selected.createdAt.split("T")[0]
                    : "—",
                ],
              ].map(([key, value]) => (

                <div key={key}>
                  <p className="text-xs text-[#9CA3AF] mb-0.5">
                    {key}
                  </p>

                  <p className="text-sm font-medium text-[#374151]">
                    {value}
                  </p>
                </div>

              ))}

            </div>

            {selected.approvalStatus === "PENDING" && (

              <div className="flex gap-3 pt-4 border-t border-[#E5E7EB]">

                <button
                  onClick={() => {
                    setSelected(null);

                    setConfirm({
                      action: "approve",
                      college: selected,
                    });
                  }}
                  className="flex-1 py-2.5 text-sm font-medium bg-[#374151] text-white rounded-lg hover:bg-[#1F2937] transition-colors"
                >
                  Approve
                </button>

                <button
                  onClick={() => {
                    setSelected(null);

                    setConfirm({
                      action: "reject",
                      college: selected,
                    });
                  }}
                  className="flex-1 py-2.5 text-sm font-medium border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Reject
                </button>

              </div>
            )}

          </div>
        )}

      </Drawer>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={!!confirm}
        title={
          confirm?.action === "approve"
            ? "Approve College"
            : "Reject College"
        }
        description={
          confirm
            ? `Are you sure you want to ${confirm.action} ${confirm.college.name}? This action cannot be undone.`
            : ""
        }
        confirmLabel={
          confirm?.action === "approve"
            ? "Approve"
            : "Reject"
        }
        danger={confirm?.action === "reject"}
        loading={actionLoading}
        onConfirm={handleAction}
        onCancel={() => setConfirm(null)}
      />

    </AppLayout>
  );
}