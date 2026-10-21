'use client';

import React from 'react';
import ToothIcon from './ToothIcon';
import { UserCheck, Award, Zap, Sparkles } from 'lucide-react';

export default function WhyChooseUsSection({ settings, data = {} }) {
  const whatsappNumber = settings?.whatsapp_raw || '5511975532110';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Olá, Dr. Guilad! Vim pelo site da GW Odontologia e gostaria de agendar uma consulta.')}`;

  const tag = data?.tag || 'POR QUE NOS ESCOLHER?';
  const title = data?.title || 'Por que escolher a GW Odontologia em Pinheiros?';
  const description = data?.subtitle || data?.description || 'Com mais de 30 anos de atuação clínica formada pela Universidade de São Paulo (USP), o Dr. Guilad Weil prioriza a saúde bucal, o diagnóstico rigoroso e o tratamento ético da dor e do bruxismo. Aqui você é atendido diretamente pelo responsável pelo seu caso, em ambiente calmo, seguro e acolhedor.';

  const defaultCards = [
    {
      icon: UserCheck,
      title: 'Atendimento individualizado com Dr. Guilad Weil',
      subtitle: 'Consulta com hora marcada e atenção integral e exclusiva do próprio cirurgião-dentista a cada etapa.',
    },
    {
      icon: Award,
      title: 'Formação sólida pela USP e mais de 30 anos de prática',
      subtitle: 'Tradição clínica contínua em Pinheiros, São Paulo, sempre orientada pelas melhores evidências biológicas.',
    },
    {
      icon: Zap,
      title: 'Abordagens modernas para bruxismo (NTI e LIVA)',
      subtitle: 'Dispositivos oclusais de alívio neuromuscular que protegem os dentes do desgaste e reduzem tensões.',
    },
    {
      icon: Sparkles,
      title: 'Laserterapia clínica de baixa potência (LLLT)',
      subtitle: 'Alívio da dor e cicatrização acelerada em episódios de herpes labial, aftas e pós-operatórios.',
    },
  ];

  const cards = data?.cards && data.cards.length > 0 ? data.cards.map((c, i) => ({
    icon: defaultCards[i]?.icon || UserCheck,
    title: c.title || defaultCards[i]?.title,
    subtitle: c.subtitle || defaultCards[i]?.subtitle,
  })) : defaultCards;

  return (
    <section className="py-20 sm:py-28 bg-[#f8faff] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column (5 cols): Eyebrow, Title, Description, Model with Badge, CTA */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-extrabold tracking-[0.2em] text-slate-500 uppercase block">
              {tag}
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              {title}
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {description}
            </p>

            {/* Dental Arch Visual with Floating GW Circular Badge */}
            <div className="relative py-4 flex items-center justify-center">
              {/* Dental Arch SVG Model */}
              <div className="w-64 h-56 bg-gradient-to-b from-blue-50/70 to-blue-100/40 rounded-3xl border border-blue-200/80 p-6 flex items-center justify-center relative shadow-sm">
                <svg className="w-44 h-40 drop-shadow-md" viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Gum Arch Base */}
                  <path
                    d="M 20 110 C 20 40, 140 40, 140 110 C 130 110, 120 70, 80 70 C 40 70, 30 110, 20 110 Z"
                    fill="#fecdd3"
                    stroke="#fda4af"
                    strokeWidth="2"
                  />
                  {/* Anatomical Teeth along Arch */}
                  <rect x="25" y="90" width="14" height="18" rx="4" fill="#ffffff" stroke="#93c5fd" strokeWidth="1.5" />
                  <rect x="42" y="70" width="15" height="19" rx="4" fill="#ffffff" stroke="#93c5fd" strokeWidth="1.5" />
                  <rect x="60" y="55" width="18" height="22" rx="4" fill="#ffffff" stroke="#93c5fd" strokeWidth="1.5" />
                  <rect x="82" y="55" width="18" height="22" rx="4" fill="#ffffff" stroke="#93c5fd" strokeWidth="1.5" />
                  <rect x="103" y="70" width="15" height="19" rx="4" fill="#ffffff" stroke="#93c5fd" strokeWidth="1.5" />
                  <rect x="121" y="90" width="14" height="18" rx="4" fill="#ffffff" stroke="#93c5fd" strokeWidth="1.5" />
                </svg>

                {/* Floating GW Monogram Circular Badge in Royal Blue */}
                <div className="absolute -bottom-2 -right-2 sm:right-2 w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white flex flex-col items-center justify-center shadow-xl border-4 border-white transform hover:scale-105 transition-transform">
                  <span className="font-black text-2xl tracking-tight leading-none">GW</span>
                  <span className="text-[9px] uppercase tracking-wider font-bold opacity-85 mt-0.5">Odonto</span>
                </div>
              </div>
            </div>

            {/* Glowing Pill CTA Button */}
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pill-blue flex items-center space-x-2 group w-full sm:w-auto"
              >
                <span>AGENDAR AVALIAÇÃO</span>
                <ToothIcon className="w-4 h-4 ml-1 fill-white group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Right Column (7 cols): Vertical Stack of 4 Rich Royal Blue Cards */}
          <div className="lg:col-span-7 space-y-4">
            {cards.map((c, i) => {
              const Icon = c.icon;
              return (
                <div
                  key={i}
                  className="bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-blue-950/20 hover:translate-x-2 transition-transform duration-300 border border-blue-600/40"
                >
                  {/* Icon badge in lighter blue */}
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/80 text-white flex items-center justify-center mb-4 shadow-sm">
                    <Icon className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-2 tracking-tight">
                    {c.title}
                  </h3>
                  <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
                    {c.subtitle}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
