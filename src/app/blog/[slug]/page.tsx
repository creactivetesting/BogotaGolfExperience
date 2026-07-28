import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type BlogPostDetail = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  publishedAt: string | null;
  createdAt: string;
};

async function getBlogBySlug(slug: string): Promise<BlogPostDetail | null> {
  try {
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
      return null;
    }

    return {
      ...blog,
      publishedAt: blog.publishedAt ? blog.publishedAt.toISOString() : null,
      createdAt: blog.createdAt.toISOString(),
    };
  } catch (error) {
    console.error('No se pudo cargar el detalle del blog:', error);
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const blogs = await prisma.blogPost.findMany({
      where: { isPublished: true },
      select: { slug: true },
    });

    return blogs.map((blog) => ({ slug: blog.slug }));
  } catch (error) {
    console.error('No se pudieron generar slugs estáticos del blog:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: 'Blog not found | BGX',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `${blog.title} | BGX Blog`,
    description: blog.excerpt,
    keywords: [
      'blog bgx',
      'golf bogota',
      'colombia golf travel',
      blog.slug,
    ],
    alternates: {
      canonical: `/blog/${blog.slug}`,
    },
    openGraph: {
      title: `${blog.title} | BGX Blog`,
      description: blog.excerpt,
      url: `https://www.bogotagolfexperience.com/blog/${blog.slug}`,
      type: 'article',
      locale: 'en_US',
      publishedTime: blog.publishedAt ?? blog.createdAt,
      images: blog.coverImage ? [{ url: blog.coverImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${blog.title} | BGX Blog`,
      description: blog.excerpt,
      images: blog.coverImage ? [blog.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt,
    datePublished: blog.publishedAt ?? blog.createdAt,
    dateModified: blog.publishedAt ?? blog.createdAt,
    author: {
      '@type': 'Organization',
      name: 'Bogota Golf Experience',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Bogota Golf Experience',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.bogotagolfexperience.com/logo.png',
      },
    },
    mainEntityOfPage: `https://www.bogotagolfexperience.com/blog/${blog.slug}`,
    image: blog.coverImage ? [blog.coverImage] : undefined,
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-zinc-50 pb-16 pt-[13rem] sm:pt-[14rem] lg:pt-[15rem]">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
        <div aria-hidden className="h-8 sm:h-10 lg:h-12" />
        <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-lg shadow-zinc-200/70">
            {blog.coverImage ? (
              <ImageWithFallback src={blog.coverImage} alt={blog.title} className="h-64 w-full object-cover sm:h-80" />
            ) : (
              <div className="h-64 w-full bg-gradient-to-br from-emerald-100 to-zinc-100 sm:h-80" />
            )}

            <div className="p-6 sm:p-10">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                {new Date(blog.publishedAt ?? blog.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <h1 className="mt-3 text-3xl font-bold text-zinc-900 sm:text-4xl">{blog.title}</h1>
              <p className="mt-4 text-lg leading-8 text-zinc-600">{blog.excerpt}</p>

              <div className="mt-8 space-y-5 text-base leading-8 text-zinc-800">
                {blog.content
                  .split('\n')
                  .map((paragraph) => paragraph.trim())
                  .filter(Boolean)
                  .map((paragraph, index) => (
                    <p key={`${blog.id}-paragraph-${index}`}>{paragraph}</p>
                  ))}
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
