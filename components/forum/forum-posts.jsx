"use client";

import { useState } from "react";
import Card from "@/components/common/card";
import Button from "@/components/common/button";
import Modal from "@/components/common/modal";
import NewPostForm from "@/components/forum/new-post-form";
import PostDetailsView from "@/components/forum/post-details-view";
import EmptyState from "@/components/common/empty-state";
import { MessageSquare, User, Clock, Pin } from "lucide-react";
import { useToast } from "@/contexts/toast-context";

/**
 * Forum Posts Component
 * 
 * Community forum for students and teachers to discuss and interact.
 * 
 * Features:
 * - View all forum posts
 * - Create new posts with file attachments
 * - View post details with replies
 * - Course-specific posts
 * - Teacher badges in replies
 * - File attachments support
 * - Empty states
 * 
 * Both students and teachers can participate in discussions.
 */

export default function ForumPosts() {
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const { success, error: showError } = useToast();

  const handleNewPostSubmit = async (data) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // await api.post('/forum/posts', data);
      console.log("Post data:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Close modal on success
      setIsNewPostModalOpen(false);
      success("Post created successfully!");
    } catch (err) {
      console.error("Post creation error:", err);
      showError("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const posts = [
    {
      id: 1,
      title: "Question about Assignment 3",
      author: "Ahmed Ali",
      course: "CS201 - Data Structures",
      replies: 5,
      views: 23,
      time: "2 hours ago",
      isPinned: true,
    },
    {
      id: 2,
      title: "Study Group for Final Exam",
      author: "Sara Khan",
      course: "CS301 - Database Systems",
      replies: 12,
      views: 45,
      time: "5 hours ago",
      isPinned: false,
    },
    {
      id: 3,
      title: "Clarification on Project Requirements",
      author: "Muhammad Hassan",
      course: "CS401 - Web Development",
      replies: 3,
      views: 18,
      time: "1 day ago",
      isPinned: false,
    },
  ];

  if (selectedPost) {
    return (
      <PostDetailsView
        post={selectedPost}
        onBack={() => setSelectedPost(null)}
      />
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header Section with proper spacing */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2">Community Forum</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Discuss and interact with your classmates and teachers
          </p>
        </div>
        <Button
          startIcon={<MessageSquare className="w-4 h-4" />}
          onClick={() => setIsNewPostModalOpen(true)}
          size="md"
          className="w-full sm:w-auto whitespace-nowrap"
        >
          New Post
        </Button>
      </div>

      <Modal
        isOpen={isNewPostModalOpen}
        onClose={() => setIsNewPostModalOpen(false)}
        title="Create New Post"
        size="lg"
      >
        <NewPostForm
          onSubmit={handleNewPostSubmit}
          onCancel={() => setIsNewPostModalOpen(false)}
          loading={loading}
        />
      </Modal>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <Card>
            <EmptyState
              icon={MessageSquare}
              title="No posts yet"
              description="Be the first to start a discussion in the forum."
              action={() => setIsNewPostModalOpen(true)}
              actionLabel="Create First Post"
            />
          </Card>
        ) : (
          posts.map((post) => (
            <Card
              key={post.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedPost(post)}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1 flex-wrap">
                    {post.isPinned && (
                      <Pin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-500 flex-shrink-0" />
                    )}
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                      {post.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-indigo-600 mb-2 break-words">{post.course}</p>
                  <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-600">
                    <span className="break-words">by {post.author}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{post.replies} replies</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{post.views} views</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
                      {post.time}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

