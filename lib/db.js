const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

function getDbPath() {
  if (process.env.DATABASE_PATH) {
    return process.env.DATABASE_PATH;
  }

  const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT);

  if (isServerless) {
    const tmpPath = path.join('/tmp', 'gwodonto.db');
    if (!fs.existsSync(tmpPath)) {
      // 1. Try copying from disk if candidate locations exist
      const candidatePaths = [
        path.join(process.cwd(), 'data', 'gwodonto.db'),
        path.join(__dirname, '..', 'data', 'gwodonto.db'),
        path.join('/var', 'task', 'data', 'gwodonto.db'),
      ];

      let copied = false;
      for (const cand of candidatePaths) {
        if (fs.existsSync(cand)) {
          try {
            fs.copyFileSync(cand, tmpPath);
            copied = true;
            console.log(`[GW-DB] Copied database from ${cand} to /tmp`);
            break;
          } catch (e) {
            console.warn(`[GW-DB] Failed to copy from ${cand}:`, e.message);
          }
        }
      }

      // 2. If not found on disk, restore from embedded backup
      if (!copied && !fs.existsSync(tmpPath)) {
        try {
          const backupBase64 = require('./db-backup');
          const buffer = Buffer.from(backupBase64, 'base64');
          fs.writeFileSync(tmpPath, buffer);
          console.log('[GW-DB] Successfully restored database from embedded backup to /tmp');
        } catch (e) {
          console.error('[GW-DB] Failed to restore embedded backup:', e.message);
        }
      }
    }

    if (fs.existsSync(tmpPath)) {
      return tmpPath;
    }
  }

  // Local development
  const localPath = path.join(process.cwd(), 'data', 'gwodonto.db');
  const localDir = path.dirname(localPath);
  if (!fs.existsSync(localDir)) {
    try {
      fs.mkdirSync(localDir, { recursive: true });
    } catch (_) {}
  }
  return localPath;
}

let db;

function getDb() {
  if (!db) {
    const resolvedPath = getDbPath();
    try {
      db = new Database(resolvedPath);
      try {
        db.pragma('journal_mode = WAL');
        db.pragma('foreign_keys = ON');
        initTables(db);
      } catch (pragmaErr) {
        console.warn('[GW-DB] Pragma or init warning:', pragmaErr.message);
      }
    } catch (openErr) {
      console.warn('[GW-DB] Failed standard open, attempting readonly fallback:', openErr.message);
      try {
        db = new Database(resolvedPath, { readonly: true });
      } catch (roErr) {
        console.error('[GW-DB] Critical: failed to open database in any mode:', roErr.message);
        throw roErr;
      }
    }
  }
  return db;
}

function initTables(database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

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
    );

    CREATE TABLE IF NOT EXISTS page_versions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page_id INTEGER NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
      version_type TEXT NOT NULL CHECK(version_type IN ('draft', 'published')),
      seo_title TEXT NOT NULL,
      seo_description TEXT NOT NULL,
      seo_keywords TEXT,
      content_json TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_by TEXT,
      UNIQUE(page_id, version_type)
    );

    CREATE TABLE IF NOT EXISTS slug_redirects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      old_slug TEXT UNIQUE NOT NULL,
      new_slug TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS login_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip TEXT NOT NULL,
      attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      success INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_email TEXT NOT NULL,
      action TEXT NOT NULL,
      details TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS blog_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      excerpt TEXT,
      content TEXT NOT NULL,
      category TEXT DEFAULT 'Clínica Geral',
      tags TEXT,
      cover_image TEXT,
      reading_time TEXT DEFAULT '4 min de leitura',
      author TEXT DEFAULT 'Dr. Guilad Weil',
      is_published INTEGER DEFAULT 1,
      published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author_name TEXT NOT NULL,
      author_role TEXT,
      rating INTEGER DEFAULT 5,
      date_text TEXT NOT NULL,
      comment TEXT NOT NULL,
      owner_response TEXT,
      treatment_tag TEXT,
      profile_url TEXT,
      is_featured INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

