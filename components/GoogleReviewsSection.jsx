'use client';

import React, { useState } from 'react';
import { Star, MessageCircle, ExternalLink, CheckCircle2, ShieldCheck, Quote } from 'lucide-react';
import ToothIcon from './ToothIcon';

export default function GoogleReviewsSection({ reviews = [], settings }) {
  const [filter, setFilter] = useState('todos');

  const whatsappNumber = settings?.whatsapp_raw || '5511975532110';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Olá, Dr. Guilad! Vi as avaliações de pacientes no site da GW Odontologia e gostaria de agendar uma consulta.')}`;

  // Default reviews fallback if none passed
  const displayReviews = reviews && reviews.length > 0 ? reviews : [
    {
      author_name: 'Renato Aguiar',
      author_role: '3 avaliações',
      rating: 5,
      date_text: '3 meses atrás',
      treatment_tag: 'Clínica Geral & Precisão',
      comment: 'O Dr. Guilad é um excelente profissional e tem um profundo conhecimento da odontologia, além de possuir as habilidades adequadas para exercer o ofício. Consultório limpíssimo e atendimento preciso e honesto. Além disso, o Guilad é um cara muito muito gente boa. Vale muito a pena!',
      owner_response: 'Muito obrigado pelo reconhecimento e pelas palavras, fico imensamente feliz com o seu feedback! No meu consultório, trabalho para que a precisão técnica e o rigor científico caminhem lado a lado com um ambiente biológico totalmente limpo, seguro e acolhedor.',
    },
    {
      author_name: 'Thaina Drefahl',
      author_role: '1 avaliação',
      rating: 5,
      date_text: '1 ano atrás',
      treatment_tag: 'Bruxismo & ATM',
      comment: 'Fiz uma placa para bruxismo e tratei os problemas causados pelo bruxismo. O Dr Guilad foi didático, explicou tudo com clareza e foi muito fácil agendar as consultas.',
      owner_response: 'Que excelente notícia! Ficamos muito felizes em saber que o seu tratamento para bruxismo atendeu suas expectativas com total clareza diagnóstica.',
    },
    {
      author_name: 'Daniela Munhoz',
      author_role: '4 avaliações',
      rating: 5,
      date_text: '2 anos atrás',
      treatment_tag: 'Laserterapia & Urgência',
      comment: 'Excelente atendimento. Tive uma crise de herpes e acessei o Dr Guilad em plena sexta à noite. O mesmo respondeu prontamente, foi extremamente atencioso e profissional ao me atender no sábado pela manhã.',
      owner_response: 'Daniela, obrigado pela sua avaliação! Pode contar sempre comigo para aplicações de laser e qualquer questão odontológica.',
    },
    {
      author_name: 'Gustavo Pugliesi',
      author_role: 'Local Guide · 67 avaliações',
      rating: 5,
      date_text: '3 anos atrás',
      treatment_tag: 'Herpes & Laserterapia',
      comment: 'Estive no consultório para tratamento de herpes labial com laser. O atendimento é excelente, além do tratamento ser realmente eficiente, com diminuição do inchaço logo após a 1ª aplicação.',
      owner_response: 'Muito obrigado pela avaliação e pela confiança, conte sempre conosco quando precisar!',
    },
    {
      author_name: 'Jaqueline Carvalho',
      author_role: '4 avaliações',
      rating: 5,
      date_text: '3 anos atrás',
      treatment_tag: 'Bruxismo & Ética',
      comment: 'Excelente atendimento, Dr GW é um profissional extremamente capacitado. Ele me orientou claramente sobre meu bruxismo e em nenhum momento quis oferecer tratamentos desnecessários, o que me trouxe muita confiança.',
      owner_response: 'Muito obrigado pela avaliação! Ética biológica e conduta conservadora são os nossos maiores compromissos.',
    },
    {
      author_name: 'Szycie Towarzyskie',
      author_role: 'International Patient',
      rating: 5,
      date_text: '2 anos atrás',
      treatment_tag: 'English Speaking Care',
      comment: 'O Doutor Guilad não é apenas um bom médico, mas também uma boa pessoa. Ele se preocupa com o paciente e me fez sentir confortável. Ele também fala inglês perfeitamente, o que é uma grande vantagem. Recomendo para todos.',
      owner_response: 'Thank you so much! It is a pleasure to welcome international patients and offer high-standard care in English in Pinheiros.',
    },
  ];

  const filteredReviews = filter === 'todos' 
    ? displayReviews 
    : displayReviews.filter(r => (r.treatment_tag || '').toLowerCase().includes(filter.toLowerCase()));

  return (
    <section className="py-20 sm:py-28 bg-[#f8faff] border-t border-blue-100/70 relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Google Header Badge & Section Headline */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-full bg-white border border-blue-200/80 shadow-sm mb-4">
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-xs font-black text-slate-900 tracking-tight">5.0 no Google</span>
            <span className="text-slate-400 text-xs">|</span>
            <span className="text-xs font-medium text-slate-600">Avaliações Verificadas</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            O que nossos pacientes dizem sobre o Dr. Guilad Weil
          </h2>
          <p className="mt-3 text-base text-slate-600 max-w-2xl mx-auto">
            Mais de 30 anos de prática clínica construída com rigor técnico, honestidade diagnóstica, consultório acolhedor e atendimento humanizado em Pinheiros.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {[
              { id: 'todos', label: 'Todas as avaliações' },
              { id: 'bruxismo', label: 'Bruxismo & Placas' },
              { id: 'laser', label: 'Laserterapia & Herpes' },
              { id: 'geral', label: 'Clínica Geral & Ética' },
              { id: 'english', label: 'English-Speaking' },
            ].map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  filter === f.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {filteredReviews.map((r, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-7 border border-blue-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                {/* Author Info & Rating */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-white flex items-center justify-center font-bold text-base shadow-sm">
                      {r.author_name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base leading-tight group-hover:text-blue-600 transition-colors">
                        {r.author_name}
                      </h4>
                      <div className="flex items-center space-x-2 mt-0.5">
                        <span className="text-[11px] text-slate-500 font-medium">{r.author_role || 'Paciente'}</span>
                        <span className="text-slate-300 text-[10px]">•</span>
                        <span className="text-[11px] text-slate-400">{r.date_text}</span>
                      </div>
                    </div>
                  </div>

                  {r.treatment_tag && (
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                      {r.treatment_tag}
                    </span>
                  )}
                </div>

                {/* Stars */}
                <div className="flex items-center space-x-1 mb-3.5">
                  {[...Array(r.rating || 5)].map((_, starIdx) => (
                    <Star key={starIdx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Patient Comment */}
                <p className="text-slate-700 text-sm leading-relaxed mb-5 font-normal">
                  "{r.comment}"
                </p>
              </div>

              {/* Owner Response Box */}
              {r.owner_response && (
                <div className="mt-4 pt-4 border-t border-slate-100 bg-[#f8faff] -mx-7 -mb-7 p-5 rounded-b-3xl">
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 mb-1.5">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    <span>Resposta do Dr. Guilad Weil (Proprietário):</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    "{r.owner_response}"
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Actions: Google Profile link & WhatsApp CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <a
            href="https://g.page/r/CQEwrCOG2m2REBM"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3.5 rounded-full border border-blue-300 bg-white hover:bg-blue-50 text-slate-800 font-bold text-xs uppercase tracking-wider transition-all shadow-sm group"
          >
            <span>Ver perfil e avaliações no Google Maps</span>
            <ExternalLink className="w-4 h-4 ml-2 text-blue-600 group-hover:translate-x-0.5 transition-transform" />
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill-blue flex items-center space-x-2 group"
          >
            <span>Agendar sua Consulta pelo WhatsApp</span>
            <ToothIcon className="w-4 h-4 ml-1 fill-white group-hover:scale-110 transition-transform" />
          </a>
        </div>

      </div>
    </section>
  );
}
