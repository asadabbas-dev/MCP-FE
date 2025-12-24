/**
 * Mock Data for Admin Pages
 * 
 * Provides mock data for admin pages when backend is not available
 * or for demonstration purposes.
 */

export const mockStudents = [
  {
    id: "1",
    fullName: "Ahmed Ali",
    email: "ahmed.ali@example.com",
    rollNumber: "STU-2024-001",
    currentSemester: 3,
    program: "BS Computer Science",
    isActive: true,
  },
  {
    id: "2",
    fullName: "Fatima Khan",
    email: "fatima.khan@example.com",
    rollNumber: "STU-2024-002",
    currentSemester: 2,
    program: "BS Computer Science",
    isActive: true,
  },
  {
    id: "3",
    fullName: "Hassan Raza",
    email: "hassan.raza@example.com",
    rollNumber: "STU-2024-003",
    currentSemester: 4,
    program: "BS Software Engineering",
    isActive: true,
  },
  {
    id: "4",
    fullName: "Ayesha Malik",
    email: "ayesha.malik@example.com",
    rollNumber: "STU-2024-004",
    currentSemester: 1,
    program: "BS Computer Science",
    isActive: true,
  },
  {
    id: "5",
    fullName: "Usman Sheikh",
    email: "usman.sheikh@example.com",
    rollNumber: "STU-2024-005",
    currentSemester: 5,
    program: "BS Information Technology",
    isActive: true,
  },
];

export const mockTeachers = [
  {
    id: "1",
    fullName: "Dr. Muhammad Ali",
    email: "muhammad.ali@example.com",
    employeeId: "EMP-2024-001",
    department: "Computer Science",
    designation: "Professor",
    isActive: true,
  },
  {
    id: "2",
    fullName: "Dr. Sarah Ahmed",
    email: "sarah.ahmed@example.com",
    employeeId: "EMP-2024-002",
    department: "Computer Science",
    designation: "Associate Professor",
    isActive: true,
  },
  {
    id: "3",
    fullName: "Dr. Ali Hassan",
    email: "ali.hassan@example.com",
    employeeId: "EMP-2024-003",
    department: "Software Engineering",
    designation: "Assistant Professor",
    isActive: true,
  },
];

export const mockCourses = [
  {
    id: "1",
    code: "CS101",
    name: "Introduction to Programming",
    creditHours: 3,
    semester: "Fall 2024",
    description: "Basic programming concepts and problem-solving",
    teacher: {
      id: "1",
      user: {
        fullName: "Dr. Muhammad Ali",
      },
    },
    isActive: true,
  },
  {
    id: "2",
    code: "CS201",
    name: "Data Structures",
    creditHours: 3,
    semester: "Fall 2024",
    description: "Fundamental data structures and algorithms",
    teacher: {
      id: "1",
      user: {
        fullName: "Dr. Muhammad Ali",
      },
    },
    isActive: true,
  },
  {
    id: "3",
    code: "CS301",
    name: "Database Systems",
    creditHours: 3,
    semester: "Fall 2024",
    description: "Database design and SQL",
    teacher: {
      id: "2",
      user: {
        fullName: "Dr. Sarah Ahmed",
      },
    },
    isActive: true,
  },
  {
    id: "4",
    code: "SE201",
    name: "Software Engineering",
    creditHours: 4,
    semester: "Fall 2024",
    description: "Software development lifecycle and methodologies",
    teacher: {
      id: "3",
      user: {
        fullName: "Dr. Ali Hassan",
      },
    },
    isActive: true,
  },
];

