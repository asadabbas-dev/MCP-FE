"use client";

import { useState } from "react";
import Card from "@/components/common/card";
import Button from "@/components/common/button";
import Modal from "@/components/common/modal";
import FeedbackForm from "@/components/feedback/feedback-form";
import TeacherFeedbackView from "@/components/feedback/teacher-feedback-view";
import { MessageSquare, Star, User, Calendar } from "lucide-react";
import EmptyState from "@/components/common/empty-state";
import { useToast } from "@/contexts/toast-context";
import { useAuth } from "@/contexts/auth-context";

export default function FeedbackPage() {
  const { isTeacher } = useAuth();
  const [isNewFeedbackModalOpen, setIsNewFeedbackModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  // Show teacher view if user is a teacher
  if (isTeacher) {
    return <TeacherFeedbackView />;
  }

  const [feedbacks, setFeedbacks] = useState([
    {
      id: 1,
      targetType: "Course",
      targetName: "CS201 - Data Structures",
      rating: 5,
      comment: "Excellent course with great teaching methodology.",
      createdAt: "2024-12-10",
    },
    {
      id: 2,
      targetType: "Teacher",
      targetName: "Dr. Sara Khan",
      rating: 4,
      comment: "Very helpful and responsive teacher.",
      createdAt: "2024-12-05",
    },
    {
      id: 3,
      targetType: "System",
      targetName: "MCP Portal",
      rating: 5,
      comment: "The portal is user-friendly and efficient.",
      createdAt: "2024-11-28",
    },
  ]);

  const handleNewFeedbackSubmit = async (data) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // await api.post('/feedback', data);
      console.log("Feedback data:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Add to list
      const newFeedback = {
        id: feedbacks.length + 1,
        ...data,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setFeedbacks([newFeedback, ...feedbacks]);

      // Close modal on success
      setIsNewFeedbackModalOpen(false);
      success("Feedback submitted successfully!");
    } catch (err) {
      console.error("Feedback error:", err);
      error("Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
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

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header Section with proper spacing */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2">Feedback</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Provide feedback on courses, teachers, or the system
          </p>
        </div>
        <Button
          startIcon={<MessageSquare className="w-4 h-4" />}
          onClick={() => setIsNewFeedbackModalOpen(true)}
          size="md"
          className="w-full sm:w-auto whitespace-nowrap"
        >
          Submit Feedback
        </Button>
      </div>

      <Modal
        isOpen={isNewFeedbackModalOpen}
        onClose={() => setIsNewFeedbackModalOpen(false)}
        title="Submit Feedback"
      >
        <FeedbackForm
          onSubmit={handleNewFeedbackSubmit}
          onCancel={() => setIsNewFeedbackModalOpen(false)}
          loading={loading}
        />
      </Modal>

      {feedbacks.length === 0 ? (
        <Card>
          <EmptyState
            icon={MessageSquare}
            title="No feedback submitted"
            description="You haven't submitted any feedback yet."
            action={() => setIsNewFeedbackModalOpen(true)}
            actionLabel="Submit Feedback"
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((feedback) => (
            <Card key={feedback.id}>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0">
                  <div className="flex items-start space-x-2 sm:space-x-3 min-w-0 flex-1">
                    <div className="p-1.5 sm:p-2 bg-indigo-100 rounded-lg flex-shrink-0">
                      <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          {feedback.targetType}
                        </span>
                        <span className="text-gray-400 hidden sm:inline">•</span>
                        <span className="text-xs sm:text-sm font-semibold text-gray-900 break-words">
                          {feedback.targetName}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 flex-wrap">
                        {getRatingStars(feedback.rating)}
                        <span className="text-xs sm:text-sm text-gray-600 ml-1 sm:ml-2">
                          ({feedback.rating}/5)
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 flex-shrink-0 sm:ml-2">
                    <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                    {formatDate(feedback.createdAt)}
                  </div>
                </div>

                <div className="pl-0 sm:pl-12 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-200 sm:border-0">
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed break-words">
                    {feedback.comment}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

