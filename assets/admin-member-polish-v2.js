/* Member management interaction polish — hierarchy, filters and dialog styling. */
(function(){
  if(window.__adminMemberPolishV2)return;
  window.__adminMemberPolishV2=true;

  const hierarchy=[
    {id:'all',label:'全部成员',count:12,level:0,type:'all'},
    {id:'group',label:'贵安发展集团',count:12,level:0,type:'root',children:[
      {id:'general',label:'综合管理部',count:2,level:1},
      {id:'finance',label:'财务管理部',count:1,level:1},
      {id:'investment',label:'投资发展部',count:2,level:1},
      {id:'research',label:'研发中心',count:4,level:1,type:'branch',children:[
        {id:'platform',label:'平台研发组',count:2,level:2},
        {id:'product',label:'产品设计组',count:2,level:2}
      ]},
      {id:'construction',label:'建设管理部',count:1,level:1},
      {id:'operations',label:'运营管理部',count:1,level:1}
    ]},
    {id:'pending',label:'待分配人员池',count:2,level:0,type:'pending'}
  ];

  const state={active:'all',expanded:new Set(['group','research']),query:'',scheduled:false,enhancing:false};
  const esc=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const iconHtml=name=>typeof window.icon==='function'?window.icon(name):'';

  function isMemberPage(){
    return Boolean(window.state&&stateRef().page==='admin'&&stateRef().adminTab==='member');
  }
  function stateRef(){return window.state||{};}

  function schedule(){
    if(state.scheduled)return;
    state.scheduled=true;
    requestAnimationFrame(()=>{
      state.scheduled=false;
      enhance();
    });
  }

  function findTreePanel(){
    const input=[...document.querySelectorAll('input')].find(node=>String(node.placeholder||'').includes('搜索部门'));
    if(!input)return null;
    const aside=input.closest('aside');
    if(aside&&aside.textContent.includes('组织范围'))return aside;
    let node=input.parentElement;
    while(node&&node!==document.body){
      const text=node.textContent||'';
      if(text.includes('组织范围')&&text.includes('待分配人员池'))return node;
      node=node.parentElement;
    }
    return null;
  }

  function findMemberTable(){
    return [...document.querySelectorAll('table')].find(table=>{
      const text=table.tHead?.textContent||table.textContent||'';
      return text.includes('工号')&&text.includes('管理身份')&&text.includes('所属部门');
    })||null;
  }

  function findMemberCard(table){
    if(!table)return null;
    let node=table.parentElement;
    while(node&&node!==document.body){
      const text=node.textContent||'';
      if(text.includes('集团成员')&&text.includes('添加成员')&&text.includes('同步 MDM'))return node;
      node=node.parentElement;
    }
    return table.closest('.panel')||table.parentElement;
  }

  function directTextNode(root,label){
    return [...root.querySelectorAll('span,small,label,div')].find(node=>node.children.length===0&&node.textContent.trim()===label)||null;
  }

  function markStats(root){
    const labels=[
      ['集团成员','stat-total'],
      ['正常账号','stat-normal'],
      ['待分配人员','stat-pending'],
      ['停用账号','stat-disabled']
    ];
    labels.forEach(([label,variant])=>{
      const node=directTextNode(root,label);
      if(!node)return;
      let card=node.parentElement;
      while(card&&card!==root){
        const text=card.textContent||'';
        if(text.includes(label)&&/\d+/.test(text)&&card.getBoundingClientRect().width>140)break;
        card=card.parentElement;
      }
      if(card&&card!==root)card.classList.add('member-polish-stat',variant);
    });
  }

  function nodeIcon(node){
    if(node.type==='all')return iconHtml('users');
    if(node.type==='root')return iconHtml('building');
    if(node.type==='pending')return iconHtml('user');
    return iconHtml('folder');
  }

  function renderNode(node){
    const hasChildren=Array.isArray(node.children)&&node.children.length>0;
    const open=state.expanded.has(node.id);
    const query=state.query.trim().toLowerCase();
    const selfMatch=!query||node.label.toLowerCase().includes(query);
    const childMatch=hasChildren&&node.children.some(child=>child.label.toLowerCase().includes(query)||(child.children||[]).some(grand=>grand.label.toLowerCase().includes(query)));
    if(query&&!selfMatch&&!childMatch)return '';
    const row=`<button type="button" class="member-polish-tree-row level-${node.level} ${state.active===node.id?'active':''}" data-member-tree-id="${node.id}">
      <span class="tree-toggle ${hasChildren?(open?'open':''):'empty'}" data-member-tree-toggle="${node.id}">${hasChildren?iconHtml('chevron'):''}</span>
      <span class="tree-node-icon">${nodeIcon(node)}</span>
      <span class="tree-label">${esc(node.label)}</span>
      <span class="tree-count">${node.count}</span>
    </button>`;
    if(!hasChildren)return row;
    const shouldShow=open||Boolean(query&&childMatch);
    const children=shouldShow?`<div class="member-polish-tree-children level-${node.level+1}">${node.children.map(renderNode).join('')}</div>`:'';
    return row+children;
  }

  function renderTree(panel){
    panel.classList.add('member-polish-tree-panel');
    panel.innerHTML=`<div class="member-polish-tree-head">
      <div class="member-polish-tree-title">${iconHtml('building')}<span>组织架构</span><small>支持多层级</small></div>
      <label class="member-polish-tree-search">${iconHtml('search')}<input id="memberPolishTreeSearch" value="${esc(state.query)}" placeholder="搜索公司、部门或小组"></label>
    </div>
    <div class="member-polish-tree-body">
      ${renderNode(hierarchy[0])}
      <div class="member-polish-tree-divider"></div>
      ${renderNode(hierarchy[1])}
      <div class="member-polish-tree-divider"></div>
      ${renderNode(hierarchy[2])}
      <div class="member-polish-tree-note">部门树按“集团 → 部门 → 小组”展示。成员可属于多个部门，主部门用于默认文件权限与组织统计。</div>
    </div>`;

    panel.querySelector('#memberPolishTreeSearch')?.addEventListener('input',event=>{
      state.query=event.target.value;
      renderTree(panel);
    });
    panel.querySelectorAll('[data-member-tree-toggle]').forEach(toggle=>{
      toggle.addEventListener('click',event=>{
        event.stopPropagation();
        const id=toggle.dataset.memberTreeToggle;
        if(state.expanded.has(id))state.expanded.delete(id);else state.expanded.add(id);
        renderTree(panel);
      });
    });
    panel.querySelectorAll('[data-member-tree-id]').forEach(button=>{
      button.addEventListener('click',()=>{
        const id=button.dataset.memberTreeId;
        if(id==='group'){
          if(state.expanded.has('group'))state.expanded.delete('group');else state.expanded.add('group');
          state.active='all';
        }else if(id==='research'&&button.querySelector('.tree-toggle:not(.empty)')&&state.active==='research'){
          if(state.expanded.has('research'))state.expanded.delete('research');else state.expanded.add('research');
        }else{
          state.active=id;
        }
        renderTree(panel);
        applyDepartmentFilter();
      });
    });
  }

  function rowMatches(row,id){
    const text=(row.textContent||'').replace(/\s+/g,' ');
    if(id==='all'||id==='group')return true;
    if(id==='pending')return /待分配|未分配|人员池/.test(text);
    if(id==='platform')return /研发中心/.test(text)&&/技术|开发|平台/.test(text);
    if(id==='product')return /研发中心/.test(text)&&/产品|设计/.test(text);
    const map={general:'综合管理部',finance:'财务管理部',investment:'投资发展部',research:'研发中心',construction:'建设管理部',operations:'运营管理部'};
    return map[id]?text.includes(map[id]):true;
  }

  function labelFor(id){
    const flat=[];
    const walk=nodes=>nodes.forEach(node=>{flat.push(node);if(node.children)walk(node.children);});
    walk(hierarchy);
    return flat.find(node=>node.id===id)?.label||'全部成员';
  }

  function applyDepartmentFilter(){
    const table=findMemberTable();
    if(!table||!table.tBodies.length)return;
    const body=table.tBodies[0];
    body.querySelector('.member-polish-empty-row')?.remove();
    const rows=[...body.rows].filter(row=>!row.classList.contains('member-polish-empty-row'));
    let visible=0;
    rows.forEach(row=>{
      const match=rowMatches(row,state.active);
      row.classList.toggle('member-polish-filtered-out',!match);
      row.style.display=match?'':'none';
      if(match)visible++;
    });
    if(!visible){
      const empty=document.createElement('tr');
      empty.className='member-polish-empty-row';
      const cell=document.createElement('td');
      cell.colSpan=Math.max(1,table.tHead?.rows?.[0]?.cells?.length||10);
      cell.innerHTML=`<div class="member-polish-empty-state">${iconHtml('users')}<strong>当前组织暂无可展示成员</strong><span>可切换其他组织，或通过“添加成员”补充成员关系。</span></div>`;
      empty.appendChild(cell);
      body.appendChild(empty);
    }
    ensureCurrentFilterChip(table,visible);
  }

  function ensureCurrentFilterChip(table,visible){
    const search=[...document.querySelectorAll('input')].find(node=>String(node.placeholder||'').includes('搜索姓名'));
    if(!search)return;
    let toolbar=search.parentElement;
    while(toolbar&&toolbar!==document.body){
      const rect=toolbar.getBoundingClientRect();
      if(rect.width>500&&rect.height<100)break;
      toolbar=toolbar.parentElement;
    }
    if(!toolbar)return;
    toolbar.classList.add('member-polish-toolbar');
    toolbar.querySelector('.member-polish-current-filter')?.remove();
    if(state.active==='all'||state.active==='group')return;
    const chip=document.createElement('span');
    chip.className='member-polish-current-filter';
    chip.innerHTML=`${iconHtml('building')}当前：${esc(labelFor(state.active))} · ${visible}`;
    const reset=[...toolbar.querySelectorAll('button')].find(button=>button.textContent.trim()==='重置');
    if(reset)toolbar.insertBefore(chip,reset);else toolbar.appendChild(chip);
  }

  function markRows(table){
    table.classList.add('member-polish-table');
    [...table.tBodies].flatMap(body=>[...body.rows]).forEach((row,index)=>{
      row.classList.add('member-polish-row');
      const avatar=[...row.querySelectorAll('span,div')].find(node=>{
        const text=node.textContent.trim();
        const rect=node.getBoundingClientRect();
        return node.children.length===0&&text.length===1&&rect.width>=22&&rect.width<=48&&rect.height>=22&&rect.height<=48;
      });
      if(avatar)avatar.classList.add('member-polish-avatar',`avatar-tone-${index%4}`);
    });
  }

  function polishDialogs(){
    [...document.querySelectorAll('.modal,.drawer,[class*="member"][class*="modal"],[class*="member"][class*="drawer"]')].forEach(dialog=>dialog.classList.add('member-polish-dialog'));
    [...document.querySelectorAll('.modal-foot,[class*="modal-foot"],[class*="drawer-foot"]')].forEach(foot=>{
      [...foot.querySelectorAll('button')].forEach(button=>{
        const text=button.textContent.trim();
        if(/确定|保存|提交|添加|分配|启用|下一步|完成/.test(text)&&!button.classList.contains('danger'))button.classList.add('primary');
      });
    });
  }

  function enhance(){
    if(state.enhancing)return;
    if(!isMemberPage()){
      document.body.classList.remove('member-polish-active');
      return;
    }
    state.enhancing=true;
    try{
      document.body.classList.add('member-polish-active');
      const table=findMemberTable();
      if(!table)return;
      const card=findMemberCard(table);
      if(card){card.classList.add('member-polish-card');markStats(card);}
      const treePanel=findTreePanel();
      if(treePanel){
        const workspace=treePanel.parentElement;
        if(workspace)workspace.classList.add('member-polish-workspace');
        if(!treePanel.querySelector('.member-polish-tree-head'))renderTree(treePanel);
      }
      markRows(table);
      applyDepartmentFilter();
      polishDialogs();
    }finally{
      state.enhancing=false;
    }
  }

  const root=document.getElementById('app');
  if(root)new MutationObserver(schedule).observe(root,{childList:true,subtree:true});
  const overlay=document.getElementById('overlayRoot');
  if(overlay)new MutationObserver(schedule).observe(overlay,{childList:true,subtree:true});
  document.addEventListener('click',event=>{
    if(event.target.closest('button,.btn'))setTimeout(schedule,0);
  },true);
  window.addEventListener('resize',schedule);
  schedule();
})();
