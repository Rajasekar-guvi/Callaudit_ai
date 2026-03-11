// import React, { useState, useMemo } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Search, ChevronDown, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
// import { GlassmorphismCard } from '../ui/GlassmorphismCard';
// import { StatusBadge } from '../ui/StatusBadge';
// import { ProgressBar } from '../ui/ProgressBar';
// import { SkeletonLoader } from '../ui/SkeletonLoader';
// import { EmptyState } from '../ui/EmptyState';
// import { useAuditData } from '../../hooks/useAuditData';
// import { AuditSubmission, AuditStatus } from '../../types';
// import { AuditDetailDrawer } from './AuditDetailDrawer';
// import { FileText } from 'lucide-react';

// type SortField = 'call_id' | 'analyst_name' | 'email' | 'call_type' | 'status' | 'compliance_score' | 'created_at';
// type SortOrder = 'asc' | 'desc';

// const PAGE_SIZE = 10;

// export const AuditTable: React.FC = () => {
//   const { submissions = [], isLoading } = useAuditData();
//   const [searchTerm, setSearchTerm]     = useState('');
//   const [statusFilter, setStatusFilter] = useState<AuditStatus | 'all'>('all');
//   const [agentFilter, setAgentFilter]   = useState<string>('all');
//   const [sortField, setSortField]       = useState<SortField>('created_at');
//   const [sortOrder, setSortOrder]       = useState<SortOrder>('desc');
//   const [selectedSubmission, setSelectedSubmission] = useState<AuditSubmission | null>(null);
//   const [currentPage, setCurrentPage]   = useState(1);

//   const agents = useMemo(
//     () => ['all', ...new Set(submissions.map((s) => s.analyst_name ?? '').filter(Boolean))],
//     [submissions]
//   );

//   const filteredAndSorted = useMemo(() => {
//     const filtered = submissions.filter((s) => {
//       const matchesSearch =
//         s.call_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         s.analyst_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         s.email?.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
//       const matchesAgent  = agentFilter  === 'all' || s.analyst_name === agentFilter;
//       return matchesSearch && matchesStatus && matchesAgent;
//     });

//     return filtered.sort((a, b) => {
//       const aVal = a[sortField];
//       const bVal = b[sortField];
//       if (aVal == null) return 1;
//       if (bVal == null) return -1;
//       const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
//       return sortOrder === 'asc' ? cmp : -cmp;
//     });
//   }, [submissions, searchTerm, statusFilter, agentFilter, sortField, sortOrder]);

//   // Reset to page 1 when filters change
//   const totalPages  = Math.max(1, Math.ceil(filteredAndSorted.length / PAGE_SIZE));
//   const safePage    = Math.min(currentPage, totalPages);
//   const pageStart   = (safePage - 1) * PAGE_SIZE;
//   const pageData    = filteredAndSorted.slice(pageStart, pageStart + PAGE_SIZE);

//   const handleSort = (field: SortField) => {
//     if (sortField === field) {
//       setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortField(field);
//       setSortOrder('asc');
//     }
//     setCurrentPage(1);
//   };

//   const handleFilterChange = (cb: () => void) => { cb(); setCurrentPage(1); };

//   if (isLoading) {
//     return (
//       <GlassmorphismCard className="p-6 md:p-8">
//         <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">All Audits</h3>
//         <div className="space-y-4">
//           {Array.from({ length: 5 }).map((_, i) => <SkeletonLoader key={i} type="table-row" />)}
//         </div>
//       </GlassmorphismCard>
//     );
//   }

//   if (submissions.length === 0) {
//     return (
//       <GlassmorphismCard className="p-6 md:p-8">
//         <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">All Audits</h3>
//         <EmptyState icon={FileText} title="No audits yet" description="Submit your first call audit to see it appear here" />
//       </GlassmorphismCard>
//     );
//   }

//   return (
//     <>
//       <GlassmorphismCard className="p-6 md:p-8">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-6">
//           <h3 className="text-xl font-bold text-gray-900 dark:text-white">All Audits</h3>
//           <span className="text-sm text-gray-500 dark:text-gray-400">
//             {filteredAndSorted.length} record{filteredAndSorted.length !== 1 ? 's' : ''}
//           </span>
//         </div>

//         {/* Filters */}
//         <div className="mb-6 space-y-4 md:flex md:gap-4 md:space-y-0">
//           <div className="flex-1 relative">
//             <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search by Call ID, Agent or Email..."
//               value={searchTerm}
//               onChange={(e) => handleFilterChange(() => setSearchTerm(e.target.value))}
//               className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
//             />
//           </div>

