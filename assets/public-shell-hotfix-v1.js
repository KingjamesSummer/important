(function(){
'use strict';
if(window.__gdgPublicShellHotfixV2)return;
window.__gdgPublicShellHotfixV2=true;

const polish=document.createElement('style');
polish.id='gdg-public-shell-polish-v2';
polish.textContent=`
:root{--topbar:64px}
.brand{height:64px!important;padding:0 14px!important;background:#fff!important;border-bottom:1px solid #e8eef6!important}
.gdg-brand-v4{all:unset;box-sizing:border-box;width:100%;height:54px;display:flex;align-items:center;gap:10px;padding:5px 6px;border-radius:13px;cursor:pointer;transition:background .18s ease,transform .18s ease}
.gdg-brand-v4:hover{background:#f6f9fe;transform:translateY(-1px)}
.gdg-brand-v4:focus-visible{outline:2px solid rgba(23,105,255,.28);outline-offset:1px}
.gdg-logo-v4{width:41px;height:41px;flex:none;display:grid;place-items:center;position:relative;border:1px solid #dce8f7;border-radius:12px;background:linear-gradient(145deg,#fff 0%,#f3f8ff 100%);box-shadow:0 7px 18px rgba(28,82,157,.10),inset 0 1px rgba(255,255,255,.95);overflow:hidden;isolation:isolate}
.gdg-logo-v4:before{content:"";position:absolute;z-index:0;width:28px;height:28px;right:-12px;bottom:-12px;border-radius:50%;background:rgba(23,105,255,.055)}
.gdg-logo-v4:after{content:"";position:absolute;z-index:4;inset:-65% -45%;background:linear-gradient(106deg,transparent 44%,rgba(255,255,255,.88) 50%,transparent 56%);transform:translateX(-82%) rotate(9deg);animation:gdgBrandSweep 8.6s ease-in-out infinite;pointer-events:none}
.gdg-logo-v4 svg{width:35px;height:35px;position:relative;z-index:2;filter:drop-shadow(0 3px 5px rgba(17,67,139,.13));animation:gdgBrandFloat 7s ease-in-out infinite}
.gdg-logo-v4 svg .gdg-green{transform-origin:67% 52%;animation:gdgBrandLeaf 7s ease-in-out infinite}
.gdg-brand-v4.replay .gdg-logo-v4{animation:gdgBrandReplay .82s cubic-bezier(.16,1,.3,1)}
.gdg-brand-copy-v4{min-width:0;display:flex;flex-direction:column;justify-content:center}
.gdg-brand-copy-v4 strong{display:block;color:#162a44;font-size:15.5px;line-height:1.15;font-weight:760;letter-spacing:.015em;white-space:nowrap}
.gdg-brand-copy-v4 span{display:block;margin-top:4px;color:#8a99ab;font-size:8.7px;line-height:1.1;font-weight:560;letter-spacing:.035em;white-space:nowrap}
@keyframes gdgBrandSweep{0%,70%{transform:translateX(-82%) rotate(9deg);opacity:0}77%{opacity:.68}88%,100%{transform:translateX(82%) rotate(9deg);opacity:0}}
@keyframes gdgBrandFloat{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-.65px) scale(1.01)}}
@keyframes gdgBrandLeaf{0%,100%{transform:translate(0,0) rotate(0)}50%{transform:translate(.55px,-.28px) rotate(.45deg)}}
@keyframes gdgBrandReplay{35%{transform:scale(.94) rotate(-1.5deg)}72%{transform:scale(1.035) rotate(.7deg)}100%{transform:scale(1)}}

.topbar{height:64px!important;padding:0 20px!important;gap:12px!important;background:rgba(255,255,255,.96)!important;border-bottom:1px solid #e5ecf5!important;box-shadow:0 3px 14px rgba(37,67,104,.025)!important}
.gdg-search{height:38px!important;border-radius:11px!important;background:#f8faff!important;border-color:#e0e8f2!important;box-shadow:inset 0 1px rgba(255,255,255,.9)}
.gdg-actions{height:40px!important;padding:3px!important;border:1px solid #e5ecf4!important;border-radius:12px!important;background:#fbfdff!important;box-shadow:none!important}
.gdg-action{width:34px!important;height:32px!important;border-radius:8px!important}
.gdg-action+.gdg-action:before{top:9px!important;bottom:9px!important;background:#edf2f7!important}
.gdg-profile{height:44px!important;padding:4px 7px 4px 4px!important;gap:8px!important;border:0!important;border-radius:12px!important;background:transparent!important;box-shadow:none!important;transition:background .18s ease,transform .18s ease!important}
.gdg-profile:hover{background:#f3f7fd!important;transform:translateY(-1px)!important}
.gdg-profile:focus-visible{outline:2px solid rgba(23,105,255,.22);outline-offset:1px}
.gdg-avatar-v4{width:35px!important;height:35px!important;border-radius:11px!important;display:grid!important;place-items:center!important;position:relative!important;overflow:hidden!important;background:linear-gradient(145deg,#f0f6ff 0%,#dceaff 100%)!important;border:1px solid #cfe0f6!important;box-shadow:0 5px 13px rgba(43,91,153,.10),inset 0 1px rgba(255,255,255,.95)!important;color:#245b9d!important;font-size:12px!important;font-weight:760!important}
.gdg-avatar-v4:before{content:"";position:absolute;left:-9px;top:-12px;width:27px;height:43px;border-radius:50%;background:linear-gradient(180deg,rgba(23,105,255,.10),rgba(23,105,255,.015));transform:rotate(28deg)}
.gdg-avatar-v4>span{position:relative;z-index:2}
.gdg-avatar-v4:after{content:""!important;position:absolute!important;right:1px!important;bottom:1px!important;width:7px!important;height:7px!important;border:2px solid #fff!important;border-radius:50%!important;background:#27b879!important;box-shadow:0 1px 3px rgba(39,184,121,.25)!important}
.gdg-profile-copy{min-width:0;text-align:left!important}
.gdg-profile-copy strong{display:block;color:#223850!important;font-size:11.5px!important;line-height:1.15!important;font-weight:700!important;white-space:nowrap}
.gdg-profile-copy span{display:flex!important;align-items:center;gap:4px;margin-top:4px!important;color:#8a99aa!important;font-size:8.8px!important;line-height:1!important;white-space:nowrap}
.gdg-profile-status{width:5px;height:5px;border-radius:50%;background:#27b879;box-shadow:0 0 0 2px rgba(39,184,121,.10)}
.gdg-profile .icon-stack{width:13px!important;height:13px!important;color:#8b9bad}

.enterprise-nav-caret{margin-left:auto;display:grid;place-items:center;color:#7e90a6;transition:transform .18s ease}
.enterprise-nav-caret.collapsed{transform:rotate(-90deg)}
.enterprise-nav-caret .icon-stack{width:14px;height:14px}
.enterprise-org-tree-v4{margin:5px 7px 12px 26px!important;padding:1px 0 1px 12px!important;border-left:1px solid #dbe6f2!important;display:grid!important;gap:3px!important;overflow:visible!important}
.enterprise-org-tree-v4.collapsed{display:none!important}
.enterprise-library-root-v4,.enterprise-dept-nav-v4{width:100%!important;height:35px!important;display:grid!important;grid-template-columns:18px minmax(0,1fr)!important;align-items:center!important;gap:7px!important;position:relative!important;padding:0 8px!important;border:0!important;border-radius:8px!important;background:transparent!important;color:#61758d!important;text-align:left!important;transition:background .16s ease,color .16s ease,transform .16s ease!important}
.enterprise-library-root-v4:before,.enterprise-dept-nav-v4:before{content:"";position:absolute;left:-13px;top:50%;width:10px;height:1px;background:#dbe6f2}
.enterprise-library-root-v4:hover,.enterprise-dept-nav-v4:hover{background:#f4f8fd!important;color:#315f92!important;transform:translateX(1px)}
.enterprise-library-root-v4.active,.enterprise-dept-nav-v4.active{background:#edf5ff!important;color:#1769ff!important;box-shadow:inset 0 0 0 1px rgba(23,105,255,.065)}
.enterprise-library-root-v4 strong,.enterprise-dept-nav-v4 strong{min-width:0!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;font-size:11.5px!important;line-height:1!important;font-weight:600!important}
.enterprise-library-root-v4 .icon-stack{width:15px!important;height:15px!important;color:#5f83ad}
.gdg-dept-library-icon{width:17px;height:17px;display:grid;place-items:center;position:relative;color:#6f91b8}
.gdg-dept-library-icon>.icon-stack{width:15px!important;height:15px!important}
.gdg-dept-library-icon:after{content:"";position:absolute;right:-1px;bottom:0;width:5px;height:5px;border:1.5px solid #fff;border-radius:50%;background:#4f91df;box-shadow:0 0 0 1px rgba(79,145,223,.13)}
.enterprise-dept-nav-v4.active .gdg-dept-library-icon{color:#1769ff}
.enterprise-dept-nav-v4.active .gdg-dept-library-icon:after{background:#1769ff}
.enterprise-nav-count-v4,.enterprise-default-v4,.enterprise-dept-group-head-v4{display:none!important}

@media(max-width:1160px){.gdg-profile-copy{display:none!important}.gdg-profile{padding-right:4px!important}.gdg-brand-copy-v4 span{display:none}.enterprise-org-tree-v4{margin-left:22px!important}}
@media(prefers-reduced-motion:reduce){.gdg-logo-v4:after,.gdg-logo-v4 svg,.gdg-logo-v4 svg .gdg-green,.gdg-brand-v4.replay .gdg-logo-v4{animation:none!important}}
`;
document.head.appendChild(polish);

const gdgLogo=`<svg viewBox="0 0 96 96" aria-hidden="true"><defs><linearGradient id="gdgHotfixBlue" x1="10" y1="14" x2="82" y2="83"><stop stop-color="#0b7cc7"/><stop offset=".55" stop-color="#1648a7"/><stop offset="1" stop-color="#153c91"/></linearGradient><linearGradient id="gdgHotfixGreen" x1="42" y1="34" x2="89" y2="73"><stop stop-color="#0aa842"/><stop offset=".58" stop-color="#55bf1d"/><stop offset="1" stop-color="#b8df00"/></linearGradient></defs><path fill="url(#gdgHotfixBlue)" d="M82.5 25.8C69.4 12.2 49.8 7.1 32.7 13.1 15.7 19.1 6.2 34.5 7.9 51.9c1.2 12.4 7.9 23.5 18.2 30.3-6.8-13.4-5.1-28.3 3.8-39.5 11.4-14.2 31.4-20.6 52.6-16.9Z"/><path fill="url(#gdgHotfixBlue)" d="M12.2 65.4c12.9 8.1 25.3 10 39.7 6.5 13.9-3.4 25.3 1.3 36.2 12.7-16.3-5.8-27.7-4.1-39.3-.5-15.8 4.8-29.1-2.5-36.6-18.7Z"/><g class="gdg-green"><path fill="url(#gdgHotfixGreen)" d="M40.9 48.7c10.7-15.5 26.6-22.7 47.9-20.2-15 5.7-27.6 14.2-36.4 28.8-5.2 8.6-9.5 6-11.5-8.6Z"/><path fill="url(#gdgHotfixGreen)" d="M56 58.3c8.9-13.9 19.4-23 33.7-29.2-9.8 12.7-14.5 25.6-10.7 39.7-9.7-1.5-17.3-5-23-10.5Z"/></g></svg>`;

window.gdgReplayBrand=function(){
  const brand=document.querySelector('.gdg-brand-v4');
  if(!brand)return;
  brand.classList.remove('replay');
  void brand.offsetWidth;
  brand.classList.add('replay');
  setTimeout(()=>brand.classList.remove('replay'),900);
};

function departmentRows(){
  return (typeof depts!=='undefined'?depts:[]).filter(name=>name!=='集团资料库');
}

sidebar=function(){
  const groups=nav.map(group=>{
    const items=group.items.map(([page,iconName,title])=>{
      const active=state.page===page;
      const relatedBadge=page==='related'?'<span class="trail badge blue">3</span>':'';
      const caret=page==='enterprise'&&active?`<span class="enterprise-nav-caret ${state.enterpriseNavExpanded?'':'collapsed'}">${icon('down')}</span>`:'';
      const action=page==='enterprise'&&active?'toggleEnterpriseNav()':`navigate('${page}')`;
      const base=`<button class="nav-item ${active?'active':''}" onclick="${action}">${icon(iconName)}<span>${title}</span>${relatedBadge}${caret}</button>`;
      if(page!=='enterprise'||!active)return base;
      const departments=departmentRows();
      const rows=departments.map(dept=>`<button class="enterprise-dept-nav-v4 ${state.dept===dept?'active':''}" onclick="changeDept('${dept}')" title="进入${safe(dept)}公共资料库"><span class="gdg-dept-library-icon">${icon('folder')}</span><strong>${safe(dept)}</strong></button>`).join('');
      return `${base}<div class="enterprise-org-tree-v4 ${state.enterpriseNavExpanded?'':'collapsed'}"><button class="enterprise-library-root-v4 ${state.dept==='集团资料库'?'active':''}" onclick="changeDept('集团资料库')" title="进入集团资料库">${icon('building')}<strong>集团资料库</strong></button>${rows}</div>`;
    }).join('');
    return `<div class="nav-title">${group.section}</div>${items}`;
  }).join('');
  return `<aside class="sidebar"><div class="brand"><button class="gdg-brand-v4" onclick="gdgReplayBrand()" aria-label="GDG知识库，点击播放品牌动画"><span class="gdg-logo-v4">${gdgLogo}</span><span class="gdg-brand-copy-v4"><strong>GDG知识库</strong><span>智能知识库管理平台</span></span></button></div><div class="nav-scroll">${groups}</div><div class="capacity-card"><div class="capacity-head"><strong>个人空间用量</strong><span>31%</span></div><div class="capacity-bar"><i></i></div><div class="capacity-foot">已使用 31.4 GB / 100 GB</div></div></aside>`;
};

const baseTopbar=topbar;
topbar=function(){
  return baseTopbar().replace(
    '<span class="gdg-avatar">张</span><span class="gdg-profile-copy"><strong>张明远</strong><span>研发中心</span></span>',
    '<span class="gdg-avatar gdg-avatar-v4"><span>张</span></span><span class="gdg-profile-copy"><strong>张明远</strong><span><i class="gdg-profile-status"></i>系统管理员 · 研发中心</span></span>'
  );
};

document.addEventListener('click',function(event){
  const thumb=event.target.closest('.gdg-thumb');
  if(!thumb)return;
  event.preventDefault();
  event.stopImmediatePropagation();
  const thumbs=Array.from(document.querySelectorAll('.gdg-thumb'));
  const target=thumbs.indexOf(thumb)+1;
  const current=Math.max(1,thumbs.findIndex(item=>item.classList.contains('active'))+1);
  if(target>0&&typeof window.gdgPage==='function')window.gdgPage(target-current);
},true);

document.addEventListener('dragover',function(event){
  const zone=event.target.closest('.gdg-drop');
  if(!zone)return;
  event.preventDefault();
  zone.style.borderColor='#1769ff';
  zone.style.background='#edf5ff';
});

document.addEventListener('dragleave',function(event){
  const zone=event.target.closest('.gdg-drop');
  if(!zone)return;
  zone.style.borderColor='';
  zone.style.background='';
});

document.addEventListener('drop',function(event){
  const zone=event.target.closest('.gdg-drop');
  if(!zone)return;
  event.preventDefault();
  event.stopPropagation();
  zone.style.borderColor='';
  zone.style.background='';
  const files=Array.from(event.dataTransfer&&event.dataTransfer.files||[]);
  const input=document.getElementById('fileInput');
  if(!files.length||!input)return;
  try{
    const transfer=new DataTransfer();
    files.forEach(file=>transfer.items.add(file));
    input.files=transfer.files;
    input.dispatchEvent(new Event('change',{bubbles:true}));
  }catch(error){
    if(typeof window.toast==='function')window.toast('当前浏览器不支持拖拽读取，请点击选择文件','warning');
  }
});

render();
})();