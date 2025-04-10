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
    port: 5173, // 指定端口
    strictPort: true, // 如果 5173 端口被占用，则直接报错，而不是尝试其他端口
    proxy: {
      '/api': {
        //target: 'http://:9999',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
