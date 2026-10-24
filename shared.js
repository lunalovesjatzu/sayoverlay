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
 if(hs==='#live'){document.documentElement.classList.add('live');const s=document.createElement('style');
  s.textContent='html.live,html.live body{background:transparent!important}html.live .stage{background:transparent!important;outline:none!important}';document.documentElement.appendChild(s)}
 /* el hub cambia entre vista completa y mini (dock del bebé) */
 addEventListener('message',e=>{const d=e.data;if(d&&d.sayMode)document.body.classList.toggle('mini',d.sayMode==='mini')});
 /* 4) Configuración local: mismas claves de siempre + respaldo */
 const PFX=/^(ovl|angelito-sayler|ruleta-de-sayler)/,SKIP=/^(ovl-st-|ovlC)/;
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
