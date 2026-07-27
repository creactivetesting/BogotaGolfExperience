import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const blogs = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        publishedAt: true,
        createdAt: true,
      },
    });

    return NextResponse.json(blogs);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'No se pudieron cargar los blogs.' }, { status: 500 });
  }
}
