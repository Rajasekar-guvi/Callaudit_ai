// import React, { useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { X } from 'lucide-react';
// import { AuditSubmission } from '../../types';
// import { StatusBadge } from '../ui/StatusBadge';
// import { ProgressBar } from '../ui/ProgressBar';

// interface AuditDetailDrawerProps {
//   submission: AuditSubmission;
//   onClose: () => void;
// }

// export const AuditDetailDrawer: React.FC<AuditDetailDrawerProps> = ({ submission, onClose }) => {
//   useEffect(() => {
//     const handleEsc = (e: KeyboardEvent) => {
//       if (e.key === 'Escape') onClose();
//     };
//     document.addEventListener('keydown', handleEsc);
//     return () => document.removeEventListener('keydown', handleEsc);
//   }, [onClose]);

//   return (
//     <>
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         onClick={onClose}
//         className="fixed inset-0 bg-black/30 dark:bg-black/50 z-40"
//       />

//       <motion.div
//         initial={{ x: 400 }}
//         animate={{ x: 0 }}
//         exit={{ x: 400 }}
//         transition={{ type: 'spring', bounce: 0.1 }}
//         className="fixed right-0 top-0 h-full w-full md:w-96 bg-white dark:bg-slate-900 shadow-2xl z-50 overflow-y-auto"
//       >
//         <div className="sticky top-0 flex items-center justify-between p-6 bg-gradient-to-r from-blue-600 to-purple-700 dark:from-blue-900 dark:to-purple-900 text-white border-b border-gray-200 dark:border-gray-700">
//           <h2 className="text-xl font-bold">Audit Details</h2>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-white/20 rounded-lg transition-colors"
//             aria-label="Close drawer"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         <div className="p-6 space-y-6">
//           <Section title="Compliance Score">
//             <div className="flex items-center gap-4">
//               <div className="text-4xl font-bold text-gray-900 dark:text-white">
//                 {submission.compliance_score ?? '-'}
//                 {submission.compliance_score !== null && <span className="text-xl text-gray-600 dark:text-gray-400">%</span>}
//               </div>
//               <div className="flex-1">
//                 <ProgressBar percentage={submission.compliance_score ?? 0} />
//               </div>
//             </div>
//             <div className="mt-4">
//               <StatusBadge status={submission.status} />
//             </div>
//           </Section>

//           <Section title="Call Information">
//             <Field label="Call ID" value={submission.call_id} />
//             <Field label="Agent Name" value={submission.agent_name} />
//             <Field label="Call Type" value={submission.call_type.toUpperCase()} />
//             <Field
//               label="Call Duration"
//               value={`${Math.floor(submission.call_duration / 60)}m ${submission.call_duration % 60}s`}
//             />
//             <Field
//               label="Submitted"
//               value={new Date(submission.created_at).toLocaleString()}
//             />
//           </Section>

//           <Section title="Audio Details">
//             <Field label="Filename" value={submission.audio_filename || 'N/A'} />
//             <Field
//               label="File Size"
//               value={submission.audio_size ? `${(submission.audio_size / 1024 / 1024).toFixed(2)} MB` : 'N/A'}
//             />
//             <Field label="Audio URL" value={submission.audio_url || 'Pending'} isCopyable />
//           </Section>

//           {submission.notes && (
//             <Section title="Notes">
//               <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{submission.notes}</p>
//             </Section>
//           )}

//           {Array.isArray(submission.violations) && submission.violations.length > 0 && (
//             <Section title="Violations">
//               <div className="space-y-3">
//                 {submission.violations.map((violation, idx) => (
//                   <div
//                     key={idx}
//                     className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
//                   >
//                     <p className="font-semibold text-red-900 dark:text-red-300 text-sm">{violation.type}</p>
//                     <p className="text-red-700 dark:text-red-400 text-sm mt-1">{violation.description}</p>
//                     {violation.severity && (
//                       <p className="text-xs text-red-600 dark:text-red-500 mt-2 capitalize">
//                         Severity: {violation.severity}
//                       </p>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </Section>
//           )}

//           {submission.webhook_response && (
//             <Section title="Processing Details">
//               <Field
//                 label="Processing Time"
//                 value={submission.webhook_response.processing_time_ms
//                   ? `${submission.webhook_response.processing_time_ms}ms`
//                   : 'N/A'}
//               />
//               {submission.webhook_response.error && (
//                 <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
//                   <p className="text-sm font-semibold text-red-900 dark:text-red-300">Error</p>
//                   <p className="text-sm text-red-700 dark:text-red-400 mt-1">
//                     {submission.webhook_response.error}
//                   </p>
//                 </div>
//               )}
//             </Section>
//           )}
//         </div>
//       </motion.div>
//     </>
//   );
// };

// interface SectionProps {
//   title: string;
//   children: React.ReactNode;
// }

// const Section: React.FC<SectionProps> = ({ title, children }) => (
//   <div>
//     <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">{title}</h3>
//     <div className="space-y-3">{children}</div>
//   </div>
// );

// interface FieldProps {
//   label: string;
//   value: string;
//   isCopyable?: boolean;
// }

// const Field: React.FC<FieldProps> = ({ label, value, isCopyable }) => (
//   <div className="flex justify-between items-start gap-4">
//     <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{label}</span>
//     <span
//       className={`text-sm text-gray-900 dark:text-white text-right ${isCopyable ? 'cursor-pointer hover:text-blue-500' : ''}`}
//       title={isCopyable ? 'Click to copy' : undefined}
//       onClick={() => {
//         if (isCopyable) {
//           navigator.clipboard.writeText(value);
//         }
//       }}
//     >
//       {value}
//     </span>
//   </div>
// );



// import React, { useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { X } from 'lucide-react';
// import { AuditSubmission } from '../../types';
// import { StatusBadge } from '../ui/StatusBadge';
// import { ProgressBar } from '../ui/ProgressBar';

// interface AuditDetailDrawerProps {
//   submission: AuditSubmission;
//   onClose: () => void;
// }

// export const AuditDetailDrawer: React.FC<AuditDetailDrawerProps> = ({ submission, onClose }) => {
//   useEffect(() => {
//     const handleEsc = (e: KeyboardEvent) => {
//       if (e.key === 'Escape') onClose();
//     };
//     window.addEventListener('keydown', handleEsc);
//     return () => window.removeEventListener('keydown', handleEsc);
//   }, [onClose]);

//   const formatDuration = (seconds: number) => {
//     const m = Math.floor(seconds / 60);
//     const s = seconds % 60;
//     return `${m}m ${s}s`;
//   };

//   return (
//     <>
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         onClick={onClose}
//         className="fixed inset-0 bg-black/30 dark:bg-black/50 z-40"
//       />

//       <motion.div
//         initial={{ x: 400 }}
//         animate={{ x: 0 }}
//         exit={{ x: 400 }}
//         transition={{ type: 'spring', bounce: 0.1 }}
//         className="fixed right-0 top-0 h-full w-full md:w-96 bg-white dark:bg-slate-900 shadow-2xl z-50 overflow-y-auto"
//         role="dialog"
//         aria-modal="true"
//       >
//         <div className="sticky top-0 flex items-center justify-between p-6 bg-gradient-to-r from-blue-600 to-purple-700 dark:from-blue-900 dark:to-purple-900 text-white border-b border-gray-200 dark:border-gray-700">
//           <h2 className="text-xl font-bold">Audit Details</h2>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-white/20 rounded-lg transition-colors"
//             aria-label="Close drawer"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         <div className="p-6 space-y-6">
//           <Section title="Compliance Score">
//             <div className="flex items-center gap-4">
//               <div className="text-4xl font-bold text-gray-900 dark:text-white">
//                 {submission.compliance_score ?? '-'}
//                 {submission.compliance_score !== null && submission.compliance_score !== undefined && (
//                   <span className="text-xl text-gray-600 dark:text-gray-400">%</span>
//                 )}
//               </div>
//               <div className="flex-1">
//                 <ProgressBar percentage={submission.compliance_score ?? 0} />
//               </div>
//             </div>
//             <div className="mt-4">
//               <StatusBadge status={submission.status} />
//             </div>
//           </Section>

//           <Section title="Call Information">
//             <Field label="Email" value={submission.email ?? 'N/A'} />
//             <Field label="Call ID" value={submission.call_id ?? 'N/A'} />
//             <Field label="Agent Name" value={submission.analyst_name ?? 'N/A'} />
//             <Field label="Call Type" value={submission.call_type ? submission.call_type.toUpperCase() : 'N/A'} />
//             <Field label="Call Duration" value={formatDuration(submission.call_duration)} />
//             <Field label="Submitted" value={new Date(submission.created_at).toLocaleString()} />
//           </Section>