export const mockTimetable = [
  {
    id: "1",
    courseId: "1",
    course: {
      id: "1",
      code: "CS101",
      name: "Introduction to Programming",
    },
    dayOfWeek: "Monday",
    startTime: "09:00",
    endTime: "10:30",
    room: "A-101",
    semester: "Fall 2024",
  },
  {
    id: "2",
    courseId: "2",
    course: {
      id: "2",
      code: "CS201",
      name: "Data Structures",
    },
    dayOfWeek: "Monday",
    startTime: "11:00",
    endTime: "12:30",
    room: "A-102",
    semester: "Fall 2024",
  },
  {
    id: "3",
    courseId: "3",
    course: {
      id: "3",
      code: "CS301",
      name: "Database Systems",
    },
    dayOfWeek: "Tuesday",
    startTime: "09:00",
    endTime: "10:30",
    room: "B-201",
    semester: "Fall 2024",
  },
  {
    id: "4",
    courseId: "4",
    course: {
      id: "4",
      code: "SE201",
      name: "Software Engineering",
    },
    dayOfWeek: "Wednesday",
    startTime: "14:00",
    endTime: "15:30",
    room: "C-301",
    semester: "Fall 2024",
  },
  {
    id: "5",
    courseId: "1",
    course: {
      id: "1",
      code: "CS101",
      name: "Introduction to Programming",
    },
    dayOfWeek: "Thursday",
    startTime: "09:00",
    endTime: "10:30",
    room: "A-101",
    semester: "Fall 2024",
  },
];

export const mockAdminNotifications = [
  {
    id: 1,
    type: "info",
    title: "System Maintenance Scheduled",
    message: "Scheduled maintenance on December 30, 2024 from 2:00 AM to 4:00 AM. System will be temporarily unavailable.",
    time: "1 hour ago",
    course: null,
    read: false,
  },
  {
    id: 2,
    type: "alert",
    title: "New Student Registration",
    message: "5 new students have been registered this week. Review and approve their accounts.",
    time: "3 hours ago",
    course: null,
    read: false,
  },
  {
    id: 3,
    type: "info",
    title: "Course Enrollment Report",
    message: "Fall 2024 course enrollment statistics are ready for review. Total enrollments: 150 students across 30 courses.",
    time: "1 day ago",
    course: null,
    read: true,
  },
  {
    id: 4,
    type: "warning",
    title: "Teacher Account Pending",
    message: "2 new teacher accounts are pending approval. Please review and activate them.",
    time: "2 days ago",
    course: null,
    read: false,
  },
  {
    id: 5,
    type: "info",
    title: "Timetable Update Required",
    message: "Spring 2025 timetable needs to be created. Please schedule classes and assign teachers.",
    time: "3 days ago",
    course: null,
    read: true,
  },
];

export const mockStudentNotifications = [
  {
    id: 1,
    type: "alert",
    title: "Assignment Due Tomorrow",
    message: "Data Structures Project is due on December 25, 2024",
    time: "2 hours ago",
    course: "CS201 - Data Structures",
    read: false,
  },
  {
    id: 2,
    type: "info",
    title: "New Course Material Available",
    message: "Lecture slides for Week 12 have been uploaded",
    time: "5 hours ago",
    course: "CS301 - Database Systems",
    read: false,
  },
  {
    id: 3,
    type: "warning",
    title: "Library Book Due Soon",
    message: 'Your book "Introduction to Algorithms" is due in 2 days',
    time: "1 day ago",
    course: null,
    read: false,
  },
  {
    id: 4,
    type: "info",
    title: "Exam Schedule Released",
    message: "Final exam schedule for Fall 2024 has been published",
    time: "2 days ago",
    course: null,
    read: false,
  },
];

export const mockTeacherNotifications = [
  {
    id: 1,
    type: "info",
    title: "New Assignment Submissions",
    message: "15 students have submitted their Data Structures project. Please review and grade them.",
    time: "1 hour ago",
    course: "CS201 - Data Structures",
    read: false,
  },
  {
    id: 2,
    type: "alert",
    title: "Student Request Pending",
    message: "3 students have submitted requests for course changes. Please review and respond.",
    time: "4 hours ago",
    course: null,
    read: false,
  },
  {
    id: 3,
    type: "info",
    title: "Feedback Received",
    message: "You have received 5 new feedback entries from students. Review them in the Feedback section.",
    time: "1 day ago",
    course: null,
    read: true,
  },
  {
    id: 4,
    type: "warning",
    title: "Grade Submission Deadline",
    message: "Final grades for Fall 2024 must be submitted by January 5, 2025.",
    time: "2 days ago",
    course: null,
    read: false,
  },
];

