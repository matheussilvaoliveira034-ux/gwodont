import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  Shield, 
  Activity, 
  Award, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Moon, 
  Zap, 
  CheckCircle, 
  ShieldAlert, 
  Heart, 
  Globe,
  Sparkles,
  Phone,
  UserCheck,
  Check
} from 'lucide-react';
import { getPageBySlug, getSettings, getAllReviews } from '../lib/db';
import ToothIcon from '../components/ToothIcon';
import MarqueeTicker from '../components/MarqueeTicker';
import ClinicalEvaluationSection from '../components/ClinicalEvaluationSection';
import ToothDiagramSection from '../components/ToothDiagramSection';
import WhyChooseUsSection from '../components/WhyChooseUsSection';
import FaqAccordion from '../components/FaqAccordion';
import ContactSection from '../components/ContactSection';
import GoogleReviewsSection from '../components/GoogleReviewsSection';

export async function generateMetadata() {
  const page = getPageBySlug('/');
  if (!page) return {};
  return {
    title: page.seo_title,
    description: page.seo_description,
    keywords: page.seo_keywords,
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: page.seo_title,
      description: page.seo_description,
      url: '/',
      siteName: 'GW Odontologia',
      locale: 'pt_BR',
      type: 'website',
    },
  };
}

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const page = getPageBySlug('/');
  const settings = getSettings();
  const reviews = getAllReviews();

  if (!page) {
    notFound();
  }

  const { content } = page;
  const whatsappNumber = settings?.whatsapp_raw || '5511975532110';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Olá, Dr. Guilad! Vim pelo site da GW Odontologia e gostaria de agendar uma consulta.')}`;

  const iconMap = {
    Activity: Activity,
    Shield: Shield,
    Award: Award,
    Clock: Clock,
    Moon: Moon,
    Zap: Zap,
    CheckCircle: CheckCircle,
    ShieldAlert: ShieldAlert,
    Heart: Heart,
    Globe: Globe,
  };

  return (
    <div className="bg-white">
      {/* 1. HERO SECTION - Estilo Odontocenter na Identidade Azul GW Odontologia */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 bg-gradient-to-b from-blue-50/40 via-white to-white">
        {/* Ambient radial glow */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Eyebrow Tag */}
              <div className="inline-block">
                <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-slate-500">
                  {content?.hero?.tag || 'CUIDADO ODONTOLÓGICO ESPECIALIZADO EM PINHEIROS'}
                </span>
              </div>

              {/* Main Two-Tone Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                {content?.hero?.title_highlight ? (
                  <>
                    <span className="text-blue-600 block sm:inline">{content.hero.title_highlight} </span>
                    {content.hero.title_rest || ''}
                  </>
                ) : content?.hero?.title ? (
                  content.hero.title
                ) : (
                  <>
                    <span className="text-blue-600 block sm:inline">Tratamento de Bruxismo</span> e Clínica Geral em Pinheiros
                  </>
                )}
              </h1>

              {/* Body Text */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                {content?.hero?.subtitle || 'Na GW Odontologia, você conta com atendimento individualizado do Dr. Guilad Weil (USP, +30 anos de experiência). Foco absoluto na saúde bucal, no alívio de dores orofaciais e na preservação da função mastigatória.'}
              </p>

              {/* Action Pill Button */}
              <div className="pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pill-blue flex items-center space-x-2 group w-full sm:w-auto"
                >
                  <span>{content?.hero?.cta_primary_text || 'AGENDAR AVALIAÇÃO'}</span>
                  <ToothIcon className="w-4 h-4 ml-1 fill-white group-hover:scale-110 transition-transform" />
                </a>
              </div>

              {/* Microcopy disclaimer */}
              <p className="text-xs text-slate-500 flex items-center pt-1 font-medium">
                <span className="text-slate-400 font-bold mr-1.5">✕</span>
                {content?.hero?.disclaimer || 'Atendimento particular individualizado (não atendemos SUS nem convênios).'}
              </p>
            </div>

            {/* Right Hero Visual / Doctor's Photo in Head (5 cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Glow ring */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-3xl blur-2xl opacity-25 transform rotate-2"></div>
                
                {/* Doctor's Photo Frame */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 aspect-[3/4] sm:aspect-[4/5] max-h-[520px] w-full">
                  <img
                    src="/images/dr-guilad-weil.jpg"
                    alt="Dr. Guilad Weil — Cirurgião-Dentista USP"
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Floating Glassmorphism Badge */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-blue-100/80 flex items-center space-x-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white flex items-center justify-center font-black text-base flex-shrink-0 shadow-md shadow-blue-500/25 border border-blue-400/30">
                      GW
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-base leading-tight">Dr. Guilad Weil</h3>
                      <p className="text-xs text-blue-700 font-bold">Cirurgião-Dentista · USP</p>
                      <p className="text-[11px] text-slate-500 font-medium">Mais de 30 anos de prática clínica em Pinheiros</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. TICKER BAR - Faixa Marquee Contínua no Estilo Odontocenter em Azul Marinho */}
      <MarqueeTicker />

      {/* 3. AVALIAÇÃO CLÍNICA COMPLETA */}
      <ClinicalEvaluationSection settings={settings} data={content?.clinical_evaluation} />

      {/* 4. DIAGRAMA ANATÔMICO COM O DENTE CENTRAL E LINHAS DE CHAMADA */}
      <ToothDiagramSection data={content?.tooth_diagram} />

      {/* 5. POR QUE ESCOLHER A GW ODONTOLOGIA */}
      <WhyChooseUsSection settings={settings} data={content?.why_choose_us} />

      {/* 6. PÁGINAS INDEPENDENTES DE TRATAMENTOS */}
      <section className="py-20 sm:py-28 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold text-blue-600 uppercase tracking-[0.2em] bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
              {content?.services_section?.tag || 'ÁREAS DE ATUAÇÃO CONFIRMADAS'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
              {content?.services_section?.title || 'Tratamentos clínicos e páginas exclusivas'}
            </h2>
            <p className="mt-3 text-base text-slate-600">
              {content?.services_section?.subtitle || 'Cada área possui sua página independente com informações clínicas transparentes.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content?.services_section?.cards?.map((card, i) => {
              const IconComponent = iconMap[card.icon] || CheckCircle2;
              return (
                <div
                  key={i}
                  className="bg-[#f8faff] hover:bg-[#edf4ff] rounded-3xl border border-blue-100/80 p-8 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group transform hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white p-3 flex items-center justify-center shadow-md shadow-blue-500/20">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      {card.badge && (
                        <span className="text-[11px] font-bold text-blue-700 bg-blue-100/70 px-3 py-1 rounded-full">
                          {card.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-extrabold text-slate-900 mb-2.5 group-hover:text-blue-600 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-6">
                      {card.description}
                    </p>
                  </div>

                  <Link
                    href={card.slug}
                    className="inline-flex items-center text-sm font-bold text-blue-600 group-hover:text-blue-800 pt-4 border-t border-blue-100/70 transition-colors"
                  >
                    <span>Acessar página dedicada</span>
                    <ArrowRight className="w-4 h-4 ml-1.5 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. SOBRE O DR. GUILAD WEIL */}
      <section className="py-20 sm:py-28 bg-[#f8faff] border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Clinical Card Badge & Visual Credential (5 cols) */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl border border-blue-100 p-8 sm:p-10 shadow-lg shadow-blue-900/5 relative overflow-hidden">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 text-white flex items-center justify-center text-2xl font-black mb-6 shadow-md shadow-blue-500/25">
                  GW
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Dr. Guilad Weil</h3>
                <p className="text-sm font-bold text-blue-600 mt-1">Cirurgião-Dentista · USP</p>
                <p className="text-xs text-slate-500 mt-0.5">Clínica Geral · Diagnóstico & Função Mastigatória</p>

                <div className="mt-6 pt-6 border-t border-slate-100 space-y-3.5">
                  <div className="flex items-start space-x-3 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Graduação pela Faculdade de Odontologia da Universidade de São Paulo (USP)</span>
                  </div>
                  <div className="flex items-start space-x-3 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Mais de 30 anos de atuação contínua em consultório próprio em Pinheiros</span>
                  </div>
                  <div className="flex items-start space-x-3 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Atendimento individualizado em Português, Inglês e Hebraico</span>
                  </div>
                  <div className="flex items-start space-x-3 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Colaboração com especialistas para Endodontia e Periodontia</span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    Local de Atendimento
                  </span>
                  <span className="text-sm font-extrabold text-slate-900 block">
                    Condomínio Atrium · Pinheiros, SP
                  </span>
                </div>
              </div>
            </div>

            {/* Text description (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-extrabold text-blue-600 uppercase tracking-[0.2em] bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
                {content?.about_doctor?.tag || 'SOBRE O PROFISSIONAL'}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                {content?.about_doctor?.title || 'Dr. Guilad Weil — Cirurgião-Dentista formado pela USP'}
              </h2>
              
              <div className="space-y-4 text-base text-slate-600 leading-relaxed">
                {content?.about_doctor?.paragraphs?.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              {content?.about_doctor?.credentials && (
                <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {content.about_doctor.credentials.map((c, i) => (
                    <div key={i} className="flex items-center space-x-2.5 text-xs sm:text-sm font-medium text-slate-800 bg-white py-2.5 px-3.5 rounded-xl border border-slate-200/80 shadow-sm">
                      <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0"></div>
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 8. PERGUNTAS FREQUENTES */}
      {content?.faq && (
        <FaqAccordion
          items={content.faq}
          title="Dúvidas Frequentes sobre o Atendimento"
          subtitle="Esclarecimentos transparentes sobre a prática clínica e consultas com o Dr. Guilad Weil."
        />
      )}

      {/* 9. AVALIAÇÕES GOOGLE VERIFICADAS */}
      <GoogleReviewsSection reviews={reviews} settings={settings} />

      {/* 10. CONTATO, MAPA E LOCALIZAÇÃO */}
      <ContactSection settings={settings} />
    </div>
  );
}
