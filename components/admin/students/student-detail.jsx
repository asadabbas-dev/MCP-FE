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
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  User,
} from "lucide-react";
import { api } from "@/lib/utils/api";
import { useToast } from "@/contexts/toast-context";
import Modal from "@/components/common/modal";
import UpdateStudentForm from "@/components/admin/students/update-student-form";
import ConfirmDialog from "@/components/common/confirm-dialog";

/**
 * Student Detail Component
 *
 * Displays comprehensive information about a single student.
 * Allows admin to view, edit, and delete student accounts.
 *
 * Features:
 * - View complete student profile (personal and academic info)
 * - Edit student information via modal
 * - Delete student account with confirmation
 * - Navigate back to students list
 *
 * @component
 * @returns {JSX.Element} Student detail view with edit/delete actions
 */
export default function StudentDetail() {
  // Next.js routing hooks
  const params = useParams(); // Get dynamic route parameter (student ID)
  const router = useRouter(); // For programmatic navigation

  // Toast notifications
  const { success, error: showError } = useToast();

  // Component state
  const [student, setStudent] = useState(null); // Current student data
  const [loading, setLoading] = useState(true); // Initial data loading state
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // Edit modal visibility
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // Delete confirmation dialog visibility
  const [submitting, setSubmitting] = useState(false); // Form submission loading state

  /**
   * Fetch student data when component mounts or ID changes
   *
   * Triggers data fetch whenever the student ID in the URL changes.
   * This handles navigation between different student detail pages.
   */
  useEffect(() => {
    if (params.id) {
      fetchStudent();
    }
  }, [params.id]);

  /**
   * Fetch student details from the API
   *
   * Retrieves complete student information including:
   * - User basic info (name, email, phone)
   * - Student-specific info (roll number, semester, program)
   * - Account metadata (created date, status)
   *
   * @async
   * @function fetchStudent
   * @returns {Promise<void>}
   */
  const fetchStudent = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/users/${params.id}`);
      setStudent(response);
    } catch (err) {
      console.error("Error fetching student:", err);
      showError(err.message || "Failed to load student details");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle updating student information
   *
   * Updates student data in two API calls:
   * 1. Update user table (basic info: name, email)
   * 2. Update students table (academic info: roll number, semester, program)
   *
   * Only makes the second call if studentUpdateData contains fields to update.
   * Refreshes student data after successful update.
   *
   * @async
   * @function handleUpdateStudent
   * @param {Object} updateData - User data to update
   * @param {Object} studentUpdateData - Student-specific data to update
   * @returns {Promise<void>}
   */
  const handleUpdateStudent = async (updateData, studentUpdateData) => {
    setSubmitting(true);
    try {
      // Update user basic information
      await api.patch(`/users/${params.id}`, updateData);

      // Update student-specific information only if provided
      if (Object.keys(studentUpdateData).length > 0) {
        await api.patch(`/users/${params.id}/student`, studentUpdateData);
      }

      success("Student updated successfully!");
      setIsUpdateModalOpen(false);
      fetchStudent(); // Refresh to show updated data
    } catch (err) {
      showError(err.message || "Failed to update student");
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Handle deleting a student account
   *
   * Permanently deletes the student from the system.
   * Redirects to students list page after successful deletion.
   *
   * @async
   * @function handleDeleteStudent
   * @returns {Promise<void>}
   */
  const handleDeleteStudent = async () => {
    setSubmitting(true);
    try {
      await api.delete(`/users/${params.id}`);
      success("Student deleted successfully!");
      router.push("/admin/students"); // Navigate back to list
    } catch (err) {
      showError(err.message || "Failed to delete student");
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
            <p className="text-gray-600 mt-3">Loading student details...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-6">
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-600">Student not found</p>
            <Button
              variant="outline"
              onClick={() => router.push("/admin/students")}
              className="mt-4"
            >
              Back to Students
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
            onClick={() => router.push("/admin/students")}
            startIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Student Details
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              View complete student information
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

      {/* Student Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <Card title="Personal Information">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  {student.profileImage ? (
                    <img
                      src={student.profileImage}
                      alt={student.fullName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-indigo-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    {student.fullName}
                  </h2>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-md">
                      Active
                    </span>
                    <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded-md">
                      Student
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900">
                      {student.email}
                    </p>
                  </div>
                </div>
                {student.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm font-medium text-gray-900">
                        {student.phone}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card title="Academic Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {student.student?.rollNumber && (
                <div className="flex items-start gap-3">
                  <GraduationCap className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Roll Number</p>
                    <p className="text-sm font-medium text-gray-900">
                      {student.student.rollNumber}
                    </p>
                  </div>
                </div>
              )}
              {student.student?.currentSemester && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Current Semester</p>
                    <p className="text-sm font-medium text-gray-900">
                      Semester {student.student.currentSemester}
                    </p>
                  </div>
                </div>
              )}
              {student.student?.program && (
                <div className="flex items-start gap-3 sm:col-span-2">
                  <GraduationCap className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Program</p>
                    <p className="text-sm font-medium text-gray-900">
                      {student.student.program}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          <Card title="Account Status">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-md">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Role</span>
                <span className="text-sm font-medium text-gray-900">
                  Student
                </span>
              </div>
              {student.createdAt && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Created</span>
                  <span className="text-sm text-gray-900">
                    {new Date(student.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Update Modal */}
      {isUpdateModalOpen && student && (
        <Modal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          title="Update Student"
          size="md"
        >
          <UpdateStudentForm
            student={student}
            onSubmit={handleUpdateStudent}
            onCancel={() => setIsUpdateModalOpen(false)}
            loading={submitting}
          />
        </Modal>
      )}

      {/* Delete Dialog */}
      {isDeleteDialogOpen && student && (
        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteStudent}
          title="Delete Student"
          message={`Are you sure you want to delete ${student.fullName}? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          loading={submitting}
        />
      )}
    </div>
  );
}
