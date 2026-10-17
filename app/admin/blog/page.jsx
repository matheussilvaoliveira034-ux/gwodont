'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Plus, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Clock, 
  Calendar, 
  User, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  Search
} from 'lucide-react';

export default function AdminBlogListPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  async function loadPosts() {
    try {
      setRefreshing(true);
      const res = await fetch('/api/admin/blog');
      const data = await res.json();
      if (data.ok) {
        setPosts(data.posts);
      }
    } catch (e) {
      console.error('Error loading posts:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function handleDelete(id, title) {
    if (!window.confirm(`Tem certeza que deseja excluir o artigo "${title}"?\nEsta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      setDeletingId(id);
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.ok) {
        setFeedback({ type: 'success', message: 'Artigo excluído com sucesso.' });
        loadPosts();
      } else {
        setFeedback({ type: 'error', message: data.error || 'Erro ao excluir artigo.' });
      }
    } catch (e) {
      setFeedback({ type: 'error', message: 'Falha de comunicação ao excluir artigo.' });
    } finally {
      setDeletingId(null);
      setTimeout(() => setFeedback(null), 4000);
    }
  }

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase()) ||
    p.tags?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Gestão de Conteúdo Educativo</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Artigos do Blog Clínico
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Crie, edite ou remova publicações clínicas da GW Odontologia. Todas as alterações refletem imediatamente no site.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadPosts}
            disabled={refreshing}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </button>
          
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Novo Artigo</span>
          </Link>
        </div>
      </div>

      {/* Feedback banner */}
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

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center">
        <Search className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por título, categoria ou palavra-chave..."
          className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent border-0 focus:ring-0 focus:outline-none"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="text-xs text-slate-400 hover:text-slate-600 font-semibold ml-2"
          >
            Limpar
          </button>
        )}
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Artigos Cadastrados ({filteredPosts.length})
          </h2>
          <Link
            href="/blog"
            target="_blank"
            className="text-xs text-blue-600 hover:text-blue-800 font-bold inline-flex items-center space-x-1"
          >
            <span>Ver Blog Público</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            Carregando artigos do blog...
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-medium">Nenhum artigo encontrado.</p>
            <p className="text-xs text-slate-400 mt-1">Clique em "Criar Novo Artigo" para começar.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-6">Título & Categoria</th>
                  <th className="py-3 px-4">Autor & Tempo</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Data</th>
                  <th className="py-3 px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 max-w-sm">
                      <div className="font-bold text-slate-900 text-sm line-clamp-1">{post.title}</div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                          {post.category || 'Clínica Geral'}
                        </span>
                        <span className="text-[11px] text-slate-400 truncate">
                          /blog/{post.slug}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center text-slate-800 font-medium">
                        <User className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        <span>{post.author || 'Dr. Guilad Weil'}</span>
                      </div>
                      <div className="flex items-center text-slate-400 text-[11px] mt-0.5">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        <span>{post.reading_time || '5 min'}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      {post.is_published ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-green-50 text-green-700 border border-green-200">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-green-600" />
                          Publicado
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3 h-3 mr-1 text-amber-600" />
                          Rascunho
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-slate-500 text-[11px]">
                      {post.published_at ? new Date(post.published_at).toLocaleDateString('pt-BR') : '—'}
                    </td>

                    <td className="py-4 px-6 text-right whitespace-nowrap space-x-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-blue-600 hover:border-blue-300 font-semibold text-[11px] transition-colors"
                        title="Ver artigo publicado"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Ver</span>
                      </Link>

                      <Link
                        href={`/admin/blog/${post.id}`}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-semibold text-[11px] transition-colors"
                        title="Editar artigo"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Editar</span>
                      </Link>

                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        disabled={deletingId === post.id}
                        className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-600 hover:text-white font-semibold text-[11px] transition-colors"
                        title="Excluir artigo"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Excluir</span>
                      </button>
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
