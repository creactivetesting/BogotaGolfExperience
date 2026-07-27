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

export async function GET() {
  try {
    await ensureDefaultCourses();
    const courses = await prisma.golfCourse.findMany({ orderBy: { createdAt: 'asc' } });
    return NextResponse.json(courses);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'No se pudieron listar los campos.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, isAvailable, homeFeatured } = body as { id?: string; isAvailable?: boolean; homeFeatured?: boolean };

    if (!id || (typeof isAvailable !== 'boolean' && typeof homeFeatured !== 'boolean')) {
      return NextResponse.json({ error: 'Debes enviar un cambio válido para el campo.' }, { status: 400 });
    }

    const currentCourse = await prisma.golfCourse.findUnique({
      where: { id },
      select: { homeFeatured: true },
    });

    if (!currentCourse) {
      return NextResponse.json({ error: 'El campo no existe.' }, { status: 404 });
    }

    if (typeof homeFeatured === 'boolean' && homeFeatured && !currentCourse.homeFeatured) {
      const featuredCount = await prisma.golfCourse.count({ where: { homeFeatured: true } });

      if (featuredCount >= 6) {
        return NextResponse.json({ error: 'Solo puedes destacar hasta 6 campos en Home.' }, { status: 400 });
      }
    }

    const updated = await prisma.golfCourse.update({
      where: { id },
      data: {
        ...(typeof isAvailable === 'boolean' ? { isAvailable } : {}),
        ...(typeof homeFeatured === 'boolean' ? { homeFeatured } : {}),
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'No se pudo actualizar el campo.' }, { status: 500 });
  }
}
