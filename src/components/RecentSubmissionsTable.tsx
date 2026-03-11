// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { GlassmorphismCard } from './ui/GlassmorphismCard';
// import { StatusBadge } from './ui/StatusBadge';
// import { ProgressBar } from './ui/ProgressBar';
// import { SkeletonLoader } from './ui/SkeletonLoader';
// import { EmptyState } from './ui/EmptyState';
// import { useAuditData } from '../hooks/useAuditData';
// import { AuditSubmission } from '../types';
// import { FileText } from 'lucide-react';

// interface RecentSubmissionsTableProps {
//   refreshTrigger?: number;
// }

// export const RecentSubmissionsTable: React.FC<RecentSubmissionsTableProps> = ({ refreshTrigger = 0 }) => {
//   const { submissions, isLoading, fetchSubmissions } = useAuditData();
//   const [expandedId, setExpandedId] = useState<string | null>(null);
//   const recentSubmissions = submissions.slice(0, 10);

//   useEffect(() => {
//     if (refreshTrigger > 0) {
//       fetchSubmissions();
//     }
//   }, [refreshTrigger, fetchSubmissions]);

//   if (isLoading) {
//     return (
//       <GlassmorphismCard className="p-6 md:p-8">
//         <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Submissions</h3>
//         <div className="space-y-4">
//           {Array.from({ length: 5 }).map((_, i) => (
//             <SkeletonLoader key={i} type="table-row" />
//           ))}
//         </div>
//       </GlassmorphismCard>
//     );
//   }

//   if (recentSubmissions.length === 0) {
//     return (
//       <GlassmorphismCard className="p-6 md:p-8">
//         <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Submissions</h3>
//         <EmptyState
//           icon={FileText}
//           title="No submissions yet"
//           description="Submit your first call audit to see it appear here"
//         />
//       </GlassmorphismCard>
//     );
//   }

//   return (
//     <GlassmorphismCard className="overflow-hidden">
//       <div className="p-6 md:p-8">
//         <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Submissions</h3>

//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-gray-200 dark:border-gray-700">
//                 <th className="text-left py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">Call ID</th>
//                 <th className="text-left py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">Analyst</th>
//                 <th className="text-left py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">Email</th>
//                 <th className="text-left py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">Type</th>
//                 <th className="text-left py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">Status</th>
//                 <th className="text-left py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">Score</th>
//                 <th className="text-left py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               <AnimatePresence>
//                 {recentSubmissions.map((submission, index) => (
//                   <React.Fragment key={submission.id}>
//                     <motion.tr
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       exit={{ opacity: 0 }}
//                       transition={{ delay: index * 0.05 }}
//                       onClick={() => setExpandedId(expandedId === submission.id ? null : submission.id)}
//                       className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
//                     >
//                       <td className="py-4 px-4 text-sm font-medium text-gray-900 dark:text-white">
//                         {submission.call_id || <span className="text-gray-400">—</span>}
//                       </td>
//                       <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
//                         {submission.analyst_name || <span className="text-gray-400">—</span>}
//                       </td>
//                       <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
//                         {submission.email || <span className="text-gray-400">—</span>}
//                       </td>
//                       <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400 capitalize">
//                         {submission.call_type}
//                       </td>
//                       <td className="py-4 px-4 text-sm">
//                         <StatusBadge status={submission.status} />
//                       </td>
//                       <td className="py-4 px-4 text-sm">
//                         {submission.compliance_score !== null && submission.compliance_score !== undefined ? (
//                           <ProgressBar percentage={submission.compliance_score} showLabel={true} size="sm" />
//                         ) : (
//                           <span className="text-gray-400">-</span>
//                         )}
//                       </td>
//                       <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
//                         {new Date(submission.created_at).toLocaleDateString()}
//                       </td>
//                     </motion.tr>

//                     <AnimatePresence>
//                       {expandedId === submission.id && (
//                         <motion.tr
//                           initial={{ opacity: 0, height: 0 }}
//                           animate={{ opacity: 1, height: 'auto' }}
//                           exit={{ opacity: 0, height: 0 }}
//                           transition={{ duration: 0.3 }}
//                           className="bg-gray-50 dark:bg-gray-800/30 border-b border-gray-200 dark:border-gray-700"
//                         >
//                           <td colSpan={7} className="p-6">
//                             <ExpandedDetails submission={submission} />
//                           </td>
//                         </motion.tr>
//                       )}
//                     </AnimatePresence>
//                   </React.Fragment>
//                 ))}
//               </AnimatePresence>
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </GlassmorphismCard>
//   );
// };

// interface ExpandedDetailsProps {
//   submission: AuditSubmission;
// }

// const ExpandedDetails: React.FC<ExpandedDetailsProps> = ({ submission }) => {
//   return (
//     <div className="space-y-4">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <div>
//           <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Email</label>
//           <p className="text-sm text-gray-900 dark:text-white mt-1">{submission.email || 'N/A'}</p>
//         </div>
//         <div>
//           <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Call Duration</label>
//           <p className="text-sm text-gray-900 dark:text-white mt-1">{submission.call_duration} seconds</p>
//         </div>
//         <div>
//           <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Audio File</label>
//           <p className="text-sm text-gray-900 dark:text-white mt-1">{submission.audio_filename || 'N/A'}</p>
//         </div>
//       </div>

//       {submission.notes && (
//         <div>
//           <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Notes</label>
//           <p className="text-sm text-gray-900 dark:text-white mt-1">{submission.notes}</p>
//         </div>
//       )}

