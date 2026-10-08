import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Loader2,
  GraduationCap,
  Building2,
  User,
  CheckCircle,
} from "lucide-react";
import { register as registerApi } from "@/api/authApi";
import api from "@/api/axios";
import type { UserRole, College } from "@/types";

type RegisterRole = "STUDENT" | "COLLEGE" | "COMPANY";

const roles: {
  id: RegisterRole;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "STUDENT",
    label: "Student",
    description: "Find and manage placement opportunities",
    icon: <User className="w-5 h-5" />,
  },
  {
    id: "COLLEGE",
    label: "College",
    description: "Manage students and placement activities",
    icon: <GraduationCap className="w-5 h-5" />,
  },
  {
    id: "COMPANY",
    label: "Company",
    description: "Recruit qualified candidates",
    icon: <Building2 className="w-5 h-5" />,
  },
];

export default function Register() {
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] =
    useState<RegisterRole | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
  });

  const [collegeId, setCollegeId] = useState<number | "">("");
  const [colleges, setColleges] = useState<College[]>([]);
  const [loadingColleges, setLoadingColleges] = useState(false);

  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Load approved colleges when Student is selected
  useEffect(() => {
    if (selectedRole !== "STUDENT") {
      setColleges([]);
      setCollegeId("");
      return;
    }

    const loadColleges = async () => {
      try {
        setLoadingColleges(true);
        setError("");

        const response = await api.get<College[]>("/api/colleges");

        const approvedColleges = response.data.filter(
          (college) => college.approvalStatus === "APPROVED"
        );

        setColleges(approvedColleges);
      } catch (err) {
        setError("Unable to load approved colleges.");
      } finally {
        setLoadingColleges(false);
      }
    };

    loadColleges();
  }, [selectedRole]);

  const update =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRole) return;

    // Student must select a college
    if (selectedRole === "STUDENT" && collegeId === "") {
      setError("Please select your college.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await registerApi({
        ...form,
        role: selectedRole as UserRole,
        ...(selectedRole === "STUDENT" && {
          collegeId: collegeId as number,
        }),
      });

      setSuccess(true);
    } catch (err: unknown) {
      const e = err as {
        response?: {
          data?: {
            message?: string;
          };
        };
      };

      setError(
        e.response?.data?.message ??
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center px-4">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-10 max-w-sm w-full text-center shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
          </div>

          <h2 className="text-lg font-semibold text-[#111827] mb-2">
            Registration submitted
          </h2>

          <p className="text-sm text-[#6B7280] leading-relaxed mb-6">
            {selectedRole === "STUDENT"
              ? "Your account is pending verification by your college. You'll be notified once verified."
              : `Your ${selectedRole?.toLowerCase()} account is pending approval by the platform administrator.`}
          </p>

          <button
            onClick={() => navigate("/login")}
            className="w-full px-4 py-2.5 bg-[#374151] text-white text-sm font-medium rounded-lg hover:bg-[#1F2937] transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">

        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-7 h-7 bg-[#374151] rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">PD</span>
          </div>

          <span className="font-semibold text-[#111827] text-sm">
            PlaceDrive
          </span>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm p-8">

          <h2 className="text-xl font-semibold text-[#111827] mb-1">
            Create your account
          </h2>

          <p className="text-sm text-[#6B7280] mb-6">
            Choose your role to get started.
          </p>

          {/* Role selection */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {roles.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  setSelectedRole(r.id);
                  setError("");
                }}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all duration-150 ${
                  selectedRole === r.id
                    ? "border-[#374151] bg-[#374151]/5 ring-1 ring-[#374151]"
                    : "border-[#E5E7EB] hover:border-[#9CA3AF] hover:bg-gray-50"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    selectedRole === r.id
                      ? "bg-[#374151] text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {r.icon}
                </div>

                <span className="text-sm font-medium text-[#111827]">
                  {r.label}
                </span>

                <span className="text-[10px] text-[#9CA3AF] leading-tight">
                  {r.description}
                </span>
              </button>
            ))}
          </div>

          {selectedRole && (
            <form onSubmit={handleSubmit} className="space-y-4">

              <div className="grid grid-cols-2 gap-4">

                {/* Full Name */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={form.fullName}
                    onChange={update("fullName")}
                    placeholder="John Smith"
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-[#111827] text-sm placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#374151]/30 focus:border-[#374151] transition-colors"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">
                    Email
                  </label>

                  <input
                    type="email"
                    value={form.email}
                    onChange={update("email")}
                    placeholder="you@example.com"
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-[#111827] text-sm placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#374151]/30 focus:border-[#374151] transition-colors"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">
                    Phone
                  </label>

                  <input
                    type="tel"
                    value={form.phone}
                    onChange={update("phone")}
                    placeholder="9876543210"
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-[#111827] text-sm placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#374151]/30 focus:border-[#374151] transition-colors"
                  />
                </div>

                {/* College - Student only */}
                {selectedRole === "STUDENT" && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-[#374151] mb-1.5">
                      College
                    </label>

                    <select
                      value={collegeId}
                      onChange={(e) =>
                        setCollegeId(
                          e.target.value === ""
                            ? ""
                            : Number(e.target.value)
                        )
                      }
                      required
                      disabled={loadingColleges}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-[#111827] text-sm focus:outline-none focus:ring-2 focus:ring-[#374151]/30 focus:border-[#374151] transition-colors"
                    >
                      <option value="">
                        {loadingColleges
                          ? "Loading colleges..."
                          : "Select your college"}
                      </option>

                      {colleges.map((college) => (
                        <option key={college.id} value={college.id}>
                          {college.name}
                        </option>
                      ))}
                    </select>

                    {!loadingColleges && colleges.length === 0 && (
                      <p className="text-xs text-red-600 mt-1.5">
                        No approved colleges are currently available.
                      </p>
                    )}
                  </div>
                )}

                {/* Password */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">
                    Password
                  </label>

                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      value={form.password}
                      onChange={update("password")}
                      placeholder="Min. 8 characters"
                      required
                      minLength={8}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-[#111827] text-sm placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#374151]/30 focus:border-[#374151] transition-colors pr-10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPw ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={
                  loading ||
                  (selectedRole === "STUDENT" &&
                    (loadingColleges || collegeId === ""))
                }
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#374151] text-white text-sm font-medium rounded-lg hover:bg-[#1F2937] disabled:opacity-60 transition-colors"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  `Create ${
                    selectedRole.charAt(0) +
                    selectedRole.slice(1).toLowerCase()
                  } Account`
                )}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-[#6B7280] mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-[#374151] hover:underline"
            >
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}