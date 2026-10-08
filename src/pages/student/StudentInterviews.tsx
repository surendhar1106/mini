import { useEffect, useState } from "react";
import {
  Calendar,
  Video,
  MapPin,
  User,
  Clock,
} from "lucide-react";

import AppLayout from "@/layouts/AppLayout";
import StatusBadge from "@/components/ui/StatusBadge";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";

import { getMyApplications } from "@/api/applicationApi";
import {
  getApplicationInterviews,
  type Interview,
} from "@/api/interviewApi";

type InterviewView = Interview & {
  companyName?: string;
  driveTitle?: string;
  jobRole?: string;
};

export default function StudentInterviews() {
  const [interviews, setInterviews] =
    useState<InterviewView[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =========================================================
  // LOAD STUDENT INTERVIEWS
  // =========================================================

  const fetchInterviews = async () => {
    setLoading(true);
    setError("");

    try {
      const appsRes = await getMyApplications();

      const ivs: InterviewView[] = [];

      await Promise.all(
        appsRes.data.map(async (application) => {
          try {
            const response =
              await getApplicationInterviews(
                application.id
              );

            // Backend returns Interview[]
            response.data.forEach((interview) => {
              ivs.push({
                ...interview,

                companyName:
                  interview.companyName ??
                  application.companyName,

                driveTitle:
                  application.driveTitle,

                jobRole:
                  application.jobRole,
              });
            });
          } catch {
            // This application has no interview.
          }
        })
      );

      // Sort by scheduled date
      ivs.sort((a, b) => {
        const dateA = a.scheduledAt
          ? new Date(a.scheduledAt).getTime()
          : 0;

        const dateB = b.scheduledAt
          ? new Date(b.scheduledAt).getTime()
          : 0;

        return dateA - dateB;
      });

      setInterviews(ivs);
    } catch (err) {
      console.error(
        "Failed to load student interviews:",
        err
      );

      setError("Failed to load interviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  // =========================================================
  // DATE FORMAT
  // =========================================================

  const formatDate = (
    scheduledAt?: string
  ) => {
    if (!scheduledAt) {
      return "Date not available";
    }

    const date = new Date(scheduledAt);

    if (Number.isNaN(date.getTime())) {
      return "Date not available";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================================
  // TIME FORMAT
  // =========================================================

  const formatTime = (
    scheduledAt?: string
  ) => {
    if (!scheduledAt) {
      return "Time not available";
    }

    const date = new Date(scheduledAt);

    if (Number.isNaN(date.getTime())) {
      return "Time not available";
    }

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // =========================================================
  // UPCOMING CHECK
  // =========================================================

  const isUpcoming = (
    interview: InterviewView
  ) => {
    if (
      interview.status !== "SCHEDULED" ||
      !interview.scheduledAt
    ) {
      return false;
    }

    const interviewDate =
      new Date(interview.scheduledAt);

    return (
      !Number.isNaN(interviewDate.getTime()) &&
      interviewDate.getTime() >= Date.now()
    );
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <AppLayout
      breadcrumb={["Student", "Interviews"]}
    >
      <div className="p-6 max-w-[1400px]">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-[#111827]">
            Interviews
          </h1>

          <p className="text-sm text-[#6B7280] mt-0.5">
            Your scheduled and completed interviews.
          </p>
        </div>

        {/* Loading */}
        {loading ? (

          <div className="p-6">
            <LoadingSkeleton />
          </div>

        ) : error ? (

          <ErrorState
            message={error}
            onRetry={fetchInterviews}
          />

        ) : interviews.length === 0 ? (

          <EmptyState
            icon={
              <Calendar className="w-10 h-10 text-gray-300" />
            }
            title="No interviews yet"
            description="Interviews will appear here once scheduled by companies."
          />

        ) : (

          <div className="space-y-4">

            {interviews.map((iv, index) => {

              const upcoming =
                isUpcoming(iv);

              return (

                <div
                  key={
                    iv.id ??
                    `interview-${index}`
                  }
                  className={`bg-white border rounded-xl p-5 ${
                    upcoming
                      ? "border-blue-200 ring-1 ring-blue-100"
                      : "border-[#E5E7EB]"
                  }`}
                >

                  {/* =================================================
                      HEADER
                  ================================================= */}

                  <div className="flex items-start justify-between gap-4 mb-4">

                    <div>

                      <div className="flex items-center gap-2 mb-1">

                        {upcoming && (
                          <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-700 rounded-full uppercase tracking-wide">
                            Upcoming
                          </span>
                        )}

                        <h3 className="font-semibold text-[#111827]">
                          {iv.driveTitle ||
                            "Placement Interview"}
                        </h3>

                      </div>

                      <p className="text-sm text-[#6B7280]">
                        {iv.jobRole ||
                          "Job Role"}

                        {" · "}

                        {iv.companyName ||
                          "Company"}
                      </p>

                    </div>

                    <StatusBadge
                      status={iv.status}
                    />

                  </div>

                  {/* =================================================
                      INTERVIEW DETAILS
                  ================================================= */}

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm text-[#374151]">

                      <Calendar
                        className="w-4 h-4 text-[#9CA3AF] flex-shrink-0"
                      />

                      <span>
                        {formatDate(
                          iv.scheduledAt
                        )}
                      </span>

                    </div>

                    {/* Time */}
                    <div className="flex items-center gap-2 text-sm text-[#374151]">

                      <Clock
                        className="w-4 h-4 text-[#9CA3AF] flex-shrink-0"
                      />

                      <span>
                        {formatTime(
                          iv.scheduledAt
                        )}
                      </span>

                    </div>

                    {/* Mode */}
                    <div className="flex items-center gap-2 text-sm text-[#374151]">

                      {iv.mode ===
                      "ONLINE" ? (

                        <Video
                          className="w-4 h-4 text-[#9CA3AF] flex-shrink-0"
                        />

                      ) : (

                        <MapPin
                          className="w-4 h-4 text-[#9CA3AF] flex-shrink-0"
                        />

                      )}

                      <span>
                        {iv.mode ||
                          "Mode not available"}
                      </span>

                    </div>

                    {/* Interviewer */}
                    <div className="flex items-center gap-2 text-sm text-[#374151]">

                      <User
                        className="w-4 h-4 text-[#9CA3AF] flex-shrink-0"
                      />

                      <span>
                        {iv.interviewerName ||
                          "Not specified"}
                      </span>

                    </div>

                  </div>

                  {/* =================================================
                      LOCATION
                  ================================================= */}

                  {iv.location && (
                    <div className="mt-3 text-sm text-[#6B7280]">

                      <span className="font-medium text-[#374151]">
                        Location:
                      </span>{" "}

                      {iv.location}

                    </div>
                  )}

                  {/* =================================================
                      MEETING LINK
                  ================================================= */}

                  {iv.meetingLink && (
                    <div className="mt-3 pt-3 border-t border-[#F3F4F6]">

                      <a
                        href={iv.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
                      >

                        <Video className="w-3.5 h-3.5" />

                        Join Meeting

                      </a>

                    </div>
                  )}

                  {/* =================================================
                      FEEDBACK
                  ================================================= */}

                  {iv.feedback && (
                    <div className="mt-3 pt-3 border-t border-[#F3F4F6]">

                      <p className="text-xs text-[#9CA3AF] mb-0.5">
                        Feedback
                      </p>

                      <p className="text-sm text-[#374151]">
                        {iv.feedback}
                      </p>

                    </div>
                  )}

                </div>

              );
            })}

          </div>

        )}

      </div>
    </AppLayout>
  );
}