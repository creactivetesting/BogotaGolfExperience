import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

async function ensureDefaultPlans() {
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
}

export async function GET() {
  try {
    await ensureDefaultPlans();

    const plans = await prisma.golfPlan.findMany({
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'No se pudieron listar los planes.' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, basePrice, price, newPrice } = body as {
      id?: string;
      basePrice?: number | string;
      price?: number | string;
      newPrice?: number | string;
    };

    const parsedPrice = Number(basePrice ?? price ?? newPrice);

    if (!id || Number.isNaN(parsedPrice)) {
      return NextResponse.json({ error: 'ID y precio base válidos son obligatorios.' }, { status: 400 });
    }

    const updatedPlan = await prisma.golfPlan.update({
      where: { id },
      data: { basePrice: parsedPrice },
    });

    return NextResponse.json({ ...updatedPlan, basePrice: parsedPrice });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'No se pudo actualizar el plan.' }, { status: 500 });
  }
}
