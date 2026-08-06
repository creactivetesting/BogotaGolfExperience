import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const code = typeof body?.code === 'string' ? body.code.trim() : '';
    const targetUrl = typeof body?.targetUrl === 'string' ? body.targetUrl.trim() : '';
    const sourcePath = typeof body?.sourcePath === 'string' ? body.sourcePath.trim() : '';

    if (!code || !targetUrl) {
      return NextResponse.json({ error: 'Referral code and target URL are required.' }, { status: 400 });
    }

    await prisma.ambassadorLinkClick.create({
      data: {
        ambassadorCode: code,
        targetUrl,
        sourcePath: sourcePath || null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Unable to track referral click:', error);
    return NextResponse.json({ error: 'Unable to track referral click.' }, { status: 500 });
  }
}
