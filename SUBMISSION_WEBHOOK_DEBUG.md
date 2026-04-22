# Submission & Webhook Debug Guide

## 🔍 Complete Submission Flow (with logging)

```
┌─────────────────────────────────────────────────┐
│ FORM SUBMISSION                                 │
│ - User fills form with NEW audio URL           │
│ - Clicks Submit                                 │
└───────────────────┬─────────────────────────────┘
                    │
                    ↓ handleSubmit()
┌─────────────────────────────────────────────────┐
│ STEP 1: Check Rate Limit (30 seconds)           │
│ ❌ If blocked: Error shown                       │
└───────────────────┬─────────────────────────────┘
                    │
                    ↓ submit(formData)
┌─────────────────────────────────────────────────┐
│ STEP 2: Duplicate URL Check (24 hours)          │
│ 📋 [SUBMIT] Starting submission...              │
│ 📋 [SUBMIT] Media type: audio, URL: ...         │
│ 🔍 [DUPLICATE CHECK] Checking if exists...     │
│ 🔍 [DUPLICATE CHECK] Result: {isDuplicate: ...}│
│                                                 │
│ ❌ If isDuplicate=true: Blocked with error      │
│ ✅ If isDuplicate=false: Continue to creation   │
└───────────────────┬─────────────────────────────┘
                    │
                    ↓
┌─────────────────────────────────────────────────┐
│ STEP 3: Create Submission in Supabase          │
│ 💾 [CREATE SUBMISSION] Creating submission...  │
│ ✅ [SUBMISSION CREATED] ID: {...}              │
│                                                 │
│ Now stored in Supabase with:                   │
│ - status: 'pending'                            │
│ - webhook_sent: false                          │
│ - selected_parameters: [...]                   │
└───────────────────┬─────────────────────────────┘
                    │
                    ↓
┌─────────────────────────────────────────────────┐
│ STEP 4: Prepare Webhook Payload                │
│ 📤 [WEBHOOK PAYLOAD] Ready to send             │
│ - submission_id: {...}                         │
│ - selected_parameters: [...]                   │
│ - media_url: {...}                             │
└───────────────────┬─────────────────────────────┘
                    │
                    ↓ webhookService.sendWithRetry()
┌─────────────────────────────────────────────────┐
│ STEP 5: Send to N8N (8 second timeout)          │
│ 🚀 [WEBHOOK] Sending to N8N...                 │
│                                                 │
│ ❌ If timeout: Error saved, Retry button shown │
│ ❌ If error: Error saved, Retry button shown   │
│ ✅ If success: webhook_sent = true             │
└───────────────────┬─────────────────────────────┘
                    │
                    ↓
┌─────────────────────────────────────────────────┐
│ STEP 6: Mark Success                           │
│ ✅ [SUBMIT COMPLETE] Submission successful     │
│ - Show success toast                           │
│ - Return submission ID                         │
└─────────────────────────────────────────────────┘
```

## 📋 Console Logs to Check

### Test Submission Process:

1. **Open browser DevTools** (F12 → Console)
2. **Clear console** (right-click → Clear Console)
3. **Fill form** with:
   - Email: test@example.com
   - Audio URL: **NEW URL you want to test**
   - Select some parameters
4. **Submit** and watch console for these logs **IN ORDER**:

```
📋 [SUBMIT] Starting submission with formData: {...}
📋 [SUBMIT] Media type: audio, URL: https://...

🔍 [DUPLICATE CHECK] Checking if URL exists: https://...
🔍 [DUPLICATE CHECK] Result: {isDuplicate: false}

💾 [CREATE SUBMISSION] Creating submission with: {...}
✅ [SUBMISSION CREATED] {id: "...", status: "pending", selected_parameters: [...]}

📤 [WEBHOOK PAYLOAD] Ready to send: {
  submission_id: "...",
  selected_parameters: [...],
  media_url: "..."
}

🚀 [WEBHOOK] Sending to N8N with 8 second timeout...
✅ [WEBHOOK SUCCESS] Webhook received and processed

✅ [SUBMIT COMPLETE] Submission successful
```

