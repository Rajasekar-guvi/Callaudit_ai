
// import { supabase } from './supabaseClient';
// import { AuditSubmission, WebhookResponse, AuditStatus } from '../types';

// export const auditService = {
//   async createSubmission(data: {
//     email?: string;
//     analyst_name?: string;
//     call_id?: string;
//     call_duration: number;
//     call_type: 'inbound' | 'outbound';
//     notes?: string;
//     audio_filename?: string;
//     audio_size?: number;
//     audio_url?: string;
//   }): Promise<AuditSubmission> {
//     const { data: result, error } = await supabase
//       .from('audit_submissions')
//       .insert([{ ...data, status: 'pending' }])
//       .select()
//       .maybeSingle();

//     if (error) throw error;
//     if (!result) throw new Error('Failed to create submission');

//     return result;
//   },

//   async getSubmissions(limit = 50): Promise<AuditSubmission[]> {
//     if (!navigator.onLine) return [];

//     const { data, error } = await supabase
//       .from('audit_submissions')
//       .select('*')
//       .order('created_at', { ascending: false })
//       .limit(limit);

//     if (error) throw error;
//     return data || [];
//   },

//   async getSubmissionById(id: string): Promise<AuditSubmission | null> {
//     const { data, error } = await supabase
//       .from('audit_submissions')
//       .select('*')
//       .eq('id', id)
//       .maybeSingle();

//     if (error) throw error;
//     return data;
//   },

//   async updateSubmissionWithWebhookResponse(
//     id: string,
//     webhookResponse: WebhookResponse
//   ): Promise<AuditSubmission> {
//     const validStatus: AuditStatus =
//       webhookResponse.status === 'passed' ||
//       webhookResponse.status === 'failed' ||
//       webhookResponse.status === 'flagged'
//         ? webhookResponse.status
//         : 'failed';

//     const { data: result, error } = await supabase
//       .from('audit_submissions')
//       .update({
//         status: validStatus,
//         compliance_score: webhookResponse.compliance_score ?? 0,
//         violations: webhookResponse.violations ?? [],
//         webhook_response: webhookResponse,
//         updated_at: new Date().toISOString(),
//       })
//       .eq('id', id)
//       .select()
//       .maybeSingle();

//     if (error) throw error;
//     if (!result) throw new Error('Failed to update submission');

//     return result;
//   },

//   async checkCallIdExists(callId?: string): Promise<boolean> {
//     if (!callId) return false;

//     const { data, error } = await supabase
//       .from('audit_submissions')
//       .select('id')
//       .eq('call_id', callId)
//       .maybeSingle();

//     if (error && error.code !== 'PGRST116') throw error;
//     return !!data;
//   },

//   /**
//    * 🚀 PRODUCTION REALTIME SUBSCRIPTION
//    * delta update system — no full refetch
//    */
//   subscribeToSubmissions(
//     callback: (payload: {
//       type: 'INSERT' | 'UPDATE' | 'DELETE';
//       record: AuditSubmission;
//     }) => void
//   ) {
//     const channel = supabase
//       .channel('audit_submissions_realtime')
//       .on(
//         'postgres_changes',
//         { event: '*', schema: 'public', table: 'audit_submissions' },
//         (payload) => {
//           try {
//             callback({
//               type: payload.eventType as any,
//               record: payload.new as AuditSubmission,
//             });
//           } catch (err) {
//             console.error('Realtime processing error:', err);
//           }
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   },

//   async getComplianceTrend(
//     days: number
//   ): Promise<Array<{ date: string; score: number }>> {
//     const { data, error } = await supabase
//       .from('audit_submissions')
//       .select('created_at, compliance_score')
//       .gt(
//         'created_at',
//         new Date(Date.now() - days * 86400000).toISOString()
//       )
//       .order('created_at', { ascending: true });

//     if (error) throw error;

//     const grouped = (data || []).reduce(
//       (acc, item) => {
//         if (item.compliance_score === null || item.compliance_score === undefined)
//           return acc;

//         const date = new Date(item.created_at).toISOString().split('T')[0];
//         if (!acc[date]) acc[date] = [];
//         acc[date].push(item.compliance_score);
//         return acc;
//       },
//       {} as Record<string, number[]>
//     );

//     return Object.entries(grouped).map(([date, scores]) => ({
//       date,
//       score: Math.round(
//         scores.reduce((a, b) => a + b, 0) / scores.length
//       ),
//     }));
//   },

