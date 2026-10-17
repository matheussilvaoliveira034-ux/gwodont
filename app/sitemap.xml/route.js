import { NextResponse } from 'next/server';
import { getAllPages } from '../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  let pages = [];
  try {
    pages = getAllPages();
  } catch (e) {
    console.error('Error fetching pages for sitemap:', e);
  }

  // Filter only published pages, exclude /admin
  const publishedPages = pages.filter(p => p.is_published && !p.slug.startsWith('/admin'));

  const xmlUrls = publishedPages.map(page => {
    const loc = `${baseUrl}${page.slug === '/' ? '' : page.slug}`;
    const lastmod = page.published_updated_at ? new Date(page.published_updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    const priority = page.slug === '/' ? '1.0' : (page.slug === '/bruxismo' || page.slug === '/herpes' ? '0.9' : '0.8');
    const changefreq = page.slug === '/' ? 'weekly' : 'monthly';

    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }).join('\n');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls}
</urlset>`;

  return new NextResponse(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
