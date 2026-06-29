# ---------- Base ----------
FROM node:20-alpine AS base
# libssl needed by Prisma engines on Alpine
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# ---------- Dependencies ----------
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# ---------- Builder ----------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Generate Prisma client + build Next (standalone output)
RUN npx prisma generate
RUN npm run build

# ---------- Runner ----------
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Standalone Next.js server output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prisma schema + seed
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
# Full node_modules so the Prisma CLI (db push) and the ts-node seed can run
# at container startup. This is a superset of the standalone node_modules.
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

EXPOSE 3000
USER nextjs

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"]
