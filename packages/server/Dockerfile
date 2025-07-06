FROM node:alpine

# Set root dir as monorepo root
WORKDIR /app

# Copy root files for dependency installation
COPY ../../package.json ../../package-lock.json ../../lerna.json ./

# Copy only server's package.json
COPY ./package.json ./packages/server/package.json

# Install deps (you can customize with npm or lerna)
RUN npm install

# Copy the whole monorepo (to have shared deps if needed)
COPY ../../ ./

# Move into server and build
WORKDIR /app/packages/server
RUN npm run build

# Expose port
EXPOSE 5000

# Run server
CMD ["npm", "start"]
