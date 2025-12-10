'use server';

import { prisma } from '@/prisma/prisma-client';
import { getUserSession } from '@/shared/lib/get-user-session';
import { Prisma } from '@prisma/client';
import { hashSync } from 'bcrypt';

export async function updateUserInfo(body: Prisma.UserUpdateInput) {
  try {
    const currentUser = await getUserSession();

    if (!currentUser) {
      throw new Error('Пользователь не найден');
    }

    const findUser = await prisma.user.findFirst({
      where: {
        id: Number(currentUser.id),
      },
    });
    await prisma.user.update({
      where: {
        id: Number(currentUser.id),
      },
      data: {
        fullName: body.fullName,
        email: body.email,
        passwordHash: body.passwordHash ? hashSync(body.passwordHash as string, 10) : findUser?.passwordHash,
      },
    });
  } catch (error) {
    console.log('[Update User Info] Server Error', error);
    throw error;
  }
}
