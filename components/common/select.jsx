"use client";

import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

/**
 * Common Select/Dropdown Component
 * Modern styled dropdown with custom design
 * Supports both controlled (value/onChange) and react-hook-form (register) patterns
 */

export default function Select({
  label,
  name,
  value,
  onChange,
  register,
  placeholder = "Select an option",
  error = "",
  required = false,
  options = [],
  className = "",
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || "");
  const dropdownRef = useRef(null);
  const selectRef = useRef(null);

  // Get register props if provided
  const registerProps = register ? register(name) : null;

  // Get display text for selected option
  const getDisplayText = () => {
    const currentValue =
      selectedValue ||
      value ||
      (registerProps?.value !== undefined ? registerProps.value : "");

    if (!currentValue) return placeholder;

    const option = options.find((opt) => {
      if (typeof opt === "string") return opt === currentValue;
      return opt.value === currentValue;
    });

    if (option) {
      return typeof option === "string" ? option : option.label;
    }
    return placeholder;
  };

  // Handle option click
  const handleOptionClick = (optionValue) => {
    setSelectedValue(optionValue);
    setIsOpen(false);

    // Update hidden select value
    if (selectRef.current) {
      selectRef.current.value = optionValue;
    }

    // Trigger onChange for react-hook-form
    if (registerProps && registerProps.onChange) {
      const event = {
        target: {
          name,
          value: optionValue,
        },
      };
      registerProps.onChange(event);
    }

    // Trigger onChange for controlled component
    if (onChange) {
      const event = {
        target: {
          name,
          value: optionValue,
        },
      };
      onChange(event);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Sync with external value changes
  useEffect(() => {
    if (value !== undefined && value !== selectedValue) {
      setSelectedValue(value);
      if (selectRef.current) {
        selectRef.current.value = value;
      }
    }
  }, [value]);

  // Sync with react-hook-form value
  useEffect(() => {
    if (registerProps && registerProps.value !== undefined) {
      const formValue = registerProps.value;
      if (formValue !== selectedValue) {
        setSelectedValue(formValue);
        if (selectRef.current) {
          selectRef.current.value = formValue;
        }
      }
    }
  }, [registerProps?.value]);

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

      {/* Hidden select for form submission and react-hook-form */}
      <select
        ref={selectRef}
        id={name}
        className="hidden"
        {...(registerProps || {})}
        {...(onChange ? { value: selectedValue, onChange, name } : {})}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => {
          if (typeof option === "string") {
            return (
              <option key={option} value={option}>
                {option}
              </option>
            );
          }
          return (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </select>

      {/* Custom styled dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-left bg-white border rounded-lg
            flex items-center justify-between
            transition-colors duration-200
            focus:outline-none
            ${error ? "border-red-500" : "border-gray-300"}
            ${className}
          `}
        >
          <span
            className={`${
              !selectedValue &&
              !value &&
              (!registerProps || !registerProps.value)
                ? "text-gray-400"
                : "text-gray-900"
            }`}
          >
            {getDisplayText()}
          </span>
          <ChevronDown
            className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
              isOpen ? "transform rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            {placeholder && (
              <button
                type="button"
                onClick={() => handleOptionClick("")}
                className="w-full px-4 py-2.5 text-left text-gray-400 hover:bg-gray-50 transition-colors"
              >
                {placeholder}
              </button>
            )}
            {options.map((option) => {
              const optionValue =
                typeof option === "string" ? option : option.value;
              const optionLabel =
                typeof option === "string" ? option : option.label;
              const currentValue =
                selectedValue ||
                value ||
                (registerProps?.value !== undefined ? registerProps.value : "");
              const isSelected = currentValue === optionValue;

              return (
                <button
                  key={optionValue}
                  type="button"
                  onClick={() => handleOptionClick(optionValue)}
                  className={`
                    w-full px-4 py-2.5 text-left transition-colors
                    ${
                      isSelected
                        ? "bg-indigo-50 text-indigo-700 font-medium"
                        : "text-gray-900 hover:bg-gray-50"
                    }
                  `}
                >
                  {optionLabel}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-xs sm:text-sm text-red-600">{error}</p>}
    </div>
  );
}
