# Supabase Parameter Flow & Inspection Guide

## 🔍 What Was Missing

The `selected_parameters` and `custom_parameters` columns were **NOT** in the Supabase database schema. We just created a new migration to add them.

## ✅ What We Fixed

1. **New Migration:** `20260407_add_parameters_columns.sql`
   - Adds `selected_parameters` (text array)
   - Adds `custom_parameters` (jsonb)
   - Adds `parameter_scores` (jsonb)
   - Creates indexes for fast lookups

2. **Updated auditService:**
   - Now logs what's being saved to Supabase
   - Shows if parameters are present in the insert

## 🚀 Complete Flow

```
┌──────────────── FRONTEND ─────────────────┐
│ User selects parameters in form          │
└───────────────────┬──────────────────────┘
                    │
                    ↓ handleSubmit()
┌──────────────── FORM COMPONENT ───────────┐
│ 🚀 Submitting form with data:            │
│ - selectedParameters: [...]              │
│ - customParameters: [...]                │
└───────────────────┬──────────────────────┘
                    │
                    ↓ submit(formData)
┌──────────────── HOOK (useWebhookSubmit) ──┐
│ 📝 FormData received                      │
│ 🔧 Transform to payload                  │
│ 💾 Save to Supabase                      │
└───────────────────┬──────────────────────┘
                    │
                    ↓ auditService.createSubmission()
┌──────────────── SUPABASE ──────────────────┐
│ 💾 Saving to Supabase:                    │
│ - selected_parameters: [...]             │
│ - custom_parameters: [...]               │
│                                           │
│ ✅ Saved, result returned                │
└───────────────────┬──────────────────────┘
                    │
                    ↓
┌──────────────── WEBHOOK ──────────────────┐
│ 📤 Payload after transform:              │
│ - selected_parameters: [...]             │
│ - custom_parameters: [...]               │
│                                           │
│ 📮 Final payload to send                 │
│ 🔥 Sending to N8N webhook               │
└────────────────────────────────────────┘
```

## 📋 Testing Checklist

### Step 1: Deploy the Migration
```bash
# Push migration to Supabase
supabase db push
```

### Step 2: Test the Full Flow

**Open browser DevTools (F12 → Console)**

1. **Fill the form:**
   - Email: `test@example.com`
   - Audio URL: `https://recordings.exotel.com/...mp3`
   - Analyst Name: `TestAnalyst` (optional)
   - Call Type: Select `Inbound`

2. **Select parameters:**
   - Check the "Select All" button to select multiple parameters
   - Watch console for: `✅ Parameter toggled`

3. **Submit the form:**
   - Click Submit

### Step 3: Check Console Logs (In Order)

| Log | Expected Value | Location |
|-----|-----------------|----------|
| 🚀 `Submitting form with data:` | Has `selectedParameters: [...]` | Form Component |
| 📝 `FormData received in hook:` | Has `selectedParameters: [...]` | useWebhookSubmit |
| 🔧 `transformFormDataToPayload input:` | Has `selectedParameters: [...]` | webhookService |
| ✅ `transformFormDataToPayload output:` | Has `selected_parameters: [...]` | webhookService |
| 💾 `Saving to Supabase:` | Has `selected_parameters: [...]` | auditService |
| ✅ `Saved to Supabase, result:` | Has `selected_parameters: [...]` | auditService |
| 🔄 `sendWithRetry received payload:` | Has `selected_parameters: [...]` | webhookService |
| 🔥 `Sending webhook payload to n8n:` | Has `selected_parameters: [...]` | webhookService |

### Step 4: Verify in Supabase Dashboard

1. **Go to Supabase Dashboard**
2. **Navigate to:** `SQL Editor` or `Table Editor`
3. **Run query:**
```sql
SELECT 
  id, 
  email, 
  selected_parameters,
  custom_parameters,
  created_at
FROM audit_submissions
ORDER BY created_at DESC
LIMIT 5;
```

4. **Should show:**
   - ✅ `selected_parameters` column exists
   - ✅ Contains array of parameter names: `["Parameter 1", "Parameter 2", ...]`
   - ✅ `custom_parameters` column exists
   - ✅ Contains array of objects if custom params were added

