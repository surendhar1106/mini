import api from "./axios";
import type { CompanyDashboard } from "@/types";

export const getCompanyDashboard = () =>
  api.get<CompanyDashboard>("/api/company/dashboard");

// GET MY COMPANY PROFILE
export const getMyCompanyProfile = () =>
  api.get("/api/companies/my-profile");

// UPDATE MY COMPANY PROFILE
export const updateMyCompanyProfile = (company: any) =>
  api.put("/api/companies/my-profile", company);