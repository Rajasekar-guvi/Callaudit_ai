# N8N ↔ Supabase Complete Integration Guide

---

## 📊 SUPABASE SCHEMA (Current)

### **Table: `audit_submissions`**

```
Column Name              | Data Type  | Default              | Constraint
------------------------+------------+----------------------+-------------------
id                       | uuid       | gen_random_uuid()    | PRIMARY KEY
email                    | text       | (NONE)               | NOT NULL
agent_name               | text       | NULL                 | NULL
call_id                  | text       | NULL                 | NULL
call_duration            | int4       | NULL                 | NULL
call_type                | text       | NULL                 | NULL
notes                    | text       | NULL                 | NULL
audio_url                | text       | NULL                 | NULL
audio_filename           | text       | NULL                 | NULL
audio_size               | int4       | NULL                 | NULL
status                   | text       | 'pending'::text      | NOT NULL
compliance_score         | int4       | NULL                 | NULL
violations               | jsonb      | NULL                 | NULL
webhook_response         | jsonb      | NULL                 | NULL
transcript               | text       | NULL                 | NULL
languages_found          | text       | NULL                 | NULL
spoken_evidence          | text       | NULL                 | NULL
call_observations        | text       | NULL                 | NULL
analyst_name             | text       | NULL                 | NULL
raw_transcript           | text       | NULL                 | NULL
created_at               | timestamptz| now()                | NOT NULL
updated_at               | timestamptz| now()                | NOT NULL
```

**Indexes:**
- `idx_audit_submissions_email` on `email` (for fast lookups)

---

## 🔐 N8N SETUP: Supabase Credentials

### **Required Credentials from Supabase Dashboard**

Go to: **Supabase Console → Settings → API**

```
┌─────────────────────────────────────────────────────┐
│ 1. SUPABASE_URL                                     │
│    Example: https://rvycdlitikppkeofhsim.supabase.co
│    → Used to connect to your database              │
│                                                     │
│ 2. SERVICE_ROLE_KEY (Secret - Backend Only)        │
│    Example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...│
│    → Used by n8n for INSERT/UPDATE operations      │
│    ⚠️  KEEP THIS SECRET!                           │
│                                                     │
│ 3. ANON_KEY (Frontend Only)                        │
│    Example: sb_publishable_y_GmLQdxwPNRuccx-...   │
│    → Used only by React UI for read operations     │
└─────────────────────────────────────────────────────┘
```

---

## ⚙️ STEP-BY-STEP: Configure N8N Supabase Node

### **Step 1: Create N8N Supabase Credential**

1. Open **N8N Console**
2. Navigate to **Credentials** (left sidebar)
3. Click **+ New** button
4. Search for **"Supabase"**
5. Click to add **Supabase** connector
6. Fill in:
   ```
   Credential Name: "Audit DB Connection"
   Host: https://rvycdlitikppkeofhsim.supabase.co
   API Key: [Paste your SERVICE_ROLE_KEY here]
   ```
7. Click **Create Credential**
8. Click **Test Connection** → Should show ✅ Success

---

### **Step 2: Create Webhook Node (Receive from UI)**

In your N8N workflow:

```
Node Name: "Receive Audit Request"
Node Type: Webhook
Settings:
│
├─ HTTP Method: POST
├─ Path: /audit-webhook
├─ Authentication: None (or use API key if preferred)
├─ Response Mode: "On Execution Complete"
└─ Response Code: 200
```

**Expected Incoming Data from UI:**
```json
{
  "submission_id": "uuid-here",
  "email": "user@example.com",
  "agent_name": "John Doe",
  "call_id": "CALL-12345",
  "call_duration": 240,
  "call_type": "inbound",
  "notes": "Customer complaint about service",
  "notification_email": "manager@company.com",
  "audio": {
    "filename": "call-12345.wav",
    "size": 5242880,
    "url": "https://example.com/audio/call-12345.wav"
  }
}
```

---

### **Step 3: AI Processing Node (Optional - Your Custom Logic)**

```
Node Name: "Process Audit"
Node Type: [Your AI/LLM node]
Receives: Webhook data
Processes:
│
├─ Analyze transcript/audio
├─ Calculate compliance_score (0-100)
├─ Identify violations (array of objects)
├─ Generate observations
└─ Extract transcript
```

**Output Format:**
```json
{
  "compliance_score": 85,
  "violations": [
    {
      "type": "policy_violation",
      "description": "Agent failed to follow protocol X",
      "severity": "high"
    }
  ],
  "transcript": "Full transcript text here...",
  "spoken_evidence": ["phrase 1", "phrase 2"],
  "call_observations": "Agent was professional but missed upsell opportunity"
}
```