//           <Section title="Audio Details">
//             <Field label="Filename" value={submission.audio_filename || 'N/A'} />
//             <Field
//               label="File Size"
//               value={submission.audio_size ? `${(submission.audio_size / 1024 / 1024).toFixed(2)} MB` : 'N/A'}
//             />
//             <Field label="Audio URL" value={submission.audio_url || 'Pending'} isCopyable />
//           </Section>

//           {submission.notes && (
//             <Section title="Notes">
//               <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{submission.notes}</p>
//             </Section>
//           )}

//           {Array.isArray(submission.violations) && submission.violations.length > 0 && (
//             <Section title="Violations">
//               <div className="space-y-3">
//                 {submission.violations.map((violation, idx) => (
//                   <div
//                     key={idx}
//                     className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
//                   >
//                     <p className="font-semibold text-red-900 dark:text-red-300 text-sm">{violation.type}</p>
//                     <p className="text-red-700 dark:text-red-400 text-sm mt-1">{violation.description}</p>
//                     {violation.severity && (
//                       <p className="text-xs text-red-600 dark:text-red-500 mt-2 capitalize">
//                         Severity: {violation.severity}
//                       </p>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </Section>
//           )}

//           {Array.isArray(submission.spoken_evidence) && submission.spoken_evidence.length > 0 && (
//             <Section title="Flagged Phrases">
//               <div className="space-y-2">
//                 {submission.spoken_evidence.map((phrase, idx) => (
//                   <div
//                     key={idx}
//                     className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
//                   >
//                     <p className="text-sm font-mono text-yellow-900 dark:text-yellow-300">
//                       "{phrase}"
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </Section>
//           )}

//           {submission.transcript && (
//             <Section title="Full Transcript">
//               <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg max-h-48 overflow-y-auto">
//                 <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
//                   {submission.transcript}
//                 </p>
//               </div>
//               <button
//                 onClick={() => {
//                   if (submission.transcript) {
//                     navigator.clipboard.writeText(submission.transcript);
//                     // TODO: Add toast notification here
//                   }
//                 }}
//                 className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
//               >
//                 📋 Copy Transcript
//               </button>
//             </Section>
//           )}

//           {submission.observations && (
//             <Section title="AI Observations & Recommendations">
//               <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
//                 <p className="text-sm text-blue-900 dark:text-blue-300 whitespace-pre-wrap leading-relaxed">
//                   {submission.observations}
//                 </p>
//               </div>
//             </Section>
//           )}

//           {submission.audio_url && submission.status !== 'pending' && (
//             <Section title="Audio Playback">
//               <audio
//                 controls
//                 className="w-full h-10 rounded-lg"
//                 src={submission.audio_url}
//               >
//                 Your browser does not support audio playback.
//               </audio>
//             </Section>
//           )}

//           {submission.webhook_response && (
//             <Section title="Processing Details">
//               <Field
//                 label="Processing Time"
//                 value={
//                   submission.webhook_response.processing_time_ms
//                     ? `${submission.webhook_response.processing_time_ms}ms`
//                     : 'N/A'
//                 }
//               />
//               {submission.webhook_response.error && (
//                 <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
//                   <p className="text-sm font-semibold text-red-900 dark:text-red-300">Error</p>
//                   <p className="text-sm text-red-700 dark:text-red-400 mt-1">
//                     {submission.webhook_response.error}
//                   </p>
//                 </div>
//               )}
//             </Section>
//           )}
//         </div>
//       </motion.div>
//     </>
//   );
// };

// interface SectionProps {
//   title: string;
//   children: React.ReactNode;
// }

// const Section: React.FC<SectionProps> = ({ title, children }) => (
//   <div>
//     <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">{title}</h3>
//     <div className="space-y-3">{children}</div>
//   </div>
// );

// interface FieldProps {
//   label: string;
//   value: React.ReactNode;
//   isCopyable?: boolean;
// }

// const Field: React.FC<FieldProps> = ({ label, value, isCopyable }) => {
//   const handleCopy = () => {
//     if (isCopyable && typeof value === 'string') {
//       navigator.clipboard.writeText(value);
//       // Ideally replace with a toast/snackbar for better UX
//     }
//   };

//   return (
//     <div className="flex justify-between items-start gap-4">
//       <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{label}</span>
//       <span
//         className={`text-sm text-gray-900 dark:text-white text-right ${isCopyable ? 'cursor-pointer hover:text-blue-500' : ''}`}
//         title={isCopyable ? 'Click to copy' : undefined}
//         onClick={handleCopy}
//       >
//         {value}
//       </span>
//     </div>
//   );
// };

// import React, { useEffect, useMemo } from 'react';
// import { motion } from 'framer-motion';
// import { X } from 'lucide-react';
// import { AuditSubmission } from '../../types';
// import { StatusBadge } from '../ui/StatusBadge';
// import { ProgressBar } from '../ui/ProgressBar';

// interface AuditDetailDrawerProps {
//   submission: AuditSubmission;
//   onClose: () => void;
// }

// // ─── Helpers ────────────────────────────────────────────────

// // Fixes "NaNm NaNs" — handles both "00:02:29" string and number seconds
// function formatDuration(value: any): string {
//   if (!value) return 'N/A';
//   if (typeof value === 'string' && value.includes(':')) {
//     // already formatted like "00:02:29" — just return as-is
//     return value;
//   }
//   const n = typeof value === 'string' ? parseFloat(value) : value;
//   if (isNaN(n)) return 'N/A';
//   const m = Math.floor(n / 60);
//   const s = Math.floor(n % 60);
//   return `${m}m ${s}s`;
// }

// // Convert "00:02:14" → seconds (134). Also handles MM:SS:00 format from n8n.
// function timeToSeconds(t: string): number {
//   const parts = t.trim().split(':').map(Number);
//   if (parts.length === 3) {
//     const [a, b, c] = parts;
//     // detect MM:SS:00 format (e.g. 04:17:00 meaning 4min 17sec)
//     // hours > 0, seconds = 0, hours value fits in minutes range
//     if (a > 0 && a < 60 && c === 0) {
//       return a * 60 + b;
//     }
//     return a * 3600 + b * 60 + c;
//   }
//   if (parts.length === 2) return parts[0] * 60 + parts[1];
//   return 0;
// }

// type FlagColor = 'red' | 'orange' | 'yellow';

// interface ParsedViolation {
//   flagColor: FlagColor;
//   title: string;
//   evidence: string;
//   ranges: Array<{ start: number; end: number }>;
// }

// // Parse violations string into structured array
// function parseViolations(raw: any): ParsedViolation[] {
//   if (!raw) return [];

//   // handle already-parsed array
//   if (Array.isArray(raw)) {
//     return raw.map((v: any) => ({
//       flagColor: (v.severity === 'high' ? 'red' : v.severity === 'medium' ? 'orange' : 'yellow') as FlagColor,
//       title: v.description || v.type || '',
//       evidence: v.evidence || '',
//       ranges: [],
//     })).filter((v: ParsedViolation) => v.title);
//   }

//   if (typeof raw !== 'string') return [];

//   // strip outer quotes + unescape ALL newline variants
//   const text = raw
//     .replace(/^"|"$/g, '')
//     .replace(/\\n/g, '\n')
//     .replace(/\n/g, '\n')
//     .trim();
//   const blocks = text.split('-----------').filter((s: string) => s.trim());

//   return blocks.map((block: string): ParsedViolation => {
//     const lines = block.trim().split('\n').filter((l: string) => l.trim());
//     const flagLine = lines[0] || '';

//     const flagMatch = flagLine.match(/\[(Red|Orange|Yellow) Flag\]\s*(.+)/i);
//     const flagColor: FlagColor = flagMatch
//       ? (flagMatch[1].toLowerCase() as FlagColor)
//       : 'yellow';
//     const title = flagMatch ? flagMatch[2].trim() : flagLine.trim();

//     const evidenceLine = lines.find((l: string) => l.startsWith('Evidence:')) || '';
//     const evidence = evidenceLine.replace('Evidence:', '').trim();

//     // extract all timestamp ranges e.g. 00:02:14–00:02:31 or single 00:11:52
//     const tsPattern = /(\d{2}:\d{2}:\d{2})(?:[–\-](\d{2}:\d{2}:\d{2}))?/g;
//     const ranges: Array<{ start: number; end: number }> = [];
//     let m: RegExpExecArray | null;
//     while ((m = tsPattern.exec(evidence)) !== null) {
//       const start = timeToSeconds(m[1]);
//       const end = m[2] ? timeToSeconds(m[2]) : start + 20;
//       ranges.push({ start, end });
//     }

//     return { flagColor, title, evidence, ranges };
//   }).filter((v: ParsedViolation) => v.title);
// }

// interface RawLine {
//   start: string;
//   end: string;
//   speaker: string;
//   text: string;
// }

