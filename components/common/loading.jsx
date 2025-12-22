/**
 * Loading Spinner Component
 *
 * A reusable loading spinner with different size options.
 * Used to indicate loading states throughout the application.
 *
 * @param {string} size - Spinner size: 'sm' | 'md' | 'lg'
 * @param {string} className - Additional CSS classes
 *
 * @example
 * <Loading size="sm" />
 * <Loading size="md" className="mt-4" />
 */

import { Loader2 } from "lucide-react";

export default function Loading({ size = "md", className = "" }) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`${sizes[size]} animate-spin text-white`} />
    </div>
  );
}
