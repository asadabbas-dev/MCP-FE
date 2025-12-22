'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Bell,
  Calendar,
  Library,
  MessageSquare,
  Search,
  FileQuestion,
  Bot,
  Menu,
  X,
  Star,
  DollarSign,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';

/**
 * Sidebar Navigation Component
 * 
 * Main navigation sidebar with role-based menu items.
 * Shows different navigation items for students and teachers.
 * Includes mobile-responsive menu toggle.
 * 
 * Student menu: Dashboard, Courses, Results, Assignments, Fees, Notifications, etc.
 * Teacher menu: Dashboard, My Courses, Enter Grades, Assignments, Notifications, etc.
 */

// Default student menu items
const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Courses', href: '/courses', icon: BookOpen },
  { name: 'Results', href: '/results', icon: FileText },
  { name: 'Assignments', href: '/assignments', icon: FileText },
  { name: 'Fees', href: '/fees', icon: DollarSign },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Timetable', href: '/timetable', icon: Calendar },
  { name: 'Library', href: '/library', icon: Library },
  { name: 'Forum', href: '/forum', icon: MessageSquare },
  { name: 'Lost & Found', href: '/lost-found', icon: Search },
  { name: 'Requests', href: '/requests', icon: FileQuestion },
  { name: 'Feedback', href: '/feedback', icon: Star },
  { name: 'AI Chatbot', href: '/chatbot', icon: Bot },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { role, isTeacher } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  /**
   * Get menu items based on user role
   * Returns teacher-specific menu or default student menu
   */
  const getMenuItems = () => {
    if (isTeacher) {
      // Teacher-specific menu items (no Fees, Library, Lost & Found)
      return [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'My Courses', href: '/courses', icon: BookOpen },
        { name: 'Enter Grades', href: '/results', icon: FileText },
        { name: 'Assignments', href: '/assignments', icon: FileText },
        { name: 'Notifications', href: '/notifications', icon: Bell },
        { name: 'Timetable', href: '/timetable', icon: Calendar },
        { name: 'Forum', href: '/forum', icon: MessageSquare },
        { name: 'Student Requests', href: '/requests', icon: FileQuestion },
        { name: 'Student Feedback', href: '/feedback', icon: Star },
        { name: 'AI Chatbot', href: '/chatbot', icon: Bot },
      ];
    }
    // Student menu items (default)
    return menuItems;
  };

  const filteredMenuItems = getMenuItems();

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
      >
        {isMobileOpen ? (
          <X className="w-6 h-6 text-gray-700" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 overflow-y-auto z-40
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">MCP</h1>
            <p className="text-xs text-gray-500">My Class Portal</p>
          </div>
        </div>

        <nav className="space-y-1">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive
                    ? 'bg-indigo-50 text-indigo-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      </div>
    </>
  );
}