## 🔴 Possible Issues & Locations

| Issue | Check | Where |
|-------|-------|-------|
| ❌ **Duplicate error shown** | URL submitted in last 24h? | 🔍 [DUPLICATE CHECK] Result |
| ❌ **Rate limit error** | Wait 30s from last submission | 📋 [SUBMIT] - appears before anything else |
| ❌ **Submission creation fails** | Check error message | 💾 [CREATE SUBMISSION] error |
| ❌ **Webhook fails (timeout)** | N8N not responding in 8s | 🚀 [WEBHOOK] → ❌ [WEBHOOK ERROR] |
| ⚠️ **Webhook fails but continues** | Error saved, Retry shown | ❌ [WEBHOOK ERROR] but not ✅ [SUBMIT COMPLETE] |
| ✅ **All logs appear normally** | Submission succeeded | ✅ [SUBMIT COMPLETE] |

## 🔧 Verify in Supabase

After submission, check if data is stored:

```sql
-- Query latest submission
SELECT 
  id,
  email,
  audio_url,
  status,
  webhook_sent,
  selected_parameters,
  error_message,
  created_at
FROM audit_submissions
ORDER BY created_at DESC
LIMIT 1;
```

Expected result:
- ✅ `webhook_sent: true` if successful
- ⚠️ `webhook_sent: false` if webhook failed (retry button shown)
- ❌ `error_message: "transcript or sop rules or call parameters missing"` = N8N issue

## 🧪 Test Steps

### Test 1: Check Rate Limiting
```
- Submit form
- Try again within 30 seconds
- Should see: "Please wait Xs before submitting again"
```

### Test 2: Check Duplicate Detection  
```
- Get any URL from a past submission
- Submit form with SAME URL
- Should see: "This audio was already submitted recently"
```

### Test 3: Check New Submission (Should Work!)
```
- Use a NEW URL that was never submitted before
- Fill all required fields
- Select parameters
- Click Submit
- Check console for all logs
- Verify in Supabase table
```

## 📊 Webhook Status Flow

After submission:

```
Supabase Status      | webhook_sent | Error Message | Result
─────────────────────┼──────────────┼───────────────┼─────────────────
pending              | false        | null          | Retrying (timeout)
pending              | true         | null          | Processing in N8N
pending              | false        | error text    | Needs retry
processing           | true         | null          | N8N working
passed/failed/flagged| true         | null          | ✅ Complete
```

## 📝 Sample Submission JSON

This is what's being sent to N8N:

```json
{
  "submission_id": "abc-123",
  "email": "user@example.com",
  "analyst_name": "Test",
  "call_id": "",
  "call_duration": 0,
  "call_type": "inbound",
  "notes": null,
  "audio": {
    "filename": "audio_url",
    "size": 0,
    "url": "https://recordings.exotel.com/..."
  },
  "selected_parameters": ["Param1", "Param2"],
  "custom_parameters": [],
  "media_type": "audio"
}
```

## 🚨 Common Errors

1. **"This audio was already submitted recently"**
   - Try different URL
   - Or wait 24 hours

2. **"Webhook timeout"**
   - N8N might be down
   - Or taking >8 seconds to respond
   - Check N8N status

3. **"transcript or sop rules or call parameters missing"** 
   - N8N received the submission
   - But missing data N8N expects
   - Need to check N8N workflow

## ✅ Debugging Checklist

- [ ] Console shows all logs in order
- [ ] No duplicate URL error
- [ ] No rate limit error  
- [ ] Submission created in Supabase
- [ ] webhook_sent = true
- [ ] No error_message in Supabase
- [ ] N8N dashboard shows webhook received
- [ ] Status updates to passed/failed/flagged

---

**After testing, share:**
1. The full console log output (copy-paste all logs)
2. The Supabase query result
3. Any error messages shown

This will help identify exactly where the submission is getting stuck! 🎯