//           <select
//             value={statusFilter}
//             onChange={(e) => handleFilterChange(() => setStatusFilter(e.target.value as AuditStatus | 'all'))}
//             title="Filter by status"
//             aria-label="Filter by status"
//             className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
//           >
//             <option value="all">All Status</option>
//             <option value="pending">Pending</option>
//             <option value="passed">Passed</option>
//             <option value="failed">Failed</option>
//             <option value="flagged">Flagged</option>
//           </select>

//           <select
//             value={agentFilter}
//             onChange={(e) => handleFilterChange(() => setAgentFilter(e.target.value))}
//             title="Filter by agent"
//             aria-label="Filter by agent"
//             className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
//           >
//             <option value="all">All Agents</option>
//             {agents.filter((a) => a !== 'all').map((agent) => (
//               <option key={agent} value={agent}>{agent}</option>
//             ))}
//           </select>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="border-b border-gray-200 dark:border-gray-700">
//                 {([
//                   { label: 'Call ID',  field: 'call_id' },
//                   { label: 'Email',    field: 'email' },
//                   { label: 'Analyst',  field: 'analyst_name' },
//                   { label: 'Type',     field: 'call_type' },
//                   { label: 'Status',   field: 'status' },
//                   { label: 'Score',    field: 'compliance_score' },
//                   { label: 'Date',     field: 'created_at' },
//                   { label: '',         field: null },
//                 ] as { label: string; field: SortField | null }[]).map((col) => (
//                   <th
//                     key={col.field ?? 'action'}
//                     onClick={() => col.field && handleSort(col.field)}
//                     className={`text-left py-4 px-4 font-semibold text-gray-700 dark:text-gray-300 ${
//                       col.field ? 'cursor-pointer hover:text-gray-900 dark:hover:text-white select-none' : ''
//                     }`}
//                   >
//                     <div className="flex items-center gap-1">
//                       {col.label}
//                       {col.field && sortField === col.field && (
//                         <ChevronDown className={`w-4 h-4 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
//                       )}
//                     </div>
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               <AnimatePresence mode="wait">
//                 {pageData.map((submission, index) => (
//                   <motion.tr
//                     key={submission.id}
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     transition={{ delay: index * 0.02 }}
//                     className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
//                   >
//                     <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">
//                       {submission.call_id || <span className="text-gray-400">—</span>}
//                     </td>
//                     <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
//                       {submission.email || <span className="text-gray-400">—</span>}
//                     </td>
//                     <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
//                       {submission.analyst_name || <span className="text-gray-400">—</span>}
//                     </td>
//                     <td className="py-4 px-4 text-gray-600 dark:text-gray-400 capitalize">{submission.call_type}</td>
//                     <td className="py-4 px-4"><StatusBadge status={submission.status} /></td>
//                     <td className="py-4 px-4">
//                       {submission.compliance_score != null ? (
//                         <ProgressBar percentage={submission.compliance_score} showLabel size="sm" />
//                       ) : (
//                         <span className="text-gray-400">-</span>
//                       )}
//                     </td>
//                     <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
//                       {new Date(submission.created_at).toLocaleDateString()}
//                     </td>
//                     <td className="py-4 px-4">
//                       <button
//                         onClick={() => setSelectedSubmission(submission)}
//                         className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm font-medium"
//                       >
//                         <Eye className="w-4 h-4" />
//                         View
//                       </button>
//                     </td>
//                   </motion.tr>
//                 ))}
//               </AnimatePresence>
//             </tbody>
//           </table>
//         </div>

//         {filteredAndSorted.length === 0 && (
//           <div className="text-center py-12">
//             <p className="text-gray-500 dark:text-gray-400">No audits match your filters</p>
//           </div>
//         )}

//         {/* Pagination */}
//         {filteredAndSorted.length > PAGE_SIZE && (
//           <div className="mt-6 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
//             <p className="text-sm text-gray-500 dark:text-gray-400">
//               Showing {pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, filteredAndSorted.length)} of {filteredAndSorted.length}
//             </p>

//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//                 title="Previous page"
//                 aria-label="Previous page"
//                 disabled={safePage === 1}
//                 className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
//               >
//                 <ChevronLeft className="w-4 h-4" />
//               </button>

