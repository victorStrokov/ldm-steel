import { prisma } from '@/prisma/prisma-client';
import { apiLimiter, getRateLimitId } from '@/shared/lib/rate-limit';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const limit = await apiLimiter.limit(getRateLimitId(req, 'api:users:get'));
  if (!limit.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const limit = await apiLimiter.limit(getRateLimitId(req, 'api:users:post'));
  if (!limit.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const data = await req.json();
  const user = await prisma.user.create({
    data,
  });
  return NextResponse.json(user);
}
