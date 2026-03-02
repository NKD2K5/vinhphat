# Use Node.js 20 Debian as base image
FROM node:20-slim AS base

# Install dependencies only when needed
FROM base AS deps
# Install build dependencies for canvas and sharp
RUN apt-get update && apt-get install -y python3 make g++ libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev libpixman-1-dev libpangomm-1.4-dev && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm install --no-optional --legacy-peer-deps

# Rebuild native modules for Docker container
RUN npm rebuild @swc/core canvas sharp

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build only Next.js with webpack and Node version check disabled
RUN NODE_OPTIONS="--no-warnings" NEXT_TELEMETRY_DISABLED=1 npm run build:webpack

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the built application
COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Payload config (optional, for future use)
COPY --from=builder --chown=nextjs:nodejs /app/payload.config.js ./

USER nextjs

EXPOSE 3000

# Start Next.js server only
CMD ["npm", "start"]
