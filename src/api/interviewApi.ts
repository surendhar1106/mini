import api from "./axios";

export type InterviewStatus =
  | "SCHEDULED"
  | "COMPLETED"
  | "PASSED"
  | "FAILED";

export interface Interview {
  id: number;
  applicationId?: number;
  studentId?: number;
  studentName?: string;
  registerNumber?: string;
  companyId?: number;
  companyName?: string;

  scheduledAt?: string;
  mode?: string;
  meetingLink?: string;
  location?: string;
  interviewerName?: string;

  status: InterviewStatus;
  feedback?: string;

  createdAt?: string;
  updatedAt?: string;
}

// Schedule interview
export const scheduleInterview = (
  applicationId: number,
  interview: {
    scheduledAt: string;
    mode?: string;
    meetingLink?: string;
    location?: string;
    interviewerName?: string;
  }
) =>
  api.post<Interview>(
    `/api/interviews/application/${applicationId}`,
    interview
  );

// Get interview by ID
export const getInterview = (id: number) =>
  api.get<Interview>(`/api/interviews/${id}`);

// Get interviews for an application
export const getApplicationInterviews = (
  applicationId: number
) =>
  api.get<Interview[]>(
    `/api/interviews/application/${applicationId}`
  );

// Update interview status
export const updateInterviewStatus = (
  id: number,
  status: InterviewStatus,
  feedback?: string
) =>
  api.put<Interview>(
    `/api/interviews/${id}/status`,
    null,
    {
      params: {
        status,
        ...(feedback ? { feedback } : {}),
      },
    }
  );