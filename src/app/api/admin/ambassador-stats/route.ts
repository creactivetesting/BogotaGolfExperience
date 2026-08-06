import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ambassadorId = searchParams.get('ambassadorId')?.trim();

    if (!ambassadorId) {
      return NextResponse.json({ error: 'ambassadorId is required.' }, { status: 400 });
    }

    const ambassador = await prisma.ambassador.findUnique({
      where: { id: ambassadorId },
      select: { code: true },
    });

    if (!ambassador) {
      return NextResponse.json({ error: 'Ambassador not found.' }, { status: 404 });
    }

    const clicks = await prisma.ambassadorLinkClick.findMany({
      where: { ambassadorCode: ambassador.code },
      orderBy: { clickedAt: 'desc' },
      select: { targetUrl: true, clickedAt: true },
    });

    const grouped = new Map<string, { url: string; clicks: number; lastClickedAt: string }>();

    for (const click of clicks) {
      const existing = grouped.get(click.targetUrl);
      if (existing) {
        existing.clicks += 1;
        existing.lastClickedAt = click.clickedAt > new Date(existing.lastClickedAt) ? click.clickedAt.toISOString() : existing.lastClickedAt;
      } else {
        grouped.set(click.targetUrl, {
          url: click.targetUrl,
          clicks: 1,
          lastClickedAt: click.clickedAt.toISOString(),
        });
      }
    }

    const stats = Array.from(grouped.values()).sort((first, second) => second.clicks - first.clicks || second.lastClickedAt.localeCompare(first.lastClickedAt));

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Unable to load ambassador link stats:', error);
    return NextResponse.json({ error: 'Unable to load ambassador link stats.' }, { status: 500 });
  }
}
