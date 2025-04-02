# 빌드 단계를 위한 Node 이미지 사용
FROM node:18-alpine AS build

# 작업 디렉토리를 현재 디렉토리로 설정
WORKDIR /usr/src/app

# 의존성 파일 복사 및 설치
COPY package.json package-lock.json ./
RUN npm ci

# 소스 코드 복사
COPY . ./

# 애플리케이션 빌드
RUN npm run build

# 프로덕션 단계
FROM nginx:alpine

# Nginx의 기본 정적 파일 경로에 빌드된 파일 복사
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# 포트 80 노출
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]