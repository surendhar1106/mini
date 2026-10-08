import { useEffect, useState } from "react";
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  CalendarDays,
  Video,
} from "lucide-react";
import AppLayout from "@/layouts/AppLayout";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import { getMyApplications } from "@/api/applicationApi";
import { getApplicationInterviews } from "@/api/interviewApi";
import type { Application } from "@/types";
import type { Interview } from "@/api/interviewApi";

type ApplicationWithInterview = Application & {
  interviews: Interview[];
};

const statusIcon = (status: string) => {
  if (status === "SELECTED") {
    return <CheckCircle className="w-4 h-4 text-emerald-500" />;
  }

  if (status === "REJECTED") {
    return <XCircle className="w-4 h-4 text-red-400" />;
  }

  if (status === "SHORTLISTED") {
    return <UserCheck className="w-4 h-4 text-purple-500" />;
  }

  return <Clock className="w-4 h-4 text-amber-500" />;
};

export default function StudentApplications() {
  const [applications, setApplications] = useState<
    ApplicationWithInterview[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplications = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await getMyApplications();

      const applicationsWithInterviews =
        await Promise.all(
          res.data.map(async (application) => {
            try {
              const interviewResponse =
                await getApplicationInterviews(application.id);

              return {
                ...application,
                interviews: interviewResponse.data ?? [],
              };
            } catch {
              // If there is no interview yet, keep the application.
              return {
                ...application,
                interviews: [],
              };
            }
          })
        );

      setApplications(applicationsWithInterviews);
    } catch (err) {
      console.error(err);
      setError("Failed to load applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  /*
   * Determines which stage should be displayed.
   *
   * Application status:
   * APPLIED → SHORTLISTED → SELECTED / REJECTED
   *
   * Interview is displayed between SHORTLISTED and
   * SELECTED when an interview exists.
   */
  const getCurrentStep = (
    application: ApplicationWithInterview
  ) => {
    if (application.status === "REJECTED") {
      return 3;
    }

    if (application.status === "SELECTED") {
      return 4;
    }

    if (
      application.interviews &&
      application.interviews.length > 0
    ) {
      return 3;
    }

    if (application.status === "SHORTLISTED") {
      return 2;
    }

    return 1;
  };

  const formatDateTime = (date?: string) => {
    if (!date) return "—";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <AppLayout breadcrumb={["Student", "My Applications"]}>
      <div className="p-6 max-w-[1400px]">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-[#111827]">
            My Applications
          </h1>

          <p className="text-sm text-[#6B7280] mt-0.5">
            Track the status of all your placement applications.
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 bg-gray-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <ErrorState
            message={error}
            onRetry={fetchApplications}
          />
        ) : applications.length === 0 ? (
          <EmptyState
            icon={
              <FileText className="w-10 h-10 text-gray-300" />
            }
            title="No applications yet"
            description="Browse placement drives and apply to get started."
          />
        ) : (
          <div className="space-y-3">

            {applications.map((a) => {
              const currentStep = getCurrentStep(a);

              const steps = [
                "APPLIED",
                "SHORTLISTED",
                "INTERVIEW",
                "SELECTED",
              ];

              const labels = [
                "Applied",
                "Shortlisted",
                "Interview",
                "Selected",
              ];

              const latestInterview =
                a.interviews.length > 0
                  ? a.interviews[a.interviews.length - 1]
                  : null;

              return (
                <div
                  key={a.id}
                  className="bg-white border border-[#E5E7EB] rounded-xl p-5 hover:shadow-sm transition-shadow"
                >

                  {/* Application Header */}
                  <div className="flex items-start justify-between gap-4">

                    <div className="flex items-center gap-3">

                      {statusIcon(a.status)}

                      <div>
                        <h3 className="font-semibold text-[#111827]">
                          {a.driveTitle}
                        </h3>

                        <p className="text-sm text-[#6B7280]">
                          {a.jobRole} ·{" "}
                          {a.companyName ?? "—"}
                        </p>
                      </div>

                    </div>

                    <StatusBadge
                      status={a.status}
                      size="md"
                    />

                  </div>

                  {/* Timeline */}
                  <div className="mt-5 flex items-center">

                    {steps.map((step, i) => {
                      const stepNumber = i + 1;

                      const active =
                        a.status === "REJECTED"
                          ? step === "APPLIED" ||
                            step === "SHORTLISTED" ||
                            (step === "INTERVIEW" &&
                              a.interviews.length > 0)
                          : stepNumber <= currentStep;

                      const completed =
                        stepNumber < currentStep;

                      return (
                        <div
                          key={step}
                          className="flex items-center flex-1"
                        >

                          {/* Circle */}
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                              active
                                ? "bg-[#374151] text-white"
                                : "bg-gray-100 text-[#9CA3AF]"
                            }`}
                          >
                            {i + 1}
                          </div>

                          {/* Line */}
                          {i < steps.length - 1 && (
                            <div
                              className={`flex-1 h-0.5 ${
                                completed
                                  ? "bg-[#374151]"
                                  : "bg-gray-100"
                              }`}
                            />
                          )}

                        </div>
                      );
                    })}

                  </div>

                  {/* Timeline Labels */}
                  <div className="mt-2 flex">

                    {labels.map((label, i) => {
                      const stepNumber = i + 1;

                      const active =
                        a.status === "REJECTED"
                          ? stepNumber <= currentStep
                          : stepNumber <= currentStep;

                      return (
                        <div
                          key={label}
                          className={`flex-1 text-[10px] ${
                            active
                              ? "text-[#374151] font-medium"
                              : "text-[#9CA3AF]"
                          }`}
                        >
                          {label}
                        </div>
                      );
                    })}

                  </div>

                  {/* Interview Information */}
                  {latestInterview && (
                    <div className="mt-5 rounded-lg border border-purple-100 bg-purple-50/50 p-4">

                      <div className="flex items-center gap-2 mb-3">
                        <CalendarDays className="w-4 h-4 text-purple-600" />

                        <p className="text-sm font-semibold text-[#374151]">
                          Interview Details
                        </p>

                        <span className="ml-auto text-xs font-medium px-2 py-1 rounded-full bg-white border border-purple-200 text-purple-700">
                          {latestInterview.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                        <div>
                          <p className="text-[11px] text-[#9CA3AF]">
                            Scheduled
                          </p>

                          <p className="text-sm text-[#374151]">
                            {formatDateTime(
                              latestInterview.scheduledAt
                            )}
                          </p>
                        </div>

                        {latestInterview.mode && (
                          <div>
                            <p className="text-[11px] text-[#9CA3AF]">
                              Mode
                            </p>

                            <p className="text-sm text-[#374151] flex items-center gap-1">
                              <Video className="w-3.5 h-3.5" />
                              {latestInterview.mode}
                            </p>
                          </div>
                        )}

                        {latestInterview.interviewerName && (
                          <div>
                            <p className="text-[11px] text-[#9CA3AF]">
                              Interviewer
                            </p>

                            <p className="text-sm text-[#374151]">
                              {latestInterview.interviewerName}
                            </p>
                          </div>
                        )}

                        {latestInterview.location && (
                          <div>
                            <p className="text-[11px] text-[#9CA3AF]">
                              Location
                            </p>

                            <p className="text-sm text-[#374151]">
                              {latestInterview.location}
                            </p>
                          </div>
                        )}

                      </div>

                      {latestInterview.meetingLink && (
                        <a
                          href={latestInterview.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block mt-3 text-xs font-medium text-blue-600 hover:text-blue-700"
                        >
                          Join Interview →
                        </a>
                      )}

                      {latestInterview.feedback && (
                        <div className="mt-3">
                          <p className="text-[11px] text-[#9CA3AF]">
                            Feedback
                          </p>

                          <p className="text-sm text-[#374151]">
                            {latestInterview.feedback}
                          </p>
                        </div>
                      )}

                    </div>
                  )}

                  {/* Application Details */}
                  <div className="mt-5 flex items-center gap-4 text-xs text-[#9CA3AF]">

                    <span>
                      Applied:{" "}
                      {a.applicationDate
                        ? a.applicationDate.split("T")[0]
                        : "—"}
                    </span>

                    {a.collegeName && (
                      <span>
                        College: {a.collegeName}
                      </span>
                    )}

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </AppLayout>
  );
}