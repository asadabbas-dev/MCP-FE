"use client";

import { useState, useEffect } from "react";
import Button from "@/components/common/button";
import Input from "@/components/common/input";
import Select from "@/components/common/select";
import { useToast } from "@/contexts/toast-context";

/**
 * Update Student Form Component
 *
 * Reusable form component for updating existing student accounts.
 * Pre-populates form fields with current student data.
 * Uses controlled inputs with manual validation.
 *
 * Features:
 * - Pre-fills form with existing student data
 * - Client-side validation with error messages
 * - Real-time error clearing on input change
 * - Separates user data and student-specific data for API calls
 *
 * Form Fields:
 * - Full Name (required)
 * - Email (required, must be valid email format)
 * - Roll Number (optional)
 * - Current Semester (optional, dropdown 1-8)
 * - Program (optional, dropdown of available programs)
 *
 * @component
 * @param {Object} student - Student object with current data to populate form
 * @param {Function} onSubmit - Callback function called with (updateData, studentUpdateData) on submit
 * @param {Function} onCancel - Callback function called when cancel button is clicked
 * @param {boolean} loading - Loading state to disable form during submission
 * @returns {JSX.Element} Student update form
 */
export default function UpdateStudentForm({ student, onSubmit, onCancel, loading }) {
  const { error: showError } = useToast();
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    rollNumber: "",
    currentSemester: "",
    program: "",
  });
  const [errors, setErrors] = useState({}); // Validation errors

  /**
   * Populate form with student data when component receives student prop
   * 
   * Handles nested data structure (student.student.rollNumber vs student.rollNumber).
   * Runs whenever the student prop changes.
   */
  useEffect(() => {
    if (student) {
      setFormData({
        fullName: student.fullName || "",
        email: student.email || "",
        // Handle both nested (student.student.rollNumber) and flat (student.rollNumber) structures
        rollNumber: student.student?.rollNumber || student.rollNumber || "",
        currentSemester: student.student?.currentSemester || student.currentSemester || "",
        program: student.student?.program || student.program || "",
      });
    }
  }, [student]);

  /**
   * Handle input field changes
   * 
   * Updates form state and clears validation errors for the changed field.
   * Provides immediate feedback by clearing errors as user types.
   * 
   * @function handleChange
   * @param {Event} e - Change event from input field
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing (better UX)
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  /**
   * Validate form data
   * 
   * Performs client-side validation on required fields.
   * Validates email format using regex.
   * Validates semester is a number if provided.
   * 
   * @function validate
   * @returns {boolean} True if validation passes, false otherwise
   */
  const validate = () => {
    const newErrors = {};

    // Validate required fields
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      // Email format validation using regex
      newErrors.email = "Please enter a valid email";
    }

    // Validate optional semester field if provided
    if (formData.currentSemester && isNaN(formData.currentSemester)) {
      newErrors.currentSemester = "Semester must be a number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  /**
   * Handle form submission
   * 
   * Validates form data, then separates it into two objects:
   * 1. updateData: User table fields (fullName, email)
   * 2. studentUpdateData: Student table fields (rollNumber, currentSemester, program)
   * 
   * Only includes fields that have values (conditional spreading).
   * Converts currentSemester from string to number.
   * 
   * @async
   * @function handleSubmit
   * @param {Event} e - Form submit event
   * @returns {Promise<void>}
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate before submission
    if (!validate()) {
      showError("Please fix the errors in the form");
      return;
    }

    // Separate user data (goes to users table)
    const updateData = {
      fullName: formData.fullName,
      email: formData.email,
    };

    // Separate student-specific data (goes to students table)
    // Only include fields that have values using conditional spreading
    const studentUpdateData = {
      ...(formData.rollNumber && { rollNumber: formData.rollNumber }),
      ...(formData.currentSemester && { currentSemester: parseInt(formData.currentSemester) }),
      ...(formData.program && { program: formData.program }),
    };

    try {
      // Call parent's onSubmit with separated data
      await onSubmit(updateData, studentUpdateData);
    } catch (err) {
      console.error("Error updating student:", err);
      // Error handling is done by parent component via toast
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
        <input
          type="text"
          name="rollNumber"
          value={formData.rollNumber}
          onChange={handleChange}
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.rollNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.rollNumber}</p>
        )}
      </div>

      <Select
        label="Current Semester (Optional)"
        name="currentSemester"
        value={formData.currentSemester?.toString() || ""}
        onChange={handleChange}
        placeholder="Select semester"
        error={errors.currentSemester}
        options={[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => ({
          value: sem.toString(),
          label: `Semester ${sem}`,
        }))}
      />

      <Select
        label="Program (Optional)"
        name="program"
        value={formData.program}
        onChange={handleChange}
        placeholder="Select program"
        error={errors.program}
        options={[
          "BS Computer Science",
          "BS Software Engineering",
          "BS Information Technology",
          "BS Electrical Engineering",
          "BS Mechanical Engineering",
          "BS Civil Engineering",
          "BS Business Administration",
          "BS Mathematics",
          "BS Physics",
          "BS Chemistry",
          "BS Biology",
          "BA English",
          "BA History",
          "BS Psychology",
        ]}
      />

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Update Student
        </Button>
      </div>
    </form>
  );
}