// Helper functions for Pages & Versions
function getPageBySlug(slug, preview = false) {
  const database = getDb();
  // Normalize slug: ensure leading slash, no trailing slash unless root
  let cleanSlug = slug === '' || slug === '/' ? '/' : (slug.startsWith('/') ? slug : '/' + slug);
  if (cleanSlug.length > 1 && cleanSlug.endsWith('/')) {
    cleanSlug = cleanSlug.slice(0, -1);
  }

  // Check redirects first
  const redirect = database.prepare('SELECT new_slug FROM slug_redirects WHERE old_slug = ?').get(cleanSlug);
  if (redirect) {
    return { redirect: redirect.new_slug };
  }

  const page = database.prepare('SELECT * FROM pages WHERE slug = ?').get(cleanSlug);
  if (!page) return null;

  // If preview is requested, try to get 'draft', fallback to 'published'
  let version;
  if (preview) {
    version = database.prepare("SELECT * FROM page_versions WHERE page_id = ? AND version_type = 'draft'").get(page.id);
  }
  if (!version) {
    version = database.prepare("SELECT * FROM page_versions WHERE page_id = ? AND version_type = 'published'").get(page.id);
  }

  if (!version) return null;

  let content = {};
  try {
    content = JSON.parse(version.content_json);
  } catch (e) {
    console.error('Error parsing content_json for page:', page.slug, e);
  }

  return {
    ...page,
    version_type: version.version_type,
    seo_title: version.seo_title,
    seo_description: version.seo_description,
    seo_keywords: version.seo_keywords,
    content,
    version_updated_at: version.updated_at,
    version_updated_by: version.updated_by,
  };
}

function getAllPages() {
  const database = getDb();
  const pages = database.prepare('SELECT * FROM pages ORDER BY nav_order ASC, id ASC').all();
  return pages.map(p => {
    const published = database.prepare("SELECT updated_at, updated_by, seo_title FROM page_versions WHERE page_id = ? AND version_type = 'published'").get(p.id);
    const draft = database.prepare("SELECT updated_at, updated_by, seo_title FROM page_versions WHERE page_id = ? AND version_type = 'draft'").get(p.id);
    return {
      ...p,
      has_draft: !!draft,
      draft_updated_at: draft ? draft.updated_at : null,
      draft_updated_by: draft ? draft.updated_by : null,
      published_updated_at: published ? published.updated_at : null,
      published_updated_by: published ? published.updated_by : null,
      title: published ? published.seo_title : p.name,
    };
  });
}

function getPageForAdmin(pageId) {
  const database = getDb();
  const page = database.prepare('SELECT * FROM pages WHERE id = ?').get(pageId);
  if (!page) return null;

  const published = database.prepare("SELECT * FROM page_versions WHERE page_id = ? AND version_type = 'published'").get(page.id);
  const draft = database.prepare("SELECT * FROM page_versions WHERE page_id = ? AND version_type = 'draft'").get(page.id);

  let publishedContent = null;
  let draftContent = null;

  if (published) {
    try { publishedContent = JSON.parse(published.content_json); } catch (e) {}
  }
  if (draft) {
    try { draftContent = JSON.parse(draft.content_json); } catch (e) {}
  }

  return {
    ...page,
    published: published ? {
      ...published,
      content: publishedContent,
    } : null,
    draft: draft ? {
      ...draft,
      content: draftContent,
    } : null,
  };
}

