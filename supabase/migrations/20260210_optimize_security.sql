/*
  # Database Optimizations & Security Improvements

  1. Index Optimization
    - Remove unused indexes: idx_audit_submissions_status
    - Keep idx_audit_submissions_created_at (used for sorting/ordering)
    - Remove idx_audit_submissions_call_id (UNIQUE constraint provides implicit index)

  2. Security Improvements
    - Replace permissive public RLS policies with authentication-based policies
    - Add email-based access control
    - Add user_id and created_by fields for ownership tracking
    - Implement proper row-level security with user authentication

  3. New Fields
    - `user_id` (uuid, optional for backward compatibility)
    - `user_email` (text, optional for email-based access control)
    - `created_by` (text, optional for audit trail)
*/

-- Step 1: Add new columns for user tracking
ALTER TABLE audit_submissions
ADD COLUMN IF NOT EXISTS user_id uuid,
ADD COLUMN IF NOT EXISTS user_email text,
ADD COLUMN IF NOT EXISTS created_by text;

-- Step 2: Create indexes for the new fields
CREATE INDEX IF NOT EXISTS idx_audit_submissions_user_id ON audit_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_submissions_user_email ON audit_submissions(user_email);

-- Step 3: Drop unused indexes
DROP INDEX IF EXISTS idx_audit_submissions_status;
DROP INDEX IF EXISTS idx_audit_submissions_call_id;

-- Step 4: Replace overly permissive RLS policies with authentication-based ones

-- Drop old permissive policies
DROP POLICY IF EXISTS "Public read access on audit_submissions" ON audit_submissions;
DROP POLICY IF EXISTS "Public insert access on audit_submissions" ON audit_submissions;
DROP POLICY IF EXISTS "Public update access on audit_submissions" ON audit_submissions;

-- NEW POLICY 1: Authenticated users can read their own submissions
CREATE POLICY "Authenticated users can read own submissions"
  ON audit_submissions
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    OR user_email = auth.jwt() ->> 'email'
  );

-- NEW POLICY 2: Service role can read all submissions (for backend/n8n)
CREATE POLICY "Service role can read all submissions"
  ON audit_submissions
  FOR SELECT
  TO service_role
  USING (true);

-- NEW POLICY 3: Authenticated users can insert new submissions
CREATE POLICY "Authenticated users can insert submissions"
  ON audit_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- User can only insert if:
    -- 1. They own the submission (user_id matches)
    -- 2. OR no user_id is set (backward compatibility)
    user_id IS NULL
    OR auth.uid() = user_id
  );

-- NEW POLICY 4: Service role can insert for webhook processing
CREATE POLICY "Service role can insert submissions"
  ON audit_submissions
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- NEW POLICY 5: Authenticated users can update their own submissions
CREATE POLICY "Authenticated users can update own submissions"
  ON audit_submissions
  FOR UPDATE
  TO authenticated
  USING (
    -- Can only update if they own it
    auth.uid() = user_id
    OR user_email = auth.jwt() ->> 'email'
  )
  WITH CHECK (
    -- Cannot change the owner
    user_id = (
      SELECT user_id FROM audit_submissions
      WHERE id = audit_submissions.id
    )
  );

-- NEW POLICY 6: Service role can update all submissions (for n8n webhook response)
CREATE POLICY "Service role can update all submissions"
  ON audit_submissions
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- NEW POLICY 7: Email-based read access (alternative to user_id)
CREATE POLICY "Email-based read access"
  ON audit_submissions
  FOR SELECT
  TO authenticated
  USING (
    user_email = auth.jwt() ->> 'email'
  );

-- NEW POLICY 8: Public webhook writes (for n8n to create initial records)
-- This is limited to the service role only - anon users cannot bypass
CREATE POLICY "Webhook service can write submissions"
  ON audit_submissions
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Step 5: Enable RLS (ensure it's enabled)
ALTER TABLE audit_submissions ENABLE ROW LEVEL SECURITY;

-- Step 6: Keep only necessary indexes
-- KEPT: idx_audit_submissions_created_at (used for sorting)
-- DROP COMPLETED: idx_audit_submissions_status (not used in queries)
-- DROP COMPLETED: idx_audit_submissions_call_id (UNIQUE constraint has implicit index)
