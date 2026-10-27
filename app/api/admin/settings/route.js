import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAuth } from '../../../../lib/requireAuth';
import { getSettings, updateSettings } from '../../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const settings = getSettings();
    return NextResponse.json({ ok: true, settings });
  } catch (err) {
    console.error('Error fetching settings:', err);
    return NextResponse.json({ error: 'Erro ao buscar configurações.' }, { status: 500 });
  }
}

export async function PUT(request) {
  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    updateSettings(body, user.email);

    try {
      revalidatePath('/', 'layout');
    } catch (_) {}

    return NextResponse.json({
      ok: true,
      message: 'Configurações institucionais e de contato atualizadas com sucesso.',
    });
  } catch (err) {
    console.error('Error updating settings:', err);
    return NextResponse.json({ error: 'Erro ao salvar configurações.' }, { status: 500 });
  }
}
