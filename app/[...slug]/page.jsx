import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { getPageBySlug, getSettings } from '../../lib/db';
import FaqAccordion from '../../components/FaqAccordion';
import ContactSection from '../../components/ContactSection';
import ToothIcon from '../../components/ToothIcon';
import { MessageCircle, Phone, CheckCircle2 } from 'lucide-react';

export async function generateMetadata({ params, searchParams }) {
  const slugPath = '/' + (params.slug || []).join('/');
  const isPreview = searchParams?.preview === 'true';
  const page = getPageBySlug(slugPath, isPreview);

  if (!page || page.redirect) return {};

  return {
    title: page.seo_title,
    description: page.seo_description,
    keywords: page.seo_keywords,
    alternates: { canonical: slugPath },
    openGraph: {
      title: page.seo_title,
      description: page.seo_description,
      url: slugPath,
      siteName: 'GW Odontologia',
      locale: 'pt_BR',
      type: 'article',
    },
  };
}

export const dynamic = 'force-dynamic';

export default function DynamicSlugPage({ params, searchParams }) {
  const slugPath = '/' + (params.slug || []).join('/');
  const isPreview = searchParams?.preview === 'true';
  const pageResult = getPageBySlug(slugPath, isPreview);

  if (!pageResult) {
    notFound();
  }

  // Handle automatic redirect if slug changed
  if (pageResult.redirect) {
    redirect(pageResult.redirect);
  }

  const { content } = pageResult;
  const settings = getSettings();
  const whatsappNumber = settings?.whatsapp_raw || '5511975532110';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Olá, Dr. Guilad! Vim pelo site da GW Odontologia e gostaria de saber mais sobre ${pageResult.name}.`)}`;

  return (
    <div className="bg-white">
      {/* Draft Preview Notice if previewing */}
      {isPreview && (
        <div className="bg-amber-500 text-white text-xs font-bold py-2 px-4 text-center sticky top-0 z-50 shadow">
          MODO DE PRÉ-VISUALIZAÇÃO DE RASCUNHO — Esta versão ainda não foi publicada ao público.
        </div>
      )}

      {/* Hero */}
      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-20 bg-gradient-to-b from-brand-blue-soft/40 via-white to-white border-b border-brand-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          {content?.hero?.tag && (
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-brand-blue-soft text-brand-navy border border-brand-blue/20 text-xs font-semibold mb-6">
              {content.hero.tag}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-navy tracking-tight leading-tight mb-6">
            {content?.hero?.title || pageResult.name}
          </h1>
          {content?.hero?.subtitle && (
            <p className="text-base sm:text-lg text-brand-text-body leading-relaxed mb-8">
              {content.hero.subtitle}
            </p>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill-blue flex items-center space-x-2 group w-full sm:w-auto"
            >
              <span>{content?.hero?.cta_primary_text || 'Falar pelo WhatsApp'}</span>
              <ToothIcon className="w-4 h-4 ml-1 fill-white group-hover:scale-110 transition-transform" />
            </a>
            <a
              href={`tel:${settings?.phone_fixo?.replace(/[^0-9]/g, '') || '1130813789'}`}
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-full border border-slate-300 hover:border-blue-600 bg-white text-slate-800 font-bold text-xs uppercase tracking-wider transition-all hover:bg-slate-50 shadow-sm"
            >
              <Phone className="w-4 h-4 mr-2 text-slate-500" />
              <span>Ligar: {settings?.phone_fixo || '(11) 3081-3789'}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Generic Dynamic Sections Rendering */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {content?.body_paragraphs && content.body_paragraphs.map((p, i) => (
            <p key={i} className="text-base text-brand-text-body leading-relaxed">
              {p}
            </p>
          ))}

          {content?.items && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
              {content.items.map((it, i) => (
                <div key={i} className="p-6 rounded-xl border border-brand-border bg-brand-surface">
                  <h3 className="text-lg font-bold text-brand-navy mb-2">{it.title}</h3>
                  <p className="text-sm text-brand-text-body">{it.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ if present */}
      {content?.faq && (
        <FaqAccordion
          items={content.faq}
          title={`Dúvidas sobre ${pageResult.name}`}
        />
      )}

      {/* Contact */}
      <ContactSection settings={settings} />
    </div>
  );
}
