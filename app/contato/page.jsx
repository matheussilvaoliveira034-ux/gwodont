import React from 'react';
import { notFound } from 'next/navigation';
import { getPageBySlug, getSettings } from '../../lib/db';
import ContactSection from '../../components/ContactSection';
import FaqAccordion from '../../components/FaqAccordion';

export async function generateMetadata() {
  const page = getPageBySlug('/contato');
  if (!page) return {};
  return {
    title: page.seo_title,
    description: page.seo_description,
    keywords: page.seo_keywords,
    alternates: { canonical: '/contato' },
  };
}

export const dynamic = 'force-dynamic';

export default function ContatoPage() {
  const page = getPageBySlug('/contato');
  const settings = getSettings();
  if (!page) notFound();

  const { content } = page;

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 bg-gradient-to-b from-blue-50/40 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-500 mb-4 inline-block">
            {content?.hero?.tag || 'LOCALIZAÇÃO & ATENDIMENTO'}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
            <span className="text-blue-600 block sm:inline">Entre em Contato</span> e Agende sua Consulta
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {content?.hero?.subtitle || 'Atendimento com horário previamente marcado para garantir atenção exclusiva, pontualidade e dedicação total ao seu cuidado bucal.'}
          </p>
        </div>
      </section>

      {/* Main Contact Section */}
      <ContactSection settings={settings} />

      {/* FAQ */}
      {content?.faq && (
        <FaqAccordion
          items={content.faq}
          title="Dúvidas Frequentes sobre Agendamento e Pagamento"
        />
      )}
    </div>
  );
}
