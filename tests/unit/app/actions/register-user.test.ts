import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/lib', () => ({
  sendEmail: vi.fn(),
}));

vi.mock('@/prisma/prisma-client', () => ({
  prisma: {
    user: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    verificationCode: {
      create: vi.fn(),
    },
  },
}));

import { registerUser } from '@/app/actions/register-user';
import { prisma } from '@/prisma/prisma-client';
import { sendEmail } from '@/shared/lib';

describe('registerUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('throws when user already exists and verified', async () => {
    vi.mocked(prisma.user.findFirst).mockResolvedValue({
      id: 1,
      email: 'exists@example.com',
      verified: new Date(),
    } as never);

    await expect(
      registerUser({
        email: 'exists@example.com',
        fullName: 'Existing User',
        passwordHash: '12345678',
      }),
    ).rejects.toThrow('Пользователь с таким email уже зарегистрирован');
  });

  it('creates user, verification code and sends email for new user', async () => {
    vi.mocked(prisma.user.findFirst).mockResolvedValue(null as never);
    vi.mocked(prisma.user.create).mockResolvedValue({
      id: 42,
      email: 'new@example.com',
    } as never);

    await registerUser({
      email: 'new@example.com',
      fullName: 'New User',
      passwordHash: '12345678',
    });

    expect(prisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: 'new@example.com',
          fullName: 'New User',
          tenantId: 1,
        }),
      }),
    );
    expect(prisma.verificationCode.create).toHaveBeenCalled();
    expect(sendEmail).toHaveBeenCalled();
  });
});
