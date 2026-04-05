import { NextResponse } from 'next/server';
import { getCatalogSettings } from '@/app/actions/get-catalog-settings';

export async function GET() {
  const settings = await getCatalogSettings();
  return NextResponse.json({ settings });
}