//   async getAuditStats() {
//     const { data, error } = await supabase
//       .from('audit_submissions')
//       .select('status, compliance_score');

//     if (error) throw error;

//     const submissions = data || [];

//     const total = submissions.length;
//     const passed = submissions.filter((s) => s.status === 'passed').length;
//     const failed = submissions.filter((s) => s.status === 'failed').length;
//     const flagged = submissions.filter((s) => s.status === 'flagged').length;

//     const validScores = submissions.filter(
//       (s) => s.compliance_score !== null && s.compliance_score !== undefined
//     );

//     const averageScore =
//       validScores.length > 0
//         ? Math.round(
//             validScores.reduce(
//               (sum, s) => sum + (s.compliance_score || 0),
//               0
//             ) / validScores.length
//           )
//         : 0;

//     return {
//       total,
//       passed,
//       failed,
//       flagged,
//       averageScore,
//     };
//   },
// };


//import { supabase } from './supabaseClient';
// import { AuditSubmission, WebhookResponse, AuditStatus } from '../types';

// export const auditService = {
//   async createSubmission(data: {
//     email?: string;
//     analyst_name?: string;
//     call_id?: string;
//     call_duration: number;
//     call_type: 'inbound' | 'outbound';
//     notes?: string;
//     audio_filename?: string;
//     audio_size?: number;
//     audio_url?: string;
//   }): Promise<AuditSubmission> {
//     const { data: result, error } = await supabase
//       .from('audit_submissions')
//       .insert([{ ...data, status: 'pending', webhook_sent: false }])
//       .select()
//       .maybeSingle();

//     if (error) throw error;
//     if (!result) throw new Error('Failed to create submission');
//     return result;
//   },

//   // ✅ Called after webhook fires successfully
//   async markWebhookSent(id: string): Promise<void> {
//     const { error } = await supabase
//       .from('audit_submissions')
//       .update({ webhook_sent: true })
//       .eq('id', id);
//     if (error) console.error('markWebhookSent failed:', error);
//   },

//   // ✅ Option A — overwrite same row for retry
//   async resetForRetry(id: string): Promise<void> {
//     const { error } = await supabase
//       .from('audit_submissions')
//       .update({
//         status: 'pending',
//         webhook_sent: false,
//         error_message: null,
//         compliance_score: null,
//         violations: null,
//         updated_at: new Date().toISOString(),
//       })
//       .eq('id', id);
//     if (error) throw error;
//   },

//   async getSubmissions(limit = 50): Promise<AuditSubmission[]> {
//     if (!navigator.onLine) return [];
//     const { data, error } = await supabase
//       .from('audit_submissions')
//       .select('*')
//       .order('created_at', { ascending: false })
//       .limit(limit);
//     if (error) throw error;
//     return data || [];
//   },

//   async getSubmissionById(id: string): Promise<AuditSubmission | null> {
//     const { data, error } = await supabase
//       .from('audit_submissions')
//       .select('*')
//       .eq('id', id)
//       .maybeSingle();
//     if (error) throw error;
//     return data;
//   },

//   async updateSubmissionWithWebhookResponse(
//     id: string,
//     webhookResponse: WebhookResponse
//   ): Promise<AuditSubmission> {
//     const validStatus: AuditStatus =
//       webhookResponse.status === 'passed' ||
//       webhookResponse.status === 'failed' ||
//       webhookResponse.status === 'flagged'
//         ? webhookResponse.status
//         : 'failed';

//     const { data: result, error } = await supabase
//       .from('audit_submissions')
//       .update({
//         status: validStatus,
//         compliance_score: webhookResponse.compliance_score ?? 0,
//         violations: webhookResponse.violations ?? [],
//         webhook_response: webhookResponse,
//         updated_at: new Date().toISOString(),
//       })
//       .eq('id', id)
//       .select()
//       .maybeSingle();

//     if (error) throw error;
//     if (!result) throw new Error('Failed to update submission');
//     return result;
//   },

//   async checkCallIdExists(callId?: string): Promise<boolean> {
//     if (!callId) return false;
//     const { data, error } = await supabase
//       .from('audit_submissions')
//       .select('id')
//       .eq('call_id', callId)
//       .maybeSingle();
//     if (error && error.code !== 'PGRST116') throw error;
//     return !!data;
//   },

