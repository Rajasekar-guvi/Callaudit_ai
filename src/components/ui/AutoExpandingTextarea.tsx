import React, { useRef, useEffect, useState } from 'react';
import { MessageSquare } from 'lucide-react';

interface AutoExpandingTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
}

export const AutoExpandingTextarea: React.FC<AutoExpandingTextareaProps> = ({
  value,
  onChange,
  placeholder = 'Enter notes...',
  maxLength = 2000,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '80px';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 300) + 'px';
    }
  }, [value]);

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes</label>

      <div
        className={`relative px-4 py-3 border-2 rounded-xl transition-all duration-200 bg-white dark:bg-slate-800 ${
          isFocused
            ? 'border-blue-500'
            : value.length > 0
              ? 'border-green-500'
              : 'border-gray-200 dark:border-gray-700'
        }`}
      >
        <div className="flex items-start gap-3">
          <MessageSquare
            className={`w-5 h-5 mt-2 flex-shrink-0 transition-colors ${
              isFocused ? 'text-blue-500' : 'text-gray-400'
            }`}
          />

          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value.substring(0, maxLength))}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="flex-1 resize-none bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
            rows={3}
          />
        </div>
      </div>

      <div className="mt-2 flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>Character count:</span>
        <span>
          {value.length} / {maxLength}
        </span>
      </div>
    </div>
  );
};
