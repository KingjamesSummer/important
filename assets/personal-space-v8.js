(()=>{
'use strict';

const V8_MARK='personal-space-v8-runtime';
if(document.documentElement.dataset.personalSpaceV8)return;
document.documentElement.dataset.personalSpaceV8='1';

Object.assign(ONLINE_ICONS,{
  upload:'material-symbols:upload-rounded',
  folderPlus:'material-symbols:create-new-folder-outline-rounded',
  folder:'material-symbols:folder-outline-rounded',
  download:'material-symbols:download-rounded',
  more:'material-symbols:more-horiz',
  eye:'material-symbols:visibility-outline-rounded',
  edit:'material-symbols:edit-outline-rounded',
  copy:'material-symbols:content-copy-outline-rounded',
  move:'material-symbols:drive-file-move-outline-rounded',
  star:'material-symbols:star-outline-rounded',
  tag:'material-symbols:label-outline-rounded',
  trash:'material-symbols:delete-outline-rounded',
  link:'material-symbols:link-rounded',
  info:'material-symbols:info-outline-rounded',
  transfer:'material-symbols:swap-horiz-rounded',
  bulk:'material-symbols:checklist-rounded',
  grant:'material-symbols:group-add-outline-rounded',
  history:'material-symbols:history-rounded'
});
FILE_ICONIFY.folder='fluent-color:folder-24';

const samples={
  p1:['项目','重点','待评审'],
  p3:['计划','本周'],
  p4:['调研','待归档'],
  p6:['汇报','例会']
};
personalFiles.forEach(file=>{if(samples[file.id])file.tags=[...samples[file.id]]});

window.personalTags=function(file){
  const raw=Array.isArray(file?.tags)?file.tags:(file?.tag?[file.tag]:[]);
  return [...new Set(raw.flatMap(x=>String(x).split(/[,，;；]/)).map(x=>x.trim()).filter(Boolean))];
};
window.allPersonalTags=function(){return [...new Set(personalFiles.flatMap(personalTags))].sort((a,b)=>a.localeCompare(b,'zh-CN'))};
window.selectedTagSeed=function(){return [...new Set(state.selected.flatMap(id=>personalTags(personalFiles.find(x=>x.id===id))))]};
window.tagTone=function(tag){const map={项目:'blue',计划:'cyan',临时:'gray',调研:'purple',任务:'green',汇报:'orange',设计:'pink',技术:'slate',需求:'blue',评审:'purple',资料:'cyan',模板:'slate',复盘:'green',归档:'gray',重点:'orange',待评审:'purple',待归档:'gray',本周:'green',例会:'orange'};return map[tag]||'slate'};
window.personalTag=function(file){
  const tags=personalTags(file);
  if(!tags.length)return '<span class="tag-empty">未设置</span>';
  return `<div class="personal-tags">${tags.slice(0,2).map(tag=>`<button class="personal-tag tag-${tagTone(tag)}" data-tag="${safe(tag)}" title="筛选标签：${safe(tag)}" onclick="event.stopPropagation();filterPersonalByTag(this.dataset.tag)">${icon('tag')}<span>${safe(tag)}</span></button>`).join('')}${tags.length>2?`<span class="tag-more" title="${safe(tags.slice(2).join('、'))}">+${tags.length-2}</span>`:''}</div>`;
};
window.filterPersonalByTag=function(tag){state.filters.tag=tag;state.personalPage=1;state.selected=[];state.detail=null;render()};

currentFiles=function(space='enterprise'){
  let arr=space==='enterprise'?(enterpriseFiles[state.dept]||[]):personalFiles;
  if(space==='personal'){const currentPath=state.folder.join('/');arr=arr.filter(x=>(x.parent||'')===currentPath)}
  if(state.query)arr=arr.filter(x=>x.name.toLowerCase().includes(state.query.toLowerCase()));
  if(space==='personal'){
    if(state.personalTab==='recent')arr=arr.slice().sort((a,b)=>b.modified.localeCompare(a.modified));
    if(state.personalTab==='favorites')arr=arr.filter(x=>x.favorite);
    if(state.filters.type!=='all')arr=arr.filter(x=>x.type===state.filters.type);
    if(state.filters.tag!=='all')arr=arr.filter(x=>personalTags(x).includes(state.filters.tag));
  }
  return arr.slice().sort((a,b)=>{const av=a[state.sort.key]||'',bv=b[state.sort.key]||'';return state.sort.dir==='asc'?String(av).localeCompare(String(bv),'zh-CN'):String(bv).localeCompare(String(av),'zh-CN')});
};

filterPop=function(){return `<div class="filter-pop"><div class="filter-title">搜索条件<button class="btn ghost icon-only" onclick="state.filterOpen=false;render()">${icon('x')}</button></div><div class="form-grid"><div class="field"><label>文件类型</label><select class="select" id="filterType"><option value="all" ${state.filters.type==='all'?'selected':''}>全部类型</option><option value="folder">文件夹</option><option value="doc">Word 文档</option><option value="pdf">PDF 文件</option><option value="xls">Excel 表格</option><option value="ppt">演示文稿</option><option value="img">图片</option><option value="zip">压缩包</option><option value="md">Markdown</option></select></div><div class="field"><label>标签</label><select class="select" id="filterTag"><option value="all">全部标签</option>${allPersonalTags().map(x=>`<option value="${safe(x)}" ${state.filters.tag===x?'selected':''}>${safe(x)}</option>`).join('')}</select></div><div class="field"><label>显示方式</label><div class="view-toggle" style="width:74px"><button class="${state.view==='list'?'active':''}" onclick="state.view='list';render()">${icon('list')}</button><button class="${state.view==='grid'?'active':''}" onclick="state.view='grid';render()">${icon('grid')}</button></div></div></div><div class="filter-actions"><button class="btn" onclick="clearFilters()">重置</button><button class="btn primary" onclick="applyFilters()">应用</button></div></div>`};

personalBulkControl=function(){
  const count=state.selected.length;
  const selected=state.selected.map(id=>personalFiles.find(x=>x.id===id)).filter(Boolean);
  const transferable=count===1&&selected[0]?.type==='folder';
  return `<div class="personal-bulk-wrap"><button class="btn personal-bulk-trigger" ${count?'':'disabled'} onclick="togglePersonalBulkMenu(event)">${icon('bulk')}<span class="personal-bulk-label">${count?`已选 ${count} 项`:'批量操作'}</span>${icon('down')}</button><div class="personal-bulk-menu" onclick="event.stopPropagation()"><button onclick="closePersonalBulkMenu();toast('已加入 '+state.selected.length+' 个下载任务')">${icon('download')}<span>下载</span></button><button onclick="closePersonalBulkMenu();openModal('destination',{space:'personal',mode:'move'})">${icon('move')}<span>移动到</span></button><button onclick="closePersonalBulkMenu();openModal('destination',{space:'personal',mode:'copy'})">${icon('copy')}<span>复制到</span></button><div class="menu-sep"></div><button onclick="closePersonalBulkMenu();toggleFavoriteSelected()">${icon('star')}<span>添加到收藏</span></button><button onclick="closePersonalBulkMenu();openModal('tag')">${icon('tag')}<span>设置多标签</span></button><button class="ownership-action" ${transferable?'':'disabled'} title="${transferable?'转移当前文件夹及全部子项':'仅选择一个文件夹时可用'}" onclick="closePersonalBulkMenu();openModal('transfer',{id:'${transferable?selected[0].id:''}'})">${icon('transfer')}<span>转移所有权</span></button><div class="menu-sep"></div><button class="danger" onclick="closePersonalBulkMenu();openModal('delete',{space:'personal'})">${icon('trash')}<span>删除</span></button></div></div>`;
};

syncPersonalSelection=function(){
  const ids=new Set(state.selected);
  document.querySelectorAll('.personal-file-table tbody tr[data-file-id],.file-card[data-file-id]').forEach(el=>{const selected=ids.has(el.dataset.fileId);el.classList.toggle('selected',selected);const check=el.querySelector('.check');if(check)check.checked=selected});
  const all=document.querySelector('.personal-file-table thead .check');
  if(all){const rows=[...document.querySelectorAll('.personal-file-table tbody tr[data-file-id]')];all.checked=rows.length>0&&rows.every(row=>ids.has(row.dataset.fileId));all.indeterminate=ids.size>0&&!all.checked}
  const trigger=document.querySelector('.personal-bulk-trigger');const label=document.querySelector('.personal-bulk-label');
  if(trigger){trigger.disabled=ids.size===0;if(label)label.textContent=ids.size?`已选 ${ids.size} 项`:'批量操作'}
  const selected=[...ids].map(id=>personalFiles.find(x=>x.id===id)).filter(Boolean);
  const transfer=document.querySelector('.ownership-action');
  if(transfer){const enabled=selected.length===1&&selected[0].type==='folder';transfer.disabled=!enabled;transfer.title=enabled?'转移当前文件夹及全部子项':'仅选择一个文件夹时可用';transfer.onclick=enabled?()=>{closePersonalBulkMenu();openModal('transfer',{id:selected[0].id})}:null}
  if(!ids.size)closePersonalBulkMenu();
};

window.toggleTagChoice=function(button){button.classList.toggle('selected');button.setAttribute('aria-pressed',button.classList.contains('selected')?'true':'false');updateTagSummary()};
window.updateTagSummary=function(){const count=document.querySelectorAll('#tagChoiceGrid .tag-option.selected').length;const node=document.getElementById('tagSelectionSummary');if(node)node.textContent=`已选择 ${count} 个标签`};
window.addCustomTagChoice=function(){
  const input=document.getElementById('customTagInput');const grid=document.getElementById('tagChoiceGrid');if(!input||!grid)return;
  const values=input.value.split(/[,，;；]/).map(x=>x.trim()).filter(Boolean);if(!values.length)return toast('请输入标签名称','warning');
  for(const value of values){if(value.length>12){toast(`标签“${value}”不能超过 12 个字符`,'warning');continue}let existing=[...grid.querySelectorAll('.tag-option')].find(x=>x.dataset.value===value);if(existing){existing.classList.add('selected');existing.setAttribute('aria-pressed','true');continue}if(grid.querySelectorAll('.tag-option').length>=24){toast('标签候选数量已达上限','warning');break}const button=document.createElement('button');button.type='button';button.className='tag-option selected';button.dataset.value=value;button.setAttribute('aria-pressed','true');button.innerHTML=`${icon('check')}<span></span>`;button.querySelector('span').textContent=value;button.onclick=()=>toggleTagChoice(button);grid.appendChild(button)}
  input.value='';updateTagSummary();
};
window.applyTags=function(){const tags=[...document.querySelectorAll('#tagChoiceGrid .tag-option.selected')].map(x=>x.dataset.value).filter(Boolean);if(tags.length>8)return toast('每个文件最多设置 8 个标签','warning');personalFiles.forEach(file=>{if(state.selected.includes(file.id)){file.tags=[...tags];file.tag=tags[0]||'';file.modified='2026-06-23 13:20';file.activity=tags.length?'刚刚 · 更新标签':'刚刚 · 清空标签'}});closeModal();toast(tags.length?`已设置 ${tags.length} 个标签`:'已清空标签');render()};

window.transferItem=function(id){const f=personalFiles.find(x=>x.id===id);const member=document.getElementById('transferMember')?.value;const confirmed=document.getElementById('transferConfirm')?.checked;if(!f||f.type!=='folder')return toast('仅个人空间文件夹支持转移所有权','warning');if(!member)return toast('请选择接收成员','warning');if(!confirmed)return toast('请确认所有权转移范围','warning');const root=[f.parent,f.name].filter(Boolean).join('/');const moved=personalFiles.filter(x=>x.id===id||((x.parent||'')===root||(x.parent||'').startsWith(root+'/')));const ids=new Set(moved.map(x=>x.id));personalFiles=personalFiles.filter(x=>!ids.has(x.id));state.selected=[];state.detail=null;closeModal();toast(`“${f.name}”及 ${Math.max(0,moved.length-1)} 个子项已转移给${member.split(' · ')[0]}`);render()};
window.applyGrant=function(id,space){const member=document.getElementById('grantMember')?.value;const role=document.getElementById('grantRole')?.value;if(!member)return toast('请选择授权成员','warning');const f=findFile(id,space);if(f&&space==='personal'){f.access='shared';f.activity=`刚刚 · 共享给${member.split(' · ')[0]}`;f.modified='2026-06-23 13:20'}closeModal();toast(`已授予${member.split(' · ')[0]}“${role}”权限`);render()};

const baseModalContent=modalContent;
modalContent=function(){
  if(!state.modal)return'';
  const {type,payload}=state.modal;
  let title='',body='',foot='';
  if(type==='tag'){
    const seed=selectedTagSeed();const presets=[...new Set(['重点','待评审','项目','计划','设计','交付','归档','本周',...allPersonalTags(),...seed])];
    title='设置多标签';
    body=`<div class="tag-editor"><div class="tag-editor-head"><div><strong>为 ${state.selected.length} 项内容设置标签</strong><span>可同时选择多个标签，保存后统一覆盖所选内容</span></div><span id="tagSelectionSummary">已选择 ${seed.length} 个标签</span></div><div class="tag-choice-grid" id="tagChoiceGrid">${presets.map(tag=>`<button type="button" class="tag-option ${seed.includes(tag)?'selected':''}" data-value="${safe(tag)}" aria-pressed="${seed.includes(tag)}" onclick="toggleTagChoice(this)">${icon('check')}<span>${safe(tag)}</span></button>`).join('')}</div><div class="tag-create-row"><input class="input" id="customTagInput" maxlength="80" placeholder="输入新标签；多个标签可用逗号分隔" onkeydown="if(event.key==='Enter'){event.preventDefault();addCustomTagChoice()}"><button class="btn" type="button" onclick="addCustomTagChoice()">${icon('plus')}添加</button></div><p class="help">每个文件最多 8 个标签，单个标签不超过 12 个字符。取消全部选中后保存，可清空标签。</p></div>`;
    foot=`<button class="btn" onclick="closeModal()">取消</button><button class="btn primary" onclick="applyTags()">保存标签</button>`;
  }else if(type==='transfer'){
    const f=personalFiles.find(x=>x.id===payload.id);const root=[f?.parent,f?.name].filter(Boolean).join('/');const children=f?personalFiles.filter(x=>{const p=x.parent||'';return p===root||p.startsWith(root+'/')}).length:0;
    title='转移文件夹所有权';
    body=`<div class="transfer-summary">${fileVisual(f||{type:'folder'})}<div><strong>${safe(f?.name||'')}</strong><span>包含 ${children} 个子项；转移后原所有者失去该文件夹及全部子项的所有权</span></div></div><div class="field"><label>接收成员</label><select class="select" id="transferMember"><option value="">请选择接收成员</option><option>李晓华 · 综合管理部</option><option>周凯 · 研发中心</option><option>许欣 · 产品设计部</option><option>王璐 · 综合管理部</option></select></div><label class="transfer-confirm"><input class="check" id="transferConfirm" type="checkbox"><span>我已确认该文件夹及全部子项将转移到接收人的个人空间</span></label><div class="notice danger-notice">所有权转移不可直接撤销，后续需要由新所有者再次转移。</div>`;
    foot=`<button class="btn" onclick="closeModal()">取消</button><button class="btn danger" onclick="transferItem('${payload.id}')">确认转移</button>`;
  }else if(type==='grant'){
    const f=findFile(payload.id,payload.space);title='共享授权';
    body=`<div class="transfer-summary">${fileVisual(f||{type:'doc'})}<div><strong>${safe(f?.name||'')}</strong><span>授权后，成员将在“与我相关”中看到该内容</span></div></div><div class="form-grid"><div class="field"><label>授权成员</label><select class="select" id="grantMember"><option value="">请选择成员</option><option>李晓华 · 综合管理部</option><option>周凯 · 研发中心</option><option>许欣 · 产品设计部</option><option>王璐 · 综合管理部</option></select></div><div class="field"><label>文件角色</label><select class="select" id="grantRole"><option>预览者</option><option>下载者</option><option>上传者</option><option>编辑者</option></select></div><div class="notice">共享授权与安全外链相互独立，成员权限不能超过当前操作者已有权限。</div></div>`;
    foot=`<button class="btn" onclick="closeModal()">取消</button><button class="btn primary" onclick="applyGrant('${payload.id}','${payload.space}')">确认授权</button>`;
  }else return baseModalContent();
  return `<div class="modal-layer" onclick="if(event.target===this)closeModal()"><div class="modal"><div class="modal-head">${title}<button class="btn ghost icon-only" onclick="closeModal()">${icon('x')}</button></div><div class="modal-body">${body}</div><div class="modal-foot">${foot}</div></div></div>`;
};

const baseMenuContent=menuContent;
menuContent=function(){
  const m=state.menu;if(m?.type==='collab')return baseMenuContent();
  const f=findFile(m.id,m.space);if(!f)return'';const folder=f.type==='folder';
  return `<div class="menu-pop personal-file-menu" style="left:${m.x}px;top:${m.y}px"><button class="menu-item menu-emphasis" onclick="state.menu=null;${folder?`openFile('${m.id}','${m.space}')`:`openModal('preview',{file:findFile('${m.id}','${m.space}')})`}">${icon(folder?'folder':'eye')}<span>${folder?'打开文件夹':'预览'}</span></button><button class="menu-item" onclick="state.menu=null;toast('已加入下载任务')">${icon('download')}<span>下载</span></button><div class="menu-sep"></div><button class="menu-item" onclick="state.menu=null;openModal('share',{file:findFile('${m.id}','${m.space}')})">${icon('link')}<span>创建安全外链</span></button>${m.space==='personal'?`<button class="menu-item" onclick="state.menu=null;openModal('grant',{id:'${m.id}',space:'${m.space}'})">${icon('grant')}<span>共享授权</span></button>`:''}<div class="menu-sep"></div><button class="menu-item" onclick="state.menu=null;openModal('rename',{id:'${m.id}',space:'${m.space}'})">${icon('edit')}<span>重命名</span></button><button class="menu-item" onclick="state.selected=['${m.id}'];state.menu=null;openModal('destination',{space:'${m.space}',mode:'move'})">${icon('move')}<span>移动到</span></button><button class="menu-item" onclick="state.selected=['${m.id}'];state.menu=null;openModal('destination',{space:'${m.space}',mode:'copy'})">${icon('copy')}<span>复制到</span></button>${m.space==='personal'?`<button class="menu-item" onclick="state.menu=null;toggleFavoriteItem('${m.id}')">${icon('star')}<span>${f.favorite?'取消收藏':'添加收藏'}</span></button><button class="menu-item" onclick="state.selected=['${m.id}'];state.menu=null;openModal('tag')">${icon('tag')}<span>设置多标签</span></button>`:''}${m.space==='personal'&&folder?`<button class="menu-item transfer-item" onclick="state.menu=null;openModal('transfer',{id:'${m.id}'})">${icon('transfer')}<span>转移所有权</span></button>`:''}<div class="menu-sep"></div><button class="menu-item" onclick="state.menu=null;state.detail={id:'${m.id}',space:'${m.space}'};render()">${icon('info')}<span>属性详情</span></button><button class="menu-item danger" onclick="state.selected=['${m.id}'];state.menu=null;openModal('delete',{space:'${m.space}'})">${icon('trash')}<span>删除</span></button></div>`;
};

openMenu=function(e,id,space){e.preventDefault?.();const trigger=e.currentTarget||e.target;const rect=trigger.getBoundingClientRect();const width=232;const pointerX=e.clientX||rect.right;const pointerY=e.clientY||rect.bottom;const estimatedHeight=space==='personal'?590:430;const x=Math.max(10,Math.min(pointerX+4,innerWidth-width-10));const y=Math.max(10,Math.min(pointerY+4,innerHeight-estimatedHeight-10));if(!state.selected.includes(id))state.selected=[id];state.detail=null;state.menu={x,y,id,space,type:'file'};state.profileOpen=false;state.personalUploadOpen=false;if(space==='personal')syncPersonalSelection();renderOverlays()};

deleteSelected=function(space){let removed=[];if(space==='personal'){const selected=personalFiles.filter(x=>state.selected.includes(x.id));const roots=selected.filter(x=>x.type==='folder').map(x=>[x.parent,x.name].filter(Boolean).join('/'));removed=personalFiles.filter(x=>state.selected.includes(x.id)||roots.some(root=>{const parent=x.parent||'';return parent===root||parent.startsWith(root+'/')}));const ids=new Set(removed.map(x=>x.id));personalFiles=personalFiles.filter(x=>!ids.has(x.id))}else if(space==='enterprise'){removed=enterpriseFiles[state.dept].filter(x=>state.selected.includes(x.id));enterpriseFiles[state.dept]=enterpriseFiles[state.dept].filter(x=>!state.selected.includes(x.id))}removed.forEach(x=>recycle.unshift({id:'r'+Date.now()+Math.random(),name:x.name,path:space==='personal'?'个人空间'+(x.parent?' / '+x.parent:''):'企业空间 / '+state.dept,deleted:'2026-06-23 13:20',expire:'剩余 30 天',size:x.size||'—',type:x.type}));state.selected=[];state.detail=null;closeModal();toast(`已将 ${removed.length} 项移入误删恢复`);render()};

renameItem=function(id,space){const f=findFile(id,space);const value=document.getElementById('renameValue')?.value.trim();if(!f||!value)return toast('请输入新的名称','warning');if(/[\\/:*?"<>|]/.test(value))return toast('名称包含不支持的字符','warning');if(space==='personal'&&f.type==='folder'){const oldPath=[f.parent,f.name].filter(Boolean).join('/');const newPath=[f.parent,value].filter(Boolean).join('/');personalFiles.forEach(child=>{const parent=child.parent||'';if(parent===oldPath||parent.startsWith(oldPath+'/'))child.parent=newPath+parent.slice(oldPath.length)})}f.name=value;f.modified='2026-06-23 13:20';f.activity='刚刚 · 重命名';closeModal();toast('名称已更新');render()};

personalGrid=function(files){return `<div class="grid-zone"><div class="file-grid">${files.map(f=>`<div data-file-id="${f.id}" class="file-card ${state.selected.includes(f.id)?'selected':''}" onclick="rowClick(event,'${f.id}','personal')" ondblclick="openFile('${f.id}','personal')" oncontextmenu="openMenu(event,'${f.id}','personal')"><input class="check" type="checkbox" ${state.selected.includes(f.id)?'checked':''} onclick="event.stopPropagation();toggleOne('${f.id}',this.checked)"><button class="more-btn" onclick="event.stopPropagation();openMenu(event,'${f.id}','personal')">${icon('more')}</button>${fileVisual(f)}<button class="file-card-name file-entry-link" onclick="event.stopPropagation();openFile('${f.id}','personal')">${safe(f.name)}</button><div class="file-card-meta"><span>${f.type==='folder'?personalFolderCount(f):safe(f.size||'—')}</span><span>${safe(f.modified.slice(5,10))}</span></div><div class="file-card-tags">${personalTag(f)}</div><div class="file-card-access">${personalAccess(f)}</div></div>`).join('')}</div></div>`};

const baseDetailPane=detailPane;
detailPane=function(){
  if(!state.detail||state.detail.space!=='personal')return baseDetailPane();
  const f=findFile(state.detail.id,'personal');if(!f)return'';
  return `<aside class="detail-pane"><div class="detail-head">属性详情<button class="btn ghost icon-only" onclick="state.detail=null;render()">${icon('x')}</button></div><div class="detail-body"><div class="detail-preview">${fileVisual(f)}<strong>${safe(f.name)}</strong>${personalAccess(f)}</div><div class="info-list"><div class="info-row"><span>文件类型</span><span>${personalFileType(f)}</span></div><div class="info-row"><span>所在位置</span><span>个人空间${f.parent?' / '+safe(f.parent):''}</span></div><div class="info-row"><span>文件大小</span><span>${safe(f.size||'—')}</span></div><div class="info-row"><span>修改时间</span><span>${safe(f.modified)}</span></div><div class="info-row"><span>所有者</span><span>张明远（本人）</span></div></div><div class="detail-section"><div class="detail-section-title"><span>标签</span><button onclick="state.selected=['${f.id}'];openModal('tag')">管理</button></div>${personalTag(f)}</div><div class="detail-section"><div class="detail-section-title"><span>共享与安全</span></div><div class="detail-security-row">${personalAccess(f)}<span>${f.access==='link'?'当前存在有效安全外链':f.access==='shared'?'已授权给指定成员':'未对外共享'}</span></div></div></div></aside>`;
};

render();
})();
