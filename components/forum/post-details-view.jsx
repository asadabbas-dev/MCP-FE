"use client";

import { useState } from "react";
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

const replySchema = yup.object().shape({
  content: yup
    .string()
    .required("Reply is required")
    .min(5, "Reply must be at least 5 characters")
    .max(2000, "Reply must be less than 2000 characters"),
});

export default function PostDetailsView({ post, onBack }) {
  const [replies, setReplies] = useState([
    {
      id: 1,
      author: "Dr. Sara Khan",
      content: "Great question! For Assignment 3, you need to implement the binary search tree with all the required operations. Make sure to handle edge cases.",
      time: "1 hour ago",
      isTeacher: true,
    },
    {
      id: 2,
      author: "Ahmed Ali",
      content: "Thanks for the clarification! I was confused about the deletion operation.",
      time: "30 minutes ago",
      isTeacher: false,
    },
    {
      id: 3,
      author: "Muhammad Hassan",
      content: "I can help you with that. Let's discuss in the study group.",
      time: "15 minutes ago",
      isTeacher: false,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

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

  const handleReplySubmit = async (data) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // await api.post(`/forum/posts/${post.id}/replies`, data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newReply = {
        id: replies.length + 1,
        author: "You",
        content: data.content,
        time: "Just now",
        isTeacher: false,
      };

      setReplies([...replies, newReply]);
      reset();
      success("Reply posted successfully!");
    } catch (err) {
      error("Failed to post reply. Please try again.");
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
                    {post.title}
                  </h2>
                </div>
                <p className="text-sm text-indigo-600 mb-3">{post.course}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <span>by {post.author}</span>
                  <span>•</span>
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {post.time}
                  </span>
                  <span>•</span>
                  <span>{post.views} views</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm leading-relaxed text-gray-700">
                    I'm having trouble understanding the requirements for
                    Assignment 3. Can someone please clarify what exactly needs
                    to be implemented? Specifically, I'm confused about the
                    binary search tree operations and the expected output
                    format.
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

        <div className="space-y-4 mb-6">
          {replies.map((reply) => (
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
          ))}
        </div>

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

