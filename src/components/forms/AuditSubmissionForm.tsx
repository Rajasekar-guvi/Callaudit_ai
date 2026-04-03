// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { User, Hash, Clock, Link as LinkIcon } from 'lucide-react';
// import { EmailSelect } from '../ui/EmailSelect';
// import { FloatingLabelInput } from '../ui/FloatingLabelInput';
// import { SegmentedControl } from '../ui/SegmentedControl';
// import { AutoExpandingTextarea } from '../ui/AutoExpandingTextarea';
// import { GradientButton } from '../ui/GradientButton';
// import { GlassmorphismCard } from '../ui/GlassmorphismCard';
// import { ProgressBar } from '../ui/ProgressBar';
// import { useToast } from '../../context/ToastContext';
// import { useWebhookSubmit } from '../../hooks/useWebhookSubmit';
// import { useAuditData } from '../../hooks/useAuditData';
// import { FormData, CallType } from '../../types';
// import { VALIDATION_RULES } from '../../config/constants';

// interface AuditSubmissionFormProps {
//   onSuccess?: () => void;
// }

// export const AuditSubmissionForm: React.FC<AuditSubmissionFormProps> = ({ onSuccess }) => {
//   const [formData, setFormData] = useState<FormData>({
//     email: '',
//     audioUrl: '',
//     analystName: '',
//     callId: '',
//     callDuration: '',
//     notificationEmail: '',
//     callType: 'inbound',
//     notes: '',
//   });

//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const { showToast } = useToast();
//   const { submit, isLoading, error: webhookError } = useWebhookSubmit();
//   const { checkCallIdExists } = useAuditData();

//   const validateField = async (field: string, value: string): Promise<string | null> => {
//     switch (field) {
//       case 'email': {
//         if (!value) return 'Email is required';
//         if (!VALIDATION_RULES.email.pattern.test(value))
//           return 'Please enter a valid email address';
//         return null;
//       }
//       case 'audioUrl': {
//         if (!value) return 'Audio URL is required';
//         if (!VALIDATION_RULES.audioUrl.pattern.test(value))
//           return 'Please enter a valid URL (https://...)';
//         return null;
//       }
//       case 'analystName': {
//         if (value && value.length < VALIDATION_RULES.analystName.minLength)
//           return `Minimum ${VALIDATION_RULES.analystName.minLength} characters`;
//         if (value && value.length > VALIDATION_RULES.analystName.maxLength)
//           return `Maximum ${VALIDATION_RULES.analystName.maxLength} characters`;
//         return null;
//       }
//       case 'callId': {
//         if (value && !VALIDATION_RULES.callId.pattern.test(value))
//           return 'Call ID can only contain letters, numbers, hyphens, and underscores';
//         if (value && value.length > VALIDATION_RULES.callId.maxLength)
//           return `Maximum ${VALIDATION_RULES.callId.maxLength} characters`;
//         if (value) {
//           const exists = await checkCallIdExists(value);
//           if (exists) return 'This Call ID already exists';
//         }
//         return null;
//       }
//       case 'callDuration': {
//         if (value) {
//           const timeRegex = /^(\d{1,2}):(\d{2})(:(\d{2}))?$/;
//           if (!timeRegex.test(value)) return 'Use format MM:SS or HH:MM:SS';
//         }
//         return null;
//       }
//       default:
//         return null;
//     }
//   };

//   const handleFieldBlur = async (field: string) => {
//     const error = await validateField(field, formData[field as keyof FormData] as string);
//     if (error) {
//       setErrors((prev) => ({ ...prev, [field]: error }));
//     } else {
//       setErrors((prev) => {
//         const { [field]: _, ...rest } = prev;
//         return rest;
//       });
//     }
//   };

//   const calculateProgress = () => {
//     const requiredFields = ['email', 'audioUrl'];
//     const filledFields = requiredFields.filter((f) => {
//       const val = formData[f as keyof FormData];
//       return val !== null && val !== undefined && val !== '';
//     }).length;
//     return Math.round((filledFields / requiredFields.length) * 100);
//   };

