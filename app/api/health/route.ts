import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma-client';

export const dynamic = 'force-dynamic';

export async function GET() {
  const uptime = Math.floor(process.uptime());

  try {
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({ status: 'ok', db: 'ok', uptime }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown error';

    return NextResponse.json({ status: 'error', db: 'unreachable', error: message, uptime }, { status: 503 });
  }
}
