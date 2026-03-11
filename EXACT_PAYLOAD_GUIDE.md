# 📤 EXACT PAYLOAD SENT FROM UI TO N8N

---

## ✅ COMPLETE PAYLOAD EXAMPLE

When user submits form with these values:

```
Email: john.doe@company.com
Audio URL: https://your-bucket.supabase.co/audio/call.wav
Agent Name: John Doe
Call ID: CALL-2025-001
Call Duration: 5:30 (5 minutes 30 seconds)
Call Type: inbound
Notes: Customer complaint about service
```

---

## 📋 THE EXACT JSON PAYLOAD SENT

```json
{
  "submission_id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john.doe@company.com",
  "agent_name": "John Doe",
  "call_id": "CALL-2025-001",
  "call_duration": 330,
  "call_type": "inbound",
  "notes": "Customer complaint about service",
  "audio": {
    "filename": "audio_url",
    "size": 0,
    "url": "https://your-bucket.supabase.co/audio/call.wav"
  }
}
```

---

## 📐 PAYLOAD STRUCTURE BREAKDOWN

| Field | Type | Source | Example | Required |
|-------|------|--------|---------|----------|
| **submission_id** | UUID | Supabase (auto-generated) | `550e8400-e29b-41d4-a716-446655440000` | ✅ YES |
| **email** | string | Form input (required) | `"john.doe@company.com"` | ✅ YES |
| **agent_name** | string | Form input (optional) | `"John Doe"` | ❌ NO |
| **call_id** | string | Form input (optional) | `"CALL-2025-001"` | ❌ NO |
| **call_duration** | number | Form input (converted to seconds) | `330` (5:30) | ✅ YES |
| **call_type** | string | Form dropdown | `"inbound"` or `"outbound"` | ✅ YES |
| **notes** | string | Form textarea (optional) | `"Customer complaint..."` | ❌ NO |
| **audio.filename** | string | Static (always "audio_url") | `"audio_url"` | ✅ YES |
| **audio.size** | number | Static (always 0) | `0` | ✅ YES |
| **audio.url** | string | Form input (required) | `"https://..."` | ✅ YES |

---

## 🔄 HOW PAYLOAD IS BUILT

### Step 1: User Fills Form

```
Frontend Form State:
{
  email: "john.doe@company.com",
  audioUrl: "https://your-bucket.supabase.co/audio/call.wav",
  agentName: "John Doe",
  callId: "CALL-2025-001",
  callDuration: "5:30",
  callType: "inbound",
  notes: "Customer complaint about service"
}
```

### Step 2: Create Supabase Row

```typescript
// Code: useWebhookSubmit.ts line 27-34
const submission = await auditService.createSubmission({
  agent_name: "John Doe",           // from form.agentName
  call_id: "CALL-2025-001",          // from form.callId
  call_duration: 330,                // from form.callDuration (5:30 → 330 seconds)
  call_type: "inbound",              // from form.callType
  notes: "Customer complaint...",    // from form.notes
  audio_url: "https://..."           // from form.audioUrl
});

// Supabase returns:
{
  id: "550e8400-e29b-41d4-a716-446655440000",  // AUTO-GENERATED
  status: "pending",                             // DEFAULT
  ...all fields above
}
```

### Step 3: Transform to Webhook Payload

```typescript
// Code: webhookService.ts line 4-18
const payload = webhookService.transformFormDataToPayload(formData);
// Creates:
{
  agent_name: "John Doe",
  call_id: "CALL-2025-001",
  call_duration: 330,
  call_type: "inbound",
  notes: "Customer complaint...",
  audio: {
    filename: "audio_url",
    size: 0,
    url: "https://..."
  }
}
```

### Step 4: Add submission_id

```typescript
// Code: useWebhookSubmit.ts line 42
payload.submission_id = submission.id;  // "550e8400-..."

// Now payload is:
{
  submission_id: "550e8400-e29b-41d4-a716-446655440000",
  agent_name: "John Doe",
  call_id: "CALL-2025-001",
  call_duration: 330,
  call_type: "inbound",
  notes: "Customer complaint...",
  audio: {
    filename: "audio_url",
    size: 0,
    url: "https://..."
  }
}
```

### Step 5: Send to n8n

```typescript
// Code: webhookService.ts line 33-41
await fetch(WEBHOOK_CONFIG.n8n_url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
});
```

---

## 🎯 REAL EXAMPLE PAYLOADS

### Example 1: Minimal Submission (Only Required Fields)

```json
{
  "submission_id": "abc-123-def-456",
  "agent_name": "",
  "call_id": "",
  "call_duration": 0,
  "call_type": "inbound",
  "notes": undefined,
  "audio": {
    "filename": "audio_url",
    "size": 0,
    "url": "https://storage.example.com/call.wav"
  }
}
```

### Example 2: Complete Submission (All Fields)

```json
{
  "submission_id": "550e8400-e29b-41d4-a716-446655440000",
  "agent_name": "Sarah Johnson",
  "call_id": "CALL-2025-00145",
  "call_duration": 1245,
  "call_type": "outbound",
  "notes": "Customer escalation case - needs review for compliance",
  "audio": {
    "filename": "audio_url",
    "size": 0,
    "url": "https://rvycdlitikppkeofhsim.supabase.co/storage/v1/object/public/audio_files/call_2025_001.wav"
  }
}
```

