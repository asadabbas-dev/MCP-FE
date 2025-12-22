"use client";

import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import SearchResults from "@/components/common/search-results";
import NotificationsDropdown from "./notifications-dropdown";
import ProfileDropdown from "./profile-dropdown";

/**
 * Dashboard Header Component
 *
 * Main header bar with global search, notifications dropdown, and profile dropdown.
 * Fixed at the top of the page, responsive for mobile and desktop.
 *
 * Features:
 * - Global search across courses, assignments, and library
 * - Real-time search results dropdown
 * - Notification bell with unread count
 * - User profile dropdown
 */

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);

  // Mock search data - TODO: Replace with actual API call
  const searchData = {
    course: [
      {
        id: 1,
        title: "CS201 - Data Structures",
        subtitle: "Dr. Sara Khan",
        href: "/courses",
      },
      {
        id: 2,
        title: "CS301 - Database Systems",
        subtitle: "Dr. Muhammad Hassan",
        href: "/courses",
      },
      {
        id: 3,
        title: "CS401 - Web Development",
        subtitle: "Dr. Ahmed Ali",
        href: "/courses",
      },
    ],
    assignment: [
      {
        id: 1,
        title: "Data Structures Project",
        subtitle: "Due: Dec 25, 2024",
        href: "/assignments",
      },
      {
        id: 2,
        title: "Database Design Assignment",
        subtitle: "Due: Dec 20, 2024",
        href: "/assignments",
      },
    ],
    library: [
      {
        id: 1,
        title: "Introduction to Algorithms",
        subtitle: "Thomas H. Cormen",
        href: "/library",
      },
    ],
  };

  // Filter and display search results as user types
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      // Filter search results by category
      const filtered = {};
      Object.entries(searchData).forEach(([category, items]) => {
        const matches = items.filter(
          (item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.subtitle &&
              item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        if (matches.length > 0) {
          filtered[category] = matches.slice(0, 3); // Limit to 3 results per category
        }
      });
      setSearchResults(Object.keys(filtered).length > 0 ? filtered : null);
      setIsSearchOpen(true);
    } else {
      setSearchResults(null);
      setIsSearchOpen(false);
    }
  }, [searchQuery]);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  return (
    <header className="bg-white border-b border-gray-200 h-16 fixed top-0 right-0 left-0 lg:left-64 z-10">
      <div className="h-full px-4 lg:px-6 flex items-center justify-between">
        <div className="flex-1 max-w-xl relative ml-12 lg:ml-0" ref={searchRef}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search courses, assignments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery && setIsSearchOpen(true)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none"
            />
          </div>
          {isSearchOpen && searchResults !== undefined && (
            <SearchResults
              results={searchResults}
              onClose={() => {
                setIsSearchOpen(false);
                setSearchQuery("");
              }}
            />
          )}
        </div>

        <div className="flex items-center space-x-2 lg:space-x-4">
          <NotificationsDropdown />
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}
