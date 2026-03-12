# Stage 1 - Build Angular app
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2 - Serve using Nginx
FROM nginx:alpine
COPY --from=build /app/dist/revhire-frontend/browser /usr/share/nginx/html
EXPOSE 80