// function parseRawTranscript(transcript: string): RawLine[] {
//   if (!transcript) return [];
//   return transcript
//     .split('\n')
//     .filter(line => line.trim())
//     .map(line => {
//       const match = line.match(/^(Agent|Lead)\s*\[(\d{1,2}:\d{2}(?::\d{2})?)\]:\s*(.+)$/);
//       if (!match) return null;
//       return {
//         speaker: match[1],
//         start: match[2],
//         end: match[2],
//         text: match[3],
//       };
//     })
//     .filter(Boolean) as RawLine[];
// }
// function getHighlight(startSec: number, violations: ParsedViolation[]): FlagColor | null {
//   for (const v of violations) {
//     for (const range of v.ranges) {
//       if (startSec >= range.start - 2 && startSec <= range.end + 30) {
//         return v.flagColor;
//       }
//     }
//   }
//   return null;
// }

// const FLAG_STYLES: Record<FlagColor, { bg: string; border: string; badge: string; text: string; line: string; bar: string }> = {
//   red: {
//     bg: 'bg-red-50 dark:bg-red-900/20',
//     border: 'border-red-200 dark:border-red-800',
//     badge: 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300',
//     text: 'text-red-700 dark:text-red-300',
//     line: 'bg-red-50 dark:bg-red-900/30',
//     bar: 'border-l-red-500',
//   },
//   orange: {
//     bg: 'bg-orange-50 dark:bg-orange-900/20',
//     border: 'border-orange-200 dark:border-orange-800',
//     badge: 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300',
//     text: 'text-orange-700 dark:text-orange-300',
//     line: 'bg-orange-50 dark:bg-orange-900/30',
//     bar: 'border-l-orange-500',
//   },
//   yellow: {
//     bg: 'bg-yellow-50 dark:bg-yellow-900/20',
//     border: 'border-yellow-200 dark:border-yellow-800',
//     badge: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300',
//     text: 'text-yellow-700 dark:text-yellow-300',
//     line: 'bg-yellow-50 dark:bg-yellow-900/30',
//     bar: 'border-l-yellow-500',
//   },
// };

// const FLAG_EMOJI: Record<FlagColor, string> = {
//   red: '🔴 Red Flag',
//   orange: '🟠 Orange Flag',
//   yellow: '🟡 Yellow Flag',
// };

// // ─── Main Component ──────────────────────────────────────────

// export const AuditDetailDrawer: React.FC<AuditDetailDrawerProps> = ({ submission, onClose }) => {
//   useEffect(() => {
//     const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
//     window.addEventListener('keydown', handleEsc);
//     return () => window.removeEventListener('keydown', handleEsc);
//   }, [onClose]);

//   const violations = useMemo(() => {
//     const raw = (submission as any).violations || (submission as any).spoken_evidence;
//     console.log('🔍 violations raw type:', typeof raw, '| preview:', typeof raw === 'string' ? raw.slice(0, 100) : JSON.stringify(raw)?.slice(0, 100));
//     const result = parseViolations(raw);
//     console.log('🔍 parsed count:', result.length, result[0] ? '| first ranges:' + JSON.stringify(result[0].ranges) : '');
//     return result;
//   }, [submission]);

//   const rawLines = useMemo(() =>
//   parseRawTranscript((submission as any).transcript || ''),
//   [submission]);

//   const redCount    = violations.filter(v => v.flagColor === 'red').length;
//   const orangeCount = violations.filter(v => v.flagColor === 'orange').length;
//   const yellowCount = violations.filter(v => v.flagColor === 'yellow').length;

//   return (
//     <>
//       {/* Backdrop */}
//       <motion.div
//         initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//         onClick={onClose}
//         className="fixed inset-0 bg-black/40 z-40"
//       />

//       {/* Drawer */}
//       <motion.div
//         initial={{ x: 520 }} animate={{ x: 0 }} exit={{ x: 520 }}
//         transition={{ type: 'spring', bounce: 0.1 }}
//         className="fixed right-0 top-0 h-full w-full md:w-[500px] bg-white dark:bg-slate-900 shadow-2xl z-50 overflow-y-auto"
//         role="dialog" aria-modal="true"
//       >
//         {/* Header */}
//         <div className="sticky top-0 flex items-center justify-between p-5 bg-gradient-to-r from-blue-600 to-purple-700 text-white z-10 shadow-lg">
//           <div>
//             <h2 className="text-xl font-bold">Audit Details</h2>
//             {submission.call_id && (
//               <p className="text-xs text-white/70 mt-0.5">Call ID: {submission.call_id}</p>
//             )}
//           </div>
//           <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors" aria-label="Close">
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         <div className="p-5 space-y-6">

//           {/* Compliance Score */}
//           <Section title="Compliance Score">
//             <div className="flex items-center gap-4">
//               <div className="text-4xl font-bold text-gray-900 dark:text-white">
//                 {submission.compliance_score ?? '—'}
//                 {submission.compliance_score != null && (
//                   <span className="text-xl text-gray-400 dark:text-gray-500">%</span>
//                 )}
//               </div>
//               <div className="flex-1">
//                 <ProgressBar percentage={submission.compliance_score ?? 0} />
//               </div>
//             </div>
//             <div className="mt-3">
//               <StatusBadge status={submission.status} />
//             </div>
//           </Section>

//           {/* Violation Summary Counters */}
//           {violations.length > 0 && (
//             <Section title="Violation Summary">
//               <div className="flex gap-2">
//                 {redCount > 0 && (
//                   <div className="flex-1 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-center">
//                     <div className="text-2xl font-bold text-red-600 dark:text-red-400">{redCount}</div>
//                     <div className="text-xs text-red-500 font-semibold mt-0.5">🔴 Red</div>
//                   </div>
//                 )}
//                 {orangeCount > 0 && (
//                   <div className="flex-1 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-3 text-center">
//                     <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{orangeCount}</div>
//                     <div className="text-xs text-orange-500 font-semibold mt-0.5">🟠 Orange</div>
//                   </div>
//                 )}
//                 {yellowCount > 0 && (
//                   <div className="flex-1 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-3 text-center">
//                     <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{yellowCount}</div>
//                     <div className="text-xs text-yellow-500 font-semibold mt-0.5">🟡 Yellow</div>
//                   </div>
//                 )}
//               </div>
//             </Section>
//           )}

//           {/* Violations List */}
//           {violations.length > 0 && (
//             <Section title="Violations">
//               <div className="space-y-2">
//                 {violations.map((v, idx) => {
//                   const s = FLAG_STYLES[v.flagColor];
//                   return (
//                     <div key={idx} className={`p-3 ${s.bg} border ${s.border} rounded-lg`}>
//                       <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.badge}`}>
//                         {FLAG_EMOJI[v.flagColor]}
//                       </span>
//                       <p className={`text-sm font-semibold ${s.text} mt-1.5`}>{v.title}</p>
//                       {v.evidence && (
//                         <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
//                           {v.evidence}
//                         </p>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             </Section>
//           )}

//           {/* Call Information */}
//           <Section title="Call Information">
//             <Field label="Email"         value={submission.email ?? 'N/A'} />
//             <Field label="Call ID"       value={submission.call_id ?? 'N/A'} />
//             <Field label="Agent Name"    value={submission.analyst_name ?? 'N/A'} />
//             <Field label="Call Type"     value={submission.call_type ? submission.call_type.toUpperCase() : 'N/A'} />
//             <Field label="Call Duration" value={formatDuration(submission.call_duration)} />
//             <Field label="Submitted"     value={new Date(submission.created_at).toLocaleString()} />
//           </Section>

//           {/* Audio Details */}
//           <Section title="Audio Details">
//             <Field label="Filename"  value={submission.audio_filename || 'N/A'} />
//             <Field label="File Size" value={submission.audio_size ? `${(submission.audio_size / 1024 / 1024).toFixed(2)} MB` : 'N/A'} />
//             <Field label="Audio URL" value={submission.audio_url || 'Pending'} isCopyable />
//           </Section>

//           {/* Notes */}
//           {submission.notes && (
//             <Section title="Notes">
//               <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{submission.notes}</p>
//             </Section>
//           )}

//           {/* Audio Playback */}
//           {submission.audio_url && submission.status !== 'pending' && (
//             <Section title="Audio Playback">
//               <audio controls className="w-full rounded-lg" src={submission.audio_url}>
//                 Your browser does not support audio playback.
//               </audio>
//             </Section>
//           )}

