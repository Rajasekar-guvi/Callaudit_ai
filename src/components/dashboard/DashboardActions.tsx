import React, { useState } from 'react';
import { RefreshCw, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { GradientButton } from '../ui/GradientButton';
import { useToast } from '../../context/ToastContext';
import { useAuditData } from '../../hooks/useAuditData';

export const DashboardActions: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { showToast } = useToast();
  const { submissions, fetchSubmissions } = useAuditData();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchSubmissions();
      showToast('Audits refreshed successfully', 'success');
    } catch (error) {
      showToast('Failed to refresh audits', 'error');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExportCSV = () => {
    if (submissions.length === 0) {
      showToast('No audits to export', 'info');
      return;
    }

    const headers = ['Call ID', 'Analyst', 'Type', 'Status', 'Score', 'Duration (s)', 'Date', 'Notes'];
    const rows = submissions.map((s) => [
      s.call_id,
      s.analyst_name,
      s.call_type,
      s.status,
      s.compliance_score || '',
      s.call_duration,
      new Date(s.created_at).toISOString(),
      s.notes || '',
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audits_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    showToast('Export downloaded successfully', 'success');
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh Data'}</span>
        </button>
      </motion.div>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <button
          onClick={handleExportCSV}
          className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          <span>Export CSV</span>
        </button>
      </motion.div>
    </div>
  );
};
