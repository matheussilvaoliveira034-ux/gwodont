import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, MessageCircle, Clock, ShieldCheck, Mail } from 'lucide-react';

export default function Footer({ settings }) {
  const currentYear = new Date().getFullYear();
  const whatsappNumber = settings?.whatsapp_raw || '5511975532110';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Olá, Dr. Guilad! Vim pelo site da GW Odontologia e gostaria de tirar uma dúvida.')}`;

  return (
    <footer className="bg-brand-navy text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Institutional */}
          <div className="space-y-4">
            <div className="inline-block bg-white px-3 py-2 rounded-2xl shadow-sm">
              <img
                src="/images/logo-gw-odontologia.png"
                alt="GW Odontologia - Dr. Guilad Weil"
                className="h-9 sm:h-10 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Mais de 30 anos de atuação clínica em Pinheiros, São Paulo. Prática odontológica responsável baseada em evidências científicas, diagnóstico criterioso e foco absoluto na saúde e função mastigatória.
            </p>
            <div className="pt-2 flex items-center text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 mr-1.5 text-brand-blue-light" />
              <span>Atendimento estritamente particular</span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Páginas e Tratamentos
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Página Principal
                </Link>
              </li>
              <li>
                <Link href="/bruxismo" className="hover:text-white transition-colors">
                  Bruxismo e Dores Orofaciais (NTI e LIVA)
                </Link>
              </li>
              <li>
                <Link href="/herpes" className="hover:text-white transition-colors">
                  Herpes Labial e Laserterapia (LLLT)
                </Link>
              </li>
              <li>
                <Link href="/clinica-geral" className="hover:text-white transition-colors">
                  Clínica Geral e Prevenção
                </Link>
              </li>
              <li>
                <Link href="/tratamento-de-canal" className="hover:text-white transition-colors">
                  Tratamento de Canal (Endodontia)
                </Link>
              </li>
              <li>
                <Link href="/periodontia" className="hover:text-white transition-colors">
                  Periodontia e Saúde Gengival
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Blog Clínico e Artigos
                </Link>
              </li>
              <li>
                <Link href="/contato" className="hover:text-white transition-colors">
                  Localização e Contato
                </Link>
              </li>
              <li>
                <Link href="/english" className="hover:text-white transition-colors text-slate-300">
                  International Dental Care (English)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Hours */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Canais de Atendimento
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start">
                <MessageCircle className="w-4 h-4 mr-2.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs text-slate-400">WhatsApp (Agendamentos e Dúvidas):</span>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 font-bold text-white transition-colors">
                    {settings?.phone_whatsapp || '(11) 97553-2110'}
                  </a>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="w-4 h-4 mr-2.5 text-brand-blue-light flex-shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs text-slate-400">Horário de Funcionamento:</span>
                  <span className="block">{settings?.hours_weekday || 'Seg a Sex: 8h30 às 18h'}</span>
                  <span className="block">{settings?.hours_saturday || 'Sábados: 9h às 12h'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: Address & Access */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Localização
            </h4>
            <div className="text-sm space-y-2">
              <div className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 text-brand-blue-light flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">{settings?.building || 'Condomínio Atrium'}</p>
                  <p>{settings?.address || 'Rua Cristiano Viana, 401, Cj 1311'}</p>
                  <p>{settings?.neighborhood || 'Pinheiros'}, {settings?.city || 'São Paulo'} – {settings?.state || 'SP'}</p>
                  <p className="text-xs text-slate-400 mt-1">CEP: {settings?.cep || '05411-000'}</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 pt-2 border-t border-slate-800 leading-relaxed">
                Próximo ao Hospital das Clínicas, a poucas quadras das estações Clínicas (Linha 2-Verde) e Oscar Freire (Linha 4-Amarela) do Metrô. Estacionamento rotativo no local.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Ethical Notice */}
        <div className="pt-8 mt-8 border-t border-slate-800 text-xs text-slate-400 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>
            © {currentYear} GW Odontologia — Dr. Guilad Weil (USP). Todos os direitos reservados.
          </p>
          <div className="flex items-center space-x-4 text-slate-400">
            <span>Cirurgião-Dentista Graduado pela USP</span>
            <span>·</span>
            <span>Pinheiros, São Paulo</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
