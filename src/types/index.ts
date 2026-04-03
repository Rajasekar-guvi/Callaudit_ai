// export type Role = 'admin' | 'user';
// export type CallType = 'inbound' | 'outbound';

// export type AuditStatus =
//   | 'pending'
//   | 'processing'
//   | 'passed'
//   | 'failed'
//   | 'flagged';

// export interface AuditSubmission {
//   id: string;

//   // Email is now tracked for all submissions
//   email?: string;

//   // Optional because Bolt UI allows audit without these
//   analyst_name?: string;
//   call_id?: string;

//   call_duration: number;
//   call_type: CallType;

//   notes?: string;

//   audio_filename?: string;
//   audio_size?: number;
//   audio_url?: string;

//   status: AuditStatus;

//   compliance_score?: number;
//   violations?: Violation[];

//   // 🆕 Enhanced audit details from n8n
//   transcript?: string;                    // Full audio transcript
//   spoken_evidence?: string[];             // Flagged phrases
//   observations?: string;                  // AI recommendations

//   webhook_response?: WebhookResponse;
//   webhook_sent?: boolean;
//   error_message?: string;

//   created_at: string;
//   updated_at: string;
// }

// export interface Violation {
//   type: string;
//   description: string;
//   severity?: 'low' | 'medium' | 'high';
//   timestamp?: number;
// }

// export interface WebhookPayload {
//   submission_id?: string;
//   email?: string;
//   notification_email?: string;
//   analyst_name?: string;
//   call_id?: string;
//   call_duration: number;
//   call_type: CallType;
//   notes?: string;
//   audio: {
//     filename: string;
//     size: number;
//     url: string;
//   };
// }

// export interface WebhookResponse {
//   success: boolean;
//   status: AuditStatus;
//   compliance_score: number;
//   violations?: Violation[];
//   processing_time_ms?: number;
//   error?: string;
// }

// export interface FormData {
//   email: string;
//   audioUrl: string;

//   analystName?: string;
//   callId?: string;
//   callDuration?: string;
//   notificationEmail?: string;

//   callType: CallType;
//   notes?: string;
// }

// export interface ValidationError {
//   field: string;
//   message: string;
// }

// export interface Toast {
//   id: string;
//   type: 'success' | 'error' | 'info';
//   message: string;
// }

export type Role = 'admin' | 'user';
export type CallType = 'inbound' | 'outbound';

export type AuditStatus =
  | 'pending'
  | 'processing'
  | 'passed'
  | 'failed'
  | 'flagged';

export interface AuditSubmission {
  id: string;
  email?: string;
  analyst_name?: string;
  call_id?: string;
  call_duration: number;
  call_type: CallType;
  notes?: string;
  audio_filename?: string;
  audio_size?: number;
  audio_url?: string;
  status: AuditStatus;
  compliance_score?: number;
  violations?: Violation[];
  transcript?: string;
  spoken_evidence?: string[];
  observations?: string;
  webhook_response?: WebhookResponse;
  webhook_sent?: boolean;
  error_message?: string;

  // ── New parameter fields ──────────────────────
  selected_parameters?: string[];   // analyst selected before submit
  parameter_scores?: Record<string, string>; // n8n scores per param

  created_at: string;
  updated_at: string;
}

export interface Violation {
  type: string;
  description: string;
  severity?: 'low' | 'medium' | 'high';
  timestamp?: number;
}

export interface WebhookPayload {
  submission_id?: string;
  email?: string;
  notification_email?: string;
  analyst_name?: string;
  call_id?: string;
  call_duration: number;
  call_type: CallType;
  notes?: string;
  audio: {
    filename: string;
    size: number;
    url: string;
  };
  selected_parameters?: string[]; // ── sent to n8n
}

export interface WebhookResponse {
  success: boolean;
  status: AuditStatus;
  compliance_score: number;
  violations?: Violation[];
  processing_time_ms?: number;
  error?: string;
}

export interface CustomParameter {
  id: string;
  name: string;
  description?: string;
}

export interface FormData {
  email: string;
  audioUrl: string;
  analystName?: string;
  callId?: string;
  callDuration?: string;
  notificationEmail?: string;
  callType: CallType;
  notes?: string;
  selectedParameters?: string[]; // ── analyst selection
  customParameters?: CustomParameter[]; // ── user-defined parameters for this submission only
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

// export type Role = 'admin' | 'user';

// export type CallType = 'inbound' | 'outbound';

// export type AuditStatus =
//   | 'pending'
//   | 'processing'
//   | 'passed'
//   | 'failed'
//   | 'flagged';

// /**
//  * MAIN AUDIT SUBMISSION TYPE
//  * Compatible with:
//  * - Supabase nullable fields
//  * - Bolt optional UI
//  * - n8n webhook processing
//  */
// export interface AuditSubmission {
//   id: string;

//   agent_name?: string | null;
//   call_id?: string | null;

//   call_duration: number;
//   call_type: CallType;

//   notes?: string | null;

//   audio_filename?: string | null;
//   audio_size?: number | null;
//   audio_url?: string | null;

//   status: AuditStatus;

//   compliance_score?: number | null;
//   violations?: Violation[] | null;

//   webhook_response?: WebhookResponse | null;

//   created_at: string;
//   updated_at: string;
// }

// /**
//  * VIOLATION DETAILS
//  */
// export interface Violation {
//   type: string;
//   description: string;
//   severity?: 'low' | 'medium' | 'high';
//   timestamp?: number;
// }

// /**
//  * PAYLOAD SENT TO n8n WEBHOOK
//  */
// export interface WebhookPayload {
//   agent_name?: string;
//   call_id?: string;
//   call_duration: number;
//   call_type: CallType;
//   notes?: string;
//   audio: {
//     filename: string;
//     size: number;
//     url: string;
//   };
// }

// /**
//  * RESPONSE FROM n8n → BACK TO SUPABASE
//  */
// export interface WebhookResponse {
//   success: boolean;
//   status: AuditStatus;
//   compliance_score: number;
//   violations?: Violation[];
//   processing_time_ms?: number;
//   error?: string;
// }

// /**
//  * BOLT UI FORM DATA
//  */
// export interface FormData {
//   email?: string;
//   audioUrl?: string;

//   agentName?: string;
//   callId?: string;
//   callDuration?: string;

//   callType: CallType;
//   notes?: string;
// }

// /**
//  * VALIDATION ERROR FORMAT
//  */
// export interface ValidationError {
//   field: string;
//   message: string;
// }

// /**
//  * TOAST NOTIFICATIONS
//  */
// export interface Toast {
//   id: string;
//   type: 'success' | 'error' | 'info';
//   message: string;
// }
