import { WEBHOOK_CONFIG, getWebhookHeaders } from '../config/webhooks';
import { WebhookPayload, WebhookResponse, FormData } from '../types';

export const webhookService = {
  transformFormDataToPayload(formData: FormData): WebhookPayload {
    // Extract custom parameter names for webhook
    const customParamNames = formData.customParameters?.map(p => p.name) || [];
    
    return {
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
        url: formData.audioUrl,
      },
      selected_parameters: [...(formData.selectedParameters || []), ...customParamNames],
    };
  },

  parseTimeToSeconds(timeStr: string): number {
    const parts = timeStr.split(':').map(Number);
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return 0;
  },

  async sendToWebhook(payload: WebhookPayload): Promise<WebhookResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), WEBHOOK_CONFIG.timeout);

    try {
      const response = await fetch(WEBHOOK_CONFIG.n8n_url, {
        method: 'POST',
        headers: getWebhookHeaders(),
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Webhook error: ${response.statusText}`);
      }

      const data = (await response.json()) as WebhookResponse;
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
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
        return await this.sendToWebhook(payload);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        if (attempt < retries - 1) {
          await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    throw lastError || new Error('Webhook submission failed after retries');
  },
};
