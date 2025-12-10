'use server';

import { prisma } from '@/prisma/prisma-client';

import { VerificationUserTemplate } from '@/shared/components/shared/email-templates/verification-user';
import { sendEmail } from '@/shared/lib';
import { Prisma } from '@prisma/client';
import { hashSync } from 'bcrypt';
import React from 'react';

export async function registerUser(body: Prisma.UserCreateInput) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });

    if (user) {
      if (!user.verified) {
        throw new Error('Почта не подтверждена');
      }
      throw new Error('Пользователь с таким email уже зарегистрирован');
    }

    const createdUser = await prisma.user.create({
      data: {
        fullName: body.fullName,
        email: body.email,
        passwordHash: hashSync(body.passwordHash as string, 10),
      },
    });

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.verificationCode.create({
      data: {
        code,
        userId: createdUser.id,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // Код действителен 10 минут
      },
    });

    await sendEmail(
      createdUser.email,
      'Next Steel / Подтвердите регистрацию',
      React.createElement(VerificationUserTemplate, { code }),
    );
  } catch (error) {
    console.error('[Register User] Server Error', error);
    throw error;
  }
}
