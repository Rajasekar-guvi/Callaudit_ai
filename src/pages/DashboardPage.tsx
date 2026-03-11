import React from 'react';
import { motion } from 'framer-motion';
import { StickyHeader } from '../components/layout/StickyHeader';
import { KPICards } from '../components/dashboard/KPICards';
import { ComplianceTrendChart } from '../components/dashboard/ComplianceTrendChart';
import { AuditTable } from '../components/dashboard/AuditTable';
import { DashboardActions } from '../components/dashboard/DashboardActions';

export const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950">
      <StickyHeader currentPage="dashboard" />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Audit Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Monitor compliance scores and call audit metrics</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <KPICards />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <ComplianceTrendChart />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <DashboardActions />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <AuditTable />
        </motion.div>
      </main>
    </div>
  );
};


