import React from 'react';
import { notFound } from 'next/navigation';
import { CheckCircle2, MessageCircle, Phone, CheckCircle, ShieldCheck } from 'lucide-react';
import { getPageBySlug, getSettings, getAllReviews } from '../../lib/db';
import FaqAccordion from '../../components/FaqAccordion';
import ContactSection from '../../components/ContactSection';
import ToothIcon from '../../components/ToothIcon';
import PageHeaderBanner from '../../components/PageHeaderBanner';
import GoogleReviewsSection from '../../components/GoogleReviewsSection';

export async function generateMetadata() {
  const page = getPageBySlug('/clinica-geral');
  if (!page) return {};
  return {
    title: page.seo_title,
    description: page.seo_description,
    keywords: page.seo_keywords,
    alternates: { canonical: '/clinica-geral' },
  };
}

export const dynamic = 'force-dynamic';

export default function ClinicaGeralPage() {
  const page = getPageBySlug('/clinica-geral');
  const settings = getSettings();
  const reviews = getAllReviews();
  if (!page) notFound();

  const { content } = page;
  const whatsappNumber = settings?.whatsapp_raw || '5511975532110';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Olá, Dr. Guilad! Gostaria de agendar uma consulta de avaliação clínica geral na GW Odontologia.')}`;

  return (
    <div className="bg-white">
      {/* Hero Banner */}
      <PageHeaderBanner
        category="Tratamento Essencial"
        badge="ODONTOLOGIA CLÍNICA CONSERVADORA EM PINHEIROS"
        titleHighlight="Clínica Geral"
        titleRest="com Foco na Preservação Dental"
        subtitle={content?.hero?.subtitle || 'Cuidados odontológicos fundamentais para preservar a dentição natural ao longo da vida, com diagnóstico rigoroso e sem tratamentos invasivos desnecessários.'}
        whatsappUrl={whatsappUrl}
        phone={settings?.phone_fixo || '(11) 3081-3789'}
        ctaText="Agendar Check-up pelo WhatsApp"
        breadcrumbs={[
          { label: 'Tratamentos', href: '/#tratamentos' },
          { label: 'Clínica Geral' },
        ]}
      />

      {/* Procedures */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy tracking-tight">
              Procedimentos de Clínica Geral Realizados no Consultório
            </h2>
            <p className="mt-2 text-sm text-brand-text-body">
              Atendimento executado com lupa de magnificação, isolamento absoluto e materiais odontológicos biocompatíveis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content?.procedures?.map((proc, i) => (
              <div key={i} className="p-7 rounded-2xl border border-brand-border bg-brand-surface/40 hover:bg-brand-surface hover:shadow-card-subtle transition-all">
                <div className="w-10 h-10 rounded-lg bg-brand-blue-soft text-brand-navy flex items-center justify-center font-bold text-sm mb-4">
                  <CheckCircle className="w-5 h-5 text-brand-blue" />
                </div>
                <h3 className="text-lg font-bold text-brand-navy mb-2.5">{proc.title}</h3>
                <p className="text-xs sm:text-sm text-brand-text-body leading-relaxed">{proc.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      {content?.faq && (
        <FaqAccordion
          items={content.faq}
          title="Dúvidas sobre Clínica Geral e Prevenção"
        />
      )}

      {/* Reviews */}
      <GoogleReviewsSection reviews={reviews} settings={settings} />

      {/* Contact */}
      <ContactSection settings={settings} />
    </div>
  );
}
