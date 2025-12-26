"use client";

import { useState, useEffect, useCallback } from "react";
import Card from "@/components/common/card";
import Button from "@/components/common/button";
import { Users, Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import Modal from "@/components/common/modal";
import { useAuth } from "@/contexts/auth-context";
import { api } from "@/lib/utils/api";
import { useToast } from "@/contexts/toast-context";
import CreateStudentForm from "@/components/admin/students/create-student-form";
import UpdateStudentForm from "@/components/admin/students/update-student-form";
import ConfirmDialog from "@/components/common/confirm-dialog";
import Loading from "@/components/common/loading";
import Select from "@/components/common/select";

/**
 * Admin Students List Component
 *
 * Main component for managing students in the admin panel.
 * Provides full CRUD operations with server-side search and filtering.
 *
 * Features:
 * - View all students with pagination-ready structure
 * - Create new student accounts
 * - Update existing student information
 * - Delete student accounts
 * - Server-side search by name, email, or roll number
 * - Filter by current semester and program
 * - Navigate to individual student detail pages
 *
 * @component
 * @returns {JSX.Element} Students management interface
 */
export default function StudentsList() {
  // Authentication and routing hooks
  const { isAdmin } = useAuth();
  const { success, error: showError } = useToast();
  const router = useRouter();

  // Modal and dialog state management
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Data state
  const [selectedStudent, setSelectedStudent] = useState(null); // Currently selected student for edit/delete
  const [students, setStudents] = useState([]); // List of all students
  const [loading, setLoading] = useState(false); // Loading state for data fetching
  const [submitting, setSubmitting] = useState(false); // Loading state for form submissions

  // Filter and search state
  const [searchQuery, setSearchQuery] = useState(""); // Search input value
  const [selectedSemester, setSelectedSemester] = useState(""); // Selected semester filter (empty = all)
  const [selectedProgram, setSelectedProgram] = useState(""); // Selected program filter (empty = all)

  /**
   * Debounced search and filter effect
   * 
   * Triggers data fetch when search query or filters change.
   * Uses 500ms debounce to avoid excessive API calls while user is typing.
   * Only runs if user is admin (safety check).
   * 
   * Dependencies: searchQuery, selectedSemester, selectedProgram, isAdmin
   */
  useEffect(() => {
    // Early return if user is not admin
    if (!isAdmin) return;

    // Debounce: wait 500ms after user stops typing before fetching
    const timer = setTimeout(() => {
      fetchStudents();
    }, 500);

    // Cleanup: clear timer if component unmounts or dependencies change
    return () => clearTimeout(timer);
  }, [searchQuery, selectedSemester, selectedProgram, isAdmin]);

  /**
   * Fetch students from the API with server-side filtering
   * 
   * Builds query parameters based on current search and filter state.
   * Handles response normalization (array or object with data property).
   * Maps user data to include student-specific fields for easier access.
   * 
   * @async
   * @function fetchStudents
   * @returns {Promise<void>}
   */
  const fetchStudents = useCallback(async () => {
    setLoading(true);

    try {
      // Build query parameters for server-side filtering
      const params = new URLSearchParams();
      params.append("role", "student"); // Always filter by student role
      
      // Add optional filters if they have values
      if (searchQuery) params.append("search", searchQuery);
      if (selectedSemester) params.append("currentSemester", selectedSemester);
      if (selectedProgram) params.append("program", selectedProgram);

      // Make API request with query parameters
      const url = `/users?${params.toString()}`;
      const response = await api.get(url);
      
      // Normalize response: API may return array directly or object with data property
      const studentsList = Array.isArray(response)
        ? response
        : response?.data || [];
      
      // Transform data: flatten nested student properties for easier access in UI
      // This allows us to use student.rollNumber instead of student.student.rollNumber
      const studentsWithData = studentsList.map((user) => ({
        ...user,
        rollNumber: user.student?.rollNumber || user.rollNumber,
        currentSemester: user.student?.currentSemester || user.currentSemester,
        program: user.student?.program || user.program,
      }));
      
      setStudents(studentsWithData);
    } catch (err) {
      console.error("Error fetching students:", err);
      // Set empty array on error to show "no students" state
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedSemester, selectedProgram]);

  /**
   * Handle creating a new student
   * 
   * Creates a new student account via the API.
   * Shows success/error toast notifications.
   * Closes modal and refreshes the student list on success.
   * 
   * @async
   * @function handleCreateStudent
   * @param {Object} data - Student data from the create form
   * @param {string} data.fullName - Student's full name
   * @param {string} data.email - Student's email address
   * @param {string} data.password - Student's password
   * @param {string} [data.rollNumber] - Optional roll number (auto-generated if not provided)
   * @param {number} [data.currentSemester] - Optional current semester
   * @param {string} [data.program] - Optional program name
   * @returns {Promise<void>}
   */
  const handleCreateStudent = async (data) => {
    setSubmitting(true);
    try {
      await api.post("/auth/create-student", data);
      success("Student created successfully!");
      setIsCreateModalOpen(false);
      fetchStudents(); // Refresh list to show new student
    } catch (err) {
      showError(err.message || "Failed to create student");
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Handle updating an existing student
   * 
   * Updates student information in two steps:
   * 1. Update basic user information (name, email)
   * 2. Update student-specific information (roll number, semester, program) if provided
   * 
   * Uses separate API endpoints because user and student data are in different tables.
   * 
   * @async
   * @function handleUpdateStudent
   * @param {Object} updateData - Basic user data to update
   * @param {string} updateData.fullName - Updated full name
   * @param {string} updateData.email - Updated email
   * @param {Object} studentUpdateData - Student-specific data to update
   * @param {string} [studentUpdateData.rollNumber] - Updated roll number
   * @param {number} [studentUpdateData.currentSemester] - Updated semester
   * @param {string} [studentUpdateData.program] - Updated program
   * @returns {Promise<void>}
   */
  const handleUpdateStudent = async (updateData, studentUpdateData) => {
    setSubmitting(true);
    try {
      // Step 1: Update user basic info (users table)
      await api.patch(`/users/${selectedStudent.id}`, updateData);

      // Step 2: Update student-specific info (students table) if any fields were provided
      if (Object.keys(studentUpdateData).length > 0) {
        await api.patch(
          `/users/${selectedStudent.id}/student`,
          studentUpdateData
        );
      }

      success("Student updated successfully!");
      setIsUpdateModalOpen(false);
      setSelectedStudent(null); // Clear selection
      fetchStudents(); // Refresh list to show updated data
    } catch (err) {
      showError(err.message || "Failed to update student");
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Handle deleting a student
   * 
   * Permanently deletes a student account from the system.
   * Shows confirmation dialog before deletion.
   * Redirects to students list after successful deletion.
   * 
   * @async
   * @function handleDeleteStudent
   * @returns {Promise<void>}
   */
  const handleDeleteStudent = async () => {
    setSubmitting(true);
    try {
      await api.delete(`/users/${selectedStudent.id}`);
      success("Student deleted successfully!");
      setIsDeleteDialogOpen(false);
      setSelectedStudent(null); // Clear selection
      fetchStudents(); // Refresh list to remove deleted student
    } catch (err) {
      showError(err.message || "Failed to delete student");
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Open the edit modal for a student
   * 
   * Sets the selected student and opens the update modal.
   * 
   * @function openEditModal
   * @param {Object} student - Student object to edit
   */
  const openEditModal = (student) => {
    setSelectedStudent(student);
    setIsUpdateModalOpen(true);
  };

  /**
   * Open the delete confirmation dialog for a student
   * 
   * Sets the selected student and opens the delete confirmation dialog.
   * 
   * @function openDeleteDialog
   * @param {Object} student - Student object to delete
   */
  const openDeleteDialog = (student) => {
    setSelectedStudent(student);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Students Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Manage all student accounts
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          startIcon={<Plus className="w-4 h-4" />}
        >
          Create Student
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
                placeholder="Search by name, email, or roll number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
              />
            </div>
          </div>
          <div>
            <Select
              label="Current Semester"
              name="semester"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              placeholder="All semesters"
              options={[
                { value: "", label: "All semesters" },
                { value: "1", label: "Semester 1" },
                { value: "2", label: "Semester 2" },
                { value: "3", label: "Semester 3" },
                { value: "4", label: "Semester 4" },
                { value: "5", label: "Semester 5" },
                { value: "6", label: "Semester 6" },
                { value: "7", label: "Semester 7" },
                { value: "8", label: "Semester 8" },
              ]}
            />
          </div>
          <div>
            <Select
              label="Program"
              name="program"
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              placeholder="All programs"
              options={[
                { value: "", label: "All programs" },
                "BS Computer Science",
                "BS Software Engineering",
                "BS Information Technology",
                "BS Electrical Engineering",
                "BS Mechanical Engineering",
                "BS Civil Engineering",
                "BS Business Administration",
                "BS Mathematics",
                "BS Physics",
                "BS Chemistry",
                "BS Biology",
                "BA English",
                "BA History",
                "BS Psychology",
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Students List */}
      {loading ? (
        <Card>
          <div className="text-center py-8">
            <Loading size="md" />
            <p className="text-gray-600 mt-3">Loading students...</p>
          </div>
        </Card>
      ) : students.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">
              {searchQuery || selectedSemester || selectedProgram
                ? "No students found matching your filters"
                : "No students found"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {searchQuery || selectedSemester || selectedProgram
                ? "Try adjusting your filters or create new students"
                : "Create your first student to get started"}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {students.map((student) => (
            <Card key={student.id}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {student.fullName}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">
                    {student.email}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {student.rollNumber && (
                      <span className="text-xs text-gray-500">
                        Roll: {student.rollNumber}
                      </span>
                    )}
                    {student.currentSemester && (
                      <span className="text-xs text-gray-500">
                        Semester: {student.currentSemester}
                      </span>
                    )}
                    {student.program && (
                      <span className="text-xs text-gray-500">
                        {student.program}
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
                    onClick={() => router.push(`/admin/students/${student.id}`)}
                    startIcon={<Eye className="w-4 h-4" />}
                  >
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(student)}
                    startIcon={<Edit className="w-4 h-4" />}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => openDeleteDialog(student)}
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

      {/* Create Student Modal */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create Student"
          size="md"
        >
          <CreateStudentForm
            onSubmit={handleCreateStudent}
            onCancel={() => setIsCreateModalOpen(false)}
            loading={submitting}
          />
        </Modal>
      )}

      {/* Update Student Modal */}
      {isUpdateModalOpen && selectedStudent && (
        <Modal
          isOpen={isUpdateModalOpen}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedStudent(null);
          }}
          title="Update Student"
          size="md"
        >
          <UpdateStudentForm
            student={selectedStudent}
            onSubmit={handleUpdateStudent}
            onCancel={() => {
              setIsUpdateModalOpen(false);
              setSelectedStudent(null);
            }}
            loading={submitting}
          />
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && selectedStudent && (
        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setSelectedStudent(null);
          }}
          onConfirm={handleDeleteStudent}
          title="Delete Student"
          message={`Are you sure you want to delete ${selectedStudent.fullName}? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          loading={submitting}
        />
      )}
    </div>
  );
}