## 🔍 Debugging Steps

### If Parameters Are Still Empty

**Check 1: Are parameters selected in form?**
```javascript
// In browser console
// Should show selected parameters
formData.selectedParameters
```

**Check 2: Are they passed to the hook?**
- Look for `📝 FormData received in hook:` log
- Check if `selectedParameters` field is populated

**Check 3: Are they in the webhook payload?**
- Look for `🔥 Sending webhook payload to n8n:` log
- Search for `"selected_parameters"` in the logged object

**Check 4: Are they saved in Supabase?**
```sql
-- In Supabase SQL Editor
SELECT * FROM audit_submissions WHERE email = 'your-email@example.com';
```

### If Supabase Column Doesn't Exist

**Error:** `column "selected_parameters" of relation "audit_submissions" does not exist`

**Fix:**
1. Deploy migration: `supabase db push`
2. Check Supabase status dashboard
3. Verify migration succeeded

**Or manually in Supabase SQL:**
```sql
ALTER TABLE audit_submissions
ADD COLUMN IF NOT EXISTS selected_parameters text[] DEFAULT ARRAY[]::text[];

ALTER TABLE audit_submissions
ADD COLUMN IF NOT EXISTS custom_parameters jsonb DEFAULT '[]'::jsonb;
```

## 📊 Expected Database State

After first successful submission with parameters:

```sql
id: 'uuid-here'
email: 'test@example.com'
analyst_name: 'TestAnalyst'
call_id: null
call_duration: 0
call_type: 'inbound'
notes: null
audio_url: 'https://...'
status: 'pending'
selected_parameters: ["Parameter 1", "Parameter 2", "Parameter 3"]  ← IMPORTANT
custom_parameters: []
webhook_sent: false
created_at: '2026-04-07T...'
```

## 🎯 N8N Payload Should Include

```json
{
  "submission_id": "...",
  "email": "test@example.com",
  "selected_parameters": ["Parameter 1", "Parameter 2"],
  "custom_parameters": [],
  "audio": { ... },
  ...other fields...
}
```

## 📝 Next Steps

1. **Deploy the new migration** to Supabase
2. **Test with new form submission** with parameters selected
3. **Check all console logs** (attach them here if issues)
4. **Verify Supabase table** has the parameters
5. **Check N8N webhook receives** the parameters

---

**After testing, share:**
- Console logs (all of them from form submission)
- Query result from Supabase showing selected_parameters
- N8N webhook payload received




# Transcript URL Implementation Plan

## Overview
Integrate transcript URL field throughout the audit submission system to allow users to provide pre-recorded transcripts that n8n can use for validation and compliance analysis.

## Database Status
✅ **Already Ready** - `transcript_url` column exists in `audit_submissions` table

## Implementation Changes (6 Files)

### Change 1: Update FormData Type
**File**: `src/types/index.ts` (around line 302)

**Current**:
```typescript
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
  mediaType?: MediaType;
  vcUrl?: string;
  vcPlatform?: VCPlatform;
  leadStage?: LeadStage;
  lsqLink?: string;
}
```

**Update To**:
```typescript
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
  mediaType?: MediaType;
  vcUrl?: string;
  vcPlatform?: VCPlatform;
  leadStage?: LeadStage;
  lsqLink?: string;
  transcriptUrl?: string;  // ← ADD THIS LINE
}
```

---

### Change 2: Update WebhookPayload Type
**File**: `src/types/index.ts` (around line 155)

**Current**:
```typescript
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
}
```

**Update To**:
```typescript
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
  transcript_url?: string;  // ← ADD THIS LINE
}
```

---

### Change 3: Update Form State Initialization
**File**: `src/components/forms/AuditSubmissionForm.tsx` (around line 580-590)

