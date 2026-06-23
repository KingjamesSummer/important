(()=>{
  if(window.__collaborationSpaceV3Loaded)return;
  window.__collaborationSpaceV3Loaded=true;

  const CURRENT='张明远';
  const COLORS=['sky','orange','violet','green','rose','amber'];
  const COLOR_META={
    sky:{label:'天空蓝',note:'理性、清晰'},
    orange:{label:'暖橙',note:'活力、协作'},
    violet:{label:'柔紫',note:'创意、设计'},
    green:{label:'青绿',note:'稳健、交付'},
    rose:{label:'玫瑰',note:'品牌、内容'},
    amber:{label:'琥珀',note:'计划、运营'}
  };
  const fileStore=window.__collabFileStore||{};
  const memberStore=window.__collabMemberStore||{};
  const activityStore=window.__collabActivityStore||{};
  const activeSpace=()=>collabs.find(item=>item.id===state.collabDetail);
  const files=()=>fileStore[state.collabDetail]||[];
  const members=()=>memberStore[state.collabDetail]||[];
  const folderPath=()=>Array.isArray(state.collabFolder)?state.collabFolder.join('/'):'';
  const writable=()=>!activeSpace()?.archived;

  Object.assign(state,{
    collabNewColor:state.collabNewColor||'sky',
    collabActivityFilter:state.collabActivityFilter||'all',
    collabFileSort:state.collabFileSort||'modified'
  });

  const presets={c1:'sky',c2:'orange',c3:'violet',c4:'green'};
  collabs.forEach((space,index)=>{space.color=space.color||presets[space.id]||COLORS[index%COLORS.length]});

  function personTone(name){
    const tones=['sky','violet','cyan','rose','green','orange','amber'];
    let value=0;
    for(const char of String(name||''))value=(value+char.charCodeAt(0))%tones.length;
    return `tone-${tones[value]}`;
  }

  function spaceColor(space,index=0){return COLORS.includes(space?.color)?space.color:COLORS[index%COLORS.length]}
  function tagTone(tag){
    const text=String(tag||'');
    if(/需求|项目|计划/.test(text))return'blue';
    if(/设计|原型|评审/.test(text))return'purple';
    if(/研发|技术|架构/.test(text))return'slate';
    if(/测试|校验|清单/.test(text))return'cyan';
    if(/重点|交付|汇报/.test(text))return'orange';
    return'gray';
  }
  function typeLabel(file){
    const map={folder:'文件夹',doc:'Word 文档',pdf:'PDF 文档',xls:'Excel 表格',ppt:'演示文稿',img:'图片',md:'Markdown'};
    return map[file.type]||'文件';
  }
  function recentText(file){
    if(file.type==='folder'){
      const prefix=folderPath()?`${folderPath()}/${file.name}`:file.name;
      const count=files().filter(item=>(item.parent||'')===prefix).length;
      return `${count} 项 · ${file.owner||'成员'}维护`;
    }
    return `${file.modified||'—'} · ${file.owner||'成员'}更新`;
  }

  function mountLayer(className,html){
    document.querySelector('.collab-v3-layer')?.remove();
    const layer=document.createElement('div');
    layer.className=`collab-v3-layer ${className||''}`;
    layer.innerHTML=html;
    layer.addEventListener('click',event=>{if(event.target===layer)layer.remove()});
    document.body.appendChild(layer);
    return layer;
  }

  function visibleFiles(){
    let list=files().filter(file=>(file.parent||'')===folderPath());
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
    return `<button class="collab-v3-sort-head ${state.collabFileSort===key?'active':''}" onclick="collabSortFiles('${key}')"><span>${label}</span><span class="sort-arrows"><span class="${state.collabFileSort===key?'on':''}">▲</span><span>▼</span></span></button>`;
  }

  function breadcrumb(count){
    const path=state.collabFolder||[];
    return `<div class="collab-v3-path">
      <div class="collab-v3-path-main">
        ${icon('home')}
        <button onclick="collabGoFolder(-1)">${safe(activeSpace().name)}</button>
        ${path.map((name,index)=>`<span>/</span><button class="${index===path.length-1?'current':''}" onclick="collabGoFolder(${index})">${safe(name)}</button>`).join('')}
      </div>
      <span>${count} 项</span>
    </div>`;
  }

  function selectionBar(){
    if(!state.selected.length)return'';
    return `<div class="collab-v3-selection">
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
    const tag=file.tag||'';
    return `<tr class="${selected?'selected':''}">
      <td class="check-col"><input class="check" type="checkbox" ${selected?'checked':''} onchange="collabToggle('${file.id}')"></td>
      <td class="name-col">
        <button class="collab-v3-file-link" onclick="${file.type==='folder'?`collabOpenFolder('${file.id}')`:`collabPreview('${file.id}')`}">
          ${fileVisual(file)}
          <span class="file-name-copy">
            <span class="file-name-title">${safe(file.name)}</span>
            <span class="file-name-meta"><span>${typeLabel(file)}</span>${file.type==='folder'?'':'<span>·</span>'}${file.type==='folder'?'':`<span>${safe(file.owner||'')}</span>`}</span>
          </span>
        </button>
      </td>
      <td class="activity-col"><span class="collab-v3-recent">${icon('clock')}<span>${safe(recentText(file))}</span></span></td>
      <td class="tag-col">${tag?`<span class="personal-tag tag-${tagTone(tag)}">${icon('tag')} ${safe(tag)}</span>`:'<span class="collab-v3-tag-empty">—</span>'}</td>
      <td class="size-col">${safe(file.size||'—')}</td>
      <td class="time-col">${safe(file.modified||'—')}</td>
      <td class="status-col"><span class="access-pill collab-v3-permission">${icon(file.permission==='预览者'?'eye':file.permission==='下载者'?'download':'edit')}${safe(file.permission||'编辑者')}</span></td>
      <td class="op-col"><button class="more-btn" onclick="collabFileMenu(event,'${file.id}')">${icon('more')}</button></td>
    </tr>`;
  }

  function renderFiles(){
    const list=visibleFiles();
    return `<section class="collab-v3-file-page">
      ${activeSpace().archived?`<div class="collab-v3-readonly">${icon('archive')}该空间已归档，当前仅支持查看、预览和下载。</div>`:''}
      <div class="personal-toolbar collab-v3-file-toolbar">
        <button class="btn primary" ${writable()?'':'disabled'} onclick="collabUploadMenu(event)">${icon('upload')}上传文件${icon('down')}</button>
        <button class="btn" ${writable()?'':'disabled'} onclick="collabNewFolder()">${icon('folderPlus')}新建文件夹</button>
        <div class="spacer"></div>
        <div class="search-box">${icon('search')}<input value="${safe(state.collabFileQuery||'')}" placeholder="搜索当前目录" oninput="collabSearchFiles(this.value)"></div>
      </div>
      ${selectionBar()}
      ${breadcrumb(list.length)}
      <div class="collab-v3-table-zone">
        <table class="file-table personal-file-table collab-v3-file-table">
          <colgroup><col class="check-col"><col class="name-col"><col class="activity-col"><col class="tag-col"><col class="size-col"><col class="time-col"><col class="status-col"><col class="op-col"></colgroup>
          <thead><tr>
            <th class="check-col"><input class="check" type="checkbox" onchange="collabToggleAll()" ${list.length&&list.every(file=>state.selected.includes(file.id))?'checked':''}></th>
            <th class="name-col">${sortHead('name','名称')}</th>
            <th class="activity-col">最近活动</th>
            <th class="tag-col">标签</th>
            <th class="size-col">大小</th>
            <th class="time-col">${sortHead('modified','修改时间')}</th>
            <th class="status-col">我的权限</th>
            <th class="op-col"></th>
          </tr></thead>
          <tbody>${list.map(fileRow).join('')||'<tr><td colspan="8"><div class="collab-v3-empty">当前目录暂无文件</div></td></tr>'}</tbody>
        </table>
      </div>
    </section>`;
  }

  function activityTone(type,index){
    if(type==='member')return'orange';
    if(type==='setting')return'violet';
    return index%2?'cyan':'sky';
  }

  function renderActivity(){
    const all=activityStore[state.collabDetail]||[];
    const filtered=all.filter(item=>state.collabActivityFilter==='all'||item[3]===state.collabActivityFilter);
    const fileCount=all.filter(item=>item[3]==='file').length;
    const memberCount=all.filter(item=>item[3]==='member').length;
    return `<section class="collab-v3-activity-page">
      <div class="collab-v3-summary-grid">
        <article class="tone-sky"><i>${icon('folder')}</i><div><b>${fileCount}</b><span>文件动态</span></div><small>上传、编辑与目录变更</small></article>
        <article class="tone-orange"><i>${icon('users')}</i><div><b>${memberCount}</b><span>成员动态</span></div><small>邀请、移除与角色调整</small></article>
        <article class="tone-violet"><i>${icon('clock')}</i><div><b>${all.length}</b><span>全部记录</span></div><small>空间内的完整操作轨迹</small></article>
      </div>
      <div class="collab-v3-activity-toolbar">
        <div><strong>最近动态</strong><span>按时间倒序展示空间操作</span></div>
        <nav>
          <button class="${state.collabActivityFilter==='all'?'active':''}" onclick="state.collabActivityFilter='all';render()">全部</button>
          <button class="${state.collabActivityFilter==='file'?'active':''}" onclick="state.collabActivityFilter='file';render()">文件</button>
          <button class="${state.collabActivityFilter==='member'?'active':''}" onclick="state.collabActivityFilter='member';render()">成员</button>
        </nav>
      </div>
      <div class="collab-v3-timeline">
        ${filtered.map((item,index)=>{const tone=activityTone(item[3],index);return `<article class="tone-${tone}">
          <i class="collab-v3-timeline-avatar ${personTone(item[0])}">${safe(item[0].slice(0,1))}</i>
          <div><strong>${safe(item[0])}</strong><p>${safe(item[1])}</p><time>${safe(item[2])}</time></div>
          <span>${item[3]==='member'?'成员变更':item[3]==='setting'?'空间设置':'文件操作'}</span>
        </article>`}).join('')||'<div class="collab-v3-empty">暂无相关动态</div>'}
      </div>
    </section>`;
  }

  const roleInfo={
    编辑者:['edit','编辑文件','上传、编辑、移动和分享文件'],
    下载者:['download','下载文件','在线预览、下载与打印文件'],
    预览者:['eye','查看文件','仅查看目录并在线预览文件']
  };

  function renderSettings(){
    const space=activeSpace();
    const role=space.defaultRole||'编辑者';
    return `<section class="collab-v3-settings-page">
      <div class="collab-v3-settings-head"><div><strong>空间设置</strong><span>管理基础信息、默认权限和空间状态</span></div><span class="collab-v3-color-chip color-${spaceColor(space)}"><i></i>${COLOR_META[spaceColor(space)]?.label||'主题色'}</span></div>
      <section class="collab-v3-settings-block">
        <div class="collab-v3-settings-title"><i class="tone-sky">${icon('edit')}</i><div><strong>基本信息</strong><span>空间名称会展示在协作空间首页和面包屑中</span></div></div>
        <div class="collab-v3-settings-form">
          <label class="field"><span>空间名称</span><input class="input" id="settingName" value="${safe(space.name)}"></label>
          <label class="field"><span>空间说明</span><textarea class="textarea" id="settingDesc">${safe(space.desc)}</textarea></label>
        </div>
        <button class="btn primary" onclick="collabSaveSettings()">保存修改</button>
      </section>
      <div class="collab-v3-divider"></div>
      <section class="collab-v3-settings-block">
        <div class="collab-v3-settings-title"><i class="tone-orange">${icon('users')}</i><div><strong>新成员默认权限</strong><span>邀请成员时仍可针对单个成员单独调整</span></div></div>
        <select id="settingRole" hidden><option ${role==='编辑者'?'selected':''}>编辑者</option><option ${role==='下载者'?'selected':''}>下载者</option><option ${role==='预览者'?'selected':''}>预览者</option></select>
        <div class="collab-v3-role-grid">
          ${['编辑者','下载者','预览者'].map((item,index)=>{const info=roleInfo[item];const tone=['sky','orange','violet'][index];return `<button class="tone-${tone} ${role===item?'selected':''}" onclick="collabV3ChooseRole('${item}',this)"><i>${icon(info[0])}</i><span><b>${item}</b><small>${info[2]}</small></span><em>${icon('check')}</em></button>`}).join('')}
        </div>
      </section>
      <div class="collab-v3-divider"></div>
      <section class="collab-v3-settings-block collab-v3-danger-zone">
        <div class="collab-v3-settings-title"><i class="tone-rose">${icon('alert')}</i><div><strong>空间状态</strong><span>归档后空间变为只读，解散后数据将从协作空间中移除</span></div></div>
        <div><button class="btn" onclick="collabToggleArchive('${space.id}')">${space.archived?'恢复空间':'归档空间'}</button><button class="btn danger" onclick="collabDissolve()">解散空间</button></div>
      </section>
    </section>`;
  }

  window.collabV3ChooseRole=(role,button)=>{
    const select=document.getElementById('settingRole');
    if(select)select.value=role;
    document.querySelectorAll('.collab-v3-role-grid button').forEach(item=>item.classList.toggle('selected',item===button));
  };

  function memberSide(){
    return `<aside class="collab-v3-member-side">
      <header><div><strong>空间成员</strong><span>${members().length} 人</span></div><button onclick="collabMembersDialog()">管理</button></header>
      <div>${members().map(member=>`<article><i class="${personTone(member[0])}">${safe(member[0].slice(0,1))}</i><span><b>${safe(member[0])}</b><small>${safe(member[1])}</small></span><em>${safe(member[2])}</em></article>`).join('')}</div>
      <footer><button class="btn" ${writable()?'':'disabled'} onclick="collabInviteDialog()">${icon('plus')}邀请同事加入</button></footer>
    </aside>`;
  }

  window.collabDetailPage=function(){
    const space=activeSpace();
    if(!space){state.collabDetail=null;return collaboration()}
    const self=members().find(member=>member[0]===CURRENT);
    const color=spaceColor(space);
    return `<section class="page collaboration-page collab-detail-v3 color-${color}">
      <div class="collab-v3-workspace">
        <header class="collab-v3-banner">
          <button class="collab-v3-back" onclick="collabBack()">${icon('arrowLeft')}</button>
          <div class="collab-v3-space-icon">${icon(space.archived?'archive':'users')}</div>
          <div class="collab-v3-banner-copy"><h2>${safe(space.name)} ${space.archived?'<span class="badge orange">已归档</span>':''}</h2><p>${safe(space.desc)} · 群主：${safe(space.owner)} · 我的角色：${safe(self?.[2]||space.role)}</p></div>
          <div class="collab-v3-banner-actions"><button class="btn" onclick="collabMembersDialog()">${icon('users')}成员管理</button><button class="btn" ${space.archived?'disabled':''} onclick="collabInviteDialog()">${icon('plus')}邀请成员</button><button class="btn icon-only" onclick="collabSpaceMenu(event,'${space.id}')">${icon('more')}</button></div>
        </header>
        <div class="collab-v3-workspace-body">
          <main class="collab-v3-main">
            <nav class="collab-v3-tabs"><button class="${state.collabDetailTab==='files'?'active':''}" onclick="state.collabDetailTab='files';state.selected=[];render()">文件</button><button class="${state.collabDetailTab==='activity'?'active':''}" onclick="state.collabDetailTab='activity';state.selected=[];render()">动态</button><button class="${state.collabDetailTab==='settings'?'active':''}" onclick="state.collabDetailTab='settings';state.selected=[];render()">空间设置</button></nav>
            ${state.collabDetailTab==='files'?renderFiles():state.collabDetailTab==='activity'?renderActivity():renderSettings()}
          </main>
          ${memberSide()}
        </div>
      </div>
    </section>`;
  };

  function homeCard(space,index){
    const color=spaceColor(space,index);
    const spaceMembers=(memberStore[space.id]||[]).slice(0,4);
    return `<article class="collab-v3-space-card color-${color}" onclick="collabOpen('${space.id}')">
      <div class="collab-v3-card-head"><div class="collab-v3-card-icon">${icon(space.archived?'archive':'users')}</div><div><strong>${safe(space.name)}</strong><p>${safe(space.desc)}</p></div><button onclick="event.stopPropagation();collabSpaceMenu(event,'${space.id}')">${icon('more')}</button></div>
      <div class="collab-v3-card-tags"><span class="badge blue">${safe(space.role)}</span>${(space.tags||[]).slice(0,2).map(tag=>`<span>${safe(tag)}</span>`).join('')}</div>
      <div class="collab-v3-card-foot"><div class="collab-v3-avatar-stack">${spaceMembers.map(member=>`<i class="${personTone(member[0])}">${safe(member[0].slice(0,1))}</i>`).join('')}</div><span>${icon('users')} ${(memberStore[space.id]||[]).length||1} 人</span><span>${icon('folder')} ${(fileStore[space.id]||[]).filter(file=>(file.parent||'')==='').length} 项</span><span>${icon('clock')} ${safe(space.updated)}</span><b>进入空间 ${icon('chevron')}</b></div>
    </article>`;
  }

  window.collaboration=function(){
    if(state.collabDetail)return collabDetailPage();
    const query=(state.collabListQuery||'').trim().toLowerCase();
    const list=collabs.filter(space=>{
      const tabMatch=state.collabTab==='archived'?space.archived:!space.archived&&(state.collabTab==='all'||state.collabTab==='created'&&space.owner===CURRENT||state.collabTab==='joined'&&space.owner!==CURRENT);
      return tabMatch&&(!query||`${space.name} ${space.desc} ${(space.tags||[]).join(' ')}`.toLowerCase().includes(query));
    });
    return `<section class="page collaboration-page collab-home-v3">${pageHead('协作空间','面向项目和跨部门团队的群组协作文件空间',`<button class="btn primary" onclick="collabCreateSpace()">${icon('plus')}新建协作空间</button>`)}<div class="collab-v3-home-toolbar"><div class="tabs"><button class="tab ${state.collabTab==='all'?'active':''}" onclick="collabSetTab('all')">全部</button><button class="tab ${state.collabTab==='created'?'active':''}" onclick="collabSetTab('created')">我创建的</button><button class="tab ${state.collabTab==='joined'?'active':''}" onclick="collabSetTab('joined')">我加入的</button><button class="tab ${state.collabTab==='archived'?'active':''}" onclick="collabSetTab('archived')">已归档</button></div><div class="search-box">${icon('search')}<input value="${safe(state.collabListQuery||'')}" placeholder="搜索空间名称、说明或标签" oninput="collabSearchSpaces(this.value)"></div></div><div class="collab-v3-home-meta"><span>共 ${list.length} 个协作空间</span><span>颜色用于区分项目，不改变系统主题</span></div><div class="collab-v3-space-grid">${list.map(homeCard).join('')||'<div class="collab-v3-empty"><strong>没有找到协作空间</strong><p>调整筛选条件，或新建一个空间。</p></div>'}</div></section>`;
  };

  function createModal(){
    const color=state.collabNewColor||'sky';
    return `<section class="collab-v3-modal collab-v3-create-modal">
      <header><div><strong>新建协作空间</strong><span>创建团队文件空间，并选择便于识别的卡片颜色</span></div><button onclick="this.closest('.collab-v3-layer').remove()">${icon('x')}</button></header>
      <div class="collab-v3-create-body">
        <div class="collab-v3-create-form">
          <label class="field"><span>空间名称 *</span><input class="input" id="newCollabName" placeholder="例如：智能知识库二期项目" oninput="collabV3UpdatePreview()"></label>
          <label class="field"><span>空间说明</span><textarea class="textarea" id="newCollabDesc" placeholder="说明协作目标和资料范围" oninput="collabV3UpdatePreview()"></textarea></label>
          <label class="field"><span>默认成员角色</span><select class="select" id="newCollabRole"><option>编辑者</option><option>下载者</option><option>预览者</option></select></label>
          <div class="collab-v3-color-field"><span>卡片颜色</span><div>${COLORS.map(item=>`<button class="color-${item} ${color===item?'selected':''}" title="${COLOR_META[item].label}" onclick="collabV3SelectColor('${item}',this)"><i></i><span>${COLOR_META[item].label}</span><em>${icon('check')}</em></button>`).join('')}</div><small>仅用于空间卡片、图标和少量强调元素</small></div>
        </div>
        <aside class="collab-v3-preview color-${color}" id="collabCreatePreview"><span>卡片预览</span><article><div class="collab-v3-preview-icon">${icon('users')}</div><strong id="collabPreviewName">未命名协作空间</strong><p id="collabPreviewDesc">团队协作文件空间。</p><footer><span class="badge blue">群主</span><b>${COLOR_META[color].label}</b></footer></article></aside>
      </div>
      <footer><button class="btn" onclick="this.closest('.collab-v3-layer').remove()">取消</button><button class="btn primary" onclick="collabSubmitSpaceV3()">创建空间</button></footer>
    </section>`;
  }

  window.collabCreateSpace=()=>{state.collabNewColor='sky';mountLayer('collab-v3-create-layer',createModal());requestAnimationFrame(()=>document.getElementById('newCollabName')?.focus())};
  window.collabV3SelectColor=(color,button)=>{
    state.collabNewColor=color;
    document.querySelectorAll('.collab-v3-color-field button').forEach(item=>item.classList.toggle('selected',item===button));
    const preview=document.getElementById('collabCreatePreview');
    if(preview){preview.className=`collab-v3-preview color-${color}`;preview.querySelector('footer b').textContent=COLOR_META[color].label}
  };
  window.collabV3UpdatePreview=()=>{
    const name=document.getElementById('newCollabName')?.value.trim();
    const desc=document.getElementById('newCollabDesc')?.value.trim();
    const nameNode=document.getElementById('collabPreviewName');
    const descNode=document.getElementById('collabPreviewDesc');
    if(nameNode)nameNode.textContent=name||'未命名协作空间';
    if(descNode)descNode.textContent=desc||'团队协作文件空间。';
  };
  window.collabSubmitSpaceV3=()=>{
    const name=document.getElementById('newCollabName')?.value.trim();
    if(!name)return toast('请输入空间名称','warning');
    const id=`c${Date.now()}`;
    const role=document.getElementById('newCollabRole')?.value||'编辑者';
    const desc=document.getElementById('newCollabDesc')?.value.trim()||'团队协作文件空间。';
    collabs.unshift({id,name,desc,role:'群主',owner:CURRENT,members:['张'],more:0,files:0,updated:'刚刚',tags:['新建'],archived:false,defaultRole:role,color:state.collabNewColor});
    fileStore[id]=[];
    memberStore[id]=[[CURRENT,'研发中心','群主']];
    activityStore[id]=[[CURRENT,'创建了协作空间','刚刚','setting']];
    document.querySelector('.collab-v3-layer')?.remove();
    toast('协作空间创建成功');
    render();
  };

  if(state.page==='collaboration')render();
})();