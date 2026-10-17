'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, AlertCircle, Loader2, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Falha ao autenticar.');
        setLoading(false);
        return;
      }

      // Success -> navigate to dashboard
      router.push('/admin');
    } catch (err) {
      console.error('Login submit error:', err);
      setError('Erro de conexão ao servidor. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-extrabold text-2xl mx-auto shadow-lg mb-4">
          GW
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Painel Administrativo
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-400">
          Acesso restrito para edição e publicação de conteúdos da GW Odontologia
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-slate-800 py-8 px-6 sm:px-10 rounded-2xl border border-slate-700 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                E-mail Administrativo
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gwodonto.com.br"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Senha de Acesso
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white font-semibold text-sm transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verificando credenciais...</span>
                </>
              ) : (
                <>
                  <span>Entrar no Painel</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Login Helpers for Development/Testing */}
          <div className="mt-8 pt-6 border-t border-slate-700/80">
            <div className="flex items-center space-x-2 text-xs text-slate-400 mb-3">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span className="font-semibold uppercase tracking-wider text-[11px]">Usuários Autorizados</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => { setEmail('admin@gwodonto.com.br'); setPassword('GwOdonto@2026Dev!'); }}
                className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-left hover:border-slate-500 transition-colors"
              >
                <span className="block font-bold text-white">Desenvolvedor</span>
                <span className="block text-slate-400 text-[10px] truncate">admin@gwodonto.com.br</span>
              </button>
              <button
                type="button"
                onClick={() => { setEmail('drguilad@gwodonto.com.br'); setPassword('DrGuilad@GW2026!'); }}
                className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-left hover:border-slate-500 transition-colors"
              >
                <span className="block font-bold text-white">Dr. Guilad Weil</span>
                <span className="block text-slate-400 text-[10px] truncate">drguilad@gwodonto.com.br</span>
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <a href="/" className="text-xs text-slate-400 hover:text-white transition-colors">
            ← Voltar para o site público da GW Odontologia
          </a>
        </div>
      </div>
    </div>
  );
}
