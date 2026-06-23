/* Enterprise space refinement integrated by web-prototype.html */
(function(){
  if(window.__enterpriseSpaceV1)return;
  window.__enterpriseSpaceV1=true;
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
  window.setEnterpriseFilter=function(type){state.enterpriseFilter=type;state.enterpriseFilterOpen=false;state.selected=[];state.detail=null;render()};
  window.refreshEnterprise=function(){state.enterpriseFilterOpen=false;toast('资料库内容已刷新');render()};
  window.goEnterpriseFolder=function(level){state.folder=level<0?[]:state.folder.slice(0,level+1);state.selected=[];state.detail=null;state.menu=null;render()};

  sidebar=function(){
    const groups=nav.map(group=>{
      const items=group.items.map(([page,iconName,title])=>{
        const active=state.page===page;
        const enterpriseCaret=page==='enterprise'&&active?`<span class="enterprise-nav-caret ${state.enterpriseNavExpanded?'':'collapsed'}">${icon('down')}</span>`:'';
        const relatedBadge=page==='related'?'<span class="trail badge blue">3</span>':'';
        const base=`<button class="nav-item ${active?'active':''}" onclick="navigate('${page}')">${icon(iconName)}<span>${title}</span>${relatedBadge}${enterpriseCaret}</button>`;
        if(page!=='enterprise'||!active)return base;
        const total=(depts||[]).reduce((sum,dept)=>sum+(enterpriseFiles[dept]||[]).length,0);
        const deptRows=(depts||[]).map((dept,index)=>{
          const count=(enterpriseFiles[dept]||[]).filter(item=>(item.parent||'')==='').length;
          return `<button class="enterprise-dept-nav ${state.dept===dept?'active':''}" onclick="changeDept('${dept}')" title="进入${safe(dept)}资料库">${icon(index===0?'building':'folder')}<span>${safe(dept)}</span><small>${count}</small></button>`;
        }).join('');
        return `${base}<div class="enterprise-org-tree ${state.enterpriseNavExpanded?'':'collapsed'}"><button class="enterprise-org-root" onclick="toggleEnterpriseOrg()"><span class="enterprise-tree-toggle ${state.enterpriseOrgExpanded?'':'collapsed'}">${icon('down')}</span>${icon('building')}<span>集团资料库</span><small>${total}</small></button><div class="enterprise-org-children ${state.enterpriseOrgExpanded?'':'collapsed'}">${deptRows}</div></div>`;
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
    if(state.enterpriseFilter!=='all'){
      files=files.filter(item=>state.enterpriseFilter==='folder'?item.type==='folder':state.enterpriseFilter==='document'?['doc','pdf','xls','ppt','md'].includes(item.type):item.type===state.enterpriseFilter);
    }
    return files.slice().sort((a,b)=>{
      const av=a[state.sort.key]||'';
      const bv=b[state.sort.key]||'';
      return state.sort.dir==='asc'?String(av).localeCompare(String(bv),'zh-CN'):String(bv).localeCompare(String(av),'zh-CN');
    });
  };

  changeDept=function(dept){
    state.dept=dept;state.folder=[];state.query='';state.enterpriseFilter='all';state.enterpriseFilterOpen=false;state.selected=[];state.detail=null;state.menu=null;render();
  };

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
    if(event.ctrlKey||event.metaKey){
      state.selected=state.selected.includes(id)?state.selected.filter(item=>item!==id):[...state.selected,id];
      state.detail=state.selected.length===1?{id:state.selected[0],space:'enterprise'}:null;
    }else{
      state.selected=[id];state.detail={id,space:'enterprise'};
    }
    render();
  };

  function typeInfo(file){
    const map={folder:['文件夹','folder'],doc:['Word 文档','edit'],pdf:['PDF 文档','file'],xls:['Excel 表格','grid'],ppt:['演示文稿','eye'],md:['Markdown','edit'],img:['图片','eye'],zip:['压缩包','archive']};
    return map[file.type]||['其他文件','file'];
  }
  function ownerAvatar(name){return safe((name||'张').slice(-1))}
  function splitTime(value){const parts=String(value||'—').split(' ');return {date:parts[0]||'—',time:parts[1]||''}}

  window.enterpriseTable=function(files){
    const rows=files.map(file=>{
      const [typeLabel,typeIcon]=typeInfo(file);
      const modified=splitTime(file.modified);
      const hint=file.type==='folder'?'双击进入文件夹':(file.status&&file.status!=='正常'?`状态：${safe(file.status)}`:'组织文件资产');
      return `<tr class="${state.selected.includes(file.id)?'selected':''}" onclick="enterpriseRowClick(event,'${file.id}')" ondblclick="openFile('${file.id}','enterprise')"><td class="check-col"><input class="check" type="checkbox" ${state.selected.includes(file.id)?'checked':''} onclick="event.stopPropagation();toggleOne('${file.id}',this.checked)"></td><td class="name-col"><div class="file-name">${fileVisual(file)}<div class="file-name-copy"><div class="file-name-title">${safe(file.name)}</div><div class="file-name-meta">${file.tag?`<span class="badge">${safe(file.tag)}</span>`:''}<span class="file-hint">${hint}</span></div></div></div></td><td class="type-col"><span class="enterprise-type">${icon(typeIcon)}${typeLabel}</span></td><td class="size-col">${file.type==='folder'?'—':safe(file.size||'—')}</td><td class="owner-col"><span class="enterprise-owner"><span class="enterprise-owner-avatar">${ownerAvatar(file.owner)}</span><span>${safe(file.owner||'张明远')}</span></span></td><td class="time-col"><span class="enterprise-time"><strong>${safe(modified.date)}</strong><small>${safe(modified.time)}</small></span></td><td class="op-col"><button class="more-btn" onclick="event.stopPropagation();openMenu(event,'${file.id}','enterprise')" title="更多操作">${icon('more')}</button></td></tr>`;
    }).join('');
    const ids=JSON.stringify(files.map(item=>item.id)).replace(/"/g,'&quot;');
    return `<table class="enterprise-table"><thead><tr><th class="check-col"><input class="check" type="checkbox" ${files.length&&state.selected.length===files.length?'checked':''} onchange="toggleAll(this.checked,${ids})"></th><th class="name-col"><span class="sort-head" onclick="sortBy('name')">名称${sortMark('name')}</span></th><th class="type-col">文件类型</th><th class="size-col"><span class="sort-head" onclick="sortBy('size')">大小${sortMark('size')}</span></th><th class="owner-col">创建人</th><th class="time-col"><span class="sort-head" onclick="sortBy('modified')">修改时间${sortMark('modified')}</span></th><th class="op-col"></th></tr></thead><tbody>${rows}</tbody></table>`;
  };

  window.enterpriseGrid=function(files){
    return `<div class="enterprise-grid">${files.map(file=>`<article class="enterprise-card ${state.selected.includes(file.id)?'selected':''}" onclick="enterpriseRowClick(event,'${file.id}')" ondblclick="openFile('${file.id}','enterprise')"><div class="enterprise-card-top">${fileVisual(file)}<div class="enterprise-card-title">${safe(file.name)}</div><button class="more-btn" onclick="event.stopPropagation();openMenu(event,'${file.id}','enterprise')">${icon('more')}</button></div><div class="enterprise-card-meta"><span class="enterprise-card-tag">${safe(file.tag||typeInfo(file)[0])}</span><span class="enterprise-card-owner">${safe(file.owner||'张明远')} · ${safe((file.modified||'').slice(5))}</span></div></article>`).join('')}</div>`;
  };

  window.enterpriseEmpty=function(){
    const inFolder=state.folder.length>0;
    const filtered=state.query||state.enterpriseFilter!=='all';
    const title=filtered?'没有符合条件的内容':inFolder?'这个文件夹还是空的':'当前资料库暂无内容';
    const desc=filtered?'可清除关键词或切换文件类型后重试。':inFolder?'上传文件或新建文件夹，开始整理当前目录。':'拥有上传权限后，可在这里沉淀部门文件资产。';
    return `<div class="enterprise-empty"><div><div class="enterprise-empty-icon">${icon(filtered?'search':'folder')}</div><strong>${title}</strong><p>${desc}</p><div class="enterprise-empty-actions">${filtered?`<button class="enterprise-btn" onclick="state.query='';state.enterpriseFilter='all';render()">清除筛选</button>`:`<button class="enterprise-btn" onclick="openModal('newFolder',{space:'enterprise'})">${icon('folderPlus')}新建文件夹</button><button class="enterprise-btn primary" onclick="startUpload('enterprise')">${icon('upload')}上传文件</button>`}</div></div></div>`;
  };

  enterprise=function(){
    const files=currentFiles('enterprise');
    const pathButtons=state.folder.map((name,index)=>`<span class="sep">/</span><button onclick="goEnterpriseFolder(${index})">${safe(name)}</button>`).join('');
    const activeFilter=state.enterpriseFilter!=='all';
    const filterOptions=[['all','全部类型','filter'],['folder','文件夹','folder'],['document','文档','edit'],['img','图片','eye'],['zip','压缩包','archive']];
    const filterPop=state.enterpriseFilterOpen?`<div class="enterprise-filter-pop">${filterOptions.map(([value,label,iconName])=>`<button class="${state.enterpriseFilter===value?'active':''}" onclick="setEnterpriseFilter('${value}')">${icon(iconName)}<span>${label}</span></button>`).join('')}</div>`:'';
    const content=files.length?(state.enterpriseView==='grid'?enterpriseGrid(files):enterpriseTable(files)):enterpriseEmpty();
    return `<section class="enterprise-page">${pageHead('企业空间','组织级文件资产按部门资料库统一治理',`<span class="enterprise-permission">${icon('shield')}当前权限：操作者</span>`)}<div class="panel enterprise-shell"><div class="enterprise-library-bar"><div class="enterprise-library-icon">${icon('building')}</div><div class="enterprise-library-copy"><strong>${safe(state.dept)}</strong><span>企业空间中的部门资料库 · 文件归组织所有</span></div><div class="enterprise-library-meta"><span>部门资料库</span><span>${(enterpriseFiles[state.dept]||[]).length} 项内容</span></div><div class="enterprise-library-actions"><button class="enterprise-icon-btn" onclick="toast('已收藏当前资料库')" title="收藏资料库">${icon('star')}</button><button class="enterprise-icon-btn" onclick="refreshEnterprise()" title="刷新">${icon('restore')}</button></div></div><div class="enterprise-toolbar"><button class="enterprise-btn primary" onclick="startUpload('enterprise')">${icon('upload')}上传</button><button class="enterprise-btn" onclick="openModal('newFolder',{space:'enterprise'})">${icon('folderPlus')}新建文件夹</button><div class="enterprise-spacer"></div><label class="enterprise-search">${icon('search')}<input value="${safe(state.query)}" placeholder="搜索当前资料库，按 Enter 确认" onkeydown="if(event.key==='Enter'){state.query=this.value;state.selected=[];state.detail=null;render()}"></label><button class="enterprise-btn enterprise-filter-trigger ${activeFilter?'active':''}" onclick="toggleEnterpriseFilter()">${icon('filter')}${activeFilter?'已筛选':'筛选'}</button>${filterPop}<div class="enterprise-view-toggle"><button class="${state.enterpriseView==='list'?'active':''}" onclick="setEnterpriseView('list')" title="列表视图">${icon('list')}</button><button class="${state.enterpriseView==='grid'?'active':''}" onclick="setEnterpriseView('grid')" title="网格视图">${icon('grid')}</button></div></div><div class="enterprise-pathbar">${state.folder.length?`<button onclick="goEnterpriseFolder(${state.folder.length-2})">${icon('arrowLeft')}返回</button><span class="sep">|</span>`:''}<button onclick="goEnterpriseFolder(-1)">${icon('building')}企业空间</button><span class="sep">/</span><button onclick="goEnterpriseFolder(-1)">${safe(state.dept)}</button>${pathButtons}<span class="path-count">${files.length} 项</span></div>${selectionBar('enterprise')}<div class="enterprise-body"><div class="enterprise-table-zone">${content}</div>${detailPane()}</div></div></section>`;
  };

  render();
  const params=new URLSearchParams(location.search);
  if(params.get('entry')==='enterprise')setTimeout(()=>{navigate('enterprise');document.querySelector('.main')?.scrollTo(0,0)},0);
})();
