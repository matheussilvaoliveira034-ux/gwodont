import { NextResponse } from 'next/server';
import { requireAuth } from '../../../../../../lib/requireAuth';
import { updateSlug } from '../../../../../../lib/db';

export const dynamic = 'force-dynamic';

export async function PUT(request, { params }) {
  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  const pageId = parseInt(params.id, 10);
  if (isNaN(pageId)) {
    return NextResponse.json({ error: 'ID inválido.' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json({ error: 'O slug não pode estar vazio.' }, { status: 400 });
    }

    updateSlug(pageId, slug, user.email);

    return NextResponse.json({
      ok: true,
      message: 'Slug atualizado com sucesso. Redirecionamento da URL anterior configurado automaticamente.',
    });
  } catch (err) {
    console.error('Error updating slug:', err);
    return NextResponse.json({ error: err.message || 'Erro ao atualizar slug.' }, { status: 400 });
  }
}
