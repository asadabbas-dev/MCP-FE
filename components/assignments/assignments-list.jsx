"use client";

import { useState, useEffect } from "react";
import Card from "@/components/common/card";
import Button from "@/components/common/button";
import Modal from "@/components/common/modal";
import SubmitAssignmentForm from "@/components/assignments/submit-assignment-form";
import CreateAssignmentForm from "@/components/assignments/create-assignment-form";
import { useToast } from "@/contexts/toast-context";
import { useAuth } from "@/contexts/auth-context";
import { api } from "@/lib/utils/api";
import Loading from "@/components/common/loading";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Upload,
  Download,
  Plus,
  Users,
  CheckSquare,
} from "lucide-react";
import { getStatusColor } from "@/lib/utils";
import EmptyState from "@/components/common/empty-state";
import Select from "@/components/common/select";
import Input from "@/components/common/input";

/**
 * Assignments List Component
 *
 * Displays assignments with role-based functionality:
 *
 * Student View:
 * - View all assignments (pending, submitted, overdue)
 * - Filter assignments by status
 * - Submit assignments with file upload
 * - View submission details
 *
 * Teacher View:
 * - Create new assignments
 * - View all student submissions for each assignment
 * - Grade student submissions
 * - Provide feedback on submissions
 *
 * Features:
 * - Status badges (Pending, Submitted, Overdue, Graded)
 * - File upload/download
 * - Modal forms for submission and grading
 * - Empty states
 */

