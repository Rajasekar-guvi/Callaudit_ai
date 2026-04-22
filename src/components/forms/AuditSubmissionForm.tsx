// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { User, Hash, Clock, Link as LinkIcon, CheckSquare, Square, Plus, X, AlertCircle } from 'lucide-react';
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
// import { auditService } from '../../services/auditService';
// import { FormData, CallType, CustomParameter } from '../../types';
// import { VALIDATION_RULES, AUDIT_PARAMETERS, AUDIT_PARAMETERS_BY_CATEGORY } from '../../config/constants';

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
//     selectedParameters: [],
//     customParameters: [],
//   });

//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [newParamName, setNewParamName] = useState('');
//   const [newParamDesc, setNewParamDesc] = useState('');
//   const [isAddingParameter, setIsAddingParameter] = useState(false);
//   const [duplicateUrlWarning, setDuplicateUrlWarning] = useState<{ isDuplicate: boolean; submittedAt?: string; submissionId?: string }>({ isDuplicate: false });
//   const [allowDuplicateSubmit, setAllowDuplicateSubmit] = useState(false);
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
//         // Check duplicate audio URL in last 24 hours unless user confirmed override
//         if (!allowDuplicateSubmit) {
//           const duplicate = await auditService.checkAudioUrlDuplicate(value);
//           if (duplicate.isDuplicate) {
//             setDuplicateUrlWarning(duplicate);
//             return null; // Don't show error, just warning
//           }
//         }
//         setDuplicateUrlWarning({ isDuplicate: false });
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

//   const toggleParameter = (param: string) => {
//     const current = formData.selectedParameters || [];
//     const updated = current.includes(param)
//       ? current.filter((p) => p !== param)
//       : [...current, param];
//     console.log(`✅ Parameter toggled: ${param}`, { current, updated });
//     setFormData({ ...formData, selectedParameters: updated });
//   };

//   const selectAll = () => {
//     console.log('📋 Select All clicked');
//     setFormData({ ...formData, selectedParameters: [...AUDIT_PARAMETERS] });
//   };

//   const clearAll = () => {
//     console.log('🧹 Clear All clicked');
//     setFormData({ ...formData, selectedParameters: [] });
//   };

//   const addCustomParameter = () => {
//     if (!newParamName.trim()) {
//       showToast('Parameter name is required', 'error');
//       return;
//     }

//     const customParam: CustomParameter = {
//       id: `custom_${Date.now()}`,
//       name: newParamName.trim(),
//       description: newParamDesc.trim() || undefined,
//     };

//     const updated = [...(formData.customParameters || []), customParam];
//     setFormData({ ...formData, customParameters: updated });
//     setNewParamName('');
//     setNewParamDesc('');
//     setIsAddingParameter(false);
//     showToast('Custom parameter added', 'success');
//   };

//   const removeCustomParameter = (paramId: string) => {
//     const updated = (formData.customParameters || []).filter((p) => p.id !== paramId);
//     setFormData({ ...formData, customParameters: updated });
//   };

//   const handleAudioUrlChange = (value: string) => {
//     setFormData({ ...formData, audioUrl: value });
//     setAllowDuplicateSubmit(false); // Reset override when user changes URL
//     setDuplicateUrlWarning({ isDuplicate: false }); // Clear warning
//   };

//   const handleResubmitAnyway = () => {
//     setAllowDuplicateSubmit(true);
//     setDuplicateUrlWarning({ isDuplicate: false });
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
//       console.log('🚀 Submitting form with data:', {
//         selectedParameters: formData.selectedParameters,
//         customParameters: formData.customParameters,
//         fullFormData: formData,
//       });
//       const submissionId = await submit(formData);
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
//         selectedParameters: [],
//         customParameters: [],
//       });
//       setErrors({});
//       setNewParamName('');
//       setNewParamDesc('');
//       setIsAddingParameter(false);
//       setAllowDuplicateSubmit(false);
//       setDuplicateUrlWarning({ isDuplicate: false });
//       onSuccess?.(submissionId ?? undefined);
//     } catch (err) {
//       showToast(webhookError || 'Failed to submit audit', 'error');
//     }
//   };

//   const progress = calculateProgress();
//   const selectedCount = (formData.selectedParameters?.length || 0) + (formData.customParameters?.length || 0);

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

//             {/* ── Section 1: Required ── */}
//             <div>
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
//                 <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">1</div>
//                 Required Information
//               </h3>
//               <EmailSelect
//                 value={formData.email}
//                 onChange={(value) => {
//                   setFormData({ ...formData, email: value });
//                   setErrors((prevErrors) => ({ ...prevErrors, email: '' }));
//                 }}
//                 onBlur={() => handleFieldBlur('email')}
//                 error={errors.email}
//               />
//               <FloatingLabelInput
//                 label="Audio URL"
//                 icon={LinkIcon}
//                 type="url"
//                 value={formData.audioUrl}
//                 onChange={handleAudioUrlChange}
//                 onBlur={() => handleFieldBlur('audioUrl')}
//                 placeholder="https://example.com/audio.mp3"
//                 error={errors.audioUrl}
//               />
              
