const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function planDocument(value){
 if(value?.version!==3||!Array.isArray(value.pages)||!value.pages.length||!Array.isArray(value.openings)||!value.installations||!Number.isInteger(value.pdfPages))throw Error('El documento de planos no tiene un formato válido.');
 if(!['fixtures','circuits','outlets'].every(k=>Array.isArray(value.installations[k])))throw Error('Faltan los cuadros de instalaciones.');
 const ids=new Set();
 for(const page of value.pages){
  const drawing=typeof page.svg==='string'||typeof page.image==='string'&&/^laminas\/[a-z0-9_-]+\.png$/.test(page.image);
  if(!/^[a-z_]+$/.test(page.id)||ids.has(page.id)||!drawing||!Array.isArray(page.rows)||!Array.isArray(page.notes))throw Error('Faltan datos del plano.');
  if(page.image&&!/^laminas\/[a-z0-9_-]+\.png$/.test(page.image))throw Error('La imagen del plano no tiene una ruta válida.');
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
 let data=null,sheet='',pending=false,dataUrl=null;
 const $=s=>root.querySelector(s);
 const scopes={cocina_estudio:{path:'./planos/etapa-cocina-estudio/planos-obra.json',label:'Cocina y estudio'},general:{path:'./planos/planos-obra.json',label:'Casa completa'},ventanas_bloques:{path:'./planos/ventanas-bloques/planos-obra.json',label:'Ventanas y bloques'}};
 const requested=new URLSearchParams(window.location.search).get('planos');
 if(Object.hasOwn(scopes,requested))$('[data-plan-scope]').value=requested;
 const groupNames={arquitectura:'Arquitectura',electricidad:'Electricidad',agua:'Agua fría y caliente',desagues:'Desagües y ventilación',lluvias:'Aguas lluvias',coordinacion:'Cuadros de puntos',estructura:'Estructura · Esquema para revisión',dormitorio:'Paredes del dormitorio',estudio:'Paredes del estudio',bano:'Ventanas del baño',bloques:'Cantidad de bloques'};
 const assetUrl=path=>{const url=new URL(path,dataUrl);url.search=dataUrl.search;return url.href;};
 const defaultLegend=[{label:'Muros',tone:'muted'},{label:'Ventanas',tone:'cold'},{label:'Mobiliario',tone:'muted'},{label:'Cotas del modelo',tone:'dimension'}];
 function sheetOptions(){
  const group=$('[data-plan-group]').value,pages=data.pages.filter(p=>!group||p.discipline===group);
  $('[data-sheet]').innerHTML=pages.map(p=>`<option value="${esc(p.id)}">${esc(p.code+' · '+p.title)}</option>`).join('');
  if(!pages.some(p=>p.id===sheet))sheet=pages[0].id;
  $('[data-sheet]').value=sheet;
 }
 function toggle(){
  const drawing=$('[data-plan-drawing] svg, [data-plan-drawing] img');if(!drawing)return;
  drawing.querySelectorAll('[data-plan-dimensions]').forEach(e=>e.setAttribute('visibility',$('[data-dimensions]').checked?'visible':'hidden'));
  drawing.querySelectorAll('[data-plan-furniture]').forEach(e=>e.setAttribute('visibility',$('[data-furniture]').checked?'visible':'hidden'));
  $('[data-plan-drawing]').style.width=$('[data-plan-zoom]').value+'%';
  $('[data-plan-zoom-label]').textContent=$('[data-plan-zoom]').value+'%';
  printPages();
 }
 function printPages(){
  if(!data)return;
  const page=data.pages.find(p=>p.id===sheet),holder=$('[data-plan-print-pages]');
  const make=(tag,cls,text)=>{const node=document.createElement(tag);node.className=cls;if(text)node.textContent=text;return node;};
  const map=make('section','plan-print-map');
  map.dataset.orientation=page.pdfOrientation||(page.schematic?'landscape':'portrait');
  const heading=make('header','plan-print-header');
  heading.append(make('h1','',page.code+' · '+page.title),make('p','','Casa Lales · Revisión '+data.revision),make('p','',page.unitNote||(page.schematic?'Esquema sin escala':'Metros · Impresión ajustada a la hoja; leer las cotas.')));
  const graphic=make('div','plan-print-graphic');graphic.append($('[data-plan-drawing] svg, [data-plan-drawing] img').cloneNode(true));map.append(heading,graphic);
  const notes=make('section','plan-print-explanation');
  const intro=make('header','plan-print-header');intro.append(make('h1','','Explicación de '+page.code+' · '+page.title),make('p','','Casa Lales · Revisión '+data.revision));notes.append(intro);
  if(page.symbols?.length){notes.append(make('h2','','Qué significa cada figura'),$('[data-plan-symbol-items]').cloneNode(true));}
  const criteria=make('section','plan-dimensions');
  criteria.append(make('h2','',page.discipline==='arquitectura'?'Medidas de referencia':'Puntos y criterios'),make('p','',page.discipline==='arquitectura'?'Dimensiones exteriores, salvo donde se indique «libre».':'Puntos y recorridos propuestos. Acometidas y dimensionamiento pendientes.'));
  const rows=make('dl','');rows.innerHTML=page.rows.map(r=>`<div><dt>${esc(r.title)}</dt><dd><strong>${esc(r.dimensions)}</strong><small>${esc(r.note)}</small></dd></div>`).join('');
  const list=make('ul','');list.innerHTML=page.notes.map(n=>`<li>${esc(n)}</li>`).join('');
  criteria.append(rows,make('h3','','Notas para el maestro'),list);
  notes.append(criteria);
  holder.replaceChildren(...(page.symbols?.length?[map,notes]:[map]));
 }
 function draw(){
  const page=data.pages.find(p=>p.id===sheet);
  $('[data-plan-state]').textContent='';
  $('[data-plan-status]').textContent=page.status||'Propuesta · Medidas por verificar';
  $('[data-plan-unit-note]').textContent=page.unitNote||(page.schematic?'Esquema sin escala':'Metros · Frente abajo');
  $('[data-plan-floor-title]').textContent=page.code+' · '+page.title;
  if(page.image){
   const image=document.createElement('img');image.src=assetUrl(page.image);image.alt=page.code+' · '+page.title;image.decoding='async';image.width=2000;image.height=1415;
   image.addEventListener('error',()=>{if(sheet===page.id)$('[data-plan-state]').textContent='No se pudo cargar la imagen. Vuelve a elegir esta lámina.';});
   $('[data-plan-drawing]').replaceChildren(image);
  }else $('[data-plan-drawing]').replaceChildren(safeSvg(page.svg));
  for(const key of ['[data-dimensions]','[data-furniture]'])$(key).closest('label').hidden=!!page.image;
  const zoom=$('[data-plan-zoom]');zoom.max=page.image?'600':'250';
  if(Number(zoom.value)>Number(zoom.max))zoom.value=zoom.max;
  $('[data-plan-download]').textContent=page.image?'PNG ↓':'SVG ↓';
  const symbols=page.symbols||[];
  $('[data-plan-symbols]').hidden=!symbols.length;
  $('[data-plan-symbol-items]').innerHTML=symbols.map(s=>`<div class="plan-symbol-item" role="listitem"><div class="plan-symbol-icon" data-symbol-glyph></div><div><strong>${esc(s.title)}</strong><p>${esc(s.description)}</p></div></div>`).join('');
  $('[data-plan-symbol-items]').querySelectorAll('[data-symbol-glyph]').forEach((node,i)=>node.replaceChildren(safeSvg(symbols[i].iconSvg)));
  $('[data-plan-legend]').innerHTML=(page.legend||defaultLegend).map(l=>`<span data-tone="${esc(l.tone)}">━ ${esc(l.label)}</span>`).join('');
  $('[data-plan-legend]').hidden=!!symbols.length||!!page.image;
  toggle();
 }
 async function load(){
  if(pending||data)return;pending=true;$('[data-plan-scope]').disabled=true;$('[data-plan-state]').textContent='Cargando planos…';$('[data-plan-retry]').hidden=true;
  try{
   const scope=scopes[$('[data-plan-scope]').value]||scopes.cocina_estudio;
   const url=new URL(scope.path,import.meta.url);url.search=new URL(import.meta.url).search;
   const response=await fetch(url);
   if(!response.ok)throw Error('No se pudieron cargar los planos. Revisa tu conexión y vuelve a intentar.');
   data=planDocument(await response.json());dataUrl=url;sheet=data.pages[0].id;
   $('[data-plan-group]').innerHTML='<option value="">Todas las especialidades</option>'+Object.entries(groupNames).filter(([key])=>data.pages.some(p=>p.discipline===key)).map(([key,title])=>`<option value="${key}">${esc(title)}</option>`).join('');
   sheetOptions();
   $('[data-plan-revision]').textContent='Revisión '+data.revision;
   const pdf=document.querySelector('[data-plan-pdf-label]'),pdfUrl=new URL(data.pdf,url);pdfUrl.search=url.search;
   pdf.href=pdfUrl.href;pdf.textContent=`Descargar PDF · ${scope.label} · ${data.pdfPages} láminas ↓`;
   const archive=document.querySelector('[data-plan-images]');if(archive){archive.hidden=!data.archive;if(data.archive)archive.href=assetUrl(data.archive);}
   const summary=$('[data-plan-summary]');if(summary){summary.hidden=!data.summary;summary.textContent=data.summary||'';}
   const intro=document.querySelector('[data-plan-intro]');if(intro)intro.textContent=data.intro||(data.scope==='cocina_estudio'?'Primera etapa: cocina y estudio. Distribución, encuentros e instalaciones para revisar con el maestro.':'Mapas generales de la casa para revisar, imprimir y entregar a los maestros.');
   draw();$('[data-plan-state]').textContent='';$('[data-plan-content]').hidden=false;
  }catch(error){data=null;$('[data-plan-state]').textContent=error?.message||'No se pudieron cargar los planos.';$('[data-plan-retry]').hidden=false;}
  finally{pending=false;$('[data-plan-scope]').disabled=false;}
 }
 root.addEventListener('change',e=>{if(e.target.matches('[data-plan-scope]')){data=null;$('[data-plan-content]').hidden=true;load();}else if(e.target.matches('[data-plan-group]')){sheetOptions();draw();}else if(e.target.matches('[data-sheet]')){sheet=e.target.value;draw();}else toggle();});
 root.addEventListener('input',e=>{if(e.target.matches('[data-plan-zoom]'))toggle();});
 root.addEventListener('click',e=>{
  if(e.target.closest('[data-plan-retry]'))load();
  if(e.target.closest('[data-plan-print]'))window.print();
  if(e.target.closest('[data-plan-download]')&&data){
   const page=data.pages.find(p=>p.id===sheet);
   if(page.image){const link=document.createElement('a');link.href=assetUrl(page.image);link.download=`casa-lales-${sheet}.png`;link.click();return;}
   const svg=page.downloadSvg?safeSvg(page.downloadSvg):$('[data-plan-drawing] svg').cloneNode(true);
   if(!$('[data-dimensions]').checked)svg.querySelectorAll('[data-plan-dimensions]').forEach(e=>e.setAttribute('visibility','hidden'));
   if(!$('[data-furniture]').checked)svg.querySelectorAll('[data-plan-furniture]').forEach(e=>e.setAttribute('visibility','hidden'));
   const url=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)],{type:'image/svg+xml'}));
   const link=document.createElement('a');link.href=url;link.download=`casa-lales-${sheet}-${data.sourceSha256.slice(0,8)}.svg`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1500);
  }
 });
 return {load};
}
