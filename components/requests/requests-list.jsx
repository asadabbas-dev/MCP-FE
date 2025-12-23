"use client";

import { useState } from "react";
import Card from "@/components/common/card";
import Button from "@/components/common/button";
import Modal from "@/components/common/modal";
import NewRequestForm from "@/components/requests/new-request-form";
import TeacherRequestsView from "@/components/requests/teacher-requests-view";
import { FileQuestion, Clock, CheckCircle, XCircle } from "lucide-react";
import EmptyState from "@/components/common/empty-state";
import { useToast } from "@/contexts/toast-context";
import { useAuth } from "@/contexts/auth-context";

export default function RequestsList() {
  const { isTeacher } = useAuth();
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  // Show teacher view if user is a teacher
  if (isTeacher) {
    return <TeacherRequestsView />;
  }

  const handleNewRequestSubmit = async (data) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // await api.post('/requests', data);
      console.log("Request data:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Close modal on success
      setIsNewRequestModalOpen(false);
      success("Request submitted successfully!");
    } catch (err) {
      console.error("Request error:", err);
      error("Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const requests = [
    {
      id: 1,
      type: "Course Change",
      subject: "Request to Change Section",
      description:
        "I would like to change my section for CS201 from Section A to Section B.",
      status: "pending",
      submittedDate: "2024-12-15",
      response: null,
    },
    {
      id: 2,
      type: "Certificate",
      subject: "Request for Transcript",
      description: "I need an official transcript for scholarship application.",
      status: "in-progress",
      submittedDate: "2024-12-10",
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
      response:
        "Your leave request has been approved. Please submit medical documents.",
    },
  ];

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

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header Section with proper spacing */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2">
            Requests & Feedback
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Submit requests and provide feedback to faculty
          </p>
        </div>
        <Button
          startIcon={<FileQuestion className="w-4 h-4" />}
          onClick={() => setIsNewRequestModalOpen(true)}
          size="md"
          className="w-full sm:w-auto whitespace-nowrap"
        >
          New Request
        </Button>
      </div>

      <Modal
        isOpen={isNewRequestModalOpen}
        onClose={() => setIsNewRequestModalOpen(false)}
        title="New Request"
      >
        <NewRequestForm
          onSubmit={handleNewRequestSubmit}
          onCancel={() => setIsNewRequestModalOpen(false)}
          loading={loading}
        />
      </Modal>

      <div className="space-y-4">
        {requests.length === 0 ? (
          <Card>
            <EmptyState
              icon={FileQuestion}
              title="No requests"
              description="You haven't submitted any requests yet."
              action={() => setIsNewRequestModalOpen(true)}
              actionLabel="Submit Request"
            />
          </Card>
        ) : (
          requests.map((request) => (
          <Card key={request.id}>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-start space-x-2 sm:space-x-3 mb-2">
                  <div className="flex-shrink-0 mt-0.5">
                    {getStatusIcon(request.status)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                      {request.subject}
                    </h3>
                    <p className="text-xs sm:text-sm text-indigo-600 break-words">{request.type}</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mt-2 break-words">
                  {request.description}
                </p>
              </div>
              <span
                className={`px-2 sm:px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap flex-shrink-0 self-start sm:self-auto ${getStatusColor(
                  request.status
                )}`}
              >
                {request.status}
              </span>
            </div>

            {request.response && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-3 sm:mb-4">
                <p className="text-xs sm:text-sm font-medium text-blue-900 mb-1">
                  Response:
                </p>
                <p className="text-xs sm:text-sm text-blue-800 break-words">{request.response}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 pt-3 sm:pt-4 border-t border-gray-200">
              <span className="text-xs sm:text-sm text-gray-600">
                Submitted:{" "}
                {new Date(request.submittedDate).toLocaleDateString()}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedRequest(request);
                  setIsViewDetailsModalOpen(true);
                }}
                className="w-full sm:w-auto"
              >
                View Details
              </Button>
            </div>
          </Card>
          ))
        )}
      </div>

      {/* View Details Modal */}
      <Modal
        isOpen={isViewDetailsModalOpen}
        onClose={() => {
          setIsViewDetailsModalOpen(false);
          setSelectedRequest(null);
        }}
        title="Request Details"
        size="lg"
      >
        {selectedRequest && (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="pb-3 sm:pb-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0 mb-3">
                <div className="flex items-start space-x-2 sm:space-x-3 min-w-0 flex-1">
                  <div className="p-1.5 sm:p-2 bg-indigo-100 rounded-lg flex-shrink-0">
                    {getStatusIcon(selectedRequest.status)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 break-words">
                      {selectedRequest.subject}
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-indigo-600 break-words">
                      {selectedRequest.type}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold rounded-md whitespace-nowrap flex-shrink-0 self-start sm:self-auto ${getStatusColor(
                    selectedRequest.status
                  )}`}
                >
                  {selectedRequest.status}
                </span>
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-1.5 sm:space-x-2 mb-2">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Submitted Date
                  </p>
                </div>
                <p className="text-sm sm:text-base font-semibold text-gray-900">
                  {new Date(selectedRequest.submittedDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Description Section */}
            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 uppercase tracking-wide">
                Description
              </p>
              <p className="text-xs sm:text-sm leading-relaxed text-gray-700 break-words">
                {selectedRequest.description}
              </p>
            </div>

            {/* Response Section */}
            {selectedRequest.response && (
              <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-1.5 sm:space-x-2 mb-2 sm:mb-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                  <p className="text-xs sm:text-sm font-semibold text-blue-900 uppercase tracking-wide">
                    Response
                  </p>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-blue-800 break-words">
                  {selectedRequest.response}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
