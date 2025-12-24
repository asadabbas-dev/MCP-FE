"use client";

import { useState, useEffect } from "react";
import Card from "@/components/common/card";
import Button from "@/components/common/button";
import { Users, Plus, Search } from "lucide-react";
import Modal from "@/components/common/modal";
import { useAuth } from "@/contexts/auth-context";
import { api } from "@/lib/utils/api";
import { useToast } from "@/contexts/toast-context";
import CreateStudentForm from "@/components/admin/create-student-form";
import Loading from "@/components/common/loading";
import { mockStudents } from "@/lib/mock-data/admin-mock-data";

/**
 * Admin Students Management Page
 *
 * Allows admin to:
 * - View all students
 * - Create new students
 * - Search/filter students
 */

export default function AdminStudentsPage() {
  const { isAdmin } = useAuth();
  const { success, error: showError } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch students
  useEffect(() => {
    if (isAdmin) {
      fetchStudents();
    }
  }, [isAdmin]);

  const fetchStudents = async () => {
    setLoading(true);

    // Check if using mock token - use mock data directly
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token && token.startsWith("mock-token-")) {
      setStudents(mockStudents);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/users?role=student");
      // Handle response - could be array or object with data property
      const studentsList = Array.isArray(response)
        ? response
        : response?.data || [];
      // Map to include student-specific data
      const studentsWithData = studentsList.map((user) => ({
        ...user,
        rollNumber: user.student?.rollNumber || user.rollNumber,
        currentSemester: user.student?.currentSemester || user.currentSemester,
        program: user.student?.program || user.program,
      }));
      // Use mock data if no real data available
      setStudents(
        studentsWithData.length > 0 ? studentsWithData : mockStudents
      );
    } catch (err) {
      console.error("Error fetching students:", err);
      // Use mock data on error
      setStudents(mockStudents);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStudent = async (data) => {
    setSubmitting(true);
    try {
      await api.post("/auth/create-student", data);
      success("Student created successfully!");
      setIsCreateModalOpen(false);
      fetchStudents(); // Refresh list
    } catch (err) {
      showError(err.message || "Failed to create student");
    } finally {
      setSubmitting(false);
    }
  };

  // Filter students based on search query
  const filteredStudents = students.filter((student) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      student.fullName?.toLowerCase().includes(query) ||
      student.email?.toLowerCase().includes(query) ||
      student.rollNumber?.toLowerCase().includes(query)
    );
  });

  if (!isAdmin) {
    return (
      <div className="p-6">
        <Card>
          <p className="text-gray-600">Access denied. Admin only.</p>
        </Card>
      </div>
    );
  }

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

      {/* Search Bar */}
      <Card>
        <div className="flex items-center space-x-2">
          <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search students by name, email, or roll number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border-0 focus:outline-none focus:ring-0 text-sm sm:text-base"
          />
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
      ) : filteredStudents.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">
              {searchQuery
                ? "No students found matching your search"
                : "No students found"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {searchQuery
                ? "Try a different search term"
                : "Create your first student to get started"}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {filteredStudents.map((student) => (
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
    </div>
  );
}
