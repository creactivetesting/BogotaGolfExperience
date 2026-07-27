import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type UpdateBlogBody = {
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

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as UpdateBlogBody;

    if (!id) {
      return NextResponse.json({ error: 'El id del blog es obligatorio.' }, { status: 400 });
    }

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'El blog no existe.' }, { status: 404 });
    }

    const nextTitle = body.title?.trim() ?? existing.title;
    const nextSlug = normalizeSlug(body.slug?.trim() || nextTitle);
    const nextExcerpt = body.excerpt?.trim() ?? existing.excerpt;
    const nextContent = body.content?.trim() ?? existing.content;
    const nextIsPublished = typeof body.isPublished === 'boolean' ? body.isPublished : existing.isPublished;

    if (!nextTitle || !nextSlug || !nextExcerpt || !nextContent) {
      return NextResponse.json({ error: 'Título, slug, extracto y contenido son obligatorios.' }, { status: 400 });
    }

    const updated = await prisma.blogPost.update({
      where: { id },
      data: {
        title: nextTitle,
        slug: nextSlug,
        excerpt: nextExcerpt,
        content: nextContent,
        coverImage: body.coverImage?.trim() || null,
        isPublished: nextIsPublished,
        publishedAt: nextIsPublished ? existing.publishedAt ?? new Date() : null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'No se pudo actualizar el blog.' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: 'El id del blog es obligatorio.' }, { status: 400 });
    }

    const deleted = await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ success: true, id: deleted.id, title: deleted.title });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'No se pudo eliminar el blog.' }, { status: 500 });
  }
}
