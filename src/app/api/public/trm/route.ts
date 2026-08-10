import { NextResponse } from 'next/server';

const FALLBACK_TRM = 4150;
const BGX_MARGIN_COP = 100;

function parseTrmValue(raw: unknown): number | null {
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return raw;
  }

  if (typeof raw !== 'string') {
    return null;
  }

  const cleaned = raw.trim().replace(/\s+/g, '');
  const hasComma = cleaned.includes(',');
  const hasDot = cleaned.includes('.');

  let normalized = cleaned;

  if (hasComma && hasDot) {
    const lastCommaIndex = cleaned.lastIndexOf(',');
    const lastDotIndex = cleaned.lastIndexOf('.');

    if (lastCommaIndex > lastDotIndex) {
      // Format like 4.321,56
      normalized = cleaned.replace(/\./g, '').replace(',', '.');
    } else {
      // Format like 4,321.56
      normalized = cleaned.replace(/,/g, '');
    }
  } else if (hasComma) {
    const commaParts = cleaned.split(',');
    const decimalDigits = commaParts[commaParts.length - 1]?.length ?? 0;
    normalized = decimalDigits <= 2 ? cleaned.replace(',', '.') : cleaned.replace(/,/g, '');
  }

  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function GET() {
  try {
    const response = await fetch('https://www.datos.gov.co/resource/32sa-8pi3.json?$limit=1&$order=vigenciadesde%20DESC', {
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`TRM provider error: ${response.status}`);
    }

    const data = (await response.json()) as Array<{ valor?: string | number; vigenciadesde?: string }>;
    const trmRaw = data[0]?.valor;
    const trm = parseTrmValue(trmRaw);

    if (!trm) {
      throw new Error('TRM value is missing or invalid.');
    }

    const exchangeRate = Math.round(trm + BGX_MARGIN_COP);

    return NextResponse.json({
      trm: Math.round(trm),
      margin: BGX_MARGIN_COP,
      exchangeRate,
      source: 'datos.gov.co',
      date: data[0]?.vigenciadesde ?? null,
      fallback: false,
    });
  } catch (error) {
    console.error('Unable to fetch TRM value, using fallback rate:', error);

    return NextResponse.json({
      trm: FALLBACK_TRM,
      margin: BGX_MARGIN_COP,
      exchangeRate: FALLBACK_TRM + BGX_MARGIN_COP,
      source: 'fallback',
      date: null,
      fallback: true,
    });
  }
}
