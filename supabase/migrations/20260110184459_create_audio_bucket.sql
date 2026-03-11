/*
  # Create Audio Storage Bucket
  
  1. Storage
    - Create `audio_files` bucket for storing call recordings
    - Make files publicly accessible for webhook processing
*/

DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('audio_files', 'audio_files', true)
  ON CONFLICT (id) DO NOTHING;
END $$;

CREATE POLICY "Public Access"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'audio_files');

CREATE POLICY "Users can upload audio"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'audio_files');

CREATE POLICY "Users can delete their audio"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'audio_files');
