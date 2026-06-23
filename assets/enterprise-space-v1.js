/* Enterprise space integrated into the unified web prototype. */
(function(){
  if(window.__enterpriseSpaceV4)return;
  window.__enterpriseSpaceV4=true;
  if(typeof state==='undefined'||typeof render!=='function'||typeof sidebar!=='function'||typeof enterprise!=='function')return;

  FILE_ICONIFY.zip='material-symbols:folder-zip-rounded';
  state.enterpriseDefaultDept=state.enterpriseDefaultDept||'研发中心';
  state.enterpriseNavExpanded=state.enterpriseNavExpanded!==false;
  state.enterpriseOrgExpanded=state.enterpriseOrgExpanded!==false;
  state.enterpriseView=state.enterpriseView||'list';
  state.enterpriseFilter=state.enterpriseFilter||'all';
  state.enterpriseTagFilter=state.enterpriseTagFilter||'all';
  state.enterpriseFilterOpen=false;
  state.enterprisePage=state.enterprisePage||1;
  state.enterprisePageSize=state.enterprisePageSize||8;

  const enterpriseStyle=document.createElement('style');
  enterpriseStyle.id='enterprise-space-v4-style';
  enterpriseStyle.textContent=`
    /* Enterprise list deliberately inherits the personal-space visual system. */
    .enterprise-mode .nav-item.active{background:var(--primary-soft)!important;color:var(--primary)!important}
    .enterprise-mode .nav-item.active:before{background:var(--primary)!important}
    .enterprise-org-tree-v4{margin:5px 8px 13px 24px;padding-left:11px;border-left:1px solid #dfe7f1}
    .enterprise-org-tree-v4.collapsed{display:none}
    .enterprise-library-root-v4,.enterprise-dept-nav-v4{width:100%;border:0;background:transparent;color:#60738a;text-align:left;transition:.16s ease}
    .enterprise-library-root-v4{height:40px;display:grid;grid-template-columns:18px minmax(0,1fr) auto;align-items:center;gap:8px;padding:0 8px;border-radius:9px}
    .enterprise-library-root-v4:hover,.enterprise-dept-nav-v4:hover{background:#f6f9fd;color:#315f8d}
    .enterprise-library-root-v4.active,.enterprise-dept-nav-v4.active{background:var(--primary-soft);color:var(--primary)}
    .enterprise-library-root-v4 .icon-stack,.enterprise-dept-nav-v4 .icon-stack{width:15px;height:15px}
    .enterprise-library-root-v4 strong,.enterprise-dept-nav-v4 strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;font-weight:600}
    .enterprise-nav-count-v4{height:21px;min-width:30px;padding:0 6px;display:inline-flex;align-items:center;justify-content:center;border-radius:7px;background:#f1f5fa;color:#8494a7;font-size:9px;font-style:normal;white-space:nowrap}
    .enterprise-library-root-v4.active .enterprise-nav-count-v4,.enterprise-dept-nav-v4.active .enterprise-nav-count-v4{background:#fff;color:var(--primary)}
    .enterprise-dept-group-v4{margin-top:5px}
    .enterprise-dept-group-head-v4{height:33px;display:grid;grid-template-columns:22px minmax(0,1fr) auto;align-items:center;gap:6px;padding:0 7px;color:#8392a3}
    .enterprise-dept-toggle-v4{width:22px;height:26px;display:grid;place-items:center;padding:0;border:0;border-radius:6px;background:transparent;color:#8494a6;transition:.16s ease}
    .enterprise-dept-toggle-v4:hover{background:#f2f6fb;color:var(--primary)}
    .enterprise-dept-toggle-v4.collapsed{transform:rotate(-90deg)}
    .enterprise-dept-toggle-v4 .icon-stack{width:13px;height:13px}
    .enterprise-dept-group-head-v4 span{font-size:10px;font-weight:650;letter-spacing:.02em}
    .enterprise-dept-group-head-v4 small{font-size:9px;color:#a0adba}
    .enterprise-dept-children-v4{display:grid;gap:2px;padding:1px 0 0 22px}
    .enterprise-dept-children-v4.collapsed{display:none}
    .enterprise-dept-nav-v4{height:38px;display:grid;grid-template-columns:17px minmax(0,1fr) auto auto;align-items:center;gap:7px;padding:0 7px;border-radius:9px}
    .enterprise-default-v4{height:19px;padding:0 5px;display:inline-flex;align-items:center;border:1px solid #bcd4ff;border-radius:6px;background:#fff;color:var(--primary);font-size:8px;font-style:normal;white-space:nowrap}
    .enterprise-page .page-head{margin-bottom:16px}
    .enterprise-panel{display:flex;flex-direction:column;min-height:calc(100vh - 170px);overflow:visible;position:relative}
    .enterprise-library-context-v4{min-height:58px;display:flex;align-items:center;gap:11px;padding:9px 16px;border-bottom:1px solid #e8eef6;background:#fff}
    .enterprise-context-icon-v4{width:38px;height:38px;display:grid;place-items:center;flex:none;border:1px solid #dce7f5;border-radius:11px;background:#f6f9ff;color:var(--primary)}
    .enterprise-context-icon-v4 .icon-stack{width:18px;height:18px}
    .enterprise-context-copy-v4{min-width:0}
    .enterprise-context-copy-v4 strong{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#2e4058;font-size:13px;font-weight:680}
    .enterprise-context-copy-v4 span{display:block;margin-top:4px;color:#8898aa;font-size:10px}
    .enterprise-context-badges-v4{display:flex;align-items:center;gap:6px;margin-left:5px}
    .enterprise-context-badge-v4{height:24px;padding:0 8px;display:inline-flex;align-items:center;border:1px solid #dce6f3;border-radius:7px;background:#fff;color:#65798e;font-size:9px;white-space:nowrap}
    .enterprise-context-badge-v4.primary{border-color:#bfd5ff;background:var(--primary-soft);color:var(--primary)}
    .enterprise-context-actions-v4{margin-left:auto;display:flex;gap:4px}
    .enterprise-context-action-v4{width:34px;height:34px;display:grid;place-items:center;border:1px solid transparent;border-radius:9px;background:transparent;color:#71849a}
    .enterprise-context-action-v4:hover{border-color:#dce6f2;background:#f8fbff;color:var(--primary)}
    .enterprise-context-action-v4 .icon-stack{width:16px;height:16px}
    .enterprise-panel>.enterprise-filter-pop{top:122px;right:88px}
    .enterprise-file-content{flex:1;min-height:0;align-items:stretch}
    .enterprise-file-content>.table-zone,.enterprise-file-content>.grid-zone{min-height:0}
    .enterprise-file-table{table-layout:fixed}
    .enterprise-file-table td{height:66px}
    .enterprise-file-table th,.enterprise-file-table td{padding-left:12px;padding-right:12px}
    .enterprise-file-table .file-name{gap:11px}
    .enterprise-file-table .file-name-copy{min-width:0}
    .enterprise-file-table .file-entry-link{max-width:100%}
    .enterprise-file-table .file-name-meta{min-height:16px}
    .enterprise-file-table .status-cell{white-space:nowrap}
    .enterprise-file-table tbody tr.selected{background:var(--primary-soft)!important;box-shadow:none!important}
    .enterprise-file-table tbody tr.selected:before,.enterprise-file-table tbody tr.selected:after,.enterprise-file-table tbody tr.selected>td:first-child:before{display:none!important;content:none!important}
    .enterprise-page .enterprise-file-table .file-symbol,.enterprise-page .file-card .file-symbol{width:40px!important;height:40px!important;display:grid!important;place-items:center!important;border:1px solid #dce5ef!important;border-radius:12px!important;background:#fff!important;box-shadow:0 2px 8px rgba(35,68,106,.08),inset 0 1px #fff!important;overflow:hidden!important}
    .enterprise-page .enterprise-file-table .file-symbol-folder-v11 svg,.enterprise-page .file-card .file-symbol-folder-v11 svg{width:29px!important;height:29px!important;display:block!important}
    .enterprise-page .enterprise-file-table .file-symbol iconify-icon,.enterprise-page .file-card .file-symbol iconify-icon{font-size:27px!important}
    .enterprise-page .file-symbol.zip>.online-file-icon{width:28px!important;height:28px!important;font-size:28px!important;align-items:center!important;justify-content:center!important;transform:none!important}
    .enterprise-activity-v4{display:flex;align-items:center;gap:7px;min-width:0;color:#65798e}
    .enterprise-activity-v4 .icon-stack{width:15px;height:15px;color:#88a0b8}
    .enterprise-activity-v4 span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .enterprise-tag-static{cursor:default!important}
    .enterprise-tag-static:hover{transform:none!important;box-shadow:0 1px 2px rgba(35,68,106,.025)!important;filter:none!important}
    .enterprise-role-v4{height:27px;min-width:72px;padding:0 9px;display:inline-flex;align-items:center;justify-content:center;gap:5px;border:1px solid #c6d9ff;border-radius:8px;background:#f7faff;color:#3972c7;font-size:10px;font-weight:600;white-space:nowrap}
    .enterprise-role-v4 .icon-stack{width:13px;height:13px}
    .enterprise-panel .personal-bulk-wrap{flex:none}
    .enterprise-panel .personal-bulk-menu{width:205px}
    .enterprise-panel .personal-bulk-menu button:disabled{opacity:.42;cursor:not-allowed}
    .enterprise-panel .filter-summary{flex:none}
    .enterprise-panel .personal-pagination{border-radius:0 0 14px 14px}
    .enterprise-detail-role-v4{display:inline-flex;align-items:center;gap:6px;color:var(--primary);font-weight:600}
    @media(max-width:1370px){.enterprise-panel .personal-search{width:300px}.enterprise-context-badges-v4 .enterprise-context-badge-v4:last-child{display:none}}
    @media(max-width:1160px){.enterprise-file-table col.enterprise-activity-col,.enterprise-file-table th:nth-child(3),.enterprise-file-table td:nth-child(3){display:none}.enterprise-panel .personal-search{width:250px}.enterprise-context-badges-v4{display:none}}
  `;
  document.head.appendChild(enterpriseStyle);

  const baseRender=render;
  render=function(){
    baseRender();
    document.body.classList.toggle('enterprise-mode',state.page==='enterprise');
  };

  window.toggleEnterpriseNav=function(){state.enterpriseNavExpanded=!state.enterpriseNavExpanded;render()};
  window.toggleEnterpriseOrg=function(){state.enterpriseOrgExpanded=!state.enterpriseOrgExpanded;render()};
  window.setEnterpriseView=function(view){state.enterpriseView=view;state.enterprisePage=1;state.detail=null;render()};
  window.applyEnterpriseFilter=function(){
    state.enterpriseFilter=document.getElementById('enterpriseFilterType')?.value||'all';
    state.enterpriseTagFilter=document.getElementById('enterpriseFilterTag')?.value||'all';
    state.enterpriseFilterOpen=false;state.enterprisePage=1;state.selected=[];state.detail=null;render();
  };
  window.clearEnterpriseFilter=function(){state.enterpriseFilter='all';state.enterpriseTagFilter='all';state.enterpriseFilterOpen=false;state.enterprisePage=1;state.selected=[];state.detail=null;render()};
  window.goEnterpriseFolder=function(level){state.folder=level<0?[]:state.folder.slice(0,level+1);state.enterprisePage=1;state.selected=[];state.detail=null;state.menu=null;render()};
  window.changeEnterprisePage=function(page){const total=currentFiles('enterprise').length;const pages=Math.max(1,Math.ceil(total/state.enterprisePageSize));state.enterprisePage=Math.min(Math.max(1,page),pages);state.selected=[];state.detail=null;render()};
  window.changeEnterprisePageSize=function(size){state.enterprisePageSize=Number(size)||8;state.enterprisePage=1;state.selected=[];state.detail=null;render()};

  function orderedDepartments(){
    const departments=(depts||[]).filter(dept=>dept!=='集团资料库');
    const preferred=state.enterpriseDefaultDept;
    return departments.sort((a,b)=>a===preferred?-1:b===preferred?1:0);
  }
  function enterpriseItemCount(dept){return (enterpriseFiles[dept]||[]).filter(item=>(item.parent||'')==='').length}

  sidebar=function(){
    const groups=nav.map(group=>{
      const items=group.items.map(([page,iconName,title])=>{
        const active=state.page===page;
        const relatedBadge=page==='related'?'<span class="trail badge blue">3</span>':'';
        const caret=page==='enterprise'&&active?`<span class="enterprise-nav-caret ${state.enterpriseNavExpanded?'':'collapsed'}">${icon('down')}</span>`:'';
        const action=page==='enterprise'&&active?'toggleEnterpriseNav()':`navigate('${page}')`;
        const base=`<button class="nav-item ${active?'active':''}" onclick="${action}">${icon(iconName)}<span>${title}</span>${relatedBadge}${caret}</button>`;
        if(page!=='enterprise'||!active)return base;
        const departments=orderedDepartments();
        const groupRows=departments.map(dept=>`<button class="enterprise-dept-nav-v4 ${state.dept===dept?'active':''}" onclick="changeDept('${dept}')" title="进入${safe(dept)}公共资料库">${icon('folder')}<strong>${safe(dept)}</strong>${dept===state.enterpriseDefaultDept?'<i class="enterprise-default-v4">默认</i>':'<span></span>'}<em class="enterprise-nav-count-v4">${enterpriseItemCount(dept)}项</em></button>`).join('');
        return `${base}<div class="enterprise-org-tree-v4 ${state.enterpriseNavExpanded?'':'collapsed'}"><button class="enterprise-library-root-v4 ${state.dept==='集团资料库'?'active':''}" onclick="changeDept('集团资料库')">${icon('building')}<strong>集团资料库</strong><em class="enterprise-nav-count-v4">${enterpriseItemCount('集团资料库')}项</em></button><div class="enterprise-dept-group-v4"><div class="enterprise-dept-group-head-v4"><button class="enterprise-dept-toggle-v4 ${state.enterpriseOrgExpanded?'':'collapsed'}" onclick="toggleEnterpriseOrg()" title="${state.enterpriseOrgExpanded?'收起':'展开'}部门公共资料库">${icon('down')}</button><span>部门公共资料库</span><small>${departments.length} 个部门</small></div><div class="enterprise-dept-children-v4 ${state.enterpriseOrgExpanded?'':'collapsed'}">${groupRows}</div></div></div>`;
      }).join('');
      return `<div class="nav-title">${group.section}</div>${items}`;
    }).join('');
    return `<aside class="sidebar"><div class="brand"><div class="brand-mark"><iconify-icon icon="solar:cloud-file-bold-duotone" aria-hidden="true" onload="this.parentElement.classList.add('is-loaded')"></iconify-icon><span class="brand-fallback">知</span></div><div class="brand-copy"><strong>智汇云知</strong><span>智能知识库管理平台 · PRO</span></div></div><div class="nav-scroll">${groups}</div><div class="capacity-card"><div class="capacity-head"><strong>个人空间用量</strong><span>31%</span></div><div class="capacity-bar"><i></i></div><div class="capacity-foot">已使用 31.4 GB / 100 GB</div></div></aside>`;
  };

  window.enterpriseTags=function(file){
    const raw=Array.isArray(file?.tags)?file.tags:(file?.tag?[file.tag]:[]);
    return [...new Set(raw.flatMap(value=>String(value).split(/[,，;；]/)).map(value=>value.trim()).filter(Boolean))];
  };
  window.allEnterpriseTags=function(){return [...new Set(Object.values(enterpriseFiles).flatMap(files=>files.flatMap(enterpriseTags)))].sort((a,b)=>a.localeCompare(b,'zh-CN'))};
  window.enterpriseTag=function(file){
    const tags=enterpriseTags(file);
    if(!tags.length)return '<span class="tag-empty">未设置</span>';
    return `<div class="personal-tags">${tags.slice(0,2).map(tag=>`<span class="personal-tag enterprise-tag-static tag-${typeof tagTone==='function'?tagTone(tag):'slate'}">${icon('tag')}<span>${safe(tag)}</span></span>`).join('')}${tags.length>2?`<span class="tag-more" title="${safe(tags.slice(2).join('、'))}">+${tags.length-2}</span>`:''}</div>`;
  };

  const baseCurrentFiles=currentFiles;
  currentFiles=function(space='enterprise'){
    if(space!=='enterprise')return baseCurrentFiles(space);
    const currentPath=state.folder.join('/');
    let files=(enterpriseFiles[state.dept]||[]).filter(item=>(item.parent||'')===currentPath);
    if(state.query)files=files.filter(item=>item.name.toLowerCase().includes(state.query.toLowerCase()));
    if(state.enterpriseFilter!=='all')files=files.filter(item=>state.enterpriseFilter==='folder'?item.type==='folder':state.enterpriseFilter==='document'?['doc','pdf','xls','ppt','md'].includes(item.type):item.type===state.enterpriseFilter);
    if(state.enterpriseTagFilter!=='all')files=files.filter(item=>enterpriseTags(item).includes(state.enterpriseTagFilter));
    return files.slice().sort((a,b)=>{const av=a[state.sort.key]||'',bv=b[state.sort.key]||'';return state.sort.dir==='asc'?String(av).localeCompare(String(bv),'zh-CN'):String(bv).localeCompare(String(av),'zh-CN')});
  };

  changeDept=function(dept){state.dept=dept;state.folder=[];state.query='';state.enterpriseFilter='all';state.enterpriseTagFilter='all';state.enterpriseFilterOpen=false;state.enterprisePage=1;state.selected=[];state.detail=null;state.menu=null;render()};

  const baseOpenFile=openFile;
  openFile=function(id,space){
    if(space!=='enterprise')return baseOpenFile(id,space);
    const file=findFile(id,'enterprise');if(!file)return;
    if(file.type==='folder'){state.folder.push(file.name);state.enterprisePage=1;state.selected=[];state.detail=null;state.menu=null;render()}
    else openModal('preview',{file});
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

  const baseRenameItem=renameItem;
  renameItem=function(id,space){
    if(space!=='enterprise')return baseRenameItem(id,space);
    const file=findFile(id,'enterprise');const value=document.getElementById('renameValue')?.value.trim();
    if(!file||!value)return toast('请输入新的名称','warning');
    if(/[\\/:*?"<>|]/.test(value))return toast('名称包含不支持的字符','warning');
    if(file.type==='folder'){
      const oldPath=[file.parent,file.name].filter(Boolean).join('/');
      const newPath=[file.parent,value].filter(Boolean).join('/');
      (enterpriseFiles[state.dept]||[]).forEach(child=>{const parent=child.parent||'';if(parent===oldPath||parent.startsWith(oldPath+'/'))child.parent=newPath+parent.slice(oldPath.length)});
    }
    file.name=value;file.modified='2026-06-23 14:30';closeModal();toast('名称已更新');render();
  };

  window.enterpriseRowClick=function(event,id){
    if(event.target.closest('button,input'))return;
    if(event.ctrlKey||event.metaKey)state.selected=state.selected.includes(id)?state.selected.filter(item=>item!==id):[...state.selected,id];
    else state.selected=[id];
    state.detail=null;render();
  };

  window.enterpriseBulkControl=function(){
    const count=state.selected.length;const one=count===1;
    return `<div class="personal-bulk-wrap"><button class="btn personal-bulk-trigger" ${count?'':'disabled'} onclick="togglePersonalBulkMenu(event)">${icon('bulk')}<span class="personal-bulk-label">${count?`已选 ${count} 项`:'批量操作'}</span>${icon('down')}</button><div class="personal-bulk-menu" onclick="event.stopPropagation()"><button onclick="closePersonalBulkMenu();toast('已创建 '+state.selected.length+' 项企业文件下载任务')">${icon('download')}<span>下载</span></button><button onclick="closePersonalBulkMenu();openModal('destination',{space:'enterprise',mode:'move'})">${icon('move')}<span>移动到</span></button><button onclick="closePersonalBulkMenu();openModal('destination',{space:'enterprise',mode:'copy'})">${icon('copy')}<span>复制到</span></button><div class="menu-sep"></div><button ${one?'':'disabled'} onclick="const id=state.selected[0];closePersonalBulkMenu();state.detail={id,space:'enterprise'};render()">${icon('info')}<span>属性详情</span></button><div class="menu-sep"></div><button class="danger" onclick="closePersonalBulkMenu();openModal('delete',{space:'enterprise'})">${icon('trash')}<span>删除</span></button></div></div>`;
  };

  window.enterpriseActivity=function(file){return `<div class="enterprise-activity-v4">${icon('user')}<span>${safe(file.owner||'文件管理员')}</span></div>`};
  window.enterpriseRole=function(){return `<span class="enterprise-role-v4">${icon('shield')}操作者</span>`};

  window.enterpriseTable=function(files){
    const rows=files.map(file=>`<tr data-file-id="${file.id}" class="${state.selected.includes(file.id)?'selected':''}" onclick="enterpriseRowClick(event,'${file.id}')" ondblclick="openFile('${file.id}','enterprise')" oncontextmenu="openMenu(event,'${file.id}','enterprise')"><td class="check-col"><input class="check" type="checkbox" ${state.selected.includes(file.id)?'checked':''} onclick="event.stopPropagation();toggleOne('${file.id}',this.checked)"></td><td><div class="file-name">${fileVisual(file)}<div class="file-name-copy"><button class="file-entry-link" onclick="event.stopPropagation();openFile('${file.id}','enterprise')">${safe(file.name)}</button><div class="file-name-meta"><span>${personalFileType(file)}</span></div></div></div></td><td>${enterpriseActivity(file)}</td><td>${enterpriseTag(file)}</td><td>${file.type==='folder'?'—':safe(file.size||'—')}</td><td>${safe(file.modified)}</td><td class="status-cell"><span class="status-dot ${file.status==='正常'?'green':file.status==='受控'?'orange':'red'}"></span>${safe(file.status||'正常')}</td><td class="op-col"><button class="more-btn" aria-label="更多操作" onclick="event.stopPropagation();openMenu(event,'${file.id}','enterprise')">${icon('more')}</button></td></tr>`).join('');
    const ids=JSON.stringify(files.map(item=>item.id)).replace(/"/g,'&quot;');
    return `<table class="file-table personal-file-table enterprise-file-table"><colgroup><col class="personal-check-col"><col class="personal-name-col"><col class="enterprise-activity-col"><col class="personal-tag-col"><col class="personal-size-col"><col class="personal-time-col"><col class="personal-status-col"><col class="personal-op-col"></colgroup><thead><tr><th class="check-col"><input class="check" type="checkbox" ${files.length&&state.selected.length===files.length?'checked':''} onchange="toggleAll(this.checked,${ids})"></th><th><span class="sort-head" onclick="sortBy('name')">名称${sortMark('name')}</span></th><th>最近操作人</th><th>标签</th><th><span class="sort-head" onclick="sortBy('size')">大小${sortMark('size')}</span></th><th><span class="sort-head" onclick="sortBy('modified')">修改时间${sortMark('modified')}</span></th><th>安全状态</th><th class="op-col"></th></tr></thead><tbody>${rows||`<tr><td colspan="8"><div class="empty"><div class="empty-icon">${icon('folder')}</div><strong>当前资料库暂无内容</strong><p>可上传文件或新建文件夹，内容将作为组织资产保存。</p></div></td></tr>`}</tbody></table>`;
  };

  window.enterpriseGrid=function(files){return `<div class="grid-zone"><div class="file-grid">${files.map(file=>`<div data-file-id="${file.id}" class="file-card ${state.selected.includes(file.id)?'selected':''}" onclick="enterpriseRowClick(event,'${file.id}')" ondblclick="openFile('${file.id}','enterprise')" oncontextmenu="openMenu(event,'${file.id}','enterprise')"><input class="check" type="checkbox" ${state.selected.includes(file.id)?'checked':''} onclick="event.stopPropagation();toggleOne('${file.id}',this.checked)"><button class="more-btn" onclick="event.stopPropagation();openMenu(event,'${file.id}','enterprise')">${icon('more')}</button>${fileVisual(file)}<button class="file-card-name file-entry-link" onclick="event.stopPropagation();openFile('${file.id}','enterprise')">${safe(file.name)}</button><div class="file-card-meta"><span>${file.type==='folder'?'文件夹':safe(file.size||'—')}</span><span>${safe((file.modified||'').slice(5,10))}</span></div><div class="file-card-tags">${enterpriseTag(file)}</div><div class="file-card-access">${enterpriseRole()}</div></div>`).join('')}</div></div>`};

  window.enterpriseFilterPop=function(){
    return `<div class="filter-pop enterprise-filter-pop"><div class="filter-title">搜索条件<button class="btn ghost icon-only" onclick="state.enterpriseFilterOpen=false;render()">${icon('x')}</button></div><div class="form-grid"><div class="field"><label>文件类型</label><select class="select" id="enterpriseFilterType"><option value="all" ${state.enterpriseFilter==='all'?'selected':''}>全部类型</option><option value="folder" ${state.enterpriseFilter==='folder'?'selected':''}>文件夹</option><option value="document" ${state.enterpriseFilter==='document'?'selected':''}>文档</option><option value="img" ${state.enterpriseFilter==='img'?'selected':''}>图片</option><option value="zip" ${state.enterpriseFilter==='zip'?'selected':''}>压缩包</option></select></div><div class="field"><label>标签</label><select class="select" id="enterpriseFilterTag"><option value="all">全部标签</option>${allEnterpriseTags().map(tag=>`<option value="${safe(tag)}" ${state.enterpriseTagFilter===tag?'selected':''}>${safe(tag)}</option>`).join('')}</select></div><div class="field"><label>显示方式</label><div class="view-toggle" style="width:74px"><button class="${state.enterpriseView==='list'?'active':''}" onclick="state.enterpriseView='list';render()">${icon('list')}</button><button class="${state.enterpriseView==='grid'?'active':''}" onclick="state.enterpriseView='grid';render()">${icon('grid')}</button></div></div></div><div class="filter-actions"><button class="btn" onclick="clearEnterpriseFilter()">重置</button><button class="btn primary" onclick="applyEnterpriseFilter()">应用</button></div></div>`;
  };

  window.enterpriseLibraryContext=function(total){
    const group=state.dept==='集团资料库';const isDefault=state.dept===state.enterpriseDefaultDept;
    const title=group?'集团资料库':`${state.dept}公共资料库`;
    const subtitle=group?'集团级制度、模板与公共文件，文件归集团所有':`部门组织资产，文件归${state.dept}所有，成员变化不影响文件归属`;
    return `<div class="enterprise-library-context-v4"><div class="enterprise-context-icon-v4">${icon(group?'building':'folder')}</div><div class="enterprise-context-copy-v4"><strong>${safe(title)}</strong><span>${safe(subtitle)}</span></div><div class="enterprise-context-badges-v4">${isDefault?'<span class="enterprise-context-badge-v4 primary">默认部门资料库</span>':''}<span class="enterprise-context-badge-v4">${total} 项内容</span><span class="enterprise-context-badge-v4">当前角色：操作者</span></div><div class="enterprise-context-actions-v4"><button class="enterprise-context-action-v4" onclick="toast('已收藏当前资料库')" title="收藏资料库">${icon('star')}</button><button class="enterprise-context-action-v4" onclick="toast('资料库内容已刷新');render()" title="刷新资料库">${icon('restore')}</button></div></div>`;
  };

  window.enterprisePathbar=function(total){
    const group=state.dept==='集团资料库';
    const base=group?`<button onclick="goEnterpriseFolder(-1)">${icon('building')}企业空间</button><span class="path-sep">/</span><button class="current" onclick="goEnterpriseFolder(-1)">集团资料库</button>`:`<button onclick="goEnterpriseFolder(-1)">${icon('building')}企业空间</button><span class="path-sep">/</span><span>部门公共资料库</span><span class="path-sep">/</span><button class="current" onclick="goEnterpriseFolder(-1)">${safe(state.dept)}</button>`;
    return `<div class="pathbar personal-pathbar enterprise-pathbar">${state.folder.length?`<button class="path-back" onclick="goEnterpriseFolder(${state.folder.length-2})">${icon('arrowLeft')}返回上一级</button><span class="path-divider"></span>`:''}${base}${state.folder.map((name,index)=>`<span class="path-sep">/</span><button class="${index===state.folder.length-1?'current':''}" onclick="goEnterpriseFolder(${index})">${safe(name)}</button>`).join('')}<span class="path-context">${state.folder.length?'当前文件夹':'公共资料库'}</span><span class="count">${total} 项</span></div>`;
  };

  window.enterprisePageFiles=function(files){const pages=Math.max(1,Math.ceil(files.length/state.enterprisePageSize));state.enterprisePage=Math.min(Math.max(1,state.enterprisePage),pages);const start=(state.enterprisePage-1)*state.enterprisePageSize;return files.slice(start,start+state.enterprisePageSize)};
  window.enterprisePagination=function(total){
    const pages=Math.max(1,Math.ceil(total/state.enterprisePageSize));const start=total?(state.enterprisePage-1)*state.enterprisePageSize+1:0;const end=Math.min(total,state.enterprisePage*state.enterprisePageSize);const nums=[];
    for(let page=1;page<=pages;page++)nums.push(`<button class="page-number ${state.enterprisePage===page?'active':''}" onclick="changeEnterprisePage(${page})">${page}</button>`);
    return `<footer class="personal-pagination"><div class="page-summary">共 ${total} 项 · 当前显示 ${start}-${end}</div><div class="page-size"><span>每页</span><select onchange="changeEnterprisePageSize(this.value)"><option value="8" ${state.enterprisePageSize===8?'selected':''}>8 条</option><option value="16" ${state.enterprisePageSize===16?'selected':''}>16 条</option><option value="32" ${state.enterprisePageSize===32?'selected':''}>32 条</option></select></div><div class="page-controls"><button class="page-arrow" ${state.enterprisePage<=1?'disabled':''} onclick="changeEnterprisePage(${state.enterprisePage-1})">${icon('arrowLeft')}</button>${nums.join('')}<button class="page-arrow" ${state.enterprisePage>=pages?'disabled':''} onclick="changeEnterprisePage(${state.enterprisePage+1})">${icon('chevron')}</button></div></footer>`;
  };

  const baseDetailPane=detailPane;
  detailPane=function(){
    if(!state.detail||state.detail.space!=='enterprise')return baseDetailPane();
    const file=findFile(state.detail.id,'enterprise');if(!file)return'';
    const group=state.dept==='集团资料库';
    const path=`企业空间 / ${group?'集团资料库':'部门公共资料库 / '+state.dept}${file.parent?' / '+file.parent:''}`;
    return `<aside class="detail-pane"><div class="detail-head">属性详情<button class="btn ghost icon-only" onclick="state.detail=null;render()">${icon('x')}</button></div><div class="detail-body"><div class="detail-preview">${fileVisual(file)}<strong>${safe(file.name)}</strong><span class="badge ${file.status==='正常'?'green':'orange'}">${safe(file.status||'正常')}</span></div><div class="info-list"><div class="info-row"><span>文件类型</span><span>${personalFileType(file)}</span></div><div class="info-row"><span>所在位置</span><span>${safe(path)}</span></div><div class="info-row"><span>文件大小</span><span>${safe(file.size||'—')}</span></div><div class="info-row"><span>所属资料库</span><span>${safe(group?'集团资料库':state.dept+'公共资料库')}</span></div><div class="info-row"><span>最近操作人</span><span>${safe(file.owner||'文件管理员')}</span></div><div class="info-row"><span>修改时间</span><span>${safe(file.modified)}</span></div><div class="info-row"><span>权限角色</span><span class="enterprise-detail-role-v4">${icon('shield')}操作者</span></div><div class="info-row"><span>权限来源</span><span>${group?'管理员范围':'部门默认权限'}</span></div><div class="info-row"><span>安全状态</span><span>${safe(file.status||'正常')}</span></div></div><div class="detail-section"><div class="detail-section-title"><span>标签</span></div>${enterpriseTag(file)}</div></div></aside>`;
  };

  enterprise=function(){
    const allFiles=currentFiles('enterprise');const files=enterprisePageFiles(allFiles);const filterActive=state.enterpriseFilter!=='all'||state.enterpriseTagFilter!=='all';const content=state.enterpriseView==='grid'?enterpriseGrid(files):enterpriseTable(files);
    const filterSummary=[state.enterpriseFilter!=='all'?(state.enterpriseFilter==='folder'?'文件夹':state.enterpriseFilter==='document'?'文档':state.enterpriseFilter==='img'?'图片':'压缩包'):'',state.enterpriseTagFilter!=='all'?`标签：${state.enterpriseTagFilter}`:''].filter(Boolean).join('、');
    return `${pageHead('企业空间','组织级文件资产按部门公共资料库统一治理','',`<span class="badge blue">${icon('shield')}当前权限：操作者</span>`)}<div class="panel personal-panel enterprise-panel">${enterpriseLibraryContext(allFiles.length)}<div class="personal-toolbar"><button class="btn primary" onclick="startUpload('enterprise')">${icon('upload')}上传文件</button><button class="btn" onclick="openModal('newFolder',{space:'enterprise'})">${icon('folderPlus')}新建文件夹</button>${enterpriseBulkControl()}<div class="search-box personal-search">${icon('search')}<input value="${safe(state.query)}" placeholder="搜索当前资料库" onkeydown="if(event.key==='Enter'){state.query=this.value;state.enterprisePage=1;state.selected=[];state.detail=null;render()}"><button class="btn ghost icon-only" style="width:26px;height:26px" onclick="state.enterpriseFilterOpen=!state.enterpriseFilterOpen;render()" title="筛选条件">${icon('filter')}</button></div><div class="spacer"></div><div class="view-toggle"><button class="${state.enterpriseView==='list'?'active':''}" onclick="setEnterpriseView('list')" title="列表视图">${icon('list')}</button><button class="${state.enterpriseView==='grid'?'active':''}" onclick="setEnterpriseView('grid')" title="网格视图">${icon('grid')}</button></div></div>${state.enterpriseFilterOpen?enterpriseFilterPop():''}${filterActive?`<div class="filter-summary">当前筛选：<span class="filter-chip">${safe(filterSummary)} <b onclick="clearEnterpriseFilter()">×</b></span><button class="btn text" style="margin-left:auto" onclick="clearEnterpriseFilter()">清除筛选</button></div>`:''}${enterprisePathbar(allFiles.length)}<div class="file-content personal-file-content enterprise-file-content">${state.enterpriseView==='list'?`<div class="table-zone">${content}</div>`:content}${detailPane()}</div>${enterprisePagination(allFiles.length)}</div>`;
  };

  render();
})();
