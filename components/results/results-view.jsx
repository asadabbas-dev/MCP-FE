"use client";

import { useState } from "react";
import Card from "@/components/common/card";
import TeacherResultsView from "@/components/results/teacher-results-view";
import { useAuth } from "@/contexts/auth-context";
import { FileText, TrendingUp, BarChart3 } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

/**
 * Results View Component (Student View)
 *
 * Displays student academic results with:
 * - Detailed Marks Certificate (DMC) for each semester
 * - Semester-wise GPA calculation
 * - Overall CGPA calculation
 * - Grade history visualization using Chart.js
 * - Marks display (marksObtained / totalMarks)
 *
 * Features:
 * - Toggle between DMC and Grade History views
 * - Interactive bar chart for grade history
 * - Semester-wise breakdown
 *
 * Note: If user is a teacher, renders TeacherResultsView instead.
 */

export default function ResultsView() {
  const { isTeacher } = useAuth();

  // Show teacher view if user is a teacher
  if (isTeacher) {
    return <TeacherResultsView />;
  }

  const semesters = [
    {
      id: 1,
      name: "Fall 2024",
      gpa: 3.75,
      courses: [
        {
          code: "CS101",
          name: "Introduction to Computer Science",
          grade: "A",
          creditHours: 3,
          marksObtained: 92,
          totalMarks: 100,
        },
        {
          code: "CS201",
          name: "Data Structures",
          grade: "A-",
          creditHours: 3,
          marksObtained: 88,
          totalMarks: 100,
        },
        {
          code: "CS301",
          name: "Database Systems",
          grade: "B+",
          creditHours: 3,
          marksObtained: 85,
          totalMarks: 100,
        },
      ],
    },
    {
      id: 2,
      name: "Spring 2024",
      gpa: 3.68,
      courses: [
        {
          code: "CS102",
          name: "Programming Fundamentals",
          grade: "A",
          creditHours: 3,
          marksObtained: 90,
          totalMarks: 100,
        },
        {
          code: "CS202",
          name: "Algorithms",
          grade: "B+",
          creditHours: 3,
          marksObtained: 87,
          totalMarks: 100,
        },
      ],
    },
  ];

  const overallCGPA = 3.71;
  const [selectedView, setSelectedView] = useState("dmc"); // "dmc" or "history"

  // Grade history data for visualization
  const gradeHistory = [
    { semester: "Fall 2023", gpa: 3.65 },
    { semester: "Spring 2024", gpa: 3.68 },
    { semester: "Fall 2024", gpa: 3.75 },
  ];

  const maxGPA = 4.0;

  // Chart data
  const chartData = {
    labels: gradeHistory.map((item) => item.semester),
    datasets: [
      {
        label: "GPA",
        data: gradeHistory.map((item) => item.gpa),
        backgroundColor: "rgba(99, 102, 241, 0.8)",
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
        barThickness: 50,
        maxBarThickness: 60,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function (context) {
            return `GPA: ${context.parsed.y.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 4.0,
        ticks: {
          stepSize: 0.5,
          font: {
            size: 12,
          },
          color: "#6B7280",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        title: {
          display: true,
          text: "GPA",
          font: {
            size: 14,
            weight: "bold",
          },
          color: "#374151",
        },
      },
      x: {
        ticks: {
          font: {
            size: 12,
          },
          color: "#6B7280",
        },
        grid: {
          display: false,
        },
        categoryPercentage: 0.5,
        barPercentage: 0.6,
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Academic Results</h1>
          <p className="text-gray-600 mt-1">
            View your semester results and CGPA
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setSelectedView("dmc")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedView === "dmc"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            DMC
          </button>
          <button
            onClick={() => setSelectedView("history")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedView === "history"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Grade History
          </button>
        </div>
      </div>

      {/* Overall CGPA Card */}
      <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-indigo-100 text-sm mb-1">Overall CGPA</p>
            <p className="text-4xl font-bold">{overallCGPA}</p>
          </div>
          <TrendingUp className="w-16 h-16 text-indigo-200" />
        </div>
      </Card>

      {selectedView === "history" && (
        <Card title="Grade History">
          <div className="space-y-6">
            {/* Chart Visualization */}
            <div className="h-80 w-full">
              <Bar data={chartData} options={chartOptions} />
            </div>

            {/* Summary Grid */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Semester Summary
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {gradeHistory.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center"
                  >
                    <p className="text-sm text-gray-600 mb-1">
                      {item.semester}
                    </p>
                    <p className="text-2xl font-bold text-indigo-600">
                      {item.gpa}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">GPA</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {selectedView === "dmc" && (
        <>
          {/* Semester Results */}
          <div className="space-y-6">
            {semesters.map((semester) => (
              <Card key={semester.id} title={semester.name}>
                <div className="bg-primary text-white mb-4 px-4 py-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">Semester GPA</span>
                    <span className="text-sm font-bold">{semester.gpa}</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                          Course Code
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                          Course Name
                        </th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">
                          Credit Hours
                        </th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">
                          Marks
                        </th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">
                          Grade
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {semester.courses.map((course, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-3 px-4 text-sm text-gray-900">
                            {course.code}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {course.name}
                          </td>
                          <td className="py-3 px-4 text-sm text-center text-gray-600">
                            {course.creditHours}
                          </td>
                          <td className="py-3 px-4 text-center text-sm text-gray-900">
                            {course.marksObtained} / {course.totalMarks}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-md">
                              {course.grade}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
