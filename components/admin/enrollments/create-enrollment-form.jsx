"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@/components/common/button";
import Select from "@/components/common/select";
import Loading from "@/components/common/loading";
import { api } from "@/lib/utils/api";
import { useToast } from "@/contexts/toast-context";

/**
 * Create Enrollment Form Schema
 * Validates student assignment to course with section
 */
const createEnrollmentSchema = yup.object().shape({
  studentId: yup.string().required("Student is required"),
  courseId: yup.string().required("Course is required"),
  section: yup.string().required("Section is required"),
});

/**
 * Create Enrollment Form Component
 *
 * Form for admin to assign a student to a course.
 * Allows selecting student, course, and section.
 *
 * @component
 * @param {Function} onSubmit - Callback when form is submitted
 * @param {Function} onCancel - Callback when form is cancelled
 * @param {boolean} loading - Loading state for form submission
 * @param {string} defaultCourseId - Pre-selected course ID (optional, for course detail page)
 * @returns {JSX.Element} Enrollment creation form
 */
export default function CreateEnrollmentForm({
  onSubmit,
  onCancel,
  loading = false,
  defaultCourseId = null,
}) {
  const { error: showError } = useToast();
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(createEnrollmentSchema),
    defaultValues: {
      studentId: "",
      courseId: defaultCourseId || "",
      section: "",
    },
  });

  const selectedCourseId = watch("courseId");

  /**
   * Fetch students and courses on component mount
   */
  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

  /**
   * Update sections when course changes
   * Sections are typically predefined (A, B, C, etc.)
   */
  useEffect(() => {
    if (selectedCourseId) {
      // Reset section when course changes
      setValue("section", "");
      // You can fetch sections from the course or use predefined ones
      setSections([
        { value: "A", label: "Section A" },
        { value: "B", label: "Section B" },
        { value: "C", label: "Section C" },
        { value: "D", label: "Section D" },
        { value: "Morning", label: "Morning" },
        { value: "Evening", label: "Evening" },
      ]);
    } else {
      setSections([]);
    }
  }, [selectedCourseId, setValue]);

  /**
   * Fetch all students for the dropdown
   */
  const fetchStudents = async () => {
    setLoadingStudents(true);
    try {
      const response = await api.get("/users?role=student");
      const studentsList = Array.isArray(response) ? response : response?.data || [];
      setStudents(
        studentsList.map((student) => ({
          value: student.student?.id || student.id,
          label: `${student.fullName} (${student.student?.rollNumber || "N/A"})`,
        }))
      );
    } catch (err) {
      console.error("Error fetching students:", err);
      showError("Failed to load students");
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  /**
   * Fetch all courses for the dropdown
   */
  const fetchCourses = async () => {
    setLoadingCourses(true);
    try {
      const response = await api.get("/courses");
      const coursesList = Array.isArray(response) ? response : response?.data || [];
      setCourses(
        coursesList.map((course) => ({
          value: course.id,
          label: `${course.code} - ${course.name} (${course.semester || "N/A"})`,
        }))
      );
    } catch (err) {
      console.error("Error fetching courses:", err);
      showError("Failed to load courses");
      setCourses([]);
    } finally {
      setLoadingCourses(false);
    }
  };

  /**
   * Handle form submission
   */
  const handleFormSubmit = async (data) => {
    await onSubmit(data);
    reset();
  };

  /**
   * Handle form cancellation
   */
  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Select
        label="Student"
        name="studentId"
        register={register}
        placeholder={
          loadingStudents
            ? "Loading students..."
            : students.length === 0
            ? "No students available"
            : "Select a student"
        }
        error={errors.studentId?.message}
        required
        disabled={loadingStudents || students.length === 0}
        options={students}
      />

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
        disabled={loadingCourses || courses.length === 0 || !!defaultCourseId}
        options={courses}
      />

      <Select
        label="Section"
        name="section"
        register={register}
        placeholder={
          !selectedCourseId
            ? "Select a course first"
            : sections.length === 0
            ? "No sections available"
            : "Select a section"
        }
        error={errors.section?.message}
        required
        disabled={!selectedCourseId || sections.length === 0}
        options={sections}
      />

      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && (
            <span className="mr-2">
              <Loading size="sm" />
            </span>
          )}
          Assign Student
        </Button>
      </div>
    </form>
  );
}