//   subscribeToSubmissions(
//     callback: (payload: {
//       type: 'INSERT' | 'UPDATE' | 'DELETE';
//       record: AuditSubmission;
//     }) => void
//   ) {
//     const channel = supabase
//       .channel('audit_submissions_realtime')
//       .on(
//         'postgres_changes',
//         { event: '*', schema: 'public', table: 'audit_submissions' },
//         (payload) => {
//           try {
//             callback({
//               type: payload.eventType as any,
//               record: payload.new as AuditSubmission,
//             });
//           } catch (err) {
//             console.error('Realtime processing error:', err);
//           }
//         }
//       )
//       .subscribe();
//     return () => { supabase.removeChannel(channel); };
//   },

//   async getComplianceTrend(days: number): Promise<Array<{ date: string; score: number }>> {
//     const { data, error } = await supabase
//       .from('audit_submissions')
//       .select('created_at, compliance_score')
//       .gt('created_at', new Date(Date.now() - days * 86400000).toISOString())
//       .order('created_at', { ascending: true });
//     if (error) throw error;

//     const grouped = (data || []).reduce((acc, item) => {
//       if (item.compliance_score === null || item.compliance_score === undefined) return acc;
//       const date = new Date(item.created_at).toISOString().split('T')[0];
//       if (!acc[date]) acc[date] = [];
//       acc[date].push(item.compliance_score);
//       return acc;
//     }, {} as Record<string, number[]>);

//     return Object.entries(grouped).map(([date, scores]) => ({
//       date,
//       score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
//     }));
//   },

//   async getAuditStats() {
//     const { data, error } = await supabase
//       .from('audit_submissions')
//       .select('status, compliance_score');
//     if (error) throw error;

//     const submissions = data || [];
//     const total = submissions.length;
//     const passed = submissions.filter((s) => s.status === 'passed').length;
//     const failed = submissions.filter((s) => s.status === 'failed').length;
//     const flagged = submissions.filter((s) => s.status === 'flagged').length;
//     const validScores = submissions.filter(
//       (s) => s.compliance_score !== null && s.compliance_score !== undefined
//     );
//     const averageScore = validScores.length > 0
//       ? Math.round(validScores.reduce((sum, s) => sum + (s.compliance_score || 0), 0) / validScores.length)
//       : 0;

//     return { total, passed, failed, flagged, averageScore };
//   },
// };


// import { supabase } from './supabaseClient';
// import { AuditSubmission, WebhookResponse, AuditStatus } from '../types';

// export const auditService = {

//   async createSubmission(data: {
//     email?: string;
//     analyst_name?: string;
//     call_id?: string;
//     call_duration: number;
//     call_type: 'inbound' | 'outbound';
//     notes?: string;
//     audio_filename?: string;
//     audio_size?: number;
//     audio_url?: string;
//     selected_parameters?: string[];
//     custom_parameters?: any[];
//     media_type?: 'audio' | 'video';
//     vc_platform?: string;
//     lead_stage?: string;
//     lsq_link?: string;
//   }): Promise<AuditSubmission> {
//     const { data: result, error } = await supabase
//       .from('audit_submissions')
//       .insert([{ ...data, status: 'pending', webhook_sent: false }])
//       .select()
//       .maybeSingle();
//     if (error) throw error;
//     if (!result) throw new Error('Failed to create submission');
//     return result;
//   },

//   async markWebhookSent(id: string): Promise<void> {
//     const { error } = await supabase
//       .from('audit_submissions')
//       .update({ webhook_sent: true })
//       .eq('id', id);
//     if (error) console.error('markWebhookSent failed:', error);
//   },

//   async saveWebhookError(id: string, errorMessage: string): Promise<void> {
//     const { error } = await supabase
//       .from('audit_submissions')
//       .update({ 
//         webhook_sent: false,
//         error_message: errorMessage,
//         status: 'pending'
//       })
//       .eq('id', id);
//     if (error) console.error('saveWebhookError failed:', error);
//   },

//   async resetForRetry(id: string): Promise<void> {
//     const { error } = await supabase
//       .from('audit_submissions')
//       .update({
//         status: 'pending',
//         webhook_sent: false,
//         error_message: null,
//         compliance_score: null,
//         violations: null,
//         updated_at: new Date().toISOString(),
//       })
//       .eq('id', id);
//     if (error) throw error;
//   },

