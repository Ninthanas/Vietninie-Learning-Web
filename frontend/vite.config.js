import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' keeps the build deployable on GitHub Pages / any sub-path.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: { port: 5173 },
  build: { chunkSizeWarningLimit: 1500 }
});
