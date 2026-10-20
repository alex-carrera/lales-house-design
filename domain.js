export const CATEGORIES=['Materiales','Mano de obra','Transporte','Herramientas','Servicios','Otros'];
export const AREAS=['General','Sala y comedor','Cuarto blanco','Cocina','Planta alta','Baños','Exterior'];
export const UNITS=['unidad','m²','m³','m','kg','saco','galón','caja','juego'];
export const money=n=>new Intl.NumberFormat('es-EC',{style:'currency',currency:'USD'}).format(n/100);
export function cents(value,{optional=false,zero=false}={}){
 const s=String(value??'').trim().replace(',','.');if(optional&&!s)return null;
 if(!/^\d{1,9}(\.\d{1,2})?$/.test(s))throw Error('Ingresa un importe válido, con hasta dos decimales.');
 const [a,b='']=s.split('.'),n=Number(a)*100+Number(b.padEnd(2,'0'));
 if(n>(1e10)||(!zero&&n===0))throw Error('El importe debe ser mayor que cero y estar dentro del límite permitido.');return n;
}
function text(value,min,max,label){const t=String(value??'').trim();if(t.length<min||t.length>max)throw Error(`${label}: usa entre ${min} y ${max} caracteres.`);return t;}
function choice(v,arr){if(!arr.includes(v))throw Error('Selecciona una opción válida.');return v;}
export function expenseData(f){
 const date=String(f.spent_on??'');if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||date<'1900-01-01'||date>'2100-12-31'||new Date(date+'T12:00:00Z').toISOString().slice(0,10)!==date)throw Error('Revisa la fecha del gasto.');
 return {concept:text(f.concept,2,160,'Concepto'),spent_on:date,amount_cents:cents(f.amount),category:choice(f.category,CATEGORIES),area:choice(f.area,AREAS),status:choice(f.status,['Pagado','Pendiente']),supplier:text(f.supplier,0,120,'Proveedor'),notes:text(f.notes,0,1000,'Notas')};
}
export function materialData(f){
 const q=Number(String(f.quantity).replace(',','.'));if(!Number.isFinite(q)||q<=0||q>1e6||Math.abs(q*1000-Math.round(q*1000))>1e-6)throw Error('La cantidad debe ser positiva, con hasta tres decimales.');
 return {name:text(f.name,2,160,'Material'),area:choice(f.area,AREAS),quantity:q,unit:choice(f.unit,UNITS),unit_cents:cents(f.unit_price,{optional:true,zero:true}),status:choice(f.status,['Por cotizar','Cotizado','Comprado']),notes:text(f.notes,0,1000,'Notas')};
}
export function totals(expenses,materials,budget=null){
 const paid=expenses.filter(x=>x.status==='Pagado').reduce((a,x)=>a+Number(x.amount_cents),0),pending=expenses.filter(x=>x.status==='Pendiente').reduce((a,x)=>a+Number(x.amount_cents),0);
 const estimated=materials.filter(x=>x.unit_cents!==null).reduce((a,x)=>a+Math.round(Number(x.quantity)*Number(x.unit_cents)),0);
 return {paid,pending,committed:paid+pending,estimated,budget,available:budget===null?null:budget-paid-pending,unquoted:materials.filter(x=>x.unit_cents===null).length};
}
export function filterExpenses(rows,f){return rows.filter(x=>(!f.search||[x.concept,x.supplier,x.notes].join(' ').toLocaleLowerCase('es').includes(f.search.toLocaleLowerCase('es')))&&(!f.category||x.category===f.category)&&(!f.area||x.area===f.area)&&(!f.from||x.spent_on>=f.from)&&(!f.to||x.spent_on<=f.to));}
export function csv(rows){const cell=x=>{let s=String(x??'');if(/^\s*[=+@\-]/.test(s)||/^[\t\r\n]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';};return '\uFEFF'+rows.map(r=>r.map(cell).join(',')).join('\r\n');}
export const today=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/Guayaquil',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