//           {/* Full Transcript — highlighted using raw_transcript */}
//           {rawLines.length > 0 ? (
//             <Section title="Full Transcript">
//               {violations.length > 0 && (
//                 <div className="flex flex-wrap gap-3 mb-3 text-xs text-gray-500 dark:text-gray-400">
//                   <span className="flex items-center gap-1.5">
//                     <span className="w-3 h-3 rounded-sm bg-red-200 dark:bg-red-800 inline-block" />
//                     Red Flag
//                   </span>
//                   <span className="flex items-center gap-1.5">
//                     <span className="w-3 h-3 rounded-sm bg-orange-200 dark:bg-orange-800 inline-block" />
//                     Orange Flag
//                   </span>
//                   <span className="flex items-center gap-1.5">
//                     <span className="w-3 h-3 rounded-sm bg-yellow-200 dark:bg-yellow-800 inline-block" />
//                     Yellow Flag
//                   </span>
//                 </div>
//               )}
//               <div className="bg-gray-100 dark:bg-gray-800 rounded-xl max-h-72 overflow-y-auto p-3 space-y-0.5">
//                 {rawLines.map((line, idx) => {
//                   const startSec  = timeToSeconds(line.start);
//                   const highlight = getHighlight(startSec, violations);
//                   const s         = highlight ? FLAG_STYLES[highlight] : null;

//                   return (
//                     <div
//                       key={idx}
//                       className={`px-2 py-0.5 rounded text-xs leading-relaxed ${
//                         s ? `${s.line} border-l-2 ${s.bar}` : ''
//                       }`}
//                     >
//                       <span className="text-gray-400 dark:text-gray-500 font-mono mr-1.5">
//                         [{line.start}]
//                       </span>
//                       <span className={`font-semibold mr-1 ${
//                         line.speaker === 'Agent'
//                           ? 'text-blue-600 dark:text-blue-400'
//                           : 'text-green-600 dark:text-green-400'
//                       }`}>
//                         {line.speaker}:
//                       </span>
//                       <span className={s ? s.text : 'text-gray-700 dark:text-gray-300'}>
//                         {line.text}
//                       </span>
//                     </div>
//                   );
//                 })}
//               </div>
//               <button
//                 onClick={() => {
//                   const text = rawLines.map(l => `[${l.start}] ${l.speaker}: ${l.text}`).join('\n');
//                   navigator.clipboard.writeText(text);
//                 }}
//                 className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
//               >
//                 📋 Copy Transcript
//               </button>
//             </Section>

//           ) : submission.transcript ? (
//             // Fallback: plain transcript if raw_transcript not available
//             <Section title="Full Transcript">
//               <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl max-h-64 overflow-y-auto">
//                 <p className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
//                   {submission.transcript}
//                 </p>
//               </div>
//               <button
//                 onClick={() => submission.transcript && navigator.clipboard.writeText(submission.transcript)}
//                 className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
//               >
//                 📋 Copy Transcript
//               </button>
//             </Section>
//           ) : null}

//           {/* AI Observations */}
//           {submission.observations && (
//             <Section title="AI Observations">
//               <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
//                 <p className="text-sm text-blue-900 dark:text-blue-300 whitespace-pre-wrap leading-relaxed">
//                   {submission.observations}
//                 </p>
//               </div>
//             </Section>
//           )}

//         </div>
//       </motion.div>
//     </>
//   );
// };

// // ─── Sub-components ──────────────────────────────────────────

// const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
//   <div>
//     <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3 border-b border-gray-100 dark:border-gray-800 pb-1">
//       {title}
//     </h3>
//     <div className="space-y-2">{children}</div>
//   </div>
// );

// const Field: React.FC<{ label: string; value: React.ReactNode; isCopyable?: boolean }> = ({ label, value, isCopyable }) => (
//   <div className="flex justify-between items-start gap-4">
//     <span className="text-xs font-medium text-gray-500 dark:text-gray-400 flex-shrink-0">{label}</span>
//     <span
//       className={`text-sm text-gray-900 dark:text-white text-right break-all ${isCopyable ? 'cursor-pointer hover:text-blue-500' : ''}`}
//       onClick={() => { if (isCopyable && typeof value === 'string') navigator.clipboard.writeText(value); }}
//     >
//       {value}
//     </span>
//   </div>
// );

// import React, { useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { X } from 'lucide-react';
// import { AuditSubmission } from '../../types';
// import { StatusBadge } from '../ui/StatusBadge';
// import { ProgressBar } from '../ui/ProgressBar';

// interface AuditDetailDrawerProps {
//   submission: AuditSubmission;
//   onClose: () => void;
// }

// export const AuditDetailDrawer: React.FC<AuditDetailDrawerProps> = ({ submission, onClose }) => {
//   useEffect(() => {
//     const handleEsc = (e: KeyboardEvent) => {
//       if (e.key === 'Escape') onClose();
//     };
//     document.addEventListener('keydown', handleEsc);
//     return () => document.removeEventListener('keydown', handleEsc);
//   }, [onClose]);

//   return (
//     <>
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         onClick={onClose}
//         className="fixed inset-0 bg-black/30 dark:bg-black/50 z-40"
//       />

//       <motion.div
//         initial={{ x: 400 }}
//         animate={{ x: 0 }}
//         exit={{ x: 400 }}
//         transition={{ type: 'spring', bounce: 0.1 }}
//         className="fixed right-0 top-0 h-full w-full md:w-96 bg-white dark:bg-slate-900 shadow-2xl z-50 overflow-y-auto"
//       >
//         <div className="sticky top-0 flex items-center justify-between p-6 bg-gradient-to-r from-blue-600 to-purple-700 dark:from-blue-900 dark:to-purple-900 text-white border-b border-gray-200 dark:border-gray-700">
//           <h2 className="text-xl font-bold">Audit Details</h2>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-white/20 rounded-lg transition-colors"
//             aria-label="Close drawer"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         <div className="p-6 space-y-6">
//           <Section title="Compliance Score">
//             <div className="flex items-center gap-4">
//               <div className="text-4xl font-bold text-gray-900 dark:text-white">
//                 {submission.compliance_score ?? '-'}
//                 {submission.compliance_score !== null && <span className="text-xl text-gray-600 dark:text-gray-400">%</span>}
//               </div>
//               <div className="flex-1">
//                 <ProgressBar percentage={submission.compliance_score ?? 0} />
//               </div>
//             </div>
//             <div className="mt-4">
//               <StatusBadge status={submission.status} />
//             </div>
//           </Section>

//           <Section title="Call Information">
//             <Field label="Call ID" value={submission.call_id} />
//             <Field label="Agent Name" value={submission.agent_name} />
//             <Field label="Call Type" value={submission.call_type.toUpperCase()} />
//             <Field
//               label="Call Duration"
//               value={`${Math.floor(submission.call_duration / 60)}m ${submission.call_duration % 60}s`}
//             />
//             <Field
//               label="Submitted"
//               value={new Date(submission.created_at).toLocaleString()}
//             />
//           </Section>

//           <Section title="Audio Details">
//             <Field label="Filename" value={submission.audio_filename || 'N/A'} />
//             <Field
//               label="File Size"
//               value={submission.audio_size ? `${(submission.audio_size / 1024 / 1024).toFixed(2)} MB` : 'N/A'}
//             />
//             <Field label="Audio URL" value={submission.audio_url || 'Pending'} isCopyable />
//           </Section>

//           {submission.notes && (
//             <Section title="Notes">
//               <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{submission.notes}</p>
//             </Section>
//           )}

//           {Array.isArray(submission.violations) && submission.violations.length > 0 && (
//             <Section title="Violations">
//               <div className="space-y-3">
//                 {submission.violations.map((violation, idx) => (
//                   <div
//                     key={idx}
//                     className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
//                   >
//                     <p className="font-semibold text-red-900 dark:text-red-300 text-sm">{violation.type}</p>
//                     <p className="text-red-700 dark:text-red-400 text-sm mt-1">{violation.description}</p>
//                     {violation.severity && (
//                       <p className="text-xs text-red-600 dark:text-red-500 mt-2 capitalize">
//                         Severity: {violation.severity}
//                       </p>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </Section>
//           )}

//           {submission.webhook_response && (
//             <Section title="Processing Details">
//               <Field
//                 label="Processing Time"
//                 value={submission.webhook_response.processing_time_ms
//                   ? `${submission.webhook_response.processing_time_ms}ms`
//                   : 'N/A'}
//               />
//               {submission.webhook_response.error && (
//                 <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
//                   <p className="text-sm font-semibold text-red-900 dark:text-red-300">Error</p>
//                   <p className="text-sm text-red-700 dark:text-red-400 mt-1">
//                     {submission.webhook_response.error}
//                   </p>
//                 </div>
//               )}
//             </Section>
//           )}
//         </div>
//       </motion.div>
//     </>
//   );
// };

// interface SectionProps {
//   title: string;
//   children: React.ReactNode;
// }

// const Section: React.FC<SectionProps> = ({ title, children }) => (
//   <div>
//     <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">{title}</h3>
//     <div className="space-y-3">{children}</div>
//   </div>
// );

// interface FieldProps {
//   label: string;
//   value: string;
//   isCopyable?: boolean;
// }

