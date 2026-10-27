/**
 * Script para provisionar / sincronizar o banco de dados na nuvem (Turso / LibSQL)
 * Uso:
 *   TURSO_DATABASE_URL="libsql://sua-db.turso.io" TURSO_AUTH_TOKEN="seu-token" node scripts/setup-turso.js
 */

const { createClient } = require('@libsql/client');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const url = process.env.TURSO_DATABASE_URL || process.env.LIBSQL_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  console.error('ERRO: Defina a variável TURSO_DATABASE_URL para conectar ao Turso.');
  console.error('Exemplo: TURSO_DATABASE_URL="libsql://gwodonto-seuusuario.turso.io" TURSO_AUTH_TOKEN="..." node scripts/setup-turso.js');
  process.exit(1);
}

const client = createClient({ url, authToken });

async function main() {
  console.log(`Conectando ao banco de dados Turso em ${url}...`);

  // Lê o banco local atual para copiar dados exatos
  const { getDb } = require('../lib/db');
  const localDb = getDb();

  console.log('Iniciando criação das tabelas no Turso...');

  // 1. Criar tabelas
  await client.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      is_published INTEGER DEFAULT 1,
      is_system INTEGER DEFAULT 0,
      nav_order INTEGER DEFAULT 0,
      in_navbar INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS page_versions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page_id INTEGER NOT NULL,
      version_type TEXT NOT NULL,
      seo_title TEXT NOT NULL,
      seo_description TEXT NOT NULL,
      seo_keywords TEXT,
      content_json TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_by TEXT,
      FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS slug_redirects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      old_slug TEXT UNIQUE NOT NULL,
      new_slug TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_email TEXT NOT NULL,
      action TEXT NOT NULL,
      details TEXT,
      ip_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS login_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip_address TEXT NOT NULL,
      attempt_count INTEGER DEFAULT 1,
      last_attempt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      excerpt TEXT,
      content_html TEXT NOT NULL,
      reading_time_minutes INTEGER DEFAULT 5,
      seo_title TEXT,
      seo_description TEXT,
      author_name TEXT DEFAULT 'Dr. Guilad Weil',
      published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author_name TEXT NOT NULL,
      author_role TEXT,
      rating INTEGER DEFAULT 5,
      date_text TEXT,
      comment TEXT NOT NULL,
      owner_response TEXT,
      treatment_tag TEXT,
      profile_url TEXT,
      is_featured INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('✓ Tabelas criadas no Turso com sucesso.');

  // 2. Copiar dados locais para o Turso
  const tables = ['users', 'settings', 'pages', 'page_versions', 'slug_redirects', 'blog_posts', 'reviews'];
  for (const table of tables) {
    const rows = localDb.prepare(`SELECT * FROM ${table}`).all();
    if (rows.length === 0) continue;

    console.log(`Copiando ${rows.length} registros da tabela "${table}" para o Turso...`);
    for (const row of rows) {
      const keys = Object.keys(row);
      const placeholders = keys.map(() => '?').join(', ');
      const values = keys.map(k => row[k]);
      
      const sql = `INSERT OR REPLACE INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
      await client.execute({ sql, args: values });
    }
  }

  console.log('========================================================');
  console.log('✓ SUCESSO: Banco de dados na nuvem (Turso) 100% sincronizado!');
  console.log('Agora configure no painel da Vercel (Project Settings -> Environment Variables):');
  console.log(`  TURSO_DATABASE_URL = "${url}"`);
  console.log(`  TURSO_AUTH_TOKEN = "${authToken}"`);
  console.log('========================================================');
}

main().catch(err => {
  console.error('Erro na sincronização:', err);
  process.exit(1);
});