### Example 3: Edge Case (With Special Characters)

```json
{
  "submission_id": "xyz-789-abc-012",
  "agent_name": "José María García-López",
  "call_id": "CALL-2025-00@Special#123",
  "call_duration": 600,
  "call_type": "inbound",
  "notes": "Customer said: \"I need help with my account & billing issues\" - Requires follow-up",
  "audio": {
    "filename": "audio_url",
    "size": 0,
    "url": "https://example.com/audio/call-2025-01-15-9am.wav"
  }
}
```

---

## 🔑 KEY FIELDS FOR N8N

When building your n8n workflow, use these fields:

```
submission_id     ← Use this to UPDATE the Supabase row WHERE id = submission_id
agent_name        ← Display in logs/reports
call_id           ← For call reference
call_duration     ← Already in seconds (not MM:SS)
call_type         ← inbound or outbound
notes             ← Additional context
audio.url         ← Download/process this audio file
```

---

## 📊 OPTIONAL vs REQUIRED

### Optional Fields (User May Not Fill)

```javascript
agent_name: ""    // Empty if user doesn't enter
callId: ""        // Empty if user doesn't enter
notes: undefined  // Undefined if user doesn't enter
```

### Required Fields (Always Present)

```javascript
submission_id: "..."    // Always from Supabase
call_duration: 0        // Always a number (0 if empty)
call_type: "inbound"    // Always one of: inbound/outbound
audio.url: "https://..."  // Always required
audio.filename: "audio_url"  // Always "audio_url"
audio.size: 0           // Always 0
```

---

## ⚙️ TIME CONVERSION

If user enters: `"5:30"` (5 minutes 30 seconds)

Code converts to seconds:
```javascript
parseTimeToSeconds("5:30"):
  parts = ["5", "30"]
  return 5 * 60 + 30 = 330 seconds
```

Examples:
| Input | Seconds | Formula |
|-------|---------|---------|
| `"0:30"` | 30 | 0×60 + 30 |
| `"5:30"` | 330 | 5×60 + 30 |
| `"1:30:45"` | 5445 | 1×3600 + 30×60 + 45 |
| `"0:0:45"` | 45 | 0×3600 + 0×60 + 45 |

---

## 🌐 HTTP REQUEST DETAILS

```
METHOD: POST
URL: https://sangeethan8n.app.n8n.cloud/webhook-test/aba75f1b-ec26-43cd-b3a7-9a3516588ca2

HEADERS:
Content-Type: application/json
Accept: application/json

BODY: (JSON payload from above)
```

---

## ✅ VALIDATION RULES (Frontend)

Before payload is sent, form validates:

| Field | Rule | Example |
|-------|------|---------|
| **email** | Valid email format | ✅ john@company.com |
| **audioUrl** | Valid HTTPS URL | ✅ https://... |
| **agentName** | 2-50 characters (if filled) | ✅ "John Doe" |
| **callId** | Alphanumeric + hyphens/underscores | ✅ "CALL-2025-001" |
| **callDuration** | MM:SS or HH:MM:SS format | ✅ "5:30" |
| **callType** | "inbound" or "outbound" | ✅ "inbound" |

---

## 🔥 CRITICAL FIELD: submission_id

```
This is the MOST IMPORTANT field!

Why?
- Supabase generates it automatically
- YOU send it to n8n in the payload
- n8n uses it to UPDATE the Supabase row
- WITHOUT it, n8n doesn't know which row to update

How n8n uses it:
UPDATE audit_submissions
SET status = 'completed', compliance_score = 85
WHERE id = submission_id
```

---

## 📤 EXAMPLE CURL COMMAND (For Testing)

```bash
curl -X POST https://sangeethan8n.app.n8n.cloud/webhook-test/aba75f1b-ec26-43cd-b3a7-9a3516588ca2 \
  -H "Content-Type: application/json" \
  -d '{
    "submission_id": "550e8400-e29b-41d4-a716-446655440000",
    "agent_name": "John Doe",
    "call_id": "CALL-2025-001",
    "call_duration": 330,
    "call_type": "inbound",
    "notes": "Customer complaint",
    "audio": {
      "filename": "audio_url",
      "size": 0,
      "url": "https://your-bucket.supabase.co/audio/call.wav"
    }
  }'
```

---

## 🎯 FOR YOUR N8N WORKFLOW

When building n8n nodes:

```
Node 1: Webhook (Receive payload)
  └─ Gets all fields above

Node 2: Process data
  └─ Use: submission_id, call_id, audio.url, call_duration

Node 3: Supabase UPDATE
  └─ WHERE id = submission_id
  └─ SET compliance_score, violations, transcript, etc.
```

---

## 📝 Summary

Your UI sends:
- ✅ submission_id (critical - for n8n to know which row to update)
- ✅ agent_name (optional)
- ✅ call_id (optional)
- ✅ call_duration (required, in seconds)
- ✅ call_type (required)
- ✅ notes (optional)
- ✅ audio.url (required)

**That's exactly what n8n receives!**

---

**Questions?**
- Need different fields?
- Want to add more fields?
- Need payload logging for debugging?

Let me know! 🚀
