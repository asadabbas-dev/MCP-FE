"use client";

import Card from "@/components/common/card";
import { Calendar, Clock, MapPin } from "lucide-react";

export default function TimetableView() {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const timetable = {
    Monday: [
      {
        time: "09:00 - 10:30",
        course: "Data Structures",
        code: "CS201",
        room: "A-101",
        instructor: "Dr. Sara Khan",
      },
      {
        time: "11:00 - 12:30",
        course: "Database Systems",
        code: "CS301",
        room: "B-205",
        instructor: "Dr. Muhammad Hassan",
      },
      {
        time: "02:00 - 03:30",
        course: "Web Development",
        code: "CS401",
        room: "C-301",
        instructor: "Dr. Ahmed Ali",
      },
    ],
    Tuesday: [
      {
        time: "09:00 - 10:30",
        course: "Data Structures",
        code: "CS201",
        room: "A-101",
        instructor: "Dr. Sara Khan",
      },
      {
        time: "02:00 - 03:30",
        course: "Web Development",
        code: "CS401",
        room: "C-301",
        instructor: "Dr. Ahmed Ali",
      },
    ],
    Wednesday: [
      {
        time: "11:00 - 12:30",
        course: "Database Systems",
        code: "CS301",
        room: "B-205",
        instructor: "Dr. Muhammad Hassan",
      },
    ],
    Thursday: [
      {
        time: "09:00 - 10:30",
        course: "Data Structures",
        code: "CS201",
        room: "A-101",
        instructor: "Dr. Sara Khan",
      },
      {
        time: "11:00 - 12:30",
        course: "Database Systems",
        code: "CS301",
        room: "B-205",
        instructor: "Dr. Muhammad Hassan",
      },
    ],
    Friday: [
      {
        time: "02:00 - 03:30",
        course: "Web Development",
        code: "CS401",
        room: "C-301",
        instructor: "Dr. Ahmed Ali",
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Timetable</h1>
        <p className="text-gray-600 mt-1">
          View your class schedule for the current semester
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {days.map((day) => (
          <Card key={day} title={day} className="min-h-[400px]">
            <div className="space-y-3">
              {timetable[day] && timetable[day].length > 0 ? (
                timetable[day].map((classItem, index) => (
                  <div
                    key={index}
                    className="p-3 bg-indigo-50 rounded-lg border border-indigo-100"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-medium text-indigo-900">
                        {classItem.time}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">
                      {classItem.course}
                    </h4>
                    <p className="text-xs text-gray-600 mb-2">
                      {classItem.code}
                    </p>
                    <div className="flex items-center text-xs text-gray-600 mb-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      {classItem.room}
                    </div>
                    <p className="text-xs text-gray-500">
                      {classItem.instructor}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">
                  No classes scheduled
                </p>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
