"use client";

/**
 * Empty State Component
 * 
 * Reusable component to display empty states when lists have no items.
 * Provides a consistent UI for empty data scenarios.
 * 
 * @param {ReactComponent} icon - Icon component to display
 * @param {string} title - Empty state title
 * @param {string} description - Optional description text
 * @param {function} action - Optional action button click handler
 * @param {string} actionLabel - Optional action button label
 * 
 * @example
 * <EmptyState
 *   icon={FileText}
 *   title="No assignments"
 *   description="You don't have any assignments yet."
 *   action={() => setIsOpen(true)}
 *   actionLabel="Create Assignment"
 * />
 */

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {Icon && (
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-gray-400" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-600 text-center max-w-md mb-4">
          {description}
        </p>
      )}
      {action && actionLabel && (
        <button
          onClick={action}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

