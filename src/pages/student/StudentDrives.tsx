import { useEffect, useState } from "react";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  ChevronRight,
  Check,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import AppLayout from "@/layouts/AppLayout";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { getDrives } from "@/api/driveApi";
import {
  applyToDrive,
  getMyApplications,
} from "@/api/applicationApi";
import type { PlacementDrive } from "@/types";

export default function StudentDrives() {
  const { toast } = useToast();

  const [drives, setDrives] = useState<PlacementDrive[]>([]);
  const [appliedDriveIds, setAppliedDriveIds] = useState<Set<number>>(
    new Set()
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedDrive, setSelectedDrive] =
    useState<PlacementDrive | null>(null);

  const [applyConfirm, setApplyConfirm] =
    useState<PlacementDrive | null>(null);

  const [applying, setApplying] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const [drivesResponse, applicationsResponse] =
        await Promise.all([
          getDrives(),
          getMyApplications(),
        ]);

      setDrives(drivesResponse.data);

      /*
       * Get the drive IDs the current student has already applied to.
       *
       * The backend may expose the drive ID using different DTO shapes,
       * so we safely check the common possibilities.
       */
      const ids = new Set<number>();

      applicationsResponse.data.forEach((application) => {
        const app = application as any;

        const driveId =
          app.placementDriveId ??
          app.driveId ??
          app.placementDrive?.id ??
          app.drive?.id;

        if (driveId !== undefined && driveId !== null) {
          ids.add(Number(driveId));
        }
      });

      setAppliedDriveIds(ids);
    } catch {
      setError("Failed to load placement drives.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApply = async () => {
    if (!applyConfirm) return;

    const driveId = applyConfirm.id;

    setApplying(true);

    try {
      await applyToDrive(driveId);

      // Immediately mark this drive as applied.
      setAppliedDriveIds((previous) => {
        const updated = new Set(previous);
        updated.add(driveId);
        return updated;
      });

      toast("Application submitted successfully.");
      setApplyConfirm(null);
    } catch (e: unknown) {
      const err = e as {
        response?: {
          data?: {
            message?: string;
          };
        };
      };

      toast(
        err.response?.data?.message ?? "Failed to apply.",
        "error"
      );
    } finally {
      setApplying(false);
    }
  };

  const openDrives = drives.filter(
    (d) => d.status === "OPEN"
  );

  const isApplied = (driveId: number) =>
    appliedDriveIds.has(driveId);

  return (
    <AppLayout breadcrumb={["Student", "Placement Drives"]}>
      <div className="p-6 max-w-[1400px]">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-[#111827]">
            Placement Drives
          </h1>

          <p className="text-sm text-[#6B7280] mt-0.5">
            Browse open placement opportunities and apply.
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-40 bg-gray-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <ErrorState
            message={error}
            onRetry={fetchData}
          />
        ) : openDrives.length === 0 ? (
          <EmptyState
            icon={
              <Briefcase className="w-10 h-10 text-gray-300" />
            }
            title="No open drives"
            description="No placement drives are currently open for applications."
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">

            {openDrives.map((d) => {
              const applied = isApplied(d.id);

              return (
                <div
                  key={d.id}
                  className="bg-white border border-[#E5E7EB] rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer group"
                  onClick={() => setSelectedDrive(d)}
                >

                  {/* Top */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-bold text-[#374151]">
                      {(d.companyName ?? "C").charAt(0)}
                    </div>

                    <StatusBadge status={d.status} />
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-[#111827] mb-0.5 group-hover:text-[#374151]">
                    {d.driveTitle}
                  </h3>

                  <p className="text-sm text-[#6B7280] mb-3">
                    {d.jobRole} · {d.companyName ?? "Company"}
                  </p>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-[#9CA3AF]">

                    {d.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {d.location}
                      </div>
                    )}

                    {d.salaryPackage && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        {d.salaryPackage}
                      </div>
                    )}

                    {d.applicationDeadline && (
                      <div className="flex items-center gap-1 col-span-2">
                        <Calendar className="w-3 h-3" />
                        Deadline:{" "}
                        {d.applicationDeadline.split("T")[0]}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex items-center justify-between">

                    {applied ? (
                      <button
                        disabled
                        className="px-3 py-1.5 text-xs font-medium bg-green-50 text-green-700 border border-green-200 rounded-lg flex items-center gap-1.5 cursor-default"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Applied
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setApplyConfirm(d);
                        }}
                        className="px-3 py-1.5 text-xs font-medium bg-[#374151] text-white rounded-lg hover:bg-[#1F2937] transition-colors"
                      >
                        Apply Now
                      </button>
                    )}

                    <span className="flex items-center gap-1 text-xs text-[#9CA3AF] group-hover:text-[#374151] transition-colors">
                      Details
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Drive Details Drawer */}
      <AnimatePresence>
        {selectedDrive && (
          <div className="fixed inset-0 z-40 flex justify-end">

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/25"
              onClick={() => setSelectedDrive(null)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 300,
              }}
              className="relative bg-white w-full max-w-lg h-full flex flex-col border-l border-[#E5E7EB] shadow-2xl overflow-y-auto"
            >

              {/* Drawer Header */}
              <div className="sticky top-0 bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between">
                <h2 className="text-base font-semibold text-[#111827]">
                  Drive Details
                </h2>

                <button
                  onClick={() => setSelectedDrive(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-6 space-y-5">

                <div>
                  <h3 className="text-lg font-semibold text-[#111827]">
                    {selectedDrive.driveTitle}
                  </h3>

                  <p className="text-sm text-[#6B7280]">
                    {selectedDrive.jobRole} ·{" "}
                    {selectedDrive.companyName}
                  </p>

                  <div className="mt-2">
                    <StatusBadge
                      status={selectedDrive.status}
                      size="md"
                    />
                  </div>
                </div>

                {/* Information */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    [
                      "Employment Type",
                      selectedDrive.employmentType,
                    ],
                    [
                      "Salary Package",
                      selectedDrive.salaryPackage,
                    ],
                    ["Location", selectedDrive.location],
                    [
                      "Minimum CGPA",
                      selectedDrive.minimumCgpa,
                    ],
                    [
                      "Passing Year",
                      selectedDrive.passingYear,
                    ],
                    [
                      "Deadline",
                      selectedDrive.applicationDeadline?.split(
                        "T"
                      )[0],
                    ],
                  ]
                    .filter(([, v]) => v)
                    .map(([k, v]) => (
                      <div key={k as string}>
                        <p className="text-xs text-[#9CA3AF] mb-0.5">
                          {k}
                        </p>

                        <p className="text-sm font-medium text-[#374151]">
                          {String(v)}
                        </p>
                      </div>
                    ))}
                </div>

                {/* Departments */}
                {selectedDrive.eligibleDepartments?.length ? (
                  <div>
                    <p className="text-xs text-[#9CA3AF] mb-1">
                      Eligible Departments
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {selectedDrive.eligibleDepartments.map(
                        (d) => (
                          <span
                            key={d}
                            className="px-2 py-0.5 text-xs bg-gray-100 text-[#374151] rounded-full"
                          >
                            {d}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                ) : null}

                {/* Job Description */}
                {selectedDrive.jobDescription && (
                  <div>
                    <p className="text-xs text-[#9CA3AF] mb-1">
                      Job Description
                    </p>

                    <p className="text-sm text-[#374151] leading-relaxed">
                      {selectedDrive.jobDescription}
                    </p>
                  </div>
                )}

                {/* Drawer Apply Button */}
                {isApplied(selectedDrive.id) ? (
                  <button
                    disabled
                    className="w-full py-2.5 text-sm font-medium bg-green-50 text-green-700 border border-green-200 rounded-lg flex items-center justify-center gap-2 cursor-default"
                  >
                    <Check className="w-4 h-4" />
                    Already Applied
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedDrive(null);
                      setApplyConfirm(selectedDrive);
                    }}
                    className="w-full py-2.5 text-sm font-medium bg-[#374151] text-white rounded-lg hover:bg-[#1F2937] transition-colors"
                  >
                    Apply to this Drive
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={!!applyConfirm}
        title="Confirm Application"
        description={`Apply to "${applyConfirm?.driveTitle}" at ${
          applyConfirm?.companyName ?? "this company"
        }?`}
        confirmLabel="Apply"
        danger={false}
        loading={applying}
        onConfirm={handleApply}
        onCancel={() => setApplyConfirm(null)}
      />
    </AppLayout>
  );
}