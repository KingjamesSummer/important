/* Enterprise space semantic correction: departments own their public libraries. */
(function(){
  if(window.__enterpriseSpaceV8)return;
  window.__enterpriseSpaceV8=true;
  if(typeof state==='undefined'||typeof render!=='function'||typeof sidebar!=='function'||typeof enterprise!=='function')return;

  const style=document.createElement('style');
  style.id='enterprise-space-v8-style';
  style.textContent=`
    .enterprise-org-v7{margin:5px 8px 14px 24px;padding:2px 0 4px 11px;border-left:1px solid #dfe7f1}
    .enterprise-org-v7.collapsed{display:none}
    .enterprise-org-root-v7,.enterprise-dept-node-v7{width:100%;min-width:0;height:38px;display:grid;grid-template-columns:16px minmax(0,1fr);align-items:center;gap:8px;padding:0 9px;border:0;border-radius:9px;background:transparent;color:#60738a;text-align:left;box-sizing:border-box;transition:.15s ease}
    .enterprise-org-root-v7:hover,.enterprise-dept-node-v7:hover{background:#f5f8fc;color:#315f8d}
    .enterprise-org-root-v7.active,.enterprise-dept-node-v7.active{background:var(--primary-soft);color:var(--primary);font-weight:600}
    .enterprise-org-root-v7 .icon-stack{width:15px;height:15px;flex:none}
    .enterprise-dept-node-v7 iconify-icon{font-size:16px;display:inline-flex;align-items:center;justify-content:center;color:#5d8fe8}
    .enterprise-org-root-v7 span,.enterprise-dept-node-v7 span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px}
    .enterprise-dept-list-v7{display:grid;gap:2px;margin-top:3px;padding-left:18px}
    .enterprise-dept-list-v7 .enterprise-dept-list-v7{padding-left:10px}
    .enterprise-dept-node-v7{position:relative}
    .enterprise-dept-node-v7:before{content:"";position:absolute;left:-10px;top:50%;width:8px;border-top:1px solid #dfe7f1}
    .enterprise-dept-node-v7.disabled{opacity:.5;cursor:not-allowed}
    .enterprise-library-context-v7{min-height:60px;display:flex;align-items:center;gap:11px;padding:10px 16px;border-bottom:1px solid #e8eef6;background:#fff}
    .enterprise-context-icon-v7{width:40px;height:40px;display:grid;place-items:center;flex:none;border:1px solid #dce7f5;border-radius:12px;background:#f7faff;color:var(--primary);box-shadow:0 2px 8px rgba(35,68,106,.06)}
    .enterprise-context-icon-v7 iconify-icon{font-size:23px;display:inline-flex;align-items:center;justify-content:center}
    .enterprise-context-copy-v7{min-width:0}
    .enterprise-context-copy-v7 strong{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#2e4058;font-size:13px;font-weight:680}
    .enterprise-context-copy-v7 span{display:block;margin-top:4px;color:#8898aa;font-size:10px}
    .enterprise-context-actions-v7{margin-left:auto;display:flex;gap:4px}
    .enterprise-context-action-v7{width:34px;height:34px;display:grid;place-items:center;border:1px solid transparent;border-radius:9px;background:transparent;color:#71849a}
    .enterprise-context-action-v7:hover{border-color:#dce6f2;background:#f8fbff;color:var(--primary)}
    .enterprise-context-action-v7 .icon-stack{width:16px;height:16px}
    .enterprise-page .page-head .page-actions:empty{display:none}
    .enterprise-panel>.enterprise-filter-pop{top:124px!important}
    .enterprise-file-visual-v8{width:40px;height:40px;display:grid;place-items:center;flex:0 0 40px;border:1px solid #dce5ef;border-radius:12px;background:#fff;box-shadow:0 2px 8px rgba(35,68,106,.08),inset 0 1px #fff;overflow:hidden}
    .enterprise-file-visual-v8 iconify-icon{font-size:28px;display:inline-flex;align-items:center;justify-content:center}
    .enterprise-file-visual-v8.folder{color:#f0a91f}
    .enterprise-file-visual-v8.folder iconify-icon{font-size:29px}
    .enterprise-file-visual-v8.zip{color:#b17b2c}
    .enterprise-file-visual-v8.image{color:#5c91dc}
    .enterprise-permission-note-v8{display:inline-flex;align-items:center;gap:4px;color:#71859b;font-size:9px}
    .enterprise-permission-note-v8 .icon-stack{width:12px;height:12px}
    @media(max-width:1080px){.enterprise-context-copy-v7 span{max-width:520px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}}
  `;
  document.head.appendChild(style);

  function hasPublicLibrary(dept){return Object.prototype.hasOwnProperty.call(enterpriseFiles,dept)}
  function departmentNames(){return (depts||[]).filter(dept=>dept!=='集团资料库')}
  function explicitPermission(file){return file?.permissionRole||file?.permission||file?.role||''}
  function permissionSource(file){return file?.permissionSource||file?.sourceType||''}

  window.enterpriseFileVisual=function(file){
    const map={doc:'vscode-icons:file-type-word',pdf:'vscode-icons:file-type-pdf2',xls:'vscode-icons:file-type-excel',ppt:'vscode-icons:file-type-powerpoint',md:'vscode-icons:file-type-markdown',zip:'material-symbols:folder-zip-rounded',img:'solar:gallery-bold-duotone'};
    if(file.type==='folder')return `<span class="enterprise-file-visual-v8 folder"><iconify-icon icon="solar:folder-bold-duotone" aria-hidden="true"></iconify-icon></span>`;
    const iconName=map[file.type]||'solar:file-bold-duotone';
    const tone=file.type==='zip'?'zip':file.type==='img'?'image':'';
    return `<span class="enterprise-file-visual-v8 ${tone}"><iconify-icon icon="${iconName}" aria-hidden="true"></iconify-icon></span>`;
  };

  window.enterprisePermissionNote=function(file){
    const role=explicitPermission(file);
    if(!role)return'';
    return `<span class="enterprise-permission-note-v8">${icon('shield')}权限：${safe(role)}</span>`;
  };

  sidebar=function(){
    const groups=nav.map(group=>{
      const items=group.items.map(([page,iconName,title])=>{
        const active=state.page===page;
        const relatedBadge=page==='related'?'<span class="trail badge blue">3</span>':'';
        const caret=page==='enterprise'&&active?`<span class="enterprise-nav-caret ${state.enterpriseNavExpanded?'':'collapsed'}">${icon('down')}</span>`:'';
        const action=page==='enterprise'&&active?'toggleEnterpriseNav()':`navigate('${page}')`;
        const base=`<button class="nav-item ${active?'active':''}" onclick="${action}">${icon(iconName)}<span>${title}</span>${relatedBadge}${caret}</button>`;
        if(page!=='enterprise'||!active)return base;
        const departments=departmentNames();
        const departmentRows=departments.map(dept=>{
          const enabled=hasPublicLibrary(dept);
          const selected=state.dept===dept;
          const click=enabled?`changeDept('${dept}')`:`toast('${safe(dept)}尚未创建公共资料库','warning')`;
          return `<button class="enterprise-dept-node-v7 ${selected?'active':''} ${enabled?'':'disabled'}" onclick="${click}" title="${safe(dept)}${enabled?'':'（未创建公共资料库）'}"><iconify-icon icon="solar:folder-security-bold-duotone" aria-hidden="true"></iconify-icon><span>${safe(dept)}</span></button>`;
        }).join('');
        return `${base}<div class="enterprise-org-v7 ${state.enterpriseNavExpanded?'':'collapsed'}"><button class="enterprise-org-root-v7 ${state.dept==='集团资料库'?'active':''}" onclick="changeDept('集团资料库')">${icon('building')}<span>集团资料库</span></button><div class="enterprise-dept-list-v7">${departmentRows}</div></div>`;
      }).join('');
      return `<div class="nav-title">${group.section}</div>${items}`;
    }).join('');
    return `<aside class="sidebar"><div class="brand"><div class="brand-mark"><iconify-icon icon="solar:cloud-file-bold-duotone" aria-hidden="true" onload="this.parentElement.classList.add('is-loaded')"></iconify-icon><span class="brand-fallback">知</span></div><div class="brand-copy"><strong>智汇云知</strong><span>智能知识库管理平台 · PRO</span></div></div><div class="nav-scroll">${groups}</div><div class="capacity-card"><div class="capacity-head"><strong>个人空间用量</strong><span>31%</span></div><div class="capacity-bar"><i></i></div><div class="capacity-foot">已使用 31.4 GB / 100 GB</div></div></aside>`;
  };

  window.enterpriseLibraryContext=function(){
    const group=state.dept==='集团资料库';
    const title=group?'集团资料库':state.dept;
    const subtitle=group?'集团级公共资料与制度文件，文件归集团所有':`部门公共资料库 · 该文件夹绑定${state.dept}，成员权限由部门默认权限、直接授权和继承权限共同决定`;
    return `<div class="enterprise-library-context-v7"><div class="enterprise-context-icon-v7"><iconify-icon icon="${group?'solar:buildings-2-bold-duotone':'solar:folder-security-bold-duotone'}" aria-hidden="true"></iconify-icon></div><div class="enterprise-context-copy-v7"><strong>${safe(title)}</strong><span>${safe(subtitle)}</span></div><div class="enterprise-context-actions-v7"><button class="enterprise-context-action-v7" onclick="toast('已收藏当前资料库')" title="收藏资料库">${icon('star')}</button><button class="enterprise-context-action-v7" onclick="toast('资料库内容已刷新');render()" title="刷新资料库">${icon('restore')}</button></div></div>`;
  };

  window.enterprisePathbar=function(total){
    const group=state.dept==='集团资料库';
    const base=`<button onclick="goEnterpriseFolder(-1)">${icon('building')}企业空间</button><span class="path-sep">/</span><button class="current" onclick="goEnterpriseFolder(-1)">${safe(group?'集团资料库':state.dept)}</button>`;
    return `<div class="pathbar personal-pathbar enterprise-pathbar">${state.folder.length?`<button class="path-back" onclick="goEnterpriseFolder(${state.folder.length-2})">${icon('arrowLeft')}返回上一级</button><span class="path-divider"></span>`:''}${base}${state.folder.map((name,index)=>`<span class="path-sep">/</span><button class="${index===state.folder.length-1?'current':''}" onclick="goEnterpriseFolder(${index})">${safe(name)}</button>`).join('')}<span class="count">${total} 项</span></div>`;
  };

  window.enterpriseTable=function(files){
    const rows=files.map(file=>`<tr data-file-id="${file.id}" class="${state.selected.includes(file.id)?'selected':''}" onclick="enterpriseRowClick(event,'${file.id}')" ondblclick="openFile('${file.id}','enterprise')" oncontextmenu="openMenu(event,'${file.id}','enterprise')"><td class="check-col"><input class="check" type="checkbox" ${state.selected.includes(file.id)?'checked':''} onclick="event.stopPropagation();toggleOne('${file.id}',this.checked)"></td><td><div class="file-name">${enterpriseFileVisual(file)}<div class="file-name-copy"><button class="file-entry-link" onclick="event.stopPropagation();openFile('${file.id}','enterprise')">${safe(file.name)}</button><div class="file-name-meta"><span>${personalFileType(file)}</span>${enterprisePermissionNote(file)}</div></div></div></td><td>${enterpriseActivity(file)}</td><td>${enterpriseTag(file)}</td><td>${file.type==='folder'?'—':safe(file.size||'—')}</td><td>${safe(file.modified)}</td><td class="status-cell"><span class="status-dot ${file.status==='正常'?'green':file.status==='受控'?'orange':'red'}"></span>${safe(file.status||'正常')}</td><td class="op-col"><button class="more-btn" aria-label="更多操作" onclick="event.stopPropagation();openMenu(event,'${file.id}','enterprise')">${icon('more')}</button></td></tr>`).join('');
    const ids=JSON.stringify(files.map(item=>item.id)).replace(/"/g,'&quot;');
    return `<table class="file-table personal-file-table enterprise-file-table"><colgroup><col class="personal-check-col"><col class="personal-name-col"><col class="enterprise-activity-col"><col class="personal-tag-col"><col class="personal-size-col"><col class="personal-time-col"><col class="personal-status-col"><col class="personal-op-col"></colgroup><thead><tr><th class="check-col"><input class="check" type="checkbox" ${files.length&&state.selected.length===files.length?'checked':''} onchange="toggleAll(this.checked,${ids})"></th><th><span class="sort-head" onclick="sortBy('name')">名称${sortMark('name')}</span></th><th>最近操作人</th><th>标签</th><th><span class="sort-head" onclick="sortBy('size')">大小${sortMark('size')}</span></th><th><span class="sort-head" onclick="sortBy('modified')">修改时间${sortMark('modified')}</span></th><th>安全状态</th><th class="op-col"></th></tr></thead><tbody>${rows||`<tr><td colspan="8"><div class="empty"><div class="empty-icon">${icon('folder')}</div><strong>当前资料库暂无内容</strong><p>可上传文件或新建文件夹，内容将作为组织资产保存。</p></div></td></tr>`}</tbody></table>`;
  };

  window.enterpriseGrid=function(files){return `<div class="grid-zone"><div class="file-grid">${files.map(file=>`<div data-file-id="${file.id}" class="file-card ${state.selected.includes(file.id)?'selected':''}" onclick="enterpriseRowClick(event,'${file.id}')" ondblclick="openFile('${file.id}','enterprise')" oncontextmenu="openMenu(event,'${file.id}','enterprise')"><input class="check" type="checkbox" ${state.selected.includes(file.id)?'checked':''} onclick="event.stopPropagation();toggleOne('${file.id}',this.checked)"><button class="more-btn" onclick="event.stopPropagation();openMenu(event,'${file.id}','enterprise')">${icon('more')}</button>${enterpriseFileVisual(file)}<button class="file-card-name file-entry-link" onclick="event.stopPropagation();openFile('${file.id}','enterprise')">${safe(file.name)}</button><div class="file-card-meta"><span>${file.type==='folder'?'文件夹':safe(file.size||'—')}</span><span>${safe((file.modified||'').slice(5,10))}</span></div><div class="file-card-tags">${enterpriseTag(file)}</div>${enterprisePermissionNote(file)?`<div class="file-card-access">${enterprisePermissionNote(file)}</div>`:''}</div>`).join('')}</div></div>`};

  const previousDetailPane=detailPane;
  detailPane=function(){
    if(!state.detail||state.detail.space!=='enterprise')return previousDetailPane();
    const file=findFile(state.detail.id,'enterprise');if(!file)return'';
    const group=state.dept==='集团资料库';
    const path=`企业空间 / ${group?'集团资料库':state.dept}${file.parent?' / '+file.parent:''}`;
    const role=explicitPermission(file)||'继承上级权限';
    const source=permissionSource(file)||'继承自上级文件夹';
    return `<aside class="detail-pane"><div class="detail-head">属性详情<button class="btn ghost icon-only" onclick="state.detail=null;render()">${icon('x')}</button></div><div class="detail-body"><div class="detail-preview">${enterpriseFileVisual(file)}<strong>${safe(file.name)}</strong><span class="badge ${file.status==='正常'?'green':'orange'}">${safe(file.status||'正常')}</span></div><div class="info-list"><div class="info-row"><span>文件类型</span><span>${personalFileType(file)}</span></div><div class="info-row"><span>所在位置</span><span>${safe(path)}</span></div><div class="info-row"><span>文件大小</span><span>${safe(file.size||'—')}</span></div><div class="info-row"><span>所属资料库</span><span>${safe(group?'集团资料库':state.dept+'部门公共资料库')}</span></div><div class="info-row"><span>最近操作人</span><span>${safe(file.owner||'文件管理员')}</span></div><div class="info-row"><span>修改时间</span><span>${safe(file.modified)}</span></div><div class="info-row"><span>当前权限</span><span>${safe(role)}</span></div><div class="info-row"><span>权限来源</span><span>${safe(source)}</span></div><div class="info-row"><span>安全状态</span><span>${safe(file.status||'正常')}</span></div></div><div class="detail-section"><div class="detail-section-title"><span>标签</span></div>${enterpriseTag(file)}</div></div></aside>`;
  };

  enterprise=function(){
    const allFiles=currentFiles('enterprise');
    const files=enterprisePageFiles(allFiles);
    const filterActive=state.enterpriseFilter!=='all'||state.enterpriseTagFilter!=='all';
    const content=state.enterpriseView==='grid'?enterpriseGrid(files):enterpriseTable(files);
    const filterSummary=[state.enterpriseFilter!=='all'?(state.enterpriseFilter==='folder'?'文件夹':state.enterpriseFilter==='document'?'文档':state.enterpriseFilter==='img'?'图片':'压缩包'):'',state.enterpriseTagFilter!=='all'?`标签：${state.enterpriseTagFilter}`:''].filter(Boolean).join('、');
    return `${pageHead('企业空间','统一管理集团资料与各部门组织资产')}<div class="panel personal-panel enterprise-panel">${enterpriseLibraryContext()}<div class="personal-toolbar"><button class="btn primary" onclick="startUpload('enterprise')">${icon('upload')}上传文件</button><button class="btn" onclick="openModal('newFolder',{space:'enterprise'})">${icon('folderPlus')}新建文件夹</button>${enterpriseBulkControl()}<div class="search-box personal-search">${icon('search')}<input value="${safe(state.query)}" placeholder="搜索当前资料库" onkeydown="if(event.key==='Enter'){state.query=this.value;state.enterprisePage=1;state.selected=[];state.detail=null;render()}"><button class="btn ghost icon-only" style="width:26px;height:26px" onclick="state.enterpriseFilterOpen=!state.enterpriseFilterOpen;render()" title="筛选条件">${icon('filter')}</button></div><div class="spacer"></div><div class="view-toggle"><button class="${state.enterpriseView==='list'?'active':''}" onclick="setEnterpriseView('list')" title="列表视图">${icon('list')}</button><button class="${state.enterpriseView==='grid'?'active':''}" onclick="setEnterpriseView('grid')" title="网格视图">${icon('grid')}</button></div></div>${state.enterpriseFilterOpen?enterpriseFilterPop():''}${filterActive?`<div class="filter-summary">当前筛选：<span class="filter-chip">${safe(filterSummary)} <b onclick="clearEnterpriseFilter()">×</b></span><button class="btn text" style="margin-left:auto" onclick="clearEnterpriseFilter()">清除筛选</button></div>`:''}${enterprisePathbar(allFiles.length)}<div class="file-content personal-file-content enterprise-file-content">${state.enterpriseView==='list'?`<div class="table-zone">${content}</div>`:content}${detailPane()}</div>${enterprisePagination(allFiles.length)}</div>`;
  };

  render();
})();
