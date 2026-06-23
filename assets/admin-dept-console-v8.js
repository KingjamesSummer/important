/* Department management v8 — clean composition and deterministic hierarchy. */
(function(){
  if(window.__adminDeptConsoleV8)return;
  window.__adminDeptConsoleV8=true;
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

  const expanded=window.__dept8Expanded||(window.__dept8Expanded=new Set(['group','research','construction']));
  const ico=name=>typeof icon==='function'?icon(name):'';
  const esc=value=>typeof safe==='function'?safe(value):String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

  function installCss(){
    document.getElementById('admin-dept-console-v4-theme')?.remove();
    document.getElementById('admin-dept-console-v5-theme')?.remove();
    document.getElementById('admin-dept-console-v6-css')?.remove();
    document.getElementById('admin-dept-console-v6-theme')?.remove();
    document.getElementById('admin-dept-console-v7-style')?.remove();
    if(!document.getElementById('admin-dept-console-v8-css')){
      const link=document.createElement('link');
      link.id='admin-dept-console-v8-css';
      link.rel='stylesheet';
      link.href='assets/admin-dept-console-v8.css?v=1';
      document.head.appendChild(link);
    }
  }

  function searchable(item){
    return [item.name,...(item.children||[]).map(searchable)].flat().join(' ').toLowerCase();
  }

  function menu(item){
    if(state.adminDeptTreeMenu!==item.id)return '';
    return `<div class="dept8-menu" onclick="event.stopPropagation()"><button onclick="dept8Action('${item.id}','create')">${ico('plus')}新建下级部门</button><button onclick="dept8Action('${item.id}','edit')">${ico('edit')}编辑部门</button><button onclick="dept8Action('${item.id}','move')">${ico('move')}调整上级部门</button><button class="danger" onclick="dept8Action('${item.id}','decommission')">${ico('trash')}组织裁撤</button></div>`;
  }

  function node(item,depth=0){
    const children=item.children||[];
    const isOpen=expanded.has(item.id);
    const active=state.adminDeptSelected===item.id;
    return `<div class="dept8-node" data-search="${esc(searchable(item))}"><div class="dept8-row ${depth===0?'root':''} ${active?'active':''}"><button class="dept8-toggle ${children.length?'':'empty'} ${isOpen?'':'collapsed'}" onclick="event.stopPropagation();dept8Toggle('${item.id}')">${children.length?ico('down'):''}</button><button class="dept8-select" onclick="dept8Select('${item.id}')">${ico(depth===0?'building':'folder')}<span class="dept8-name">${esc(item.name)}</span></button><button class="dept8-more" onclick="event.stopPropagation();toggleAdminDeptTreeMenu('${item.id}')">${ico('more')}</button>${menu(item)}</div>${children.length?`<div class="dept8-children ${isOpen?'':'collapsed'}">${children.map(child=>node(child,depth+1)).join('')}</div>`:''}</div>`;
  }

  function treeHtml(){
    return `<div class="dept8-tree-head"><div class="dept8-tree-title">${ico('building')}组织架构<small>集团 / 部门 / 项目组</small></div><div class="dept8-tree-tools"><label class="dept8-search">${ico('search')}<input placeholder="搜索部门名称" oninput="filterDept8Tree(this.value)"></label><button class="dept8-expand" title="展开或收起全部" onclick="dept8ToggleAll()">${ico('down')}</button></div></div><div class="dept8-tree-body" id="dept8TreeBody"><div class="dept8-section">正式组织</div>${data.map(item=>node(item)).join('')}<div class="dept8-section" style="margin-top:13px">特殊节点</div><div class="dept8-node" data-search="待分配人员池"><div class="dept8-row ${state.adminDeptSelected==='unassigned'?'active':''}"><span class="dept8-toggle empty"></span><button class="dept8-select" onclick="dept8Select('unassigned')">${ico('users')}<span class="dept8-name">待分配人员池</span></button><span></span></div></div><div class="dept8-empty" id="dept8Empty" hidden>未找到匹配的组织节点</div></div>`;
  }

  function rebuildTree(force=false){
    const panel=document.querySelector('.ad-tree-panel');
    if(!panel)return;
    const signature=[state.adminDeptSelected,[...expanded].sort().join(','),state.adminDeptTreeMenu||''].join('|');
    if(!force&&panel.classList.contains('dept8-tree-panel')&&panel.dataset.signature===signature)return;
    panel.className='ad-tree-panel dept8-tree-panel';
    panel.dataset.signature=signature;
    panel.innerHTML=treeHtml();
  }

  function decorateDetail(){
    document.querySelector('.dept7-page-hero')?.remove();
    const iconBox=document.querySelector('.ad-dept-icon');
    if(iconBox)iconBox.innerHTML=ico('building');
    const metricIcons=['users','building','folder','shield'];
    document.querySelectorAll('.ad-metric').forEach((metric,index)=>{
      metric.querySelector('.dept7-metric-icon')?.remove();
      metric.querySelector('.dept8-metric-icon')?.remove();
      metric.insertAdjacentHTML('beforeend',`<span class="dept8-metric-icon">${ico(metricIcons[index]||'chart')}</span>`);
    });
  }

  window.dept8Toggle=function(id){
    if(expanded.has(id))expanded.delete(id);else expanded.add(id);
    rebuildTree(true);
  };

  window.dept8ToggleAll=function(){
    const all=['group','research','construction'];
    const fullyOpen=all.every(id=>expanded.has(id));
    expanded.clear();
    if(!fullyOpen)all.forEach(id=>expanded.add(id));
    rebuildTree(true);
  };

  window.dept8Select=function(id){
    if(typeof selectAdminDept==='function')selectAdminDept(id);
    else{
      state.adminDeptSelected=id;
      state.adminDeptView='overview';
      render();
    }
  };

  window.dept8Action=function(id,type){
    state.adminDeptSelected=id;
    state.adminDeptView='overview';
    state.adminDeptTreeMenu=null;
    if(typeof openAdminDeptDialog==='function')openAdminDeptDialog(type,type==='create'?id:undefined);
  };

  window.filterDept8Tree=function(value){
    const query=String(value||'').trim().toLowerCase();
    const body=document.getElementById('dept8TreeBody');
    if(!body)return;
    body.classList.toggle('searching',Boolean(query));
    let visible=0;
    body.querySelectorAll('.dept8-node').forEach(item=>{
      const match=!query||(item.dataset.search||'').includes(query);
      item.hidden=!match;
      if(match)visible++;
    });
    const empty=document.getElementById('dept8Empty');
    if(empty)empty.hidden=visible>0;
  };

  let queued=false;
  function enhance(){
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{
      queued=false;
      const active=state.page==='admin'&&state.adminTab==='dept';
      document.body.classList.toggle('admin-console-v8',active);
      document.body.classList.remove('admin-console-v7');
      if(!active)return;
      installCss();
      rebuildTree();
      decorateDetail();
    });
  }

  installCss();
  const app=document.getElementById('app');
  if(app)new MutationObserver(enhance).observe(app,{childList:true,subtree:true});
  enhance();
})();
