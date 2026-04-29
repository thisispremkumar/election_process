# Google Cloud Run Dockerfile for Election Process Assistant
# Uses Node.js with build tools for native dependencies (Cloud Profiler)
FROM node:20-slim

# Install Python and build tools required by @google-cloud/profiler (pprof native module)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy dependency manifests first for Docker layer caching
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy application source code
COPY . .

# Expose the port Cloud Run expects (set via PORT env var)
EXPOSE 8080

# Set environment variables for Google Cloud Run
ENV PORT=8080
ENV NODE_ENV=production

# Start the server
CMD ["node", "server.js"]
