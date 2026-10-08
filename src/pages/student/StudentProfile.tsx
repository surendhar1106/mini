import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import AppLayout from "@/layouts/AppLayout";
import {
  ExternalLink,
  Code2,
  GraduationCap,
  User,
  School,
  Award,
  Pencil,
  Save,
  X,
} from "lucide-react";
import api from "@/api/axios";

interface StudentProfileData {
  id?: number;
  registerNumber?: string;
  fullName?: string;
  email?: string;
  phone?: string;

  dateOfBirth?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;

  department?: string;
  course?: string;
  graduationYear?: number;
  cgpa?: number;
  tenthPercentage?: number;
  twelfthPercentage?: number;
  backlogs?: number;

  linkedinUrl?: string;
  githubUrl?: string;
  leetcodeUrl?: string;
  codechefUrl?: string;
  hackerrankUrl?: string;
  codeforcesUrl?: string;
  portfolioUrl?: string;

  skills?: string;
  certifications?: string;
  resumeUrl?: string;

  verificationStatus?: string;

  college?: {
    id?: number;
    name?: string;
  };
}

export default function StudentProfile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState<StudentProfileData>({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // =========================
  // LOAD PROFILE
  // =========================

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await api.get("/api/students/profile");

      setProfile(response.data);
    } catch (error) {
      console.error("Failed to load student profile:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (
    field: keyof StudentProfileData,
    value: string | number
  ) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // =========================
  // SAVE PROFILE
  // =========================

  const saveProfile = async () => {
    try {
      setSaving(true);

      await api.put("/api/students/profile", profile);

      setEditMode(false);

      await loadProfile();

      alert("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <AppLayout breadcrumb={["Student", "Profile"]}>
        <div className="p-6">
          <p className="text-sm text-gray-500">
            Loading profile...
          </p>
        </div>
      </AppLayout>
    );
  }

  // =========================
  // PROFILE LINKS
  // =========================

  const profileLinks = [
    {
      name: "LeetCode",
      field: "leetcodeUrl" as keyof StudentProfileData,
      value: profile.leetcodeUrl,
    },
    {
      name: "GitHub",
      field: "githubUrl" as keyof StudentProfileData,
      value: profile.githubUrl,
    },
    {
      name: "LinkedIn",
      field: "linkedinUrl" as keyof StudentProfileData,
      value: profile.linkedinUrl,
    },
    {
      name: "HackerRank",
      field: "hackerrankUrl" as keyof StudentProfileData,
      value: profile.hackerrankUrl,
    },
    {
      name: "CodeChef",
      field: "codechefUrl" as keyof StudentProfileData,
      value: profile.codechefUrl,
    },
    {
      name: "Codeforces",
      field: "codeforcesUrl" as keyof StudentProfileData,
      value: profile.codeforcesUrl,
    },
    {
      name: "Portfolio",
      field: "portfolioUrl" as keyof StudentProfileData,
      value: profile.portfolioUrl,
    },
  ];

  // =========================
  // COLLEGE
  // =========================

  const collegeName =
    profile.college?.name || "College not available";

  // =========================
  // PAGE
  // =========================

  return (
    <AppLayout breadcrumb={["Student", "Profile"]}>
      <div className="p-6 max-w-5xl mx-auto">

        {/* =========================
            PAGE HEADER
        ========================= */}

        <div className="flex justify-between items-start mb-6">

          <div>
            <h1 className="text-xl font-semibold text-[#111827]">
              My Profile
            </h1>

            <p className="text-sm text-[#6B7280] mt-1">
              Manage your personal, academic and professional information.
            </p>
          </div>

          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#374151] text-white rounded-lg text-sm hover:bg-[#1F2937]"
            >
              <Pencil size={16} />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">

              <button
                onClick={() => {
                  setEditMode(false);
                  loadProfile();
                }}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
              >
                <X size={16} />
                Cancel
              </button>

              <button
                onClick={saveProfile}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-60"
              >
                <Save size={16} />

                {saving ? "Saving..." : "Save Profile"}
              </button>

            </div>
          )}

        </div>


        {/* =========================
            PROFILE HEADER
        ========================= */}

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 mb-6">

          <div className="flex items-center gap-4">

            <div className="w-16 h-16 rounded-full bg-[#F3F4F6] flex items-center justify-center text-2xl font-semibold text-[#374151]">
              {profile.fullName?.charAt(0)?.toUpperCase() ||
                user?.fullName?.charAt(0)?.toUpperCase() ||
                "S"}
            </div>

            <div>

              <h2 className="text-xl font-semibold text-[#111827]">
                {profile.fullName ||
                  user?.fullName ||
                  "Student"}
              </h2>

              <p className="text-sm text-[#6B7280]">
                {profile.email ||
                  user?.email ||
                  "—"}
              </p>

              <span className="inline-block mt-2 px-2.5 py-1 text-xs rounded-full bg-green-50 text-green-700">
                Student
              </span>

            </div>

          </div>

        </div>


        {/* =========================
            PERSONAL INFORMATION
        ========================= */}

        <ProfileSection
          icon={<User size={18} />}
          title="Personal Information"
          description="Basic personal and contact information."
        >

          <InfoItem
            label="Full Name"
            value={profile.fullName}
            editMode={editMode}
            onChange={(value) =>
              handleChange("fullName", value)
            }
          />

          <InfoItem
            label="Email"
            value={profile.email || user?.email}
            readOnly
          />

          <InfoItem
            label="Mobile Number"
            value={profile.phone}
            editMode={editMode}
            onChange={(value) =>
              handleChange("phone", value)
            }
          />

          <InfoItem
            label="Register Number"
            value={profile.registerNumber}
            readOnly
          />

        </ProfileSection>


        {/* =========================
            EDUCATIONAL INFORMATION
        ========================= */}

        <ProfileSection
          icon={<GraduationCap size={18} />}
          title="Educational Information"
          description="Your academic and college information."
        >

          {/* COLLEGE - READ ONLY */}

          <InfoItem
            label="College Name"
            value={collegeName}
            readOnly
          />

          {/* COURSE */}

          <InfoItem
            label="Course / Degree"
            value={profile.course}
            editMode={editMode}
            onChange={(value) =>
              handleChange("course", value)
            }
          />

          {/* DEPARTMENT */}

          <InfoItem
            label="Department"
            value={profile.department}
            editMode={editMode}
            onChange={(value) =>
              handleChange("department", value)
            }
          />

          {/* GRADUATION YEAR */}

          <InfoItem
            label="Graduation Year"
            value={profile.graduationYear}
            editMode={editMode}
            type="number"
            onChange={(value) =>
              handleChange(
                "graduationYear",
                Number(value)
              )
            }
          />

          {/* CGPA */}

          <InfoItem
            label="CGPA"
            value={profile.cgpa}
            editMode={editMode}
            type="number"
            onChange={(value) =>
              handleChange(
                "cgpa",
                Number(value)
              )
            }
          />

          {/* 10TH */}

          <InfoItem
            label="10th Percentage"
            value={profile.tenthPercentage}
            editMode={editMode}
            type="number"
            onChange={(value) =>
              handleChange(
                "tenthPercentage",
                Number(value)
              )
            }
          />

          {/* 12TH */}

          <InfoItem
            label="12th Percentage"
            value={profile.twelfthPercentage}
            editMode={editMode}
            type="number"
            onChange={(value) =>
              handleChange(
                "twelfthPercentage",
                Number(value)
              )
            }
          />

          {/* BACKLOGS */}

          <InfoItem
            label="Backlogs"
            value={profile.backlogs}
            editMode={editMode}
            type="number"
            onChange={(value) =>
              handleChange(
                "backlogs",
                Number(value)
              )
            }
          />

        </ProfileSection>


        {/* =========================
            CODING PROFILES
        ========================= */}

        <ProfileSection
          icon={<Code2 size={18} />}
          title="Coding & Professional Profiles"
          description="Your coding and professional profile links."
        >

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {profileLinks.map((link) => (

              <div
                key={link.name}
                className="border border-[#E5E7EB] rounded-lg p-4"
              >

                <p className="text-xs text-[#9CA3AF] mb-2">
                  {link.name}
                </p>

                {editMode ? (

                  <input
                    type="url"
                    value={link.value || ""}
                    onChange={(event) =>
                      handleChange(
                        link.field,
                        event.target.value
                      )
                    }
                    placeholder={`Enter ${link.name} URL`}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                  />

                ) : link.value ? (

                  <a
                    href={link.value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-2 break-all"
                  >
                    {link.value}

                    <ExternalLink size={14} />
                  </a>

                ) : (

                  <p className="text-sm text-gray-400">
                    Not added
                  </p>

                )}

              </div>

            ))}

          </div>

        </ProfileSection>


        {/* =========================
            SKILLS
        ========================= */}

        <ProfileSection
          icon={<Award size={18} />}
          title="Skills"
          description="Your technical skills."
        >

          {editMode ? (

            <textarea
              value={profile.skills || ""}
              onChange={(event) =>
                handleChange(
                  "skills",
                  event.target.value
                )
              }
              placeholder="Example: Java, Python, React, Spring Boot, MySQL"
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />

          ) : profile.skills ? (

            <div className="flex flex-wrap gap-2">

              {profile.skills
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean)
                .map((skill) => (

                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-full bg-gray-100 text-sm font-medium text-gray-700"
                  >
                    {skill}
                  </span>

                ))}

            </div>

          ) : (

            <p className="text-sm text-gray-400">
              No skills added yet.
            </p>

          )}

        </ProfileSection>


        {/* =========================
            CERTIFICATIONS
        ========================= */}

        <ProfileSection
          icon={<School size={18} />}
          title="Certifications"
          description="Your certifications."
        >

          {editMode ? (

            <textarea
              value={profile.certifications || ""}
              onChange={(event) =>
                handleChange(
                  "certifications",
                  event.target.value
                )
              }
              placeholder="Example: AWS Cloud Practitioner, Java Certification"
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />

          ) : (

            <p className="text-sm text-gray-700">
              {profile.certifications ||
                "No certifications added."}
            </p>

          )}

        </ProfileSection>


        {/* =========================
            RESUME
        ========================= */}

        <ProfileSection
          icon={<School size={18} />}
          title="Resume"
          description="Your resume."
        >

          <div className="flex items-center justify-between border border-gray-200 rounded-lg p-4">

            <div>

              <p className="text-sm font-medium">
                Resume
              </p>

              <p className="text-xs text-gray-400 mt-1">
                {profile.resumeUrl
                  ? profile.resumeUrl
                  : "No resume uploaded"}
              </p>

            </div>

            <button
              type="button"
              className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50"
            >
              Upload Resume
            </button>

          </div>

        </ProfileSection>

      </div>
    </AppLayout>
  );
}


