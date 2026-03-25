import { openApiDocument } from '@/shared/lib/openapi';
import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json(openApiDocument);
}
