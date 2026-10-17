import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Home, Search, Phone } from 'lucide-react';

export const metadata = {
  title: 'Página Não Encontrada (404) | GW Odontologia',
  description: 'A página solicitada não foi encontrada ou foi movida.',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-white px-4 py-16">
      <div className="max-w-xl mx-auto text-center space-y-6">
        <div className="w-20 h-20 rounded-2xl bg-brand-blue-soft text-brand-navy flex items-center justify-center text-3xl font-extrabold mx-auto">
          404
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">
          Página não encontrada
        </h1>
        <p className="text-base text-brand-text-body max-w-md mx-auto leading-relaxed">
          O endereço acessado não existe, foi atualizado ou foi transferido para uma nova página com slug personalizado.
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="btn-pill-blue"
          >
            <Home className="w-4 h-4 mr-2" />
            <span>Página Principal</span>
          </Link>
          <Link
            href="/contato"
            className="inline-flex items-center px-7 py-3.5 rounded-full border border-slate-300 hover:border-blue-600 text-slate-800 font-bold text-xs uppercase tracking-wider transition-colors bg-white hover:bg-slate-50 shadow-sm"
          >
            <Phone className="w-4 h-4 mr-2 text-slate-500" />
            <span>Página de Contato</span>
          </Link>
        </div>

        <div className="pt-8 border-t border-slate-100 text-xs text-brand-text-muted">
          <p>Você também pode acessar diretamente:</p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2 font-medium text-brand-blue">
            <Link href="/bruxismo" className="hover:underline">Bruxismo</Link>
            <Link href="/herpes" className="hover:underline">Herpes Labial</Link>
            <Link href="/clinica-geral" className="hover:underline">Clínica Geral</Link>
            <Link href="/tratamento-de-canal" className="hover:underline">Tratamento de Canal</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
