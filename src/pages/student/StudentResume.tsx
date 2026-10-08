import { useEffect, useState, useRef } from "react";
import { Upload, FileText, Download, Trash2, CheckCircle } from "lucide-react";
import AppLayout from "@/layouts/AppLayout";
import ErrorState from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";
import { uploadResume, getMyResume, downloadMyResume } from "@/api/resumeApi";
import type { Resume } from "@/types";

export default function StudentResume() {
  const { toast } = useToast();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetch = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getMyResume();
      setResume(res.data);
    } catch (e: unknown) {
      const err = e as { response?: { status?: number } };
      if (err.response?.status !== 404) setError("Failed to load resume.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      toast("Only PDF files are allowed.", "error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast("File size must be under 5 MB.", "error");
      return;
    }
    setUploading(true);
    setProgress(0);
    const interval = setInterval(() => setProgress((p) => Math.min(p + 15, 90)), 200);
    try {
      await uploadResume(file);
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => setProgress(0), 800);
      toast("Resume uploaded successfully.");
      fetch();
    } catch {
      clearInterval(interval);
      setProgress(0);
      toast("Failed to upload resume.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await downloadMyResume();
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = resume?.fileName ?? "resume.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast("Failed to download resume.", "error");
    }
  };

  return (
    <AppLayout breadcrumb={["Student", "Resume"]}>
      <div className="p-6 max-w-2xl">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-[#111827]">Resume</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">Upload and manage your placement resume.</p>
        </div>

        {loading ? (
          <div className="h-48 bg-gray-100 rounded-xl animate-pulse" />
        ) : error ? (
          <ErrorState message={error} onRetry={fetch} />
        ) : (
          <div className="space-y-4">
            {resume ? (
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#111827] truncate">{resume.fileName}</p>
                    <p className="text-sm text-[#9CA3AF]">
                      {Math.round(resume.fileSize / 1024)} KB · Uploaded {resume.uploadedDate?.split("T")[0]}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-white border border-[#E5E7EB] rounded-lg hover:bg-gray-50 text-[#374151] transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-[#374151] text-white rounded-lg hover:bg-[#1F2937] transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" /> Replace
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-emerald-600">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Resume is active and will be included with your applications.
                </div>
              </div>
            ) : null}

            {/* Upload area */}
            <div
              className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer ${
                dragOver ? "border-[#374151] bg-gray-50" : "border-[#E5E7EB] hover:border-[#9CA3AF]"
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const file = e.dataTransfer.files[0];
                if (file) handleFile(file);
              }}
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="w-8 h-8 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-[#374151] mb-1">
                {resume ? "Drag & drop to replace" : "Drag & drop your resume"}
              </p>
              <p className="text-xs text-[#9CA3AF]">PDF only · Maximum 5 MB</p>
              {uploading && (
                <div className="mt-4">
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#374151] rounded-full transition-all duration-200"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-[#9CA3AF] mt-1">Uploading... {progress}%</p>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
            />
          </div>
        )}
      </div>
    </AppLayout>
  );
}
