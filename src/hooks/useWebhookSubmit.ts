// import { useState } from 'react';
// import { webhookService } from '../services/webhookService';
// import { auditService } from '../services/auditService';
// import { FormData } from '../types';

// interface UseWebhookSubmitState {
//   isLoading: boolean;
//   error: string | null;
//   success: boolean;
// }

// export const useWebhookSubmit = () => {
//   const [state, setState] = useState<UseWebhookSubmitState>({
//     isLoading: false,
//     error: null,
//     success: false,
//   });

//   const submit = async (formData: FormData) => {
//     setState({
//       isLoading: true,
//       error: null,
//       success: false,
//     });

//     try {
//       // ✅ STEP 1 — Create submission in Supabase
//       const submission = await auditService.createSubmission({
//         email: formData.email || undefined,
//         analyst_name: formData.analystName || undefined,
//         call_id: formData.callId || undefined,
//         call_duration: formData.callDuration
//           ? webhookService.parseTimeToSeconds(formData.callDuration)
//           : 0,
//         call_type: formData.callType,
//         notes: formData.notes || undefined,
//         audio_url: formData.audioUrl || undefined,
//       });

//       // ✅ STEP 2 — Prepare webhook payload
//       const payload = webhookService.transformFormDataToPayload(formData);

//       // 🔥 CRITICAL FIX — send submission id to n8n
//       (payload as any).submission_id = submission.id;

//       payload.audio.url = formData.audioUrl;

//       // ✅ STEP 3 — Send webhook (async processing)
//       try {
//         await Promise.race([
//           webhookService.sendWithRetry(payload),
//           new Promise((_, reject) =>
//             setTimeout(() => reject(new Error('Webhook timeout')), 8000)
//           ),
//         ]);
//       } catch (webhookError) {
//         console.warn(
//           'Webhook failed but submission saved (n8n async processing expected):',
//           webhookError
//         );
//       }

//       // ✅ STEP 4 — Success state
//       setState({
//         isLoading: false,
//         error: null,
//         success: true,
//       });

//       return submission.id;
//     } catch (error) {
//       const errorMessage =
//         error instanceof Error ? error.message : 'Submission failed';

//       setState({
//         isLoading: false,
//         error: errorMessage,
//         success: false,
//       });

//       throw error;
//     }
//   };

//   return {
//     ...state,
//     submit,
//   };
// };

// export default useWebhookSubmit;

// export type UseWebhookSubmit = ReturnType<typeof useWebhookSubmit>;
// export type UseWebhookSubmitReturn = ReturnType<
//   UseWebhookSubmit['submit']
// >;




// // ---- .2 versions of the same file exist due to recent edits. Ignore the deleted one.
// import { useState } from 'react';
// import { webhookService } from '../services/webhookService';
// import { auditService } from '../services/auditService';
// import { FormData } from '../types';

// interface UseWebhookSubmitState {
//   isLoading: boolean;
//   error: string | null;
//   success: boolean;
// }

// export const useWebhookSubmit = () => {
//   const [state, setState] = useState<UseWebhookSubmitState>({
//     isLoading: false,
//     error: null,
//     success: false,
//   });

//   const submit = async (formData: FormData) => {
//     setState({ isLoading: true, error: null, success: false });

//     try {
//       // STEP 1 — Create submission (webhook_sent = false by default)
//       const submission = await auditService.createSubmission({
//         email: formData.email || undefined,
//         analyst_name: formData.analystName || undefined,
//         call_id: formData.callId || undefined,
//         call_duration: formData.callDuration
//           ? webhookService.parseTimeToSeconds(formData.callDuration)
//           : 0,
//         call_type: formData.callType,
//         notes: formData.notes || undefined,
//         audio_url: formData.audioUrl || undefined,
//       });

//       // STEP 2 — Prepare webhook payload
//       const payload = webhookService.transformFormDataToPayload(formData);
//       (payload as any).submission_id = submission.id;
//       payload.audio.url = formData.audioUrl;

//       // STEP 3 — Send webhook + track success/failure
//       try {
//         await Promise.race([
//           webhookService.sendWithRetry(payload),
//           new Promise((_, reject) =>
//             setTimeout(() => reject(new Error('Webhook timeout')), 8000)
//           ),
//         ]);
//         // ✅ Webhook reached n8n — mark as sent
//         await auditService.markWebhookSent(submission.id);
//       } catch (webhookError) {
//         // ❌ Webhook failed — webhook_sent stays false → Retry button shows
//         console.warn('Webhook failed, submission saved. Retry button will appear:', webhookError);
//       }

