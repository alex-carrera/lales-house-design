const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const number=n=>new Intl.NumberFormat('es-EC',{maximumFractionDigits:2,minimumFractionDigits:2}).format(n);
export function planDocument(value){
 if(value?.version!==2||!Array.isArray(value.pages)||!value.pages.length||!Array.isArray(value.openings))throw Error('El documento de planos no tiene un formato válido.');
 const ids=new Set();
 for(const page of value.pages){
  if(!/^[a-z_]+$/.test(page.id)||ids.has(page.id)||typeof page.svg!=='string'||!Array.isArray(page.rows)||!Array.isArray(page.notes))throw Error('Faltan datos del plano.');
  ids.add(page.id);
 }
 return value;
}
export function safeSvg(source){
 const doc=new DOMParser().parseFromString(source,'image/svg+xml');
 const allowed=new Set(['svg','title','desc','g','path','rect','line','text','tspan','circle','ellipse','polygon','polyline']);
 if(doc.querySelector('parsererror')||doc.documentElement.localName!=='svg')throw Error('No se pudo leer el dibujo del plano.');
 for(const node of doc.querySelectorAll('*')){
  if(!allowed.has(node.localName))throw Error('El plano contiene elementos no permitidos.');
  for(const a of node.attributes)if(/^on/i.test(a.name)||['href','xlink:href','style'].includes(a.name)||/url\s*\(/i.test(a.value))throw Error('El plano contiene enlaces o estilos no permitidos.');
 }
 return document.importNode(doc.documentElement,true);
}
export function mountPlans(root){
 let data=null,sheet='',pending=false;
 const $=s=>root.querySelector(s);
 function toggle(){
  const svg=$('svg');if(!svg)return;
  svg.querySelectorAll('[data-plan-dimensions]').forEach(e=>e.setAttribute('visibility',$('[data-dimensions]').checked?'visible':'hidden'));
  svg.querySelectorAll('[data-plan-furniture]').forEach(e=>e.setAttribute('visibility',$('[data-furniture]').checked?'visible':'hidden'));
  $('[data-plan-drawing]').style.width=$('[data-plan-zoom]').value+'%';
  $('[data-plan-zoom-label]').textContent=$('[data-plan-zoom]').value+'%';
 }
 function draw(){
  const page=data.pages.find(p=>p.id===sheet);
  $('[data-plan-floor-title]').textContent=page.code+' · '+page.title;
  $('[data-plan-drawing]').replaceChildren(safeSvg(page.svg));
  $('[data-plan-rows]').innerHTML=page.rows.map(r=>`<div><dt>${esc(r.title)}</dt><dd><strong>${esc(r.dimensions)}</strong><small>${esc(r.note)}</small></dd></div>`).join('');
  $('[data-plan-notes]').innerHTML=page.notes.map(n=>`<li>${esc(n)}</li>`).join('');
  toggle();
 }
 async function load(){
  if(pending||data)return;pending=true;$('[data-plan-state]').textContent='Cargando planos…';$('[data-plan-retry]').hidden=true;
  try{
   const url=new URL('./planos/planos-obra.json',import.meta.url);url.search=new URL(import.meta.url).search;
   const response=await fetch(url);
   if(!response.ok)throw Error('No se pudieron cargar los planos. Revisa tu conexión y vuelve a intentar.');
   data=planDocument(await response.json());sheet=data.pages[0].id;
   $('[data-sheet]').innerHTML=data.pages.map(p=>`<option value="${esc(p.id)}">${esc(p.code+' · '+p.title)}</option>`).join('');
   $('[data-plan-revision]').textContent='Revisión '+data.revision;
   $('[data-plan-note]').textContent=data.measurementNote;
   $('[data-plan-changes]').innerHTML=data.changes.map(n=>`<li>${esc(n)}</li>`).join('');
   $('[data-plan-openings]').innerHTML=data.openings.map(o=>`<tr><td>${esc(o.id)}</td><td>${esc(o.floor)}</td><td>${number(o.width)} × ${number(o.height)}</td><td>${o.sill===null?'Por medir':number(o.sill)}</td></tr>`).join('');
   draw();$('[data-plan-state]').textContent='';$('[data-plan-content]').hidden=false;
  }catch(error){data=null;$('[data-plan-state]').textContent=error?.message||'No se pudieron cargar los planos.';$('[data-plan-retry]').hidden=false;}
  finally{pending=false;}
 }
 root.addEventListener('change',e=>{if(e.target.matches('[data-sheet]')){sheet=e.target.value;draw();}else toggle();});
 root.addEventListener('input',e=>{if(e.target.matches('[data-plan-zoom]'))toggle();});
 root.addEventListener('click',e=>{
  if(e.target.closest('[data-plan-retry]'))load();
  if(e.target.closest('[data-plan-print]'))window.print();
  if(e.target.closest('[data-plan-download]')&&data){
   const svg=$('svg').cloneNode(true),url=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)],{type:'image/svg+xml'}));
   const link=document.createElement('a');link.href=url;link.download=`casa-lales-${sheet}-${data.sourceSha256.slice(0,8)}.svg`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1500);
  }
 });
 return {load};
}
