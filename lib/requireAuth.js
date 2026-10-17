import { cookies } from 'next/headers';
import { COOKIE_NAME, verifySessionToken } from './auth';
import { getUserByEmail } from './db';

export async function requireAuth() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);

  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  const payload = verifySessionToken(sessionCookie.value);
  if (!payload || !payload.email) {
    return null;
  }

  const user = getUserByEmail(payload.email);
  if (!user) {
    return null;
  }

  return user;
}
