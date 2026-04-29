# Google Cloud Run Dockerfile for Election Process Assistant
# Uses a lightweight Node.js image for efficient cloud deployment
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy dependency manifests first for Docker layer caching
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy application source code
COPY . .

# Expose the port Cloud Run expects (set via PORT env var)
EXPOSE 8080

# Set environment variables for Google Cloud Run
ENV PORT=8080
ENV NODE_ENV=production

# Health check for Cloud Run
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD curl -f http://localhost:8080/ || exit 1

# Start the server
CMD ["node", "server.js"]
