import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextRequest } from 'next/server';

type LimitResult = {
  success: boolean;
  pending?: Promise<unknown>;
  limit?: number;
  remaining?: number;
  reset?: number;
};

type LimiterLike = {
  limit: (identifier: string) => Promise<LimitResult>;
};

type WindowValue = `${number} ${'ms' | 's' | 'm' | 'h' | 'd'}`;

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const passThroughLimiter: LimiterLike = {
  async limit() {
    return { success: true };
  },
};

function createLimiter(max: number, window: WindowValue): LimiterLike {
  if (!redisUrl || !redisToken) {
    return passThroughLimiter;
  }

  return new Ratelimit({
    redis: new Redis({ url: redisUrl, token: redisToken }),
    limiter: Ratelimit.slidingWindow(max, window),
    analytics: true,
    prefix: `rl:${window}:${max}`,
  });
}

const authMax = Number(process.env.RATE_LIMIT_AUTH_MAX ?? '10');
const authWindow = (process.env.RATE_LIMIT_AUTH_WINDOW ?? '1 m') as WindowValue;
const apiMax = Number(process.env.RATE_LIMIT_API_MAX ?? '60');
const apiWindow = (process.env.RATE_LIMIT_API_WINDOW ?? '1 m') as WindowValue;

export const authLimiter = createLimiter(authMax, authWindow);
export const apiLimiter = createLimiter(apiMax, apiWindow);

export function getRateLimitId(req: NextRequest, scope: string): string {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-client-ip') ||
    'unknown';

  // const token = req.cookies?.get?.('cartToken')?.value; // Safely get cartToken (оставлено на будущее)
  return `${scope}:${ip}`; // Return the scope and IP
}
