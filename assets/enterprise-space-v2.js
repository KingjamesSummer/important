/* Enterprise space semantic correction: departments own their public libraries. */
(function(){
  if(window.__enterpriseSpaceV7)return;
  window.__enterpriseSpaceV7=true;
  if(typeof state==='undefined'||typeof render!=='function'||typeof sidebar!=='function'||typeof enterprise!=='function')return;

  const style=document.createElement('style');
  style.id='enterprise-space-v7-style';
  style.textContent=`
    .enterprise-org-v7{margin:5px 8px 14px 24px;padding:2px 0 4px 11px;border-left:1px solid #dfe7f1}
    .enterprise-org-v7.collapsed{display:none}
    .enterprise-org-root-v7,.enterprise-dept-node-v7{width:100%;min-width:0;height:38px;display:grid;grid-template-columns:16px minmax(0,1fr);align-items:center;gap:8px;padding:0 9px;border:0;border-radius:9px;background:transparent;color:#60738a;text-align:left;box-sizing:border-box;transition:.15s ease}
    .enterprise-org-root-v7:hover,.enterprise-dept-node-v7:hover{background:#f5f8fc;color:#315f8d}
    .enterprise-org-root-v7.active,.enterprise-dept-node-v7.active{background:var(--primary-soft);color:var(--primary);font-weight:600}
    .enterprise-org-root-v7 .icon-stack,.enterprise-dept-node-v7 .icon-stack{width:15px;height:15px;flex:none}
    .enterprise-org-root-v7 span,.enterprise-dept-node-v7 span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px}
    .enterprise-dept-list-v7{display:grid;gap:2px;margin-top:3px;padding-left:18px}
    .enterprise-dept-list-v7 .enterprise-dept-list-v7{padding-left:10px}
    .enterprise-dept-node-v7{position:relative}
    .enterprise-dept-node-v7:before{content:"";position:absolute;left:-10px;top:50%;width:8px;border-top:1px solid #dfe7f1}
    .enterprise-dept-node-v7.disabled{opacity:.5;cursor:not-allowed}
    .enterprise-library-context-v7{min-height:60px;display:flex;align-items:center;gap:11px;padding:10px 16px;border-bottom:1px solid #e8eef6;background:#fff}
    .enterprise-context-icon-v7{width:38px;height:38px;display:grid;place-items:center;flex:none;border:1px solid #dce7f5;border-radius:11px;background:#f7faff;color:var(--primary)}
    .enterprise-context-icon-v7 .icon-stack{width:18px;height:18px}
    .enterprise-context-copy-v7{min-width:0}
    .enterprise-context-copy-v7 strong{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#2e4058;font-size:13px;font-weight:680}
    .enterprise-context-copy-v7 span{display:block;margin-top:4px;color:#8898aa;font-size:10px}
    .enterprise-context-meta-v7{display:flex;align-items:center;gap:6px;margin-left:6px}
    .enterprise-context-chip-v7{height:24px;padding:0 8px;display:inline-flex;align-items:center;border:1px solid #dce6f3;border-radius:7px;background:#fff;color:#65798e;font-size:9px;white-space:nowrap}
    .enterprise-context-chip-v7.permission{border-color:#c6d9ff;background:#f7faff;color:#3972c7}
    .enterprise-context-actions-v7{margin-left:auto;display:flex;gap:4px}
    .enterprise-context-action-v7{width:34px;height:34px;display:grid;place-items:center;border:1px solid transparent;border-radius:9px;background:transparent;color:#71849a}
    .enterprise-context-action-v7:hover{border-color:#dce6f2;background:#f8fbff;color:var(--primary)}
    .enterprise-context-action-v7 .icon-stack{width:16px;height:16px}
    .enterprise-page .page-head .page-actions:empty{display:none}
    .enterprise-panel>.enterprise-filter-pop{top:124px!important}
    @media(max-width:1280px){.enterprise-context-meta-v7 .enterprise-context-chip-v7:first-child{display:none}}
    @media(max-width:1080px){.enterprise-context-meta-v7{display:none}}
  `;
  document.head.appendChild(style);

  function hasPublicLibrary(dept){return Object.prototype.hasOwnProperty.call(enterpriseFiles,dept)}
  function departmentNames(){return (depts||[]).filter(dept=>dept!=='集团资料库')}

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
          return `<button class="enterprise-dept-node-v7 ${selected?'active':''} ${enabled?'':'disabled'}" onclick="${click}" title="${safe(dept)}${enabled?'':'（未创建公共资料库）'}">${icon('folder')}<span>${safe(dept)}</span></button>`;
        }).join('');
        return `${base}<div class="enterprise-org-v7 ${state.enterpriseNavExpanded?'':'collapsed'}"><button class="enterprise-org-root-v7 ${state.dept==='集团资料库'?'active':''}" onclick="changeDept('集团资料库')">${icon('building')}<span>集团资料库</span></button><div class="enterprise-dept-list-v7">${departmentRows}</div></div>`;
      }).join('');
      return `<div class="nav-title">${group.section}</div>${items}`;
    }).join('');
    return `<aside class="sidebar"><div class="brand"><div class="brand-mark"><iconify-icon icon="solar:cloud-file-bold-duotone" aria-hidden="true" onload="this.parentElement.classList.add('is-loaded')"></iconify-icon><span class="brand-fallback">知</span></div><div class="brand-copy"><strong>智汇云知</strong><span>智能知识库管理平台 · PRO</span></div></div><div class="nav-scroll">${groups}</div><div class="capacity-card"><div class="capacity-head"><strong>个人空间用量</strong><span>31%</span></div><div class="capacity-bar"><i></i></div><div class="capacity-foot">已使用 31.4 GB / 100 GB</div></div></aside>`;
  };

  window.enterpriseLibraryContext=function(total){
    const group=state.dept==='集团资料库';
    const title=group?'集团资料库':state.dept;
    const subtitle=group?'集团级公共资料与制度文件，文件归集团所有':`部门公共资料库 · 文件归${state.dept}所有，成员变化不影响文件归属`;
    const type=group?'集团资料库':'部门资料库';
    return `<div class="enterprise-library-context-v7"><div class="enterprise-context-icon-v7">${icon(group?'building':'folder')}</div><div class="enterprise-context-copy-v7"><strong>${safe(title)}</strong><span>${safe(subtitle)}</span></div><div class="enterprise-context-meta-v7"><span class="enterprise-context-chip-v7">${type}</span><span class="enterprise-context-chip-v7">${total} 项内容</span><span class="enterprise-context-chip-v7 permission">权限：操作者</span></div><div class="enterprise-context-actions-v7"><button class="enterprise-context-action-v7" onclick="toast('已收藏当前资料库')" title="收藏资料库">${icon('star')}</button><button class="enterprise-context-action-v7" onclick="toast('资料库内容已刷新');render()" title="刷新资料库">${icon('restore')}</button></div></div>`;
  };

  window.enterprisePathbar=function(total){
    const group=state.dept==='集团资料库';
    const base=`<button onclick="goEnterpriseFolder(-1)">${icon('building')}企业空间</button><span class="path-sep">/</span><button class="current" onclick="goEnterpriseFolder(-1)">${safe(group?'集团资料库':state.dept)}</button>`;
    return `<div class="pathbar personal-pathbar enterprise-pathbar">${state.folder.length?`<button class="path-back" onclick="goEnterpriseFolder(${state.folder.length-2})">${icon('arrowLeft')}返回上一级</button><span class="path-divider"></span>`:''}${base}${state.folder.map((name,index)=>`<span class="path-sep">/</span><button class="${index===state.folder.length-1?'current':''}" onclick="goEnterpriseFolder(${index})">${safe(name)}</button>`).join('')}<span class="path-context">${state.folder.length?'当前文件夹':group?'集团资料库':'部门公共资料库'}</span><span class="count">${total} 项</span></div>`;
  };

  const previousDetailPane=detailPane;
  detailPane=function(){
    if(!state.detail||state.detail.space!=='enterprise')return previousDetailPane();
    const file=findFile(state.detail.id,'enterprise');if(!file)return'';
    const group=state.dept==='集团资料库';
    const path=`企业空间 / ${group?'集团资料库':state.dept}${file.parent?' / '+file.parent:''}`;
    return `<aside class="detail-pane"><div class="detail-head">属性详情<button class="btn ghost icon-only" onclick="state.detail=null;render()">${icon('x')}</button></div><div class="detail-body"><div class="detail-preview">${fileVisual(file)}<strong>${safe(file.name)}</strong><span class="badge ${file.status==='正常'?'green':'orange'}">${safe(file.status||'正常')}</span></div><div class="info-list"><div class="info-row"><span>文件类型</span><span>${personalFileType(file)}</span></div><div class="info-row"><span>所在位置</span><span>${safe(path)}</span></div><div class="info-row"><span>文件大小</span><span>${safe(file.size||'—')}</span></div><div class="info-row"><span>所属资料库</span><span>${safe(group?'集团资料库':state.dept+'部门公共资料库')}</span></div><div class="info-row"><span>最近操作人</span><span>${safe(file.owner||'文件管理员')}</span></div><div class="info-row"><span>修改时间</span><span>${safe(file.modified)}</span></div><div class="info-row"><span>权限角色</span><span class="enterprise-detail-role-v4">${icon('shield')}操作者</span></div><div class="info-row"><span>权限来源</span><span>${group?'管理员范围':'部门默认权限'}</span></div><div class="info-row"><span>安全状态</span><span>${safe(file.status||'正常')}</span></div></div><div class="detail-section"><div class="detail-section-title"><span>标签</span></div>${enterpriseTag(file)}</div></div></aside>`;
  };

  enterprise=function(){
    const allFiles=currentFiles('enterprise');
    const files=enterprisePageFiles(allFiles);
    const filterActive=state.enterpriseFilter!=='all'||state.enterpriseTagFilter!=='all';
    const content=state.enterpriseView==='grid'?enterpriseGrid(files):enterpriseTable(files);
    const filterSummary=[state.enterpriseFilter!=='all'?(state.enterpriseFilter==='folder'?'文件夹':state.enterpriseFilter==='document'?'文档':state.enterpriseFilter==='img'?'图片':'压缩包'):'',state.enterpriseTagFilter!=='all'?`标签：${state.enterpriseTagFilter}`:''].filter(Boolean).join('、');
    return `${pageHead('企业空间','统一管理集团资料与各部门组织资产')}<div class="panel personal-panel enterprise-panel">${enterpriseLibraryContext(allFiles.length)}<div class="personal-toolbar"><button class="btn primary" onclick="startUpload('enterprise')">${icon('upload')}上传文件</button><button class="btn" onclick="openModal('newFolder',{space:'enterprise'})">${icon('folderPlus')}新建文件夹</button>${enterpriseBulkControl()}<div class="search-box personal-search">${icon('search')}<input value="${safe(state.query)}" placeholder="搜索当前资料库" onkeydown="if(event.key==='Enter'){state.query=this.value;state.enterprisePage=1;state.selected=[];state.detail=null;render()}"><button class="btn ghost icon-only" style="width:26px;height:26px" onclick="state.enterpriseFilterOpen=!state.enterpriseFilterOpen;render()" title="筛选条件">${icon('filter')}</button></div><div class="spacer"></div><div class="view-toggle"><button class="${state.enterpriseView==='list'?'active':''}" onclick="setEnterpriseView('list')" title="列表视图">${icon('list')}</button><button class="${state.enterpriseView==='grid'?'active':''}" onclick="setEnterpriseView('grid')" title="网格视图">${icon('grid')}</button></div></div>${state.enterpriseFilterOpen?enterpriseFilterPop():''}${filterActive?`<div class="filter-summary">当前筛选：<span class="filter-chip">${safe(filterSummary)} <b onclick="clearEnterpriseFilter()">×</b></span><button class="btn text" style="margin-left:auto" onclick="clearEnterpriseFilter()">清除筛选</button></div>`:''}${enterprisePathbar(allFiles.length)}<div class="file-content personal-file-content enterprise-file-content">${state.enterpriseView==='list'?`<div class="table-zone">${content}</div>`:content}${detailPane()}</div>${enterprisePagination(allFiles.length)}</div>`;
  };

  render();
})();