//               {/* Duplicate URL Warning */}
//               {duplicateUrlWarning.isDuplicate && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -8 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="mt-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex gap-3"
//                 >
//                   <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
//                       Audio URL already submitted
//                     </p>
//                     <p className="text-xs text-amber-800 dark:text-amber-200 mt-1">
//                       This URL was submitted on{' '}
//                       {new Date(duplicateUrlWarning.submittedAt!).toLocaleDateString('en-US', {
//                         month: 'short',
//                         day: 'numeric',
//                         hour: '2-digit',
//                         minute: '2-digit',
//                       })}
//                     </p>
//                     <button
//                       type="button"
//                       onClick={handleResubmitAnyway}
//                       className="mt-3 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 hover:bg-amber-300 dark:hover:bg-amber-700 transition-colors"
//                     >
//                       Resubmit Anyway
//                     </button>
//                   </div>
//                 </motion.div>
//               )}
//             </div>

//             {/* ── Section 2: Optional Metadata ── */}
//             <div>
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
//                 <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">2</div>
//                 Optional Metadata
//               </h3>
//               <FloatingLabelInput
//                 label="Analyst Name"
//                 icon={User}
//                 value={formData.analystName || ''}
//                 onChange={(value) => setFormData({ ...formData, analystName: value })}
//                 onBlur={() => handleFieldBlur('analystName')}
//                 error={errors.analystName}
//               />
//               <FloatingLabelInput
//                 label="Call ID"
//                 icon={Hash}
//                 value={formData.callId || ''}
//                 onChange={(value) => setFormData({ ...formData, callId: value })}
//                 onBlur={() => handleFieldBlur('callId')}
//                 error={errors.callId}
//               />
//               <FloatingLabelInput
//                 label="Call Duration"
//                 icon={Clock}
//                 type="text"
//                 value={formData.callDuration || ''}
//                 onChange={(value) => setFormData({ ...formData, callDuration: value })}
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

//             {/* ── Section 3: Audit Parameters ── */}
//             <div>
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
//                 <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">3</div>
//                 Audit Parameters
//                 <span className="ml-auto text-sm font-normal text-gray-500 dark:text-gray-400">
//                   {selectedCount} selected
//                 </span>
//               </h3>
//               <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
//                 Select parameters relevant to this call. n8n will score only selected ones.
//               </p>

//               {/* Select All / Clear All */}
//               <div className="flex gap-3 mb-4">
//                 <button
//                   type="button"
//                   onClick={selectAll}
//                   className="text-xs px-3 py-1.5 rounded-lg border transition-colors"
//                   style={{ borderColor: '#7c5af3', color: '#7c5af3' }}
//                 >
//                   Select All
//                 </button>
//                 <button
//                   type="button"
//                   onClick={clearAll}
//                   className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 transition-colors hover:border-gray-400"
//                 >
//                   Clear All
//                 </button>
//               </div>

//               {/* Parameter checklist - Organized by Categories */}
//               <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
//                 <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
//                   {AUDIT_PARAMETERS_BY_CATEGORY.map((category) => (
//                     <div key={category.name}>
//                       {/* Category Header */}
//                       <div className="sticky top-0 px-4 py-2.5 bg-gradient-to-r from-slate-50 to-slate-50/50 dark:from-slate-800/40 dark:to-slate-800/20 border-l-2 border-l-purple-500 border-b border-gray-200 dark:border-gray-700 z-10">
//                         <p className="text-xs font-semibold tracking-wide text-gray-700 dark:text-gray-300">
//                           {category.name}
//                         </p>
//                       </div>

//                       {/* Category Parameters */}
//                       {category.parameters.map((param) => {
//                         const isSelected = formData.selectedParameters?.includes(param) || false;
//                         return (
//                           <button
//                             key={param}
//                             type="button"
//                             onClick={() => toggleParameter(param)}
//                             className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150 hover:bg-blue-50 dark:hover:bg-blue-900/10"
//                           >
//                             {isSelected
//                               ? <CheckSquare className="w-4 h-4 flex-shrink-0" style={{ color: '#7c5af3' }} />
//                               : <Square className="w-4 h-4 flex-shrink-0 text-gray-300 dark:text-gray-600" />
//                             }
//                             <span className={`text-sm ${isSelected ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
//                               {param}
//                             </span>
//                           </button>
//                         );
//                       })}
//                     </div>
//                   ))}

//                   {/* Custom Parameters Display */}
//                   {(formData.customParameters?.length || 0) > 0 && (
//                     <>
//                       <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-100 dark:border-blue-800/30">
//                         <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">CUSTOM PARAMETERS</p>
//                       </div>
//                       {formData.customParameters?.map((param) => (
//                         <div
//                           key={param.id}
//                           className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-purple-50 dark:bg-purple-900/10 hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors"
//                         >
//                           <div className="flex-1 min-w-0">
//                             <div className="flex items-center gap-2">
//                               <span className="text-xs font-medium px-2 py-1 rounded-full bg-purple-200 dark:bg-purple-700 text-purple-800 dark:text-purple-200">
//                                 Custom
//                               </span>
//                               <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
//                                 {param.name}
//                               </span>
//                             </div>
//                             {param.description && (
//                               <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
//                                 {param.description}
//                               </p>
//                             )}
//                           </div>
//                           <button
//                             type="button"
//                             onClick={() => removeCustomParameter(param.id)}
//                             title="Remove custom parameter"
//                             className="flex-shrink-0 p-1.5 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
//                           >
//                             <X className="w-4 h-4 text-purple-600 dark:text-purple-400" />
//                           </button>
//                         </div>
//                       ))}
//                     </>
//                   )}

