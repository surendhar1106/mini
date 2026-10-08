import api from "./axios";
import type { Student, StudentDashboard } from "@/types";

export const getStudentDashboard = () =>
  api.get<StudentDashboard>("/api/student/dashboard");

export const getMyProfile = () =>
  api.get<Student>("/api/students/profile");

export const updateMyProfile = (student: Partial<Student>) =>
  api.put<Student>("/api/students/profile", student);