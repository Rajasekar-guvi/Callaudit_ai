// import { useState, useEffect, useCallback, useRef } from "react";
// import { auditService } from "../services/auditService";
// import { AuditSubmission, AuditStatus } from "../types";

// interface UseAuditDataOptions {
//   limit?: number;
// }

// export const useAuditData = (options?: UseAuditDataOptions) => {
//   const { limit = 100 } = options || {};

//   const [submissions, setSubmissions] = useState<AuditSubmission[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   /** prevents duplicate fetch */
//   const isFetchingRef = useRef(false);

//   /** prevents multiple subscriptions */
//   const hasSubscribedRef = useRef(false);

//   /** prevent unnecessary state updates */
//   const lastDataHashRef = useRef<string | null>(null);

//   /**
//    * Normalize backend data
//    */
//   const normalize = useCallback((data: AuditSubmission[]) => {
//     return data.map((item) => ({
//       ...item,
//       status: normalizeStatus(item.status),
//       compliance_score:
//         item.compliance_score === null ||
//         item.compliance_score === undefined
//           ? undefined
//           : item.compliance_score,
//     }));
//   }, []);

//   /**
//    * Safe state setter to avoid rerender loops
//    */
//   const safeSetSubmissions = useCallback(
//     (data: AuditSubmission[]) => {
//       const normalized = normalize(data);

//       const hash = JSON.stringify(normalized);
//       if (lastDataHashRef.current === hash) return;

//       lastDataHashRef.current = hash;
//       setSubmissions(normalized);
//     },
//     [normalize]
//   );

//   /**
//    * Initial Fetch
//    */
//   const fetchSubmissions = useCallback(async () => {
//     if (isFetchingRef.current) return;
//     if (!navigator.onLine) return;

//     isFetchingRef.current = true;
//     setIsLoading(true);
//     setError(null);

//     try {
//       const data = await auditService.getSubmissions(limit);
//       safeSetSubmissions(data);
//     } catch (err) {
//       console.error("Fetch submissions error:", err);
//       setError(
//         err instanceof Error ? err.message : "Failed to fetch submissions"
//       );
//     } finally {
//       setIsLoading(false);
//       isFetchingRef.current = false;
//     }
//   }, [limit, safeSetSubmissions]);

//   /**
//    * Fetch Single Submission
//    */
//   const getSubmissionById = useCallback(async (id: string) => {
//     try {
//       const submission = await auditService.getSubmissionById(id);
//       if (!submission) return null;

//       return {
//         ...submission,
//         status: normalizeStatus(submission.status),
//       };
//     } catch (err) {
//       setError(
//         err instanceof Error ? err.message : "Failed to fetch submission"
//       );
//       return null;
//     }
//   }, []);

//   /**
//    * Optional call_id check
//    */
//   const checkCallIdExists = useCallback(async (callId?: string) => {
//     if (!callId) return false;

//     try {
//       return await auditService.checkCallIdExists(callId);
//     } catch (err) {
//       console.error("Failed to check call ID:", err);
//       return false;
//     }
//   }, []);

//   /**
//    * Initial load
//    */
//   useEffect(() => {
//     fetchSubmissions();
//   }, [fetchSubmissions]);

//   /**
//    * Realtime Supabase Subscription
//    */
//   useEffect(() => {
//     if (hasSubscribedRef.current) return;
//     hasSubscribedRef.current = true;


//     const unsubscribe = auditService.subscribeToSubmissions((payload) => {
//       setSubmissions((prev) => {
//     const normalized = {
//       ...payload.record,
//       status: normalizeStatus(payload.record.status),
//     };

//     if (payload.type === 'INSERT') {
//       return [normalized, ...prev];
//     }

//     if (payload.type === 'UPDATE') {
//       return prev.map((item) =>
//         item.id === normalized.id ? normalized : item
//       );
//     }

//     if (payload.type === 'DELETE') {
//       return prev.filter((item) => item.id !== normalized.id);
//     }

//     return prev;
//   });
// });


//     return () => {
//       unsubscribe?.();
//       hasSubscribedRef.current = false;
//     };
//   }, [safeSetSubmissions]);

//   return {
//     submissions,
//     isLoading,
//     error,
//     fetchSubmissions,
//     getSubmissionById,
//     checkCallIdExists,
//   };
// };

