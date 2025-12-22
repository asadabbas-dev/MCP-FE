"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@/components/common/button";
import Input from "@/components/common/input";
import Select from "@/components/common/select";
import Loading from "@/components/common/loading";
import { useToast } from "@/contexts/toast-context";

const notificationSchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters"),
  message: yup
    .string()
    .required("Message is required")
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),
  type: yup.string().required("Notification type is required"),
  targetAudience: yup.string().required("Target audience is required"),
  courseId: yup.string(),
});

export default function CreateNotificationForm({
  onSubmit,
  onCancel,
  loading = false,
  courses = [],
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(notificationSchema),
    defaultValues: {
      title: "",
      message: "",
      type: "",
      targetAudience: "all",
      courseId: "",
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
        label="Title"
        name="title"
        register={register}
        placeholder="Enter notification title"
        error={errors.title?.message}
        required
      />

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          {...register("message")}
          rows={5}
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none"
          placeholder="Enter notification message"
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
        )}
      </div>

      <Select
        label="Notification Type"
        name="type"
        register={register}
        placeholder="Select notification type"
        options={[
          { value: "announcement", label: "Announcement" },
          { value: "alert", label: "Alert" },
          { value: "event", label: "Event" },
        ]}
        error={errors.type?.message}
        required
      />

      <Select
        label="Target Audience"
        name="targetAudience"
        register={register}
        placeholder="Select target audience"
        options={[
          { value: "all", label: "All Users" },
          { value: "students", label: "Students Only" },
          { value: "teachers", label: "Teachers Only" },
        ]}
        error={errors.targetAudience?.message}
        required
      />

      {courses.length > 0 && (
        <Select
          label="Related Course (Optional)"
          name="courseId"
          register={register}
          placeholder="Select a course (optional)"
          options={[
            { value: "", label: "None (General Notification)" },
            ...courses.map((course) => ({
              value: course.id.toString(),
              label: `${course.code} - ${course.name}`,
            })),
          ]}
          error={errors.courseId?.message}
        />
      )}

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
          Create Notification
        </Button>
      </div>
    </form>
  );
}

