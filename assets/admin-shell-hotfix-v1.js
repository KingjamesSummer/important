(function(){
'use strict';
if(window.__gdgAdminShellHotfixV1)return;
window.__gdgAdminShellHotfixV1=true;
if(typeof state==='undefined'||typeof render!=='function'||typeof icon!=='function')return;

const baseSidebar=window.sidebar;
const baseTopbar=window.topbar;

const style=document.createElement('style');
style.id='gdg-admin-shell-hotfix-v1-css';
style.textContent=`
body.admin-console-v2 .sidebar.admin-shell-sidebar{background:#fff!important;border-right:1px solid #e2eaf4!important}
body.admin-console-v2 .admin-shell-brand{height:68px!important;padding:0 14px!important;background:#fff!important;border-bottom:1px solid #e8eef6!important}
body.admin-console-v2 .admin-shell-brand .gdg-brand-v4{height:58px!important;padding:5px 6px!important}
body.admin-console-v2 .admin-shell-brand .gdg-logo-v4{width:41px!important;height:41px!important}
.admin-brand-copy{min-width:0;display:flex;flex-direction:column;justify-content:center}
.admin-brand-title{display:flex;align-items:center;gap:7px;min-width:0}
.admin-brand-title strong{color:#162a44;font-size:15.5px;line-height:1.15;font-weight:760;white-space:nowrap}
.admin-brand-badge{height:19px;padding:0 6px;display:inline-flex;align-items:center;border:1px solid #cfe0fb;border-radius:6px;background:#edf5ff;color:#1769ff;font-size:8px;font-weight:700;letter-spacing:.04em;white-space:nowrap}
.admin-brand-copy>span{display:block;margin-top:4px;color:#8a99ab;font-size:8.7px;line-height:1.1;white-space:nowrap}
body.admin-console-v2 .admin-shell-nav{padding:12px 11px 8px!important}
body.admin-console-v2 .admin-shell-nav .nav-title{padding:12px 10px 6px!important;color:#9aa8b8!important;font-size:10px!important;letter-spacing:.04em!important}
body.admin-console-v2 .admin-shell-nav .nav-item{height:42px!important;margin:2px 0!important;border-radius:9px!important;color:#566b83!important}
body.admin-console-v2 .admin-shell-nav .nav-item:hover{background:#f4f8fd!important;color:#315f92!important}
body.admin-console-v2 .admin-shell-nav .nav-item.active{background:#edf5ff!important;color:#1769ff!important;box-shadow:inset 0 0 0 1px rgba(23,105,255,.06)!important}
body.admin-console-v2 .admin-shell-nav .nav-item.active:before{left:-11px!important;background:#1769ff!important}
.admin-scope-card{margin:10px 14px 8px;padding:12px;border:1px solid #dce7f4;border-radius:12px;background:linear-gradient(180deg,#fbfdff,#f6faff)}
.admin-scope-card span{display:flex;align-items:center;gap:6px;color:#8b9aaf;font-size:9px}
.admin-scope-card span .icon-stack{width:13px;height:13px;color:#6d8fb8}
.admin-scope-card strong{display:block;margin-top:6px;color:#314b69;font-size:11px;line-height:1.45}
.admin-scope-card small{display:block;margin-top:4px;color:#9aa7b7;font-size:8.5px}
.admin-return-button{margin:0 14px 14px;width:calc(100% - 28px);height:38px;border:1px solid #d8e4f2;border-radius:10px;background:#fff;color:#526a86;display:flex;align-items:center;justify-content:center;gap:7px;font-size:11px;transition:.16s ease}
.admin-return-button:hover{border-color:#aac8f3;background:#f4f8ff;color:#1769ff;transform:translateY(-1px)}
.admin-return-button .icon-stack{width:15px;height:15px}
body.admin-console-v2 .topbar.admin-shell-topbar{height:64px!important;padding:0 20px!important;gap:12px!important;background:rgba(255,255,255,.96)!important;border-bottom:1px solid #e5ecf5!important;box-shadow:0 3px 14px rgba(37,67,104,.025)!important}
.admin-console-breadcrumb{display:flex;align-items:center;gap:7px;min-width:0;color:#7c8da2;font-size:11px}
.admin-console-breadcrumb strong{color:#304963;font-weight:680}
.admin-console-breadcrumb .sep{color:#c3ceda}
.admin-console-breadcrumb .admin-mode{height:21px;padding:0 7px;display:inline-flex;align-items:center;border:1px solid #d5e3f6;border-radius:6px;background:#f3f8ff;color:#4274ad;font-size:8.5px;font-weight:650}
body.admin-console-v2 .admin-shell-topbar .gdg-search{width:min(410px,31vw)!important}
body.admin-console-v2 .admin-shell-topbar .gdg-profile{min-width:122px!important}
body.admin-console-v2 .admin-shell-topbar .gdg-profile-copy span{font-size:8.5px!important}
@media(max-width:1180px){body.admin-console-v2 .admin-shell-topbar .gdg-search{width:280px!important}.admin-brand-badge{display:none}}
`;
document.head.appendChild(style);

const logo=`<svg viewBox="0 0 96 96" aria-hidden="true"><defs><linearGradient id="adminShellBlue" x1="10" y1="14" x2="82" y2="83"><stop stop-color="#0b7cc7"/><stop offset=".55" stop-color="#1648a7"/><stop offset="1" stop-color="#153c91"/></linearGradient><linearGradient id="adminShellGreen" x1="42" y1="34" x2="89" y2="73"><stop stop-color="#0aa842"/><stop offset=".58" stop-color="#55bf1d"/><stop offset="1" stop-color="#b8df00"/></linearGradient></defs><path fill="url(#adminShellBlue)" d="M82.5 25.8C69.4 12.2 49.8 7.1 32.7 13.1 15.7 19.1 6.2 34.5 7.9 51.9c1.2 12.4 7.9 23.5 18.2 30.3-6.8-13.4-5.1-28.3 3.8-39.5 11.4-14.2 31.4-20.6 52.6-16.9Z"/><path fill="url(#adminShellBlue)" d="M12.2 65.4c12.9 8.1 25.3 10 39.7 6.5 13.9-3.4 25.3 1.3 36.2 12.7-16.3-5.8-27.7-4.1-39.3-.5-15.8 4.8-29.1-2.5-36.6-18.7Z"/><g class="gdg-green"><path fill="url(#adminShellGreen)" d="M40.9 48.7c10.7-15.5 26.6-22.7 47.9-20.2-15 5.7-27.6 14.2-36.4 28.8-5.2 8.6-9.5 6-11.5-8.6Z"/><path fill="url(#adminShellGreen)" d="M56 58.3c8.9-13.9 19.4-23 33.7-29.2-9.8 12.7-14.5 25.6-10.7 39.7-9.7-1.5-17.3-5-23-10.5Z"/></g></svg>`;

window.sidebar=function(){
  if(state.page!=='admin')return baseSidebar();
  const groups=[
    {section:'组织与成员',items:[['dept','building','部门管理'],['member','users','成员管理'],['grant','shield','管理员设置']]},
    {section:'治理与审计',items:[['stats','chart','统计报表'],['security','lock','安全配置']]}
  ];
  const navHtml=groups.map(group=>`<div class="nav-title">${group.section}</div>${group.items.map(([tab,ico,label])=>`<button class="nav-item ${state.adminTab===tab?'active':''}" onclick="setAdminTab('${tab}')">${icon(ico)}<span>${label}</span></button>`).join('')}`).join('');
  return `<aside class="sidebar admin-shell-sidebar"><div class="brand admin-shell-brand"><button class="gdg-brand-v4" onclick="gdgReplayBrand?.()" aria-label="GDG知识库管理中心"><span class="gdg-logo-v4">${logo}</span><span class="admin-brand-copy"><span class="admin-brand-title"><strong>GDG知识库</strong><i class="admin-brand-badge">管理端</i></span><span>智能知识库管理平台</span></span></button></div><div class="nav-scroll admin-shell-nav">${navHtml}</div><div class="admin-scope-card"><span>${icon('shield')}当前管理范围</span><strong>贵安发展集团及全部下级组织</strong><small>系统管理员 · 全集团</small></div><button class="admin-return-button" onclick="openUserConsole()">${icon('external')}打开用户端</button></aside>`;
};

window.topbar=function(){
  if(state.page!=='admin')return baseTopbar();
  const names={dept:'部门管理',member:'成员管理',grant:'管理员设置',stats:'统计报表',security:'安全配置'};
  const current=names[state.adminTab]||'部门管理';
  return `<header class="topbar admin-shell-topbar"><div class="admin-console-breadcrumb"><span>GDG知识库</span><span class="sep">/</span><span class="admin-mode">管理中心</span><span class="sep">/</span><strong>${current}</strong></div><div class="top-spacer"></div><div class="global-search gdg-search" onclick="document.getElementById('adDeptSearch')?.focus()">${icon('search')}<input placeholder="搜索部门、成员或管理功能" readonly><span class="kbd">Ctrl K</span></div><div class="gdg-actions"><button class="gdg-action" title="管理通知" onclick="toast('暂无新的管理通知')">${icon('bell')}<i class="gdg-count">1</i></button><button class="gdg-action" title="帮助" onclick="toast('管理中心帮助已打开')">${icon('info')}</button></div><div class="profile-wrap"><button class="gdg-profile" aria-expanded="${state.profileOpen}" onclick="event.stopPropagation();state.profileOpen=!state.profileOpen;closeAdminDeptMenus?.();render()"><span class="gdg-avatar gdg-avatar-v4"><span>张</span></span><span class="gdg-profile-copy"><strong>张明远</strong><span><i class="gdg-profile-status"></i>系统管理员 · 全集团</span></span>${icon('down')}</button>${state.profileOpen?profileMenu():''}</div></header>`;
};

render();
})();