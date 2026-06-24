  collabCard=function(c){
    const memberCount=(membersByCollab[c.id]||[]).length||(c.members?.length||0)+(c.more||0);
    return `<article class="panel collab-card ${c.archived?'archived':''}" onclick="openCollab('${c.id}')">
      <div class="collab-top"><div class="collab-icon">${icon(c.archived?'archive':'users')}</div><div class="collab-main"><div class="collab-name">${safe(c.name)}</div><div class="collab-desc">${safe(c.desc)}</div></div><button class="more-btn collab-more" style="opacity:1" onclick="event.stopPropagation();openCollabMenu(event,'${c.id}')">${icon('more')}</button></div>
      <div class="collab-tags"><span class="badge blue">${safe(c.role)}</span>${(c.tags||[]).slice(0,2).map(tag=>`<span class="badge ${c.archived?'':'green'}">${safe(tag)}</span>`).join('')}</div>
      <div class="collab-card-stats"><div class="collab-card-stat">成员<b>${memberCount} 人</b></div><div class="collab-card-stat">文件<b>${c.files||collabFiles.length} 项</b></div></div>
      <div class="collab-foot"><div class="avatar-stack">${(membersByCollab[c.id]||[]).slice(0,4).map(m=>`<span class="mini-avatar">${safe(m.name.slice(0,1))}</span>`).join('')||c.members.map(x=>`<span class="mini-avatar">${x}</span>`).join('')}</div><span class="meta">${icon('clock')} ${safe(c.updated)}</span><button class="collab-card-enter" onclick="event.stopPropagation();openCollab('${c.id}')">进入空间${icon('chevron')}</button></div>
    </article>`;
  };

  openCollab=function(id){
    state.collabDetail=id;state.collabDetailTab='files';state.collabFolder=[];state.collabQuery='';state.selected=[];state.detail=null;state.menu=null;render();
  };

  collabDetailPage=function(){
    const c=activeCollab(); if(!c){state.collabDetail=null;return collaboration()}
    const memberList=collabMembers(c);
    const currentMember=memberList.find(member=>member.name===currentUser);
    return `<section class="collaboration-page collab-detail-page">
      <div class="panel detail-banner"><button class="back-btn" onclick="state.collabDetail=null;state.selected=[];state.collabFolder=[];render()">${icon('arrowLeft')}</button><div class="collab-icon">${icon(c.archived?'archive':'users')}</div><div class="detail-banner-main"><h2>${safe(c.name)}${c.archived?'<span class="badge orange">只读归档</span>':''}</h2><div class="collab-role-note"><span>${safe(c.desc)}</span><span>·</span><span>群主：${safe(c.owner)}</span><span>·</span><span>我的角色：${safe(currentMember?.role||c.role)}</span></div></div><div class="collab-detail-actions"><button class="btn" onclick="openModal('members',{collab:activeCollab()})">${icon('users')}<span>成员管理</span></button><button class="btn" ${c.archived?'disabled':''} onclick="openModal('invite',{collab:activeCollab()})">${icon('plus')}<span>邀请成员</span></button><button class="btn icon-only" onclick="openCollabMenu(event,'${c.id}')">${icon('more')}</button></div></div>
      <div class="collab-detail-shell"><div class="panel collab-work-panel"><div class="segment-tabs"><button class="${state.collabDetailTab==='files'?'active':''}" onclick="state.collabDetailTab='files';state.selected=[];render()">文件</button><button class="${state.collabDetailTab==='activity'?'active':''}" onclick="state.collabDetailTab='activity';state.selected=[];render()">动态</button><button class="${state.collabDetailTab==='settings'?'active':''}" onclick="state.collabDetailTab='settings';state.selected=[];render()">空间设置</button></div>${state.collabDetailTab==='files'?collabFilesView(c):state.collabDetailTab==='activity'?collabActivity():collabSettings(c)}</div>${collabMemberSide(c)}</div>
    </section>`;
  };

  function collabMemberSide(c){
    const list=collabMembers(c);
    return `<aside class="panel collab-side-panel"><div class="card-head"><div><div class="panel-title">空间成员</div><div class="panel-subtitle">共 ${list.length} 人 · ${list.filter(m=>m.status==='在线').length} 人在线</div></div><button class="btn text right" onclick="openModal('members',{collab:activeCollab()})">管理</button></div><div class="collab-side-members">${list.slice(0,8).map(member=>`<div class="collab-side-member"><div class="person-avatar">${safe(member.name.slice(0,1))}</div><div class="collab-side-member-main"><b>${safe(member.name)}</b><span>${safe(member.dept)} · ${safe(member.status)}</span></div><span class="badge ${member.role==='群主'?'blue':''}">${safe(member.role)}</span></div>`).join('')}</div><div class="collab-side-footer"><button class="btn" ${c.archived?'disabled':''} onclick="openModal('invite',{collab:activeCollab()})">${icon('plus')}邀请同事加入</button></div></aside>`;
  }

  collabFilesView=function(c){
    const files=visibleCollabFiles();
    return `${c.archived?`<div class="collab-readonly">${icon('archive')}该空间已归档，当前仅支持查看、预览和下载。</div>`:''}<div class="collab-file-toolbar"><button class="btn primary" ${!isWritable(c)?'disabled':''} onclick="openModal('collabUpload',{collab:activeCollab()})">${icon('upload')}上传</button><button class="btn" ${!isWritable(c)?'disabled':''} onclick="openModal('newFolder',{space:'collab'})">${icon('folderPlus')}新建文件夹</button><div class="search-box">${icon('search')}<input value="${safe(state.collabQuery||'')}" placeholder="搜索当前文件夹" oninput="setCollabQuery(this.value)"></div><select class="select" onchange="state.collabSort=this.value;render()"><option value="modified">最近修改</option><option value="name">名称排序</option><option value="owner">创建人</option></select><div class="view-toggle"><button class="${state.collabView==='list'?'active':''}" onclick="state.collabView='list';render()">${icon('list')}</button><button class="${state.collabView==='grid'?'active':''}" onclick="state.collabView='grid';render()">${icon('grid')}</button></div></div>${collabSelectionBar(c)}${collabPathbar(c,files.length)}<div class="collab-file-area">${state.collabView==='list'?`<div class="collab-file-table-zone">${collabFileTable(files,c)}</div>`:collabFileGrid(files,c)}</div>`;
  };

  window.setCollabQuery=function(value){state.collabQuery=value;state.selected=[];render()};
  function collabPathbar(c,count){
    return `<div class="collab-file-path">${state.collabFolder.length?`<button onclick="goCollabFolder(${state.collabFolder.length-2})">${icon('arrowLeft')}返回</button><span>/</span>`:''}<button onclick="goCollabFolder(-1)">${safe(c.name)}</button>${state.collabFolder.map((name,index)=>`<span>/</span><button class="${index===state.collabFolder.length-1?'current':''}" onclick="goCollabFolder(${index})">${safe(name)}</button>`).join('')}<span class="count">${count} 项</span></div>`;
  }
  window.goCollabFolder=function(level){state.collabFolder=level<0?[]:state.collabFolder.slice(0,level+1);state.selected=[];state.detail=null;state.collabQuery='';render()};
