import AppLayout from "@/layouts/AppLayout";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const registrationTrend = [
  { month: "Jan", colleges: 12, companies: 28, students: 340 },
  { month: "Feb", colleges: 18, companies: 35, students: 510 },
  { month: "Mar", colleges: 9, companies: 42, students: 420 },
  { month: "Apr", colleges: 23, companies: 51, students: 680 },
  { month: "May", colleges: 15, companies: 38, students: 590 },
  { month: "Jun", colleges: 31, companies: 67, students: 820 },
];

const applicationTrend = [
  { month: "Jan", applied: 1200, shortlisted: 430, selected: 180 },
  { month: "Feb", applied: 1850, shortlisted: 620, selected: 240 },
  { month: "Mar", applied: 1400, shortlisted: 510, selected: 200 },
  { month: "Apr", applied: 2100, shortlisted: 780, selected: 310 },
  { month: "May", applied: 1900, shortlisted: 690, selected: 270 },
  { month: "Jun", applied: 2400, shortlisted: 920, selected: 380 },
];

const distributionData = [
  { name: "Students", value: 68 },
  { name: "Colleges", value: 14 },
  { name: "Companies", value: 18 },
];

const COLORS = ["#374151", "#9CA3AF", "#D1D5DB"];

export default function OwnerAnalytics() {
  return (
    <AppLayout breadcrumb={["Owner", "Analytics"]}>
      <div className="p-6 max-w-[1400px]">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-[#111827]">Platform Analytics</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">Platform growth metrics and participation trends.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Registration trend */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-[#111827] mb-4">Registered Users Trend</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={registrationTrend}>
                <defs>
                  <linearGradient id="gStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#374151" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#374151" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: 12 }} />
                <Area type="monotone" dataKey="students" stroke="#374151" fill="url(#gStudents)" strokeWidth={2} name="Students" />
                <Area type="monotone" dataKey="companies" stroke="#9CA3AF" fill="none" strokeWidth={2} strokeDasharray="4 2" name="Companies" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Application trend */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-[#111827] mb-4">Application Trends</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={applicationTrend} barSize={16} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="applied" fill="#E5E7EB" radius={[3, 3, 0, 0]} name="Applied" />
                <Bar dataKey="shortlisted" fill="#9CA3AF" radius={[3, 3, 0, 0]} name="Shortlisted" />
                <Bar dataKey="selected" fill="#374151" radius={[3, 3, 0, 0]} name="Selected" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Distribution */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-[#111827] mb-4">Platform Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={distributionData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                  {distributionData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Key Metrics */}
          <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-[#111827] mb-4">Platform Placement Overview</h3>
            <div className="space-y-3">
              {[
                { label: "Overall Placement Rate", value: "78%", bar: 78, color: "bg-emerald-400" },
                { label: "Drive-to-Selection Ratio", value: "42%", bar: 42, color: "bg-[#374151]" },
                { label: "College Participation Rate", value: "91%", bar: 91, color: "bg-blue-400" },
                { label: "Company Retention Rate", value: "64%", bar: 64, color: "bg-amber-400" },
              ].map((m) => (
                <div key={m.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-[#374151]">{m.label}</span>
                    <span className="text-sm font-semibold text-[#111827]">{m.value}</span>
                  </div>
                  <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${m.color}`} style={{ width: m.value }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
