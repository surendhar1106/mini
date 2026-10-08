import api from "./axios";
import type { PlacementDrive } from "@/types";

export const getDrives = () =>
  api.get<PlacementDrive[]>("/api/placement-drives");

export const getDrive = (id: number) =>
  api.get<PlacementDrive>(`/api/placement-drives/${id}`);

export const getCompanyDrives = () =>
  api.get<PlacementDrive[]>("/api/placement-drives/company/my");

export const createDrive = (data: Partial<PlacementDrive>) =>
  api.post<PlacementDrive>("/api/placement-drives", data);

export const updateDrive = (id: number, data: Partial<PlacementDrive>) =>
  api.put<PlacementDrive>(`/api/placement-drives/${id}`, data);

export const openDrive = (id: number) =>
  api.put(`/api/placement-drives/${id}/open`);

export const closeDrive = (id: number) =>
  api.put(`/api/placement-drives/${id}/close`);

export const deleteDrive = (id: number) =>
  api.delete(`/api/placement-drives/${id}`);