# Stage 1: Build React-Vite app
FROM node:alpine AS builder

# Set working directory
WORKDIR /app

# Copy root files (monorepo root)
COPY package.json package-lock.json lerna.json ./

# Install root dependencies (Lerna + Workspace deps)
RUN npm install

# Copy all monorepo files
COPY . .

# Move into client package
WORKDIR /app/packages/client

# Install client dependencies (if needed separately)
RUN npm install

# Build Vite client app
RUN npm run build

# Stage 2: Serve built app with Nginx
FROM nginx:alpine

# Copy built files to nginx folder
COPY --from=builder /app/packages/client/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
