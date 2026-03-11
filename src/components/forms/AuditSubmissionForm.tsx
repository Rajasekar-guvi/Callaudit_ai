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

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Hash, Clock, Link as LinkIcon } from 'lucide-react';
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
import { FormData, CallType } from '../../types';
import { VALIDATION_RULES } from '../../config/constants';

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
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
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
      //showToast('Call audit submitted successfully!', 'success');
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
      });
      setErrors({});
      onSuccess?.(submissionId ?? undefined);
    } catch (err) {
      showToast(webhookError || 'Failed to submit audit', 'error');
    }
  };

  const progress = calculateProgress();

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
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                  1
                </div>
                Required Information
              </h3>

              <EmailSelect
                value={formData.email}
                onChange={(value) => {
                  console.log('Selected email:', value); // Debugging log
                  setFormData({ ...formData, email: value });
                  setErrors((prevErrors) => ({ ...prevErrors, email: '' })); // Clear error on valid selection
                }}
                onBlur={() => handleFieldBlur('email')}
                error={errors.email}
              />

              <FloatingLabelInput
                label="Audio URL"
                icon={LinkIcon}
                type="url"
                value={formData.audioUrl}
                onChange={(value) => setFormData({ ...formData, audioUrl: value })}
                onBlur={() => handleFieldBlur('audioUrl')}
                placeholder="https://example.com/audio.mp3"
                error={errors.audioUrl}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                  2
                </div>
                Optional Metadata
              </h3>

              <FloatingLabelInput
                label="Analyst Name"
                icon={User}
                value={formData.analystName || ''} // Ensure value is always a string
                onChange={(value) => setFormData({ ...formData, analystName: value })}
                onBlur={() => handleFieldBlur('analystName')}
                error={errors.analystName}
              />

              <FloatingLabelInput
                label="Call ID"
                icon={Hash}
                value={formData.callId || ''} // Ensure value is always a string
                onChange={(value) => setFormData({ ...formData, callId: value })}
                onBlur={() => handleFieldBlur('callId')}
                error={errors.callId}
              />

              <FloatingLabelInput
                label="Call Duration"
                icon={Clock}
                type="text"
                value={formData.callDuration || ''} // Ensure value is always a string
                onChange={(value) => {
                  setFormData({ ...formData, callDuration: value });
                }}
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
