"use client";

import { useState, useEffect } from "react";
import Card from "@/components/common/card";
import Button from "@/components/common/button";
import Modal from "@/components/common/modal";
import { ArrowLeft, User, Clock, Pin, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Input from "@/components/common/input";
import Loading from "@/components/common/loading";
import { useToast } from "@/contexts/toast-context";
import { api } from "@/lib/utils/api";
import { useAuth } from "@/contexts/auth-context";

const replySchema = yup.object().shape({
  content: yup
    .string()
    .required("Reply is required")
    .min(5, "Reply must be at least 5 characters")
    .max(2000, "Reply must be less than 2000 characters"),
});

export default function PostDetailsView({ post, onBack }) {
  const { isTeacher } = useAuth();
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(true);
  const [postDetails, setPostDetails] = useState(post);
  const { success, error } = useToast();

  /**
   * Fetch post details and replies
   */
  useEffect(() => {
    if (post?.id) {
      fetchPostDetails();
    }
  }, [post?.id]);

  const fetchPostDetails = async () => {
    setLoadingReplies(true);
    try {
      const response = await api.get(`/forum/posts/${post.id}`);
      
      // Transform post data
      const transformedPost = {
        ...post,
        content: response.content || post.content,
        author: response.author?.fullName || response.author?.user?.fullName || post.author,
        course: response.course ? `${response.course.code} - ${response.course.name}` : post.course,
      };
      setPostDetails(transformedPost);
      
      // Transform replies data
      const repliesList = response.replies || [];
      const transformedReplies = repliesList.map((reply) => ({
        id: reply.id,
        author: reply.author?.fullName || reply.author?.user?.fullName || "Unknown",
        content: reply.content,
        time: formatTimeAgo(reply.createdAt),
        isTeacher: reply.author?.role === "teacher" || reply.author?.user?.role === "teacher",
      }));
      
      setReplies(transformedReplies);
    } catch (err) {
      console.error("Error fetching post details:", err);
      error(err.message || "Failed to load post details");
    } finally {
      setLoadingReplies(false);
    }
  };

  /**
   * Format time ago for display
   */
  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(replySchema),
    defaultValues: {
      content: "",
    },
  });

  /**
   * Handle submitting a reply to the post
   */
  const handleReplySubmit = async (data) => {
    setLoading(true);
    try {
      await api.post(`/forum/posts/${post.id}/replies`, {
        content: data.content,
      });

      // Refresh replies
      fetchPostDetails();
      
      reset();
      success("Reply posted successfully!");
    } catch (err) {
      error(err.message || "Failed to post reply. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          startIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={onBack}
        >
          Back to Forum
        </Button>
      </div>

      {/* Post Details */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  {post.isPinned && (
                    <Pin className="w-4 h-4 text-yellow-500" />
                  )}
                  <h2 className="text-2xl font-bold text-gray-900">
                    {postDetails.title || post.title}
                  </h2>
                </div>
                <p className="text-sm text-indigo-600 mb-3">{postDetails.course || post.course}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <span>by {postDetails.author || post.author}</span>
                  <span>•</span>
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {postDetails.time || post.time}
                  </span>
                  <span>•</span>
                  <span>{postDetails.views || post.views || 0} views</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                    {postDetails.content || post.content || "No content available."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Replies Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Replies ({replies.length})
          </h3>
        </div>

        {loadingReplies ? (
          <Card>
            <div className="text-center py-8">
              <Loading size="sm" />
              <p className="text-gray-600 mt-2 text-sm">Loading replies...</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4 mb-6">
            {replies.length === 0 ? (
              <Card>
                <p className="text-sm text-gray-500 text-center py-4">
                  No replies yet. Be the first to reply!
                </p>
              </Card>
            ) : (
              replies.map((reply) => (
            <Card key={reply.id}>
              <div className="flex items-start space-x-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    reply.isTeacher
                      ? "bg-indigo-600"
                      : "bg-gray-100"
                  }`}
                >
                  <User
                    className={`w-5 h-5 ${
                      reply.isTeacher ? "text-white" : "text-gray-600"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-semibold text-gray-900">
                      {reply.author}
                    </span>
                    {reply.isTeacher && (
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-md">
                        Teacher
                      </span>
                    )}
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {reply.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{reply.content}</p>
                </div>
              </div>
            </Card>
              ))
            )}
          </div>
        )}

        {/* Reply Form */}
        <Card>
          <h4 className="text-sm font-semibold text-gray-900 mb-4">
            Post a Reply
          </h4>
          <form onSubmit={handleSubmit(handleReplySubmit)} className="space-y-4">
            <div>
              <textarea
                {...register("content")}
                rows={4}
                placeholder="Write your reply here..."
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none resize-none"
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.content.message}
                </p>
              )}
            </div>
            <div className="flex items-center justify-end">
              <Button type="submit" disabled={loading}>
                {loading && (
                  <span className="mr-2">
                    <Loading size="sm" />
                  </span>
                )}
                <Send className="w-4 h-4 mr-2" />
                Post Reply
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

