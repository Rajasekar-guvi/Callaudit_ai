import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import { AuditStatus } from '../../types';

interface StatusBadgeProps {
  status: AuditStatus;
  webhookSent?: boolean;
  errorMessage?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, webhookSent, errorMessage }) => {
  const [showTooltip, setShowTooltip] = useState(false);

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

  // ── Status-specific tooltip messages ──────────────────────────
  const getTooltipMessage = (): string => {
    if (status === 'pending') {
      if (webhookSent === false) {
        return '⚠️ Webhook never sent to n8n\n💡 Click Retry to send the submission';
      } else if (webhookSent === true) {
        return '⏳ Waiting for n8n response\n💡 n8n is processing your submission';
      }
      return '⏳ Submission pending processing';
    }
    if (status === 'passed') {
      return '✅ Audit passed all compliance checks';
    }
    if (status === 'failed') {
      return '❌ Audit failed compliance checks\n💡 Click Retry to resubmit for processing';
    }
    if (status === 'flagged') {
      return '⚠️ Audit flagged for review\n💡 Manual review may be required';
    }
    return '';
  };

  return (
    <div className="relative inline-block">
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-sm ${styles[status]} cursor-help transition-opacity hover:opacity-80`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {icons[status]}
        {labels[status]}
      </div>

      {/* ── Tooltip on hover ────────────────────── */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-800 text-white dark:text-gray-100 text-xs rounded-lg whitespace-nowrap z-50 shadow-lg border border-gray-700 dark:border-gray-600 pointer-events-none">
          <div className="whitespace-pre-line text-center">{getTooltipMessage()}</div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-800" />
        </div>
      )}
    </div>
  );
};
