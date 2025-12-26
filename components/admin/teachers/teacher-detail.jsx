"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Card from "@/components/common/card";
import Button from "@/components/common/button";
import Loading from "@/components/common/loading";
import { ArrowLeft, Edit, Trash2, Mail, GraduationCap, Calendar, User, Briefcase } from "lucide-react";
import { api } from "@/lib/utils/api";
import { useToast } from "@/contexts/toast-context";
import Modal from "@/components/common/modal";
import UpdateTeacherForm from "@/components/admin/teachers/update-teacher-form";
import ConfirmDialog from "@/components/common/confirm-dialog";

/**
 * Teacher Detail Component
 *
 * Displays comprehensive information about a single teacher.
 * Allows admin to view, edit, and delete teacher accounts.
 *
 * Features:
 * - View complete teacher profile (personal and professional info)
 * - Edit teacher information via modal
 * - Delete teacher account with confirmation
 * - Navigate back to teachers list
 *
 * @component
 * @returns {JSX.Element} Teacher detail view with edit/delete actions
 */
export default function TeacherDetail() {
  // Next.js routing hooks
  const params = useParams(); // Get dynamic route parameter (teacher ID)
  const router = useRouter(); // For programmatic navigation

  // Toast notifications
  const { success, error: showError } = useToast();

  // Component state
  const [teacher, setTeacher] = useState(null); // Current teacher data
  const [loading, setLoading] = useState(true); // Initial data loading state
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // Edit modal visibility
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // Delete confirmation dialog visibility
  const [submitting, setSubmitting] = useState(false); // Form submission loading state

  /**
   * Fetch teacher data when component mounts or ID changes
   * 
   * Triggers data fetch whenever the teacher ID in the URL changes.
   * This handles navigation between different teacher detail pages.
   */
  useEffect(() => {
    if (params.id) {
      fetchTeacher();
    }
  }, [params.id]);

  /**
   * Fetch teacher details from the API
   * 
   * Retrieves complete teacher information including:
   * - User basic info (name, email, phone)
   * - Teacher-specific info (employee ID, department, designation)
   * - Account metadata (created date, status)
   * 
   * @async
   * @function fetchTeacher
   * @returns {Promise<void>}
   */
  const fetchTeacher = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/users/${params.id}`);
      setTeacher(response);
    } catch (err) {
      console.error("Error fetching teacher:", err);
      showError(err.message || "Failed to load teacher details");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle updating teacher information
   * 
   * Updates teacher data in two steps:
   * 1. Update basic user information (name, email)
   * 2. Update teacher-specific information (department, designation) if provided
   * 
   * Uses separate API endpoints because user and teacher data are in different tables.
   * 
   * @async
   * @function handleUpdateTeacher
   * @param {Object} updateData - Basic user data to update
   * @param {Object} teacherUpdateData - Teacher-specific data to update
   * @returns {Promise<void>}
   */
  const handleUpdateTeacher = async (updateData, teacherUpdateData) => {
    setSubmitting(true);
    try {
      // Step 1: Update user basic info (users table)
      await api.patch(`/users/${params.id}`, updateData);
      
      // Step 2: Update teacher-specific info (teachers table) if any fields were provided
      if (Object.keys(teacherUpdateData).length > 0) {
        await api.patch(`/users/${params.id}/teacher`, teacherUpdateData);
      }
      
      success("Teacher updated successfully!");
      setIsUpdateModalOpen(false);
      fetchTeacher(); // Refresh to show updated data
    } catch (err) {
      showError(err.message || "Failed to update teacher");
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Handle deleting a teacher account
   * 
   * Permanently deletes the teacher from the system.
   * Redirects to teachers list page after successful deletion.
   * 
   * @async
   * @function handleDeleteTeacher
   * @returns {Promise<void>}
   */
  const handleDeleteTeacher = async () => {
    setSubmitting(true);
    try {
      await api.delete(`/users/${params.id}`);
      success("Teacher deleted successfully!");
      router.push("/admin/teachers"); // Navigate back to list
    } catch (err) {
      showError(err.message || "Failed to delete teacher");
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
            <p className="text-gray-600 mt-3">Loading teacher details...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="p-6">
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-600">Teacher not found</p>
            <Button
              variant="outline"
              onClick={() => router.push("/admin/teachers")}
              className="mt-4"
            >
              Back to Teachers
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
            onClick={() => router.push("/admin/teachers")}
            startIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Teacher Details
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              View complete teacher information
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

      {/* Teacher Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <Card title="Personal Information">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  {teacher.profileImage ? (
                    <img
                      src={teacher.profileImage}
                      alt={teacher.fullName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-indigo-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    {teacher.fullName}
                  </h2>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-md">
                      Active
                    </span>
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-md">
                      Teacher
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900">{teacher.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Professional Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {teacher.teacher?.employeeId && (
                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Employee ID</p>
                    <p className="text-sm font-medium text-gray-900">
                      {teacher.teacher.employeeId}
                    </p>
                  </div>
                </div>
              )}
              {teacher.teacher?.department && (
                <div className="flex items-start gap-3">
                  <GraduationCap className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Department</p>
                    <p className="text-sm font-medium text-gray-900">
                      {teacher.teacher.department}
                    </p>
                  </div>
                </div>
              )}
              {teacher.teacher?.designation && (
                <div className="flex items-start gap-3 sm:col-span-2">
                  <Briefcase className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Designation</p>
                    <p className="text-sm font-medium text-gray-900">
                      {teacher.teacher.designation}
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
                <span className="text-sm font-medium text-gray-900">Teacher</span>
              </div>
              {teacher.createdAt && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Created</span>
                  <span className="text-sm text-gray-900">
                    {new Date(teacher.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Update Modal */}
      {isUpdateModalOpen && teacher && (
        <Modal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          title="Update Teacher"
          size="md"
        >
          <UpdateTeacherForm
            teacher={teacher}
            onSubmit={handleUpdateTeacher}
            onCancel={() => setIsUpdateModalOpen(false)}
            loading={submitting}
          />
        </Modal>
      )}

      {/* Delete Dialog */}
      {isDeleteDialogOpen && teacher && (
        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteTeacher}
          title="Delete Teacher"
          message={`Are you sure you want to delete ${teacher.fullName}? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          loading={submitting}
        />
      )}
    </div>
  );
}