//   const isFormValid = () => {
//     return formData.email !== '' &&
//            formData.audioUrl !== '' &&
//            !errors.email &&
//            !errors.audioUrl;
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     for (const field of ['email', 'audioUrl']) {
//       const error = await validateField(field, formData[field as keyof FormData] as string);
//       if (error) {
//         setErrors((prev) => ({ ...prev, [field]: error }));
//       }
//     }

//     if (!isFormValid()) {
//       showToast('Please fix validation errors', 'error');
//       return;
//     }

//     try {
//       await submit(formData);
//       showToast('Call audit submitted successfully!', 'success');
//       setFormData({
//         email: '',
//         audioUrl: '',
//         analystName: '',
//         callId: '',
//         callDuration: '',
//         notificationEmail: '',
//         callType: 'inbound',
//         notes: '',
//       });
//       setErrors({});
//       onSuccess?.();
//     } catch (err) {
//       showToast(webhookError || 'Failed to submit audit', 'error');
//     }
//   };

//   const progress = calculateProgress();

//   return (
//     <div className="w-full max-w-2xl mx-auto">
//       <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
//         <GlassmorphismCard className="p-8 md:p-12">
//           <div className="mb-8">
//             <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
//               Call Audit Submission
//             </h2>
//             <p className="text-gray-600 dark:text-gray-400">
//               Submit call recordings for AI compliance analysis
//             </p>
//           </div>

//           <div className="mb-8">
//             <div className="flex justify-between items-center mb-3">
//               <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
//               <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">{progress}%</span>
//             </div>
//             <ProgressBar percentage={progress} showLabel={false} />
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-8">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
//                 <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
//                   1
//                 </div>
//                 Required Information
//               </h3>

//               <EmailSelect
//                 value={formData.email}
//                 onChange={(value) => {
//                   console.log('Selected email:', value); // Debugging log
//                   setFormData({ ...formData, email: value });
//                   setErrors((prevErrors) => ({ ...prevErrors, email: '' })); // Clear error on valid selection
//                 }}
//                 onBlur={() => handleFieldBlur('email')}
//                 error={errors.email}
//               />

//               <FloatingLabelInput
//                 label="Audio URL"
//                 icon={LinkIcon}
//                 type="url"
//                 value={formData.audioUrl}
//                 onChange={(value) => setFormData({ ...formData, audioUrl: value })}
//                 onBlur={() => handleFieldBlur('audioUrl')}
//                 placeholder="https://example.com/audio.mp3"
//                 error={errors.audioUrl}
//               />
//             </div>

//             <div>
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
//                 <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
//                   2
//                 </div>
//                 Optional Metadata
//               </h3>

//               <FloatingLabelInput
//                 label="Analyst Name"
//                 icon={User}
//                 value={formData.analystName || ''} // Ensure value is always a string
//                 onChange={(value) => setFormData({ ...formData, analystName: value })}
//                 onBlur={() => handleFieldBlur('analystName')}
//                 error={errors.analystName}
//               />

//               <FloatingLabelInput
//                 label="Call ID"
//                 icon={Hash}
//                 value={formData.callId || ''} // Ensure value is always a string
//                 onChange={(value) => setFormData({ ...formData, callId: value })}
//                 onBlur={() => handleFieldBlur('callId')}
//                 error={errors.callId}
//               />

//               <FloatingLabelInput
//                 label="Call Duration"
//                 icon={Clock}
//                 type="text"
//                 value={formData.callDuration || ''} // Ensure value is always a string
//                 onChange={(value) => {
//                   setFormData({ ...formData, callDuration: value });
//                 }}
//                 onBlur={() => handleFieldBlur('callDuration')}
//                 placeholder="MM:SS or HH:MM:SS"
//                 error={errors.callDuration}
//               />

//               <SegmentedControl
//                 label="Call Type"
//                 options={[
//                   { label: 'Inbound', value: 'inbound' },
//                   { label: 'Outbound', value: 'outbound' },
//                 ]}
//                 value={formData.callType}
//                 onChange={(value) => setFormData({ ...formData, callType: value as CallType })}
//               />

//               <FloatingLabelInput
//                 label="Notification Email"
//                 icon={User}
//                 type="email"
//                 value={formData.notificationEmail || ''}
//                 onChange={(value) => setFormData({ ...formData, notificationEmail: value })}
//                 onBlur={() => handleFieldBlur('notificationEmail')}
//                 placeholder="Enter email for notifications (optional)"
//                 error={errors.notificationEmail}
//               />

//               <AutoExpandingTextarea
//                 value={formData.notes || ''}
//                 onChange={(value) => setFormData({ ...formData, notes: value })}
//                 placeholder="Add notes about the call (optional)"
//                 maxLength={VALIDATION_RULES.notes.maxLength}
//               />
//             </div>

//             <motion.div className="flex gap-4 pt-4">
//               <GradientButton
//                 type="submit"
//                 isLoading={isLoading}
//                 disabled={!isFormValid() || isLoading}
//                 loadingText="Processing audio…"
//               >
//                 Submit for Audit
//               </GradientButton>
//             </motion.div>
//           </form>
//         </GlassmorphismCard>
//       </motion.div>
//     </div>
//   );
// };

// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { User, Hash, Clock, Link as LinkIcon } from 'lucide-react';
// import { EmailSelect } from '../ui/EmailSelect';
// import { FloatingLabelInput } from '../ui/FloatingLabelInput';
// import { SegmentedControl } from '../ui/SegmentedControl';
// import { AutoExpandingTextarea } from '../ui/AutoExpandingTextarea';
// import { GradientButton } from '../ui/GradientButton';
// import { GlassmorphismCard } from '../ui/GlassmorphismCard';
// import { ProgressBar } from '../ui/ProgressBar';
// import { useToast } from '../../context/ToastContext';
// import { useWebhookSubmit } from '../../hooks/useWebhookSubmit';
// import { useAuditData } from '../../hooks/useAuditData';
// import { FormData, CallType } from '../../types';
// import { VALIDATION_RULES } from '../../config/constants';

// interface AuditSubmissionFormProps {
//   onSuccess?: (submissionId?: string) => void;
// }

// export const AuditSubmissionForm: React.FC<AuditSubmissionFormProps> = ({ onSuccess }) => {
//   const [formData, setFormData] = useState<FormData>({
//     email: '',
//     audioUrl: '',
//     analystName: '',
//     callId: '',
//     callDuration: '',
//     notificationEmail: '',
//     callType: 'inbound',
//     notes: '',
//   });

//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const { showToast } = useToast();
//   const { submit, isLoading, error: webhookError } = useWebhookSubmit();
//   const { checkCallIdExists } = useAuditData();

//   const validateField = async (field: string, value: string): Promise<string | null> => {
//     switch (field) {
//       case 'email': {
//         if (!value) return 'Email is required';
//         if (!VALIDATION_RULES.email.pattern.test(value))
//           return 'Please enter a valid email address';
//         return null;
//       }
//       case 'audioUrl': {
//         if (!value) return 'Audio URL is required';
//         if (!VALIDATION_RULES.audioUrl.pattern.test(value))
//           return 'Please enter a valid URL (https://...)';
//         return null;
//       }
//       case 'analystName': {
//         if (value && value.length < VALIDATION_RULES.analystName.minLength)
//           return `Minimum ${VALIDATION_RULES.analystName.minLength} characters`;
//         if (value && value.length > VALIDATION_RULES.analystName.maxLength)
//           return `Maximum ${VALIDATION_RULES.analystName.maxLength} characters`;
//         return null;
//       }
//       case 'callId': {
//         if (value && !VALIDATION_RULES.callId.pattern.test(value))
//           return 'Call ID can only contain letters, numbers, hyphens, and underscores';
//         if (value && value.length > VALIDATION_RULES.callId.maxLength)
//           return `Maximum ${VALIDATION_RULES.callId.maxLength} characters`;
//         if (value) {
//           const exists = await checkCallIdExists(value);
//           if (exists) return 'This Call ID already exists';
//         }
//         return null;
//       }
//       case 'callDuration': {
//         if (value) {
//           const timeRegex = /^(\d{1,2}):(\d{2})(:(\d{2}))?$/;
//           if (!timeRegex.test(value)) return 'Use format MM:SS or HH:MM:SS';
//         }
//         return null;
//       }
//       default:
//         return null;
//     }
//   };

//   const handleFieldBlur = async (field: string) => {
//     const error = await validateField(field, formData[field as keyof FormData] as string);
//     if (error) {
//       setErrors((prev) => ({ ...prev, [field]: error }));
//     } else {
//       setErrors((prev) => {
//         const { [field]: _, ...rest } = prev;
//         return rest;
//       });
//     }
//   };

//   const calculateProgress = () => {
//     const requiredFields = ['email', 'audioUrl'];
//     const filledFields = requiredFields.filter((f) => {
//       const val = formData[f as keyof FormData];
//       return val !== null && val !== undefined && val !== '';
//     }).length;
//     return Math.round((filledFields / requiredFields.length) * 100);
//   };

//   const isFormValid = () => {
//     return formData.email !== '' &&
//            formData.audioUrl !== '' &&
//            !errors.email &&
//            !errors.audioUrl;
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     for (const field of ['email', 'audioUrl']) {
//       const error = await validateField(field, formData[field as keyof FormData] as string);
//       if (error) {
//         setErrors((prev) => ({ ...prev, [field]: error }));
//       }
//     }

//     if (!isFormValid()) {
//       showToast('Please fix validation errors', 'error');
//       return;
//     }

//     try {
//       const submissionId = await submit(formData);
//       //showToast('Call audit submitted successfully!', 'success');
//       showToast('Audit submitted — AI is now reviewing the call', 'success');
//       setFormData({
//         email: '',
//         audioUrl: '',
//         analystName: '',
//         callId: '',
//         callDuration: '',
//         notificationEmail: '',
//         callType: 'inbound',
//         notes: '',
//       });
//       setErrors({});
//       onSuccess?.(submissionId ?? undefined);
//     } catch (err) {
//       showToast(webhookError || 'Failed to submit audit', 'error');
//     }
//   };

//   const progress = calculateProgress();

//   return (
//     <div className="w-full max-w-2xl mx-auto">
//       <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
//         <GlassmorphismCard className="p-8 md:p-12">
//           <div className="mb-8">
//             <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
//               Call Audit Submission
//             </h2>
//             <p className="text-gray-600 dark:text-gray-400">
//               Submit call recordings for AI compliance analysis
//             </p>
//           </div>

//           <div className="mb-8">
//             <div className="flex justify-between items-center mb-3">
//               <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
//               <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">{progress}%</span>
//             </div>
//             <ProgressBar percentage={progress} showLabel={false} />
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-8">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
//                 <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
//                   1
//                 </div>
//                 Required Information
//               </h3>

//               <EmailSelect
//                 value={formData.email}
//                 onChange={(value) => {
//                   console.log('Selected email:', value); // Debugging log
//                   setFormData({ ...formData, email: value });
//                   setErrors((prevErrors) => ({ ...prevErrors, email: '' })); // Clear error on valid selection
//                 }}
//                 onBlur={() => handleFieldBlur('email')}
//                 error={errors.email}
//               />

//               <FloatingLabelInput
//                 label="Audio URL"
//                 icon={LinkIcon}
//                 type="url"
//                 value={formData.audioUrl}
//                 onChange={(value) => setFormData({ ...formData, audioUrl: value })}
//                 onBlur={() => handleFieldBlur('audioUrl')}
//                 placeholder="https://example.com/audio.mp3"
//                 error={errors.audioUrl}
//               />
//             </div>

//             <div>
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
//                 <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
//                   2
//                 </div>
//                 Optional Metadata
//               </h3>

//               <FloatingLabelInput
//                 label="Analyst Name"
//                 icon={User}
//                 value={formData.analystName || ''} // Ensure value is always a string
//                 onChange={(value) => setFormData({ ...formData, analystName: value })}
//                 onBlur={() => handleFieldBlur('analystName')}
//                 error={errors.analystName}
//               />

//               <FloatingLabelInput
//                 label="Call ID"
//                 icon={Hash}
//                 value={formData.callId || ''} // Ensure value is always a string
//                 onChange={(value) => setFormData({ ...formData, callId: value })}
//                 onBlur={() => handleFieldBlur('callId')}
//                 error={errors.callId}
//               />

//               <FloatingLabelInput
//                 label="Call Duration"
//                 icon={Clock}
//                 type="text"
//                 value={formData.callDuration || ''} // Ensure value is always a string
//                 onChange={(value) => {
//                   setFormData({ ...formData, callDuration: value });
//                 }}
//                 onBlur={() => handleFieldBlur('callDuration')}
//                 placeholder="MM:SS or HH:MM:SS"
//                 error={errors.callDuration}
//               />

//               <SegmentedControl
//                 label="Call Type"
//                 options={[
//                   { label: 'Inbound', value: 'inbound' },
//                   { label: 'Outbound', value: 'outbound' },
//                 ]}
//                 value={formData.callType}
//                 onChange={(value) => setFormData({ ...formData, callType: value as CallType })}
//               />

//               <FloatingLabelInput
//                 label="Notification Email"
//                 icon={User}
//                 type="email"
//                 value={formData.notificationEmail || ''}
//                 onChange={(value) => setFormData({ ...formData, notificationEmail: value })}
//                 onBlur={() => handleFieldBlur('notificationEmail')}
//                 placeholder="Enter email for notifications (optional)"
//                 error={errors.notificationEmail}
//               />

//               <AutoExpandingTextarea
//                 value={formData.notes || ''}
//                 onChange={(value) => setFormData({ ...formData, notes: value })}
//                 placeholder="Add notes about the call (optional)"
//                 maxLength={VALIDATION_RULES.notes.maxLength}
//               />
//             </div>

//             <motion.div className="flex gap-4 pt-4">
//               <GradientButton
//                 type="submit"
//                 isLoading={isLoading}
//                 disabled={!isFormValid() || isLoading}
//                 loadingText="Processing audio…"
//               >
//                 Submit for Audit
//               </GradientButton>
//             </motion.div>
//           </form>
//         </GlassmorphismCard>
//       </motion.div>
//     </div>
//   );
// };


import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Hash, Clock, Link as LinkIcon, CheckSquare, Square, Plus, X, AlertCircle } from 'lucide-react';
import { EmailSelect } from '../ui/EmailSelect';
import { FloatingLabelInput } from '../ui/FloatingLabelInput';
import { SegmentedControl } from '../ui/SegmentedControl';
import { AutoExpandingTextarea } from '../ui/AutoExpandingTextarea';
import { GradientButton } from '../ui/GradientButton';
import { GlassmorphismCard } from '../ui/GlassmorphismCard';
import { ProgressBar } from '../ui/ProgressBar';
import { useToast } from '../../context/ToastContext';
import { useWebhookSubmit } from '../../hooks/useWebhookSubmit';
import { useAuditData } from '../../hooks/useAuditData';
import { auditService } from '../../services/auditService';
import { FormData, CallType, CustomParameter } from '../../types';
import { VALIDATION_RULES, AUDIT_PARAMETERS, AUDIT_PARAMETERS_BY_CATEGORY } from '../../config/constants';

interface AuditSubmissionFormProps {
  onSuccess?: (submissionId?: string) => void;
}

export const AuditSubmissionForm: React.FC<AuditSubmissionFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    audioUrl: '',
    analystName: '',
    callId: '',
    callDuration: '',
    notificationEmail: '',
    callType: 'inbound',
    notes: '',
    selectedParameters: [],
    customParameters: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newParamName, setNewParamName] = useState('');
  const [newParamDesc, setNewParamDesc] = useState('');
  const [isAddingParameter, setIsAddingParameter] = useState(false);
  const [duplicateUrlWarning, setDuplicateUrlWarning] = useState<{ isDuplicate: boolean; submittedAt?: string; submissionId?: string }>({ isDuplicate: false });
  const [allowDuplicateSubmit, setAllowDuplicateSubmit] = useState(false);
  const { showToast } = useToast();
  const { submit, isLoading, error: webhookError } = useWebhookSubmit();
  const { checkCallIdExists } = useAuditData();

  const validateField = async (field: string, value: string): Promise<string | null> => {
    switch (field) {
      case 'email': {
        if (!value) return 'Email is required';
        if (!VALIDATION_RULES.email.pattern.test(value))
          return 'Please enter a valid email address';
        return null;
      }
      case 'audioUrl': {
        if (!value) return 'Audio URL is required';
        if (!VALIDATION_RULES.audioUrl.pattern.test(value))
          return 'Please enter a valid URL (https://...)';
        // Check duplicate audio URL in last 24 hours unless user confirmed override
        if (!allowDuplicateSubmit) {
          const duplicate = await auditService.checkAudioUrlDuplicate(value);
          if (duplicate.isDuplicate) {
            setDuplicateUrlWarning(duplicate);
            return null; // Don't show error, just warning
          }
        }
        setDuplicateUrlWarning({ isDuplicate: false });
        return null;
      }
      case 'analystName': {
        if (value && value.length < VALIDATION_RULES.analystName.minLength)
          return `Minimum ${VALIDATION_RULES.analystName.minLength} characters`;
        if (value && value.length > VALIDATION_RULES.analystName.maxLength)
          return `Maximum ${VALIDATION_RULES.analystName.maxLength} characters`;
        return null;
      }
      case 'callId': {
        if (value && !VALIDATION_RULES.callId.pattern.test(value))
          return 'Call ID can only contain letters, numbers, hyphens, and underscores';
        if (value && value.length > VALIDATION_RULES.callId.maxLength)
          return `Maximum ${VALIDATION_RULES.callId.maxLength} characters`;
        if (value) {
          const exists = await checkCallIdExists(value);
          if (exists) return 'This Call ID already exists';
        }
        return null;
      }
      case 'callDuration': {
        if (value) {
          const timeRegex = /^(\d{1,2}):(\d{2})(:(\d{2}))?$/;
          if (!timeRegex.test(value)) return 'Use format MM:SS or HH:MM:SS';
        }
        return null;
      }
      default:
        return null;
    }
  };

  const handleFieldBlur = async (field: string) => {
    const error = await validateField(field, formData[field as keyof FormData] as string);
    if (error) {
      setErrors((prev) => ({ ...prev, [field]: error }));
    } else {
      setErrors((prev) => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const toggleParameter = (param: string) => {
    const current = formData.selectedParameters || [];
    const updated = current.includes(param)
      ? current.filter((p) => p !== param)
      : [...current, param];
    setFormData({ ...formData, selectedParameters: updated });
  };

  const selectAll = () => {
    setFormData({ ...formData, selectedParameters: [...AUDIT_PARAMETERS] });
  };

  const clearAll = () => {
    setFormData({ ...formData, selectedParameters: [] });
  };

  const addCustomParameter = () => {
    if (!newParamName.trim()) {
      showToast('Parameter name is required', 'error');
      return;
    }

    const customParam: CustomParameter = {
      id: `custom_${Date.now()}`,
      name: newParamName.trim(),
      description: newParamDesc.trim() || undefined,
    };

    const updated = [...(formData.customParameters || []), customParam];
    setFormData({ ...formData, customParameters: updated });
    setNewParamName('');
    setNewParamDesc('');
    setIsAddingParameter(false);
    showToast('Custom parameter added', 'success');
  };

  const removeCustomParameter = (paramId: string) => {
    const updated = (formData.customParameters || []).filter((p) => p.id !== paramId);
    setFormData({ ...formData, customParameters: updated });
  };

  const handleAudioUrlChange = (value: string) => {
    setFormData({ ...formData, audioUrl: value });
    setAllowDuplicateSubmit(false); // Reset override when user changes URL
    setDuplicateUrlWarning({ isDuplicate: false }); // Clear warning
  };

  const handleResubmitAnyway = () => {
    setAllowDuplicateSubmit(true);
    setDuplicateUrlWarning({ isDuplicate: false });
  };

  const calculateProgress = () => {
    const requiredFields = ['email', 'audioUrl'];
    const filledFields = requiredFields.filter((f) => {
      const val = formData[f as keyof FormData];
      return val !== null && val !== undefined && val !== '';
    }).length;
    return Math.round((filledFields / requiredFields.length) * 100);
  };

  const isFormValid = () => {
    return formData.email !== '' &&
           formData.audioUrl !== '' &&
           !errors.email &&
           !errors.audioUrl;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    for (const field of ['email', 'audioUrl']) {
      const error = await validateField(field, formData[field as keyof FormData] as string);
      if (error) {
        setErrors((prev) => ({ ...prev, [field]: error }));
      }
    }

    if (!isFormValid()) {
      showToast('Please fix validation errors', 'error');
      return;
    }

    try {
      const submissionId = await submit(formData);
      showToast('Audit submitted — AI is now reviewing the call', 'success');
      setFormData({
        email: '',
        audioUrl: '',
        analystName: '',
        callId: '',
        callDuration: '',
        notificationEmail: '',
        callType: 'inbound',
        notes: '',
        selectedParameters: [],
        customParameters: [],
      });
      setErrors({});
      setNewParamName('');
      setNewParamDesc('');
      setIsAddingParameter(false);
      setAllowDuplicateSubmit(false);
      setDuplicateUrlWarning({ isDuplicate: false });
      onSuccess?.(submissionId ?? undefined);
    } catch (err) {
      showToast(webhookError || 'Failed to submit audit', 'error');
    }
  };

  const progress = calculateProgress();
  const selectedCount = (formData.selectedParameters?.length || 0) + (formData.customParameters?.length || 0);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <GlassmorphismCard className="p-8 md:p-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Call Audit Submission
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Submit call recordings for AI compliance analysis
            </p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">{progress}%</span>
            </div>
            <ProgressBar percentage={progress} showLabel={false} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* ── Section 1: Required ── */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">1</div>
                Required Information
              </h3>
              <EmailSelect
                value={formData.email}
                onChange={(value) => {
                  setFormData({ ...formData, email: value });
                  setErrors((prevErrors) => ({ ...prevErrors, email: '' }));
                }}
                onBlur={() => handleFieldBlur('email')}
                error={errors.email}
              />
              <FloatingLabelInput
                label="Audio URL"
                icon={LinkIcon}
                type="url"
                value={formData.audioUrl}
                onChange={handleAudioUrlChange}
                onBlur={() => handleFieldBlur('audioUrl')}
                placeholder="https://example.com/audio.mp3"
                error={errors.audioUrl}
              />
              
              {/* Duplicate URL Warning */}
              {duplicateUrlWarning.isDuplicate && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                      Audio URL already submitted
                    </p>
                    <p className="text-xs text-amber-800 dark:text-amber-200 mt-1">
                      This URL was submitted on{' '}
                      {new Date(duplicateUrlWarning.submittedAt!).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <button
                      type="button"
                      onClick={handleResubmitAnyway}
                      className="mt-3 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 hover:bg-amber-300 dark:hover:bg-amber-700 transition-colors"
                    >
                      Resubmit Anyway
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* ── Section 2: Optional Metadata ── */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">2</div>
                Optional Metadata
              </h3>
              <FloatingLabelInput
                label="Analyst Name"
                icon={User}
                value={formData.analystName || ''}
                onChange={(value) => setFormData({ ...formData, analystName: value })}
                onBlur={() => handleFieldBlur('analystName')}
                error={errors.analystName}
              />
              <FloatingLabelInput
                label="Call ID"
                icon={Hash}
                value={formData.callId || ''}
                onChange={(value) => setFormData({ ...formData, callId: value })}
                onBlur={() => handleFieldBlur('callId')}
                error={errors.callId}
              />
              <FloatingLabelInput
                label="Call Duration"
                icon={Clock}
                type="text"
                value={formData.callDuration || ''}
                onChange={(value) => setFormData({ ...formData, callDuration: value })}
                onBlur={() => handleFieldBlur('callDuration')}
                placeholder="MM:SS or HH:MM:SS"
                error={errors.callDuration}
              />
              <SegmentedControl
                label="Call Type"
                options={[
                  { label: 'Inbound', value: 'inbound' },
                  { label: 'Outbound', value: 'outbound' },
                ]}
                value={formData.callType}
                onChange={(value) => setFormData({ ...formData, callType: value as CallType })}
              />
              <FloatingLabelInput
                label="Notification Email"
                icon={User}
                type="email"
                value={formData.notificationEmail || ''}
                onChange={(value) => setFormData({ ...formData, notificationEmail: value })}
                onBlur={() => handleFieldBlur('notificationEmail')}
                placeholder="Enter email for notifications (optional)"
                error={errors.notificationEmail}
              />
              <AutoExpandingTextarea
                value={formData.notes || ''}
                onChange={(value) => setFormData({ ...formData, notes: value })}
                placeholder="Add notes about the call (optional)"
                maxLength={VALIDATION_RULES.notes.maxLength}
              />
            </div>

            {/* ── Section 3: Audit Parameters ── */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">3</div>
                Audit Parameters
                <span className="ml-auto text-sm font-normal text-gray-500 dark:text-gray-400">
                  {selectedCount} selected
                </span>
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Select parameters relevant to this call. n8n will score only selected ones.
              </p>

              {/* Select All / Clear All */}
              <div className="flex gap-3 mb-4">
                <button
                  type="button"
                  onClick={selectAll}
                  className="text-xs px-3 py-1.5 rounded-lg border transition-colors"
                  style={{ borderColor: '#7c5af3', color: '#7c5af3' }}
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 transition-colors hover:border-gray-400"
                >
                  Clear All
                </button>
              </div>

              {/* Parameter checklist - Organized by Categories */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
                  {AUDIT_PARAMETERS_BY_CATEGORY.map((category) => (
                    <div key={category.name}>
                      {/* Category Header */}
                      <div className="sticky top-0 px-4 py-2.5 bg-gradient-to-r from-slate-50 to-slate-50/50 dark:from-slate-800/40 dark:to-slate-800/20 border-l-2 border-l-purple-500 border-b border-gray-200 dark:border-gray-700 z-10">
                        <p className="text-xs font-semibold tracking-wide text-gray-700 dark:text-gray-300">
                          {category.name}
                        </p>
                      </div>

                      {/* Category Parameters */}
                      {category.parameters.map((param) => {
                        const isSelected = formData.selectedParameters?.includes(param) || false;
                        return (
                          <button
                            key={param}
                            type="button"
                            onClick={() => toggleParameter(param)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150 hover:bg-blue-50 dark:hover:bg-blue-900/10"
                          >
                            {isSelected
                              ? <CheckSquare className="w-4 h-4 flex-shrink-0" style={{ color: '#7c5af3' }} />
                              : <Square className="w-4 h-4 flex-shrink-0 text-gray-300 dark:text-gray-600" />
                            }
                            <span className={`text-sm ${isSelected ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
                              {param}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ))}

                  {/* Custom Parameters Display */}
                  {(formData.customParameters?.length || 0) > 0 && (
                    <>
                      <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-100 dark:border-blue-800/30">
                        <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">CUSTOM PARAMETERS</p>
                      </div>
                      {formData.customParameters?.map((param) => (
                        <div
                          key={param.id}
                          className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-purple-50 dark:bg-purple-900/10 hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium px-2 py-1 rounded-full bg-purple-200 dark:bg-purple-700 text-purple-800 dark:text-purple-200">
                                Custom
                              </span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {param.name}
                              </span>
                            </div>
                            {param.description && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                                {param.description}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeCustomParameter(param.id)}
                            title="Remove custom parameter"
                            className="flex-shrink-0 p-1.5 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
                          >
                            <X className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          </button>
                        </div>
                      ))}
                    </>
                  )}

                  {/* Add Custom Parameter Button */}
                  {!isAddingParameter && (
                    <button
                      type="button"
                      onClick={() => setIsAddingParameter(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-150 border-t border-gray-100 dark:border-gray-800"
                    >
                      <Plus className="w-4 h-4" />
                      Add Custom Parameter
                    </button>
                  )}

                  {/* Add Custom Parameter Form */}
                  {isAddingParameter && (
                    <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/10 border-t border-gray-100 dark:border-gray-800 space-y-3">
                      <input
                        type="text"
                        placeholder="Parameter name"
                        value={newParamName}
                        onChange={(e) => setNewParamName(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        onKeyPress={(e) => e.key === 'Enter' && addCustomParameter()}
                      />
                      <textarea
                        placeholder="Description (optional)"
                        value={newParamDesc}
                        onChange={(e) => setNewParamDesc(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none h-16"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={addCustomParameter}
                          className="flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors"
                          style={{ backgroundColor: '#7c5af3', color: 'white' }}
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingParameter(false);
                            setNewParamName('');
                            setNewParamDesc('');
                          }}
                          className="flex-1 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {selectedCount > 0 && (
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {selectedCount} parameter{selectedCount > 1 ? 's' : ''} will be sent to AI for scoring
                </p>
              )}
            </div>

            <motion.div className="flex gap-4 pt-4">
              <GradientButton
                type="submit"
                isLoading={isLoading}
                disabled={!isFormValid() || isLoading}
                loadingText="Processing audio…"
              >
                Submit for Audit
              </GradientButton>
            </motion.div>
          </form>
        </GlassmorphismCard>
      </motion.div>
    </div>
  );
};