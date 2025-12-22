"use client";

import { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

/**
 * Toast Notification Component
 * 
 * Displays temporary notification messages with auto-dismiss functionality.
 * Used for success, error, warning, and info messages.
 * 
 * @param {string} message - Toast message text
 * @param {string} type - Toast type: 'success' | 'error' | 'warning' | 'info'
 * @param {function} onClose - Function to call when toast should close
 * @param {number} duration - Auto-dismiss duration in milliseconds (default: 3000)
 * 
 * Features:
 * - Auto-dismiss after duration
 * - Manual close button
 * - Color-coded by type
 * - Icon display based on type
 * 
 * @example
 * <Toast
 *   message="Assignment submitted successfully!"
 *   type="success"
 *   onClose={() => setToast(null)}
 *   duration={3000}
 * />
 */

export default function Toast({ message, type = "success", onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-600" />,
    error: <AlertCircle className="w-5 h-5 text-red-600" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
    info: <Info className="w-5 h-5 text-blue-600" />,
  };

  const bgColors = {
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
    warning: "bg-yellow-50 border-yellow-200",
    info: "bg-blue-50 border-blue-200",
  };

  const textColors = {
    success: "text-green-800",
    error: "text-red-800",
    warning: "text-yellow-800",
    info: "text-blue-800",
  };

  return (
    <div
      className={`
        flex items-center space-x-3 px-4 py-3 rounded-lg border shadow-lg
        ${bgColors[type]} ${textColors[type]}
      `}
    >
      <div className="shrink-0">{icons[type]}</div>
      <p className="text-sm font-medium flex-1">{message}</p>
      <button
        onClick={onClose}
        className="shrink-0 p-1 hover:bg-black/10 rounded transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

