import api from "./axios";
import type { Resume } from "@/types";

export const uploadResume = (file: File) => {
  const form = new FormData();
  form.append("file", file);
  return api.post<Resume>("/api/resumes/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getMyResume = () => api.get<Resume>("/api/resumes/my");

export const downloadMyResume = () =>
  api.get("/api/resumes/my/download", { responseType: "blob" });

export const getApplicationResume = (applicationId: number) =>
  api.get<Resume>(`/api/resumes/application/${applicationId}`);

export const downloadApplicationResume = (applicationId: number) =>
  api.get(`/api/resumes/application/${applicationId}/download`, {
    responseType: "blob",
  });
