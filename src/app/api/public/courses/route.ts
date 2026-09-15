import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featuredOnly = searchParams.get('featured') === 'true';

    const courses = await prisma.golfCourse.findMany({
      where: {
        ...(featuredOnly
          ? { homeFeatured: true }
          : { isAvailable: true, homeFeatured: false }),
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'No se pudieron cargar los campos.' }, { status: 500 });
  }
}
