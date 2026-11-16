const CACHE='stordy-v2';
const ASSETS=['./','./index.html','./manifest.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(u.origin!==location.origin){return;} // let CDN (pdf.js) pass through
  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(res=>{
    const c=res.clone();caches.open(CACHE).then(cache=>cache.put(e.request,c)).catch(()=>{});return res;
  }).catch(()=>caches.match('./index.html'))));
});
