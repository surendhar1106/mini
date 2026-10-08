import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  message = "Something went wrong.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <AlertTriangle className="w-10 h-10 text-red-400 mb-4" />
      <h3 className="text-base font-medium text-[#374151] mb-1">Error</h3>
      <p className="text-sm text-[#9CA3AF] max-w-xs">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 px-4 py-2 text-sm font-medium bg-[#374151] text-white rounded-lg hover:bg-[#1F2937] transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
}
