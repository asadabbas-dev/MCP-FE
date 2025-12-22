/**
 * Common Button Component
 * 
 * A reusable button component with multiple variants and sizes.
 * Supports icons via startIcon prop and all standard button attributes.
 * 
 * @param {ReactNode} children - Button text/content
 * @param {string} variant - Button style: 'primary' | 'secondary' | 'outline' | 'danger' | 'success'
 * @param {string} size - Button size: 'sm' | 'md' | 'lg'
 * @param {string} className - Additional CSS classes
 * @param {boolean} disabled - Disable button interaction
 * @param {string} type - Button type: 'button' | 'submit' | 'reset'
 * @param {function} onClick - Click handler function
 * @param {ReactNode} startIcon - Icon component to display before text
 * @param {object} props - Additional HTML button attributes
 * 
 * @example
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click Me
 * </Button>
 * 
 * <Button startIcon={<Icon />} variant="outline">
 *   Submit
 * </Button>
 */

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  startIcon,
  ...props
}) {
  const baseStyles = 'font-medium rounded-lg transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center';
  
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    outline: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {startIcon && <span className="mr-2">{startIcon}</span>}
      {children}
    </button>
  );
}

