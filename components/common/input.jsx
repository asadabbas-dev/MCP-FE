/**
 * Common Input Component
 * 
 * A reusable input field component that supports both controlled components
 * and react-hook-form integration. Includes label, error display, and validation.
 * 
 * @param {string} label - Input field label
 * @param {string} type - Input type: 'text' | 'email' | 'password' | 'number' | etc.
 * @param {string} name - Input name attribute (required for forms)
 * @param {string} value - Controlled component value
 * @param {function} onChange - Controlled component onChange handler
 * @param {function} register - react-hook-form register function
 * @param {string} placeholder - Placeholder text
 * @param {string} error - Error message to display
 * @param {boolean} required - Mark field as required
 * @param {string} className - Additional CSS classes
 * @param {object} props - Additional HTML input attributes
 * 
 * @example
 * // Controlled component
 * <Input
 *   label="Email"
 *   type="email"
 *   name="email"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 * />
 * 
 * // react-hook-form
 * <Input
 *   label="Email"
 *   type="email"
 *   name="email"
 *   register={register}
 *   error={errors.email?.message}
 * />
 */

export default function Input({
  label,
  type = "text",
  name,
  value,
  onChange,
  register,
  placeholder = "",
  error = "",
  required = false,
  className = "",
  ...props
}) {
  // If register is provided (react-hook-form), use it; otherwise use value/onChange
  const inputProps = register
    ? { ...register(name) }
    : {
        value,
        onChange,
        name,
      };

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        id={name}
        placeholder={placeholder}
        required={required}
        className={`
          w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border rounded-lg
          focus:outline-none
          ${error ? "border-red-500" : "border-gray-300"}
          ${className}
        `}
        {...inputProps}
        {...props}
      />
      {error && <p className="mt-1 text-xs sm:text-sm text-red-600">{error}</p>}
    </div>
  );
}
