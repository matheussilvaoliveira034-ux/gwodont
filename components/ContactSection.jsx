'use client';

import React, { useState } from 'react';
import { MapPin, Phone, MessageCircle, Clock, Send, CheckCircle2 } from 'lucide-react';

export default function ContactSection({ settings }) {
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });

  const whatsappNumber = settings?.whatsapp_raw || '5511975532110';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Olá, Dr. Guilad! Vim pelo site da GW Odontologia e gostaria de agendar uma consulta.')}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Professional client message - directs to whatsapp with the pre-filled inquiry
    const msg = `Olá, Dr. Guilad! Meu nome é ${formData.name}. Telefone: ${formData.phone || 'Não informado'}. Mensagem: ${formData.message}`;
    const directUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(directUrl, '_blank');
    setFormSent(true);
  };

  return (
    <section id="contato" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-semibold text-brand-blue uppercase tracking-widest bg-brand-blue-soft px-3 py-1 rounded-full">
            ATENDIMENTO & LOCALIZAÇÃO
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy mt-3 tracking-tight">
            Consultório em Pinheiros — São Paulo
          </h2>
          <p className="mt-3 text-base text-brand-text-body">
            Atendimento pontual com agendamento prévio, em ambiente clínico higienizado, moderno e de fácil acesso.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact Cards & Directions (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* WhatsApp Card */}
              <div className="p-6 rounded-xl border border-brand-border bg-brand-surface shadow-card-subtle flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-700 mb-3">
                    <MessageCircle className="w-5 h-5 text-brand-whatsapp" />
                  </div>
                  <h3 className="text-base font-bold text-brand-navy">WhatsApp</h3>
                  <p className="text-xs text-brand-text-muted mt-1">Contato direto e rápido para agendamentos</p>
                  <p className="text-lg font-bold text-brand-navy mt-2">{settings?.phone_whatsapp || '(11) 97553-2110'}</p>
                </div>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center text-xs font-semibold text-brand-blue hover:text-brand-navy"
                >
                  Iniciar conversa no WhatsApp →
                </a>
              </div>

              {/* Fixo Card */}
              <div className="p-6 rounded-xl border border-brand-border bg-brand-surface shadow-card-subtle flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-brand-blue mb-3">
                    <Phone className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-brand-navy">Telefone Fixo</h3>
                  <p className="text-xs text-brand-text-muted mt-1">Atendimento durante o horário comercial</p>
                  <p className="text-lg font-bold text-brand-navy mt-2">{settings?.phone_fixo || '(11) 3081-3789'}</p>
                </div>
                <a
                  href={`tel:${settings?.phone_fixo?.replace(/[^0-9]/g, '') || '1130813789'}`}
                  className="mt-4 inline-flex items-center text-xs font-semibold text-brand-blue hover:text-brand-navy"
                >
                  Ligar para o consultório →
                </a>
              </div>
            </div>

            {/* Address & Metro Access Card */}
            <div className="p-6 rounded-xl border border-brand-border bg-white shadow-card-subtle space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-brand-blue flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-base font-bold text-brand-navy">{settings?.building || 'Condomínio Atrium'}</h3>
                  <p className="text-sm text-brand-text-body font-medium">{settings?.address || 'Rua Cristiano Viana, 401, Conjunto 1311'}</p>
                  <p className="text-sm text-brand-text-muted">Bairro {settings?.neighborhood || 'Pinheiros'}, {settings?.city || 'São Paulo'} – {settings?.state || 'SP'} · CEP {settings?.cep || '05411-000'}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-xs text-brand-text-body space-y-2">
                <p>
                  <strong>Metrô:</strong> Próximo ao Complexo das Clínicas. A cerca de 10 minutos a pé da <strong>Estação Clínicas</strong> (Linha 2-Verde) e da <strong>Estação Oscar Freire</strong> (Linha 4-Amarela).
                </p>
                <p>
                  <strong>Acesso de Veículo:</strong> A Rua Cristiano Viana é travessa da Av. Rebouças e da Rua Teodoro Sampaio. O edifício Condomínio Atrium conta com estacionamento rotativo com manobrista.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center text-xs text-brand-text-muted">
                <Clock className="w-4 h-4 mr-2 text-brand-blue" />
                <span>Horários: {settings?.hours_weekday || 'Seg a Sex: 8h30 às 18h'} | {settings?.hours_saturday || 'Sáb: 9h às 12h'}</span>
              </div>
            </div>

            {/* Map Embed */}
            <div className="rounded-xl overflow-hidden border border-brand-border shadow-card-subtle h-64 sm:h-72 w-full">
              <iframe
                title="Localização GW Odontologia"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.3697924619933!2d-46.680088123868615!3d-23.555139878804077!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5799a4c04f93%3A0xe5417387343e06ce!2sR.%20Cristiano%20Viana%2C%20401%20-%20Cerqueira%20C%C3%A9sar%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2005411-000!5e0!3m2!1spt-BR!2sbr!4v1710000000000!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Right Column: Direct Contact Form (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-brand-surface p-6 sm:p-8 rounded-2xl border border-brand-border shadow-card-subtle">
              <h3 className="text-xl font-bold text-brand-navy tracking-tight">
                Envie uma Mensagem
              </h3>
              <p className="text-xs text-brand-text-muted mt-1 mb-6">
                Preencha os campos abaixo para esclarecer dúvidas clínicas ou solicitar informações sobre agendamento.
              </p>

              {formSent ? (
                <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto" />
                  <h4 className="font-bold text-green-900 text-base">Mensagem Enviada!</h4>
                  <p className="text-xs text-green-700">
                    Sua mensagem foi direcionada para o WhatsApp do Dr. Guilad Weil. Responderemos em breve.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setFormSent(false); setFormData({ name: '', phone: '', email: '', message: '' }); }}
                    className="text-xs font-semibold text-brand-blue underline"
                  >
                    Enviar outra mensagem
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-semibold text-brand-navy uppercase tracking-wider mb-1">
                      Nome Completo *
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Seu nome"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="phone" className="block text-xs font-semibold text-brand-navy uppercase tracking-wider mb-1">
                        Telefone / WhatsApp *
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(11) 99999-9999"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue bg-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs font-semibold text-brand-navy uppercase tracking-wider mb-1">
                        E-mail
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="seu@email.com"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-semibold text-brand-navy uppercase tracking-wider mb-1">
                      Dúvida ou Procedimento de Interesse *
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Descreva brevemente sua dúvida clínica (ex: bruxismo, dor de cabeça, canal, laserterapia)..."
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue bg-white"
                    ></textarea>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-tight">
                    * Seus dados são utilizados exclusivamente para o contato do consultório, respeitando o sigilo profissional da saúde bucal.
                  </p>

                  <button
                    type="submit"
                    className="w-full btn-pill-blue flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Enviar Mensagem</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
