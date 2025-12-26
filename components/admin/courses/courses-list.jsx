"use client";

import { useState, useEffect, useCallback } from "react";
import Card from "@/components/common/card";
import Button from "@/components/common/button";
import { BookOpen, Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import Select from "@/components/common/select";
import Modal from "@/components/common/modal";
import { useAuth } from "@/contexts/auth-context";
import { api } from "@/lib/utils/api";
import { useToast } from "@/contexts/toast-context";
import CreateCourseForm from "@/components/admin/courses/create-course-form";
import UpdateCourseForm from "@/components/admin/courses/update-course-form";
import ConfirmDialog from "@/components/common/confirm-dialog";
import Loading from "@/components/common/loading";

/**
 * Admin Courses List Component
 *
 * Main component for managing courses in the admin panel.
 * Provides full CRUD operations with server-side search and filtering.
 *
 * Features:
 * - View all courses with pagination-ready structure
 * - Create new courses
 * - Update existing course information
 * - Delete courses
 * - Server-side search by name, code, or teacher name
 * - Filter by semester and assigned teacher
 * - Navigate to individual course detail pages
 * - Fetch teachers list for filter dropdown
 *
 * @component
 * @returns {JSX.Element} Courses management interface
 */
export default function CoursesList() {
  // Authentication and routing hooks
  const { isAdmin } = useAuth();
  const { success, error: showError } = useToast();
  const router = useRouter();

  // Modal and dialog state management
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Data state
  const [selectedCourse, setSelectedCourse] = useState(null); // Currently selected course for edit/delete
  const [courses, setCourses] = useState([]); // List of all courses
  const [teachers, setTeachers] = useState([]); // List of teachers for filter dropdown
  const [loading, setLoading] = useState(false); // Loading state for courses data fetching
  const [loadingFilters, setLoadingFilters] = useState(false); // Loading state for teachers filter data
  const [submitting, setSubmitting] = useState(false); // Loading state for form submissions

  // Filter and search state
  const [searchQuery, setSearchQuery] = useState(""); // Search input value
  const [selectedSemester, setSelectedSemester] = useState(""); // Selected semester filter (empty = all)
  const [selectedTeacher, setSelectedTeacher] = useState(""); // Selected teacher filter (empty = all)

  /**
   * Fetch teachers list for filter dropdown
   * 
   * Loads all teachers once when component mounts.
   * Used to populate the teacher filter dropdown.
   * Only runs if user is admin.
   */
  useEffect(() => {
    if (!isAdmin) return;

    const fetchTeachers = async () => {
      setLoadingFilters(true);
      try {
        const response = await api.get("/users?role=teacher");
        // Normalize response: API may return array directly or object with data property
        const teachersList = Array.isArray(response)
          ? response
          : response?.data || [];
        setTeachers(teachersList);
      } catch (error) {
        console.error("Error fetching teachers:", error);
        // Continue with empty teachers list if fetch fails
      } finally {
        setLoadingFilters(false);
      }
    };

    fetchTeachers();
  }, [isAdmin]);

  /**
   * Debounced search and filter effect
   * 
   * Triggers data fetch when search query or filters change.
   * Uses 500ms debounce to avoid excessive API calls while user is typing.
   * Only runs if user is admin (safety check).
   * 
   * Dependencies: searchQuery, selectedSemester, selectedTeacher, isAdmin
   */
  useEffect(() => {
    if (!isAdmin) return;

    // Debounce: wait 500ms after user stops typing before fetching
    const timer = setTimeout(() => {
      fetchCourses();
    }, 500);

    // Cleanup: clear timer if component unmounts or dependencies change
    return () => clearTimeout(timer);
  }, [searchQuery, selectedSemester, selectedTeacher, isAdmin]);

  /**
   * Fetch courses from the API with server-side filtering
   * 
   * Builds query parameters based on current search and filter state.
   * Handles response normalization (array or object with data property).
   * 
   * @async
   * @function fetchCourses
   * @returns {Promise<void>}
   */
  const fetchCourses = useCallback(async () => {
    setLoading(true);

    try {
      // Build query parameters for server-side filtering
      const params = new URLSearchParams();
      
      // Add optional filters if they have values
      if (searchQuery) params.append("search", searchQuery);
      if (selectedSemester) params.append("semester", selectedSemester);
      if (selectedTeacher) params.append("teacherId", selectedTeacher);

      // Make API request with query parameters
      const url = `/courses?${params.toString()}`;
      const response = await api.get(url);
      
      // Normalize response: API may return array directly or object with data property
      const coursesList = Array.isArray(response)
        ? response
        : response?.data || [];
      
      setCourses(coursesList);
    } catch (err) {
      console.error("Error fetching courses:", err);
      // Set empty array on error to show "no courses" state
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedSemester, selectedTeacher]);

  const handleCreateCourse = async (data) => {
    setSubmitting(true);
    try {
      await api.post("/courses", data);
      success("Course created successfully!");
      setIsCreateModalOpen(false);
      fetchCourses(); // Refresh list
    } catch (err) {
      showError(err.message || "Failed to create course");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateCourse = async (data) => {
    setSubmitting(true);
    try {
      await api.patch(`/courses/${selectedCourse.id}`, data);
      success("Course updated successfully!");
      setIsUpdateModalOpen(false);
      setSelectedCourse(null);
      fetchCourses(); // Refresh list
    } catch (err) {
      showError(err.message || "Failed to update course");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCourse = async () => {
    setSubmitting(true);
    try {
      await api.delete(`/courses/${selectedCourse.id}`);
      success("Course deleted successfully!");
      setIsDeleteDialogOpen(false);
      setSelectedCourse(null);
      fetchCourses(); // Refresh list
    } catch (err) {
      showError(err.message || "Failed to delete course");
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (course) => {
    setSelectedCourse(course);
    setIsUpdateModalOpen(true);
  };

  const openDeleteDialog = (course) => {
    setSelectedCourse(course);
    setIsDeleteDialogOpen(true);
  };


  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Courses Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Manage all courses and assignments
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          startIcon={<Plus className="w-4 h-4" />}
        >
          Create Course
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, code, or teacher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
              />
            </div>
          </div>
          <div>
            <Select
              label="Semester"
              name="semester"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              placeholder="All semesters"
              options={[
                { value: "", label: "All semesters" },
                "Fall 2024",
                "Spring 2025",
                "Summer 2025",
              ]}
            />
          </div>
          <div>
            <Select
              label="Teacher"
              name="teacher"
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              placeholder="All teachers"
              disabled={loadingFilters}
              options={
                teachers.length > 0
                  ? [
                      { value: "", label: "All teachers" },
                      ...teachers.map((teacher) => {
                        const teacherId = teacher.teacher?.id || teacher.id;
                        const teacherName =
                          teacher.fullName ||
                          teacher.teacher?.user?.fullName ||
                          "Teacher";
                        return {
                          value: teacherId,
                          label: teacherName,
                        };
                      }),
                    ]
                  : [{ value: "", label: "All teachers" }]
              }
            />
          </div>
        </div>
      </Card>

      {/* Courses List */}
      {loading ? (
        <Card>
          <div className="text-center py-8">
            <Loading size="md" />
            <p className="text-gray-600 mt-3">Loading courses...</p>
          </div>
        </Card>
      ) : courses.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">
              {searchQuery || selectedSemester || selectedTeacher
                ? "No courses found matching your filters"
                : "No courses found"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {searchQuery || selectedSemester || selectedTeacher
                ? "Try adjusting your filters or create new courses"
                : "Create your first course to get started"}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {courses.map((course) => (
            <Card key={course.id}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {course.name}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">
                    {course.code}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="text-xs text-gray-500">
                      {course.creditHours} Credit Hour
                      {course.creditHours > 1 ? "s" : ""}
                    </span>
                    {course.semester && (
                      <span className="text-xs text-gray-500">
                        {course.semester}
                      </span>
                    )}
                    {(course.teacher?.user?.fullName ||
                      course.teacher?.fullName) && (
                      <span className="text-xs text-gray-500">
                        Teacher:{" "}
                        {course.teacher?.user?.fullName ||
                          course.teacher?.fullName}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded-md whitespace-nowrap">
                    Active
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/admin/courses/${course.id}`)}
                    startIcon={<Eye className="w-4 h-4" />}
                  >
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(course)}
                    startIcon={<Edit className="w-4 h-4" />}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => openDeleteDialog(course)}
                    startIcon={<Trash2 className="w-4 h-4" />}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Course Modal */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create Course"
          size="md"
        >
          <CreateCourseForm
            onSubmit={handleCreateCourse}
            onCancel={() => setIsCreateModalOpen(false)}
            loading={submitting}
          />
        </Modal>
      )}

      {/* Update Course Modal */}
      {isUpdateModalOpen && selectedCourse && (
        <Modal
          isOpen={isUpdateModalOpen}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedCourse(null);
          }}
          title="Update Course"
          size="md"
        >
          <UpdateCourseForm
            course={selectedCourse}
            onSubmit={handleUpdateCourse}
            onCancel={() => {
              setIsUpdateModalOpen(false);
              setSelectedCourse(null);
            }}
            loading={submitting}
          />
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && selectedCourse && (
        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setSelectedCourse(null);
          }}
          onConfirm={handleDeleteCourse}
          title="Delete Course"
          message={`Are you sure you want to delete ${selectedCourse.name}? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          loading={submitting}
        />
      )}
    </div>
  );
}