export default function AssignmentsList() {
  const { role, isTeacher, user } = useAuth();

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false);
  const [isViewSubmissionModalOpen, setIsViewSubmissionModalOpen] =
    useState(false);
  const [isViewSubmissionsModalOpen, setIsViewSubmissionsModalOpen] =
    useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedSubmissions, setSelectedSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [filter, setFilter] = useState("all"); // Filter: "all" | "pending" | "submitted"
  const [assignments, setAssignments] = useState([]);
  const { success, error } = useToast();

  // Teacher filters
  const [semesterFilter, setSemesterFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [availableSemesters, setAvailableSemesters] = useState([]);
  const [availableSections, setAvailableSections] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);

  /**
   * Fetch assignments based on user role
   */
  useEffect(() => {
    fetchAssignments();
    if (isTeacher) {
      fetchFilterOptions();
    }
  }, [isTeacher, user]);

  /**
   * Fetch filter options (semesters, sections, courses) for teachers
   */
  const fetchFilterOptions = async () => {
    try {
      // Fetch teacher's courses to get available semesters, sections, and courses
      const coursesResponse = await api.get("/courses/teacher/my-courses");
      const coursesList = Array.isArray(coursesResponse)
        ? coursesResponse
        : coursesResponse?.data || [];

      // Extract unique semesters
      const semesters = [
        ...new Set(coursesList.map((c) => c.semester).filter(Boolean)),
      ];
      setAvailableSemesters([
        { value: "all", label: "All Semesters" },
        ...semesters.map((s) => ({ value: s, label: s })),
      ]);

      // Extract unique courses
      setAvailableCourses([
        { value: "all", label: "All Courses" },
        ...coursesList.map((c) => ({
          value: c.id,
          label: `${c.code} - ${c.name}`,
        })),
      ]);

      // Fetch course details to get sections
      const allSections = new Set();
      for (const course of coursesList) {
        try {
          const courseDetails = await api.get(`/courses/${course.id}`);
          const enrollments = courseDetails?.enrollments || [];
          enrollments.forEach((e) => {
            if (e.section) allSections.add(e.section);
          });
        } catch (err) {
          console.error(
            `Error fetching sections for course ${course.id}:`,
            err
          );
        }
      }

      setAvailableSections([
        { value: "all", label: "All Sections" },
        ...Array.from(allSections).map((s) => ({
          value: s,
          label: `Section ${s}`,
        })),
      ]);
    } catch (err) {
      console.error("Error fetching filter options:", err);
    }
  };

  const fetchAssignments = async () => {
    setLoadingAssignments(true);
    try {
      let url = "/assignments";

      // If teacher, filter by teacher ID
      if (isTeacher) {
        try {
          const userProfile = await api.get("/users/profile");
          const teacherId = userProfile?.teacher?.id;
          if (teacherId) {
            url += `?teacherId=${teacherId}`;
          }
        } catch (profileErr) {
          console.error("Error fetching user profile:", profileErr);
        }
      }

      const response = await api.get(url);
      const assignmentsList = Array.isArray(response)
        ? response
        : response?.data || [];
      setAssignments(assignmentsList);
    } catch (err) {
      console.error("Error fetching assignments:", err);
      error(err.message || "Failed to load assignments");
      setAssignments([]);
    } finally {
      setLoadingAssignments(false);
    }
  };

  /**
   * Handle assignment submission (Student)
   * Uploads file and submits assignment with optional comments
   */
  const handleSubmitAssignment = async (data) => {
    setLoading(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("file", data.file[0]);
      formData.append("assignmentId", selectedAssignment.id);
      formData.append("comments", data.comments || "");

      await api.post(`/assignments/submit`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Close modal on success
      setIsSubmitModalOpen(false);
      setSelectedAssignment(null);
      success("Assignment submitted successfully!");

      // Refresh assignments list
      fetchAssignments();
    } catch (err) {
      console.error("Submission error:", err);
      error(err.message || "Failed to submit assignment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle assignment creation (Teacher)
   * Creates a new assignment with title, course, description, due date, and marks
   */
  const handleCreateAssignment = async (data) => {
    setLoading(true);
    try {
      // Format due date as ISO string
      const assignmentData = {
        ...data,
        dueDate: new Date(data.dueDate).toISOString(),
      };

      await api.post("/assignments", assignmentData);

      // Close modal on success
      setIsCreateModalOpen(false);
      success("Assignment created successfully!");

      // Refresh assignments list
      fetchAssignments();
    } catch (err) {
      console.error("Create assignment error:", err);
      error(err.message || "Failed to create assignment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle viewing submissions for an assignment (Teacher)
   * Fetches all student submissions for the selected assignment
   */
  const handleViewSubmissions = async (assignment) => {
    setSelectedAssignment(assignment);
    setIsViewSubmissionsModalOpen(true);
    setLoading(true);

    try {
      const response = await api.get(
        `/assignments/${assignment.id}/submissions`
      );
      const submissionsList = Array.isArray(response)
        ? response
        : response?.data || [];
      setSelectedSubmissions(submissionsList);
    } catch (err) {
      console.error("Error fetching submissions:", err);
      error(err.message || "Failed to load submissions");
      setSelectedSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle grading a student submission (Teacher)
   * Assigns marks and feedback to a student's submission
   */
  const handleGradeSubmission = async (submissionId, marks, feedback) => {
    setLoading(true);
    try {
      const gradeData = {
        marksObtained: parseInt(marks, 10),
        feedback: feedback || "",
      };

      await api.patch(
        `/assignments/submissions/${submissionId}/grade`,
        gradeData
      );

      // Refresh submissions list
      if (selectedAssignment) {
        const response = await api.get(
          `/assignments/${selectedAssignment.id}/submissions`
        );
        const submissionsList = Array.isArray(response)
          ? response
          : response?.data || [];
        setSelectedSubmissions(submissionsList);
      }

      success("Submission graded successfully!");
    } catch (err) {
      console.error("Grade submission error:", err);
      error(err.message || "Failed to grade submission. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Format date for display
   */
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  /**
   * Determine assignment status for students
   * Checks if assignment is overdue, submitted, or pending
   */
  const getAssignmentStatus = (assignment) => {
    if (isTeacher) return "active"; // Teachers see all assignments as active

    // For students, check submission status
    // This would need to be enhanced with actual submission data
    const dueDate = new Date(assignment.dueDate);
    const now = new Date();

    if (now > dueDate) {
      return "overdue";
    }
    // Check if submitted (would need submission data)
    return "pending";
  };

  // Filter assignments based on selected filters
  const filteredAssignments = assignments.filter((assignment) => {
    // Student filters
    if (!isTeacher) {
      if (filter === "all") return true;
      const status = getAssignmentStatus(assignment);
      if (filter === "pending") return status === "pending";
      if (filter === "submitted") return status === "submitted";
      return true;
    }

    // Teacher filters
    // Filter by semester
    if (semesterFilter !== "all" && assignment.semester !== semesterFilter) {
      return false;
    }

    // Filter by section
    if (sectionFilter !== "all" && assignment.section !== sectionFilter) {
      return false;
    }

    // Filter by course
    if (courseFilter !== "all" && assignment.courseId !== courseFilter) {
      return false;
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = assignment.title?.toLowerCase().includes(query);
      const matchesCourse =
        assignment.course?.name?.toLowerCase().includes(query) ||
        assignment.course?.code?.toLowerCase().includes(query);
      if (!matchesTitle && !matchesCourse) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header Section with proper spacing */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2">
            Assignments
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {isTeacher
              ? "Create and manage assignments"
              : "View and submit your assignments"}
          </p>
        </div>
        <div className="flex items-center flex-wrap gap-2">
          {isTeacher && (
            <Button
              startIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsCreateModalOpen(true)}
              size="md"
              className="w-full sm:w-auto whitespace-nowrap"
            >
              Create Assignment
            </Button>
          )}
          {!isTeacher && (
            <>
              <Button
                variant={filter === "all" ? "primary" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
                className="flex-1 sm:flex-none"
              >
                All
              </Button>
              <Button
                variant={filter === "pending" ? "primary" : "outline"}
                size="sm"
                onClick={() => setFilter("pending")}
                className="flex-1 sm:flex-none"
              >
                Pending
              </Button>
              <Button
                variant={filter === "submitted" ? "primary" : "outline"}
                size="sm"
                onClick={() => setFilter("submitted")}
                className="flex-1 sm:flex-none"
              >
                Submitted
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Teacher Filters */}
      {isTeacher && (
        <Card className="p-3 sm:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="sm:col-span-1">
              <Input
                name="searchAssignments"
                placeholder="Search assignments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
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
                name="sectionFilter"
                value={sectionFilter}
                onChange={(e) => setSectionFilter(e.target.value)}
                options={availableSections}
                disabled={availableSections.length === 0}
              />
            </div>
            <div className="sm:col-span-1">
              <Select
                name="courseFilter"
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                options={availableCourses}
                disabled={availableCourses.length === 0}
              />
            </div>
            <div className="sm:col-span-1 flex items-center gap-2">
              {(semesterFilter !== "all" ||
                sectionFilter !== "all" ||
                courseFilter !== "all" ||
                searchQuery) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSemesterFilter("all");
                    setSectionFilter("all");
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
      )}

      <div className="space-y-3 sm:space-y-4">
        {loadingAssignments ? (
          <Card>
            <div className="text-center py-8">
              <Loading size="md" />
              <p className="text-gray-600 mt-3">Loading assignments...</p>
            </div>
          </Card>
        ) : filteredAssignments.length === 0 ? (
          <Card>
            <EmptyState
              icon={FileText}
              title="No assignments found"
              description={
                isTeacher
                  ? "You haven't created any assignments yet."
                  : filter === "all"
                  ? "You don't have any assignments yet."
                  : `You don't have any ${filter} assignments.`
              }
            />
          </Card>
        ) : (
          filteredAssignments.map((assignment) => {
            const status = isTeacher
              ? "active"
              : getAssignmentStatus(assignment);
            const courseName = assignment.course
              ? `${assignment.course.code || ""} - ${
                  assignment.course.name || ""
                }`
              : "Unknown Course";

            return (
              <Card key={assignment.id}>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0 mb-3 sm:mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 flex-shrink-0" />
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                        {assignment.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">
                      {courseName}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-700 line-clamp-2">
                      {assignment.description || "No description provided."}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-md ${getStatusColor(
                      status
                    )}`}
                  >
                    {status}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 pt-3 sm:pt-4 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 lg:space-x-6 gap-2 sm:gap-0 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                      <span>Due: {formatDate(assignment.dueDate)}</span>
                    </div>
                    <div>
                      Total Marks:{" "}
                      <span className="font-medium">
                        {assignment.totalMarks || 0}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {!isTeacher && status === "pending" && (
                      <Button
                        size="sm"
                        startIcon={<Upload className="w-4 h-4" />}
                        onClick={() => {
                          setSelectedAssignment(assignment);
                          setIsSubmitModalOpen(true);
                        }}
                      >
                        Submit
                      </Button>
                    )}
                    {!isTeacher && status === "submitted" && (
                      <Button
                        variant="outline"
                        size="sm"
                        startIcon={<CheckCircle className="w-4 h-4" />}
                        onClick={() => {
                          setSelectedAssignment(assignment);
                          setIsViewSubmissionModalOpen(true);
                        }}
                      >
                        View Submission
                      </Button>
                    )}
                    {!isTeacher && status === "overdue" && (
                      <Button
                        variant="danger"
                        size="sm"
                        startIcon={<AlertCircle className="w-4 h-4" />}
                      >
                        Overdue
                      </Button>
                    )}
                    {isTeacher && (
                      <Button
                        variant="outline"
                        size="sm"
                        startIcon={<Users className="w-4 h-4" />}
                        onClick={() => handleViewSubmissions(assignment)}
                      >
                        View Submissions
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        // Fetch full assignment details
                        try {
                          const fullAssignment = await api.get(
                            `/assignments/${assignment.id}`
                          );
                          setSelectedAssignment(fullAssignment);
                        } catch (err) {
                          console.error(
                            "Error fetching assignment details:",
                            err
                          );
                          // Use the assignment from list if fetch fails
                          setSelectedAssignment(assignment);
                        }
                        setIsViewDetailsModalOpen(true);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Create Assignment Modal (Teacher) */}
      {isTeacher && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
          }}
          title="Create Assignment"
          size="lg"
        >
          <CreateAssignmentForm
            onSubmit={handleCreateAssignment}
            onCancel={() => setIsCreateModalOpen(false)}
            loading={loading}
          />
        </Modal>
      )}

      {/* View Submissions Modal (Teacher) */}
      {isTeacher && (
        <Modal
          isOpen={isViewSubmissionsModalOpen}
          onClose={() => {
            setIsViewSubmissionsModalOpen(false);
            setSelectedAssignment(null);
            setSelectedSubmissions([]);
          }}
          title={`Submissions - ${selectedAssignment?.title || ""}`}
          size="lg"
        >
          {selectedAssignment && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  Course: {selectedAssignment.course?.code || ""} -{" "}
                  {selectedAssignment.course?.name || ""}
                </p>
                <p className="text-sm text-gray-600">
                  Total Submissions: {selectedSubmissions.length} | Graded:{" "}
                  {
                    selectedSubmissions.filter(
                      (s) => s.isGraded || s.marksObtained !== null
                    ).length
                  }{" "}
                  | Pending:{" "}
                  {
                    selectedSubmissions.filter(
                      (s) => !s.isGraded && s.marksObtained === null
                    ).length
                  }
                </p>
              </div>
              {loading ? (
                <div className="text-center py-8">
                  <Loading size="sm" />
                  <p className="text-gray-600 mt-2 text-sm">
                    Loading submissions...
                  </p>
                </div>
              ) : selectedSubmissions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">No submissions yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {selectedSubmissions.map((submission) => {
                    const student = submission.student;
                    const studentName = student?.user?.fullName || "Unknown";
                    const rollNumber = student?.rollNumber || "N/A";
                    const isGraded =
                      submission.isGraded || submission.marksObtained !== null;

                    return (
                      <div
                        key={submission.id}
                        className="p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-medium text-gray-900">
                              {studentName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {rollNumber}
                            </p>
                            {submission.submittedAt && (
                              <p className="text-xs text-gray-500 mt-1">
                                Submitted:{" "}
                                {new Date(
                                  submission.submittedAt
                                ).toLocaleString()}
                              </p>
                            )}
                          </div>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-md ${
                              isGraded
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {isGraded ? "Graded" : "Pending"}
                          </span>
                        </div>
                        {isGraded ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">
                                Marks:
                              </span>
                              <span className="font-semibold text-gray-900">
                                {submission.marksObtained} /{" "}
                                {selectedAssignment.totalMarks}
                              </span>
                            </div>
                            {submission.feedback && (
                              <div className="p-2 bg-gray-50 rounded text-sm text-gray-700">
                                {submission.feedback}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Marks Obtained
                              </label>
                              <input
                                type="number"
                                name={`marks-${submission.id}`}
                                placeholder="Enter marks"
                                max={selectedAssignment.totalMarks}
                                className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Feedback
                              </label>
                              <textarea
                                name={`feedback-${submission.id}`}
                                rows={3}
                                placeholder="Enter feedback..."
                                className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none resize-none"
                              />
                            </div>
                            <Button
                              size="sm"
                              startIcon={<CheckSquare className="w-4 h-4" />}
                              onClick={() => {
                                const marksInput = document.querySelector(
                                  `input[name="marks-${submission.id}"]`
                                );
                                const feedbackInput = document.querySelector(
                                  `textarea[name="feedback-${submission.id}"]`
                                );
                                handleGradeSubmission(
                                  submission.id,
                                  marksInput?.value,
                                  feedbackInput?.value
                                );
                              }}
                            >
                              Grade Submission
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </Modal>
      )}

      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => {
          setIsSubmitModalOpen(false);
          setSelectedAssignment(null);
        }}
        title="Submit Assignment"
      >
        <SubmitAssignmentForm
          assignmentTitle={selectedAssignment?.title || ""}
          onSubmit={handleSubmitAssignment}
          onCancel={() => {
            setIsSubmitModalOpen(false);
            setSelectedAssignment(null);
          }}
          loading={loading}
        />
      </Modal>

      {/* View Details Modal */}
      <Modal
        isOpen={isViewDetailsModalOpen}
        onClose={() => {
          setIsViewDetailsModalOpen(false);
          setSelectedAssignment(null);
        }}
        title="Assignment Details"
        size="lg"
      >
        {selectedAssignment && (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="pb-3 sm:pb-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0 mb-3">
                <div className="flex items-start space-x-2 sm:space-x-3 min-w-0 flex-1">
                  <div className="p-1.5 sm:p-2 bg-indigo-100 rounded-lg flex-shrink-0">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 break-words">
                      {selectedAssignment.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-indigo-600 break-words">
                      {selectedAssignment.course
                        ? `${selectedAssignment.course.code || ""} - ${
                            selectedAssignment.course.name || ""
                          }`
                        : "Unknown Course"}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold rounded-md whitespace-nowrap flex-shrink-0 self-start sm:self-auto ${getStatusColor(
                    isTeacher
                      ? "active"
                      : getAssignmentStatus(selectedAssignment)
                  )}`}
                >
                  {isTeacher
                    ? "Active"
                    : getAssignmentStatus(selectedAssignment)}
                </span>
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-1.5 sm:space-x-2 mb-2">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Due Date
                  </p>
                </div>
                <p className="text-sm sm:text-base font-semibold text-gray-900">
                  {formatDate(selectedAssignment.dueDate)}
                </p>
              </div>
              <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-1.5 sm:space-x-2 mb-2">
                  <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Total Marks
                  </p>
                </div>
                <p className="text-sm sm:text-base font-semibold text-gray-900">
                  {selectedAssignment.totalMarks}
                </p>
              </div>
            </div>

            {/* Description Section */}
            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 uppercase tracking-wide">
                Description
              </p>
              <p className="text-xs sm:text-sm leading-relaxed text-gray-700 break-words">
                {selectedAssignment.description}
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* View Submission Modal */}
      <Modal
        isOpen={isViewSubmissionModalOpen}
        onClose={() => {
          setIsViewSubmissionModalOpen(false);
          setSelectedAssignment(null);
        }}
        title="Submission Details"
        size="lg"
      >
        {selectedAssignment && (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="pb-3 sm:pb-4 border-b border-gray-200">
              <div className="flex items-start space-x-2 sm:space-x-3 mb-3">
                <div className="p-1.5 sm:p-2 bg-indigo-100 rounded-lg flex-shrink-0">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 break-words">
                    {selectedAssignment.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-indigo-600 break-words">
                    {selectedAssignment.course}
                  </p>
                </div>
              </div>
            </div>

            {/* Submission Status */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-center space-x-1.5 sm:space-x-2 mb-2 sm:mb-3">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 flex-shrink-0" />
                <p className="text-xs sm:text-sm font-semibold text-indigo-900 uppercase tracking-wide">
                  Submitted Successfully
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 sm:space-x-2 pl-0 sm:pl-7">
                <p className="text-xs font-medium text-gray-500">
                  Submitted Date
                </p>
                <p className="text-xs sm:text-sm font-semibold text-gray-900">
                  {formatDate(selectedAssignment.dueDate)}
                </p>
              </div>
            </div>

            {/* Submitted File Section */}
            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 uppercase tracking-wide">
                Submitted File
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 p-2 sm:p-3 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                  <div className="p-1.5 sm:p-2 bg-indigo-100 rounded-lg flex-shrink-0">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                    assignment_submission.pdf
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  startIcon={<Download className="w-4 h-4" />}
                  className="w-full sm:w-auto"
                >
                  Download
                </Button>
              </div>
            </div>

            {/* Comments Section */}
            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 uppercase tracking-wide">
                Comments
              </p>
              <p className="text-xs sm:text-sm leading-relaxed text-gray-700 break-words">
                Submitted as per requirements. All tasks completed.
              </p>
            </div>

            {/* Grading Status Section */}
            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 uppercase tracking-wide">
                Grading Status
              </p>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                <p className="text-xs sm:text-sm font-medium text-gray-700">
                  Not graded yet
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
