/*
  # Add Email Column to audit_submissions table

  1. New Column
    - `email` (text, optional)
      For tracking which user/email submitted the audit

  2. Index
    - Index on email for fast lookups

  3. Notes
    - Optional to maintain backward compatibility with existing rows
    - Can be used for email notifications
    - Can filter audits by submitter email
*/

-- Add email column if it doesn't exist
ALTER TABLE audit_submissions
ADD COLUMN IF NOT EXISTS email text;

-- Create index for faster queries by email
CREATE INDEX IF NOT EXISTS idx_audit_submissions_email ON audit_submissions(email);

-- Add comment for documentation
COMMENT ON COLUMN audit_submissions.email IS 'Email address of the person who submitted the audit';
