import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const courses = await prisma.golfCourse.findMany({
      where: { isAvailable: true },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'No se pudieron cargar los campos.' }, { status: 500 });
  }
}
