# Stage 1: Build the Angular application
FROM node:18 AS build
WORKDIR /app
# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install
# Copy the rest of the source code and build for production
COPY . .
# This will use environment.prod.ts if configured in angular.json
RUN npm run build -- --configuration=production 

# Stage 2: Serve the application with Nginx
FROM nginx:alpine
# Copy the compiled files from the build stage to Nginx's html folder
# Make sure the path matches your project's output path in angular.json
COPY --from=build /app/dist/revhire-frontend/browser /usr/share/nginx/html
# Expose port 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]