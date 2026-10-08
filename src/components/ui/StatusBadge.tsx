interface StatusBadgeProps {
  status?: string | null;
  size?: "sm" | "md";
}

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  VERIFIED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
  SUSPENDED: "bg-orange-50 text-orange-700 border-orange-200",
  APPLIED: "bg-blue-50 text-blue-700 border-blue-200",
  SHORTLISTED: "bg-purple-50 text-purple-700 border-purple-200",
  SELECTED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  DRAFT: "bg-gray-50 text-gray-600 border-gray-200",
  OPEN: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CLOSED: "bg-gray-50 text-gray-600 border-gray-200",
  SCHEDULED: "bg-blue-50 text-blue-700 border-blue-200",
  COMPLETED: "bg-gray-50 text-gray-600 border-gray-200",
  PASSED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  FAILED: "bg-red-50 text-red-700 border-red-200",
};

export default function StatusBadge({
  status,
  size = "sm",
}: StatusBadgeProps) {
  const safeStatus = status?.trim() || "PENDING";
  const normalizedStatus = safeStatus.toUpperCase();

  const style =
    statusStyles[normalizedStatus] ??
    "bg-gray-50 text-gray-600 border-gray-200";

  const px =
    size === "sm"
      ? "px-2 py-0.5 text-xs"
      : "px-3 py-1 text-sm";

  const displayStatus = normalizedStatus
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium tracking-wide ${px} ${style}`}
    >
      {displayStatus}
    </span>
  );
}