//       setState({ isLoading: false, error: null, success: true });
//       return submission.id;

//     } catch (error) {
//       const errorMessage = error instanceof Error ? error.message : 'Submission failed';
//       setState({ isLoading: false, error: errorMessage, success: false });
//       throw error;
//     }
//   };

//   // ✅ Retry — resets same row and resends webhook
//   const retry = async (submission: any) => {
//     try {
//       // Reset row in Supabase
//       await auditService.resetForRetry(submission.id);

//       // Rebuild payload from existing submission data
//       const payload: any = {
//         submission_id: submission.id,
//         email: submission.email,
//         analyst_name: submission.analyst_name,
//         call_id: submission.call_id,
//         call_duration: submission.call_duration,
//         call_type: submission.call_type,
//         notes: submission.notes,
//         audio: { filename: 'audio_url', size: 0, url: submission.audio_url },
//       };

//       await Promise.race([
//         webhookService.sendWithRetry(payload),
//         new Promise((_, reject) =>
//           setTimeout(() => reject(new Error('Webhook timeout')), 8000)
//         ),
//       ]);

//       // ✅ Webhook reached n8n
//       await auditService.markWebhookSent(submission.id);

//     } catch (error) {
//       console.warn('Retry webhook failed:', error);
//       // webhook_sent stays false → retry button stays visible
//     }
//   };

//   return { ...state, submit, retry };
// };

// export default useWebhookSubmit;
// export type UseWebhookSubmit = ReturnType<typeof useWebhookSubmit>;


import { useState, useRef, useCallback } from 'react';
import { webhookService } from '../services/webhookService';
import { auditService } from '../services/auditService';
import { FormData, BulkUrlItem } from '../types';
import { detectVCPlatform } from '../config/constants';

interface UseWebhookSubmitState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

