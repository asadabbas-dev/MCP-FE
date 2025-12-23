"use client";

import { useState } from "react";
import Card from "@/components/common/card";
import { MessageSquare, Star, User, Calendar, Filter } from "lucide-react";
import EmptyState from "@/components/common/empty-state";
import Select from "@/components/common/select";

export default function TeacherFeedbackView() {
  const [filter, setFilter] = useState("all"); // "all", "teacher", "course", "system"

  const feedbacks = [
    {
      id: 1,
      targetType: "Teacher",
      targetName: "You",
      studentName: "Ali Ahmed",
      studentRollNumber: "2021-CS-001",
      rating: 5,
      comment:
        "Excellent teaching methodology. Very clear explanations and helpful during office hours.",
      createdAt: "2024-12-10",
    },
    {
      id: 2,
      targetType: "Course",
      targetName: "CS201 - Data Structures",
      studentName: "Sara Khan",
      studentRollNumber: "2021-CS-002",
      rating: 4,
      comment:
        "Great course content, but assignments could be more challenging.",
      createdAt: "2024-12-08",
    },
    {
      id: 3,
      targetType: "Teacher",
      targetName: "You",
      studentName: "Ahmed Hassan",
      studentRollNumber: "2021-CS-003",
      rating: 5,
      comment:
        "Best teacher! Always available to help and provides detailed feedback.",
      createdAt: "2024-12-05",
    },
    {
      id: 4,
      targetType: "Course",
      targetName: "CS301 - Database Systems",
      studentName: "Fatima Ali",
      studentRollNumber: "2021-CS-004",
      rating: 3,
      comment: "Course is good but needs more practical examples.",
      createdAt: "2024-12-01",
    },
    {
      id: 5,
      targetType: "System",
      targetName: "MCP Portal",
      studentName: "Muhammad Usman",
      studentRollNumber: "2021-CS-005",
      rating: 5,
      comment: "The portal is very user-friendly and efficient.",
      createdAt: "2024-11-28",
    },
  ];

  const filteredFeedbacks =
    filter === "all"
      ? feedbacks
      : feedbacks.filter((fb) => fb.targetType.toLowerCase() === filter);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const getAverageRating = () => {
    const teacherFeedbacks = feedbacks.filter(
      (fb) => fb.targetType === "Teacher"
    );
    if (teacherFeedbacks.length === 0) return 0;
    const sum = teacherFeedbacks.reduce((acc, fb) => acc + fb.rating, 0);
    return (sum / teacherFeedbacks.length).toFixed(1);
  };

  const teacherFeedbacksCount = feedbacks.filter(
    (fb) => fb.targetType === "Teacher"
  ).length;

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header Section with proper spacing */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2">
          Student Feedback
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          View feedback submitted by students about you, your courses, and the
          system
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-indigo-100 text-xs sm:text-sm">
                Total Feedback
              </p>
              <p className="text-2xl sm:text-3xl font-bold mt-1">
                {feedbacks.length}
              </p>
            </div>
            <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-indigo-200 flex-shrink-0 ml-2" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-yellow-100 text-xs sm:text-sm">
                Average Rating
              </p>
              <p className="text-2xl sm:text-3xl font-bold mt-1">
                {getAverageRating()}/5
              </p>
            </div>
            <Star className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-yellow-200 fill-current flex-shrink-0 ml-2" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-green-100 text-xs sm:text-sm">
                Teacher Feedback
              </p>
              <p className="text-2xl sm:text-3xl font-bold mt-1">
                {teacherFeedbacksCount}
              </p>
            </div>
            <User className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-green-200 flex-shrink-0 ml-2" />
          </div>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center">
        <div className="w-full sm:w-48">
          <Select
            name="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            options={[
              { value: "all", label: "All Feedback" },
              { value: "teacher", label: "Teacher Feedback" },
              { value: "course", label: "Course Feedback" },
              { value: "system", label: "System Feedback" },
            ]}
          />
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredFeedbacks.length === 0 ? (
          <Card>
            <EmptyState
              icon={MessageSquare}
              title="No feedback found"
              description={`No ${
                filter === "all" ? "" : filter + " "
              }feedback at the moment.`}
            />
          </Card>
        ) : (
          filteredFeedbacks.map((feedback) => (
            <Card key={feedback.id}>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0">
                  <div className="flex items-start space-x-2 sm:space-x-3 min-w-0 flex-1">
                    <div className="p-1.5 sm:p-2 bg-indigo-100 rounded-lg flex-shrink-0">
                      <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          {feedback.targetType}
                        </span>
                        <span className="text-gray-400 hidden sm:inline">
                          •
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-gray-900 break-words">
                          {feedback.targetName}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 mb-2 flex-wrap">
                        {getRatingStars(feedback.rating)}
                        <span className="text-xs sm:text-sm text-gray-600 ml-1 sm:ml-2">
                          ({feedback.rating}/5)
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-gray-600">
                        <div className="flex items-center">
                          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                          <span className="break-words">
                            {feedback.studentName}
                          </span>
                        </div>
                        <span className="text-gray-400 hidden sm:inline">
                          •
                        </span>
                        <span className="break-all">
                          {feedback.studentRollNumber}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 flex-shrink-0 sm:ml-2">
                    <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                    {formatDate(feedback.createdAt)}
                  </div>
                </div>

                <div className="pl-0 sm:pl-12 pt-2 sm:pt-3 border-t border-gray-200">
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed break-words">
                    {feedback.comment}
                  </p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
