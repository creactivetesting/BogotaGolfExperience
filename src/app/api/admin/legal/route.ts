import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type LegalPagePayload = {
  slug?: string;
  title?: string;
  content?: string;
};

const defaultLegalPages = [
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    content: `# Privacy Policy

We value your privacy and are committed to protecting the personal information you share with us.

This Privacy Policy explains how we collect, use, and protect your information when you interact with our website, request a quote, or contact our team.

## Information we collect
We may collect personal information such as your name, email address, phone number, trip preferences, and booking details when you submit a form or contact us.

## How we use your information
We use this information to respond to inquiries, prepare golf experiences, manage bookings, improve our website, and communicate important updates.

## Sharing of information
We do not sell your personal information. We may share details with trusted service providers only when necessary to deliver the services requested or to comply with legal obligations.

## Cookies
We may use cookies to improve site performance, understand visitor behavior, and enhance user experience.

## Security
We use reasonable technical and organizational safeguards to protect your data from unauthorized access or misuse.

## Your choices
You may contact us at any time to request access, correction, or deletion of your personal information.

## Updates
This policy may be updated periodically to reflect changes in law, regulation, or our service practices.

Last updated: ${new Date().toISOString().slice(0, 10)}`,
  },
  {
    slug: 'terms-of-service',
    title: 'Terms of Service',
    content: `# Terms of Service

By using this website, you agree to the terms set out below. These terms apply to all visitors, users, and customers accessing the site and requesting information about BGX services.

## Booking and services
All golf experiences, plans, and travel arrangements are subject to availability and may be modified or canceled at the discretion of BGX or its partners.

## User responsibility
You agree to provide accurate information when requesting a quote or booking a service. You are responsible for making sure all details provided are correct and complete.

## Payment and deposits
Any deposits or payments required for bookings are governed by the specific quote or agreement provided by BGX. Additional terms may apply depending on the package selected.

## Intellectual property
All content on this website, including text, visuals, branding, and materials, is protected by intellectual property laws and may not be reproduced without permission.

## Liability
BGX provides information and services in good faith, but we do not guarantee that all services or content will be error-free or uninterrupted. Use of the website is at your own discretion.

## Changes
We may revise these terms at any time. Continued use of the site after updates means you accept the revised terms.

## Contact
For questions about these terms, please contact our team.

Last updated: ${new Date().toISOString().slice(0, 10)}`,
  },
  {
    slug: 'cookie-policy',
    title: 'Cookie Policy',
    content: `# Cookie Policy

This website uses cookies and similar technologies to provide a better experience for visitors and to understand how the site is used.

## What are cookies?
Cookies are small text files stored on your device that help websites remember your preferences and collect analytical information.

## Types of cookies we use
We may use essential cookies, analytics cookies, preference cookies, and marketing-related cookies when necessary for functionality and measurement.

## Why we use them
Cookies help us improve site performance, remember preferences, reduce repeated prompts, and understand which parts of the website are most useful.

## Managing cookies
You can control or disable cookies in your browser settings. Please note that disabling certain cookies may affect how the website works.

## Third-party cookies
Some cookies may be placed by trusted third-party tools used for analytics or marketing. These are subject to the privacy practices of those providers.

## Updates
This Cookie Policy may be updated to reflect new features, regulations, or service requirements.

Last updated: ${new Date().toISOString().slice(0, 10)}`,
  },
] as const;

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
    const pages = await prisma.legalPage.findMany({
      orderBy: { title: 'asc' },
    });

    if (pages.length === 0) {
      const created = await Promise.all(
        defaultLegalPages.map((page) =>
          prisma.legalPage.upsert({
            where: { slug: page.slug },
            update: {
              title: page.title,
              content: page.content,
            },
            create: {
              slug: page.slug,
              title: page.title,
              content: page.content,
            },
          }),
        ),
      );

      return NextResponse.json(created);
    }

    return NextResponse.json(pages);
  } catch (error) {
    console.error('Error loading legal pages:', error);
    return NextResponse.json({ error: 'No se pudieron cargar las páginas legales.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LegalPagePayload;
    const slug = normalizeSlug(body.slug || body.title || '');
    const title = (body.title || '').trim();
    const content = (body.content || '').trim();

    if (!slug || !title || !content) {
      return NextResponse.json({ error: 'Slug, title and content are required.' }, { status: 400 });
    }

    const page = await prisma.legalPage.upsert({
      where: { slug },
      update: { title, content },
      create: { slug, title, content },
    });

    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    console.error('Error saving legal page:', error);
    return NextResponse.json({ error: 'No se pudo guardar la página legal.' }, { status: 500 });
  }
}
