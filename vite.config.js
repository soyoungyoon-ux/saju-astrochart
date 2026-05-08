import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 개발 환경에서 CORS 우회 (production은 서버리스 함수 사용)
      '/api/anthropic': {
        target: 'https://api.anthropic.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/anthropic/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            // 개발 환경에서는 .env.local의 키를 추가
            if (process.env.VITE_ANTHROPIC_API_KEY) {
              proxyReq.setHeader('x-api-key', process.env.VITE_ANTHROPIC_API_KEY);
              proxyReq.setHeader('anthropic-version', '2023-06-01');
            }
          });
        },
      },
    },
  },
});
