"use client";

import { useState } from "react";
import Card from "@/components/common/card";
import Button from "@/components/common/button";
import Modal from "@/components/common/modal";
import { BookOpen, Clock, Search, History } from "lucide-react";
import EmptyState from "@/components/common/empty-state";

/**
 * Library View Component
 * 
 * Displays library services for students including borrowed books and history.
 * 
 * Features:
 * - View currently borrowed books
 * - View borrowing history
 * - Search books functionality
 * - Book details (title, author, ISBN, due dates)
 * - Status badges (Borrowed, Returned, Overdue)
 * - Due date tracking
 * 
 * Tabs:
 * - Current: Shows currently borrowed books
 * - History: Shows past borrowing records
 */

export default function LibraryView() {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [activeTab, setActiveTab] = useState("current"); // Tab: "current" | "history"
  
  const borrowedBooks = [
    {
      id: 1,
      title: "Introduction to Algorithms",
      author: "Thomas H. Cormen",
      isbn: "978-0262033848",
      borrowDate: "2024-11-15",
      dueDate: "2024-12-15",
      status: "borrowed",
    },
    {
      id: 2,
      title: "Database System Concepts",
      author: "Abraham Silberschatz",
      isbn: "978-0073523323",
      borrowDate: "2024-12-01",
      dueDate: "2024-12-29",
      status: "borrowed",
    },
  ];

  const borrowingHistory = [
    {
      id: 1,
      title: "Operating System Concepts",
      author: "Abraham Silberschatz",
      isbn: "978-1118063330",
      borrowDate: "2024-09-01",
      returnDate: "2024-10-15",
      status: "returned",
    },
    {
      id: 2,
      title: "Computer Networks",
      author: "Andrew S. Tanenbaum",
      isbn: "978-0132126953",
      borrowDate: "2024-08-15",
      returnDate: "2024-09-20",
      status: "returned",
    },
    {
      id: 3,
      title: "Software Engineering",
      author: "Ian Sommerville",
      isbn: "978-0137035151",
      borrowDate: "2024-07-10",
      returnDate: "2024-08-05",
      status: "returned",
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Library</h1>
          <p className="text-gray-600 mt-1">
            Manage your borrowed books and search the catalog
          </p>
        </div>
        <Button
          startIcon={<Search className="w-4 h-4" />}
          onClick={() => setIsSearchModalOpen(true)}
        >
          Search Books
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("current")}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "current"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <BookOpen className="w-4 h-4 inline mr-2" />
          Currently Borrowed
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "history"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <History className="w-4 h-4 inline mr-2" />
          Borrowing History
        </button>
      </div>

      {activeTab === "current" && (
        <Card title="Currently Borrowed Books">
          <div className="space-y-4">
            {borrowedBooks.length === 0 ? (
              <EmptyState
                icon={BookOpen}
                title="No borrowed books"
                description="You don't have any borrowed books at the moment."
              />
            ) : (
              borrowedBooks.map((book) => (
            <div key={book.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {book.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">by {book.author}</p>
                  <p className="text-xs text-gray-500">ISBN: {book.isbn}</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-md">
                  {book.status}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div>
                    Borrowed:{" "}
                    <span className="font-medium">
                      {formatDate(book.borrowDate)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Due:{" "}
                    <span className="font-medium ml-1">
                      {formatDate(book.dueDate)}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedBook(book);
                    setIsViewDetailsModalOpen(true);
                  }}
                >
                  View Details
                </Button>
              </div>
            </div>
              ))
            )}
          </div>
        </Card>
      )}

      {activeTab === "history" && (
        <Card title="Borrowing History">
          <div className="space-y-4">
            {borrowingHistory.length === 0 ? (
              <EmptyState
                icon={History}
                title="No borrowing history"
                description="You haven't borrowed any books yet."
              />
            ) : (
              borrowingHistory.map((book) => (
                <div key={book.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <BookOpen className="w-5 h-5 text-indigo-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          {book.title}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">by {book.author}</p>
                      <p className="text-xs text-gray-500">ISBN: {book.isbn}</p>
                    </div>
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-md">
                      {book.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div>
                        Borrowed:{" "}
                        <span className="font-medium">
                          {formatDate(book.borrowDate)}
                        </span>
                      </div>
                      <div>
                        Returned:{" "}
                        <span className="font-medium">
                          {formatDate(book.returnDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      )}

      {/* Search Books Modal */}
      <Modal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        title="Search Books"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search by Title, Author, or ISBN
            </label>
            <input
              type="text"
              placeholder="Enter search term..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
            />
          </div>
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={() => setIsSearchModalOpen(false)}>
              Cancel
            </Button>
            <Button startIcon={<Search className="w-4 h-4" />}>Search</Button>
          </div>
        </div>
      </Modal>

      {/* View Details Modal */}
      <Modal
        isOpen={isViewDetailsModalOpen}
        onClose={() => {
          setIsViewDetailsModalOpen(false);
          setSelectedBook(null);
        }}
        title="Book Details"
        size="lg"
      >
        {selectedBook && (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="pb-4 border-b border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <BookOpen className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {selectedBook.title}
                    </h3>
                    <p className="text-sm font-medium text-gray-600">
                      by {selectedBook.author}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1.5 bg-green-100 text-green-800 text-xs font-semibold rounded-md">
                  {selectedBook.status}
                </span>
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <BookOpen className="w-4 h-4 text-gray-500" />
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    ISBN
                  </p>
                </div>
                <p className="text-base font-semibold text-gray-900">
                  {selectedBook.isbn}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Borrowed Date
                  </p>
                </div>
                <p className="text-base font-semibold text-gray-900">
                  {formatDate(selectedBook.borrowDate)}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 col-span-2">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Due Date
                  </p>
                </div>
                <p className="text-base font-semibold text-gray-900">
                  {formatDate(selectedBook.dueDate)}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

