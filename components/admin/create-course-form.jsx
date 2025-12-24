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

/**
 * Create Course Form Component
 *
 * Form for admin to create new courses.
 * Uses React Hook Form and Yup for validation.
 *
 * Fields:
 * - Course Code (required)
 * - Course Name (required)
 * - Credit Hours (required, number)
 * - Description (optional)
 * - Department (required)
 * - Teacher (required, select from teachers list)
 */

const createCourseSchema = yup.object().shape({
  code: yup
    .string()
    .required("Course code is required")
    .matches(/^[A-Z]{2,4}\d{3,4}$/, "Course code must be in format like CS101"),
  name: yup
    .string()
    .required("Course name is required")
    .min(3, "Course name must be at least 3 characters")
    .max(200, "Course name must be less than 200 characters"),
  creditHours: yup
    .number()
    .required("Credit hours is required")
    .min(1, "Credit hours must be at least 1")
    .max(6, "Credit hours must be at most 6"),
  description: yup.string().optional(),
  semester: yup.string().required("Semester is required"),
  teacherId: yup.string().required("Teacher is required"),
});

export default function CreateCourseForm({
  onSubmit,
  onCancel,
  loading = false,
}) {
  const [teachers, setTeachers] = useState([]);
  const [loadingTeachers, setLoadingTeachers] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(createCourseSchema),
    defaultValues: {
      code: "",
      name: "",
      creditHours: 3,
      description: "",
      semester: "Fall 2024",
      teacherId: "",
    },
  });

  // Fetch teachers list
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await api.get("/users?role=teacher");
        // If response is an array, use it directly; otherwise extract from response
        const teachersList = Array.isArray(response) ? response : response?.data || [];
        // Use mock data if no real data
        if (teachersList.length === 0) {
          const { mockTeachers } = await import("@/lib/mock-data/admin-mock-data");
          setTeachers(mockTeachers);
        } else {
          setTeachers(teachersList);
        }
      } catch (error) {
        console.error("Error fetching teachers:", error);
        // Use mock data on error
        import("@/lib/mock-data/admin-mock-data").then(({ mockTeachers }) => {
          setTeachers(mockTeachers);
        });
      } finally {
        setLoadingTeachers(false);
      }
    };

    fetchTeachers();
  }, []);

  const handleFormSubmit = async (data) => {
    const submitData = {
      ...data,
      creditHours: parseInt(data.creditHours, 10),
    };
    await onSubmit(submitData);
    reset();
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        label="Course Code"
        name="code"
        placeholder="e.g., CS101"
        register={register}
        error={errors.code?.message}
        required
      />

      <Input
        label="Course Name"
        name="name"
        placeholder="Enter course name"
        register={register}
        error={errors.name?.message}
        required
      />

      <div>
        <label
          htmlFor="creditHours"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Credit Hours <span className="text-red-500">*</span>
        </label>
        <select
          id="creditHours"
          {...register("creditHours")}
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none"
        >
          {[1, 2, 3, 4, 5, 6].map((hours) => (
            <option key={hours} value={hours}>
              {hours} Credit Hour{hours > 1 ? "s" : ""}
            </option>
          ))}
        </select>
        {errors.creditHours && (
          <p className="mt-1 text-sm text-red-600">
            {errors.creditHours.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description (Optional)
        </label>
        <textarea
          id="description"
          {...register("description")}
          rows={4}
          placeholder="Enter course description..."
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none resize-none"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      <Select
        label="Semester"
        name="semester"
        register={register}
        placeholder="Select semester"
        error={errors.semester?.message}
        required
        options={["Fall 2024", "Spring 2025", "Summer 2025"]}
      />

      <Select
        label="Assign Teacher"
        name="teacherId"
        register={register}
        placeholder={
          loadingTeachers
            ? "Loading teachers..."
            : teachers.length === 0
            ? "No teachers available"
            : "Select a teacher"
        }
        error={errors.teacherId?.message}
        required
        disabled={loadingTeachers || teachers.length === 0}
        options={
          teachers.length > 0
            ? teachers.map((teacher) => {
                // Handle both direct teacher objects and teacher.user structure
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

      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading || loadingTeachers}>
          {loading && (
            <span className="mr-2">
              <Loading size="sm" />
            </span>
          )}
          Create Course
        </Button>
      </div>
    </form>
  );
}

