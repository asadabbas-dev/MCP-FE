"use client";

import { useState, useEffect } from "react";
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
import Input from "@/components/common/input";
import Loading from "@/components/common/loading";
import { api } from "@/lib/utils/api";

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
          className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
        >
          Response <span className="text-red-500">*</span>
        </label>
        <textarea
          id="response"
          name="response"
          {...register("response")}
          rows={5}
          className="block w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none resize-none"
          placeholder="Enter your response to the student"
        />
        {errors.response && (
          <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.response.message}</p>
        )}
      </div>

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
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [filter, setFilter] = useState("all"); // "all", "pending", "in-progress", "resolved", "rejected"
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  /**
   * Fetch all student requests
   */
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoadingRequests(true);
    try {
      const response = await api.get("/requests");
      const requestsList = Array.isArray(response) ? response : response?.data || [];
      
      // Transform requests data for display
      const transformedRequests = requestsList.map((request) => ({
        id: request.id,
        type: request.type || "Other",
        subject: request.subject,
        description: request.description,
        status: request.status || "pending",
        submittedDate: request.createdAt || request.submittedDate,
        studentName: request.student?.user?.fullName || "Unknown",
        studentRollNumber: request.student?.rollNumber || "N/A",
        response: request.response || null,
      }));
      
      setRequests(transformedRequests);
    } catch (err) {
      console.error("Error fetching requests:", err);
      error(err.message || "Failed to load requests");
      setRequests([]);
    } finally {
      setLoadingRequests(false);
    }
  };

  const filteredRequests = requests.filter((req) => {
    // Filter by status
    if (filter !== "all" && req.status !== filter) {
      return false;
    }
    
    // Filter by search query (student name, roll number, subject, type)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = req.studentName?.toLowerCase().includes(query);
      const matchesRollNumber = req.studentRollNumber?.toLowerCase().includes(query);
      const matchesSubject = req.subject?.toLowerCase().includes(query);
      const matchesType = req.type?.toLowerCase().includes(query);
      
      if (!matchesName && !matchesRollNumber && !matchesSubject && !matchesType) {
        return false;
      }
    }
    
    return true;
  });

  const handleRespond = (request) => {
    setSelectedRequest(request);
    setIsRespondModalOpen(true);
  };

  /**
   * Handle submitting response to a request
   * Updates request status and adds response
   */
  const handleSubmitResponse = async (data) => {
    setLoading(true);
    try {
      // Map status to backend format (in-progress -> in_progress)
      const status = data.status === "in-progress" ? "in_progress" : data.status;
      
      await api.patch(`/requests/${data.requestId}/respond`, {
        response: data.response,
        status: status,
      });

      setIsRespondModalOpen(false);
      setSelectedRequest(null);
      success("Response submitted successfully!");
      
      // Refresh requests list
      fetchRequests();
    } catch (err) {
      console.error("Error submitting response:", err);
      error(err.message || "Failed to submit response. Please try again.");
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
    <div className="space-y-5 sm:space-y-6">
      {/* Header Section with proper spacing */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2">Student Requests</h1>
        <p className="text-sm sm:text-base text-gray-600">
          View and respond to student requests
        </p>
      </div>

      {/* Filters */}
      <Card className="p-3 sm:p-4">
        <div className="space-y-3">
          <div className="flex-1">
            <Input
              name="searchRequests"
              placeholder="Search by student name, roll number, subject, or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-1 sm:gap-2 bg-gray-100 rounded-lg p-1">
            {["all", "pending", "in-progress", "resolved", "rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`flex-1 min-w-[80px] sm:min-w-0 px-2 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors capitalize ${
                  filter === status
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {status === "all" ? "All" : status.replace("-", " ")}
              </button>
            ))}
          </div>
          {(filter !== "all" || searchQuery) && (
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFilter("all");
                  setSearchQuery("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Requests List */}
      <div className="space-y-4">
        {loadingRequests ? (
          <Card>
            <div className="text-center py-8">
              <Loading size="md" />
              <p className="text-gray-600 mt-3">Loading requests...</p>
            </div>
          </Card>
        ) : filteredRequests.length === 0 ? (
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
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0">
                  <div className="flex items-start space-x-2 sm:space-x-3 min-w-0 flex-1">
                    <div className="p-1.5 sm:p-2 bg-indigo-100 rounded-lg flex-shrink-0">
                      {getStatusIcon(request.status)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                        {request.subject}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                        <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-600">
                          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="break-words">{request.studentName}</span>
                          <span className="text-gray-400 hidden sm:inline">•</span>
                          <span className="break-all">{request.studentRollNumber}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Submitted: {formatDate(request.submittedDate)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 sm:px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap flex-shrink-0 self-start sm:self-auto ${getStatusColor(
                      request.status
                    )}`}
                  >
                    {request.status}
                  </span>
                </div>

                <div className="pt-3 sm:pt-4 border-t border-gray-200">
                  <div className="mb-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Type
                    </p>
                    <p className="text-xs sm:text-sm font-medium text-gray-900 break-words">{request.type}</p>
                  </div>
                  <div className="mb-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Description
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 break-words">{request.description}</p>
                  </div>
                  {request.response && (
                    <div className="mt-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                      <p className="text-xs font-medium text-indigo-700 uppercase tracking-wide mb-1">
                        Your Response
                      </p>
                      <p className="text-xs sm:text-sm text-gray-700 break-words">{request.response}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end pt-2 sm:pt-3 border-t border-gray-200">
                  <Button
                    size="sm"
                    startIcon={<MessageSquare className="w-4 h-4" />}
                    onClick={() => handleRespond(request)}
                    className="w-full sm:w-auto"
                  >
                    <span className="hidden sm:inline">{request.response ? "Update Response" : "Respond"}</span>
                    <span className="sm:hidden">{request.response ? "Update" : "Respond"}</span>
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

