/* Department management console v6 — compact hierarchy and approved sunny composition. */
(function(){
  if(window.__adminDeptConsoleV6)return;
  window.__adminDeptConsoleV6=true;
  if(typeof state==='undefined'||typeof render!=='function')return;

  const data=[{
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

  function install(){
    document.getElementById('admin-dept-console-v4-theme')?.remove();
    document.getElementById('admin-dept-console-v5-theme')?.remove();
    if(!document.getElementById('admin-dept-console-v6-css')){
      const link=document.createElement('link');
      link.id='admin-dept-console-v6-css';
      link.rel='stylesheet';
      link.href='assets/admin-dept-console-v6.css?v=1';
      document.head.appendChild(link);
    }
  }

  function searchable(node){
    return [node.name,...(node.children||[]).map(searchable)].flat().join(' ').toLowerCase();
  }

  function menu(node){
    if(state.adminDeptTreeMenu!==node.id)return '';
    return `<div class="dept6-menu" onclick="event.stopPropagation()"><button onclick="dept6Action('${node.id}','create')">${ico('plus')}新建下级部门</button><button onclick="dept6Action('${node.id}','edit')">${ico('edit')}编辑部门</button><button onclick="dept6Action('${node.id}','move')">${ico('move')}调整上级部门</button><button class="danger" onclick="dept6Action('${node.id}','decommission')">${ico('trash')}组织裁撤</button></div>`;
  }

  function node(nodeData,depth=0){
    const children=nodeData.children||[];
    const expanded=Array.isArray(state.adminDeptExpanded)&&state.adminDeptExpanded.includes(nodeData.id);
    const active=state.adminDeptSelected===nodeData.id;
    return `<div class="dept6-node" data-search="${esc(searchable(nodeData))}"><div class="dept6-row ${depth===0?'root':''} ${active?'active':''}"><button class="dept6-toggle ${children.length?'':'empty'} ${expanded?'':'collapsed'}" onclick="event.stopPropagation();toggleAdminDept('${nodeData.id}')">${children.length?ico('down'):''}</button><button class="dept6-select" onclick="selectAdminDept('${nodeData.id}')">${ico(depth===0?'building':'folder')}<span class="dept6-name">${esc(nodeData.name)}</span></button><button class="dept6-more" onclick="event.stopPropagation();toggleAdminDeptTreeMenu('${nodeData.id}')">${ico('more')}</button>${menu(nodeData)}</div>${children.length?`<div class="dept6-children ${expanded?'':'collapsed'}">${children.map(child=>node(child,depth+1)).join('')}</div>`:''}</div>`;
  }

  function markup(){
    return `<div class="dept6-tree-head"><div class="dept6-tree-title">${ico('building')}组织架构<small>集团 / 部门 / 项目组</small></div><div class="dept6-tree-tools"><label class="dept6-search">${ico('search')}<input placeholder="搜索部门名称" oninput="filterDept6Tree(this.value)"></label><button class="dept6-expand" title="展开或收起全部" onclick="toggleAdminDeptAll()">${ico('down')}</button></div></div><div class="dept6-tree-body" id="dept6TreeBody"><div class="dept6-section">正式组织</div>${data.map(item=>node(item)).join('')}<div class="dept6-section" style="margin-top:13px">特殊节点</div><div class="dept6-node" data-search="待分配人员池"><div class="dept6-row ${state.adminDeptSelected==='unassigned'?'active':''}"><span class="dept6-toggle empty"></span><button class="dept6-select" onclick="selectAdminDept('unassigned')">${ico('users')}<span class="dept6-name">待分配人员池</span></button><span></span></div></div><div class="dept6-empty" id="dept6Empty" hidden>未找到匹配的组织节点</div></div>`;
  }

  function rebuildTree(){
    if(state.page!=='admin'||state.adminTab!=='dept')return;
    const panel=document.querySelector('.ad-tree-panel');
    if(!panel)return;
    const signature=[state.adminDeptSelected,(state.adminDeptExpanded||[]).join(','),state.adminDeptTreeMenu||''].join('|');
    if(panel.classList.contains('dept6-tree-panel')&&panel.dataset.signature===signature)return;
    panel.className='ad-tree-panel dept6-tree-panel';
    panel.dataset.signature=signature;
    panel.innerHTML=markup();
  }

  function decorateMetrics(){
    const names=['users','building','folder','shield'];
    document.querySelectorAll('.ad-metric').forEach((item,index)=>{
      if(!item.querySelector('.dept6-metric-icon'))item.insertAdjacentHTML('beforeend',`<span class="dept6-metric-icon">${ico(names[index]||'chart')}</span>`);
    });
  }

  window.dept6Action=function(id,type){
    state.adminDeptSelected=id;
    state.adminDeptView='overview';
    state.adminDeptTreeMenu=null;
    if(typeof openAdminDeptDialog==='function')openAdminDeptDialog(type,type==='create'?id:undefined);
  };

  window.filterDept6Tree=function(value){
    const query=String(value||'').trim().toLowerCase();
    const body=document.getElementById('dept6TreeBody');
    if(!body)return;
    body.classList.toggle('searching',Boolean(query));
    let visible=0;
    body.querySelectorAll('.dept6-node').forEach(item=>{
      const match=!query||(item.dataset.search||'').includes(query);
      item.hidden=!match;
      if(match)visible++;
    });
    const empty=document.getElementById('dept6Empty');
    if(empty)empty.hidden=visible>0;
  };

  let pending=false;
  function enhance(){
    if(pending)return;
    pending=true;
    requestAnimationFrame(()=>{
      pending=false;
      const active=state.page==='admin'&&state.adminTab==='dept';
      document.body.classList.toggle('admin-console-v6',active);
      if(!active)return;
      rebuildTree();
      decorateMetrics();
    });
  }

  install();
  if(!Array.isArray(state.adminDeptExpanded)||!state.adminDeptExpanded.length)state.adminDeptExpanded=['group','research','construction'];
  const app=document.getElementById('app');
  if(app)new MutationObserver(enhance).observe(app,{childList:true,subtree:true});
  enhance();
})();
