import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve, extname, sep} from 'node:path';
const root=resolve('.');
const types={'.pdf':'application/pdf','.tex':'text/plain; charset=utf-8','.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.woff2':'font/woff2','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.json':'application/json'};
const portIndex=process.argv.indexOf('--port');
const port=portIndex>=0?Number(process.argv[portIndex+1]):Number(process.env.PORT)||3000;
http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');const path=resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));if(!path.startsWith(root+sep)){res.writeHead(403).end();return;}const data=await readFile(path);res.writeHead(200,{'Content-Type':types[extname(path)]||'application/octet-stream','Cache-Control':'no-cache'}).end(data);}catch{res.writeHead(404).end('Not found');}}).listen(port,'0.0.0.0');
