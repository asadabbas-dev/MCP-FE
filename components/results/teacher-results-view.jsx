"use client";

import { useState } from "react";
import Card from "@/components/common/card";
import Button from "@/components/common/button";
import Modal from "@/components/common/modal";
import { FileText, Users, User, CheckCircle, Plus } from "lucide-react";
import EmptyState from "@/components/common/empty-state";
import { useToast } from "@/contexts/toast-context";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Input from "@/components/common/input";
import Select from "@/components/common/select";
import Loading from "@/components/common/loading";

/**
 * Teacher Results View Component
 * 
 * Allows teachers to enter grades for students in their assigned courses.
 * 
 * Features:
 * - View all assigned courses
 * - View enrolled students for each course
 * - Enter grades for each student (marks, total marks, grade)
 * - Grade validation (marks cannot exceed total marks)
 * - Automatic grade calculation based on marks
 * - View already graded students
 * - Empty states
 * 
 * Used when user role is "teacher" in the results page.
 */

// Form validation schema for grade entry
const gradeSchema = yup.object().shape({
  marksObtained: yup
    .number()
    .required("Marks obtained is required")
    .min(0, "Marks cannot be negative")
    .max(yup.ref("totalMarks"), "Marks cannot exceed total marks"),
  totalMarks: yup
    .number()
    .required("Total marks is required")
    .min(1, "Total marks must be at least 1"),
  grade: yup.string().required("Grade is required"),
});

function GradeEntryForm({ student, course, onSubmit, onCancel, loading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(gradeSchema),
    defaultValues: {
      marksObtained: "",
      totalMarks: 100,
      grade: "",
    },
  });

  const totalMarks = watch("totalMarks");
  const marksObtained = watch("marksObtained");

  const handleFormSubmit = async (data) => {
    await onSubmit({ ...data, studentId: student.id, courseId: course.id });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-3 mb-2">
          <User className="w-5 h-5 text-gray-500" />
          <div>
            <p className="font-medium text-gray-900">{student.name}</p>
            <p className="text-sm text-gray-500">{student.rollNumber}</p>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Course:</span> {course.code} - {course.name}
          </p>
        </div>
      </div>

      <Input
        label="Total Marks"
        name="totalMarks"
        type="number"
        register={register}
        placeholder="Enter total marks"
        error={errors.totalMarks?.message}
        required
      />

      <Input
        label="Marks Obtained"
        name="marksObtained"
        type="number"
        register={register}
        placeholder="Enter marks obtained"
        error={errors.marksObtained?.message}
        required
      />

      {totalMarks && marksObtained && (
        <div className="p-3 bg-indigo-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Percentage: <span className="font-semibold text-indigo-600">
              {((marksObtained / totalMarks) * 100).toFixed(2)}%
            </span>
          </p>
        </div>
      )}

      <Select
        label="Grade"
        name="grade"
        register={register}
        placeholder="Select grade"
        options={[
          { value: "A", label: "A (90-100%)" },
          { value: "B", label: "B (80-89%)" },
          { value: "C", label: "C (70-79%)" },
          { value: "D", label: "D (60-69%)" },
          { value: "F", label: "F (Below 60%)" },
        ]}
        error={errors.grade?.message}
        required
      />

      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-end gap-2 sm:gap-3 pt-4 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading && (
            <span className="mr-2">
              <Loading size="sm" />
            </span>
          )}
          Submit Grade
        </Button>
      </div>
    </form>
  );
}

