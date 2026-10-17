'use client';

import React from 'react';

export default function MarqueeTicker() {
  const items = [
    'CONFIANÇA',
    'SEGURANÇA',
    'TECNOLOGIA',
    'DIAGNÓSTICO PRECISO',
    'ALÍVIO DO BRUXISMO',
    'LASERTERAPIA (LLLT)',
    'MAIS DE 30 ANOS DE EXPERIÊNCIA',
    'UNIVERSIDADE DE SÃO PAULO (USP)',
    'ATENDIMENTO INDIVIDUALIZADO',
    'PINHEIROS · SÃO PAULO',
    'GW ODONTOLOGIA',
    'ÉTICA BIOLÓGICA',
  ];

  return (
    <div className="w-full bg-[#0b1727] text-white py-3.5 sm:py-4 overflow-hidden border-y border-slate-800 select-none">
      <div className="marquee-track flex items-center space-x-8 text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] text-slate-200">
        {/* First track */}
        {items.map((item, index) => (
          <span key={`t1-${index}`} className="flex items-center space-x-8 whitespace-nowrap">
            <span className="hover:text-blue-400 transition-colors">{item}</span>
            <span className="text-blue-500 font-black">·</span>
          </span>
        ))}
        {/* Second track for seamless continuous loop */}
        {items.map((item, index) => (
          <span key={`t2-${index}`} className="flex items-center space-x-8 whitespace-nowrap">
            <span className="hover:text-blue-400 transition-colors">{item}</span>
            <span className="text-blue-500 font-black">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
