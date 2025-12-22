/**
 * Utility functions
 */

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function calculateGPA(grades) {
  if (!grades || grades.length === 0) return 0;
  
  const gradePoints = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'F': 0.0
  };
  
  let totalPoints = 0;
  let totalCredits = 0;
  
  grades.forEach(grade => {
    const points = gradePoints[grade.grade] || 0;
    totalPoints += points * grade.creditHours;
    totalCredits += grade.creditHours;
  });
  
  return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
}

export function getStatusColor(status) {
  const colors = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'submitted': 'bg-green-100 text-green-800',
    'overdue': 'bg-red-100 text-red-800',
    'enrolled': 'bg-blue-100 text-blue-800',
    'completed': 'bg-gray-100 text-gray-800',
    'active': 'bg-green-100 text-green-800',
    'inactive': 'bg-gray-100 text-gray-800',
  };
  return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
}

