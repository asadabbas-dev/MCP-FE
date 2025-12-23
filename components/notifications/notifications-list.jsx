"use client";

import { useState } from "react";
import Card from "@/components/common/card";
import Button from "@/components/common/button";
import Modal from "@/components/common/modal";
import CreateNotificationForm from "@/components/notifications/create-notification-form";
import EmptyState from "@/components/common/empty-state";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/contexts/toast-context";
import {
  Bell,
  AlertCircle,
  Info,
  Check,
  Trash2,
  CheckCheck,
  Plus,
} from "lucide-react";

/**
 * Notifications List Component
 *
 * Displays notifications with role-based functionality:
 *
 * Student View:
 * - View all notifications
 * - Mark as read/delete individual notifications
 * - Mark all as read
 * - Filter by read/unread status
 *
 * Teacher View:
 * - All student features plus:
 * - Create new notifications
 * - Select target audience (All/Students/Teachers)
 * - Link notifications to courses
 *
 * Features:
 * - Notification types (Announcement, Alert, Event)
 * - Time display at top right
 * - Action icons at bottom right
 * - Empty states
 */

export default function NotificationsList() {
  const { isTeacher } = useAuth();
  const { success, error } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "alert",
      title: "Assignment Due Tomorrow",
      message: "Data Structures Project is due on December 25, 2024",
      time: "2 hours ago",
      course: "CS201 - Data Structures",
    },
    {
      id: 2,
      type: "info",
      title: "New Course Material Available",
      message: "Lecture slides for Week 12 have been uploaded",
      time: "5 hours ago",
      course: "CS301 - Database Systems",
    },
    {
      id: 3,
      type: "warning",
      title: "Library Book Due Soon",
      message: 'Your book "Introduction to Algorithms" is due in 2 days',
      time: "1 day ago",
      course: null,
    },
    {
      id: 4,
      type: "info",
      title: "Exam Schedule Released",
      message: "Final exam schedule for Fall 2024 has been published",
      time: "2 days ago",
      course: null,
      read: false,
    },
  ]);

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const getIcon = (type) => {
    switch (type) {
      case "alert":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleCreateNotification = async (data) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // await api.post('/notifications', data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Add new notification to list
      const newNotification = {
        id: notifications.length + 1,
        type: data.type,
        title: data.title,
        message: data.message,
        time: "Just now",
        course: data.courseId
          ? courses.find((c) => c.id.toString() === data.courseId)?.name
          : null,
        read: false,
      };

      setNotifications([newNotification, ...notifications]);
      setIsCreateModalOpen(false);
      success("Notification created successfully!");
    } catch (err) {
      console.error("Error creating notification:", err);
      error("Failed to create notification. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Mock courses for teacher
  const courses = [
    { id: 1, code: "CS201", name: "Data Structures" },
    { id: 2, code: "CS301", name: "Database Systems" },
    { id: 3, code: "CS401", name: "Software Engineering" },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header Section with proper spacing */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2">
            {isTeacher ? "Manage Notifications" : "Notifications"}
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {isTeacher
              ? "Create and manage notifications for students"
              : "Stay updated with important announcements and alerts"}
            {!isTeacher && unreadCount > 0 && (
              <span className="ml-2 text-indigo-600 font-medium">
                ({unreadCount} unread)
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center flex-wrap gap-2">
          {isTeacher ? (
            <Button
              startIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsCreateModalOpen(true)}
              size="md"
              className="w-full sm:w-auto whitespace-nowrap"
            >
              Create Notification
            </Button>
          ) : (
            unreadCount > 0 && (
              <Button
                variant="outline"
                size="md"
                startIcon={<CheckCheck className="w-4 h-4" />}
                onClick={handleMarkAllAsRead}
                className="w-full sm:w-auto whitespace-nowrap"
              >
                Mark All as Read
              </Button>
            )
          )}
        </div>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card>
            <EmptyState
              icon={Bell}
              title="No notifications"
              description="You're all caught up! No new notifications."
            />
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`relative ${notification.read ? "opacity-75" : ""}`}
            >
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 pb-12 sm:pb-4">
                <div className="shrink-0 mt-1">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0 w-full sm:w-auto">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 flex-wrap">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-indigo-600 rounded-full shrink-0"></span>
                        )}
                      </div>
                      {notification.course && (
                        <p className="text-xs sm:text-sm text-indigo-600 mt-1 break-words">
                          {notification.course}
                        </p>
                      )}
                    </div>
                    {/* Time at top right */}
                    <span className="text-xs text-gray-500 shrink-0 sm:ml-2">
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 break-words pr-0 sm:pr-16">
                    {notification.message}
                  </p>
                </div>

                {/* Action Icons at bottom right */}
                <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 flex items-center space-x-1 shrink-0">
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="p-1.5 sm:p-2 text-indigo-600 bg-indigo-50 rounded-lg transition-colors hover:bg-indigo-100"
                      title="Mark as Read"
                      aria-label="Mark as Read"
                    >
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notification.id)}
                    className="p-1.5 sm:p-2 text-red-600 bg-red-50 rounded-lg transition-colors hover:bg-red-100"
                    title="Delete"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create Notification Modal (Teacher Only) */}
      {isTeacher && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create Notification"
          size="lg"
        >
          <CreateNotificationForm
            onSubmit={handleCreateNotification}
            onCancel={() => setIsCreateModalOpen(false)}
            loading={loading}
            courses={courses}
          />
        </Modal>
      )}
    </div>
  );
}
