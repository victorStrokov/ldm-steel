import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/prisma/prisma-client', () => ({
  prisma: {
    verificationCode: {
      findFirst: vi.fn(),
      delete: vi.fn(),
    },
    user: {
      update: vi.fn(),
    },
  },
}));

import { GET } from '@/app/api/auth/verify/route';
import { prisma } from '@/prisma/prisma-client';

describe('GET /api/auth/verify', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 400 when code is missing', async () => {
    const req = {
      nextUrl: new URL('http://localhost:3000/api/auth/verify'),
      url: 'http://localhost:3000/api/auth/verify',
      cookies: { get: vi.fn().mockReturnValue(undefined) },
      headers: { get: vi.fn().mockReturnValue(undefined) },
    } as never;

    const res = await GET(req);

    expect(res?.status).toBe(400);
    await expect(res?.json()).resolves.toEqual({ error: 'Code is required/ Код не верный' });
  });

  it('returns 400 when verification code is invalid', async () => {
    vi.mocked(prisma.verificationCode.findFirst).mockResolvedValue(null as never);

    const req = {
      nextUrl: new URL('http://localhost:3000/api/auth/verify?code=1234'),
      url: 'http://localhost:3000/api/auth/verify?code=1234',
      cookies: { get: vi.fn().mockReturnValue(undefined) },
      headers: { get: vi.fn().mockReturnValue(undefined) },
    } as never;

    const res = await GET(req);

    expect(res?.status).toBe(400);
    await expect(res?.json()).resolves.toEqual({ error: 'Code is invalid/ Код не верный' });
  });

  it('marks user verified and redirects when code is valid', async () => {
    vi.mocked(prisma.verificationCode.findFirst).mockResolvedValue({
      id: 10,
      userId: 20,
      code: '1234',
    } as never);
    vi.mocked(prisma.user.update).mockResolvedValue({ id: 20 } as never);
    vi.mocked(prisma.verificationCode.delete).mockResolvedValue({ id: 10 } as never);

    const req = {
      nextUrl: new URL('http://localhost:3000/api/auth/verify?code=1234'),
      url: 'http://localhost:3000/api/auth/verify?code=1234',
      cookies: { get: vi.fn().mockReturnValue(undefined) },
      headers: { get: vi.fn().mockReturnValue(undefined) },
    } as never;

    const res = await GET(req);

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 20 },
      data: { verified: expect.any(Date) },
    });
    expect(prisma.verificationCode.delete).toHaveBeenCalledWith({ where: { id: 10 } });
    expect(res?.status).toBe(307);
    expect(res?.headers.get('location')).toContain('/?verified');
  });
});
