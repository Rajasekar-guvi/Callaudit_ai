import React, { useState } from 'react';
import { LucideIcon, Check, AlertCircle } from 'lucide-react';

interface FloatingLabelInputProps {
  label: string;
  icon: LucideIcon;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  type?: string;
  placeholder?: string;
  error?: string;
  isValid?: boolean;
  disabled?: boolean;
}

export const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  label,
  icon: Icon,
  value,
  onChange,
  onBlur,
  type = 'text',
  placeholder,
  error,
  isValid,
  disabled = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const hasValue = value.length > 0;
  const showError = error && !isFocused;

  return (
    <div className="relative mb-6">
      <div
        className={`relative flex items-center px-4 py-3 border-2 rounded-xl transition-all duration-200 bg-white dark:bg-slate-800 ${
          showError
            ? 'border-red-500'
            : isFocused
              ? 'border-blue-500'
              : hasValue
                ? 'border-green-500'
                : 'border-gray-200 dark:border-gray-700'
        }`}
      >
        <Icon
          className={`w-5 h-5 mr-3 transition-colors ${
            showError ? 'text-red-500' : isFocused ? 'text-blue-500' : 'text-gray-400'
          }`}
        />

        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          disabled={disabled}
          placeholder={isFocused ? placeholder : ''}
          className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 disabled:opacity-50"
        />

        <label
          className={`absolute left-12 transition-all duration-200 pointer-events-none ${
            isFocused || hasValue ? '-top-6 text-sm font-medium' : 'top-3.5 text-gray-500'
          } ${
            showError ? 'text-red-500' : isFocused ? 'text-blue-500' : hasValue ? 'text-green-500' : ''
          }`}
        >
          {label}
        </label>

        {hasValue && !showError && isValid !== false && (
          <Check className="w-5 h-5 text-green-500 ml-2" />
        )}
        {showError && <AlertCircle className="w-5 h-5 text-red-500 ml-2" />}
      </div>

      {showError && <p className="text-red-500 text-sm mt-2 ml-1">{error}</p>}
    </div>
  );
};
