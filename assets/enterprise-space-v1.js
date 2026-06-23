/* Enterprise space integrated into the unified web prototype. */
(function(){
  if(window.__enterpriseSpaceV2)return;
  window.__enterpriseSpaceV2=true;
  if(typeof state==='undefined'||typeof render!=='function'||typeof sidebar!=='function'||typeof enterprise!=='function')return;

  state.enterpriseNavExpanded=state.enterpriseNavExpanded!==false;
  state.enterpriseOrgExpanded=state.enterpriseOrgExpanded!==false;
  state.enterpriseView=state.enterpriseView||'list';
  state.enterpriseFilter=state.enterpriseFilter||'all';
  state.enterpriseFilterOpen=false;

  const baseRender=render;
  render=function(){
    baseRender();
    document.body.classList.toggle('enterprise-mode',state.page==='enterprise');
  };

  window.toggleEnterpriseNav=function(){state.enterpriseNavExpanded=!state.enterpriseNavExpanded;render()};
  window.toggleEnterpriseOrg=function(){state.enterpriseOrgExpanded=!state.enterpriseOrgExpanded;render()};
  window.setEnterpriseView=function(view){state.enterpriseView=view;state.detail=null;render()};
  window.toggleEnterpriseFilter=function(){state.enterpriseFilterOpen=!state.enterpriseFilterOpen;render()};
  window.applyEnterpriseFilter=function(){state.enterpriseFilter=document.getElementById('enterpriseFilterType')?.value||'all';state.enterpriseFilterOpen=false;state.selected=[];state.detail=null;render()};
  window.clearEnterpriseFilter=function(){state.enterpriseFilter='all';state.enterpriseFilterOpen=false;state.selected=[];state.detail=null;render()};
  window.goEnterpriseFolder=function(level){state.folder=level<0?[]:state.folder.slice(0,level+1);state.selected=[];state.detail=null;state.menu=null;render()};

  sidebar=function(){
    const groups=nav.map(group=>{
      const items=group.items.map(([page,iconName,title])=>{
        const active=state.page===page;
        const relatedBadge=page==='related'?'<span class="trail badge blue">3</span>':'';
        const caret=page==='enterprise'&&active?`<span class="enterprise-nav-caret ${state.enterpriseNavExpanded?'':'collapsed'}">${icon('down')}</span>`:'';
        const action=page==='enterprise'&&active?'toggleEnterpriseNav()':`navigate('${page}')`;
        const base=`<button class="nav-item ${active?'active':''}" onclick="${action}">${icon(iconName)}<span>${title}</span>${relatedBadge}${caret}</button>`;
        if(page!=='enterprise'||!active)return base;
        const rootName=(depts||[]).includes('集团资料库')?'集团资料库':(depts||[])[0];
        const children=(depts||[]).filter(dept=>dept!==rootName);
        const total=(depts||[]).reduce((sum,dept)=>sum+(enterpriseFiles[dept]||[]).length,0);
        const deptRows=children.map(dept=>{
          const count=(enterpriseFiles[dept]||[]).filter(item=>(item.parent||'')==='').length;
          return `<button class="enterprise-dept-nav ${state.dept===dept?'active':''}" onclick="changeDept('${dept}')" title="进入${safe(dept)}资料库">${icon('folder')}<span>${safe(dept)}</span><small>${count}</small></button>`;
        }).join('');
        return `${base}<div class="enterprise-org-tree ${state.enterpriseNavExpanded?'':'collapsed'}"><div class="enterprise-org-root"><button class="enterprise-tree-toggle ${state.enterpriseOrgExpanded?'':'collapsed'}" onclick="toggleEnterpriseOrg()" title="${state.enterpriseOrgExpanded?'收起':'展开'}组织架构">${icon('down')}</button><button class="enterprise-org-label" onclick="changeDept('${rootName}')">${icon('building')}<span>${safe(rootName)}</span></button><small>${total}</small></div><div class="enterprise-org-children ${state.enterpriseOrgExpanded?'':'collapsed'}">${deptRows}</div></div>`;
      }).join('');
      return `<div class="nav-title">${group.section}</div>${items}`;
    }).join('');
    return `<aside class="sidebar"><div class="brand"><div class="brand-mark"><iconify-icon icon="solar:cloud-file-bold-duotone" aria-hidden="true" onload="this.parentElement.classList.add('is-loaded')"></iconify-icon><span class="brand-fallback">知</span></div><div class="brand-copy"><strong>智汇云知</strong><span>智能知识库管理平台 · PRO</span></div></div><div class="nav-scroll">${groups}</div><div class="capacity-card"><div class="capacity-head"><strong>个人空间用量</strong><span>31%</span></div><div class="capacity-bar"><i></i></div><div class="capacity-foot">已使用 31.4 GB / 100 GB</div></div></aside>`;
  };

  const baseCurrentFiles=currentFiles;
  currentFiles=function(space='enterprise'){
    if(space!=='enterprise')return baseCurrentFiles(space);
    const currentPath=state.folder.join('/');
    let files=(enterpriseFiles[state.dept]||[]).filter(item=>(item.parent||'')===currentPath);
    if(state.query)files=files.filter(item=>item.name.toLowerCase().includes(state.query.toLowerCase()));
    if(state.enterpriseFilter!=='all')files=files.filter(item=>state.enterpriseFilter==='folder'?item.type==='folder':state.enterpriseFilter==='document'?['doc','pdf','xls','ppt','md'].includes(item.type):item.type===state.enterpriseFilter);
    return files.slice().sort((a,b)=>{
      const av=a[state.sort.key]||'';
      const bv=b[state.sort.key]||'';
      return state.sort.dir==='asc'?String(av).localeCompare(String(bv),'zh-CN'):String(bv).localeCompare(String(av),'zh-CN');
    });
  };

  changeDept=function(dept){state.dept=dept;state.folder=[];state.query='';state.enterpriseFilter='all';state.enterpriseFilterOpen=false;state.selected=[];state.detail=null;state.menu=null;render()};

  const baseOpenFile=openFile;
  openFile=function(id,space){
    if(space!=='enterprise')return baseOpenFile(id,space);
    const file=findFile(id,'enterprise');
    if(!file)return;
    if(file.type==='folder'){
      state.folder.push(file.name);state.selected=[];state.detail=null;state.menu=null;render();
    }else openModal('preview',{file});
  };

  const baseCreateFolder=createFolder;
  createFolder=function(space){
    if(space!=='enterprise')return baseCreateFolder(space);
    const name=document.getElementById('folderName')?.value.trim();
    if(!name)return toast('请输入文件夹名称','warning');
    if(/[\\/:*?"<>|]/.test(name))return toast('文件夹名称包含不支持的字符','warning');
    const parent=state.folder.join('/');
    if((enterpriseFiles[state.dept]||[]).some(item=>(item.parent||'')===parent&&item.name===name))return toast('当前目录已存在同名内容','warning');
    enterpriseFiles[state.dept].unshift({id:'enterprise-folder-'+Date.now(),type:'folder',name,parent,modified:'2026-06-23 14:30',owner:'张明远',status:'正常',tag:'文件夹'});
    closeModal();toast('文件夹创建成功');render();
  };

  window.enterpriseRowClick=function(event,id){
    if(event.target.closest('button,input'))return;
    if(event.ctrlKey||event.metaKey)state.selected=state.selected.includes(id)?state.selected.filter(item=>item!==id):[...state.selected,id];
    else state.selected=[id];
    state.detail=null;
    render();
  };

  window.enterpriseTable=function(files){
    const rows=files.map(file=>`<tr data-file-id="${file.id}" class="${state.selected.includes(file.id)?'selected':''}" onclick="enterpriseRowClick(event,'${file.id}')" ondblclick="openFile('${file.id}','enterprise')" oncontextmenu="openMenu(event,'${file.id}','enterprise')"><td class="check-col"><input class="check" type="checkbox" ${state.selected.includes(file.id)?'checked':''} onclick="event.stopPropagation();toggleOne('${file.id}',this.checked)"></td><td><div class="file-name">${fileVisual(file)}<div class="file-name-copy"><button class="file-entry-link" onclick="event.stopPropagation();openFile('${file.id}','enterprise')">${safe(file.name)}</button><div class="file-name-meta"><span>${personalFileType(file)}</span>${file.tag?`<span class="badge blue">${safe(file.tag)}</span>`:''}</div></div></div></td><td>${file.type==='folder'?'—':safe(file.size||'—')}</td><td>${safe(file.owner||'张明远')}</td><td>${safe(file.modified)}</td><td class="status-cell"><span class="status-dot ${file.status==='正常'?'green':file.status==='受控'?'orange':'red'}"></span>${safe(file.status||'正常')}</td><td class="op-col"><button class="more-btn" aria-label="更多操作" onclick="event.stopPropagation();openMenu(event,'${file.id}','enterprise')">${icon('more')}</button></td></tr>`).join('');
    const ids=JSON.stringify(files.map(item=>item.id)).replace(/"/g,'&quot;');
    return `<table class="file-table personal-file-table enterprise-file-table"><colgroup><col class="enterprise-check-col"><col class="enterprise-name-col"><col class="enterprise-size-col"><col class="enterprise-owner-col"><col class="enterprise-time-col"><col class="enterprise-status-col"><col class="enterprise-op-col"></colgroup><thead><tr><th class="check-col"><input class="check" type="checkbox" ${files.length&&state.selected.length===files.length?'checked':''} onchange="toggleAll(this.checked,${ids})"></th><th><span class="sort-head" onclick="sortBy('name')">名称${sortMark('name')}</span></th><th><span class="sort-head" onclick="sortBy('size')">大小${sortMark('size')}</span></th><th>创建人</th><th><span class="sort-head" onclick="sortBy('modified')">修改时间${sortMark('modified')}</span></th><th>状态</th><th class="op-col"></th></tr></thead><tbody>${rows||`<tr><td colspan="7"><div class="empty"><div class="empty-icon">${icon('search')}</div><strong>当前目录暂无内容</strong><p>可以上传文件或新建文件夹开始整理</p></div></td></tr>`}</tbody></table>`;
  };

  window.enterpriseGrid=function(files){
    return `<div class="grid-zone"><div class="file-grid">${files.map(file=>`<div data-file-id="${file.id}" class="file-card ${state.selected.includes(file.id)?'selected':''}" onclick="enterpriseRowClick(event,'${file.id}')" ondblclick="openFile('${file.id}','enterprise')" oncontextmenu="openMenu(event,'${file.id}','enterprise')"><input class="check" type="checkbox" ${state.selected.includes(file.id)?'checked':''} onclick="event.stopPropagation();toggleOne('${file.id}',this.checked)"><button class="more-btn" onclick="event.stopPropagation();openMenu(event,'${file.id}','enterprise')">${icon('more')}</button>${fileVisual(file)}<button class="file-card-name file-entry-link" onclick="event.stopPropagation();openFile('${file.id}','enterprise')">${safe(file.name)}</button><div class="file-card-meta"><span>${file.type==='folder'?'文件夹':safe(file.size||'—')}</span><span>${safe((file.modified||'').slice(5,10))}</span></div><div class="file-card-access"><span class="badge ${file.status==='正常'?'green':'orange'}">${safe(file.status||'正常')}</span></div></div>`).join('')}</div></div>`;
  };

  window.enterpriseFilterPop=function(){
    return `<div class="filter-pop enterprise-filter-pop"><div class="filter-title">搜索条件<button class="btn ghost icon-only" onclick="state.enterpriseFilterOpen=false;render()">${icon('x')}</button></div><div class="form-grid"><div class="field"><label>文件类型</label><select class="select" id="enterpriseFilterType"><option value="all" ${state.enterpriseFilter==='all'?'selected':''}>全部类型</option><option value="folder" ${state.enterpriseFilter==='folder'?'selected':''}>文件夹</option><option value="document" ${state.enterpriseFilter==='document'?'selected':''}>文档</option><option value="img" ${state.enterpriseFilter==='img'?'selected':''}>图片</option><option value="zip" ${state.enterpriseFilter==='zip'?'selected':''}>压缩包</option></select></div><div class="field"><label>显示方式</label><div class="view-toggle" style="width:74px"><button class="${state.enterpriseView==='list'?'active':''}" onclick="state.enterpriseView='list';render()">${icon('list')}</button><button class="${state.enterpriseView==='grid'?'active':''}" onclick="state.enterpriseView='grid';render()">${icon('grid')}</button></div></div></div><div class="filter-actions"><button class="btn" onclick="clearEnterpriseFilter()">重置</button><button class="btn primary" onclick="applyEnterpriseFilter()">应用</button></div></div>`;
  };

  window.enterprisePathbar=function(total){
    return `<div class="pathbar personal-pathbar enterprise-pathbar">${state.folder.length?`<button class="path-back" onclick="goEnterpriseFolder(${state.folder.length-2})">${icon('arrowLeft')}返回上一级</button><span class="path-divider"></span>`:''}<button onclick="goEnterpriseFolder(-1)">${icon('building')}企业空间</button><span class="path-sep">/</span><button class="current" onclick="goEnterpriseFolder(-1)">${safe(state.dept)}</button>${state.folder.map((name,index)=>`<span class="path-sep">/</span><button class="${index===state.folder.length-1?'current':''}" onclick="goEnterpriseFolder(${index})">${safe(name)}</button>`).join('')}<span class="path-context">${state.folder.length?'当前文件夹':'部门资料库'}</span><span class="count">${total} 项</span></div>`;
  };

  enterprise=function(){
    const files=currentFiles('enterprise');
    const filterActive=state.enterpriseFilter!=='all';
    const content=state.enterpriseView==='grid'?enterpriseGrid(files):enterpriseTable(files);
    return `${pageHead('企业空间','组织级文件资产按部门资料库统一治理','',`<span class="badge blue">${icon('shield')}当前权限：操作者</span>`)}<div class="panel personal-panel enterprise-panel"><div class="personal-toolbar"><button class="btn primary" onclick="startUpload('enterprise')">${icon('upload')}上传文件</button><button class="btn" onclick="openModal('newFolder',{space:'enterprise'})">${icon('folderPlus')}新建文件夹</button><div class="search-box personal-search">${icon('search')}<input value="${safe(state.query)}" placeholder="搜索当前资料库" onkeydown="if(event.key==='Enter'){state.query=this.value;state.selected=[];state.detail=null;render()}"><button class="btn ghost icon-only" style="width:26px;height:26px" onclick="state.enterpriseFilterOpen=!state.enterpriseFilterOpen;render()" title="筛选条件">${icon('filter')}</button></div><div class="spacer"></div><div class="view-toggle"><button class="${state.enterpriseView==='list'?'active':''}" onclick="setEnterpriseView('list')" title="列表视图">${icon('list')}</button><button class="${state.enterpriseView==='grid'?'active':''}" onclick="setEnterpriseView('grid')" title="网格视图">${icon('grid')}</button></div></div>${state.enterpriseFilterOpen?enterpriseFilterPop():''}${filterActive?`<div class="filter-summary">当前筛选：<span class="filter-chip">${state.enterpriseFilter==='folder'?'文件夹':state.enterpriseFilter==='document'?'文档':state.enterpriseFilter==='img'?'图片':'压缩包'} <b onclick="clearEnterpriseFilter()">×</b></span><button class="btn text" style="margin-left:auto" onclick="clearEnterpriseFilter()">清除筛选</button></div>`:''}${enterprisePathbar(files.length)}${selectionBar('enterprise')}<div class="file-content personal-file-content enterprise-file-content">${state.enterpriseView==='list'?`<div class="table-zone">${content}</div>`:content}${detailPane()}</div></div>`;
  };

  render();
})();
