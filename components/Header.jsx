'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, MessageCircle, Phone, MapPin } from 'lucide-react';

export default function Header({ settings }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: 'Início' },
    { href: '/bruxismo', label: 'Bruxismo' },
    { href: '/herpes', label: 'Herpes Labial' },
    { href: '/clinica-geral', label: 'Clínica Geral' },
    { href: '/tratamento-de-canal', label: 'Tratamento de Canal' },
    { href: '/periodontia', label: 'Periodontia' },
    { href: '/blog', label: 'Blog' },
    { href: '/contato', label: 'Contato' },
    { href: '/english', label: 'English', isEn: true },
  ];

  const whatsappNumber = settings?.whatsapp_raw || '5511975532110';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Olá, Dr. Guilad! Vim pelo site da GW Odontologia e gostaria de informações sobre agendamento de consulta.')}`;

  return (
    <>
      {/* Top micro bar for address and phone info */}
      <div className="bg-brand-navy text-white text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <span className="flex items-center text-slate-200">
              <MapPin className="w-3.5 h-3.5 mr-1.5 text-brand-blue-light" />
              Rua Cristiano Viana, 401, Cj 1311 — Pinheiros, São Paulo
            </span>
            <span className="flex items-center text-slate-200">
              <Phone className="w-3.5 h-3.5 mr-1.5 text-brand-blue-light" />
              Tel: {settings?.phone_fixo || '(11) 3081-3789'}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-slate-300 font-medium">Seg a Sex: 8h30 - 18h | Sáb: 9h - 12h</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-300">English and Hebrew spoken</span>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 glass-header border-b ${
          scrolled ? 'border-slate-200 shadow-header py-2.5' : 'border-slate-100 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & Clinical Brand */}
          <Link href="/" className="flex items-center group py-1">
            <img
              src="/images/logo-gw-odontologia.png"
              alt="GW Odontologia - Dr. Guilad Weil"
              className="h-10 sm:h-12 w-auto object-contain hover:opacity-90 transition-opacity"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1 lg:space-x-1.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'text-white bg-blue-600 font-extrabold shadow-sm shadow-blue-500/20'
                      : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'
                  } ${link.isEn ? 'border border-blue-200 text-blue-600 ml-2' : ''}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action CTA Button - Royal Blue Pill */}
          <div className="hidden lg:flex items-center space-x-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill-nav flex items-center space-x-1.5 group"
            >
              <span>CONTATO</span>
            </a>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex xl:hidden items-center space-x-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-green-50 text-green-700 md:hidden"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-5 h-5 text-brand-whatsapp" />
            </a>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-brand-navy hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              aria-label="Menu principal"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {isOpen && (
          <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-xl animate-fadeIn">
            <div className="grid grid-cols-1 gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-brand-blue-soft text-brand-navy font-semibold'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-brand-navy'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col space-y-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center px-4 py-3 rounded-lg bg-brand-navy text-white text-base font-semibold shadow"
              >
                <MessageCircle className="w-5 h-5 mr-2 text-brand-whatsapp" />
                Agendar pelo WhatsApp
              </a>
              <a
                href={`tel:${settings?.phone_fixo?.replace(/[^0-9]/g, '') || '1130813789'}`}
                className="w-full flex items-center justify-center px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50"
              >
                <Phone className="w-4 h-4 mr-2 text-slate-500" />
                Ligar: {settings?.phone_fixo || '(11) 3081-3789'}
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
