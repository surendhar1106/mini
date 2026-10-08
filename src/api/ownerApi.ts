import api from "./axios";
import type { OwnerDashboard, College, Company, Student } from "@/types";

export const getOwnerDashboard = () =>
  api.get<OwnerDashboard>("/api/owner/dashboard");

export const getColleges = () => api.get<College[]>("/api/owner/colleges");

export const approveCollege = (id: number) =>
  api.put(`/api/colleges/${id}/approve`);

export const rejectCollege = (id: number) =>
  api.put(`/api/colleges/${id}/reject`);

export const getCompanies = () => api.get<Company[]>("/api/owner/companies");

export const approveCompany = (id: number) =>
  api.put(`/api/companies/${id}/approve`);

export const rejectCompany = (id: number) =>
  api.put(`/api/companies/${id}/reject`);

export const suspendCompany = (id: number) =>
  api.put(`/api/companies/${id}/suspend`);

export const getStudents = () => api.get<Student[]>("/api/owner/students");
