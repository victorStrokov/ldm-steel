import { prisma } from '@/prisma/prisma-client';
import { getUserSession } from '@/shared/lib/get-user-session';
import { logger } from '@/shared/lib/logger';
import { NextResponse } from 'next/server';

const log = logger.child({ module: 'api/auth/me' });

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getUserSession();

    if (!user) {
      return NextResponse.json({ message: '[USER_GET] Unauthorized / Вы не авторизованы' }, { status: 401 });
    }
    const data = await prisma.user.findUnique({
      where: {
        id: Number(user.id),
      },
      select: {
        fullName: true,
        email: true,
        passwordHash: false,
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    log.error({ err: error }, 'GET /api/auth/me failed');
    return NextResponse.json({ message: '[USER_GET] Server error' }, { status: 500 });
  }
}
