import { NextResponse } from 'next/server';
import { scryptSync, timingSafeEqual } from 'node:crypto';
import { ADMIN_AUTH_COOKIE, FIXED_SUPER_ADMINS } from '@/lib/admin-auth-config';

type LoginBody = {
  email?: string;
  password?: string;
};

function isValidPassword(password: string, salt: string, expectedHash: string) {
  const hashedBuffer = scryptSync(password, salt, 64);
  const expectedBuffer = Buffer.from(expectedHash, 'hex');

  if (hashedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(hashedBuffer, expectedBuffer);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginBody;
    const email = body.email?.trim().toLowerCase() ?? '';
    const password = body.password ?? '';

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const matchedAdmin = FIXED_SUPER_ADMINS.find((admin) => admin.email === email);
    if (!matchedAdmin) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    if (!isValidPassword(password, matchedAdmin.salt, matchedAdmin.passwordHash)) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_AUTH_COOKIE, matchedAdmin.email, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    console.error('Error during admin login:', error);
    return NextResponse.json({ error: 'Could not sign in.' }, { status: 500 });
  }
}
