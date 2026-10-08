export type UserRole =
  | "OWNER"
  | "COLLEGE"
  | "COMPANY"
  | "STUDENT";


export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
}


export interface AuthResponse {
  token: string;
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
}


export interface LoginRequest {
  email: string;
  password: string;
}


export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
  collegeId?: number;
}

export type ApprovalStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "SUSPENDED";


export type VerificationStatus =
  | "PENDING"
  | "VERIFIED"
  | "REJECTED";


export type ApplicationStatus =
  | "APPLIED"
  | "SHORTLISTED"
  | "INTERVIEW"
  | "SELECTED"
  | "REJECTED";

export type DriveStatus =
  | "DRAFT"
  | "OPEN"
  | "CLOSED";


export type InterviewStatus =
  | "SCHEDULED"
  | "COMPLETED"
  | "PASSED"
  | "FAILED";


export type InterviewMode =
  | "ONLINE"
  | "OFFLINE";


export interface College {
  id: number;
  collegeCode: string;
  name: string;

  university: string;
  collegeType?: string;
  accreditation?: string;

  email?: string;
  phone?: string;
  website?: string;

  address?: string;
  city?: string;
  state: string;
  pincode?: string;

  placementOfficerName?: string;
  placementOfficerEmail?: string;
  placementOfficerPhone?: string;

  approvalStatus: ApprovalStatus;

  approvedAt?: string;
  createdAt: string;
  updatedAt?: string;

  createdBy?: User | null;
  approvedBy?: User | null;
}


export interface Company {
  id: number;
  companyName: string;
  companyCode: string;
  industry?: string;
  companyType?: string;
  city?: string;
  state?: string;
  website?: string;
  corporateEmail?: string;
  hrName?: string;
  hrEmail?: string;
  hrPhone?: string;
  approvalStatus: ApprovalStatus;
  registrationDate: string;
}


export interface Student {
  id: number;

  // Personal
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;

  // Education
  registerNumber: string;
  department: string;
  course: string;
  graduationYear: number;
  cgpa?: number;
  tenthPercentage?: number;
  twelfthPercentage?: number;
  backlogs?: number;

  // Online Profiles
  linkedinUrl?: string;
  githubUrl?: string;
  leetcodeUrl?: string;
  codechefUrl?: string;
  hackerrankUrl?: string;
  codeforcesUrl?: string;
  portfolioUrl?: string;

  // Other
  skills?: string;
  certifications?: string;
  resumeUrl?: string;

  verificationStatus: VerificationStatus;

  collegeName?: string;
  collegeId?: number;
}

export interface PlacementDrive {
  id: number;
  driveTitle: string;
  jobRole: string;
  jobDescription?: string;
  employmentType?: string;
  salaryPackage?: string;
  location?: string;
  applicationDeadline: string;
  eligibilityCriteria?: string;
  minimumCgpa?: number;
  passingYear?: number;
  eligibleDepartments?: string[];
  status: DriveStatus;
  companyId: number;
  companyName?: string;
  applicationsCount?: number;
}


export interface Application {
  id: number;
  studentName: string;
  registerNumber: string;
  studentId: number;
  collegeId?: number;
  collegeName?: string;
  department?: string;
  driveId: number;
  driveTitle: string;
  jobRole: string;
  companyName?: string;
  applicationDate: string;
  status: ApplicationStatus;
}


export interface Resume {
  id: number;
  studentId: number;
  studentName?: string;
  registerNumber?: string;
  fileName: string;
  fileSize: number;
  uploadedDate: string;
  applicationId?: number;
}


export interface Interview {
  id: number;
  applicationId: number;
  studentName?: string;
  companyName?: string;
  driveTitle?: string;
  jobRole?: string;
  date: string;
  time: string;
  mode: InterviewMode;
  meetingLink?: string;
  location?: string;
  interviewerName?: string;
  status: InterviewStatus;
  feedback?: string;
}


export interface OwnerDashboard {
  totalColleges: number;
  totalCompanies: number;
  totalStudents: number;
  totalPlacementDrives: number;
  totalApplications: number;
  totalInterviews: number;
  pendingCollegeApprovals: number;
  pendingCompanyApprovals: number;
}


export interface CollegeDashboard {
  collegeName: string;
  collegeCode: string;
  totalStudents: number;
  verifiedStudents: number;
  pendingStudents: number;
  rejectedStudents: number;
  totalApplications: number;
  appliedApplications: number;
  shortlistedStudents: number;
  selectedStudents: number;
  rejectedApplications: number;
}


export interface CompanyDashboard {
  companyName: string;
  totalDrives: number;
  totalApplications: number;
  appliedCount: number;
  shortlistedCount: number;
  selectedCount: number;
  rejectedCount: number;
  scheduledInterviews: number;
}


export interface StudentDashboard {
  studentName: string;
  registerNumber: string;
  department: string;
  course: string;
  graduationYear: number;
  verificationStatus: VerificationStatus;
  resumeStatus: boolean;
  totalApplications: number;
  appliedCount: number;
  shortlistedCount: number;
  selectedCount: number;
  rejectedCount: number;
  interviews: number;
}


export interface ApiError {
  message: string;
  status: number;
}