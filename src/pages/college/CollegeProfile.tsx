import { useEffect, useState } from "react";
import AppLayout from "@/layouts/AppLayout";
import { GraduationCap, Pencil, Save, X } from "lucide-react";
import {
  getMyCollegeProfile,
  updateMyCollegeProfile,
} from "@/api/collegeApi";

type College = {
  id: number;
  collegeCode: string;
  name: string;
  university?: string;
  collegeType?: string;
  accreditation?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  placementOfficerName?: string;
  placementOfficerEmail?: string;
  placementOfficerPhone?: string;
  approvalStatus?: string;
};

export default function CollegeProfile() {
  const [college, setCollege] = useState<College | null>(null);
  const [form, setForm] = useState<College | null>(null);

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyCollegeProfile();

      setCollege(response.data);
      setForm(response.data);
    } catch (err) {
      console.error(err);
      setError("Unable to load college profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    field: keyof College,
    value: string
  ) => {
    if (!form) return;

    setForm({
      ...form,
      [field]: value,
    });
  };

  const handleEdit = () => {
    if (college) {
      setForm({ ...college });
      setEditing(true);
    }
  };

  const handleCancel = () => {
    setForm(college);
    setEditing(false);
    setError("");
  };

  const handleSave = async () => {
    if (!form) return;

    try {
      setSaving(true);
      setError("");

      const response = await updateMyCollegeProfile({
        name: form.name,
        university: form.university,
        collegeType: form.collegeType,
        accreditation: form.accreditation,
        phone: form.phone,
        website: form.website,
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        placementOfficerName: form.placementOfficerName,
        placementOfficerEmail: form.placementOfficerEmail,
        placementOfficerPhone: form.placementOfficerPhone,
      });

      setCollege(response.data);
      setForm(response.data);
      setEditing(false);
    } catch (err) {
      console.error(err);
      setError("Failed to update college profile.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full border border-[#D1D5DB] rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500";

  const readOnlyClass =
    "w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#6B7280]";

  const field = (
    label: string,
    value: string | undefined,
    key: keyof College,
    readOnly = false
  ) => (
    <div>
      <p className="text-xs text-[#6B7280] mb-1">
        {label}
      </p>

      {editing && !readOnly ? (
        <input
          value={value ?? ""}
          onChange={(e) =>
            handleChange(key, e.target.value)
          }
          className={inputClass}
        />
      ) : (
        <div
          className={
            readOnly
              ? readOnlyClass
              : "text-sm font-medium text-[#374151]"
          }
        >
          {value || "—"}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <AppLayout breadcrumb={["College", "Profile"]}>
        <div className="p-6">
          <p className="text-sm text-[#6B7280]">
            Loading college profile...
          </p>
        </div>
      </AppLayout>
    );
  }

  if (!college || !form) {
    return (
      <AppLayout breadcrumb={["College", "Profile"]}>
        <div className="p-6">
          <div className="bg-white border border-red-200 rounded-xl p-6">
            <p className="text-sm text-red-600">
              {error || "College profile not found."}
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout breadcrumb={["College", "Profile"]}>
      <div className="p-6 max-w-5xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-[#111827]">
              College Profile
            </h1>

            <p className="text-sm text-[#6B7280] mt-0.5">
              Manage your college information.
            </p>
          </div>

          {!editing ? (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              <Pencil className="w-4 h-4" />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 border border-[#D1D5DB] rounded-lg text-sm"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* College Header */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 mb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-blue-600" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[#111827]">
                {college.name || "College"}
              </h2>

              <p className="text-sm text-[#6B7280]">
                {college.collegeCode}
              </p>
            </div>

            <div className="ml-auto">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  college.approvalStatus === "APPROVED"
                    ? "bg-green-50 text-green-700"
                    : college.approvalStatus === "REJECTED"
                    ? "bg-red-50 text-red-700"
                    : "bg-yellow-50 text-yellow-700"
                }`}
              >
                {college.approvalStatus || "PENDING"}
              </span>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 mb-5">
          <h3 className="text-base font-semibold text-[#111827] mb-5">
            Basic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {field(
              "College Name",
              form.name,
              "name"
            )}

            {field(
              "College Code",
              college.collegeCode,
              "collegeCode",
              true
            )}

            {field(
              "University",
              form.university,
              "university"
            )}

            {field(
              "College Type",
              form.collegeType,
              "collegeType"
            )}

            {field(
              "Accreditation",
              form.accreditation,
              "accreditation"
            )}

            {field(
              "Email",
              college.email,
              "email",
              true
            )}

            {field(
              "Phone",
              form.phone,
              "phone"
            )}

            {field(
              "Website",
              form.website,
              "website"
            )}
          </div>
        </div>

        {/* Address */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 mb-5">
          <h3 className="text-base font-semibold text-[#111827] mb-5">
            Address
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {field(
              "Address",
              form.address,
              "address"
            )}

            {field(
              "City",
              form.city,
              "city"
            )}

            {field(
              "State",
              form.state,
              "state"
            )}

            {field(
              "Pincode",
              form.pincode,
              "pincode"
            )}
          </div>
        </div>

        {/* Placement Officer */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
          <h3 className="text-base font-semibold text-[#111827] mb-5">
            Placement Officer
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {field(
              "Officer Name",
              form.placementOfficerName,
              "placementOfficerName"
            )}

            {field(
              "Officer Email",
              form.placementOfficerEmail,
              "placementOfficerEmail"
            )}

            {field(
              "Officer Phone",
              form.placementOfficerPhone,
              "placementOfficerPhone"
            )}
          </div>
        </div>

      </div>
    </AppLayout>
  );
}