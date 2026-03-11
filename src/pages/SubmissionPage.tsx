// import React, { useRef, useState } from 'react';
// import { motion } from 'framer-motion';
// import { StickyHeader } from '../components/layout/StickyHeader';
// import { AuditSubmissionForm } from '../components/forms/AuditSubmissionForm';
// import { RecentSubmissionsTable } from '../components/RecentSubmissionsTable';

// export const SubmissionPage: React.FC = () => {
//   const tableRef = useRef<HTMLDivElement>(null);
//   const [refreshTrigger, setRefreshTrigger] = useState(0);

//   const handleSubmissionSuccess = () => {
//     setRefreshTrigger((prev) => prev + 1);
//     setTimeout(() => {
//       tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     }, 500);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950">
//       <StickyHeader currentPage="submission" />

//       <main className="max-w-7xl mx-auto px-6 py-12">
//         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
//           <AuditSubmissionForm onSuccess={handleSubmissionSuccess} />
//         </motion.div>

//         <motion.div
//           ref={tableRef}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.2 }}
//           className="mt-12"
//         >
//           <RecentSubmissionsTable refreshTrigger={refreshTrigger} />
//         </motion.div>
//       </main>
//     </div>
//   );
// };


import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { StickyHeader } from '../components/layout/StickyHeader';
import { AuditSubmissionForm } from '../components/forms/AuditSubmissionForm';
import { RecentSubmissionsTable } from '../components/RecentSubmissionsTable';

export const SubmissionPage: React.FC = () => {
  const tableRef = useRef<HTMLDivElement>(null);
  const [refreshTrigger, setRefreshTrigger]     = useState(0);
  const [newSubmissionId, setNewSubmissionId]   = useState<string | null>(null);

  const handleSubmissionSuccess = (submissionId?: string) => {
    setRefreshTrigger(prev => prev + 1);

    // pass the new submission id to the table so it can show the ring
    if (submissionId) setNewSubmissionId(submissionId);

    setTimeout(() => {
      tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950">
      <StickyHeader currentPage="submission" />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <AuditSubmissionForm onSuccess={handleSubmissionSuccess} />
        </motion.div>

        <motion.div
          ref={tableRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12"
        >
          <RecentSubmissionsTable
            refreshTrigger={refreshTrigger}
            newSubmissionId={newSubmissionId}
          />
        </motion.div>
      </main>
    </div>
  );
};


