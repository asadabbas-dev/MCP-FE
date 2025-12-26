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
  Calendar,
  Clock,
  MapPin,
  BookOpen,
  User,
} from "lucide-react";
import { api } from "@/lib/utils/api";
import { useToast } from "@/contexts/toast-context";
import Modal from "@/components/common/modal";
import UpdateTimetableForm from "@/components/admin/timetable/update-timetable-form";
import ConfirmDialog from "@/components/common/confirm-dialog";

/**
 * Timetable Detail Component
 *
 * Displays comprehensive information about a single timetable entry.
 * Allows admin to view, edit, and delete timetable entries.
 *
 * Features:
 * - View complete timetable entry (day, time, course, teacher, room, semester)
 * - Edit timetable entry via modal
 * - Delete timetable entry with confirmation
 * - Navigate back to timetable list
 *
 * @component
 * @returns {JSX.Element} Timetable entry detail view with edit/delete actions
 */
export default function TimetableDetail() {
  // Next.js routing hooks
  const params = useParams(); // Get dynamic route parameter (timetable entry ID)
  const router = useRouter(); // For programmatic navigation

  // Toast notifications
  const { success, error: showError } = useToast();

  // Component state
  const [timetable, setTimetable] = useState(null); // Current timetable entry data
  const [loading, setLoading] = useState(true); // Initial data loading state
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // Edit modal visibility
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // Delete confirmation dialog visibility
  const [submitting, setSubmitting] = useState(false); // Form submission loading state

  /**
   * Fetch timetable entry data when component mounts or ID changes
   *
   * Triggers data fetch whenever the timetable entry ID in the URL changes.
   * This handles navigation between different timetable detail pages.
   */
  useEffect(() => {
    if (params.id) {
      fetchTimetable();
    }
  }, [params.id]);

  /**
   * Fetch timetable entry details from the API
   *
   * Retrieves complete timetable entry information including:
   * - Schedule info (day of week, start time, end time)
   * - Course information
   * - Teacher information
   * - Location (room)
   * - Semester
   *
   * @async
   * @function fetchTimetable
   * @returns {Promise<void>}
   */
  const fetchTimetable = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/timetable/${params.id}`);
      setTimetable(response);
    } catch (err) {
      console.error("Error fetching timetable:", err);
      showError(err.message || "Failed to load timetable details");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle updating timetable entry information
   *
   * Updates timetable entry data via API.
   * Refreshes timetable entry data after successful update.
   *
   * @async
   * @function handleUpdateTimetable
   * @param {Object} data - Timetable entry data to update
   * @param {string} data.dayOfWeek - Updated day of week
   * @param {string} data.startTime - Updated start time
   * @param {string} data.endTime - Updated end time
   * @param {number} data.courseId - Updated course ID
   * @param {number} data.teacherId - Updated teacher ID
   * @param {string} data.room - Updated room
   * @param {string} data.semester - Updated semester
   * @returns {Promise<void>}
   */
  const handleUpdateTimetable = async (data) => {
    setSubmitting(true);
    try {
      await api.patch(`/timetable/${params.id}`, data);
      success("Timetable entry updated successfully!");
      setIsUpdateModalOpen(false);
      fetchTimetable(); // Refresh to show updated data
    } catch (err) {
      showError(err.message || "Failed to update timetable entry");
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Handle deleting a timetable entry
   *
   * Permanently deletes the timetable entry from the system.
   * Redirects to timetable list page after successful deletion.
   *
   * @async
   * @function handleDeleteTimetable
   * @returns {Promise<void>}
   */
  const handleDeleteTimetable = async () => {
    setSubmitting(true);
    try {
      await api.delete(`/timetable/${params.id}`);
      success("Timetable entry deleted successfully!");
      router.push("/admin/timetable"); // Navigate back to list
    } catch (err) {
      showError(err.message || "Failed to delete timetable entry");
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
            <p className="text-gray-600 mt-3">Loading timetable details...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!timetable) {
    return (
      <div className="p-6">
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-600">Timetable entry not found</p>
            <Button
              variant="outline"
              onClick={() => router.push("/admin/timetable")}
              className="mt-4"
            >
              Back to Timetable
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
            onClick={() => router.push("/admin/timetable")}
            startIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Timetable Entry Details
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              View complete timetable information
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

      {/* Timetable Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <Card title="Schedule Information">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Day of Week</p>
                    <p className="text-sm font-medium text-gray-900">
                      {timetable.dayOfWeek}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Time</p>
                    <p className="text-sm font-medium text-gray-900">
                      {timetable.startTime} - {timetable.endTime}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Room</p>
                    <p className="text-sm font-medium text-gray-900">
                      {timetable.room}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Semester</p>
                    <p className="text-sm font-medium text-gray-900">
                      {timetable.semester}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {timetable.course && (
            <Card title="Course Information">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Course</p>
                    <p className="text-sm font-medium text-gray-900">
                      {timetable.course.name}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {timetable.course.code}
                    </p>
                    {timetable.course.creditHours && (
                      <p className="text-xs text-gray-500 mt-1">
                        {timetable.course.creditHours} Credit Hour
                        {timetable.course.creditHours > 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {timetable.teacher?.user && (
            <Card title="Teacher Information">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Assigned Teacher</p>
                    <p className="text-sm font-medium text-gray-900">
                      {timetable.teacher.user.fullName}
                    </p>
                    {timetable.teacher.department && (
                      <p className="text-xs text-gray-600 mt-1">
                        {timetable.teacher.department}
                      </p>
                    )}
                    {timetable.teacher.designation && (
                      <p className="text-xs text-gray-500 mt-1">
                        {timetable.teacher.designation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          <Card title="Entry Details">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-md">
                  Active
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Update Modal */}
      {isUpdateModalOpen && timetable && (
        <Modal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          title="Update Timetable Entry"
          size="md"
        >
          <UpdateTimetableForm
            timetable={timetable}
            onSubmit={handleUpdateTimetable}
            onCancel={() => setIsUpdateModalOpen(false)}
            loading={submitting}
          />
        </Modal>
      )}

      {/* Delete Dialog */}
      {isDeleteDialogOpen && timetable && (
        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteTimetable}
          title="Delete Timetable Entry"
          message="Are you sure you want to delete this timetable entry? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          loading={submitting}
        />
      )}
    </div>
  );
}
