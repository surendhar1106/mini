import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/types";

// Auth
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

// Owner
import OwnerDashboard from "@/pages/owner/OwnerDashboard";
import CollegeManagement from "@/pages/owner/CollegeManagement";
import CompanyManagement from "@/pages/owner/CompanyManagement";
import OwnerStudents from "@/pages/owner/OwnerStudents";
import OwnerDrives from "@/pages/owner/OwnerDrives";
import OwnerAnalytics from "@/pages/owner/OwnerAnalytics";
import OwnerGovernance from "@/pages/owner/OwnerGovernance";
import OwnerSettings from "@/pages/owner/OwnerSettings";

// College
import CollegeDashboard from "@/pages/college/CollegeDashboard";
import CollegeStudents from "@/pages/college/CollegeStudents";
import CollegeVerification from "@/pages/college/CollegeVerification";
import CollegeApplications from "@/pages/college/CollegeApplications";
import CollegeProfile from "@/pages/college/CollegeProfile";

// Company
import CompanyDashboard from "@/pages/company/CompanyDashboard";
import CompanyDrives from "@/pages/company/CompanyDrives";
import CompanyApplications from "@/pages/company/CompanyApplications";
import CompanyCandidates from "@/pages/company/CompanyCandidates";
import CompanyResumes from "@/pages/company/CompanyResumes";
import CompanyInterviews from "@/pages/company/CompanyInterviews";
import CompanyProfile from "@/pages/company/CompanyProfile";

// Student
import StudentDashboard from "@/pages/student/StudentDashboard";
import StudentDrives from "@/pages/student/StudentDrives";
import StudentApplications from "@/pages/student/StudentApplications";
import StudentResume from "@/pages/student/StudentResume";
import StudentInterviews from "@/pages/student/StudentInterviews";
import StudentProfile from "@/pages/student/StudentProfile";

import AccessDenied from "@/pages/AccessDenied";

function ProtectedRoute({
  children,
  role,
}: {
  children: React.ReactNode;
  role: UserRole;
}) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== role) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
}

export default function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  const defaultRedirect = () => {
    if (!isAuthenticated) {
      return "/login";
    }

    const map: Record<UserRole, string> = {
      OWNER: "/owner/dashboard",
      COLLEGE: "/college/dashboard",
      COMPANY: "/company/dashboard",
      STUDENT: "/student/dashboard",
    };

    return map[user!.role];
  };

  return (
    <Routes>

      {/* ==================== PUBLIC ==================== */}

      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={defaultRedirect()} replace />
          ) : (
            <Login />
          )
        }
      />

      <Route
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate to={defaultRedirect()} replace />
          ) : (
            <Register />
          )
        }
      />

      <Route path="/403" element={<AccessDenied />} />


      {/* ==================== OWNER ==================== */}

      <Route
        path="/owner/dashboard"
        element={
          <ProtectedRoute role="OWNER">
            <OwnerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/colleges"
        element={
          <ProtectedRoute role="OWNER">
            <CollegeManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/companies"
        element={
          <ProtectedRoute role="OWNER">
            <CompanyManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/students"
        element={
          <ProtectedRoute role="OWNER">
            <OwnerStudents />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/drives"
        element={
          <ProtectedRoute role="OWNER">
            <OwnerDrives />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/analytics"
        element={
          <ProtectedRoute role="OWNER">
            <OwnerAnalytics />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/governance"
        element={
          <ProtectedRoute role="OWNER">
            <OwnerGovernance />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/settings"
        element={
          <ProtectedRoute role="OWNER">
            <OwnerSettings />
          </ProtectedRoute>
        }
      />


      {/* ==================== COLLEGE ==================== */}

      <Route
        path="/college/dashboard"
        element={
          <ProtectedRoute role="COLLEGE">
            <CollegeDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/college/students"
        element={
          <ProtectedRoute role="COLLEGE">
            <CollegeStudents />
          </ProtectedRoute>
        }
      />

      <Route
        path="/college/verification"
        element={
          <ProtectedRoute role="COLLEGE">
            <CollegeVerification />
          </ProtectedRoute>
        }
      />

      <Route
        path="/college/applications"
        element={
          <ProtectedRoute role="COLLEGE">
            <CollegeApplications />
          </ProtectedRoute>
        }
      />

      <Route
        path="/college/profile"
        element={
          <ProtectedRoute role="COLLEGE">
            <CollegeProfile />
          </ProtectedRoute>
        }
      />


      {/* ==================== COMPANY ==================== */}

      <Route
        path="/company/dashboard"
        element={
          <ProtectedRoute role="COMPANY">
            <CompanyDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/company/drives"
        element={
          <ProtectedRoute role="COMPANY">
            <CompanyDrives />
          </ProtectedRoute>
        }
      />

      <Route
        path="/company/applications"
        element={
          <ProtectedRoute role="COMPANY">
            <CompanyApplications />
          </ProtectedRoute>
        }
      />

      <Route
        path="/company/candidates"
        element={
          <ProtectedRoute role="COMPANY">
            <CompanyCandidates />
          </ProtectedRoute>
        }
      />

      <Route
        path="/company/resumes"
        element={
          <ProtectedRoute role="COMPANY">
            <CompanyResumes />
          </ProtectedRoute>
        }
      />

      <Route
        path="/company/interviews"
        element={
          <ProtectedRoute role="COMPANY">
            <CompanyInterviews />
          </ProtectedRoute>
        }
      />

      <Route
        path="/company/profile"
        element={
          <ProtectedRoute role="COMPANY">
            <CompanyProfile />
          </ProtectedRoute>
        }
      />


      {/* ==================== STUDENT ==================== */}

      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute role="STUDENT">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/drives"
        element={
          <ProtectedRoute role="STUDENT">
            <StudentDrives />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/applications"
        element={
          <ProtectedRoute role="STUDENT">
            <StudentApplications />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/resume"
        element={
          <ProtectedRoute role="STUDENT">
            <StudentResume />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/interviews"
        element={
          <ProtectedRoute role="STUDENT">
            <StudentInterviews />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/profile"
        element={
          <ProtectedRoute role="STUDENT">
            <StudentProfile />
          </ProtectedRoute>
        }
      />


      {/* ==================== DEFAULT ==================== */}

      <Route
        path="*"
        element={<Navigate to={defaultRedirect()} replace />}
      />

    </Routes>
  );
}