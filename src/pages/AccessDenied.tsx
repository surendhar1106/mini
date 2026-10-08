import { ShieldOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AccessDenied() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <ShieldOff className="w-7 h-7 text-red-500" />
        </div>
        <h1 className="text-2xl font-semibold text-[#111827] mb-2">Access Denied</h1>
        <p className="text-sm text-[#6B7280] mb-6">
          You don't have permission to access this page. Please contact your administrator.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2.5 bg-[#374151] text-white text-sm font-medium rounded-lg hover:bg-[#1F2937] transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
