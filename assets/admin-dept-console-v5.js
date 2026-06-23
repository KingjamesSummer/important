/* Department management console v5 — flatter information architecture and compact tree. */
(function(){
  if(window.__adminDeptConsoleV5)return;
  window.__adminDeptConsoleV5=true;
  if(typeof state==='undefined'||typeof render!=='function')return;

  const css=`
body.admin-console-v2{
  --ad5-primary:#2468e8;
  --ad5-primary-strong:#174fb8;
  --ad5-indigo:#6257d9;
  --ad5-cyan:#1796c9;
  --ad5-teal:#128d7e;
  --ad5-bg:#eaf1f9;
  --ad5-panel:#f7faff;
  --ad5-line:#cbd9e9;
  --ad5-text:#274768;
  background:var(--ad5-bg)!important;
}
body.admin-console-v2 .main{
  background:linear-gradient(180deg,#eef4fb 0%,#e7eef7 100%)!important;
  padding-top:18px!important;
}
body.admin-console-v2 .page-head{
  min-height:auto!important;
  margin:0 0 14px!important;
  padding:0 2px 8px!important;
  border:0!important;
  border-radius:0!important;
  background:transparent!important;
  box-shadow:none!important;
}
body.admin-console-v2 .page-title{font-size:23px!important;color:#173554!important}
body.admin-console-v2 .page-subtitle{color:#6d8198!important}
body.admin-console-v2 .badge.blue{
  border:1px solid #bcd2f1!important;
  background:#e5effd!important;
  color:#245fb6!important;
  box-shadow:none!important;
}
body.admin-console-v2 .ad-page{gap:10px!important}
body.admin-console-v2 .ad-toolbar{
  min-height:52px!important;
  padding:0 12px!important;
  border:1px solid #bfd0e5!important;
  border-radius:12px!important;
  background:#f7faff!important;
  color:#526c88!important;
  box-shadow:0 6px 16px rgba(38,72,112,.07)!important;
}
body.admin-console-v2 .ad-sync-note{color:#637b96!important}
body.admin-console-v2 .ad-sync-pulse{
  background:#2d78e9!important;
  box-shadow:0 0 0 4px rgba(45,120,233,.12)!important;
}
body.admin-console-v2 .ad-toolbar .btn{
  border-color:#b8cce5!important;
  background:#eef4fb!important;
  color:#365b84!important;
  box-shadow:none!important;
  backdrop-filter:none!important;
}
body.admin-console-v2 .ad-toolbar .btn:hover{background:#e3eefc!important;border-color:#8fb2df!important;color:#1859bf!important}
body.admin-console-v2 .ad-toolbar .btn.primary{
  border-color:#2468e8!important;
  background:#2468e8!important;
  color:#fff!important;
  box-shadow:0 6px 15px rgba(36,104,232,.2)!important;
}
body.admin-console-v2 .ad-workspace{
  grid-template-columns:292px minmax(0,1fr)!important;
  gap:12px!important;
  min-height:calc(100vh - 190px)!important;
}

/* One compact tree surface — no distributed vertical gaps. */
body.admin-console-v2 .ad-tree-panel{
  border:1px solid #b9cde5!important;
  border-radius:13px!important;
  background:#e6effa!important;
  box-shadow:0 9px 24px rgba(37,72,114,.1)!important;
}
body.admin-console-v2 .ad-tree-head{
  padding:14px!important;
  border-bottom:1px solid #bdcee2!important;
  background:#d7e6f8!important;
}
body.admin-console-v2 .ad-tree-title-row{color:#244c76!important;font-size:13px!important}
body.admin-console-v2 .ad-tree-title-row .icon-stack{color:#2468e8!important;filter:none!important}
body.admin-console-v2 .ad-tree-title-row small{color:#7087a1!important}
body.admin-console-v2 .ad-tree-search{
  height:36px!important;
  border-color:#afc4df!important;
  background:#f7faff!important;
}
body.admin-console-v2 .ad-tree-expand{
  width:36px!important;height:36px!important;
  border-color:#afc4df!important;
  background:#f7faff!important;
  color:#476b94!important;
}
body.admin-console-v2 .ad-tree-scroll{
  display:block!important;
  flex:1 1 auto!important;
  min-height:0!important;
  padding:10px 9px 14px!important;
  background:#e6effa!important;
  overflow:auto!important;
}
body.admin-console-v2 .ad4-tree-section{
  margin:4px 3px 7px!important;
  padding:0 7px!important;
  color:#748aa3!important;
  font-size:9px!important;
  font-weight:700!important;
  letter-spacing:.08em!important;
}
body.admin-console-v2 .ad4-node,
body.admin-console-v2 .ad-tree-node{
  display:block!important;
  position:relative!important;
  width:auto!important;
  height:auto!important;
  min-height:0!important;
  max-height:none!important;
  margin:0!important;
  padding:0!important;
  flex:none!important;
  align-self:auto!important;
}
body.admin-console-v2 .ad4-row{
  position:relative!important;
  width:auto!important;
  height:38px!important;
  min-height:38px!important;
  max-height:38px!important;
  margin:2px 0!important;
  padding:0 5px!important;
  display:grid!important;
  grid-template-columns:22px minmax(0,1fr) 26px!important;
  align-items:center!important;
  gap:4px!important;
  border:1px solid transparent!important;
  border-radius:8px!important;
  background:transparent!important;
  color:#3e5d7b!important;
  box-shadow:none!important;
}
body.admin-console-v2 .ad4-row:hover{
  border-color:#b9cee8!important;
  background:#f2f7fd!important;
  color:#245a96!important;
  box-shadow:none!important;
}
body.admin-console-v2 .ad4-row.active{
  border-color:#91b6e8!important;
  background:#d8e8fd!important;
  color:#1758bf!important;
  box-shadow:inset 3px 0 #2468e8!important;
}
body.admin-console-v2 .ad4-node[data-depth="0"]>.ad4-row{
  background:#dce9f8!important;
  color:#294f76!important;
}
body.admin-console-v2 .ad4-node[data-depth="0"]>.ad4-row.active{background:#d2e4fb!important;color:#1557bd!important}
body.admin-console-v2 .ad4-toggle,
body.admin-console-v2 .ad4-more{
  width:22px!important;height:26px!important;
  border:0!important;border-radius:6px!important;
  background:transparent!important;color:#65809d!important;
}
body.admin-console-v2 .ad4-toggle:hover,
body.admin-console-v2 .ad4-more:hover{background:#eef5fd!important;color:#1f62c9!important}
body.admin-console-v2 .ad4-select{height:36px!important;gap:8px!important}
body.admin-console-v2 .ad4-select .icon-stack{width:16px!important;height:16px!important;color:#52789f!important;filter:none!important}
body.admin-console-v2 .ad4-name{font-size:11px!important;font-weight:580!important}
body.admin-console-v2 .ad4-row.active .ad4-name{font-weight:700!important}
body.admin-console-v2 .ad4-children{
  display:block;
  position:relative!important;
  width:auto!important;
  height:auto!important;
  min-height:0!important;
  max-height:none!important;
  margin:0 0 0 11px!important;
  padding:0 0 0 15px!important;
}
body.admin-console-v2 .ad4-children.collapsed{display:none!important}
body.admin-console-v2 .ad4-children:before{
  left:5px!important;top:-2px!important;bottom:18px!important;
  border-left:1px solid #9db7d6!important;
}
body.admin-console-v2 .ad4-children>.ad4-node>.ad4-row:before{
  left:-10px!important;top:18px!important;width:10px!important;
  border-top:1px solid #9db7d6!important;
}
body.admin-console-v2 .ad-tree-scroll.searching .ad4-children{display:block!important}
body.admin-console-v2 .ad-tree-menu{top:34px!important}

/* One right-side canvas rather than cards inside cards. */
body.admin-console-v2 .ad-detail-panel{
  border:1px solid #b9cde5!important;
  border-radius:13px!important;
  background:#f7faff!important;
  box-shadow:0 9px 24px rgba(37,72,114,.1)!important;
}
body.admin-console-v2 .ad-hero{
  padding:17px 18px!important;
  border-bottom:1px solid #c3d4e7!important;
  background:#dce9f9!important;
  color:#244967!important;
}
body.admin-console-v2 .ad-dept-icon{
  width:43px!important;height:43px!important;
  border-color:#a9c5e8!important;
  background:#eef5fd!important;
  color:#2468e8!important;
  box-shadow:none!important;
}
body.admin-console-v2 .ad-dept-copy h2{color:#173f67!important;font-size:19px!important}
body.admin-console-v2 .ad-dept-copy p{color:#6e8299!important}
body.admin-console-v2 .ad-hero .ad-tag{
  border-color:#aac1df!important;
  background:#eef5fd!important;
  color:#3d628b!important;
}
body.admin-console-v2 .ad-hero .ad-tag.success{background:#dff3ec!important;color:#24745d!important;border-color:#b4ddcf!important}
body.admin-console-v2 .ad-hero-actions .btn{
  border-color:#a9c1df!important;
  background:#eef5fd!important;
  color:#365d87!important;
}
body.admin-console-v2 .ad-hero-actions .btn:hover{background:#e2eefc!important;color:#175dc5!important}
body.admin-console-v2 .ad-tabs{
  height:44px!important;
  border-bottom:1px solid #c3d4e7!important;
  background:#edf4fc!important;
}
body.admin-console-v2 .ad-tabs button{height:44px!important;color:#5a718b!important}
body.admin-console-v2 .ad-tabs button.active{color:#185abe!important}
body.admin-console-v2 .ad-tabs button.active:after{height:2px!important;background:#2468e8!important;box-shadow:none!important}
body.admin-console-v2 .ad-body{
  padding:0!important;
  background:#f7faff!important;
}

/* Unified KPI band, not four separate cards. */
body.admin-console-v2 .ad-metrics{
  display:grid!important;
  grid-template-columns:repeat(4,minmax(0,1fr))!important;
  gap:0!important;
  margin:0!important;
  border-bottom:1px solid #c6d6e8!important;
  background:#e7f0fb!important;
}
body.admin-console-v2 .ad-metric{
  min-height:92px!important;
  margin:0!important;
  padding:16px 17px!important;
  border:0!important;
  border-right:1px solid #c7d7e9!important;
  border-radius:0!important;
  background:transparent!important;
  color:#294e72!important;
  box-shadow:none!important;
}
body.admin-console-v2 .ad-metric:last-child{border-right:0!important}
body.admin-console-v2 .ad-metric:before{display:none!important}
body.admin-console-v2 .ad-metric span{color:#6c819a!important}
body.admin-console-v2 .ad-metric strong{color:#174e8d!important;text-shadow:none!important}
body.admin-console-v2 .ad-metric:nth-child(2) strong{color:#157ca6!important}
body.admin-console-v2 .ad-metric:nth-child(3) strong{color:#574dc3!important}
body.admin-console-v2 .ad-metric:nth-child(4) strong{color:#14786e!important}
body.admin-console-v2 .ad-metric small{color:#8495a8!important}

/* Each row is one section with an internal divider, not nested cards. */
body.admin-console-v2 .ad-grid-2{
  display:grid!important;
  grid-template-columns:minmax(0,1.15fr) minmax(300px,.85fr)!important;
  gap:0!important;
  margin:0!important;
  border-bottom:1px solid #c6d6e8!important;
  background:#f7faff!important;
}
body.admin-console-v2 .ad-grid-2:last-child{border-bottom:0!important}
body.admin-console-v2 .ad-grid-2>.ad-card{
  border:0!important;
  border-radius:0!important;
  background:transparent!important;
  box-shadow:none!important;
}
body.admin-console-v2 .ad-grid-2>.ad-card+ .ad-card{border-left:1px solid #c6d6e8!important}
body.admin-console-v2 .ad-card-head,
body.admin-console-v2 .ad-audit-head{
  height:44px!important;
  padding:0 15px!important;
  border-bottom:1px solid #d3dfed!important;
  background:#edf4fc!important;
  color:#28517a!important;
}
body.admin-console-v2 .ad-card-head:before,
body.admin-console-v2 .ad-audit-head:before{
  width:3px!important;height:14px!important;margin-right:7px!important;
  background:#2468e8!important;
}
body.admin-console-v2 .ad-info-grid,
body.admin-console-v2 .ad-role-list,
body.admin-console-v2 .ad-member-summary,
body.admin-console-v2 .ad-sync-list{background:transparent!important}
body.admin-console-v2 .ad-info-item{border-bottom-color:#dbe4ef!important}
body.admin-console-v2 .ad-role-row{border-bottom-color:#dbe4ef!important}
body.admin-console-v2 .ad-person{border-color:#b7cae1!important;background:#eef5fd!important}
body.admin-console-v2 .ad-library,
body.admin-console-v2 .ad-sync-item{
  border-color:#bed0e4!important;
  background:#edf4fc!important;
}

/* Members and governance pages remain a single surface. */
body.admin-console-v2 .ad-members-card,
body.admin-console-v2 .ad-govern-card,
body.admin-console-v2 .ad-audit{
  border:0!important;
  border-radius:0!important;
  background:#f7faff!important;
  box-shadow:none!important;
}
body.admin-console-v2 .ad-members-tools{border-bottom-color:#c6d6e8!important;background:#edf4fc!important}
body.admin-console-v2 .ad-member-table th{background:#e3edf9!important}
body.admin-console-v2 .ad-member-table td{border-bottom-color:#d9e4f0!important}
body.admin-console-v2 .ad-member-table tbody tr:hover{background:#edf4fc!important}
body.admin-console-v2 .ad-member-avatar{background:#dbe9fb!important;color:#275d96!important;box-shadow:none!important}
body.admin-console-v2 .ad-govern-grid{gap:0!important;border-bottom:1px solid #c6d6e8!important}
body.admin-console-v2 .ad-govern-card{padding:16px!important;border-right:1px solid #c6d6e8!important;border-bottom:1px solid #c6d6e8!important}

/* Dialogs use one clear surface with restrained accent. */
body.admin-console-v2 .ad-modal-layer{background:rgba(21,42,70,.46)!important;backdrop-filter:blur(5px)}
body.admin-console-v2 .ad-modal{
  border:1px solid #b9cce3!important;
  border-radius:14px!important;
  background:#f7faff!important;
  box-shadow:0 28px 70px rgba(19,43,76,.28)!important;
}
body.admin-console-v2 .ad-modal-head{
  height:58px!important;
  border-bottom:1px solid #c4d4e7!important;
  background:#dce9f9!important;
  color:#21496f!important;
}
body.admin-console-v2 .ad-modal-head:before{width:3px!important;height:18px!important;background:#2468e8!important;box-shadow:none!important}
body.admin-console-v2 .ad-modal-body{background:#f7faff!important}
body.admin-console-v2 .ad-modal-foot{border-top-color:#c4d4e7!important;background:#edf4fc!important}
body.admin-console-v2 .ad-switch,
body.admin-console-v2 .ad-impact-row,
body.admin-console-v2 .notice,
body.admin-console-v2 .ad-candidate,
body.admin-console-v2 .ad-perm-origin,
body.admin-console-v2 .ad-perm-audit-row,
body.admin-console-v2 .ad-perm-editor{border-color:#bfd1e5!important;background:#edf4fc!important}
body.admin-console-v2 .ad-perm-hero{border-color:#b9cde5!important;background:#e3edf9!important}
body.admin-console-v2 .ad-perm-stat{border-color:#bfd1e5!important;background:#f5f9fe!important}
body.admin-console-v2 .ad-perm-tabs{background:#e3edf9!important}
body.admin-console-v2 .ad-perm-table{border-color:#bdcee2!important}
body.admin-console-v2 .ad-perm-table th{background:#e0ebf7!important}
body.admin-console-v2 .ad-perm-table td{border-top-color:#d3dfed!important}

@media(max-width:1180px){body.admin-console-v2 .ad-workspace{grid-template-columns:260px minmax(0,1fr)!important}}
@media(max-width:900px){body.admin-console-v2 .ad-grid-2{grid-template-columns:1fr!important}body.admin-console-v2 .ad-grid-2>.ad-card+ .ad-card{border-left:0!important;border-top:1px solid #c6d6e8!important}}
`;

  function install(){
    let style=document.getElementById('admin-dept-console-v5-theme');
    if(!style){style=document.createElement('style');style.id='admin-dept-console-v5-theme';document.head.appendChild(style)}
    style.textContent=css;
  }

  let queued=false;
  function normalize(){
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{
      queued=false;
      document.body.classList.toggle('admin-console-v5',state.page==='admin'&&state.adminTab==='dept');
      const tree=document.getElementById('adTreeScroll');
      if(!tree)return;
      tree.style.display='block';
      tree.querySelectorAll('.ad4-node,.ad-tree-node').forEach(node=>{
        node.style.height='auto';node.style.minHeight='0';node.style.maxHeight='none';node.style.margin='0';node.style.padding='0';
      });
      tree.querySelectorAll('.ad4-children').forEach(node=>{
        node.style.height='auto';node.style.minHeight='0';node.style.maxHeight='none';
      });
    });
  }

  install();
  const app=document.getElementById('app');
  if(app)new MutationObserver(normalize).observe(app,{childList:true,subtree:true});
  normalize();
})();
