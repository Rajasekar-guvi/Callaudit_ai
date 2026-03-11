export const VALIDATION_RULES = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  audioUrl: {
    pattern: /^https?:\/\/.+/,
  },
  analystName: {
    minLength: 2,
    maxLength: 100,
  },
  callId: {
    maxLength: 50,
    pattern: /^[a-zA-Z0-9-_]+$/,
  },
  notes: {
    maxLength: 2000,
  },
  audio: {
    maxSizeMB: 50,
  },
};

export const APP_CONFIG = {
  appName: 'CallAudit AI',
  siteName: 'AI Call Audit System',
  defaultPageSize: 10,
  debounceDelay: 300,
  toastDuration: 4000,
};

export const ALLOWED_AUDIO_DOMAINS = [
  'recordings.exotel.com',  // your current provider
  'storage.googleapis.com',
  'your-supabase-project.supabase.co'
];

export const CALL_TYPES = ['inbound', 'outbound'] as const;

export const AUDIT_STATUS = ['pending', 'passed', 'failed', 'flagged'] as const;
