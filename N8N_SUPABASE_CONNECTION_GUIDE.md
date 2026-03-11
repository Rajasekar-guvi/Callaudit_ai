# N8N ↔ Supabase Connection Guide

## 🔑 Credentials You Need to Provide in N8N

Based on your project analysis, here's exactly what you need to configure:

### 1. **Supabase Connection Credentials**

You need these **3 pieces of information** from your Supabase project:

```
A) SUPABASE_URL
   - Get from: Supabase Dashboard → Settings → API
   - Example: https://your-project.supabase.co
   - Used in: VITE_SUPABASE_URL in your frontend

B) SUPABASE_ANON_KEY (Anonymous/Public Key)
   - Get from: Supabase Dashboard → Settings → API
   - Example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   - Used in: VITE_SUPABASE_ANON_KEY in your frontend

C) SUPABASE_SERVICE_ROLE_KEY (Required for N8N backend operations)
   - Get from: Supabase Dashboard → Settings → API
   - More powerful than anon key (for backend operations)
   - ⚠️ KEEP THIS SECRET - Don't expose in frontend!
```

---

## 🎯 Step-by-Step: Setup N8N Supabase Connection

### **Step 1: Create Supabase Credential in N8N**

1. Go to **N8N Dashboard** → **Credentials** (left sidebar)
2. Click **+ New** → Search for **"Supabase"**
3. Select **Supabase** connector
4. Fill in the following:

```
Credentials Name: "My Supabase Audit DB"
Host: https://your-project.supabase.co
API Key: [Your SUPABASE_SERVICE_ROLE_KEY]
```

5. Click **Create** and **Test connection**

---

## 📝 Your Database Schema (Already Set Up)

Your Supabase has this table with these fields:

```
Table: audit_submissions
├── id (UUID) - Primary key
├── agent_name (TEXT)
├── call_id (TEXT) - Unique identifier
├── call_duration (INTEGER) - Seconds
├── call_type (ENUM: inbound/outbound)
├── notes (TEXT)
├── audio_filename (TEXT)
├── audio_size (INTEGER)
├── audio_url (TEXT)
├── status (ENUM: pending/passed/failed/flagged)
├── compliance_score (INTEGER 0-100)
├── violations (JSONB array)
├── webhook_response (JSONB) - Stores full n8n response
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

---

## 🔄 N8N Workflow: How Your System Works

### **Current Flow:**

```
1. UI Form Submit
   ↓
2. Create submission in Supabase (status: pending)
   ↓
3. Send webhook payload to n8n
   ↓
4. N8N processes audit (compliance check, violations, score)
   ↓
5. N8N updates Supabase record with results
   ↓
6. Dashboard reads updated data from Supabase (Real-time)
```

### **N8N Nodes You'll Need:**

#### **Node 1: Webhook Trigger (Receive data from UI)**
```
Name: "Receive Audit Request"
Type: Webhook
Method: POST
Path: /audit-webhook
Response Code: 200
```

#### **Node 2: Prepare Audit Data**
```
Type: Code/Function
Task: Validate and process:
  - call_duration (seconds)
  - audio URL
  - compliance check logic
  - violations detection
```

#### **Node 3: Supabase Insert/Read (Check if call_id exists)**
```
Type: Supabase
Operation: Select
Resource: audit_submissions
Filter: WHERE call_id = [payload.call_id]
```

#### **Node 4: Perform Compliance Audit**
```
Type: Code/Function or AI node
Task: 
  - Calculate compliance_score (0-100)
  - Identify violations
  - Determine status (passed/failed/flagged)
```

#### **Node 5: Supabase Update (Save audit results)**
```
Type: Supabase
Operation: Update
Resource: audit_submissions
Set:
  - status: [calculated status]
  - compliance_score: [calculated score]
  - violations: [array of violations]
  - webhook_response: [full n8n response object]
  - updated_at: [now()]
Where: id = [submission.id]
```

---

## 📤 Expected Payload from Your UI → N8N

Your webhook service sends this payload:

```json
{
  "agent_name": "John Doe",
  "call_id": "CALL-2024-001",
  "call_duration": 1245,
  "call_type": "inbound",
  "notes": "Customer inquiry about billing",
  "audio": {
    "filename": "audio_url",
    "size": 0,
    "url": "https://bucket-url/audio.mp3"
  }
}
```

---

## 🔐 Environment Variables Setup

### **Your Frontend (.env or .env.local):**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/audit-webhook
```

### **Your N8N Credentials:**
```
Supabase Host: https://your-project.supabase.co
Supabase API Key: [SERVICE_ROLE_KEY - More powerful]
```

---

## 🚨 Security Considerations

### **Why Different Keys?**

| Key Type | Frontend | N8N Backend |
|----------|----------|------------|
| **Anon Key** | ✅ Safe to use | ❌ Limited access |
| **Service Role Key** | ❌ Never expose | ✅ Full database access |

Your frontend uses `VITE_SUPABASE_ANON_KEY` because it's restricted by RLS policies:
- ✅ Can INSERT new submissions
- ✅ Can SELECT submissions
- ✅ Can UPDATE its own submissions
- ❌ Cannot DELETE anything

Your N8N uses `SERVICE_ROLE_KEY` for backend operations:
- ✅ Can do anything (for security, keep it secret!)
- ✅ Bypasses RLS policies
- ✅ Used for backend automation

---

## 🔗 N8N Supabase Node Configuration

### **For Reading (SELECT):**
```
Operation: Select
Resource: audit_submissions
Columns: * (all)
Filter: 
  - Limit: 50
  - Order: created_at DESC
```

### **For Updating (INSERT/UPDATE):**
```
Operation: Update
Resource: audit_submissions
Where Clause: id = [from trigger data]
Values:
  - status: [compliance status]
  - compliance_score: [0-100]
  - violations: [JSON array]
  - webhook_response: [full response]
  - updated_at: [now()]
```

---

## 📊 Real-time Dashboard Updates

Your dashboard uses Supabase **Real-time Subscriptions**:

```typescript
// From your auditService.ts
subscribeToSubmissions(callback) {
  // Listens to audit_submissions table
  // Automatically updates when N8N writes updates
  // No refresh needed!
}
```

When N8N updates a record → Supabase triggers update → Dashboard refreshes automatically ✨

---

## ✅ Checklist for N8N Setup

- [ ] Get all 3 credentials from Supabase Dashboard
- [ ] Create Supabase credential in N8N
- [ ] Test Supabase connection
- [ ] Create webhook trigger node
- [ ] Add Supabase read node (verify call_id)
- [ ] Add compliance audit logic
- [ ] Add Supabase update node
- [ ] Test full workflow end-to-end
- [ ] Verify dashboard updates in real-time
- [ ] Monitor webhook_response in Supabase

---

## 🎨 Dashboard View Integration

Your UI automatically shows:
- Real-time submission status updates
- Compliance scores
- Violations detected
- Audit results from N8N

**No additional configuration needed!** Just ensure N8N updates the Supabase `audit_submissions` table.

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Supabase connection failed" | Check API Key & URL are correct |
| "Update fails silently" | Check RLS policies on `audit_submissions` |
| "Dashboard doesn't update" | Verify real-time subscriptions are enabled |
| "403 Permission denied" | Use SERVICE_ROLE_KEY, not anon key |
| "webhook not received" | Check VITE_N8N_WEBHOOK_URL in frontend |
