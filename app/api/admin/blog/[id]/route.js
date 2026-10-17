import { NextResponse } from 'next/server';
import { requireAuth } from '../../../../../lib/requireAuth';
import { getBlogPostById, saveBlogPost, deleteBlogPost } from '../../../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  const { id } = params;
  try {
    const post = getBlogPostById(id);
    if (!post) {
      return NextResponse.json({ error: 'Artigo não encontrado.' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, post });
  } catch (err) {
    console.error('Error fetching blog post:', err);
    return NextResponse.json({ error: 'Erro ao buscar artigo.' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  const { id } = params;
  try {
    const body = await request.json();

    if (!body.title || !body.content) {
      return NextResponse.json({ error: 'Título e conteúdo são obrigatórios.' }, { status: 400 });
    }

    const postData = {
      ...body,
      id: parseInt(id, 10),
    };

    const updated = saveBlogPost(postData, user.email);
    return NextResponse.json({
      ok: true,
      message: 'Artigo atualizado com sucesso.',
      post: updated,
    });
  } catch (err) {
    console.error('Error updating blog post:', err);
    return NextResponse.json({ error: err.message || 'Erro ao atualizar artigo.' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  const { id } = params;
  try {
    const result = deleteBlogPost(parseInt(id, 10), user.email);
    if (!result.deleted) {
      return NextResponse.json({ error: 'Artigo não encontrado ou já excluído.' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, message: 'Artigo excluído com sucesso.' });
  } catch (err) {
    console.error('Error deleting blog post:', err);
    return NextResponse.json({ error: 'Erro ao excluir artigo.' }, { status: 500 });
  }
}