//   async getSubmissions(limit = 50, offset = 0): Promise<AuditSubmission[]> {
//     if (!navigator.onLine) return [];
//     // ✅ Select only essential columns + new lead fields to reduce egress
//     const { data, error } = await supabase
//       .from('audit_submissions')
//       .select('id, email, call_id, audio_url, status, compliance_score, created_at, call_duration, analyst_name, call_type, updated_at, lead_stage, lsq_link,call_observations')
//       .order('created_at', { ascending: false })
//       .range(offset, offset + limit - 1);
//     if (error) throw error;
//     return (data || []) as AuditSubmission[];
//   },

//   // ✅ Light version for summary views (small payload, reduces egress ~70%)
//   async getSubmissionById(id: string): Promise<AuditSubmission | null> {
//     const { data, error } = await supabase
//       .from('audit_submissions')
//       .select('id, email, call_id, audio_url, status, compliance_score, created_at, call_duration, analyst_name, call_type, updated_at, notes, lead_stage, lsq_link')
//       .eq('id', id)
//       .maybeSingle();
//     if (error) throw error;
//     return (data || null) as AuditSubmission | null;
//   },

//   // ✅ FULL version for detail drawer (includes transcript, violations, analysis)
// async getSubmissionByIdFull(id: string): Promise<AuditSubmission | null> {
//   const { data, error } = await supabase
//     .from('audit_submissions')
//     .select(`
//       id,
//       email,
//       analyst_name,
//       call_id,
//       call_duration,
//       call_type,
//       notes,
//       audio_url,
//       status,
//       compliance_score,
//       violations,
//       transcript,
//       transcript_url,
//       spoken_evidence,
//       webhook_response,
//       webhook_sent,
//       error_message,
//       call_observations,
//       selected_parameters,
//       parameter_scores,
//       media_type,
//       vc_platform,
//       lead_stage,
//       lsq_link,
//       created_at,
//       updated_at
//     `)
//     .eq('id', id)
//     .maybeSingle();

//   if (error) throw error;
//   return data;
// },


//   // ✅ Lightweight version for list views (reduces egress ~70%)
//   async getSubmissionsLight(limit = 50, offset = 0): Promise<Partial<AuditSubmission>[]> {
//     if (!navigator.onLine) return [];
//     const { data, error } = await supabase
//       .from('audit_submissions')
//       .select('id, email, status, compliance_score, created_at, call_id')
//       .order('created_at', { ascending: false })
//       .range(offset, offset + limit - 1);
//     if (error) throw error;
//     return data || [];
//   },

//   // ── Check if audio URL already submitted (last 24 hours) ─
//   async checkAudioUrlDuplicate(audioUrl: string): Promise<{
//     isDuplicate: boolean;
//     submittedAt?: string;
//     submissionId?: string;
//   }> {
//     if (!audioUrl) return { isDuplicate: false };

//     const twentyFourHoursAgo = new Date(
//       Date.now() - 24 * 60 * 60 * 1000
//     ).toISOString();

//     const { data, error } = await supabase
//       .from('audit_submissions')
//       .select('id, created_at')
//       .eq('audio_url', audioUrl)
//       .gt('created_at', twentyFourHoursAgo)
//       .order('created_at', { ascending: false })
//       .limit(1)
//       .maybeSingle();

//     if (error && error.code !== 'PGRST116') throw error;

//     if (data) {
//       return {
//         isDuplicate: true,
//         submittedAt: data.created_at,
//         submissionId: data.id,
//       };
//     }

//     return { isDuplicate: false };
//   },

//   // ── Alias for bulk validation ─────────────────────────────
//   async checkAudioUrlExists(audioUrl: string): Promise<{
//     isDuplicate: boolean;
//     submittedAt?: string;
//     submissionId?: string;
//   }> {
//     return this.checkAudioUrlDuplicate(audioUrl);
//   },

//   async checkCallIdExists(callId?: string): Promise<boolean> {
//     if (!callId) return false;
//     const { data, error } = await supabase
//       .from('audit_submissions')
//       .select('id')
//       .eq('call_id', callId)
//       .maybeSingle();
//     if (error && error.code !== 'PGRST116') throw error;
//     return !!data;
//   },

