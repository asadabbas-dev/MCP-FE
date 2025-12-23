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
    <div className="space-y-5 sm:space-y-6">
      {/* Header Section with proper spacing */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2">Library</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Manage your borrowed books and search the catalog
          </p>
        </div>
        <Button
          startIcon={<Search className="w-4 h-4" />}
          onClick={() => setIsSearchModalOpen(true)}
          size="md"
          className="w-full sm:w-auto whitespace-nowrap"
        >
          Search Books
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-1 sm:space-x-2 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("current")}
          className={`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center justify-center ${
            activeTab === "current"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
          <span className="truncate">Currently Borrowed</span>
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center justify-center ${
            activeTab === "history"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <History className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
          <span className="truncate">Borrowing History</span>
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
            <div key={book.id} className="p-3 sm:p-4 bg-gray-50 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 flex-shrink-0" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                      {book.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1 break-words">by {book.author}</p>
                  <p className="text-xs text-gray-500 break-all">ISBN: {book.isbn}</p>
                </div>
                <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-md whitespace-nowrap flex-shrink-0 self-start sm:self-auto">
                  {book.status}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 pt-3 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 lg:space-x-6 gap-2 sm:gap-0 text-xs sm:text-sm text-gray-600">
                  <div className="break-words">
                    Borrowed:{" "}
                    <span className="font-medium">
                      {formatDate(book.borrowDate)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
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
                  className="w-full sm:w-auto"
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
                <div key={book.id} className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                        <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 flex-shrink-0" />
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                          {book.title}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-1 break-words">by {book.author}</p>
                      <p className="text-xs text-gray-500 break-all">ISBN: {book.isbn}</p>
                    </div>
                    <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-md whitespace-nowrap flex-shrink-0 self-start sm:self-auto">
                      {book.status}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 pt-3 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 lg:space-x-6 gap-2 sm:gap-0 text-xs sm:text-sm text-gray-600">
                      <div className="break-words">
                        Borrowed:{" "}
                        <span className="font-medium">
                          {formatDate(book.borrowDate)}
                        </span>
                      </div>
                      <div className="break-words">
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
            <div className="pb-3 sm:pb-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0 mb-3">
                <div className="flex items-start space-x-2 sm:space-x-3 min-w-0 flex-1">
                  <div className="p-1.5 sm:p-2 bg-indigo-100 rounded-lg flex-shrink-0">
                    <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 break-words">
                      {selectedBook.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-gray-600 break-words">
                      by {selectedBook.author}
                    </p>
                  </div>
                </div>
                <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-green-100 text-green-800 text-xs font-semibold rounded-md whitespace-nowrap flex-shrink-0 self-start sm:self-auto">
                  {selectedBook.status}
                </span>
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-1.5 sm:space-x-2 mb-2">
                  <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    ISBN
                  </p>
                </div>
                <p className="text-sm sm:text-base font-semibold text-gray-900 break-all">
                  {selectedBook.isbn}
                </p>
              </div>
              <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-1.5 sm:space-x-2 mb-2">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Borrowed Date
                  </p>
                </div>
                <p className="text-sm sm:text-base font-semibold text-gray-900">
                  {formatDate(selectedBook.borrowDate)}
                </p>
              </div>
              <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200 sm:col-span-2">
                <div className="flex items-center space-x-1.5 sm:space-x-2 mb-2">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Due Date
                  </p>
                </div>
                <p className="text-sm sm:text-base font-semibold text-gray-900">
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

