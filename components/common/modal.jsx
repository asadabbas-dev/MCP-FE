"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

/**
 * Modal Component
 * 
 * A reusable modal/dialog component with backdrop, close button, and size variants.
 * Prevents body scrolling when open and closes on backdrop click.
 * 
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Function to call when modal should close
 * @param {string} title - Modal title displayed in header
 * @param {ReactNode} children - Modal content
 * @param {string} size - Modal size: 'sm' | 'md' | 'lg' | 'xl'
 * 
 * @example
 * <Modal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Edit Profile"
 *   size="lg"
 * >
 *   <FormContent />
 * </Modal>
 */

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}) {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup: restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-sm sm:max-w-md",
    md: "max-w-sm sm:max-w-lg",
    lg: "max-w-lg sm:max-w-2xl",
    xl: "max-w-2xl sm:max-w-4xl",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-lg shadow-xl w-full ${sizes[size]} max-h-[95vh] sm:max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-primary border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold text-white truncate pr-2">{title}</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 focus:outline-none flex-shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}