//   async updateSubmissionWithWebhookResponse(
//     id: string,
//     webhookResponse: WebhookResponse
//   ): Promise<AuditSubmission> {
//     const validStatus: AuditStatus =
//       webhookResponse.status === 'passed' ||
//       webhookResponse.status === 'failed' ||
//       webhookResponse.status === 'flagged'
//         ? webhookResponse.status
//         : 'failed';

//     const { data: result, error } = await supabase
//       .from('audit_submissions')
//       .update({
//         status: validStatus,
//         compliance_score: webhookResponse.compliance_score ?? 0,
//         violations: webhookResponse.violations ?? [],
//         webhook_response: webhookResponse,
//         updated_at: new Date().toISOString(),
//       })
//       .eq('id', id)
//       .select()
//       .maybeSingle();
//     if (error) throw error;
//     if (!result) throw new Error('Failed to update submission');
//     return result;
//   },

//   // ── Realtime subscription with status monitoring (optimized for low egress) ────────
//   subscribeToSubmissions(
//     callback: (payload: {
//       type: 'INSERT' | 'UPDATE' | 'DELETE';
//       record: AuditSubmission;
//     }) => void,
//     onReconnectNeeded?: () => void
//   ) {
//     const channelName = `audit_submissions_${Date.now()}`;
//     const channel = supabase
//       .channel(channelName)
//       .on(
//         'postgres_changes',
//         { event: '*', schema: 'public', table: 'audit_submissions' },
//         (payload) => {
//           try {
//             // ✅ Only include essential fields to reduce egress
//             const newData = payload.new as any;
//             const record = {
//               id: newData?.id,
//               status: newData?.status,
//               compliance_score: newData?.compliance_score,
//               email: newData?.email,
//               created_at: newData?.created_at,
//             } as AuditSubmission;
            
//             callback({
//               type: payload.eventType as any,
//               record,
//             });
//           } catch (err) {
//             console.error('Realtime processing error:', err);
//           }
//         }
//       )
//       .subscribe((status) => {
//         if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
//           console.warn('Realtime channel dropped:', status);
//           onReconnectNeeded?.();
//         }
//       });
//     return () => { supabase.removeChannel(channel); };
//   },

//   async getComplianceTrend(days: number): Promise<Array<{ date: string; score: number }>> {
//     const { data, error } = await supabase
//       .from('audit_submissions')
//       .select('created_at, compliance_score')
//       .gt('created_at', new Date(Date.now() - days * 86400000).toISOString())
//       .order('created_at', { ascending: true });
//     if (error) throw error;

//     const grouped = (data || []).reduce((acc, item) => {
//       if (item.compliance_score === null || item.compliance_score === undefined) return acc;
//       const date = new Date(item.created_at).toISOString().split('T')[0];
//       if (!acc[date]) acc[date] = [];
//       acc[date].push(item.compliance_score);
//       return acc;
//     }, {} as Record<string, number[]>);

//     return Object.entries(grouped).map(([date, scores]) => ({
//       date,
//       score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
//     }));
//   },

//   async getAuditStats() {
//     const { data, error } = await supabase
//       .from('audit_submissions')
//       .select('status, compliance_score');
//     if (error) throw error;

//     const submissions = data || [];
//     const total       = submissions.length;
//     const passed      = submissions.filter(s => s.status === 'passed').length;
//     const failed      = submissions.filter(s => s.status === 'failed').length;
//     const flagged     = submissions.filter(s => s.status === 'flagged').length;
//     const validScores = submissions.filter(
//       s => s.compliance_score !== null && s.compliance_score !== undefined
//     );
//     const averageScore = validScores.length > 0
//       ? Math.round(validScores.reduce((sum, s) => sum + (s.compliance_score || 0), 0) / validScores.length)
//       : 0;

//     return { total, passed, failed, flagged, averageScore };
//   },
// };

import { supabase } from './supabaseClient';
import { AuditSubmission, WebhookResponse, AuditStatus } from '../types';

