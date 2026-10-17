const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SESSION_SECRET = process.env.SESSION_SECRET || 'gwodonto_super_secret_session_key_2026_pinheiros_sp_jwt';
const COOKIE_NAME = 'gwodonto_admin_session';

async function hashPassword(plainText) {
  return await bcrypt.hash(plainText, 12);
}

async function verifyPassword(plainText, hash) {
  return await bcrypt.compare(plainText, hash);
}

function createSessionToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role || 'admin',
    },
    SESSION_SECRET,
    { expiresIn: '7d' }
  );
}

function verifySessionToken(token) {
  try {
    return jwt.verify(token, SESSION_SECRET);
  } catch (e) {
    return null;
  }
}

function getSessionCookieHeader(token) {
  const isProd = process.env.NODE_ENV === 'production';
  // Max-age: 7 days in seconds = 604800
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800${isProd ? '; Secure' : ''}`;
}

function getClearSessionCookieHeader() {
  const isProd = process.env.NODE_ENV === 'production';
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${isProd ? '; Secure' : ''}`;
}

module.exports = {
  COOKIE_NAME,
  hashPassword,
  verifyPassword,
  createSessionToken,
  verifySessionToken,
  getSessionCookieHeader,
  getClearSessionCookieHeader,
};
