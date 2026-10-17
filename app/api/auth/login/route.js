import { NextResponse } from 'next/server';
import { getUserByEmail, updateUserLastLogin, isRateLimited, recordLoginAttempt, logAudit } from '../../../../lib/db';
import { verifyPassword, createSessionToken, getSessionCookieHeader } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';

    // 1. Rate limiting check
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Muitas tentativas malsucedidas de login. Por favor, aguarde 15 minutos antes de tentar novamente.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-mail e senha são obrigatórios.' },
        { status: 400 }
      );
    }

    // 2. Fetch user
    const user = getUserByEmail(email.trim());
    if (!user) {
      recordLoginAttempt(ip, false);
      return NextResponse.json(
        { error: 'Credenciais inválidas. Verifique seu e-mail e senha.' },
        { status: 401 }
      );
    }

    // 3. Verify bcrypt hash
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      recordLoginAttempt(ip, false);
      return NextResponse.json(
        { error: 'Credenciais inválidas. Verifique seu e-mail e senha.' },
        { status: 401 }
      );
    }

    // 4. Success: record attempt, update login date, create token
    recordLoginAttempt(ip, true);
    updateUserLastLogin(user.id);
    logAudit(user.email, 'LOGIN_SUCCESS', `Login bem-sucedido a partir de ${ip}`);

    const token = createSessionToken(user);
    const cookieHeader = getSessionCookieHeader(token);

    const response = NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    response.headers.set('Set-Cookie', cookieHeader);
    return response;
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json(
      { error: 'Erro interno ao processar a autenticação.' },
      { status: 500 }
    );
  }
}