//               {Array.from({ length: totalPages }, (_, i) => i + 1)
//                 .filter(p => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
//                 .reduce<(number | '...')[]>((acc, p, i, arr) => {
//                   if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('...');
//                   acc.push(p);
//                   return acc;
//                 }, [])
//                 .map((p, i) =>
//                   p === '...' ? (
//                     <span key={`ellipsis-${i}`} className="px-2 text-gray-400">…</span>
//                   ) : (
//                     <button
//                       key={p}
//                       onClick={() => setCurrentPage(p as number)}
//                       className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
//                         safePage === p
//                           ? 'bg-blue-600 text-white'
//                           : 'border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
//                       }`}
//                     >
//                       {p}
//                     </button>
//                   )
//                 )}

//               <button
//                 onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
//                 title="Next page"
//                 aria-label="Next page"
//                 disabled={safePage === totalPages}
//                 className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
//               >
//                 <ChevronRight className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         )}
//       </GlassmorphismCard>

//       <AnimatePresence>
//         {selectedSubmission && (
//           <AuditDetailDrawer
//             submission={selectedSubmission}
//             onClose={() => setSelectedSubmission(null)}
//           />
//         )}
//       </AnimatePresence>
//     </>
//   );
// }



import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, Eye, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { GlassmorphismCard } from '../ui/GlassmorphismCard';
import { StatusBadge } from '../ui/StatusBadge';
import { ProgressBar } from '../ui/ProgressBar';
import { SkeletonLoader } from '../ui/SkeletonLoader';
import { EmptyState } from '../ui/EmptyState';
import { useAuditData } from '../../hooks/useAuditData';
import { useWebhookSubmit } from '../../hooks/useWebhookSubmit';
import { AuditSubmission, AuditStatus } from '../../types';
import { AuditDetailDrawer } from './AuditDetailDrawer';
import { FileText } from 'lucide-react';

type SortField = 'call_id' | 'analyst_name' | 'email' | 'call_type' | 'status' | 'compliance_score' | 'created_at';
type SortOrder = 'asc' | 'desc';

const PAGE_SIZE = 10;

// Show retry when webhook failed or n8n returned error
const shouldShowRetry = (submission: AuditSubmission): boolean => {
  const hasRealError =
    submission.error_message &&
    submission.error_message !== 'null' &&
    submission.error_message !== '';
  return (
    (submission.status === 'pending' && (submission as any).webhook_sent === false) ||
    (submission.status === 'failed' && !!hasRealError)
  );
};

