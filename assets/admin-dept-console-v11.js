/* Department management v11 — deterministic organization tree. */
(function(){
  if(window.__adminDeptConsoleV11)return;
  window.__adminDeptConsoleV11=true;
  if(typeof state==='undefined')return;

  const nodes=[{
    id:'group',name:'贵安发展集团',type:'company',children:[
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

  function installTheme(){
    if(!document.getElementById('admin-dept-console-v11-theme')){
      const link=document.createElement('link');
      link.id='admin-dept-console-v11-theme';
      link.rel='stylesheet';
      link.href='assets/admin-dept-console-v9.css?v=3';
      document.head.appendChild(link);
    }
    if(document.getElementById('admin-dept-console-v11-style'))return;
    const style=document.createElement('style');
    style.id='admin-dept-console-v11-style';
    style.textContent=`
body.admin-console-v2 .org-final-panel{display:flex!important;flex-direction:column!important;min-height:0!important;overflow:hidden!important;background:#fff!important;border:1px solid #d8e9fb!important;border-radius:13px!important;box-shadow:0 8px 22px rgba(23,105,255,.055)!important}
body.admin-console-v2 .org-final-panel,body.admin-console-v2 .org-final-panel *{box-sizing:border-box!important}
.org-final-head{flex:none;padding:14px;border-bottom:1px solid #e5f0fb;background:#fff}.org-final-title{display:flex;align-items:center;gap:8px;color:#17446f;font-size:13px;font-weight:750}.org-final-title>.icon-stack{width:17px;height:17px;color:#1769ff}.org-final-title small{margin-left:auto;color:#6284a5;font-size:8px;font-weight:550}
.org-final-tools{display:flex;align-items:center;gap:8px;margin-top:12px}.org-final-search{height:36px;min-width:0;flex:1;display:flex;align-items:center;gap:7px;padding:0 10px;border:1px solid #d2e5f8;border-radius:9px;background:#f7fbff;color:#5079a0}.org-final-search:focus-within{border-color:#76aff6;background:#fff;box-shadow:0 0 0 3px rgba(23,105,255,.07)}.org-final-search input{width:100%;min-width:0;border:0;outline:0;background:transparent;color:#284f78;font-size:10px}.org-final-expand{width:36px;height:36px;flex:0 0 36px;display:grid;place-items:center;border:1px solid #d2e5f8;border-radius:9px;background:#fff;color:#315f8d}.org-final-expand:hover{border-color:#94c1f5;background:#eef6ff;color:#1769ff}
.org-final-scroll{display:block!important;flex:1!important;min-height:0!important;overflow:auto!important;padding:9px 9px 15px!important;background:#fff!important}.org-final-section{height:27px;display:flex;align-items:center;padding:0 7px;color:#6284a5;font-size:8px;font-weight:700;letter-spacing:.08em}
.org-final-node{display:block!important;position:relative!important;width:100%!important;height:auto!important;min-height:0!important;max-height:none!important;margin:0!important;padding:0!important;inset:auto!important;transform:none!important;float:none!important;clear:both!important;opacity:1!important;visibility:visible!important}
.org-final-row{display:flex!important;position:relative!important;align-items:center!important;width:100%!important;height:36px!important;min-height:36px!important;max-height:36px!important;margin:1px 0!important;padding:0 5px!important;border:1px solid transparent!important;border-radius:8px!important;background:#fff!important;color:#284f78!important;inset:auto!important;transform:none!important;overflow:visible!important}.org-final-row:hover{border-color:#d7e8fa!important;background:#f3f9ff!important;color:#175d9d!important}.org-final-row.active{border-color:#afd2fb!important;background:#e8f3ff!important;color:#075edf!important;box-shadow:inset 3px 0 #1769ff!important}.org-final-row.root{background:#f3f9ff!important;color:#244f78!important}.org-final-row.root.active{background:#e6f2ff!important;color:#075edf!important}
.org-final-toggle,.org-final-more{width:22px;height:24px;flex:0 0 22px;display:grid;place-items:center;border:0;border-radius:6px;background:transparent;color:#5079a0;padding:0}.org-final-toggle:hover,.org-final-more:hover{background:#e8f3ff;color:#1769ff}.org-final-toggle.empty{visibility:hidden}.org-final-toggle.collapsed .icon-stack{transform:rotate(-90deg)}
.org-final-select{height:34px;min-width:0;flex:1;display:flex;align-items:center;gap:8px;padding:0 5px;border:0;background:transparent;color:inherit;text-align:left}.org-final-select>.icon-stack{width:15px;height:15px;flex:none;color:#4f7ca8}.org-final-row.active .org-final-select>.icon-stack{color:#1769ff}.org-final-name{display:block;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:inherit;font-size:10px;font-weight:600}.org-final-row.active .org-final-name{font-weight:750}
.org-final-children{display:block!important;position:relative!important;width:auto!important;height:auto!important;min-height:0!important;max-height:none!important;margin:0 0 0 12px!important;padding:0 0 0 14px!important;inset:auto!important;transform:none!important}.org-final-children.collapsed{display:none!important}.org-final-children:before{content:"";position:absolute;left:5px;top:-1px;bottom:17px;border-left:1px solid #bfd9f4}.org-final-children>.org-final-node>.org-final-row:before{content:"";position:absolute;left:-9px;top:17px;width:9px;border-top:1px solid #bfd9f4}
.org-final-scroll.searching .org-final-children{display:block!important}.org-final-menu{position:absolute;right:3px;top:32px;z-index:100;width:164px;padding:6px;border:1px solid #d7e6f5;border-radius:10px;background:#fff;box-shadow:0 18px 42px rgba(18,65,119,.18)}.org-final-menu button{width:100%;height:34px;display:flex;align-items:center;gap:8px;padding:0 9px;border:0;border-radius:7px;background:#fff;color:#315f8d;text-align:left;font-size:10px}.org-final-menu button:hover{background:#eef6ff;color:#075edf}.org-final-menu button.danger{color:#c43f4c}.org-final-menu button.danger:hover{background:#fff2f3}.org-final-empty{padding:28px 10px;text-align:center;color:#6284a5;font-size:10px}
`;
    document.head.appendChild(style);
  }

  function searchText(node){
    return [node.name,...(node.children||[]).map(searchText)].flat().join(' ').toLowerCase();
  }

  function menuHtml(node){
    if(state.adminDeptTreeMenu!==node.id)return '';
    return `<div class="org-final-menu" onclick="event.stopPropagation()"><button onclick="openAdminDeptDialog('create','${node.id}')">${ico('plus')}新建下级部门</button><button onclick="selectAdminDept('${node.id}');openAdminDeptDialog('edit')">${ico('edit')}编辑部门</button><button onclick="selectAdminDept('${node.id}');openAdminDeptDialog('move')">${ico('move')}调整上级部门</button><button class="danger" onclick="selectAdminDept('${node.id}');openAdminDeptDialog('decommission')">${ico('trash')}组织裁撤</button></div>`;
  }

  function nodeHtml(node,depth=0){
    const children=node.children||[];
    const expanded=Array.isArray(state.adminDeptExpanded)&&state.adminDeptExpanded.includes(node.id);
    const selected=state.adminDeptSelected===node.id;
    return `<div class="org-final-node" data-search="${esc(searchText(node))}"><div class="org-final-row ${depth===0?'root':''} ${selected?'active':''}"><button class="org-final-toggle ${children.length?'':'empty'} ${expanded?'':'collapsed'}" onclick="event.stopPropagation();toggleAdminDept('${node.id}')">${children.length?ico('down'):''}</button><button class="org-final-select" onclick="selectAdminDept('${node.id}')">${ico(node.type==='company'?'building':'folder')}<span class="org-final-name">${esc(node.name)}</span></button><button class="org-final-more" onclick="event.stopPropagation();toggleAdminDeptTreeMenu('${node.id}')">${ico('more')}</button>${menuHtml(node)}</div>${children.length?`<div class="org-final-children ${expanded?'':'collapsed'}">${children.map(child=>nodeHtml(child,depth+1)).join('')}</div>`:''}</div>`;
  }

  function panelHtml(){
    const selected=state.adminDeptSelected==='unassigned';
    return `<div class="org-final-head"><div class="org-final-title">${ico('building')}组织架构<small>集团 / 部门 / 项目组</small></div><div class="org-final-tools"><label class="org-final-search">${ico('search')}<input id="orgFinalSearch" placeholder="搜索部门名称" oninput="filterFinalOrgTree(this.value)"></label><button class="org-final-expand" title="展开或收起全部" onclick="toggleAdminDeptAll()">${ico('down')}</button></div></div><div class="org-final-scroll" id="orgFinalScroll"><div class="org-final-section">正式组织</div>${nodes.map(item=>nodeHtml(item)).join('')}<div class="org-final-section">特殊节点</div><div class="org-final-node" data-search="待分配人员池"><div class="org-final-row ${selected?'active':''}"><span class="org-final-toggle empty"></span><button class="org-final-select" onclick="selectAdminDept('unassigned')">${ico('users')}<span class="org-final-name">待分配人员池</span></button><span class="org-final-more"></span></div></div><div class="org-final-empty" id="orgFinalEmpty" hidden>未找到匹配的组织节点</div></div>`;
  }

  function signature(){
    return [state.adminDeptSelected,(state.adminDeptExpanded||[]).join(','),state.adminDeptTreeMenu||''].join('|');
  }

  function rebuild(){
    if(state.page!=='admin'||state.adminTab!=='dept')return;
    const panel=document.querySelector('.ad-tree-panel');
    if(!panel)return;
    const next=signature();
    if(panel.classList.contains('org-final-panel')&&panel.dataset.orgSignature===next)return;
    panel.className='ad-tree-panel org-final-panel';
    panel.dataset.orgSignature=next;
    panel.innerHTML=panelHtml();
  }

  window.filterFinalOrgTree=function(value){
    const query=String(value||'').trim().toLowerCase();
    const scroll=document.getElementById('orgFinalScroll');
    if(!scroll)return;
    scroll.classList.toggle('searching',Boolean(query));
    let visible=0;
    scroll.querySelectorAll('.org-final-node').forEach(node=>{
      const match=!query||(node.dataset.search||'').includes(query);
      node.hidden=!match;
      if(match)visible++;
    });
    const empty=document.getElementById('orgFinalEmpty');
    if(empty)empty.hidden=visible>0;
  };

  let queued=false;
  function enhance(){
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{
      queued=false;
      installTheme();
      rebuild();
    });
  }

  installTheme();
  const app=document.getElementById('app');
  if(app)new MutationObserver(enhance).observe(app,{childList:true,subtree:true});
  enhance();
})();