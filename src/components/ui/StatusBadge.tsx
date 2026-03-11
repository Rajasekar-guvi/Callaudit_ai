import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import { AuditStatus } from '../../types';

interface StatusBadgeProps {
  status: AuditStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const styles = {
    passed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    flagged: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    pending: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
  };

  const icons = {
    passed: <CheckCircle className="w-4 h-4" />,
    failed: <XCircle className="w-4 h-4" />,
    flagged: <AlertCircle className="w-4 h-4" />,
    pending: <Clock className="w-4 h-4" />,
  };

  const labels = {
    passed: 'PASSED',
    failed: 'FAILED',
    flagged: 'FLAGGED',
    pending: 'PENDING',
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-sm ${styles[status]}`}>
      {icons[status]}
      {labels[status]}
    </div>
  );
};
