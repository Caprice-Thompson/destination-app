import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        // Rewrite the path, removing '/api' prefix when forwarding
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});