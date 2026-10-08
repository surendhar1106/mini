import { useEffect, useState } from "react";
import AppLayout from "@/layouts/AppLayout";
import { Building2, Pencil, Save, X } from "lucide-react";
import {
  getMyCompanyProfile,
  updateMyCompanyProfile,
} from "@/api/companyApi";

type Company = {
  id: number;
  companyCode: string;
  name: string;
  industry?: string;
  companyType?: string;
  description?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  hrName?: string;
  hrEmail?: string;
  hrPhone?: string;
  approvalStatus?: string;
};

export default function CompanyProfile() {
  const [company, setCompany] = useState<Company | null>(null);
  const [form, setForm] = useState<Company | null>(null);
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

      const response = await getMyCompanyProfile();

      setCompany(response.data);
      setForm(response.data);
    } catch (err) {
      console.error(err);
      setError("Unable to load company profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    field: keyof Company,
    value: string
  ) => {
    if (!form) return;

    setForm({
      ...form,
      [field]: value,
    });
  };

  const handleEdit = () => {
    if (company) {
      setForm({ ...company });
      setEditing(true);
    }
  };

  const handleCancel = () => {
    setForm(company);
    setEditing(false);
    setError("");
  };

  const handleSave = async () => {
    if (!form) return;

    try {
      setSaving(true);
      setError("");

      const response = await updateMyCompanyProfile({
        name: form.name,
        industry: form.industry,
        companyType: form.companyType,
        description: form.description,
        phone: form.phone,
        website: form.website,
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        hrName: form.hrName,
        hrEmail: form.hrEmail,
        hrPhone: form.hrPhone,
      });

      setCompany(response.data);
      setForm(response.data);
      setEditing(false);
    } catch (err) {
      console.error(err);
      setError("Failed to update company profile.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full border border-[#D1D5DB] rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-500";

  const readOnlyClass =
    "w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#6B7280]";

  const field = (
    label: string,
    value: string | undefined,
    key: keyof Company,
    readOnly = false
  ) => (
    <div>
      <p className="text-xs text-[#6B7280] mb-1">{label}</p>

      {editing && !readOnly ? (
        <input
          value={value ?? ""}
          onChange={(e) => handleChange(key, e.target.value)}
          className={inputClass}
        />
      ) : (
        <div className={readOnly ? readOnlyClass : "text-sm font-medium text-[#374151]"}>
          {value || "—"}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <AppLayout breadcrumb={["Company", "Profile"]}>
        <div className="p-6">
          <p className="text-sm text-[#6B7280]">
            Loading company profile...
          </p>
        </div>
      </AppLayout>
    );
  }

  if (!company || !form) {
    return (
      <AppLayout breadcrumb={["Company", "Profile"]}>
        <div className="p-6">
          <div className="bg-white border border-red-200 rounded-xl p-6">
            <p className="text-sm text-red-600">
              {error || "Company profile not found."}
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout breadcrumb={["Company", "Profile"]}>
      <div className="p-6 max-w-5xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-[#111827]">
              Company Profile
            </h1>

            <p className="text-sm text-[#6B7280] mt-0.5">
              Manage your company information.
            </p>
          </div>

          {!editing ? (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
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
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 disabled:opacity-50"
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

        {/* Company Header */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 mb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-purple-50 flex items-center justify-center">
              <Building2 className="w-7 h-7 text-purple-600" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[#111827]">
                {company.name || "Company"}
              </h2>

              <p className="text-sm text-[#6B7280]">
                {company.companyCode}
              </p>
            </div>

            <div className="ml-auto">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  company.approvalStatus === "APPROVED"
                    ? "bg-green-50 text-green-700"
                    : company.approvalStatus === "REJECTED"
                    ? "bg-red-50 text-red-700"
                    : "bg-yellow-50 text-yellow-700"
                }`}
              >
                {company.approvalStatus || "PENDING"}
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
              "Company Name",
              form.name,
              "name"
            )}

            {field(
              "Company Code",
              company.companyCode,
              "companyCode",
              true
            )}

            {field(
              "Industry",
              form.industry,
              "industry"
            )}

            {field(
              "Company Type",
              form.companyType,
              "companyType"
            )}

            {field(
              "Email",
              company.email,
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

          <div className="mt-5">
            <p className="text-xs text-[#6B7280] mb-1">
              Description
            </p>

            {editing ? (
              <textarea
                value={form.description ?? ""}
                onChange={(e) =>
                  handleChange("description", e.target.value)
                }
                rows={4}
                className={inputClass}
              />
            ) : (
              <p className="text-sm text-[#374151]">
                {company.description || "—"}
              </p>
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

        {/* HR Information */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
          <h3 className="text-base font-semibold text-[#111827] mb-5">
            HR / Recruitment Contact
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {field(
              "HR Name",
              form.hrName,
              "hrName"
            )}

            {field(
              "HR Email",
              form.hrEmail,
              "hrEmail"
            )}

            {field(
              "HR Phone",
              form.hrPhone,
              "hrPhone"
            )}
          </div>
        </div>

      </div>
    </AppLayout>
  );
}