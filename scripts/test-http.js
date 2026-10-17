const http = require('http');

const PORT = 3000;
const BASE = `http://localhost:${PORT}`;

function request(urlPath, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlPath, BASE);
    const reqOptions = {
      method: options.method || 'GET',
      headers: options.headers || {},
    };

    const req = http.request(url, reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });

    req.on('error', reject);
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runHttpTests() {
  console.log('====================================================');
  console.log('   TESTES HTTP DE ROTAS E APIS — GW ODONTOLOGIA');
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

  try {
    // 1. Home
    const resHome = await request('/');
    assert(resHome.status === 200, 'GET / retorna HTTP 200');
    assert(resHome.body.includes('GW ODONTOLOGIA') && resHome.body.includes('Guilad Weil'), 'Home contém cabeçalho e identificação profissional');

    // 2. Bruxismo
    const resBrux = await request('/bruxismo');
    assert(resBrux.status === 200, 'GET /bruxismo retorna HTTP 200');
    assert(resBrux.body.includes('NTI') && resBrux.body.includes('LIVA'), 'Página /bruxismo contém informações sobre NTI e LIVA');

    // 3. Herpes
    const resHerpes = await request('/herpes');
    assert(resHerpes.status === 200, 'GET /herpes retorna HTTP 200');
    assert(resHerpes.body.includes('Laserterapia') && resHerpes.body.includes('HSV-1'), 'Página /herpes contém informações sobre laserterapia LLLT');

    // 4. Clínica Geral
    const resClin = await request('/clinica-geral');
    assert(resClin.status === 200, 'GET /clinica-geral retorna HTTP 200');

    // 5. Tratamento de Canal
    const resCanal = await request('/tratamento-de-canal');
    assert(resCanal.status === 200, 'GET /tratamento-de-canal retorna HTTP 200');
    assert(resCanal.body.includes('Endodontia') || resCanal.body.includes('canal'), 'Página de Canal contém terminologia endodôntica');

    // 6. Periodontia
    const resPerio = await request('/periodontia');
    assert(resPerio.status === 200, 'GET /periodontia retorna HTTP 200');

    // 7. Contato
    const resContato = await request('/contato');
    assert(resContato.status === 200, 'GET /contato retorna HTTP 200');
    assert(resContato.body.includes('Cristiano Viana') && resContato.body.includes('Pinheiros'), 'Página de Contato contém endereço físico');

    // 8. English
    const resEn = await request('/english');
    assert(resEn.status === 200, 'GET /english retorna HTTP 200');
    assert(resEn.body.includes('English-speaking') || resEn.body.includes('São Paulo'), 'Página /english contém versão internacional em inglês');

    // 8.1 Blog Listing
    const resBlog = await request('/blog');
    assert(resBlog.status === 200, 'GET /blog retorna HTTP 200');
    assert(resBlog.body.includes('Blog Clínico') && resBlog.body.includes('Artigos'), 'Página /blog exibe listagem de artigos e cabeçalho');

    // 8.2 Blog Post Detail
    const resPost = await request('/blog/bruxismo-do-sono-vs-vigilia-como-identificar');
    assert(resPost.status === 200, 'GET /blog/[slug] retorna HTTP 200 para artigo existente');
    assert(resPost.body.includes('Dr. Guilad Weil') && (resPost.body.includes('Bruxismo') || resPost.body.includes('sono')), 'Artigo /blog/[slug] exibe autoria e conteúdo clínico');

    // 9. Robots.txt
    const resRobots = await request('/robots.txt');
    assert(resRobots.status === 200, 'GET /robots.txt retorna HTTP 200');
    assert(resRobots.body.includes('Disallow: /admin'), 'Robots.txt bloqueia indexação da área restrita /admin');

    // 10. Sitemap.xml
    const resSitemap = await request('/sitemap.xml');
    assert(resSitemap.status === 200, 'GET /sitemap.xml retorna HTTP 200');
    assert(resSitemap.body.includes('<urlset') && resSitemap.body.includes('/bruxismo'), 'Sitemap.xml contém rotas públicas válidas');

    // 11. 404 Not Found
    const res404 = await request('/rota-inexistente-teste-404');
    assert(res404.status === 404, 'Rota inexistente retorna HTTP 404');
    assert(res404.body.includes('404') || res404.body.includes('não encontrada'), 'Página 404 apresenta mensagem amigável');

    // 12. Login API
    const resLogin = await request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { email: 'drguilad@gwodonto.com.br', password: 'DrGuilad@GW2026!' },
    });
    assert(resLogin.status === 200, 'POST /api/auth/login com credenciais válidas retorna HTTP 200');
    
    const setCookie = resLogin.headers['set-cookie'];
    assert(Array.isArray(setCookie) && setCookie.some(c => c.includes('gwodonto_admin_session')), 'Login define cookie seguro gwodonto_admin_session');

    const sessionCookieStr = setCookie ? setCookie[0].split(';')[0] : '';

    // 13. Admin API com cookie
    const resAdminPages = await request('/api/admin/pages', {
      headers: { Cookie: sessionCookieStr },
    });
    assert(resAdminPages.status === 200, 'GET /api/admin/pages autenticado retorna HTTP 200 com lista de páginas');

    // 14. Admin Blog API com cookie
    const resAdminBlog = await request('/api/admin/blog', {
      headers: { Cookie: sessionCookieStr },
    });
    assert(resAdminBlog.status === 200, 'GET /api/admin/blog autenticado retorna HTTP 200 com lista de artigos');

    // 15. Admin API sem cookie
    const resAdminNoAuth = await request('/api/admin/pages');
    assert(resAdminNoAuth.status === 401, 'GET /api/admin/pages sem autenticação retorna HTTP 401 Unauthorized');

    console.log('\n====================================================');
    console.log(`RESULTADO TESTES HTTP: ${passed} passaram | ${failed} falharam`);
    console.log('====================================================\n');

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Falha nos testes HTTP (o servidor está rodando na porta 3000?):', err);
    process.exit(1);
  }
}

runHttpTests();
