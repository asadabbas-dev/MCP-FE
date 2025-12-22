"use client";

import { useState } from "react";
import Card from "@/components/common/card";
import Button from "@/components/common/button";
import Modal from "@/components/common/modal";
import SubmitAssignmentForm from "@/components/assignments/submit-assignment-form";
import CreateAssignmentForm from "@/components/assignments/create-assignment-form";
import { useToast } from "@/contexts/toast-context";
import { useAuth } from "@/contexts/auth-context";
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
  const { role, isTeacher } = useAuth();

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false);
  const [isViewSubmissionModalOpen, setIsViewSubmissionModalOpen] =
    useState(false);
  const [isViewSubmissionsModalOpen, setIsViewSubmissionsModalOpen] =
    useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // Filter: "all" | "pending" | "submitted"
  const { success, error } = useToast();

  /**
   * Handle assignment submission (Student)
   * Uploads file and submits assignment with optional comments
   */
  const handleSubmitAssignment = async (data) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const formData = new FormData();
      // formData.append('file', data.file[0]);
      // formData.append('comments', data.comments);
      // await api.post(`/assignments/${selectedAssignment.id}/submit`, formData);

      console.log("Submission data:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Close modal on success
      setIsSubmitModalOpen(false);
      setSelectedAssignment(null);
      success("Assignment submitted successfully!");
    } catch (err) {
      console.error("Submission error:", err);
      error("Failed to submit assignment. Please try again.");
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
      // TODO: Replace with actual API call
      // await api.post('/assignments', data);
      console.log("Create assignment data:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Close modal on success
      setIsCreateModalOpen(false);
      success("Assignment created successfully!");
    } catch (err) {
      console.error("Create assignment error:", err);
      error("Failed to create assignment. Please try again.");
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
      // TODO: Replace with actual API call
      // await api.post(`/assignments/${selectedAssignment.id}/grade`, {
      //   submissionId,
      //   marksObtained: marks,
      //   feedback,
      // });
      console.log("Grade submission:", { submissionId, marks, feedback });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsViewSubmissionsModalOpen(false);
      success("Submission graded successfully!");
    } catch (err) {
      console.error("Grade submission error:", err);
      error("Failed to grade submission. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const assignments = [
    {
      id: 1,
      title: "Data Structures Project",
      course: "CS201 - Data Structures",
      dueDate: "2024-12-25",
      status: "pending",
      totalMarks: 100,
      description:
        "Implement a binary search tree with insertion, deletion, and traversal operations.",
    },
    {
      id: 2,
      title: "Database Design Assignment",
      course: "CS301 - Database Systems",
      dueDate: "2024-12-20",
      status: "overdue",
      totalMarks: 50,
      description:
        "Design a normalized database schema for an e-commerce system.",
    },
    {
      id: 3,
      title: "Web Development Lab",
      course: "CS401 - Web Development",
      dueDate: "2024-12-30",
      status: "submitted",
      totalMarks: 75,
      description:
        "Create a responsive website using HTML, CSS, and JavaScript.",
    },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Filter assignments based on selected filter
  const filteredAssignments = assignments.filter((assignment) => {
    if (filter === "all") return true;
    if (filter === "pending") return assignment.status === "pending";
    if (filter === "submitted") return assignment.status === "submitted";
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-600 mt-1">
            {isTeacher
              ? "Create and manage assignments"
              : "View and submit your assignments"}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {isTeacher && (
            <Button
              startIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsCreateModalOpen(true)}
              size="sm"
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
              >
                All
              </Button>
              <Button
                variant={filter === "pending" ? "primary" : "outline"}
                size="sm"
                onClick={() => setFilter("pending")}
              >
                Pending
              </Button>
              <Button
                variant={filter === "submitted" ? "primary" : "outline"}
                size="sm"
                onClick={() => setFilter("submitted")}
              >
                Submitted
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {filteredAssignments.length === 0 ? (
          <Card>
            <EmptyState
              icon={FileText}
              title="No assignments found"
              description={
                filter === "all"
                  ? "You don't have any assignments yet."
                  : `You don't have any ${filter} assignments.`
              }
            />
          </Card>
        ) : (
          filteredAssignments.map((assignment) => (
            <Card key={assignment.id}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {assignment.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {assignment.course}
                  </p>
                  <p className="text-sm text-gray-700">
                    {assignment.description}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-md ${getStatusColor(
                    assignment.status
                  )}`}
                >
                  {assignment.status}
                </span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Due: {formatDate(assignment.dueDate)}
                  </div>
                  <div>
                    Total Marks:{" "}
                    <span className="font-medium">{assignment.totalMarks}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {assignment.status === "pending" && (
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
                  {assignment.status === "submitted" && (
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
                  {assignment.status === "overdue" && (
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
                      onClick={() => {
                        setSelectedAssignment(assignment);
                        setIsViewSubmissionsModalOpen(true);
                      }}
                    >
                      View Submissions
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedAssignment(assignment);
                      setIsViewDetailsModalOpen(true);
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))
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
          }}
          title={`Submissions - ${selectedAssignment?.title || ""}`}
          size="lg"
        >
          {selectedAssignment && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  Course: {selectedAssignment.course}
                </p>
                <p className="text-sm text-gray-600">
                  Total Submissions: 12 | Graded: 8 | Pending: 4
                </p>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {[
                  {
                    id: 1,
                    studentName: "Ahmed Ali",
                    rollNumber: "CS-2021-001",
                    submittedAt: "2024-12-20T10:30:00",
                    marksObtained: 85,
                    totalMarks: 100,
                    feedback: "Good work!",
                    status: "graded",
                  },
                  {
                    id: 2,
                    studentName: "Sara Khan",
                    rollNumber: "CS-2021-002",
                    submittedAt: "2024-12-21T14:20:00",
                    marksObtained: null,
                    totalMarks: 100,
                    feedback: null,
                    status: "pending",
                  },
                ].map((submission) => (
                  <div
                    key={submission.id}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium text-gray-900">
                          {submission.studentName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {submission.rollNumber}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Submitted:{" "}
                          {new Date(submission.submittedAt).toLocaleString()}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-md ${
                          submission.status === "graded"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {submission.status}
                      </span>
                    </div>
                    {submission.status === "graded" ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Marks:</span>
                          <span className="font-semibold text-gray-900">
                            {submission.marksObtained} / {submission.totalMarks}
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
                            max={submission.totalMarks}
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
                ))}
              </div>
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
            <div className="pb-4 border-b border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <FileText className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {selectedAssignment.title}
                    </h3>
                    <p className="text-sm font-medium text-indigo-600">
                      {selectedAssignment.course}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md ${getStatusColor(
                    selectedAssignment.status
                  )}`}
                >
                  {selectedAssignment.status}
                </span>
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Due Date
                  </p>
                </div>
                <p className="text-base font-semibold text-gray-900">
                  {formatDate(selectedAssignment.dueDate)}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Total Marks
                  </p>
                </div>
                <p className="text-base font-semibold text-gray-900">
                  {selectedAssignment.totalMarks}
                </p>
              </div>
            </div>

            {/* Description Section */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Description
              </p>
              <p className="text-sm leading-relaxed text-gray-700">
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
            <div className="pb-4 border-b border-gray-200">
              <div className="flex items-start space-x-3 mb-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <FileText className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {selectedAssignment.title}
                  </h3>
                  <p className="text-sm font-medium text-indigo-600">
                    {selectedAssignment.course}
                  </p>
                </div>
              </div>
            </div>

            {/* Submission Status */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <CheckCircle className="w-5 h-5 text-indigo-600" />
                <p className="text-sm font-semibold text-indigo-900 uppercase tracking-wide">
                  Submitted Successfully
                </p>
              </div>
              <div className="flex items-center space-x-2 pl-7">
                <p className="text-xs font-medium text-gray-500">
                  Submitted Date
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatDate(selectedAssignment.dueDate)}
                </p>
              </div>
            </div>

            {/* Submitted File Section */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Submitted File
              </p>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <FileText className="w-5 h-5 text-indigo-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    assignment_submission.pdf
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  startIcon={<Download className="w-4 h-4" />}
                >
                  Download
                </Button>
              </div>
            </div>

            {/* Comments Section */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Comments
              </p>
              <p className="text-sm leading-relaxed text-gray-700">
                Submitted as per requirements. All tasks completed.
              </p>
            </div>

            {/* Grading Status Section */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Grading Status
              </p>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <p className="text-sm font-medium text-gray-700">
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
