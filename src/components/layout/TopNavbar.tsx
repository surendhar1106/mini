import { useState } from "react";
import { Menu, Bell, LogOut, ChevronDown, Search, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";

interface TopNavbarProps {
  onMenuClick: () => void;
  breadcrumb?: string[];
}

export default function TopNavbar({ onMenuClick, breadcrumb }: TopNavbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-14 bg-white border-b border-[#E5E7EB] flex items-center px-4 gap-4 flex-shrink-0">
      <button
        onClick={onMenuClick}
        className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500"
        aria-label="Open menu"
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* Breadcrumb */}
      {breadcrumb && breadcrumb.length > 0 && (
        <nav className="hidden sm:flex items-center gap-1.5 text-sm text-[#9CA3AF]">
          {breadcrumb.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-[#D1D5DB]">/</span>}
              <span className={i === breadcrumb.length - 1 ? "text-[#374151] font-medium" : ""}>
                {crumb}
              </span>
            </span>
          ))}
        </nav>
      )}

      <div className="flex-1" />

      {/* Search hint */}
      <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-sm text-[#9CA3AF] hover:bg-gray-50 transition-colors">
        <Search className="w-3.5 h-3.5" />
        <span>Search</span>
        <kbd className="ml-2 text-[10px] bg-gray-100 px-1.5 py-0.5 rounded">⌘K</kbd>
      </button>

      {/* Notifications */}
      <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 relative" aria-label="Notifications">
        <Bell className="w-4 h-4" />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-400 rounded-full" />
      </button>

      {/* User menu */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
          aria-label="User menu"
        >
          <div className="w-7 h-7 rounded-full bg-[#F3F4F6] flex items-center justify-center text-xs font-semibold text-[#374151]">
            {user?.fullName?.charAt(0)?.toUpperCase() ?? "U"}
          </div>
          <span className="hidden sm:block text-sm font-medium text-[#374151] max-w-[120px] truncate">
            {user?.fullName}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </button>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.12 }}
              className="absolute right-0 mt-1 w-52 bg-white border border-[#E5E7EB] rounded-xl shadow-lg z-20 overflow-hidden"
              onMouseLeave={() => setMenuOpen(false)}
            >
              <div className="px-4 py-3 border-b border-[#E5E7EB]">
                <p className="text-sm font-medium text-[#111827] truncate">{user?.fullName}</p>
                <p className="text-xs text-[#9CA3AF] truncate">{user?.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-600 rounded-full">
                  {user?.role}
                </span>
              </div>
              <div className="p-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
