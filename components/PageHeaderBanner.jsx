'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, ChevronRight, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';
import ToothIcon from './ToothIcon';

export default function PageHeaderBanner({
  category = 'Tratamento Especializado',
  titleHighlight = '',
  titleRest = '',
  subtitle = '',
  badge = 'ATENDIMENTO CLÍNICO EM PINHEIROS',
  whatsappUrl,
  ctaText = 'Agendar Consulta pelo WhatsApp',
  phone = '(11) 3081-3789',
  imageSrc,
  imageAlt = 'GW Odontologia — Dr. Guilad Weil',
  breadcrumbs = [],
}) {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-20 bg-gradient-to-b from-blue-50/50 via-white to-white border-b border-blue-100/60">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
            <li>
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Início
              </Link>
            </li>
            {breadcrumbs.map((b, i) => (
              <li key={i} className="flex items-center space-x-2">
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                {b.href ? (
                  <Link href={b.href} className="hover:text-blue-600 transition-colors">
                    {b.label}
                  </Link>
                ) : (
                  <span className="text-blue-700 font-bold">{b.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Main Banner Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column (7 cols): Eyebrow, Two-Tone Headline, Paragraph, Actions */}
          <div className="lg:col-span-7 space-y-5">
            {/* Clinical Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-extrabold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span>{badge}</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              {titleHighlight && <span className="text-blue-600 block sm:inline">{titleHighlight} </span>}
              {titleRest}
            </h1>

            {/* Subtitle */}
            {subtitle && (
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                {subtitle}
              </p>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3.5">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pill-blue flex items-center space-x-2 group w-full sm:w-auto"
                >
                  <span>{ctaText}</span>
                  <ToothIcon className="w-4 h-4 ml-1 fill-white group-hover:scale-110 transition-transform" />
                </a>
              )}

              <a
                href={`tel:${phone.replace(/[^0-9]/g, '')}`}
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-full border border-slate-300 hover:border-blue-600 bg-white text-slate-800 font-bold text-xs uppercase tracking-wider transition-all hover:bg-slate-50 shadow-sm"
              >
                <Phone className="w-4 h-4 mr-2 text-slate-500" />
                <span>Ligar: {phone}</span>
              </a>
            </div>

            {/* Trust Micro-Badges */}
            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
              <span className="flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-blue-600" />
                Dr. Guilad Weil (USP)
              </span>
              <span className="flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-blue-600" />
                +30 Anos de Experiência
              </span>
              <span className="flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-blue-600" />
                Atendimento Particular com Hora Marcada
              </span>
            </div>
          </div>

          {/* Right Column (5 cols): Visual Banner Image / Custom Placeholder */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Soft Ambient Glow */}
              <div className="absolute inset-0 bg-blue-400/20 rounded-3xl blur-xl transform rotate-2"></div>

              {imageSrc ? (
                <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-100 aspect-[4/3] sm:aspect-[16/11]">
                  <img
                    src={imageSrc}
                    alt={imageAlt}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ) : (
                /* Clinical Decorative Banner Card with Badge & Placeholder support */
                <div className="relative rounded-3xl bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 text-white p-7 sm:p-8 shadow-xl border border-blue-600/40 overflow-hidden">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/80 text-white flex items-center justify-center font-black text-lg mb-5 shadow-sm">
                    GW
                  </div>

                  <span className="text-[11px] uppercase tracking-widest text-blue-300 font-bold block mb-1">
                    GW ODONTOLOGIA · PINHEIROS
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-2 leading-tight">
                    Excelência Clínica e Cuidado Biológico
                  </h3>
                  <p className="text-blue-100 text-xs sm:text-sm leading-relaxed mb-6">
                    Diagnóstico transparente, ausência de procedimentos invasivos desnecessários e foco permanente na sua saúde funcional.
                  </p>

                  <div className="pt-4 border-t border-blue-600/60 flex items-center justify-between text-xs text-blue-200">
                    <span>Rua Cristiano Viana, 401 · Cj 1311</span>
                    <span className="font-bold text-white">Condomínio Atrium</span>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
