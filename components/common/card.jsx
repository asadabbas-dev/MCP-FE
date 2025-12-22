/**
 * Common Card Component
 * 
 * A reusable card container component with optional title and subtitle.
 * Provides consistent styling for content sections throughout the application.
 * 
 * @param {ReactNode} children - Card content
 * @param {string} className - Additional CSS classes
 * @param {string} title - Optional card title
 * @param {string} subtitle - Optional card subtitle
 * @param {object} props - Additional HTML div attributes
 * 
 * @example
 * <Card title="User Profile" subtitle="Manage your information">
 *   <ProfileContent />
 * </Card>
 */

export default function Card({
  children,
  className = "",
  title,
  subtitle,
  ...props
}) {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-3 ${className}`}
      {...props}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          )}
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
