import React, { useRef, useState } from 'react';
import { Upload, Music, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { VALIDATION_RULES } from '../../config/constants';

interface DragDropZoneProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  error?: string;
}

export const DragDropZone: React.FC<DragDropZoneProps> = ({ file, onFileSelect, error }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (selectedFile: File) => {
    onFileSelect(selectedFile);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFile(droppedFiles[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Audio File</label>

      {!file ? (
        <motion.div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          animate={{ scale: isDragging ? 1.02 : 1 }}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : error
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-slate-800'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="audio/*"
            onChange={handleInputChange}
            className="hidden"
            aria-label="Upload audio file"
          />

          <Upload className={`w-12 h-12 mx-auto mb-3 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />

          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Drag and drop your audio file here
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            or click to browse (MP3, WAV, MP4, OGG • Max {VALIDATION_RULES.audio.maxSizeMB}MB)
          </p>

          <button
            onClick={() => inputRef.current?.click()}
            className="inline-block px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-shadow"
          >
            Select File
          </button>

          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 border border-blue-200 dark:border-blue-900/50 rounded-2xl p-6"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              <Music className="w-10 h-10 text-blue-500 flex-shrink-0 mt-1" />

              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{formatFileSize(file.size)}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  ✓ Ready to upload with your submission
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                onFileSelect(null);
                if (inputRef.current) inputRef.current.value = '';
              }}
              className="flex-shrink-0 p-2 hover:bg-white/50 dark:hover:bg-slate-700/50 rounded-lg transition-colors"
              aria-label="Remove file"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
