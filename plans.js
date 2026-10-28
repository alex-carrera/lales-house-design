const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const number=n=>new Intl.NumberFormat('es-EC',{maximumFractionDigits:2,minimumFractionDigits:2}).format(n);
export function planDocument(value){
 if(value?.version!==3||!Array.isArray(value.pages)||!value.pages.length||!Array.isArray(value.openings)||!value.installations||!Number.isInteger(value.pdfPages))throw Error('El documento de planos no tiene un formato válido.');
 if(!['fixtures','circuits','outlets'].every(k=>Array.isArray(value.installations[k])))throw Error('Faltan los cuadros de instalaciones.');
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
 const groupNames={arquitectura:'Arquitectura',electricidad:'Electricidad',agua:'Agua fría y caliente',desagues:'Desagües y ventilación',lluvias:'Aguas lluvias',coordinacion:'Montantes y cuadros'};
 const defaultLegend=[{label:'Muros',tone:'muted'},{label:'Ventanas',tone:'cold'},{label:'Mobiliario',tone:'muted'},{label:'Cotas del modelo',tone:'dimension'}];
 function sheetOptions(){
  const group=$('[data-plan-group]').value,pages=data.pages.filter(p=>!group||p.discipline===group);
  $('[data-sheet]').innerHTML=pages.map(p=>`<option value="${esc(p.id)}">${esc(p.code+' · '+p.title)}</option>`).join('');
  if(!pages.some(p=>p.id===sheet))sheet=pages[0].id;
  $('[data-sheet]').value=sheet;
 }
 function toggle(){
  const svg=$('[data-plan-drawing] svg');if(!svg)return;
  svg.querySelectorAll('[data-plan-dimensions]').forEach(e=>e.setAttribute('visibility',$('[data-dimensions]').checked?'visible':'hidden'));
  svg.querySelectorAll('[data-plan-furniture]').forEach(e=>e.setAttribute('visibility',$('[data-furniture]').checked?'visible':'hidden'));
  $('[data-plan-drawing]').style.width=$('[data-plan-zoom]').value+'%';
  $('[data-plan-zoom-label]').textContent=$('[data-plan-zoom]').value+'%';
  printPages();
 }
 function printPages(){
  if(!data)return;
  const page=data.pages.find(p=>p.id===sheet),holder=$('[data-plan-print-pages]');
  const make=(tag,cls,text)=>{const node=document.createElement(tag);node.className=cls;if(text)node.textContent=text;return node;};
  const map=make('section','plan-print-map');
  map.dataset.orientation=page.schematic?'landscape':'portrait';
  const heading=make('header','plan-print-header');
  heading.append(make('h1','',page.code+' · '+page.title),make('p','','Casa Lales · Revisión '+data.revision),make('p','',page.schematic?'Esquema sin escala':'Metros · Impresión ajustada a la hoja; leer las cotas.'));
  const graphic=make('div','plan-print-graphic');graphic.append($('[data-plan-drawing] svg').cloneNode(true));map.append(heading,graphic);
  const notes=make('section','plan-print-explanation');
  const intro=make('header','plan-print-header');intro.append(make('h1','','Explicación de '+page.code+' · '+page.title),make('p','','Casa Lales · Revisión '+data.revision));notes.append(intro);
  if(page.symbols?.length){notes.append(make('h2','','Qué significa cada figura'),$('[data-plan-symbol-items]').cloneNode(true));}
  const criteria=root.querySelector('.plan-dimensions').cloneNode(true);criteria.querySelector('.plan-print-help')?.remove();notes.append(criteria,make('p','plan-print-caution',$('[data-plan-note]').textContent));
  holder.replaceChildren(map,notes);
 }
 function draw(){
  const page=data.pages.find(p=>p.id===sheet);
  $('[data-plan-status]').textContent=page.status||'Propuesta · Medidas por verificar';
  $('[data-plan-sidebar-title]').textContent=page.discipline==='arquitectura'?'Medidas de referencia':'Puntos y criterios';
  $('[data-plan-measurement-help]').textContent=page.discipline==='arquitectura'?'Dimensiones exteriores, salvo donde se indique «libre».':'Puntos y recorridos propuestos. Acometidas y dimensionamiento pendientes.';
  $('[data-plan-unit-note]').textContent=page.schematic?'Esquema sin escala':'Metros · Frente abajo';
  $('[data-plan-floor-title]').textContent=page.code+' · '+page.title;
  $('[data-plan-drawing]').replaceChildren(safeSvg(page.svg));
  const symbols=page.symbols||[];
  $('[data-plan-symbols]').hidden=!symbols.length;
  $('[data-plan-symbol-items]').innerHTML=symbols.map(s=>`<div class="plan-symbol-item" role="listitem"><div class="plan-symbol-icon" data-symbol-glyph></div><div><strong>${esc(s.title)}</strong><p>${esc(s.description)}</p></div></div>`).join('');
  root.querySelectorAll('[data-symbol-glyph]').forEach((node,i)=>node.replaceChildren(safeSvg(symbols[i].iconSvg)));
  $('[data-plan-rows]').innerHTML=page.rows.map(r=>`<div><dt>${esc(r.title)}</dt><dd><strong>${esc(r.dimensions)}</strong><small>${esc(r.note)}</small></dd></div>`).join('');
  $('[data-plan-notes]').innerHTML=page.notes.map(n=>`<li>${esc(n)}</li>`).join('');
  $('[data-plan-legend]').innerHTML=(page.legend||defaultLegend).map(l=>`<span data-tone="${esc(l.tone)}">━ ${esc(l.label)}</span>`).join('');
  $('[data-plan-legend]').hidden=!!symbols.length;
  $('[data-plan-note]').textContent=page.discipline==='arquitectura'?data.measurementNote:'Instalaciones: propuesta de puntos y recorridos para coordinación. Acometidas y conexiones pendientes de medir. Calibres, protecciones, diámetros, pendientes y cotas de fondo requieren cálculo y verificación antes de ejecutar.';
  toggle();
 }
 async function load(){
  if(pending||data)return;pending=true;$('[data-plan-state]').textContent='Cargando planos…';$('[data-plan-retry]').hidden=true;
  try{
   const url=new URL('./planos/planos-obra.json',import.meta.url);url.search=new URL(import.meta.url).search;
   const response=await fetch(url);
   if(!response.ok)throw Error('No se pudieron cargar los planos. Revisa tu conexión y vuelve a intentar.');
   data=planDocument(await response.json());sheet=data.pages[0].id;
   $('[data-plan-group]').innerHTML='<option value="">Todas las especialidades</option>'+Object.entries(groupNames).filter(([key])=>data.pages.some(p=>p.discipline===key)).map(([key,title])=>`<option value="${key}">${esc(title)}</option>`).join('');
   sheetOptions();
   $('[data-plan-revision]').textContent='Revisión '+data.revision;
   document.querySelector('[data-plan-pdf-label]').textContent=`Descargar PDF · ${data.pdfPages} láminas ↓`;
   $('[data-plan-changes]').innerHTML=data.changes.map(n=>`<li>${esc(n)}</li>`).join('');
   $('[data-plan-openings]').innerHTML=data.openings.map(o=>`<tr><td>${esc(o.id)}</td><td>${esc(o.floor)}</td><td>${number(o.width)} × ${number(o.height)}</td><td>${o.sill===null?'Por medir':number(o.sill)}</td></tr>`).join('');
   const installations=data.installations;
   $('[data-plan-fixtures]').innerHTML=installations.fixtures.map(f=>`<tr><td>${esc(f.code)}</td><td>${esc(f.title)}</td><td>${esc(f.level)}</td><td>Sí</td><td>${f.hot?'Propuesta':'—'}</td><td>Sí</td></tr>`).join('');
   $('[data-plan-circuits]').innerHTML=installations.circuits.map(c=>`<tr><td>${esc(c.code)}</td><td>${esc(c.title)}</td><td>${esc(c.scope)}</td><td>Por calcular</td></tr>`).join('');
   $('[data-plan-outlets]').innerHTML=installations.outlets.map(o=>`<tr><td>${esc(o.code)}</td><td>${esc(o.description)}</td><td>${esc(o.circuit)}</td><td>Por medir</td></tr>`).join('');
   $('[data-plan-sources]').innerHTML=(data.references||[]).map(r=>`<li><a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.title)} ↗</a><p>${esc(r.scope)}</p></li>`).join('');
   draw();$('[data-plan-state]').textContent='';$('[data-plan-content]').hidden=false;
  }catch(error){data=null;$('[data-plan-state]').textContent=error?.message||'No se pudieron cargar los planos.';$('[data-plan-retry]').hidden=false;}
  finally{pending=false;}
 }
 root.addEventListener('change',e=>{if(e.target.matches('[data-plan-group]')){sheetOptions();draw();}else if(e.target.matches('[data-sheet]')){sheet=e.target.value;draw();}else toggle();});
 root.addEventListener('input',e=>{if(e.target.matches('[data-plan-zoom]'))toggle();});
 root.addEventListener('click',e=>{
  if(e.target.closest('[data-plan-retry]'))load();
  if(e.target.closest('[data-plan-print]'))window.print();
  if(e.target.closest('[data-plan-download]')&&data){
   const page=data.pages.find(p=>p.id===sheet),svg=page.downloadSvg?safeSvg(page.downloadSvg):$('[data-plan-drawing] svg').cloneNode(true);
   if(!$('[data-dimensions]').checked)svg.querySelectorAll('[data-plan-dimensions]').forEach(e=>e.setAttribute('visibility','hidden'));
   if(!$('[data-furniture]').checked)svg.querySelectorAll('[data-plan-furniture]').forEach(e=>e.setAttribute('visibility','hidden'));
   const url=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)],{type:'image/svg+xml'}));
   const link=document.createElement('a');link.href=url;link.download=`casa-lales-${sheet}-${data.sourceSha256.slice(0,8)}.svg`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1500);
  }
 });
 return {load};
}
