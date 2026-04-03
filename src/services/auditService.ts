
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

  async getSubmissions(limit = 100): Promise<AuditSubmission[]> {
    if (!navigator.onLine) return [];
    const { data, error } = await supabase
      .from('audit_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  },

  async getSubmissionById(id: string): Promise<AuditSubmission | null> {
    const { data, error } = await supabase
      .from('audit_submissions')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  // ── Check if audio URL exists in last 24 hours ────────
  async checkAudioUrlDuplicate(audioUrl: string): Promise<{ isDuplicate: boolean; submittedAt?: string; submissionId?: string }> {
    if (!audioUrl) return { isDuplicate: false };
    
    // Get submissions from last 24 hours with this URL
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    const { data, error } = await supabase
      .from('audit_submissions')
      .select('id, created_at')
      .eq('audio_url', audioUrl)
      .gt('created_at', twentyFourHoursAgo)
      .order('created_at', { ascending: false })
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

  // ── Realtime subscription with status monitoring ────────
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
            callback({
              type: payload.eventType as any,
              record: payload.new as AuditSubmission,
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
    const total      = submissions.length;
    const passed     = submissions.filter((s) => s.status === 'passed').length;
    const failed     = submissions.filter((s) => s.status === 'failed').length;
    const flagged    = submissions.filter((s) => s.status === 'flagged').length;
    const validScores = submissions.filter(
      (s) => s.compliance_score !== null && s.compliance_score !== undefined
    );
    const averageScore = validScores.length > 0
      ? Math.round(validScores.reduce((sum, s) => sum + (s.compliance_score || 0), 0) / validScores.length)
      : 0;

    return { total, passed, failed, flagged, averageScore };
  },
};