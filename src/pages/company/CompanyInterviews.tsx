import { useEffect, useState } from "react";
import { Plus, Calendar, Video, MapPin } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import AppLayout from "@/layouts/AppLayout";
import StatusBadge from "@/components/ui/StatusBadge";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";

import { getCompanyDrives } from "@/api/driveApi";
import { getDriveApplications } from "@/api/applicationApi";

import {
  getApplicationInterviews,
  scheduleInterview,
  updateInterviewStatus,
  type Interview,
  type InterviewStatus,
} from "@/api/interviewApi";

import type {
  PlacementDrive,
  Application,
} from "@/types";

export default function CompanyInterviews() {
  const { toast } = useToast();

  const [drives, setDrives] = useState<PlacementDrive[]>([]);
  const [selectedDrive, setSelectedDrive] = useState<number | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);

  const [interviews, setInterviews] =
    useState<Map<number, Interview>>(new Map());

  const [loading, setLoading] = useState(false);
  const [drivesLoading, setDrivesLoading] = useState(true);
  const [error, setError] = useState("");

  const [scheduleFor, setScheduleFor] =
    useState<Application | null>(null);

  const [scheduleForm, setScheduleForm] = useState({
    scheduledAt: "",
    mode: "ONLINE",
    meetingLink: "",
    location: "",
    interviewerName: "",
  });

  const [saving, setSaving] = useState(false);

  // =========================================================
  // LOAD COMPANY DRIVES
  // =========================================================

  useEffect(() => {
    getCompanyDrives()
      .then((r) => setDrives(r.data))
      .catch((err) => {
        console.error(err);
        setError("Failed to load placement drives.");
      })
      .finally(() => setDrivesLoading(false));
  }, []);

  // =========================================================
  // LOAD APPLICATIONS + INTERVIEWS
  // =========================================================

  const loadDrive = async (driveId: number) => {
    if (!driveId) return;

    setLoading(true);
    setSelectedDrive(driveId);
    setError("");

    try {
      const appsRes = await getDriveApplications(driveId);

      // Interviews are relevant for shortlisted candidates
      // and candidates who already progressed through interview.
      const apps = appsRes.data.filter(
        (a) =>
          a.status === "SHORTLISTED" ||
          a.status === "SELECTED" ||
          a.status === "REJECTED"
      );

      setApplications(apps);

      const map = new Map<number, Interview>();

      await Promise.all(
        apps.map(async (a) => {
          try {
            const ir = await getApplicationInterviews(a.id);

            if (ir.data.length > 0) {
              // Backend returns a list.
              // Use the latest interview.
              const latest =
                ir.data[ir.data.length - 1];

              map.set(a.id, latest);
            }
          } catch (err) {
            // No interview for this application.
          }
        })
      );

      setInterviews(map);
    } catch (err) {
      console.error(err);
      setError("Failed to load applications.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // OPEN SCHEDULE FORM
  // =========================================================

  const openSchedule = (application: Application) => {
    setScheduleFor(application);

    setScheduleForm({
      scheduledAt: "",
      mode: "ONLINE",
      meetingLink: "",
      location: "",
      interviewerName: "",
    });
  };

  // =========================================================
  // SCHEDULE INTERVIEW
  // =========================================================

  const handleSchedule = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!scheduleFor) return;

    if (!scheduleForm.scheduledAt) {
      toast(
        "Please select interview date and time.",
        "error"
      );
      return;
    }

    if (
      scheduleForm.mode === "ONLINE" &&
      !scheduleForm.meetingLink
    ) {
      toast(
        "Please enter the meeting link.",
        "error"
      );
      return;
    }

    if (
      scheduleForm.mode === "OFFLINE" &&
      !scheduleForm.location
    ) {
      toast(
        "Please enter the interview location.",
        "error"
      );
      return;
    }

    setSaving(true);

    try {
      await scheduleInterview(
        scheduleFor.id,
        {
          scheduledAt: scheduleForm.scheduledAt,
          mode: scheduleForm.mode,
          meetingLink:
            scheduleForm.mode === "ONLINE"
              ? scheduleForm.meetingLink
              : undefined,
          location:
            scheduleForm.mode === "OFFLINE"
              ? scheduleForm.location
              : undefined,
          interviewerName:
            scheduleForm.interviewerName ||
            undefined,
        }
      );

      toast("Interview scheduled successfully.");

      setScheduleFor(null);

      if (selectedDrive) {
        await loadDrive(selectedDrive);
      }
    } catch (err: any) {
      console.error(err);

      const message =
        err?.response?.data?.message ||
        "Failed to schedule interview.";

      toast(message, "error");
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // UPDATE INTERVIEW STATUS
  // =========================================================

  const handleStatusChange = async (
    interviewId: number,
    status: InterviewStatus
  ) => {
    try {
      await updateInterviewStatus(
        interviewId,
        status
      );

      toast(
        `Interview marked as ${status.toLowerCase()}.`
      );

      if (selectedDrive) {
        await loadDrive(selectedDrive);
      }
    } catch (err: any) {
      console.error(err);

      const message =
        err?.response?.data?.message ||
        "Failed to update interview status.";

      toast(message, "error");
    }
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (
    scheduledAt?: string
  ) => {
    if (!scheduledAt) return "—";

    const date = new Date(scheduledAt);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString();
  };

  // =========================================================
  // FORMAT TIME
  // =========================================================

  const formatTime = (
    scheduledAt?: string
  ) => {
    if (!scheduledAt) return "—";

    const date = new Date(scheduledAt);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <AppLayout
      breadcrumb={["Company", "Interviews"]}
    >
      <div className="p-6 max-w-[1400px]">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-6">
          <h1 className="text-xl font-semibold text-[#111827]">
            Interviews
          </h1>

          <p className="text-sm text-[#6B7280] mt-0.5">
            Schedule and manage candidate interviews.
          </p>
        </div>

        {/* =====================================================
            DRIVE SELECTOR
        ===================================================== */}

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 mb-4">

          <label className="block text-xs font-medium text-[#6B7280] mb-1.5">
            Select Placement Drive
          </label>

          <select
            value={selectedDrive ?? ""}
            onChange={(e) => {
              const value = e.target.value;

              if (value) {
                loadDrive(Number(value));
              } else {
                setSelectedDrive(null);
                setApplications([]);
                setInterviews(new Map());
              }
            }}
            disabled={drivesLoading}
            className="w-full max-w-sm px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#374151]/20"
          >
            <option value="">
              Choose a drive...
            </option>

            {drives.map((d) => (
              <option
                key={d.id}
                value={d.id}
              >
                {d.driveTitle} — {d.jobRole}
              </option>
            ))}
          </select>

        </div>

        {/* =====================================================
            INTERVIEW TABLE
        ===================================================== */}

        <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">

          {!selectedDrive ? (

            <EmptyState
              title="Select a drive"
              description="Choose a placement drive to manage its interviews."
            />

          ) : loading ? (

            <div className="p-6">
              <LoadingSkeleton />
            </div>

          ) : error ? (

            <ErrorState
              message={error}
              onRetry={() =>
                selectedDrive &&
                loadDrive(selectedDrive)
              }
            />

          ) : applications.length === 0 ? (

            <EmptyState
              title="No candidates available"
              description="Shortlist candidates from Applications before scheduling interviews."
            />

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead>

                  <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">

                    {[
                      "Candidate",
                      "Interview Date",
                      "Time",
                      "Mode",
                      "Interviewer",
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

                  {applications.map((a) => {

                    const iv =
                      interviews.get(a.id);

                    return (

                      <tr
                        key={a.id}
                        className="hover:bg-[#F9FAFB] transition-colors"
                      >

                        {/* Candidate */}
                        <td className="px-4 py-3">

                          <div className="font-medium text-[#111827]">
                            {a.studentName}
                          </div>

                          <div className="text-xs text-[#9CA3AF]">
                            {a.registerNumber ?? "—"}
                          </div>

                        </td>

                        {/* Date */}
                        <td className="px-4 py-3 text-[#6B7280] whitespace-nowrap">
                          {formatDate(
                            iv?.scheduledAt
                          )}
                        </td>

                        {/* Time */}
                        <td className="px-4 py-3 text-[#6B7280] whitespace-nowrap">
                          {formatTime(
                            iv?.scheduledAt
                          )}
                        </td>

                        {/* Mode */}
                        <td className="px-4 py-3 text-[#6B7280]">

                          {iv?.mode ? (
                            <div className="flex items-center gap-1.5">

                              {iv.mode ===
                              "ONLINE" ? (
                                <Video className="w-3.5 h-3.5" />
                              ) : (
                                <MapPin className="w-3.5 h-3.5" />
                              )}

                              {iv.mode}
                            </div>
                          ) : (
                            "—"
                          )}

                        </td>

                        {/* Interviewer */}
                        <td className="px-4 py-3 text-[#6B7280]">
                          {iv?.interviewerName ??
                            "—"}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">

                          {iv ? (

                            <StatusBadge
                              status={iv.status}
                            />

                          ) : (

                            <span className="text-xs text-[#9CA3AF]">
                              Not scheduled
                            </span>

                          )}

                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">

                          <div className="flex items-center gap-1.5 flex-wrap">

                            {/* SCHEDULE */}
                            {!iv &&
                              a.status ===
                                "SHORTLISTED" && (

                                <button
                                  onClick={() =>
                                    openSchedule(a)
                                  }
                                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-[#374151] text-white rounded-lg hover:bg-[#1F2937] transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                  Schedule
                                </button>

                              )}

                            {/* SCHEDULED → COMPLETED */}
                            {iv?.status ===
                              "SCHEDULED" && (

                              <button
                                onClick={() =>
                                  handleStatusChange(
                                    iv.id,
                                    "COMPLETED"
                                  )
                                }
                                className="px-2.5 py-1.5 text-[10px] font-medium bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100"
                              >
                                Mark Completed
                              </button>

                            )}

                            {/* COMPLETED → PASSED / FAILED */}
                            {iv?.status ===
                              "COMPLETED" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleStatusChange(
                                      iv.id,
                                      "PASSED"
                                    )
                                  }
                                  className="px-2.5 py-1.5 text-[10px] font-medium bg-emerald-50 text-emerald-700 rounded-md hover:bg-emerald-100"
                                >
                                  Pass
                                </button>

                                <button
                                  onClick={() =>
                                    handleStatusChange(
                                      iv.id,
                                      "FAILED"
                                    )
                                  }
                                  className="px-2.5 py-1.5 text-[10px] font-medium bg-red-50 text-red-700 rounded-md hover:bg-red-100"
                                >
                                  Fail
                                </button>
                              </>
                            )}

                            {/* FINAL STATUS */}
                            {iv?.status ===
                              "PASSED" && (

                              <span className="text-xs font-medium text-emerald-600">
                                Candidate Selected
                              </span>

                            )}

                            {iv?.status ===
                              "FAILED" && (

                              <span className="text-xs font-medium text-red-600">
                                Candidate Rejected
                              </span>

                            )}

                          </div>

                        </td>

                      </tr>

                    );
                  })}

                </tbody>

              </table>

            </div>

          )}

        </div>
      </div>

      {/* =====================================================
          SCHEDULE INTERVIEW MODAL
      ===================================================== */}

      <AnimatePresence>

        {scheduleFor && (

          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
              onClick={() =>
                !saving &&
                setScheduleFor(null)
              }
            />

            {/* Modal */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
              }}
              className="relative bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl w-full max-w-md p-6"
            >

              <div className="flex items-center gap-2 mb-1">

                <Calendar className="w-5 h-5 text-[#374151]" />

                <h2 className="text-base font-semibold text-[#111827]">
                  Schedule Interview
                </h2>

              </div>

              <p className="text-sm text-[#6B7280] mb-5">
                Candidate:{" "}
                <span className="font-medium text-[#374151]">
                  {scheduleFor.studentName}
                </span>
              </p>

              <form
                onSubmit={handleSchedule}
                className="space-y-4"
              >

                {/* Date & Time */}
                <div>

                  <label className="block text-xs font-medium text-[#6B7280] mb-1.5">
                    Interview Date & Time
                  </label>

                  <input
                    type="datetime-local"
                    value={
                      scheduleForm.scheduledAt
                    }
                    onChange={(e) =>
                      setScheduleForm((s) => ({
                        ...s,
                        scheduledAt:
                          e.target.value,
                      }))
                    }
                    required
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#374151]/20 focus:border-[#374151]"
                  />

                </div>

                {/* Mode */}
                <div>

                  <label className="block text-xs font-medium text-[#6B7280] mb-1.5">
                    Interview Mode
                  </label>

                  <select
                    value={scheduleForm.mode}
                    onChange={(e) =>
                      setScheduleForm((s) => ({
                        ...s,
                        mode: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#374151]/20"
                  >

                    <option value="ONLINE">
                      Online
                    </option>

                    <option value="OFFLINE">
                      Offline
                    </option>

                  </select>

                </div>

                {/* Meeting Link */}
                {scheduleForm.mode ===
                  "ONLINE" && (

                  <div>

                    <label className="flex items-center gap-1.5 text-xs font-medium text-[#6B7280] mb-1.5">
                      <Video className="w-3.5 h-3.5" />
                      Meeting Link
                    </label>

                    <input
                      type="url"
                      value={
                        scheduleForm.meetingLink
                      }
                      onChange={(e) =>
                        setScheduleForm((s) => ({
                          ...s,
                          meetingLink:
                            e.target.value,
                        }))
                      }
                      placeholder="https://meet.google.com/..."
                      required
                      className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#374151]/20"
                    />

                  </div>

                )}

                {/* Location */}
                {scheduleForm.mode ===
                  "OFFLINE" && (

                  <div>

                    <label className="flex items-center gap-1.5 text-xs font-medium text-[#6B7280] mb-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      Interview Location
                    </label>

                    <input
                      type="text"
                      value={
                        scheduleForm.location
                      }
                      onChange={(e) =>
                        setScheduleForm((s) => ({
                          ...s,
                          location:
                            e.target.value,
                        }))
                      }
                      placeholder="Interview venue"
                      required
                      className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#374151]/20"
                    />

                  </div>

                )}

                {/* Interviewer */}
                <div>

                  <label className="block text-xs font-medium text-[#6B7280] mb-1.5">
                    Interviewer Name
                  </label>

                  <input
                    type="text"
                    value={
                      scheduleForm.interviewerName
                    }
                    onChange={(e) =>
                      setScheduleForm((s) => ({
                        ...s,
                        interviewerName:
                          e.target.value,
                      }))
                    }
                    placeholder="Interviewer name"
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#374151]/20"
                  />

                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">

                  <button
                    type="button"
                    onClick={() =>
                      setScheduleFor(null)
                    }
                    disabled={saving}
                    className="flex-1 py-2.5 text-sm font-medium border border-[#E5E7EB] rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-2.5 text-sm font-medium bg-[#374151] text-white rounded-lg hover:bg-[#1F2937] disabled:opacity-60"
                  >
                    {saving
                      ? "Scheduling..."
                      : "Schedule Interview"}
                  </button>

                </div>

              </form>

            </motion.div>

          </div>

        )}

      </AnimatePresence>

    </AppLayout>
  );
}