// const Field: React.FC<FieldProps> = ({ label, value, isCopyable }) => (
//   <div className="flex justify-between items-start gap-4">
//     <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{label}</span>
//     <span
//       className={`text-sm text-gray-900 dark:text-white text-right ${isCopyable ? 'cursor-pointer hover:text-blue-500' : ''}`}
//       title={isCopyable ? 'Click to copy' : undefined}
//       onClick={() => {
//         if (isCopyable) {
//           navigator.clipboard.writeText(value);
//         }
//       }}
//     >
//       {value}
//     </span>
//   </div>
// );



// import React, { useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { X } from 'lucide-react';
// import { AuditSubmission } from '../../types';
// import { StatusBadge } from '../ui/StatusBadge';
// import { ProgressBar } from '../ui/ProgressBar';

// interface AuditDetailDrawerProps {
//   submission: AuditSubmission;
//   onClose: () => void;
// }

// export const AuditDetailDrawer: React.FC<AuditDetailDrawerProps> = ({ submission, onClose }) => {
//   useEffect(() => {
//     const handleEsc = (e: KeyboardEvent) => {
//       if (e.key === 'Escape') onClose();
//     };
//     window.addEventListener('keydown', handleEsc);
//     return () => window.removeEventListener('keydown', handleEsc);
//   }, [onClose]);

//   const formatDuration = (seconds: number) => {
//     const m = Math.floor(seconds / 60);
//     const s = seconds % 60;
//     return `${m}m ${s}s`;
//   };

//   return (
//     <>
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         onClick={onClose}
//         className="fixed inset-0 bg-black/30 dark:bg-black/50 z-40"
//       />

//       <motion.div
//         initial={{ x: 400 }}
//         animate={{ x: 0 }}
//         exit={{ x: 400 }}
//         transition={{ type: 'spring', bounce: 0.1 }}
//         className="fixed right-0 top-0 h-full w-full md:w-96 bg-white dark:bg-slate-900 shadow-2xl z-50 overflow-y-auto"
//         role="dialog"
//         aria-modal="true"
//       >
//         <div className="sticky top-0 flex items-center justify-between p-6 bg-gradient-to-r from-blue-600 to-purple-700 dark:from-blue-900 dark:to-purple-900 text-white border-b border-gray-200 dark:border-gray-700">
//           <h2 className="text-xl font-bold">Audit Details</h2>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-white/20 rounded-lg transition-colors"
//             aria-label="Close drawer"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         <div className="p-6 space-y-6">
//           <Section title="Compliance Score">
//             <div className="flex items-center gap-4">
//               <div className="text-4xl font-bold text-gray-900 dark:text-white">
//                 {submission.compliance_score ?? '-'}
//                 {submission.compliance_score !== null && submission.compliance_score !== undefined && (
//                   <span className="text-xl text-gray-600 dark:text-gray-400">%</span>
//                 )}
//               </div>
//               <div className="flex-1">
//                 <ProgressBar percentage={submission.compliance_score ?? 0} />
//               </div>
//             </div>
//             <div className="mt-4">
//               <StatusBadge status={submission.status} />
//             </div>
//           </Section>

//           <Section title="Call Information">
//             <Field label="Email" value={submission.email ?? 'N/A'} />
//             <Field label="Call ID" value={submission.call_id ?? 'N/A'} />
//             <Field label="Agent Name" value={submission.analyst_name ?? 'N/A'} />
//             <Field label="Call Type" value={submission.call_type ? submission.call_type.toUpperCase() : 'N/A'} />
//             <Field label="Call Duration" value={formatDuration(submission.call_duration)} />
//             <Field label="Submitted" value={new Date(submission.created_at).toLocaleString()} />
//           </Section>

//           <Section title="Audio Details">
//             <Field label="Filename" value={submission.audio_filename || 'N/A'} />
//             <Field
//               label="File Size"
//               value={submission.audio_size ? `${(submission.audio_size / 1024 / 1024).toFixed(2)} MB` : 'N/A'}
//             />
//             <Field label="Audio URL" value={submission.audio_url || 'Pending'} isCopyable />
//           </Section>

//           {submission.notes && (
//             <Section title="Notes">
//               <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{submission.notes}</p>
//             </Section>
//           )}

//           {Array.isArray(submission.violations) && submission.violations.length > 0 && (
//             <Section title="Violations">
//               <div className="space-y-3">
//                 {submission.violations.map((violation, idx) => (
//                   <div
//                     key={idx}
//                     className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
//                   >
//                     <p className="font-semibold text-red-900 dark:text-red-300 text-sm">{violation.type}</p>
//                     <p className="text-red-700 dark:text-red-400 text-sm mt-1">{violation.description}</p>
//                     {violation.severity && (
//                       <p className="text-xs text-red-600 dark:text-red-500 mt-2 capitalize">
//                         Severity: {violation.severity}
//                       </p>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </Section>
//           )}

//           {Array.isArray(submission.spoken_evidence) && submission.spoken_evidence.length > 0 && (
//             <Section title="Flagged Phrases">
//               <div className="space-y-2">
//                 {submission.spoken_evidence.map((phrase, idx) => (
//                   <div
//                     key={idx}
//                     className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
//                   >
//                     <p className="text-sm font-mono text-yellow-900 dark:text-yellow-300">
//                       "{phrase}"
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </Section>
//           )}

//           {submission.transcript && (
//             <Section title="Full Transcript">
//               <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg max-h-48 overflow-y-auto">
//                 <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
//                   {submission.transcript}
//                 </p>
//               </div>
//               <button
//                 onClick={() => {
//                   if (submission.transcript) {
//                     navigator.clipboard.writeText(submission.transcript);
//                     // TODO: Add toast notification here
//                   }
//                 }}
//                 className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
//               >
//                 📋 Copy Transcript
//               </button>
//             </Section>
//           )}

//           {submission.observations && (
//             <Section title="AI Observations & Recommendations">
//               <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
//                 <p className="text-sm text-blue-900 dark:text-blue-300 whitespace-pre-wrap leading-relaxed">
//                   {submission.observations}
//                 </p>
//               </div>
//             </Section>
//           )}

//           {submission.audio_url && submission.status !== 'pending' && (
//             <Section title="Audio Playback">
//               <audio
//                 controls
//                 className="w-full h-10 rounded-lg"
//                 src={submission.audio_url}
//               >
//                 Your browser does not support audio playback.
//               </audio>
//             </Section>
//           )}

//           {submission.webhook_response && (
//             <Section title="Processing Details">
//               <Field
//                 label="Processing Time"
//                 value={
//                   submission.webhook_response.processing_time_ms
//                     ? `${submission.webhook_response.processing_time_ms}ms`
//                     : 'N/A'
//                 }
//               />
//               {submission.webhook_response.error && (
//                 <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
//                   <p className="text-sm font-semibold text-red-900 dark:text-red-300">Error</p>
//                   <p className="text-sm text-red-700 dark:text-red-400 mt-1">
//                     {submission.webhook_response.error}
//                   </p>
//                 </div>
//               )}
//             </Section>
//           )}
//         </div>
//       </motion.div>
//     </>
//   );
// };

// interface SectionProps {
//   title: string;
//   children: React.ReactNode;
// }

// const Section: React.FC<SectionProps> = ({ title, children }) => (
//   <div>
//     <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">{title}</h3>
//     <div className="space-y-3">{children}</div>
//   </div>
// );

// interface FieldProps {
//   label: string;
//   value: React.ReactNode;
//   isCopyable?: boolean;
// }

// const Field: React.FC<FieldProps> = ({ label, value, isCopyable }) => {
//   const handleCopy = () => {
//     if (isCopyable && typeof value === 'string') {
//       navigator.clipboard.writeText(value);
//       // Ideally replace with a toast/snackbar for better UX
//     }
//   };

//   return (
//     <div className="flex justify-between items-start gap-4">
//       <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{label}</span>
//       <span
//         className={`text-sm text-gray-900 dark:text-white text-right ${isCopyable ? 'cursor-pointer hover:text-blue-500' : ''}`}
//         title={isCopyable ? 'Click to copy' : undefined}
//         onClick={handleCopy}
//       >
//         {value}
//       </span>
//     </div>
//   );
// };


// import React, { useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { X } from 'lucide-react';
// import { AuditSubmission } from '../../types';
// import { StatusBadge } from '../ui/StatusBadge';
// import { ProgressBar } from '../ui/ProgressBar';

// interface AuditDetailDrawerProps {
//   submission: AuditSubmission;
//   onClose: () => void;
// }

// export const AuditDetailDrawer: React.FC<AuditDetailDrawerProps> = ({ submission, onClose }) => {
//   useEffect(() => {
//     const handleEsc = (e: KeyboardEvent) => {
//       if (e.key === 'Escape') onClose();
//     };
//     document.addEventListener('keydown', handleEsc);
//     return () => document.removeEventListener('keydown', handleEsc);
//   }, [onClose]);

//   return (
//     <>
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         onClick={onClose}
//         className="fixed inset-0 bg-black/30 dark:bg-black/50 z-40"
//       />

