import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type QuoteStatus = 'PENDING' | 'BOUGHT' | 'NOT_BOUGHT';

function isValidStatus(value: unknown): value is QuoteStatus {
  return value === 'PENDING' || value === 'BOUGHT' || value === 'NOT_BOUGHT';
}

export async function GET() {
  try {
    const quotes = await prisma.generatedQuote.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(quotes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'No se pudieron listar las cotizaciones.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      planName,
      packageSubtitle,
      packageDuration,
      hotelName,
      playerCount,
      ambassadorName,
      ambassadorCode,
      subtotal,
      commission,
      netMargin,
      selectedCourses,
      includedItems,
      status,
    } = body as {
      customerName?: string;
      planName?: string;
      packageSubtitle?: string;
      packageDuration?: string;
      hotelName?: string;
      playerCount?: number;
      ambassadorName?: string;
      ambassadorCode?: string;
      subtotal?: number;
      commission?: number;
      netMargin?: number;
      selectedCourses?: string[];
      includedItems?: string[];
      status?: QuoteStatus;
    };

    if (!customerName || !planName || typeof playerCount !== 'number') {
      return NextResponse.json({ error: 'Cliente, plan y número de jugadores son obligatorios.' }, { status: 400 });
    }

    const parsedSubtotal = Number(subtotal ?? 0);
    const parsedCommission = Number(commission ?? 0);
    const parsedNetMargin = Number(netMargin ?? 0);

    if (Number.isNaN(parsedSubtotal) || Number.isNaN(parsedCommission) || Number.isNaN(parsedNetMargin)) {
      return NextResponse.json({ error: 'Los totales de la cotización no son válidos.' }, { status: 400 });
    }

    const quote = await prisma.generatedQuote.create({
      data: {
        customerName,
        planName,
        packageSubtitle: packageSubtitle || null,
        packageDuration: packageDuration || null,
        hotelName: hotelName || null,
        playerCount,
        ambassadorName: ambassadorName || null,
        ambassadorCode: ambassadorCode || null,
        subtotal: parsedSubtotal,
        commission: parsedCommission,
        netMargin: parsedNetMargin,
        selectedCoursesJson: JSON.stringify(selectedCourses ?? []),
        includedItemsJson: JSON.stringify(includedItems ?? []),
        status: isValidStatus(status) ? status : 'PENDING',
      },
    });

    return NextResponse.json(quote, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'No se pudo guardar la cotización.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body as { id?: string; status?: QuoteStatus };

    if (!id || !isValidStatus(status)) {
      return NextResponse.json({ error: 'ID y estatus válido son obligatorios.' }, { status: 400 });
    }

    const updated = await prisma.generatedQuote.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'No se pudo actualizar el estatus de la cotización.' }, { status: 500 });
  }
}
