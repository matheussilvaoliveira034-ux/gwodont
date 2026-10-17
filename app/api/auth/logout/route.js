import { NextResponse } from 'next/server';
import { getClearSessionCookieHeader } from '../../../../lib/auth';
import { logAudit } from '../../../../lib/db';

export const dynamic = 'force-dynamic';

export async function POST() {
  const response = NextResponse.json({ ok: true, message: 'Logout efetuado com sucesso.' });
  response.headers.set('Set-Cookie', getClearSessionCookieHeader());
  logAudit('usuario', 'LOGOUT', 'Sessão encerrada');
  return response;
}
