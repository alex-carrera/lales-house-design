import {config} from './config.js';
export class ProjectStore{
 client=null;session=null;channel=null;
 async initialize(onSession,onRemote){
  if(!config.supabaseUrl||!config.supabaseKey)return false;
  const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2.57.4');
  this.client=createClient(config.supabaseUrl,config.supabaseKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
  this.client.auth.onAuthStateChange((_event,session)=>{
   this.session=session;if(this.channel){this.client.removeChannel(this.channel);this.channel=null;}
   if(session){this.channel=this.client.channel('lales-'+session.user.id);for(const table of ['lales_settings','lales_expenses','lales_materials'])this.channel=this.channel.on('postgres_changes',{event:'*',schema:'public',table,filter:'user_id=eq.'+session.user.id},onRemote);this.channel.subscribe();}
   // Keep asynchronous queries outside the SDK's synchronous auth lock.
   setTimeout(()=>onSession(session),0);
  });return true;
 }
 async signIn(email,password){const {error}=await this.client.auth.signInWithPassword({email,password});if(error)throw error;}
 async signUp(email,password){const {data,error}=await this.client.auth.signUp({email,password,options:{emailRedirectTo:config.siteUrl}});if(error)throw error;return data;}
 async signOut(){const {error}=await this.client.auth.signOut();if(error)throw error;}
 async rows(table){let all=[],offset=0;for(;;){const {data,error}=await this.client.from(table).select('*').order('id').range(offset,offset+499);if(error)throw error;all.push(...data);if(data.length<500)return all;offset+=500;}}
 async load(){if(!this.session)throw Error('Inicia sesión para ver el organizador.');const [expenses,materials,setting]=await Promise.all([this.rows('lales_expenses'),this.rows('lales_materials'),this.client.from('lales_settings').select('*').maybeSingle()]);if(setting.error)throw setting.error;return {expenses:expenses.sort((a,b)=>b.spent_on.localeCompare(a.spent_on)||b.created_at.localeCompare(a.created_at)),materials,settings:setting.data};}
 async save(table,data,existing){
  if(!this.session)throw Error('Tu sesión terminó. Vuelve a ingresar.');
  let q;if(existing){q=this.client.from(table).update(data).eq(table==='lales_settings'?'user_id':'id',table==='lales_settings'?this.session.user.id:existing.id).eq('revision',existing.revision);}else q=this.client.from(table).insert({...data,user_id:this.session.user.id});
  const {data:row,error}=await q.select().maybeSingle();if(error)throw error;if(!row)throw Error('Este registro cambió en otro dispositivo. Actualiza y vuelve a intentarlo.');return row;
 }
 async remove(table,row){const {data,error}=await this.client.from(table).delete().eq('id',row.id).eq('revision',row.revision).select('id');if(error)throw error;if(!data.length)throw Error('El registro cambió en otro dispositivo. Actualiza antes de eliminarlo.');}
}
