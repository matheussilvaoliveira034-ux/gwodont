'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Phone, 
  MapPin, 
  Clock, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  ShieldCheck
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  const [settings, setSettings] = useState({
    clinic_name: '',
    doctor_name: '',
    doctor_title: '',
    formation: '',
    address: '',
    building: '',
    neighborhood: '',
    city: '',
    state: '',
    cep: '',
    phone_fixo: '',
    phone_whatsapp: '',
    whatsapp_raw: '',
    hours_weekday: '',
    hours_saturday: '',
    metro_info: '',
    access_car_info: '',
    languages: '',
  });

  async function loadSettings() {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.ok && data.settings) {
        setSettings(prev => ({ ...prev, ...data.settings }));
      }
    } catch (e) {
      console.error('Error fetching settings:', e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  const handleChange = (field, val) => {
    setSettings(prev => ({ ...prev, [field]: val }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.ok) {
        setNotification({ type: 'success', message: 'Dados do consultório atualizados com sucesso no banco de dados!' });
      } else {
        setNotification({ type: 'error', message: data.error || 'Erro ao salvar.' });
      }
    } catch (e) {
      setNotification({ type: 'error', message: 'Erro de conexão.' });
    } finally {
      setSaving(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 flex items-center justify-center space-x-2">
        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
        <span>Carregando configurações...</span>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Dados do Consultório e Horários
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Edite as informações cadastrais, canais de contato, horários de atendimento e orientações de localização.
        </p>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-xl border text-sm flex items-start space-x-3 transition-all ${
            notification.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Identificação Institucional */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            Identificação da Clínica e Profissional
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nome da Clínica</label>
              <input
                type="text"
                value={settings.clinic_name}
                onChange={(e) => handleChange('clinic_name', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Cirurgião-Dentista Responsável</label>
              <input
                type="text"
                value={settings.doctor_name}
                onChange={(e) => handleChange('doctor_name', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Formação & Credenciais</label>
            <input
              type="text"
              value={settings.formation}
              onChange={(e) => handleChange('formation', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>
        </div>

        {/* Telefones e Horários */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            Contatos e Horários de Atendimento
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Telefone Fixo</label>
              <input
                type="text"
                value={settings.phone_fixo}
                onChange={(e) => handleChange('phone_fixo', e.target.value)}
                placeholder="(11) 3081-3789"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp (Exibição)</label>
              <input
                type="text"
                value={settings.phone_whatsapp}
                onChange={(e) => handleChange('phone_whatsapp', e.target.value)}
                placeholder="(11) 97553-2110"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Horário Segunda a Sexta</label>
              <input
                type="text"
                value={settings.hours_weekday}
                onChange={(e) => handleChange('hours_weekday', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Horário aos Sábados</label>
              <input
                type="text"
                value={settings.hours_saturday}
                onChange={(e) => handleChange('hours_saturday', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        {/* Endereço e Localização */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            Endereço do Consultório em Pinheiros
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Logradouro e Número</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Edifício / Condomínio</label>
              <input
                type="text"
                value={settings.building}
                onChange={(e) => handleChange('building', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Bairro</label>
              <input
                type="text"
                value={settings.neighborhood}
                onChange={(e) => handleChange('neighborhood', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Cidade / UF</label>
              <input
                type="text"
                value={`${settings.city} - ${settings.state}`}
                onChange={(e) => {
                  const parts = e.target.value.split('-');
                  handleChange('city', (parts[0] || '').trim());
                  handleChange('state', (parts[1] || '').trim());
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">CEP</label>
              <input
                type="text"
                value={settings.cep}
                onChange={(e) => handleChange('cep', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Salvar Configurações</span>
          </button>
        </div>
      </form>
    </div>
  );
}
