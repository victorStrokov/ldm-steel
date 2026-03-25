import { prisma } from '@/prisma/prisma-client';
import { logger } from '@/shared/lib/logger';
import { authLimiter, getRateLimitId } from '@/shared/lib/rate-limit';
import { NextRequest, NextResponse } from 'next/server';

const log = logger.child({ module: 'api/auth/verify' });

export async function GET(req: NextRequest) {
  try {
    const limit = await authLimiter.limit(getRateLimitId(req, 'auth:verify:get'));
    if (!limit.success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const code = req.nextUrl.searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'Code is required/ Код не верный' }, { status: 400 });
    }

    const verificationCode = await prisma.verificationCode.findFirst({
      where: {
        code,
      },
    });

    if (!verificationCode) {
      return NextResponse.json({ error: 'Code is invalid/ Код не верный' }, { status: 400 });
    }

    await prisma.user.update({
      where: {
        id: verificationCode.userId,
      },
      data: {
        verified: new Date(),
      },
    });

    await prisma.verificationCode.delete({
      where: {
        id: verificationCode.id,
      },
    });

    return NextResponse.redirect(new URL('/?verified', req.url));
  } catch (error) {
    log.error({ err: error }, 'GET /api/auth/verify failed');
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
