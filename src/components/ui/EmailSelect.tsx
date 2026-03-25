// import React, { useState, useEffect } from 'react';
// import { Mail, ChevronDown, AlertCircle, Check, Loader } from 'lucide-react';
// import { supabase } from '../../services/supabaseClient';

// interface EmailSelectProps {
//   value: string;
//   onChange: (email: string) => void;
//   onBlur?: () => void;
//   error?: string;
//   disabled?: boolean;
// }

// interface EmailOption {
//   email: string;
//   count: number;
//   isPredefined: boolean;
// }

// const PREDEFINED_EMAILS = [
//   'saranyasrirangan@hclguvi.com',
//   'fardeen@hclguvi.com',
//   'mohana.a@hclguvi.com',
//   'kishorekumar@hclguvi.com',
//   'nivethap@hclguvi.com',
//   'beharalakshmi@hclguvi.com'
// ];

// export const EmailSelect: React.FC<EmailSelectProps> = ({
//   value,
//   onChange,
//   onBlur,
//   error,
//   disabled = false,
// }) => {
//   const [emailList, setEmailList] = useState<EmailOption[]>([]);
//   const [filteredList, setFilteredList] = useState<EmailOption[]>([]);
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isLoading, setIsLoading] = useState(true);

//   // Fetch emails once on mount
//   useEffect(() => {
//     const fetchEmails = async () => {
//       try {
//         setIsLoading(true);
//         const emailCounts: Record<string, number> = {};

//         // Initialize predefined with 0
//         PREDEFINED_EMAILS.forEach(email => {
//           emailCounts[email] = 0;
//         });

//         // Fetch from Supabase
//         const { data } = await supabase
//           .from('audit_submissions')
//           .select('email')
//           .not('email', 'is', null);

//         // Count submissions per email
//         if (data) {
//           data.forEach((row) => {
//             if (row.email) {
//               emailCounts[row.email] = (emailCounts[row.email] || 0) + 1;
//             }
//           });
//         }

//         // Build email list
//         const list = Object.entries(emailCounts).map(([email, count]) => ({
//           email,
//           count,
//           isPredefined: PREDEFINED_EMAILS.includes(email),
//         }));

//         // Sort: predefined first, then by count
//         list.sort((a, b) => {
//           if (a.isPredefined !== b.isPredefined) return a.isPredefined ? -1 : 1;
//           return b.count - a.count;
//         });

//         setEmailList(list);
//         setFilteredList(list);
//       } catch (err) {
//         console.error('Failed to fetch emails:', err);
//         // Fallback to predefined
//         const fallback = PREDEFINED_EMAILS.map(email => ({
//           email,
//           count: 0,
//           isPredefined: true,
//         }));
//         setEmailList(fallback);
//         setFilteredList(fallback);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchEmails();
//   }, []);

//   // Filter emails based on search
//   useEffect(() => {
//     if (!searchTerm.trim()) {
//       setFilteredList(emailList);
//     } else {
//       const filtered = emailList.filter(item =>
//         item.email.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredList(filtered);
//     }
//   }, [searchTerm, emailList]);

//   const hasSelected = value.length > 0;
//   const showError = error && !isOpen && !hasSelected;

//   const handleSelect = (selectedEmail: string) => {
//     onChange(selectedEmail);
//     setSearchTerm('');
//     setIsOpen(false);
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const inputValue = e.target.value;
//     setSearchTerm(inputValue);
//     setIsOpen(true);
//   };

//   const handleOpenDropdown = () => {
//     setIsOpen(true);
//   };

//   const handleCloseDropdown = () => {
//     setIsOpen(false);
//     setSearchTerm('');
//     onBlur?.();
//   };

//   return (
//     <div className="mb-6">
//       {/* Label */}
//       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//         Select Email Address
//       </label>

//       {/* Input Container */}
//       <div className="relative">
//         <div
//           className={`relative flex items-center px-4 py-3 border-2 rounded-xl transition-all duration-200 bg-white dark:bg-slate-800 cursor-pointer ${
//             showError
//               ? 'border-red-500'
//               : isOpen
//                 ? 'border-blue-500'
//                 : hasSelected
//                   ? 'border-green-500'
//                   : 'border-gray-200 dark:border-gray-700'
//           }`}
//           onClick={handleOpenDropdown}
//         >
//           <Mail
//             className={`w-5 h-5 mr-3 flex-shrink-0 transition-colors ${
//               showError ? 'text-red-500' : isOpen ? 'text-blue-500' : hasSelected ? 'text-green-500' : 'text-gray-400'
//             }`}
//           />

