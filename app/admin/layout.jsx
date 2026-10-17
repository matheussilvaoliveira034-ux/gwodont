'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  Link2, 
  ExternalLink, 
  LogOut, 
  User, 
  Menu, 
  X,
  ShieldAlert,
  Loader2,
  BookOpen
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // If on login page, render without admin layout shell
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.authenticated) {
          setCurrentUser(data.user);
        } else {
          router.push('/admin/login');
        }
      } catch (e) {
        console.error('Auth verification failed:', e);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          <span className="text-sm text-slate-400 font-medium">Carregando painel administrativo...</span>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: '/admin', label: 'Painel Geral', icon: LayoutDashboard },
    { href: '/admin/blog', label: 'Blog & Artigos', icon: BookOpen },
    { href: '/admin/settings', label: 'Dados do Consultório', icon: Settings },
    { href: '/admin/slugs', label: 'Gerenciador de Slugs', icon: Link2 },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 flex-shrink-0 border-r border-slate-800">
        {/* Brand */}
        <div className="p-5 border-b border-slate-800 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow">
            GW
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight">GW Odontologia</h1>
            <span className="text-[11px] text-blue-400 font-medium">Painel Administrativo</span>
          </div>
        </div>

        {/* User Badge */}
        {currentUser && (
          <div className="px-5 py-3.5 bg-slate-800/60 border-b border-slate-800 flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
              <User className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center space-x-2 text-xs text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Ver Site Público</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 text-xs text-red-400 hover:text-red-300 px-3 py-2 rounded-lg hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Encerrar Sessão</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header Bar */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center font-bold text-xs">
            GW
          </div>
          <span className="text-sm font-bold">GW Admin</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 text-slate-300 p-4 border-b border-slate-800 space-y-3">
          {currentUser && (
            <div className="text-xs pb-3 border-b border-slate-800">
              <p className="font-bold text-white">{currentUser.name}</p>
              <p className="text-slate-400">{currentUser.email}</p>
            </div>
          )}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
            <Link href="/" target="_blank" className="text-blue-400 font-medium">Ver Site</Link>
            <button onClick={handleLogout} className="text-red-400 font-medium">Sair</button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
