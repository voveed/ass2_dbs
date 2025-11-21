import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false,
  },
  optimizeDeps: {
    esbuildOptions: {
      logOverride: { 
        'unsupported-source-map-comment': 'silent',
        'invalid-source-mappings': 'silent'
      },
    },
  },
  server: {
    port: 3000,
  },
});
