import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/team3/',
  server: {
    proxy: {
      // 클라이언트 요청 경로의 시작 부분인 '/agrifood'를 매칭합니다.
      '/agrifood': {
        // 실제 API 요청이 도달하는 최종 도메인을 target으로 설정합니다.
        // 에러 메시지에 따르면 'https://api.naas.go.kr' 입니다.
        target: 'https://api.naas.go.kr',
        // 대상 서버의 호스트 헤더를 변경하여 CORS 문제를 회피합니다.
        changeOrigin: true,
        // 요청 경로를 rewrite하여 'http://localhost:5173/agrifood/1390802/AgriFood/...'가
        // 'https://api.naas.go.kr/service/AgriFood/...'로 변환되도록 합니다.
        // 즉, '/agrifood/1390802' 부분을 '/service'로 대체합니다.
        rewrite: (path) => path.replace(/^\/agrifood\/1390802/, '/service'),
        // 개발 환경에서 SSL 인증서 문제 발생 시 사용합니다.
        // 실제 운영 환경에서는 'true'로 설정하거나 불필요하면 제거합니다.
        secure: false,
      },
    },
  },
})
