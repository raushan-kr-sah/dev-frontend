import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/generate': {
        target: 'https://dev-backend-2qet.onrender.com',
        changeOrigin: true,
      },
      '/export': {
        target: 'https://dev-backend-2qet.onrender.com',
        changeOrigin: true,
      },
    },
  },
});
