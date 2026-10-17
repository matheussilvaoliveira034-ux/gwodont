import React from 'react';
import { notFound } from 'next/navigation';
import { Heart, CheckCircle2, MessageCircle, Phone, AlertCircle } from 'lucide-react';
import { getPageBySlug, getSettings, getAllReviews } from '../../lib/db';
import FaqAccordion from '../../components/FaqAccordion';
import ContactSection from '../../components/ContactSection';
import ToothIcon from '../../components/ToothIcon';
import PageHeaderBanner from '../../components/PageHeaderBanner';
import GoogleReviewsSection from '../../components/GoogleReviewsSection';

export async function generateMetadata() {
  const page = getPageBySlug('/periodontia');
  if (!page) return {};
  return {
    title: page.seo_title,
    description: page.seo_description,
    keywords: page.seo_keywords,
    alternates: { canonical: '/periodontia' },
  };
}

export const dynamic = 'force-dynamic';

export default function PeriodontiaPage() {
  const page = getPageBySlug('/periodontia');
  const settings = getSettings();
  const reviews = getAllReviews();
  if (!page) notFound();

  const { content } = page;
  const whatsappNumber = settings?.whatsapp_raw || '5511975532110';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Olá, Dr. Guilad! Gostaria de agendar uma avaliação de gengiva e periodontia na GW Odontologia.')}`;

  return (
    <div className="bg-white">
      {/* Hero Banner */}
      <PageHeaderBanner
        category="Saúde Periodontal"
        badge="CUIDADO GENGIVAL & SUPORTE DENTAL EM PINHEIROS"
        titleHighlight="Cuidado Periodontal"
        titleRest="e Saúde dos Tecidos de Suporte"
        subtitle={content?.hero?.subtitle || 'A gengiva, o ligamento periodontal e o osso alveolar formam o suporte de cada dente. A GW Odontologia oferece acompanhamento preventivo e atua em parceria com especialistas periodontistas.'}
        whatsappUrl={whatsappUrl}
        phone={settings?.phone_fixo || '(11) 3081-3789'}
        ctaText="Agendar Avaliação Gengival"
        breadcrumbs={[
          { label: 'Tratamentos', href: '/#tratamentos' },
          { label: 'Periodontia' },
        ]}
      />

      {/* Details & Signs */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-semibold text-brand-blue uppercase tracking-widest bg-brand-blue-soft px-3 py-1 rounded-full">
                {content?.details_section?.tag || 'DIAGNÓSTICO E TERAPIA'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy tracking-tight">
                {content?.details_section?.title || 'Da gengivite à periodontite: a importância do controle bacteriano'}
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-brand-text-body leading-relaxed">
                {content?.details_section?.paragraphs?.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="p-7 rounded-2xl border border-brand-border bg-brand-surface shadow-card-subtle">
                <div className="flex items-center space-x-2 text-red-700 font-bold text-sm uppercase tracking-wider mb-4">
                  <AlertCircle className="w-5 h-5" />
                  <span>Sinais Clínicos de Alerta</span>
                </div>
                <ul className="space-y-3">
                  {content?.details_section?.signs?.map((sign, i) => (
                    <li key={i} className="flex items-start text-xs sm:text-sm text-brand-text-body">
                      <CheckCircle2 className="w-4 h-4 text-brand-blue mr-2.5 flex-shrink-0 mt-0.5" />
                      <span>{sign}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {content?.faq && (
        <FaqAccordion
          items={content.faq}
          title="Perguntas Frequentes sobre Periodontia"
        />
      )}

      {/* Reviews */}
      <GoogleReviewsSection reviews={reviews} settings={settings} />

      {/* Contact */}
      <ContactSection settings={settings} />
    </div>
  );
}