**In useState for formData, add**:
```typescript
const [formData, setFormData] = useState<FormData>({
  email: '',
  audioUrl: '',
  analystName: '',
  callId: '',
  callDuration: '',
  notificationEmail: '',
  callType: 'inbound',
  notes: '',
  selectedParameters: [],
  customParameters: [],
  mediaType: 'audio',
  vcUrl: '',
  vcPlatform: 'meet',
  leadStage: 'new-lead',
  lsqLink: '',
  transcriptUrl: '',  // ← ADD THIS LINE
});
```

---

### Change 4: Update Form Reset After Submission
**File**: `src/components/forms/AuditSubmissionForm.tsx` (around line 843)

**In the form reset after successful submission, add**:
```typescript
setFormData({ 
  email: '', 
  audioUrl: '', 
  analystName: '', 
  callId: '', 
  callDuration: '', 
  notificationEmail: '', 
  callType: 'inbound', 
  notes: '', 
  selectedParameters: [], 
  customParameters: [], 
  mediaType: 'audio', 
  vcUrl: '', 
  leadStage: 'new-lead', 
  lsqLink: '',
  transcriptUrl: '',  // ← ADD THIS LINE
});
```

---

### Change 5: Add Transcript URL Input Field to Form
**File**: `src/components/forms/AuditSubmissionForm.tsx` (around line 573 - import, and ~1000 - input field)

**Step A: Update Import** (line 573):
```typescript
// CURRENT
import { User, Hash, Clock, Link as LinkIcon, CheckSquare, Square, Plus, X, AlertCircle, Upload, Video } from 'lucide-react';

// UPDATE TO
import { User, Hash, Clock, Link as LinkIcon, CheckSquare, Square, Plus, X, AlertCircle, Upload, Video, FileText } from 'lucide-react';
```

**Step B: Add Input Field** in the Optional section (after Notes field, around line 1000):
```tsx
<FloatingLabelInput
  label="Transcript URL (Optional)"
  icon={FileText}
  type="url"
  value={formData.transcriptUrl || ''}
  onChange={(value) => setFormData({ ...formData, transcriptUrl: value })}
  onBlur={() => handleFieldBlur('transcriptUrl')}
  placeholder="https://storage.example.com/transcripts/..."
  error={errors.transcriptUrl}
/>
```

---

### Change 6: Update auditService.createSubmission() Parameters
**File**: `src/services/auditService.ts` (around line 391)

**Current**:
```typescript
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
}): Promise<AuditSubmission>
```

**Update To**:
```typescript
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
  transcript_url?: string;  // ← ADD THIS LINE
}): Promise<AuditSubmission>
```

---

### Change 7: Update webhookService Payload Transformation
**File**: `src/services/webhookService.ts` (around line 15-30 in transformFormDataToPayload())

**In transformFormDataToPayload() function, update the payload object creation**:

**Current**:
```typescript
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
    url: formData.audioUrl,
  },
  selected_parameters: selectedParams,
  custom_parameters: formData.customParameters || [],
};
```

**Update To**:
```typescript
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
    url: formData.audioUrl,
  },
  selected_parameters: selectedParams,
  custom_parameters: formData.customParameters || [],
  transcript_url: formData.transcriptUrl || undefined,  // ← ADD THIS LINE
};
```

---

## Implementation Checklist

- [ ] **Change 1**: Add `transcriptUrl` to FormData type
- [ ] **Change 2**: Add `transcript_url` to WebhookPayload type
- [ ] **Change 3**: Add `transcriptUrl: ''` to form state initialization
- [ ] **Change 4**: Add `transcriptUrl: ''` to form reset after submission
- [ ] **Change 5A**: Update lucide-react import to include `FileText`
- [ ] **Change 5B**: Add transcript URL input field to form
- [ ] **Change 6**: Add `transcript_url?` to auditService.createSubmission() parameters
- [ ] **Change 7**: Add `transcript_url` to webhook payload in webhookService

---

## Data Flow After Implementation

