"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@/components/common/button";
import Input from "@/components/common/input";
import Select from "@/components/common/select";
import Loading from "@/components/common/loading";
import { Upload, X, File } from "lucide-react";
import { api } from "@/lib/utils/api";
import { useAuth } from "@/contexts/auth-context";

const newPostSchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must be less than 200 characters"),
  content: yup
    .string()
    .required("Content is required")
    .min(10, "Content must be at least 10 characters")
    .max(5000, "Content must be less than 5000 characters"),
  courseId: yup.string().optional(),
});

export default function NewPostForm({ onSubmit, onCancel, loading = false }) {
  const { isTeacher, user } = useAuth();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(newPostSchema),
    defaultValues: {
      title: "",
      content: "",
      courseId: "",
    },
  });

  /**
   * Fetch courses for dropdown
   * For teachers: fetch their assigned courses
   * For students: fetch their enrolled courses
   */
  useEffect(() => {
    fetchCourses();
  }, [isTeacher, user]);

  const fetchCourses = async () => {
    setLoadingCourses(true);
    try {
      let coursesList = [];
      
      if (isTeacher) {
        // Fetch teacher's assigned courses
        const response = await api.get("/courses/teacher/my-courses");
        coursesList = Array.isArray(response) ? response : response?.data || [];
      } else {
        // For students, fetch all courses (or enrolled courses if endpoint exists)
        const response = await api.get("/courses");
        coursesList = Array.isArray(response) ? response : response?.data || [];
      }
      
      // Transform courses for dropdown
      const courseOptions = coursesList.map((course) => ({
        value: course.id,
        label: `${course.code} - ${course.name}`,
      }));
      
      // Add "General Discussion" option at the beginning
      setCourses([
        { value: "", label: "General Discussion" },
        ...courseOptions,
      ]);
    } catch (err) {
      console.error("Error fetching courses:", err);
      // Set default "General Discussion" option
      setCourses([{ value: "", label: "General Discussion" }]);
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const handleFormSubmit = async (data) => {
    const formData = { ...data, attachments: selectedFiles };
    await onSubmit(formData);
    reset();
    setSelectedFiles([]);
  };

  const handleCancel = () => {
    reset();
    setSelectedFiles([]);
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        label="Post Title"
        name="title"
        placeholder="Enter post title"
        register={register}
        error={errors.title?.message}
        required
      />

      <Select
        label="Related Course (Optional)"
        name="courseId"
        register={register}
        placeholder={loadingCourses ? "Loading courses..." : "General Discussion"}
        options={courses}
        error={errors.courseId?.message}
        disabled={loadingCourses}
      />

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Content <span className="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          {...register("content")}
          rows={8}
          placeholder="Write your post content here..."
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none resize-none"
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

      {/* File Attachments */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Attachments (Optional)
        </label>
        <div className="space-y-3">
          <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
            <Upload className="w-5 h-5 text-gray-400 mr-2" />
            <span className="text-sm text-gray-600">
              Click to upload files or drag and drop
            </span>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
          </label>

          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center space-x-3">
                    <File className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Accepted formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB per file)
        </p>
      </div>

      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <span className="mr-2"><Loading size="sm" /></span>}
          Create Post
        </Button>
      </div>
    </form>
  );
}

