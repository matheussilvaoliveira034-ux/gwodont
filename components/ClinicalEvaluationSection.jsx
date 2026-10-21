'use client';

import React from 'react';
import ToothIcon from './ToothIcon';
import { Check, ShieldCheck, Activity, Zap, ClipboardCheck } from 'lucide-react';

export default function ClinicalEvaluationSection({ settings, data = {} }) {
  const whatsappNumber = settings?.whatsapp_raw || '5511975532110';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Olá, Dr. Guilad! Vim pelo site da GW Odontologia e gostaria de agendar uma avaliação clínica.')}`;

  const title = data?.title || 'Avaliação Clínica Completa + Planejamento com Total Transparência';
  const description = data?.subtitle || data?.description || 'Aqui na GW Odontologia, você entende com exatidão a causa do seu desconforto orofacial. O Dr. Guilad Weil realiza exames clínicos criteriosos para que você saiba exatamente como proteger sua saúde mastigatória, sem intervenções desnecessárias.';

  const defaultCards = [
    {
      icon: Activity,
      title: 'Avaliação completa da oclusão e ATM',
      description: 'Análise minuciosa da mordida e musculatura mastigatória.',
    },
    {
      icon: ShieldCheck,
      title: 'Mapeamento de desgaste dentário',
      description: 'Identificação precoce de perdas de esmalte e bruxismo.',
    },
    {
      icon: Zap,
      title: 'Laserterapia clínica (quando indicada)',
      description: 'Fotobiomodulação para alívio de dor e cicatrização rápida.',
    },
    {
      icon: ClipboardCheck,
      title: 'Tudo na primeira visita, com total clareza',
      description: 'Planejamento ético, transparente e sem custos ocultos.',
    },
  ];

  const cards = data?.cards && data.cards.length > 0 ? data.cards.map((c, i) => ({
    icon: defaultCards[i]?.icon || Check,
    title: c.title || defaultCards[i]?.title,
    description: c.description || defaultCards[i]?.description,
  })) : defaultCards;

  return (
    <section className="py-20 sm:py-28 bg-[#f8faff] relative overflow-hidden">
      {/* Soft background blue ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header: Title on Left, Description on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16">
          <div className="lg:col-span-7">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              {title}
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* 4 Cards Grid - Soft Blue Tint with Royal Blue Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-[#eef5ff] hover:bg-[#e4efff] border border-blue-100 rounded-3xl p-8 text-center transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-1 flex flex-col items-center justify-center min-h-[220px]"
              >
                {/* Royal Blue Icon Badge */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center mb-5 shadow-lg shadow-blue-500/25">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                  {card.title}
                </h3>
              </div>
            );
          })}
        </div>

        {/* Wide Checkmark Banner */}
        <div className="rounded-3xl border border-blue-200/80 bg-white p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center space-x-4 sm:space-x-5">
            {/* Green Circular Checkmark */}
            <div className="w-11 h-11 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-500/20">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <p className="text-slate-800 text-sm sm:text-base font-semibold leading-relaxed">
              <span className="font-extrabold text-slate-900">Você tem clareza e previsibilidade sobre o seu tratamento.</span> Toda conduta é explicada pelo Dr. Guilad Weil de forma ética, priorizando sempre a conservação biológica dos dentes.
            </p>
          </div>

          {/* 3D Tooth Illustration graphic */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <svg className="w-16 h-16 sm:w-20 sm:h-20 text-blue-600 drop-shadow-md" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="toothGrad" x1="20" y1="10" x2="80" y2="90" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#ffffff" />
                  <stop offset="0.6" stopColor="#dbeafe" />
                  <stop offset="1" stopColor="#93c5fd" />
                </linearGradient>
                <linearGradient id="glowGrad" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3b82f6" stopOpacity="0.3" />
                  <stop offset="1" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="44" fill="url(#glowGrad)" />
              <path
                d="M50 18C36 18 26 25 24 36C22 46 23 54 26 65C30 77 34 88 40 88C44 88 45 76 50 76C55 76 56 88 60 88C66 88 70 77 74 65C77 54 78 46 76 36C74 25 64 18 50 18Z"
                fill="url(#toothGrad)"
                stroke="#60a5fa"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M35 34C37 31 43 30 50 30C57 30 63 31 65 34" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Centered Glowing Pill CTA Button */}
        <div className="flex justify-center">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill-blue flex items-center space-x-2 group"
          >
            <span>AGENDAR AVALIAÇÃO</span>
            <ToothIcon className="w-4 h-4 ml-1 fill-white group-hover:scale-110 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
