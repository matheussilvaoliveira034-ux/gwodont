const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'gwodonto.db');
const outPath = path.join(__dirname, '..', 'lib', 'db-backup.js');

if (fs.existsSync(dbPath)) {
  const buf = fs.readFileSync(dbPath);
  const base64 = buf.toString('base64');
  const content = `// Embedded SQLite database fallback for Vercel / serverless\nmodule.exports = ${JSON.stringify(base64)};\n`;
  fs.writeFileSync(outPath, content, 'utf8');
  console.log(`Generated ${outPath} (${base64.length} chars)`);
} else {
  console.error('db not found at', dbPath);
}
