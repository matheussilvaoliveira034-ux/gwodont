'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Save, 
  Send, 
  Trash2, 
  Eye, 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Trash, 
  Globe, 
  FileText, 
  HelpCircle, 
  Tag, 
  Link2,
  Loader2,
  Code,
  Copy,
  Check
} from 'lucide-react';

export default function AdminPageEditor({ params }) {
  const pageId = params.id;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [discarding, setDiscarding] = useState(false);
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState('hero');

  // Page data
  const [pageMeta, setPageMeta] = useState(null);
  const [slug, setSlug] = useState('');
  const [slugUpdating, setSlugUpdating] = useState(false);

  // Form State
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [content, setContent] = useState({});
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'advanced') {
      try {
        setJsonText(JSON.stringify(content, null, 2));
        setJsonError(null);
      } catch (_) {}
    }
  };

  const handleJsonChange = (val) => {
    setJsonText(val);
    try {
      const parsed = JSON.parse(val);
      setContent(parsed);
      setJsonError(null);
    } catch (err) {
      setJsonError(err.message);
    }
  };

  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonText(formatted);
      setContent(parsed);
      setJsonError(null);
      showNotification('success', 'JSON formatado com sucesso!');
    } catch (err) {
      setJsonError(err.message);
      showNotification('error', 'Erro de sintaxe no JSON: ' + err.message);
    }
  };

  async function loadPage() {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/pages/${pageId}`);
      const data = await res.json();

      if (!res.ok || !data.ok) {
        showNotification('error', data.error || 'Erro ao carregar página.');
        return;
      }

      const p = data.data;
      setPageMeta(p);
      setSlug(p.slug);

      // Prioritize draft content if available, otherwise published
      const activeVersion = p.draft || p.published;
      if (activeVersion) {
        setSeoTitle(activeVersion.seo_title || '');
        setSeoDescription(activeVersion.seo_description || '');
        setSeoKeywords(activeVersion.seo_keywords || '');
        const pageContent = activeVersion.content || {};
        setContent(pageContent);
        try {
          setJsonText(JSON.stringify(pageContent, null, 2));
        } catch (_) {}
      }
    } catch (e) {
      console.error('Error loading page:', e);
      showNotification('error', 'Falha ao conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPage();
  }, [pageId]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 6000);
  };

  // 1. Save Draft
  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/pages/${pageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seo_title: seoTitle,
          seo_description: seoDescription,
          seo_keywords: seoKeywords,
          content,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        showNotification('error', data.error || 'Erro ao salvar rascunho.');
      } else {
        showNotification('success', 'Rascunho salvo com sucesso no banco de dados!');
        loadPage();
      }
    } catch (e) {
      showNotification('error', 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  // 2. Publish to Live Site
  const handlePublish = async () => {
    if (!window.confirm('Deseja publicar essas alterações no site público da GW Odontologia agora?')) {
      return;
    }

    // Automatically save draft first to ensure latest edits are included
    setPublishing(true);
    try {
      await fetch(`/api/admin/pages/${pageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seo_title: seoTitle,
          seo_description: seoDescription,
          seo_keywords: seoKeywords,
          content,
        }),
      });

      const res = await fetch(`/api/admin/pages/${pageId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'publish' }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        showNotification('error', data.error || 'Erro ao publicar.');
      } else {
        showNotification('success', 'Alterações publicadas com sucesso! O site público já está atualizado.');
        loadPage();
      }
    } catch (e) {
      showNotification('error', 'Erro ao publicar.');
    } finally {
      setPublishing(false);
    }
  };

  // 3. Discard Draft
  const handleDiscardDraft = async () => {
    if (!window.confirm('Tem certeza de que deseja descartar as alterações não publicadas? O conteúdo voltará à versão atualmente publicada.')) {
      return;
    }

    setDiscarding(true);
    try {
      const res = await fetch(`/api/admin/pages/${pageId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        showNotification('error', data.error || 'Erro ao descartar rascunho.');
      } else {
        showNotification('success', 'Rascunho descartado. Versão publicada restaurada.');
        loadPage();
      }
    } catch (e) {
      showNotification('error', 'Erro ao descartar.');
    } finally {
      setDiscarding(false);
    }
  };

  // 4. Update Slug
  const handleUpdateSlug = async (e) => {
    e.preventDefault();
    setSlugUpdating(true);
    try {
      const res = await fetch(`/api/admin/pages/${pageId}/slug`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        showNotification('error', data.error || 'Erro ao atualizar slug.');
      } else {
        showNotification('success', data.message || 'Slug atualizado com sucesso!');
        loadPage();
      }
    } catch (e) {
      showNotification('error', 'Erro ao atualizar slug.');
    } finally {
      setSlugUpdating(false);
    }
  };

  // Helper setters for deep content fields
  const setHeroField = (field, val) => {
    setContent(prev => ({
      ...prev,
      hero: {
        ...(prev.hero || {}),
        [field]: val,
      },
    }));
  };

  const setSectionField = (section, field, val) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: val,
      },
    }));
  };

  const setNestedArrayItem = (section, arrayKey, idx, field, val) => {
    setContent(prev => {
      const arr = [...((prev[section] && prev[section][arrayKey]) || [])];
      if (field) {
        arr[idx] = { ...arr[idx], [field]: val };
      } else {
        arr[idx] = val;
      }
      return {
        ...prev,
        [section]: {
          ...(prev[section] || {}),
          [arrayKey]: arr,
        },
      };
    });
  };

  const addNestedArrayItem = (section, arrayKey, defaultItem) => {
    setContent(prev => {
      const arr = [...((prev[section] && prev[section][arrayKey]) || [])];
      arr.push(defaultItem);
      return {
        ...prev,
        [section]: {
          ...(prev[section] || {}),
          [arrayKey]: arr,
        },
      };
    });
  };

  const removeNestedArrayItem = (section, arrayKey, idx) => {
    setContent(prev => {
      const arr = ((prev[section] && prev[section][arrayKey]) || []).filter((_, i) => i !== idx);
      return {
        ...prev,
        [section]: {
          ...(prev[section] || {}),
          [arrayKey]: arr,
        },
      };
    });
  };

  // FAQ Handlers
  const handleFaqChange = (idx, field, val) => {
    const list = [...(content.faq || [])];
    list[idx] = { ...list[idx], [field]: val };
    setContent(prev => ({ ...prev, faq: list }));
  };

  const handleAddFaq = () => {
    const list = [...(content.faq || []), { question: 'Nova Pergunta Clínica', answer: 'Resposta explicativa correspondente.' }];
    setContent(prev => ({ ...prev, faq: list }));
  };

  const handleDeleteFaq = (idx) => {
    const list = (content.faq || []).filter((_, i) => i !== idx);
    setContent(prev => ({ ...prev, faq: list }));
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 flex items-center justify-center space-x-2">
        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
        <span>Carregando dados da página...</span>
      </div>
    );
  }

  const hasDraft = !!pageMeta?.draft;

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin"
          className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          <span>Voltar para o Painel Geral</span>
        </Link>

        <div className="flex items-center space-x-2">
          {hasDraft && (
            <Link
              href={`${pageMeta.slug}?preview=true`}
              target="_blank"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold hover:bg-amber-100 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Pré-visualizar Rascunho</span>
            </Link>
          )}
          <Link
            href={pageMeta.slug}
            target="_blank"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Ver no Site Público</span>
          </Link>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-4 rounded-xl border text-sm flex items-start space-x-3 transition-all ${
            notification.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Page Title & Status Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {pageMeta?.name}
            </h1>
            {hasDraft ? (
              <span className="inline-flex items-center text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                <Clock className="w-3 h-3 mr-1" />
                Rascunho não publicado
              </span>
            ) : (
              <span className="inline-flex items-center text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Publicado
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 font-mono">
            URL ativa: <span className="text-slate-800 font-bold">{pageMeta?.slug}</span>
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {hasDraft && (
            <button
              type="button"
              onClick={handleDiscardDraft}
              disabled={discarding}
              className="inline-flex items-center px-3.5 py-2 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-1.5" />
              <span>Descartar Rascunho</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors shadow-sm disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Save className="w-4 h-4 mr-1.5" />}
            <span>Salvar Rascunho</span>
          </button>

          <button
            type="button"
            onClick={handlePublish}
            disabled={publishing}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-sm disabled:opacity-50"
          >
            {publishing ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Send className="w-4 h-4 mr-1.5" />}
            <span>Publicar Alterações</span>
          </button>
        </div>
      </div>

      {/* Slug Management Section */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <form onSubmit={handleUpdateSlug} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <label htmlFor="slug" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Endereço da Página (Slug Personalizado)
            </label>
            <p className="text-xs text-slate-500">
              Ao alterar o slug, a URL anterior será redirecionada automaticamente via 301 sem quebrar links.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative rounded-lg shadow-sm">
              <input
                id="slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                disabled={pageMeta?.slug === '/'}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 disabled:opacity-50"
              />
            </div>
            {pageMeta?.slug !== '/' && (
              <button
                type="submit"
                disabled={slugUpdating || slug === pageMeta?.slug}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg disabled:opacity-40 transition-colors"
              >
                {slugUpdating ? 'Atualizando...' : 'Atualizar Slug'}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-6 text-sm font-semibold overflow-x-auto pb-px">
        <button
          type="button"
          onClick={() => handleTabChange('hero')}
          className={`pb-3 border-b-2 whitespace-nowrap transition-colors flex items-center space-x-2 ${
            activeTab === 'hero'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Apresentação & Hero</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('content')}
          className={`pb-3 border-b-2 whitespace-nowrap transition-colors flex items-center space-x-2 ${
            activeTab === 'content'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Textos & Procedimentos</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('faq')}
          className={`pb-3 border-b-2 whitespace-nowrap transition-colors flex items-center space-x-2 ${
            activeTab === 'faq'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Perguntas Frequentes ({content.faq?.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('seo')}
          className={`pb-3 border-b-2 whitespace-nowrap transition-colors flex items-center space-x-2 ${
            activeTab === 'seo'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>SEO & Metadados</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('advanced')}
          className={`pb-3 border-b-2 whitespace-nowrap transition-colors flex items-center space-x-2 ${
            activeTab === 'advanced'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>Editor Avançado (JSON)</span>
        </button>
      </div>

      {/* Tab 1: Hero & Titles */}
      {activeTab === 'hero' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Seção de Abertura (Hero)
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Etiqueta Superior (Eyebrow Tag)
            </label>
            <input
              type="text"
              value={content.hero?.tag || ''}
              onChange={(e) => setHeroField('tag', e.target.value)}
              placeholder="Ex: ODONTOLOGIA CLÍNICA EM PINHEIROS"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Destaque do Título em Azul (Opcional)
              </label>
              <input
                type="text"
                value={content.hero?.title_highlight || ''}
                onChange={(e) => setHeroField('title_highlight', e.target.value)}
                placeholder="Ex: Tratamento de Bruxismo"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Restante do Título
              </label>
              <input
                type="text"
                value={content.hero?.title_rest || ''}
                onChange={(e) => setHeroField('title_rest', e.target.value)}
                placeholder="Ex: e Clínica Geral em Pinheiros"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Título Completo da Página (H1)
            </label>
            <input
              type="text"
              value={content.hero?.title || ''}
              onChange={(e) => setHeroField('title', e.target.value)}
              placeholder="Ex: Tratamento de Bruxismo e Clínica Geral em Pinheiros"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Caso preenchido o "Destaque do Título em Azul", ele terá prioridade visual de dois tons na Home.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Texto Descritivo / Subtítulo
            </label>
            <textarea
              rows={3}
              value={content.hero?.subtitle || ''}
              onChange={(e) => setHeroField('subtitle', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Texto do Botão Principal (WhatsApp)
              </label>
              <input
                type="text"
                value={content.hero?.cta_primary_text || ''}
                onChange={(e) => setHeroField('cta_primary_text', e.target.value)}
                placeholder="Ex: Agendar Consulta pelo WhatsApp"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Texto do Botão Secundário
              </label>
              <input
                type="text"
                value={content.hero?.cta_secondary_text || ''}
                onChange={(e) => setHeroField('cta_secondary_text', e.target.value)}
                placeholder="Ex: Ver Procedimentos Confirmados"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Detailed Clinical Texts */}
      {activeTab === 'content' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">
              Textos Descritivos, Seções e Procedimentos Clínicos
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Todos os blocos de texto da página podem ser alterados diretamente nos campos abaixo.
            </p>
          </div>

          {/* Section: Avaliação Clínica (Home) */}
          {content.clinical_evaluation && (
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
              <h3 className="font-bold text-sm text-slate-800 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>Seção: Avaliação Clínica Completa</span>
              </h3>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Título Principal</label>
                <input
                  type="text"
                  value={content.clinical_evaluation.title || ''}
                  onChange={(e) => setSectionField('clinical_evaluation', 'title', e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Descrição / Subtítulo</label>
                <textarea
                  rows={3}
                  value={content.clinical_evaluation.subtitle || ''}
                  onChange={(e) => setSectionField('clinical_evaluation', 'subtitle', e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-sm"
                ></textarea>
              </div>
            </div>
          )}

          {/* Section: Diagrama Dentário (Home) */}
          {content.tooth_diagram && (
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
              <h3 className="font-bold text-sm text-slate-800 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>Seção: Diagrama Anatômico Dental</span>
              </h3>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Título da Seção</label>
                <input
                  type="text"
                  value={content.tooth_diagram.title || ''}
                  onChange={(e) => setSectionField('tooth_diagram', 'title', e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Texto Explicativo</label>
                <textarea
                  rows={3}
                  value={content.tooth_diagram.subtitle || ''}
                  onChange={(e) => setSectionField('tooth_diagram', 'subtitle', e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-sm"
                ></textarea>
              </div>
            </div>
          )}

          {/* Section: Por que nos escolher (Home) */}
          {content.why_choose_us && (
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
              <h3 className="font-bold text-sm text-slate-800 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>Seção: Por que Escolher a GW Odontologia</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Etiqueta Superior (Tag)</label>
                  <input
                    type="text"
                    value={content.why_choose_us.tag || ''}
                    onChange={(e) => setSectionField('why_choose_us', 'tag', e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Título da Seção</label>
                  <input
                    type="text"
                    value={content.why_choose_us.title || ''}
                    onChange={(e) => setSectionField('why_choose_us', 'title', e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-sm font-semibold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Descrição</label>
                <textarea
                  rows={3}
                  value={content.why_choose_us.subtitle || ''}
                  onChange={(e) => setSectionField('why_choose_us', 'subtitle', e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-sm"
                ></textarea>
              </div>
            </div>
          )}

          {/* Section: Sobre o Dr. Guilad Weil */}
          {content.about_doctor && (
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-5">
              <h3 className="font-bold text-sm text-slate-800 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>Seção: Sobre o Cirurgião-Dentista</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Etiqueta Superior (Tag)</label>
                  <input
                    type="text"
                    value={content.about_doctor.tag || ''}
                    onChange={(e) => setSectionField('about_doctor', 'tag', e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Título da Seção</label>
                  <input
                    type="text"
                    value={content.about_doctor.title || ''}
                    onChange={(e) => setSectionField('about_doctor', 'title', e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-sm font-semibold"
                  />
                </div>
              </div>

              {/* Parágrafos do Doutor */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Parágrafos Biográficos
                  </label>
                  <button
                    type="button"
                    onClick={() => addNestedArrayItem('about_doctor', 'paragraphs', 'Novo parágrafo sobre a trajetória do Dr. Guilad.')}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar Parágrafo</span>
                  </button>
                </div>
                {content.about_doctor.paragraphs?.map((p, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <textarea
                      rows={3}
                      value={p}
                      onChange={(e) => setNestedArrayItem('about_doctor', 'paragraphs', idx, null, e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-sm"
                    ></textarea>
                    <button
                      type="button"
                      onClick={() => removeNestedArrayItem('about_doctor', 'paragraphs', idx)}
                      className="text-red-500 hover:text-red-700 p-1.5 rounded"
                      title="Excluir parágrafo"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Credenciais e Destaques */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Credenciais e Qualificações em Destaque
                  </label>
                  <button
                    type="button"
                    onClick={() => addNestedArrayItem('about_doctor', 'credentials', 'Nova formação ou habilitação')}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar Credencial</span>
                  </button>
                </div>
                {content.about_doctor.credentials?.map((c, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={c}
                      onChange={(e) => setNestedArrayItem('about_doctor', 'credentials', idx, null, e.target.value)}
                      className="w-full px-3 py-1.5 bg-white rounded-lg border border-slate-300 text-xs font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => removeNestedArrayItem('about_doctor', 'credentials', idx)}
                      className="text-red-500 hover:text-red-700 p-1.5 rounded"
                      title="Excluir credencial"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Cards de Serviços e Tratamentos */}
          {content.services_section && (
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
              <h3 className="font-bold text-sm text-slate-800 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>Seção: Cards de Tratamentos</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Etiqueta Superior (Tag)</label>
                  <input
                    type="text"
                    value={content.services_section.tag || ''}
                    onChange={(e) => setSectionField('services_section', 'tag', e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Título da Seção</label>
                  <input
                    type="text"
                    value={content.services_section.title || ''}
                    onChange={(e) => setSectionField('services_section', 'title', e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-sm font-semibold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Subtítulo</label>
                <input
                  type="text"
                  value={content.services_section.subtitle || ''}
                  onChange={(e) => setSectionField('services_section', 'subtitle', e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Cards de Tratamentos Individuais
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {content.services_section.cards?.map((card, idx) => (
                    <div key={idx} className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-600">{card.slug}</span>
                        <input
                          type="text"
                          value={card.badge || ''}
                          onChange={(e) => setNestedArrayItem('services_section', 'cards', idx, 'badge', e.target.value)}
                          placeholder="Etiqueta / Badge"
                          className="px-2 py-0.5 text-[11px] bg-blue-50 text-blue-700 rounded border border-blue-200"
                        />
                      </div>
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) => setNestedArrayItem('services_section', 'cards', idx, 'title', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-bold"
                        placeholder="Título do card"
                      />
                      <textarea
                        rows={2}
                        value={card.description}
                        onChange={(e) => setNestedArrayItem('services_section', 'cards', idx, 'description', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs"
                        placeholder="Descrição do card"
                      ></textarea>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Section: Diferenciais Clínicos */}
          {content.differentials && (
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
              <h3 className="font-bold text-sm text-slate-800 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>Seção: Diferenciais Clínicos</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Etiqueta</label>
                  <input
                    type="text"
                    value={content.differentials.tag || ''}
                    onChange={(e) => setSectionField('differentials', 'tag', e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Título</label>
                  <input
                    type="text"
                    value={content.differentials.title || ''}
                    onChange={(e) => setSectionField('differentials', 'title', e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-sm font-semibold"
                  />
                </div>
              </div>
              <div className="space-y-3 pt-2">
                {content.differentials.items?.map((item, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => setNestedArrayItem('differentials', 'items', idx, 'title', e.target.value)}
                      className="w-full px-2.5 py-1 bg-slate-50 font-bold text-xs rounded border border-slate-300"
                    />
                    <textarea
                      rows={2}
                      value={item.description}
                      onChange={(e) => setNestedArrayItem('differentials', 'items', idx, 'description', e.target.value)}
                      className="w-full px-2.5 py-1 text-xs rounded border border-slate-300"
                    ></textarea>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* If page has understanding_section */}
          {content.understanding_section && (
            <div className="space-y-4 p-5 bg-slate-50 rounded-xl border border-slate-200">
              <h3 className="font-bold text-sm text-slate-800">Seção Explicativa</h3>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Título da Seção</label>
                <input
                  type="text"
                  value={content.understanding_section.title || ''}
                  onChange={(e) => {
                    const sec = { ...content.understanding_section, title: e.target.value };
                    setContent({ ...content, understanding_section: sec });
                  }}
                  className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Parágrafos de Conteúdo</label>
                {content.understanding_section.paragraphs?.map((p, idx) => (
                  <textarea
                    key={idx}
                    rows={3}
                    value={p}
                    onChange={(e) => {
                      const pars = [...content.understanding_section.paragraphs];
                      pars[idx] = e.target.value;
                      setContent({
                        ...content,
                        understanding_section: { ...content.understanding_section, paragraphs: pars }
                      });
                    }}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-sm mb-2"
                  ></textarea>
                ))}
              </div>
            </div>
          )}

          {/* If page has procedures (Clinica Geral) */}
          {content.procedures && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-800">Procedimentos Cadastrados</h3>
              {content.procedures.map((proc, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <input
                    type="text"
                    value={proc.title}
                    onChange={(e) => {
                      const procs = [...content.procedures];
                      procs[idx] = { ...procs[idx], title: e.target.value };
                      setContent({ ...content, procedures: procs });
                    }}
                    className="w-full px-3 py-1.5 bg-white font-bold text-sm rounded border border-slate-300"
                  />
                  <textarea
                    rows={2}
                    value={proc.description}
                    onChange={(e) => {
                      const procs = [...content.procedures];
                      procs[idx] = { ...procs[idx], description: e.target.value };
                      setContent({ ...content, procedures: procs });
                    }}
                    className="w-full px-3 py-1.5 bg-white text-xs rounded border border-slate-300"
                  ></textarea>
                </div>
              ))}
            </div>
          )}

          {/* If page has devices_section (Bruxismo) */}
          {content.devices_section && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-800">Dispositivos Clínicos (NTI, LIVA, etc.)</h3>
              {content.devices_section.items?.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => {
                      const items = [...content.devices_section.items];
                      items[idx] = { ...items[idx], title: e.target.value };
                      setContent({
                        ...content,
                        devices_section: { ...content.devices_section, items }
                      });
                    }}
                    className="w-full px-3 py-1.5 bg-white font-bold text-sm rounded border border-slate-300"
                  />
                  <textarea
                    rows={3}
                    value={item.description}
                    onChange={(e) => {
                      const items = [...content.devices_section.items];
                      items[idx] = { ...items[idx], description: e.target.value };
                      setContent({
                        ...content,
                        devices_section: { ...content.devices_section, items }
                      });
                    }}
                    className="w-full px-3 py-1.5 bg-white text-xs rounded border border-slate-300"
                  ></textarea>
                </div>
              ))}
            </div>
          )}

          {/* If page has generic body paragraphs */}
          {content.body_paragraphs && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Parágrafos de Texto</label>
              {content.body_paragraphs.map((p, idx) => (
                <textarea
                  key={idx}
                  rows={3}
                  value={p}
                  onChange={(e) => {
                    const pars = [...content.body_paragraphs];
                    pars[idx] = e.target.value;
                    setContent({ ...content, body_paragraphs: pars });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                ></textarea>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: FAQ Management */}
      {activeTab === 'faq' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">
              Perguntas e Respostas Frequentes
            </h2>
            <button
              type="button"
              onClick={handleAddFaq}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar Pergunta</span>
            </button>
          </div>

          <div className="space-y-4">
            {(!content.faq || content.faq.length === 0) ? (
              <p className="text-xs text-slate-400 text-center py-6">
                Nenhuma pergunta frequente cadastrada nesta página.
              </p>
            ) : (
              content.faq.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Pergunta #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteFaq(idx)}
                      className="text-red-500 hover:text-red-700 text-xs inline-flex items-center space-x-1 p-1 rounded"
                    >
                      <Trash className="w-3.5 h-3.5" />
                      <span>Remover</span>
                    </button>
                  </div>

                  <input
                    type="text"
                    value={item.question}
                    onChange={(e) => handleFaqChange(idx, 'question', e.target.value)}
                    placeholder="Pergunta..."
                    className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-sm font-semibold text-slate-800"
                  />

                  <textarea
                    rows={3}
                    value={item.answer}
                    onChange={(e) => handleFaqChange(idx, 'answer', e.target.value)}
                    placeholder="Resposta clínica..."
                    className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-sm text-slate-700"
                  ></textarea>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 4: SEO Metadata */}
      {activeTab === 'seo' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Otimização para Mecanismos de Busca (SEO)
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Título SEO (Meta Title)
            </label>
            <input
              type="text"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Comprimento: {seoTitle.length} caracteres (Ideal entre 50 e 65)
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Descrição SEO (Meta Description)
            </label>
            <textarea
              rows={3}
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Comprimento: {seoDescription.length} caracteres (Ideal entre 120 e 160)
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Palavras-chave (Keywords)
            </label>
            <input
              type="text"
              value={seoKeywords}
              onChange={(e) => setSeoKeywords(e.target.value)}
              placeholder="palavra1, palavra2, termo3"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* Tab 5: Advanced JSON Editor */}
      {activeTab === 'advanced' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Code className="w-5 h-5 text-blue-600" />
                <span>Editor Avançado de Conteúdo (JSON Completo)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Permite editar, adicionar ou customizar 100% dos dados, textos e estruturas da página diretamente com validação instantânea.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleFormatJson}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1"
              >
                <Code className="w-3.5 h-3.5" />
                <span>Formatar / Indentar</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(jsonText);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado!' : 'Copiar JSON'}</span>
              </button>
            </div>
          </div>

          {jsonError ? (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Erro de Sintaxe no JSON:</span>
                <span className="font-mono">{jsonError}</span>
              </div>
            </div>
          ) : (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-xs text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="font-semibold">JSON Válido e Sincronizado com o sistema.</span>
            </div>
          )}

          <div>
            <textarea
              rows={24}
              value={jsonText}
              onChange={(e) => handleJsonChange(e.target.value)}
              className="w-full p-4 font-mono text-xs text-emerald-400 bg-slate-950 rounded-xl border border-slate-800 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed tracking-wide"
              spellCheck={false}
            ></textarea>
          </div>
        </div>
      )}

      {/* Floating Bottom Bar for Fast Actions */}
      <div className="sticky bottom-6 z-30 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-slate-800">
        <div className="flex items-center space-x-3 text-xs">
          <span className="text-slate-400 hidden sm:inline">Página:</span>
          <span className="font-bold text-white truncate max-w-xs">{pageMeta?.name}</span>
          {hasDraft && (
            <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded-full">
              Rascunho não publicado
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={saving}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Salvar Rascunho'}
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={publishing}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors shadow disabled:opacity-50"
          >
            {publishing ? 'Publicando...' : 'Publicar Alterações'}
          </button>
        </div>
      </div>
    </div>
  );
}