//           <input
//             type="text"
//             value={isOpen ? searchTerm : value}
//             onChange={handleInputChange}
//             onFocus={handleOpenDropdown}
//             onBlur={handleCloseDropdown}
//             placeholder={hasSelected ? '' : 'Search or select email...'}
//             disabled={disabled}
//             className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 disabled:opacity-50"
//           />

//           {isLoading && <Loader className="w-5 h-5 text-blue-500 ml-2 animate-spin flex-shrink-0" />}
//           {!isLoading && hasSelected && !showError && <Check className="w-5 h-5 text-green-500 ml-2 flex-shrink-0" />}
//           {showError && <AlertCircle className="w-5 h-5 text-red-500 ml-2 flex-shrink-0" />}
//           {!isLoading && !showError && (
//             <ChevronDown
//               className={`w-5 h-5 text-gray-400 ml-2 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
//             />
//           )}
//         </div>

//         {/* Dropdown Menu */}
//         {isOpen && !isLoading && filteredList.length > 0 && (
//           <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border-2 border-blue-500 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto">
//             {filteredList.map((item) => (
//               <button
//                 key={item.email}
//                 type="button"
//                 onClick={() => handleSelect(item.email)}
//                 className={`w-full px-4 py-3 text-left transition-colors hover:bg-blue-50 dark:hover:bg-slate-700 flex items-center justify-between ${
//                   value === item.email ? 'bg-blue-100 dark:bg-blue-900' : ''
//                 }`}
//               >
//                 <div className="flex-1 min-w-0">
//                   <div className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
//                     <span className="truncate">{item.email}</span>
//                     {item.isPredefined && (
//                       <span className="text-xs px-2 py-1 bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-blue-100 rounded whitespace-nowrap">
//                         Team
//                       </span>
//                     )}
//                   </div>
//                   <div className="text-xs text-gray-500 mt-1">
//                     {item.count > 0
//                       ? `${item.count} ${item.count === 1 ? 'submission' : 'submissions'}`
//                       : 'No submissions yet'}
//                   </div>
//                 </div>
//                 {value === item.email && <Check className="w-4 h-4 text-green-500 ml-2 flex-shrink-0" />}
//               </button>
//             ))}
//           </div>
//         )}

//         {/* No results message */}
//         {isOpen && !isLoading && filteredList.length === 0 && (
//           <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border-2 border-blue-500 rounded-xl shadow-2xl z-50 p-4">
//             <p className="text-center text-gray-500 dark:text-gray-400">No emails found</p>
//           </div>
//         )}

//         {/* Loading State */}
//         {isLoading && isOpen && (
//           <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border-2 border-blue-500 rounded-xl shadow-xl z-50 p-4">
//             <div className="flex items-center justify-center gap-2 text-blue-500">
//               <Loader className="w-4 h-4 animate-spin" />
//               <span>Loading emails...</span>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Error Message */}
//       {showError && (
//         <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
//           <AlertCircle className="w-4 h-4" />
//           {error}
//         </p>
//       )}
//     </div>
//   );
// };

import React, { useState, useEffect, useRef } from 'react';
import { Mail, ChevronDown, AlertCircle, Check, Loader } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';

interface EmailSelectProps {
  value: string;
  onChange: (email: string) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
}

interface EmailOption {
  email: string;
  count: number;
  isPredefined: boolean;
}

const PREDEFINED_EMAILS = [
  'saranyasrirangan@hclguvi.com',
  'fardeen@hclguvi.com',
  'mohana.a@hclguvi.com',
  'kishorekumar@hclguvi.com',
  'nivethap@hclguvi.com',
  'beharalakshmi@hclguvi.com',
  "shakeela@hclguvi.com",
  "prakash@hclguvi.com",
  "arpitha@hclguvi.com"
];

