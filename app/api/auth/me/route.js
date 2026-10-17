import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { COOKIE_NAME, verifySessionToken } from '../../../../lib/auth';
import { getUserByEmail } from '../../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);

  if (!sessionCookie || !sessionCookie.value) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const payload = verifySessionToken(sessionCookie.value);
  if (!payload || !payload.email) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const user = getUserByEmail(payload.email);
  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
}
