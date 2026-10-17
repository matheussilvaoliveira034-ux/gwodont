import React from 'react';
import { notFound } from 'next/navigation';
import { ShieldAlert, CheckCircle2, MessageCircle, Phone, CheckCircle, Info } from 'lucide-react';
import { getPageBySlug, getSettings, getAllReviews } from '../../lib/db';
import FaqAccordion from '../../components/FaqAccordion';
import ContactSection from '../../components/ContactSection';
import ToothIcon from '../../components/ToothIcon';
import PageHeaderBanner from '../../components/PageHeaderBanner';
import GoogleReviewsSection from '../../components/GoogleReviewsSection';

export async function generateMetadata() {
  const page = getPageBySlug('/tratamento-de-canal');
  if (!page) return {};
  return {
    title: page.seo_title,
    description: page.seo_description,
    keywords: page.seo_keywords,
    alternates: { canonical: '/tratamento-de-canal' },
  };
}

export const dynamic = 'force-dynamic';

export default function TratamentoDeCanalPage() {
  const page = getPageBySlug('/tratamento-de-canal');
  const settings = getSettings();
  const reviews = getAllReviews();
  if (!page) notFound();

  const { content } = page;
  const whatsappNumber = settings?.whatsapp_raw || '5511975532110';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Olá, Dr. Guilad! Estou com dor e gostaria de avaliar a necessidade de tratamento de canal na GW Odontologia.')}`;

  return (
    <div className="bg-white">
      {/* Hero Banner */}
      <PageHeaderBanner
        category="Endodontia Especializada"
        badge="ENDODONTIA CONSERVADORA EM PINHEIROS"
        titleHighlight="Tratamento de Canal"
        titleRest="Preciso para Salvar o Dente"
        subtitle={content?.hero?.subtitle || 'A intervenção endodôntica remove a infecção no interior do dente, cessa a dor aguda e viabiliza a manutenção da raiz na arcada. Atuação com tecnologia digital e colaboração com especialistas dedicados.'}
        whatsappUrl={whatsappUrl}
        phone={settings?.phone_fixo || '(11) 3081-3789'}
        ctaText="Avaliar Dor de Canal pelo WhatsApp"
        breadcrumbs={[
          { label: 'Tratamentos', href: '/#tratamentos' },
          { label: 'Tratamento de Canal' },
        ]}
      />

      {/* Explanation & Technology */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-semibold text-brand-blue uppercase tracking-widest bg-brand-blue-soft px-3 py-1 rounded-full">
                {content?.explanation_section?.tag || 'QUANDO É NECESSÁRIO'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy tracking-tight">
                {content?.explanation_section?.title || 'A anatomia do canal radicular e as indicações clínicas'}
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-brand-text-body leading-relaxed">
                {content?.explanation_section?.paragraphs?.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="p-7 rounded-2xl border border-brand-border bg-brand-surface shadow-card-subtle">
                <h3 className="text-lg font-bold text-brand-navy mb-4">
                  Diferenciais no Tratamento de Canal
                </h3>
                <div className="space-y-3.5 text-xs sm:text-sm text-brand-text-body">
                  <div className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-brand-blue mr-2.5 flex-shrink-0 mt-0.5" />
                    <span><strong>Radiografia Digital Schick:</strong> visualização instantânea da extensão do canal com mínima radiação.</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-brand-blue mr-2.5 flex-shrink-0 mt-0.5" />
                    <span><strong>Procedimento Confortável:</strong> anestésicos potentes eliminam a sensibilidade durante a instrumentação.</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-brand-blue mr-2.5 flex-shrink-0 mt-0.5" />
                    <span><strong>Colaboração Especializada:</strong> atuação integrada com endodontistas parceiros em casos de canais calcificados ou retratamentos complexos.</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-brand-blue mr-2.5 flex-shrink-0 mt-0.5" />
                    <span><strong>Possibilidade de Sessão Única:</strong> quando não há infecção purulenta ativa, o procedimento pode ser finalizado em uma só visita.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {content?.faq && (
        <FaqAccordion
          items={content.faq}
          title="Dúvidas Frequentes sobre Tratamento de Canal"
        />
      )}

      {/* Reviews */}
      <GoogleReviewsSection reviews={reviews} settings={settings} />

      {/* Contact */}
      <ContactSection settings={settings} />
    </div>
  );
}
