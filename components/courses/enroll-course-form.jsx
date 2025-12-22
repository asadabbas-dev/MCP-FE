"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@/components/common/button";
import Input from "@/components/common/input";
import Select from "@/components/common/select";
import Loading from "@/components/common/loading";

const enrollCourseSchema = yup.object().shape({
  courseCode: yup
    .string()
    .required("Course code is required")
    .matches(/^[A-Z]{2}\d{3}$/, "Course code must be in format like CS101"),
  semester: yup.string().required("Semester is required"),
  section: yup.string().required("Section is required"),
});

export default function EnrollCourseForm({
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
    resolver: yupResolver(enrollCourseSchema),
    defaultValues: {
      courseCode: "",
      semester: "",
      section: "",
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
        label="Course Code"
        name="courseCode"
        placeholder="e.g., CS101"
        register={register}
        error={errors.courseCode?.message}
        required
      />

      <Select
        label="Semester"
        name="semester"
        register={register}
        placeholder="Select Semester"
        error={errors.semester?.message}
        required
        options={["Fall 2024", "Spring 2025", "Summer 2025"]}
      />

      <Select
        label="Section"
        name="section"
        register={register}
        placeholder="Select Section"
        error={errors.section?.message}
        required
        options={[
          { value: "A", label: "Section A" },
          { value: "B", label: "Section B" },
          { value: "C", label: "Section C" },
        ]}
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
          Enroll
        </Button>
      </div>
    </form>
  );
}
