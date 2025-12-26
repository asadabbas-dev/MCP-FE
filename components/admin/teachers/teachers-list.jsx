"use client";

import { useState, useEffect, useCallback } from "react";
import Card from "@/components/common/card";
import Button from "@/components/common/button";
import { GraduationCap, Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import Select from "@/components/common/select";
import Modal from "@/components/common/modal";
import { useAuth } from "@/contexts/auth-context";
import { api } from "@/lib/utils/api";
import { useToast } from "@/contexts/toast-context";
import CreateTeacherForm from "@/components/admin/teachers/create-teacher-form";
import UpdateTeacherForm from "@/components/admin/teachers/update-teacher-form";
import ConfirmDialog from "@/components/common/confirm-dialog";
import Loading from "@/components/common/loading";

/**
 * Admin Teachers List Component
 *
 * Main component for managing teachers in the admin panel.
 * Provides full CRUD operations with server-side search and filtering.
 *
 * Features:
 * - View all teachers with pagination-ready structure
 * - Create new teacher accounts
 * - Update existing teacher information
 * - Delete teacher accounts
 * - Server-side search by name, email, or employee ID
 * - Filter by department and designation
 * - Navigate to individual teacher detail pages
 *
 * @component
 * @returns {JSX.Element} Teachers management interface
 */
export default function TeachersList() {
  // Authentication and routing hooks
  const { isAdmin } = useAuth();
  const { success, error: showError } = useToast();
  const router = useRouter();

  // Modal and dialog state management
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Data state
  const [selectedTeacher, setSelectedTeacher] = useState(null); // Currently selected teacher for edit/delete
  const [teachers, setTeachers] = useState([]); // List of all teachers
  const [loading, setLoading] = useState(false); // Loading state for data fetching
  const [submitting, setSubmitting] = useState(false); // Loading state for form submissions

  // Filter and search state
  const [searchQuery, setSearchQuery] = useState(""); // Search input value
  const [selectedDepartment, setSelectedDepartment] = useState(""); // Selected department filter (empty = all)
  const [selectedDesignation, setSelectedDesignation] = useState(""); // Selected designation filter (empty = all)

  /**
   * Debounced search and filter effect
   * 
   * Triggers data fetch when search query or filters change.
   * Uses 500ms debounce to avoid excessive API calls while user is typing.
   * Only runs if user is admin (safety check).
   * 
   * Dependencies: searchQuery, selectedDepartment, selectedDesignation, isAdmin
   */
  useEffect(() => {
    // Early return if user is not admin
    if (!isAdmin) return;
    
    // Debounce: wait 500ms after user stops typing before fetching
    const timer = setTimeout(() => {
      fetchTeachers();
    }, 500);

    // Cleanup: clear timer if component unmounts or dependencies change
    return () => clearTimeout(timer);
  }, [searchQuery, selectedDepartment, selectedDesignation, isAdmin]);

  /**
   * Fetch teachers from the API with server-side filtering
   * 
   * Builds query parameters based on current search and filter state.
   * Handles response normalization (array or object with data property).
   * Maps user data to include teacher-specific fields for easier access.
   * 
   * @async
   * @function fetchTeachers
   * @returns {Promise<void>}
   */
  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    
    try {
      // Build query parameters for server-side filtering
      const params = new URLSearchParams();
      params.append('role', 'teacher'); // Always filter by teacher role
      
      // Add optional filters if they have values
      if (searchQuery) params.append('search', searchQuery);
      if (selectedDepartment) params.append('department', selectedDepartment);
      if (selectedDesignation) params.append('designation', selectedDesignation);
      
      // Make API request with query parameters
      const url = `/users?${params.toString()}`;
      const response = await api.get(url);
      
      // Normalize response: API may return array directly or object with data property
      const teachersList = Array.isArray(response) ? response : response?.data || [];
      
      // Transform data: flatten nested teacher properties for easier access in UI
      // This allows us to use teacher.employeeId instead of teacher.teacher.employeeId
      const teachersWithData = teachersList.map((user) => ({
        ...user,
        employeeId: user.teacher?.employeeId || user.employeeId,
        department: user.teacher?.department || user.department,
        designation: user.teacher?.designation || user.designation,
      }));
      
      setTeachers(teachersWithData);
    } catch (err) {
      console.error("Error fetching teachers:", err);
      // Set empty array on error to show "no teachers" state
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedDepartment, selectedDesignation]);

  /**
   * Handle creating a new teacher
   * 
   * Creates a new teacher account via the API.
   * Shows success/error toast notifications.
   * Closes modal and refreshes the teacher list on success.
   * 
   * @async
   * @function handleCreateTeacher
   * @param {Object} data - Teacher data from the create form
   * @param {string} data.fullName - Teacher's full name
   * @param {string} data.email - Teacher's email address
   * @param {string} data.password - Teacher's password
   * @param {string} [data.department] - Optional department
   * @param {string} [data.designation] - Optional designation
   * @returns {Promise<void>}
   */
  const handleCreateTeacher = async (data) => {
    setSubmitting(true);
    try {
      await api.post("/auth/create-teacher", data);
      success("Teacher created successfully!");
      setIsCreateModalOpen(false);
      fetchTeachers(); // Refresh list to show new teacher
    } catch (err) {
      showError(err.message || "Failed to create teacher");
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Handle updating an existing teacher
   * 
   * Updates teacher information in two steps:
   * 1. Update basic user information (name, email)
   * 2. Update teacher-specific information (department, designation) if provided
   * 
   * Uses separate API endpoints because user and teacher data are in different tables.
   * 
   * @async
   * @function handleUpdateTeacher
   * @param {Object} updateData - Basic user data to update
   * @param {string} updateData.fullName - Updated full name
   * @param {string} updateData.email - Updated email
   * @param {Object} teacherUpdateData - Teacher-specific data to update
   * @param {string} [teacherUpdateData.department] - Updated department
   * @param {string} [teacherUpdateData.designation] - Updated designation
   * @returns {Promise<void>}
   */
  const handleUpdateTeacher = async (updateData, teacherUpdateData) => {
    setSubmitting(true);
    try {
      // Step 1: Update user basic info (users table)
      await api.patch(`/users/${selectedTeacher.id}`, updateData);
      
      // Step 2: Update teacher-specific info (teachers table) if any fields were provided
      if (Object.keys(teacherUpdateData).length > 0) {
        await api.patch(`/users/${selectedTeacher.id}/teacher`, teacherUpdateData);
      }
      
      success("Teacher updated successfully!");
      setIsUpdateModalOpen(false);
      setSelectedTeacher(null); // Clear selection
      fetchTeachers(); // Refresh list to show updated data
    } catch (err) {
      showError(err.message || "Failed to update teacher");
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Handle deleting a teacher
   * 
   * Permanently deletes a teacher account from the system.
   * Shows confirmation dialog before deletion.
   * 
   * @async
   * @function handleDeleteTeacher
   * @returns {Promise<void>}
   */
  const handleDeleteTeacher = async () => {
    setSubmitting(true);
    try {
      await api.delete(`/users/${selectedTeacher.id}`);
      success("Teacher deleted successfully!");
      setIsDeleteDialogOpen(false);
      setSelectedTeacher(null); // Clear selection
      fetchTeachers(); // Refresh list to remove deleted teacher
    } catch (err) {
      showError(err.message || "Failed to delete teacher");
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Open the edit modal for a teacher
   * 
   * Sets the selected teacher and opens the update modal.
   * 
   * @function openEditModal
   * @param {Object} teacher - Teacher object to edit
   */
  const openEditModal = (teacher) => {
    setSelectedTeacher(teacher);
    setIsUpdateModalOpen(true);
  };

  /**
   * Open the delete confirmation dialog for a teacher
   * 
   * Sets the selected teacher and opens the delete confirmation dialog.
   * 
   * @function openDeleteDialog
   * @param {Object} teacher - Teacher object to delete
   */
  const openDeleteDialog = (teacher) => {
    setSelectedTeacher(teacher);
    setIsDeleteDialogOpen(true);
  };


  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Teachers Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Manage all teacher accounts
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          startIcon={<Plus className="w-4 h-4" />}
        >
          Create Teacher
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
                placeholder="Search by name, email, or employee ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
              />
            </div>
          </div>
          <div>
            <Select
              label="Department"
              name="department"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              placeholder="All departments"
              options={[
                { value: "", label: "All departments" },
                "Computer Science",
                "Electrical Engineering",
                "Mechanical Engineering",
                "Civil Engineering",
                "Business Administration",
                "Mathematics",
                "Physics",
                "Chemistry",
                "Biology",
                "English",
                "History",
                "Psychology",
              ]}
            />
          </div>
          <div>
            <Select
              label="Designation"
              name="designation"
              value={selectedDesignation}
              onChange={(e) => setSelectedDesignation(e.target.value)}
              placeholder="All designations"
              options={[
                { value: "", label: "All designations" },
                "Professor",
                "Associate Professor",
                "Assistant Professor",
                "Lecturer",
                "Senior Lecturer",
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Teachers List */}
      {loading ? (
        <Card>
          <div className="text-center py-8">
            <Loading size="md" />
            <p className="text-gray-600 mt-3">Loading teachers...</p>
          </div>
        </Card>
      ) : teachers.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">
              {searchQuery || selectedDepartment || selectedDesignation
                ? "No teachers found matching your filters"
                : "No teachers found"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {searchQuery || selectedDepartment || selectedDesignation
                ? "Try adjusting your filters or create new teachers"
                : "Create your first teacher to get started"}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {teachers.map((teacher) => (
            <Card key={teacher.id}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {teacher.fullName}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">{teacher.email}</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {teacher.employeeId && (
                      <span className="text-xs text-gray-500">
                        ID: {teacher.employeeId}
                      </span>
                    )}
                    {teacher.department && (
                      <span className="text-xs text-gray-500">
                        {teacher.department}
                      </span>
                    )}
                    {teacher.designation && (
                      <span className="text-xs text-gray-500">
                        {teacher.designation}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-md whitespace-nowrap">
                    Active
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/admin/teachers/${teacher.id}`)}
                    startIcon={<Eye className="w-4 h-4" />}
                  >
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(teacher)}
                    startIcon={<Edit className="w-4 h-4" />}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => openDeleteDialog(teacher)}
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

      {/* Create Teacher Modal */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create Teacher"
          size="md"
        >
          <CreateTeacherForm
            onSubmit={handleCreateTeacher}
            onCancel={() => setIsCreateModalOpen(false)}
            loading={submitting}
          />
        </Modal>
      )}

      {/* Update Teacher Modal */}
      {isUpdateModalOpen && selectedTeacher && (
        <Modal
          isOpen={isUpdateModalOpen}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedTeacher(null);
          }}
          title="Update Teacher"
          size="md"
        >
          <UpdateTeacherForm
            teacher={selectedTeacher}
            onSubmit={handleUpdateTeacher}
            onCancel={() => {
              setIsUpdateModalOpen(false);
              setSelectedTeacher(null);
            }}
            loading={submitting}
          />
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && selectedTeacher && (
        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setSelectedTeacher(null);
          }}
          onConfirm={handleDeleteTeacher}
          title="Delete Teacher"
          message={`Are you sure you want to delete ${selectedTeacher.fullName}? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          loading={submitting}
        />
      )}
    </div>
  );
}

