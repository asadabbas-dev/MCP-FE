"use client";

import { useState, useEffect } from "react";
import Card from "@/components/common/card";
import Button from "@/components/common/button";
import { Calendar, Plus } from "lucide-react";
import Modal from "@/components/common/modal";
import { useAuth } from "@/contexts/auth-context";
import { api } from "@/lib/utils/api";
import { useToast } from "@/contexts/toast-context";
import CreateTimetableForm from "@/components/admin/create-timetable-form";
import Loading from "@/components/common/loading";
import { mockTimetable } from "@/lib/mock-data/admin-mock-data";

/**
 * Admin Timetable Management Page
 *
 * Allows admin to:
 * - View all timetable entries
 * - Create new timetable entries
 * - Manage class schedules
 */

export default function AdminTimetablePage() {
  const { isAdmin } = useAuth();
  const { success, error: showError } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState("Fall 2024");

  // Fetch timetable
  useEffect(() => {
    if (isAdmin && selectedSemester) {
      fetchTimetable();
    }
  }, [isAdmin, selectedSemester]);

  const fetchTimetable = async () => {
    setLoading(true);
    
    // Check if using mock token - use mock data directly
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token && token.startsWith("mock-token-")) {
      const filteredMock = mockTimetable.filter((entry) => entry.semester === selectedSemester);
      setTimetable(filteredMock);
      setLoading(false);
      return;
    }
    
    try {
      const response = await api.get(`/timetable?semester=${selectedSemester}`);
      const timetableList = Array.isArray(response) ? response : response?.data || [];
      // Filter mock data by semester or use real data
      const filteredMock = mockTimetable.filter((entry) => entry.semester === selectedSemester);
      // Use mock data if no real data available
      setTimetable(timetableList.length > 0 ? timetableList : filteredMock);
    } catch (err) {
      console.error("Error fetching timetable:", err);
      // Use mock data on error, filtered by selected semester
      const filteredMock = mockTimetable.filter((entry) => entry.semester === selectedSemester);
      setTimetable(filteredMock);
    } finally {
      setLoading(false);
    }
  };

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

  // Group timetable by day
  const groupedTimetable = timetable.reduce((acc, entry) => {
    if (!acc[entry.dayOfWeek]) {
      acc[entry.dayOfWeek] = [];
    }
    acc[entry.dayOfWeek].push(entry);
    return acc;
  }, {});

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

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

      {/* Semester Filter */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <label className="text-sm font-medium text-gray-700">
            Select Semester:
          </label>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none text-sm sm:text-base"
          >
            <option value="Fall 2024">Fall 2024</option>
            <option value="Spring 2025">Spring 2025</option>
            <option value="Summer 2025">Summer 2025</option>
          </select>
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
            <p className="text-gray-600">No timetable entries found</p>
            <p className="text-sm text-gray-500 mt-1">
              Create timetable entries to get started
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
    </div>
  );
}

