/* Department management console v4 — rebuilt hierarchy and saturated system-blue surfaces. */
(function(){
  if(window.__adminDeptConsoleV4)return;
  window.__adminDeptConsoleV4=true;
  if(typeof state==='undefined'||typeof render!=='function')return;

  const iconHtml=name=>typeof icon==='function'?icon(name):'';
  const escapeHtml=value=>typeof safe==='function'?safe(value):String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

  const hierarchy=[{
    id:'group',name:'贵安发展集团',type:'group',children:[
      {id:'general',name:'综合管理部'},
      {id:'finance',name:'财务管理部'},
      {id:'investment',name:'投资发展部'},
      {id:'research',name:'研发中心',children:[
        {id:'platform',name:'平台研发组'},
        {id:'application',name:'应用研发组'},
        {id:'product',name:'产品设计组'}
      ]},
      {id:'construction',name:'建设管理部',children:[
        {id:'siteA',name:'项目一部'},
        {id:'siteB',name:'项目二部'}
      ]},
      {id:'operations',name:'运营管理部'}
    ]
  }];

  const theme=`
body.admin-console-v2{--ad4-blue:#2368ee;--ad4-deep:#164bc0;--ad4-indigo:#5a55df;--ad4-cyan:#159bd7;--ad4-teal:#0b9a8c;background:#dfe9f7!important}
body.admin-console-v2 .main{background:radial-gradient(circle at 90% 1%,rgba(70,117,246,.24),transparent 26%),radial-gradient(circle at 43% -12%,rgba(102,79,225,.16),transparent 25%),linear-gradient(180deg,#edf4fd 0%,#dfe9f7 100%)!important}
body.admin-console-v2 .page-head{margin-bottom:14px!important;padding:18px 20px!important;border:1px solid #bfd3f0!important;border-radius:16px!important;background:linear-gradient(120deg,#dceaff 0%,#cbdfff 54%,#d9d5ff 100%)!important;box-shadow:0 14px 32px rgba(33,79,147,.13)!important}
body.admin-console-v2 .page-title{color:#15365f!important;font-size:24px!important}.page-subtitle{color:#526f95!important}
body.admin-console-v2 .badge.blue{border:1px solid rgba(255,255,255,.55)!important;background:rgba(255,255,255,.62)!important;color:#1757c9!important;box-shadow:0 4px 12px rgba(44,89,161,.1)!important}
body.admin-console-v2 .ad-toolbar{min-height:58px!important;border:0!important;background:linear-gradient(105deg,#225fd8 0%,#2879ec 58%,#6256df 100%)!important;box-shadow:0 14px 30px rgba(36,91,190,.25)!important;color:#fff!important}
body.admin-console-v2 .ad-sync-note{color:rgba(255,255,255,.88)!important}.ad-sync-pulse{background:#8ff5d2!important;box-shadow:0 0 0 4px rgba(143,245,210,.2),0 0 16px rgba(143,245,210,.62)!important}
body.admin-console-v2 .ad-toolbar .btn{border-color:rgba(255,255,255,.42)!important;background:rgba(255,255,255,.14)!important;color:#fff!important;box-shadow:none!important;backdrop-filter:blur(10px)}
body.admin-console-v2 .ad-toolbar .btn:hover{background:rgba(255,255,255,.24)!important;border-color:rgba(255,255,255,.7)!important}
body.admin-console-v2 .ad-toolbar .btn.primary{background:#fff!important;border-color:#fff!important;color:#205fd7!important;box-shadow:0 9px 20px rgba(17,50,113,.22)!important}
body.admin-console-v2 .ad-workspace{grid-template-columns:304px minmax(0,1fr)!important;gap:14px!important}
body.admin-console-v2 .ad-tree-panel{border:1px solid #aec9ee!important;background:linear-gradient(180deg,#dbe9ff 0%,#cfdef6 100%)!important;box-shadow:0 18px 38px rgba(34,76,137,.18)!important}
body.admin-console-v2 .ad-tree-head{padding:16px!important;border-bottom:1px solid rgba(86,128,187,.22)!important;background:linear-gradient(125deg,#316fd9 0%,#3d82e9 58%,#5553cf 100%)!important}
body.admin-console-v2 .ad-tree-title-row{color:#fff!important;font-size:14px!important}.ad-tree-title-row .icon-stack{color:#fff!important}.ad-tree-title-row small{color:rgba(255,255,255,.74)!important}
body.admin-console-v2 .ad-tree-search{border-color:rgba(255,255,255,.42)!important;background:rgba(255,255,255,.9)!important}.ad-tree-expand{border-color:rgba(255,255,255,.42)!important;background:rgba(255,255,255,.9)!important;color:#3268ae!important}
body.admin-console-v2 .ad-tree-scroll{padding:12px 10px 16px!important;background:transparent!important}
body.admin-console-v2 .ad4-tree-section{margin:4px 2px 8px;padding:0 8px;color:#4a678e;font-size:9px;font-weight:750;letter-spacing:.12em;text-transform:uppercase}
body.admin-console-v2 .ad4-node{position:relative}.ad4-row{position:relative;min-height:42px;display:grid;grid-template-columns:24px minmax(0,1fr) 28px;align-items:center;gap:5px;margin:3px 0;border:1px solid transparent;border-radius:10px;padding:0 6px;color:#355576;transition:.16s ease}
body.admin-console-v2 .ad4-row:hover{border-color:#aac7ef;background:rgba(255,255,255,.48);box-shadow:0 6px 14px rgba(49,92,151,.09)}
body.admin-console-v2 .ad4-row.active{border-color:#8eb8f6;background:linear-gradient(100deg,#fff 0%,#edf5ff 64%,#e8e6ff 100%);color:#1557cb;box-shadow:0 9px 19px rgba(41,94,175,.16),inset 4px 0 #2468ee}
body.admin-console-v2 .ad4-toggle,.ad4-more{width:24px;height:28px;border:0;border-radius:7px;background:transparent;color:#5f7fa6;display:grid;place-items:center;padding:0}.ad4-toggle:hover,.ad4-more:hover{background:rgba(255,255,255,.72);color:#1b60d7}.ad4-toggle.empty{visibility:hidden}.ad4-toggle.collapsed .icon-stack{transform:rotate(-90deg)}
body.admin-console-v2 .ad4-select{min-width:0;height:40px;border:0;background:transparent;color:inherit;display:flex;align-items:center;gap:9px;padding:0;text-align:left}.ad4-select .icon-stack{width:17px;height:17px;color:#4773a7}.ad4-row.active .ad4-select .icon-stack{color:#2168e5}.ad4-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;font-weight:620}.ad4-row.active .ad4-name{font-weight:750}
body.admin-console-v2 .ad4-children{position:relative;margin-left:13px;padding-left:18px}.ad4-children:before{content:"";position:absolute;left:7px;top:-3px;bottom:20px;border-left:1px solid #88acd8}.ad4-children>.ad4-node>.ad4-row:before{content:"";position:absolute;left:-12px;top:20px;width:12px;border-top:1px solid #88acd8}.ad4-children.collapsed{display:none}.ad-tree-scroll.searching .ad4-children{display:block!important}
body.admin-console-v2 .ad4-node[data-depth="0"]>.ad4-row{background:rgba(42,100,188,.12);color:#244f82}.ad4-node[data-depth="0"]>.ad4-row .ad4-name{font-weight:780}.ad4-node[data-depth="2"]>.ad4-row{margin-left:2px;background:rgba(255,255,255,.18)}
body.admin-console-v2 .ad-detail-panel{border:1px solid #afc8eb!important;background:#dce8f8!important;box-shadow:0 18px 38px rgba(34,76,137,.16)!important}
body.admin-console-v2 .ad-hero{padding:20px!important;border-bottom:0!important;background:linear-gradient(112deg,#1954c5 0%,#2978e9 54%,#5f55d8 100%)!important;color:#fff}.ad-dept-icon{border-color:rgba(255,255,255,.42)!important;background:rgba(255,255,255,.16)!important;color:#fff!important;box-shadow:0 10px 24px rgba(15,45,105,.2)!important}.ad-dept-copy h2{color:#fff!important}.ad-dept-copy p{color:rgba(255,255,255,.72)!important}.ad-hero .ad-tag{border-color:rgba(255,255,255,.35)!important;background:rgba(255,255,255,.14)!important;color:#fff!important}.ad-hero .ad-tag.success{background:rgba(53,210,151,.24)!important;color:#e7fff5!important}.ad-hero-actions .btn{border-color:rgba(255,255,255,.44)!important;background:rgba(255,255,255,.13)!important;color:#fff!important}.ad-hero-actions .btn:hover{background:rgba(255,255,255,.23)!important}
body.admin-console-v2 .ad-tabs{border-bottom:1px solid #adc5e7!important;background:#cbdcf4!important}.ad-tabs button{color:#496684!important}.ad-tabs button.active{color:#174fb7!important}.ad-tabs button.active:after{height:3px!important;background:linear-gradient(90deg,#2368ee,#6557df)!important}
body.admin-console-v2 .ad-body{background:linear-gradient(180deg,#dce8f8 0%,#d4e1f3 100%)!important;padding:16px!important}
body.admin-console-v2 .ad-metrics{gap:12px!important}.ad-metric{min-height:104px!important;border:0!important;color:#fff!important;box-shadow:0 14px 26px rgba(33,76,145,.2)!important;overflow:hidden}.ad-metric:before{display:none!important}.ad-metric:nth-child(1){background:linear-gradient(135deg,#2368ee,#398bf0)!important}.ad-metric:nth-child(2){background:linear-gradient(135deg,#158fce,#27b1df)!important}.ad-metric:nth-child(3){background:linear-gradient(135deg,#5252dd,#7767ec)!important}.ad-metric:nth-child(4){background:linear-gradient(135deg,#078e82,#21b39a)!important}.ad-metric span,.ad-metric small{color:rgba(255,255,255,.76)!important}.ad-metric strong{color:#fff!important;text-shadow:0 2px 8px rgba(16,40,90,.18)}
body.admin-console-v2 .ad-card,body.admin-console-v2 .ad-members-card,body.admin-console-v2 .ad-govern-card,body.admin-console-v2 .ad-audit{border:1px solid #a9c3e7!important;background:linear-gradient(145deg,#dceaff 0%,#cfe0f7 100%)!important;box-shadow:0 12px 26px rgba(36,77,133,.12)!important}.ad-card-head,.ad-audit-head{border-bottom-color:#a9c3e7!important;background:linear-gradient(100deg,#c7dcfb,#d7e4fa)!important;color:#214f83!important}.ad-card-head:before,.ad-audit-head:before{width:5px!important;height:20px!important;background:linear-gradient(180deg,#2368ee,#6156de)!important}.ad-info-item{border-bottom-color:rgba(75,115,165,.18)!important}.ad-info-item label,.ad-role-row label{color:#607b9b!important}.ad-info-item div{color:#244b74!important}.ad-person{border-color:#9fbce2!important;background:rgba(255,255,255,.55)!important;color:#2c567f!important}.ad-library,.ad-sync-item{border-color:#a8c3e8!important;background:rgba(255,255,255,.48)!important}.ad-members-tools{border-bottom-color:#a8c3e8!important;background:linear-gradient(100deg,#c9dcf7,#d9e6fa)!important}.ad-member-table th{background:#bfd3ef!important;color:#365979!important}.ad-member-table td{border-bottom-color:rgba(79,117,165,.17)!important}.ad-member-table tbody tr:hover{background:rgba(255,255,255,.42)!important}.ad-member-avatar{background:linear-gradient(145deg,#2368ee,#6557df)!important;color:#fff!important}.ad-role-badge.owner{background:#d9e8ff!important}.ad-role-badge.file{background:#e2dcff!important}.ad-sync-list,.ad-role-list,.ad-info-grid,.ad-member-summary{background:transparent!important}
body.admin-console-v2 .ad-modal-layer{background:rgba(12,31,62,.61)!important;backdrop-filter:blur(7px)}.ad-modal{border:1px solid rgba(255,255,255,.72)!important;background:#dce8f8!important;box-shadow:0 38px 100px rgba(8,26,59,.38)!important}.ad-modal-head{border-bottom:0!important;background:linear-gradient(110deg,#1d58ca,#2b7be8 58%,#6557db)!important;color:#fff!important}.ad-modal-head:before{background:#fff!important;box-shadow:none!important}.ad-modal-body{background:linear-gradient(180deg,#dce9fa,#cedef3)!important}.ad-modal-foot{border-top-color:#a7c1e3!important;background:#c7d8ef!important}.ad-switch,.ad-impact-row,.notice,.ad-candidate,.ad-perm-origin,.ad-perm-audit-row,.ad-perm-editor{border-color:#9fbce2!important;background:rgba(255,255,255,.54)!important}.ad-perm-hero{border-color:#9dbbe4!important;background:linear-gradient(115deg,#c9dcfa,#d9d7ff)!important}.ad-perm-stat{border-color:#9ebce5!important;background:rgba(255,255,255,.55)!important}.ad-perm-tabs{background:#bdcfea!important}.ad-perm-tabs button.active{background:#edf5ff!important}.ad-perm-table{border-color:#9db9df!important}.ad-perm-table th{background:#bcd0ed!important}.ad-perm-table td{border-top-color:#a9c0df!important}.ad-perm-table tbody tr:hover{background:rgba(255,255,255,.38)!important}
@media(max-width:1180px){body.admin-console-v2 .ad-workspace{grid-template-columns:270px minmax(0,1fr)!important}}
`;

  function ensureTheme(){
    let style=document.getElementById('admin-dept-console-v4-theme');
    if(!style){style=document.createElement('style');style.id='admin-dept-console-v4-theme';document.head.appendChild(style)}
    style.textContent=theme;
  }

  function descendantText(node){return [node.name,...(node.children||[]).flatMap(child=>descendantText(child).split(' '))].join(' ').toLowerCase()}

  function actionMenu(node){
    if(state.adminDeptTreeMenu!==node.id)return '';
    return `<div class="ad-tree-menu" onclick="event.stopPropagation()"><button onclick="adminDeptTreeAction('${node.id}','create')">${iconHtml('plus')}新建下级部门</button><button onclick="adminDeptTreeAction('${node.id}','edit')">${iconHtml('edit')}编辑部门</button><button onclick="adminDeptTreeAction('${node.id}','move')">${iconHtml('move')}调整上级部门</button><button class="danger" onclick="adminDeptTreeAction('${node.id}','decommission')">${iconHtml('trash')}组织裁撤</button></div>`;
  }

  function nodeHtml(node,depth=0){
    const children=node.children||[];
    const expanded=Array.isArray(state.adminDeptExpanded)&&state.adminDeptExpanded.includes(node.id);
    const selected=state.adminDeptSelected===node.id;
    const nodeIcon=node.type==='group'?'building':'folder';
    return `<div class="ad-tree-node ad4-node" data-depth="${depth}" data-search="${escapeHtml(descendantText(node))}"><div class="ad4-row ${selected?'active':''}"><button class="ad4-toggle ${children.length?'':'empty'} ${expanded?'':'collapsed'}" onclick="event.stopPropagation();toggleAdminDept('${node.id}')">${children.length?iconHtml('down'):''}</button><button class="ad4-select" onclick="selectAdminDept('${node.id}')">${iconHtml(nodeIcon)}<span class="ad4-name">${escapeHtml(node.name)}</span></button><button class="ad4-more" onclick="event.stopPropagation();toggleAdminDeptTreeMenu('${node.id}')">${iconHtml('more')}</button>${actionMenu(node)}</div>${children.length?`<div class="ad4-children ${expanded?'':'collapsed'}">${children.map(child=>nodeHtml(child,depth+1)).join('')}</div>`:''}</div>`;
  }

  function rebuildTree(){
    if(state.page!=='admin'||state.adminTab!=='dept')return;
    const root=document.getElementById('adTreeScroll');
    if(!root)return;
    const signature=[state.adminDeptSelected,(state.adminDeptExpanded||[]).join(','),state.adminDeptTreeMenu||''].join('|');
    if(root.dataset.v4Signature===signature)return;
    root.dataset.v4Signature=signature;
    root.innerHTML=`<div class="ad4-tree-section">正式组织</div>${hierarchy.map(item=>nodeHtml(item)).join('')}<div class="ad4-tree-section" style="margin-top:14px">特殊节点</div><div class="ad-tree-node ad4-node" data-depth="0" data-search="待分配人员池"><div class="ad4-row ${state.adminDeptSelected==='unassigned'?'active':''}"><span class="ad4-toggle empty"></span><button class="ad4-select" onclick="selectAdminDept('unassigned')">${iconHtml('users')}<span class="ad4-name">待分配人员池</span></button><span></span></div></div><div class="ad-tree-empty" id="adTreeEmpty" hidden>未找到匹配的组织节点</div>`;
    const title=root.closest('.ad-tree-panel')?.querySelector('.ad-tree-title-row small');
    if(title)title.textContent='集团 / 部门 / 项目组';
  }

  window.adminDeptTreeAction=function(id,type){
    state.adminDeptSelected=id;
    state.adminDeptView='overview';
    state.adminDeptTreeMenu=null;
    if(typeof openAdminDeptDialog==='function')openAdminDeptDialog(type,type==='create'?id:undefined);
  };

  const originalFilter=window.filterAdminDeptTree;
  window.filterAdminDeptTree=function(value){
    rebuildTree();
    const query=String(value||'').trim().toLowerCase();
    const root=document.getElementById('adTreeScroll');
    if(!root)return;
    root.classList.toggle('searching',Boolean(query));
    let visible=0;
    root.querySelectorAll('.ad4-node').forEach(node=>{const matched=!query||(node.dataset.search||'').includes(query);node.hidden=!matched;if(matched)visible++});
    const empty=document.getElementById('adTreeEmpty');if(empty)empty.hidden=visible>0;
    if(!root.querySelector('.ad4-node')&&typeof originalFilter==='function')originalFilter(value);
  };

  let scheduled=false;
  function enhance(){
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(()=>{
      scheduled=false;
      document.body.classList.toggle('admin-console-v4',state.page==='admin'&&state.adminTab==='dept');
      rebuildTree();
    });
  }

  ensureTheme();
  const app=document.getElementById('app');
  if(app)new MutationObserver(enhance).observe(app,{childList:true,subtree:true});
  enhance();
})();
