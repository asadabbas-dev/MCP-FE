"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@/components/common/button";
import Input from "@/components/common/input";
import Loading from "@/components/common/loading";

/**
 * Create Teacher Form Component
 *
 * Form for admin to create new teacher accounts.
 * Uses React Hook Form and Yup for validation.
 *
 * Fields:
 * - Full Name (required)
 * - Email (required, valid email)
 * - Password (required, min 6 characters)
 * - Employee ID (optional, auto-generated if not provided)
 * - Department (optional, defaults to "Computer Science")
 * - Designation (optional, defaults to "Assistant Professor")
 */

const createTeacherSchema = yup.object().shape({
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
  employeeId: yup.string().optional(),
  department: yup.string().optional(),
  designation: yup.string().optional(),
});

export default function CreateTeacherForm({
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
    resolver: yupResolver(createTeacherSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      employeeId: "",
      department: "Computer Science",
      designation: "Assistant Professor",
    },
  });

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
        label="Full Name"
        name="fullName"
        placeholder="Enter teacher full name"
        register={register}
        error={errors.fullName?.message}
        required
      />

      <Input
        label="Email Address"
        name="email"
        type="email"
        placeholder="Enter teacher email"
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
        label="Employee ID (Optional)"
        name="employeeId"
        placeholder="Auto-generated if not provided"
        register={register}
        error={errors.employeeId?.message}
      />

      <Input
        label="Department (Optional)"
        name="department"
        placeholder="e.g., Computer Science"
        register={register}
        error={errors.department?.message}
      />

      <Input
        label="Designation (Optional)"
        name="designation"
        placeholder="e.g., Assistant Professor"
        register={register}
        error={errors.designation?.message}
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
          Create Teacher
        </Button>
      </div>
    </form>
  );
}
