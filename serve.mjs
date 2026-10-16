import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export function createPreviewServer({root = process.cwd(), basePath = '/'} = {}) {
  if(!basePath.startsWith('/') || !basePath.endsWith('/')) throw Error('basePath must start/end with /');
  const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.png':'image/png', '.svg':'image/svg+xml', '.wav':'audio/wav', '.ogg':'audio/ogg', '.md':'text/plain; charset=utf-8', '.txt':'text/plain; charset=utf-8' };
  return http.createServer(async (request,response) => {
    try {
      const url = new URL(request.url,'http://localhost');
      const pathname = decodeURIComponent(url.pathname);
      if(basePath !== '/' && pathname === basePath.slice(0,-1)) {
        response.writeHead(308,{Location:basePath + url.search}).end(); return;
      }
      if(!pathname.startsWith(basePath)) { response.writeHead(404).end('Not found'); return; }
      const relativeURL = pathname.slice(basePath.length) || 'index.html';
      const file = path.resolve(root,relativeURL);
      const relative = path.relative(root,file);
      if(relative.startsWith('..') || path.isAbsolute(relative)) { response.writeHead(403).end('Forbidden'); return; }
      const body = await readFile(file);
      response.writeHead(200,{'Content-Type':types[path.extname(file)] || 'application/octet-stream','Cache-Control':'no-store'});
      response.end(body);
    } catch { response.writeHead(404).end('Not found'); }
  });
}

if(process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  createPreviewServer().listen(4173,'127.0.0.1',()=>console.log('Local preview: http://127.0.0.1:4173'));
}