export const EmailSelect: React.FC<EmailSelectProps> = ({
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
}) => {
  const [emailList, setEmailList]       = useState<EmailOption[]>([]);
  const [filteredList, setFilteredList] = useState<EmailOption[]>([]);
  const [isOpen, setIsOpen]             = useState(false);
  const [searchTerm, setSearchTerm]     = useState('');
  const [isLoading, setIsLoading]       = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  // ── Close on outside click ────────────────────────────
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        onBlur?.();
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [onBlur]);

  // ── Fetch emails once on mount ────────────────────────
  useEffect(() => {
    const fetchEmails = async () => {
      try {
        setIsLoading(true);
        const emailCounts: Record<string, number> = {};

        PREDEFINED_EMAILS.forEach(email => { emailCounts[email] = 0; });

        const { data } = await supabase
          .from('audit_submissions')
          .select('email')
          .not('email', 'is', null);

        if (data) {
          data.forEach((row) => {
            if (row.email) {
              emailCounts[row.email] = (emailCounts[row.email] || 0) + 1;
            }
          });
        }

        const list = Object.entries(emailCounts).map(([email, count]) => ({
          email,
          count,
          isPredefined: PREDEFINED_EMAILS.includes(email),
        }));

        list.sort((a, b) => {
          if (a.isPredefined !== b.isPredefined) return a.isPredefined ? -1 : 1;
          return b.count - a.count;
        });

        setEmailList(list);
        setFilteredList(list);
      } catch {
        const fallback = PREDEFINED_EMAILS.map(email => ({
          email, count: 0, isPredefined: true,
        }));
        setEmailList(fallback);
        setFilteredList(fallback);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmails();
  }, []);

  // ── Filter on search ──────────────────────────────────
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredList(emailList);
    } else {
      setFilteredList(
        emailList.filter(item =>
          item.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, emailList]);

  const hasSelected = value.length > 0;
  const showError   = error && !isOpen && !hasSelected;

  const handleSelect = (selectedEmail: string) => {
    onChange(selectedEmail);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev); // true toggle — open AND close
    if (isOpen) {
      setSearchTerm('');
      onBlur?.();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (!isOpen) setIsOpen(true);
  };

  return (
    <div className="mb-6" ref={containerRef}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Select Email Address
      </label>

      <div className="relative">
        {/* Input row */}
        <div
          className={`relative flex items-center px-4 py-3 border-2 rounded-xl transition-all duration-200 bg-white dark:bg-slate-800 cursor-pointer ${
            showError  ? 'border-red-500'
            : isOpen   ? 'border-blue-500'
            : hasSelected ? 'border-green-500'
            : 'border-gray-200 dark:border-gray-700'
          }`}
          onClick={handleToggle}
        >
          <Mail
            className={`w-5 h-5 mr-3 flex-shrink-0 transition-colors ${
              showError ? 'text-red-500' : isOpen ? 'text-blue-500' : hasSelected ? 'text-green-500' : 'text-gray-400'
            }`}
          />

          <input
            type="text"
            value={isOpen ? searchTerm : value}
            onChange={handleInputChange}
            onClick={(e) => { e.stopPropagation(); if (!isOpen) setIsOpen(true); }}
            placeholder={hasSelected && !isOpen ? value : 'Search or select email...'}
            disabled={disabled}
            className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 disabled:opacity-50"
          />

          {isLoading && <Loader className="w-5 h-5 text-blue-500 ml-2 animate-spin flex-shrink-0" />}
          {!isLoading && hasSelected && !isOpen && <Check className="w-5 h-5 text-green-500 ml-2 flex-shrink-0" />}
          {showError && <AlertCircle className="w-5 h-5 text-red-500 ml-2 flex-shrink-0" />}
          {!isLoading && !showError && (
            <ChevronDown
              className={`w-5 h-5 text-gray-400 ml-2 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
            />
          )}
        </div>

        {/* Dropdown */}
        {isOpen && !isLoading && filteredList.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border-2 border-blue-500 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto">
            {filteredList.map((item) => (
              <button
                key={item.email}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); handleSelect(item.email); }}
                className={`w-full px-4 py-3 text-left transition-colors hover:bg-blue-50 dark:hover:bg-slate-700 flex items-center justify-between ${
                  value === item.email ? 'bg-blue-100 dark:bg-blue-900' : ''
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
                    <span className="truncate">{item.email}</span>
                    {item.isPredefined && (
                      <span className="text-xs px-2 py-1 bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-blue-100 rounded whitespace-nowrap">
                        Team
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {item.count > 0
                      ? `${item.count} ${item.count === 1 ? 'submission' : 'submissions'}`
                      : 'No submissions yet'}
                  </div>
                </div>
                {value === item.email && <Check className="w-4 h-4 text-green-500 ml-2 flex-shrink-0" />}
              </button>
            ))}
          </div>
        )}

        {/* No results */}
        {isOpen && !isLoading && filteredList.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border-2 border-blue-500 rounded-xl shadow-2xl z-50 p-4">
            <p className="text-center text-gray-500 dark:text-gray-400">No emails found</p>
          </div>
        )}

        {/* Loading */}
        {isLoading && isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border-2 border-blue-500 rounded-xl shadow-xl z-50 p-4">
            <div className="flex items-center justify-center gap-2 text-blue-500">
              <Loader className="w-4 h-4 animate-spin" />
              <span>Loading emails...</span>
            </div>
          </div>
        )}
      </div>

      {showError && (
        <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
};