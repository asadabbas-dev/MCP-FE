"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@/components/common/button";
import Select from "@/components/common/select";
import Input from "@/components/common/input";
import Loading from "@/components/common/loading";
import { api } from "@/lib/utils/api";

/**
 * Create Timetable Form Component
 *
 * Form for admin to create timetable entries.
 * Uses React Hook Form and Yup for validation.
 *
 * Fields:
 * - Course (required, select from courses)
 * - Day of Week (required)
 * - Start Time (required, HH:MM format)
 * - End Time (required, HH:MM format)
 * - Room (required)
 * - Semester (required)
 */

const createTimetableSchema = yup.object().shape({
  courseId: yup.string().required("Course is required"),
  dayOfWeek: yup.string().required("Day of week is required"),
  startTime: yup
    .string()
    .required("Start time is required")
    .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Time must be in HH:MM format"),
  endTime: yup
    .string()
    .required("End time is required")
    .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Time must be in HH:MM format"),
  room: yup
    .string()
    .required("Room is required")
    .min(2, "Room must be at least 2 characters"),
  semester: yup.string().required("Semester is required"),
});

export default function CreateTimetableForm({
  onSubmit,
  onCancel,
  loading = false,
}) {
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(createTimetableSchema),
    defaultValues: {
      courseId: "",
      dayOfWeek: "",
      startTime: "",
      endTime: "",
      room: "",
      semester: "Fall 2024",
    },
  });

  // Fetch courses list
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/courses");
        const coursesList = Array.isArray(response) ? response : response?.data || [];
        // Use mock data if no real data
        if (coursesList.length === 0) {
          const { mockCourses } = await import("@/lib/mock-data/admin-mock-data");
          setCourses(mockCourses);
        } else {
          setCourses(coursesList);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        // Use mock data on error
        import("@/lib/mock-data/admin-mock-data").then(({ mockCourses }) => {
          setCourses(mockCourses);
        });
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  const handleFormSubmit = async (data) => {
    await onSubmit(data);
    reset();
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Select
        label="Course"
        name="courseId"
        register={register}
        placeholder={
          loadingCourses
            ? "Loading courses..."
            : courses.length === 0
            ? "No courses available"
            : "Select a course"
        }
        error={errors.courseId?.message}
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
        label="Day of Week"
        name="dayOfWeek"
        register={register}
        placeholder="Select day"
        error={errors.dayOfWeek?.message}
        required
        options={[
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ]}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Start Time"
          name="startTime"
          type="time"
          placeholder="09:00"
          register={register}
          error={errors.startTime?.message}
          required
        />

        <Input
          label="End Time"
          name="endTime"
          type="time"
          placeholder="10:30"
          register={register}
          error={errors.endTime?.message}
          required
        />
      </div>

      <Input
        label="Room"
        name="room"
        placeholder="e.g., A-101"
        register={register}
        error={errors.room?.message}
        required
      />

      <Select
        label="Semester"
        name="semester"
        register={register}
        placeholder="Select semester"
        error={errors.semester?.message}
        required
        options={["Fall 2024", "Spring 2025", "Summer 2025"]}
      />

      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading || loadingCourses}>
          {loading && (
            <span className="mr-2">
              <Loading size="sm" />
            </span>
          )}
          Create Entry
        </Button>
      </div>
    </form>
  );
}

