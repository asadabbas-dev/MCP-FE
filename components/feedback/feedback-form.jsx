"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@/components/common/button";
import Select from "@/components/common/select";
import Loading from "@/components/common/loading";
import { Star } from "lucide-react";
import { useState } from "react";

const feedbackSchema = yup.object().shape({
  targetType: yup.string().required("Please select a target type"),
  targetId: yup.string().required("Please select a target"),
  rating: yup
    .number()
    .required("Please provide a rating")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  comment: yup
    .string()
    .required("Comment is required")
    .min(10, "Comment must be at least 10 characters")
    .max(1000, "Comment must be less than 1000 characters"),
});

export default function FeedbackForm({
  onSubmit,
  onCancel,
  loading = false,
}) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [targetType, setTargetType] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(feedbackSchema),
    defaultValues: {
      targetType: "",
      targetId: "",
      rating: 0,
      comment: "",
    },
  });

  const selectedTargetType = watch("targetType");

  const getTargetOptions = () => {
    switch (selectedTargetType) {
      case "Course":
        return [
          { value: "1", label: "CS201 - Data Structures" },
          { value: "2", label: "CS301 - Database Systems" },
          { value: "3", label: "CS401 - Web Development" },
        ];
      case "Teacher":
        return [
          { value: "1", label: "Dr. Sara Khan" },
          { value: "2", label: "Dr. Muhammad Hassan" },
          { value: "3", label: "Dr. Ahmed Ali" },
        ];
      case "System":
        return [{ value: "1", label: "MCP Portal" }];
      default:
        return [];
    }
  };

  const handleRatingClick = (value) => {
    setRating(value);
    setValue("rating", value);
  };

  const handleFormSubmit = async (data) => {
    await onSubmit(data);
    reset();
    setRating(0);
  };

  const handleCancel = () => {
    reset();
    setRating(0);
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Select
        label="Feedback For"
        name="targetType"
        register={register}
        placeholder="Select target type"
        options={[
          { value: "Course", label: "Course" },
          { value: "Teacher", label: "Teacher" },
          { value: "System", label: "System" },
        ]}
        error={errors.targetType?.message}
        required
        onChange={(e) => {
          setValue("targetType", e.target.value);
          setValue("targetId", "");
        }}
      />

      {selectedTargetType && (
        <Select
          label="Select Target"
          name="targetId"
          register={register}
          placeholder={`Select ${selectedTargetType.toLowerCase()}`}
          options={getTargetOptions()}
          error={errors.targetId?.message}
          required
        />
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rating <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => handleRatingClick(value)}
              onMouseEnter={() => setHoveredRating(value)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none"
            >
              <Star
                className={`w-6 h-6 transition-colors ${
                  value <= (hoveredRating || rating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="text-sm text-gray-600 ml-2">({rating}/5)</span>
          )}
        </div>
        {errors.rating && (
          <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="comment"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Comment <span className="text-red-500">*</span>
        </label>
        <textarea
          id="comment"
          {...register("comment")}
          rows={6}
          placeholder="Write your feedback here..."
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none resize-none"
        />
        {errors.comment && (
          <p className="mt-1 text-sm text-red-600">{errors.comment.message}</p>
        )}
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
          Submit Feedback
        </Button>
      </div>
    </form>
  );
}