//       <motion.div
//         initial={{ x: 400 }}
//         animate={{ x: 0 }}
//         exit={{ x: 400 }}
//         transition={{ type: 'spring', bounce: 0.1 }}
//         className="fixed right-0 top-0 h-full w-full md:w-96 bg-white dark:bg-slate-900 shadow-2xl z-50 overflow-y-auto"
//       >
//         <div className="sticky top-0 flex items-center justify-between p-6 bg-gradient-to-r from-blue-600 to-purple-700 dark:from-blue-900 dark:to-purple-900 text-white border-b border-gray-200 dark:border-gray-700">
//           <h2 className="text-xl font-bold">Audit Details</h2>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-white/20 rounded-lg transition-colors"
//             aria-label="Close drawer"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         <div className="p-6 space-y-6">
//           <Section title="Compliance Score">
//             <div className="flex items-center gap-4">
//               <div className="text-4xl font-bold text-gray-900 dark:text-white">
//                 {submission.compliance_score ?? '-'}
//                 {submission.compliance_score !== null && <span className="text-xl text-gray-600 dark:text-gray-400">%</span>}
//               </div>
//               <div className="flex-1">
//                 <ProgressBar percentage={submission.compliance_score ?? 0} />
//               </div>
//             </div>
//             <div className="mt-4">
//               <StatusBadge status={submission.status} />
//             </div>
//           </Section>

//           <Section title="Call Information">
//             <Field label="Call ID" value={submission.call_id} />
//             <Field label="Agent Name" value={submission.agent_name} />
//             <Field label="Call Type" value={submission.call_type.toUpperCase()} />
//             <Field
//               label="Call Duration"
//               value={`${Math.floor(submission.call_duration / 60)}m ${submission.call_duration % 60}s`}
//             />
//             <Field
//               label="Submitted"
//               value={new Date(submission.created_at).toLocaleString()}
//             />
//           </Section>

//           <Section title="Audio Details">
//             <Field label="Filename" value={submission.audio_filename || 'N/A'} />
//             <Field
//               label="File Size"
//               value={submission.audio_size ? `${(submission.audio_size / 1024 / 1024).toFixed(2)} MB` : 'N/A'}
//             />
//             <Field label="Audio URL" value={submission.audio_url || 'Pending'} isCopyable />
//           </Section>

//           {submission.notes && (
//             <Section title="Notes">
//               <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{submission.notes}</p>
//             </Section>
//           )}

//           {Array.isArray(submission.violations) && submission.violations.length > 0 && (
//             <Section title="Violations">
//               <div className="space-y-3">
//                 {submission.violations.map((violation, idx) => (
//                   <div
//                     key={idx}
//                     className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
//                   >
//                     <p className="font-semibold text-red-900 dark:text-red-300 text-sm">{violation.type}</p>
//                     <p className="text-red-700 dark:text-red-400 text-sm mt-1">{violation.description}</p>
//                     {violation.severity && (
//                       <p className="text-xs text-red-600 dark:text-red-500 mt-2 capitalize">
//                         Severity: {violation.severity}
//                       </p>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </Section>
//           )}

//           {submission.webhook_response && (
//             <Section title="Processing Details">
//               <Field
//                 label="Processing Time"
//                 value={submission.webhook_response.processing_time_ms
//                   ? `${submission.webhook_response.processing_time_ms}ms`
//                   : 'N/A'}
//               />
//               {submission.webhook_response.error && (
//                 <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
//                   <p className="text-sm font-semibold text-red-900 dark:text-red-300">Error</p>
//                   <p className="text-sm text-red-700 dark:text-red-400 mt-1">
//                     {submission.webhook_response.error}
//                   </p>
//                 </div>
//               )}
//             </Section>
//           )}
//         </div>
//       </motion.div>
//     </>
//   );
// };

// interface SectionProps {
//   title: string;
//   children: React.ReactNode;
// }

// const Section: React.FC<SectionProps> = ({ title, children }) => (
//   <div>
//     <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">{title}</h3>
//     <div className="space-y-3">{children}</div>
//   </div>
// );

// interface FieldProps {
//   label: string;
//   value: string;
//   isCopyable?: boolean;
// }

// const Field: React.FC<FieldProps> = ({ label, value, isCopyable }) => (
//   <div className="flex justify-between items-start gap-4">
//     <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{label}</span>
//     <span
//       className={`text-sm text-gray-900 dark:text-white text-right ${isCopyable ? 'cursor-pointer hover:text-blue-500' : ''}`}
//       title={isCopyable ? 'Click to copy' : undefined}
//       onClick={() => {
//         if (isCopyable) {
//           navigator.clipboard.writeText(value);
//         }
//       }}
//     >
//       {value}
//     </span>
//   </div>
// );



// import React, { useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { X } from 'lucide-react';
// import { AuditSubmission } from '../../types';
// import { StatusBadge } from '../ui/StatusBadge';
// import { ProgressBar } from '../ui/ProgressBar';

// interface AuditDetailDrawerProps {
//   submission: AuditSubmission;
//   onClose: () => void;
// }

// export const AuditDetailDrawer: React.FC<AuditDetailDrawerProps> = ({ submission, onClose }) => {
//   useEffect(() => {
//     const handleEsc = (e: KeyboardEvent) => {
//       if (e.key === 'Escape') onClose();
//     };
//     window.addEventListener('keydown', handleEsc);
//     return () => window.removeEventListener('keydown', handleEsc);
//   }, [onClose]);

//   const formatDuration = (seconds: number) => {
//     const m = Math.floor(seconds / 60);
//     const s = seconds % 60;
//     return `${m}m ${s}s`;
//   };

//   return (
//     <>
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         onClick={onClose}
//         className="fixed inset-0 bg-black/30 dark:bg-black/50 z-40"
//       />

//       <motion.div
//         initial={{ x: 400 }}
//         animate={{ x: 0 }}
//         exit={{ x: 400 }}
//         transition={{ type: 'spring', bounce: 0.1 }}
//         className="fixed right-0 top-0 h-full w-full md:w-96 bg-white dark:bg-slate-900 shadow-2xl z-50 overflow-y-auto"
//         role="dialog"
//         aria-modal="true"
//       >
//         <div className="sticky top-0 flex items-center justify-between p-6 bg-gradient-to-r from-blue-600 to-purple-700 dark:from-blue-900 dark:to-purple-900 text-white border-b border-gray-200 dark:border-gray-700">
//           <h2 className="text-xl font-bold">Audit Details</h2>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-white/20 rounded-lg transition-colors"
//             aria-label="Close drawer"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         <div className="p-6 space-y-6">
//           <Section title="Compliance Score">
//             <div className="flex items-center gap-4">
//               <div className="text-4xl font-bold text-gray-900 dark:text-white">
//                 {submission.compliance_score ?? '-'}
//                 {submission.compliance_score !== null && submission.compliance_score !== undefined && (
//                   <span className="text-xl text-gray-600 dark:text-gray-400">%</span>
//                 )}
//               </div>
//               <div className="flex-1">
//                 <ProgressBar percentage={submission.compliance_score ?? 0} />
//               </div>
//             </div>
//             <div className="mt-4">
//               <StatusBadge status={submission.status} />
//             </div>
//           </Section>

//           <Section title="Call Information">
//             <Field label="Email" value={submission.email ?? 'N/A'} />
//             <Field label="Call ID" value={submission.call_id ?? 'N/A'} />
//             <Field label="Agent Name" value={submission.analyst_name ?? 'N/A'} />
//             <Field label="Call Type" value={submission.call_type ? submission.call_type.toUpperCase() : 'N/A'} />
//             <Field label="Call Duration" value={formatDuration(submission.call_duration)} />
//             <Field label="Submitted" value={new Date(submission.created_at).toLocaleString()} />
//           </Section>

//           <Section title="Audio Details">
//             <Field label="Filename" value={submission.audio_filename || 'N/A'} />
//             <Field
//               label="File Size"
//               value={submission.audio_size ? `${(submission.audio_size / 1024 / 1024).toFixed(2)} MB` : 'N/A'}
//             />
//             <Field label="Audio URL" value={submission.audio_url || 'Pending'} isCopyable />
//           </Section>

//           {submission.notes && (
//             <Section title="Notes">
//               <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{submission.notes}</p>
//             </Section>
//           )}

//           {Array.isArray(submission.violations) && submission.violations.length > 0 && (
//             <Section title="Violations">
//               <div className="space-y-3">
//                 {submission.violations.map((violation, idx) => (
//                   <div
//                     key={idx}
//                     className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
//                   >
//                     <p className="font-semibold text-red-900 dark:text-red-300 text-sm">{violation.type}</p>
//                     <p className="text-red-700 dark:text-red-400 text-sm mt-1">{violation.description}</p>
//                     {violation.severity && (
//                       <p className="text-xs text-red-600 dark:text-red-500 mt-2 capitalize">
//                         Severity: {violation.severity}
//                       </p>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </Section>
//           )}

