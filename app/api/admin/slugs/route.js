import { NextResponse } from 'next/server';
import { requireAuth } from '../../../../lib/requireAuth';
import { getDb, RESERVED_SLUGS } from '../../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const db = getDb();
    const redirects = db.prepare('SELECT * FROM slug_redirects ORDER BY created_at DESC').all();
    const pages = db.prepare('SELECT id, name, slug FROM pages ORDER BY nav_order ASC, id ASC').all();

    return NextResponse.json({
      ok: true,
      pages,
      redirects,
      reserved: RESERVED_SLUGS,
    });
  } catch (err) {
    console.error('Error fetching slugs:', err);
    return NextResponse.json({ error: 'Erro ao buscar slugs.' }, { status: 500 });
  }
}