---

### **Step 4: Update Supabase Node (Save Results)**

```
Node Name: "Update Submission Results"
Node Type: Supabase → Update
Credential: "Audit DB Connection"
Settings:
│
├─ Schema: public
├─ Table: audit_submissions
├─ Find records by:
│  ├─ Column: id
│  └─ Value: {{ $node["Receive Audit Request"].json.submission_id }}
│
└─ Update Fields:
   ├─ status: "{{ workflow.status }}" // 'passed'|'failed'|'flagged'
   ├─ compliance_score: {{ $node["Process Audit"].json.compliance_score }}
   ├─ violations: {{ JSON.stringify($node["Process Audit"].json.violations) }}
   ├─ transcript: {{ $node["Process Audit"].json.transcript }}
   ├─ spoken_evidence: {{ JSON.stringify($node["Process Audit"].json.spoken_evidence) }}
   ├─ call_observations: {{ $node["Process Audit"].json.call_observations }}
   ├─ webhook_response: {{ JSON.stringify($node["Process Audit"].json) }}
   └─ updated_at: {{ new Date().toISOString() }}
```

**SQL Equivalent:**
```sql
UPDATE audit_submissions
SET 
  status = 'passed',
  compliance_score = 85,
  violations = '[...]'::jsonb,
  transcript = '...',
  spoken_evidence = '[...]'::jsonb,
  call_observations = '...',
  webhook_response = '{...}'::jsonb,
  updated_at = now()
WHERE id = 'submission-uuid';
```

---

### **Step 5: Response Node (Send Back to UI)**

```
Node Name: "Send Response"
Node Type: Response
Body:
{
  "success": true,
  "submission_id": {{ $node["Receive Audit Request"].json.submission_id }},
  "status": {{ $node["Update Submission Results"].json.status }},
  "compliance_score": {{ $node["Update Submission Results"].json.compliance_score }},
  "processing_time_ms": {{ workflow.executionTime }}
}
```

---

## 🔄 COMPLETE WORKFLOW DIAGRAM

```
┌──────────────────────────────────────────────────────────────────┐
│                    React UI (Browser)                            │
│  User fills form → Email, Agent, Call ID, Audio File            │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│              Supabase (Initial Submission)                       │
│  Create record with:                                             │
│  - id (auto UUID)                                                │
│  - email                                                         │
│  - agent_name, call_id, audio_url                               │
│  - status = 'pending'                                            │
│  - created_at = now()                                            │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                  N8N Webhook Endpoint                            │
│  Path: /audit-webhook                                            │
│  ✅ Receives: submission_id + form data + audio URL             │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                N8N Processing (Async)                            │
│  - Extract audio transcription                                   │
│  - AI analysis for violations                                    │
│  - Calculate compliance score                                    │
│  - Generate observations                                         │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│           Update Supabase via N8N Supabase Node                  │
│  UPDATE audit_submissions SET:                                   │
│  - status = 'passed'|'failed'|'flagged'                         │
│  - compliance_score = 85                                         │
│  - violations = [...]                                            │
│  - transcript, spoken_evidence, observations                     │
│  - webhook_response = {...}                                      │
│  WHERE id = submission_id                                        │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│            Dashboard Auto-Updates (Real-time)                    │
│  - RecentSubmissionsTable fetches from Supabase                 │
│  - Shows updated status, score, violations                       │
│  - Displays email column                                         │
└──────────────────────────────────────────────────────────────────┘
```

---

## 📱 UI INTEGRATION (React Component Flow)

### **1. Form Submission - `AuditSubmissionForm.tsx`**

```typescript
// Step A: Collect form data (including email)
const formData = {
  email: "user@company.com",        // ← REQUIRED NOW
  agentName: "John Doe",
  callId: "CALL-12345",
  audioUrl: "https://...",
  callDuration: "04:30",
  callType: "inbound",
  notes: "..."
}

// Step B: Create in Supabase first
const submission = await auditService.createSubmission({
  email: formData.email,
  agent_name: formData.agentName,
  call_id: formData.callId,
  // ...
});

// Step C: Send to N8N webhook (async)
const payload = {
  submission_id: submission.id,
  email: formData.email,
  agent_name: formData.agentName,
  audio: { url, filename, size },
  // ...
};

await webhookService.sendWithRetry(payload);
```

