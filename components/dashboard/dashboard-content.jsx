"use client";

import { useState } from "react";
import Card from "@/components/common/card";
import { useAuth } from "@/contexts/auth-context";
import {
  BookOpen,
  FileText,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  GraduationCap,
  Users,
  MessageSquare,
  FileQuestion,
} from "lucide-react";

/**
 * Dashboard Content Component
 *
 * Main dashboard view that displays different content based on user role.
 *
 * Student View:
 * - Academic summary (GPA, CGPA, degree progress)
 * - Today's timetable
 * - Quick stats (courses, assignments, exams, library)
 *
 * Teacher View:
 * - Teaching summary (total students, average rating)
 * - Quick stats (assigned courses, pending submissions, etc.)
 *
 * Both views include recent notifications widget.
 */

export default function DashboardContent() {
  const { isTeacher, user } = useAuth();

  // Teacher-specific statistics
  const teacherStats = {
    assignedCourses: 3,
    pendingSubmissions: 12,
    ungradedSubmissions: 8,
    pendingRequests: 5,
  };

  // Student-specific statistics
  const studentStats = {
    enrolledCourses: 5,
    pendingAssignments: 3,
    upcomingExams: 2,
    libraryBooks: 2,
  };

  const [stats] = useState(isTeacher ? teacherStats : studentStats);

  const [academicInfo] = useState({
    currentGPA: 3.75,
    overallCGPA: 3.68,
    currentSemester: "Fall 2024",
    degreeProgress: 65,
  });

  const timetable = [
    { time: "09:00 - 10:30", course: "Data Structures", room: "A-101" },
    { time: "11:00 - 12:30", course: "Database Systems", room: "B-205" },
    { time: "02:00 - 03:30", course: "Web Development", room: "C-301" },
  ];

  const recentNotifications = [
    { title: "Assignment Due Tomorrow", type: "alert", time: "2 hours ago" },
    {
      title: "New Course Material Available",
      type: "info",
      time: "5 hours ago",
    },
    { title: "Library Book Due Soon", type: "warning", time: "1 day ago" },
  ];

  const profileInfo = isTeacher
    ? {
        name:
          user?.firstName && user?.lastName
            ? `${user.firstName} ${user.lastName}`
            : "Dr. John Smith",
        designation: "Associate Professor",
        department: "Computer Science",
        profileImage: null,
      }
    : {
        name: "John Doe",
        rollNumber: "CS-2021-001",
        currentSemester: "Fall 2024",
        profileImage: null,
      };

  return (
    <div className="space-y-6">
      {/* Profile Section */}
      <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30">
            {profileInfo.profileImage ? (
              <img
                src={profileInfo.profileImage}
                alt={profileInfo.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-white" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{profileInfo.name}</h2>
            <div className="flex items-center space-x-4 mt-1 text-indigo-100">
              {isTeacher ? (
                <>
                  <div className="flex items-center space-x-1">
                    <GraduationCap className="w-4 h-4" />
                    <span className="text-sm">{profileInfo.designation}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-sm">{profileInfo.department}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-1">
                    <GraduationCap className="w-4 h-4" />
                    <span className="text-sm">
                      Roll No: {profileInfo.rollNumber}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-sm">
                      {profileInfo.currentSemester}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
        <p className="text-gray-600 mt-1">
          {isTeacher
            ? "Here's an overview of your teaching activities today."
            : "Here's what's happening with your academics today."}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isTeacher ? (
          <>
            <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm">Assigned Courses</p>
                  <p className="text-3xl font-bold mt-1">
                    {stats.assignedCourses}
                  </p>
                </div>
                <BookOpen className="w-12 h-12 text-indigo-200" />
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm">Pending Submissions</p>
                  <p className="text-3xl font-bold mt-1">
                    {stats.pendingSubmissions}
                  </p>
                </div>
                <FileText className="w-12 h-12 text-yellow-200" />
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">Ungraded Submissions</p>
                  <p className="text-3xl font-bold mt-1">
                    {stats.ungradedSubmissions}
                  </p>
                </div>
                <Clock className="w-12 h-12 text-red-200" />
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Pending Requests</p>
                  <p className="text-3xl font-bold mt-1">
                    {stats.pendingRequests}
                  </p>
                </div>
                <FileQuestion className="w-12 h-12 text-green-200" />
              </div>
            </Card>
          </>
        ) : (
          <>
            <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm">Enrolled Courses</p>
                  <p className="text-3xl font-bold mt-1">
                    {stats.enrolledCourses}
                  </p>
                </div>
                <BookOpen className="w-12 h-12 text-indigo-200" />
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm">Pending Assignments</p>
                  <p className="text-3xl font-bold mt-1">
                    {stats.pendingAssignments}
                  </p>
                </div>
                <FileText className="w-12 h-12 text-yellow-200" />
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">Upcoming Exams</p>
                  <p className="text-3xl font-bold mt-1">
                    {stats.upcomingExams}
                  </p>
                </div>
                <Calendar className="w-12 h-12 text-red-200" />
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Library Books</p>
                  <p className="text-3xl font-bold mt-1">
                    {stats.libraryBooks}
                  </p>
                </div>
                <BookOpen className="w-12 h-12 text-green-200" />
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Academic Summary / Teaching Summary */}
        <div className="lg:col-span-2 space-y-6">
          {isTeacher ? (
            <Card title="Teaching Summary">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Total Students</p>
                    <p className="text-lg font-semibold text-gray-900">125</p>
                  </div>
                  <Users className="w-8 h-8 text-indigo-600" />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Average Rating</p>
                    <p className="text-2xl font-bold text-indigo-600">4.8/5</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
              </div>
            </Card>
          ) : (
            <>
              <Card title="Academic Summary">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Current Semester</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {academicInfo.currentSemester}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Current GPA</p>
                      <p className="text-lg font-semibold text-indigo-600">
                        {academicInfo.currentGPA}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Overall CGPA</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {academicInfo.overallCGPA}
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-500" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-700">
                        Degree Progress
                      </p>
                      <p className="text-sm text-gray-600">
                        {academicInfo.degreeProgress}%
                      </p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-indigo-600 h-3 rounded-full"
                        style={{ width: `${academicInfo.degreeProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card title="Today's Timetable">
                <div className="space-y-3">
                  {timetable.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.course}
                          </p>
                          <p className="text-sm text-gray-600">
                            {item.time} • {item.room}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}
        </div>

        {/* Notifications */}
        <Card title="Recent Notifications">
          <div className="space-y-3">
            {recentNotifications.map((notification, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  {notification.type === "alert" && (
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  )}
                  {notification.type === "info" && (
                    <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                  )}
                  {notification.type === "warning" && (
                    <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <button className="w-full text-sm text-indigo-600 hover:text-indigo-700 font-medium mt-2">
              View All Notifications
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
