const { getDb } = require('../lib/db');
const fs = require('fs');
const path = require('path');

const db = getDb();

// 1. Get current home page version
const homePage = db.prepare("SELECT id FROM pages WHERE slug = '/'").get();
if (!homePage) {
  console.error('Home page not found!');
  process.exit(1);
}

const versions = db.prepare('SELECT id, version_type, content_json FROM page_versions WHERE page_id = ?').all(homePage.id);

for (const v of versions) {
  const content = JSON.parse(v.content_json);
  
  // Update hero
  content.hero = {
    ...(content.hero || {}),
    title_highlight: 'Tratamento de Bruxismo',
    title_rest: 'e Clínica Geral em Pinheiros',
    title: 'Tratamento de Bruxismo e Clínica Geral em Pinheiros',
    subtitle: 'Na GW Odontologia, você conta com atendimento individualizado do Dr. Guilad Weil (USP, mais de 30 anos de prática clínica). Foco absoluto na saúde bucal, no diagnóstico do bruxismo e na preservação da função mastigatória.',
    tag: 'CUIDADO ODONTOLÓGICO ESPECIALIZADO EM PINHEIROS',
    cta_primary_text: 'AGENDAR AVALIAÇÃO',
  };

  // Add clinical evaluation section data if missing
  if (!content.clinical_evaluation) {
    content.clinical_evaluation = {
      title: 'Avaliação Clínica Completa + Planejamento com Total Transparência',
      subtitle: 'Aqui na GW Odontologia, você entende com exatidão a causa do seu desconforto orofacial. O Dr. Guilad Weil realiza exames clínicos criteriosos para que você saiba exatamente como proteger sua saúde mastigatória, sem intervenções desnecessárias.',
    };
  }

  // Add why choose us section data if missing
  if (!content.why_choose_us) {
    content.why_choose_us = {
      tag: 'POR QUE NOS ESCOLHER?',
      title: 'Por que escolher a GW Odontologia em Pinheiros?',
      subtitle: 'Com mais de 30 anos de atuação clínica formada pela Universidade de São Paulo (USP), o Dr. Guilad Weil prioriza a saúde bucal, o diagnóstico rigoroso e o tratamento ético da dor e do bruxismo.',
    };
  }

  // Add tooth diagram section data if missing
  if (!content.tooth_diagram) {
    content.tooth_diagram = {
      title: 'O que o cuidado odontológico representa para sua vida?',
      subtitle: 'A saúde dos seus dentes, o alívio das tensões e a preservação mastigatória são os pilares para noites reparadoras, equilíbrio e tranquilidade diária.',
    };
  }

  db.prepare('UPDATE page_versions SET content_json = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .run(JSON.stringify(content), v.id);

  console.log(`Updated version ${v.id} (${v.version_type}) for Home page`);
}

// 2. Re-export lib/db-backup.js
const dbFilePath = path.join(__dirname, '..', 'data', 'gwodonto.db');
const outBackupPath = path.join(__dirname, '..', 'lib', 'db-backup.js');
const buf = fs.readFileSync(dbFilePath);
const base64 = buf.toString('base64');
fs.writeFileSync(outBackupPath, `// Embedded SQLite database fallback for Vercel / serverless\nmodule.exports = ${JSON.stringify(base64)};\n`, 'utf8');
console.log('Re-exported lib/db-backup.js with updated database!');
