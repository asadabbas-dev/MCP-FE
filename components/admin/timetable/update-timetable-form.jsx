"use client";

import { useState, useEffect } from "react";
import Button from "@/components/common/button";
import Select from "@/components/common/select";
import { useToast } from "@/contexts/toast-context";
import { api } from "@/lib/utils/api";

/**
 * Update Timetable Form Component
 *
 * Form for admin to update timetable entry.
 */

export default function UpdateTimetableForm({ timetable, onSubmit, onCancel, loading }) {
  const { error: showError } = useToast();
  const [formData, setFormData] = useState({
    courseId: "",
    teacherId: "",
    dayOfWeek: "",
    startTime: "",
    endTime: "",
    room: "",
    semester: "",
  });
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [errors, setErrors] = useState({});
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingTeachers, setLoadingTeachers] = useState(false);

  useEffect(() => {
    if (timetable) {
      setFormData({
        courseId: timetable.courseId || timetable.course?.id || "",
        teacherId: timetable.teacherId || timetable.teacher?.id || "",
        dayOfWeek: timetable.dayOfWeek || "",
        startTime: timetable.startTime || "",
        endTime: timetable.endTime || "",
        room: timetable.room || "",
        semester: timetable.semester || "",
      });
    }
    fetchCourses();
    fetchTeachers();
  }, [timetable]);

  const fetchCourses = async () => {
    setLoadingCourses(true);
    try {
      const response = await api.get("/courses");
      const coursesList = Array.isArray(response) ? response : response?.data || [];
      setCourses(coursesList);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setCourses([]);
    } finally {
      setLoadingCourses(false);
    }
  };

  const fetchTeachers = async () => {
    setLoadingTeachers(true);
    try {
      const response = await api.get("/users?role=teacher");
      const teachersList = Array.isArray(response) ? response : response?.data || [];
      setTeachers(teachersList);
    } catch (err) {
      console.error("Error fetching teachers:", err);
      setTeachers([]);
    } finally {
      setLoadingTeachers(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.courseId) {
      newErrors.courseId = "Course is required";
    }

    if (!formData.teacherId) {
      newErrors.teacherId = "Teacher is required";
    }

    if (!formData.dayOfWeek) {
      newErrors.dayOfWeek = "Day of week is required";
    }

    if (!formData.startTime) {
      newErrors.startTime = "Start time is required";
    }

    if (!formData.endTime) {
      newErrors.endTime = "End time is required";
    }

    if (!formData.room.trim()) {
      newErrors.room = "Room is required";
    }

    if (!formData.semester.trim()) {
      newErrors.semester = "Semester is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      showError("Please fix the errors in the form");
      return;
    }

    const updateData = {
      courseId: formData.courseId,
      teacherId: formData.teacherId,
      dayOfWeek: formData.dayOfWeek,
      startTime: formData.startTime,
      endTime: formData.endTime,
      room: formData.room,
      semester: formData.semester,
    };

    try {
      await onSubmit(updateData);
    } catch (err) {
      console.error("Error updating timetable:", err);
    }
  };

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="Course"
        name="courseId"
        value={formData.courseId}
        onChange={handleChange}
        placeholder={
          loadingCourses
            ? "Loading courses..."
            : courses.length === 0
            ? "No courses available"
            : "Select a course"
        }
        error={errors.courseId}
        required
        disabled={loadingCourses || courses.length === 0}
        options={
          courses.length > 0
            ? courses.map((course) => ({
                value: course.id,
                label: `${course.code} - ${course.name}`,
              }))
            : []
        }
      />

      <Select
        label="Assign Teacher"
        name="teacherId"
        value={formData.teacherId}
        onChange={handleChange}
        placeholder={
          loadingTeachers
            ? "Loading teachers..."
            : teachers.length === 0
            ? "No teachers available"
            : "Select a teacher"
        }
        error={errors.teacherId}
        required
        disabled={loadingTeachers || teachers.length === 0}
        options={
          teachers.length > 0
            ? teachers.map((teacher) => {
                const teacherId = teacher.teacher?.id || teacher.id;
                const teacherName = teacher.fullName || teacher.teacher?.user?.fullName || "Teacher";
                const teacherEmail = teacher.email || teacher.teacher?.user?.email || "";
                return {
                  value: teacherId,
                  label: `${teacherName} (${teacherEmail})`,
                };
              })
            : []
        }
      />

      <Select
        label="Day of Week"
        name="dayOfWeek"
        value={formData.dayOfWeek}
        onChange={handleChange}
        placeholder="Select a day"
        error={errors.dayOfWeek}
        required
        options={daysOfWeek}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Time <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          {errors.startTime && (
            <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Time <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          {errors.endTime && (
            <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>
          )}
        </div>
      </div>

      <Select
        label="Room"
        name="room"
        value={formData.room}
        onChange={handleChange}
        placeholder="Select room"
        error={errors.room}
        required
        options={[
          "A-101",
          "A-102",
          "A-103",
          "A-104",
          "A-105",
          "B-201",
          "B-202",
          "B-203",
          "B-204",
          "B-205",
          "C-301",
          "C-302",
          "C-303",
          "C-304",
          "C-305",
          "D-401",
          "D-402",
          "D-403",
          "Lab-1",
          "Lab-2",
          "Lab-3",
          "Auditorium",
          "Conference Room",
        ]}
      />

      <Select
        label="Semester"
        name="semester"
        value={formData.semester}
        onChange={handleChange}
        placeholder="Select semester"
        error={errors.semester}
        required
        options={["Fall 2024", "Spring 2025", "Summer 2025"]}
      />

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Update Timetable Entry
        </Button>
      </div>
    </form>
  );
}

