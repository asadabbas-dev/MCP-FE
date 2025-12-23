"use client";

import { useState } from "react";
import Card from "@/components/common/card";
import Modal from "@/components/common/modal";
import { BookOpen, Users, User, Calendar, Clock } from "lucide-react";
import EmptyState from "@/components/common/empty-state";

/**
 * Teacher Courses View Component
 *
 * Displays assigned courses for teachers with enrolled student information.
 *
 * Features:
 * - View all assigned courses
 * - See enrolled student count per course
 * - View detailed student list for each course
 * - Student information (name, roll number, email)
 * - Course details (code, name, credit hours, semester)
 *
 * Used when user role is "teacher" in the courses page.
 */

export default function TeacherCoursesView() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const assignedCourses = [
    {
      id: 1,
      code: "CS201",
      name: "Data Structures",
      creditHours: 3,
      semester: "Fall 2024",
      enrolledStudents: 45,
      students: [
        {
          id: 1,
          name: "Ali Ahmed",
          rollNumber: "2021-CS-001",
          email: "ali@example.com",
        },
        {
          id: 2,
          name: "Sara Khan",
          rollNumber: "2021-CS-002",
          email: "sara@example.com",
        },
        {
          id: 3,
          name: "Ahmed Hassan",
          rollNumber: "2021-CS-003",
          email: "ahmed@example.com",
        },
        {
          id: 4,
          name: "Fatima Ali",
          rollNumber: "2021-CS-004",
          email: "fatima@example.com",
        },
        {
          id: 5,
          name: "Muhammad Usman",
          rollNumber: "2021-CS-005",
          email: "usman@example.com",
        },
      ],
    },
    {
      id: 2,
      code: "CS301",
      name: "Database Systems",
      creditHours: 3,
      semester: "Fall 2024",
      enrolledStudents: 38,
      students: [
        {
          id: 1,
          name: "Ali Ahmed",
          rollNumber: "2021-CS-001",
          email: "ali@example.com",
        },
        {
          id: 2,
          name: "Sara Khan",
          rollNumber: "2021-CS-002",
          email: "sara@example.com",
        },
        {
          id: 3,
          name: "Ahmed Hassan",
          rollNumber: "2021-CS-003",
          email: "ahmed@example.com",
        },
      ],
    },
    {
      id: 3,
      code: "CS401",
      name: "Software Engineering",
      creditHours: 3,
      semester: "Fall 2024",
      enrolledStudents: 42,
      students: [
        {
          id: 1,
          name: "Ali Ahmed",
          rollNumber: "2021-CS-001",
          email: "ali@example.com",
        },
        {
          id: 2,
          name: "Sara Khan",
          rollNumber: "2021-CS-002",
          email: "sara@example.com",
        },
      ],
    },
  ];

  const handleViewDetails = (course) => {
    setSelectedCourse(course);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header Section with proper spacing */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2">
          My Courses
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          View your assigned courses and enrolled students
        </p>
      </div>

      {assignedCourses.length === 0 ? (
        <Card>
          <EmptyState
            icon={BookOpen}
            title="No assigned courses"
            description="You don't have any assigned courses at the moment."
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {assignedCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2 sm:space-x-3 min-w-0 flex-1">
                    <div className="p-1.5 sm:p-2 bg-indigo-100 rounded-lg flex-shrink-0">
                      <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                        {course.code}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 break-words">
                        {course.name}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-3 sm:pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-gray-500">Credit Hours:</span>
                    <span className="font-medium text-gray-900">
                      {course.creditHours}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-gray-500">Semester:</span>
                    <span className="font-medium text-gray-900 break-words">
                      {course.semester}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-gray-500 flex items-center">
                      <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                      Enrolled:
                    </span>
                    <span className="font-medium text-indigo-600">
                      {course.enrolledStudents} students
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleViewDetails(course)}
                  className="w-full px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-xs sm:text-sm font-medium"
                >
                  View Students
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Course Details Modal with Students List */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedCourse(null);
        }}
        title={
          selectedCourse
            ? `${selectedCourse.code} - ${selectedCourse.name}`
            : "Course Details"
        }
        size="lg"
      >
        {selectedCourse && (
          <div className="space-y-6">
            {/* Course Info */}
            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Credit Hours
                  </p>
                  <p className="text-base sm:text-lg font-semibold text-gray-900">
                    {selectedCourse.creditHours}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Semester
                  </p>
                  <p className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                    {selectedCourse.semester}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Total Enrolled Students
                  </p>
                  <p className="text-base sm:text-lg font-semibold text-indigo-600">
                    {selectedCourse.enrolledStudents} students
                  </p>
                </div>
              </div>
            </div>

            {/* Students List */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-indigo-600 flex-shrink-0" />
                Enrolled Students
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {selectedCourse.students.length === 0 ? (
                  <p className="text-xs sm:text-sm text-gray-500 text-center py-4">
                    No students enrolled yet
                  </p>
                ) : (
                  selectedCourse.students.map((student) => (
                    <Card key={student.id} className="p-3 sm:p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm sm:text-base font-medium text-gray-900 break-words">
                              {student.name}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500 break-all">
                              {student.rollNumber}
                            </p>
                            <p className="text-xs text-gray-400 break-all">
                              {student.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
