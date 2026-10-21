'use client';

import React from 'react';

export default function ToothDiagramSection({ data = {} }) {
  const title = data?.title || 'O que o cuidado odontológico representa para sua vida?';
  const subtitle = data?.subtitle || 'A saúde dos seus dentes, o alívio das tensões e a preservação mastigatória são os pilares para noites reparadoras, equilíbrio e tranquilidade diária.';

  return (
    <section className="py-20 sm:py-28 bg-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-4">
            {title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Anatomical Tooth Diagram Showcase with User-Uploaded Image */}
        <div className="relative max-w-2xl mx-auto flex items-center justify-center">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 bg-blue-100/60 rounded-full blur-3xl pointer-events-none transform scale-95"></div>

          <img
            src="/images/dente-diagrama.jpg"
            alt="Diagrama Anatômico Dental — Saúde, Equilíbrio e Bem-Estar"
            className="w-full h-auto max-w-xl sm:max-w-2xl object-contain relative z-10 drop-shadow-xl rounded-3xl"
          />
        </div>
      </div>
    </section>
  );
}
