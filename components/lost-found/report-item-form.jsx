"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@/components/common/button";
import Input from "@/components/common/input";
import Loading from "@/components/common/loading";

const reportItemSchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters"),
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  location: yup
    .string()
    .required("Location is required")
    .min(3, "Location must be at least 3 characters"),
  contactInfo: yup
    .string()
    .required("Contact information is required")
    .min(5, "Contact information must be at least 5 characters"),
  photo: yup.mixed().optional(),
});

export default function ReportItemForm({
  type = "lost",
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
    resolver: yupResolver(reportItemSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      contactInfo: "",
      photo: null,
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
        label={`${type === "lost" ? "Lost" : "Found"} Item Title`}
        name="title"
        placeholder={`e.g., ${type === "lost" ? "Lost: Black Backpack" : "Found: Blue Water Bottle"}`}
        register={register}
        error={errors.title?.message}
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
          rows={4}
          placeholder={`Describe the ${type === "lost" ? "lost" : "found"} item in detail...`}
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none resize-none"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <Input
        label="Location"
        name="location"
        placeholder="Where was it lost/found?"
        register={register}
        error={errors.location?.message}
        required
      />

      <Input
        label="Contact Information"
        name="contactInfo"
        placeholder="Your phone number or email"
        register={register}
        error={errors.contactInfo?.message}
        required
      />

      <div>
        <label
          htmlFor="photo"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Photo (Optional)
        </label>
        <input
          type="file"
          id="photo"
          {...register("photo")}
          accept="image/*"
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
        <p className="mt-1 text-xs text-gray-500">
          Upload a photo of the item (Max 5MB)
        </p>
      </div>

      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <span className="mr-2"><Loading size="sm" /></span>}
          Report {type === "lost" ? "Lost" : "Found"}
        </Button>
      </div>
    </form>
  );
}

