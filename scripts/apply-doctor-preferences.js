const { getDb } = require('../lib/db');
const fs = require('fs');
const path = require('path');

const db = getDb();
console.log('--- Aplicando preferências estritas do Dr. Guilad Weil ---');

// 1. Atualizar Configurações Globais (Sem Telefone Fixo, Apenas WhatsApp)
db.prepare("UPDATE settings SET value = '' WHERE key = 'phone_fixo'").run();
db.prepare("UPDATE settings SET value = '(11) 97553-2110' WHERE key = 'phone_whatsapp'").run();
db.prepare("UPDATE settings SET value = '5511975532110' WHERE key = 'whatsapp_raw'").run();
console.log('✓ Configurações atualizadas: Telefone fixo removido. Apenas WhatsApp mantido.');

// 2. Atualizar Página Inicial (Home /)
const homePage = db.prepare("SELECT id FROM pages WHERE slug = '/'").get();
if (homePage) {
  const versions = db.prepare('SELECT id, version_type, content_json FROM page_versions WHERE page_id = ?').all(homePage.id);
  
  for (const v of versions) {
    let content = {};
    try {
      content = JSON.parse(v.content_json);
    } catch (_) {}

    // Configuração limpa e geral do Hero
    content.hero = {
      tag: 'CONSULTÓRIO ODONTOLÓGICO EM PINHEIROS',
      title_highlight: 'Odontologia Clínica',
      title_rest: 'e Cuidado Geral em Pinheiros',
      title: 'Odontologia Clínica e Cuidado Geral em Pinheiros',
      subtitle: 'Com mais de 30 anos de atuação clínica formada pela Faculdade de Odontologia da USP, o Dr. Guilad Weil oferece atendimento particular e individualizado no bairro de Pinheiros, focado na saúde bucal, diagnóstico criterioso e preservação mastigatória.',
      cta_primary_text: 'AGENDAR CONSULTA',
      cta_secondary_text: 'Ver Tratamentos',
      disclaimer: 'Atendimento particular individualizado. Não atendemos convênios nem SUS.',
      badges: [
        'Formado pela USP',
        'Mais de 30 anos de prática clínica',
        'Atendimento em Português, Inglês e Hebraico',
        'Pinheiros · Metrô Clínicas e Oscar Freire'
      ],
      image_url: '/images/dr-guilad-weil.jpg'
    };

    // Configuração limpa do Sobre o Doutor
    content.about_doctor = {
      tag: 'SOBRE O PROFISSIONAL',
      title: 'Dr. Guilad Weil — Cirurgião-Dentista formado pela USP',
      image_url: '/images/dr-guilad-weil.jpg',
      paragraphs: [
        'Graduado pela Faculdade de Odontologia da Universidade de São Paulo (USP), o Dr. Guilad Weil atua há mais de três décadas em consultório particular no bairro de Pinheiros.',
        'Sua prática clínica baseia-se em evidências científicas sólidas, diagnósticos conservadores e respeito estrito à individualidade de cada paciente. A clínica não realiza tratamentos invasivos motivados por modismos, concentrando-se na integridade biológica e na longevidade da saúde mastigatória.',
        'Para procedimentos de alta complexidade que exigem intervenção especializada, como casos avançados de Endodontia e Periodontia cirúrgica, o consultório atua em estreita colaboração com especialistas associados, garantindo segurança técnica e acompanhamento integrado.',
        'Fluente em inglês e hebraico, o Dr. Guilad também é referência no atendimento a diplomatas, executivos e residentes internacionais em São Paulo há vários anos.'
      ],
      credentials: [
        'Graduação em Odontologia — Faculdade de Odontologia da USP',
        'Mais de 30 anos de prática clínica contínua em Pinheiros',
        'Capacitação em Laserterapia (LLLT) para alívio da dor e cicatrização',
        'Habilitação em abordagens modernas para controle do bruxismo (NTI e LIVA)',
        'Radiografia Digital Schick de baixa emissão de radiação',
        'Atendimento multilíngue: Português, Inglês e Hebraico'
      ]
    };

    // Áreas de atuação com foco geral e direcionamento de Bruxismo para sua página dedicada
    content.services_section = {
      tag: 'ÁREAS DE ATUAÇÃO CONFIRMADAS',
      title: 'Tratamentos clínicos e páginas exclusivas',
      subtitle: 'Conheça os principais cuidados oferecidos, com páginas dedicadas e explicações detalhadas sobre cada procedimento.',
      cards: [
        {
          slug: '/bruxismo',
          title: 'Bruxismo e Dores Orofaciais',
          description: 'Diagnóstico diferencial entre bruxismo do sono e em vigília. Dispositivos NTI (aprovado pelo FDA), método LIVA e acompanhamento muscular individualizado.',
          badge: 'Página Exclusiva',
          icon: 'Moon'
        },
        {
          slug: '/clinica-geral',
          title: 'Clínica Geral e Prevenção',
          description: 'Profilaxia detalhada, remoção de tártaro, restaurações funcionais em resina composta, inlays, onlays e coroas de proteção.',
          badge: 'Odontologia Clínica',
          icon: 'CheckCircle'
        },
        {
          slug: '/herpes',
          title: 'Herpes Labial e Laserterapia',
          description: 'Aplicação de laser de baixa intensidade (LLLT) para alívio imediato do desconforto, aceleração da cicatrização e controle de recidivas.',
          badge: 'Página Exclusiva',
          icon: 'Zap'
        },
        {
          slug: '/tratamento-de-canal',
          title: 'Tratamento de Canal (Endodontia)',
          description: 'Técnicas modernas com radiografia digital para sanar infecções da polpa e preservar o dente natural, em cooperação com especialistas.',
          badge: 'Colaboração com Especialistas',
          icon: 'ShieldAlert'
        },
        {
          slug: '/periodontia',
          title: 'Periodontia e Saúde Gengival',
          description: 'Controle de inflamações gengivais, tratamento de suporte e manutenção dos tecidos de sustentação dos dentes com equipe integrada.',
          badge: 'Saúde dos Tecidos',
          icon: 'Heart'
        },
        {
          slug: '/english',
          title: 'International Dental Care',
          description: 'English-speaking dental care in São Paulo for expats, tourists, and international executives. Clean, modern facility in Pinheiros.',
          badge: 'English Spoken',
          icon: 'Globe'
        }
      ]
    };

    // Remover seções indesejadas do JSON
    delete content.clinical_evaluation;
    delete content.tooth_diagram;

    // Atualizar FAQs para remover menção a telefone fixo
    if (content.faq && Array.isArray(content.faq)) {
      content.faq = content.faq.map(item => {
        return {
          question: item.question,
          answer: item.answer.replace(/ou pelo telefone fixo \(11\) 3081-3789/g, '').replace(/pelo telefone fixo \(11\) 3081-3789 ou /g, '')
        };
      });
    }

    db.prepare(`
      UPDATE page_versions 
      SET seo_title = 'GW Odontologia — Dr. Guilad Weil | Dentista em Pinheiros, São Paulo',
          seo_description = 'Consultório odontológico em Pinheiros com o Dr. Guilad Weil, formado pela USP há mais de 30 anos. Atendimento clínico geral, bruxismo, laserterapia e reabilitação funcional.',
          content_json = ?, 
          updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(JSON.stringify(content), v.id);

    console.log(`✓ Versão ${v.id} (${v.version_type}) da Home atualizada.`);
  }
}

// 3. Atualizar FAQs de todas as outras páginas para remover menção a telefone fixo
const allVersions = db.prepare('SELECT id, content_json FROM page_versions').all();
for (const v of allVersions) {
  try {
    let content = JSON.parse(v.content_json);
    if (content.faq && Array.isArray(content.faq)) {
      let changed = false;
      content.faq = content.faq.map(item => {
        if (item.answer.includes('3081-3789')) {
          changed = true;
          return {
            question: item.question,
            answer: item.answer.replace(/ou pelo telefone fixo \(11\) 3081-3789/g, '').replace(/pelo telefone fixo \(11\) 3081-3789 ou /g, '').replace(/\(11\) 3081-3789/g, '(11) 97553-2110')
          };
        }
        return item;
      });
      if (changed) {
        db.prepare('UPDATE page_versions SET content_json = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(JSON.stringify(content), v.id);
      }
    }
  } catch (_) {}
}

// 4. Re-exportar lib/db-backup.js para atualizar o bundle serverless na Vercel
const dbFilePath = path.join(__dirname, '..', 'data', 'gwodonto.db');
const outBackupPath = path.join(__dirname, '..', 'lib', 'db-backup.js');
const buf = fs.readFileSync(dbFilePath);
const base64 = buf.toString('base64');
fs.writeFileSync(outBackupPath, `// Embedded SQLite database fallback for Vercel / serverless\nmodule.exports = ${JSON.stringify(base64)};\n`, 'utf8');
console.log('✓ lib/db-backup.js re-exportado com sucesso!');
