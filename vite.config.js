import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    extensions: ['.js', '.json', '.jsx', '.css'],
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0', // 允许外部访问
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://175.27.157.20:9999',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
