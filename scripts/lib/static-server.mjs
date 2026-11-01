// A small static server that compresses text the way a real host does. `vite preview`
// sends everything uncompressed, which would make performance measurements look worse
// than the deployed site. Used by the Lighthouse script and the update test.
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { gzipSync } from 'node:zlib';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
};

const COMPRESSIBLE = new Set(['.html', '.js', '.css', '.json', '.webmanifest', '.svg']);

export function serveStatic(dir, port = 0) {
  const server = createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let file = normalize(join(dir, pathname));
    if (!file.startsWith(normalize(dir))) {
      res.writeHead(403).end();
      return;
    }
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
    if (!existsSync(file)) {
      res.writeHead(404, { 'content-type': 'text/plain' }).end('Not found');
      return;
    }
    const ext = extname(file);
    const headers = { 'content-type': TYPES[ext] ?? 'application/octet-stream' };
    if (/\/assets\//.test(pathname)) headers['cache-control'] = 'public, max-age=31536000, immutable';
    else headers['cache-control'] = 'no-cache';
    if (COMPRESSIBLE.has(ext) && /\bgzip\b/.test(req.headers['accept-encoding'] ?? '')) {
      const body = gzipSync(readFileSync(file));
      res.writeHead(200, { ...headers, 'content-encoding': 'gzip', 'content-length': body.length }).end(body);
      return;
    }
    res.writeHead(200, headers);
    createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => {
      resolve({ url: `http://localhost:${server.address().port}/`, close: () => new Promise((done) => server.close(done)) });
    });
  });
}
