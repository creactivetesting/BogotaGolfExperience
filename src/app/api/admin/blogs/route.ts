import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type CreateBlogBody = {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  isPublished?: boolean;
};

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function GET() {
  try {
    const blogs = await prisma.blogPost.findMany({
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(blogs);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'No se pudieron listar los blogs.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateBlogBody;

    if (!body.title || !body.excerpt || !body.content) {
      return NextResponse.json({ error: 'Título, extracto y contenido son obligatorios.' }, { status: 400 });
    }

    const slug = normalizeSlug(body.slug || body.title);
    if (!slug) {
      return NextResponse.json({ error: 'El slug no es válido.' }, { status: 400 });
    }

    const isPublished = Boolean(body.isPublished);

    const created = await prisma.blogPost.create({
      data: {
        title: body.title.trim(),
        slug,
        excerpt: body.excerpt.trim(),
        content: body.content.trim(),
        coverImage: body.coverImage?.trim() || null,
        isPublished,
        publishedAt: isPublished ? new Date() : null,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'No se pudo crear el blog.' }, { status: 500 });
  }
}
