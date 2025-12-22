"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@/components/common/button";
import Input from "@/components/common/input";
import Select from "@/components/common/select";
import Loading from "@/components/common/loading";

const createAssignmentSchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must be less than 200 characters"),
  courseId: yup.string().required("Please select a course"),
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
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(createAssignmentSchema),
    defaultValues: {
      title: "",
      courseId: "",
      description: "",
      dueDate: "",
      totalMarks: "",
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
        placeholder="Select a course"
        options={[
          { value: "1", label: "CS201 - Data Structures" },
          { value: "2", label: "CS301 - Database Systems" },
          { value: "3", label: "CS401 - Web Development" },
        ]}
        error={errors.courseId?.message}
        required
      />

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

