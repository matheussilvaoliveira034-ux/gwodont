import { NextResponse } from 'next/server';
import { requireAuth } from '../../../../../lib/requireAuth';
import { getPageForAdmin, savePageDraft, publishPage, discardDraft } from '../../../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  const pageId = parseInt(params.id, 10);
  if (isNaN(pageId)) {
    return NextResponse.json({ error: 'ID inválido.' }, { status: 400 });
  }

  const data = getPageForAdmin(pageId);
  if (!data) {
    return NextResponse.json({ error: 'Página não encontrada.' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, data });
}

// PUT: Save draft
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
    const { seo_title, seo_description, seo_keywords, content } = body;

    if (!seo_title || !content) {
      return NextResponse.json({ error: 'Título SEO e conteúdo são obrigatórios.' }, { status: 400 });
    }

    savePageDraft(pageId, seo_title, seo_description, seo_keywords, content, user.email);

    return NextResponse.json({
      ok: true,
      message: 'Rascunho salvo com sucesso no banco de dados.',
    });
  } catch (err) {
    console.error('Error saving draft:', err);
    return NextResponse.json({ error: 'Erro ao salvar rascunho.' }, { status: 500 });
  }
}

// POST: Actions like Publish
export async function POST(request, { params }) {
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
    const action = body.action;

    if (action === 'publish') {
      publishPage(pageId, user.email);
      return NextResponse.json({
        ok: true,
        message: 'Alterações publicadas com sucesso! O site público foi atualizado.',
      });
    }

    return NextResponse.json({ error: 'Ação não reconhecida.' }, { status: 400 });
  } catch (err) {
    console.error('Error executing page action:', err);
    return NextResponse.json({ error: 'Erro ao executar ação.' }, { status: 500 });
  }
}

// DELETE: Discard draft
export async function DELETE(request, { params }) {
  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  const pageId = parseInt(params.id, 10);
  if (isNaN(pageId)) {
    return NextResponse.json({ error: 'ID inválido.' }, { status: 400 });
  }

  try {
    discardDraft(pageId, user.email);
    return NextResponse.json({
      ok: true,
      message: 'Rascunho descartado com sucesso. O conteúdo publicado foi mantido.',
    });
  } catch (err) {
    console.error('Error discarding draft:', err);
    return NextResponse.json({ error: 'Erro ao descartar rascunho.' }, { status: 500 });
  }
}
