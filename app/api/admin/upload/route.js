import { NextResponse } from 'next/server';
import { requireAuth } from '../../../../lib/requireAuth';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'Nenhum arquivo enviado.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate size (max 5MB)
    if (buffer.length > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Imagem muito grande. Limite máximo: 5MB.' }, { status: 400 });
    }

    const mimeType = file.type || 'image/jpeg';
    const originalName = file.name || 'foto.jpg';
    const ext = path.extname(originalName) || '.jpg';
    const safeName = `foto-${Date.now()}${ext.toLowerCase()}`;

    let savedPath = null;
    let url = null;

    // 1. Try saving to public/images if disk is writable
    try {
      const publicImagesDir = path.join(process.cwd(), 'public', 'images');
      if (!fs.existsSync(publicImagesDir)) {
        fs.mkdirSync(publicImagesDir, { recursive: true });
      }
      const fullPath = path.join(publicImagesDir, safeName);
      fs.writeFileSync(fullPath, buffer);
      url = `/images/${safeName}`;
      savedPath = fullPath;
    } catch (diskErr) {
      console.warn('Could not write to public/images (serverless/read-only):', diskErr.message);
    }

    // 2. If disk is read-only (e.g. Vercel Lambda), generate a high-compatibility base64 Data URL
    if (!url) {
      const base64Data = buffer.toString('base64');
      url = `data:${mimeType};base64,${base64Data}`;
    }

    return NextResponse.json({
      ok: true,
      url,
      filename: safeName,
      message: 'Foto carregada com sucesso!',
    });
  } catch (err) {
    console.error('Error uploading image:', err);
    return NextResponse.json({ error: 'Erro ao processar imagem: ' + err.message }, { status: 500 });
  }
}