export const useWebhookSubmit = () => {
  const [state, setState] = useState<UseWebhookSubmitState>({
    isLoading: false,
    error: null,
    success: false,
  });

  const lastSubmitRef = useRef<number>(0);

  // ── Single submit ─────────────────────────────────────────
  const submit = async (formData: FormData) => {
    const now = Date.now();
    const secondsSinceLast = (now - lastSubmitRef.current) / 1000;
    if (lastSubmitRef.current > 0 && secondsSinceLast < 30) {
      const wait = Math.ceil(30 - secondsSinceLast);
      setState({ isLoading: false, error: `Please wait ${wait}s before submitting again`, success: false });
      throw new Error(`Rate limited — wait ${wait}s`);
    }
    lastSubmitRef.current = now;
    setState({ isLoading: true, error: null, success: false });

    try {
      const allSelectedParams = [
        ...(formData.selectedParameters || []),
        ...(formData.customParameters?.map(p => p.name) || []),
      ];

      const isVC = formData.mediaType === 'video';
      const mediaUrl = isVC ? (formData.vcUrl || '') : (formData.audioUrl || '');
      if (mediaUrl) {
        const duplicateCheck = await auditService.checkAudioUrlExists(mediaUrl);
        if (duplicateCheck.isDuplicate) {
          setState({
            isLoading: false,
            error: `This audio was already submitted recently`,
            success: false,
          });
          return; 
          }
        }
      const vcPlatform = isVC ? detectVCPlatform(mediaUrl) : undefined;
      const submission = await auditService.createSubmission({
        email: formData.email || undefined,
        analyst_name: formData.analystName || undefined,
        call_id: formData.callId || undefined,
        call_duration: formData.callDuration
          ? webhookService.parseTimeToSeconds(formData.callDuration)
          : 0,
        call_type: formData.callType,
        notes: formData.notes || undefined,
        audio_url: mediaUrl || undefined,
        selected_parameters: allSelectedParams,
        custom_parameters: formData.customParameters || [],
        media_type: formData.mediaType || 'audio',
        vc_platform: vcPlatform,
        lead_stage: formData.leadStage,
        lsq_link: formData.lsqLink,
      });

      const payload = webhookService.transformFormDataToPayload(formData);
      (payload as any).submission_id = submission.id;
      payload.audio.url = mediaUrl;
      (payload as any).media_type = formData.mediaType || 'audio';
      if (vcPlatform) (payload as any).vc_platform = vcPlatform;

      try {
        await Promise.race([
          webhookService.sendWithRetry(payload),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Webhook timeout')), 8000)
          ),
        ]);
        await auditService.markWebhookSent(submission.id);
      } catch (webhookError) {
        const errorMsg = webhookError instanceof Error ? webhookError.message : 'Webhook failed';
        await auditService.saveWebhookError(submission.id, errorMsg);
        console.warn('Webhook failed, error saved. Retry button will appear:', webhookError);
      }

      setState({ isLoading: false, error: null, success: true });
      return submission.id;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Submission failed';
      setState({ isLoading: false, error: errorMessage, success: false });
      throw error;
    }
  };

  // ── Bulk submit (audio only) ──────────────────────────────
  const submitBulk = useCallback(async (
    bulkItems: BulkUrlItem[],
    baseFormData: FormData,
    onProgress: (updated: BulkUrlItem[]) => void
  ): Promise<string[]> => {
    setState({ isLoading: true, error: null, success: false });

    const allSelectedParams = [
      ...(baseFormData.selectedParameters || []),
      ...(baseFormData.customParameters?.map(p => p.name) || []),
    ];

    const results = [...bulkItems];
    const submittedIds: string[] = [];

    for (let i = 0; i < results.length; i++) {
      if (results[i].status !== 'valid') continue;

      // Mark as submitting
      results[i] = { ...results[i], status: 'submitting' };
      onProgress([...results]);

      try {
        const submission = await auditService.createSubmission({
          email: baseFormData.email || undefined,
          analyst_name: baseFormData.analystName || undefined,
          call_id: baseFormData.callId || undefined,
          call_duration: baseFormData.callDuration
            ? webhookService.parseTimeToSeconds(baseFormData.callDuration)
            : 0,
          call_type: baseFormData.callType,
          notes: baseFormData.notes || undefined,
          audio_url: results[i].url,
          selected_parameters: allSelectedParams,
          custom_parameters: baseFormData.customParameters || [],
          media_type: 'audio',
          lead_stage: baseFormData.leadStage,
          lsq_link: baseFormData.lsqLink,
        });

        const payload = webhookService.transformFormDataToPayload({
          ...baseFormData,
          audioUrl: results[i].url,
        });
        (payload as any).submission_id = submission.id;
        payload.audio.url = results[i].url;

        try {
          await Promise.race([
            webhookService.sendWithRetry(payload),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Webhook timeout')), 8000)
            ),
          ]);
          await auditService.markWebhookSent(submission.id);
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : 'Webhook failed';
          await auditService.saveWebhookError(submission.id, errorMsg);
        }

        submittedIds.push(submission.id);
        results[i] = { ...results[i], status: 'submitted' };
        onProgress([...results]);

        // 500ms delay between submissions — safe for n8n
        if (i < results.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }

      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed';
        console.error(`❌ Bulk submission failed for URL ${results[i].url}:`, errorMsg, err);
        results[i] = {
          ...results[i],
          status: 'failed',
          error: errorMsg,
        };
        onProgress([...results]);
      }
    }

    setState({ isLoading: false, error: null, success: true });
    return submittedIds;
  }, []);

  // ── Retry ─────────────────────────────────────────────────
  const retry = async (submission: any) => {
    try {
      await auditService.resetForRetry(submission.id);

      const payload: any = {
        submission_id: submission.id,
        email: submission.email,
        analyst_name: submission.analyst_name,
        call_id: submission.call_id,
        call_duration: submission.call_duration,
        call_type: submission.call_type,
        notes: submission.notes,
        audio: { filename: 'audio_url', size: 0, url: submission.audio_url },
        selected_parameters: submission.selected_parameters || [],
        custom_parameters: submission.custom_parameters || [],
        media_type: submission.media_type || 'audio',
        vc_platform: submission.vc_platform,
      };

      await Promise.race([
        webhookService.sendWithRetry(payload),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Webhook timeout')), 8000)
        ),
      ]);

      await auditService.markWebhookSent(submission.id);

    } catch (error) {
      console.warn('Retry webhook failed:', error);
    }
  };

  return { ...state, submit, submitBulk, retry };
};

export default useWebhookSubmit;
export type UseWebhookSubmit = ReturnType<typeof useWebhookSubmit>;