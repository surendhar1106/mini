import api from "./axios";
import type { CollegeDashboard, Student, Application } from "@/types";

export const getCollegeDashboard = () =>
  api.get<CollegeDashboard>("/api/college/dashboard");

export const getCollegeStudents = () =>
  api.get<Student[]>("/api/college/students");

export const verifyStudent = (id: number) =>
  api.put(`/api/students/${id}/verify`);

export const rejectStudent = (id: number) =>
  api.put(`/api/students/${id}/reject`);

export const getCollegeApplications = () =>
  api.get<Application[]>("/api/college/applications");

// GET MY COLLEGE PROFILE
export const getMyCollegeProfile = () =>
  api.get("/api/colleges/my-profile");

// UPDATE MY COLLEGE PROFILE
export const updateMyCollegeProfile = (college: any) =>
  api.put("/api/colleges/my-profile", college);