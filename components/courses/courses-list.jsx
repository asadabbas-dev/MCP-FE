"use client";

import { useState } from "react";
import Card from "@/components/common/card";
import Button from "@/components/common/button";
import Modal from "@/components/common/modal";
import EnrollCourseForm from "@/components/courses/enroll-course-form";
import TeacherCoursesView from "@/components/courses/teacher-courses-view";
import { BookOpen, Clock, User, Plus, Calendar } from "lucide-react";
import EmptyState from "@/components/common/empty-state";
import { useToast } from "@/contexts/toast-context";
import { useAuth } from "@/contexts/auth-context";

/**
 * Courses List Component (Student View)
 * 
 * Displays courses for students with enrollment functionality.
 * Shows enrolled courses and upcoming courses in separate tabs.
 * 
 * Features:
 * - View enrolled courses with details
 * - View upcoming courses
 * - Enroll in new courses
 * - View course details (instructor, schedule, syllabus)
 * - Empty states for both tabs
 * 
 * Note: If user is a teacher, renders TeacherCoursesView instead.
 */

export default function CoursesList() {
  const { isTeacher } = useAuth();
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("enrolled"); // Tab: "enrolled" | "upcoming"
  const { success, error } = useToast();

  // Show teacher view if user is a teacher
  if (isTeacher) {
    return <TeacherCoursesView />;
  }

  /**
   * Handle course enrollment submission
   * Enrolls student in selected course with semester and section
   */
  const handleEnrollSubmit = async (data) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // await api.post('/courses/enroll', data);
      console.log("Enrollment data:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Close modal on success
      setIsEnrollModalOpen(false);
      success("Successfully enrolled in course!");
    } catch (err) {
      console.error("Enrollment error:", err);
      error("Failed to enroll in course. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const courses = [
    {
      id: 1,
      code: "CS101",
      name: "Introduction to Computer Science",
      creditHours: 3,
      instructor: "Dr. Ahmed Ali",
      semester: "Fall 2024",
      status: "enrolled",
    },
    {
      id: 2,
      code: "CS201",
      name: "Data Structures",
      creditHours: 3,
      instructor: "Dr. Sara Khan",
      semester: "Fall 2024",
      status: "enrolled",
    },
    {
      id: 3,
      code: "CS301",
      name: "Database Systems",
      creditHours: 3,
      instructor: "Dr. Muhammad Hassan",
      semester: "Fall 2024",
      status: "enrolled",
    },
  ];

  const upcomingCourses = [
    {
      id: 4,
      code: "CS401",
      name: "Web Development",
      creditHours: 3,
      instructor: "Dr. Ahmed Ali",
      semester: "Spring 2025",
      status: "upcoming",
    },
    {
      id: 5,
      code: "CS501",
      name: "Machine Learning",
      creditHours: 3,
      instructor: "Dr. Sara Khan",
      semester: "Spring 2025",
      status: "upcoming",
    },
  ];

  const displayCourses = activeTab === "enrolled" ? courses : upcomingCourses;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600 mt-1">
            View and manage your enrolled courses
          </p>
        </div>
        {activeTab === "enrolled" && (
          <Button
            startIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsEnrollModalOpen(true)}
          >
            Enroll in Course
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("enrolled")}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "enrolled"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <BookOpen className="w-4 h-4 inline mr-2" />
          Enrolled Courses
        </button>
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "upcoming"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Calendar className="w-4 h-4 inline mr-2" />
          Upcoming Courses
        </button>
      </div>

      <Modal
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
        title="Enroll in Course"
      >
        <EnrollCourseForm
          onSubmit={handleEnrollSubmit}
          onCancel={() => setIsEnrollModalOpen(false)}
          loading={loading}
        />
      </Modal>

      {/* View Details Modal */}
      <Modal
        isOpen={isViewDetailsModalOpen}
        onClose={() => {
          setIsViewDetailsModalOpen(false);
          setSelectedCourse(null);
        }}
        title="Course Details"
        size="lg"
      >
        {selectedCourse && (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="pb-4 border-b border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <BookOpen className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {selectedCourse.code}
                    </h3>
                    <p className="text-base text-gray-700">
                      {selectedCourse.name}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1.5 bg-green-100 text-green-800 text-xs font-semibold rounded-md">
                  {selectedCourse.status}
                </span>
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Instructor
                  </p>
                </div>
                <p className="text-base font-semibold text-gray-900">
                  {selectedCourse.instructor}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Credit Hours
                  </p>
                </div>
                <p className="text-base font-semibold text-gray-900">
                  {selectedCourse.creditHours}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 col-span-2">
                <div className="flex items-center space-x-2 mb-2">
                  <BookOpen className="w-4 h-4 text-gray-500" />
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Semester
                  </p>
                </div>
                <p className="text-base font-semibold text-gray-900">
                  {selectedCourse.semester}
                </p>
              </div>
            </div>

            {/* Description Section */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Course Description
              </p>
              <p className="text-sm leading-relaxed text-gray-700">
                This course covers fundamental concepts and principles related
                to {selectedCourse.name.toLowerCase()}. Students will learn
                essential skills and knowledge required for advanced studies in
                this field.
              </p>
            </div>

            {/* Syllabus Section */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Course Syllabus
              </p>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-start">
                  <span className="font-medium mr-2">Week 1-2:</span>
                  <span>Introduction and Fundamentals</span>
                </div>
                <div className="flex items-start">
                  <span className="font-medium mr-2">Week 3-4:</span>
                  <span>Core Concepts and Theory</span>
                </div>
                <div className="flex items-start">
                  <span className="font-medium mr-2">Week 5-6:</span>
                  <span>Practical Applications</span>
                </div>
                <div className="flex items-start">
                  <span className="font-medium mr-2">Week 7-8:</span>
                  <span>Mid-term Examination</span>
                </div>
                <div className="flex items-start">
                  <span className="font-medium mr-2">Week 9-12:</span>
                  <span>Advanced Topics and Projects</span>
                </div>
                <div className="flex items-start">
                  <span className="font-medium mr-2">Week 13-14:</span>
                  <span>Review and Final Preparation</span>
                </div>
                <div className="flex items-start">
                  <span className="font-medium mr-2">Week 15-16:</span>
                  <span>Final Examination</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayCourses.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <EmptyState
                icon={BookOpen}
                title={
                  activeTab === "enrolled"
                    ? "No courses enrolled"
                    : "No upcoming courses"
                }
                description={
                  activeTab === "enrolled"
                    ? "You haven't enrolled in any courses yet. Start by enrolling in a course."
                    : "No upcoming courses available at the moment."
                }
                action={
                  activeTab === "enrolled"
                    ? () => setIsEnrollModalOpen(true)
                    : undefined
                }
                actionLabel={
                  activeTab === "enrolled" ? "Enroll in Course" : undefined
                }
              />
            </Card>
          </div>
        ) : (
          displayCourses.map((course) => (
          <Card key={course.id} className="hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {course.code}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{course.name}</p>
              </div>
              <BookOpen className="w-8 h-8 text-indigo-600" />
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <User className="w-4 h-4 mr-2" />
                {course.instructor}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                {course.creditHours} Credit Hours
              </div>
              <div className="text-sm text-gray-600">{course.semester}</div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <span
                className={`px-3 py-1 text-xs font-medium rounded-md ${
                  course.status === "enrolled"
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {course.status}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCourse(course);
                  setIsViewDetailsModalOpen(true);
                }}
              >
                View Details
              </Button>
            </div>
          </Card>
          ))
        )}
      </div>
    </div>
  );
}
