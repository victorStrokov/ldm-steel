import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL;
  const useNeonAdapter = Boolean(connectionString && connectionString.includes('neon.tech'));
  const usePgAdapter = Boolean(connectionString && !useNeonAdapter);

  const adapter =
    useNeonAdapter && connectionString
      ? new PrismaNeon({ connectionString })
      : usePgAdapter && connectionString
        ? new PrismaPg(new Pool({ connectionString }))
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
