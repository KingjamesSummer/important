import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import zlib from 'node:zlib';
import {execFileSync} from 'node:child_process';

const repo=path.resolve(process.argv[2]||'.');
const output=path.resolve(process.argv[3]||path.join(repo,'web-prototype.html'));
const read=p=>fs.readFileSync(path.join(repo,p),'utf8');
const asset=name=>read('assets/'+name);
const cleanAssetPath=s=>String(s).split('?')[0].replace(/^\.\//,'').replace(/^assets\//,'');
const gitShow=(rev,file='web-prototype.html')=>execFileSync('git',['show',`${rev}:${file}`],{cwd:repo,encoding:'utf8',maxBuffer:64*1024*1024});
function revisionFromUrl(url){const s=String(url);let m=s.match(/important@([0-9a-f]{7,40})\/web-prototype\.html/i);if(m)return m[1];m=s.match(/important\/([0-9a-f]{7,40})\/web-prototype\.html/i);return m?m[1]:null}
function inlineScripts(html){const arr=[];const re=/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;let m;while((m=re.exec(html)))arr.push(m[1]);return arr}
async function resolveLoader(html){
  let written='';
  const document={open(){},close(){},write(v){written+=String(v)},body:{set innerHTML(v){written=String(v)},get innerHTML(){return written}}};
  class DS{constructor(format){this.format=format}}
  class BlobPoly{constructor(parts=[]){this.bytes=Buffer.concat(parts.map(p=>Buffer.isBuffer(p)?p:Buffer.from(p instanceof Uint8Array?p:String(p))))}stream(){return {__blobBytes:this.bytes,pipeThrough(ds){return {__compressed:true,format:ds.format,bytes:this.__blobBytes}}}}}
  class Resp{constructor(body){this.body=body}async arrayBuffer(){if(this.body?.__compressed){const b=this.body.bytes;const out=this.body.format==='gzip'?zlib.gunzipSync(b):zlib.inflateSync(b);return out.buffer.slice(out.byteOffset,out.byteOffset+out.byteLength)}const b=Buffer.isBuffer(this.body)?this.body:Buffer.from(String(this.body??''));return b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength)}async text(){return Buffer.from(await this.arrayBuffer()).toString('utf8')}}
  async function fetchPoly(url){const rev=revisionFromUrl(url);if(!rev)return {ok:false,status:404,async text(){return ''}};try{const source=gitShow(rev);return {ok:true,status:200,async text(){return source}}}catch{return {ok:false,status:404,async text(){return ''}}}}
  const ctx={console,document,fetch:fetchPoly,URL,TextDecoder,TextEncoder,Uint8Array,ArrayBuffer,Blob:BlobPoly,Response:Resp,DecompressionStream:DS,setTimeout,clearTimeout,Promise,Buffer,atob:s=>Buffer.from(s,'base64').toString('binary'),btoa:s=>Buffer.from(s,'binary').toString('base64')};ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);
  for(const code of inlineScripts(html)){const result=vm.runInContext(code,ctx,{timeout:15000});if(result&&typeof result.then==='function')await result}
  return written;
}
async function resolveAll(){let source=read('web-prototype.html');if(source.includes('data-build="authoritative-main-flat"')&&!source.includes('document.write('))return source;for(let i=0;i<12;i++){if(!/document\.write\(/.test(source)||!/fetch\(/.test(source))break;const next=await resolveLoader(source);if(!next||next===source)throw new Error(`Unable to resolve loader layer ${i}`);source=next}return source}
function balanceReplace(source,name,replacement){const re=new RegExp(`function\\s+${name.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&')}\\s*\\([^)]*\\)\\s*\\{`);const m=re.exec(source);if(!m)return source;let i=m.index+m[0].length-1,depth=0,state='code',quote='';for(;i<source.length;i++){const ch=source[i],n=source[i+1]||'';if(state==='code'){if(ch==='"'||ch==="'"||ch==='`'){state='str';quote=ch}else if(ch==='/'&&n==='/'){state='line';i++}else if(ch==='/'&&n==='*'){state='block';i++}else if(ch==='{')depth++;else if(ch==='}'){depth--;if(depth===0)return source.slice(0,m.index)+replacement+source.slice(i+1)}}else if(state==='str'){if(ch==='\\')i++;else if(ch===quote)state='code'}else if(state==='line'){if(ch==='\n')state='code'}else if(state==='block'){if(ch==='*'&&n==='/'){state='code';i++}}}throw new Error('Unbalanced function '+name)}
function removeStyleInjection(source,id){const idRe=new RegExp(`([A-Za-z_$][\\w$]*)\\.id\\s*=\\s*['\"]${id.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&')}['\"]\\s*;`);const m=idRe.exec(source);if(!m)return source;const v=m[1],before=source.slice(0,m.index),declRe=new RegExp(`(?:const|let|var)\\s+${v.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&')}\\s*=\\s*document\\.createElement\\(\\s*['\"]style['\"]\\s*\\)\\s*;`,'g');let d,last=null;while((d=declRe.exec(before)))last=d;if(!last)return source;const appendRe=new RegExp(`document\\.head\\.appendChild\\(\\s*${v.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&')}\\s*\\)\\s*;`,'g');appendRe.lastIndex=m.index;const a=appendRe.exec(source);if(!a)return source;return source.slice(0,last.index)+`/* ${id} consolidated into canonical stylesheet. */`+source.slice(a.index+a[0].length)}
function patchScript(name,src){
  if(name==='workbench-v4.js')for(const fn of ['ensurePremiumMotionStyles','ensureAdminDeptV3','ensureAdminDeptV11'])src=balanceReplace(src,fn,`function ${fn}(){/* bundled */}`);
  if(name==='admin-dept-console-v2.js')src=balanceReplace(src,'ensureStyles','function ensureStyles(){/* bundled */}');
  if(name==='admin-dept-console-v3.js')src=balanceReplace(src,'ensureCss','function ensureCss(){/* bundled */}');
  if(name==='collaboration-space-v1-fix.js')src=src.replace(/\n\s*const appendStyle=\(key,href\)=>\{[\s\S]*?setTimeout\(\(\)=>appendStyle\('admin-flat-blue-v1',[\s\S]*?\),0\);/m,'\n  /* collaboration v2-v6 resources are bundled below. */');
  if(name==='admin-dept-console-v11.js')src=src.replace(/\s*if\(!document\.getElementById\('admin-dept-console-v11-theme'\)\)\{[\s\S]*?document\.head\.appendChild\(link\);\s*\}/m,'\n    /* v9 theme bundled */');
  if(name==='personal-space-v12.js'){
    src=src.replace(/\n\s*if\(document\.querySelector\('script\[data-personal-dropdown-v13\]'\)\)return;[\s\S]*?document\.head\.appendChild\(script\);/m,'\n/* personal-space-v13 bundled */');
    src=src.replace(/\n\s*const script=document\.createElement\('script'\);\s*script\.src='assets\/personal-space-v13\.js\?v=1';\s*script\.dataset\.personalDropdownV13='1';\s*document\.head\.appendChild\(script\);/m,'\n/* personal-space-v13 bundled */');
  }
  const styleIds={'enterprise-space-v1.js':['enterprise-space-v4-style'],'enterprise-space-v2.js':['enterprise-space-v9-style'],'personal-space-v10.js':['personal-space-v10-style'],'personal-space-v11.js':['personal-space-v11-style'],'personal-space-v12.js':['personal-space-v12-style'],'public-shell-v1.js':['gdg-public-shell-v3'],'public-shell-hotfix-v1.js':['gdg-public-shell-polish-v2'],'admin-grant-polish-v2.js':['admin-grant-polish-v2-css'],'admin-shell-hotfix-v1.js':['gdg-admin-shell-hotfix-v2-css'],'admin-sunny-theme-v1.js':['gdg-admin-sunny-theme-v1-css'],'admin-dept-console-v11.js':['admin-dept-console-v11-style'],'personal-space-v13.js':['personal-dropdown-v13-style']};
  for(const id of styleIds[name]||[])src=removeStyleInjection(src,id);
  return src.replace(/['\"]assets\/[A-Za-z0-9._?=&/-]+['\"]/g,"''");
}
function captureStyles(file){
  const src=asset(file),styles=[],nodes=new Map();
  const generic=new Proxy(function(){},{get(t,p){if(p==='style'||p==='dataset')return {};if(p==='classList')return {add(){},remove(){},toggle(){},contains(){return false}};if(p===Symbol.iterator)return function*(){};return generic},set(){return true},apply(){return generic},construct(){return generic}});
  function createElement(tag){const el={tagName:String(tag).toUpperCase(),id:'',textContent:'',innerHTML:'',style:{},dataset:{},className:'',classList:{add(){},remove(){},toggle(){},contains(){return false}},appendChild(c){return c},setAttribute(){},getAttribute(){return null},addEventListener(){},remove(){},querySelector(){return null},querySelectorAll(){return []}};return new Proxy(el,{get(t,p){return p in t?t[p]:generic},set(t,p,v){t[p]=v;return true}})}
  const doc={head:{appendChild(el){if(el?.tagName==='STYLE'){styles.push({id:el.id||'',text:el.textContent||''});if(el.id)nodes.set(el.id,el)}return el}},body:generic,documentElement:{dataset:{}},createElement,getElementById(id){return nodes.get(id)||null},querySelector(){return null},querySelectorAll(){return []},addEventListener(){},removeEventListener(){}};
  const ctx={console,document:doc,window:null,globalThis:null,state:{},render(){},pageHead(){return ''},sidebar(){return ''},enterprise(){return ''},personal(){return ''},collaboration(){return ''},related(){return ''},links(){return ''},collect(){return ''},recycle(){return ''},suspicious(){return ''},workbench(){return ''},adminDept(){return ''},adminMember(){return ''},adminGrant(){return ''},adminStats(){return ''},adminSecurity(){return ''},adminPage(){return ''},FILE_ICONIFY:{},icon(){return ''},iconMarkup(){return ''},safe(v){return String(v??'')},toast(){},setTimeout(fn){try{fn()}catch{}return 1},clearTimeout(){},setInterval(){return 1},clearInterval(){},MutationObserver:class{observe(){}disconnect(){}},URL,location:{hash:'',pathname:'/'},history:{pushState(){},replaceState(){}},navigator:{clipboard:{writeText(){return Promise.resolve()}}},localStorage:{getItem(){return null},setItem(){}},sessionStorage:{getItem(){return null},setItem(){}},Event:class{},CustomEvent:class{}};ctx.window=ctx;ctx.globalThis=ctx;
  try{vm.runInNewContext(src,ctx,{timeout:4000,filename:file})}catch{}
  return styles;
}
function getStyle(file,id){const found=captureStyles(file).find(x=>x.id===id);if(!found)throw new Error(`Cannot capture style ${id} from ${file}`);return found.text}
const escStyle=s=>s.replace(/<\/style/gi,'<\\/style');
const escScript=s=>s.replace(/<\/script/gi,'<\\/script');
const tagStyle=(text,label='')=>`<style${label?` data-authoritative-section="${label}"`:''}>\n${escStyle(text)}\n</style>`;
const tagScript=(text,label='')=>`<script${label?` data-authoritative-stage="${label}"`:''}>\n${escScript(text)}\n</script>`;

const resolved=await resolveAll();
if(resolved.includes('data-build="authoritative-main-flat"')&&!resolved.includes('document.write(')){fs.writeFileSync(output,resolved);console.log('Authoritative prototype already present.');process.exit(0)}
const headMatch=resolved.match(/<head>([\s\S]*?)<\/head>/i),bodyMatch=resolved.match(/<body([^>]*)>([\s\S]*?)<\/body>/i);if(!headMatch||!bodyMatch)throw new Error('Invalid resolved HTML');
const head=headMatch[1],body=bodyMatch[2];
let headShell=head.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'').replace(/<link\b[^>]*href=["']assets\/[^>]+>/gi,'');
const initialChunks=[],tokenRe=/<style\b[^>]*>([\s\S]*?)<\/style>|<link\b([^>]*?)href=["'](assets\/[^"']+)["']([^>]*)>/gi;let tm;while((tm=tokenRe.exec(head)))initialChunks.push(tm[1]!==undefined?tm[1]:asset(cleanAssetPath(tm[3])));
const dynamicSpec=[['enterprise-space-v1.js','enterprise-space-v4-style'],['enterprise-space-v2.js','enterprise-space-v9-style'],['personal-space-v10.js','personal-space-v10-style'],['personal-space-v11.js','personal-space-v11-style'],['personal-space-v12.js','personal-space-v12-style']];
const laterCss=['workbench-v4-premium-motion.css','workbench-v4-avatars.css','collaboration-space-v2.css','collaboration-space-v3.css','collaboration-space-v3-polish.css','collaboration-space-v4.css','collaboration-space-v5.css','collaboration-space-v6.css','admin-dept-console-v2.css'];
const adminDynamic=[['public-shell-v1.js','gdg-public-shell-v3'],['public-shell-hotfix-v1.js','gdg-public-shell-polish-v2'],['admin-grant-polish-v2.js','admin-grant-polish-v2-css'],['admin-shell-hotfix-v1.js','gdg-admin-shell-hotfix-v2-css'],['admin-sunny-theme-v1.js','gdg-admin-sunny-theme-v1-css']];
const finalCss=[['asset','admin-dept-console-v9.css'],['dynamic','admin-dept-console-v11.js','admin-dept-console-v11-style'],['asset','admin-flat-blue-v1.css'],['dynamic','personal-space-v13.js','personal-dropdown-v13-style'],['asset','admin-dept-console-v3.css']];
const cssChunks=[...initialChunks,...dynamicSpec.map(([f,id])=>getStyle(f,id)),...laterCss.map(asset),...adminDynamic.map(([f,id])=>getStyle(f,id)),...finalCss.map(x=>x[0]==='asset'?asset(x[1]):getStyle(x[1],x[2]))];
headShell+=`\n${tagStyle(cssChunks.join('\n\n/* ===== authoritative boundary ===== */\n\n'),'all-final-styles')}\n`;
const scripts=[],scriptRe=/<script\b([^>]*)>([\s\S]*?)<\/script>/gi;let sm;while((sm=scriptRe.exec(body))){const srcM=sm[1].match(/\bsrc=["']([^"']+)["']/i);if(srcM&&srcM[1].startsWith('assets/')){const name=cleanAssetPath(srcM[1]);scripts.push({name,code:patchScript(name,asset(name))});if(name==='collaboration-space-v1-fix.js')scripts.push({name:'collaboration-space-v2.js',code:patchScript('collaboration-space-v2.js',asset('collaboration-space-v2.js'))})}else if(!srcM){let code=sm[2].replace(/""":"&quot;"/g,`'"':"&quot;"`);scripts.push({name:'inline',code})}}
for(const name of ['admin-dept-console-v3.js','collaboration-space-v3.js','collaboration-space-v4.js','collaboration-space-v5.js','collaboration-space-v6.js','personal-space-v13.js'])scripts.push({name,code:patchScript(name,asset(name))});
const bodyMarkup=body.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,''),runtime=scripts.map((s,i)=>tagScript(s.code,`stage-${String(i+1).padStart(2,'0')}`)).join('\n');
let result=resolved.slice(0,headMatch.index)+`<head>${headShell}</head>`+resolved.slice(headMatch.index+headMatch[0].length,bodyMatch.index)+`<body${bodyMatch[1]}>${bodyMarkup}\n${runtime}\n</body>`+resolved.slice(bodyMatch.index+bodyMatch[0].length);
result=result.replace(/<html\b([^>]*)>/i,(m,a)=>`<html${a} data-build="authoritative-main-flat">`).replace(/<!doctype html>/i,'<!doctype html>\n<!-- GDG知识库权威主原型：不加载历史提交，不引用本地补丁资源。 -->');
for(const forbidden of ['raw.githubusercontent.com','cdn.jsdelivr.net/gh/KingjamesSummer/important','document.write(','appendScript(','appendStyle(','assets/'])if(result.includes(forbidden))throw new Error('Forbidden runtime dependency remains: '+forbidden);
fs.writeFileSync(output,result);
console.log(JSON.stringify({output,bytes:Buffer.byteLength(result),styles:cssChunks.length,scripts:scripts.length},null,2));
