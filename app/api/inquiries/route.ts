import { NextResponse } from 'next/server';
import { createInquiry } from '@/app/actions/create-inquiry';

export async function POST(req: Request) {
  const body = await req.json();
  const inquiryId = await createInquiry(body);

  if (!inquiryId) {
    return NextResponse.json({ error: 'Inquiry was not created' }, { status: 400 });
  }

  return NextResponse.json({ inquiryId }, { status: 201 });
}
