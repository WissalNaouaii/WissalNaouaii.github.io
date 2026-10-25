(() => {
const $ = s => document.querySelector(s);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;

/* ---------- 2. dials driven by scroll ---------- */
const BDA='var(--accent-dim)', BDM='color-mix(in srgb,var(--paper) 18%,transparent)', BDL='color-mix(in srgb,var(--paper) 11%,transparent)', M='var(--mono)', SA='var(--sans)';
const S=[null,
 {v:1,ts:0, r:0, bevel:0,sh:0, hard:0,gloss:0, glass:0, lift:2, scan:.30,glow:.8, dither:.85,bd:BDA,tbfg:'var(--accent-hi)',rdf:M},
 {v:2,ts:0, r:0, bevel:0,sh:0, hard:1,gloss:0, glass:0, lift:4, scan:.22,glow:.5, dither:.7, bd:BDA,tbfg:'var(--accent-hi)',rdf:M},
 {v:3,ts:.3,r:0, bevel:1,sh:0, hard:1,gloss:0, glass:0, lift:5, scan:.15,glow:.3, dither:.5, bd:BDA,tbfg:'var(--accent-hi)',rdf:SA},
 {v:4,ts:1, r:1, bevel:2,sh:4, hard:0,gloss:0, glass:0, lift:6, scan:.09,glow:.15,dither:.32,bd:BDM,tbfg:'var(--on-accent)',rdf:SA},
 {v:5,ts:1, r:3, bevel:1,sh:10,hard:0,gloss:0, glass:0, lift:7, scan:.05,glow:.06,dither:.2, bd:BDM,tbfg:'var(--on-accent)',rdf:SA},
 {v:6,ts:1, r:6, bevel:0,sh:18,hard:0,gloss:.6,glass:0, lift:8, scan:.02,glow:.02,dither:.1, bd:BDL,tbfg:'var(--on-accent)',rdf:SA},
 {v:7,ts:1, r:8, bevel:0,sh:24,hard:0,gloss:.25,glass:1,lift:9, scan:0,  glow:0,  dither:.03,bd:BDL,tbfg:'var(--on-accent)',rdf:SA},
 {v:8,ts:1, r:12,bevel:0,sh:30,hard:0,gloss:.1,glass:.5,lift:10,scan:0,  glow:0,  dither:0,  bd:BDL,tbfg:'var(--on-accent)',rdf:SA}];
const NUM=['ts','r','bevel','sh','hard','gloss','glass','lift','scan','glow','dither'], STR=['bd','tbfg','rdf'];
const secs=[...document.querySelectorAll('.sec')];
const names=['About','Education','Projects','Achievements','Certs','Experience','Skills','Contact'];
$('#tasks').innerHTML=secs.map((s,k)=>`<a href="#${s.id}" data-i="${k+1}">${names[k]}</a>`).join('');
const links=[...document.querySelectorAll('.tasks a')];
let lastI=0;
function dials(){
  const mid=scrollY+innerHeight*.5; let i=1,f=0;
  for(let k=0;k<secs.length;k++){
    const top=secs[k].offsetTop, nxt=k+1<secs.length?secs[k+1].offsetTop:Infinity;
    if(mid>=top||k===0){ i=k+1; f = nxt===Infinity ? 0 : Math.max(0,Math.min(1,((mid-top)/(nxt-top)-.6)/.4)); }
  }
  if(scrollY+innerHeight>=document.documentElement.scrollHeight-4){i=8;f=0;}
  if(i>=8){i=8;f=0;}
  const A=S[i], B=S[Math.min(8,i+1)];
  NUM.forEach(k=>root.style.setProperty('--'+k,(A[k]+(B[k]-A[k])*f).toFixed(3)));
  const near=f>.5?B:A; STR.forEach(k=>root.style.setProperty('--'+k,near[k]));
  $('#ver').textContent='WISS-OS v'+(A.v+(B.v-A.v)*f).toFixed(1);
  if(i!==lastI){ lastI=i; links.forEach(a=>{const on=+a.dataset.i===i; a.classList.toggle('on',on); on?a.setAttribute('aria-current','true'):a.removeAttribute('aria-current');}); }
}
let tick=false;
addEventListener('scroll',()=>{ if(!tick){ tick=true; requestAnimationFrame(()=>{dials(); tick=false;}); } },{passive:true});
addEventListener('resize',dials); addEventListener('load',dials); dials();

/* ---------- 3. portrait: dithered first, then sharp ---------- */
const BAYER=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]];
const pImg=$('#portraitImg'), pCv=$('#portraitDither'), portrait=$('#portrait');
function ditherPortrait(){
  const w=72, h=96; pCv.width=w; pCv.height=h;
  const c=pCv.getContext('2d');
  const ir=pImg.naturalWidth/pImg.naturalHeight, cr=w/h;
  let sw=pImg.naturalWidth, sh=pImg.naturalHeight, sx=0, sy=0;
  if(ir>cr){ sw=sh*cr; sx=(pImg.naturalWidth-sw)/2; } else { sh=sw/cr; sy=(pImg.naturalHeight-sh)/2; }
  c.drawImage(pImg,sx,sy,sw,sh,0,0,w,h);
  const d=c.getImageData(0,0,w,h), px=d.data;
  for(let y=0;y<h;y++) for(let x=0;x<w;x++){
    const i=(y*w+x)*4, l=(.299*px[i]+.587*px[i+1]+.114*px[i+2])/255;
    const on = l > (BAYER[y%4][x%4]+.5)/16;
    px[i]=on?140:9; px[i+1]=on?157:9; px[i+2]=on?245:12; px[i+3]=255;
  }
  c.putImageData(d,0,0);
}
let revealed=false;
function revealPortrait(){ if(revealed) return; revealed=true; setTimeout(()=>portrait.classList.add('sharp'), reduced?0:900); }
const safeDither=()=>{ try{ ditherPortrait(); }catch(_){ portrait.classList.add('sharp'); } }; // file:// blocks pixel reads: just show the photo
if(pImg.complete && pImg.naturalWidth) safeDither(); else pImg.addEventListener('load',safeDither);

