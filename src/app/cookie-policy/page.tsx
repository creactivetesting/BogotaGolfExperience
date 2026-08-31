import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

function renderMarkdownToHtml(content: string) {
  const escaped = content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return `<div class="prose max-w-4xl mx-auto px-4 py-12 text-zinc-800">${escaped
    .replace(/^\s*#\s+(.+)$/gm, '<h1>$1</h1>')
    .replace(/^\s*##\s+(.+)$/gm, '<h2>$1</h2>')
    .replace(/^\s*###\s+(.+)$/gm, '<h3>$1</h3>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br />')}</div>`;
}

export default async function CookiePolicyPage() {
  const page = await prisma.legalPage.findUnique({
    where: { slug: 'cookie-policy' },
  });

  if (!page) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-50 py-24">
      <div className="mx-auto max-w-5xl rounded-3xl border border-zinc-200 bg-white p-6 shadow-lg shadow-zinc-200/70 sm:p-10">
        <div dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(page.content) }} />
      </div>
    </main>
  );
}
