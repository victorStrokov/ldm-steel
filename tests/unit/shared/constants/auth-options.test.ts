import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next-auth/providers/google', () => ({
  default: vi.fn((config: unknown) => ({ id: 'google', ...(config as Record<string, unknown>) })),
}));

vi.mock('next-auth/providers/github', () => ({
  default: vi.fn((config: unknown) => ({ id: 'github', ...(config as Record<string, unknown>) })),
}));

vi.mock('next-auth/providers/credentials', () => ({
  default: vi.fn((config: unknown) => ({ id: 'credentials', ...(config as Record<string, unknown>) })),
}));

vi.mock('@/prisma/prisma-client', () => ({
  prisma: {
    user: {
      findFirst: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock('bcryptjs', () => ({
  compare: vi.fn(),
  hashSync: vi.fn(() => 'hashed-password'),
}));

import { authOptions } from '@/shared/constants/auth-options';
import { prisma } from '@/prisma/prisma-client';
import { compare, hashSync } from 'bcryptjs';

describe('authOptions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ json: async () => ({ id: 'mailru-user' }) })),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('credentials authorize returns null when credentials are missing', async () => {
    const credentialsProvider = authOptions.providers.find((p) => (p as { id?: string }).id === 'credentials') as {
      authorize: (credentials?: { email?: string; passwordHash?: string }) => Promise<unknown>;
    };

    const result = await credentialsProvider.authorize();

    expect(result).toBeNull();
  });

  it('credentials authorize returns user when credentials are valid', async () => {
    const credentialsProvider = authOptions.providers.find((p) => (p as { id?: string }).id === 'credentials') as {
      authorize: (credentials?: { email?: string; passwordHash?: string }) => Promise<unknown>;
    };

    vi.mocked(prisma.user.findFirst).mockResolvedValue({
      id: 1,
      email: 'user@example.com',
      passwordHash: 'hash',
      fullName: 'User Name',
      role: 'USER',
      verified: new Date(),
    } as never);
    vi.mocked(compare).mockResolvedValue(true as never);

    const result = await credentialsProvider.authorize({
      email: 'user@example.com',
      passwordHash: 'password',
    });

    expect(result).toEqual({
      id: 1,
      email: 'user@example.com',
      name: 'User Name',
      role: 'USER',
    });
  });

  it('credentials authorize rejects invalid user/password/verification combinations', async () => {
    const credentialsProvider = authOptions.providers.find((p) => (p as { id?: string }).id === 'credentials') as {
      authorize: (credentials?: { email?: string; passwordHash?: string }) => Promise<unknown>;
    };

    vi.mocked(prisma.user.findFirst).mockResolvedValueOnce(null as never);
    const noUser = await credentialsProvider.authorize({ email: 'nouser@example.com', passwordHash: 'pass' });
    expect(noUser).toBeNull();

    vi.mocked(prisma.user.findFirst).mockResolvedValueOnce({
      id: 2,
      email: 'user2@example.com',
      passwordHash: 'hash',
      fullName: 'User 2',
      role: 'USER',
      verified: new Date(),
    } as never);
    vi.mocked(compare).mockResolvedValueOnce(false as never);
    const badPass = await credentialsProvider.authorize({ email: 'user2@example.com', passwordHash: 'wrong' });
    expect(badPass).toBeNull();

    vi.mocked(prisma.user.findFirst).mockResolvedValueOnce({
      id: 3,
      email: 'user3@example.com',
      passwordHash: 'hash',
      fullName: 'User 3',
      role: 'USER',
      verified: null,
    } as never);
    vi.mocked(compare).mockResolvedValueOnce(true as never);
    const notVerified = await credentialsProvider.authorize({ email: 'user3@example.com', passwordHash: 'pass' });
    expect(notVerified).toBeNull();
  });

  it('signIn callback handles credentials provider and missing email', async () => {
    const callbacks = authOptions.callbacks!;

    const credentialsSignIn = await callbacks.signIn!({
      user: { id: '1', email: 'user@example.com' },
      account: { provider: 'credentials' },
    } as never);
    expect(credentialsSignIn).toBe(true);

    const noEmailSignIn = await callbacks.signIn!({
      user: { id: '1', email: null },
      account: { provider: 'google', providerAccountId: 'acc1' },
    } as never);
    expect(noEmailSignIn).toBe(false);
  });

  it('signIn callback updates existing OAuth user and creates a new one when absent', async () => {
    const callbacks = authOptions.callbacks!;

    vi.mocked(prisma.user.findFirst).mockResolvedValueOnce({ id: 11 } as never);
    const updatePath = await callbacks.signIn!({
      user: { id: '11', email: 'exists@example.com', name: 'Existing' },
      account: { provider: 'google', providerAccountId: 'provider-1' },
    } as never);

    expect(updatePath).toBe(true);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 11 },
      data: { provider: 'google', providerId: 'provider-1' },
    });

    vi.mocked(prisma.user.findFirst).mockResolvedValueOnce(null as never);
    const createPath = await callbacks.signIn!({
      user: { id: '22', email: 'new@example.com', name: 'New User' },
      account: { provider: 'github', providerAccountId: 'provider-2' },
    } as never);

    expect(createPath).toBe(true);
    expect(hashSync).toHaveBeenCalledWith('22', 10);
    expect(prisma.user.create).toHaveBeenCalled();
  });

  it('signIn callback returns false when an exception is thrown', async () => {
    const callbacks = authOptions.callbacks!;
    vi.mocked(prisma.user.findFirst).mockRejectedValueOnce(new Error('db error'));

    const result = await callbacks.signIn!({
      user: { id: '1', email: 'user@example.com', name: 'User' },
      account: { provider: 'google', providerAccountId: 'provider-3' },
    } as never);

    expect(result).toBe(false);
  });

  it('jwt callback returns unchanged token when email is missing and enriches token when user exists', async () => {
    const callbacks = authOptions.callbacks!;

    const tokenWithoutEmail = { sub: '1' };
    const unchanged = await callbacks.jwt!({ token: tokenWithoutEmail } as never);
    expect(unchanged).toEqual(tokenWithoutEmail);

    vi.mocked(prisma.user.findFirst).mockResolvedValueOnce({
      id: 9,
      email: 'jwt@example.com',
      fullName: 'JWT User',
      role: 'ADMIN',
    } as never);
    const tokenWithEmail = { email: 'jwt@example.com' };
    const enriched = await callbacks.jwt!({ token: tokenWithEmail } as never);

    expect(enriched).toMatchObject({
      id: '9',
      email: 'jwt@example.com',
      fullName: 'JWT User',
      role: 'ADMIN',
    });
  });

  it('session callback maps token fields to session.user', async () => {
    const callbacks = authOptions.callbacks!;

    const session = {
      user: {
        name: 'User',
        email: 'user@example.com',
      },
    };
    const token = { id: '5', role: 'MANAGER' };

    const result = await callbacks.session!({ session, token } as never);

    expect(result).toMatchObject({
      user: {
        id: '5',
        role: 'MANAGER',
      },
    });
  });

  it('mailru provider profile and userinfo request behave as expected', async () => {
    const mailru = authOptions.providers[0] as {
      profile: (profile: { id: string; name?: string; nickname?: string; email: string }) => {
        role: string;
        name: string;
        email: string;
        id: string;
      };
      userinfo: { request: (context: { tokens: { access_token: string } }) => Promise<unknown> };
    };

    const mapped = mailru.profile({ id: '123', nickname: 'nick', email: 'mailru@example.com' });
    expect(mapped).toMatchObject({ role: 'USER', name: 'nick', email: 'mailru@example.com', id: '123' });

    const info = await mailru.userinfo.request({ tokens: { access_token: 'token-123' } });
    expect(info).toEqual({ id: 'mailru-user' });
    expect(fetch).toHaveBeenCalled();
  });
});
