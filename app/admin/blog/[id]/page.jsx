'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  HelpCircle,
  Clock,
  Tag,
  User,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function BlogEditorPage({ params }) {
  const { id } = params;
  const isNew = id === 'new';
  const router = useRouter();

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Bruxismo & DTM',
    excerpt: '',
    content: '',
    reading_time: '4 min de leitura',
    author: 'Dr. Guilad Weil',
    tags: 'bruxismo, laserterapia, odontologia, pinheiros',
    is_published: 1,
  });

  const [autoSlug, setAutoSlug] = useState(isNew);

  useEffect(() => {
    if (!isNew) {
      async function loadPost() {
        try {
          const res = await fetch(`/api/admin/blog/${id}`);
          const data = await res.json();
          if (data.ok && data.post) {
            setFormData({
              ...data.post,
              is_published: data.post.is_published ? 1 : 0,
            });
            setAutoSlug(false);
          } else {
            setFeedback({ type: 'error', message: data.error || 'Artigo não encontrado.' });
          }
        } catch (e) {
          setFeedback({ type: 'error', message: 'Falha de comunicação ao carregar artigo.' });
        } finally {
          setLoading(false);
        }
      }
      loadPost();
    }
  }, [id, isNew]);

  function handleTitleChange(e) {
    const val = e.target.value;
    setFormData(prev => {
      const updated = { ...prev, title: val };
      if (autoSlug) {
        updated.slug = val
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
      return updated;
    });
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFeedback({ type: 'error', message: 'O título do artigo é obrigatório.' });
      return;
    }
    if (!formData.content.trim()) {
      setFeedback({ type: 'error', message: 'O conteúdo do artigo não pode estar vazio.' });
      return;
    }

    try {
      setSaving(true);
      setFeedback(null);

      const endpoint = isNew ? '/api/admin/blog' : `/api/admin/blog/${id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.ok) {
        setFeedback({
          type: 'success',
          message: isNew ? 'Artigo criado com sucesso!' : 'Artigo salvo e atualizado com sucesso!',
        });

        if (isNew && data.post?.id) {
          setTimeout(() => {
            router.push(`/admin/blog/${data.post.id}`);
          }, 1000);
        }
      } else {
        setFeedback({ type: 'error', message: data.error || 'Erro ao salvar artigo.' });
      }
    } catch (e) {
      setFeedback({ type: 'error', message: 'Falha de conexão ao salvar artigo.' });
    } finally {
      setSaving(false);
      setTimeout(() => {
        if (feedback?.type === 'success') setFeedback(null);
      }, 5000);
    }
  }

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 text-sm">
        Carregando dados do artigo...
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/blog"
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-sm transition-colors"
            title="Voltar à lista"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {isNew ? 'Criar Novo Artigo' : `Editar: ${formData.title}`}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {isNew ? 'Redija e publique um novo conteúdo para o blog.' : 'Atualize os textos, orientações e metadados.'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {!isNew && formData.slug && (
            <Link
              href={`/blog/${formData.slug}`}
              target="_blank"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Ver no Site</span>
            </Link>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Salvando...' : 'Salvar Artigo'}</span>
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm font-medium flex items-center space-x-2 ${
            feedback.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Title, Excerpt, Content (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Título do Artigo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Ex: Como o Bruxismo Noturno Afeta a Musculatura Orofacial"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Resumo / Subtítulo Curto (Exibido nos cartões de listagem)
              </label>
              <textarea
                rows={3}
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Breve resumo em 2 a 3 frases explicando o tema do artigo..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Conteúdo Completo do Artigo <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">
                  Suporta títulos (##), listas (-) e destaques (&gt;)
                </span>
              </div>
              <textarea
                rows={16}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Digite o texto do artigo. Separe os parágrafos com duas quebras de linha.

## Subtítulo de Seção
Texto detalhado da seção...

- Ponto importante 1
- Ponto importante 2

> Frase em destaque clínico..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 font-mono text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none leading-relaxed"
                required
              />
            </div>
          </div>
        </div>

        {/* Right Column: Settings, Metadata, Category, Status (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Publication Status Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Status da Publicação
            </h3>

            <div className="flex items-center space-x-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_published === 1}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked ? 1 : 0 })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
              <span className="text-xs font-bold text-slate-800">
                {formData.is_published === 1 ? 'Publicado (Visível no Blog)' : 'Rascunho (Privado)'}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Deixe desmarcado se desejar salvar apenas como rascunho antes de tornar público.
            </p>
          </div>

          {/* Categorization & Metadata */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Categorização & Detalhes
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Categoria Clínica
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                <option value="Bruxismo & DTM">Bruxismo & DTM</option>
                <option value="Laserterapia & Herpes">Laserterapia & Herpes</option>
                <option value="Clínica Geral">Clínica Geral</option>
                <option value="Endodontia & Canal">Endodontia & Canal</option>
                <option value="Periodontia & Gengiva">Periodontia & Gengiva</option>
                <option value="Prevenção & Saúde Bucal">Prevenção & Saúde Bucal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Tempo Estimado de Leitura
              </label>
              <input
                type="text"
                value={formData.reading_time}
                onChange={(e) => setFormData({ ...formData, reading_time: e.target.value })}
                placeholder="Ex: 5 min de leitura"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Autor
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Dr. Guilad Weil"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Tags / Palavras-chave (separadas por vírgula)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="bruxismo, laserterapia, pinheiros"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-600">
                  Slug da URL
                </label>
                {autoSlug ? (
                  <button
                    type="button"
                    onClick={() => setAutoSlug(false)}
                    className="text-[10px] text-blue-600 hover:underline font-bold"
                  >
                    Editar manual
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setAutoSlug(true)}
                    className="text-[10px] text-slate-400 hover:underline font-bold"
                  >
                    Gerar do título
                  </button>
                )}
              </div>
              <div className="flex items-center rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                <span className="text-slate-400 font-mono">/blog/</span>
                <input
                  type="text"
                  value={formData.slug}
                  disabled={autoSlug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="artigo-exemplo"
                  className="w-full bg-transparent font-mono text-xs text-slate-900 border-0 focus:outline-none ml-0.5 disabled:text-slate-500"
                />
              </div>
            </div>

          </div>

          {/* Quick Guide Card */}
          <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-slate-700 space-y-2">
            <h4 className="font-bold text-blue-900 flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
              Dica de Redação Clínica
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-600">
              Artigos claros com orientações práticas ajudam no posicionamento no Google e transmitem segurança para novos pacientes que procuram o consultório em Pinheiros.
            </p>
          </div>

        </div>

      </form>
    </div>
  );
}