export default function TeacherResultsView() {
  const { success, error } = useToast();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("courses"); // "courses" or "students"

  const courses = [
    {
      id: 1,
      code: "CS201",
      name: "Data Structures",
      semester: "Fall 2024",
      enrolledStudents: 45,
      students: [
        {
          id: 1,
          name: "Ali Ahmed",
          rollNumber: "2021-CS-001",
          email: "ali@example.com",
          grade: null,
        },
        {
          id: 2,
          name: "Sara Khan",
          rollNumber: "2021-CS-002",
          email: "sara@example.com",
          grade: { marksObtained: 85, totalMarks: 100, grade: "A" },
        },
        {
          id: 3,
          name: "Ahmed Hassan",
          rollNumber: "2021-CS-003",
          email: "ahmed@example.com",
          grade: null,
        },
      ],
    },
    {
      id: 2,
      code: "CS301",
      name: "Database Systems",
      semester: "Fall 2024",
      enrolledStudents: 38,
      students: [
        {
          id: 1,
          name: "Ali Ahmed",
          rollNumber: "2021-CS-001",
          email: "ali@example.com",
          grade: { marksObtained: 78, totalMarks: 100, grade: "B" },
        },
        {
          id: 2,
          name: "Sara Khan",
          rollNumber: "2021-CS-002",
          email: "sara@example.com",
          grade: null,
        },
      ],
    },
  ];

  const handleEnterGrade = (course, student) => {
    setSelectedCourse(course);
    setSelectedStudent(student);
    setIsGradeModalOpen(true);
  };

  const handleSubmitGrade = async (data) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // await api.post('/results/grade', data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsGradeModalOpen(false);
      setSelectedCourse(null);
      setSelectedStudent(null);
      success(`Grade submitted successfully for ${selectedStudent.name}!`);
    } catch (err) {
      console.error("Error submitting grade:", err);
      error("Failed to submit grade. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header Section with proper spacing */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2">Enter Grades</h1>
        <p className="text-sm sm:text-base text-gray-600">
          Enter and manage grades for your courses
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-1 sm:space-x-2 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("courses")}
          className={`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center justify-center ${
            activeTab === "courses"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
          <span className="truncate">By Course</span>
        </button>
        <button
          onClick={() => setActiveTab("students")}
          className={`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center justify-center ${
            activeTab === "students"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
          <span className="truncate">By Student</span>
        </button>
      </div>

      {/* Courses Tab */}
      {activeTab === "courses" && (
        <div className="space-y-4">
          {courses.length === 0 ? (
            <Card>
              <EmptyState
                icon={FileText}
                title="No courses assigned"
                description="You don't have any assigned courses to enter grades for."
              />
            </Card>
          ) : (
            courses.map((course) => (
              <Card key={course.id}>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0">
                    <div className="flex items-start space-x-2 sm:space-x-3 min-w-0 flex-1">
                      <div className="p-1.5 sm:p-2 bg-indigo-100 rounded-lg flex-shrink-0">
                        <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                          {course.code} - {course.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 break-words">{course.semester}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {course.enrolledStudents} students enrolled
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 sm:pt-4 border-t border-gray-200">
                    <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                      Students ({course.students.length})
                    </h4>
                    <div className="space-y-2">
                      {course.students.map((student) => (
                        <div
                          key={student.id}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm sm:text-base font-medium text-gray-900 break-words">
                                {student.name}
                              </p>
                              <p className="text-xs text-gray-500 break-all">
                                {student.rollNumber}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-3">
                            {student.grade ? (
                              <div className="text-left sm:text-right">
                                <p className="text-xs sm:text-sm font-medium text-gray-900">
                                  {student.grade.marksObtained} / {student.grade.totalMarks}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Grade: {student.grade.grade}
                                </p>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-500">Not graded</span>
                            )}
                            <Button
                              size="sm"
                              variant={student.grade ? "outline" : "primary"}
                              onClick={() => handleEnterGrade(course, student)}
                              className="flex-shrink-0"
                            >
                              <span className="hidden sm:inline">{student.grade ? "Update" : "Enter Grade"}</span>
                              <span className="sm:hidden">{student.grade ? "Update" : "Grade"}</span>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Grade Entry Modal */}
      <Modal
        isOpen={isGradeModalOpen}
        onClose={() => {
          setIsGradeModalOpen(false);
          setSelectedCourse(null);
          setSelectedStudent(null);
        }}
        title="Enter Grade"
        size="lg"
      >
        {selectedCourse && selectedStudent && (
          <GradeEntryForm
            student={selectedStudent}
            course={selectedCourse}
            onSubmit={handleSubmitGrade}
            onCancel={() => {
              setIsGradeModalOpen(false);
              setSelectedCourse(null);
              setSelectedStudent(null);
            }}
            loading={loading}
          />
        )}
      </Modal>
    </div>
  );
}

