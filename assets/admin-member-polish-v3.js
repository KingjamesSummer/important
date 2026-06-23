/* Member management polish v3 — hierarchy, filtering and visual hooks. */
(function(){
  if(window.__adminMemberPolishV3)return;
  window.__adminMemberPolishV3=true;

  const ui={active:'all',expanded:new Set(['group','research']),query:'',scheduled:false,busy:false};
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

  function appState(){
    try{return typeof state==='object'&&state?state:null;}catch(error){return null;}
  }
  function iconHtml(name){
    try{return typeof icon==='function'?icon(name):'';}catch(error){return '';}
  }
  function esc(value){return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
  function isMemberPage(){const current=appState();return Boolean(current&&current.page==='admin'&&current.adminTab==='member');}

  function schedule(){
    if(ui.scheduled)return;
    ui.scheduled=true;
    requestAnimationFrame(()=>{ui.scheduled=false;enhance();});
  }

  function memberTable(){
    return [...document.querySelectorAll('table')].find(table=>{
      const text=table.tHead?.textContent||table.textContent||'';
      return text.includes('工号')&&text.includes('所属部门')&&text.includes('管理身份');
    })||null;
  }

  function treePanel(){
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

  function memberCard(table){
    let node=table?.parentElement;
    while(node&&node!==document.body){
      const text=node.textContent||'';
      if(text.includes('集团成员')&&text.includes('同步 MDM')&&text.includes('添加成员'))return node;
      node=node.parentElement;
    }
    return table?.closest('.panel')||table?.parentElement||null;
  }

  function directLeaf(root,label){
    return [...root.querySelectorAll('span,small,label,div')].find(node=>node.children.length===0&&node.textContent.trim()===label)||null;
  }

  function markStats(root){
    [['集团成员','stat-total'],['正常账号','stat-normal'],['待分配人员','stat-pending'],['停用账号','stat-disabled']].forEach(([label,variant])=>{
      const leaf=directLeaf(root,label);
      if(!leaf)return;
      let card=leaf.parentElement;
      while(card&&card!==root){
        const rect=card.getBoundingClientRect();
        const text=card.textContent||'';
        if(rect.width>140&&rect.height>50&&rect.height<150&&/\d+/.test(text))break;
        card=card.parentElement;
      }
      if(card&&card!==root)card.classList.add('member-polish-stat',variant);
    });
  }

  function hasQueryMatch(node,query){
    if(!query)return true;
    if(node.label.toLowerCase().includes(query))return true;
    return Boolean(node.children?.some(child=>hasQueryMatch(child,query)));
  }

  function nodeIcon(node){
    if(node.type==='all')return iconHtml('users');
    if(node.type==='root')return iconHtml('building');
    if(node.type==='pending')return iconHtml('user');
    return iconHtml('folder');
  }

  function nodeMarkup(node){
    const query=ui.query.trim().toLowerCase();
    if(!hasQueryMatch(node,query))return '';
    const children=Array.isArray(node.children)?node.children:[];
    const open=ui.expanded.has(node.id)||Boolean(query&&children.length);
    const row=`<button type="button" class="member-polish-tree-row level-${node.level} ${ui.active===node.id?'active':''}" data-member-node="${node.id}">
      <span class="tree-toggle ${children.length?(open?'open':''):'empty'}" data-member-toggle="${node.id}">${children.length?iconHtml('chevron'):''}</span>
      <span class="tree-node-icon">${nodeIcon(node)}</span>
      <span class="tree-label">${esc(node.label)}</span>
      <span class="tree-count">${node.count}</span>
    </button>`;
    if(!children.length||!open)return row;
    return row+`<div class="member-polish-tree-children level-${node.level+1}">${children.map(nodeMarkup).join('')}</div>`;
  }

  function renderTree(panel){
    panel.classList.add('member-polish-tree-panel');
    panel.innerHTML=`<div class="member-polish-tree-head">
      <div class="member-polish-tree-title">${iconHtml('building')}<span>组织架构</span><small>集团 / 部门 / 小组</small></div>
      <label class="member-polish-tree-search">${iconHtml('search')}<input id="memberHierarchySearch" value="${esc(ui.query)}" placeholder="搜索公司、部门或小组"></label>
    </div>
    <div class="member-polish-tree-body">
      ${nodeMarkup(hierarchy[0])}
      <div class="member-polish-tree-divider"></div>
      ${nodeMarkup(hierarchy[1])}
      <div class="member-polish-tree-divider"></div>
      ${nodeMarkup(hierarchy[2])}
      <div class="member-polish-tree-note">组织层级与部门管理保持一致。成员可加入多个部门，主部门决定默认文件权限和组织统计口径。</div>
    </div>`;

    panel.querySelector('#memberHierarchySearch')?.addEventListener('input',event=>{
      ui.query=event.target.value;
      renderTree(panel);
      requestAnimationFrame(()=>panel.querySelector('#memberHierarchySearch')?.focus());
    });
    panel.querySelectorAll('[data-member-toggle]').forEach(toggle=>toggle.addEventListener('click',event=>{
      event.stopPropagation();
      const id=toggle.dataset.memberToggle;
      ui.expanded.has(id)?ui.expanded.delete(id):ui.expanded.add(id);
      renderTree(panel);
    }));
    panel.querySelectorAll('[data-member-node]').forEach(button=>button.addEventListener('click',()=>{
      const id=button.dataset.memberNode;
      if(id==='group'){
        ui.expanded.has('group')?ui.expanded.delete('group'):ui.expanded.add('group');
        ui.active='all';
      }else{
        ui.active=id;
        if(id==='research')ui.expanded.add('research');
      }
      renderTree(panel);
      filterRows();
    }));
  }

  function labelFor(id){
    let result='全部成员';
    const walk=nodes=>nodes.forEach(node=>{if(node.id===id)result=node.label;if(node.children)walk(node.children);});
    walk(hierarchy);
    return result;
  }

  function rowMatches(row,id){
    const text=(row.textContent||'').replace(/\s+/g,' ');
    if(id==='all'||id==='group')return true;
    if(id==='pending')return /待分配|未分配|人员池/.test(text);
    if(id==='platform')return /研发中心/.test(text)&&/技术|开发|平台/.test(text);
    if(id==='product')return /研发中心/.test(text)&&/产品|设计/.test(text);
    const names={general:'综合管理部',finance:'财务管理部',investment:'投资发展部',research:'研发中心',construction:'建设管理部',operations:'运营管理部'};
    return names[id]?text.includes(names[id]):true;
  }

  function toolbarForTable(table){
    const search=[...document.querySelectorAll('input')].find(node=>String(node.placeholder||'').includes('搜索姓名'));
    if(!search)return null;
    let node=search.parentElement;
    while(node&&node!==document.body){
      const rect=node.getBoundingClientRect();
      if(rect.width>500&&rect.height>35&&rect.height<110)return node;
      node=node.parentElement;
    }
    return null;
  }

  function filterChip(table,visible){
    const toolbar=toolbarForTable(table);
    if(!toolbar)return;
    toolbar.classList.add('member-polish-toolbar');
    toolbar.querySelector('.member-polish-current-filter')?.remove();
    if(ui.active==='all'||ui.active==='group')return;
    const chip=document.createElement('span');
    chip.className='member-polish-current-filter';
    chip.innerHTML=`${iconHtml('building')}当前：${esc(labelFor(ui.active))} · ${visible}`;
    const reset=[...toolbar.querySelectorAll('button')].find(button=>button.textContent.trim()==='重置');
    reset?toolbar.insertBefore(chip,reset):toolbar.appendChild(chip);
  }

  function filterRows(){
    const table=memberTable();
    if(!table||!table.tBodies.length)return;
    const body=table.tBodies[0];
    body.querySelector('.member-polish-empty-row')?.remove();
    const rows=[...body.rows];
    let visible=0;
    rows.forEach(row=>{
      const match=rowMatches(row,ui.active);
      row.classList.toggle('member-polish-filtered-out',!match);
      row.style.display=match?'':'none';
      if(match)visible++;
    });
    if(!visible){
      const row=document.createElement('tr');
      row.className='member-polish-empty-row';
      const cell=document.createElement('td');
      cell.colSpan=Math.max(1,table.tHead?.rows?.[0]?.cells?.length||10);
      cell.innerHTML=`<div class="member-polish-empty-state">${iconHtml('users')}<strong>当前组织暂无可展示成员</strong><span>可切换其他组织，或通过“添加成员”补充成员关系。</span></div>`;
      row.appendChild(cell);
      body.appendChild(row);
    }
    filterChip(table,visible);
  }

  function markRows(table){
    table.classList.add('member-polish-table');
    [...table.tBodies].flatMap(body=>[...body.rows]).forEach((row,index)=>{
      if(row.classList.contains('member-polish-empty-row'))return;
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
    if(ui.busy)return;
    if(!isMemberPage()){
      document.body.classList.remove('member-polish-active');
      return;
    }
    ui.busy=true;
    try{
      document.body.classList.add('member-polish-active');
      const table=memberTable();
      if(!table)return;
      const card=memberCard(table);
      if(card){card.classList.add('member-polish-card');markStats(card);}
      const panel=treePanel();
      if(panel){
        panel.parentElement?.classList.add('member-polish-workspace');
        if(!panel.querySelector('.member-polish-tree-head'))renderTree(panel);
      }
      markRows(table);
      filterRows();
      polishDialogs();
    }finally{ui.busy=false;}
  }

  const app=document.getElementById('app');
  if(app)new MutationObserver(schedule).observe(app,{childList:true,subtree:true});
  const overlay=document.getElementById('overlayRoot');
  if(overlay)new MutationObserver(schedule).observe(overlay,{childList:true,subtree:true});
  document.addEventListener('click',event=>{if(event.target.closest('button,.btn'))setTimeout(schedule,0);},true);
  window.addEventListener('resize',schedule);
  schedule();
})();
