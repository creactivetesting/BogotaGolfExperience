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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, features, images, rating, isAvailable, homeFeatured } = body as {
      name?: string;
      description?: string | null;
      features?: string[];
      images?: string[];
      rating?: number;
      isAvailable?: boolean;
      homeFeatured?: boolean;
    };

    const normalizedName = String(name ?? '').trim();
    if (!normalizedName) {
      return NextResponse.json({ error: 'Debes ingresar el nombre del campo.' }, { status: 400 });
    }

    const existing = await prisma.golfCourse.findFirst({
      where: {
        name: {
          equals: normalizedName,
          mode: 'insensitive',
        },
      },
    });

    if (existing) {
      return NextResponse.json({ error: 'Ya existe un campo con ese nombre.' }, { status: 400 });
    }

    if (homeFeatured && typeof homeFeatured === 'boolean') {
      const featuredCount = await prisma.golfCourse.count({ where: { homeFeatured: true } });
      if (featuredCount >= 6) {
        return NextResponse.json({ error: 'Solo puedes destacar hasta 6 campos en Home.' }, { status: 400 });
      }
    }

    const parsedRating = typeof rating === 'number' && Number.isFinite(rating) ? rating : 4.8;

    const created = await prisma.golfCourse.create({
      data: {
        name: normalizedName,
        description: typeof description === 'string' ? description : '',
        features: Array.isArray(features) ? features.map((feature) => String(feature).trim()).filter(Boolean) : [],
        images: Array.isArray(images) ? images.map((image) => String(image).trim()).filter(Boolean) : [],
        rating: Math.min(5, Math.max(0, parsedRating)),
        isAvailable: typeof isAvailable === 'boolean' ? isAvailable : true,
        homeFeatured: typeof homeFeatured === 'boolean' ? homeFeatured : false,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'No se pudo crear el campo.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, isAvailable, homeFeatured, description, features, images, rating } = body as {
      id?: string;
      isAvailable?: boolean;
      homeFeatured?: boolean;
      description?: string | null;
      features?: string[];
      images?: string[];
      rating?: number;
    };

    const hasFieldUpdates =
      typeof isAvailable === 'boolean' ||
      typeof homeFeatured === 'boolean' ||
      typeof description === 'string' ||
      description === null ||
      Array.isArray(features) ||
      Array.isArray(images) ||
      typeof rating === 'number';

    if (!id || !hasFieldUpdates) {
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

    const normalizedFeatures = Array.isArray(features)
      ? features.map((feature) => String(feature).trim()).filter(Boolean)
      : undefined;

    const normalizedImages = Array.isArray(images)
      ? images.map((image) => String(image).trim()).filter(Boolean)
      : undefined;

    const normalizedRating = typeof rating === 'number' && Number.isFinite(rating) ? Math.min(5, Math.max(0, rating)) : undefined;

    const updated = await prisma.golfCourse.update({
      where: { id },
      data: {
        ...(typeof isAvailable === 'boolean' ? { isAvailable } : {}),
        ...(typeof homeFeatured === 'boolean' ? { homeFeatured } : {}),
        ...(typeof description === 'string' || description === null ? { description } : {}),
        ...(normalizedFeatures ? { features: normalizedFeatures } : {}),
        ...(normalizedImages ? { images: normalizedImages } : {}),
        ...(normalizedRating !== undefined ? { rating: normalizedRating } : {}),
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'No se pudo actualizar el campo.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const idFromQuery = url.searchParams.get('id');
    const body = await request.json().catch(() => ({}));
    const id = idFromQuery ?? (typeof body?.id === 'string' ? body.id : '');

    if (!id) {
      return NextResponse.json({ error: 'Debes indicar el campo que se va a eliminar.' }, { status: 400 });
    }

    const currentCourse = await prisma.golfCourse.findUnique({ where: { id } });
    if (!currentCourse) {
      return NextResponse.json({ error: 'El campo no existe.' }, { status: 404 });
    }

    const updated = await prisma.golfCourse.update({
      where: { id },
      data: {
        isAvailable: false,
        homeFeatured: false,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'No se pudo eliminar el campo.' }, { status: 500 });
  }
}
