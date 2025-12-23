"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

/**
 * Profile Dropdown Component
 *
 * User profile dropdown in the header with navigation links.
 *
 * Features:
 * - User avatar and name display
 * - Role display (Student/Teacher)
 * - Links to Profile and Settings
 * - Logout functionality
 * - Click outside to close
 * - Compact design for header
 *
 * Menu Items:
 * - Profile: Navigate to profile page
 * - Settings: Navigate to settings page
 * - Logout: Clear auth and redirect to login
 */

export default function ProfileDropdown() {
  const router = useRouter();
  const { user, role, isTeacher, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const userName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.firstName || "John Doe";

  const userRole = isTeacher ? "Teacher" : "Student";

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1.5 sm:space-x-2 lg:space-x-3 hover:bg-gray-50 rounded-lg px-1.5 sm:px-2 py-1 sm:py-1.5 transition-colors"
      >
        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <div className="hidden md:block text-left min-w-0">
          <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
            {userName}
          </p>
          <p className="text-xs text-gray-500">{userRole}</p>
        </div>
        <ChevronDown
          className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-500 transition-transform duration-200 flex-shrink-0`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 sm:w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 max-w-[calc(100vw-1rem)]">
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
              {userName}
            </p>
            <p className="text-xs text-gray-500">{userRole}</p>
          </div>
          <div className="py-1">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-2 px-3 py-1.5 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span>Profile</span>
            </Link>
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-2 px-3 py-1.5 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span>Settings</span>
            </Link>
            <div className="border-t border-gray-200 my-1"></div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-1.5 text-xs sm:text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
