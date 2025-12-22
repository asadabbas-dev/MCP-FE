"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@/components/common/button";
import Input from "@/components/common/input";
import Loading from "@/components/common/loading";
import { FileText, X } from "lucide-react";

/**
 * Submit Assignment Form Component
 *
 * Form for students to submit assignments with file upload.
 * Includes file validation (size, type) and optional comments.
 *
 * Validation:
 * - File is required
 * - File size max 10MB
 * - File types: PDF, DOC, DOCX only
 * - Comments max 500 characters
 *
 * Features:
 * - File preview before submission
 * - Remove file option
 * - File size display
 * - Loading state during submission
 */

// Form validation schema
const submitAssignmentSchema = yup.object().shape({
  file: yup
    .mixed()
    .required("File is required")
    .test("fileSize", "File size must be less than 10MB", (value) => {
      if (!value || !value[0]) return true;
      return value[0].size <= 10 * 1024 * 1024;
    })
    .test("fileType", "Only PDF, DOC, DOCX files are allowed", (value) => {
      if (!value || !value[0]) return true;
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      return allowedTypes.includes(value[0].type);
    }),
  comments: yup.string().max(500, "Comments must be less than 500 characters"),
});

export default function SubmitAssignmentForm({
  assignmentTitle,
  onSubmit,
  onCancel,
  loading = false,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(submitAssignmentSchema),
    defaultValues: {
      file: null,
      comments: "",
    },
  });

  const fileInput = watch("file");

  // Watch for file changes
  useEffect(() => {
    if (fileInput && fileInput[0]) {
      setSelectedFile(fileInput[0]);
    }
  }, [fileInput]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    // Reset file input
    const fileInput = document.getElementById("file");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleFormSubmit = async (data) => {
    await onSubmit(data);
    reset();
  };

  const handleCancel = () => {
    reset();
    setSelectedFile(null);
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <p className="text-sm text-gray-600 mb-4">
          <span className="bg-primary text-white px-2 py-1 rounded-md font-bold">
            Assignment:{" "}
            <span className="ml-1 font-medium text-white">
              {assignmentTitle}
            </span>
          </span>
        </p>
      </div>

      <div>
        <label
          htmlFor="file"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Upload File <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          id="file"
          {...register("file")}
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
        {errors.file && (
          <p className="mt-1 text-sm text-red-600">{errors.file.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Accepted formats: PDF, DOC, DOCX (Max 10MB)
        </p>

        {/* File Preview */}
        {selectedFile && (
          <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <FileText className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div>
        <label
          htmlFor="comments"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Comments (Optional)
        </label>
        <textarea
          id="comments"
          {...register("comments")}
          rows={4}
          placeholder="Add any comments or notes about your submission..."
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none resize-none"
        />
        {errors.comments && (
          <p className="mt-1 text-sm text-red-600">{errors.comments.message}</p>
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
          Submit Assignment
        </Button>
      </div>
    </form>
  );
}
