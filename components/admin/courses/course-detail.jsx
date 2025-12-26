"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Card from "@/components/common/card";
import Button from "@/components/common/button";
import Loading from "@/components/common/loading";
import {
  ArrowLeft,
  Edit,
  Trash2,
  BookOpen,
  Clock,
  User,
  Calendar,
} from "lucide-react";
import { api } from "@/lib/utils/api";
import { useToast } from "@/contexts/toast-context";
import Modal from "@/components/common/modal";
import UpdateCourseForm from "@/components/admin/courses/update-course-form";
import ConfirmDialog from "@/components/common/confirm-dialog";

/**
 * Course Detail Component
 *
 * Displays comprehensive information about a single course.
 * Allows admin to view, edit, and delete courses.
 *
 * Features:
 * - View complete course information (name, code, credits, semester, teacher)
 * - Edit course information via modal
 * - Delete course with confirmation
 * - Navigate back to courses list
 *
 * @component
 * @returns {JSX.Element} Course detail view with edit/delete actions
 */
export default function CourseDetail() {
  // Next.js routing hooks
  const params = useParams(); // Get dynamic route parameter (course ID)
  const router = useRouter(); // For programmatic navigation

  // Toast notifications
  const { success, error: showError } = useToast();

  // Component state
  const [course, setCourse] = useState(null); // Current course data
  const [loading, setLoading] = useState(true); // Initial data loading state
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // Edit modal visibility
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // Delete confirmation dialog visibility
  const [submitting, setSubmitting] = useState(false); // Form submission loading state

  /**
   * Fetch course data when component mounts or ID changes
   * 
   * Triggers data fetch whenever the course ID in the URL changes.
   * This handles navigation between different course detail pages.
   */
  useEffect(() => {
    if (params.id) {
      fetchCourse();
    }
  }, [params.id]);

  /**
   * Fetch course details from the API
   * 
   * Retrieves complete course information including:
   * - Course basic info (name, code, credit hours, semester)
   * - Assigned teacher information
   * - Course metadata (created date, status)
   * 
   * @async
   * @function fetchCourse
   * @returns {Promise<void>}
   */
  const fetchCourse = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/courses/${params.id}`);
      setCourse(response);
    } catch (err) {
      console.error("Error fetching course:", err);
      showError(err.message || "Failed to load course details");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle updating course information
   * 
   * Updates course data via API.
   * Refreshes course data after successful update.
   * 
   * @async
   * @function handleUpdateCourse
   * @param {Object} data - Course data to update
   * @param {string} data.name - Updated course name
   * @param {string} data.code - Updated course code
   * @param {number} data.creditHours - Updated credit hours
   * @param {string} data.semester - Updated semester
   * @param {number} data.teacherId - Updated teacher ID
   * @returns {Promise<void>}
   */
  const handleUpdateCourse = async (data) => {
    setSubmitting(true);
    try {
      await api.patch(`/courses/${params.id}`, data);
      success("Course updated successfully!");
      setIsUpdateModalOpen(false);
      fetchCourse(); // Refresh to show updated data
    } catch (err) {
      showError(err.message || "Failed to update course");
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Handle deleting a course
   * 
   * Permanently deletes the course from the system.
   * Redirects to courses list page after successful deletion.
   * 
   * @async
   * @function handleDeleteCourse
   * @returns {Promise<void>}
   */
  const handleDeleteCourse = async () => {
    setSubmitting(true);
    try {
      await api.delete(`/courses/${params.id}`);
      success("Course deleted successfully!");
      router.push("/admin/courses"); // Navigate back to list
    } catch (err) {
      showError(err.message || "Failed to delete course");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <Card>
          <div className="text-center py-8">
            <Loading size="md" />
            <p className="text-gray-600 mt-3">Loading course details...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-6">
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-600">Course not found</p>
            <Button
              variant="outline"
              onClick={() => router.push("/admin/courses")}
              className="mt-4"
            >
              Back to Courses
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/admin/courses")}
            startIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Course Details
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              View complete course information
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsUpdateModalOpen(true)}
            startIcon={<Edit className="w-4 h-4" />}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            onClick={() => setIsDeleteDialogOpen(true)}
            startIcon={<Trash2 className="w-4 h-4" />}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Course Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <Card title="Course Information">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                  {course.name}
                </h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded-md">
                    {course.code}
                  </span>
                  {course.isActive && (
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-md">
                      Active
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Credit Hours</p>
                    <p className="text-sm font-medium text-gray-900">
                      {course.creditHours} Credit Hour
                      {course.creditHours > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                {course.semester && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Semester</p>
                      <p className="text-sm font-medium text-gray-900">
                        {course.semester}
                      </p>
                    </div>
                  </div>
                )}
                {course.teacher?.user && (
                  <div className="flex items-start gap-3 sm:col-span-2">
                    <User className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Assigned Teacher</p>
                      <p className="text-sm font-medium text-gray-900">
                        {course.teacher.user.fullName}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {course.description && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">Description</p>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {course.description}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          <Card title="Course Status">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-md">
                  {course.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              {course.createdAt && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Created</span>
                  <span className="text-sm text-gray-900">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Update Modal */}
      {isUpdateModalOpen && course && (
        <Modal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          title="Update Course"
          size="md"
        >
          <UpdateCourseForm
            course={course}
            onSubmit={handleUpdateCourse}
            onCancel={() => setIsUpdateModalOpen(false)}
            loading={submitting}
          />
        </Modal>
      )}

      {/* Delete Dialog */}
      {isDeleteDialogOpen && course && (
        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteCourse}
          title="Delete Course"
          message={`Are you sure you want to delete ${course.name}? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          loading={submitting}
        />
      )}
    </div>
  );
}

