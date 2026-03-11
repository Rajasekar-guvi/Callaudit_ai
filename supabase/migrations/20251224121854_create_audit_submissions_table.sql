/*
  # Create audit_submissions table

  1. New Tables
    - `audit_submissions`
      - `id` (uuid, primary key)
      - `agent_name` (text, required)
      - `call_id` (text, unique, required)
      - `call_duration` (integer, seconds, required)
      - `call_type` (enum: 'inbound' | 'outbound', required)
      - `notes` (text, optional)
      - `audio_filename` (text, optional)
      - `audio_size` (integer, bytes, optional)
      - `audio_url` (text, optional)
      - `status` (enum: 'pending' | 'passed' | 'failed' | 'flagged', default: 'pending')
      - `compliance_score` (integer 0-100, optional)
      - `violations` (jsonb array, optional)
      - `webhook_response` (jsonb, stores full n8n response)
      - `created_at` (timestamp, default: now())
      - `updated_at` (timestamp, default: now())

  2. Security
    - Enable RLS on `audit_submissions` table
    - Add policy for public read access
    - Add policy for public insert access
    - Add policy for public update access

  3. Indexes
    - Index on call_id for uniqueness and fast lookups
    - Index on created_at for sorting
    - Index on status for filtering

  4. Notes
    - No authentication required (public access)
    - Assumes synchronous webhook response handling
    - Audio file handling is metadata-only (filename, size, url placeholder)
*/

CREATE TYPE audit_status AS ENUM ('pending', 'passed', 'failed', 'flagged');
CREATE TYPE call_type_enum AS ENUM ('inbound', 'outbound');

CREATE TABLE IF NOT EXISTS audit_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name text NOT NULL,
  call_id text UNIQUE NOT NULL,
  call_duration integer NOT NULL,
  call_type call_type_enum NOT NULL,
  notes text,
  audio_filename text,
  audio_size integer,
  audio_url text,
  status audit_status DEFAULT 'pending',
  compliance_score integer CHECK (compliance_score >= 0 AND compliance_score <= 100),
  violations jsonb DEFAULT '[]'::jsonb,
  webhook_response jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE audit_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access on audit_submissions"
  ON audit_submissions
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public insert access on audit_submissions"
  ON audit_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public update access on audit_submissions"
  ON audit_submissions
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_audit_submissions_call_id ON audit_submissions(call_id);
CREATE INDEX IF NOT EXISTS idx_audit_submissions_created_at ON audit_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_submissions_status ON audit_submissions(status);
