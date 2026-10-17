import React from 'react';
import { notFound } from 'next/navigation';
import { Globe, CheckCircle2, MessageCircle, Phone, MapPin, ShieldCheck, Clock } from 'lucide-react';
import { getPageBySlug, getSettings, getAllReviews } from '../../lib/db';
import FaqAccordion from '../../components/FaqAccordion';
import ContactSection from '../../components/ContactSection';
import ToothIcon from '../../components/ToothIcon';
import PageHeaderBanner from '../../components/PageHeaderBanner';
import GoogleReviewsSection from '../../components/GoogleReviewsSection';

export async function generateMetadata() {
  const page = getPageBySlug('/english');
  if (!page) return {};
  return {
    title: page.seo_title,
    description: page.seo_description,
    keywords: page.seo_keywords,
    alternates: { canonical: '/english' },
  };
}

export const dynamic = 'force-dynamic';

export default function EnglishPage() {
  const page = getPageBySlug('/english');
  const settings = getSettings();
  const reviews = getAllReviews();
  if (!page) notFound();

  const { content } = page;
  const whatsappNumber = settings?.whatsapp_raw || '5511975532110';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello Dr. Guilad! I'm reaching out through the GW Odontologia website to inquire about a dental appointment in English.")}`;

  return (
    <div className="bg-white">
      {/* Hero Banner in English */}
      <PageHeaderBanner
        category="International Dental Care"
        badge="ENGLISH-SPEAKING PRACTICE IN PINHEIROS, SÃO PAULO"
        titleHighlight="English-Speaking Dental Care"
        titleRest="in Pinheiros, São Paulo"
        subtitle={content?.hero?.subtitle || 'Choosing the right healthcare professional in a foreign country requires trust and clear communication. Dr. Guilad Weil offers over 30 years of evidence-based dentistry in a clean, modern clinic in Pinheiros.'}
        whatsappUrl={whatsappUrl}
        phone={settings?.phone_fixo || '+55 (11) 3081-3789'}
        ctaText="Chat in English on WhatsApp"
        breadcrumbs={[
          { label: 'Services', href: '/#tratamentos' },
          { label: 'English-Speaking Practice' },
        ]}
      />

      {/* Welcome & Services Overview */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-semibold text-brand-blue uppercase tracking-widest bg-brand-blue-soft px-3 py-1 rounded-full">
                {content?.welcome_section?.tag || 'HELLO AND WELCOME'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy tracking-tight">
                {content?.welcome_section?.title || 'Comprehensive general dentistry with clear, fluent communication'}
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-brand-text-body leading-relaxed">
                {content?.welcome_section?.paragraphs?.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="p-7 rounded-2xl border border-brand-border bg-brand-surface shadow-card-subtle">
                <h3 className="text-lg font-bold text-brand-navy mb-4">
                  Clinical Services Offered
                </h3>
                <ul className="space-y-2.5">
                  {content?.welcome_section?.services_list?.map((s, i) => (
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
                    Book an Evaluation in English
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Details for International Visitors */}
      <section className="py-14 bg-brand-surface border-y border-brand-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <span className="text-xs font-semibold text-brand-blue uppercase tracking-widest bg-brand-blue-soft px-3 py-1 rounded-full">
              PRACTICE LOCATION
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy mt-2">
              Condomínio Atrium — Pinheiros, São Paulo
            </h2>
            <p className="text-sm text-brand-text-body mt-2">
              Rua Cristiano Viana, 401, Suite 1311 · Pinheiros, São Paulo, SP, 05411-000
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-center">
            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
              <MapPin className="w-6 h-6 text-brand-blue mx-auto mb-2" />
              <h4 className="font-bold text-sm text-brand-navy">Central Pinheiros</h4>
              <p className="text-xs text-slate-600 mt-1">A safe, walkable neighborhood with immediate access to Avenida Paulista and Jardins.</p>
            </div>
            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
              <Clock className="w-6 h-6 text-brand-blue mx-auto mb-2" />
              <h4 className="font-bold text-sm text-brand-navy">Metro Stations</h4>
              <p className="text-xs text-slate-600 mt-1">10-minute walk from Clínicas Station (Green Line) and Oscar Freire Station (Yellow Line).</p>
            </div>
            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
              <ShieldCheck className="w-6 h-6 text-brand-blue mx-auto mb-2" />
              <h4 className="font-bold text-sm text-brand-navy">Valet Parking</h4>
              <p className="text-xs text-slate-600 mt-1">Convenient paid parking with valet service located directly within the building.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ in English */}
      {content?.faq && (
        <FaqAccordion
          items={content.faq}
          title="Frequently Asked Questions (FAQ)"
          subtitle="Clear answers for international patients, insurance reimbursement, and appointments."
        />
      )}

      {/* Patient Reviews in English / Portuguese */}
      <GoogleReviewsSection reviews={reviews} settings={settings} />

      {/* Contact Section */}
      <ContactSection settings={settings} />
    </div>
  );
}
