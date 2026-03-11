# Impact Analysis: Migration Changes to Codebase

## 📋 Quick Summary

**If you apply the migration, you MUST update these files:**

| File | Change Type | Impact | Required |
|------|------------|--------|----------|
| `src/types/index.ts` | Type updates | Add new optional fields | ⚠️ CRITICAL |
| `src/services/auditService.ts` | Logic update | Include user_id in creates | ⚠️ HIGH |
| `src/hooks/useWebhookSubmit.ts` | Logic update | Pass user info | ⚠️ HIGH |
| `src/services/supabaseClient.ts` | Auth handling | Add auth module import | ⚠️ MEDIUM |
| `src/config/webhooks.ts` | Config update | N8N needs SERVICE_ROLE_KEY | ⚠️ HIGH |

**Files NOT affected:**
- ✅ All UI components (dashboard, forms, etc.)
- ✅ `config/constants.ts`
- ✅ Toast context
- ✅ Theme hook

---

## 🔴 CRITICAL CHANGES NEEDED

### **1. Types Need New Fields**

**Current (`src/types/index.ts`):**
```typescript
export interface AuditSubmission {
  id: string;
  agent_name?: string;
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
  webhook_response?: WebhookResponse;
  created_at: string;
  updated_at: string;
  // ❌ MISSING NEW FIELDS
}
```

**Required Update:**
```typescript
export interface AuditSubmission {
  id: string;
  agent_name?: string;
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
  webhook_response?: WebhookResponse;
  created_at: string;
  updated_at: string;
  
  // ✅ NEW FIELDS (all optional for backward compatibility)
  user_id?: string;           // UUID of authenticated user
  user_email?: string;        // Email for access control
  created_by?: string;        // Who created the record
}
```

---

### **2. Authentication Required**

**Current (`src/services/supabaseClient.ts`):**
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials in environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
// ❌ No auth helper functions
```

**Required Update (Add Auth Helper):**
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials in environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// ✅ NEW: Auth helper functions
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getCurrentUserEmail = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.email;
};
```

---

### **3. Services Need User Info**

**Current (`src/services/auditService.ts`):**
```typescript
async createSubmission(data: {
  agent_name?: string;
  call_id?: string;
  call_duration: number;
  call_type: 'inbound' | 'outbound';
  notes?: string;
  audio_filename?: string;
  audio_size?: number;
  audio_url?: string;
}): Promise<AuditSubmission> {
  const { data: result, error } = await supabase
    .from('audit_submissions')
    .insert([{ ...data, status: 'pending' }])  // ❌ Missing user_id
    .select()
    .maybeSingle();
  
  if (error) throw error;
  if (!result) throw new Error('Failed to create submission');
  return result;
}
```

**Required Update:**
```typescript
async createSubmission(data: {
  agent_name?: string;
  call_id?: string;
  call_duration: number;
  call_type: 'inbound' | 'outbound';
  notes?: string;
  audio_filename?: string;
  audio_size?: number;
  audio_url?: string;
  user_id?: string;        // ✅ NEW
  user_email?: string;     // ✅ NEW
  created_by?: string;     // ✅ NEW
}): Promise<AuditSubmission> {
  const { data: result, error } = await supabase
    .from('audit_submissions')
    .insert([{ 
      ...data, 
      status: 'pending',
      // ✅ NEW: Capture current user info
      user_id: data.user_id,
      user_email: data.user_email,
      created_by: data.created_by
    }])
    .select()
    .maybeSingle();
  
  if (error) throw error;
  if (!result) throw new Error('Failed to create submission');
  return result;
}
```

---

### **4. Hook Needs to Capture User**

**Current (`src/hooks/useWebhookSubmit.ts`):**
```typescript
const submit = async (formData: FormData) => {
  // ...
  
  // ✅ STEP 1 — Create initial submission in Supabase
  const submission = await auditService.createSubmission({
    agent_name: formData.agentName || undefined,
    call_id: formData.callId || undefined,
    call_duration: formData.callDuration
      ? webhookService.parseTimeToSeconds(formData.callDuration)
      : 0,
    call_type: formData.callType,
    notes: formData.notes || undefined,
    audio_url: formData.audioUrl || undefined,
    // ❌ Missing user_id, user_email
  });
  
  // ...
}
```

**Required Update:**
```typescript
import { getCurrentUser, getCurrentUserEmail } from '../services/supabaseClient'; // ✅ NEW

const submit = async (formData: FormData) => {
  // ...
  
  try {
    // ✅ NEW: Get current user info
    const user = await getCurrentUser();
    const userEmail = await getCurrentUserEmail();
    
    // ✅ STEP 1 — Create initial submission in Supabase
    const submission = await auditService.createSubmission({
      agent_name: formData.agentName || undefined,
      call_id: formData.callId || undefined,
      call_duration: formData.callDuration
        ? webhookService.parseTimeToSeconds(formData.callDuration)
        : 0,
      call_type: formData.callType,
      notes: formData.notes || undefined,
      audio_url: formData.audioUrl || undefined,
      user_id: user?.id,           // ✅ NEW
      user_email: userEmail,       // ✅ NEW
      created_by: userEmail,       // ✅ NEW
    });
    
    // ...
  } catch (error) {
    // ...
  }
}
```

