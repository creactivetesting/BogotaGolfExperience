import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const leads = await prisma.customerLead.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json(leads);
  } catch (error) {
    console.error('Error loading customer leads:', error);
    return NextResponse.json({ error: 'Unable to load leads.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const payload = {
      name: typeof body?.name === 'string' ? body.name.trim() : '',
      phone: typeof body?.phone === 'string' ? body.phone.trim() : '',
      email: typeof body?.email === 'string' ? body.email.trim() : '',
      country: typeof body?.country === 'string' ? body.country.trim() : '',
      city: typeof body?.city === 'string' ? body.city.trim() : '',
      state: typeof body?.state === 'string' ? body.state.trim() : '',
      intent: typeof body?.intent === 'string' ? body.intent : 'info',
      selectedPlan: typeof body?.selectedPlan === 'string' ? body.selectedPlan.trim() : null,
      playerCount: typeof body?.playerCount === 'number' ? body.playerCount : (typeof body?.playerCount === 'string' ? Number(body.playerCount) : null),
      estimatedTotal: typeof body?.estimatedTotal === 'number' ? body.estimatedTotal : (typeof body?.estimatedTotal === 'string' ? Number(body.estimatedTotal) : null),
      ambassadorName: typeof body?.ambassadorName === 'string' ? body.ambassadorName.trim() : null,
      ambassadorCode: typeof body?.ambassadorCode === 'string' ? body.ambassadorCode.trim() : null,
      source: typeof body?.source === 'string' ? body.source.trim() : null,
      consentMarketing: Boolean(body?.consentMarketing),
      consentPrivacy: Boolean(body?.consentPrivacy),
    };

    if (!payload.name || !payload.phone || !payload.email || !payload.country || !payload.city) {
      return NextResponse.json({ error: 'Name, phone, email, country, and city are required.' }, { status: 400 });
    }

    if (!payload.consentMarketing || !payload.consentPrivacy) {
      return NextResponse.json({ error: 'Marketing consent and privacy consent are required.' }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 });
    }

    if (payload.playerCount !== null && (!Number.isFinite(payload.playerCount) || payload.playerCount < 1)) {
      return NextResponse.json({ error: 'Player count must be at least 1.' }, { status: 400 });
    }

    if (payload.estimatedTotal !== null && (!Number.isFinite(payload.estimatedTotal) || payload.estimatedTotal < 0)) {
      return NextResponse.json({ error: 'Estimated total must be a valid positive number.' }, { status: 400 });
    }

    let ambassadorMeta = {
      ambassadorName: payload.ambassadorName,
      ambassadorCode: payload.ambassadorCode,
    };

    if (payload.ambassadorCode) {
      const ambassador = await prisma.ambassador.findUnique({
        where: { code: payload.ambassadorCode },
        select: { name: true, code: true },
      });

      if (ambassador) {
        ambassadorMeta = {
          ambassadorName: ambassador.name,
          ambassadorCode: ambassador.code,
        };
      }
    }

    const lead = await prisma.customerLead.create({
      data: {
        name: payload.name,
        phone: payload.phone,
        email: payload.email,
        country: payload.country,
        city: payload.city,
        state: payload.state || null,
        intent: payload.intent,
        selectedPlan: payload.selectedPlan || null,
        playerCount: payload.playerCount ?? null,
        estimatedTotal: payload.estimatedTotal ?? null,
        ambassadorName: ambassadorMeta.ambassadorName || null,
        ambassadorCode: ambassadorMeta.ambassadorCode || null,
        source: payload.source || null,
        consentMarketing: payload.consentMarketing,
        consentPrivacy: payload.consentPrivacy,
      },
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error('Error creating customer lead:', error);
    return NextResponse.json({ error: 'Unable to save the lead.' }, { status: 500 });
  }
}
