import http from 'node:http';
import {stat,readFile} from 'node:fs/promises';
import path from 'node:path';
// Serve the production static export. Development runs through `npm run dev`.
const root=path.resolve('out');
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.webp':'image/webp','.webm':'video/webm','.svg':'image/svg+xml','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8'};
const server=http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost');const decoded=decodeURIComponent(url.pathname);let file=path.resolve(root,'.'+decoded);
  if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return}
  let meta=await stat(file).catch(()=>null);if(meta?.isDirectory()){file=path.join(file,'index.html');meta=await stat(file).catch(()=>null)}
  if(!meta?.isFile()){res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(await readFile(path.join(root,'404.html')));return}
  const bytes=await readFile(file);const headers={'Content-Type':mime[path.extname(file)]??'application/octet-stream','Cache-Control':'no-cache','Accept-Ranges':'bytes'};
  const range=req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
  if(range){const start=Number(range[1]),end=range[2]?Math.min(Number(range[2]),bytes.length-1):bytes.length-1;if(start>=bytes.length||end<start){res.writeHead(416,{'Content-Range':`bytes */${bytes.length}`});res.end();return}res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${bytes.length}`,'Content-Length':end-start+1});res.end(req.method==='HEAD'?undefined:bytes.subarray(start,end+1));}
  else{res.writeHead(200,{...headers,'Content-Length':bytes.length});res.end(req.method==='HEAD'?undefined:bytes)}
 }catch{res.writeHead(500);res.end('Server error')}
});
server.listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));
