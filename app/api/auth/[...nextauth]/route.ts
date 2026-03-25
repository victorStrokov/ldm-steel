export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import NextAuth from 'next-auth';
import { authOptions } from '@/shared/constants/auth-options';
import { authLimiter, getRateLimitId } from '@/shared/lib/rate-limit';
import { NextRequest, NextResponse } from 'next/server';

const handler = NextAuth(authOptions);

export const GET = handler;

export async function POST(req: NextRequest) {
  const result = await authLimiter.limit(getRateLimitId(req, 'auth:nextauth:post'));

  if (!result.success) {
    return NextResponse.json(
      {
        error: 'Too many requests',
      },
      {
        status: 429,
      },
    );
  }

  return handler(req);
}
