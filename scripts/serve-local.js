#!/usr/bin/env node
/* Local static server with clean URLs (mirrors Apache .htaccess).
   Live Server (port 5500) does not apply .htaccess — use this instead:
     node scripts/serve-local.js
   Then open http://127.0.0.1:4173/about-why-gps
*/
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const root = path.resolve(__dirname, '..');
const port = Number(process.env.PORT) || 4173;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.webm': 'video/webm',
  '.mp4': 'video/mp4',
  '.webmanifest': 'application/manifest+json',
  '.php': 'text/plain; charset=utf-8',
};

function safeJoin(base, reqPath) {
  const decoded = decodeURIComponent(reqPath.split('?')[0]);
  const cleaned = path.normalize(decoded).replace(/^(\.\.[/\\])+/, '');
  const full = path.join(base, cleaned);
  if (!full.startsWith(base)) return null;
  return full;
}

function send(res, code, body, type, extra) {
  const headers = Object.assign({
    'Content-Type': type || 'text/plain; charset=utf-8',
    'Cache-Control': 'no-cache',
  }, extra || {});
  res.writeHead(code, headers);
  res.end(body);
}

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const type = TYPES[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, data) => {
    if (err) return send(res, 500, 'Server error');
    send(res, 200, data, type);
  });
}

function resolve(urlPath) {
  let p = urlPath;
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
  if (p === '' || p === '/') {
    const idx = path.join(root, 'index.html');
    return fs.existsSync(idx) ? idx : null;
  }
  const direct = safeJoin(root, p);
  if (!direct) return null;
  if (fs.existsSync(direct) && fs.statSync(direct).isFile()) return direct;
  if (fs.existsSync(direct) && fs.statSync(direct).isDirectory()) {
    const idx = path.join(direct, 'index.html');
    return fs.existsSync(idx) ? idx : null;
  }
  if (!path.extname(direct)) {
    const html = direct + '.html';
    if (fs.existsSync(html)) return html;
  }
  return null;
}

const server = http.createServer((req, res) => {
  try {
    const u = new URL(req.url || '/', 'http://127.0.0.1');
    let pathname = u.pathname;

    /* Redirect .html → clean URL (same as production) */
    if (pathname.length > 5 && pathname.endsWith('.html') && pathname !== '/index.html') {
      const clean = pathname.slice(0, -5) + (u.search || '');
      return send(res, 301, '', 'text/plain', { Location: clean });
    }
    if (pathname === '/index.html') {
      return send(res, 301, '', 'text/plain', { Location: '/' + (u.search || '') });
    }

    const file = resolve(pathname);
    if (file) return sendFile(res, file);

    const notFound = path.join(root, '404.html');
    if (fs.existsSync(notFound)) {
      fs.readFile(notFound, (err, data) => {
        if (err) return send(res, 404, 'Not found');
        send(res, 404, data, 'text/html; charset=utf-8');
      });
      return;
    }
    send(res, 404, 'Not found');
  } catch (e) {
    send(res, 500, 'Server error');
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log('GPS local server (clean URLs) → http://127.0.0.1:' + port + '/');
  console.log('Example: http://127.0.0.1:' + port + '/about-why-gps');
});
