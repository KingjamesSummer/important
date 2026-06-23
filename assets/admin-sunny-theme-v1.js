(function(){
'use strict';
if(window.__gdgAdminSunnyThemeV1)return;
window.__gdgAdminSunnyThemeV1=true;
const style=document.createElement('style');
style.id='gdg-admin-sunny-theme-v1-css';
style.textContent=`
body.admin-console-v2{
  --sun-blue:#1769ff;
  --sun-blue-strong:#0f56dd;
  --sun-cyan:#2aa8ff;
  --sun-sky:#eef7ff;
  --sun-sky-2:#e3f1ff;
  --sun-line:#cfe3fb;
  --sun-ink:#102a4f;
  --sun-text:#315f95;
  --sun-sub:#6c8fbd;
  background:#f5faff!important;
}
body.admin-console-v2 .app{background:#f5faff!important}
body.admin-console-v2 .main{
  background:
    radial-gradient(circle at 16% -12%,rgba(55,151,255,.22),transparent 31%),
    radial-gradient(circle at 86% 2%,rgba(59,183,255,.16),transparent 25%),
    linear-gradient(180deg,#f9fcff 0%,#eff7ff 48%,#f5faff 100%)!important;
}
body.admin-console-v2 .sidebar.admin-shell-sidebar{
  background:linear-gradient(180deg,#fff 0%,#f8fcff 100%)!important;
  border-right-color:#d8e9fd!important;
  box-shadow:8px 0 28px rgba(34,112,210,.035)!important;
}
body.admin-console-v2 .admin-shell-brand{
  background:linear-gradient(180deg,#fff 0%,#f7fbff 100%)!important;
  border-bottom-color:#dbeafd!important;
}
body.admin-console-v2 .admin-brand-title strong{color:#0d2b55!important}
body.admin-console-v2 .admin-brand-badge{
  border-color:#a9ceff!important;
  background:linear-gradient(135deg,#eaf4ff,#d9ecff)!important;
  color:#075fe9!important;
  box-shadow:0 4px 12px rgba(23,105,255,.10)!important;
}
body.admin-console-v2 .admin-brand-copy>span{color:#5f83b3!important}
body.admin-console-v2 .admin-shell-nav .nav-title{color:#6f94c4!important}
body.admin-console-v2 .admin-shell-nav .nav-item{color:#315d91!important}
body.admin-console-v2 .admin-shell-nav .nav-item .icon-stack{color:#4d87c9!important}
body.admin-console-v2 .admin-shell-nav .nav-item:hover{
  background:linear-gradient(90deg,#edf6ff,#f8fcff)!important;
  color:#0f63df!important;
  transform:translateX(2px)!important;
}
body.admin-console-v2 .admin-shell-nav .nav-item.active{
  background:linear-gradient(90deg,#dfeeff 0%,#eef7ff 100%)!important;
  color:#075fe9!important;
  box-shadow:inset 0 0 0 1px #c6e0ff,0 7px 18px rgba(23,105,255,.08)!important;
}
body.admin-console-v2 .admin-shell-nav .nav-item.active .icon-stack{color:#075fe9!important}
body.admin-console-v2 .admin-shell-nav .nav-item.active:before{
  width:4px!important;
  background:linear-gradient(180deg,#2aa8ff,#1769ff)!important;
  box-shadow:0 0 0 3px rgba(23,105,255,.08)!important;
  animation:adminSunnyActive 5.6s ease-in-out infinite;
}
body.admin-console-v2 .admin-scope-card{
  border-color:#c9e0fb!important;
  background:linear-gradient(145deg,#ffffff,#edf7ff)!important;
  box-shadow:0 9px 22px rgba(23,105,255,.07)!important;
}
body.admin-console-v2 .admin-scope-card span{color:#5481b8!important}
body.admin-console-v2 .admin-scope-card span .icon-stack{color:#1769ff!important}
body.admin-console-v2 .admin-scope-card strong{color:#174b87!important}
body.admin-console-v2 .admin-scope-card small{color:#6d94c5!important}
body.admin-console-v2 .admin-return-button{
  border-color:#bedbff!important;
  background:linear-gradient(180deg,#fff,#f0f7ff)!important;
  color:#1769ff!important;
  box-shadow:0 7px 18px rgba(23,105,255,.07)!important;
}
body.admin-console-v2 .admin-return-button:hover{
  border-color:#74b5ff!important;
  background:linear-gradient(135deg,#edf6ff,#dceeff)!important;
  color:#0756d6!important;
  box-shadow:0 10px 24px rgba(23,105,255,.13)!important;
}

body.admin-console-v2 .topbar.admin-shell-topbar{
  background:
    linear-gradient(90deg,rgba(255,255,255,.99),rgba(240,248,255,.98),rgba(255,255,255,.99))!important;
  background-size:180% 100%!important;
  border-bottom-color:#d8e9fd!important;
  box-shadow:0 6px 22px rgba(23,105,255,.055)!important;
  animation:adminSunnyTopbar 18s ease-in-out infinite!important;
}
body.admin-console-v2 .admin-console-breadcrumb{color:#5b86ba!important}
body.admin-console-v2 .admin-console-breadcrumb strong{color:#0f3f78!important}
body.admin-console-v2 .admin-console-breadcrumb .sep{color:#9cc2ed!important}
body.admin-console-v2 .admin-console-breadcrumb .admin-mode{
  border-color:#b9d8ff!important;
  background:linear-gradient(135deg,#ecf6ff,#dfefff)!important;
  color:#075fe9!important;
  box-shadow:0 4px 11px rgba(23,105,255,.07)!important;
}
body.admin-console-v2 .admin-shell-topbar .gdg-search{
  border-color:#bcdcff!important;
  background:linear-gradient(180deg,#fff,#f2f8ff)!important;
  color:#4a7fb8!important;
  box-shadow:0 6px 18px rgba(23,105,255,.055),inset 0 1px #fff!important;
}
body.admin-console-v2 .admin-shell-topbar .gdg-search:hover,
body.admin-console-v2 .admin-shell-topbar .gdg-search:focus-within{
  border-color:#6eb1ff!important;
  background:#fff!important;
  box-shadow:0 0 0 3px rgba(23,105,255,.09),0 10px 24px rgba(23,105,255,.10)!important;
}
body.admin-console-v2 .admin-shell-topbar .gdg-search input{color:#164d88!important}
body.admin-console-v2 .admin-shell-topbar .gdg-search input::placeholder{color:#73a0d1!important}
body.admin-console-v2 .admin-shell-topbar .gdg-search .kbd{
  border-color:#cce2fb!important;
  background:#eaf4ff!important;
  color:#4f7fb8!important;
}
body.admin-console-v2 .admin-top-tool{color:#2f74bd!important}
body.admin-console-v2 .admin-top-tool:hover{
  border-color:#add3ff!important;
  background:linear-gradient(145deg,#f3f9ff,#dfefff)!important;
  color:#075fe9!important;
  box-shadow:0 9px 21px rgba(23,105,255,.13)!important;
}
body.admin-console-v2 .admin-top-badge{
  background:linear-gradient(135deg,#29a8ff,#1769ff)!important;
  box-shadow:0 4px 10px rgba(23,105,255,.30)!important;
}
body.admin-console-v2 .admin-profile-wrap:before{background:#cfe3fa!important}
body.admin-console-v2 .admin-shell-topbar .gdg-profile:hover{
  background:linear-gradient(135deg,#eff7ff,#e3f1ff)!important;
  box-shadow:0 8px 20px rgba(23,105,255,.09)!important;
}
body.admin-console-v2 .admin-shell-topbar .gdg-avatar-v4{
  background:linear-gradient(145deg,#e9f5ff,#cfe6ff)!important;
  border-color:#a9d0ff!important;
  color:#0756d6!important;
  box-shadow:0 7px 17px rgba(23,105,255,.13),inset 0 1px #fff!important;
}
body.admin-console-v2 .admin-shell-topbar .gdg-profile-copy strong{color:#123b70!important}
body.admin-console-v2 .admin-shell-topbar .gdg-profile-copy span{color:#5f86b5!important}

body.admin-console-v2 .page-title{color:#0d2f5e!important}
body.admin-console-v2 .page-subtitle{color:#5f86b7!important}
body.admin-console-v2 .ad-toolbar{
  border-color:#cfe4fd!important;
  background:linear-gradient(180deg,#fff,#f2f8ff)!important;
  box-shadow:0 10px 26px rgba(23,105,255,.07)!important;
}
body.admin-console-v2 .ad-sync-note{color:#4d7fb6!important}
body.admin-console-v2 .ad-sync-pulse{
  background:#1c8dff!important;
  box-shadow:0 0 0 4px #e0f0ff,0 0 18px rgba(28,141,255,.25)!important;
  animation:adminSunnyPulse 3.8s ease-in-out infinite;
}
body.admin-console-v2 .ad-tree-panel,
body.admin-console-v2 .ad-detail-panel,
body.admin-console-v2 .ad-card,
body.admin-console-v2 .ad-metric{
  border-color:#cfe2fa!important;
  background:#fff!important;
  box-shadow:0 12px 30px rgba(23,105,255,.065)!important;
}
body.admin-console-v2 .ad-tree-head,
body.admin-console-v2 .ad-hero,
body.admin-console-v2 .ad-card-head{
  background:linear-gradient(180deg,#fff,#f2f8ff)!important;
  border-color:#d9e9fb!important;
}
body.admin-console-v2 .ad-tree-title-row,
body.admin-console-v2 .ad-dept-copy h2,
body.admin-console-v2 .ad-card-head{color:#174b86!important}
body.admin-console-v2 .ad-tree-search{
  border-color:#c4ddfa!important;
  background:#f4f9ff!important;
  color:#4b80ba!important;
}
body.admin-console-v2 .ad-tree-search:focus-within{
  border-color:#69adff!important;
  background:#fff!important;
  box-shadow:0 0 0 3px rgba(23,105,255,.09)!important;
}
body.admin-console-v2 .ad-tree-line{color:#315f92!important}
body.admin-console-v2 .ad-tree-line:hover{background:#eef7ff!important;color:#075fe9!important}
body.admin-console-v2 .ad-tree-line.active{
  background:linear-gradient(90deg,#dceeff,#eef7ff)!important;
  color:#075fe9!important;
  box-shadow:inset 0 0 0 1px #bcd9ff,0 6px 16px rgba(23,105,255,.08)!important;
}
body.admin-console-v2 .ad-tree-children:before,
body.admin-console-v2 .ad-tree-children>.ad-tree-node>.ad-tree-line:before{border-color:#bcd8f6!important}
body.admin-console-v2 .ad-metric:before{background:linear-gradient(180deg,#28a8ff,#1769ff)!important}
body.admin-console-v2 .ad-metric strong{color:#0f3e75!important}
body.admin-console-v2 .ad-metric span,
body.admin-console-v2 .ad-info-item label,
body.admin-console-v2 .ad-role-row label{color:#6790c0!important}
body.admin-console-v2 .ad-info-item div,
body.admin-console-v2 .ad-library-main strong{color:#285a91!important}
body.admin-console-v2 .ad-tabs button{color:#4f79aa!important}
body.admin-console-v2 .ad-tabs button.active{color:#075fe9!important}
body.admin-console-v2 .ad-tabs button.active:after{background:linear-gradient(90deg,#2aa8ff,#1769ff)!important}
body.admin-console-v2 .btn.primary{
  background:linear-gradient(135deg,#258bff,#1769ff)!important;
  border-color:#1769ff!important;
  box-shadow:0 8px 20px rgba(23,105,255,.23)!important;
}
body.admin-console-v2 .btn.primary:hover{
  background:linear-gradient(135deg,#197df0,#0756d6)!important;
  border-color:#0756d6!important;
  box-shadow:0 12px 26px rgba(23,105,255,.28)!important;
  transform:translateY(-1px)!important;
}

@keyframes adminSunnyTopbar{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
@keyframes adminSunnyActive{0%,100%{box-shadow:0 0 0 3px rgba(23,105,255,.08)}50%{box-shadow:0 0 0 5px rgba(23,105,255,.045)}}
@keyframes adminSunnyPulse{0%,100%{box-shadow:0 0 0 4px #e0f0ff,0 0 12px rgba(28,141,255,.18)}50%{box-shadow:0 0 0 6px rgba(224,240,255,.76),0 0 22px rgba(28,141,255,.30)}}
@media(prefers-reduced-motion:reduce){body.admin-console-v2 .topbar.admin-shell-topbar,body.admin-console-v2 .admin-shell-nav .nav-item.active:before,body.admin-console-v2 .ad-sync-pulse{animation:none!important}}
`;
document.head.appendChild(style);
})();