const RetryButton: React.FC<{ submission: AuditSubmission; onRetried: () => void }> = ({
  submission, onRetried,
}) => {
  const { retry } = useWebhookSubmit();
  const [retrying, setRetrying] = useState(false);

  const handleRetry = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setRetrying(true);
    try {
      await retry(submission);
      onRetried();
    } finally {
      setRetrying(false);
    }
  };

  return (
    <button
      onClick={handleRetry}
      disabled={retrying}
      title="Retry submission"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
      style={{
        background: retrying ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
        color: retrying ? '#10b981' : '#f87171',
        border: `1px solid ${retrying ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
      }}
    >
      <RefreshCw className={`w-3.5 h-3.5 ${retrying ? 'animate-spin' : ''}`} />
      {retrying ? 'Retrying...' : 'Retry'}
    </button>
  );
};

export const AuditTable: React.FC = () => {
  const { submissions = [], isLoading, fetchSubmissions } = useAuditData();
  const [searchTerm, setSearchTerm]     = useState('');
  const [statusFilter, setStatusFilter] = useState<AuditStatus | 'all'>('all');
  const [agentFilter, setAgentFilter]   = useState<string>('all');
  const [sortField, setSortField]       = useState<SortField>('created_at');
  const [sortOrder, setSortOrder]       = useState<SortOrder>('desc');
  const [selectedSubmission, setSelectedSubmission] = useState<AuditSubmission | null>(null);
  const [currentPage, setCurrentPage]   = useState(1);

  const agents = useMemo(
    () => ['all', ...new Set(submissions.map((s) => s.analyst_name ?? '').filter(Boolean))],
    [submissions]
  );

  const filteredAndSorted = useMemo(() => {
    const filtered = submissions.filter((s) => {
      const matchesSearch =
        s.call_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.analyst_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
      const matchesAgent  = agentFilter  === 'all' || s.analyst_name === agentFilter;
      return matchesSearch && matchesStatus && matchesAgent;
    });

    return filtered.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortOrder === 'asc' ? cmp : -cmp;
    });
  }, [submissions, searchTerm, statusFilter, agentFilter, sortField, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / PAGE_SIZE));
  const safePage   = Math.min(currentPage, totalPages);
  const pageStart  = (safePage - 1) * PAGE_SIZE;
  const pageData   = filteredAndSorted.slice(pageStart, pageStart + PAGE_SIZE);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortOrder('asc'); }
    setCurrentPage(1);
  };

  const handleFilterChange = (cb: () => void) => { cb(); setCurrentPage(1); };

  if (isLoading) {
    return (
      <GlassmorphismCard className="p-6 md:p-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">All Audits</h3>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => <SkeletonLoader key={i} type="table-row" />)}
        </div>
      </GlassmorphismCard>
    );
  }

  if (submissions.length === 0) {
    return (
      <GlassmorphismCard className="p-6 md:p-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">All Audits</h3>
        <EmptyState icon={FileText} title="No audits yet" description="Submit your first call audit to see it appear here" />
      </GlassmorphismCard>
    );
  }

  return (
    <>
      <GlassmorphismCard className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">All Audits</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filteredAndSorted.length} record{filteredAndSorted.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4 md:flex md:gap-4 md:space-y-0">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Call ID, Agent or Email..."
              value={searchTerm}
              onChange={(e) => handleFilterChange(() => setSearchTerm(e.target.value))}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => handleFilterChange(() => setStatusFilter(e.target.value as AuditStatus | 'all'))}
            title="Filter by status"
            aria-label="Filter by status"
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="passed">Passed</option>
            <option value="failed">Failed</option>
            <option value="flagged">Flagged</option>
          </select>

          <select
            value={agentFilter}
            onChange={(e) => handleFilterChange(() => setAgentFilter(e.target.value))}
            title="Filter by agent"
            aria-label="Filter by agent"
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Agents</option>
            {agents.filter((a) => a !== 'all').map((agent) => (
              <option key={agent} value={agent}>{agent}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                {([
                  { label: 'Call ID',  field: 'call_id' },
                  { label: 'Email',    field: 'email' },
                  { label: 'Analyst',  field: 'analyst_name' },
                  { label: 'Type',     field: 'call_type' },
                  { label: 'Status',   field: 'status' },
                  { label: 'Score',    field: 'compliance_score' },
                  { label: 'Date',     field: 'created_at' },
                  { label: '',         field: null },
                ] as { label: string; field: SortField | null }[]).map((col) => (
                  <th
                    key={col.field ?? 'action'}
                    onClick={() => col.field && handleSort(col.field)}
                    className={`text-left py-4 px-4 font-semibold text-gray-700 dark:text-gray-300 ${
                      col.field ? 'cursor-pointer hover:text-gray-900 dark:hover:text-white select-none' : ''
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {col.field && sortField === col.field && (
                        <ChevronDown className={`w-4 h-4 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="wait">
                {pageData.map((submission, index) => (
                  <motion.tr
                    key={submission.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">
                      {submission.call_id || <span className="text-gray-400">—</span>}
                    </td>
                    <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                      {submission.email || <span className="text-gray-400">—</span>}
                    </td>
                    <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                      {submission.analyst_name || <span className="text-gray-400">—</span>}
                    </td>
                    <td className="py-4 px-4 text-gray-600 dark:text-gray-400 capitalize">{submission.call_type}</td>
                    <td className="py-4 px-4"><StatusBadge status={submission.status} /></td>
                    <td className="py-4 px-4">
                      {submission.compliance_score != null ? (
                        <ProgressBar percentage={submission.compliance_score} showLabel size="sm" />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                      {new Date(submission.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {/* View button — always visible */}
                        <button
                          onClick={() => setSelectedSubmission(submission)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>

                        {/* Retry button — only when webhook failed or n8n error */}
                        {shouldShowRetry(submission) && (
                          <RetryButton
                            submission={submission}
                            onRetried={fetchSubmissions}
                          />
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredAndSorted.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No audits match your filters</p>
          </div>
        )}

        {/* Pagination */}
        {filteredAndSorted.length > PAGE_SIZE && (
          <div className="mt-6 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing {pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, filteredAndSorted.length)} of {filteredAndSorted.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={safePage === 1}
                title="Previous page"
                aria-label="Previous page"
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                .reduce<(number | '...')[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('...');
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === '...' ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-gray-400">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p as number)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                        safePage === p
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                title="Next page"
                aria-label="Next page"
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </GlassmorphismCard>

      <AnimatePresence>
        {selectedSubmission && (
          <AuditDetailDrawer
            submission={selectedSubmission}
            onClose={() => setSelectedSubmission(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}