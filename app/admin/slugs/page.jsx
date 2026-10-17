'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Link2, ArrowRight, ShieldCheck, AlertTriangle, ExternalLink, RefreshCw, Loader2, Edit3 } from 'lucide-react';

export default function AdminSlugsPage() {
  const [data, setData] = useState({ pages: [], redirects: [], reserved: [] });
  const [loading, setLoading] = useState(true);

  async function loadSlugs() {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/slugs');
      const json = await res.json();
      if (json.ok) {
        setData(json);
      }
    } catch (e) {
      console.error('Error fetching slugs:', e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSlugs();
  }, []);

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Gerenciador de Slugs e Redirecionamentos
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Acompanhe todos os caminhos de URL das páginas ativas e a tabela de redirecionamentos automáticos permanentes (HTTP 301).
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 flex items-center justify-center space-x-2">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <span>Carregando dados de slugs...</span>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Active Slugs Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Slugs Ativos das Páginas
              </h2>
              <span className="text-xs text-slate-500">{data.pages.length} páginas</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3">Página</th>
                    <th className="px-6 py-3">Slug Ativo</th>
                    <th className="px-6 py-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.pages.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-900">{p.name}</td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-slate-800 font-medium">
                          {p.slug}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/pages/${p.id}`}
                          className="inline-flex items-center space-x-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
                        >
                          <Edit3 className="w-3.5 h-3.5 mr-1" />
                          <span>Alterar Slug</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Automatic Redirects Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Histórico de Redirecionamentos Ativos (301)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Garante que links antigos continuem funcionando e transfiram autoridade SEO.
                </p>
              </div>
            </div>

            {data.redirects.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                Nenhum redirecionamento registrado até o momento. Quando você altera o slug de uma página existente, a rota anterior é adicionada aqui automaticamente.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3">URL Antiga</th>
                      <th className="px-6 py-3">Redireciona Para</th>
                      <th className="px-6 py-3">Data de Criação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-xs">
                    {data.redirects.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/70">
                        <td className="px-6 py-3 text-red-600 line-through">{r.old_slug}</td>
                        <td className="px-6 py-3 text-green-700 font-bold">{r.new_slug}</td>
                        <td className="px-6 py-3 text-slate-500 font-sans text-xs">
                          {new Date(r.created_at).toLocaleDateString('pt-BR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Reserved Routes Card */}
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="flex items-center space-x-2 font-bold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Rotas Reservadas pelo Sistema (Protegidas contra colisão)</span>
            </div>
            <p>
              Os seguintes slugs são protegidos e não podem ser atribuídos a páginas públicas para evitar conflito com a aplicação:
            </p>
            <div className="flex flex-wrap gap-2 pt-1 font-mono">
              {data.reserved?.map((res, i) => (
                <span key={i} className="bg-slate-200/80 px-2 py-0.5 rounded text-slate-700">
                  {res}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
