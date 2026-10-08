import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number | undefined;
  icon: ReactNode;
  accent?: string;
  loading?: boolean;
  sub?: string;
}

export default function StatCard({
  label,
  value,
  icon,
  accent = "bg-gray-100 text-gray-600",
  loading,
  sub,
}: StatCardProps) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${accent}`}>
        {icon}
      </div>
      <div className="min-w-0">
        {loading ? (
          <>
            <div className="h-7 w-20 bg-gray-100 rounded animate-pulse mb-1" />
            <div className="h-4 w-28 bg-gray-100 rounded animate-pulse" />
          </>
        ) : (
          <>
            <p className="text-2xl font-semibold text-[#111827] tabular-nums leading-tight">
              {value ?? "—"}
            </p>
            <p className="text-sm text-[#6B7280] mt-0.5 truncate">{label}</p>
            {sub && <p className="text-xs text-[#9CA3AF] mt-0.5">{sub}</p>}
          </>
        )}
      </div>
    </div>
  );
}