//                   {/* Add Custom Parameter Button */}
//                   {!isAddingParameter && (
//                     <button
//                       type="button"
//                       onClick={() => setIsAddingParameter(true)}
//                       className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-150 border-t border-gray-100 dark:border-gray-800"
//                     >
//                       <Plus className="w-4 h-4" />
//                       Add Custom Parameter
//                     </button>
//                   )}

//                   {/* Add Custom Parameter Form */}
//                   {isAddingParameter && (
//                     <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/10 border-t border-gray-100 dark:border-gray-800 space-y-3">
//                       <input
//                         type="text"
//                         placeholder="Parameter name"
//                         value={newParamName}
//                         onChange={(e) => setNewParamName(e.target.value)}
//                         className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                         onKeyPress={(e) => e.key === 'Enter' && addCustomParameter()}
//                       />
//                       <textarea
//                         placeholder="Description (optional)"
//                         value={newParamDesc}
//                         onChange={(e) => setNewParamDesc(e.target.value)}
//                         className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none h-16"
//                       />
//                       <div className="flex gap-2">
//                         <button
//                           type="button"
//                           onClick={addCustomParameter}
//                           className="flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors"
//                           style={{ backgroundColor: '#7c5af3', color: 'white' }}
//                         >
//                           Add
//                         </button>
//                         <button
//                           type="button"
//                           onClick={() => {
//                             setIsAddingParameter(false);
//                             setNewParamName('');
//                             setNewParamDesc('');
//                           }}
//                           className="flex-1 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {selectedCount > 0 && (
//                 <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
//                   {selectedCount} parameter{selectedCount > 1 ? 's' : ''} will be sent to AI for scoring
//                 </p>
//               )}
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

import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { User, Hash, Clock, Link as LinkIcon, CheckSquare, Square, Plus, X, AlertCircle, Upload, Video } from 'lucide-react';
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
import { FormData, CallType, CustomParameter, BulkUrlItem, MediaType } from '../../types';
import { VALIDATION_RULES, AUDIT_PARAMETERS, AUDIT_PARAMETERS_BY_CATEGORY, VC_PLATFORMS, detectVCPlatform, LEAD_STAGES } from '../../config/constants';

interface AuditSubmissionFormProps {
  onSuccess?: (submissionId?: string) => void;
}

