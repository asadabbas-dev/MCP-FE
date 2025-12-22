"use client";

import { useState } from "react";
import Card from "@/components/common/card";
import Button from "@/components/common/button";
import { Bell, Mail, Moon, Sun, Globe, Shield } from "lucide-react";
import { useToast } from "@/contexts/toast-context";
import { useAuth } from "@/contexts/auth-context";

export default function SettingsView() {
  const { isTeacher } = useAuth();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    assignmentReminders: true,
    libraryDueDateAlerts: !isTeacher, // Only for students
    examNotifications: true,
    submissionNotifications: isTeacher, // Only for teachers
    requestNotifications: isTeacher, // Only for teachers
    feedbackNotifications: isTeacher, // Only for teachers
    theme: "light",
    language: "en",
  });
  const [loading, setLoading] = useState(false);
  const { success } = useToast();

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // await api.put('/settings', settings);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      success("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const SettingItem = ({ icon: Icon, title, description, value, onChange }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Icon className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{title}</p>
          {description && (
            <p className="text-xs text-gray-500 mt-0.5">{description}</p>
          )}
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={value}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
      </label>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage your preferences and account settings
          </p>
        </div>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Notification Settings */}
      <Card>
        <div className="space-y-6">
          <div className="pb-4 border-b border-gray-200">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Bell className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  Notifications
                </h3>
                <p className="text-sm text-gray-600">
                  Choose what notifications you want to receive
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <SettingItem
              icon={Mail}
              title="Email Notifications"
              description="Receive notifications via email"
              value={settings.emailNotifications}
              onChange={() => handleToggle("emailNotifications")}
            />
            <SettingItem
              icon={Bell}
              title="Push Notifications"
              description="Receive browser push notifications"
              value={settings.pushNotifications}
              onChange={() => handleToggle("pushNotifications")}
            />
            <SettingItem
              icon={Bell}
              title="Assignment Reminders"
              description="Get reminders for upcoming assignment deadlines"
              value={settings.assignmentReminders}
              onChange={() => handleToggle("assignmentReminders")}
            />
            {!isTeacher && (
              <SettingItem
                icon={Bell}
                title="Library Due Date Alerts"
                description="Receive alerts for library book due dates"
                value={settings.libraryDueDateAlerts}
                onChange={() => handleToggle("libraryDueDateAlerts")}
              />
            )}
            {!isTeacher && (
              <SettingItem
                icon={Bell}
                title="Exam Notifications"
                description="Get notified about upcoming exams"
                value={settings.examNotifications}
                onChange={() => handleToggle("examNotifications")}
              />
            )}
            {isTeacher && (
              <SettingItem
                icon={Bell}
                title="Submission Notifications"
                description="Get notified when students submit assignments"
                value={settings.submissionNotifications}
                onChange={() => handleToggle("submissionNotifications")}
              />
            )}
            {isTeacher && (
              <SettingItem
                icon={Bell}
                title="Request Notifications"
                description="Get notified about new student requests"
                value={settings.requestNotifications}
                onChange={() => handleToggle("requestNotifications")}
              />
            )}
            {isTeacher && (
              <SettingItem
                icon={Bell}
                title="Feedback Notifications"
                description="Get notified when students submit feedback"
                value={settings.feedbackNotifications}
                onChange={() => handleToggle("feedbackNotifications")}
              />
            )}
          </div>
        </div>
      </Card>

      {/* Appearance Settings */}
      <Card>
        <div className="space-y-6">
          <div className="pb-4 border-b border-gray-200">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Sun className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  Appearance
                </h3>
                <p className="text-sm text-gray-600">
                  Customize the look and feel of the application
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme
              </label>
              <div className="flex space-x-3">
                <button
                  onClick={() =>
                    setSettings((prev) => ({ ...prev, theme: "light" }))
                  }
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                    settings.theme === "light"
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Sun className="w-4 h-4" />
                  <span className="text-sm font-medium">Light</span>
                </button>
                <button
                  onClick={() =>
                    setSettings((prev) => ({ ...prev, theme: "dark" }))
                  }
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                    settings.theme === "dark"
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Moon className="w-4 h-4" />
                  <span className="text-sm font-medium">Dark</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Privacy & Security */}
      <Card>
        <div className="space-y-6">
          <div className="pb-4 border-b border-gray-200">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Shield className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  Privacy & Security
                </h3>
                <p className="text-sm text-gray-600">
                  Manage your privacy and security preferences
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-700">
              Your data is encrypted and secure. For password changes, please
              visit your{" "}
              <a
                href="/profile"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Profile page
              </a>
              .
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
