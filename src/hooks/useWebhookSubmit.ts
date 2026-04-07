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


import { useState, useRef } from 'react';
import { webhookService } from '../services/webhookService';
import { auditService } from '../services/auditService';
import { FormData } from '../types';

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

  const submit = async (formData: FormData) => {
    // Rate limit — prevent resubmission within 30 seconds
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
      // STEP 1 — Create submission (webhook_sent = false by default)
      // Combine predefined and custom parameters for submission
      const allSelectedParams = [
        ...(formData.selectedParameters || []),
        ...(formData.customParameters?.map(p => p.name) || [])
      ];

      const submission = await auditService.createSubmission({
        email: formData.email || undefined,
        analyst_name: formData.analystName || undefined,
        call_id: formData.callId || undefined,
        call_duration: formData.callDuration
          ? webhookService.parseTimeToSeconds(formData.callDuration)
          : 0,
        call_type: formData.callType,
        notes: formData.notes || undefined,
        audio_url: formData.audioUrl || undefined,
        selected_parameters: allSelectedParams,
      });

      // STEP 2 — Prepare webhook payload
      const payload = webhookService.transformFormDataToPayload(formData);
      (payload as any).submission_id = submission.id;
      payload.audio.url = formData.audioUrl;
      // Note: selected_parameters is now included by transformFormDataToPayload
      // Just ensure custom_parameters is also included
      payload.custom_parameters = formData.customParameters || [];

      // STEP 3 — Send webhook + track success/failure
      try {
        await Promise.race([
          webhookService.sendWithRetry(payload),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Webhook timeout')), 8000)
          ),
        ]);
        // ✅ Webhook reached n8n — mark as sent
        await auditService.markWebhookSent(submission.id);
      } catch (webhookError) {
        // ❌ Webhook failed — webhook_sent stays false → Retry button shows
        console.warn('Webhook failed, submission saved. Retry button will appear:', webhookError);
      }

      setState({ isLoading: false, error: null, success: true });
      return submission.id;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Submission failed';
      setState({ isLoading: false, error: errorMessage, success: false });
      throw error;
    }
  };

  // ✅ Retry — resets same row and resends webhook
  const retry = async (submission: any) => {
    try {
      // Reset row in Supabase
      await auditService.resetForRetry(submission.id);

      // Rebuild payload from existing submission data
      const payload: any = {
        submission_id: submission.id,
        email: submission.email,
        analyst_name: submission.analyst_name,
        call_id: submission.call_id,
        call_duration: submission.call_duration,
        call_type: submission.call_type,
        notes: submission.notes,
        audio: { filename: 'audio_url', size: 0, url: submission.audio_url },
      };

      await Promise.race([
        webhookService.sendWithRetry(payload),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Webhook timeout')), 8000)
        ),
      ]);

      // ✅ Webhook reached n8n
      await auditService.markWebhookSent(submission.id);

    } catch (error) {
      console.warn('Retry webhook failed:', error);
      // webhook_sent stays false → retry button stays visible
    }
  };

  return { ...state, submit, retry };
};

export default useWebhookSubmit;
export type UseWebhookSubmit = ReturnType<typeof useWebhookSubmit>;