### **2. Recent Submissions Table - `RecentSubmissionsTable.tsx`**

Add email column to the table header:

```typescript
<thead>
  <tr>
    <th>Email</th>           {/* ← NEW */}
    <th>Call ID</th>
    <th>Agent</th>
    <th>Type</th>
    <th>Status</th>
    <th>Score</th>
    <th>Date</th>
  </tr>
</thead>

<tbody>
  {submissions.map(submission => (
    <tr>
      <td>{submission.email}</td>    {/* ← NEW */}
      <td>{submission.call_id}</td>
      <td>{submission.agent_name}</td>
      {/* ... */}
    </tr>
  ))}
</tbody>
```

Expand email in details:
```typescript
const ExpandedDetails = ({ submission }) => (
  <div className="space-y-4">
    <div>
      <label>Email</label>
      <p>{submission.email}</p>    {/* ← NEW */}
    </div>
    <div>
      <label>Call Duration</label>
      <p>{submission.call_duration} seconds</p>
    </div>
    {/* ... */}
  </div>
);
```

---

## 🧪 TESTING THE INTEGRATION

### **Test 1: Supabase Connection**
```
In N8N, create a simple "Supabase → Read" node:
- Credential: "Audit DB Connection"
- Table: audit_submissions
- Limit: 1
Execute → Should return recent submission
```

### **Test 2: Webhook Trigger**
```
In N8N Webhook node:
1. Copy the webhook URL
2. Open Postman/curl
3. Send POST request:
   POST https://n8n-instance.com/webhook/audit-webhook
   {
     "submission_id": "test-uuid",
     "email": "test@example.com",
     "agent_name": "Test Agent",
     "audio": {"url": "...", "filename": "...", "size": 0}
   }
4. Should receive 200 success response
```

### **Test 3: Full Flow**
```
1. Fill form in React UI → Submit
2. Check Supabase → New record created (status: pending)
3. Check N8N → Webhook executed
4. Wait 30 seconds
5. Check Supabase → Record updated with compliance_score, violations
6. Check UI Dashboard → Recent Submissions shows updated data
```

---

## 📋 N8N TEAM: MESSAGE TEMPLATE

Subject: **N8N Workflow Setup for Call Audit System**

```
Hello N8N Team,

We need to set up an n8n workflow to process call audit submissions from our 
React application and update a Supabase database.

REQUIREMENTS:
1. Webhook endpoint to receive audit requests (POST /audit-webhook)
2. Process audio/transcripts for compliance violations
3. Calculate compliance score (0-100)
4. Update Supabase table with results

DATABASE SCHEMA:
Table: audit_submissions

Required Supabase Node Configuration:
- Host: https://rvycdlitikppkeofhsim.supabase.co
- API Key: [SERVICE_ROLE_KEY]
- Table: audit_submissions
- Update by: id column

Input Schema (from UI):
{
  "submission_id": "uuid",
  "email": "user@example.com",
  "agent_name": "string",
  "call_id": "string",
  "call_duration": number,
  "call_type": "inbound|outbound",
  "notes": "string",
  "audio": {
    "filename": "string",
    "size": number,
    "url": "string"
  }
}

Output to Supabase (UPDATE):
{
  "status": "passed|failed|flagged",
  "compliance_score": 0-100,
  "violations": JSON array,
  "transcript": "string",
  "spoken_evidence": JSON array,
  "call_observations": "string",
  "webhook_response": JSON
}

Can you confirm the workflow setup and provide the webhook URL for testing?

Thanks,
[Your Team]
```

---

## ✅ CHECKLIST: Before Going Live

- [ ] Supabase email column added to `audit_submissions`
- [ ] N8N Supabase credential created and tested
- [ ] N8N webhook node configured
- [ ] N8N processing logic implemented (your custom AI)
- [ ] N8N Supabase update node configured
- [ ] React form includes email field (mandatory)
- [ ] RecentSubmissionsTable displays email column
- [ ] Webhook URL tested with curl/Postman
- [ ] End-to-end flow tested (UI → Supabase → N8N → Supabase)
- [ ] Error handling in place (webhook failures logged)
- [ ] Dashboard updates in real-time after submission

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Webhook not receiving data | Check URL, add console.log in n8n, verify CORS if needed |
| Supabase update fails | Verify SERVICE_ROLE_KEY, column names match schema |
| Email required but not sent | Check form validation, ensure email in payload |
| Data not appearing in dashboard | Verify Supabase read query, check timestamp filters |
| N8N times out | Increase timeout in webhook node, check audio processing time |

