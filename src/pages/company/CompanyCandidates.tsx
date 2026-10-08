import { useEffect, useMemo, useState } from "react";
import {
  Users,
  User,
  Building2,
  Briefcase,
  ChevronRight,
  Search,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import AppLayout from "@/layouts/AppLayout";
import StatusBadge from "@/components/ui/StatusBadge";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";

import { getCompanyDrives } from "@/api/driveApi";
import { getDriveApplications } from "@/api/applicationApi";

import type { PlacementDrive, Application } from "@/types";

interface Candidate {
  studentName: string;
  registerNumber: string;
  collegeName: string;
  department: string;
  applications: Application[];
}

export default function CompanyCandidates() {
  const [drives, setDrives] = useState<PlacementDrive[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedCandidate, setSelectedCandidate] =
    useState<Candidate | null>(null);

  // =========================================================
  // LOAD COMPANY CANDIDATES
  // =========================================================

  const fetchCandidates = async () => {
    setLoading(true);
    setError("");

    try {
      // Get only this company's drives
      const drivesResponse = await getCompanyDrives();

      const companyDrives = drivesResponse.data;

      setDrives(companyDrives);

      // Get applications for each company drive
      const applicationResponses = await Promise.all(
        companyDrives.map((drive) =>
          getDriveApplications(drive.id)
        )
      );

      const allApplications = applicationResponses.flatMap(
        (response) => response.data
      );

      setApplications(allApplications);
    } catch (error) {
      console.error(
        "Failed to load company candidates:",
        error
      );

      setError("Failed to load candidates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  // =========================================================
  // BUILD UNIQUE CANDIDATES
  // =========================================================

  const candidates = useMemo(() => {
    const map = new Map<string, Candidate>();

    applications.forEach((application) => {
      const registerNumber =
        application.registerNumber ?? `student-${application.studentId}`;

      if (!map.has(registerNumber)) {
        map.set(registerNumber, {
          studentName:
            application.studentName ?? "Unknown Student",

          registerNumber:
            application.registerNumber ?? "—",

          collegeName:
            application.collegeName ?? "—",

          department:
            application.department ?? "—",

          applications: [],
        });
      }

      map.get(registerNumber)!.applications.push(application);
    });

    return Array.from(map.values());
  }, [applications]);

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredCandidates = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return candidates;
    }

    return candidates.filter((candidate) => {
      return (
        candidate.studentName
          .toLowerCase()
          .includes(query) ||

        candidate.registerNumber
          .toLowerCase()
          .includes(query) ||

        candidate.collegeName
          .toLowerCase()
          .includes(query) ||

        candidate.department
          .toLowerCase()
          .includes(query)
      );
    });
  }, [candidates, search]);

  // =========================================================
  // UI
  // =========================================================

  return (
    <AppLayout breadcrumb={["Company", "Candidates"]}>
      <div className="p-6 max-w-[1400px]">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-6">
          <h1 className="text-xl font-semibold text-[#111827]">
            Candidates
          </h1>

          <p className="text-sm text-[#6B7280] mt-0.5">
            View and manage candidates who applied to your
            placement drives.
          </p>
        </div>

        {/* =====================================================
            SEARCH
        ===================================================== */}

        {!loading && !error && candidates.length > 0 && (
          <div className="mb-4">

            <div className="relative max-w-md">

              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search candidates..."
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#374151]/20 focus:border-[#374151]"
              />

            </div>

          </div>
        )}

        {/* =====================================================
            CONTENT
        ===================================================== */}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-20 bg-gray-100 rounded-xl animate-pulse"
              />
            ))}
          </div>

        ) : error ? (
          <ErrorState
            message={error}
            onRetry={fetchCandidates}
          />

        ) : candidates.length === 0 ? (
          <EmptyState
            icon={
              <Users className="w-10 h-10 text-gray-300" />
            }
            title="No candidates yet"
            description="Candidates who apply to your placement drives will appear here."
          />

        ) : filteredCandidates.length === 0 ? (
          <EmptyState
            icon={
              <Search className="w-10 h-10 text-gray-300" />
            }
            title="No candidates found"
            description="Try searching with a different name, register number, college, or department."
          />

        ) : (
          <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">

            {/* =================================================
                TABLE
            ================================================= */}

            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">

                    <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
                      Candidate
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
                      Register No.
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
                      College
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
                      Department
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
                      Applications
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
                      Latest Status
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-[#F3F4F6]">

                  {filteredCandidates.map((candidate) => {

                    const latestApplication =
                      candidate.applications[
                        candidate.applications.length - 1
                      ];

                    return (
                      <tr
                        key={candidate.registerNumber}
                        onClick={() =>
                          setSelectedCandidate(candidate)
                        }
                        className="hover:bg-[#F9FAFB] cursor-pointer transition-colors"
                      >

                        {/* CANDIDATE */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">

                              <User className="w-4 h-4 text-[#6B7280]" />

                            </div>

                            <div>
                              <p className="font-medium text-[#111827]">
                                {candidate.studentName}
                              </p>
                            </div>

                          </div>

                        </td>

                        {/* REGISTER NUMBER */}

                        <td className="px-5 py-4 text-[#6B7280]">
                          {candidate.registerNumber}
                        </td>

                        {/* COLLEGE */}

                        <td className="px-5 py-4 text-[#6B7280]">
                          {candidate.collegeName}
                        </td>

                        {/* DEPARTMENT */}

                        <td className="px-5 py-4 text-[#6B7280]">
                          {candidate.department}
                        </td>

                        {/* APPLICATION COUNT */}

                        <td className="px-5 py-4">

                          <span className="inline-flex items-center gap-1.5 text-[#374151]">

                            <Briefcase className="w-3.5 h-3.5" />

                            {candidate.applications.length}

                          </span>

                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4">

                          {latestApplication ? (
                            <StatusBadge
                              status={latestApplication.status}
                            />
                          ) : (
                            "—"
                          )}

                        </td>

                        {/* ACTION */}

                        <td className="px-5 py-4">

                          <button
                            onClick={(e) => {
                              e.stopPropagation();

                              setSelectedCandidate(
                                candidate
                              );
                            }}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
                            title="View candidate"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>

          </div>
        )}

      </div>

      {/* =====================================================
          CANDIDATE DETAILS DRAWER
      ===================================================== */}

      <AnimatePresence>
        {selectedCandidate && (
          <div className="fixed inset-0 z-50 flex justify-end">

            {/* BACKDROP */}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/25"
              onClick={() =>
                setSelectedCandidate(null)
              }
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

              {/* HEADER */}

              <div className="sticky top-0 z-10 bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between">

                <div>
                  <h2 className="text-base font-semibold text-[#111827]">
                    Candidate Details
                  </h2>

                  <p className="text-xs text-[#9CA3AF] mt-0.5">
                    Candidate application history
                  </p>
                </div>

                <button
                  onClick={() =>
                    setSelectedCandidate(null)
                  }
                  className="text-gray-400 hover:text-gray-600 text-lg"
                >
                  ✕
                </button>

              </div>

              {/* CONTENT */}

              <div className="p-6 space-y-6">

                {/* PROFILE */}

                <div>

                  <div className="flex items-center gap-3">

                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">

                      <User className="w-5 h-5 text-[#6B7280]" />

                    </div>

                    <div>

                      <h3 className="text-lg font-semibold text-[#111827]">
                        {selectedCandidate.studentName}
                      </h3>

                      <p className="text-sm text-[#6B7280]">
                        {selectedCandidate.registerNumber}
                      </p>

                    </div>

                  </div>

                </div>

                {/* BASIC INFORMATION */}

                <div>

                  <h4 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-3">
                    Student Information
                  </h4>

                  <div className="space-y-3">

                    <div className="flex items-start gap-3">

                      <Building2 className="w-4 h-4 text-[#9CA3AF] mt-0.5" />

                      <div>
                        <p className="text-xs text-[#9CA3AF]">
                          College
                        </p>

                        <p className="text-sm font-medium text-[#374151]">
                          {selectedCandidate.collegeName}
                        </p>
                      </div>

                    </div>

                    <div className="flex items-start gap-3">

                      <Users className="w-4 h-4 text-[#9CA3AF] mt-0.5" />

                      <div>
                        <p className="text-xs text-[#9CA3AF]">
                          Department
                        </p>

                        <p className="text-sm font-medium text-[#374151]">
                          {selectedCandidate.department}
                        </p>
                      </div>

                    </div>

                  </div>

                </div>

                {/* APPLICATION HISTORY */}

                <div>

                  <h4 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-3">
                    Application History
                  </h4>

                  <div className="space-y-3">

                    {selectedCandidate.applications.map(
                      (application) => (
                        <div
                          key={application.id}
                          className="border border-[#E5E7EB] rounded-lg p-4"
                        >

                          <div className="flex items-start justify-between gap-3">

                            <div>

                              <p className="font-medium text-[#111827]">
                                {application.driveTitle}
                              </p>

                              <p className="text-xs text-[#9CA3AF] mt-1">
                                {application.jobRole}
                              </p>

                            </div>

                            <StatusBadge
                              status={
                                application.status
                              }
                            />

                          </div>

                          {application.applicationDate && (
                            <p className="text-xs text-[#9CA3AF] mt-3">
                              Applied:{" "}
                              {application.applicationDate.split(
                                "T"
                              )[0]}
                            </p>
                          )}

                        </div>
                      )
                    )}

                  </div>

                </div>

              </div>

            </motion.div>

          </div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}