/* Administrator settings flat blue/white theme v4. No gradients, no blue-gray, no blue-purple. */
(function(){
  if(window.__adminGrantFlatBlueV4)return;
  window.__adminGrantFlatBlueV4=true;

  const mount=()=>{
    if(document.getElementById('admin-grant-flat-blue-v4-css'))return;
    const style=document.createElement('style');
    style.id='admin-grant-flat-blue-v4-css';
    style.textContent=`
body.admin-grant-v2{
  --flat-blue:#1677ff;
  --flat-blue-hover:#0958d9;
  --flat-blue-soft:#eaf3ff;
  --flat-blue-soft-2:#f5f9ff;
  --flat-border:#d6e4ff;
  --flat-border-strong:#91caff;
  --flat-text:#1f2937;
  --flat-text-2:#475467;
  --flat-text-3:#667085;
  background:#fff!important;
  color:var(--flat-text-2)!important;
}
body.admin-grant-v2 .app,
body.admin-grant-v2 .main,
body.admin-grant-v2 .sidebar.admin-shell-sidebar,
body.admin-grant-v2 .admin-shell-brand,
body.admin-grant-v2 .admin-shell-brand .gdg-brand-v4,
body.admin-grant-v2 .topbar.admin-shell-topbar,
body.admin-grant-v2 .admin-shell-topbar .gdg-search,
body.admin-grant-v2 .admin-shell-topbar .gdg-profile,
body.admin-grant-v2 .ag-page,
body.admin-grant-v2 .ag-card,
body.admin-grant-v2 .ag-card-head,
body.admin-grant-v2 .ag-table-wrap,
body.admin-grant-v2 .ag-table tbody td,
body.admin-grant-v2 .ag-modal,
body.admin-grant-v2 .ag-modal-head,
body.admin-grant-v2 .ag-modal-foot{
  background:#fff!important;
  background-image:none!important;
}
body.admin-grant-v2 .main{
  padding:16px 20px 20px!important;
}
body.admin-grant-v2 .admin-shell-brand .gdg-brand-v4:before,
body.admin-grant-v2 .admin-shell-brand .gdg-brand-v4:after,
body.admin-grant-v2 .topbar.admin-shell-topbar:before,
body.admin-grant-v2 .topbar.admin-shell-topbar:after,
body.admin-grant-v2 .ag-hero:before,
body.admin-grant-v2 .ag-hero:after,
body.admin-grant-v2 .ag-stat:after{
  content:none!important;
  display:none!important;
  background:none!important;
}
body.admin-grant-v2 .admin-shell-brand,
body.admin-grant-v2 .topbar.admin-shell-topbar{
  border-color:var(--flat-border)!important;
  box-shadow:none!important;
  animation:none!important;
}
body.admin-grant-v2 .admin-brand-title strong,
body.admin-grant-v2 .admin-console-breadcrumb strong,
body.admin-grant-v2 .page-title,
body.admin-grant-v2 .ag-hero-copy h2,
body.admin-grant-v2 .ag-person>div>strong,
body.admin-grant-v2 .ag-stat strong,
body.admin-grant-v2 .ag-modal-title strong{
  color:var(--flat-text)!important;
}
body.admin-grant-v2 .admin-brand-copy>span,
body.admin-grant-v2 .admin-console-breadcrumb,
body.admin-grant-v2 .page-subtitle,
body.admin-grant-v2 .ag-hero-copy p,
body.admin-grant-v2 .ag-person>div>span,
body.admin-grant-v2 .ag-stat-top,
body.admin-grant-v2 .ag-stat small,
body.admin-grant-v2 .ag-count,
body.admin-grant-v2 .ag-modal-title span,
body.admin-grant-v2 .ag-field label{
  color:var(--flat-text-3)!important;
}
body.admin-grant-v2 .admin-brand-badge,
body.admin-grant-v2 .admin-console-breadcrumb .admin-mode,
body.admin-grant-v2 .btn.primary,
body.admin-grant-v2 .ag-primary,
body.admin-grant-v2 .admin-top-badge{
  background:var(--flat-blue)!important;
  background-image:none!important;
  border-color:var(--flat-blue)!important;
  color:#fff!important;
  box-shadow:none!important;
}
body.admin-grant-v2 .btn.primary:hover,
body.admin-grant-v2 .ag-primary:hover{
  background:var(--flat-blue-hover)!important;
  background-image:none!important;
  border-color:var(--flat-blue-hover)!important;
  box-shadow:none!important;
}
body.admin-grant-v2 .admin-shell-nav .nav-title{
  color:#7a7a7a!important;
}
body.admin-grant-v2 .admin-shell-nav .nav-item,
body.admin-grant-v2 .admin-shell-nav .nav-item .icon-stack{
  color:#4b5563!important;
}
body.admin-grant-v2 .admin-shell-nav .nav-item:hover{
  background:var(--flat-blue-soft-2)!important;
  background-image:none!important;
  color:var(--flat-blue)!important;
  transform:none!important;
}
body.admin-grant-v2 .admin-shell-nav .nav-item.active{
  background:var(--flat-blue-soft)!important;
  background-image:none!important;
  color:var(--flat-blue)!important;
  border-color:var(--flat-border-strong)!important;
  box-shadow:none!important;
}
body.admin-grant-v2 .admin-shell-nav .nav-item.active .icon-stack{
  color:var(--flat-blue)!important;
}
body.admin-grant-v2 .admin-shell-nav .nav-item.active:before{
  background:var(--flat-blue)!important;
  background-image:none!important;
  box-shadow:none!important;
  animation:none!important;
}
body.admin-grant-v2 .admin-shell-topbar .gdg-search,
body.admin-grant-v2 .ag-search,
body.admin-grant-v2 .ag-select,
body.admin-grant-v2 .ag-input,
body.admin-grant-v2 .ag-textarea,
body.admin-grant-v2 .ag-form-select{
  border-color:var(--flat-border)!important;
  color:var(--flat-text-2)!important;
  box-shadow:none!important;
}
body.admin-grant-v2 .admin-shell-topbar .gdg-search:hover,
body.admin-grant-v2 .admin-shell-topbar .gdg-search:focus-within,
body.admin-grant-v2 .ag-search:focus-within,
body.admin-grant-v2 .ag-select:focus,
body.admin-grant-v2 .ag-input:focus,
body.admin-grant-v2 .ag-textarea:focus,
body.admin-grant-v2 .ag-form-select:focus{
  border-color:var(--flat-blue)!important;
  background:#fff!important;
  box-shadow:0 0 0 3px rgba(22,119,255,.10)!important;
}
body.admin-grant-v2 .admin-shell-topbar .gdg-avatar-v4{
  background:var(--flat-blue)!important;
  background-image:none!important;
  border-color:var(--flat-blue)!important;
  color:#fff!important;
  box-shadow:none!important;
}
body.admin-grant-v2 .admin-shell-topbar .gdg-profile:hover,
body.admin-grant-v2 .admin-top-tool:hover,
body.admin-grant-v2 .admin-return-button:hover{
  background:var(--flat-blue-soft)!important;
  background-image:none!important;
  color:var(--flat-blue)!important;
  border-color:var(--flat-border-strong)!important;
  box-shadow:none!important;
}
body.admin-grant-v2 .ag-page{
  width:100%!important;
  max-width:none!important;
  margin:0!important;
  padding:0!important;
}
body.admin-grant-v2 .ag-page .page-head{
  margin-bottom:10px!important;
}
body.admin-grant-v2 .ag-hero{
  min-height:82px!important;
  padding:15px 18px!important;
  gap:16px!important;
  border:1px solid var(--flat-border)!important;
  border-radius:14px!important;
  background:#fff!important;
  background-image:none!important;
  box-shadow:none!important;
}
body.admin-grant-v2 .ag-hero-icon{
  width:46px!important;
  height:46px!important;
  border-radius:12px!important;
  background:var(--flat-blue)!important;
  background-image:none!important;
  color:#fff!important;
  box-shadow:none!important;
}
body.admin-grant-v2 .ag-mini-tag,
body.admin-grant-v2 .ag-mini-tag.risk{
  height:22px!important;
  border:1px solid var(--flat-border)!important;
  background:var(--flat-blue-soft-2)!important;
  color:var(--flat-blue)!important;
}
body.admin-grant-v2 .ag-stats{
  gap:10px!important;
  margin:10px 0!important;
}
body.admin-grant-v2 .ag-stat,
body.admin-grant-v2 .ag-stat.green,
body.admin-grant-v2 .ag-stat.orange,
body.admin-grant-v2 .ag-stat.purple{
  min-height:78px!important;
  padding:12px 14px!important;
  border:1px solid var(--flat-border)!important;
  border-left:4px solid var(--flat-blue)!important;
  border-radius:12px!important;
  background:#fff!important;
  background-image:none!important;
  box-shadow:none!important;
}
body.admin-grant-v2 .ag-stat:hover{
  transform:none!important;
  border-color:var(--flat-border-strong)!important;
  box-shadow:0 6px 16px rgba(22,119,255,.06)!important;
}
body.admin-grant-v2 .ag-stat-icon,
body.admin-grant-v2 .ag-stat.green .ag-stat-icon,
body.admin-grant-v2 .ag-stat.orange .ag-stat-icon,
body.admin-grant-v2 .ag-stat.purple .ag-stat-icon{
  width:30px!important;
  height:30px!important;
  border:1px solid var(--flat-border)!important;
  border-radius:9px!important;
  background:var(--flat-blue-soft)!important;
  color:var(--flat-blue)!important;
  box-shadow:none!important;
}
body.admin-grant-v2 .ag-card{
  border:1px solid var(--flat-border)!important;
  border-radius:14px!important;
  box-shadow:none!important;
}
body.admin-grant-v2 .ag-card-head{
  min-height:52px!important;
  padding:10px 12px!important;
  border-bottom:1px solid var(--flat-border)!important;
}
body.admin-grant-v2 .ag-table-wrap{
  padding:0 10px 10px!important;
}
body.admin-grant-v2 .ag-table{
  border-collapse:separate!important;
  border-spacing:0 7px!important;
}
body.admin-grant-v2 .ag-table thead th{
  height:34px!important;
  padding:0 12px!important;
  background:#fff!important;
  color:#667085!important;
  border:0!important;
}
body.admin-grant-v2 .ag-table tbody td{
  height:60px!important;
  padding:0 12px!important;
  border-top:1px solid #e5e7eb!important;
  border-bottom:1px solid #e5e7eb!important;
  color:#475467!important;
  box-shadow:none!important;
}
body.admin-grant-v2 .ag-table tbody td:first-child{
  border-left:1px solid #e5e7eb!important;
  border-radius:10px 0 0 10px!important;
}
body.admin-grant-v2 .ag-table tbody td:last-child{
  border-right:1px solid #e5e7eb!important;
  border-radius:0 10px 10px 0!important;
}
body.admin-grant-v2 .ag-table tbody tr:hover td{
  background:var(--flat-blue-soft-2)!important;
  border-color:var(--flat-border-strong)!important;
  box-shadow:none!important;
}
body.admin-grant-v2 .ag-person{
  min-width:195px!important;
  gap:11px!important;
}
body.admin-grant-v2 .ag-person>.ag-avatar{
  width:38px!important;
  height:38px!important;
  flex:0 0 38px!important;
  display:grid!important;
  place-items:center!important;
  margin:0!important;
  padding:0!important;
  border:1px solid var(--flat-border-strong)!important;
  border-radius:11px!important;
  background:var(--flat-blue-soft)!important;
  background-image:none!important;
  color:var(--flat-blue)!important;
  font-size:14px!important;
  font-weight:800!important;
  line-height:1!important;
  text-align:center!important;
  box-shadow:none!important;
  overflow:hidden!important;
}
body.admin-grant-v2 .ag-type,
body.admin-grant-v2 .ag-type.system,
body.admin-grant-v2 .ag-scope span,
body.admin-grant-v2 .ag-perm,
body.admin-grant-v2 .ag-perm.risk,
body.admin-grant-v2 .ag-more-count{
  border:1px solid var(--flat-border)!important;
  background:var(--flat-blue-soft-2)!important;
  background-image:none!important;
  color:var(--flat-blue)!important;
  box-shadow:none!important;
}
body.admin-grant-v2 .ag-status{
  border:1px solid #b7ebc6!important;
  background:#f6ffed!important;
  color:#237804!important;
  box-shadow:none!important;
}
body.admin-grant-v2 .ag-status.off{
  border-color:#d9d9d9!important;
  background:#fafafa!important;
  color:#8c8c8c!important;
}
body.admin-grant-v2 .ag-action,
body.admin-grant-v2 .ag-action.edit{
  border-color:var(--flat-border)!important;
  background:#fff!important;
  background-image:none!important;
  color:var(--flat-blue)!important;
  box-shadow:none!important;
}
body.admin-grant-v2 .ag-action:hover,
body.admin-grant-v2 .ag-action.warn:hover{
  border-color:var(--flat-border-strong)!important;
  background:var(--flat-blue-soft)!important;
  color:var(--flat-blue-hover)!important;
  transform:none!important;
  box-shadow:none!important;
}
body.admin-grant-v2 .ag-modal-layer{
  background:rgba(17,24,39,.36)!important;
}
body.admin-grant-v2 .ag-modal{
  border-color:var(--flat-border)!important;
  box-shadow:0 20px 60px rgba(17,24,39,.18)!important;
}
body.admin-grant-v2 .ag-modal-head,
body.admin-grant-v2 .ag-modal-foot{
  border-color:var(--flat-border)!important;
}
body.admin-grant-v2 .ag-modal-head-icon,
body.admin-grant-v2 .ag-choice,
body.admin-grant-v2 .ag-form-status,
body.admin-grant-v2 .ag-scope-note{
  background:var(--flat-blue-soft-2)!important;
  background-image:none!important;
  border-color:var(--flat-border)!important;
  color:var(--flat-blue)!important;
}
body.admin-grant-v2 .ag-choice.risk{
  background:var(--flat-blue-soft-2)!important;
  border-color:var(--flat-border)!important;
}
body.admin-grant-v2 .ag-choice.risk strong{
  color:var(--flat-blue)!important;
}
@media(max-width:1180px){
  body.admin-grant-v2 .ag-table{min-width:1080px!important}
  body.admin-grant-v2 .ag-stats{grid-template-columns:repeat(2,minmax(0,1fr))!important}
}
@media(max-width:760px){
  body.admin-grant-v2 .main{padding:12px!important}
  body.admin-grant-v2 .ag-stats{grid-template-columns:1fr!important}
}
`;
    document.head.appendChild(style);
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});
  else mount();
})();
