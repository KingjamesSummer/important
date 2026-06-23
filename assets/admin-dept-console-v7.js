/* Department management console v7 — faithful sunny blue-white reconstruction. */
(function(){
  if(window.__adminDeptConsoleV7)return;
  window.__adminDeptConsoleV7=true;
  if(typeof state==='undefined'||typeof render!=='function')return;

  const tree=[{
    id:'group',name:'贵安发展集团',kind:'group',children:[
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

  const ico=name=>typeof icon==='function'?icon(name):'';
  const esc=value=>typeof safe==='function'?safe(value):String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

  const css=`
body.admin-console-v2.admin-console-v7{
  --d7-blue:#1769ff;
  --d7-blue-deep:#0756d6;
  --d7-cyan:#27b9da;
  --d7-violet:#7462e8;
  --d7-green:#24b58f;
  --d7-ink:#15365f;
  --d7-text:#3c5d80;
  --d7-muted:#8094ab;
  --d7-line:#dbe8f6;
  --d7-soft:#f4f9ff;
  background:#f7fbff!important;
}
body.admin-console-v2.admin-console-v7 .main{
  padding:0 24px 30px!important;
  background:
    radial-gradient(circle at 83% 4%,rgba(255,225,99,.30) 0,rgba(255,237,180,.16) 10%,transparent 24%),
    radial-gradient(circle at 66% 0%,rgba(87,169,255,.16),transparent 31%),
    linear-gradient(180deg,#eaf6ff 0,#f8fbff 34%,#f8fbff 100%)!important;
}
body.admin-console-v2.admin-console-v7 .page{max-width:1680px!important}
body.admin-console-v2.admin-console-v7 .ad-page{gap:12px!important}
body.admin-console-v2.admin-console-v7 .page-head,
body.admin-console-v2.admin-console-v7 .ad-toolbar{display:none!important}

.dept7-page-hero{
  position:relative;
  min-height:96px;
  margin:0 -24px 2px;
  padding:22px 42px 16px;
  display:flex;
  align-items:flex-start;
  gap:18px;
  overflow:hidden;
  background:
    radial-gradient(circle at 79% 14%,rgba(255,255,255,.98) 0 3%,rgba(255,233,145,.62) 4%,rgba(255,226,108,.25) 10%,transparent 23%),
    radial-gradient(ellipse at 17% 88%,rgba(255,255,255,.88) 0 12%,transparent 31%),
    radial-gradient(ellipse at 35% 108%,rgba(255,255,255,.75) 0 14%,transparent 34%),
    linear-gradient(108deg,#d7ecff 0%,#e9f6ff 54%,#dff1ff 100%);
  border-bottom:1px solid rgba(183,214,245,.7);
}
.dept7-page-hero:before{
  content:"";
  position:absolute;
  right:20%;top:-30px;
  width:220px;height:150px;
  background:repeating-conic-gradient(from 0deg,rgba(255,237,154,.24) 0 7deg,transparent 7deg 17deg);
  border-radius:50%;
  filter:blur(1px);
  opacity:.75;
}
.dept7-page-hero:after{
  content:"";
  position:absolute;
  left:21%;bottom:-42px;
  width:340px;height:90px;
  border-radius:50%;
  background:rgba(255,255,255,.7);
  filter:blur(18px);
}
.dept7-page-copy{position:relative;z-index:1;min-width:0}
.dept7-page-copy h1{margin:0;color:#102f56;font-size:24px;line-height:1.25;letter-spacing:-.02em}
.dept7-page-copy p{margin:8px 0 0;color:#557697;font-size:11px}
.dept7-page-state{display:inline-flex;align-items:center;gap:7px;margin-top:12px;color:#5d82aa;font-size:9px}
.dept7-page-state i{width:7px;height:7px;border-radius:50%;background:#2f8cff;box-shadow:0 0 0 4px rgba(47,140,255,.13)}
.dept7-page-actions{position:relative;z-index:1;margin-left:auto;display:flex;align-items:center;gap:9px;padding-top:10px}
.dept7-page-actions .btn{height:39px!important;padding:0 15px!important}

body.admin-console-v2.admin-console-v7 .ad-workspace{
  grid-template-columns:292px minmax(0,1fr)!important;
  gap:14px!important;
  min-height:calc(100vh - 184px)!important;
}

/* Clean, isolated organization tree. */
body.admin-console-v2.admin-console-v7 .ad-tree-panel.dept7-tree-panel{
  display:flex!important;
  flex-direction:column!important;
  min-height:0!important;
  overflow:hidden!important;
  border:1px solid #dce8f5!important;
  border-radius:15px!important;
  background:#fff!important;
  box-shadow:0 12px 30px rgba(40,91,155,.09)!important;
}
.dept7-tree-head{padding:17px 16px 14px;border-bottom:1px solid #e8f0f8;background:#fff}
.dept7-tree-title{display:flex;align-items:center;gap:8px;color:#1b4776;font-size:14px;font-weight:760}
.dept7-tree-title>.icon-stack{width:18px;height:18px;color:#1769ff}.dept7-tree-title small{margin-left:auto;color:#91a4b8;font-size:9px;font-weight:550}
.dept7-tree-tools{display:grid;grid-template-columns:minmax(0,1fr) 37px;gap:8px;margin-top:13px}
.dept7-search{height:38px;border:1px solid #d7e4f2;border-radius:9px;background:#fbfdff;display:flex;align-items:center;gap:8px;padding:0 11px;color:#8196ad}
.dept7-search:focus-within{border-color:#72adff;background:#fff;box-shadow:0 0 0 3px rgba(23,105,255,.08)}
.dept7-search input{width:100%;border:0;outline:0;background:transparent;color:#365777;font-size:11px}
.dept7-expand{width:37px;height:38px;border:1px solid #d7e4f2;border-radius:9px;background:#fff;color:#55799e;display:grid;place-items:center}
.dept7-expand:hover{border-color:#94bdf2;background:#eff6ff;color:#1769ff}
.dept7-tree-body{display:block!important;flex:1!important;min-height:0!important;overflow:auto!important;padding:10px 10px 18px!important;background:#fff!important}
.dept7-section{margin:4px 5px 8px;color:#95a7b9;font-size:9px;font-weight:700;letter-spacing:.08em}
.dept7-node{position:relative!important;display:block!important;width:100%!important;height:auto!important;min-height:0!important;max-height:none!important;margin:0!important;padding:0!important;flex:none!important}
.dept7-row{position:relative!important;display:grid!important;grid-template-columns:22px minmax(0,1fr) 24px!important;align-items:center!important;gap:5px!important;width:auto!important;height:39px!important;min-height:39px!important;max-height:39px!important;margin:2px 0!important;padding:0 6px!important;border:1px solid transparent!important;border-radius:9px!important;background:transparent!important;color:#435f7d!important;box-shadow:none!important;transition:.15s ease!important}
.dept7-row:hover{border-color:#d5e4f5!important;background:#f5f9ff!important;color:#235e9f!important}
.dept7-row.active{border-color:#b8d4fa!important;background:linear-gradient(90deg,#e7f2ff,#f2f7ff)!important;color:#075edf!important;box-shadow:inset 3px 0 #1769ff!important}
.dept7-row.root{background:#f5f9ff!important;color:#28567e!important}.dept7-row.root.active{background:#e7f2ff!important;color:#075edf!important}
.dept7-toggle,.dept7-more{width:22px;height:25px;border:0;border-radius:6px;background:transparent;color:#718ba7;display:grid;place-items:center;padding:0}
.dept7-toggle:hover,.dept7-more:hover{background:#eaf3ff;color:#1769ff}.dept7-toggle.empty{visibility:hidden}.dept7-toggle.collapsed .icon-stack{transform:rotate(-90deg)}
.dept7-select{min-width:0;height:37px;border:0;background:transparent;color:inherit;display:flex;align-items:center;gap:8px;padding:0;text-align:left}
.dept7-select>.icon-stack{width:16px;height:16px;color:#6387ab}.dept7-row.active .dept7-select>.icon-stack{color:#1769ff}
.dept7-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px;font-weight:600}.dept7-row.active .dept7-name{font-weight:750}
.dept7-children{position:relative!important;display:block!important;width:auto!important;height:auto!important;min-height:0!important;max-height:none!important;margin:0 0 0 12px!important;padding:0 0 0 15px!important;flex:none!important}
.dept7-children.collapsed{display:none!important}.dept7-children:before{content:"";position:absolute;left:5px;top:-2px;bottom:19px;border-left:1px solid #c8dcef}.dept7-children>.dept7-node>.dept7-row:before{content:"";position:absolute;left:-10px;top:19px;width:10px;border-top:1px solid #c8dcef}
.dept7-tree-body.searching .dept7-children{display:block!important}.dept7-empty{padding:30px 10px;text-align:center;color:#92a4b7;font-size:11px}
.dept7-menu{position:absolute;right:3px;top:35px;z-index:80;width:166px;padding:6px;border:1px solid #d6e3f2;border-radius:10px;background:#fff;box-shadow:0 18px 44px rgba(24,61,105,.18)}
.dept7-menu button{width:100%;height:35px;border:0;border-radius:7px;background:transparent;color:#46617e;display:flex;align-items:center;gap:8px;padding:0 9px;text-align:left;font-size:10px}.dept7-menu button:hover{background:#eff6ff;color:#075fe4}.dept7-menu button.danger{color:#cf4e58}.dept7-menu button.danger:hover{background:#fff1f2}

/* Main panel faithfully follows the reference. */
body.admin-console-v2.admin-console-v7 .ad-detail-panel{
  overflow:hidden!important;
  border:1px solid #dce8f5!important;
  border-radius:15px!important;
  background:#fff!important;
  box-shadow:0 12px 30px rgba(40,91,155,.09)!important;
}
body.admin-console-v2.admin-console-v7 .ad-hero{padding:19px 20px!important;border-bottom:1px solid #e7eef7!important;background:#fff!important}
body.admin-console-v2.admin-console-v7 .ad-dept-icon{width:54px!important;height:54px!important;border:0!important;border-radius:13px!important;background:linear-gradient(145deg,#4b9cff,#1769ff)!important;color:#fff!important;box-shadow:0 10px 22px rgba(23,105,255,.24)!important}
body.admin-console-v2.admin-console-v7 .ad-dept-icon .icon-stack{width:24px!important;height:24px!important}
body.admin-console-v2.admin-console-v7 .ad-dept-copy h2{font-size:20px!important;color:#15365e!important}
body.admin-console-v2.admin-console-v7 .ad-dept-copy p{color:#8092a7!important}
body.admin-console-v2.admin-console-v7 .ad-tags{margin-top:8px!important}.ad-tag{height:23px!important;border-radius:7px!important;background:#f4f8fd!important;border-color:#d8e5f2!important;color:#607890!important}.ad-tag.primary{background:#e8f2ff!important;border-color:#bdd8ff!important;color:#075fe4!important}.ad-tag.success{background:#e5f8ef!important;border-color:#bde5d1!important;color:#16815d!important}.ad-tag.off{background:#fff0f0!important;border-color:#f0c8c8!important;color:#c44e55!important}
body.admin-console-v2.admin-console-v7 .ad-tabs{height:47px!important;padding:0 20px!important;border-bottom:1px solid #e7eef7!important;background:#fff!important}.ad-tabs button{height:47px!important;color:#6c8096!important}.ad-tabs button.active{color:#075fe4!important;font-weight:700!important}.ad-tabs button.active:after{height:3px!important;background:#1769ff!important;box-shadow:0 -2px 8px rgba(23,105,255,.16)}
body.admin-console-v2.admin-console-v7 .ad-body{padding:14px!important;background:#fbfdff!important}

body.admin-console-v2.admin-console-v7 .ad-metrics{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:0!important;margin:0 0 14px!important;overflow:hidden!important;border:0!important;border-radius:12px!important;background:transparent!important;box-shadow:0 13px 27px rgba(35,91,170,.17)!important}
body.admin-console-v2.admin-console-v7 .ad-metric{position:relative!important;min-height:102px!important;margin:0!important;padding:16px 18px!important;border:0!important;border-right:1px solid rgba(255,255,255,.22)!important;border-radius:0!important;color:#fff!important;box-shadow:none!important;overflow:hidden!important}
body.admin-console-v2.admin-console-v7 .ad-metric:last-child{border-right:0!important}body.admin-console-v2.admin-console-v7 .ad-metric:before{display:none!important}
body.admin-console-v2.admin-console-v7 .ad-metric:nth-child(1){background:linear-gradient(135deg,#4c9cff,#287ff0)!important}
body.admin-console-v2.admin-console-v7 .ad-metric:nth-child(2){background:linear-gradient(135deg,#4cc7e7,#27afd2)!important}
body.admin-console-v2.admin-console-v7 .ad-metric:nth-child(3){background:linear-gradient(135deg,#8e7cf1,#7161e3)!important}
body.admin-console-v2.admin-console-v7 .ad-metric:nth-child(4){background:linear-gradient(135deg,#49c8a8,#24aa86)!important}
body.admin-console-v2.admin-console-v7 .ad-metric span,body.admin-console-v2.admin-console-v7 .ad-metric small{color:rgba(255,255,255,.82)!important}
body.admin-console-v2.admin-console-v7 .ad-metric strong{color:#fff!important;text-shadow:0 2px 8px rgba(18,46,96,.18)!important}
.dept7-metric-icon{position:absolute;right:14px;bottom:12px;opacity:.25}.dept7-metric-icon .icon-stack{width:42px;height:42px;color:#fff}

body.admin-console-v2.admin-console-v7 .ad-grid-2{display:grid!important;grid-template-columns:minmax(0,1.12fr) minmax(300px,.88fr)!important;gap:12px!important;margin:0 0 12px!important;border:0!important;background:transparent!important}.ad-grid-2:last-child{margin-bottom:0!important}
body.admin-console-v2.admin-console-v7 .ad-card,body.admin-console-v2.admin-console-v7 .ad-members-card,body.admin-console-v2.admin-console-v7 .ad-govern-card,body.admin-console-v2.admin-console-v7 .ad-audit{overflow:hidden!important;border:1px solid #e0e9f3!important;border-radius:12px!important;background:#fff!important;box-shadow:0 7px 19px rgba(42,86,143,.065)!important;transition:.16s ease!important}
body.admin-console-v2.admin-console-v7 .ad-card:hover,body.admin-console-v2.admin-console-v7 .ad-govern-card:hover{border-color:#c6dcf6!important;box-shadow:0 10px 23px rgba(42,86,143,.095)!important;transform:translateY(-1px)}
body.admin-console-v2.admin-console-v7 .ad-card-head,body.admin-console-v2.admin-console-v7 .ad-audit-head{height:47px!important;padding:0 14px!important;border-bottom:1px solid #edf2f7!important;background:#fff!important;color:#23486e!important}
body.admin-console-v2.admin-console-v7 .ad-card-head:before,body.admin-console-v2.admin-console-v7 .ad-audit-head:before{width:4px!important;height:18px!important;margin-right:8px!important;border-radius:3px!important;background:#1769ff!important}
body.admin-console-v2.admin-console-v7 .ad-info-item,body.admin-console-v2.admin-console-v7 .ad-role-row{border-bottom-color:#edf2f7!important}.ad-info-item label,.ad-role-row label{color:#8b9cad!important}.ad-info-item div{color:#345474!important}
body.admin-console-v2.admin-console-v7 .ad-person{border-color:#d6e4f4!important;background:#f7faff!important;color:#365d84!important}.ad-person i{background:#e4f0ff!important;color:#1769ff!important}
body.admin-console-v2.admin-console-v7 .ad-library,body.admin-console-v2.admin-console-v7 .ad-sync-item{border-color:#dfeaf5!important;background:#f9fbfe!important}.ad-library-icon{background:#e5f1ff!important;color:#1769ff!important}.ad-sync-item>.icon-stack{color:#1fb27f!important}
body.admin-console-v2.admin-console-v7 .ad-members-tools{border-bottom-color:#e8eef5!important;background:#fbfdff!important}.ad-member-table th{background:#f4f8fd!important}.ad-member-table td{border-bottom-color:#edf2f7!important}.ad-member-table tbody tr:hover{background:#f4f8ff!important}.ad-member-avatar{background:#e4f0ff!important;color:#2465a5!important;box-shadow:none!important}

body.admin-console-v2.admin-console-v7 .ad-modal-layer{background:rgba(22,43,72,.46)!important;backdrop-filter:blur(6px)}
body.admin-console-v2.admin-console-v7 .ad-modal{border:1px solid #d6e3f2!important;border-radius:16px!important;background:#fff!important;box-shadow:0 34px 86px rgba(18,43,78,.30)!important}
body.admin-console-v2.admin-console-v7 .ad-modal-head{height:61px!important;border-bottom:1px solid #e3ebf4!important;background:linear-gradient(105deg,#fff,#eef7ff)!important;color:#1c436c!important}.ad-modal-head:before{width:4px!important;height:20px!important;background:#1769ff!important;box-shadow:none!important}.ad-modal-body{background:#fff!important}.ad-modal-foot{border-top-color:#e2eaf3!important;background:#f8fbff!important}.ad-switch,.ad-impact-row,.notice,.ad-candidate,.ad-perm-origin,.ad-perm-audit-row,.ad-perm-editor{border-color:#d9e6f4!important;background:#f8fbff!important}.ad-perm-hero{border-color:#d4e3f3!important;background:linear-gradient(110deg,#f5f9ff,#eaf4ff)!important}.ad-perm-stat{border-color:#d8e4f2!important;background:#fff!important}.ad-perm-tabs{background:#eef5ff!important}.ad-perm-table{border-color:#d9e5f2!important}.ad-perm-table th{background:#f2f7fd!important}.ad-perm-table td{border-top-color:#e8eef5!important}

@media(max-width:1180px){body.admin-console-v2.admin-console-v7 .ad-workspace{grid-template-columns:265px minmax(0,1fr)!important}}
@media(max-width:920px){body.admin-console-v2.admin-console-v7 .ad-workspace{grid-template-columns:1fr!important}.dept7-tree-panel{max-height:440px}.ad-grid-2{grid-template-columns:1fr!important}.dept7-page-hero{margin-left:-18px;margin-right:-18px;padding-left:24px;padding-right:24px}}
`;

  function installStyle(){
    document.getElementById('admin-dept-console-v4-theme')?.remove();
    document.getElementById('admin-dept-console-v5-theme')?.remove();
    document.getElementById('admin-dept-console-v6-css')?.remove();
    document.getElementById('admin-dept-console-v6-theme')?.remove();
    let style=document.getElementById('admin-dept-console-v7-style');
    if(!style){style=document.createElement('style');style.id='admin-dept-console-v7-style';document.head.appendChild(style)}
    style.textContent=css;
  }

  function searchable(item){return [item.name,...(item.children||[]).map(searchable)].flat().join(' ').toLowerCase()}

  function treeMenu(item){
    if(state.adminDeptTreeMenu!==item.id)return '';
    return `<div class="dept7-menu" onclick="event.stopPropagation()"><button onclick="dept7Action('${item.id}','create')">${ico('plus')}新建下级部门</button><button onclick="dept7Action('${item.id}','edit')">${ico('edit')}编辑部门</button><button onclick="dept7Action('${item.id}','move')">${ico('move')}调整上级部门</button><button class="danger" onclick="dept7Action('${item.id}','decommission')">${ico('trash')}组织裁撤</button></div>`;
  }

  function treeNode(item,depth=0){
    const children=item.children||[];
    const expanded=Array.isArray(state.adminDeptExpanded)&&state.adminDeptExpanded.includes(item.id);
    const active=state.adminDeptSelected===item.id;
    return `<div class="dept7-node" data-search="${esc(searchable(item))}"><div class="dept7-row ${depth===0?'root':''} ${active?'active':''}"><button class="dept7-toggle ${children.length?'':'empty'} ${expanded?'':'collapsed'}" onclick="event.stopPropagation();toggleAdminDept('${item.id}')">${children.length?ico('down'):''}</button><button class="dept7-select" onclick="selectAdminDept('${item.id}')">${ico(depth===0?'building':'folder')}<span class="dept7-name">${esc(item.name)}</span></button><button class="dept7-more" onclick="event.stopPropagation();toggleAdminDeptTreeMenu('${item.id}')">${ico('more')}</button>${treeMenu(item)}</div>${children.length?`<div class="dept7-children ${expanded?'':'collapsed'}">${children.map(child=>treeNode(child,depth+1)).join('')}</div>`:''}</div>`;
  }

  function treeHtml(){
    return `<div class="dept7-tree-head"><div class="dept7-tree-title">${ico('building')}组织架构<small>集团 / 部门 / 项目组</small></div><div class="dept7-tree-tools"><label class="dept7-search">${ico('search')}<input placeholder="搜索部门名称" oninput="filterDept7Tree(this.value)"></label><button class="dept7-expand" title="展开或收起全部" onclick="toggleAdminDeptAll()">${ico('down')}</button></div></div><div class="dept7-tree-body" id="dept7TreeBody"><div class="dept7-section">正式组织</div>${tree.map(item=>treeNode(item)).join('')}<div class="dept7-section" style="margin-top:14px">特殊节点</div><div class="dept7-node" data-search="待分配人员池"><div class="dept7-row ${state.adminDeptSelected==='unassigned'?'active':''}"><span class="dept7-toggle empty"></span><button class="dept7-select" onclick="selectAdminDept('unassigned')">${ico('users')}<span class="dept7-name">待分配人员池</span></button><span></span></div></div><div class="dept7-empty" id="dept7Empty" hidden>未找到匹配的组织节点</div></div>`;
  }

  function ensureHero(page){
    if(page.querySelector('.dept7-page-hero'))return;
    const hero=document.createElement('section');
    hero.className='dept7-page-hero';
    hero.innerHTML=`<div class="dept7-page-copy"><h1>部门管理</h1><p>维护组织层级、管理身份、空间策略与部门公共资料库</p><span class="dept7-page-state"><i></i>组织数据正常 · 最近同步 ${esc(state.adminLastSync||'今天 10:18')}</span></div><div class="dept7-page-actions"><button class="btn" onclick="openAdminDeptDialog('sync')">${ico('transfer')}同步组织</button><button class="btn primary" onclick="openAdminDeptDialog('create',state.adminDeptSelected==='unassigned'?'group':state.adminDeptSelected)">${ico('plus')}新建部门</button></div>`;
    page.insertBefore(hero,page.firstChild);
  }

  function rebuildTree(){
    const panel=document.querySelector('.ad-tree-panel');
    if(!panel)return;
    const signature=[state.adminDeptSelected,(state.adminDeptExpanded||[]).join(','),state.adminDeptTreeMenu||''].join('|');
    if(panel.classList.contains('dept7-tree-panel')&&panel.dataset.signature===signature)return;
    panel.className='ad-tree-panel dept7-tree-panel';
    panel.dataset.signature=signature;
    panel.innerHTML=treeHtml();
  }

  function decorateDetail(){
    const iconBox=document.querySelector('.ad-dept-icon');
    if(iconBox)iconBox.innerHTML=ico('building');
    const metricIcons=['users','building','folder','shield'];
    document.querySelectorAll('.ad-metric').forEach((metric,index)=>{
      metric.querySelector('.dept7-metric-icon')?.remove();
      metric.insertAdjacentHTML('beforeend',`<span class="dept7-metric-icon">${ico(metricIcons[index]||'chart')}</span>`);
    });
  }

  window.dept7Action=function(id,type){
    state.adminDeptSelected=id;
    state.adminDeptView='overview';
    state.adminDeptTreeMenu=null;
    if(typeof openAdminDeptDialog==='function')openAdminDeptDialog(type,type==='create'?id:undefined);
  };

  window.filterDept7Tree=function(value){
    const query=String(value||'').trim().toLowerCase();
    const body=document.getElementById('dept7TreeBody');
    if(!body)return;
    body.classList.toggle('searching',Boolean(query));
    let visible=0;
    body.querySelectorAll('.dept7-node').forEach(node=>{
      const match=!query||(node.dataset.search||'').includes(query);
      node.hidden=!match;
      if(match)visible++;
    });
    const empty=document.getElementById('dept7Empty');
    if(empty)empty.hidden=visible>0;
  };

  let queued=false;
  function enhance(){
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{
      queued=false;
      const active=state.page==='admin'&&state.adminTab==='dept';
      document.body.classList.toggle('admin-console-v7',active);
      if(!active)return;
      const page=document.querySelector('.ad-page');
      if(!page)return;
      ensureHero(page);
      rebuildTree();
      decorateDetail();
    });
  }

  installStyle();
  if(!Array.isArray(state.adminDeptExpanded)||!state.adminDeptExpanded.length)state.adminDeptExpanded=['group','research','construction'];
  const app=document.getElementById('app');
  if(app)new MutationObserver(enhance).observe(app,{childList:true,subtree:true});
  enhance();
})();
