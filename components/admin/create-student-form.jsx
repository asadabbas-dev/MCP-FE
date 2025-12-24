"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@/components/common/button";
import Input from "@/components/common/input";
import Select from "@/components/common/select";
import Loading from "@/components/common/loading";

/**
 * Create Student Form Component
 *
 * Form for admin to create new student accounts.
 * Uses React Hook Form and Yup for validation.
 *
 * Fields:
 * - Full Name (required)
 * - Email (required, valid email)
 * - Password (required, min 6 characters)
 * - Roll Number (optional, auto-generated if not provided)
 * - Current Semester (optional, defaults to 1)
 * - Program (optional, defaults to "BS Computer Science")
 */

const createStudentSchema = yup.object().shape({
  fullName: yup
    .string()
    .required("Full name is required")
    .min(3, "Full name must be at least 3 characters")
    .max(100, "Full name must be less than 100 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  rollNumber: yup.string().optional(),
  currentSemester: yup.number().optional().min(1).max(8),
  program: yup.string().optional(),
});

export default function CreateStudentForm({
  onSubmit,
  onCancel,
  loading = false,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(createStudentSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      rollNumber: "",
      currentSemester: 1,
      program: "BS Computer Science",
    },
  });

  const handleFormSubmit = async (data) => {
    // Convert currentSemester to number if provided
    const submitData = {
      ...data,
      currentSemester: data.currentSemester
        ? parseInt(data.currentSemester, 10)
        : undefined,
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
        label="Full Name"
        name="fullName"
        placeholder="Enter student full name"
        register={register}
        error={errors.fullName?.message}
        required
      />

      <Input
        label="Email Address"
        name="email"
        type="email"
        placeholder="Enter student email"
        register={register}
        error={errors.email?.message}
        required
      />

      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="Enter password (min 6 characters)"
        register={register}
        error={errors.password?.message}
        required
      />

      <Input
        label="Roll Number (Optional)"
        name="rollNumber"
        placeholder="Auto-generated if not provided"
        register={register}
        error={errors.rollNumber?.message}
      />

      <div>
        <label
          htmlFor="currentSemester"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Current Semester (Optional)
        </label>
        <select
          id="currentSemester"
          {...register("currentSemester")}
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
            <option key={sem} value={sem}>
              Semester {sem}
            </option>
          ))}
        </select>
        {errors.currentSemester && (
          <p className="mt-1 text-sm text-red-600">
            {errors.currentSemester.message}
          </p>
        )}
      </div>

      <Input
        label="Program (Optional)"
        name="program"
        placeholder="e.g., BS Computer Science"
        register={register}
        error={errors.program?.message}
      />

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
          Create Student
        </Button>
      </div>
    </form>
  );
}

