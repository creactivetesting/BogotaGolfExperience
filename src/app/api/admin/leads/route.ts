import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const leads = await prisma.customerLead.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(leads);
  } catch (error) {
    console.error('Error loading customer leads in admin:', error);
    return NextResponse.json({ error: 'Unable to load leads.' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const result = await prisma.customerLead.deleteMany({});

    return NextResponse.json({
      deletedCount: result.count,
      message: 'All potential client test data was cleared successfully.',
    });
  } catch (error) {
    console.error('Error clearing customer leads:', error);
    return NextResponse.json({ error: 'Unable to clear leads.' }, { status: 500 });
  }
}
