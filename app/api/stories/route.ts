import { prisma } from '@/prisma/prisma-client';
import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

export const dynamic = 'force-dynamic';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const STORIES_CACHE_KEY = 'stories:all';
const STORIES_CACHE_TTL = 900; // 15 minutes

export async function GET() {
  try {
    // Try cache first
    const cached = await redis.get(STORIES_CACHE_KEY);
    if (cached) {
      if (typeof cached === 'string') {
        return NextResponse.json(JSON.parse(cached));
      }

      return NextResponse.json(cached);
    }
  } catch (error) {
    console.warn('[Cache] Failed to get stories from Redis', error);
    // Continue to DB fetch on cache error
  }

  try {
    const stories = await prisma.story.findMany({
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Cache for future requests
    try {
      await redis.setex(STORIES_CACHE_KEY, STORIES_CACHE_TTL, JSON.stringify(stories));
    } catch (error) {
      console.warn('[Cache] Failed to set stories in Redis', error);
    }

    return NextResponse.json(stories);
  } catch (error) {
    console.error('Failed to read stories from database', error);
    return NextResponse.json([], { status: 200 });
  }
}
