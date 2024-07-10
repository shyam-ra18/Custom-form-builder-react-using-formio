import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '',  // Ensure paths are relative
  build: {
    outDir: 'dist',  // Output directory for the production build
    sourcemap: true, // Optional: enable source maps for debugging
  },
});