// /**
//  * Normalize unexpected backend statuses
//  */
// function normalizeStatus(status: AuditStatus | string): AuditStatus {
//   if (
//     status === "pending" ||
//     status === "processing" ||
//     status === "passed" ||
//     status === "failed" ||
//     status === "flagged"
//   ) {
//     return status;
//   }

//   return "pending";
// }

// import { useState, useEffect, useCallback, useRef } from "react";
// import { auditService } from "../services/auditService";
// import { AuditSubmission, AuditStatus } from "../types";

// interface UseAuditDataOptions {
//   limit?: number;
//   pollingInterval?: number; // Base polling interval in ms (default: 5000)
//   maxPollingInterval?: number; // Max polling interval with backoff (default: 30000)
//   enablePolling?: boolean; // Enable polling for pending items (default: true)
// }

// export const useAuditData = (options?: UseAuditDataOptions) => {
//   const { 
//     limit = 100,
//     pollingInterval = 5000,
//     maxPollingInterval = 30000,
//     enablePolling = true,
//   } = options || {};

//   const [submissions, setSubmissions] = useState<AuditSubmission[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [isPolling, setIsPolling] = useState(false);

//   const isFetchingRef    = useRef(false);
//   const hasSubscribedRef = useRef(false);
//   const lastDataHashRef  = useRef<string | null>(null);
//   const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
//   const currentPollingIntervalRef = useRef(pollingInterval); // Track current interval with backoff
//   const lastFetchTimeRef = useRef<number>(0);
//   const noChangeCountRef = useRef(0); // Count of fetches with no changes for backoff

//   const normalize = useCallback((data: AuditSubmission[]) => {
//     return data.map((item) => ({
//       ...item,
//       status: normalizeStatus(item.status),
//       compliance_score:
//         item.compliance_score === null || item.compliance_score === undefined
//           ? undefined
//           : item.compliance_score,
//     }));
//   }, []);

//   const safeSetSubmissions = useCallback(
//     (data: AuditSubmission[]) => {
//       const normalized = normalize(data);
//       const hash = JSON.stringify(normalized);
//       if (lastDataHashRef.current === hash) return;
//       lastDataHashRef.current = hash;
//       setSubmissions(normalized);
//     },
//     [normalize]
//   );

//   const fetchSubmissions = useCallback(async () => {
//     if (isFetchingRef.current) return;
//     if (!navigator.onLine) return;

//     isFetchingRef.current = true;
//     setIsLoading(true);
//     setError(null);

//     try {
//       const data = await auditService.getSubmissions(limit);
//       safeSetSubmissions(data);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to fetch submissions");
//     } finally {
//       setIsLoading(false);
//       isFetchingRef.current = false;
//     }
//   }, [limit, safeSetSubmissions]);

//   const getSubmissionById = useCallback(async (id: string) => {
//     try {
//       const submission = await auditService.getSubmissionById(id);
//       if (!submission) return null;
//       return { ...submission, status: normalizeStatus(submission.status) };
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to fetch submission");
//       return null;
//     }
//   }, []);

//   const checkCallIdExists = useCallback(async (callId?: string) => {
//     if (!callId) return false;
//     try {
//       return await auditService.checkCallIdExists(callId);
//     } catch {
//       return false;
//     }
//   }, []);

//   // ── Initial load ─────────────────────────────────────
//   useEffect(() => {
//     fetchSubmissions();
//   }, [fetchSubmissions]);

//   // ── Realtime subscription ─────────────────────────────
//   useEffect(() => {
//     if (hasSubscribedRef.current) return;
//     hasSubscribedRef.current = true;

//     const unsubscribe = auditService.subscribeToSubmissions((payload) => {
//       setSubmissions((prev) => {
//         const normalized = {
//           ...payload.record,
//           status: normalizeStatus(payload.record.status),
//         };

//         if (payload.type === 'INSERT') return [normalized, ...prev];
//         if (payload.type === 'UPDATE') return prev.map((item) => item.id === normalized.id ? normalized : item);
//         if (payload.type === 'DELETE') return prev.filter((item) => item.id !== normalized.id);
//         return prev;
//       });
//     });

