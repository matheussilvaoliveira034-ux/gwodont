import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  Moon, 
  Sun, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  MessageCircle, 
  Phone, 
  Sparkles,
  Info
} from 'lucide-react';
import { getPageBySlug, getSettings, getAllReviews } from '../../lib/db';
import FaqAccordion from '../../components/FaqAccordion';
import ContactSection from '../../components/ContactSection';
import ToothIcon from '../../components/ToothIcon';
import PageHeaderBanner from '../../components/PageHeaderBanner';
import GoogleReviewsSection from '../../components/GoogleReviewsSection';

export async function generateMetadata() {
  const page = getPageBySlug('/bruxismo');
  if (!page) return {};
  return {
    title: page.seo_title,
    description: page.seo_description,
    keywords: page.seo_keywords,
    alternates: {
      canonical: '/bruxismo',
    },
    openGraph: {
      title: page.seo_title,
      description: page.seo_description,
      url: '/bruxismo',
      siteName: 'GW Odontologia',
      locale: 'pt_BR',
      type: 'article',
    },
  };
}

export const dynamic = 'force-dynamic';

export default function BruxismoPage() {
  const page = getPageBySlug('/bruxismo');
  const settings = getSettings();
  const reviews = getAllReviews();

  if (!page) {
    notFound();
  }

  const { content } = page;
  const whatsappNumber = settings?.whatsapp_raw || '5511975532110';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Olá, Dr. Guilad! Vim pela página de Bruxismo da GW Odontologia e gostaria de agendar uma avaliação.')}`;

  return (
    <div className="bg-white">
      {/* 1. HERO BANNER */}
      <PageHeaderBanner
        category="Tratamento Especializado"
        badge="BRUXISMO & DORES OROFACIAIS EM PINHEIROS"
        titleHighlight="Tratamento de Bruxismo"
        titleRest="e Dores Orofaciais em Pinheiros"
        subtitle={content?.hero?.subtitle || 'Apertamento e ranger de dentes causam desgastes severos, fraturas e dores de cabeça tensionais. Saiba como o Dr. Guilad Weil atua no diagnóstico do bruxismo noturno e diurno.'}
        whatsappUrl={whatsappUrl}
        phone={settings?.phone_fixo || '(11) 3081-3789'}
        ctaText="Falar com Dr. Guilad pelo WhatsApp"
        breadcrumbs={[
          { label: 'Tratamentos', href: '/#tratamentos' },
          { label: 'Bruxismo & Dores Orofaciais' },
        ]}
      />

      {/* Scientific Notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-8 relative z-20">
        <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200/80 text-xs text-slate-700 flex items-start space-x-3 shadow-sm">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed font-medium">
            {content?.hero?.notice || 'Importante: O bruxismo é uma condição neuromuscular que não possui cura definitiva comprovada; o tratamento visa proteger os dentes, aliviar a dor e restaurar o equilíbrio muscular.'}
          </p>
        </div>
      </div>

      {/* 2. ENTENDENDO O BRUXISMO (SONO VS VIGÍLIA) */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-semibold text-brand-blue uppercase tracking-widest bg-brand-blue-soft px-3 py-1 rounded-full">
                {content?.understanding_section?.tag || 'O QUE É O BRUXISMO'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy tracking-tight">
                {content?.understanding_section?.title || 'Entenda os mecanismos do apertamento e rangimento dental'}
              </h2>

              <div className="space-y-4 text-sm sm:text-base text-brand-text-body leading-relaxed">
                {content?.understanding_section?.paragraphs?.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              {/* Distinção clínica Visual */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="p-5 rounded-xl border border-slate-200 bg-brand-surface">
                  <div className="flex items-center space-x-2 text-brand-navy font-bold text-base mb-2">
                    <Moon className="w-5 h-5 text-brand-blue" />
                    <span>Bruxismo do Sono</span>
                  </div>
                  <p className="text-xs text-brand-text-body leading-relaxed">
                    Ocorre de forma inconsciente à noite. Predomínio de <strong>ranger os dentes</strong>. Relacionado a microdespertares cerebrais, respiração e arquitetura do sono.
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-slate-200 bg-brand-surface">
                  <div className="flex items-center space-x-2 text-brand-navy font-bold text-base mb-2">
                    <Sun className="w-5 h-5 text-amber-600" />
                    <span>Bruxismo em Vigília</span>
                  </div>
                  <p className="text-xs text-brand-text-body leading-relaxed">
                    Ocorre durante o dia enquanto acordado. Predomínio de <strong>apertamento silencioso</strong> ou encostamento contínuo sob estresse ou concentração.
                  </p>
                </div>
              </div>
            </div>

            {/* Sinais e Sintomas (5 cols) */}
            <div className="lg:col-span-5">
              <div className="bg-brand-surface p-7 rounded-2xl border border-brand-border shadow-card-subtle">
                <div className="flex items-center space-x-2 text-amber-700 font-bold text-sm uppercase tracking-wider mb-4">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Sinais de Alerta Mais Comuns</span>
                </div>
                <h3 className="text-xl font-bold text-brand-navy mb-4">
                  Quando procurar avaliação clínica?
                </h3>
                <ul className="space-y-3">
                  {content?.understanding_section?.symptoms?.map((s, i) => (
                    <li key={i} className="flex items-start text-xs sm:text-sm text-brand-text-body">
                      <CheckCircle2 className="w-4 h-4 text-brand-blue mr-2.5 flex-shrink-0 mt-0.5" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 pt-6 border-t border-slate-200">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center px-4 py-3 rounded-xl bg-brand-navy text-white text-sm font-semibold shadow hover:bg-brand-blue transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 mr-2 text-brand-whatsapp" />
                    Agendar Avaliação de Bruxismo
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DISPOSITIVOS E TRATAMENTOS (NTI, LIVA, PLACAS) */}
      <section className="py-16 sm:py-24 bg-brand-surface border-y border-brand-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-semibold text-brand-blue uppercase tracking-widest bg-brand-blue-soft px-3 py-1 rounded-full">
              {content?.devices_section?.tag || 'ABORDAGENS TERAPÊUTICAS CONFIRMADAS'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy mt-3 tracking-tight">
              {content?.devices_section?.title || 'Dispositivos específicos para cada padrão de bruxismo'}
            </h2>
            <p className="mt-3 text-base text-brand-text-body">
              Cada paciente apresenta uma sobrecarga neuromuscular única. O Dr. Guilad Weil ajusta a conduta após exame clínico detalhado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {content?.devices_section?.items?.map((item, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-2xl border border-brand-border shadow-card-subtle hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-brand-blue bg-brand-blue-soft px-3 py-1 rounded-full border border-blue-200">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-brand-navy mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-brand-text-body leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-brand-text-muted">Ajustado individualmente no consultório</span>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-brand-blue hover:text-brand-navy inline-flex items-center"
                  >
                    Tirar dúvida clínica →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PERGUNTAS FREQUENTES EXCLUSIVAS DE BRUXISMO */}
      {content?.faq && (
        <FaqAccordion
          items={content.faq}
          title="Perguntas Frequentes sobre Bruxismo"
          subtitle="Tire suas dúvidas sobre placas, dores de cabeça tensionais e proteção dental."
        />
      )}

      {/* 5. AVALIAÇÕES GOOGLE VERIFICADAS */}
      <GoogleReviewsSection reviews={reviews} settings={settings} />

      {/* 6. CONTATO E LOCALIZAÇÃO */}
      <ContactSection settings={settings} />
    </div>
  );
}
