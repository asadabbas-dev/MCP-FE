"use client";

import { useState, useEffect } from "react";
import Button from "@/components/common/button";
import Select from "@/components/common/select";
import { useToast } from "@/contexts/toast-context";
import { api } from "@/lib/utils/api";

/**
 * Update Course Form Component
 *
 * Form for admin to update course information.
 */

export default function UpdateCourseForm({ course, onSubmit, onCancel, loading }) {
  const { error: showError } = useToast();
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    creditHours: "",
    semester: "",
    description: "",
    teacherId: "",
  });
  const [teachers, setTeachers] = useState([]);
  const [errors, setErrors] = useState({});
  const [loadingTeachers, setLoadingTeachers] = useState(false);

  useEffect(() => {
    if (course) {
      setFormData({
        code: course.code || "",
        name: course.name || "",
        creditHours: course.creditHours?.toString() || "",
        semester: course.semester || "",
        description: course.description || "",
        teacherId: course.teacherId || course.teacher?.id || "",
      });
    }
    fetchTeachers();
  }, [course]);

  const fetchTeachers = async () => {
    setLoadingTeachers(true);
    try {
      const response = await api.get("/users?role=teacher");
      const teachersList = Array.isArray(response) ? response : response?.data || [];
      setTeachers(teachersList);
    } catch (err) {
      console.error("Error fetching teachers:", err);
      setTeachers([]);
    } finally {
      setLoadingTeachers(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.code.trim()) {
      newErrors.code = "Course code is required";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Course name is required";
    }

    if (!formData.creditHours) {
      newErrors.creditHours = "Credit hours is required";
    } else if (isNaN(formData.creditHours) || parseInt(formData.creditHours) < 1) {
      newErrors.creditHours = "Credit hours must be a positive number";
    }

    if (!formData.teacherId) {
      newErrors.teacherId = "Teacher is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      showError("Please fix the errors in the form");
      return;
    }

    const updateData = {
      code: formData.code,
      name: formData.name,
      creditHours: parseInt(formData.creditHours),
      ...(formData.semester && { semester: formData.semester }),
      ...(formData.description && { description: formData.description }),
      teacherId: formData.teacherId,
    };

    try {
      await onSubmit(updateData);
    } catch (err) {
      console.error("Error updating course:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Course Code <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="code"
          value={formData.code}
          onChange={handleChange}
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        {errors.code && (
          <p className="mt-1 text-sm text-red-600">{errors.code}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Course Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Credit Hours <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          name="creditHours"
          value={formData.creditHours}
          onChange={handleChange}
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        {errors.creditHours && (
          <p className="mt-1 text-sm text-red-600">{errors.creditHours}</p>
        )}
      </div>

      <Select
        label="Semester (Optional)"
        name="semester"
        value={formData.semester}
        onChange={handleChange}
        placeholder="Select semester"
        error={errors.semester}
        options={["Fall 2024", "Spring 2025", "Summer 2025"]}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <Select
        label="Teacher"
        name="teacherId"
        value={formData.teacherId}
        onChange={handleChange}
        placeholder={
          loadingTeachers
            ? "Loading teachers..."
            : teachers.length === 0
            ? "No teachers available"
            : "Select a teacher"
        }
        error={errors.teacherId}
        required
        disabled={loadingTeachers || teachers.length === 0}
        options={
          teachers.length > 0
            ? teachers.map((teacher) => {
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

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Update Course
        </Button>
      </div>
    </form>
  );
}

