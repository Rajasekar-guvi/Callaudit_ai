import { supabase } from './supabaseClient';

export const storageService = {
  async uploadAudio(file: File, callId: string): Promise<string> {
    const fileExtension = file.name.split('.').pop() || 'mp3';
    const fileName = `${callId}_${Date.now()}.${fileExtension}`;
    const filePath = `call_recordings/${fileName}`;

    const { error, data } = await supabase.storage
      .from('audio_files')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      throw new Error(`Failed to upload audio: ${error.message}`);
    }

    const { data: publicData } = supabase.storage
      .from('audio_files')
      .getPublicUrl(filePath);

    return publicData.publicUrl;
  },

  async deleteAudio(filePath: string): Promise<void> {
    const { error } = await supabase.storage
      .from('audio_files')
      .remove([filePath]);

    if (error) {
      throw new Error(`Failed to delete audio: ${error.message}`);
    }
  },
};
