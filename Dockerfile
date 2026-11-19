# ── Build stage ──────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Runtime stage ─────────────────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

# Only bring what the server needs at runtime
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/package.json ./package.json

# Install tsx for running TypeScript directly (no extra build step)
RUN npm install --ignore-scripts tsx@4 @types/node

EXPOSE 8888

ENV NODE_ENV=production
ENV PORT=8888

CMD ["node", "--import", "tsx", "server.ts"]
