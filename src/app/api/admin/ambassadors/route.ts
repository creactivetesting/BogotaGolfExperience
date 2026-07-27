import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const ambassadors = await prisma.ambassador.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(ambassadors);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'No se pudieron listar los embajadores.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, code, commissionRate } = body as { name?: string; email?: string; code?: string; commissionRate?: number };

    if (!name || !email || !code) {
      return NextResponse.json({ error: 'Nombre, email y código son obligatorios.' }, { status: 400 });
    }

    const parsedCommissionRate = Number(commissionRate ?? 10);
    if (Number.isNaN(parsedCommissionRate) || parsedCommissionRate < 0 || parsedCommissionRate > 100) {
      return NextResponse.json({ error: 'La comisión debe estar entre 0 y 100.' }, { status: 400 });
    }

    const ambassador = await prisma.ambassador.create({
      data: {
        name,
        email,
        code,
        commissionRate: parsedCommissionRate,
      },
    });

    return NextResponse.json(ambassador, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'No se pudo guardar el embajador.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'El id del embajador es obligatorio.' }, { status: 400 });
    }

    const deletedAmbassador = await prisma.ambassador.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      id: deletedAmbassador.id,
      name: deletedAmbassador.name,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'No se pudo eliminar el embajador.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, commissionRate } = body as { id?: string; commissionRate?: number };

    if (!id) {
      return NextResponse.json({ error: 'El id del embajador es obligatorio.' }, { status: 400 });
    }

    const parsedCommissionRate = Number(commissionRate);
    if (Number.isNaN(parsedCommissionRate) || parsedCommissionRate < 0 || parsedCommissionRate > 100) {
      return NextResponse.json({ error: 'La comisión debe estar entre 0 y 100.' }, { status: 400 });
    }

    const ambassador = await prisma.ambassador.update({
      where: { id },
      data: { commissionRate: parsedCommissionRate },
    });

    return NextResponse.json(ambassador);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'No se pudo actualizar la comisión del embajador.' }, { status: 500 });
  }
}