export const auditService = {

  async createSubmission(data: {
    email?: string;
    analyst_name?: string;
    call_id?: string;
    call_duration: number;
    call_type: 'inbound' | 'outbound';
    notes?: string;
    audio_filename?: string;
    audio_size?: number;
    audio_url?: string;
    selected_parameters?: string[];
    custom_parameters?: any[];
    media_type?: 'audio' | 'video';
    vc_platform?: string;
    lead_stage?: string;
    lsq_link?: string;
  }): Promise<AuditSubmission> {
    const { data: result, error } = await supabase
      .from('audit_submissions')
      .insert([{ ...data, status: 'pending', webhook_sent: false }])
      .select()
      .maybeSingle();
    if (error) throw error;
    if (!result) throw new Error('Failed to create submission');
    return result;
  },

  async markWebhookSent(id: string): Promise<void> {
    const { error } = await supabase
      .from('audit_submissions')
      .update({ webhook_sent: true })
      .eq('id', id);
    if (error) console.error('markWebhookSent failed:', error);
  },

  async saveWebhookError(id: string, errorMessage: string): Promise<void> {
    const { error } = await supabase
      .from('audit_submissions')
      .update({ 
        webhook_sent: false,
        error_message: errorMessage,
        status: 'pending'
      })
      .eq('id', id);
    if (error) console.error('saveWebhookError failed:', error);
  },

  async resetForRetry(id: string): Promise<void> {
    const { error } = await supabase
      .from('audit_submissions')
      .update({
        status: 'pending',
        webhook_sent: false,
        error_message: null,
        compliance_score: null,
        violations: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
    if (error) throw error;
  },

  async getSubmissions(limit = 50, offset = 0): Promise<AuditSubmission[]> {
    if (!navigator.onLine) return [];
    const { data, error } = await supabase
      .from('audit_submissions')
      .select('id, email, call_id, audio_url, status, compliance_score, created_at, call_duration, analyst_name, call_type, updated_at, lead_stage, lsq_link, call_observations, webhook_sent, error_message, selected_parameters, media_type, notes')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    if (error) throw error;
    return (data || []) as AuditSubmission[];
  },

  async getSubmissionById(id: string): Promise<AuditSubmission | null> {
    const { data, error } = await supabase
      .from('audit_submissions')
      .select('id, email, call_id, audio_url, status, compliance_score, created_at, call_duration, analyst_name, call_type, updated_at, notes, lead_stage, lsq_link, webhook_sent, error_message, selected_parameters, media_type')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return (data || null) as AuditSubmission | null;
  },

  // ── Full row for detail drawer ─────────────────────────
  // Handles 3 scenarios without breaking anything:
  //   1. Old audits → transcript in DB column → shows directly ✅
  //   2. New audits → path stored in transcript_url → full URL constructed ✅
  //   3. No transcript → shows nothing gracefully ✅
  async getSubmissionByIdFull(id: string): Promise<AuditSubmission | null> {
    const { data, error } = await supabase
      .from('audit_submissions')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;

    const row = data as any;

    // Scenario 2: New audit — transcript_url is a storage path
    // Could be stored as:
    //   full URL: https://rvycdlitikppm.supabase.co/storage/v1/object/public/transcripts/...
    //   OR path:  transcripts/transcript_abc123
    if (row.transcript_url && !row.transcript) {
      try {
        // Build full URL if only path is stored
        const isFullUrl = row.transcript_url.startsWith('http');
        const fetchUrl = isFullUrl
          ? row.transcript_url
          : `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${row.transcript_url}`;

        const res = await fetch(fetchUrl);
        if (res.ok) {
          row.transcript = await res.text();
        }
      } catch {
        // Storage fetch failed → transcript stays null
        // Drawer handles null gracefully
      }
    }

    // Scenario 1: Old audit — transcript in DB column → no change needed
    // Scenario 3: No transcript anywhere → null → drawer shows nothing

    return row as AuditSubmission;
  },

  async getSubmissionsLight(limit = 50, offset = 0): Promise<Partial<AuditSubmission>[]> {
    if (!navigator.onLine) return [];
    const { data, error } = await supabase
      .from('audit_submissions')
      .select('id, email, status, compliance_score, created_at, call_id')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    if (error) throw error;
    return data || [];
  },

  async checkAudioUrlDuplicate(audioUrl: string): Promise<{
    isDuplicate: boolean;
    submittedAt?: string;
    submissionId?: string;
  }> {
    if (!audioUrl) return { isDuplicate: false };

    const twentyFourHoursAgo = new Date(
      Date.now() - 24 * 60 * 60 * 1000
    ).toISOString();

    const { data, error } = await supabase
      .from('audit_submissions')
      .select('id, created_at')
      .eq('audio_url', audioUrl)
      .gt('created_at', twentyFourHoursAgo)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;

    if (data) {
      return {
        isDuplicate: true,
        submittedAt: data.created_at,
        submissionId: data.id,
      };
    }

    return { isDuplicate: false };
  },

  async checkAudioUrlExists(audioUrl: string): Promise<{
    isDuplicate: boolean;
    submittedAt?: string;
    submissionId?: string;
  }> {
    return this.checkAudioUrlDuplicate(audioUrl);
  },

  async checkCallIdExists(callId?: string): Promise<boolean> {
    if (!callId) return false;
    const { data, error } = await supabase
      .from('audit_submissions')
      .select('id')
      .eq('call_id', callId)
      .maybeSingle();
    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  },

  async updateSubmissionWithWebhookResponse(
    id: string,
    webhookResponse: WebhookResponse
  ): Promise<AuditSubmission> {
    const validStatus: AuditStatus =
      webhookResponse.status === 'passed' ||
      webhookResponse.status === 'failed' ||
      webhookResponse.status === 'flagged'
        ? webhookResponse.status
        : 'failed';

    const { data: result, error } = await supabase
      .from('audit_submissions')
      .update({
        status: validStatus,
        compliance_score: webhookResponse.compliance_score ?? 0,
        violations: webhookResponse.violations ?? [],
        webhook_response: webhookResponse,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) throw error;
    if (!result) throw new Error('Failed to update submission');
    return result;
  },

  subscribeToSubmissions(
    callback: (payload: {
      type: 'INSERT' | 'UPDATE' | 'DELETE';
      record: AuditSubmission;
    }) => void,
    onReconnectNeeded?: () => void
  ) {
    const channelName = `audit_submissions_${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'audit_submissions' },
        (payload) => {
          try {
            const newData = payload.new as any;
            // Strip heavy fields from realtime — saves egress
            // transcript/violations fetched only when drawer opens
            const record = {
              id: newData?.id,
              status: newData?.status,
              compliance_score: newData?.compliance_score,
              email: newData?.email,
              analyst_name: newData?.analyst_name,
              call_id: newData?.call_id,
              call_type: newData?.call_type,
              call_duration: newData?.call_duration,
              created_at: newData?.created_at,
              updated_at: newData?.updated_at,
              webhook_sent: newData?.webhook_sent,
              error_message: newData?.error_message,
              selected_parameters: newData?.selected_parameters,
              media_type: newData?.media_type,
              lead_stage: newData?.lead_stage,
              lsq_link: newData?.lsq_link,
              audio_url: newData?.audio_url,
              notes: newData?.notes,
            } as AuditSubmission;
            
            callback({
              type: payload.eventType as any,
              record,
            });
          } catch (err) {
            console.error('Realtime processing error:', err);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          console.warn('Realtime channel dropped:', status);
          onReconnectNeeded?.();
        }
      });
    return () => { supabase.removeChannel(channel); };
  },

  async getComplianceTrend(days: number): Promise<Array<{ date: string; score: number }>> {
    const { data, error } = await supabase
      .from('audit_submissions')
      .select('created_at, compliance_score')
      .gt('created_at', new Date(Date.now() - days * 86400000).toISOString())
      .order('created_at', { ascending: true });
    if (error) throw error;

    const grouped = (data || []).reduce((acc, item) => {
      if (item.compliance_score === null || item.compliance_score === undefined) return acc;
      const date = new Date(item.created_at).toISOString().split('T')[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(item.compliance_score);
      return acc;
    }, {} as Record<string, number[]>);

    return Object.entries(grouped).map(([date, scores]) => ({
      date,
      score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    }));
  },

  async getAuditStats() {
    const { data, error } = await supabase
      .from('audit_submissions')
      .select('status, compliance_score');
    if (error) throw error;

    const submissions = data || [];
    const total       = submissions.length;
    const passed      = submissions.filter(s => s.status === 'passed').length;
    const failed      = submissions.filter(s => s.status === 'failed').length;
    const flagged     = submissions.filter(s => s.status === 'flagged').length;
    const validScores = submissions.filter(
      s => s.compliance_score !== null && s.compliance_score !== undefined
    );
    const averageScore = validScores.length > 0
      ? Math.round(validScores.reduce((sum, s) => sum + (s.compliance_score || 0), 0) / validScores.length)
      : 0;

    return { total, passed, failed, flagged, averageScore };
  },
};