//           {Array.isArray(submission.spoken_evidence) && submission.spoken_evidence.length > 0 && (
//             <Section title="Flagged Phrases">
//               <div className="space-y-2">
//                 {submission.spoken_evidence.map((phrase, idx) => (
//                   <div
//                     key={idx}
//                     className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
//                   >
//                     <p className="text-sm font-mono text-yellow-900 dark:text-yellow-300">
//                       "{phrase}"
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </Section>
//           )}

//           {submission.transcript && (
//             <Section title="Full Transcript">
//               <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg max-h-48 overflow-y-auto">
//                 <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
//                   {submission.transcript}
//                 </p>
//               </div>
//               <button
//                 onClick={() => {
//                   if (submission.transcript) {
//                     navigator.clipboard.writeText(submission.transcript);
//                     // TODO: Add toast notification here
//                   }
//                 }}
//                 className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
//               >
//                 📋 Copy Transcript
//               </button>
//             </Section>
//           )}

//           {submission.observations && (
//             <Section title="AI Observations & Recommendations">
//               <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
//                 <p className="text-sm text-blue-900 dark:text-blue-300 whitespace-pre-wrap leading-relaxed">
//                   {submission.observations}
//                 </p>
//               </div>
//             </Section>
//           )}

//           {submission.audio_url && submission.status !== 'pending' && (
//             <Section title="Audio Playback">
//               <audio
//                 controls
//                 className="w-full h-10 rounded-lg"
//                 src={submission.audio_url}
//               >
//                 Your browser does not support audio playback.
//               </audio>
//             </Section>
//           )}

//           {submission.webhook_response && (
//             <Section title="Processing Details">
//               <Field
//                 label="Processing Time"
//                 value={
//                   submission.webhook_response.processing_time_ms
//                     ? `${submission.webhook_response.processing_time_ms}ms`
//                     : 'N/A'
//                 }
//               />
//               {submission.webhook_response.error && (
//                 <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
//                   <p className="text-sm font-semibold text-red-900 dark:text-red-300">Error</p>
//                   <p className="text-sm text-red-700 dark:text-red-400 mt-1">
//                     {submission.webhook_response.error}
//                   </p>
//                 </div>
//               )}
//             </Section>
//           )}
//         </div>
//       </motion.div>
//     </>
//   );
// };

// interface SectionProps {
//   title: string;
//   children: React.ReactNode;
// }

// const Section: React.FC<SectionProps> = ({ title, children }) => (
//   <div>
//     <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">{title}</h3>
//     <div className="space-y-3">{children}</div>
//   </div>
// );

// interface FieldProps {
//   label: string;
//   value: React.ReactNode;
//   isCopyable?: boolean;
// }

// const Field: React.FC<FieldProps> = ({ label, value, isCopyable }) => {
//   const handleCopy = () => {
//     if (isCopyable && typeof value === 'string') {
//       navigator.clipboard.writeText(value);
//       // Ideally replace with a toast/snackbar for better UX
//     }
//   };

//   return (
//     <div className="flex justify-between items-start gap-4">
//       <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{label}</span>
//       <span
//         className={`text-sm text-gray-900 dark:text-white text-right ${isCopyable ? 'cursor-pointer hover:text-blue-500' : ''}`}
//         title={isCopyable ? 'Click to copy' : undefined}
//         onClick={handleCopy}
//       >
//         {value}
//       </span>
//     </div>
//   );
// };


import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { AuditSubmission } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { ProgressBar } from '../ui/ProgressBar';

interface AuditDetailDrawerProps {
  submission: AuditSubmission;
  onClose: () => void;
}

// ─── Helpers ────────────────────────────────────────────────

// Fixes "NaNm NaNs" — handles both "00:02:29" string and number seconds
function formatDuration(value: any): string {
  if (!value) return 'N/A';
  if (typeof value === 'string' && value.includes(':')) {
    // already formatted like "00:02:29" — just return as-is
    return value;
  }
  const n = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(n)) return 'N/A';
  const m = Math.floor(n / 60);
  const s = Math.floor(n % 60);
  return `${m}m ${s}s`;
}

// Convert "00:02:14" → seconds (134). Also handles MM:SS:00 format from n8n.
function timeToSeconds(t: string): number {
  const parts = t.trim().split(':').map(Number);
  if (parts.length === 3) {
    const [a, b, c] = parts;
    // detect MM:SS:00 format (e.g. 04:17:00 meaning 4min 17sec)
    // hours > 0, seconds = 0, hours value fits in minutes range
    if (a > 0 && a < 60 && c === 0) {
      return a * 60 + b;
    }
    return a * 3600 + b * 60 + c;
  }
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return 0;
}

type FlagColor = 'red' | 'orange' | 'yellow';

interface ParsedViolation {
  flagColor: FlagColor;
  title: string;
  evidence: string;
  ranges: Array<{ start: number; end: number }>;
}

// Parse violations string into structured array
function parseViolations(raw: any): ParsedViolation[] {
  if (!raw) return [];

  // handle already-parsed array
  if (Array.isArray(raw)) {
    return raw.map((v: any) => ({
      flagColor: (v.severity === 'high' ? 'red' : v.severity === 'medium' ? 'orange' : 'yellow') as FlagColor,
      title: v.description || v.type || '',
      evidence: v.evidence || '',
      ranges: [],
    })).filter((v: ParsedViolation) => v.title);
  }

  if (typeof raw !== 'string') return [];

  // handle double-stringified JSON (n8n wraps in extra quotes)
  let unwrapped = raw;
  try {
    const first = JSON.parse(unwrapped);
    if (typeof first === 'string') unwrapped = first; // was double-stringified
    else if (Array.isArray(first)) return parseViolations(first); // was JSON array
  } catch { /* not JSON, treat as plain text */ }

  // strip outer quotes + unescape ALL newline variants
  const text = unwrapped
    .replace(/^"|"$/g, '')
    .replace(/\\n/g, '\n')
    .replace(/\n/g, '\n')
    .trim();
  const blocks = text.split('-----------').filter((s: string) => s.trim());

  return blocks.map((block: string): ParsedViolation => {
    const lines = block.trim().split('\n').filter((l: string) => l.trim());
    const flagLine = lines[0] || '';

    const flagMatch = flagLine.match(/\[(Red|Orange|Yellow) Flag\]\s*(.+)/i);
    const flagColor: FlagColor = flagMatch
      ? (flagMatch[1].toLowerCase() as FlagColor)
      : 'yellow';
    const title = flagMatch ? flagMatch[2].trim() : flagLine.trim();

    const evidenceLine = lines.find((l: string) => l.startsWith('Evidence:')) || '';
    const evidence = evidenceLine.replace('Evidence:', '').trim();

    // extract all timestamp ranges e.g. 00:02:14–00:02:31 or single 00:11:52
    const tsPattern = /(\d{1,2}:\d{2}(?::\d{2})?)(?:[–\-](\d{1,2}:\d{2}(?::\d{2})?))?/g;
    const ranges: Array<{ start: number; end: number }> = [];
    let m: RegExpExecArray | null;
    while ((m = tsPattern.exec(evidence)) !== null) {
      const start = timeToSeconds(m[1]);
      const end = m[2] ? timeToSeconds(m[2]) : start + 20;
      ranges.push({ start, end });
    }

    return { flagColor, title, evidence, ranges };
  }).filter((v: ParsedViolation) => v.title);
}

interface RawLine {
  start: string;
  end: string;
  speaker: string;
  text: string;
}

function parseRawTranscript(transcript: string): RawLine[] {
  if (!transcript) return [];
  return transcript
    .split('\n')
    .filter(line => line.trim())
    .map(line => {
      const match = line.match(/^(Agent|BDA|Lead)\s*\[(\d{1,2}:\d{2}(?::\d{2})?)\]:\s*(.+)$/);
      if (!match) return null;
      return {
        speaker: match[1],
        start: match[2],
        end: match[2],
        text: match[3],
      };
    })
    .filter(Boolean) as RawLine[];
}
function getHighlight(startSec: number, violations: ParsedViolation[]): FlagColor | null {
  for (const v of violations) {
    for (const range of v.ranges) {
      if (startSec >= range.start - 1 && startSec <= range.end + 1) {
        return v.flagColor;
      }
    }
  }
  return null;
}

const FLAG_STYLES: Record<FlagColor, { bg: string; border: string; badge: string; text: string; line: string; bar: string }> = {
  red: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    badge: 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300',
    text: 'text-red-700 dark:text-red-300',
    line: 'bg-red-50 dark:bg-red-900/30',
    bar: 'border-l-red-500',
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    border: 'border-orange-200 dark:border-orange-800',
    badge: 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300',
    text: 'text-orange-700 dark:text-orange-300',
    line: 'bg-orange-50 dark:bg-orange-900/30',
    bar: 'border-l-orange-500',
  },
  yellow: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-200 dark:border-yellow-800',
    badge: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300',
    text: 'text-yellow-700 dark:text-yellow-300',
    line: 'bg-yellow-50 dark:bg-yellow-900/30',
    bar: 'border-l-yellow-500',
  },
};