//       {Array.isArray(submission.violations) && submission.violations.length > 0 && (
//         <div>
//           <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Violations</label>
//           <div className="mt-2 space-y-2">
//             {submission.violations.map((violation, idx) => (
//               <div key={idx} className="text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
//                 <p className="font-medium text-red-900 dark:text-red-300">{violation.type}</p>
//                 <p className="text-red-700 dark:text-red-400">{violation.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {submission.webhook_response && (
//         <div>
//           <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Processing Time</label>
//           <p className="text-sm text-gray-900 dark:text-white mt-1">
//             {submission.webhook_response.processing_time_ms
//               ? `${submission.webhook_response.processing_time_ms}ms`
//               : 'N/A'}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };


import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassmorphismCard } from './ui/GlassmorphismCard';
import { StatusBadge } from './ui/StatusBadge';
import { ProgressBar } from './ui/ProgressBar';
import { SkeletonLoader } from './ui/SkeletonLoader';
import { EmptyState } from './ui/EmptyState';
import { RowProgressRing } from './ui/RowProgressRing';
import { useAuditData } from '../hooks/useAuditData';
import { AuditSubmission } from '../types';
import { FileText } from 'lucide-react';

interface RecentSubmissionsTableProps {
  refreshTrigger?: number;
  newSubmissionId?: string | null; // passed from parent after submit
}

export const RecentSubmissionsTable: React.FC<RecentSubmissionsTableProps> = ({
  refreshTrigger = 0,
  newSubmissionId,
}) => {
  const { submissions, isLoading, fetchSubmissions } = useAuditData();
  const [expandedId, setExpandedId]       = useState<string | null>(null);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const recentSubmissions = submissions.slice(0, 10);

  // Track newly submitted ID
  useEffect(() => {
    if (!newSubmissionId) return;
    setProcessingIds(prev => new Set([...prev, newSubmissionId]));
  }, [newSubmissionId]);

  // When realtime updates a row to non-pending, let ring play done animation then remove
  useEffect(() => {
    processingIds.forEach(id => {
      const sub = submissions.find(s => s.id === id);
      if (sub && sub.status !== 'pending' && sub.status !== 'processing') {
        setTimeout(() => {
          setProcessingIds(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        }, 3000);
      }
    });
  }, [submissions, processingIds]);

  useEffect(() => {
    if (refreshTrigger > 0) fetchSubmissions();
  }, [refreshTrigger, fetchSubmissions]);

  if (isLoading) {
    return (
      <GlassmorphismCard className="p-6 md:p-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Submissions</h3>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => <SkeletonLoader key={i} type="table-row" />)}
        </div>
      </GlassmorphismCard>
    );
  }

  if (recentSubmissions.length === 0) {
    return (
      <GlassmorphismCard className="p-6 md:p-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Submissions</h3>
        <EmptyState
          icon={FileText}
          title="No submissions yet"
          description="Submit your first call audit to see it appear here"
        />
      </GlassmorphismCard>
    );
  }

  return (
    <GlassmorphismCard className="overflow-hidden">
      <div className="p-6 md:p-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Submissions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">Call ID</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">Analyst</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">Email</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">Type</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">Score</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">Date</th>
                <th className="py-4 px-4 w-10" />
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {recentSubmissions.map((submission, index) => (
                  <React.Fragment key={submission.id}>
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setExpandedId(expandedId === submission.id ? null : submission.id)}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                    >
                      <td className="py-4 px-4 text-sm font-medium text-gray-900 dark:text-white">
                        {submission.call_id || <span className="text-gray-400">—</span>}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                        {submission.analyst_name || <span className="text-gray-400">—</span>}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                        {submission.email || <span className="text-gray-400">—</span>}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {submission.call_type}
                      </td>
                      <td className="py-4 px-4 text-sm">
                        <StatusBadge status={submission.status} />
                      </td>
                      <td className="py-4 px-4 text-sm">
                        {submission.compliance_score !== null && submission.compliance_score !== undefined ? (
                          <ProgressBar percentage={submission.compliance_score} showLabel size="sm" />
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(submission.created_at).toLocaleDateString()}
                      </td>
                      {/* Ring column — stops row click propagation */}
                      <td className="py-4 px-4" onClick={e => e.stopPropagation()}>
                        <RowProgressRing
                          submissionId={submission.id}
                          status={submission.status}
                          processingIds={processingIds}
                        />
                      </td>
                    </motion.tr>

                    <AnimatePresence>
                      {expandedId === submission.id && (
                        <motion.tr
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-gray-50 dark:bg-gray-800/30 border-b border-gray-200 dark:border-gray-700"
                        >
                          <td colSpan={8} className="p-6">
                            <ExpandedDetails submission={submission} />
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </GlassmorphismCard>
  );
};

const ExpandedDetails: React.FC<{ submission: AuditSubmission }> = ({ submission }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Email</label>
        <p className="text-sm text-gray-900 dark:text-white mt-1">{submission.email || 'N/A'}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Call Duration</label>
        <p className="text-sm text-gray-900 dark:text-white mt-1">{submission.call_duration || 'N/A'}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Audio File</label>
        <p className="text-sm text-gray-900 dark:text-white mt-1">{submission.audio_filename || 'N/A'}</p>
      </div>
    </div>

    {submission.notes && (
      <div>
        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Notes</label>
        <p className="text-sm text-gray-900 dark:text-white mt-1">{submission.notes}</p>
      </div>
    )}

    {Array.isArray(submission.violations) && submission.violations.length > 0 && (
      <div>
        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Violations</label>
        <div className="mt-2 space-y-2">
          {submission.violations.map((violation, idx) => (
            <div key={idx} className="text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              <p className="font-medium text-red-900 dark:text-red-300">{violation.type}</p>
              <p className="text-red-700 dark:text-red-400">{violation.description}</p>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

