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
//   email?: string;
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
//   transcript?: string;
//   spoken_evidence?: string[];
//   observations?: string;
//   webhook_response?: WebhookResponse;
//   webhook_sent?: boolean;
//   error_message?: string;

//   // ── New parameter fields ──────────────────────
//   selected_parameters?: string[];   // analyst selected before submit
//   parameter_scores?: Record<string, string>; // n8n scores per param

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
//   selected_parameters?: string[]; // ── sent to n8n
//   custom_parameters?: CustomParameter[]; // ── custom params sent to n8n
// }

// export interface WebhookResponse {
//   success: boolean;
//   status: AuditStatus;
//   compliance_score: number;
//   violations?: Violation[];
//   processing_time_ms?: number;
//   error?: string;
// }

// export interface CustomParameter {
//   id: string;
//   name: string;
//   description?: string;
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
//   selectedParameters?: string[]; // ── analyst selection
//   customParameters?: CustomParameter[]; // ── user-defined parameters for this submission only
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
export type MediaType = 'audio' | 'video';
export type VCPlatform = 'zoom' | 'meet' | 'teams' | 'exotel' | 'other';
export type LeadStage = 'new-lead' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost' | 'on-hold';

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
  call_observations?: string;
  selected_parameters?: string[];
  parameter_scores?: Record<string, string>;
  // ── New media fields ──────────────────────────
  media_type?: MediaType;
  vc_platform?: VCPlatform;
  // ── New lead fields ───────────────────────────
  lead_stage?: LeadStage;
  lsq_link?: string;
  created_at: string;
  updated_at: string;
  transcript_url?: string;
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
  selected_parameters?: string[];
  custom_parameters?: CustomParameter[];
  // ── VC fields ────────────────────────────────
  media_type?: MediaType;
  vc_platform?: VCPlatform;
  // ── Lead fields ──────────────────────────────
  lead_stage?: LeadStage;
  lsq_link?: string;
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
  score?: number;  // Expected score (0-100) for this parameter
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
  selectedParameters?: string[];
  customParameters?: CustomParameter[];
  // ── New media fields ──────────────────────────
  mediaType?: MediaType;
  vcUrl?: string;
  vcPlatform?: VCPlatform;
  // ── New lead fields ───────────────────────────
  leadStage?: LeadStage;
  lsqLink?: string;
  transcriptUrl?: string
}

// ── Bulk submission types ─────────────────────────────────
export interface BulkUrlItem {
  url: string;
  status: 'pending' | 'valid' | 'duplicate' | 'invalid' | 'submitting' | 'submitted' | 'failed' | 'error' | 'completed';
  error?: string;
  isDuplicateInBatch?: boolean;  // ← True if same URL appears multiple times in this batch
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