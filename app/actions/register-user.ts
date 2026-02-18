'use server';

import { prisma } from '@/prisma/prisma-client';

import { VerificationUserTemplate } from '@/shared/components/shared/email-templates/verification-user';
import { sendEmail } from '@/shared/lib';
import { hashSync } from 'bcrypt';
import React from 'react';

export async function registerUser(body: { email: string; fullName: string; passwordHash: string }) {
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
        tenantId: 1,
      },
    });

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.verificationCode.create({
      data: {
        code,
        userId: createdUser.id,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
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
