(()=>{
  const closeDialog=()=>document.querySelector('.collab-dialog-layer')?.remove();
  const activeFiles=()=>window.__collabFileStore?.[state.collabDetail]||[];
  const activeMembers=()=>window.__collabMemberStore?.[state.collabDetail]||[];
  const currentSpace=()=>collabs.find(item=>item.id===state.collabDetail);
  const showDialog=(title,body,footer)=>{
    closeDialog();
    const layer=document.createElement('div');
    layer.className='collab-dialog-layer';
    layer.innerHTML=`<section class="collab-dialog"><header><strong>${safe(title)}</strong><button onclick="this.closest('.collab-dialog-layer').remove()">${icon('x')}</button></header><div class="collab-dialog-body">${body}</div><footer>${footer}</footer></section>`;
    layer.addEventListener('click',event=>{if(event.target===layer)layer.remove()});
    document.body.appendChild(layer);
  };

  window.collabRenameFile=id=>{
    document.querySelector('.collab-pop')?.remove();
    const file=activeFiles().find(item=>item.id===id);
    if(!file)return;
    showDialog('重命名',`<label class="field"><span>新名称</span><input class="input" id="collabFileRename" value="${safe(file.name)}"></label>`,`<button class="btn" onclick="this.closest('.collab-dialog-layer').remove()">取消</button><button class="btn primary" onclick="collabSubmitFileRename('${id}')">保存</button>`);
    requestAnimationFrame(()=>document.getElementById('collabFileRename')?.select());
  };

  window.collabSubmitFileRename=id=>{
    const value=document.getElementById('collabFileRename')?.value.trim();
    if(!value)return toast('请输入文件名称','warning');
    const file=activeFiles().find(item=>item.id===id);
    if(!file)return;
    file.name=value;
    file.modified=new Date().toLocaleString('zh-CN',{hour12:false}).replaceAll('/','-');
    const activity=window.__collabActivityStore?.[state.collabDetail];
    if(activity)activity.unshift(['张明远',`重命名了文件为“${value}”`,'刚刚','file']);
    closeDialog();toast('名称已更新');render();
  };

  window.collabMembersDialog=()=>{
    const list=activeMembers();
    const readonly=Boolean(currentSpace()?.archived);
    showDialog('成员管理',`<div class="collab-member-tools"><div class="search-box">${icon('search')}<input id="collabMemberSearch" placeholder="搜索姓名或部门" oninput="collabFilterMembers(this.value)"></div><button class="btn primary" ${readonly?'disabled':''} onclick="collabInviteDialog()">${icon('plus')}邀请成员</button></div><table class="collab-member-table"><thead><tr><th>成员</th><th>部门</th><th>角色</th><th>操作</th></tr></thead><tbody>${list.map(member=>`<tr data-member-key="${safe(`${member[0]} ${member[1]}`)}"><td><i>${safe(member[0].slice(0,1))}</i><b>${safe(member[0])}</b></td><td>${safe(member[1])}</td><td><select class="select" ${member[2]==='群主'||readonly?'disabled':''} onchange="collabChangeRole('${safe(member[0])}',this.value)"><option ${member[2]==='管理员'?'selected':''}>管理员</option><option ${member[2]==='编辑者'?'selected':''}>编辑者</option><option ${member[2]==='下载者'?'selected':''}>下载者</option><option ${member[2]==='预览者'?'selected':''}>预览者</option></select></td><td>${member[2]==='群主'?'<span>创建者</span>':`<button ${readonly?'disabled':''} onclick="collabRemoveMember('${safe(member[0])}')">移除</button>`}</td></tr>`).join('')}</tbody></table>`,`<button class="btn primary" onclick="this.closest('.collab-dialog-layer').remove()">完成</button>`);
    requestAnimationFrame(()=>document.getElementById('collabMemberSearch')?.focus());
  };

  window.collabFilterMembers=value=>{
    const query=value.trim().toLowerCase();
    document.querySelectorAll('.collab-member-table tbody tr').forEach(row=>{
      row.hidden=Boolean(query)&&!row.dataset.memberKey.toLowerCase().includes(query);
    });
  };

  const appendStyle=(key,href)=>{
    if(document.querySelector(`link[data-${key}]`))return;
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href=href;
    link.setAttribute(`data-${key}`,'true');
    document.head.appendChild(link);
  };
  const appendScript=(key,src,onload)=>{
    const existing=document.querySelector(`script[data-${key}]`);
    if(existing){
      if(onload){
        if(key==='collaboration-v2'&&window.__collaborationSpaceV2Loaded)onload();
        else existing.addEventListener('load',onload,{once:true});
      }
      return existing;
    }
    const script=document.createElement('script');
    script.src=src;
    script.setAttribute(`data-${key}`,'true');
    if(onload)script.addEventListener('load',onload,{once:true});
    document.body.appendChild(script);
    return script;
  };

  appendStyle('collaboration-v2','assets/collaboration-space-v2.css?v=1');
  appendStyle('collaboration-v3','assets/collaboration-space-v3.css?v=1');
  appendStyle('collaboration-v3-polish','assets/collaboration-space-v3-polish.css?v=1');
  const loadV3=()=>appendScript('collaboration-v3','assets/collaboration-space-v3.js?v=1');
  appendScript('collaboration-v2','assets/collaboration-space-v2.js?v=1',loadV3);
})();