//     return () => {
//       unsubscribe?.();
//       hasSubscribedRef.current = false;
//     };
//   }, [safeSetSubmissions]);

//   // ── Polling fallback with adaptive backoff ──────────────
//   const startPolling = useCallback(() => {
//     if (!enablePolling || pollingIntervalRef.current) return;
    
//     setIsPolling(true);
//     const poll = async () => {
//       // Only poll for items in PENDING state (waiting in queue)
//       // Once they're completed (passed, failed, flagged), rely on real-time subscriptions
//       const hasPending = submissions.some((s) => s.status === 'pending');

//       if (hasPending) {
//         const now = Date.now();
//         if (now - lastFetchTimeRef.current < currentPollingIntervalRef.current) {
//           pollingIntervalRef.current = setTimeout(poll, currentPollingIntervalRef.current);
//           return;
//         }

//         lastFetchTimeRef.current = now;
        
//         if (isFetchingRef.current) {
//           pollingIntervalRef.current = setTimeout(poll, currentPollingIntervalRef.current);
//           return;
//         }

//         isFetchingRef.current = true;
//         try {
//           const data = await auditService.getSubmissions(limit);
//           const hash = JSON.stringify(data);
          
//           // Adaptive backoff: increase interval if no changes
//           if (lastDataHashRef.current === hash) {
//             noChangeCountRef.current++;
//             currentPollingIntervalRef.current = Math.min(
//               pollingInterval * (1 + noChangeCountRef.current * 0.5),
//               maxPollingInterval
//             );
//           } else {
//             // Reset backoff on changes
//             noChangeCountRef.current = 0;
//             currentPollingIntervalRef.current = pollingInterval;
//             safeSetSubmissions(data);
//           }
//         } catch (err) {
//           console.error('Polling error:', err);
//         } finally {
//           isFetchingRef.current = false;
//           pollingIntervalRef.current = setTimeout(poll, currentPollingIntervalRef.current);
//         }
//       } else {
//         // No pending items - all are being processed or completed
//         // Real-time subscriptions will handle updates, so stop polling
//         setIsPolling(false);
//         stopPolling();
//       }
//     };

//     pollingIntervalRef.current = setTimeout(poll, currentPollingIntervalRef.current);
//   }, [submissions, enablePolling, pollingInterval, maxPollingInterval, limit, safeSetSubmissions]);

//   const stopPolling = useCallback(() => {
//     if (pollingIntervalRef.current) {
//       clearTimeout(pollingIntervalRef.current);
//       pollingIntervalRef.current = null;
//       setIsPolling(false);
//       noChangeCountRef.current = 0;
//       currentPollingIntervalRef.current = pollingInterval;
//     }
//   }, [pollingInterval]);

//   // Auto-start polling ONLY when items are in PENDING state (UI status)
//   useEffect(() => {
//     const hasPending = submissions.some((s) => s.status === 'pending');
    
//     if (hasPending && !pollingIntervalRef.current && enablePolling) {
//       startPolling();
//     } else if (!hasPending && pollingIntervalRef.current) {
//       stopPolling();
//     }

//     return () => {
//       // Cleanup handled by stopPolling
//     };
//   }, [submissions, startPolling, stopPolling, enablePolling]);

//   return {
//     submissions,
//     isLoading,
//     error,
//     isPolling,
//     fetchSubmissions,
//     getSubmissionById,
//     checkCallIdExists,
//     startPolling,
//     stopPolling,
//   };
// };

// function normalizeStatus(status: AuditStatus | string): AuditStatus {
//   if (
//     status === "pending" ||
//     status === "processing" ||
//     status === "passed" ||
//     status === "failed" ||
//     status === "flagged"
//   ) {
//     return status;
//   }
//   return "pending";
// }



import { useState, useEffect, useCallback, useRef } from "react";
import { auditService } from "../services/auditService";
import { AuditSubmission, AuditStatus } from "../types";

interface UseAuditDataOptions {
  limit?: number;
}

