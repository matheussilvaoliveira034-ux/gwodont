import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowLeft, 
  Share2, 
  ShieldCheck, 
  Phone, 
  CheckCircle2, 
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { getBlogPostBySlug, getAllBlogPosts, getSettings, getAllReviews } from '../../../lib/db';
import GoogleReviewsSection from '../../../components/GoogleReviewsSection';
import ContactSection from '../../../components/ContactSection';
import ToothIcon from '../../../components/ToothIcon';

export async function generateMetadata({ params }) {
  const { slug } = params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};

  return {
    title: `${post.title} | Blog GW Odontologia`,
    description: post.excerpt,
    keywords: post.tags,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: `${post.title} | Dr. Guilad Weil`,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      siteName: 'GW Odontologia',
      locale: 'pt_BR',
      type: 'article',
    },
  };
}

export const dynamic = 'force-dynamic';

export default function BlogPostPage({ params }) {
  const { slug } = params;
  const post = getBlogPostBySlug(slug);
  const settings = getSettings();
  const reviews = getAllReviews();
  const allPosts = getAllBlogPosts(true);

  if (!post) {
    notFound();
  }

  // Related posts (excluding current)
  const relatedPosts = allPosts.filter(p => p.id !== post.id).slice(0, 2);

  const whatsappNumber = settings?.whatsapp_raw || '5511975532110';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Olá, Dr. Guilad! Li o artigo "${post.title}" no seu site e gostaria de tirar uma dúvida.`)}`;

  return (
    <div className="bg-white">
      {/* 1. ARTICLE HERO HEADER */}
      <section className="relative pt-10 pb-12 sm:pt-14 sm:pb-16 bg-gradient-to-b from-blue-50/60 via-white to-white border-b border-blue-100/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
              <li>
                <Link href="/" className="hover:text-blue-600 transition-colors">
                  Início
                </Link>
              </li>
              <li className="flex items-center space-x-2">
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <Link href="/blog" className="hover:text-blue-600 transition-colors">
                  Blog & Artigos
                </Link>
              </li>
              <li className="flex items-center space-x-2">
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-blue-700 font-bold truncate max-w-[200px] sm:max-w-xs">{post.title}</span>
              </li>
            </ol>
          </nav>

          {/* Category Pill */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-extrabold uppercase tracking-wider mb-5">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span>{post.category || 'Artigo Clínico'}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.2] mb-6">
            {post.title}
          </h1>

          {/* Excerpt Lead */}
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-6 font-medium">
            {post.excerpt}
          </p>

          {/* Metadata bar */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center space-x-4">
              <span className="flex items-center font-bold text-slate-800">
                <User className="w-4 h-4 mr-1.5 text-blue-600" />
                {post.author || 'Dr. Guilad Weil (USP)'}
              </span>
              <span>•</span>
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1.5 text-slate-400" />
                {post.published_at ? new Date(post.published_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Recent'}
              </span>
              <span>•</span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1.5 text-slate-400" />
                {post.reading_time || '5 min de leitura'}
              </span>
            </div>

            <Link
              href="/blog"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-bold transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Voltar aos artigos
            </Link>
          </div>

        </div>
      </section>

      {/* 2. ARTICLE BODY */}
      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Article Main Text (8 cols) */}
            <div className="lg:col-span-8">
              <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-5">
                {post.content.split('\n\n').map((block, idx) => {
                  const trimmed = block.trim();
                  if (!trimmed) return null;

                  // Heading 2
                  if (trimmed.startsWith('## ')) {
                    return (
                      <h2 key={idx} className="text-2xl font-extrabold text-slate-900 tracking-tight pt-6 pb-2 border-b border-slate-100">
                        {trimmed.replace('## ', '')}
                      </h2>
                    );
                  }

                  // Heading 3
                  if (trimmed.startsWith('### ')) {
                    return (
                      <h3 key={idx} className="text-lg font-bold text-blue-700 tracking-tight pt-4 pb-1">
                        {trimmed.replace('### ', '')}
                      </h3>
                    );
                  }

                  // Bullet list
                  if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                    const items = trimmed.split('\n').filter(Boolean);
                    return (
                      <ul key={idx} className="space-y-2 my-4 pl-2">
                        {items.map((it, i) => (
                          <li key={i} className="flex items-start text-sm text-slate-700">
                            <CheckCircle2 className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                            <span>{it.replace(/^[-*]\s+/, '')}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  }

                  // Highlight note
                  if (trimmed.startsWith('> ')) {
                    return (
                      <div key={idx} className="my-6 p-4 rounded-xl bg-blue-50 border-l-4 border-blue-600 text-slate-800 text-sm italic">
                        {trimmed.replace(/^>\s+/, '')}
                      </div>
                    );
                  }

                  // Standard paragraph
                  return (
                    <p key={idx} className="text-base text-slate-700 leading-relaxed">
                      {trimmed}
                    </p>
                  );
                })}
              </div>

              {/* Tags */}
              {post.tags && (
                <div className="mt-10 pt-6 border-t border-slate-200">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
                    Tópicos abordados:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.split(',').map((tag, i) => (
                      <span
                        key={i}
                        className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium"
                      >
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Author Box */}
              <div className="mt-10 p-6 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-xl shadow-md flex-shrink-0">
                  GW
                </div>
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600">
                    AUTOR DO ARTIGO
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-0.5">
                    Dr. Guilad Weil · Cirurgião-Dentista (USP)
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
                    Graduado pela Universidade de São Paulo (USP), com mais de 30 anos de prática clínica dedicada ao atendimento ético, diagnóstico preciso de bruxismo e odontologia preventiva em Pinheiros.
                  </p>
                </div>
              </div>
            </div>

            {/* Sticky Sidebar CTA (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Consultation Card */}
              <div className="sticky top-24 p-6 rounded-3xl bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 text-white shadow-xl">
                <div className="w-10 h-10 rounded-xl bg-blue-500/80 text-white flex items-center justify-center font-bold text-sm mb-4">
                  GW
                </div>
                <span className="text-[11px] uppercase tracking-widest text-blue-300 font-bold block mb-1">
                  CONSULTA EM PINHEIROS
                </span>
                <h3 className="text-lg font-extrabold text-white mb-2 leading-tight">
                  Precisa de uma avaliação deste caso?
                </h3>
                <p className="text-xs text-blue-100 leading-relaxed mb-6">
                  Agende sua consulta particular diretamente com o Dr. Guilad Weil pelo WhatsApp. Atendimento pontual e transparente.
                </p>

                <div className="space-y-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center px-4 py-3 rounded-full bg-white text-blue-700 font-extrabold text-xs uppercase tracking-wider shadow hover:bg-blue-50 transition-colors"
                  >
                    <span>Falar no WhatsApp</span>
                    <ToothIcon className="w-3.5 h-3.5 ml-1.5 fill-blue-700" />
                  </a>

                  <a
                    href={`tel:${settings?.phone_fixo?.replace(/[^0-9]/g, '') || '1130813789'}`}
                    className="w-full flex items-center justify-center px-4 py-3 rounded-full border border-blue-400 text-white font-bold text-xs uppercase tracking-wider hover:bg-blue-800 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 mr-1.5" />
                    <span>Ligar: {settings?.phone_fixo || '(11) 3081-3789'}</span>
                  </a>
                </div>

                <div className="mt-6 pt-4 border-t border-blue-600/60 text-[11px] text-blue-200 space-y-1">
                  <div>Rua Cristiano Viana, 401 · Cj 1311</div>
                  <div className="text-blue-300">Condomínio Atrium — Pinheiros</div>
                </div>
              </div>

              {/* Related posts */}
              {relatedPosts.length > 0 && (
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200">
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-4 flex items-center">
                    <BookOpen className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                    Outros Artigos Clínicos
                  </h4>
                  <div className="space-y-4">
                    {relatedPosts.map((rel) => (
                      <Link
                        key={rel.id}
                        href={`/blog/${rel.slug}`}
                        className="block group"
                      >
                        <span className="text-[10px] font-bold uppercase text-blue-600 tracking-wider">
                          {rel.category}
                        </span>
                        <h5 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-snug mt-0.5">
                          {rel.title}
                        </h5>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>

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
