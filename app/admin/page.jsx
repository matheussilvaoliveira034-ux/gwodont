'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Edit3, 
  ExternalLink, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Database, 
  Layers, 
  AlertCircle,
  RefreshCw,
  BookOpen,
  Plus
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function loadPages() {
    try {
      setRefreshing(true);
      const res = await fetch('/api/admin/pages');
      const data = await res.json();
      if (data.ok) {
        setPages(data.pages);
      }
    } catch (e) {
      console.error('Error fetching pages:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadPages();
  }, []);

  const totalPages = pages.length;
  const draftPagesCount = pages.filter(p => p.has_draft).length;
  const publishedCount = pages.filter(p => p.is_published).length;

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Painel de Gestão de Conteúdo
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Selecione uma página para editar textos, seções, metadados e publicar alterações sem mexer em código.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadPages}
            disabled={refreshing}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Atualizar Lista</span>
          </button>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-blue-600 text-xs font-semibold text-white shadow-sm transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Ver Site Público</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Páginas Cadastradas</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalPages}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Páginas Publicadas</p>
            <p className="text-2xl font-bold text-green-700 mt-1">{publishedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Rascunhos Não Publicados</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{draftPagesCount}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Banco de Dados</p>
            <p className="text-sm font-bold text-slate-900 mt-1">SQLite Persistente</p>
            <span className="inline-block text-[10px] text-green-700 bg-green-100 font-semibold px-2 py-0.5 rounded-full mt-1">Ativo</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Blog & Articles Quick Card */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600/80 flex items-center justify-center flex-shrink-0 text-white shadow">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-blue-300">NOVA FUNCIONALIDADE</span>
            <h3 className="text-lg font-bold text-white mt-0.5">Blog Clínico & Artigos do Dr. Guilad</h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-2xl mt-1 leading-relaxed">
              Escreva novos artigos, publique orientações para os pacientes e compartilhe casos clínicos diretamente no site, sem precisar de programador.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <Link
            href="/admin/blog/new"
            className="flex-1 md:flex-initial inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-white text-blue-900 text-xs font-extrabold shadow hover:bg-blue-50 transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Artigo</span>
          </Link>
          <Link
            href="/admin/blog"
            className="flex-1 md:flex-initial inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-blue-400 text-white text-xs font-bold hover:bg-blue-800 transition-colors whitespace-nowrap"
          >
            <span>Gerenciar Artigos</span>
          </Link>
        </div>
      </div>

      {/* Pages Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Páginas do Site e Status de Edição
          </h2>
          <span className="text-xs text-slate-500">
            {pages.length} rotas gerenciadas
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            Carregando páginas...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Página / Título</th>
                  <th className="px-6 py-3">URL (Slug)</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Última Modificação</th>
                  <th className="px-6 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pages.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{p.name}</p>
                          <p className="text-xs text-slate-500 line-clamp-1">{p.title || p.name}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-slate-700">
                        {p.slug}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {p.has_draft ? (
                        <span className="inline-flex items-center text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                          <Clock className="w-3 h-3 mr-1" />
                          Rascunho Pendente
                        </span>
                      ) : p.is_published ? (
                        <span className="inline-flex items-center text-[11px] font-semibold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Publicado
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                          Oculto
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-600">
                      {p.has_draft ? (
                        <div>
                          <p className="font-medium text-amber-900">{formatDate(p.draft_updated_at)}</p>
                          <p className="text-[10px] text-slate-400">por {p.draft_updated_by || 'administrador'}</p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium text-slate-700">{formatDate(p.published_updated_at)}</p>
                          <p className="text-[10px] text-slate-400">por {p.published_updated_by || 'sistema'}</p>
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {p.has_draft && (
                          <Link
                            href={`${p.slug}?preview=true`}
                            target="_blank"
                            title="Pré-visualizar Rascunho"
                            className="p-1.5 rounded-lg text-amber-700 hover:bg-amber-50 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        )}
                        <Link
                          href={p.slug}
                          target="_blank"
                          title="Abrir Página Pública"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/pages/${p.id}`}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5 mr-1" />
                          <span>Editar</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
