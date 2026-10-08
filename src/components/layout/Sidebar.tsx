import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Building2, Briefcase, Users, ChevronLeft,
  ChevronRight, FileText, BarChart3, Shield, Settings,
  GraduationCap, BookOpen, SendHorizonal, ClipboardList,
  UserCircle, Calendar, X
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/types";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const navByRole: Record<UserRole, NavItem[]> = {
  OWNER: [
    { label: "Dashboard", path: "/owner/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Colleges", path: "/owner/colleges", icon: <GraduationCap className="w-4 h-4" /> },
    { label: "Companies", path: "/owner/companies", icon: <Building2 className="w-4 h-4" /> },
    { label: "Students", path: "/owner/students", icon: <Users className="w-4 h-4" /> },
    { label: "Placement Drives", path: "/owner/drives", icon: <Briefcase className="w-4 h-4" /> },
    { label: "Analytics", path: "/owner/analytics", icon: <BarChart3 className="w-4 h-4" /> },
    { label: "Governance", path: "/owner/governance", icon: <Shield className="w-4 h-4" /> },
    { label: "Settings", path: "/owner/settings", icon: <Settings className="w-4 h-4" /> },
  ],
  COLLEGE: [
    { label: "Dashboard", path: "/college/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Students", path: "/college/students", icon: <Users className="w-4 h-4" /> },
    { label: "Verification", path: "/college/verification", icon: <ClipboardList className="w-4 h-4" /> },
    { label: "Applications", path: "/college/applications", icon: <FileText className="w-4 h-4" /> },
    { label: "Profile", path: "/college/profile", icon: <UserCircle className="w-4 h-4" /> },
  ],
  COMPANY: [
    { label: "Dashboard", path: "/company/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Placement Drives", path: "/company/drives", icon: <Briefcase className="w-4 h-4" /> },
    { label: "Applications", path: "/company/applications", icon: <FileText className="w-4 h-4" /> },
    { label: "Candidates", path: "/company/candidates", icon: <Users className="w-4 h-4" /> },
    { label: "Resumes", path: "/company/resumes", icon: <BookOpen className="w-4 h-4" /> },
    { label: "Interviews", path: "/company/interviews", icon: <Calendar className="w-4 h-4" /> },
    { label: "Profile", path: "/company/profile", icon: <UserCircle className="w-4 h-4" /> },
  ],
  STUDENT: [
    { label: "Dashboard", path: "/student/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Placement Drives", path: "/student/drives", icon: <Briefcase className="w-4 h-4" /> },
    { label: "My Applications", path: "/student/applications", icon: <SendHorizonal className="w-4 h-4" /> },
    { label: "Resume", path: "/student/resume", icon: <FileText className="w-4 h-4" /> },
    { label: "Interviews", path: "/student/interviews", icon: <Calendar className="w-4 h-4" /> },
    { label: "Profile", path: "/student/profile", icon: <UserCircle className="w-4 h-4" /> },
  ],
};

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const { user } = useAuth();
  const role = user?.role ?? "STUDENT";
  const items = navByRole[role] ?? [];

  const content = (
    <div className={`flex flex-col h-full bg-white border-r border-[#E5E7EB] ${collapsed ? "w-16" : "w-60"} transition-all duration-200`}>
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-[#E5E7EB] min-h-[56px]">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#374151] rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">PD</span>
            </div>
            <span className="font-semibold text-[#111827] text-sm tracking-tight">PlaceDrive</span>
          </div>
        )}
        {collapsed && (
          <div className="w-7 h-7 bg-[#374151] rounded-lg flex items-center justify-center mx-auto">
            <span className="text-white text-xs font-bold">PD</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="hidden md:flex w-6 h-6 items-center justify-center rounded-md hover:bg-gray-100 text-gray-400 transition-colors"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Role label */}
      {!collapsed && (
        <div className="px-4 pt-3 pb-1">
          <span className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest">
            {role} MODULE
          </span>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onMobileClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 group
              ${isActive
                ? "bg-[#F3F4F6] text-[#111827]"
                : "text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#374151]"
              }`
            }
            title={collapsed ? item.label : undefined}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User info */}
      {!collapsed && user && (
        <div className="px-4 py-3 border-t border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#F3F4F6] flex items-center justify-center text-xs font-semibold text-[#374151] flex-shrink-0">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-[#111827] truncate">{user.fullName}</p>
              <p className="text-[10px] text-[#9CA3AF] truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col h-full">{content}</aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/30"
              onClick={onMobileClose}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative z-10 flex flex-col h-full"
            >
              <div className="absolute top-3 right-3">
                <button
                  onClick={onMobileClose}
                  className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              {content}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
