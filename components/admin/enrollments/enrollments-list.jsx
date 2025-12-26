"use client";

import { useState, useEffect, useCallback } from "react";
import Card from "@/components/common/card";
import Button from "@/components/common/button";
import {
  BookOpen,
  Plus,
  Search,
  Trash2,
  Eye,
  X,
  MoreVertical,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Modal from "@/components/common/modal";
import { useAuth } from "@/contexts/auth-context";
import { api } from "@/lib/utils/api";
import { useToast } from "@/contexts/toast-context";
import CreateEnrollmentForm from "@/components/admin/enrollments/create-enrollment-form";
import ConfirmDialog from "@/components/common/confirm-dialog";
import Loading from "@/components/common/loading";
import Select from "@/components/common/select";
import Input from "@/components/common/input";
import { Filter as FilterIcon } from "lucide-react";

/**
 * Admin Enrollments List Component
 *
 * Main component for managing student course enrollments in the admin panel.
 * Provides full CRUD operations with server-side search and filtering.
 *
 * Features:
 * - View all enrollments with student and course details
 * - Assign students to courses (create enrollments)
 * - Remove students from courses (deactivate enrollments)
 * - Server-side search by student name, roll number, course name, or course code
 * - Filter by course, semester, section, and status (active/inactive)
 * - Navigate to student or course detail pages
 *
 * @component
 * @returns {JSX.Element} Enrollments management interface
 */
export default function EnrollmentsList() {
  // Authentication and routing hooks
  const { isAdmin } = useAuth();
  const { success, error: showError } = useToast();
  const router = useRouter();

  // Modal and dialog state management
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Data state
  const [selectedEnrollment, setSelectedEnrollment] = useState(null); // Currently selected enrollment for delete
  const [enrollments, setEnrollments] = useState([]); // List of all enrollments
  const [loading, setLoading] = useState(false); // Loading state for data fetching
  const [submitting, setSubmitting] = useState(false); // Loading state for form submissions
  const [openMenuId, setOpenMenuId] = useState(null); // ID of enrollment with open menu

  // Filter and search state
  const [searchQuery, setSearchQuery] = useState(""); // Search input value
  const [courseFilter, setCourseFilter] = useState("all"); // Selected course filter
  const [semesterFilter, setSemesterFilter] = useState("all"); // Selected semester filter
  const [sectionFilter, setSectionFilter] = useState("all"); // Selected section filter
  const [statusFilter, setStatusFilter] = useState("active"); // Active/Inactive filter

  // Filter options
  const [courses, setCourses] = useState([]); // Available courses for filter
  const [semesters, setSemesters] = useState([]); // Available semesters for filter
  const [sections, setSections] = useState([]); // Available sections for filter

  /**
   * Debounced search and filter effect
   *
   * Triggers data fetch when search query or filters change.
   * Uses 500ms debounce to avoid excessive API calls while user is typing.
   * Only runs if user is admin (safety check).
   *
   * Dependencies: searchQuery, courseFilter, semesterFilter, sectionFilter, statusFilter, isAdmin
   */
  useEffect(() => {
    if (!isAdmin) return;

    const timer = setTimeout(() => {
      fetchEnrollments();
    }, 500);

    return () => clearTimeout(timer);
  }, [
    searchQuery,
    courseFilter,
    semesterFilter,
    sectionFilter,
    statusFilter,
    isAdmin,
  ]);

  /**
   * Fetch filter options on component mount
   * Loads available courses, semesters, and sections for filter dropdowns
   */
  useEffect(() => {
    if (isAdmin) {
      fetchFilterOptions();
    }
  }, [isAdmin]);

  /**
   * Fetch filter options (courses, semesters, sections)
   *
   * @async
   * @function fetchFilterOptions
   * @returns {Promise<void>}
   */
  const fetchFilterOptions = async () => {
    try {
      // Fetch courses to get course options and extract semesters/sections
      const coursesRes = await api.get("/courses");
      const coursesList = Array.isArray(coursesRes)
        ? coursesRes
        : coursesRes?.data || [];

      // Set courses for filter dropdown
      setCourses([
        { value: "all", label: "All Courses" },
        ...coursesList.map((course) => ({
          value: course.id,
          label: `${course.code} - ${course.name}`,
        })),
      ]);

      // Extract unique semesters from courses
      const uniqueSemesters = new Set();
      coursesList.forEach((course) => {
        if (course.semester) {
          uniqueSemesters.add(course.semester);
        }
      });
      setSemesters([
        { value: "all", label: "All Semesters" },
        ...Array.from(uniqueSemesters)
          .sort()
          .map((sem) => ({ value: sem, label: sem })),
      ]);

      // Fetch enrollments to extract unique sections
      const enrollmentsRes = await api.get("/enrollments");
      const enrollmentsList = Array.isArray(enrollmentsRes)
        ? enrollmentsRes
        : enrollmentsRes?.data || [];

      // Extract unique sections from enrollments
      const allSections = new Set();
      enrollmentsList.forEach((enrollment) => {
        if (enrollment.section) {
          allSections.add(enrollment.section);
        }
      });
      setSections([
        { value: "all", label: "All Sections" },
        ...Array.from(allSections)
          .sort()
          .map((section) => ({
            value: section,
            label: `Section ${section}`,
          })),
      ]);
    } catch (err) {
      console.error("Error fetching filter options:", err);
      showError("Failed to load filter options");
    }
  };

  /**
   * Fetch enrollments from the API with server-side filtering
   *
   * Builds query parameters based on current search and filter state.
   * Handles response normalization (array or object with data property).
   *
   * @async
   * @function fetchEnrollments
   * @returns {Promise<void>}
   */
  const fetchEnrollments = useCallback(async () => {
    setLoading(true);

    try {
      // Build query parameters for server-side filtering
      const params = new URLSearchParams();

      // Add optional filters if they have values
      if (searchQuery) params.append("search", searchQuery);
      if (courseFilter !== "all") params.append("courseId", courseFilter);
      if (semesterFilter !== "all") params.append("semester", semesterFilter);
      if (sectionFilter !== "all") params.append("section", sectionFilter);
      if (statusFilter === "active") params.append("isActive", "true");
      else if (statusFilter === "inactive") params.append("isActive", "false");

      const url = `/enrollments${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      const response = await api.get(url);
      const enrollmentsList = Array.isArray(response)
        ? response
        : response?.data || [];

      setEnrollments(enrollmentsList);
    } catch (err) {
      console.error("Error fetching enrollments:", err);
      showError(err.message || "Failed to load enrollments");
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  }, [
    searchQuery,
    courseFilter,
    semesterFilter,
    sectionFilter,
    statusFilter,
    showError,
  ]);

  /**
   * Handle creating a new enrollment (assigning student to course)
   *
   * @async
   * @function handleCreateEnrollment
   * @param {Object} data - Enrollment data
   * @param {string} data.studentId - Student ID
   * @param {string} data.courseId - Course ID
   * @param {string} data.section - Section identifier
   * @returns {Promise<void>}
   */
  const handleCreateEnrollment = async (data) => {
    setSubmitting(true);
    try {
      await api.post("/enrollments/admin", data);
      success("Student assigned to course successfully!");
      setIsCreateModalOpen(false);
      fetchEnrollments(); // Refresh list
    } catch (err) {
      console.error("Error creating enrollment:", err);
      showError(err.message || "Failed to assign student to course");
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Handle removing an enrollment (deactivating)
   *
   * @async
   * @function handleDeleteEnrollment
   * @returns {Promise<void>}
   */
  const handleDeleteEnrollment = async () => {
    if (!selectedEnrollment) return;

    setSubmitting(true);
    try {
      await api.delete(`/enrollments/${selectedEnrollment.id}`);
      success("Student removed from course successfully!");
      setIsDeleteDialogOpen(false);
      setSelectedEnrollment(null);
      fetchEnrollments(); // Refresh list
    } catch (err) {
      console.error("Error removing enrollment:", err);
      showError(err.message || "Failed to remove student from course");
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Clear all filters and reset to default state
   */
  const handleClearFilters = () => {
    setSearchQuery("");
    setCourseFilter("all");
    setSemesterFilter("all");
    setSectionFilter("all");
    setStatusFilter("active");
  };

  /**
   * Toggle action menu for a specific enrollment
   */
  const toggleMenu = (enrollmentId) => {
    setOpenMenuId(openMenuId === enrollmentId ? null : enrollmentId);
  };

  /**
   * Close action menu
   */
  const closeMenu = () => {
    setOpenMenuId(null);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId && !event.target.closest(".action-menu-container")) {
        closeMenu();
      }
    };

    if (openMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [openMenuId]);

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Enrollments Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Manage student course enrollments
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          startIcon={<Plus className="w-4 h-4" />}
        >
          Assign Student to Course
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FilterIcon className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {/* Search */}
            <div className="sm:col-span-2">
              <Input
                type="text"
                label="Search"
                placeholder="Search by student, course..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                startIcon={<Search className="w-4 h-4" />}
              />
            </div>

            {/* Course Filter */}
            <Select
              label="Course"
              name="courseFilter"
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              options={courses}
            />

            {/* Semester Filter */}
            <Select
              label="Semester"
              name="semesterFilter"
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
              options={semesters}
            />

            {/* Section Filter */}
            <Select
              label="Section"
              name="sectionFilter"
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              options={sections}
            />

            {/* Status Filter */}
            <Select
              label="Status"
              name="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
                { value: "all", label: "All" },
              ]}
            />
          </div>

          {/* Clear Filters Button */}
          {(searchQuery ||
            courseFilter !== "all" ||
            semesterFilter !== "all" ||
            sectionFilter !== "all" ||
            statusFilter !== "active") && (
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                startIcon={<X className="w-4 h-4" />}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Enrollments List */}
      <Card>
        {loading ? (
          <div className="text-center py-8">
            <Loading size="md" />
            <p className="text-gray-600 mt-3">Loading enrollments...</p>
          </div>
        ) : enrollments.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No enrollments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Student
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Course
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Semester
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Section
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Enrolled Date
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {enrollments.map((enrollment) => {
                    // Safely extract data with proper null checks
                    const student = enrollment.student || {};
                    const studentUser = student.user || {};
                    const course = enrollment.course || {};
                    const courseTeacher = course.teacher || {};
                    const teacherUser = courseTeacher.user || {};

                    return (
                      <tr key={enrollment.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {studentUser.fullName || "Unknown Student"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {student.rollNumber || "N/A"}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {course.name || "Unknown Course"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {course.code || "N/A"}
                            </p>
                            {teacherUser.fullName && (
                              <p className="text-xs text-gray-400 mt-0.5">
                                Teacher: {teacherUser.fullName}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-900">
                            {course.semester || "N/A"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-900">
                            {enrollment.section || "N/A"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-900">
                            {enrollment.enrolledAt
                              ? new Date(
                                  enrollment.enrolledAt
                                ).toLocaleDateString("en-GB")
                              : "N/A"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-xs px-2 py-1 rounded-md ${
                              enrollment.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {enrollment.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="relative flex items-center justify-end action-menu-container">
                            <button
                              id={`menu-button-${enrollment.id}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleMenu(enrollment.id);
                              }}
                              className="p-1.5 rounded-md hover:bg-gray-100 transition-colors relative z-10"
                              aria-label="Actions"
                            >
                              <MoreVertical className="w-5 h-5 text-gray-600" />
                            </button>

                            {openMenuId === enrollment.id && (
                              <>
                                {/* Backdrop to close menu */}
                                <div
                                  className="fixed inset-0"
                                  style={{ zIndex: 9999 }}
                                  onClick={closeMenu}
                                />
                                {/* Dropdown menu - using fixed positioning to appear above table */}
                                <div
                                  className="fixed w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1"
                                  style={{
                                    zIndex: 10000,
                                  }}
                                  ref={(el) => {
                                    if (el) {
                                      const button = document.getElementById(
                                        `menu-button-${enrollment.id}`
                                      );
                                      if (button) {
                                        const rect =
                                          button.getBoundingClientRect();
                                        el.style.top = `${rect.bottom + 4}px`;
                                        el.style.right = `${
                                          window.innerWidth - rect.right
                                        }px`;
                                      }
                                    }
                                  }}
                                >
                                  {studentUser.id && (
                                    <button
                                      onClick={() => {
                                        router.push(
                                          `/admin/students/${studentUser.id}`
                                        );
                                        closeMenu();
                                      }}
                                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                    >
                                      <Eye className="w-4 h-4" />
                                      View Student
                                    </button>
                                  )}
                                  {course.id && (
                                    <button
                                      onClick={() => {
                                        router.push(
                                          `/admin/courses/${course.id}`
                                        );
                                        closeMenu();
                                      }}
                                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                    >
                                      <Eye className="w-4 h-4" />
                                      View Course
                                    </button>
                                  )}
                                  {enrollment.isActive && (
                                    <>
                                      <div className="border-t border-gray-200 my-1" />
                                      <button
                                        onClick={() => {
                                          setSelectedEnrollment(enrollment);
                                          setIsDeleteDialogOpen(true);
                                          closeMenu();
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                        Remove
                                      </button>
                                    </>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>

      {/* Create Enrollment Modal */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Assign Student to Course"
          size="md"
        >
          <CreateEnrollmentForm
            onSubmit={handleCreateEnrollment}
            onCancel={() => setIsCreateModalOpen(false)}
            loading={submitting}
          />
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && selectedEnrollment && (
        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setSelectedEnrollment(null);
          }}
          onConfirm={handleDeleteEnrollment}
          title="Remove Student from Course"
          message={`Are you sure you want to remove ${selectedEnrollment.student?.user?.fullName} from ${selectedEnrollment.course?.name}? This action will deactivate the enrollment.`}
          confirmText="Remove"
          cancelText="Cancel"
          variant="danger"
          loading={submitting}
        />
      )}
    </div>
  );
}
