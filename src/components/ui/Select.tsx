"use client";
import { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiCheck } from "react-icons/fi";
import { IconType } from "react-icons";

export type SelectOption<T = string> = {
  value: T;
  label: string;
  icon?: IconType | React.ReactNode;
};

type SelectProps<T = string> = {
  options: SelectOption<T>[];
  value?: T;
  onChange: (value: T) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "outline" | "filled" | "ghost";
};

export const Select = <T extends string | number>({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className = "",
  disabled = false,
  size = "md",
  variant = "outline",
}: SelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Size classes
  const sizeClasses = {
    sm: "py-1 px-2 text-sm",
    md: "py-2 px-3 text-base",
    lg: "py-3 px-4 text-lg",
  };

  // Variant classes
  const variantClasses = {
    outline:
      "bg-transparent border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500",
    filled:
      "bg-gray-100 dark:bg-gray-700 border border-transparent hover:bg-gray-200 dark:hover:bg-gray-600",
    ghost:
      "bg-transparent border border-transparent hover:bg-gray-100 dark:hover:bg-gray-700",
  };

  return (
    <div ref={selectRef} className={`relative w-full ${className}`}>
      <button
        type='button'
        className={`w-full flex items-center justify-between rounded-md transition-all duration-200 ${
          sizeClasses[size]
        } ${variantClasses[variant]} ${
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <div className='flex items-center gap-2'>
          {selectedOption?.icon &&
            (typeof selectedOption.icon === "function" ? (
              <selectedOption.icon className='h-4 w-4' />
            ) : (
              selectedOption.icon
            ))}
          <span className='truncate'>
            {selectedOption?.label || placeholder}
          </span>
        </div>
        <FiChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className='absolute z-50 mt-1 w-full rounded-md bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden'>
          <ul className='max-h-60 overflow-auto py-1 focus:outline-none'>
            {options.map((option) => (
              <li
                key={option.value}
                className={`px-3 py-2 cursor-pointer flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  value === option.value
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : "text-gray-900 dark:text-gray-100"
                }`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                <div className='flex items-center gap-2'>
                  {option.icon &&
                    (typeof option.icon === "function" ? (
                      <option.icon className='h-4 w-4' />
                    ) : (
                      option.icon
                    ))}
                  <span>{option.label}</span>
                </div>
                {value === option.value && <FiCheck className='h-4 w-4' />}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
