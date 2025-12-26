"use client";

import { useState, useEffect } from "react";
import Card from "@/components/common/card";
import Modal from "@/components/common/modal";
import { BookOpen, Users, User, Calendar, Clock } from "lucide-react";
import EmptyState from "@/components/common/empty-state";
import { api } from "@/lib/utils/api";
import { useToast } from "@/contexts/toast-context";
import Loading from "@/components/common/loading";
import Select from "@/components/common/select";
import Input from "@/components/common/input";
import Button from "@/components/common/button";

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
  const { error: showError } = useToast();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  
  // Filters
  const [semesterFilter, setSemesterFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [availableSemesters, setAvailableSemesters] = useState([]);
  const [availableSections, setAvailableSections] = useState([]);

  /**
   * Fetch teacher's assigned courses with student count
   */
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await api.get("/courses/teacher/my-courses");
      const coursesList = Array.isArray(response) ? response : response?.data || [];
      setAssignedCourses(coursesList);
      
      // Extract unique semesters for filter
      const semesters = [...new Set(coursesList.map(c => c.semester).filter(Boolean))];
      setAvailableSemesters([
        { value: "all", label: "All Semesters" },
        ...semesters.map(s => ({ value: s, label: s }))
      ]);
      
      // Extract unique sections from all courses
      const allSections = new Set();
      for (const course of coursesList) {
        try {
          const courseDetails = await api.get(`/courses/${course.id}`);
          const enrollments = courseDetails?.enrollments || [];
          enrollments.forEach(e => {
            if (e.section) allSections.add(e.section);
          });
        } catch (err) {
          // Continue if course details fetch fails
        }
      }
      setAvailableSections([
        { value: "all", label: "All Sections" },
        ...Array.from(allSections).map(s => ({ value: s, label: `Section ${s}` }))
      ]);
    } catch (err) {
      console.error("Error fetching courses:", err);
      showError(err.message || "Failed to load courses");
      setAssignedCourses([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch enrolled students for a specific course
   */
  const fetchCourseStudents = async (courseId) => {
    setLoadingStudents(true);
    try {
      const response = await api.get(`/courses/${courseId}`);
      const enrollments = response?.enrollments || [];
      // Transform enrollments to student list
      const students = enrollments.map((enrollment) => ({
        id: enrollment.student?.id || enrollment.studentId,
        name: enrollment.student?.user?.fullName || "Unknown",
        rollNumber: enrollment.student?.rollNumber || "N/A",
        email: enrollment.student?.user?.email || "N/A",
      }));
      return students;
    } catch (err) {
      console.error("Error fetching course students:", err);
      showError(err.message || "Failed to load students");
      return [];
    } finally {
      setLoadingStudents(false);
    }
  };

  /**
   * Handle viewing course details with enrolled students
   */
  const handleViewDetails = async (course) => {
    setSelectedCourse(course);
    setIsDetailsModalOpen(true);
    
    // Fetch students if not already loaded
    if (!course.students) {
      const students = await fetchCourseStudents(course.id);
      setSelectedCourse({ ...course, students });
    }
  };

  /**
   * Filter courses based on selected filters
   */
  const filteredCourses = assignedCourses.filter((course) => {
    // Filter by semester
    if (semesterFilter !== "all" && course.semester !== semesterFilter) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesCode = course.code?.toLowerCase().includes(query);
      const matchesName = course.name?.toLowerCase().includes(query);
      if (!matchesCode && !matchesName) {
        return false;
      }
    }
    
    return true;
  });

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

      {loading ? (
        <Card>
          <div className="text-center py-8">
            <Loading size="md" />
            <p className="text-gray-600 mt-3">Loading courses...</p>
          </div>
        </Card>
      ) : filteredCourses.length === 0 ? (
            <Card>
              <EmptyState
                icon={BookOpen}
                title="No courses found"
                description={
                  assignedCourses.length === 0
                    ? "You don't have any assigned courses at the moment."
                    : "No courses match your filters. Try adjusting your search criteria."
                }
              />
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredCourses.map((course) => (
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
                      {course.studentCount || 0} students
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
                    {selectedCourse.studentCount || selectedCourse.enrolledStudents || 0} students
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
                {loadingStudents ? (
                  <div className="text-center py-8">
                    <Loading size="sm" />
                    <p className="text-xs sm:text-sm text-gray-500 mt-2">Loading students...</p>
                  </div>
                ) : !selectedCourse.students || selectedCourse.students.length === 0 ? (
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
