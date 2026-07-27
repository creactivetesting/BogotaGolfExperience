import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;

    if (!slug) {
      return NextResponse.json({ error: 'El slug es obligatorio.' }, { status: 400 });
    }

    const blog = await prisma.blogPost.findFirst({
      where: {
        slug,
        isPublished: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        coverImage: true,
        publishedAt: true,
        createdAt: true,
      },
    });

    if (!blog) {
      return NextResponse.json({ error: 'Blog no encontrado.' }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'No se pudo cargar el blog.' }, { status: 500 });
  }
}
