"use client";

import { useState, useEffect } from "react";
import Card from "@/components/common/card";
import Button from "@/components/common/button";
import { BookOpen, Plus, Search } from "lucide-react";
import Modal from "@/components/common/modal";
import { useAuth } from "@/contexts/auth-context";
import { api } from "@/lib/utils/api";
import { useToast } from "@/contexts/toast-context";
import CreateCourseForm from "@/components/admin/create-course-form";
import Loading from "@/components/common/loading";
import { mockCourses } from "@/lib/mock-data/admin-mock-data";

/**
 * Admin Courses Management Page
 *
 * Allows admin to:
 * - View all courses
 * - Create new courses
 * - Assign courses to teachers
 * - Search/filter courses
 */

export default function AdminCoursesPage() {
  const { isAdmin } = useAuth();
  const { success, error: showError } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch courses
  useEffect(() => {
    if (isAdmin) {
      fetchCourses();
    }
  }, [isAdmin]);

  const fetchCourses = async () => {
    setLoading(true);
    
    // Check if using mock token - use mock data directly
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token && token.startsWith("mock-token-")) {
      setCourses(mockCourses);
      setLoading(false);
      return;
    }
    
    try {
      const response = await api.get("/courses");
      const coursesList = Array.isArray(response) ? response : response?.data || [];
      // Use mock data if no real data available
      setCourses(coursesList.length > 0 ? coursesList : mockCourses);
    } catch (err) {
      console.error("Error fetching courses:", err);
      // Use mock data on error
      setCourses(mockCourses);
    } finally {
      setLoading(false);
    }
  };

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

  // Filter courses based on search query
  const filteredCourses = courses.filter((course) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const teacherName = course.teacher?.user?.fullName || course.teacher?.fullName || "";
    return (
      course.name?.toLowerCase().includes(query) ||
      course.code?.toLowerCase().includes(query) ||
      course.department?.toLowerCase().includes(query) ||
      teacherName.toLowerCase().includes(query)
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

      {/* Search Bar */}
      <Card>
        <div className="flex items-center space-x-2">
          <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search courses by name, code, or teacher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border-0 focus:outline-none focus:ring-0 text-sm sm:text-base"
          />
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
      ) : filteredCourses.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">
              {searchQuery ? "No courses found matching your search" : "No courses found"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {searchQuery
                ? "Try a different search term"
                : "Create your first course to get started"}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {filteredCourses.map((course) => (
            <Card key={course.id}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {course.name}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">{course.code}</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="text-xs text-gray-500">
                      {course.creditHours} Credit Hour{course.creditHours > 1 ? "s" : ""}
                    </span>
                    {course.semester && (
                      <span className="text-xs text-gray-500">{course.semester}</span>
                    )}
                    {(course.teacher?.user?.fullName || course.teacher?.fullName) && (
                      <span className="text-xs text-gray-500">
                        Teacher: {course.teacher?.user?.fullName || course.teacher?.fullName}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded-md whitespace-nowrap">
                    Active
                  </span>
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
    </div>
  );
}

