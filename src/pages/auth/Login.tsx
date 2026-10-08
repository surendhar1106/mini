import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { login as loginApi } from "@/api/authApi";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  console.log("=== LOGIN BUTTON CLICKED ===");

  setError("");
  setLoading(true);

  try {
    console.log("1. Calling login API...");

    const res = await loginApi({
      email,
      password,
    });

    console.log("2. API RESPONSE:", res.data);

    const {
      token,
      id,
      fullName,
      email: userEmail,
      role,
    } = res.data;

    console.log("3. TOKEN:", !!token);
    console.log("4. ID:", id);
    console.log("5. FULL NAME:", fullName);
    console.log("6. EMAIL:", userEmail);
    console.log("7. ROLE:", role);

    const user = {
      id,
      fullName,
      email: userEmail,
      phone: "",
      role,
    };

    console.log("8. USER OBJECT:", user);

    console.log("9. Calling AuthContext.login...");

    login(token, user);

    console.log("10. AuthContext.login SUCCESS");

    const routes: Record<string, string> = {
      OWNER: "/owner/dashboard",
      COLLEGE: "/college/dashboard",
      COMPANY: "/company/dashboard",
      STUDENT: "/student/dashboard",
    };

    const destination = routes[role] ?? "/login";

    console.log("11. DESTINATION:", destination);

    navigate(destination, {
      replace: true,
    });

    console.log("12. NAVIGATION CALLED");
  } catch (err: unknown) {
    console.error("=== LOGIN ERROR ===", err);

    const e = err as {
      response?: {
        data?: {
          message?: string;
        };
        status?: number;
      };
    };

    setError(
      e.response?.data?.message ??
        "Invalid credentials. Please check your email and password."
    );
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen flex bg-white">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-[#111827] p-12">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-[#111827] text-xs font-bold">
              PD
            </span>
          </div>

          <span className="text-white font-semibold text-base tracking-tight">
            PlaceDrive
          </span>
        </div>

        {/* Main content */}
        <div>

          <h1 className="text-4xl font-semibold text-white leading-tight mb-4">
            The enterprise
            <br />
            placement platform
            <br />
            built for scale.
          </h1>

          <p className="text-[#9CA3AF] text-base leading-relaxed mb-10">
            Connecting universities, corporates, and students
            <br />
            through a unified placement management system.
          </p>

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4 mb-12">

            {[
              {
                value: "500+",
                label: "Colleges",
              },
              {
                value: "2,400+",
                label: "Companies",
              },
              {
                value: "180K+",
                label: "Students",
              },
              {
                value: "94%",
                label: "Placement Rate",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white/5 border border-white/10 rounded-xl p-4"
              >
                <p className="text-2xl font-semibold text-white">
                  {s.value}
                </p>

                <p className="text-sm text-[#6B7280] mt-0.5">
                  {s.label}
                </p>
              </div>
            ))}

          </div>

          {/* Testimonial */}
          <blockquote className="border-l-2 border-white/20 pl-4">

            <p className="text-[#D1D5DB] text-sm italic leading-relaxed">
              "PlaceDrive transformed how we manage campus recruitment —
              seamless, professional, and incredibly efficient."
            </p>

            <p className="text-[#6B7280] text-xs mt-2">
              — Director of Placements, NIT Trichy
            </p>

          </blockquote>

        </div>

        {/* Footer */}
        <p className="text-[#4B5563] text-xs">
          © 2026 PlaceDrive. Enterprise Placement Management.
        </p>

      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#F8F9FB]">

        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="mb-8">

            <div className="flex items-center gap-2 mb-6 lg:hidden">

              <div className="w-7 h-7 bg-[#374151] rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  PD
                </span>
              </div>

              <span className="font-semibold text-[#111827] text-sm">
                PlaceDrive
              </span>

            </div>

            <h2 className="text-2xl font-semibold text-[#111827] mb-1">
              Welcome back
            </h2>

            <p className="text-sm text-[#6B7280]">
              Sign in to your account to continue.
            </p>

          </div>

          {/* Login form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* Email */}
            <div>

              <label className="block text-sm font-medium text-[#374151] mb-1.5">
                Email address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                required
                autoComplete="email"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-[#111827] text-sm placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#374151]/30 focus:border-[#374151] transition-colors"
              />

            </div>

            {/* Password */}
            <div>

              <div className="flex items-center justify-between mb-1.5">

                <label className="block text-sm font-medium text-[#374151]">
                  Password
                </label>

                <button
                  type="button"
                  className="text-xs text-[#6B7280] hover:text-[#374151] transition-colors"
                >
                  Forgot password?
                </button>

              </div>

              <div className="relative">

                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
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

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#374151] text-white text-sm font-medium rounded-lg hover:bg-[#1F2937] disabled:opacity-60 transition-colors"
            >

              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4" />
                </>
              )}

            </button>

          </form>

          {/* Register */}
          <p className="text-center text-sm text-[#6B7280] mt-6">

            Don't have an account?{" "}

            <Link
              to="/register"
              className="font-medium text-[#374151] hover:underline"
            >
              Create account →
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}