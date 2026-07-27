import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'No se pudieron listar los testimonios.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { golferName, handicap, reviewText } = body as {
      golferName?: string;
      handicap?: string;
      reviewText?: string;
    };

    if (!golferName || !reviewText) {
      return NextResponse.json({ error: 'Nombre y reseña son obligatorios.' }, { status: 400 });
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        golferName,
        reviewText,
        isActive: true,
      },
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'No se pudo guardar el testimonio.' }, { status: 500 });
  }
}
