import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import { getSettings } from '../lib/db';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'GW Odontologia — Dr. Guilad Weil | Dentista em Pinheiros, São Paulo',
    template: '%s | GW Odontologia — Dr. Guilad Weil',
  },
  description: 'Consultório odontológico em Pinheiros com o Dr. Guilad Weil, formado pela USP há mais de 30 anos. Atendimento clínico geral, bruxismo, laserterapia e odontologia funcional.',
  authors: [{ name: 'Dr. Guilad Weil' }],
  creator: 'GW Odontologia',
  publisher: 'GW Odontologia',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export const dynamic = 'force-dynamic';

export default function RootLayout({ children }) {
  let settings = {};
  try {
    settings = getSettings();
  } catch (e) {
    console.error('Error loading settings in layout:', e);
  }

  return (
    <html lang="pt-BR" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-brand-text-body font-sans antialiased selection:bg-brand-blue-soft selection:text-brand-navy">
        <Header settings={settings} />
        <main className="flex-grow">{children}</main>
        <Footer settings={settings} />
        <WhatsAppButton settings={settings} />
      </body>
    </html>
  );
}
