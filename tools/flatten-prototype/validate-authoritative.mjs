import fs from 'node:fs';
import vm from 'node:vm';

const file=process.argv[2]||'web-prototype.html';
const html=fs.readFileSync(file,'utf8');
const required=['data-build="authoritative-main-flat"','GDG知识库','个人空间','协作空间','部门管理','成员管理','管理员设置','统计报表','安全配置'];
for(const token of required)if(!html.includes(token))throw new Error(`Missing required token: ${token}`);
const forbidden=['raw.githubusercontent.com','cdn.jsdelivr.net/gh/KingjamesSummer/important','document.write(','appendScript(','appendStyle(','assets/'];
for(const token of forbidden)if(html.includes(token))throw new Error(`Forbidden dependency remains: ${token}`);
const scripts=[];
const re=/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
let match;
while((match=re.exec(html)))scripts.push(match[1]);
if(scripts.length<20)throw new Error(`Unexpected inline script count: ${scripts.length}`);
for(let index=0;index<scripts.length;index++)new vm.Script(scripts[index],{filename:`inline-${index+1}.js`});
console.log(JSON.stringify({file,bytes:Buffer.byteLength(html),inlineScripts:scripts.length,styles:(html.match(/<style\b/gi)||[]).length},null,2));
