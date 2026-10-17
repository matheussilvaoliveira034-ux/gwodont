'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FaqAccordion({ items, title = 'Perguntas Frequentes', subtitle }) {
  const [openIndex, setOpenIndex] = useState(null);

  if (!items || items.length === 0) return null;

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 bg-brand-surface border-t border-brand-border/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-brand-blue uppercase tracking-widest bg-brand-blue-soft px-3 py-1 rounded-full">
            DÚVIDAS CLÍNICAS
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy mt-3 tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-base text-brand-text-body max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className="space-y-3">
          {items.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-blue-100 shadow-sm transition-all duration-200 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full text-left px-6 py-4.5 flex items-center justify-between text-base font-bold text-slate-900 hover:text-blue-600 transition-colors focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="pr-4">{item.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'transform rotate-180 text-brand-blue' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-brand-text-body leading-relaxed border-t border-slate-100 bg-slate-50/40">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
