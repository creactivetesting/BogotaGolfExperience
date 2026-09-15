import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const COURSE_CATALOG = [
  'Club La Cima',
  'Briceño 18',
  'Serrezuela Country Club',
  'San Andrés Golf Club',
  'Country Club de Bogotá',
  'Club Los Lagartos',
  'El Rincón de Cajicá',
  'Club Los Arrayanes',
  'Club Guaymaral',
  'Hatogrande Country Club',
  'Club Militar de Golf',
  'Serrezuela Madrid Country Club',
  'Fontanar Country Club',
  'Club Campestre El Rancho',
  'Club Los Búhos',
  'Club Campestre La Sabana',
  'Club de Golf Los Halcones',
  'Club de Golf El Peñón',
  'Club de Golf Bacatá',
  'Club de Golf La Caro',
  'Club de Golf El Tequendama',
  'Club de Golf Yerbabuena',
  'Club Los Cortijos',
  'Club Campestre El Hinche',
  'Club de Golf Tocancipá',
];

async function ensureDefaultCourses() {
  const existing = await prisma.golfCourse.findMany({
    select: { name: true },
  });

  const existingNames = new Set(existing.map((course) => course.name));
  const missingCourses = COURSE_CATALOG.filter((name) => !existingNames.has(name));

  if (missingCourses.length > 0) {
    await prisma.golfCourse.createMany({
      data: missingCourses.map((name) => ({ name, isAvailable: true, homeFeatured: false })),
    });
  }
}

export async function GET(request: Request) {
  try {
    await ensureDefaultCourses();

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
