import AppLayout from "@/layouts/AppLayout";
import { Settings, User, Bell, Shield, Server, Info } from "lucide-react";

const sections = [
  {
    icon: <User className="w-4 h-4" />,
    title: "General",
    description: "Platform name, timezone, and display settings.",
    fields: [
      { label: "Platform Name", value: "PlaceDrive", type: "text" },
      { label: "Support Email", value: "admin@placedrive.io", type: "email" },
      { label: "Timezone", value: "Asia/Kolkata (IST)", type: "text" },
    ],
  },
  {
    icon: <Bell className="w-4 h-4" />,
    title: "Notifications",
    description: "Configure system notification preferences.",
    toggles: [
      { label: "Email on new college registration", enabled: true },
      { label: "Email on new company registration", enabled: true },
      { label: "Alert on governance issues", enabled: true },
      { label: "Weekly platform summary digest", enabled: false },
    ],
  },
  {
    icon: <Shield className="w-4 h-4" />,
    title: "Authentication & Security",
    description: "Session management and security configurations.",
    fields: [
      { label: "Session Timeout", value: "30 minutes", type: "text" },
      { label: "Max Login Attempts", value: "5", type: "number" },
    ],
  },
];

export default function OwnerSettings() {
  return (
    <AppLayout breadcrumb={["Owner", "Settings"]}>
      <div className="p-6 max-w-2xl">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-[#111827]">Platform Settings</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">Manage global platform configuration.</p>
        </div>

        <div className="space-y-4">
          {sections.map((s) => (
            <div key={s.title} className="bg-white border border-[#E5E7EB] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[#6B7280]">{s.icon}</span>
                <h3 className="text-sm font-semibold text-[#111827]">{s.title}</h3>
              </div>
              <p className="text-xs text-[#9CA3AF] mb-4">{s.description}</p>

              {s.fields?.map((f) => (
                <div key={f.label} className="mb-3">
                  <label className="block text-xs font-medium text-[#6B7280] mb-1">{f.label}</label>
                  <input
                    type={f.type}
                    defaultValue={f.value}
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-[#F9FAFB] text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#374151]/20 focus:border-[#374151]"
                  />
                </div>
              ))}

              {s.toggles?.map((t) => (
                <div key={t.label} className="flex items-center justify-between py-2">
                  <span className="text-sm text-[#374151]">{t.label}</span>
                  <button
                    className={`relative w-9 h-5 rounded-full transition-colors ${t.enabled ? "bg-[#374151]" : "bg-gray-200"}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${t.enabled ? "left-4" : "left-0.5"}`} />
                  </button>
                </div>
              ))}

              {s.fields && (
                <div className="mt-4 flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                  <Info className="w-3.5 h-3.5 flex-shrink-0" />
                  Changes to these settings require backend support to persist.
                </div>
              )}
            </div>
          ))}

          {/* System Info */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Server className="w-4 h-4 text-[#6B7280]" />
              <h3 className="text-sm font-semibold text-[#111827]">System Information</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Frontend", "React 19 + Vite 8"],
                ["Backend", "Spring Boot"],
                ["Auth", "JWT Bearer"],
                ["Platform Version", "1.0.0"],
                ["Environment", "Production"],
                ["API Base", "localhost:8080"],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-xs text-[#9CA3AF]">{k}</p>
                  <p className="text-sm font-medium text-[#374151] font-mono">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
