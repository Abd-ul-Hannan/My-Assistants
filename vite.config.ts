import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api/tavus': {
        target: 'https://api.tavus.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/tavus/, ''),
        secure: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          elevenlabs: ['@elevenlabs/elevenlabs-js'],
        },
      },
    },
  },
});