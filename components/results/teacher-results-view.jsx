"use client";

import { useState, useEffect } from "react";
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
import { api } from "@/lib/utils/api";

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

/**
 * Form validation schema for grade entry
 * 
 * Note: Grade is calculated automatically by backend based on percentage,
 * so we don't need to send it. Semester is required by backend.
 */
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
  semester: yup.string().required("Semester is required"),
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
      semester: course?.semester || "",
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

      <Input
        label="Semester"
        name="semester"
        register={register}
        placeholder="e.g., Fall 2024"
        error={errors.semester?.message}
        required
      />
      
      {totalMarks && marksObtained && (
        <div className="p-3 bg-indigo-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">
            <span className="font-semibold">Note:</span> Grade will be calculated automatically based on percentage.
          </p>
          <p className="text-sm text-gray-600">
            Percentage: <span className="font-semibold text-indigo-600">
              {((marksObtained / totalMarks) * 100).toFixed(2)}%
            </span>
          </p>
        </div>
      )}

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
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [activeTab, setActiveTab] = useState("courses"); // "courses" or "students"
  const [courses, setCourses] = useState([]);
  const [courseFilter, setCourseFilter] = useState("all");
  const [semesterFilter, setSemesterFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [availableSemesters, setAvailableSemesters] = useState([]);

  /**
   * Fetch teacher's assigned courses with enrolled students
   */
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoadingCourses(true);
    try {
      const response = await api.get("/courses/teacher/my-courses");
      const coursesList = Array.isArray(response) ? response : response?.data || [];
      
      // Fetch enrolled students for each course
      const coursesWithStudents = await Promise.all(
        coursesList.map(async (course) => {
          try {
            const courseDetails = await api.get(`/courses/${course.id}`);
            const enrollments = courseDetails?.enrollments || [];
            
            // Fetch existing grades for this course
            let courseGrades = [];
            try {
              const gradesResponse = await api.get(`/results/course/${course.id}`);
              courseGrades = Array.isArray(gradesResponse) ? gradesResponse : gradesResponse?.data || [];
            } catch (gradesErr) {
              console.error(`Error fetching grades for course ${course.id}:`, gradesErr);
              // Continue without grades
            }
            
            // Map students with their grades
            // Filter only active enrollments and ensure student data exists
            const studentsWithGrades = enrollments
              .filter((enrollment) => enrollment.isActive !== false && enrollment.student)
              .map((enrollment) => {
                const student = enrollment.student;
                // Find grade for this student in this course
                const studentGrade = courseGrades.find(
                  (grade) => grade.studentId === (student?.id || enrollment.studentId)
                );
                
                return {
                  id: student?.id || enrollment.studentId,
                  name: student?.user?.fullName || "Unknown",
                  rollNumber: student?.rollNumber || "N/A",
                  email: student?.user?.email || "N/A",
                  enrollmentId: enrollment.id,
                  section: enrollment.section || "N/A",
                  grade: studentGrade
                    ? {
                        marksObtained: studentGrade.marksObtained,
                        totalMarks: studentGrade.totalMarks,
                        letterGrade: studentGrade.letterGrade,
                        grade: studentGrade.letterGrade, // For backward compatibility
                      }
                    : null,
                };
              });
            
            return {
              ...course,
              students: studentsWithGrades,
              enrolledStudents: studentsWithGrades.length,
            };
          } catch (err) {
            console.error(`Error fetching students for course ${course.id}:`, err);
            return {
              ...course,
              students: [],
              enrolledStudents: 0,
            };
          }
        })
      );
      
      setCourses(coursesWithStudents);
      
      // Extract unique semesters for filter
      const semesters = [...new Set(coursesWithStudents.map(c => c.semester).filter(Boolean))];
      setAvailableSemesters([
        { value: "all", label: "All Semesters" },
        ...semesters.map(s => ({ value: s, label: s }))
      ]);
    } catch (err) {
      console.error("Error fetching courses:", err);
      error(err.message || "Failed to load courses");
      setCourses([]);
    } finally {
      setLoadingCourses(false);
    }
  };

  /**
   * Handle opening grade entry modal
   */
  const handleEnterGrade = (course, student) => {
    setSelectedCourse(course);
    setSelectedStudent(student);
    setIsGradeModalOpen(true);
  };

  /**
   * Handle submitting grade entry
   * Creates a new grade record via the API
   */
  const handleSubmitGrade = async (data) => {
    setLoading(true);
    try {
      // Prepare grade data according to CreateGradeDto
      const gradeData = {
        studentId: selectedStudent.id,
        courseId: selectedCourse.id,
        semester: data.semester,
        totalMarks: parseInt(data.totalMarks, 10),
        marksObtained: parseInt(data.marksObtained, 10),
      };
      
      await api.post("/results", gradeData);
      
      setIsGradeModalOpen(false);
      setSelectedCourse(null);
      setSelectedStudent(null);
      success(`Grade submitted successfully for ${selectedStudent.name}!`);
      
      // Refresh courses to show updated grades
      fetchCourses();
    } catch (err) {
      console.error("Error submitting grade:", err);
      error(err.message || "Failed to submit grade. Please try again.");
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

      {/* Filters and Tabs */}
      <div className="space-y-4">
        {/* Filters */}
        <Card className="p-3 sm:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="sm:col-span-1">
              <Select
                name="semesterFilter"
                value={semesterFilter}
                onChange={(e) => setSemesterFilter(e.target.value)}
                options={availableSemesters}
                disabled={availableSemesters.length === 0}
              />
            </div>
            <div className="sm:col-span-1">
              <Select
                name="courseFilter"
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                options={[
                  { value: "all", label: "All Courses" },
                  ...courses.map((course) => ({
                    value: course.id,
                    label: `${course.code} - ${course.name}`,
                  })),
                ]}
              />
            </div>
            <div className="sm:col-span-1">
              <Input
                name="searchStudents"
                placeholder="Search students by name or roll number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="sm:col-span-1 flex items-center gap-2">
              {(semesterFilter !== "all" || courseFilter !== "all" || searchQuery) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSemesterFilter("all");
                    setCourseFilter("all");
                    setSearchQuery("");
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </Card>

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
        </div>
      </div>

      {/* Courses Tab */}
      {activeTab === "courses" && (
        <div className="space-y-4">
          {loadingCourses ? (
            <Card>
              <div className="text-center py-8">
                <Loading size="md" />
                <p className="text-gray-600 mt-3">Loading courses...</p>
              </div>
            </Card>
          ) : courses.length === 0 ? (
            <Card>
              <EmptyState
                icon={FileText}
                title="No courses assigned"
                description="You don't have any assigned courses to enter grades for."
              />
            </Card>
          ) : (
            courses
              .filter((course) => {
                // Filter by semester
                if (semesterFilter !== "all" && course.semester !== semesterFilter) {
                  return false;
                }
                
                // Filter by selected course
                if (courseFilter !== "all" && course.id !== courseFilter) {
                  return false;
                }
                return true;
              })
              .map((course) => {
                // Filter students by search query
                const filteredStudents = course.students?.filter((student) => {
                  if (!searchQuery) return true;
                  const query = searchQuery.toLowerCase();
                  return (
                    student.name?.toLowerCase().includes(query) ||
                    student.rollNumber?.toLowerCase().includes(query)
                  );
                }) || [];
                
                return { ...course, filteredStudents };
              })
              .filter((course) => course.filteredStudents.length > 0 || courseFilter === "all")
              .map((course) => (
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
                          Students ({course.filteredStudents?.length || course.students?.length || 0})
                        </h4>
                        <div className="space-y-2">
                          {(course.filteredStudents || course.students || []).map((student) => (
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
                                  Grade: {student.grade.letterGrade || student.grade.grade}
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