export const AuditSubmissionForm: React.FC<AuditSubmissionFormProps> = ({ onSuccess }) => {
  // ── Mode state ────────────────────────────────────────────
  const [submitMode, setSubmitMode] = useState<'single' | 'bulk'>('single');
  const [mediaType, setMediaType] = useState<MediaType>('audio');

  // ── Single form state ─────────────────────────────────────
  const [formData, setFormData] = useState<FormData>({
    email: '', audioUrl: '', analystName: '', callId: '',
    callDuration: '', notificationEmail: '', callType: 'inbound',
    notes: '', selectedParameters: [], customParameters: [],
    mediaType: 'audio', vcUrl: '', leadStage: 'new-lead', lsqLink: '',
  });

  // ── Bulk state ────────────────────────────────────────────
  const [bulkMode, setBulkMode] = useState<'paste' | 'upload'>('paste');
  const [pastedUrls, setPastedUrls] = useState('');
  const [bulkItems, setBulkItems] = useState<BulkUrlItem[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<BulkUrlItem[]>([]);
  const [bulkDone, setBulkDone] = useState(false);
  const [bulkSubmittedIds, setBulkSubmittedIds] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Other state ───────────────────────────────────────────
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newParamName, setNewParamName] = useState('');
  const [newParamDesc, setNewParamDesc] = useState('');
  const [newParamScore, setNewParamScore] = useState<number | ''>(80);
  const [isAddingParameter, setIsAddingParameter] = useState(false);
  const [duplicateUrlWarning, setDuplicateUrlWarning] = useState<{ isDuplicate: boolean; submittedAt?: string }>({ isDuplicate: false });
  const [allowDuplicateSubmit, setAllowDuplicateSubmit] = useState(false);
  const [vcPlatformDetected, setVcPlatformDetected] = useState<string>('');
  const [isBulkLoading, setIsBulkLoading] = useState(false);

  const { showToast } = useToast();
  const { submit, submitBulk, isLoading, error: webhookError } = useWebhookSubmit();
  const { checkCallIdExists, submissions } = useAuditData();

  // ── VC platform detection ─────────────────────────────────
  const handleVcUrlChange = (value: string) => {
    setFormData({ ...formData, vcUrl: value, mediaType: 'video' });
    if (value) {
      const platform = detectVCPlatform(value);
      const found = VC_PLATFORMS.find(p => p.id === platform);
      setVcPlatformDetected(found ? found.label : 'Other');
    } else {
      setVcPlatformDetected('');
    }
  };

  const handleMediaTypeChange = (type: MediaType) => {
    setMediaType(type);
    setFormData({ ...formData, mediaType: type });
    if (type === 'video') setSubmitMode('single'); // VC only supports single
  };

  // ── Bulk URL validation ───────────────────────────────────
  // ── Auto-clear bulk UI when all audits complete ─────────
  React.useEffect(() => {
    if (bulkSubmittedIds.length === 0 || !bulkDone) return;

    const allDone = bulkSubmittedIds.every((id) => {
      const sub = submissions.find((s) => s.id === id);
      if (!sub) return false;
      return sub.status === 'passed' || sub.status === 'flagged' || sub.status === 'failed';
    });

    if (allDone) {
      setTimeout(() => {
        setBulkItems([]);
        setBulkProgress([]);
        setBulkDone(false);
        setPastedUrls('');
        setBulkSubmittedIds([]);
      }, 2000);
    }
  }, [submissions, bulkSubmittedIds, bulkDone]);

  const validateBulkUrls = useCallback(async (rawText: string) => {
    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) { setBulkItems([]); return; }

    setIsValidating(true);
    const items: BulkUrlItem[] = lines.map(url => ({
      url,
      status: /^https?:\/\/.+/.test(url) ? 'pending' : 'invalid',
    }));
    setBulkItems(items);
    
    // Check duplicates for valid URLs
    const updated = [...items];
    const seenUrls = new Set<string>();
    for (let i = 0; i < updated.length; i++) {
      if (updated[i].status !== 'pending') continue;
      if (seenUrls.has(updated[i].url)) {
        updated[i] = { ...updated[i], status: 'duplicate', isDuplicateInBatch: true };
        continue;
      }
      seenUrls.add(updated[i].url);
      try {
        const result = await auditService.checkAudioUrlDuplicate(updated[i].url);
        updated[i] = { ...updated[i], status: result.isDuplicate ? 'duplicate' : 'valid' };
      } catch {
        updated[i] = { ...updated[i], status: 'valid' };
      }
    }
    setBulkItems(updated);
    setIsValidating(false);
  }, []);

  // ── CSV/Excel upload ──────────────────────────────────────
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const lines = text.split('\n').filter(Boolean);

    // Find audio_url column
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
    const urlCol = headers.indexOf('audio_url');
    if (urlCol === -1) {
      showToast('CSV must have an audio_url column', 'error');
      return;
    }

    const urls = lines.slice(1)
      .map(line => {
        const cols = line.split(',');
        return cols[urlCol]?.trim().replace(/"/g, '') || '';
      })
      .filter(Boolean)
      .join('\n');

    setPastedUrls(urls);
    await validateBulkUrls(urls);
  };

  // ── Bulk submit handler ───────────────────────────────────
  const handleBulkSubmit = async () => {
    const validCount = bulkItems.filter(i => i.status === 'valid').length;
    if (validCount === 0) {
      showToast('No valid URLs to submit', 'error');
      return;
    }
    if (!formData.email) {
      showToast('Email is required', 'error');
      return;
    }

    setIsBulkLoading(true);
    setBulkProgress(bulkItems);
    setBulkDone(false);

    try {
      const submittedIds = await submitBulk(
        bulkItems,
        { ...formData, mediaType: 'audio' },
        (updated) => setBulkProgress([...updated])
      );

      setBulkSubmittedIds(submittedIds || []);
      setBulkDone(true);
      showToast(`${validCount} audits submitted successfully`, 'success');
      onSuccess?.();
    } finally {
      setIsBulkLoading(false);
    }
  };

  // ── Reset bulk form for next batch ────────────────────────────────
  const resetBulkForm = () => {
    setPastedUrls('');
    setBulkItems([]);
    setBulkProgress([]);
    setBulkDone(false);
    setBulkSubmittedIds([]);
    setSubmitMode('bulk'); // Keep in bulk mode
    showToast('Ready for new batch', 'success');
  };

  // ── Single form validation ────────────────────────────────
  const validateField = async (field: string, value: string): Promise<string | null> => {
    switch (field) {
      case 'email': {
        if (!value) return 'Email is required';
        if (!VALIDATION_RULES.email.pattern.test(value)) return 'Please enter a valid email address';
        return null;
      }
      case 'audioUrl': {
        if (!value) return 'Audio URL is required';
        if (!VALIDATION_RULES.audioUrl.pattern.test(value)) return 'Please enter a valid URL (https://...)';
        if (!allowDuplicateSubmit) {
          const duplicate = await auditService.checkAudioUrlDuplicate(value);
          if (duplicate.isDuplicate) { setDuplicateUrlWarning(duplicate); return null; }
        }
        setDuplicateUrlWarning({ isDuplicate: false });
        return null;
      }
      case 'vcUrl': {
        if (!value) return 'VC URL is required';
        if (!VALIDATION_RULES.vcUrl.pattern.test(value)) return 'Please enter a valid URL (https://...)';
        return null;
      }
      case 'analystName': {
        if (value && value.length < VALIDATION_RULES.analystName.minLength) return `Minimum ${VALIDATION_RULES.analystName.minLength} characters`;
        if (value && value.length > VALIDATION_RULES.analystName.maxLength) return `Maximum ${VALIDATION_RULES.analystName.maxLength} characters`;
        return null;
      }
      case 'callId': {
        if (value && !VALIDATION_RULES.callId.pattern.test(value)) return 'Call ID can only contain letters, numbers, hyphens, and underscores';
        if (value && value.length > VALIDATION_RULES.callId.maxLength) return `Maximum ${VALIDATION_RULES.callId.maxLength} characters`;
        if (value) { const exists = await checkCallIdExists(value); if (exists) return 'This Call ID already exists'; }
        return null;
      }
      case 'callDuration': {
        if (!value) return 'Call duration is required';
        if (value) { const timeRegex = /^(\d{1,2}):(\d{2})(:(\d{2}))?$/; if (!timeRegex.test(value)) return 'Use format MM:SS'; }
        return null;
      }
      default: return null;
    }
  };

  const handleFieldBlur = async (field: string) => {
    const value = field === 'vcUrl' ? (formData.vcUrl || '') : (formData[field as keyof FormData] as string || '');
    const error = await validateField(field, value);
    if (error) setErrors(prev => ({ ...prev, [field]: error }));
    else setErrors(prev => { const { [field]: _, ...rest } = prev; return rest; });
  };

  const toggleParameter = (param: string) => {
    const current = formData.selectedParameters || [];
    const updated = current.includes(param) ? current.filter(p => p !== param) : [...current, param];
    setFormData({ ...formData, selectedParameters: updated });
  };

  const addCustomParameter = () => {
    if (!newParamName.trim()) { showToast('Parameter name is required', 'error'); return; }
    const scoreVal = newParamScore === '' ? undefined : Math.max(0, Math.min(100, Number(newParamScore)));
    const customParam: CustomParameter = { id: `custom_${Date.now()}`, name: newParamName.trim(), description: newParamDesc.trim() || undefined, score: scoreVal };
    setFormData({ ...formData, customParameters: [...(formData.customParameters || []), customParam] });
    setNewParamName(''); setNewParamDesc(''); setNewParamScore(80); setIsAddingParameter(false);
  };

  const isFormValid = () => {
    const urlValid = mediaType === 'video' ? !!formData.vcUrl : !!formData.audioUrl;
    const durationValid = mediaType === 'audio' && submitMode === 'single' ? !!formData.callDuration && !errors.callDuration : true;
    return !!formData.email && urlValid && durationValid && !errors.email && !errors.audioUrl && !errors.vcUrl && !errors.callDuration;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const urlField = mediaType === 'video' ? 'vcUrl' : 'audioUrl';
    const urlValue = mediaType === 'video' ? (formData.vcUrl || '') : formData.audioUrl;
    const fieldsToValidate = mediaType === 'audio' && submitMode === 'single' ? ['email', urlField, 'callDuration'] : ['email', urlField];
    for (const field of fieldsToValidate) {
      let val = '';
      if (field === urlField) val = urlValue;
      else if (field === 'callDuration') val = formData.callDuration || '';
      else val = (formData[field as keyof FormData] as string || '');
      const error = await validateField(field, val);
      if (error) setErrors(prev => ({ ...prev, [field]: error }));
    }
    if (!isFormValid()) { showToast('Please fix validation errors', 'error'); return; }
    try {
      const submissionId = await submit({ ...formData, mediaType });
      showToast('Audit submitted — AI is now reviewing the call', 'success');
      setFormData({ email: '', audioUrl: '', analystName: '', callId: '', callDuration: '', notificationEmail: '', callType: 'inbound', notes: '', selectedParameters: [], customParameters: [], mediaType: 'audio', vcUrl: '', leadStage: 'new-lead', lsqLink: '' });
      setErrors({}); setAllowDuplicateSubmit(false); setDuplicateUrlWarning({ isDuplicate: false }); setVcPlatformDetected('');
      onSuccess?.(submissionId ?? undefined);
    } catch { showToast(webhookError || 'Failed to submit audit', 'error'); }
  };

  const progress = (() => {
    const urlFilled = mediaType === 'video' ? !!formData.vcUrl : !!formData.audioUrl;
    const filled = [!!formData.email, urlFilled].filter(Boolean).length;
    return Math.round((filled / 2) * 100);
  })();

  const selectedCount = (formData.selectedParameters?.length || 0) + (formData.customParameters?.length || 0);
  const bulkValid = bulkItems.filter(i => i.status === 'valid').length;
  const bulkDuplicate = bulkItems.filter(i => i.status === 'duplicate').length;
  const bulkInvalid = bulkItems.filter(i => i.status === 'invalid').length;
  const bulkSubmitted = bulkProgress.filter(i => i.status === 'submitted').length;
  const bulkFailed = bulkProgress.filter(i => i.status === 'failed').length;
  const bulkTotal = bulkProgress.filter(i => i.status !== 'duplicate' && i.status !== 'invalid').length;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <GlassmorphismCard className="p-8 md:p-12">
          <div className="mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Call Audit Submission
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Submit call recordings for AI compliance analysis</p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
              <span className="text-sm text-gray-500">{progress}%</span>
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
                onChange={(value) => { setFormData({ ...formData, email: value }); setErrors(prev => ({ ...prev, email: '' })); }}
                onBlur={() => handleFieldBlur('email')}
                error={errors.email}
              />

              {/* ── Media type + mode toggles ── */}
              <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                  {/* Audio / VC toggle */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleMediaTypeChange('audio')}
                      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${mediaType === 'audio' ? 'border-purple-400 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 font-medium' : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'}`}
                    >
                      <LinkIcon className="w-3 h-3" /> Audio
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMediaTypeChange('video')}
                      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${mediaType === 'video' ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium' : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'}`}
                    >
                      <Video className="w-3 h-3" /> Video Call (VC)
                    </button>
                  </div>

                  {/* Single / Bulk toggle — only for Audio */}
                  {mediaType === 'audio' && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setSubmitMode('single')}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${submitMode === 'single' ? 'border-purple-400 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 font-medium' : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'}`}
                      >
                        Single
                      </button>
                      <button
                        type="button"
                        onClick={() => setSubmitMode('bulk')}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${submitMode === 'bulk' ? 'border-purple-400 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 font-medium' : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'}`}
                      >
                        Bulk
                      </button>
                    </div>
                  )}
                </div>

                {/* ── Single Audio ── */}
                {mediaType === 'audio' && submitMode === 'single' && (
                  <>
                    <div className="mt-6 space-y-4">
                    <FloatingLabelInput
                      label="Audio URL"
                      icon={LinkIcon}
                      type="url"
                      value={formData.audioUrl}
                      onChange={(value) => { setFormData({ ...formData, audioUrl: value }); setAllowDuplicateSubmit(false); setDuplicateUrlWarning({ isDuplicate: false }); }}
                      onBlur={() => handleFieldBlur('audioUrl')}
                      placeholder="https://recordings.exotel.com/..."
                      error={errors.audioUrl}
                    />
                    <FloatingLabelInput
                      label="Call Duration"
                      icon={Clock}
                      type="text"
                      value={formData.callDuration || ''}
                      onChange={(v) => setFormData({ ...formData, callDuration: v })}
                      onBlur={() => handleFieldBlur('callDuration')}
                      placeholder="MM:SS"
                      error={errors.callDuration}
                    />
                    {duplicateUrlWarning.isDuplicate && (
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                        className="mt-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">Audio URL already submitted</p>
                          <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                            Submitted on {new Date(duplicateUrlWarning.submittedAt!).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                          <button type="button" onClick={() => { setAllowDuplicateSubmit(true); setDuplicateUrlWarning({ isDuplicate: false }); }}
                            className="mt-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 hover:bg-amber-300 transition-colors">
                            Resubmit Anyway
                          </button>
                        </div>
                      </motion.div>
                    )}
                    </div>
                  </>
                )}

                {/* ── Single VC ── */}
                {mediaType === 'video' && (
                  <>
                    <FloatingLabelInput
                      label="VC Recording URL"
                      icon={Video}
                      type="url"
                      value={formData.vcUrl || ''}
                      onChange={handleVcUrlChange}
                      onBlur={() => handleFieldBlur('vcUrl')}
                      placeholder="https://zoom.us/rec/... or meet.google.com/..."
                      error={errors.vcUrl}
                    />
                    {vcPlatformDetected && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-gray-500">Detected:</span>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-medium">
                          {vcPlatformDetected}
                        </span>
                      </div>
                    )}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="text-xs text-gray-400 dark:text-gray-500">Supported:</span>
                      {VC_PLATFORMS.map(p => (
                        <span key={p.id} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">{p.label}</span>
                      ))}
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">Other</span>
                    </div>
                  </>
                )}

                {/* ── Bulk Audio ── */}
                {mediaType === 'audio' && submitMode === 'bulk' && (
                  <div className="space-y-4">
                    {/* Paste / Upload tabs */}
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setBulkMode('paste')}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${bulkMode === 'paste' ? 'border-purple-400 bg-purple-50 dark:bg-purple-900/20 text-purple-700 font-medium' : 'border-gray-300 text-gray-500'}`}>
                        Paste URLs
                      </button>
                      <button type="button" onClick={() => setBulkMode('upload')}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${bulkMode === 'upload' ? 'border-purple-400 bg-purple-50 dark:bg-purple-900/20 text-purple-700 font-medium' : 'border-gray-300 text-gray-500'}`}>
                        Upload Sheet
                      </button>
                    </div>

                    {bulkMode === 'paste' && (
                      <textarea
                        value={pastedUrls}
                        onChange={(e) => { setPastedUrls(e.target.value); validateBulkUrls(e.target.value); }}
                        placeholder={"Paste one URL per line:\nhttps://recordings.exotel.com/call1.mp3\nhttps://recordings.exotel.com/call2.mp3"}
                        className="w-full h-28 text-xs font-mono p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    )}

                    {bulkMode === 'upload' && (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:border-purple-400 transition-colors"
                      >
                        <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">Drop CSV or Excel or <span className="text-purple-600 dark:text-purple-400">browse</span></p>
                        <p className="text-xs text-gray-400 mt-1">Required column: <code>audio_url</code></p>
                        <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleFileUpload} aria-label="Custom parameter description"/>
                      </div>
                    )}

                    {/* Preview table */}
                    {bulkItems.length > 0 && (
                      <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                          <span className="text-xs font-medium text-gray-500">{bulkItems.length} URLs</span>
                          <div className="flex gap-2">
                            {bulkValid > 0 && <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">{bulkValid} valid</span>}
                            {bulkDuplicate > 0 && <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">{bulkDuplicate} duplicate</span>}
                            {bulkInvalid > 0 && <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">{bulkInvalid} invalid</span>}
                            {isValidating && <span className="text-xs text-gray-400">Checking...</span>}
                          </div>
                        </div>
                        <div className="max-h-48 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
                          {bulkItems.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 px-3 py-2">
                              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                item.status === 'valid' ? 'bg-green-500'
                                : item.status === 'duplicate' ? 'bg-amber-500'
                                : item.status === 'invalid' ? 'bg-red-500'
                                : 'bg-gray-400'}`} />
                              <span className="text-xs text-gray-700 dark:text-gray-300 flex-1 truncate">{item.url}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                item.status === 'valid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : item.status === 'duplicate' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                : item.status === 'invalid' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                : 'bg-gray-100 text-gray-500'}`}>
                                {item.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Bulk progress */}
                    {bulkProgress.length > 0 && (
                      <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                        <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              {bulkDone ? 'Complete' : `Submitting ${bulkSubmitted}/${bulkTotal}...`}
                            </span>
                            {bulkDone && (
                              <div className="flex gap-2">
                                {bulkSubmitted > 0 && <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">{bulkSubmitted} submitted</span>}
                                {bulkFailed > 0 && <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">{bulkFailed} failed</span>}
                              </div>
                            )}
                          </div>
                          {!bulkDone && bulkTotal > 0 && (
                            <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                              <div className="h-full rounded-full bg-purple-500 transition-all duration-300" style={{ width: `${(bulkSubmitted / bulkTotal) * 100}%` }} />
                            </div>
                          )}
                        </div>
                        <div className="max-h-36 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
                          {bulkProgress.filter(i => i.status !== 'duplicate' && i.status !== 'invalid').map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 px-3 py-2">
                              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                item.status === 'submitted' ? 'bg-green-500'
                                : item.status === 'submitting' ? 'bg-purple-500'
                                : item.status === 'failed' ? 'bg-red-500'
                                : 'bg-gray-300'}`} />
                              <span className="text-xs text-gray-600 dark:text-gray-400 flex-1 truncate">{item.url.split('/').pop()}</span>
                              <span className="text-xs text-gray-400">{item.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Bulk submit button */}
                    {!bulkDone && bulkItems.length > 0 && (
                      <button
                        type="button"
                        onClick={handleBulkSubmit}
                        disabled={isBulkLoading || !formData.email || bulkValid === 0}
                        className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ background: 'linear-gradient(135deg, #7c5af3, #e94d8c)' }}
                      >
                        {isBulkLoading ? (
                          <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            Submitting {bulkSubmitted}/{bulkTotal}...
                          </span>
                        ) : bulkValid === 0 ? (
                          'No valid URLs to submit'
                        ) : (
                          `Submit ${bulkValid} Audit${bulkValid > 1 ? 's' : ''}`
                        )}
                      </button>
                    )}

                    {/* Submit Another Batch Button (After completion) */}
                    {bulkDone && bulkProgress.length > 0 && (
                      <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                          type="button"
                          onClick={resetBulkForm}
                          className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg"
                          style={{ background: 'linear-gradient(135deg, #7c5af3, #e94d8c)' }}
                        >
                           Submit Another Batch
                        </button>
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                          Submission complete. Results above. Ready to process more audits?
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ── Section 2: Optional Metadata (single mode only) ── */}
            {submitMode === 'single' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">2</div>
                  Optional Metadata
                </h3>
                <FloatingLabelInput label="Analyst Name" icon={User} value={formData.analystName || ''} onChange={(v) => setFormData({ ...formData, analystName: v })} onBlur={() => handleFieldBlur('analystName')} error={errors.analystName} />
                <SegmentedControl label="Call Type" options={[{ label: 'Inbound', value: 'inbound' }, { label: 'Outbound', value: 'outbound' }]} value={formData.callType} onChange={(v) => setFormData({ ...formData, callType: v as CallType })} />
                
                {/* ── Lead Information ── */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" />
                    Lead Information (Optional)
                  </h4>
                  <select
                    value={formData.leadStage || 'new-lead'}
                    onChange={(e) => setFormData({ ...formData, leadStage: e.target.value as any })}
                    aria-label="Lead Stage"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4 appearance-none cursor-pointer pr-10 bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23666%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.25rem]"
                  >
                    {LEAD_STAGES.map(stage => (
                      <option key={stage.id} value={stage.id}>{stage.label}</option>
                    ))}
                  </select>
                  
                  <FloatingLabelInput
                    label="LeadSquare Link"
                    icon={LinkIcon}
                    type="url"
                    value={formData.lsqLink || ''}
                    onChange={(v) => setFormData({ ...formData, lsqLink: v })}
                    placeholder="https://lsq.example.com/lead/123"
                    error={errors.lsqLink}
                  />
                </div>

                <FloatingLabelInput label="Notification Email" icon={User} type="email" value={formData.notificationEmail || ''} onChange={(v) => setFormData({ ...formData, notificationEmail: v })} onBlur={() => handleFieldBlur('notificationEmail')} placeholder="Enter email for notifications (optional)" error={errors.notificationEmail} />
                <AutoExpandingTextarea value={formData.notes || ''} onChange={(v) => setFormData({ ...formData, notes: v })} placeholder="Add notes about the call (optional)" maxLength={VALIDATION_RULES.notes.maxLength} />
              </div>
            )}

            {/* ── Section 3: Audit Parameters ── */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">{submitMode === 'single' ? '3' : '2'}</div>
                Audit Parameters
                <span className="ml-auto text-sm font-normal text-gray-500">{selectedCount} selected</span>
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {submitMode === 'bulk' ? 'These parameters apply to all bulk submissions.' : 'Select parameters relevant to this call.'}
              </p>

              <div className="flex gap-3 mb-4">
                <button type="button" onClick={() => setFormData({ ...formData, selectedParameters: [...AUDIT_PARAMETERS] })} className="text-xs px-3 py-1.5 rounded-lg border transition-colors" style={{ borderColor: '#7c5af3', color: '#7c5af3' }}>Select All</button>
                <button type="button" onClick={() => setFormData({ ...formData, selectedParameters: [] })} className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 transition-colors">Clear All</button>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
                  {AUDIT_PARAMETERS_BY_CATEGORY.map((category) => (
                    <div key={category.name}>
                      <div className="sticky top-0 px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border-l-2 border-l-purple-500 border-b border-gray-200 dark:border-gray-700 z-10">
                        <p className="text-xs font-semibold tracking-wide text-gray-700 dark:text-gray-300">{category.name}</p>
                      </div>
                      {category.parameters.map((param) => {
                        const isSelected = formData.selectedParameters?.includes(param) || false;
                        return (
                          <button key={param} type="button" onClick={() => toggleParameter(param)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all hover:bg-blue-50 dark:hover:bg-blue-900/10">
                            {isSelected
                              ? <CheckSquare className="w-4 h-4 flex-shrink-0" style={{ color: '#7c5af3' }} />
                              : <Square className="w-4 h-4 flex-shrink-0 text-gray-300 dark:text-gray-600" />}
                            <span className={`text-sm ${isSelected ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-600 dark:text-gray-400'}`}>{param}</span>
                          </button>
                        );
                      })}
                    </div>
                  ))}

                  {(formData.customParameters?.length || 0) > 0 && (
                    <>
                      <div className="px-4 py-2.5 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-100 dark:border-blue-800/30">
                        <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">CUSTOM PARAMETERS</p>
                      </div>
                      {formData.customParameters?.map((param) => (
                        <div key={param.id} className="flex items-center justify-between gap-3 px-4 py-3 bg-purple-50 dark:bg-purple-900/10">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-200 dark:bg-purple-700 text-purple-800 dark:text-purple-200">Custom</span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{param.name}</span>
                              {param.score !== undefined && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium">Score: {param.score}%</span>
                              )}
                            </div>
                            {param.description && <p className="text-xs text-gray-500 mt-1 truncate">{param.description}</p>}
                          </div>
                          <button type="button" title="Remove custom parameter" aria-label="Remove custom parameter" onClick={() => setFormData({ ...formData, customParameters: (formData.customParameters || []).filter(p => p.id !== param.id) })} className="p-1.5 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors">
                            <X className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          </button>
                        </div>
                      ))}
                    </>
                  )}

                  {!isAddingParameter && (
                    <button type="button" onClick={() => setIsAddingParameter(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all border-t border-gray-100 dark:border-gray-800">
                      <Plus className="w-4 h-4" /> Add Custom Parameter
                    </button>
                  )}

                  {isAddingParameter && (
                    <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/10 border-t border-gray-100 dark:border-gray-800 space-y-3">
                      <input type="text" placeholder="Parameter name" value={newParamName} onChange={(e) => setNewParamName(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        onKeyPress={(e) => e.key === 'Enter' && addCustomParameter()} />
                      <textarea placeholder="Description (optional)" value={newParamDesc} onChange={(e) => setNewParamDesc(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none h-12" />
                      <div>
                        <label htmlFor="param-score" className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">Expected Score (0-100)</label>
                        <input id="param-score" type="number" min="0" max="100" value={newParamScore} onChange={(e) => setNewParamScore(e.target.value === '' ? '' : Math.max(0, Math.min(100, Number(e.target.value))))}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                      </div>
                      <div className="flex gap-2">
                        <button type="button" onClick={addCustomParameter} className="flex-1 px-3 py-2 text-sm font-medium rounded-lg text-white transition-colors" style={{ backgroundColor: '#7c5af3' }}>Add</button>
                        <button type="button" onClick={() => { setIsAddingParameter(false); setNewParamName(''); setNewParamDesc(''); setNewParamScore(80); }} className="flex-1 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {selectedCount > 0 && <p className="mt-2 text-xs text-gray-500">{selectedCount} parameter{selectedCount > 1 ? 's' : ''} will be sent to AI for scoring</p>}
            </div>

            {/* ── Submit button (single mode only) ── */}
            {submitMode === 'single' && (
              <motion.div className="flex gap-4 pt-4">
                <GradientButton type="submit" isLoading={isLoading} disabled={!isFormValid() || isLoading} loadingText="Processing…">
                  Submit for Audit
                </GradientButton>
              </motion.div>
            )}
          </form>
        </GlassmorphismCard>
      </motion.div>
    </div>
  );
};