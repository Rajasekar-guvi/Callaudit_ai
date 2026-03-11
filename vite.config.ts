import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    allowedHosts: [
      'told-costume-consider-beef.trycloudflare.com',
      'labs-hello-generates-realized.trycloudflare.com',
      '.trycloudflare.com' 
    ]
  }
});

