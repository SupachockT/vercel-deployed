import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // The build output directory (this will be served on Vercel)
    sourcemap: true, // Optionally, enable source maps for debugging
  },
});