/* ---------- 4. certificate carousel ---------- */
(() => {
  const tr=$('#track'); if(!tr) return;
  const sl=[...tr.children], dotsBox=$('#dots'), cnt=$('#cnt'), st=$('#certSt');
  dotsBox.innerHTML=sl.map((_,k)=>`<button type="button" aria-label="Certificate ${k+1}"${k===0?' aria-current="true"':''}></button>`).join('');
  const dots=[...dotsBox.children]; let cur=0;
  const go=k=>{ k=(k+sl.length)%sl.length; tr.scrollTo({left:sl[k].offsetLeft-sl[0].offsetLeft, behavior:reduced?'auto':'smooth'}); };
  const upd=()=>{
    const step=sl.length>1?(sl[1].offsetLeft-sl[0].offsetLeft):1;
    const k=Math.max(0,Math.min(sl.length-1,Math.round(tr.scrollLeft/step)));
    if(k===cur) return; cur=k;
    dots.forEach((d,j)=>j===cur?d.setAttribute('aria-current','true'):d.removeAttribute('aria-current'));
    cnt.textContent=`${cur+1} / ${sl.length}`; st.textContent=`CERT_0${cur+1}.DOC`;
  };
  tr.addEventListener('scroll',()=>requestAnimationFrame(upd),{passive:true});
  $('#cprev').addEventListener('click',()=>go(cur-1));
  $('#cnext').addEventListener('click',()=>go(cur+1));
  dots.forEach((d,j)=>d.addEventListener('click',()=>go(j)));
  tr.addEventListener('keydown',e=>{ if(e.key==='ArrowRight'){e.preventDefault();go(cur+1);} if(e.key==='ArrowLeft'){e.preventDefault();go(cur-1);} });
  sl.forEach((s,j)=>s.addEventListener('click',e=>{ if(j!==cur && !e.target.closest('a')) go(j); }));
  cnt.textContent=`1 / ${sl.length}`;
})();

