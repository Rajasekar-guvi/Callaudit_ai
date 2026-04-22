// import { WEBHOOK_CONFIG, getWebhookHeaders } from '../config/webhooks';
// import { WebhookPayload, WebhookResponse, FormData } from '../types';
// export const webhookService = {
//   transformFormDataToPayload(formData: FormData): WebhookPayload {
//     console.log('🔧 transformFormDataToPayload input:', {
//       selectedParameters: formData.selectedParameters,
//       customParameters: formData.customParameters,
//       allFormData: formData,
//     });    
//     // Extract custom parameter names for webhook
//     const customParamNames = formData.customParameters?.map(p => p.name) || [];
//     const selectedParams = [...(formData.selectedParameters || []), ...customParamNames];
//     console.log('🔧 Computed selected_parameters:', selectedParams);
//     console.log('🔧 Computed custom_parameters:', formData.customParameters);
    
//     const payload: WebhookPayload = {
//       email: formData.email || undefined,
//       notification_email: formData.notificationEmail || undefined,
//       analyst_name: formData.analystName || '',
//       call_id: formData.callId || '',
//       call_duration: formData.callDuration ? this.parseTimeToSeconds(formData.callDuration) : 0,
//       call_type: formData.callType,
//       notes: formData.notes || undefined,
//       audio: {
//         filename: 'audio_url',
//         size: 0,
//         url: formData.audioUrl,
//       },
//       selected_parameters: selectedParams,
//       custom_parameters: formData.customParameters || [],
//     };
    
//     console.log('✅ transformFormDataToPayload output:', {
//       selected_parameters: payload.selected_parameters,
//       custom_parameters: payload.custom_parameters,
//       payloadKeys: Object.keys(payload),
//     });
    
//     return payload;
//   },

//   parseTimeToSeconds(timeStr: string): number {
//     const parts = timeStr.split(':').map(Number);
//     if (parts.length === 2) {
//       return parts[0] * 60 + parts[1];
//     } else if (parts.length === 3) {
//       return parts[0] * 3600 + parts[1] * 60 + parts[2];
//     }
//     return 0;
//   },

//   async sendToWebhook(payload: WebhookPayload): Promise<WebhookResponse> {
//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), WEBHOOK_CONFIG.timeout);

//     try {
//       console.log('🔥 Before JSON.stringify - payload keys:', Object.keys(payload));
//       console.log('🔥 Before JSON.stringify - selected_parameters value:', (payload as any).selected_parameters);
//       console.log('🔥 Before JSON.stringify - custom_parameters value:', (payload as any).custom_parameters);
      
//       const payloadString = JSON.stringify(payload);
//       console.log('🔥 After JSON.stringify - full payload:', payloadString);
      
//       // Parse back to verify all fields are there
//       const parsed = JSON.parse(payloadString);
//       console.log('🔥 After parse verification - has selected_parameters:', 'selected_parameters' in parsed, parsed.selected_parameters);
//       console.log('🔥 After parse verification - has custom_parameters:', 'custom_parameters' in parsed, parsed.custom_parameters);
      
//       const response = await fetch(WEBHOOK_CONFIG.n8n_url, {
//         method: 'POST',
//         headers: getWebhookHeaders(),
//         body: payloadString,
//         signal: controller.signal,
//       });

//       clearTimeout(timeoutId);

//       if (!response.ok) {
//         throw new Error(`Webhook error: ${response.statusText}`);
//       }

//       const data = (await response.json()) as WebhookResponse;
//       return data;
//     } catch (error) {
//       clearTimeout(timeoutId);
//       if (error instanceof Error && error.name === 'AbortError') {
//         throw new Error('Webhook request timeout');
//       }
//       throw error;
//     }
//   },

//   async sendWithRetry(payload: WebhookPayload, retries = WEBHOOK_CONFIG.retryAttempts): Promise<WebhookResponse> {
//     console.log('🔄 sendWithRetry received payload:', JSON.stringify(payload, null, 2));
//     let lastError: Error | null = null;

//     for (let attempt = 0; attempt < retries; attempt++) {
//       try {
//         return await this.sendToWebhook(payload);
//       } catch (error) {
//         lastError = error instanceof Error ? error : new Error('Unknown error');
//         if (attempt < retries - 1) {
//           await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
//         }
//       }
//     }

//     throw lastError || new Error('Webhook submission failed after retries');
//   },
// };

import { WEBHOOK_CONFIG, getWebhookHeaders } from '../config/webhooks';
import { WebhookPayload, WebhookResponse, FormData } from '../types';
import { detectVCPlatform } from '../config/constants';

export const webhookService = {
  transformFormDataToPayload(formData: FormData): WebhookPayload {
    const customParamNames = formData.customParameters?.map(p => p.name) || [];
    const selectedParams = [...(formData.selectedParameters || []), ...customParamNames];

    const isVC = formData.mediaType === 'video';
    const mediaUrl = isVC ? (formData.vcUrl || '') : (formData.audioUrl || '');
    const vcPlatform = isVC ? detectVCPlatform(mediaUrl) : undefined;

    const payload: WebhookPayload = {
      email: formData.email || undefined,
      notification_email: formData.notificationEmail || undefined,
      analyst_name: formData.analystName || '',
      call_id: formData.callId || '',
      call_duration: formData.callDuration ? this.parseTimeToSeconds(formData.callDuration) : 0,
      call_type: formData.callType,
      notes: formData.notes || undefined,
      audio: {
        filename: 'audio_url',
        size: 0,
        url: mediaUrl,
      },
      selected_parameters: selectedParams,
      custom_parameters: formData.customParameters || [],
      media_type: formData.mediaType || 'audio',
      vc_platform: vcPlatform,
      lead_stage: formData.leadStage,
      lsq_link: formData.lsqLink,
    };

    return payload;
  },

  parseTimeToSeconds(timeStr: string): number {
    const parts = timeStr.split(':').map(Number);
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    return 0;
  },

  async sendToWebhook(payload: WebhookPayload): Promise<WebhookResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), WEBHOOK_CONFIG.timeout);

    try {
      console.log('🌐 Sending webhook to:', WEBHOOK_CONFIG.n8n_url);
      console.log('📦 Webhook payload:', JSON.stringify(payload, null, 2));
      
      const response = await fetch(WEBHOOK_CONFIG.n8n_url, {
        method: 'POST',
        headers: getWebhookHeaders(),
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('📍 Webhook response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Webhook error response:', errorText);
        throw new Error(`Webhook error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      return (await response.json()) as WebhookResponse;
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('🔴 Webhook request failed:', error);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Webhook request timeout');
      }
      throw error;
    }
  },

  async sendWithRetry(payload: WebhookPayload, retries = WEBHOOK_CONFIG.retryAttempts): Promise<WebhookResponse> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        console.log(`🔄 Webhook attempt ${attempt + 1}/${retries}`);
        return await this.sendToWebhook(payload);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        console.error(`❌ Attempt ${attempt + 1} failed:`, lastError.message);
        if (attempt < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    console.error('💥 All webhook retries failed:', lastError?.message);
    throw lastError || new Error('Webhook submission failed after retries');
  },
};