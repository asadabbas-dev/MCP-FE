"use client";

import { useState, useEffect, useCallback } from "react";
import Card from "@/components/common/card";
import Button from "@/components/common/button";
import { Calendar, Plus, Edit, Trash2, Search, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import Modal from "@/components/common/modal";
import { useAuth } from "@/contexts/auth-context";
import { api } from "@/lib/utils/api";
import { useToast } from "@/contexts/toast-context";
import CreateTimetableForm from "@/components/admin/timetable/create-timetable-form";
import UpdateTimetableForm from "@/components/admin/timetable/update-timetable-form";
import ConfirmDialog from "@/components/common/confirm-dialog";
import Loading from "@/components/common/loading";
import Select from "@/components/common/select";

/**
 * Admin Timetable List Component
 *
 * Main component for managing timetable entries in the admin panel.
 * Provides full CRUD operations with server-side search and filtering.
 * Displays timetable entries grouped by day of the week.
 *
 * Features:
 * - View all timetable entries grouped by day
 * - Create new timetable entries
 * - Update existing timetable entries
 * - Delete timetable entries
 * - Server-side search by course, room, or teacher
 * - Filter by semester, course, and teacher
 * - Navigate to individual timetable entry detail pages
 * - Fetch courses and teachers lists for filter dropdowns
 *
 * @component
 * @returns {JSX.Element} Timetable management interface
 */
export default function TimetableList() {
  // Authentication and routing hooks
  const { isAdmin } = useAuth();
  const { success, error: showError } = useToast();
  const router = useRouter();

  // Modal and dialog state management
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Data state
  const [selectedTimetable, setSelectedTimetable] = useState(null); // Currently selected entry for edit/delete
  const [timetable, setTimetable] = useState([]); // List of all timetable entries
  const [loading, setLoading] = useState(false); // Loading state for timetable data fetching
  const [submitting, setSubmitting] = useState(false); // Loading state for form submissions

  // Filter and search state
  const [selectedSemester, setSelectedSemester] = useState(""); // Selected semester filter (empty = all)
  const [selectedCourse, setSelectedCourse] = useState(""); // Selected course filter (empty = all)
  const [selectedTeacher, setSelectedTeacher] = useState(""); // Selected teacher filter (empty = all)
  const [searchQuery, setSearchQuery] = useState(""); // Search input value

  // Filter options data
  const [courses, setCourses] = useState([]); // List of courses for filter dropdown
  const [teachers, setTeachers] = useState([]); // List of teachers for filter dropdown
  const [loadingFilters, setLoadingFilters] = useState(false); // Loading state for filter data

  /**
   * Fetch courses and teachers for filter dropdowns
   * 
   * Loads all courses and teachers in parallel when component mounts.
   * Used to populate the course and teacher filter dropdowns.
   * Only runs if user is admin.
   * Uses Promise.all for parallel fetching and .catch() to handle individual failures.
   */
  useEffect(() => {
    if (!isAdmin) return;
    
    const fetchFilters = async () => {
      setLoadingFilters(true);
      try {
        // Fetch courses and teachers in parallel for better performance
        const [coursesRes, teachersRes] = await Promise.all([
          api.get("/courses").catch(() => []), // Return empty array on error
          api.get("/users?role=teacher").catch(() => []), // Return empty array on error
        ]);
        
        // Normalize responses: API may return array directly or object with data property
        const coursesList = Array.isArray(coursesRes) ? coursesRes : coursesRes?.data || [];
        const teachersList = Array.isArray(teachersRes) ? teachersRes : teachersRes?.data || [];
        
        setCourses(coursesList);
        setTeachers(teachersList);
      } catch (error) {
        console.error("Error fetching filters:", error);
        // Continue with empty lists if fetch fails
      } finally {
        setLoadingFilters(false);
      }
    };

    fetchFilters();
  }, [isAdmin]);

  /**
   * Debounced search and filter effect
   * 
   * Triggers data fetch when search query or filters change.
   * Uses 500ms debounce to avoid excessive API calls while user is typing.
   * Only runs if user is admin (safety check).
   * 
   * Dependencies: selectedSemester, selectedCourse, selectedTeacher, searchQuery, isAdmin
   */
  useEffect(() => {
    if (!isAdmin) return;
    
    // Debounce: wait 500ms after user stops typing before fetching
    const timer = setTimeout(() => {
      fetchTimetable();
    }, 500);

    // Cleanup: clear timer if component unmounts or dependencies change
    return () => clearTimeout(timer);
  }, [selectedSemester, selectedCourse, selectedTeacher, searchQuery, isAdmin]);

  /**
   * Fetch timetable entries from the API with server-side filtering
   * 
   * Builds query parameters based on current search and filter state.
   * Handles response normalization (array or object with data property).
   * 
   * @async
   * @function fetchTimetable
   * @returns {Promise<void>}
   */
  const fetchTimetable = useCallback(async () => {
    setLoading(true);
    
    try {
      // Build query parameters for server-side filtering
      const params = new URLSearchParams();
      
      // Add optional filters if they have values
      if (selectedSemester) params.append('semester', selectedSemester);
      if (selectedCourse) params.append('courseId', selectedCourse);
      if (selectedTeacher) params.append('teacherId', selectedTeacher);
      if (searchQuery) params.append('search', searchQuery);
      
      // Make API request with query parameters
      const url = `/timetable?${params.toString()}`;
      const response = await api.get(url);
      
      // Normalize response: API may return array directly or object with data property
      const timetableList = Array.isArray(response) ? response : response?.data || [];
      
      setTimetable(timetableList);
    } catch (err) {
      console.error("Error fetching timetable:", err);
      // Set empty array on error to show "no entries" state
      setTimetable([]);
    } finally {
      setLoading(false);
    }
  }, [selectedSemester, selectedCourse, selectedTeacher, searchQuery]);

  const handleCreateTimetable = async (data) => {
    setSubmitting(true);
    try {
      await api.post("/timetable", data);
      success("Timetable entry created successfully!");
      setIsCreateModalOpen(false);
      fetchTimetable(); // Refresh list
    } catch (err) {
      showError(err.message || "Failed to create timetable entry");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateTimetable = async (data) => {
    setSubmitting(true);
    try {
      await api.patch(`/timetable/${selectedTimetable.id}`, data);
      success("Timetable entry updated successfully!");
      setIsUpdateModalOpen(false);
      setSelectedTimetable(null);
      fetchTimetable(); // Refresh list
    } catch (err) {
      showError(err.message || "Failed to update timetable entry");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTimetable = async () => {
    setSubmitting(true);
    try {
      await api.delete(`/timetable/${selectedTimetable.id}`);
      success("Timetable entry deleted successfully!");
      setIsDeleteDialogOpen(false);
      setSelectedTimetable(null);
      fetchTimetable(); // Refresh list
    } catch (err) {
      showError(err.message || "Failed to delete timetable entry");
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (timetableEntry) => {
    setSelectedTimetable(timetableEntry);
    setIsUpdateModalOpen(true);
  };

  const openDeleteDialog = (timetableEntry) => {
    setSelectedTimetable(timetableEntry);
    setIsDeleteDialogOpen(true);
  };

  /**
   * Group timetable entries by day of the week
   * 
   * Transforms flat array of timetable entries into an object
   * where keys are day names and values are arrays of entries for that day.
   * Used for displaying timetable in a day-by-day layout.
   * 
   * @constant {Object} groupedTimetable
   * @example
   * {
   *   "Monday": [entry1, entry2],
   *   "Tuesday": [entry3],
   *   ...
   * }
   */
  const groupedTimetable = timetable.reduce((acc, entry) => {
    // Initialize array for this day if it doesn't exist
    if (!acc[entry.dayOfWeek]) {
      acc[entry.dayOfWeek] = [];
    }
    // Add entry to the appropriate day's array
    acc[entry.dayOfWeek].push(entry);
    return acc;
  }, {});

  /**
   * Ordered list of days of the week
   * 
   * Used to render timetable cards in a consistent order.
   * Ensures days always appear in the same sequence regardless of data.
   */
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];


  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Timetable Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Manage class schedules and timings
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          startIcon={<Plus className="w-4 h-4" />}
        >
          Create Entry
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by course, room, or teacher..."
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
              options={["Fall 2024", "Spring 2025", "Summer 2025"]}
            />
          </div>
          <div>
            <Select
              label="Course"
              name="course"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              placeholder="All courses"
              disabled={loadingFilters}
              options={
                courses.length > 0
                  ? [
                      { value: "", label: "All courses" },
                      ...courses.map((course) => ({
                        value: course.id,
                        label: `${course.code} - ${course.name}`,
                      })),
                    ]
                  : []
              }
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
                        const teacherName = teacher.fullName || teacher.teacher?.user?.fullName || "Teacher";
                        return {
                          value: teacherId,
                          label: teacherName,
                        };
                      }),
                    ]
                  : []
              }
            />
          </div>
        </div>
      </Card>

      {/* Timetable View */}
      {loading ? (
        <Card>
          <div className="text-center py-8">
            <Loading size="md" />
            <p className="text-gray-600 mt-3">Loading timetable...</p>
          </div>
        </Card>
      ) : timetable.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">
              {selectedSemester || selectedCourse || selectedTeacher || searchQuery
                ? "No timetable entries found matching your filters"
                : "No timetable entries found"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {selectedSemester || selectedCourse || selectedTeacher || searchQuery
                ? "Try adjusting your filters or create new timetable entries"
                : "Create timetable entries to get started"}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {daysOfWeek.map((day) => {
            const dayEntries = groupedTimetable[day] || [];

            return (
              <Card key={day}>
                <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
                  {day}
                </h3>
                {dayEntries.length === 0 ? (
                  <p className="text-xs text-gray-400 py-2">No classes scheduled</p>
                ) : (
                  <div className="space-y-2">
                    {dayEntries
                      .sort((a, b) => a.startTime.localeCompare(b.startTime))
                      .map((entry) => (
                        <div
                          key={entry.id}
                          className="p-2 bg-gray-50 rounded-md border border-gray-200"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs sm:text-sm font-medium text-gray-900">
                                {entry.course?.name || entry.course?.code || "Course"}
                              </p>
                              <p className="text-xs text-gray-600">
                                {entry.startTime} - {entry.endTime}
                              </p>
                              <p className="text-xs text-gray-500">Room: {entry.room}</p>
                              {entry.course?.code && (
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {entry.course.code}
                                </p>
                              )}
                              {entry.teacher?.user?.fullName && (
                                <p className="text-xs text-indigo-600 mt-0.5 font-medium">
                                  Teacher: {entry.teacher.user.fullName}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => router.push(`/admin/timetable/${entry.id}`)}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="View Details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => openEditModal(entry)}
                                className="p-1 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => openDeleteDialog(entry)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Timetable Entry Modal */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create Timetable Entry"
          size="md"
        >
          <CreateTimetableForm
            onSubmit={handleCreateTimetable}
            onCancel={() => setIsCreateModalOpen(false)}
            loading={submitting}
          />
        </Modal>
      )}

      {/* Update Timetable Entry Modal */}
      {isUpdateModalOpen && selectedTimetable && (
        <Modal
          isOpen={isUpdateModalOpen}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedTimetable(null);
          }}
          title="Update Timetable Entry"
          size="md"
        >
          <UpdateTimetableForm
            timetable={selectedTimetable}
            onSubmit={handleUpdateTimetable}
            onCancel={() => {
              setIsUpdateModalOpen(false);
              setSelectedTimetable(null);
            }}
            loading={submitting}
          />
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && selectedTimetable && (
        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setSelectedTimetable(null);
          }}
          onConfirm={handleDeleteTimetable}
          title="Delete Timetable Entry"
          message={`Are you sure you want to delete this timetable entry? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          loading={submitting}
        />
      )}
    </div>
  );
}

