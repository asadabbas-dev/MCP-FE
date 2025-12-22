/**
 * Alert Component
 */

import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from "lucide-react";

export default function Alert({
  type = "info",
  title,
  message,
  onClose,
  className = "",
}) {
  const types = {
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      icon: CheckCircle,
      iconColor: "text-green-600",
      titleColor: "text-green-800",
      textColor: "text-green-700",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      icon: AlertCircle,
      iconColor: "text-red-600",
      titleColor: "text-red-800",
      textColor: "text-red-700",
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      icon: AlertTriangle,
      iconColor: "text-yellow-600",
      titleColor: "text-yellow-800",
      textColor: "text-yellow-700",
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: Info,
      iconColor: "text-blue-600",
      titleColor: "text-blue-800",
      textColor: "text-blue-700",
    },
  };

  const config = types[type] || types.info;
  const Icon = config.icon;

  return (
    <div
      className={`${config.bg} ${config.border} border rounded-lg p-4 ${className}`}
    >
      <div className="flex items-start">
        <Icon className={`${config.iconColor} w-5 h-5 mt-0.5 mr-3 shrink-0`} />
        <div className="flex-1">
          {title && (
            <h4 className={`${config.titleColor} font-medium mb-1`}>{title}</h4>
          )}
          {message && (
            <p className={`${config.textColor} text-sm`}>{message}</p>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`${config.textColor} hover:opacity-70 ml-2`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
