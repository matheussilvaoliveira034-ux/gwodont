import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, User, ArrowRight, BookOpen, ShieldCheck, Tag } from 'lucide-react';
import { getAllBlogPosts, getSettings, getAllReviews } from '../../lib/db';
import PageHeaderBanner from '../../components/PageHeaderBanner';
import GoogleReviewsSection from '../../components/GoogleReviewsSection';
import ContactSection from '../../components/ContactSection';
import ToothIcon from '../../components/ToothIcon';

export const metadata = {
  title: 'Blog Clínico & Artigos Científicos | Dr. Guilad Weil — GW Odontologia',
  description: 'Artigos clínicos, orientações e artigos informativos sobre bruxismo, laserterapia, prevenção dental e saúde bucal pelo Dr. Guilad Weil (USP).',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Blog Clínico & Artigos Científicos | Dr. Guilad Weil',
    description: 'Orientações clínicas transparentes e artigos informativos sobre odontologia biológica e tratamentos em Pinheiros.',
    url: '/blog',
    siteName: 'GW Odontologia',
    locale: 'pt_BR',
    type: 'website',
  },
};

export const dynamic = 'force-dynamic';

export default function BlogListingPage() {
  const posts = getAllBlogPosts(true); // only published
  const settings = getSettings();
  const reviews = getAllReviews();

  const whatsappNumber = settings?.whatsapp_raw || '5511975532110';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Olá, Dr. Guilad! Li os artigos do seu blog e gostaria de agendar uma consulta.')}`;

  return (
    <div className="bg-white">
      {/* 1. HEADER BANNER */}
      <PageHeaderBanner
        category="Publicações Clínicas"
        badge="CONHECIMENTO CIENTÍFICO E ORIENTAÇÃO AO PACIENTE"
        titleHighlight="Blog Clínico"
        titleRest="e Artigos Odontológicos"
        subtitle="Artigos técnicos, esclarecimentos éticos e guias completos sobre bruxismo, laserterapia e saúde funcional redigidos pelo Dr. Guilad Weil (USP)."
        whatsappUrl={whatsappUrl}
        phone={settings?.phone_fixo || '(11) 3081-3789'}
        ctaText="Falar com Dr. Guilad pelo WhatsApp"
        breadcrumbs={[
          { label: 'Blog & Artigos' },
        ]}
      />

      {/* 2. ARTICLES GRID */}
      <section className="py-16 sm:py-20 bg-slate-50/60 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue-600 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100">
              LEITURAS EM DESTAQUE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
              Informação Odontológica Baseada em Evidências
            </h2>
            <p className="mt-3 text-slate-600 text-base leading-relaxed">
              Sem sensacionalismo ou promessas irreais: esclarecimentos objetivos sobre sintomas, indicações clínicas e cuidados preventivos.
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
              <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-bold text-slate-800 mb-2">Novos artigos em elaboração</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                O Dr. Guilad Weil está preparando novas orientações clínicas fundamentadas. Em breve disponíveis para leitura.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  <div>
                    {/* Cover or Category Card Banner */}
                    <div className="h-44 sm:h-48 bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900 p-6 flex flex-col justify-between text-white relative overflow-hidden">
                      <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-blue-500/20 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500"></div>
                      
                      <div className="flex items-center justify-between relative z-10">
                        <span className="inline-flex items-center text-[11px] font-extrabold uppercase tracking-wider bg-blue-900/80 text-blue-200 px-3 py-1 rounded-full border border-blue-400/30">
                          {post.category || 'Clínica Geral'}
                        </span>
                        <div className="flex items-center text-xs text-blue-200 space-x-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{post.reading_time || '5 min'}</span>
                        </div>
                      </div>

                      <div className="relative z-10">
                        <span className="text-[10px] text-blue-300 font-bold uppercase tracking-widest block mb-1">
                          GW ODONTOLOGIA · PINHEIROS
                        </span>
                        <h4 className="text-sm sm:text-base font-bold text-white line-clamp-2 leading-snug group-hover:text-blue-100 transition-colors">
                          {post.title}
                        </h4>
                      </div>
                    </div>

                    {/* Content Excerpt */}
                    <div className="p-6">
                      <div className="flex items-center space-x-3 text-xs text-slate-500 mb-3">
                        <span className="flex items-center">
                          <User className="w-3.5 h-3.5 mr-1 text-blue-600" />
                          {post.author || 'Dr. Guilad Weil'}
                        </span>
                        <span>•</span>
                        <span className="flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                          {post.published_at ? new Date(post.published_at).toLocaleDateString('pt-BR') : 'Recente'}
                        </span>
                      </div>

                      <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer Link */}
                  <div className="px-6 pb-6 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-blue-600 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center">
                      Ler artigo completo
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-600 hover:text-white transition-colors"
                    >
                      Acessar
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Quick Notice */}
          <div className="mt-14 p-6 rounded-2xl bg-white border border-blue-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-start space-x-3">
              <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-slate-900">Compromisso com o Código de Ética Odontológica</h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  As publicações deste blog têm caráter estritamente educativo e orientativo. Não substituem o diagnóstico presencial realizado no consultório.
                </p>
              </div>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill-blue flex items-center space-x-2 text-xs flex-shrink-0 whitespace-nowrap"
            >
              <span>Tirar Dúvida no WhatsApp</span>
              <ToothIcon className="w-3.5 h-3.5 ml-1 fill-white" />
            </a>
          </div>

        </div>
      </section>

      {/* 3. AVALIAÇÕES GOOGLE VERIFICADAS */}
      <GoogleReviewsSection reviews={reviews} settings={settings} />

      {/* 4. CONTATO E LOCALIZAÇÃO */}
      <ContactSection settings={settings} />
    </div>
  );
}
