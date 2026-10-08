import { useEffect, useState } from "react";
import {
  FileText,
  Calendar,
  Video,
  MapPin,
  User,
} from "lucide-react";

import AppLayout from "@/layouts/AppLayout";
import StatusBadge from "@/components/ui/StatusBadge";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";

import { getCompanyDrives } from "@/api/driveApi";

import {
  getDriveApplications,
  updateApplicationStatus,
} from "@/api/applicationApi";

import {
  scheduleInterview,
} from "@/api/interviewApi";

import type {
  Application,
  PlacementDrive,
  ApplicationStatus,
} from "@/types";

export default function CompanyApplications() {
  const { toast } = useToast();

  const [drives, setDrives] = useState<PlacementDrive[]>([]);
  const [selectedDrive, setSelectedDrive] = useState<number | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);

  const [loading, setLoading] = useState(false);
  const [drivesLoading, setDrivesLoading] = useState(true);
  const [error, setError] = useState("");

  const [confirm, setConfirm] = useState<{
    app: Application;
    status: ApplicationStatus;
  } | null>(null);

  const [actionLoading, setActionLoading] = useState(false);

  // =========================================================
  // INTERVIEW MODAL
  // =========================================================

  const [interviewApp, setInterviewApp] =
    useState<Application | null>(null);

  const [interviewLoading, setInterviewLoading] = useState(false);

  const [interviewForm, setInterviewForm] = useState({
    scheduledAt: "",
    mode: "ONLINE",
    meetingLink: "",
    location: "",
    interviewerName: "",
  });

  // =========================================================
  // LOAD COMPANY'S DRIVES
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
  // LOAD APPLICATIONS
  // =========================================================

  const fetchApplications = async (driveId: number) => {
    setLoading(true);
    setError("");
    setSelectedDrive(driveId);

    try {
      const res = await getDriveApplications(driveId);
      setApplications(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load applications.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // UPDATE APPLICATION STATUS
  // =========================================================

  const handleStatusChange = async () => {
    if (!confirm) return;

    setActionLoading(true);

    try {
      await updateApplicationStatus(
        confirm.app.id,
        confirm.status
      );

      toast(
        `Candidate ${confirm.status.toLowerCase()}.`
      );

      setConfirm(null);

      if (selectedDrive) {
        await fetchApplications(selectedDrive);
      }
    } catch (err) {
      console.error(err);
      toast("Action failed.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // =========================================================
  // OPEN INTERVIEW FORM
  // =========================================================

  const openInterviewForm = (app: Application) => {
    setInterviewApp(app);

    setInterviewForm({
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

  const handleScheduleInterview = async () => {
    if (!interviewApp) return;

    if (!interviewForm.scheduledAt) {
      toast("Please select interview date and time.", "error");
      return;
    }

    if (
      interviewForm.mode === "ONLINE" &&
      !interviewForm.meetingLink
    ) {
      toast("Please enter the meeting link.", "error");
      return;
    }

    if (
      interviewForm.mode === "OFFLINE" &&
      !interviewForm.location
    ) {
      toast("Please enter the interview location.", "error");
      return;
    }

    setInterviewLoading(true);

    try {
      await scheduleInterview(
        interviewApp.id,
        {
          scheduledAt: interviewForm.scheduledAt,
          mode: interviewForm.mode,
          meetingLink:
            interviewForm.mode === "ONLINE"
              ? interviewForm.meetingLink
              : undefined,
          location:
            interviewForm.mode === "OFFLINE"
              ? interviewForm.location
              : undefined,
          interviewerName:
            interviewForm.interviewerName || undefined,
        }
      );

      toast("Interview scheduled successfully.");

      setInterviewApp(null);

      if (selectedDrive) {
        await fetchApplications(selectedDrive);
      }
    } catch (err: any) {
      console.error(err);

      const message =
        err?.response?.data?.message ||
        "Failed to schedule interview.";

      toast(message, "error");
    } finally {
      setInterviewLoading(false);
    }
  };

  return (
    <AppLayout breadcrumb={["Company", "Applications"]}>
      <div className="p-6 max-w-[1400px]">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-6">
          <h1 className="text-xl font-semibold text-[#111827]">
            Applications
          </h1>

          <p className="text-sm text-[#6B7280] mt-0.5">
            Review and manage candidate applications per drive.
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
                fetchApplications(Number(value));
              } else {
                setSelectedDrive(null);
                setApplications([]);
              }
            }}
            disabled={drivesLoading}
            className="w-full max-w-sm px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#374151]/20"
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
            APPLICATIONS
        ===================================================== */}

        <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">

          {!selectedDrive ? (

            <EmptyState
              title="Select a drive"
              description="Choose a placement drive above to view its applications."
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
                fetchApplications(selectedDrive)
              }
            />

          ) : applications.length === 0 ? (

            <EmptyState
              icon={
                <FileText className="w-10 h-10 text-gray-300" />
              }
              title="No applications yet"
              description="No candidates have applied to this drive yet."
            />

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">

                    {[
                      "Candidate",
                      "Register No.",
                      "College",
                      "Department",
                      "Applied Date",
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

                  {applications.map((a) => (

                    <tr
                      key={a.id}
                      className="hover:bg-[#F9FAFB] transition-colors"
                    >

                      {/* Candidate */}
                      <td className="px-4 py-3 font-medium text-[#111827]">
                        {a.studentName}
                      </td>

                      {/* Register Number */}
                      <td className="px-4 py-3 font-mono text-xs text-[#6B7280]">
                        {a.registerNumber ?? "—"}
                      </td>

                      {/* College */}
                      <td className="px-4 py-3 text-[#6B7280]">
                        {a.collegeName ?? "—"}
                      </td>

                      {/* Department */}
                      <td className="px-4 py-3 text-[#6B7280]">
                        {a.department ?? "—"}
                      </td>

                      {/* Applied Date */}
                      <td className="px-4 py-3 text-[#6B7280] whitespace-nowrap">
                        {a.applicationDate
                          ? a.applicationDate.split("T")[0]
                          : "—"}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <StatusBadge status={a.status} />
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">

                        <div className="flex items-center gap-1 flex-wrap">

                          {/* SHORTLIST */}
                          <button
                            onClick={() =>
                              setConfirm({
                                app: a,
                                status: "SHORTLISTED",
                              })
                            }
                            disabled={
                              a.status === "SHORTLISTED" ||
                              a.status === "SELECTED" ||
                              a.status === "REJECTED"
                            }
                            className="px-2 py-1 text-[10px] font-medium rounded-md bg-purple-50 text-purple-700 hover:bg-purple-100 disabled:opacity-40"
                          >
                            Shortlist
                          </button>

                          {/* SCHEDULE INTERVIEW */}
                          <button
                            onClick={() =>
                              openInterviewForm(a)
                            }
                            disabled={
                              a.status !== "SHORTLISTED"
                            }
                            className="px-2 py-1 text-[10px] font-medium rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:opacity-40"
                          >
                            Interview
                          </button>

                          {/* SELECT */}
                          <button
                            onClick={() =>
                              setConfirm({
                                app: a,
                                status: "SELECTED",
                              })
                            }
                            disabled={
                              a.status === "SELECTED" ||
                              a.status === "REJECTED"
                            }
                            className="px-2 py-1 text-[10px] font-medium rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-40"
                          >
                            Select
                          </button>

                          {/* REJECT */}
                          <button
                            onClick={() =>
                              setConfirm({
                                app: a,
                                status: "REJECTED",
                              })
                            }
                            disabled={
                              a.status === "REJECTED" ||
                              a.status === "SELECTED"
                            }
                            className="px-2 py-1 text-[10px] font-medium rounded-md bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-40"
                          >
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

      {/* =====================================================
          CONFIRM STATUS DIALOG
      ===================================================== */}

      <ConfirmDialog
        open={!!confirm}
        title="Update Application Status"
        description={`Mark ${
          confirm?.app?.studentName
        } as ${
          confirm?.status?.toLowerCase()
        }?`}
        confirmLabel="Confirm"
        danger={confirm?.status === "REJECTED"}
        loading={actionLoading}
        onConfirm={handleStatusChange}
        onCancel={() => setConfirm(null)}
      />

      {/* =====================================================
          SCHEDULE INTERVIEW MODAL
      ===================================================== */}

      {interviewApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl">

            {/* Header */}
            <div className="px-6 py-4 border-b border-[#E5E7EB]">

              <h2 className="text-lg font-semibold text-[#111827]">
                Schedule Interview
              </h2>

              <p className="text-sm text-[#6B7280] mt-1">
                Schedule an interview for{" "}
                <span className="font-medium text-[#374151]">
                  {interviewApp.studentName}
                </span>
              </p>

            </div>

            {/* Form */}
            <div className="p-6 space-y-4">

              {/* Date & Time */}
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-[#374151] mb-1.5">
                  <Calendar className="w-4 h-4" />
                  Interview Date & Time
                </label>

                <input
                  type="datetime-local"
                  value={interviewForm.scheduledAt}
                  onChange={(e) =>
                    setInterviewForm({
                      ...interviewForm,
                      scheduledAt: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#374151]/20"
                />
              </div>

              {/* Mode */}
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1.5">
                  Interview Mode
                </label>

                <select
                  value={interviewForm.mode}
                  onChange={(e) =>
                    setInterviewForm({
                      ...interviewForm,
                      mode: e.target.value,
                    })
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
              {interviewForm.mode === "ONLINE" && (
                <div>
                  <label className="flex items-center gap-2 text-xs font-medium text-[#374151] mb-1.5">
                    <Video className="w-4 h-4" />
                    Meeting Link
                  </label>

                  <input
                    type="url"
                    placeholder="https://meet.google.com/..."
                    value={interviewForm.meetingLink}
                    onChange={(e) =>
                      setInterviewForm({
                        ...interviewForm,
                        meetingLink: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#374151]/20"
                  />
                </div>
              )}

              {/* Location */}
              {interviewForm.mode === "OFFLINE" && (
                <div>
                  <label className="flex items-center gap-2 text-xs font-medium text-[#374151] mb-1.5">
                    <MapPin className="w-4 h-4" />
                    Interview Location
                  </label>

                  <input
                    type="text"
                    placeholder="Company office / interview venue"
                    value={interviewForm.location}
                    onChange={(e) =>
                      setInterviewForm({
                        ...interviewForm,
                        location: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#374151]/20"
                  />
                </div>
              )}

              {/* Interviewer */}
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-[#374151] mb-1.5">
                  <User className="w-4 h-4" />
                  Interviewer Name
                </label>

                <input
                  type="text"
                  placeholder="Interviewer name"
                  value={interviewForm.interviewerName}
                  onChange={(e) =>
                    setInterviewForm({
                      ...interviewForm,
                      interviewerName: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#374151]/20"
                />
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[#E5E7EB] flex justify-end gap-2">

              <button
                onClick={() => setInterviewApp(null)}
                disabled={interviewLoading}
                className="px-4 py-2 text-sm rounded-lg border border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB]"
              >
                Cancel
              </button>

              <button
                onClick={handleScheduleInterview}
                disabled={interviewLoading}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-[#111827] text-white hover:bg-[#1F2937] disabled:opacity-50"
              >
                {interviewLoading
                  ? "Scheduling..."
                  : "Schedule Interview"}
              </button>

            </div>

          </div>
        </div>
      )}
    </AppLayout>
  );
}