---

### **5. N8N Configuration Change**

**Current (`src/config/webhooks.ts`):**
```typescript
export const WEBHOOK_CONFIG = {
  n8n_url: import.meta.env.VITE_N8N_WEBHOOK_URL 
    || `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/call-audit-webhook`,
  timeout: 30000,
  retryAttempts: 3,
};

export const getWebhookHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  // ❌ No auth headers for Supabase connection
});
```

**Required Update (For N8N):**
```typescript
// ⚠️ IMPORTANT: N8N needs to use SERVICE_ROLE_KEY, not ANON_KEY
// In your N8N workflow configuration, change:
// OLD: apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." (anon)
// NEW: apiKey: "sbp_xxxx..." (service_role)

export const WEBHOOK_CONFIG = {
  n8n_url: import.meta.env.VITE_N8N_WEBHOOK_URL 
    || `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/call-audit-webhook`,
  timeout: 30000,
  retryAttempts: 3,
};

export const getWebhookHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  // Frontend doesn't need to change - N8N side change required
});

// ✅ NEW: Documentation for N8N config
export const N8N_SUPABASE_CONFIG = {
  // In N8N, when configuring Supabase node:
  // Host: https://your-project.supabase.co
  // API Key: sbp_xxxx... (SERVICE_ROLE_KEY, NOT ANON)
  // This allows N8N to bypass RLS and update any record
};
```

---

## 🟡 OPTIONAL BUT RECOMMENDED

### **Add Authentication UI**

You'll need a login page/component. Example:

```typescript
// NEW FILE: src/pages/LoginPage.tsx
import { useState } from 'react';
import { supabase } from '../services/supabaseClient';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      // Redirect to dashboard
      window.location.href = '/dashboard';
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};
```

---

## 📊 Change Summary by Severity

### 🔴 CRITICAL (Must Update)
- [x] `src/types/index.ts` - Add 3 new optional fields
- [x] `src/services/auditService.ts` - Include user_id in inserts
- [x] `src/hooks/useWebhookSubmit.ts` - Capture user info
- [x] `src/services/supabaseClient.ts` - Add auth helpers

### 🟠 HIGH (Should Update)
- [x] N8N configuration - Use SERVICE_ROLE_KEY
- [x] Environment variables - Add N8N key

### 🟡 MEDIUM (Recommended)
- [ ] Add authentication UI (LoginPage)
- [ ] Add logout functionality
- [ ] Add user profile display

### 🟢 LOW (Optional)
- [ ] Update N8N_SUPABASE_CONNECTION_GUIDE.md
- [ ] Add user management UI

---

## ⚡ Step-by-Step Migration

### **Phase 1: Backward Compatibility (Safe)**
1. Add new fields to types (all optional)
2. Add helper functions to supabaseClient
3. Deploy - existing code still works

### **Phase 2: Add User Tracking**
1. Update auditService to accept user fields
2. Update useWebhookSubmit to capture user
3. Test with auth users

### **Phase 3: Enforce Authentication**
1. Add login page
2. Protect routes (require login)
3. Update N8N to use SERVICE_ROLE_KEY

---

## 🧪 Testing Checklist

After making changes, test:

- [ ] Frontend loads without auth (check browser console)
- [ ] Can create submission with new user fields
- [ ] Supabase shows new fields populated
- [ ] N8N can still update records (with SERVICE_ROLE_KEY)
- [ ] RLS policies work (user can only see own records)
- [ ] Dashboard still displays data
- [ ] No TypeScript errors

---

## ❌ What BREAKS if You Don't Update

```typescript
// If you apply migration WITHOUT these changes:

// ❌ Error 1: Type mismatch
const submission: AuditSubmission = {
  // Missing: user_id, user_email, created_by
  // TypeScript may complain (if strict mode)
};

// ❌ Error 2: RLS blocks all reads
const { data } = await supabase
  .from('audit_submissions')
  .select('*');
// Returns: [] (empty, because user not authenticated)

// ❌ Error 3: N8N can't update
// If using ANON_KEY with SERVICE_ROLE operations
// "403 Forbidden" - N8N update fails

// ❌ Error 4: No user context
// Submissions have NULL user_id
// Users can't see their own records (RLS blocks them)
```

---

## 📝 Files to Update (Order Matters)

1. **`src/types/index.ts`** - Types first
2. **`src/services/supabaseClient.ts`** - Add helpers
3. **`src/services/auditService.ts`** - Update insert logic
4. **`src/hooks/useWebhookSubmit.ts`** - Capture user
5. **N8N Configuration** - Use SERVICE_ROLE_KEY
6. **`src/pages/App.tsx`** - Add auth check (optional)

Done in this order, no breaking changes!

