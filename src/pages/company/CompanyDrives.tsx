import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import {
  Plus,
  Briefcase,
  Trash2,
  Play,
  StopCircle,
  ChevronRight,
} from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";

import AppLayout from "@/layouts/AppLayout";
import StatusBadge from "@/components/ui/StatusBadge";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";

import {
  getCompanyDrives,
  createDrive,
  openDrive,
  closeDrive,
  deleteDrive,
} from "@/api/driveApi";

import type { PlacementDrive } from "@/types";

interface DriveFormData {
  driveTitle: string;
  jobRole: string;
  jobDescription: string;
  employmentType: string;
  salaryPackage: string;
  location: string;
  applicationDeadline: string;
  eligibilityCriteria: string;
  minimumCgpa: string;
  passingYear: string;
  eligibleDepartments: string;
}

const emptyForm: DriveFormData = {
  driveTitle: "",
  jobRole: "",
  jobDescription: "",
  employmentType: "FULL_TIME",
  salaryPackage: "",
  location: "",
  applicationDeadline: "",
  eligibilityCriteria: "",
  minimumCgpa: "",
  passingYear: "",
  eligibleDepartments: "",
};

export default function CompanyDrives() {
  const { toast } = useToast();

  const [drives, setDrives] = useState<PlacementDrive[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<DriveFormData>(emptyForm);
  const [saving, setSaving] = useState(false);

  const [confirm, setConfirm] = useState<{
    action: string;
    drive: PlacementDrive;
  } | null>(null);

  const [actionLoading, setActionLoading] = useState(false);

  // Selected drive for details drawer
  const [selectedDrive, setSelectedDrive] =
    useState<PlacementDrive | null>(null);

  // =========================================================
  // LOAD COMPANY DRIVES
  // =========================================================

  const fetchDrives = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await getCompanyDrives();
      setDrives(res.data);
    } catch (error) {
      console.error("Failed to load company drives:", error);
      setError("Failed to load drives.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  // =========================================================
  // CREATE DRIVE
  // =========================================================

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();

    setSaving(true);

    try {
      await createDrive({
        ...form,

        minimumCgpa: form.minimumCgpa
          ? Number(form.minimumCgpa)
          : undefined,

        passingYear: form.passingYear
          ? Number(form.passingYear)
          : undefined,

        // Backend expects String, not String[]
        eligibleDepartments: form.eligibleDepartments
  ? form.eligibleDepartments
      .split(",")
      .map((department) => department.trim())
      .filter(Boolean)
  : undefined,
      });

      toast("Placement drive created successfully.");

      setShowForm(false);
      setForm(emptyForm);

      await fetchDrives();
    } catch (error) {
      console.error("Failed to create drive:", error);
      toast("Failed to create drive.", "error");
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // OPEN / CLOSE / DELETE
  // =========================================================

  const handleConfirmAction = async () => {
    if (!confirm) return;

    setActionLoading(true);

    try {
      if (confirm.action === "delete") {
        await deleteDrive(confirm.drive.id);
      } else if (confirm.action === "open") {
        await openDrive(confirm.drive.id);
      } else {
        await closeDrive(confirm.drive.id);
      }

      toast(`Drive ${confirm.action}d.`);

      await fetchDrives();
    } catch (error) {
      console.error("Drive action failed:", error);
      toast("Action failed.", "error");
    } finally {
      setActionLoading(false);
      setConfirm(null);
    }
  };

  // =========================================================
  // FORM FIELD HANDLER
  // =========================================================

  const field =
    (key: keyof DriveFormData) =>
    (
      e: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setForm((current) => ({
        ...current,
        [key]: e.target.value,
      }));
    };

  // =========================================================
  // UI
  // =========================================================

  return (
    <AppLayout breadcrumb={["Company", "Placement Drives"]}>
      <div className="p-6 max-w-[1400px]">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-[#111827]">
              Placement Drives
            </h1>

            <p className="text-sm text-[#6B7280] mt-0.5">
              Create and manage your recruitment drives.
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#374151] text-white text-sm font-medium rounded-lg hover:bg-[#1F2937] transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Drive
          </button>
        </div>

        {/* =====================================================
            DRIVES TABLE
        ===================================================== */}

        <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">

          {loading ? (
            <div className="p-6">
              <LoadingSkeleton />
            </div>
          ) : error ? (
            <ErrorState
              message={error}
              onRetry={fetchDrives}
            />
          ) : drives.length === 0 ? (
            <EmptyState
              icon={
                <Briefcase className="w-10 h-10 text-gray-300" />
              }
              title="No placement drives yet"
              description="Create your first placement drive to start recruiting."
              action={
                <button
                  onClick={() => setShowForm(true)}
                  className="px-4 py-2 text-sm font-medium bg-[#374151] text-white rounded-lg hover:bg-[#1F2937] transition-colors"
                >
                  Create Drive
                </button>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">

                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                    {[
                      "Title",
                      "Job Role",
                      "Location",
                      "Salary",
                      "Deadline",
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

                  {drives.map((drive) => (
                    <tr
                      key={drive.id}
                      onClick={() => setSelectedDrive(drive)}
                      className="hover:bg-[#F9FAFB] transition-colors cursor-pointer"
                    >

                      {/* TITLE */}
                      <td className="px-4 py-3 font-medium text-[#111827]">
                        {drive.driveTitle}
                      </td>

                      {/* JOB ROLE */}
                      <td className="px-4 py-3 text-[#6B7280]">
                        {drive.jobRole}
                      </td>

                      {/* LOCATION */}
                      <td className="px-4 py-3 text-[#6B7280]">
                        {drive.location ?? "—"}
                      </td>

                      {/* SALARY */}
                      <td className="px-4 py-3 text-[#6B7280]">
                        {drive.salaryPackage ?? "—"}
                      </td>

                      {/* DEADLINE */}
                      <td className="px-4 py-3 text-[#6B7280] whitespace-nowrap">
                        {drive.applicationDeadline
                          ?.split("T")[0] ?? "—"}
                      </td>

                      {/* STATUS */}
                      <td className="px-4 py-3">
                        <StatusBadge status={drive.status} />
                      </td>

                      {/* ACTIONS */}
                      <td className="px-4 py-3">

                        <div className="flex items-center gap-1.5">

                          {/* OPEN */}
                          {drive.status === "DRAFT" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();

                                setConfirm({
                                  action: "open",
                                  drive,
                                });
                              }}
                              className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600"
                              title="Open drive"
                            >
                              <Play className="w-4 h-4" />
                            </button>
                          )}

                          {/* CLOSE */}
                          {drive.status === "OPEN" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();

                                setConfirm({
                                  action: "close",
                                  drive,
                                });
                              }}
                              className="p-1.5 rounded-lg hover:bg-orange-50 text-orange-500"
                              title="Close drive"
                            >
                              <StopCircle className="w-4 h-4" />
                            </button>
                          )}

                          {/* DELETE */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();

                              setConfirm({
                                action: "delete",
                                drive,
                              });
                            }}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          {/* DETAILS */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDrive(drive);
                            }}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
                            title="View details"
                          >
                            <ChevronRight className="w-4 h-4" />
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

      {/* =====================================================
          CREATE DRIVE MODAL
      ===================================================== */}

      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

            {/* BACKDROP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
              onClick={() => setShowForm(false)}
            />

            {/* MODAL */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.97,
                y: 10,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.97,
              }}
              className="relative bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >

              {/* MODAL HEADER */}
              <div className="sticky top-0 bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between">

                <h2 className="text-base font-semibold text-[#111827]">
                  Create Placement Drive
                </h2>

                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-sm"
                >
                  Cancel
                </button>

              </div>

              {/* FORM */}
              <form
                onSubmit={handleCreate}
                className="p-6 space-y-4"
              >

                <div className="grid grid-cols-2 gap-4">

                  {[
                    {
                      label: "Drive Title",
                      key: "driveTitle",
                      required: true,
                    },
                    {
                      label: "Job Role",
                      key: "jobRole",
                      required: true,
                    },
                    {
                      label: "Salary Package",
                      key: "salaryPackage",
                    },
                    {
                      label: "Location",
                      key: "location",
                    },
                    {
                      label: "Application Deadline",
                      key: "applicationDeadline",
                      type: "date",
                      required: true,
                    },
                    {
                      label: "Minimum CGPA",
                      key: "minimumCgpa",
                      type: "number",
                    },
                    {
                      label: "Passing Year",
                      key: "passingYear",
                      type: "number",
                    },
                    {
                      label:
                        "Eligible Departments (comma-separated)",
                      key: "eligibleDepartments",
                    },
                  ].map((fieldConfig) => (
                    <div
                      key={fieldConfig.key}
                      className={
                        fieldConfig.label.includes("comma")
                          ? "col-span-2"
                          : ""
                      }
                    >
                      <label className="block text-xs font-medium text-[#6B7280] mb-1">
                        {fieldConfig.label}
                      </label>

                      <input
                        type={fieldConfig.type ?? "text"}
                        value={
                          form[
                            fieldConfig.key as keyof DriveFormData
                          ]
                        }
                        onChange={field(
                          fieldConfig.key as keyof DriveFormData
                        )}
                        required={fieldConfig.required}
                        className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#374151]/20 focus:border-[#374151]"
                      />
                    </div>
                  ))}

                  {/* JOB DESCRIPTION */}
                  <div className="col-span-2">

                    <label className="block text-xs font-medium text-[#6B7280] mb-1">
                      Job Description
                    </label>

                    <textarea
                      value={form.jobDescription}
                      onChange={field("jobDescription")}
                      rows={3}
                      className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#374151]/20 focus:border-[#374151] resize-none"
                    />

                  </div>

                  {/* ELIGIBILITY CRITERIA */}
                  <div className="col-span-2">

                    <label className="block text-xs font-medium text-[#6B7280] mb-1">
                      Eligibility Criteria
                    </label>

                    <textarea
                      value={form.eligibilityCriteria}
                      onChange={field("eligibilityCriteria")}
                      rows={3}
                      className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#374151]/20 focus:border-[#374151] resize-none"
                    />

                  </div>

                  {/* EMPLOYMENT TYPE */}
                  <div>

                    <label className="block text-xs font-medium text-[#6B7280] mb-1">
                      Employment Type
                    </label>

                    <select
                      value={form.employmentType}
                      onChange={field("employmentType")}
                      className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white focus:outline-none"
                    >
                      <option value="FULL_TIME">
                        Full Time
                      </option>

                      <option value="INTERNSHIP">
                        Internship
                      </option>

                      <option value="CONTRACT">
                        Contract
                      </option>
                    </select>

                  </div>

                </div>

                {/* SUBMIT */}
                <div className="flex gap-3 pt-2">

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-2.5 text-sm font-medium bg-[#374151] text-white rounded-lg hover:bg-[#1F2937] disabled:opacity-60 transition-colors"
                  >
                    {saving
                      ? "Creating..."
                      : "Create Drive"}
                  </button>

                </div>

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =====================================================
          DRIVE DETAILS DRAWER
      ===================================================== */}

      <AnimatePresence>
        {selectedDrive && (
          <div className="fixed inset-0 z-50 flex justify-end">

            {/* BACKDROP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/25"
              onClick={() => setSelectedDrive(null)}
            />

            {/* DRAWER */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 300,
              }}
              className="relative bg-white w-full max-w-lg h-full border-l border-[#E5E7EB] shadow-2xl overflow-y-auto"
            >

              {/* DRAWER HEADER */}
              <div className="sticky top-0 z-10 bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between">

                <div>
                  <h2 className="text-base font-semibold text-[#111827]">
                    Drive Details
                  </h2>

                  <p className="text-xs text-[#9CA3AF] mt-0.5">
                    Placement drive information
                  </p>
                </div>

                <button
                  onClick={() => setSelectedDrive(null)}
                  className="text-gray-400 hover:text-gray-600 text-lg"
                >
                  ✕
                </button>

              </div>

              {/* DRAWER CONTENT */}
              <div className="p-6 space-y-6">

                {/* TITLE */}
                <div>
                  <div className="flex items-start justify-between gap-3">

                    <div>
                      <h3 className="text-lg font-semibold text-[#111827]">
                        {selectedDrive.driveTitle}
                      </h3>

                      <p className="text-sm text-[#6B7280] mt-1">
                        {selectedDrive.jobRole}
                      </p>
                    </div>

                    <StatusBadge
                      status={selectedDrive.status}
                      size="md"
                    />

                  </div>
                </div>

                {/* DRIVE INFORMATION */}
                <div>

                  <h4 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-3">
                    Drive Information
                  </h4>

                  <div className="grid grid-cols-2 gap-4">

                    <div>
                      <p className="text-xs text-[#9CA3AF]">
                        Employment Type
                      </p>

                      <p className="text-sm font-medium text-[#374151] mt-0.5">
                        {selectedDrive.employmentType ?? "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#9CA3AF]">
                        Salary Package
                      </p>

                      <p className="text-sm font-medium text-[#374151] mt-0.5">
                        {selectedDrive.salaryPackage ?? "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#9CA3AF]">
                        Location
                      </p>

                      <p className="text-sm font-medium text-[#374151] mt-0.5">
                        {selectedDrive.location ?? "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#9CA3AF]">
                        Application Deadline
                      </p>

                      <p className="text-sm font-medium text-[#374151] mt-0.5">
                        {selectedDrive.applicationDeadline
                          ? selectedDrive.applicationDeadline.split(
                              "T"
                            )[0]
                          : "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#9CA3AF]">
                        Minimum CGPA
                      </p>

                      <p className="text-sm font-medium text-[#374151] mt-0.5">
                        {selectedDrive.minimumCgpa ?? "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#9CA3AF]">
                        Passing Year
                      </p>

                      <p className="text-sm font-medium text-[#374151] mt-0.5">
                        {selectedDrive.passingYear ?? "—"}
                      </p>
                    </div>

                  </div>
                </div>

                {/* ELIGIBLE DEPARTMENTS */}
                <div>

                  <h4 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-3">
                    Eligible Departments
                  </h4>

                 {selectedDrive.eligibleDepartments ? (
  <div className="flex flex-wrap gap-2">
    {(Array.isArray(
      selectedDrive.eligibleDepartments
    )
      ? selectedDrive.eligibleDepartments
      : String(selectedDrive.eligibleDepartments)
          .split(",")
          .map((department) => department.trim())
          .filter(Boolean)
    ).map((department) => (
      <span
        key={department}
        className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-[#374151] rounded-full"
      >
        {department}
      </span>
    ))}
  </div>
) : (
  <p className="text-sm text-[#9CA3AF]">
    No department restriction specified.
  </p>
)}
                </div>

                {/* ELIGIBILITY CRITERIA */}
                {selectedDrive.eligibilityCriteria && (
                  <div>

                    <h4 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2">
                      Eligibility Criteria
                    </h4>

                    <p className="text-sm text-[#374151] leading-relaxed whitespace-pre-line">
                      {selectedDrive.eligibilityCriteria}
                    </p>

                  </div>
                )}

                {/* JOB DESCRIPTION */}
                {selectedDrive.jobDescription && (
                  <div>

                    <h4 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2">
                      Job Description
                    </h4>

                    <p className="text-sm text-[#374151] leading-relaxed whitespace-pre-line">
                      {selectedDrive.jobDescription}
                    </p>

                  </div>
                )}

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =====================================================
          CONFIRM DIALOG
      ===================================================== */}

      <ConfirmDialog
        open={!!confirm}
        title={`${confirm?.action?.charAt(0).toUpperCase()}${confirm?.action?.slice(1)} Drive`}
        description={`Are you sure you want to ${confirm?.action} "${confirm?.drive?.driveTitle}"?`}
        confirmLabel={
          (confirm?.action?.charAt(0).toUpperCase() ?? "") +
          (confirm?.action?.slice(1) ?? "")
        }
        danger={
          confirm?.action === "delete" ||
          confirm?.action === "close"
        }
        loading={actionLoading}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirm(null)}
      />

    </AppLayout>
  );
}