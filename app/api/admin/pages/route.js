import { NextResponse } from 'next/server';
import { requireAuth } from '../../../../lib/requireAuth';
import { getAllPages } from '../../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: 'Não autorizado. Faça login no painel.' }, { status: 401 });
  }

  try {
    const pages = getAllPages();
    return NextResponse.json({ ok: true, pages });
  } catch (err) {
    console.error('Error fetching pages:', err);
    return NextResponse.json({ error: 'Erro ao buscar páginas.' }, { status: 500 });
  }
}
