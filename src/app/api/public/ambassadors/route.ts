import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function isAmbassadorActive(status: string) {
  const normalized = status.trim().toLowerCase();
  return normalized === 'active' || normalized === 'activo';
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code')?.trim();

    if (!code) {
      return NextResponse.json({ error: 'Referral code is required.' }, { status: 400 });
    }

    const ambassador = await prisma.ambassador.findUnique({
      where: { code },
      select: {
        name: true,
        status: true,
      },
    });

    if (!ambassador || !isAmbassadorActive(ambassador.status)) {
      return NextResponse.json({ error: 'Active ambassador not found.' }, { status: 404 });
    }

    return NextResponse.json({
      name: ambassador.name,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Unable to resolve ambassador.' }, { status: 500 });
  }
}
