# ---------- Build Stage ----------
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# ---------- Nginx Stage ----------
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

# ⚠️ IMPORTANT: Angular 17 browser folder
COPY --from=build /app/dist/aws-tagging-dashboard/browser /usr/share/nginx/html

# Fix SPA routing
RUN printf 'server {\n\
  listen 80;\n\
  server_name localhost;\n\
  root /usr/share/nginx/html;\n\
  index index.html;\n\
  location / {\n\
    try_files $uri $uri/ /index.html;\n\
  }\n\
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]