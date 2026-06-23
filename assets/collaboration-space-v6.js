(()=>{
  if(window.__collaborationSpaceV6Loaded)return;
  window.__collaborationSpaceV6Loaded=true;

  const CURRENT='张明远';
  const PALETTES={
    sky:{label:'天空蓝',main:'#1677ff',soft:'#eaf3ff',fg:'#0f5ed7',line:'#85b7ff'},
    orange:{label:'暖橙',main:'#f07b1f',soft:'#fff1e8',fg:'#b95000',line:'#ffb47a'},
    violet:{label:'柔紫',main:'#7c3aed',soft:'#f2ebff',fg:'#5b21b6',line:'#bfa7ff'},
    green:{label:'青蓝',main:'#0891d1',soft:'#e8f8ff',fg:'#066a96',line:'#7fd4f2'},
    rose:{label:'玫红',main:'#e5484d',soft:'#fff0f1',fg:'#bd2930',line:'#ff9da2'},
    amber:{label:'金黄',main:'#d98900',soft:'#fff7df',fg:'#a46100',line:'#ffc866'}
  };
  const DIRECTORY=[
    {name:'李晓华',title:'管理员',dept:'综合管理部'},
    {name:'唐楠',title:'运营专员',dept:'运营管理部'},
    {name:'罗毅',title:'规划经理',dept:'运营管理部'},
    {name:'陈洁',title:'财务经理',dept:'综合管理部'},
    {name:'何勇',title:'预算专员',dept:'综合管理部'}
  ];
  const TREE=[{
    id:'company',label:'贵安发展集团',children:[{
      id:'headquarters',label:'集团本部',children:[
        {id:'dept-rd',label:'研发中心',dept:'研发中心'},
        {id:'dept-product',label:'产品设计部',dept:'产品设计部'},
        {id:'dept-quality',label:'质量保障部',dept:'质量保障部'},
        {id:'dept-admin',label:'综合管理部',dept:'综合管理部'},
        {id:'dept-operation',label:'运营管理部',dept:'运营管理部'}
      ]
    }]
  }];

  const memberStore=window.__collabMemberStore||{};
  const activityStore=window.__collabActivityStore||{};
  const activeSpace=()=>collabs.find(item=>item.id===state.collabDetail);
  const members=()=>memberStore[state.collabDetail]||[];
  const escapeAttr=value=>safe(value).replaceAll('`','&#96;');
  const toneOf=name=>{
    const tones=['sky','violet','cyan','rose','orange','amber'];
    let value=0;
    for(const char of String(name||''))value=(value+char.charCodeAt(0))%tones.length;
    return `tone-${tones[value]}`;
  };

  const setPreviewColor=color=>{
    const normalized=PALETTES[color]?color:'sky';
    const palette=PALETTES[normalized];
    const preview=document.getElementById('collabCreatePreview');
    if(!preview)return;
    preview.dataset.color=normalized;
    preview.style.setProperty('--preview',palette.main);
    preview.style.setProperty('--preview-soft',palette.soft);
    preview.style.setProperty('--preview-fg',palette.fg);
    preview.style.setProperty('--preview-line',palette.line);
    const label=preview.querySelector('footer b');
    if(label)label.textContent=palette.label;
  };

  const syncColorSelector=()=>{
    const modal=document.querySelector('.collab-v3-create-modal');
    if(!modal)return;
    Object.entries(PALETTES).forEach(([key,palette])=>{
      const button=modal.querySelector(`.collab-v3-color-field .color-${key}`);
      if(!button)return;
      const label=button.querySelector('span');
      if(label)label.textContent=palette.label;
      button.title=palette.label;
      button.style.setProperty('--choice',palette.main);
    });
    const color=PALETTES[state.collabNewColor]?state.collabNewColor:'sky';
    const button=modal.querySelector(`.collab-v3-color-field .color-${color}`)||modal.querySelector('.collab-v3-color-field button');
    if(button)window.collabV3SelectColor(color,button);
  };

  window.collabV3SelectColor=(color,button)=>{
    const normalized=PALETTES[color]?color:'sky';
    state.collabNewColor=normalized;
    document.querySelectorAll('.collab-v3-color-field button').forEach(item=>{
      const selected=item===button||item.classList.contains(`color-${normalized}`);
      item.classList.toggle('selected',selected);
      item.setAttribute('aria-pressed',String(selected));
    });
    setPreviewColor(normalized);
  };

  const originalCreate=window.collabCreateSpace;
  if(typeof originalCreate==='function'){
    window.collabCreateSpace=(...args)=>{
      const result=originalCreate(...args);
      requestAnimationFrame(()=>requestAnimationFrame(syncColorSelector));
      return result;
    };
  }

  const findNode=(id,nodes=TREE)=>{
    for(const node of nodes){
      if(node.id===id)return node;
      if(node.children){const found=findNode(id,node.children);if(found)return found}
    }
    return null;
  };
  const descendantDepartments=node=>{
    if(!node)return[];
    if(node.dept)return[node.dept];
    return(node.children||[]).flatMap(descendantDepartments);
  };
  const availablePeople=()=>{
    const existing=new Set(members().map(member=>member[0]));
    return DIRECTORY.filter(person=>!existing.has(person.name));
  };
  const expanded=()=>new Set(Array.isArray(state.collabInviteExpanded)?state.collabInviteExpanded:['company','headquarters']);
  const isNodeExpanded=id=>expanded().has(id);
  const nodeLabel=id=>id==='all'?'全部成员':findNode(id)?.label||'全部成员';

  const treeNode=(node,depth=0)=>{
    const hasChildren=Boolean(node.children?.length);
    const open=hasChildren&&isNodeExpanded(node.id);
    const active=state.collabInviteNode===node.id;
    return `<div class="collab-v6-tree-node depth-${depth}">
      <button class="collab-v6-tree-row ${active?'active':''}" onclick="collabInviteChooseNode('${node.id}')">
        ${hasChildren?`<span class="collab-v6-tree-toggle ${open?'open':''}" onclick="event.stopPropagation();collabInviteToggleBranch('${node.id}')">${icon('chevron')}</span>`:'<span class="collab-v6-tree-spacer"></span>'}
        ${icon(hasChildren?'building':'folder')}
        <span>${safe(node.label)}</span>
      </button>
      ${open?`<div class="collab-v6-tree-children">${node.children.map(child=>treeNode(child,depth+1)).join('')}</div>`:''}
    </div>`;
  };

  const filteredPeople=()=>{
    const all=availablePeople();
    const current=state.collabInviteNode||'all';
    const node=findNode(current);
    const departments=current==='all'?[]:descendantDepartments(node);
    const query=(state.collabInviteSearch||'').trim().toLowerCase();
    return all.filter(person=>{
      const nodeMatch=current==='all'||departments.includes(person.dept);
      const searchMatch=!query||`${person.name} ${person.title} ${person.dept}`.toLowerCase().includes(query);
      return nodeMatch&&searchMatch;
    });
  };

  const selectedPeople=()=>{
    const names=new Set(Array.isArray(state.collabInviteSelected)?state.collabInviteSelected:[]);
    return availablePeople().filter(person=>names.has(person.name));
  };

  function renderInviteModal(){
    const people=filteredPeople();
    const selected=selectedPeople();
    document.querySelector('.collab-v6-layer')?.remove();
    const layer=document.createElement('div');
    layer.className='collab-v3-layer collab-v6-layer';
    layer.innerHTML=`<section class="collab-v6-invite-modal">
      <header><div><strong>邀请成员</strong><span>从组织架构中选择一名或多名成员加入当前协作空间</span></div><button onclick="this.closest('.collab-v6-layer').remove()">${icon('x')}</button></header>
      <div class="collab-v6-invite-body">
        <aside class="collab-v6-org-tree">
          <h4>组织架构</h4>
          <button class="collab-v6-tree-row root ${state.collabInviteNode==='all'?'active':''}" onclick="collabInviteChooseNode('all')"><span class="collab-v6-tree-spacer"></span>${icon('users')}<span>全部成员</span></button>
          ${TREE.map(node=>treeNode(node)).join('')}
        </aside>
        <main class="collab-v6-people-pane">
          <div class="collab-v6-people-head">
            <div><strong>${safe(nodeLabel(state.collabInviteNode||'all'))}</strong><span>选择成员加入“${safe(activeSpace()?.name||'协作空间')}”</span></div>
            <div class="search-box">${icon('search')}<input id="collabV6Search" value="${escapeAttr(state.collabInviteSearch||'')}" placeholder="搜索姓名、部门或岗位" oninput="collabInviteSearch(this.value)"></div>
          </div>
          <div class="collab-v6-people-list">
            ${people.map(person=>`<button class="${state.collabInviteSelected.includes(person.name)?'selected':''}" onclick="collabInviteToggle('${escapeAttr(person.name)}')">
              <i class="collab-v6-person-avatar ${toneOf(person.name)}">${safe(person.name.slice(0,1))}</i>
              <span><b>${safe(person.name)}</b><small>${safe(person.title)} · ${safe(person.dept)}</small></span>
              <em>${icon('check')}</em>
            </button>`).join('')||'<div class="collab-v6-empty">当前组织节点暂无可邀请成员</div>'}
          </div>
        </main>
      </div>
      <div class="collab-v6-selected-strip">
        <span>已选择成员</span>
        <div>${selected.map(person=>`<button onclick="collabInviteToggle('${escapeAttr(person.name)}')"><i class="collab-v6-person-avatar ${toneOf(person.name)}">${safe(person.name.slice(0,1))}</i><span><b>${safe(person.name)}</b><small>${safe(person.dept)}</small></span>${icon('x')}</button>`).join('')||'<em>尚未选择成员</em>'}</div>
      </div>
      <footer>
        <label><span>加入后角色</span><select class="select" onchange="state.collabInviteRole=this.value"><option ${state.collabInviteRole==='编辑者'?'selected':''}>编辑者</option><option ${state.collabInviteRole==='下载者'?'selected':''}>下载者</option><option ${state.collabInviteRole==='预览者'?'selected':''}>预览者</option></select></label>
        <button class="btn" onclick="this.closest('.collab-v6-layer').remove()">取消</button>
        <button class="btn primary" ${selected.length?'':'disabled'} onclick="collabInviteSubmit()">发送邀请</button>
      </footer>
    </section>`;
    layer.addEventListener('click',event=>{if(event.target===layer)layer.remove()});
    document.body.appendChild(layer);
    requestAnimationFrame(()=>{
      const input=document.getElementById('collabV6Search');
      if(input&&state.collabInviteSearch){input.focus();input.setSelectionRange(input.value.length,input.value.length)}
    });
  }

  window.collabInviteDialog=()=>{
    state.collabInviteNode='all';
    state.collabInviteExpanded=['company','headquarters'];
    state.collabInviteSearch='';
    state.collabInviteSelected=[];
    state.collabInviteRole=activeSpace()?.defaultRole||'编辑者';
    renderInviteModal();
  };
  window.collabInviteChooseNode=id=>{state.collabInviteNode=id;state.collabInviteSearch='';renderInviteModal()};
  window.collabInviteToggleBranch=id=>{
    const set=expanded();
    if(set.has(id))set.delete(id);else set.add(id);
    state.collabInviteExpanded=[...set];
    renderInviteModal();
  };
  window.collabInviteSearch=value=>{state.collabInviteSearch=value;renderInviteModal()};
  window.collabInviteToggle=name=>{
    const current=Array.isArray(state.collabInviteSelected)?state.collabInviteSelected:[];
    state.collabInviteSelected=current.includes(name)?current.filter(item=>item!==name):[...current,name];
    renderInviteModal();
  };
  window.collabInviteSubmit=()=>{
    const chosen=selectedPeople();
    if(!chosen.length)return;
    chosen.forEach(person=>members().push([person.name,person.dept,state.collabInviteRole||'编辑者']));
    (activityStore[state.collabDetail]||=[]).unshift([CURRENT,`邀请 ${chosen.map(person=>person.name).join('、')} 加入空间，角色为${state.collabInviteRole||'编辑者'}`,'刚刚','member']);
    document.querySelector('.collab-v6-layer')?.remove();
    toast('成员邀请已发送');
    render();
  };

  const observer=new MutationObserver(records=>{
    if(records.some(record=>[...record.addedNodes].some(node=>node.nodeType===1&&(node.matches?.('.collab-v3-layer')||node.querySelector?.('.collab-v3-create-modal'))))){
      requestAnimationFrame(syncColorSelector);
    }
  });
  observer.observe(document.body,{childList:true,subtree:true});
  syncColorSelector();
})();