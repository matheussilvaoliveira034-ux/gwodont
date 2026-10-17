import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  MessageCircle, 
  Phone, 
  Activity, 
  Clock, 
  Info,
  Sparkles
} from 'lucide-react';
import { getPageBySlug, getSettings, getAllReviews } from '../../lib/db';
import FaqAccordion from '../../components/FaqAccordion';
import ContactSection from '../../components/ContactSection';
import ToothIcon from '../../components/ToothIcon';
import PageHeaderBanner from '../../components/PageHeaderBanner';
import GoogleReviewsSection from '../../components/GoogleReviewsSection';

export async function generateMetadata() {
  const page = getPageBySlug('/herpes');
  if (!page) return {};
  return {
    title: page.seo_title,
    description: page.seo_description,
    keywords: page.seo_keywords,
    alternates: {
      canonical: '/herpes',
    },
    openGraph: {
      title: page.seo_title,
      description: page.seo_description,
      url: '/herpes',
      siteName: 'GW Odontologia',
      locale: 'pt_BR',
      type: 'article',
    },
  };
}

export const dynamic = 'force-dynamic';

export default function HerpesPage() {
  const page = getPageBySlug('/herpes');
  const settings = getSettings();
  const reviews = getAllReviews();

  if (!page) {
    notFound();
  }

  const { content } = page;
  const whatsappNumber = settings?.whatsapp_raw || '5511975532110';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Olá, Dr. Guilad! Vim pela página de Herpes e Laserterapia da GW Odontologia e gostaria de verificar disponibilidade de atendimento.')}`;

  return (
    <div className="bg-white">
      {/* 1. HERO BANNER */}
      <PageHeaderBanner
        category="Tratamento Especializado"
        badge="LASERTERAPIA CLÍNICA EM PINHEIROS"
        titleHighlight="Laserterapia para Herpes Labial"
        titleRest="e Aftas em Pinheiros"
        subtitle={content?.hero?.subtitle || 'A aplicação da luz laser (LLLT) acelera a cicatrização tecidual, proporciona alívio rápido do desconforto e contribui para aumentar o intervalo entre eventuais crises.'}
        whatsappUrl={whatsappUrl}
        phone={settings?.phone_fixo || '(11) 3081-3789'}
        ctaText="Consultar Disponibilidade pelo WhatsApp"
        breadcrumbs={[
          { label: 'Tratamentos', href: '/#tratamentos' },
          { label: 'Laserterapia & Herpes Labial' },
        ]}
      />

      {/* Scientific Notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-8 relative z-20">
        <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200/80 text-xs text-slate-700 flex items-start space-x-3 shadow-sm">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed font-medium">
            {content?.hero?.notice || 'Informação ética: O vírus HSV-1 permanece latente no organismo e nenhum tratamento erradica o vírus permanentemente. A laserterapia atua no controle biológico do surto ativo e na bioestimulação celular.'}
          </p>
        </div>
      </div>

      {/* 2. O CICLO EVOLUTIVO DA LESÃO */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto mb-12">
            <span className="text-xs font-semibold text-brand-blue uppercase tracking-widest bg-brand-blue-soft px-3 py-1 rounded-full">
              {content?.understanding_section?.tag || 'EVOLUÇÃO DO CICLO CLÍNICO'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy mt-3 tracking-tight">
              {content?.understanding_section?.title || 'O ciclo do herpes simples labial e o momento ideal de intervenção'}
            </h2>
            <div className="mt-4 space-y-3 text-sm sm:text-base text-brand-text-body leading-relaxed">
              {content?.understanding_section?.paragraphs?.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>

          {/* 4 Fases Clínicas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-6 rounded-xl border border-slate-200 bg-brand-surface">
              <span className="text-xs font-bold text-brand-blue uppercase tracking-wider block mb-2">Fase 1</span>
              <h3 className="text-base font-bold text-brand-navy mb-1.5">Pródromo</h3>
              <p className="text-xs text-brand-text-body leading-relaxed">
                Formigamento, coceira e calor no lábio. <strong>Melhor momento para o laser</strong>, podendo abortar a vesícula.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-brand-surface">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block mb-2">Fase 2</span>
              <h3 className="text-base font-bold text-brand-navy mb-1.5">Vesículas</h3>
              <p className="text-xs text-brand-text-body leading-relaxed">
                Pequenas bolhas com líquido claro e desconforto agudo. O laser age reduzindo a inflamação e a dor.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-brand-surface">
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider block mb-2">Fase 3</span>
              <h3 className="text-base font-bold text-brand-navy mb-1.5">Ulceração</h3>
              <p className="text-xs text-brand-text-body leading-relaxed">
                Rompimento das bolhas, ferida aberta dolorosa. Aceleração da reepitelização com fotobiomodulação.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-brand-surface">
              <span className="text-xs font-bold text-green-700 uppercase tracking-wider block mb-2">Fase 4</span>
              <h3 className="text-base font-bold text-brand-navy mb-1.5">Cicatrização</h3>
              <p className="text-xs text-brand-text-body leading-relaxed">
                Formação da crosta protetora e reparação tecidual completa sem marcas permanentes na pele labial.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. A AÇÃO DO LASER LLLT & BENEFÍCIOS */}
      <section className="py-16 sm:py-24 bg-brand-surface border-y border-brand-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-semibold text-brand-blue uppercase tracking-widest bg-brand-blue-soft px-3 py-1 rounded-full">
                {content?.laser_section?.tag || 'A AÇÃO DO LASER (LLLT)'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy tracking-tight">
                {content?.laser_section?.title || 'Como a fotobiomodulação atua nas lesões herpéticas e aftas'}
              </h2>

              <div className="space-y-4 text-sm sm:text-base text-brand-text-body leading-relaxed">
                {content?.laser_section?.paragraphs?.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>

            {/* Outras Indicações do Laser Clínico (5 cols) */}
            <div className="lg:col-span-5">
              <div className="bg-white p-7 rounded-2xl border border-brand-border shadow-card-subtle">
                <div className="flex items-center space-x-2 text-brand-navy font-bold text-sm uppercase tracking-wider mb-4">
                  <Sparkles className="w-5 h-5 text-brand-blue" />
                  <span>Outras Aplicações do Laser no Consultório</span>
                </div>
                <p className="text-xs text-brand-text-muted mb-4">
                  A tecnologia de laser de baixa intensidade da GW Odontologia também é indicada para:
                </p>
                <ul className="space-y-3">
                  {content?.laser_section?.indications?.map((ind, i) => (
                    <li key={i} className="flex items-start text-xs sm:text-sm text-brand-text-body">
                      <CheckCircle2 className="w-4 h-4 text-brand-blue mr-2.5 flex-shrink-0 mt-0.5" />
                      <span>{ind}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 pt-6 border-t border-slate-100">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center px-4 py-3 rounded-xl bg-brand-navy text-white text-sm font-semibold shadow hover:bg-brand-blue transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 mr-2 text-brand-whatsapp" />
                    Solicitar Sessão com Laser
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PERGUNTAS FREQUENTES SOBRE HERPES E LASER */}
      {content?.faq && (
        <FaqAccordion
          items={content.faq}
          title="Perguntas Frequentes sobre Herpes e Laserterapia"
          subtitle="Orientações clínicas transparentes sobre o procedimento com laser."
        />
      )}

      {/* 5. AVALIAÇÕES GOOGLE VERIFICADAS */}
      <GoogleReviewsSection reviews={reviews} settings={settings} />

      {/* 6. CONTATO E LOCALIZAÇÃO */}
      <ContactSection settings={settings} />
    </div>
  );
}
