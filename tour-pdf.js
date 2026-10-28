// PDF de una vista del recorrido, generado en el dispositivo sin servicios externos.
// Image XObject y tabla xref: ISO 32000-1, secciones 7.5 y 8.9.
const latin=value=>Uint8Array.from(String(value),c=>c.charCodeAt(0)&255);
const clean=value=>String(value??'').replace(/[\r\n\t]/g,' ').replace(/[–—−]/g,'-').replace(/[“”]/g,'"').replace(/[’‘]/g,"'").replace(/[^\x20-\xFF]/g,'').trim();
const literal=value=>`(${clean(value).replace(/[\\()]/g,'\\$&')})`;
const num=value=>Number(value.toFixed(2));
export function previewPDF({jpeg,width,height,kind,view,angle=0,mode='',date='',palettes=''}){
 if(!(jpeg instanceof Uint8Array)||jpeg.length<4||jpeg.length>15_000_000||jpeg[0]!==255||jpeg[1]!==216||jpeg.at(-2)!==255||jpeg.at(-1)!==217)throw Error('La imagen de la vista no es válida.');
 if(!['actual','propuesta'].includes(kind)||![width,height].every(n=>Number.isInteger(n)&&n>0&&n<=8192)||!Number.isFinite(angle))throw Error('No se pudo preparar esta vista.');
 const landscape=width>=height,W=landscape?841.89:595.28,H=landscape?595.28:841.89;
 const paletteLines=[];let paletteRest=clean(palettes).slice(0,320),limit=Math.floor((W-48)/5);
 while(paletteRest&&paletteLines.length<2){let end=paletteRest.length<=limit?paletteRest.length:paletteRest.lastIndexOf(' ',limit);if(end<1)end=limit;paletteLines.push(paletteRest.slice(0,end));paletteRest=paletteRest.slice(end).trim();}
 const reserved=paletteLines.length?174:148;
 const pageTitle=kind==='actual'?'Estado actual':'Diseño futuro',scale=Math.min((W-48)/width,(H-reserved)/height),iw=num(width*scale),ih=num(height*scale);
 const x=num((W-iw)/2),y=num(54+(H-reserved-ih)/2),safeView=clean(view).slice(0,112);
 const line=(text,size,xx,yy,color='0.15 0.2 0.18')=>`${color} rg BT /F1 ${size} Tf ${xx} ${yy} Td ${literal(text)} Tj ET\n`;
 const content=latin('1 1 1 rg 0 0 '+W+' '+H+' re f\n'+
  line('CASA LALES',18,24,H-35)+line(pageTitle+' - '+safeView,12,24,H-57)+
  line(`Giro ${Math.round(angle)}°${mode?' | '+clean(mode):''}${date?' | '+clean(date):''}`,9,24,H-75,'0.4 0.44 0.42')+
  paletteLines.map((text,i)=>line(text,8,24,H-89-i*10,'0.4 0.44 0.42')).join('')+
  `q ${iw} 0 0 ${ih} ${x} ${y} cm /Im1 Do Q\n`+
  line('Previsualización del modelo. Medidas aproximadas; no es un plano de ejecución.',9,24,28,'0.4 0.44 0.42'));
 const chunks=[],offsets=[0];let length=0;
 const put=bytes=>{chunks.push(bytes);length+=bytes.length;};
 const text=value=>put(latin(value));
 const object=(id,body)=>{offsets[id]=length;text(`${id} 0 obj\n${body}\nendobj\n`);};
 const stream=(id,dictionary,bytes)=>{offsets[id]=length;text(`${id} 0 obj\n<< ${dictionary} /Length ${bytes.length} >>\nstream\n`);put(bytes);text('\nendstream\nendobj\n');};
 text('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
 object(1,'<< /Type /Catalog /Pages 2 0 R >>');
 object(2,'<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
 object(3,`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /F1 5 0 R >> /XObject << /Im1 4 0 R >> >> /Contents 6 0 R >>`);
 stream(4,`/Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode`,jpeg);
 object(5,'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
 stream(6,'',content);
 object(7,`<< /Title ${literal('Casa Lales - '+pageTitle+' - '+safeView)} /Creator (Casa Lales) /Producer (Casa Lales - PDF de previsualizacion) >>`);
 const xref=length;text('xref\n0 8\n0000000000 65535 f \n');
 for(let i=1;i<=7;i++)text(`${String(offsets[i]).padStart(10,'0')} 00000 n \n`);
 text(`trailer\n<< /Size 8 /Root 1 0 R /Info 7 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
 const result=new Uint8Array(length);let pos=0;for(const bytes of chunks){result.set(bytes,pos);pos+=bytes.length;}return result;
}
export function capturePayload(data,kind){
 if(data?.kind!==kind||typeof data.view!=='string'||data.view.length>300||!Number.isFinite(data.angle)||typeof data.mode!=='string'||data.mode.length>150||(data.palettes!==undefined&&(typeof data.palettes!=='string'||data.palettes.length>400))||typeof data.image!=='string'||data.image.length>20_000_000||!/^data:image\/jpeg;base64,[a-z0-9+/=]+$/i.test(data.image))throw Error('No se recibió una imagen válida del recorrido.');
 const binary=atob(data.image.slice(data.image.indexOf(',')+1));
 return {...data,jpeg:Uint8Array.from(binary,c=>c.charCodeAt(0))};
}
export function mountTourPDF({notify=()=>{}}={}){
 const busy=new Set();
 document.querySelectorAll('[data-tour-pdf]').forEach(button=>button.addEventListener('click',async()=>{
  const kind=button.dataset.tourPdf;if(busy.has(kind))return;
  const frame=document.getElementById(kind==='actual'?'house-viewer':'proposal-viewer'),label=button.textContent;
  const status=document.querySelector(`[data-tour-pdf-status="${kind}"]`);
  busy.add(kind);button.disabled=true;button.setAttribute('aria-busy','true');button.textContent='Preparando PDF…';
  if(status){status.hidden=false;status.textContent='Preparando la vista seleccionada…';}
  try{
   const id=crypto.randomUUID();
   const capture=await new Promise((resolve,reject)=>{
    const request={type:'casa-lales:preview-capture',id,kind};
    let timer,retry;
    const dispose=()=>{clearTimeout(timer);clearInterval(retry);window.removeEventListener('message',receive);};
    const receive=event=>{
     if(event.source!==frame.contentWindow||event.origin!==location.origin||event.data?.type!=='casa-lales:preview-result'||event.data.id!==id||event.data.kind!==kind)return;
     dispose();event.data.error?reject(Error(event.data.error)):resolve(event.data);
    };
    const send=()=>frame.contentWindow?.postMessage(request,location.origin);
    window.addEventListener('message',receive);timer=setTimeout(()=>{dispose();reject(Error('La vista todavía no está lista. Espera a que termine de cargar y vuelve a intentar.'));},15000);
    retry=setInterval(send,500);send();
   });
   const data=capturePayload(capture,kind),date=new Intl.DateTimeFormat('es-EC',{dateStyle:'medium',timeZone:'America/Guayaquil'}).format(new Date());
   const bytes=previewPDF({...data,date}),url=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));
   const slug=clean(data.view).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,75);
   const link=document.createElement('a');link.href=url;link.download=`casa-lales-${kind==='actual'?'estado-actual':'diseno-futuro'}-${slug||'vista'}.pdf`;
   document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
   if(status)status.textContent='PDF descargado con la vista y el giro seleccionados.';
   notify('Vista descargada en PDF.');
  }catch(error){const text=error.message||'No se pudo descargar esta vista. Vuelve a intentar.';if(status)status.textContent=text;notify(text);}
  finally{busy.delete(kind);button.disabled=false;button.removeAttribute('aria-busy');button.textContent=label;}
 }));
}
