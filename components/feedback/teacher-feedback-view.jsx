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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Feedback</h1>
          <p className="text-gray-600 mt-1">
            View feedback submitted by students about you, your courses, and the
            system
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm">Total Feedback</p>
              <p className="text-3xl font-bold mt-1">{feedbacks.length}</p>
            </div>
            <MessageSquare className="w-12 h-12 text-indigo-200" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Average Rating</p>
              <p className="text-3xl font-bold mt-1">{getAverageRating()}/5</p>
            </div>
            <Star className="w-12 h-12 text-yellow-200 fill-current" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Teacher Feedback</p>
              <p className="text-3xl font-bold mt-1">{teacherFeedbacksCount}</p>
            </div>
            <User className="w-12 h-12 text-green-200" />
          </div>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center space-x-2">
        <div className="w-full max-w-48">
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
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <MessageSquare className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          {feedback.targetType}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {feedback.targetName}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 mb-2">
                        {getRatingStars(feedback.rating)}
                        <span className="text-sm text-gray-600 ml-2">
                          ({feedback.rating}/5)
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span>{feedback.studentName}</span>
                        <span className="text-gray-400">•</span>
                        <span>{feedback.studentRollNumber}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(feedback.createdAt)}
                  </div>
                </div>

                <div className="pl-12 pt-2 border-t border-gray-200">
                  <p className="text-sm text-gray-700 leading-relaxed">
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
