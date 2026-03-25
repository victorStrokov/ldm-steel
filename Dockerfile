FROM node:22-slim AS builder

WORKDIR /app


# Сначала копируем package.json и lock-файл
COPY package*.json ./

# Копируем prisma до npm ci, чтобы зависимости и генерация работали корректно
COPY prisma ./prisma

RUN npm ci

COPY . .

# Prisma generate expects DATABASE_URL at build time.
ARG DATABASE_URL="postgresql://user:pass@localhost:5432/db"
ENV DATABASE_URL=${DATABASE_URL}
RUN npm run prisma:generate

# Tell next.config.ts to produce standalone output (required for Docker).
ENV NEXT_OUTPUT=standalone
RUN npm run build

FROM node:22-slim AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 3000
CMD ["node", "server.js"]
