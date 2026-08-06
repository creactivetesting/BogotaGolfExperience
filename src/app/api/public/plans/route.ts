import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function normalizePlanKey(name: string) {
  return name.trim().toLowerCase();
}

function dedupePlansByName<T extends { name: string }>(plans: T[]) {
  const uniqueByName = new Map<string, T>();

  for (const plan of plans) {
    const key = normalizePlanKey(plan.name);
    if (!uniqueByName.has(key)) {
      uniqueByName.set(key, plan);
    }
  }

  return Array.from(uniqueByName.values());
}

async function cleanupDuplicatePlansInDatabase() {
  const plans = await prisma.golfPlan.findMany({
    orderBy: { createdAt: 'asc' },
    select: { id: true, name: true },
  });

  const seen = new Set<string>();
  const duplicateIds: string[] = [];

  for (const plan of plans) {
    const key = normalizePlanKey(plan.name);
    if (seen.has(key)) {
      duplicateIds.push(plan.id);
      continue;
    }

    seen.add(key);
  }

  if (duplicateIds.length > 0) {
    await prisma.golfPlan.deleteMany({
      where: {
        id: { in: duplicateIds },
      },
    });
  }
}

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

    await cleanupDuplicatePlansInDatabase();

    const plans = await prisma.golfPlan.findMany({
      orderBy: { createdAt: 'asc' },
    });

    const uniquePlans = dedupePlansByName(plans);

    return NextResponse.json(uniquePlans);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'No se pudieron cargar los planes.' }, { status: 500 });
  }
}