/* =====================================================
   PROFILE SECTION
===================================================== */

function ProfileSection({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 mb-6">

      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#E5E7EB]">

        <div className="w-9 h-9 rounded-lg bg-[#F3F4F6] flex items-center justify-center text-[#374151]">
          {icon}
        </div>

        <div>

          <h2 className="text-base font-semibold text-[#111827]">
            {title}
          </h2>

          <p className="text-xs text-[#9CA3AF] mt-0.5">
            {description}
          </p>

        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
        {children}
      </div>

    </div>
  );
}


/* =====================================================
   INFO ITEM
===================================================== */

function InfoItem({
  label,
  value,
  editMode = false,
  readOnly = false,
  type = "text",
  onChange,
}: {
  label: string;
  value?: string | number;
  editMode?: boolean;
  readOnly?: boolean;
  type?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <div>

      <p className="text-xs text-[#9CA3AF] mb-1">
        {label}
      </p>

      {editMode && !readOnly ? (

        <input
          type={type}
          value={value ?? ""}
          onChange={(event) =>
            onChange?.(event.target.value)
          }
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200"
        />

      ) : (

        <p className="text-sm font-medium text-[#374151]">
          {value !== undefined &&
          value !== null &&
          value !== ""
            ? value
            : "—"}
        </p>

      )}

      {readOnly && (
        <p className="text-[10px] text-gray-400 mt-1">
          Read only
        </p>
      )}

    </div>
  );
}