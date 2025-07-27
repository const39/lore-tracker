# Build app
FROM node:lts-alpine AS builder

COPY . /app
WORKDIR /app
RUN npm install && npm run build

# Serve app
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html