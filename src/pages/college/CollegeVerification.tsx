import { useEffect, useState } from "react";
import { Search, Check, X, ShieldCheck } from "lucide-react";
import AppLayout from "@/layouts/AppLayout";
import StatusBadge from "@/components/ui/StatusBadge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";
import {
  getCollegeStudents,
  verifyStudent,
  rejectStudent,
} from "@/api/collegeApi";
import type { Student } from "@/types";

export default function CollegeVerification() {
  const { toast } = useToast();

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [confirm, setConfirm] = useState<{
    action: "verify" | "reject";
    student: Student;
  } | null>(null);

  const [actionLoading, setActionLoading] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await getCollegeStudents();
      setStudents(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load student verification data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const pendingStudents = students.filter(
    (student) =>
      student.verificationStatus === "PENDING" &&
      (
        student.fullName
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        student.registerNumber
          ?.toLowerCase()
          .includes(search.toLowerCase())
      )
  );

  const handleAction = async () => {
    if (!confirm) return;

    setActionLoading(true);

    try {
      if (confirm.action === "verify") {
        await verifyStudent(confirm.student.id);
        toast("Student verified successfully.");
      } else {
        await rejectStudent(confirm.student.id);
        toast("Student rejected.");
      }

      setConfirm(null);
      await fetchStudents();
    } catch (err) {
      console.error(err);
      toast("Action failed.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AppLayout breadcrumb={["College", "Verification"]}>
      <div className="p-6 max-w-[1400px]">

        <div className="mb-6">
          <h1 className="text-xl font-semibold text-[#111827]">
            Student Verification
          </h1>

          <p className="text-sm text-[#6B7280] mt-0.5">
            Review and verify students who are waiting for college approval.
          </p>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 mb-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search pending students..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#374151]/20 focus:border-[#374151]"
            />
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">

          {loading ? (
            <div className="p-6">
              <LoadingSkeleton />
            </div>

          ) : error ? (
            <ErrorState
              message={error}
              onRetry={fetchStudents}
            />

          ) : pendingStudents.length === 0 ? (
            <EmptyState
              icon={
                <ShieldCheck className="w-10 h-10 text-gray-300" />
              }
              title="No pending students"
              description="There are no students waiting for verification."
            />

          ) : (
            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">

                    {[
                      "Name",
                      "Register No.",
                      "Department",
                      "Course",
                      "Year",
                      "Phone",
                      "Status",
                      "Actions",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wide whitespace-nowrap"
                      >
                        {heading}
                      </th>
                    ))}

                  </tr>
                </thead>

                <tbody className="divide-y divide-[#F3F4F6]">

                  {pendingStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-[#F9FAFB] transition-colors"
                    >

                      <td className="px-4 py-3 font-medium text-[#111827]">
                        {student.fullName}
                      </td>

                      <td className="px-4 py-3 font-mono text-xs text-[#6B7280]">
                        {student.registerNumber}
                      </td>

                      <td className="px-4 py-3 text-[#6B7280]">
                        {student.department || "—"}
                      </td>

                      <td className="px-4 py-3 text-[#6B7280]">
                        {student.course || "—"}
                      </td>

                      <td className="px-4 py-3 text-[#6B7280]">
                        {student.graduationYear || "—"}
                      </td>

                      <td className="px-4 py-3 text-[#6B7280]">
                        {student.phone || "—"}
                      </td>

                      <td className="px-4 py-3">
                        <StatusBadge
                          status={student.verificationStatus}
                        />
                      </td>

                      <td className="px-4 py-3">

                        <div className="flex items-center gap-2">

                          <button
                            onClick={() =>
                              setConfirm({
                                action: "verify",
                                student,
                              })
                            }
                            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Verify
                          </button>

                          <button
                            onClick={() =>
                              setConfirm({
                                action: "reject",
                                student,
                              })
                            }
                            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                            Reject
                          </button>

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

      <ConfirmDialog
        open={!!confirm}
        title={
          confirm?.action === "verify"
            ? "Verify Student"
            : "Reject Student"
        }
        description={
          confirm
            ? `Are you sure you want to ${
                confirm.action
              } ${confirm.student.fullName}?`
            : ""
        }
        confirmLabel={
          confirm?.action === "verify"
            ? "Verify"
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