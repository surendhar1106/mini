import { useEffect, useState } from "react";
import { Download, FileText } from "lucide-react";
import AppLayout from "@/layouts/AppLayout";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";
import { getCompanyDrives } from "@/api/driveApi";
import { getDriveApplications } from "@/api/applicationApi";
import { getApplicationResume, downloadApplicationResume } from "@/api/resumeApi";
import type { PlacementDrive, Application, Resume } from "@/types";

export default function CompanyResumes() {
  const { toast } = useToast();
  const [drives, setDrives] = useState<PlacementDrive[]>([]);
  const [selectedDrive, setSelectedDrive] = useState<number | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [resumes, setResumes] = useState<Map<number, Resume>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getCompanyDrives().then((r) => setDrives(r.data)).catch(() => {});
  }, []);

  const loadDrive = async (driveId: number) => {
    setLoading(true);
    setSelectedDrive(driveId);
    setError("");
    try {
      const appsRes = await getDriveApplications(driveId);
      setApplications(appsRes.data);
      const map = new Map<number, Resume>();
      await Promise.all(
        appsRes.data.map(async (a) => {
          try {
            const r = await getApplicationResume(a.id);
            map.set(a.id, r.data);
          } catch {}
        })
      );
      setResumes(map);
    } catch {
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (applicationId: number, fileName: string) => {
    try {
      const res = await downloadApplicationResume(applicationId);
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast("Failed to download resume.", "error");
    }
  };

  return (
    <AppLayout breadcrumb={["Company", "Resumes"]}>
      <div className="p-6 max-w-[1400px]">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-[#111827]">Resumes</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">View and download applicant resumes.</p>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 mb-4">
          <label className="block text-xs font-medium text-[#6B7280] mb-1.5">Select Drive</label>
          <select onChange={(e) => loadDrive(Number(e.target.value))} className="w-full max-w-sm px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white focus:outline-none">
            <option value="">Choose a drive...</option>
            {drives.map((d) => <option key={d.id} value={d.id}>{d.driveTitle}</option>)}
          </select>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
          {!selectedDrive ? (
            <EmptyState title="Select a drive" description="Choose a drive to view applicant resumes." />
          ) : loading ? (
            <div className="p-6"><LoadingSkeleton /></div>
          ) : error ? (
            <ErrorState message={error} />
          ) : applications.length === 0 ? (
            <EmptyState title="No applicants" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                    {["Candidate", "Register No.", "Resume File", "File Size", "Upload Date", "Actions"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F4F6]">
                  {applications.map((a) => {
                    const resume = resumes.get(a.id);
                    return (
                      <tr key={a.id} className="hover:bg-[#F9FAFB] transition-colors">
                        <td className="px-4 py-3 font-medium text-[#111827]">{a.studentName}</td>
                        <td className="px-4 py-3 font-mono text-xs text-[#6B7280]">{a.registerNumber}</td>
                        <td className="px-4 py-3">
                          {resume ? (
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-gray-400" />
                              <span className="text-[#374151] text-sm">{resume.fileName}</span>
                            </div>
                          ) : <span className="text-xs text-[#9CA3AF]">Not uploaded</span>}
                        </td>
                        <td className="px-4 py-3 text-[#6B7280]">{resume ? `${Math.round(resume.fileSize / 1024)} KB` : "—"}</td>
                        <td className="px-4 py-3 text-[#6B7280]">{resume?.uploadedDate?.split("T")[0] ?? "—"}</td>
                        <td className="px-4 py-3">
                          {resume && (
                            <button
                              onClick={() => handleDownload(a.id, resume.fileName)}
                              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-gray-50 border border-[#E5E7EB] rounded-lg hover:bg-gray-100 text-[#374151] transition-colors"
                            >
                              <Download className="w-3.5 h-3.5" /> Download
                            </button>
                          )}
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
    </AppLayout>
  );
}
