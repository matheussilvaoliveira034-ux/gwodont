'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton({ settings, initialMessage }) {
  const rawNumber = settings?.whatsapp_raw || '5511975532110';
  const defaultMsg = initialMessage || 'Olá, Dr. Guilad! Vim pelo site da GW Odontologia e gostaria de tirar uma dúvida sobre atendimento.';
  const url = `https://wa.me/${rawNumber}?text=${encodeURIComponent(defaultMsg)}`;

  return (
    <aside aria-label="Atendimento rápido" className="fixed bottom-6 right-6 z-40">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-2 bg-brand-whatsapp hover:bg-brand-whatsapp-dark text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 group focus:outline-none focus:ring-4 focus:ring-green-300"
        aria-label="Fale diretamente pelo WhatsApp com o Dr. Guilad Weil"
      >
        <MessageCircle className="w-6 h-6 animate-pulse" />
        <span className="hidden sm:inline font-semibold text-sm tracking-wide">
          WhatsApp
        </span>
      </a>
    </aside>
  );
}