/* ---------- 5. contact ---------- */
const form=$('#form'), sent=$('#sent');
form.addEventListener('submit',async e=>{
  e.preventDefault();
  const key=form.querySelector('[name=access_key]').value.trim();
  const name=$('#fn').value, email=$('#fe').value, msg=$('#fm').value;
  if(!key){ 
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=wissalnaouaii@gmail.com&su=${encodeURIComponent('Portfolio message from '+name)}&body=${encodeURIComponent(msg+'\n\n— '+name+' ('+email+')')}`,'_blank','noopener');
    sent.hidden=false; sent.textContent='Opening Gmail… or email wissalnaouaii@gmail.com directly.'; return;
  }
  sent.hidden=false; sent.textContent='Sending…';
  try{
    const r=await fetch(form.action,{method:'POST',headers:{Accept:'application/json'},body:new FormData(form)});
    const j=await r.json();
    if(j.success){ sent.textContent='Message sent. Thank you!'; form.reset(); }
    else sent.textContent='Could not send. Please email wissalnaouaii@gmail.com directly.';
  }catch(_){ sent.textContent='Could not send. Please email wissalnaouaii@gmail.com directly.'; }
});
document.querySelectorAll('.copy').forEach(b=>b.addEventListener('click',()=>{
  const t=b.dataset.c, done=()=>{b.textContent='Copied';setTimeout(()=>b.textContent='Copy',1200);};
  try{ navigator.clipboard.writeText(t).then(done,()=>{b.textContent='Select';}); }catch(_){ b.textContent='Select'; }
}));

/* ---------- 1. BOOT ---------- */
const boot=$('#boot'), blog=$('#blog'), cv=$('#lidar'), prog=$('#prog'), pct=$('#pct');
prog.innerHTML='<i></i>'.repeat(24); const segs=[...prog.children];
const nEdu=document.querySelectorAll('#education .tl-item').length, nProj=document.querySelectorAll('#projects .projs > .win').length,
      nAw=document.querySelectorAll('#achievements .ach > .win').length, nCert=document.querySelectorAll('#track .slide').length;
const pad=s=>s.padEnd(22,' ');
const LOG=[
 ['WISS-OS v0.9 · POWER-ON SELF TEST',null],['',null],
 ['CPU ......... C/C++ · PYTHON        ','OK'],
 ['MEM ......... '+pad(nEdu+' SCHOOLS INDEXED'),'OK'],
 ['DRV ......... ROS BRIDGE            ','OK'],
 ['DRV ......... VISION MODULE         ','OK'],
 ['DSK ......... '+pad(nProj+' PROJECTS FOUND'),'OK'],
 ['DSK ......... '+pad(nAw+' AWARDS FOUND'),'OK'],
 ['SEC ......... '+pad(nCert+' CERTIFICATES'),'VERIFIED'],['',null],
 ['LIDAR ....... SCANNING OPERATOR',null]];
let run=0, timers=[], rafId=null;
const later=(fn,ms)=>timers.push(setTimeout(fn,ms));
const setProg=p=>{const n=Math.round(p*segs.length); segs.forEach((s,k)=>s.classList.toggle('f',k<n)); pct.textContent=Math.round(p*100)+'%';};
const skipKeys=e=>{ if(e.type==='keydown'&&['Tab','Shift','Alt','Meta','Control'].includes(e.key)) return; finish(); };
function addSkips(){ addEventListener('keydown',skipKeys); addEventListener('wheel',skipKeys,{passive:true}); addEventListener('touchmove',skipKeys,{passive:true}); boot.addEventListener('click',skipKeys); }
function removeSkips(){ removeEventListener('keydown',skipKeys); removeEventListener('wheel',skipKeys); removeEventListener('touchmove',skipKeys); boot.removeEventListener('click',skipKeys); }
function finish(){
  if(boot.classList.contains('done')) return;
  timers.forEach(clearTimeout); timers=[]; cancelAnimationFrame(rafId);
  setProg(1); boot.classList.add('done'); document.body.classList.remove('booting');
  setTimeout(()=>{ boot.hidden=true; },600); removeSkips(); revealPortrait(); dials();
  try{ sessionStorage.setItem('wissos-booted','1'); }catch(_){}
}
function lidar(onDone){
  const dpr=Math.min(2,devicePixelRatio||1), W=cv.clientWidth, H=cv.clientHeight;
  cv.width=W*dpr; cv.height=H*dpr; const c=cv.getContext('2d'); c.setTransform(dpr,0,0,dpr,0,0);
  const off=document.createElement('canvas'), ow=Math.max(320,W), oh=Math.max(120,H); off.width=ow; off.height=oh;
  const o=off.getContext('2d'), fs=Math.min(ow/8.2,oh*.42);
  o.fillStyle='#fff'; o.textAlign='center'; o.textBaseline='middle';
  o.font=`600 ${fs}px "IBM Plex Mono", monospace`; o.fillText('WISSAL',ow/2,oh*.32);
  o.font=`600 ${fs*.62}px "IBM Plex Mono", monospace`; o.fillText('NAOUAII',ow/2,oh*.72);
  const d=o.getImageData(0,0,ow,oh).data, pts=[], step=Math.max(3,Math.round(fs/22));
  for(let y=0;y<oh;y+=step) for(let x=0;x<ow;x+=step) if(d[(y*ow+x)*4+3]>128) pts.push({x:x*W/ow,y:y*H/oh,j:Math.random()});
  const noise=Array.from({length:140},()=>({x:Math.random()*W,y:Math.random()*H,a:Math.random()}));
  const T=1500, t0=performance.now();
  const frame=now=>{
    const t=Math.min(1,(now-t0)/T), sx=t*W*1.15;
    c.clearRect(0,0,W,H);
    c.strokeStyle='rgba(51,81,230,.18)'; c.lineWidth=1;
    for(let r=1;r<=4;r++){ c.beginPath(); c.arc(W/2,H*1.05,r*H*.32,Math.PI,2*Math.PI); c.stroke(); }
    noise.forEach(p=>{ if(p.x<sx){ c.fillStyle=`rgba(140,157,245,${.25*p.a*(1-t*.7)})`; c.fillRect(p.x,p.y,1.5,1.5);} });
    c.fillStyle='#8C9DF5'; c.shadowColor='#3351E6'; c.shadowBlur=8;
    pts.forEach(p=>{ if(p.x<sx){ const age=Math.min(1,(sx-p.x)/(W*.25)); c.fillRect(p.x+(1-age)*(p.j-.5)*14,p.y,2,2);} });
    c.shadowBlur=0;
    if(t<1){ const g=c.createLinearGradient(sx-60,0,sx,0); g.addColorStop(0,'rgba(140,157,245,0)'); g.addColorStop(1,'rgba(140,157,245,.55)'); c.fillStyle=g; c.fillRect(sx-60,0,60,H); c.fillStyle='#C9D1FF'; c.fillRect(sx,0,1.5,H); }
    setProg(.62+.33*t);
    if(t<1) rafId=requestAnimationFrame(frame); else onDone();
  };
  rafId=requestAnimationFrame(frame);
}
function startBoot(){
  run++; const my=run;
  timers.forEach(clearTimeout); timers=[]; cancelAnimationFrame(rafId);
  boot.hidden=false; boot.classList.remove('done'); document.body.classList.add('booting');
  const tube=boot.querySelector('.tube'); tube.style.animation='none'; void tube.offsetWidth; tube.style.animation='';
  blog.innerHTML=''; setProg(0); cv.getContext('2d').clearRect(0,0,cv.width,cv.height);
  scrollTo({top:0,behavior:'auto'});
  if(reduced){ blog.textContent=LOG.map(l=>l[0]+(l[1]?`[ ${l[1]} ]`:'')).join('\n'); setProg(1); later(finish,900); return; }
  setTimeout(addSkips,250);
  let t=650;
  LOG.forEach((l,k)=>{
    later(()=>{ if(my!==run) return; const line=document.createElement('div'); line.textContent=l[0]||' '; blog.appendChild(line); setProg(.6*(k+1)/LOG.length);
      if(l[1]) later(()=>{ const s=document.createElement('span'); s.className='ok'; s.textContent=`[ ${l[1]} ]`; line.appendChild(s); },90);
    },t); t+=l[0]?150:60;
  });
  later(()=>{ if(my!==run) return; lidar(()=>{
    const a=document.createElement('div'); a.innerHTML='OPERATOR IDENTIFIED: WISSAL NAOUAII <span class="ok">[ OK ]</span>'; blog.appendChild(a);
    const b=document.createElement('div'); b.innerHTML='&gt; whoami<span class="cur">█</span>'; blog.appendChild(b);
    setProg(1); later(finish,850);
  }); }, t+80);
}
$('#skip').addEventListener('click',e=>{ e.stopPropagation(); finish(); });
$('#reboot').addEventListener('click',startBoot);
$('#reboot2').addEventListener('click',startBoot);

let seen=false; try{ seen=sessionStorage.getItem('wissos-booted')==='1'; }catch(_){}
if(seen || location.hash){ finish(); boot.hidden=true; }
else (document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(startBoot);
})();