const FLAG_EMOJI: Record<FlagColor, string> = {
  red: '🔴 Red Flag',
  orange: '🟠 Orange Flag',
  yellow: '🟡 Yellow Flag',
};

// ─── Main Component ──────────────────────────────────────────

export const AuditDetailDrawer: React.FC<AuditDetailDrawerProps> = ({ submission, onClose }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const violations = useMemo(() => {
    const raw = (submission as any).violations || (submission as any).spoken_evidence;
    return parseViolations(raw);
  }, [submission]);
  const rawLines = useMemo(() => parseRawTranscript((submission as any).transcript || ''), [submission]);

  const redCount    = violations.filter(v => v.flagColor === 'red').length;
  const orangeCount = violations.filter(v => v.flagColor === 'orange').length;
  const yellowCount = violations.filter(v => v.flagColor === 'yellow').length;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-40"
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: 520 }} animate={{ x: 0 }} exit={{ x: 520 }}
        transition={{ type: 'spring', bounce: 0.1 }}
        className="fixed right-0 top-0 h-full w-full md:w-[500px] bg-white dark:bg-slate-900 shadow-2xl z-50 overflow-y-auto"
        role="dialog" aria-modal="true"
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-5 bg-gradient-to-r from-blue-600 to-purple-700 text-white z-10 shadow-lg">
          <div>
            <h2 className="text-xl font-bold">Audit Details</h2>
            {submission.call_id && (
              <p className="text-xs text-white/70 mt-0.5">Call ID: {submission.call_id}</p>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-6">

          {/* Compliance Score */}
          <Section title="Compliance Score">
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold text-gray-900 dark:text-white">
                {submission.compliance_score ?? '—'}
                {submission.compliance_score != null && (
                  <span className="text-xl text-gray-400 dark:text-gray-500">%</span>
                )}
              </div>
              <div className="flex-1">
                <ProgressBar percentage={submission.compliance_score ?? 0} />
              </div>
            </div>
            <div className="mt-3">
              <StatusBadge status={submission.status} />
            </div>
          </Section>

          {/* Violation Summary Counters */}
          {violations.length > 0 && (
            <Section title="Violation Summary">
              <div className="flex gap-2">
                {redCount > 0 && (
                  <div className="flex-1 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">{redCount}</div>
                    <div className="text-xs text-red-500 font-semibold mt-0.5">🔴 Red</div>
                  </div>
                )}
                {orangeCount > 0 && (
                  <div className="flex-1 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{orangeCount}</div>
                    <div className="text-xs text-orange-500 font-semibold mt-0.5">🟠 Orange</div>
                  </div>
                )}
                {yellowCount > 0 && (
                  <div className="flex-1 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{yellowCount}</div>
                    <div className="text-xs text-yellow-500 font-semibold mt-0.5">🟡 Yellow</div>
                  </div>
                )}
              </div>
            </Section>
          )}

          {/* Violations List */}
          {violations.length > 0 && (
            <Section title="Violations">
              <div className="space-y-2">
                {violations.map((v, idx) => {
                  const s = FLAG_STYLES[v.flagColor];
                  return (
                    <div key={idx} className={`p-3 ${s.bg} border ${s.border} rounded-lg`}>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.badge}`}>
                        {FLAG_EMOJI[v.flagColor]}
                      </span>
                      <p className={`text-sm font-semibold ${s.text} mt-1.5`}>{v.title}</p>
                      {v.evidence && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                          {v.evidence}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </Section>
          )}
          {/* Selected Audit Parameters */}
          {((submission as any).selected_parameters?.length > 0) && (
            <Section title="Audit Parameters">
              <div className="flex flex-wrap gap-2">
                {((submission as any).selected_parameters as string[]).map((param: string) => (
                  <span
                    key={param}
                    className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700"
                  >
                    {param}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                {(submission as any).selected_parameters.length} parameter{(submission as any).selected_parameters.length > 1 ? 's' : ''} sent for AI scoring
              </p>
            </Section>
          )}
          {/* Call Information */}
          <Section title="Call Information">
            <Field label="Email"         value={submission.email ?? 'N/A'} />
            <Field label="Call ID"       value={submission.call_id ?? 'N/A'} />
            <Field label="Analyst Name"  value={submission.analyst_name ?? 'N/A'} />
            <Field label="Call Type"     value={submission.call_type ? submission.call_type.toUpperCase() : 'N/A'} />
            <Field label="Call Duration" value={formatDuration(submission.call_duration)} />
            <Field label="Submitted"     value={new Date(submission.created_at).toLocaleString()} />
          </Section>

          {/* Audio Details */}
          <Section title="Audio Details">
            {/* <Field label="Filename"  value={submission.audio_filename || 'N/A'} /> */}
            {/* <Field label="File Size" value={submission.audio_size ? `${(submission.audio_size / 1024 / 1024).toFixed(2)} MB` : 'N/A'} /> */}
            <Field label="Audio URL" value={submission.audio_url || 'Pending'} isCopyable />
          </Section>

          {/* Notes */}
          {submission.notes && (
            <Section title="Notes">
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{submission.notes}</p>
            </Section>
          )}

          {/* Audio Playback */}
          {submission.audio_url && submission.status !== 'pending' && (
            <Section title="Audio Playback">
              <audio controls className="w-full rounded-lg" src={submission.audio_url}>
                Your browser does not support audio playback.
              </audio>
            </Section>
          )}

          {/* Full Transcript — highlighted using raw_transcript */}
          {rawLines.length > 0 ? (
            <Section title="Full Transcript">
              {violations.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-red-200 dark:bg-red-800 inline-block" />
                    Red Flag
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-orange-200 dark:bg-orange-800 inline-block" />
                    Orange Flag
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-yellow-200 dark:bg-yellow-800 inline-block" />
                    Yellow Flag
                  </span>
                </div>
              )}
              <div className="bg-gray-100 dark:bg-gray-800 rounded-xl max-h-72 overflow-y-auto p-3 space-y-0.5">
                {rawLines.map((line, idx) => {
                  const startSec  = timeToSeconds(line.start);
                  const highlight = getHighlight(startSec, violations);
                  const s         = highlight ? FLAG_STYLES[highlight] : null;

                  return (
                    <div
                      key={idx}
                      className={`px-2 py-0.5 rounded text-xs leading-relaxed ${
                        s ? `${s.line} border-l-2 ${s.bar}` : ''
                      }`}
                    >
                      <span className="text-gray-400 dark:text-gray-500 font-mono mr-1.5">
                        [{line.start}]
                      </span>
                      <span className={`font-semibold mr-1 ${
                        line.speaker === 'Agent' || line.speaker === 'BDA'
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-green-600 dark:text-green-400'
                      }`}>
                        {line.speaker}:
                      </span>
                      <span className={s ? s.text : 'text-gray-700 dark:text-gray-300'}>
                        {line.text}
                      </span>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => {
                  const text = rawLines.map(l => `[${l.start}] ${l.speaker}: ${l.text}`).join('\n');
                  navigator.clipboard.writeText(text);
                }}
                className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                📋 Copy Transcript
              </button>
            </Section>

          ) : submission.transcript ? (
            // Fallback: plain transcript if raw_transcript not available
            <Section title="Full Transcript">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl max-h-64 overflow-y-auto">
                <p className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {submission.transcript}
                </p>
              </div>
              <button
                onClick={() => submission.transcript && navigator.clipboard.writeText(submission.transcript)}
                className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                📋 Copy Transcript
              </button>
            </Section>
          ) : null}

          {/* AI Observations */}
          {submission.observations && (
            <Section title="AI Observations">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-900 dark:text-blue-300 whitespace-pre-wrap leading-relaxed">
                  {submission.observations}
                </p>
              </div>
            </Section>
          )}

        </div>
      </motion.div>
    </>
  );
};

// ─── Sub-components ──────────────────────────────────────────

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3 border-b border-gray-100 dark:border-gray-800 pb-1">
      {title}
    </h3>
    <div className="space-y-2">{children}</div>
  </div>
);

const Field: React.FC<{ label: string; value: React.ReactNode; isCopyable?: boolean }> = ({ label, value, isCopyable }) => (
  <div className="flex justify-between items-start gap-4">
    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 flex-shrink-0">{label}</span>
    <span
      className={`text-sm text-gray-900 dark:text-white text-right break-all ${isCopyable ? 'cursor-pointer hover:text-blue-500' : ''}`}
      onClick={() => { if (isCopyable && typeof value === 'string') navigator.clipboard.writeText(value); }}
    >
      {value}
    </span>
  </div>
);