export const useAuditData = (options?: UseAuditDataOptions) => {
  const { limit = 100 } = options || {};

  const [submissions, setSubmissions] = useState<AuditSubmission[]>([]);
  const [isLoading, setIsLoading]     = useState(false);
  const [error, setError]             = useState<string | null>(null);

  const isFetchingRef   = useRef(false);
  const lastDataHashRef = useRef<string | null>(null);
  const unsubscribeRef  = useRef<(() => void) | null>(null);

  // ── Normalize a single row ──────────────────────────────
  const normalizeRow = (item: AuditSubmission): AuditSubmission => ({
    ...item,
    status: normalizeStatus(item.status),
    compliance_score:
      item.compliance_score === null || item.compliance_score === undefined
        ? undefined
        : item.compliance_score,
  });

  // ── Fetch ALL rows once (initial load only) ─────────────
  const fetchSubmissions = useCallback(async () => {
    if (isFetchingRef.current) return;
    if (!navigator.onLine)     return;

    isFetchingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const data = await auditService.getSubmissions(limit);
      const normalized = data.map(normalizeRow);
      const hash = JSON.stringify(normalized);
      if (lastDataHashRef.current !== hash) {
        lastDataHashRef.current = hash;
        setSubmissions(normalized);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch submissions");
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [limit]);

  // ── Patch a single row by id (no full refresh) ──────────
  const patchRow = useCallback(async (id: string) => {
    try {
      const fresh = await auditService.getSubmissionById(id);
      if (!fresh) return;
      const normalized = normalizeRow(fresh);
      setSubmissions((prev) =>
        prev.map((item) => item.id === id ? normalized : item)
      );
    } catch {
      // silently ignore — UI still shows last known state
    }
  }, []);

  // ── Setup realtime subscription ─────────────────────────
  const setupRealtime = useCallback(() => {
    // Cleanup existing subscription first
    unsubscribeRef.current?.();

    unsubscribeRef.current = auditService.subscribeToSubmissions((payload) => {
      const normalized = normalizeRow(payload.record);

      if (payload.type === 'INSERT') {
        // New submission — add to top of list instantly
        setSubmissions((prev) => {
          const exists = prev.some((s) => s.id === normalized.id);
          return exists ? prev : [normalized, ...prev];
        });
        return;
      }

      if (payload.type === 'UPDATE') {
        // Only that row updates — rest of table untouched
        setSubmissions((prev) =>
          prev.map((item) => item.id === normalized.id ? normalized : item)
        );
        return;
      }

      if (payload.type === 'DELETE') {
        setSubmissions((prev) =>
          prev.filter((item) => item.id !== normalized.id)
        );
      }
    });
  }, []);

  // ── Initial load + realtime setup ──────────────────────
  useEffect(() => {
    fetchSubmissions();
    setupRealtime();

    return () => {
      unsubscribeRef.current?.();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── On network restore — resubscribe + patch active rows ─
  useEffect(() => {
    const handleOnline = () => {
      setupRealtime(); // reconnect websocket

      // Only patch rows still in progress — not full table
      setSubmissions((prev) => {
        const thirtyMinsAgo = Date.now() - 30 * 60 * 1000;

        const activeIds = prev
          .filter((s) => {
            if (s.status === 'pending' && (s as any).webhook_sent === false) return false;
            if (new Date(s.created_at).getTime() < thirtyMinsAgo) return false;
            return s.status === 'pending' || s.status === 'processing';
          })
          .map((s) => s.id);

        activeIds.forEach((id) => patchRow(id));
        return prev; // return unchanged, patchRow updates individually
      });
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [setupRealtime, patchRow]);


  // ── Other hooks ─────────────────────────────────────────
  const getSubmissionById = useCallback(async (id: string) => {
    try {
      const submission = await auditService.getSubmissionById(id);
      if (!submission) return null;
      return normalizeRow(submission);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch submission");
      return null;
    }
  }, []);

  const checkCallIdExists = useCallback(async (callId?: string) => {
    if (!callId) return false;
    try {
      return await auditService.checkCallIdExists(callId);
    } catch {
      return false;
    }
  }, []);

  return {
    submissions,
    isLoading,
    error,
    fetchSubmissions,
    getSubmissionById,
    checkCallIdExists,
  };
};

// ── Normalize unexpected backend statuses ───────────────
function normalizeStatus(status: AuditStatus | string): AuditStatus {
  if (
    status === "pending"    ||
    status === "processing" ||
    status === "passed"     ||
    status === "failed"     ||
    status === "flagged"
  ) return status;
  return "pending";
}