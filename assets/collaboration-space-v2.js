(()=>{
  if(window.__collaborationSpaceV2Loaded)return;
  window.__collaborationSpaceV2Loaded=true;

  const CURRENT='张明远';
  const toneNames=['sky','orange','violet','green','rose','amber','cyan'];
  const toneOf=name=>{
    let sum=0;
    for(const ch of String(name||''))sum=(sum+ch.charCodeAt(0))%toneNames.length;
    return `tone-${toneNames[sum]}`;
  };
  const activeSpace=()=>collabs.find(item=>item.id===state.collabDetail);
  const fileStore=window.__collabFileStore||{};
  const memberStore=window.__collabMemberStore||{};
  const activityStore=window.__collabActivityStore||{};
  const spaceFiles=()=>fileStore[state.collabDetail]||[];
  const spaceMembers=()=>memberStore[state.collabDetail]||[];
  const currentPath=()=>Array.isArray(state.collabFolder)?state.collabFolder.join('/'):'';
  const writable=()=>!activeSpace()?.archived;

  Object.assign(state,{
    collabListQuery:state.collabListQuery||'',
    collabFileQuery:state.collabFileQuery||'',
    collabFolder:Array.isArray(state.collabFolder)?state.collabFolder:[],
    collabFileSort:state.collabFileSort||'modified',
    collabActivityFilter:state.collabActivityFilter||'all',
    collabInviteDept:state.collabInviteDept||'全部成员',
    collabInviteSearch:state.collabInviteSearch||'',
    collabInviteSelected:Array.isArray(state.collabInviteSelected)?state.collabInviteSelected:[],
    collabInviteRole:state.collabInviteRole||'编辑者'
  });

  const directory=[
    {name:'周凯',title:'技术架构',dept:'研发中心'},
    {name:'刘浩',title:'技术开发岗',dept:'研发中心'},
    {name:'许欣',title:'产品设计',dept:'产品设计部'},
    {name:'赵敏',title:'测试工程师',dept:'质量保障部'},
    {name:'李晓华',title:'管理员',dept:'综合管理部'},
    {name:'王璐',title:'综合事务',dept:'综合管理部'},
    {name:'唐楠',title:'运营专员',dept:'运营管理部'},
    {name:'罗毅',title:'规划经理',dept:'运营管理部'},
    {name:'陈洁',title:'财务经理',dept:'综合管理部'},
    {name:'何勇',title:'预算专员',dept:'综合管理部'}
  ];

  const departments=['全部成员','研发中心','产品设计部','质量保障部','综合管理部','运营管理部'];

  function mountLayer(className,html){
    document.querySelector('.collab-v2-layer')?.remove();
    const layer=document.createElement('div');
    layer.className=`collab-v2-layer ${className||''}`;
    layer.innerHTML=html;
    layer.addEventListener('click',event=>{if(event.target===layer)layer.remove()});
    document.body.appendChild(layer);
    return layer;
  }

  function openPop(event,items){
    document.querySelector('.collab-v2-pop')?.remove();
    const pop=document.createElement('div');
    pop.className='collab-v2-pop';
    pop.innerHTML=items;
    document.body.appendChild(pop);
    const rect=event.currentTarget.getBoundingClientRect();
    pop.style.left=`${Math.min(innerWidth-198,Math.max(12,rect.right-184))}px`;
    pop.style.top=`${Math.min(innerHeight-pop.offsetHeight-12,rect.bottom+6)}px`;
    setTimeout(()=>document.addEventListener('click',()=>pop.remove(),{once:true}),0);
  }

  function memberCount(space){
    return (memberStore[space.id]||[]).length||(space.members?.length||0)+(space.more||0);
  }

  function spaceTone(index){return toneNames[index%toneNames.length]}

  function spaceCard(space,index){
    const members=(memberStore[space.id]||[]).slice(0,4);
    return `<article class="collab-v2-space-card space-tone-${spaceTone(index)}" onclick="collabOpen('${space.id}')">
      <div class="collab-v2-space-card-head">
        <div class="collab-v2-space-icon">${icon(space.archived?'archive':'users')}</div>
        <div class="collab-v2-space-copy">
          <strong>${safe(space.name)}</strong>
          <p>${safe(space.desc)}</p>
        </div>
        <button class="collab-v2-icon-button" onclick="event.stopPropagation();collabSpaceMenu(event,'${space.id}')">${icon('more')}</button>
      </div>
      <div class="collab-v2-space-tags">
        <span class="badge blue">${safe(space.role)}</span>
        ${(space.tags||[]).slice(0,2).map(tag=>`<span class="collab-v2-soft-tag">${safe(tag)}</span>`).join('')}
      </div>
      <div class="collab-v2-space-footer">
        <div class="collab-v2-mini-avatars">${members.map(member=>`<i class="${toneOf(member[0])}">${safe(member[0].slice(0,1))}</i>`).join('')}</div>
        <span>${icon('users')} ${memberCount(space)} 人</span>
        <span>${icon('folder')} ${(fileStore[space.id]||[]).filter(file=>(file.parent||'')==='').length} 项</span>
        <span>${icon('clock')} ${safe(space.updated)}</span>
        <b>进入空间 ${icon('chevron')}</b>
      </div>
    </article>`;
  }

  window.collaboration=function(){
    if(state.collabDetail)return collabDetailPage();
    const query=(state.collabListQuery||'').trim().toLowerCase();
    const list=collabs.filter(space=>{
      const tabMatch=state.collabTab==='archived'
        ?space.archived
        :!space.archived&&(state.collabTab==='all'||state.collabTab==='created'&&space.owner===CURRENT||state.collabTab==='joined'&&space.owner!==CURRENT);
      const searchMatch=!query||`${space.name} ${space.desc} ${(space.tags||[]).join(' ')}`.toLowerCase().includes(query);
      return tabMatch&&searchMatch;
    });
    return `<section class="page collaboration-page collab-home-v2">
      ${pageHead('协作空间','面向项目和跨部门团队的群组协作文件空间',`<button class="btn primary" onclick="collabCreateSpace()">${icon('plus')}新建协作空间</button>`)}
      <div class="collab-v2-home-toolbar">
        <div class="tabs">
          <button class="tab ${state.collabTab==='all'?'active':''}" onclick="collabSetTab('all')">全部</button>
          <button class="tab ${state.collabTab==='created'?'active':''}" onclick="collabSetTab('created')">我创建的</button>
          <button class="tab ${state.collabTab==='joined'?'active':''}" onclick="collabSetTab('joined')">我加入的</button>
          <button class="tab ${state.collabTab==='archived'?'active':''}" onclick="collabSetTab('archived')">已归档</button>
        </div>
        <div class="search-box">${icon('search')}<input value="${safe(state.collabListQuery)}" placeholder="搜索空间名称、说明或标签" oninput="collabSearchSpaces(this.value)"></div>
      </div>
      <div class="collab-v2-home-meta"><span>共 ${list.length} 个协作空间</span><span>按最近更新排列</span></div>
      <div class="collab-v2-space-grid">${list.map(spaceCard).join('')||'<div class="collab-v2-empty"><strong>没有找到协作空间</strong><p>调整筛选条件，或新建一个协作空间。</p></div>'}</div>
    </section>`;
  };

  function memberSide(){
    const members=spaceMembers();
    return `<aside class="collab-v2-member-side">
      <header>
        <div><strong>空间成员</strong><span>${members.length} 人</span></div>
        <button onclick="collabMembersDialog()">管理</button>
      </header>
      <div class="collab-v2-member-list">
        ${members.map(member=>`<article>
          <i class="${toneOf(member[0])}">${safe(member[0].slice(0,1))}</i>
          <span><b>${safe(member[0])}</b><small>${safe(member[1])}</small></span>
          <em>${safe(member[2])}</em>
        </article>`).join('')}
      </div>
      <footer><button class="btn" ${writable()?'':'disabled'} onclick="collabInviteDialog()">${icon('plus')}邀请同事加入</button></footer>
    </aside>`;
  }

  window.collabDetailPage=function(){
    const space=activeSpace();
    if(!space){state.collabDetail=null;return collaboration()}
    const self=spaceMembers().find(member=>member[0]===CURRENT);
    return `<section class="page collaboration-page collab-detail-v2">
      <div class="collab-v2-workspace">
        <header class="collab-v2-banner">
          <button class="collab-v2-back" onclick="collabBack()">${icon('arrowLeft')}</button>
          <div class="collab-v2-space-icon tone-sky">${icon(space.archived?'archive':'users')}</div>
          <div class="collab-v2-banner-copy">
            <h2>${safe(space.name)} ${space.archived?'<span class="badge orange">已归档</span>':''}</h2>
            <p>${safe(space.desc)} · 群主：${safe(space.owner)} · 我的角色：${safe(self?.[2]||space.role)}</p>
          </div>
          <div class="collab-v2-banner-actions">
            <button class="btn" onclick="collabMembersDialog()">${icon('users')}成员管理</button>
            <button class="btn" ${space.archived?'disabled':''} onclick="collabInviteDialog()">${icon('plus')}邀请成员</button>
            <button class="btn icon-only" onclick="collabSpaceMenu(event,'${space.id}')">${icon('more')}</button>
          </div>
        </header>
        <div class="collab-v2-workspace-body">
          <main class="collab-v2-main">
            <nav class="collab-v2-tabs">
              <button class="${state.collabDetailTab==='files'?'active':''}" onclick="state.collabDetailTab='files';state.selected=[];render()">文件</button>
              <button class="${state.collabDetailTab==='activity'?'active':''}" onclick="state.collabDetailTab='activity';state.selected=[];render()">动态</button>
              <button class="${state.collabDetailTab==='settings'?'active':''}" onclick="state.collabDetailTab='settings';state.selected=[];render()">空间设置</button>
            </nav>
            ${state.collabDetailTab==='files'?renderFilesPage():state.collabDetailTab==='activity'?renderActivityPage():renderSettingsPage()}
          </main>
          ${memberSide()}
        </div>
      </div>
    </section>`;
  };

  function visibleFiles(){
    let list=spaceFiles().filter(file=>(file.parent||'')===currentPath());
    const query=(state.collabFileQuery||'').trim().toLowerCase();
    if(query)list=list.filter(file=>`${file.name} ${file.owner||''} ${file.tag||''}`.toLowerCase().includes(query));
    return list.slice().sort((a,b)=>{
      if(a.type==='folder'&&b.type!=='folder')return-1;
      if(a.type!=='folder'&&b.type==='folder')return 1;
      if(state.collabFileSort==='name')return a.name.localeCompare(b.name,'zh-CN');
      if(state.collabFileSort==='owner')return (a.owner||'').localeCompare(b.owner||'','zh-CN');
      return (b.modified||'').localeCompare(a.modified||'');
    });
  }

  function sortHead(key,label){
    return `<button class="sort-head ${state.collabFileSort===key?'active':''}" onclick="collabSortFiles('${key}')">${label}<span class="sort-arrows"><span class="${state.collabFileSort===key?'on':''}">▲</span><span>▼</span></span></button>`;
  }

  function breadcrumb(count){
    const parts=state.collabFolder||[];
    return `<div class="collab-v2-path">
      ${parts.length?`<button onclick="collabGoFolder(${parts.length-2})">${icon('arrowLeft')}返回</button><span>/</span>`:''}
      <button onclick="collabGoFolder(-1)">${safe(activeSpace().name)}</button>
      ${parts.map((name,index)=>`<span>/</span><button class="${index===parts.length-1?'current':''}" onclick="collabGoFolder(${index})">${safe(name)}</button>`).join('')}
      <em>${count} 项</em>
    </div>`;
  }

  function selectionBar(){
    if(!state.selected.length)return'';
    return `<div class="collab-v2-selection">
      <b>已选择 ${state.selected.length} 项</b>
      <button onclick="collabBatchDownload()">${icon('download')}下载</button>
      <button onclick="collabBatchCopy()">${icon('copy')}复制</button>
      <button onclick="collabBatchMove()">${icon('move')}移动</button>
      <button class="danger" onclick="collabBatchDelete()">${icon('trash')}删除</button>
      <button class="close" onclick="state.selected=[];render()">${icon('x')}</button>
    </div>`;
  }

  function fileRow(file){
    const selected=state.selected.includes(file.id);
    return `<tr class="${selected?'selected':''}">
      <td class="check-col"><input class="check" type="checkbox" ${selected?'checked':''} onchange="collabToggle('${file.id}')"></td>
      <td class="name-col">
        <button class="file-name collab-v2-file-name" onclick="${file.type==='folder'?`collabOpenFolder('${file.id}')`:`collabPreview('${file.id}')`}">
          ${fileVisual(file)}
          <span class="file-name-copy">
            <span class="file-name-title">${safe(file.name)}</span>
            <span class="file-name-meta">${file.tag?`<span class="badge">${safe(file.tag)}</span>`:''}</span>
          </span>
        </button>
      </td>
      <td class="size-col">${safe(file.size||'—')}</td>
      <td class="owner-col">${safe(file.owner||'—')}</td>
      <td class="time-col">${safe(file.modified||'—')}</td>
      <td class="status-col"><span class="collab-v2-permission">${safe(file.permission||'编辑者')}</span></td>
      <td class="op-col"><button class="more-btn" onclick="collabFileMenu(event,'${file.id}')">${icon('more')}</button></td>
    </tr>`;
  }

  function renderFilesPage(){
    const list=visibleFiles();
    return `<section class="collab-v2-file-page">
      ${activeSpace().archived?`<div class="collab-v2-readonly">${icon('archive')}该空间已归档，当前仅支持查看、预览和下载。</div>`:''}
      <div class="personal-toolbar collab-v2-file-toolbar">
        <button class="btn primary" ${writable()?'':'disabled'} onclick="collabUploadMenu(event)">${icon('upload')}上传${icon('down')}</button>
        <button class="btn" ${writable()?'':'disabled'} onclick="collabNewFolder()">${icon('folderPlus')}新建文件夹</button>
        <div class="spacer"></div>
        <div class="search-box">${icon('search')}<input value="${safe(state.collabFileQuery)}" placeholder="搜索当前目录" oninput="collabSearchFiles(this.value)"></div>
      </div>
      ${selectionBar()}
      ${breadcrumb(list.length)}
      <div class="collab-v2-table-zone">
        <table class="file-table personal-file-table collab-v2-file-table">
          <colgroup><col class="check-col"><col class="name-col"><col class="size-col"><col class="owner-col"><col class="time-col"><col class="status-col"><col class="op-col"></colgroup>
          <thead><tr>
            <th class="check-col"><input class="check" type="checkbox" onchange="collabToggleAll()" ${list.length&&list.every(file=>state.selected.includes(file.id))?'checked':''}></th>
            <th class="name-col">${sortHead('name','名称')}</th>
            <th class="size-col">大小</th>
            <th class="owner-col">${sortHead('owner','创建人')}</th>
            <th class="time-col">${sortHead('modified','修改时间')}</th>
            <th class="status-col">我的权限</th>
            <th class="op-col"></th>
          </tr></thead>
          <tbody>${list.map(fileRow).join('')||'<tr><td colspan="7"><div class="collab-v2-empty-files">当前目录暂无文件</div></td></tr>'}</tbody>
        </table>
      </div>
    </section>`;
  }

  function activityTone(type){
    return type==='member'?'orange':type==='setting'?'violet':'sky';
  }

  function renderActivityPage(){
    const all=activityStore[state.collabDetail]||[];
    const filtered=all.filter(item=>state.collabActivityFilter==='all'||item[3]===state.collabActivityFilter);
    const fileCount=all.filter(item=>item[3]==='file').length;
    const memberCount=all.filter(item=>item[3]==='member').length;
    return `<section class="collab-v2-activity-page">
      <div class="collab-v2-activity-summary">
        <article class="tone-sky"><i>${icon('folder')}</i><span><b>${fileCount}</b><small>文件动态</small></span></article>
        <article class="tone-orange"><i>${icon('users')}</i><span><b>${memberCount}</b><small>成员动态</small></span></article>
        <article class="tone-violet"><i>${icon('clock')}</i><span><b>${all.length}</b><small>全部记录</small></span></article>
      </div>
      <div class="collab-v2-activity-filter">
        <button class="${state.collabActivityFilter==='all'?'active':''}" onclick="state.collabActivityFilter='all';render()">全部</button>
        <button class="${state.collabActivityFilter==='file'?'active':''}" onclick="state.collabActivityFilter='file';render()">文件动态</button>
        <button class="${state.collabActivityFilter==='member'?'active':''}" onclick="state.collabActivityFilter='member';render()">成员动态</button>
      </div>
      <div class="collab-v2-activity-list">
        ${filtered.map(item=>`<article class="tone-${activityTone(item[3])}">
          <i class="collab-v2-activity-avatar ${toneOf(item[0])}">${safe(item[0].slice(0,1))}</i>
          <div><strong>${safe(item[0])}</strong><p>${safe(item[1])}</p><time>${safe(item[2])}</time></div>
          <span class="collab-v2-activity-type">${item[3]==='member'?'成员':item[3]==='setting'?'设置':'文件'}</span>
        </article>`).join('')||'<div class="collab-v2-empty-files">暂无相关动态</div>'}
      </div>
    </section>`;
  }

  const roleDescriptions={
    编辑者:'上传、编辑、移动和分享文件',
    下载者:'在线预览、下载与打印文件',
    预览者:'仅查看目录并在线预览文件'
  };

  function renderSettingsPage(){
    const space=activeSpace();
    const role=space.defaultRole||'编辑者';
    return `<section class="collab-v2-settings-page">
      <div class="collab-v2-settings-section">
        <div class="collab-v2-section-title"><i class="tone-sky">${icon('edit')}</i><div><strong>基本信息</strong><span>维护空间名称和协作说明</span></div></div>
        <div class="collab-v2-settings-form">
          <label class="field"><span>空间名称</span><input class="input" id="settingName" value="${safe(space.name)}"></label>
          <label class="field full"><span>空间说明</span><textarea class="textarea" id="settingDesc">${safe(space.desc)}</textarea></label>
        </div>
        <button class="btn primary" onclick="collabSaveSettings()">保存修改</button>
      </div>
      <div class="collab-v2-settings-divider"></div>
      <div class="collab-v2-settings-section">
        <div class="collab-v2-section-title"><i class="tone-orange">${icon('users')}</i><div><strong>新成员默认权限</strong><span>邀请成员时可单独调整，默认使用下列角色</span></div></div>
        <select id="settingRole" hidden>
          <option ${role==='编辑者'?'selected':''}>编辑者</option>
          <option ${role==='下载者'?'selected':''}>下载者</option>
          <option ${role==='预览者'?'selected':''}>预览者</option>
        </select>
        <div class="collab-v2-role-grid">
          ${['编辑者','下载者','预览者'].map((item,index)=>`<button class="${role===item?'selected':''} tone-${['sky','orange','violet'][index]}" data-role="${item}" onclick="collabV2ChooseRole('${item}',this)"><i>${icon(index===0?'edit':index===1?'download':'eye')}</i><span><b>${item}</b><small>${roleDescriptions[item]}</small></span><em>${icon('check')}</em></button>`).join('')}
        </div>
      </div>
      <div class="collab-v2-settings-divider"></div>
      <div class="collab-v2-settings-section collab-v2-danger-zone">
        <div class="collab-v2-section-title"><i class="tone-rose">${icon('alert')}</i><div><strong>空间状态</strong><span>归档后空间转为只读；解散后空间将被移除</span></div></div>
        <div class="collab-v2-danger-actions">
          <button class="btn" onclick="collabToggleArchive('${space.id}')">${space.archived?'恢复空间':'归档空间'}</button>
          <button class="btn danger" onclick="collabDissolve()">解散空间</button>
        </div>
      </div>
    </section>`;
  }

  window.collabV2ChooseRole=(role,button)=>{
    const select=document.getElementById('settingRole');
    if(select)select.value=role;
    document.querySelectorAll('.collab-v2-role-grid button').forEach(item=>item.classList.toggle('selected',item===button));
  };

  window.collabInviteDialog=function(){
    state.collabInviteDept='全部成员';
    state.collabInviteSearch='';
    state.collabInviteSelected=[];
    state.collabInviteRole=activeSpace()?.defaultRole||'编辑者';
    renderInviteModal();
  };

  function availableDirectory(){
    const existing=new Set(spaceMembers().map(member=>member[0]));
    return directory.filter(person=>!existing.has(person.name));
  }

  function renderInviteModal(){
    const all=availableDirectory();
    const query=(state.collabInviteSearch||'').trim().toLowerCase();
    const visible=all.filter(person=>(state.collabInviteDept==='全部成员'||person.dept===state.collabInviteDept)&&(!query||`${person.name} ${person.title} ${person.dept}`.toLowerCase().includes(query)));
    const selected=state.collabInviteSelected.map(name=>all.find(person=>person.name===name)).filter(Boolean);
    mountLayer('collab-invite-layer',`<section class="collab-v2-modal collab-v2-invite-modal">
      <header><div><strong>邀请成员</strong><span>从组织成员中选择一名或多名成员加入当前协作空间</span></div><button onclick="this.closest('.collab-v2-layer').remove()">${icon('x')}</button></header>
      <div class="collab-v2-invite-body">
        <aside class="collab-v2-org-groups">
          <h4>组织分组</h4>
          ${departments.map(dept=>`<button class="${state.collabInviteDept===dept?'active':''}" onclick="collabInviteSelectDept('${dept}')">${icon(dept==='全部成员'?'users':'building')}<span>${dept}</span><b>${dept==='全部成员'?all.length:all.filter(person=>person.dept===dept).length}</b></button>`).join('')}
        </aside>
        <main class="collab-v2-invite-people">
          <div class="collab-v2-invite-people-head">
            <div><strong>${safe(state.collabInviteDept)}</strong><span>选择成员加入“${safe(activeSpace().name)}”</span></div>
            <div class="search-box">${icon('search')}<input id="collabInviteSearch" value="${safe(state.collabInviteSearch)}" placeholder="搜索姓名、部门或岗位" oninput="collabInviteSearch(this.value)"></div>
          </div>
          <div class="collab-v2-invite-list">
            ${visible.map(person=>`<button class="${state.collabInviteSelected.includes(person.name)?'selected':''}" onclick="collabInviteToggle('${person.name}')">
              <i class="${toneOf(person.name)}">${safe(person.name.slice(0,1))}</i>
              <span><b>${safe(person.name)}</b><small>${safe(person.title)} · ${safe(person.dept)}</small></span>
              <em>${icon('check')}</em>
            </button>`).join('')||'<div class="collab-v2-empty-members">当前分组暂无可邀请成员</div>'}
          </div>
        </main>
      </div>
      <div class="collab-v2-selected-strip">
        <span>已选择</span>
        <div>${selected.map(person=>`<button onclick="collabInviteToggle('${person.name}')"><i class="${toneOf(person.name)}">${safe(person.name.slice(0,1))}</i><span><b>${safe(person.name)}</b><small>${safe(person.dept)}</small></span>${icon('x')}</button>`).join('')||'<em>尚未选择成员</em>'}</div>
      </div>
      <footer>
        <label><span>加入后角色</span><select class="select" onchange="state.collabInviteRole=this.value"><option ${state.collabInviteRole==='编辑者'?'selected':''}>编辑者</option><option ${state.collabInviteRole==='下载者'?'selected':''}>下载者</option><option ${state.collabInviteRole==='预览者'?'selected':''}>预览者</option></select></label>
        <button class="btn" onclick="this.closest('.collab-v2-layer').remove()">取消</button>
        <button class="btn primary" ${selected.length?'':'disabled'} onclick="collabInviteSubmit()">邀请 ${selected.length||''}</button>
      </footer>
    </section>`);
    requestAnimationFrame(()=>{
      const input=document.getElementById('collabInviteSearch');
      if(input&&state.collabInviteSearch){input.focus();input.setSelectionRange(input.value.length,input.value.length)}
    });
  }

  window.collabInviteSelectDept=dept=>{state.collabInviteDept=dept;renderInviteModal()};
  window.collabInviteSearch=value=>{state.collabInviteSearch=value;renderInviteModal()};
  window.collabInviteToggle=name=>{
    state.collabInviteSelected=state.collabInviteSelected.includes(name)?state.collabInviteSelected.filter(item=>item!==name):[...state.collabInviteSelected,name];
    renderInviteModal();
  };
  window.collabInviteSubmit=()=>{
    const candidates=availableDirectory();
    const selected=state.collabInviteSelected.map(name=>candidates.find(person=>person.name===name)).filter(Boolean);
    selected.forEach(person=>spaceMembers().push([person.name,person.dept,state.collabInviteRole]));
    if(selected.length){
      (activityStore[state.collabDetail]||=[]).unshift([CURRENT,`邀请 ${selected.map(person=>person.name).join('、')} 加入空间，角色为${state.collabInviteRole}`,'刚刚','member']);
      document.querySelector('.collab-v2-layer')?.remove();
      toast(`已邀请 ${selected.length} 名成员`);
      render();
    }
  };

  window.collabMembersDialog=function(){
    const members=spaceMembers();
    mountLayer('collab-members-layer',`<section class="collab-v2-modal collab-v2-members-modal">
      <header><div><strong>成员管理</strong><span>${members.length} 名空间成员</span></div><button onclick="this.closest('.collab-v2-layer').remove()">${icon('x')}</button></header>
      <div class="collab-v2-members-tools"><div class="search-box">${icon('search')}<input placeholder="搜索姓名或部门" oninput="collabV2FilterMembers(this.value)"></div><button class="btn primary" ${writable()?'':'disabled'} onclick="collabInviteDialog()">${icon('plus')}邀请成员</button></div>
      <div class="collab-v2-members-table"><div class="head"><span>成员</span><span>部门</span><span>角色</span><span>操作</span></div>${members.map(member=>`<article data-key="${safe(`${member[0]} ${member[1]}`)}"><span><i class="${toneOf(member[0])}">${safe(member[0].slice(0,1))}</i><b>${safe(member[0])}</b></span><span>${safe(member[1])}</span><span><select class="select" ${member[2]==='群主'||!writable()?'disabled':''} onchange="collabChangeRole('${safe(member[0])}',this.value)"><option ${member[2]==='管理员'?'selected':''}>管理员</option><option ${member[2]==='编辑者'?'selected':''}>编辑者</option><option ${member[2]==='下载者'?'selected':''}>下载者</option><option ${member[2]==='预览者'?'selected':''}>预览者</option></select></span><span>${member[2]==='群主'?'<em>创建者</em>':`<button ${writable()?'':'disabled'} onclick="collabRemoveMember('${safe(member[0])}')">移除</button>`}</span></article>`).join('')}</div>
      <footer><button class="btn primary" onclick="this.closest('.collab-v2-layer').remove()">完成</button></footer>
    </section>`);
  };

  window.collabV2FilterMembers=value=>{
    const query=value.trim().toLowerCase();
    document.querySelectorAll('.collab-v2-members-table article').forEach(row=>row.hidden=Boolean(query)&&!row.dataset.key.toLowerCase().includes(query));
  };

  const oldRemoveMember=window.collabRemoveMember;
  window.collabRemoveMember=name=>{
    const list=spaceMembers();
    const index=list.findIndex(member=>member[0]===name);
    if(index>=0)list.splice(index,1);
    (activityStore[state.collabDetail]||=[]).unshift([CURRENT,`移除了成员 ${name}`,'刚刚','member']);
    toast('成员已移除','warning');
    collabMembersDialog();
    render();
  };

  window.collabSpaceMenu=(event,id)=>openPop(event,`<button onclick="collabOpen('${id}')">${icon('external')}进入空间</button><button onclick="collabRenameSpace('${id}')">${icon('edit')}重命名</button><button onclick="collabToggleArchive('${id}')">${icon('archive')}${collabs.find(item=>item.id==='${id}')?.archived?'恢复空间':'归档空间'}</button>`);

  if(state.page==='collaboration')render();
})();