"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@/components/common/button";
import Input from "@/components/common/input";
import Select from "@/components/common/select";
import Loading from "@/components/common/loading";
import { api } from "@/lib/utils/api";

const createAssignmentSchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must be less than 200 characters"),
  courseId: yup.string().required("Please select a course"),
  semester: yup.string().required("Semester is required"),
  section: yup.string().optional(), // Optional - null means all sections
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be less than 2000 characters"),
  dueDate: yup
    .date()
    .required("Due date is required")
    .min(new Date(), "Due date must be in the future"),
  totalMarks: yup
    .number()
    .required("Total marks is required")
    .min(1, "Total marks must be at least 1")
    .max(1000, "Total marks must be at most 1000"),
});

export default function CreateAssignmentForm({
  onSubmit,
  onCancel,
  loading = false,
}) {
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [sections, setSections] = useState([]);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(createAssignmentSchema),
    defaultValues: {
      title: "",
      courseId: "",
      semester: "",
      section: "",
      description: "",
      dueDate: "",
      totalMarks: "",
    },
  });

  const watchedCourseId = watch("courseId");

  /**
   * Fetch teacher's assigned courses for dropdown
   */
  useEffect(() => {
    fetchCourses();
  }, []);

  /**
   * When course is selected, fetch its details to get semester and sections
   */
  useEffect(() => {
    if (watchedCourseId) {
      fetchCourseDetails(watchedCourseId);
    } else {
      setSelectedCourse(null);
      setSections([]);
    }
  }, [watchedCourseId]);

  const fetchCourses = async () => {
    setLoadingCourses(true);
    try {
      const response = await api.get("/courses/teacher/my-courses");
      const coursesList = Array.isArray(response) ? response : response?.data || [];
      
      // Transform courses for dropdown
      const courseOptions = coursesList.map((course) => ({
        value: course.id,
        label: `${course.code} - ${course.name} (${course.semester || "N/A"})`,
        semester: course.semester,
      }));
      
      setCourses(courseOptions);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setCourses([]);
    } finally {
      setLoadingCourses(false);
    }
  };

  /**
   * Fetch course details to get available sections
   */
  const fetchCourseDetails = async (courseId) => {
    try {
      const response = await api.get(`/courses/${courseId}`);
      const course = response;
      
      setSelectedCourse(course);
      
      // Extract unique sections from enrollments
      const enrollments = course?.enrollments || [];
      const uniqueSections = [...new Set(enrollments.map(e => e.section).filter(Boolean))];
      
      // Create section options
      const sectionOptions = [
        { value: "", label: "All Sections" },
        ...uniqueSections.map(section => ({
          value: section,
          label: `Section ${section}`,
        })),
      ];
      
      setSections(sectionOptions);
    } catch (err) {
      console.error("Error fetching course details:", err);
      setSections([{ value: "", label: "All Sections" }]);
    }
  };

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
      <Input
        label="Assignment Title"
        name="title"
        placeholder="Enter assignment title"
        register={register}
        error={errors.title?.message}
        required
      />

      <Select
        label="Course"
        name="courseId"
        register={register}
        placeholder={loadingCourses ? "Loading courses..." : "Select a course"}
        options={courses}
        error={errors.courseId?.message}
        required
        disabled={loadingCourses || courses.length === 0}
      />
      {!loadingCourses && courses.length === 0 && (
        <p className="text-sm text-yellow-600">
          No courses assigned. Please contact admin to assign courses.
        </p>
      )}

      {/* Semester - auto-filled from course, but editable */}
      <Input
        label="Semester"
        name="semester"
        register={register}
        placeholder="e.g., Fall 2024"
        error={errors.semester?.message}
        required
        defaultValue={selectedCourse?.semester || ""}
      />

      {/* Section - optional, shows available sections from enrollments */}
      <Select
        label="Section (Optional)"
        name="section"
        register={register}
        placeholder="All Sections (leave empty for all sections)"
        options={sections}
        error={errors.section?.message}
        disabled={!selectedCourse || sections.length === 0}
      />
      {selectedCourse && sections.length === 0 && (
        <p className="text-xs text-gray-500">
          No sections found for this course. Assignment will be for all students.
        </p>
      )}

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          {...register("description")}
          rows={6}
          placeholder="Enter assignment description and requirements..."
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none resize-none"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Due Date"
          name="dueDate"
          type="date"
          register={register}
          error={errors.dueDate?.message}
          required
        />

        <Input
          label="Total Marks"
          name="totalMarks"
          type="number"
          placeholder="100"
          register={register}
          error={errors.totalMarks?.message}
          required
        />
      </div>

      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && (
            <span className="mr-2">
              <Loading size="sm" />
            </span>
          )}
          Create Assignment
        </Button>
      </div>
    </form>
  );
}

