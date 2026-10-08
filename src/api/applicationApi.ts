import api from "./axios";
import type { Application, ApplicationStatus } from "@/types";

export const applyToDrive = (driveId: number) =>
  api.post<Application>(`/api/applications/drive/${driveId}`);

export const getMyApplications = () =>
  api.get<Application[]>("/api/applications/my");

export const getApplication = (id: number) =>
  api.get<Application>(`/api/applications/${id}`);

export const getDriveApplications = (driveId: number) =>
  api.get<Application[]>(`/api/applications/drive/${driveId}`);

export const updateApplicationStatus = (
  id: number,
  status: ApplicationStatus,
  remarks?: string
) =>
  api.put<Application>(
    `/api/applications/${id}/status`,
    null,
    {
      params: {
        status,
        ...(remarks ? { remarks } : {}),
      },
    }
  );