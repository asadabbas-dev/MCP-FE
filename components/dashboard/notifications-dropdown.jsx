"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bell, AlertCircle, Info, Check, Trash2, CheckCheck } from "lucide-react";

/**
 * Notifications Dropdown Component
 * 
 * Header dropdown for quick notification access.
 * 
 * Features:
 * - Bell icon with unread count badge
 * - Dropdown list of recent notifications
 * - Mark individual notifications as read
 * - Delete notifications
 * - Mark all as read
 * - Notification type icons (alert, warning, info)
 * - Link to full notifications page
 * - Click outside to close
 * 
 * Displays in the header for quick access without navigating away.
 */

export default function NotificationsDropdown() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Mock notifications data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "alert",
      title: "Assignment Due Tomorrow",
      message: "Data Structures Project is due on December 25, 2024",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      type: "info",
      title: "New Course Material Available",
      message: "Lecture slides for Week 12 have been uploaded",
      time: "5 hours ago",
      read: false,
    },
    {
      id: 3,
      type: "warning",
      title: "Library Book Due Soon",
      message: 'Your book "Introduction to Algorithms" is due in 2 days',
      time: "1 day ago",
      read: true,
    },
    {
      id: 4,
      type: "info",
      title: "Exam Schedule Released",
      message: "Final exam schedule for Fall 2024 has been published",
      time: "2 days ago",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
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

  const getIcon = (type) => {
    switch (type) {
      case "alert":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[calc(100vw-1rem)] sm:w-80 md:w-96 max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-[calc(100vh-5rem)] sm:max-h-96 overflow-hidden flex flex-col">
          <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center space-x-1 flex-shrink-0"
              >
                <CheckCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">Mark all as read</span>
                <span className="sm:hidden">All</span>
              </button>
            )}
          </div>

          <div className="overflow-y-auto flex-1 min-h-0">
            {notifications.length === 0 ? (
              <div className="p-6 sm:p-8 text-center">
                <Bell className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-xs sm:text-sm text-gray-500">No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 sm:p-4 hover:bg-gray-50 transition-colors ${
                      !notification.read ? "bg-indigo-50/50" : ""
                    }`}
                  >
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-0">
                          <p
                            className={`text-xs sm:text-sm font-medium break-words ${
                              !notification.read
                                ? "text-gray-900"
                                : "text-gray-700"
                            }`}
                          >
                            {notification.title}
                          </p>
                          <span className="text-xs text-gray-500 sm:ml-2 whitespace-nowrap flex-shrink-0">
                            {notification.time}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1 break-words">
                          {notification.message}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-x-2 gap-y-1 mt-2">
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
                          >
                            <Check className="w-3 h-3 flex-shrink-0" />
                            <span className="whitespace-nowrap">Mark as read</span>
                          </button>
                          <button
                            onClick={() => handleDelete(notification.id)}
                            className="text-xs text-red-600 hover:text-red-700 flex items-center space-x-1"
                          >
                            <Trash2 className="w-3 h-3 flex-shrink-0" />
                            <span className="whitespace-nowrap">Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="px-3 sm:px-4 py-2 sm:py-3 border-t border-gray-200 flex-shrink-0">
              <Link
                href="/notifications"
                onClick={() => setIsOpen(false)}
                className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-700 font-medium text-center block"
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

