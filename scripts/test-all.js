const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const {
  getDb,
  getPageBySlug,
  getAllPages,
  getPageForAdmin,
  savePageDraft,
  publishPage,
  discardDraft,
  updateSlug,
  getSettings,
  updateSettings,
  getUserByEmail,
  isRateLimited,
  recordLoginAttempt,
  RESERVED_SLUGS,
  getAllBlogPosts,
  getBlogPostBySlug,
  getAllReviews,
} = require('../lib/db');

const {
  hashPassword,
  verifyPassword,
  createSessionToken,
  verifySessionToken,
} = require('../lib/auth');

async function runTests() {
  console.log('====================================================');
  console.log('   BATERIA DE TESTES DE INTEGRIDADE — GW ODONTOLOGIA');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${testName}`);
      failed++;
    }
  }

  const db = getDb();

  // TEST SUITE 1: Estrutura do Banco de Dados e Usuários
  console.log('\n--- 1. Estrutura do Banco de Dados e Administradores ---');
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(t => t.name);
  ['users', 'settings', 'pages', 'page_versions', 'slug_redirects', 'audit_logs', 'login_attempts', 'blog_posts', 'reviews'].forEach(tbl => {
    assert(tables.includes(tbl), `Tabela "${tbl}" existe no banco de dados SQLite`);
  });

  const devUser = getUserByEmail('admin@gwodonto.com.br');
  assert(!!devUser, 'Administrador 1 (Desenvolvedor: admin@gwodonto.com.br) cadastrado');
  assert(await verifyPassword('GwOdonto@2026Dev!', devUser.password_hash), 'Senha do Desenvolvedor criptografada e verificável');

  const docUser = getUserByEmail('drguilad@gwodonto.com.br');
  assert(!!docUser, 'Administrador 2 (Dr. Guilad Weil: drguilad@gwodonto.com.br) cadastrado');
  assert(await verifyPassword('DrGuilad@GW2026!', docUser.password_hash), 'Senha do Dr. Guilad criptografada e verificável');

  assert(!(await verifyPassword('SenhaErrada123!', docUser.password_hash)), 'Rejeição segura de senhas incorretas');

  // TEST SUITE 2: Autenticação JWT e Sessões
  console.log('\n--- 2. Segurança e Sessões no Servidor ---');
  const token = createSessionToken(docUser);
  assert(typeof token === 'string' && token.length > 30, 'Geração de token JWT seguro para sessão');

  const decoded = verifySessionToken(token);
  assert(decoded && decoded.email === 'drguilad@gwodonto.com.br', 'Validação de sessão JWT no servidor');

  const invalidTokenResult = verifySessionToken('token.invalido.falsificado');
  assert(invalidTokenResult === null, 'Rejeição de tokens inválidos ou adulterados');

  // TEST SUITE 3: Regra Editorial Estrita (Sem Termos Proibidos)
  console.log('\n--- 3. Conformidade com a Regra Editorial Estrita ---');
  const allVersions = db.prepare('SELECT content_json, seo_title, seo_description FROM page_versions').all();
  let forbiddenFound = 0;
  const forbiddenRegex = /sorriso|estética do sorriso|harmonização/i;

  allVersions.forEach(v => {
    if (forbiddenRegex.test(v.seo_title) || forbiddenRegex.test(v.seo_description) || forbiddenRegex.test(v.content_json)) {
      forbiddenFound++;
    }
  });

  assert(forbiddenFound === 0, `Nenhum termo proibido ("sorriso", "estética do sorriso", "harmonização") encontrado nos textos do banco (Total encontrados: ${forbiddenFound})`);

  // TEST SUITE 4: Páginas Independentes e Slugs
  console.log('\n--- 4. Rotas e Páginas Independentes ---');
  const expectedSlugs = [
    '/',
    '/bruxismo',
    '/herpes',
    '/clinica-geral',
    '/tratamento-de-canal',
    '/periodontia',
    '/contato',
    '/english',
  ];

  expectedSlugs.forEach(slug => {
    const p = getPageBySlug(slug);
    assert(!!p && p.is_published === 1, `Página independente "${slug}" publicada e acessível diretamente`);
    assert(p && typeof p.content === 'object', `Conteúdo estruturado recuperado para "${slug}"`);
    assert(p && p.seo_title && p.seo_description, `Metadados SEO (title e description) presentes para "${slug}"`);
  });

  // TEST SUITE 5: Fluxo de Rascunhos e Publicação (Admin)
  console.log('\n--- 5. Fluxo de Edição, Rascunhos e Publicação ---');
  const bruxismoPage = db.prepare("SELECT * FROM pages WHERE slug = '/bruxismo'").get();
  assert(!!bruxismoPage, 'Página de Bruxismo localizada para teste de edição');

  // Salvar rascunho
  const testTitle = 'Diagnóstico e Controle do Bruxismo — Versão Rascunho Teste';
  savePageDraft(bruxismoPage.id, testTitle, 'Descrição teste', 'palavras, teste', { ...getPageBySlug('/bruxismo').content, test_marker: 123 }, 'admin@gwodonto.com.br');

  const publicVer = getPageBySlug('/bruxismo', false);
  const previewVer = getPageBySlug('/bruxismo', true);

  assert(publicVer.seo_title !== testTitle, 'Versão pública NÃO exibe rascunho antes da publicação');
  assert(previewVer.seo_title === testTitle, 'Versão de pré-visualização (?preview=true) exibe rascunho com sucesso');

  // Publicar rascunho
  publishPage(bruxismoPage.id, 'admin@gwodonto.com.br');
  const updatedPublic = getPageBySlug('/bruxismo', false);
  assert(updatedPublic.seo_title === testTitle, 'Após "Publicar", o site público exibe o novo conteúdo imediatamente');

  // Restaurar conteúdo original
  savePageDraft(bruxismoPage.id, 'Tratamento de Bruxismo em São Paulo — Dr. Guilad Weil | Pinheiros', 'Avaliação clínica e controle do bruxismo do sono e de vigília com o Dr. Guilad Weil em Pinheiros. Dispositivos NTI aprovado pelo FDA, abordagem LIVA e proteção dental.', 'bruxismo, nti, liva', updatedPublic.content, 'admin@gwodonto.com.br');
  publishPage(bruxismoPage.id, 'admin@gwodonto.com.br');
  assert(getPageBySlug('/bruxismo', false).seo_title.includes('Tratamento de Bruxismo'), 'Restauração do conteúdo original de Bruxismo concluída');

  // TEST SUITE 6: Sistema de Slugs Editáveis, Colisões e Redirecionamentos
  console.log('\n--- 6. Gerenciamento de Slugs e Redirecionamentos 301 ---');
  const periodontiaPage = db.prepare("SELECT * FROM pages WHERE slug = '/periodontia'").get();

  // Testar colisão
  let collisionError = false;
  try {
    updateSlug(periodontiaPage.id, '/bruxismo', 'admin@gwodonto.com.br');
  } catch (e) {
    collisionError = true;
  }
  assert(collisionError, 'Bloqueio de colisão quando se tenta utilizar um slug já em uso');

  // Testar rota reservada
  let reservedError = false;
  try {
    updateSlug(periodontiaPage.id, '/admin', 'admin@gwodonto.com.br');
  } catch (e) {
    reservedError = true;
  }
  assert(reservedError, 'Bloqueio de slug conflitante com rotas reservadas do sistema (/admin)');

  // Testar atualização com redirecionamento automático
  updateSlug(periodontiaPage.id, '/cuidados-periodontais', 'admin@gwodonto.com.br');
  const redirectCheck = getPageBySlug('/periodontia');
  assert(redirectCheck && redirectCheck.redirect === '/cuidados-periodontais', 'Redirecionamento automático gravado no banco de dados para a URL antiga');

  // Restaurar slug original
  updateSlug(periodontiaPage.id, '/periodontia', 'admin@gwodonto.com.br');
  assert(getPageBySlug('/periodontia').slug === '/periodontia', 'Restauração do slug original /periodontia concluída');

  // TEST SUITE 7: Proteção contra Tentativas Abusivas (Rate Limiting)
  console.log('\n--- 7. Rate Limiting e Proteção contra Força Bruta ---');
  const testIp = '10.0.0.99';
  for (let i = 0; i < 5; i++) {
    recordLoginAttempt(testIp, false);
  }
  assert(isRateLimited(testIp) === true, 'Bloqueio ativado após 5 tentativas de login malsucedidas');

  recordLoginAttempt(testIp, true);
  assert(isRateLimited(testIp) === false, 'Desbloqueio de IP após tentativa bem-sucedida');

  // TEST SUITE 8: Configurações Globais e Dados de Contato
  console.log('\n--- 8. Dados do Consultório ---');
  const settings = getSettings();
  assert(settings.phone_fixo === '(11) 3081-3789', 'Telefone fixo confirmado: (11) 3081-3789');
  assert(settings.phone_whatsapp === '(11) 97553-2110', 'WhatsApp confirmado: (11) 97553-2110');
  assert(settings.building === 'Condomínio Atrium', 'Edifício confirmado: Condomínio Atrium');
  assert(settings.address.includes('Cristiano Viana, 401'), 'Endereço confirmado: Rua Cristiano Viana, 401');

  // TEST SUITE 9: Blog Clínico e Artigos Científicos
  console.log('\n--- 9. Blog Clínico e Gestão de Artigos ---');
  const blogPosts = getAllBlogPosts(true);
  assert(Array.isArray(blogPosts) && blogPosts.length >= 3, `Artigos clínicos publicados recuperados (${blogPosts.length} artigos)`);
  const firstPost = getBlogPostBySlug('bruxismo-do-sono-vs-vigilia-como-identificar');
  assert(!!firstPost, 'Artigo sobre bruxismo do sono vs vigília acessível via slug');
  assert(firstPost && firstPost.author === 'Dr. Guilad Weil', 'Autoria do Dr. Guilad Weil confirmada no artigo');

  // TEST SUITE 10: Avaliações do Google Verificadas
  console.log('\n--- 10. Avaliações do Google My Business ---');
  const reviews = getAllReviews();
  assert(Array.isArray(reviews) && reviews.length >= 10, `Avaliações reais do Google recuperadas com sucesso (${reviews.length} avaliações)`);
  assert(reviews.every(r => r.rating === 5), 'Todas as avaliações do Google possuem nota 5.0 estrelas');
  assert(reviews.some(r => r.author_name === 'Renato Aguiar'), 'Avaliação de Renato Aguiar presente');
  assert(reviews.some(r => r.author_name === 'Daniela Munhoz'), 'Avaliação de Daniela Munhoz presente');

  console.log('\n====================================================');
  console.log(`RESULTADO FINAL: ${passed} testes passaram | ${failed} falharam`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Erro na execução dos testes:', err);
  process.exit(1);
});
