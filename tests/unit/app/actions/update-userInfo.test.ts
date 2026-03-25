import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/lib/get-user-session', () => ({
  getUserSession: vi.fn(),
}));

vi.mock('@/prisma/prisma-client', () => ({
  prisma: {
    user: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('bcryptjs', () => ({
  hashSync: vi.fn(() => 'hashed-new-password'),
}));

import { updateUserInfo } from '@/app/actions/update-userInfo';
import { getUserSession } from '@/shared/lib/get-user-session';
import { prisma } from '@/prisma/prisma-client';
import { hashSync } from 'bcryptjs';

describe('updateUserInfo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('throws when user session is missing', async () => {
    vi.mocked(getUserSession).mockResolvedValue(null as never);

    await expect(
      updateUserInfo({
        email: 'user@example.com',
        fullName: 'User Name',
      }),
    ).rejects.toThrow('Пользователь не найден');
  });

  it('updates user with existing passwordHash when new password is not provided', async () => {
    vi.mocked(getUserSession).mockResolvedValue({ id: '15' } as never);
    vi.mocked(prisma.user.findFirst).mockResolvedValue({ passwordHash: 'old-hash' } as never);
    vi.mocked(prisma.user.update).mockResolvedValue({ id: 15 } as never);

    await updateUserInfo({
      email: 'user@example.com',
      fullName: 'User Name',
    });

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 15 },
      data: {
        email: 'user@example.com',
        fullName: 'User Name',
        passwordHash: 'old-hash',
      },
    });
  });

  it('hashes and stores new password when provided', async () => {
    vi.mocked(getUserSession).mockResolvedValue({ id: '7' } as never);
    vi.mocked(prisma.user.findFirst).mockResolvedValue({ passwordHash: 'old' } as never);
    vi.mocked(prisma.user.update).mockResolvedValue({ id: 7 } as never);

    await updateUserInfo({
      email: 'new@example.com',
      fullName: 'New Name',
      passwordHash: 'new-password',
    });

    expect(hashSync).toHaveBeenCalledWith('new-password', 10);
    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 7 },
        data: expect.objectContaining({ passwordHash: 'hashed-new-password' }),
      }),
    );
  });
});
