import { useState, useEffect, useCallback, useRef } from "react";
import { auditService } from "../services/auditService";
import { AuditSubmission, AuditStatus } from "../types";

interface UseAuditDataOptions {
  limit?: number;
}

export const useAuditData = (options?: UseAuditDataOptions) => {
  const { limit = 100 } = options || {};

  const [submissions, setSubmissions] = useState<AuditSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** prevents duplicate fetch */
  const isFetchingRef = useRef(false);

  /** prevents multiple subscriptions */
  const hasSubscribedRef = useRef(false);

  /** prevent unnecessary state updates */
  const lastDataHashRef = useRef<string | null>(null);

  /**
   * Normalize backend data
   */
  const normalize = useCallback((data: AuditSubmission[]) => {
    return data.map((item) => ({
      ...item,
      status: normalizeStatus(item.status),
      compliance_score:
        item.compliance_score === null ||
        item.compliance_score === undefined
          ? undefined
          : item.compliance_score,
    }));
  }, []);

  /**
   * Safe state setter to avoid rerender loops
   */
  const safeSetSubmissions = useCallback(
    (data: AuditSubmission[]) => {
      const normalized = normalize(data);

      const hash = JSON.stringify(normalized);
      if (lastDataHashRef.current === hash) return;

      lastDataHashRef.current = hash;
      setSubmissions(normalized);
    },
    [normalize]
  );

  /**
   * Initial Fetch
   */
  const fetchSubmissions = useCallback(async () => {
    if (isFetchingRef.current) return;
    if (!navigator.onLine) return;

    isFetchingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const data = await auditService.getSubmissions(limit);
      safeSetSubmissions(data);
    } catch (err) {
      console.error("Fetch submissions error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch submissions"
      );
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [limit, safeSetSubmissions]);

  /**
   * Fetch Single Submission
   */
  const getSubmissionById = useCallback(async (id: string) => {
    try {
      const submission = await auditService.getSubmissionById(id);
      if (!submission) return null;

      return {
        ...submission,
        status: normalizeStatus(submission.status),
      };
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch submission"
      );
      return null;
    }
  }, []);

  /**
   * Optional call_id check
   */
  const checkCallIdExists = useCallback(async (callId?: string) => {
    if (!callId) return false;

    try {
      return await auditService.checkCallIdExists(callId);
    } catch (err) {
      console.error("Failed to check call ID:", err);
      return false;
    }
  }, []);

  /**
   * Initial load
   */
  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  /**
   * Realtime Supabase Subscription
   */
  useEffect(() => {
    if (hasSubscribedRef.current) return;
    hasSubscribedRef.current = true;


    const unsubscribe = auditService.subscribeToSubmissions((payload) => {
      setSubmissions((prev) => {
    const normalized = {
      ...payload.record,
      status: normalizeStatus(payload.record.status),
    };

    if (payload.type === 'INSERT') {
      return [normalized, ...prev];
    }

    if (payload.type === 'UPDATE') {
      return prev.map((item) =>
        item.id === normalized.id ? normalized : item
      );
    }

    if (payload.type === 'DELETE') {
      return prev.filter((item) => item.id !== normalized.id);
    }

    return prev;
  });
});


    return () => {
      unsubscribe?.();
      hasSubscribedRef.current = false;
    };
  }, [safeSetSubmissions]);

  return {
    submissions,
    isLoading,
    error,
    fetchSubmissions,
    getSubmissionById,
    checkCallIdExists,
  };
};

/**
 * Normalize unexpected backend statuses
 */
function normalizeStatus(status: AuditStatus | string): AuditStatus {
  if (
    status === "pending" ||
    status === "processing" ||
    status === "passed" ||
    status === "failed" ||
    status === "flagged"
  ) {
    return status;
  }

  return "pending";
}
