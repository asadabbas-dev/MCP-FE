"use client";

import { useState } from "react";
import Card from "@/components/common/card";
import Button from "@/components/common/button";
import Modal from "@/components/common/modal";
import { FileQuestion, Clock, CheckCircle, XCircle, User, MessageSquare } from "lucide-react";
import EmptyState from "@/components/common/empty-state";
import { useToast } from "@/contexts/toast-context";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Select from "@/components/common/select";
import Loading from "@/components/common/loading";

/**
 * Teacher Requests View Component
 * 
 * Allows teachers to view and respond to student requests.
 * 
 * Features:
 * - View all student requests
 * - Filter by status (All, Pending, In Progress, Resolved, Rejected)
 * - View request details (student info, request type, description, date)
 * - Respond to requests with status update
 * - Update request status (Pending, In Progress, Resolved, Rejected)
 * - Response validation (min 10, max 1000 characters)
 * - Empty states
 * 
 * Used when user role is "teacher" in the requests page.
 */

// Form validation schema for request response
const responseSchema = yup.object().shape({
  response: yup
    .string()
    .required("Response is required")
    .min(10, "Response must be at least 10 characters")
    .max(1000, "Response must be less than 1000 characters"),
  status: yup.string().required("Status is required"),
});

function RespondRequestForm({ request, onSubmit, onCancel, loading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(responseSchema),
    defaultValues: {
      response: "",
      status: request.status === "pending" ? "in-progress" : request.status,
    },
  });

  const handleFormSubmit = async (data) => {
    await onSubmit({ ...data, requestId: request.id });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="space-y-2">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Student
            </p>
            <p className="font-medium text-gray-900">{request.studentName}</p>
            <p className="text-sm text-gray-500">{request.studentRollNumber}</p>
          </div>
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Request Type
            </p>
            <p className="font-medium text-gray-900">{request.type}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Subject
            </p>
            <p className="font-medium text-gray-900">{request.subject}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Description
            </p>
            <p className="text-sm text-gray-600">{request.description}</p>
          </div>
        </div>
      </div>

      <Select
        label="Update Status"
        name="status"
        register={register}
        placeholder="Select status"
        options={[
          { value: "pending", label: "Pending" },
          { value: "in-progress", label: "In Progress" },
          { value: "resolved", label: "Resolved" },
          { value: "rejected", label: "Rejected" },
        ]}
        error={errors.status?.message}
        required
      />

      <div>
        <label
          htmlFor="response"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Response <span className="text-red-500">*</span>
        </label>
        <textarea
          id="response"
          name="response"
          {...register("response")}
          rows={5}
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none"
          placeholder="Enter your response to the student"
        />
        {errors.response && (
          <p className="mt-1 text-sm text-red-600">{errors.response.message}</p>
        )}
      </div>

      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && (
            <span className="mr-2">
              <Loading size="sm" />
            </span>
          )}
          Submit Response
        </Button>
      </div>
    </form>
  );
}

export default function TeacherRequestsView() {
  const { success, error } = useToast();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isRespondModalOpen, setIsRespondModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // "all", "pending", "in-progress", "resolved", "rejected"

  const requests = [
    {
      id: 1,
      type: "Course Change",
      subject: "Request to Change Section",
      description:
        "I would like to change my section for CS201 from Section A to Section B.",
      status: "pending",
      submittedDate: "2024-12-15",
      studentName: "Ali Ahmed",
      studentRollNumber: "2021-CS-001",
      response: null,
    },
    {
      id: 2,
      type: "Certificate",
      subject: "Request for Transcript",
      description: "I need an official transcript for scholarship application.",
      status: "in-progress",
      submittedDate: "2024-12-10",
      studentName: "Sara Khan",
      studentRollNumber: "2021-CS-002",
      response:
        "Your request is being processed. It will be ready in 3-5 business days.",
    },
    {
      id: 3,
      type: "Other",
      subject: "Request for Leave",
      description: "Request for leave of absence due to medical reasons.",
      status: "resolved",
      submittedDate: "2024-12-01",
      studentName: "Ahmed Hassan",
      studentRollNumber: "2021-CS-003",
      response:
        "Your leave request has been approved. Please submit medical documents.",
    },
  ];

  const filteredRequests =
    filter === "all"
      ? requests
      : requests.filter((req) => req.status === filter);

  const handleRespond = (request) => {
    setSelectedRequest(request);
    setIsRespondModalOpen(true);
  };

  const handleSubmitResponse = async (data) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // await api.post(`/requests/${data.requestId}/respond`, data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsRespondModalOpen(false);
      setSelectedRequest(null);
      success("Response submitted successfully!");
    } catch (err) {
      console.error("Error submitting response:", err);
      error("Failed to submit response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Requests</h1>
          <p className="text-gray-600 mt-1">
            View and respond to student requests
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
        {["all", "pending", "in-progress", "resolved", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
              filter === status
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {status === "all" ? "All" : status.replace("-", " ")}
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <Card>
            <EmptyState
              icon={FileQuestion}
              title="No requests found"
              description={`No ${filter === "all" ? "" : filter + " "}requests at the moment.`}
            />
          </Card>
        ) : (
          filteredRequests.map((request) => (
            <Card key={request.id}>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      {getStatusIcon(request.status)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {request.subject}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <User className="w-4 h-4" />
                          <span>{request.studentName}</span>
                          <span className="text-gray-400">•</span>
                          <span>{request.studentRollNumber}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Submitted: {formatDate(request.submittedDate)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-md ${getStatusColor(
                      request.status
                    )}`}
                  >
                    {request.status}
                  </span>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="mb-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Type
                    </p>
                    <p className="text-sm font-medium text-gray-900">{request.type}</p>
                  </div>
                  <div className="mb-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Description
                    </p>
                    <p className="text-sm text-gray-600">{request.description}</p>
                  </div>
                  {request.response && (
                    <div className="mt-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                      <p className="text-xs font-medium text-indigo-700 uppercase tracking-wide mb-1">
                        Your Response
                      </p>
                      <p className="text-sm text-gray-700">{request.response}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end pt-2 border-t border-gray-200">
                  <Button
                    size="sm"
                    startIcon={<MessageSquare className="w-4 h-4" />}
                    onClick={() => handleRespond(request)}
                  >
                    {request.response ? "Update Response" : "Respond"}
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Respond Modal */}
      <Modal
        isOpen={isRespondModalOpen}
        onClose={() => {
          setIsRespondModalOpen(false);
          setSelectedRequest(null);
        }}
        title="Respond to Request"
        size="lg"
      >
        {selectedRequest && (
          <RespondRequestForm
            request={selectedRequest}
            onSubmit={handleSubmitResponse}
            onCancel={() => {
              setIsRespondModalOpen(false);
              setSelectedRequest(null);
            }}
            loading={loading}
          />
        )}
      </Modal>
    </div>
  );
}

