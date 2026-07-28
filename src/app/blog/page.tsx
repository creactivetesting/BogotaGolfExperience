import Link from 'next/link';
import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type PublicBlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  publishedAt: string | null;
  createdAt: string;
};

export const metadata: Metadata = {
  title: 'BGX Blog | Golf in Bogota, travel, and premium experiences',
  description: 'Read the BGX blog for golf tips in Bogota, travel recommendations, and guides for international golfers.',
  alternates: {
    canonical: '/blog',
  },
  keywords: [
    'bogota golf blog',
    'golf in bogota',
    'colombia golf travel',
    'bogota golf tips',
    'bogota golf experience blog',
  ],
  openGraph: {
    title: 'BGX Blog | Golf in Bogota, travel, and premium experiences',
    description: 'Read the BGX blog for golf tips in Bogota, travel recommendations, and guides for international golfers.',
    url: 'https://www.bogotagolfexperience.com/blog',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BGX Blog | Golf in Bogota, travel, and premium experiences',
    description: 'Read the BGX blog for golf tips in Bogota, travel recommendations, and guides for international golfers.',
  },
};

async function getBlogs(): Promise<PublicBlogPost[]> {
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

    return blogs.map((blog) => ({
      ...blog,
      publishedAt: blog.publishedAt ? blog.publishedAt.toISOString() : null,
      createdAt: blog.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error('Could not load published blog posts:', error);
    return [];
  }
}

export default async function BlogPage() {
  const blogs = await getBlogs();
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'BGX Blog',
    itemListElement: blogs.map((blog, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `https://www.bogotagolfexperience.com/blog/${blog.slug}`,
      name: blog.title,
    })),
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-zinc-50 pb-16 pt-[13rem] sm:pt-[14rem] lg:pt-[15rem]">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
        <div aria-hidden className="h-10 sm:h-14 lg:h-16" />
        <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-zinc-200 bg-white px-8 pb-8 pt-24 sm:pt-28 shadow-lg shadow-zinc-200/70">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">BGX Editorial</p>
            <h1 className="mt-3 text-4xl font-bold text-zinc-900 sm:text-5xl">BGX Blog</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">
              English-language insights about golf in Bogota, travel recommendations, and guides for golfers looking for premium experiences.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {blogs.length === 0 ? (
              <div className="md:col-span-2 rounded-2xl border border-zinc-200 bg-white px-6 py-10 text-center text-zinc-600">
                No published blog posts yet.
              </div>
            ) : (
              blogs.map((blog) => (
                <article key={blog.id} className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md">
                  {blog.coverImage ? (
                    <ImageWithFallback src={blog.coverImage} alt={blog.title} className="h-52 w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="h-52 w-full bg-gradient-to-br from-emerald-100 to-zinc-100" />
                  )}
                  <div className="p-6">
                    <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                      {new Date(blog.publishedAt ?? blog.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-zinc-900">{blog.title}</h2>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-600">{blog.excerpt}</p>
                    <Link
                      href={`/blog/${blog.slug}`}
                      className="mt-5 inline-flex items-center rounded-full border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
                    >
                      Read article
                    </Link>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
