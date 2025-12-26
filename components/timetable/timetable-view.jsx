"use client";

import { useState, useEffect } from "react";
import Card from "@/components/common/card";
import { Calendar, Clock, MapPin } from "lucide-react";
import { api } from "@/lib/utils/api";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/contexts/toast-context";
import Loading from "@/components/common/loading";
import EmptyState from "@/components/common/empty-state";

/**
 * Timetable View Component
 *
 * Displays class schedule for students or teachers.
 * For teachers, shows only their assigned classes.
 * For students, shows all their enrolled courses.
 *
 * Features:
 * - Day-by-day schedule view
 * - Course details (name, code, time, room, instructor)
 * - Responsive grid layout
 * - Empty states for days with no classes
 */
export default function TimetableView() {
  const { isTeacher, user } = useAuth();
  const { error: showError } = useToast();
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  /**
   * Fetch timetable data
   * For teachers: filters by teacherId
   * For students: shows all enrolled courses
   */
  useEffect(() => {
    fetchTimetable();
  }, [isTeacher, user]);

  const fetchTimetable = async () => {
    setLoading(true);
    try {
      let url = "/timetable";
      
      // If teacher, we need to get the teacher ID from the user profile
      if (isTeacher) {
        // First, fetch user profile to get teacher ID
        try {
          const userProfile = await api.get("/users/profile");
          const teacherId = userProfile?.teacher?.id;
          if (teacherId) {
            url += `?teacherId=${teacherId}`;
          }
        } catch (profileErr) {
          console.error("Error fetching user profile:", profileErr);
          // Continue without filter if profile fetch fails
        }
      }
      
      const response = await api.get(url);
      const timetableList = Array.isArray(response) ? response : response?.data || [];
      setTimetable(timetableList);
    } catch (err) {
      console.error("Error fetching timetable:", err);
      showError(err.message || "Failed to load timetable");
      setTimetable([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Group timetable entries by day of the week
   */
  const groupedTimetable = timetable.reduce((acc, entry) => {
    if (!acc[entry.dayOfWeek]) {
      acc[entry.dayOfWeek] = [];
    }
    acc[entry.dayOfWeek].push(entry);
    return acc;
  }, {});

  // Sort entries within each day by start time
  Object.keys(groupedTimetable).forEach((day) => {
    groupedTimetable[day].sort((a, b) => {
      return a.startTime.localeCompare(b.startTime);
    });
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Timetable</h1>
          <p className="text-gray-600 mt-1">
            {isTeacher ? "View your teaching schedule" : "View your class schedule for the current semester"}
          </p>
        </div>
        <Card>
          <div className="text-center py-8">
            <Loading size="md" />
            <p className="text-gray-600 mt-3">Loading timetable...</p>
          </div>
        </Card>
      </div>
    );
  }

  const hasAnyClasses = Object.keys(groupedTimetable).some(
    (day) => groupedTimetable[day]?.length > 0
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Timetable</h1>
        <p className="text-gray-600 mt-1">
          {isTeacher ? "View your teaching schedule" : "View your class schedule for the current semester"}
        </p>
      </div>

      {!hasAnyClasses ? (
        <Card>
          <EmptyState
            icon={Calendar}
            title="No classes scheduled"
            description={
              isTeacher
                ? "You don't have any classes scheduled at the moment."
                : "No classes scheduled for the current semester."
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {days.map((day) => (
            <Card key={day} title={day} className="min-h-[400px]">
              <div className="space-y-3">
                {groupedTimetable[day] && groupedTimetable[day].length > 0 ? (
                  groupedTimetable[day].map((entry, index) => (
                    <div
                      key={entry.id || index}
                      className="p-3 bg-indigo-50 rounded-lg border border-indigo-100"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="w-4 h-4 text-indigo-600" />
                        <span className="text-xs font-medium text-indigo-900">
                          {entry.startTime} - {entry.endTime}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">
                        {entry.course?.name || "Unknown Course"}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2">
                        {entry.course?.code || "N/A"}
                      </p>
                      <div className="flex items-center text-xs text-gray-600 mb-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        {entry.room || "TBA"}
                      </div>
                      {!isTeacher && entry.teacher?.user && (
                        <p className="text-xs text-gray-500">
                          {entry.teacher.user.fullName}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-8">
                    No classes scheduled
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
