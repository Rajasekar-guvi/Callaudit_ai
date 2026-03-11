export const WEBHOOK_CONFIG = {
  n8n_url: import.meta.env.VITE_N8N_WEBHOOK_URL || `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/call-audit-webhook`,
  timeout: 30000,
  retryAttempts: 3,
};

export const getWebhookHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
});