"use client";

import { Search, BookOpen, FileText, Calendar, Library, MessageSquare } from "lucide-react";
import Link from "next/link";

const iconMap = {
  course: BookOpen,
  assignment: FileText,
  timetable: Calendar,
  library: Library,
  forum: MessageSquare,
};

export default function SearchResults({ results, onClose }) {
  if (!results || Object.keys(results).length === 0) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
        <div className="p-4 text-center text-gray-500">
          <Search className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm">No results found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
      {Object.entries(results).map(([category, items]) => {
        if (!items || items.length === 0) return null;
        const Icon = iconMap[category] || Search;
        
        return (
          <div key={category} className="border-b border-gray-200 last:border-b-0">
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Icon className="w-4 h-4 text-gray-600" />
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  {category === "course" ? "Courses" : category === "assignment" ? "Assignments" : category === "timetable" ? "Timetable" : category === "library" ? "Library" : "Forum"}
                </h4>
                <span className="text-xs text-gray-500">({items.length})</span>
              </div>
            </div>
            <div className="py-2">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onClose}
                  className="block px-4 py-2 hover:bg-gray-50 transition-colors"
                >
                  <p className="text-sm font-medium text-gray-900">{item.title}</p>
                  {item.subtitle && (
                    <p className="text-xs text-gray-500 mt-0.5">{item.subtitle}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

