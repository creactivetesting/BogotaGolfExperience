import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const existing = await prisma.golfPlan.findMany();

    if (existing.length === 0) {
      await prisma.golfPlan.createMany({
        data: [
          {
            name: 'BGX Smart Pack',
            basePrice: 1890,
            description: 'A high-value golf getaway crafted for groups of 4 golf lovers.',
          },
          {
            name: 'BGX Elite Pack',
            basePrice: 2090,
            description: 'For foursomes who want to maximize the golf while discovering the best Bogotá has to offer.',
          },
        ],
      });
    }

    const plans = await prisma.golfPlan.findMany({
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'No se pudieron cargar los planes.' }, { status: 500 });
  }
}
