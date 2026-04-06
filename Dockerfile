# Stage 1: Build
FROM node:21-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_CHAT_API_URL
ARG VITE_CHAT_API_KEY

ENV VITE_CHAT_API_URL=$VITE_CHAT_API_URL
ENV VITE_CHAT_API_KEY=$VITE_CHAT_API_KEY

RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# nginx config to handle SPA client-side routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