function savePageDraft(pageId, seoTitle, seoDescription, seoKeywords, content, userEmail) {
  const database = getDb();
  const contentJson = typeof content === 'string' ? content : JSON.stringify(content);

  const existing = database.prepare("SELECT id FROM page_versions WHERE page_id = ? AND version_type = 'draft'").get(pageId);
  if (existing) {
    database.prepare(`
      UPDATE page_versions 
      SET seo_title = ?, seo_description = ?, seo_keywords = ?, content_json = ?, updated_at = CURRENT_TIMESTAMP, updated_by = ?
      WHERE id = ?
    `).run(seoTitle, seoDescription, seoKeywords || '', contentJson, userEmail, existing.id);
  } else {
    database.prepare(`
      INSERT INTO page_versions (page_id, version_type, seo_title, seo_description, seo_keywords, content_json, updated_by)
      VALUES (?, 'draft', ?, ?, ?, ?, ?)
    `).run(pageId, seoTitle, seoDescription, seoKeywords || '', contentJson, userEmail);
  }

  database.prepare('UPDATE pages SET updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(pageId);
  logAudit(userEmail, 'SAVE_DRAFT', `Page ID ${pageId} draft saved`);
  return true;
}

function publishPage(pageId, userEmail) {
  const database = getDb();
  // Get draft first, if no draft, nothing new to publish unless existing published
  const draft = database.prepare("SELECT * FROM page_versions WHERE page_id = ? AND version_type = 'draft'").get(pageId);
  
  if (draft) {
    // Upsert into published
    const existingPub = database.prepare("SELECT id FROM page_versions WHERE page_id = ? AND version_type = 'published'").get(pageId);
    if (existingPub) {
      database.prepare(`
        UPDATE page_versions 
        SET seo_title = ?, seo_description = ?, seo_keywords = ?, content_json = ?, updated_at = CURRENT_TIMESTAMP, updated_by = ?
        WHERE id = ?
      `).run(draft.seo_title, draft.seo_description, draft.seo_keywords, draft.content_json, userEmail, existingPub.id);
    } else {
      database.prepare(`
        INSERT INTO page_versions (page_id, version_type, seo_title, seo_description, seo_keywords, content_json, updated_by)
        VALUES (?, 'published', ?, ?, ?, ?, ?)
      `).run(pageId, draft.seo_title, draft.seo_description, draft.seo_keywords, draft.content_json, userEmail);
    }
    // Delete draft after publishing
    database.prepare('DELETE FROM page_versions WHERE id = ?').run(draft.id);
  }

  database.prepare('UPDATE pages SET is_published = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(pageId);
  logAudit(userEmail, 'PUBLISH_PAGE', `Page ID ${pageId} published to live site`);
  return true;
}

function discardDraft(pageId, userEmail) {
  const database = getDb();
  database.prepare("DELETE FROM page_versions WHERE page_id = ? AND version_type = 'draft'").run(pageId);
  logAudit(userEmail, 'DISCARD_DRAFT', `Page ID ${pageId} draft discarded`);
  return true;
}

const RESERVED_SLUGS = ['/admin', '/api', '/_next', '/favicon.ico', '/robots.txt', '/sitemap.xml'];

function updateSlug(pageId, newSlugInput, userEmail) {
  const database = getDb();
  const page = database.prepare('SELECT * FROM pages WHERE id = ?').get(pageId);
  if (!page) throw new Error('Página não encontrada');

  let clean = newSlugInput.trim().toLowerCase();
  if (!clean.startsWith('/')) clean = '/' + clean;
  if (clean.length > 1 && clean.endsWith('/')) clean = clean.slice(0, -1);

  // Validation
  if (clean !== '/' && !/^\/[a-z0-9-]+$/.test(clean)) {
    throw new Error('Slug inválido. Use apenas letras minúsculas, números e hífens.');
  }

  if (RESERVED_SLUGS.includes(clean)) {
    throw new Error(`O slug "${clean}" é reservado pelo sistema.`);
  }

  if (clean === page.slug) return true; // No change

  // Check collision with another page
  const collision = database.prepare('SELECT id FROM pages WHERE slug = ? AND id != ?').get(clean, pageId);
  if (collision) {
    throw new Error(`O slug "${clean}" já está sendo utilizado por outra página.`);
  }

  const oldSlug = page.slug;

  // Begin transaction
  const tx = database.transaction(() => {
    // Update page
    database.prepare('UPDATE pages SET slug = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(clean, pageId);

    // Save redirect from oldSlug to clean (if oldSlug was not root)
    if (oldSlug !== '/') {
      database.prepare(`
        INSERT INTO slug_redirects (old_slug, new_slug) 
        VALUES (?, ?) 
        ON CONFLICT(old_slug) DO UPDATE SET new_slug = ?, created_at = CURRENT_TIMESTAMP
      `).run(oldSlug, clean, clean);
    }

    // Delete any redirect pointing to the new slug from the same old slug
    database.prepare('DELETE FROM slug_redirects WHERE old_slug = ?').run(clean);
  });

  tx();
  logAudit(userEmail, 'UPDATE_SLUG', `Page ID ${pageId} slug changed from ${oldSlug} to ${clean}`);
  return true;
}

// Settings
function getSettings() {
  const database = getDb();
  const rows = database.prepare('SELECT key, value FROM settings').all();
  const map = {};
  rows.forEach(r => { map[r.key] = r.value; });
  return map;
}

function updateSettings(settingsObj, userEmail) {
  const database = getDb();
  const stmt = database.prepare(`
    INSERT INTO settings (key, value, updated_at) 
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = CURRENT_TIMESTAMP
  `);

  const tx = database.transaction(() => {
    for (const [k, v] of Object.entries(settingsObj)) {
      stmt.run(k, String(v), String(v));
    }
  });

  tx();
  logAudit(userEmail, 'UPDATE_SETTINGS', 'Global settings updated');
  return true;
}

// User & Auth
function getUserByEmail(email) {
  const database = getDb();
  return database.prepare('SELECT * FROM users WHERE email = ? COLLATE NOCASE').get(email);
}

function updateUserLastLogin(userId) {
  const database = getDb();
  database.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(userId);
}

function logAudit(userEmail, action, details) {
  try {
    const database = getDb();
    database.prepare('INSERT INTO audit_logs (user_email, action, details) VALUES (?, ?, ?)').run(userEmail || 'system', action, details || '');
  } catch (e) {
    console.error('Audit log error:', e);
  }
}

// Rate limiting for login
function isRateLimited(ip) {
  const database = getDb();
  const row = database.prepare(`
    SELECT COUNT(*) as count 
    FROM login_attempts 
    WHERE ip = ? AND success = 0 AND attempted_at >= datetime('now', '-15 minutes')
  `).get(ip);
  return row ? row.count >= 5 : false;
}

function recordLoginAttempt(ip, success) {
  const database = getDb();
  database.prepare('INSERT INTO login_attempts (ip, success) VALUES (?, ?)').run(ip, success ? 1 : 0);
  if (success) {
    // Clean old failed attempts for this ip
    database.prepare('DELETE FROM login_attempts WHERE ip = ? AND success = 0').run(ip);
  }
}

// Blog Posts Management
function getAllBlogPosts(includeUnpublished = false) {
  const database = getDb();
  if (includeUnpublished) {
    return database.prepare('SELECT * FROM blog_posts ORDER BY published_at DESC, id DESC').all();
  }
  return database.prepare('SELECT * FROM blog_posts WHERE is_published = 1 ORDER BY published_at DESC, id DESC').all();
}

function getBlogPostBySlug(slug, includeUnpublished = false) {
  const database = getDb();
  let clean = slug.replace(/^\/+/, '').replace(/\/+$/, '');
  if (includeUnpublished) {
    return database.prepare('SELECT * FROM blog_posts WHERE slug = ?').get(clean);
  }
  return database.prepare('SELECT * FROM blog_posts WHERE slug = ? AND is_published = 1').get(clean);
}

function getBlogPostById(id) {
  const database = getDb();
  return database.prepare('SELECT * FROM blog_posts WHERE id = ?').get(id);
}

function saveBlogPost(post, userEmail) {
  const database = getDb();
  let cleanSlug = (post.slug || post.title)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!cleanSlug) cleanSlug = 'artigo-' + Date.now();

  const isPublished = post.is_published ? 1 : 0;

  if (post.id) {
    // Check slug collision
    const existing = database.prepare('SELECT id FROM blog_posts WHERE slug = ? AND id != ?').get(cleanSlug, post.id);
    if (existing) {
      throw new Error(`O slug "${cleanSlug}" já está em uso por outro artigo.`);
    }

    database.prepare(`
      UPDATE blog_posts 
      SET slug = ?, title = ?, excerpt = ?, content = ?, category = ?, tags = ?, cover_image = ?, reading_time = ?, author = ?, is_published = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      cleanSlug,
      post.title,
      post.excerpt || '',
      post.content,
      post.category || 'Clínica Geral',
      post.tags || '',
      post.cover_image || '',
      post.reading_time || '4 min de leitura',
      post.author || 'Dr. Guilad Weil',
      isPublished,
      post.id
    );

    logAudit(userEmail, 'UPDATE_BLOG_POST', `Blog post ID ${post.id} updated: ${post.title}`);
    return getBlogPostById(post.id);
  } else {
    // Insert new post
    const existing = database.prepare('SELECT id FROM blog_posts WHERE slug = ?').get(cleanSlug);
    if (existing) {
      cleanSlug = `${cleanSlug}-${Date.now().toString().slice(-4)}`;
    }

    const result = database.prepare(`
      INSERT INTO blog_posts (slug, title, excerpt, content, category, tags, cover_image, reading_time, author, is_published)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      cleanSlug,
      post.title,
      post.excerpt || '',
      post.content,
      post.category || 'Clínica Geral',
      post.tags || '',
      post.cover_image || '',
      post.reading_time || '4 min de leitura',
      post.author || 'Dr. Guilad Weil',
      isPublished
    );

    logAudit(userEmail, 'CREATE_BLOG_POST', `Blog post created: ${post.title}`);
    return getBlogPostById(result.lastInsertRowid);
  }
}

function deleteBlogPost(id, userEmail) {
  const database = getDb();
  const post = getBlogPostById(id);
  if (!post) throw new Error('Artigo não encontrado');
  database.prepare('DELETE FROM blog_posts WHERE id = ?').run(id);
  logAudit(userEmail, 'DELETE_BLOG_POST', `Blog post ID ${id} deleted: ${post.title}`);
  return true;
}

// Google Reviews Management
function getAllReviews(featuredOnly = false) {
  const database = getDb();
  if (featuredOnly) {
    return database.prepare('SELECT * FROM reviews WHERE is_featured = 1 ORDER BY id ASC').all();
  }
  return database.prepare('SELECT * FROM reviews ORDER BY id ASC').all();
}

function insertReview(review) {
  const database = getDb();
  return database.prepare(`
    INSERT INTO reviews (author_name, author_role, rating, date_text, comment, owner_response, treatment_tag, profile_url, is_featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    review.author_name,
    review.author_role || '',
    review.rating || 5,
    review.date_text || 'Recentemente',
    review.comment,
    review.owner_response || '',
    review.treatment_tag || 'Geral',
    review.profile_url || '',
    review.is_featured !== undefined ? (review.is_featured ? 1 : 0) : 1
  );
}

module.exports = {
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
  updateUserLastLogin,
  logAudit,
  isRateLimited,
  recordLoginAttempt,
  getAllBlogPosts,
  getBlogPostBySlug,
  getBlogPostById,
  saveBlogPost,
  deleteBlogPost,
  getAllReviews,
  insertReview,
  RESERVED_SLUGS: [...RESERVED_SLUGS, '/blog'],
};