```
┌─────────────────────────────────────────┐
│ USER SUBMITS AUDIT FORM                 │
├─────────────────────────────────────────┤
│ ✓ Email: user@example.com               │
│ ✓ Audio URL: https://exotel.../audio1   │
│ ✓ Transcript URL: https://storage/.../1 │ ← NEW
│ ✓ Call Duration: 30:20                  │
│ ✓ Parameters: [greeting, follow-up]     │
│ ✓ Custom Param (Score): Follow-up (85%) │
│ ✓ Lead Stage: qualified                 │
└────────────┬──────────────────────────────┘
             ↓
┌─────────────────────────────────────────┐
│ DATABASE SUBMISSION CREATED             │
├─────────────────────────────────────────┤
│ id: uuid-123                            │
│ email: user@example.com                 │
│ audio_url: https://exotel.../audio1     │
│ transcript_url: https://storage/.../1   │ ✅ SAVED
│ status: pending                         │
│ webhook_sent: false                     │
└────────────┬──────────────────────────────┘
             ↓
┌─────────────────────────────────────────┐
│ WEBHOOK PAYLOAD TO n8n                  │
├─────────────────────────────────────────┤
│ {                                       │
│   "submission_id": "uuid-123",           │
│   "email": "user@example.com",           │
│   "audio": {                            │
│     "url": "https://exotel.../audio1"   │
│   },                                    │
│   "transcript_url":                     │
│     "https://storage/.../1",            │ ✅ INCLUDED
│   "selected_parameters": [              │
│     "greeting", "follow-up"             │
│   ],                                    │
│   "custom_parameters": [{               │
│     "name": "Follow-up",                │
│     "score": 85                         │
│   }]                                    │
│ }                                       │
└────────────┬──────────────────────────────┘
             ↓
┌─────────────────────────────────────────┐
│ n8n PROCESSING                          │
├─────────────────────────────────────────┤
│ 1. Download audio from URL              │
│ 2. Download transcript from URL ← NEW   │
│ 3. Parse transcript content ← NEW       │
│ 4. Compare with audio ← NEW             │
│ 5. Score parameters & transcript        │
│ 6. Return compliance_score + violations │
└────────────┬──────────────────────────────┘
             ↓
┌─────────────────────────────────────────┐
│ DATABASE UPDATED WITH RESULTS           │
├─────────────────────────────────────────┤
│ status: completed                       │
│ compliance_score: 78.5                  │
│ violations: [...]                       │
│ webhook_sent: true                      │
│ updated_at: NOW()                       │
└─────────────────────────────────────────┘
```

---

## Benefits of Transcript URL Integration

✅ **Faster Processing**: n8n doesn't need to transcribe audio again
✅ **Better Validation**: Compare user-provided vs AI-generated transcript
✅ **Accuracy Scoring**: Measure transcript matching percentage
✅ **Direct Phrase Analysis**: Extract compliance phrases directly from transcript
✅ **Cost Reduction**: Avoid redundant transcription processing
✅ **Enhanced Compliance**: Validate against actual spoken words

---

## Testing After Implementation

### Test Case 1: Single Submission with Transcript
```
1. Fill form with all required fields
2. Enter transcript URL: https://storage.example.com/transcript.txt
3. Click Submit
4. Verify in browser console:
   - Webhook payload includes transcript_url
   - DB record saved with transcript_url
```

### Test Case 2: Bulk Submission with Transcript
```
1. Switch to Bulk mode
2. Paste 5 URLs
3. Enter transcript URL (same for all)
4. Click Submit Bulk
5. Verify each submission includes transcript_url
```

### Test Case 3: Optional Field Validation
```
1. Fill form WITHOUT transcript URL
2. Submit
3. Verify form submits successfully (optional field)
4. Verify webhook payload has: "transcript_url": undefined
```

---

## Rollback Plan (if needed)

If issues occur, simply remove:
- `transcriptUrl` from FormData type
- `transcript_url` from WebhookPayload type
- `transcriptUrl: ''` from form state
- Transcript input field from form
- `transcript_url?` from auditService
- `transcript_url` from webhook payload

Database column can remain unused (no harm).

---

## Notes

- All changes are **backward compatible** (transcript_url is optional)
- Form continues to work without transcript URL
- Database already has the column
- No migrations needed
- n8n can handle missing transcript_url gracefully
