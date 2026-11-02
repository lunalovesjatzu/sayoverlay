/* Sayler Suite · utilidades compartidas */
(function(){
 /* 1) Temporizadores en Web Worker: no se pausan cuando la pestaña está en segundo plano */
 let wk=null;const cb=new Map();let id=0;
 const NT={st:setTimeout.bind(window),si:setInterval.bind(window),ct:clearTimeout.bind(window)};
 try{wk=new Worker(URL.createObjectURL(new Blob(['const T={};onmessage=e=>{const m=e.data;if(m.c){clearTimeout(T[m.id]);clearInterval(T[m.id]);delete T[m.id];return}const f=()=>postMessage(m.id);T[m.id]=m.i?setInterval(f,m.ms):setTimeout(f,m.ms)}'],{type:'text/javascript'})));
  wk.onmessage=e=>{const o=cb.get(e.data);if(!o)return;if(!o.i)cb.delete(e.data);try{o.f()}catch(x){console.error(x)}};wk.onerror=()=>{}}catch(e){wk=null}
 const mk=i=>(f,ms,...a)=>{if(!wk)return(i?NT.si:NT.st)(f,ms,...a);const n=++id;cb.set(n,{f:()=>f(...a),i});wk.postMessage({id:n,ms:ms||0,i});return n};
 const ct=n=>{if(!wk)return NT.ct(n);if(cb.delete(n))wk.postMessage({c:1,id:n})};
 const _raf=window.requestAnimationFrame.bind(window);
 const W=window.__W={setTimeout:mk(0),setInterval:mk(1),clearTimeout:ct,clearInterval:ct,
  raf:f=>{let d=0;const r=t=>{if(d)return;d=1;f(t||performance.now())};_raf(r);W.setTimeout(r,34);return 0}};
 /* 2) Mantener viva la pestaña: tono casi inaudible + lock (se activa con el primer clic) */
 let ka=0;const wake=()=>{if(ka)return;ka=1;try{const A=window.AudioContext||window.webkitAudioContext,x=new A(),o=x.createOscillator(),g=x.createGain();g.gain.value=.002;o.frequency.value=30;o.connect(g);g.connect(x.destination);o.start();x.resume()}catch(e){}
  try{navigator.locks&&navigator.locks.request('sayler-awake',()=>new Promise(()=>{})).catch(()=>{})}catch(e){}};
 ['pointerdown','keydown'].forEach(e=>addEventListener(e,wake,{once:true,passive:true}));
 /* 3) Modo enlace transparente (#live): sin fondo verde */
 const hs=location.hash;
 if(/^#live(&|$)/.test(hs)){document.documentElement.classList.add('live');const s=document.createElement('style');
  s.textContent='html.live,html.live body{background:transparent!important}html.live .stage{background:transparent!important;outline:none!important}';document.documentElement.appendChild(s)}
 /* el hub cambia entre vista completa y mini (dock del bebé) */
 addEventListener('message',e=>{const d=e.data;if(d&&d.sayMode)document.body.classList.toggle('mini',d.sayMode==='mini')});
 /* 4) Configuración local: mismas claves de siempre + respaldo */
 const PFX=/^(ovl|angelito-sayler|ruleta-de-sayler|sayler-mods)/,SKIP=/^(ovl-st-|ovlC|ovlM|ruleta-de-sayler-run)/;
 const C=window.SaylerCfg={
  dump(){const o={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(PFX.test(k)&&!SKIP.test(k))o[k]=localStorage.getItem(k)}return o},
  load(o){Object.keys(o||{}).forEach(k=>{if(PFX.test(k))try{localStorage.setItem(k,o[k])}catch(e){}})},
  export(){return{app:'sayler-suite',stamp:Date.now(),data:C.dump()}}};
 /* Enlaces sueltos (OBS / TikTok): cargan config/respaldo.json del repo si es nuevo */
 /* Solo se importa el respaldo del repo en navegadores donde NO has editado nada (OBS/TikTok la primera vez). Si editaste aquí, nunca se pisa en silencio. Los enlaces con config propia (#s= / #c=) tampoco lo usan. */
 try{if(!window.__NOSYNC&&!window.opener&&window.parent===window&&location.protocol!=='file:'&&!/[#&](s|c)=/.test(location.hash)&&!(localStorage.getItem('ovlS')&&localStorage.getItem('__edited'))){
  const x=new XMLHttpRequest();x.open('GET','config/respaldo.json?'+Date.now(),false);x.send();
  if(x.status===200){const j=JSON.parse(x.responseText);if(j&&j.data&&String(j.stamp)!==localStorage.getItem('__stamp')){C.load(j.data);localStorage.setItem('__stamp',String(j.stamp))}}}}catch(e){}
})();

/* 5) Enlace fijo para el bebé y la ruleta: la configuración viaja por ntfy (igual que en los overlays).
      Panel: publica los cambios. Enlace (#live&s=CODIGO): los recibe solo y los aplica sin recargar. */
(function(){
 const W=window.__W,H=window.__SYNC_HOST||'ntfy.sh',web=/^https?:\/\//.test(H),HU=web?H:'https://'+H,WU=web?H.replace(/^http/,'ws'):'wss://'+H;
 const hp=new URLSearchParams(location.hash.slice(1)),CODE=hp.get('s')||'',LIVE=hp.has('live')&&!!CODE&&!window.__NOSYNC;
 const PFX=/^(angelito-sayler|ruleta-de-sayler|sayler-mods)/,SZ=2800,MIN=3000,MAXIMG=300000,TOK='@img:';
 /* lo que NO viaja: el enlace conserva lo suyo (progreso de la ruleta) y fuerza la conexión con TikFinity */
 const RULES={'angelito-sayler-v1':{drop:['on'],force:{on:1}},'ruleta-de-sayler-v1':{drop:['st','tikOn'],force:{tikOn:true}}};
 const sleep=ms=>new Promise(r=>W.setTimeout(r,ms));
 const newCode=()=>'sayler-'+[...crypto.getRandomValues(new Uint8Array(12))].map(x=>(x%36).toString(36)).join('');
 const b64=u=>{let s='';for(let i=0;i<u.length;i+=0x8000)s+=String.fromCharCode.apply(null,u.subarray(i,i+0x8000));return btoa(s)},unb64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
 async function zipTxt(t){try{if(window.CompressionStream){const r=await new Response(new Blob([t]).stream().pipeThrough(new CompressionStream('deflate'))).arrayBuffer();return 'z'+b64(new Uint8Array(r))}}catch(e){}return 'p'+btoa(unescape(encodeURIComponent(t)))}
 async function unzipTxt(s){if(s[0]=='z')return await new Response(new Blob([unb64(s.slice(1))]).stream().pipeThrough(new DecompressionStream('deflate'))).text();return decodeURIComponent(escape(atob(s.slice(1))))}
 function hash(s){let a=0xdeadbeef,b=0x41c6ce57;for(let i=0;i<s.length;i++){const c=s.charCodeAt(i);a=Math.imul(a^c,2654435761);b=Math.imul(b^c,1597334677)}
  a=Math.imul(a^(a>>>16),2246822507)^Math.imul(b^(b>>>13),3266489909);b=Math.imul(b^(b>>>16),2246822507)^Math.imul(a^(a>>>13),3266489909);return(b>>>0).toString(36)+(a>>>0).toString(36)+s.length.toString(36)}
 function walk(v,f){if(Array.isArray(v)){for(let i=0;i<v.length;i++)v[i]=walk(v[i],f);return v}if(v&&typeof v==='object'){for(const k in v)v[k]=walk(v[k],f);return v}return f(v)}
 /* las imágenes grandes viajan aparte (una sola vez cada una) y en la configuración queda una marca */
 function strip(b,media,sk){const o={};for(const k in b){let j;try{j=JSON.parse(b[k])}catch(e){o[k]=b[k];continue}
  const R=RULES[k];if(R&&j&&typeof j==='object')R.drop.forEach(f=>delete j[f]);
  walk(j,v=>{if(typeof v==='string'&&v.length>=MIN&&/^data:[^,;]{1,60};base64,/i.test(v)){if(v.length>MAXIMG){if(sk)sk.n++;return ''}const h=hash(v);media[h]=v;return TOK+h}return v});o[k]=JSON.stringify(j)}return o}
 const SS=window.SaylerSync={live:LIVE,code:CODE,changed(){},mount:null,cmd(){},onCmd(){}};
 let IM={};

 /* ===== ENLACE (OBS / TikTok): recibe y aplica ===== */
 if(LIVE){
  /* el enlace usa su propia copia de la configuración: nunca pisa la del panel aunque estén en el mismo navegador */
  try{const P=Storage.prototype,g=P.getItem,s=P.setItem,r=P.removeItem,m=(t,k)=>t===window.localStorage&&PFX.test(k)?'sx:'+k:k;
   P.getItem=function(k){return g.call(this,m(this,k))};P.setItem=function(k,v){return s.call(this,m(this,k),v)};P.removeItem=function(k){return r.call(this,m(this,k))}}catch(e){}
  const img=h=>IM[h]||(()=>{try{return localStorage.getItem('saylerImg:'+h)}catch(e){return null}})();
  function resolve(b,miss){const o={};for(const k in b){let j;try{j=JSON.parse(b[k])}catch(e){o[k]=b[k];continue}
   walk(j,v=>{if(typeof v==='string'&&v.startsWith(TOK)){const h=v.slice(TOK.length),im=img(h);if(im)return im;miss.push(h);return ''}return v});o[k]=JSON.stringify(j)}return o}
  function applyBundle(b){for(const k in b){let t=b[k];const R=RULES[k];
   if(R){try{const o=JSON.parse(t);let old={};try{old=JSON.parse(localStorage.getItem(k))||{}}catch(e){}
    R.drop.forEach(f=>{if(f in old)o[f]=old[f];else delete o[f]});Object.assign(o,R.force);t=JSON.stringify(o)}catch(e){}}
   try{localStorage.setItem(k,t)}catch(e){}}}
  let cfgZ='',cvBest=0,lastApplied='',tm=0,waitT=0,waitCv=0;
  const schedule=()=>{W.clearTimeout(tm);tm=W.setTimeout(applyLatest,120)};
  async function applyLatest(){const z=cfgZ,cv=cvBest;if(!z)return;let t,b;try{t=await unzipTxt(z);b=JSON.parse(t)}catch(e){return}
   const miss=[],res=resolve(b,miss);
   if(miss.length&&waitCv!==cv){waitCv=cv;W.clearTimeout(waitT);waitT=W.setTimeout(applyLatest,5000);return}
   const fin=JSON.stringify(res);if(fin===lastApplied)return;lastApplied=fin;
   applyBundle(res);try{localStorage.setItem('saylerRx:'+CODE,JSON.stringify({cv,cfg:t}))}catch(e){}
   if(!miss.length){try{const keep=new Set((t.match(/@img:[a-z0-9]+/g)||[]).map(x=>x.slice(TOK.length)));
    for(let i=localStorage.length-1;i>=0;i--){const k=localStorage.key(i);if(k&&k.startsWith('saylerImg:')&&!keep.has(k.slice(10)))localStorage.removeItem(k)}}catch(e){}}
   try{window.__synApply&&window.__synApply()}catch(e){console.error(e)}try{window.SaylerMods&&SaylerMods.fire()}catch(e){}}
  /* al abrir: la última copia que recibió (sirve aunque no haya internet) */
  try{const rx=JSON.parse(localStorage.getItem('saylerRx:'+CODE));if(rx&&rx.cfg){cvBest=+rx.cv||0;const res=resolve(JSON.parse(rx.cfg),[]);lastApplied=JSON.stringify(res);applyBundle(res)}}catch(e){}
  const G={};let ws=null,wt=0;
  function onMsg(ev){let o,x;try{o=JSON.parse(ev.data);if(o.event!=='message')return;x=JSON.parse(o.message)}catch(e){return}
   if(!x||x.v!==2||!(x.n>0))return;const k=x.t+':'+x.id,g=G[k]||(G[k]={n:x.n,p:{},done:0});if(g.done)return;g.p[x.i]=x.d;
   if(Object.keys(g.p).length<g.n)return;g.done=1;const s=Array.from({length:g.n},(_,i)=>g.p[i]).join('');g.p=null;
   if(x.t==='m'){IM[x.id]=s;try{localStorage.setItem('saylerImg:'+x.id,s)}catch(e){}schedule()}
   else if(x.t==='c'&&+x.id>cvBest){cvBest=+x.id;cfgZ=s;schedule()}}
  /* conexión con vigilante: si el socket queda «muerto» sin avisar (pasa en OBS/TikTok al dormir la PC o cortarse el internet) se reabre solo */
  let lastT=0;
  function open(){W.clearTimeout(wt);let w;try{w=new WebSocket(WU+'/'+encodeURIComponent(CODE)+'/ws?since='+(lastT?Math.max(0,lastT-30):'12h'))}catch(e){wt=W.setTimeout(open,5000);return}
   ws=w;let alive=Date.now();
   const ck=W.setInterval(()=>{if(ws!==w){W.clearInterval(ck);return}if(Date.now()-alive>130000){W.clearInterval(ck);ws=null;w.onclose=null;try{w.close()}catch(e){}open()}},20000);
   w.onopen=()=>{alive=Date.now()};
   w.onmessage=ev=>{alive=Date.now();try{const t=JSON.parse(ev.data).time;if(t>lastT)lastT=t}catch(e){}onMsg(ev)};
   w.onclose=()=>{W.clearInterval(ck);if(ws===w)wt=W.setTimeout(open,3000)}}
  addEventListener('online',()=>{if(ws){ws.onclose=null;try{ws.close()}catch(e){}ws=null}open()});
  open();
  /* órdenes en tiempo real (giro, pruebas, contadores…) que llegan del panel por el canal CODIGO-cmd */
  const cmdSubs=[],pendC=[],seenC=new Set(),CT0=Math.floor(Date.now()/1000)-20;let cLast=0,cws=null,cwt=0;
  SS.onCmd=f=>{cmdSubs.push(f);pendC.splice(0).forEach(m=>{try{f(m.t,m.d)}catch(e){console.error(e)}})};
  function copen(){W.clearTimeout(cwt);let w;try{w=new WebSocket(WU+'/'+encodeURIComponent(CODE+'-cmd')+'/ws?since='+(cLast?Math.max(CT0,cLast-3):CT0))}catch(e){cwt=W.setTimeout(copen,5000);return}
   cws=w;let alive=Date.now();
   const ck=W.setInterval(()=>{if(cws!==w){W.clearInterval(ck);return}if(Date.now()-alive>130000){W.clearInterval(ck);cws=null;w.onclose=null;try{w.close()}catch(e){}copen()}},20000);
   w.onopen=()=>{alive=Date.now()};
   w.onmessage=ev=>{alive=Date.now();let o,x;try{o=JSON.parse(ev.data);if(o.event!=='message')return;x=JSON.parse(o.message)}catch(e){return}
    if(o.time>cLast)cLast=o.time;if(!x||x.v!==3||!x.id||seenC.has(x.id))return;seenC.add(x.id);if(seenC.size>300)seenC.delete(seenC.values().next().value);
    if(!cmdSubs.length){pendC.push(x);return}cmdSubs.forEach(f=>{try{f(x.t,x.d)}catch(e){console.error(e)}})};
   w.onclose=()=>{W.clearInterval(ck);if(cws===w)cwt=W.setTimeout(copen,3000)}}
  addEventListener('online',()=>{if(cws){cws.onclose=null;try{cws.close()}catch(e){}cws=null}copen()});
  copen();
 }

 /* ===== PANEL: publica los cambios ===== */
 function publisher(o){
  let st={on:1,code:''};try{Object.assign(st,JSON.parse(localStorage.getItem(o.skey)))}catch(e){}
  if(!st.code)st.code=newCode();
  const sv=()=>{try{localStorage.setItem(o.skey,JSON.stringify(st))}catch(e){}};sv();
  const say=t=>{try{o.onStatus&&o.onStatus(t)}catch(e){}},SK='saylerPub:'+st.code;
  const loadSent=()=>{try{return JSON.parse(localStorage.getItem(SK))||{}}catch(e){return{}}},saveSent=s=>{try{localStorage.setItem(SK,JSON.stringify(s))}catch(e){}};
  const collect=()=>{const b={};o.keys.concat(['sayler-mods']).forEach(k=>{try{const v=localStorage.getItem(k);if(v!=null)b[k]=v}catch(e){}});return b};
  async function post(body){for(let a=0;a<8;a++){try{const r=await fetch(HU+'/'+encodeURIComponent(st.code),{method:'POST',body});if(r.ok)return;if(r.status!==429&&r.status<500)break}catch(e){}await sleep(a<2?2500:6000)}throw new Error('post')}
  async function parts(t,id,text,label){const n=Math.ceil(text.length/SZ);for(let i=0;i<n;i++){if(label&&n>6&&i%6===0)say(label+' ('+i+'/'+n+')');await post(JSON.stringify({v:2,t,id,i,n,d:text.slice(i*SZ,(i+1)*SZ)}))}}
  /* órdenes al enlace: en fila (llegan en orden) y con reintentos hasta que ntfy las acepta */
  let cq=Promise.resolve();
  async function postCmd(body){const tp=HU+'/'+encodeURIComponent(st.code+'-cmd'),dl=[300,700,1500,3000,5000,8000];for(let a=0;a<=dl.length;a++){try{const r=await fetch(tp,{method:'POST',body});if(r.ok)return true;if(r.status!==429&&r.status<500)return false}catch(e){}if(a<dl.length)await sleep(dl[a])}return false}
  const cmd=(t,d)=>{if(!st.on)return;const body=JSON.stringify({v:3,id:Math.random().toString(36).slice(2)+Date.now().toString(36),t,d,ts:Date.now()});
   if(body.length>3800){say('⚠ Esa orden pesa demasiado para viajar al enlace');return}
   cq=cq.then(()=>postCmd(body)).then(ok=>{if(!ok)say('⚠ No pude mandar la orden al enlace (¿sin internet?)')}).catch(()=>{})};
  let lastTxt='',busy=0,timer=0;
  const soon=now=>{W.clearTimeout(timer);if(!st.on)return;timer=W.setTimeout(()=>pubNow(now),now?200:600)};
  async function pubNow(force){if(!st.on||busy)return;const media={},sk={n:0},txt=JSON.stringify(strip(collect(),media,sk)),sent=loadSent(),now=Date.now();
   const need=Object.keys(media).filter(h=>!sent[h]||now-sent[h]>6*36e5);
   if(txt===lastTxt&&!force&&!need.length)return;busy=1;let ok=0;const skipped=sk.n;
   try{let i=0;for(const h of need){i++;await parts('m',h,media[h],'⏳ Subiendo imagen '+i+' de '+need.length);sent[h]=Date.now();saveSent(sent)}
    await parts('c',Date.now(),await zipTxt(txt));lastTxt=txt;ok=1;
    say('✔ Enlace al día · '+new Date().toLocaleTimeString()+(skipped?' · ⚠ '+skipped+' imagen(es) pesan demasiado (más de ~220 KB) y no viajan por el enlace: usa una más liviana':''))}
   catch(e){say('⚠ No pude actualizar el enlace (¿sin internet?). Lo intento otra vez en un momento.');W.clearTimeout(timer);timer=W.setTimeout(()=>pubNow(),30000)}
   busy=0;if(ok&&JSON.stringify(strip(collect(),{}))!==lastTxt)soon()}
  return{get on(){return st.on},get code(){return st.code},cmd,changed:()=>soon(),start:()=>soon(true),
   setOn(v){st.on=v?1:0;sv();if(st.on)soon(true);else say('Enlace fijo apagado: el enlace usa la copia de config/respaldo.json.')}}}

 let cur=null;SS.changed=()=>{if(cur)cur.changed()};SS.cmd=(t,d)=>{if(cur)cur.cmd(t,d)};
 SS.mount=function(el,o){if(!el||LIVE)return null;
  if(!document.getElementById('synCss')){const c=document.createElement('style');c.id='synCss';
   c.textContent='.synbox{margin-top:16px;padding:14px 16px;border:1px dashed rgba(247,240,255,.4);border-radius:18px;text-align:left}.synlb{display:flex;gap:8px;align-items:center;font-weight:700;cursor:pointer}.synrow{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap}.synrow input{flex:1;min-width:160px;background:rgba(255,255,255,.1);color:inherit;border:1px solid rgba(247,240,255,.28);border-radius:12px;padding:8px 10px;font:600 .85rem Quicksand,sans-serif}.synhelp{font-size:.85rem;opacity:.75;line-height:1.5;margin:10px 0 0}body.mini .synbox{display:none}.synmsg{margin:8px 0 0;min-height:1.2em;color:var(--blush,#f4b3d6);font-weight:600;font-size:.9rem}';
   document.head.appendChild(c)}
  el.innerHTML='<div class="synbox"><label class="synlb"><input type="checkbox" class="synck"><span>🔗 Enlace fijo: se actualiza solo (no hay que volver a copiarlo)</span></label><div class="synrow"><input type="text" readonly class="synurl"><button type="button" class="ghost sycp">📋 Copiar enlace</button></div><p class="synhelp">Cópialo una sola vez en OBS o TikTok LIVE Studio. Todo lo que cambies aquí le llega solo, mientras tengas esta página abierta. La configuración pasa unas horas por ntfy.sh (el mismo servicio de los overlays) y quien tenga el enlace podría verla. Las imágenes grandes se suben una sola vez. Si lo desmarcas, el enlace usa la copia de <code>config/respaldo.json</code>.</p><p class="synmsg"></p></div>';
  const q=s=>el.querySelector(s),ck=q('.synck'),url=q('.synurl'),msg=q('.synmsg');
  const P=publisher({...o,onStatus:t=>{msg.textContent=t}});cur=P;
  const base=location.href.split('#')[0],draw=()=>{url.value=base+'#live'+(P.on?'&s='+encodeURIComponent(P.code):'')};
  const upGo=()=>{try{P.on?SaylerUp.panel(P.code):SaylerUp.stop()}catch(e){}};upGo();
  ck.checked=!!P.on;draw();ck.onchange=()=>{P.setOn(ck.checked);draw();upGo()};
  q('.sycp').onclick=e=>{const b=e.currentTarget;try{navigator.clipboard.writeText(url.value)}catch(x){url.select();document.execCommand('copy')}b.textContent='✔ Copiado';W.setTimeout(()=>b.textContent='📋 Copiar enlace',1500)};
  P.start();return P};
})();

/* 6) Interruptores por módulo + canal «arriba» (enlace → panel).
      - SaylerMods: apaga/enciende cada módulo (metas, barra, contador, tiempo, eventos, bebé, ruleta). Apagado = no se conecta, no cuenta, no se ve.
      - SaylerUp: el ENLACE (OBS/TikTok) es el único motor que cuenta; publica su estado por ntfy con pocos mensajes
        (en lote, con freno si ntfy.sh pone límite) y el PANEL solo lo espeja. Así la vista previa muestra lo mismo que el enlace
        y nada se cuenta doble. Si el enlace se apaga, el panel retoma con el último estado y el enlace al volver toma el más nuevo. */
(function(){
 const MK='sayler-mods',ID=['metas','barra','cont','time','ev','bebe','ruleta'],fl=[];
 const M=window.SaylerMods={ids:ID,
  all(){let o={};try{o=JSON.parse(localStorage.getItem(MK))||{}}catch(e){}return o},
  on(id){const v=M.all()[id];return !(v===0||v===false)},
  set(id,v){const o=M.all();o[id]=v?1:0;try{localStorage.setItem(MK,JSON.stringify(o))}catch(e){}return o},
  setAll(o){const c=M.all();ID.forEach(k=>{if(o&&o[k]!=null)c[k]=o[k]?1:0});try{localStorage.setItem(MK,JSON.stringify(c))}catch(e){}return c},
  watch(f){fl.push(f)},fire(){fl.forEach(f=>{try{f()}catch(e){console.error(e)}})}};
 addEventListener('storage',e=>{if(e.key===MK)M.fire()});
 addEventListener('message',e=>{const d=e.data;if(d&&d.t==='mods'){M.fire();try{window.SaylerSync&&SaylerSync.changed()}catch(x){}}});
})();

(function(){
 const W=window.__W,H=window.__SYNC_HOST||'ntfy.sh',web=/^https?:\/\//.test(H),HU=web?H:'https://'+H,WU=web?H.replace(/^http/,'ws'):'wss://'+H;
 const DEV=Math.random().toString(36).slice(2,9),ALIVE=9*60e3,HB=4*60e3,SZ=2800,ADOPT=4500;
 const sleep=ms=>new Promise(r=>W.setTimeout(r,ms));
 const b64=u=>{let s='';for(let i=0;i<u.length;i+=0x8000)s+=String.fromCharCode.apply(null,u.subarray(i,i+0x8000));return btoa(s)},unb64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
 async function zip(t){try{if(window.CompressionStream){const r=await new Response(new Blob([t]).stream().pipeThrough(new CompressionStream('deflate'))).arrayBuffer();return 'z'+b64(new Uint8Array(r))}}catch(e){}return 'p'+btoa(unescape(encodeURIComponent(t)))}
 async function unzip(s){if(s[0]=='z')return await new Response(new Blob([unb64(s.slice(1))]).stream().pipeThrough(new DecompressionStream('deflate'))).text();return decodeURIComponent(escape(atob(s.slice(1))))}
 let role='',CODE='',ws=null,wt=0,wopen=0,lastT=0,aliveAt=0,byeAt=0,wasAlive=false,status='',ready=0,adoptOn=0,hbT=0,adT=0,bootF=0,hbF=0;
 const prov={},hand={},alL=[],stL=[],G={},snapSeen={},evSeen=new Map(),seedSeen=new Set(),best={},posts=[];
 let dirty={},qEv=[],qJob=[],qSpin=[],pubT=0,lastPub=0,busy=0,hold=0;
 const stat=t=>{if(status===t)return;status=t;stL.forEach(f=>{try{f(t)}catch(e){}})};
 const safe=(p)=>{try{return p.get()}catch(e){return null}};
 const alive=()=>role==='panel'&&aliveAt>byeAt&&Date.now()-aliveAt<ALIVE;
 function chkAlive(){const a=alive();if(a!==wasAlive){wasAlive=a;alL.forEach(f=>{try{f(a)}catch(e){console.error(e)}})}}
 W.setInterval(chkAlive,15000);

 /* ---- salida ---- */
 async function post(body){const u=HU+'/'+encodeURIComponent(CODE+'-up');
  for(let a=0;a<4;a++){try{const r=await fetch(u,{method:'POST',body});if(r.ok){posts.push(Date.now());return true}if(r.status===429){hold=Date.now()+10*60e3;stat('limit');return false}if(r.status<500)return false}catch(e){}await sleep([700,1500,3000][a]||5000)}return false}
 async function sendB(B){B.r=role;B.dev=DEV;const z=await zip(JSON.stringify(B)),n=Math.ceil(z.length/SZ),m=DEV+Date.now().toString(36);
  for(let i=0;i<n;i++){if(!await post(JSON.stringify({v:5,m,i,n,d:z.slice(i*SZ,(i+1)*SZ)})))return false}lastPub=Date.now();return true}
 /* freno: normal 1 mensaje cada 12 s (30 s tras 25 en la hora); si ya se mandaron muchos en la última hora se espacia más (ntfy.sh gratis tiene un tope diario) */
 const gap=()=>{const t=Date.now();while(posts.length&&posts[0]<t-36e5)posts.shift();const n=posts.length;return n>90?240e3:n>50?90e3:n>25?30e3:12e3};
 function plan(u){if(role!=='link'||!ready)return;W.clearTimeout(pubT);const t=Date.now(),w=Math.max(hold-t,u?Math.max(0,lastPub+1500-t):Math.max(0,lastPub+gap()-t),u?300:3000);pubT=W.setTimeout(flush,w)}
 async function flush(){if(role!=='link'||busy)return;if(hold>Date.now()){plan();return}
  busy=1;const B={},keys=Object.keys(dirty);dirty={};
  keys.forEach(k=>{const p=prov[k];if(!p)return;const g=safe(p);if(g){B.st=B.st||{};B.st[k]={at:g.at||0,d:g.d,snap:Date.now()}}});
  if(qEv.length)B.ev=qEv.splice(0,40);if(qJob.length)B.job=qJob.splice(0);if(qSpin.length)B.spin=qSpin.splice(0);
  if(B.st){if(bootF){B.boot=1;bootF=0}if(hbF){B.hb=1;hbF=0}}
  if(B.st||B.ev||B.job||B.spin){let ok=false;try{ok=await sendB(B)}catch(e){}
   if(ok)stat('ok');else{keys.forEach(k=>dirty[k]=1);stat(hold>Date.now()?'limit':'error')}}
  busy=0;if(Object.keys(dirty).length||qEv.length)plan()}
 const dirtyAll=()=>Object.keys(prov).forEach(k=>dirty[k]=1);

 /* ---- entrada ---- */
 function open(){W.clearTimeout(wt);if(!CODE)return;let w;
  try{w=new WebSocket(WU+'/'+encodeURIComponent(CODE+'-up')+'/ws?since='+(lastT?Math.max(0,lastT-30):'12h'))}catch(e){wt=W.setTimeout(open,5000);return}
  ws=w;let al=Date.now();if(!wopen)wopen=Date.now();
  const ck=W.setInterval(()=>{if(ws!==w){W.clearInterval(ck);return}if(Date.now()-al>130000){W.clearInterval(ck);ws=null;w.onclose=null;try{w.close()}catch(e){}open()}},20000);
  w.onopen=()=>{al=Date.now()};w.onmessage=ev=>{al=Date.now();onMsg(ev)};
  w.onclose=()=>{W.clearInterval(ck);if(ws===w)wt=W.setTimeout(open,3000)}}
 addEventListener('online',()=>{if(!CODE)return;if(ws){ws.onclose=null;try{ws.close()}catch(e){}ws=null}open()});
 async function onMsg(ev){let o,x;try{o=JSON.parse(ev.data);if(o.event!=='message')return;x=JSON.parse(o.message)}catch(e){return}
  if(!x||x.v!==5||!(x.n>0))return;if(o.time>lastT)lastT=o.time;
  const g=G[x.m]||(G[x.m]={n:x.n,p:{},done:0});if(g.done)return;g.p[x.i]=x.d;if(Object.keys(g.p).length<g.n)return;g.done=1;
  const s=Array.from({length:g.n},(_,i)=>g.p[i]).join('');g.p=null;const ks=Object.keys(G);if(ks.length>80)delete G[ks[0]];
  let B;try{B=JSON.parse(await unzip(s))}catch(e){return}if(!B||B.dev===DEV)return;handle(B,(o.time||0)*1000)}
 function seedOut(k,cur){const key=k+':'+cur.at;if(seedSeen.has(key))return;seedSeen.add(key);sendB({seed:{k,at:cur.at,d:cur.d}}).catch(()=>{})}
 function handle(B,tm){
  const fresh=tm>wopen-25e3;
  if(role==='panel'&&B.r==='link'){
   if(B.bye)byeAt=Math.max(byeAt,tm);else aliveAt=Math.max(aliveAt,tm);chkAlive();
   if(B.st)for(const k in B.st){const p=prov[k],x=B.st[k];if(!p||!x)continue;const cur=safe(p);
    if(B.boot&&fresh&&cur&&(cur.at||0)>(x.at||0)+500){seedOut(k,cur);continue}
    if((x.snap||0)>(snapSeen[k]||0)){snapSeen[k]=x.snap||0;if(!cur||alive()||(x.at||0)>=(cur.at||0)){try{p.set(x.at||0,x.d,{live:true})}catch(e){console.error(e)}}}}
   if(fresh){['ev','job','spin'].forEach(t=>{if(B[t]&&hand[t])B[t].forEach(e=>{
     if(t==='ev'){const sg=[e.p,e.k,e.n,e.v,e.x].join('|'),pr=evSeen.get(sg);if(pr&&tm-pr<6000)return;evSeen.set(sg,tm);if(evSeen.size>200)evSeen.delete(evSeen.keys().next().value)}
     hand[t].forEach(f=>{try{f(e)}catch(x){console.error(x)}})})})}
  }
  if(role==='link'){
   if(B.seed){const p=prov[B.seed.k],cur=p&&safe(p);if(p&&(B.seed.at||0)>((cur&&cur.at)||0)){try{p.set(B.seed.at,B.seed.d,{seed:true})}catch(e){console.error(e)}}}
   else if(adoptOn&&B.r==='link'&&B.st)for(const k in B.st){const x=B.st[k];if(x&&(!best[k]||(x.at||0)>best[k].at))best[k]={at:x.at||0,d:x.d}}}}
 function finishAdopt(){adoptOn=0;for(const k in best){const p=prov[k];if(!p)continue;const cur=safe(p);if(best[k].at>((cur&&cur.at)||0)){try{p.set(best[k].at,best[k].d,{boot:true})}catch(e){console.error(e)}}}}
 function stop(){W.clearTimeout(wt);W.clearTimeout(pubT);W.clearInterval(hbT);if(ws){ws.onclose=null;try{ws.close()}catch(e){}ws=null}role='';CODE='';ready=0;adoptOn=0;aliveAt=byeAt=0;wopen=0;lastT=0;chkAlive()}
 addEventListener('pagehide',()=>{if(role!=='link'||!CODE)return;try{fetch(HU+'/'+encodeURIComponent(CODE+'-up'),{method:'POST',keepalive:true,body:JSON.stringify({v:5,m:'b'+DEV,i:0,n:1,d:'p'+btoa(JSON.stringify({r:'link',dev:DEV,bye:1}))})})}catch(e){}});

 const SU=window.SaylerUp={dev:DEV,
  link(code){if(!code||(role==='link'&&CODE===code))return;stop();role='link';CODE=code;open();adoptOn=1;
   W.setTimeout(()=>{if(role!=='link'||CODE!==code)return;finishAdopt();ready=1;bootF=1;dirtyAll();plan();hbT=W.setInterval(()=>{hbF=1;dirtyAll();plan()},HB)},ADOPT)},
  panel(code){if(!code||(role==='panel'&&CODE===code))return;stop();role='panel';CODE=code;open()},
  stop,provide(k,p){prov[k]=p},
  dirty(k,u){if(role!=='link'||!prov[k])return;dirty[k]=1;plan(u)},
  send(t,d){if(role!=='link'||!ready)return;(t==='ev'?qEv:t==='job'?qJob:qSpin).push(d);plan(t!=='ev')},
  on(t,f){(hand[t]=hand[t]||[]).push(f)},onAlive(f){alL.push(f)},onStatus(f){stL.push(f)},
  alive,role:()=>role,status:()=>status,mirror:()=>role==='panel'&&alive()};
})();
