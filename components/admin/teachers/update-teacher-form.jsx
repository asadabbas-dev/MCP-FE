"use client";

import { useState, useEffect } from "react";
import Button from "@/components/common/button";
import Select from "@/components/common/select";
import { useToast } from "@/contexts/toast-context";

/**
 * Update Teacher Form Component
 *
 * Form for admin to update teacher information.
 */

export default function UpdateTeacherForm({ teacher, onSubmit, onCancel, loading }) {
  const { error: showError } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    department: "",
    designation: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (teacher) {
      setFormData({
        fullName: teacher.fullName || "",
        email: teacher.email || "",
        department: teacher.teacher?.department || teacher.department || "",
        designation: teacher.teacher?.designation || teacher.designation || "",
      });
    }
  }, [teacher]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
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
      fullName: formData.fullName,
      email: formData.email,
    };

    const teacherUpdateData = {
      ...(formData.department && { department: formData.department }),
      ...(formData.designation && { designation: formData.designation }),
    };

    try {
      await onSubmit(updateData, teacherUpdateData);
    } catch (err) {
      console.error("Error updating teacher:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <Select
        label="Department (Optional)"
        name="department"
        value={formData.department}
        onChange={handleChange}
        placeholder="Select department"
        error={errors.department}
        options={[
          "Computer Science",
          "Electrical Engineering",
          "Mechanical Engineering",
          "Civil Engineering",
          "Business Administration",
          "Mathematics",
          "Physics",
          "Chemistry",
          "Biology",
          "English",
          "History",
          "Psychology",
        ]}
      />

      <Select
        label="Designation (Optional)"
        name="designation"
        value={formData.designation}
        onChange={handleChange}
        placeholder="Select designation"
        error={errors.designation}
        options={[
          "Professor",
          "Associate Professor",
          "Assistant Professor",
          "Lecturer",
          "Senior Lecturer",
        ]}
      />

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Update Teacher
        </Button>
      </div>
    </form>
  );
}

