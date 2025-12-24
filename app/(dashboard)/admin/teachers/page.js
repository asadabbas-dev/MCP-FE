"use client";

import { useState, useEffect } from "react";
import Card from "@/components/common/card";
import Button from "@/components/common/button";
import { GraduationCap, Plus, Search } from "lucide-react";
import Modal from "@/components/common/modal";
import { useAuth } from "@/contexts/auth-context";
import { api } from "@/lib/utils/api";
import { useToast } from "@/contexts/toast-context";
import CreateTeacherForm from "@/components/admin/create-teacher-form";
import Loading from "@/components/common/loading";
import { mockTeachers } from "@/lib/mock-data/admin-mock-data";

/**
 * Admin Teachers Management Page
 *
 * Allows admin to:
 * - View all teachers
 * - Create new teachers
 * - Search/filter teachers
 */

export default function AdminTeachersPage() {
  const { isAdmin } = useAuth();
  const { success, error: showError } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch teachers
  useEffect(() => {
    if (isAdmin) {
      fetchTeachers();
    }
  }, [isAdmin]);

  const fetchTeachers = async () => {
    setLoading(true);
    
    // Check if using mock token - use mock data directly
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token && token.startsWith("mock-token-")) {
      setTeachers(mockTeachers);
      setLoading(false);
      return;
    }
    
    try {
      const response = await api.get("/users?role=teacher");
      // Handle response - could be array or object with data property
      const teachersList = Array.isArray(response) ? response : response?.data || [];
      // Map to include teacher-specific data
      const teachersWithData = teachersList.map((user) => ({
        ...user,
        employeeId: user.teacher?.employeeId || user.employeeId,
        department: user.teacher?.department || user.department,
        designation: user.teacher?.designation || user.designation,
      }));
      // Use mock data if no real data available
      setTeachers(teachersWithData.length > 0 ? teachersWithData : mockTeachers);
    } catch (err) {
      console.error("Error fetching teachers:", err);
      // Use mock data on error
      setTeachers(mockTeachers);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeacher = async (data) => {
    setSubmitting(true);
    try {
      await api.post("/auth/create-teacher", data);
      success("Teacher created successfully!");
      setIsCreateModalOpen(false);
      fetchTeachers(); // Refresh list
    } catch (err) {
      showError(err.message || "Failed to create teacher");
    } finally {
      setSubmitting(false);
    }
  };

  // Filter teachers based on search query
  const filteredTeachers = teachers.filter((teacher) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      teacher.fullName?.toLowerCase().includes(query) ||
      teacher.email?.toLowerCase().includes(query) ||
      teacher.employeeId?.toLowerCase().includes(query) ||
      teacher.department?.toLowerCase().includes(query)
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

      {/* Search Bar */}
      <Card>
        <div className="flex items-center space-x-2">
          <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search teachers by name, email, or employee ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border-0 focus:outline-none focus:ring-0 text-sm sm:text-base"
          />
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
      ) : filteredTeachers.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">
              {searchQuery ? "No teachers found matching your search" : "No teachers found"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {searchQuery
                ? "Try a different search term"
                : "Create your first teacher to get started"}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {filteredTeachers.map((teacher) => (
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
    </div>
  );
}

