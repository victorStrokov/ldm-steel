import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/lib', () => ({
  sendEmail: vi.fn(),
}));

vi.mock('@/prisma/prisma-client', () => ({
  prisma: {
    order: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
  },
}));

import { POST } from '@/app/api/checkout/callback/route';
import { prisma } from '@/prisma/prisma-client';
import { sendEmail } from '@/shared/lib';

describe('POST /api/checkout/callback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 when order is not found', async () => {
    vi.mocked(prisma.order.findFirst).mockResolvedValue(null as never);

    const res = await POST({
      json: async () => ({ object: { metadata: { order_id: '99' }, status: 'succeeded' } }),
    } as never);

    expect(res.status).toBe(404);
  });

  it('marks order as cancelled when payment is not succeeded', async () => {
    vi.mocked(prisma.order.findFirst).mockResolvedValue({
      id: 10,
      email: 'user@example.com',
      items: '[]',
      totalAmount: 1000,
    } as never);

    vi.mocked(prisma.order.update).mockResolvedValue({ id: 10 } as never);

    const res = await POST({
      json: async () => ({ object: { metadata: { order_id: '10' }, status: 'canceled' } }),
    } as never);

    expect(res.status).toBe(200);
    expect(prisma.order.update).toHaveBeenCalledWith({
      where: { id: 10 },
      data: { status: 'CANCELLED' },
    });
    expect(sendEmail).toHaveBeenCalled();
  });

  it('updates order and sends email when payment succeeds', async () => {
    vi.mocked(prisma.order.findFirst).mockResolvedValue({
      id: 10,
      email: 'user@example.com',
      items: JSON.stringify([{ id: 1, quantity: 1 }]),
      totalAmount: 1000,
    } as never);

    vi.mocked(prisma.order.update).mockResolvedValue({ id: 10 } as never);

    const res = await POST({
      json: async () => ({ object: { metadata: { order_id: '10' }, status: 'succeeded' } }),
    } as never);

    expect(res.status).toBe(200);
    expect(prisma.order.update).toHaveBeenCalled();
    expect(sendEmail).toHaveBeenCalled();
  });
});
