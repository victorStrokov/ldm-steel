import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString =
  process.env.NODE_ENV === 'production'
    ? (process.env.DATABASE_URL ?? process.env.DATABASE_URL_UNPOOLED)
    : (process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL);

if (!connectionString) {
  throw new Error('DATABASE_URL or DATABASE_URL_UNPOOLED is required');
}

const useNeonAdapter = connectionString.includes('neon.tech');
const usePgAdapter = !useNeonAdapter;
const parsed = new URL(connectionString);
const isRemoteHost = !['localhost', '127.0.0.1'].includes(parsed.hostname);

const prismaClientSingleton = () => {
  const adapter = useNeonAdapter
    ? new PrismaNeon({ connectionString })
    : usePgAdapter
      ? new PrismaPg(
          new Pool({
            connectionString,
            ...(isRemoteHost && { ssl: { rejectUnauthorized: false } }),
          }),
        )
      : undefined;

  return new PrismaClient({
    ...(adapter ? { adapter } : {}),
    log: process.env.DATABASE_DEBUG === 'true' ? ['query', 'error', 'warn'] : ['error'],
  });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
