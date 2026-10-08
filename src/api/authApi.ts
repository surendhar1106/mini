import api from "./axios";
import type { LoginRequest, RegisterRequest, AuthResponse } from "@/types";

export const login = (data: LoginRequest) =>
  api.post<AuthResponse>("/api/auth/login", data);

export const register = (data: RegisterRequest) =>
  api.post("/api/auth/register", data);
