from pathlib import Path
import re
import sys

path = Path("web-prototype.html")
text = path.read_text(encoding="utf-8")
original = text
MARKER = "personal-space-refinement-v4"

if MARKER in text:
    print("Personal space refinement already applied.")
    raise SystemExit(0)

def replace_function(source: str, name: str, next_name: str, replacement: str) -> str:
    pattern = rf"function {re.escape(name)}\([\s\S]*?(?=\nfunction {re.escape(next_name)}\()"
    updated, count = re.subn(pattern, replacement.rstrip(), source, count=1, flags=re.S)
    if count != 1:
        raise RuntimeError(f"Could not replace function {name}; matches={count}")
    return updated

sidebar_fn = r'''function sidebar(){return `<aside class="sidebar"><div class="brand"><div class="brand-mark"><iconify-icon icon="solar:cloud-file-bold-duotone" aria-hidden="true" onload="this.parentElement.classList.add('is-loaded')"></iconify-icon><span class="brand-fallback">知</span></div><div class="brand-copy"><strong>智汇云知</strong><span>智能知识库管理平台 · PRO</span></div></div><div class="nav-scroll">${nav.map(g=>`<div class="nav-title">${g.section}</div>${g.items.map(([p,i,t])=>`<button class="nav-item ${state.page===p?'active':''}" onclick="navigate('${p}')">${icon(i)}<span>${t}</span>${p==='related'?'<span class="trail badge blue">3</span>':''}</button>`).join('')}`).join('')}</div><div class="capacity-card"><div class="capacity-head"><strong>个人空间用量</strong><span>31%</span></div><div class="capacity-bar"><i></i></div><div class="capacity-foot">已使用 31.4 GB / 100 GB</div></div></aside>`}'''

topbar_fn = r'''function topbar(){return `<header class="topbar">${breadcrumb()}<div class="top-spacer"></div><div class="global-search" onclick="openModal('globalSearch')">${icon('search')}<input placeholder="搜索文件、成员或知识内容" readonly><span class="kbd">Ctrl K</span></div><button class="top-icon" title="传输任务" onclick="toggleUploads()">${icon('transfer')}</button><button class="top-icon" title="消息中心" onclick="navigate('related')">${icon('bell')}<i class="dot"></i></button><button class="top-icon" title="帮助">${icon('info')}</button><div class="profile-wrap"><button class="avatar profile-trigger" title="张明远" aria-expanded="${state.profileOpen}" onclick="event.stopPropagation();state.profileOpen=!state.profileOpen;state.menu=null;render()">张</button>${state.profileOpen?profileMenu():''}</div></header>`}
function profileMenu(){return `<div class="profile-pop" onclick="event.stopPropagation()"><div class="profile-card-head"><div class="profile-avatar">张</div><div><strong>张明远</strong><span>系统管理员 · 研发中心</span></div></div><div class="menu-sep"></div><button class="profile-item" onclick="state.profileOpen=false;toast('个人资料页正在完善')">${icon('user')}个人资料</button><button class="profile-item" onclick="state.profileOpen=false;toast('账号与安全设置已打开')">${icon('shield')}账号与安全</button><button class="profile-item admin-entry" onclick="state.profileOpen=false;navigate('admin')">${icon('settings')}管理中心<span>管理端</span></button><div class="menu-sep"></div><button class="profile-item danger" onclick="state.profileOpen=false;toast('已安全退出当前账号','warning')">${icon('external')}退出登录</button></div>`}'''

text = replace_function(text, "sidebar", "topbar", sidebar_fn)
text = replace_function(text, "topbar", "motionAllowed", topbar_fn)

text = text.replace(
    "function navigate(page){state.page=page;state.selected=[];state.detail=null;state.menu=null;state.filterOpen=false;if(page!=='collaboration')state.collabDetail=null;render();document.querySelector('.main')?.scrollTo(0,0)}",
    "function navigate(page){state.page=page;state.selected=[];state.detail=null;state.menu=null;state.profileOpen=false;state.personalUploadOpen=false;state.filterOpen=false;if(page!=='collaboration')state.collabDetail=null;render();document.querySelector('.main')?.scrollTo(0,0)}"
)
text = text.replace(
    "uploads:[],profileOpen:false};",
    "uploads:[],profileOpen:false,personalUploadOpen:false};"
)

detail_fn = r'''function detailPane(){if(!state.detail)return'';const f=findFile(state.detail.id,state.detail.space);if(!f)return'';const isPersonal=state.detail.space==='personal';return `<aside class="detail-pane"><div class="detail-head">${isPersonal?'属性详情':'文件详情'}<button class="btn ghost icon-only" onclick="state.detail=null;render()">${icon('x')}</button></div><div class="detail-body"><div class="detail-preview">${fileVisual(f)}<strong>${safe(f.name)}</strong><span class="badge ${f.status==='正常'?'green':'orange'}">${safe(f.status||'正常')}</span></div><div class="info-list"><div class="info-row"><span>文件类型</span><span>${f.type==='folder'?'文件夹':f.type.toUpperCase()+' 文件'}</span></div><div class="info-row"><span>所在位置</span><span>${state.detail.space==='enterprise'?'企业空间 / '+state.dept:state.detail.space==='collab'?'协作空间':'个人空间'}</span></div><div class="info-row"><span>文件大小</span><span>${safe(f.size||'—')}</span></div><div class="info-row"><span>修改时间</span><span>${safe(f.modified)}</span></div><div class="info-row"><span>所有者</span><span>${safe(f.owner||'张明远（本人）')}</span></div><div class="info-row"><span>标签</span><span>${safe(f.tag||'暂无')}</span></div></div>${isPersonal?'':`<div class="detail-actions"><button class="btn" onclick="openModal('preview',{file:findFile('${f.id}','${state.detail.space}')})">${icon('eye')}预览</button><button class="btn" onclick="openModal('share',{file:findFile('${f.id}','${state.detail.space}')})">${icon('link')}分享</button></div>`}</div></aside>`}'''

personal_table_fn = r'''function personalFileTable(files){return `<table class="file-table personal-file-table"><colgroup><col class="personal-check-col"><col class="personal-name-col"><col class="personal-tag-col"><col class="personal-size-col"><col class="personal-time-col"><col class="personal-status-col"><col class="personal-op-col"></colgroup><thead><tr><th class="check-col"><input class="check" type="checkbox" ${state.selected.length&&state.selected.length===files.length?'checked':''} onchange="toggleAll(this.checked,${JSON.stringify(files.map(x=>x.id)).replace(/"/g,'&quot;')})"></th><th><span class="sort-head" onclick="sortBy('name')">名称${sortArrows('name')}</span></th><th>标签</th><th><span class="sort-head" onclick="sortBy('size')">大小${sortArrows('size')}</span></th><th><span class="sort-head" onclick="sortBy('modified')">修改时间${sortArrows('modified')}</span></th><th>状态</th><th class="op-col"></th></tr></thead><tbody>${files.map(f=>`<tr class="${state.selected.includes(f.id)?'selected':''}" onclick="rowClick(event,'${f.id}','personal')" ondblclick="openFile('${f.id}','personal')"><td class="check-col"><input class="check" type="checkbox" ${state.selected.includes(f.id)?'checked':''} onclick="event.stopPropagation();toggleOne('${f.id}',this.checked)"></td><td><div class="file-name">${fileVisual(f)}<div class="file-name-copy"><div class="file-name-title">${safe(f.name)}</div>${f.favorite?'<div class="file-name-meta"><span class="favorite-note">★ 已收藏</span></div>':''}</div></div></td><td><span class="personal-tag">${safe(f.tag||'未分类')}</span></td><td>${f.type==='folder'?'—':safe(f.size||'—')}</td><td>${safe(f.modified)}</td><td><span class="status-dot ${f.status==='正常'?'green':f.status==='受控'?'orange':'red'}"></span>${safe(f.status||'正常')}</td><td class="op-col"><button class="more-btn" aria-label="更多操作" onclick="event.stopPropagation();openMenu(event,'${f.id}','personal')">${icon('more')}</button></td></tr>`).join('')||`<tr><td colspan="7"><div class="empty"><div class="empty-icon">${icon('search')}</div><strong>没有找到匹配内容</strong><p>尝试清除筛选条件或更换关键词</p></div></td></tr>`}</tbody></table>`}'''

personal_fn = r'''function personal(){const files=currentFiles('personal');const filtersActive=state.filters.type!=='all'||state.filters.tag!=='all';return `${pageHead('个人空间','存放个人工作文件与临时资料，默认仅本人可见','',`<span class="badge blue">${icon('lock','icon')}本人可见</span>`)}<div class="tabs personal-tabs"><button class="tab ${state.personalTab==='all'?'active':''}" onclick="setPersonalTab('all')">全部文件</button><button class="tab ${state.personalTab==='recent'?'active':''}" onclick="setPersonalTab('recent')">最近使用</button><button class="tab ${state.personalTab==='favorites'?'active':''}" onclick="setPersonalTab('favorites')">我的收藏</button></div><div class="panel personal-panel" style="position:relative"><div class="personal-toolbar"><div class="upload-split"><button class="btn primary upload-main" onclick="startUpload('personal')">${icon('upload')}上传文件</button><button class="btn primary upload-caret" aria-label="更多上传方式" aria-expanded="${state.personalUploadOpen}" onclick="event.stopPropagation();state.personalUploadOpen=!state.personalUploadOpen;state.profileOpen=false;render()">${icon('down')}</button>${state.personalUploadOpen?`<div class="upload-method-pop" onclick="event.stopPropagation()"><button onclick="state.personalUploadOpen=false;startUpload('personal')">${icon('upload')}上传文件<span>支持多选</span></button><button onclick="state.personalUploadOpen=false;startFolderUpload()">${icon('folder')}上传文件夹<span>保留目录结构</span></button></div>`:''}</div><button class="btn" onclick="openModal('newFolder',{space:'personal'})">${icon('folderPlus')}新建文件夹</button><div class="search-box personal-search">${icon('search')}<input value="${safe(state.query)}" placeholder="搜索当前目录" onkeydown="if(event.key==='Enter'){state.query=this.value;render()}"><button class="btn ghost icon-only" style="width:26px;height:26px" onclick="state.filterOpen=!state.filterOpen;state.personalUploadOpen=false;render()" title="筛选条件">${icon('filter')}</button></div><div class="spacer"></div><div class="view-toggle"><button class="${state.view==='list'?'active':''}" onclick="state.view='list';render()" title="列表视图">${icon('list')}</button><button class="${state.view==='grid'?'active':''}" onclick="state.view='grid';render()" title="网格视图">${icon('grid')}</button></div></div>${state.filterOpen?filterPop():''}${filtersActive?`<div class="filter-summary">当前筛选：${state.filters.type!=='all'?`<span class="filter-chip">${state.filters.type.toUpperCase()} <b onclick="state.filters.type='all';render()">×</b></span>`:''}${state.filters.tag!=='all'?`<span class="filter-chip">${state.filters.tag} <b onclick="state.filters.tag='all';render()">×</b></span>`:''}<button class="btn text" style="margin-left:auto" onclick="clearFilters()">清除筛选</button></div>`:''}${selectionBar('personal')}<div class="pathbar personal-pathbar"><button>个人空间</button><span class="path-hint">根目录</span><span class="count">${files.length} 项</span></div><div class="file-content">${state.view==='list'?`<div class="table-zone">${personalFileTable(files)}</div>`:personalGrid(files)}${detailPane()}</div></div>`}'''

text = replace_function(text, "detailPane", "personal", detail_fn)
if detail_fn + "\nfunction personal()" not in text:
    raise RuntimeError("Could not insert personalFileTable")
text = text.replace(detail_fn + "\nfunction personal()", detail_fn + "\n" + personal_table_fn + "\nfunction personal()", 1)
text = replace_function(text, "personal", "setPersonalTab", personal_fn)

open_menu_fn = r'''function openMenu(e,id,space){const trigger=e.currentTarget||e.target;const rect=trigger.getBoundingClientRect();const width=208;const x=Math.max(10,Math.min(rect.right-width,innerWidth-width-10));const y=Math.max(10,Math.min(rect.bottom+8,innerHeight-420));state.menu={x,y,id,space,type:'file'};state.profileOpen=false;state.personalUploadOpen=false;renderOverlays()}'''
text = replace_function(text, "openMenu", "openCollabMenu", open_menu_fn)

menu_fn = r'''function menuContent(){const m=state.menu;if(m.type==='collab'){const c=collabs.find(x=>x.id===m.id);return `<div class="menu-pop" style="left:${m.x}px;top:${m.y}px"><button class="menu-item" onclick="state.menu=null;openCollab('${m.id}')">${icon('external')}进入空间</button><button class="menu-item" onclick="state.menu=null;openModal('members',{collab:collabs.find(x=>x.id==='${m.id}')})">${icon('users')}成员管理</button><button class="menu-item" onclick="archiveCollab('${m.id}')">${icon('archive')}${c.archived?'恢复空间':'归档空间'}</button><div class="menu-sep"></div><button class="menu-item danger" onclick="state.menu=null;openModal('dissolve',{collab:collabs.find(x=>x.id==='${m.id}')})">${icon('trash')}解散空间</button></div>`}const f=findFile(m.id,m.space);if(!f)return'';const openLabel=f.type==='folder'?'打开':'预览';return `<div class="menu-pop personal-file-menu" style="left:${m.x}px;top:${m.y}px"><button class="menu-item" onclick="state.menu=null;${f.type==='folder'?`openFile('${m.id}','${m.space}')`:`openModal('preview',{file:findFile('${m.id}','${m.space}')})`}">${icon(f.type==='folder'?'folder':'eye')}${openLabel}</button><button class="menu-item" onclick="state.menu=null;toast('已加入下载任务')">${icon('download')}下载</button><button class="menu-item" onclick="state.menu=null;openModal('share',{file:findFile('${m.id}','${m.space}')})">${icon('link')}创建安全外链</button><div class="menu-sep"></div><button class="menu-item" onclick="state.menu=null;openModal('rename',{id:'${m.id}',space:'${m.space}'})">${icon('edit')}重命名</button><button class="menu-item" onclick="state.selected=['${m.id}'];state.menu=null;openModal('move',{space:'${m.space}'})">${icon('move')}移动</button><button class="menu-item" onclick="state.menu=null;copyItem('${m.id}','${m.space}')">${icon('copy')}复制</button>${m.space==='personal'?`<button class="menu-item" onclick="state.menu=null;toggleFavoriteItem('${m.id}')">${icon('star')}${f.favorite?'取消收藏':'添加收藏'}</button>`:''}<button class="menu-item" onclick="state.selected=['${m.id}'];state.menu=null;openModal('tag')">${icon('tag')}设置标签</button>${m.space==='personal'&&f.type==='folder'?`<button class="menu-item" onclick="state.menu=null;openModal('transfer',{id:'${m.id}'})">${icon('transfer')}转移所有权</button>`:''}<button class="menu-item" onclick="state.menu=null;state.detail={id:'${m.id}',space:'${m.space}'};render()">${icon('info')}属性详情</button><div class="menu-sep"></div><button class="menu-item danger" onclick="state.selected=['${m.id}'];state.menu=null;openModal('delete',{space:'${m.space}'})">${icon('trash')}删除</button></div>`}'''
text = replace_function(text, "menuContent", "archiveCollab", menu_fn)

helpers = r'''function startFolderUpload(){state.uploads=[{id:Date.now(),name:'项目资料文件夹',pct:0,speed:'正在扫描目录',space:'personal'}];renderOverlays();let timer=setInterval(()=>{const u=state.uploads[0];if(!u){clearInterval(timer);return}u.pct=Math.min(100,u.pct+18);u.speed=u.pct<100?'正在上传目录文件':'已完成';renderOverlays();if(u.pct>=100){clearInterval(timer);setTimeout(()=>{state.uploads=[];renderOverlays();toast('文件夹上传完成，目录结构已保留')},700)}},360)}
function renameItem(id,space){const f=findFile(id,space);const value=document.getElementById('renameValue')?.value.trim();if(!f||!value)return toast('请输入新的名称','warning');f.name=value;closeModal();toast('名称已更新');render()}
function copyItem(id,space){const f=findFile(id,space);if(!f)return;const copy={...f,id:'copy'+Date.now(),name:f.name.replace(/(\.[^.]+)?$/,m=>` - 副本${m||''}`),modified:'2026-06-23 11:36'};if(space==='enterprise')enterpriseFiles[state.dept].unshift(copy);else if(space==='collab')collabFiles.unshift(copy);else personalFiles.unshift({...copy,favorite:false});toast('已创建副本');render()}
function toggleFavoriteItem(id){const f=personalFiles.find(x=>x.id===id);if(!f)return;f.favorite=!f.favorite;toast(f.favorite?'已添加到我的收藏':'已取消收藏');render()}
function transferItem(id){const f=personalFiles.find(x=>x.id===id);const member=document.getElementById('transferMember')?.value;if(!f||!member)return toast('请选择接收成员','warning');personalFiles=personalFiles.filter(x=>x.id!==id);state.detail=null;closeModal();toast(`“${f.name}”已转移给${member}`);render()}'''
if "\nfunction startUpload(space){" not in text:
    raise RuntimeError("Could not insert personal helpers")
text = text.replace("\nfunction startUpload(space){", "\n" + helpers + "\nfunction startUpload(space){", 1)

needle = "}else if(type==='share'){"
rename_branch = r'''}else if(type==='rename'){const f=findFile(payload.id,payload.space);title='重命名';body=`<div class="field"><label>新名称</label><input class="input" id="renameValue" value="${safe(f?.name||'')}" autofocus></div><p class="help">请保留正确的文件扩展名，名称不能包含特殊字符。</p>`;foot=`<button class="btn" onclick="closeModal()">取消</button><button class="btn primary" onclick="renameItem('${payload.id}','${payload.space}')">保存</button>`}else if(type==='transfer'){const f=personalFiles.find(x=>x.id===payload.id);title='转移文件夹所有权';body=`<div class="notice" style="margin-bottom:14px">转移后，“<b>${safe(f?.name||'')}</b>”及其子项将从你的个人空间移除，接收人获得所有权。</div><div class="field"><label>接收成员</label><select class="select" id="transferMember"><option value="">请选择成员</option><option>李晓华</option><option>周凯</option><option>许欣</option></select></div>`;foot=`<button class="btn" onclick="closeModal()">取消</button><button class="btn danger" onclick="transferItem('${payload.id}')">确认转移</button>`}else if(type==='share'){'''
if needle not in text:
    raise RuntimeError("Could not extend modalContent")
text = text.replace(needle, rename_branch, 1)

old_click = "document.addEventListener('click',e=>{if(state.menu&&!e.target.closest('.menu-pop')&&!e.target.closest('.more-btn')){state.menu=null;renderOverlays()}});"
new_click = "document.addEventListener('click',e=>{let changed=false;if(state.menu&&!e.target.closest('.menu-pop')&&!e.target.closest('.more-btn')){state.menu=null;changed=true}if(state.profileOpen&&!e.target.closest('.profile-wrap')){state.profileOpen=false;changed=true}if(state.personalUploadOpen&&!e.target.closest('.upload-split')){state.personalUploadOpen=false;changed=true}if(changed)render()});"
if old_click not in text:
    raise RuntimeError("Could not update outside-click handler")
text = text.replace(old_click, new_click, 1)

css = r'''
/* personal-space-refinement-v4: targeted personal-space improvements */
.profile-wrap{position:relative;display:flex;align-items:center}
.profile-trigger{border:0;cursor:pointer;transition:transform .18s ease,box-shadow .18s ease}
.profile-trigger:hover{transform:translateY(-1px);box-shadow:0 7px 18px rgba(27,71,126,.16)}
.profile-pop{position:absolute;z-index:1400;right:0;top:48px;width:244px;padding:8px;border:1px solid #dce6f1;border-radius:14px;background:rgba(255,255,255,.98);box-shadow:0 22px 58px rgba(21,48,82,.18);backdrop-filter:blur(18px)}
.profile-card-head{display:flex;align-items:center;gap:11px;padding:10px}
.profile-avatar{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(145deg,#e5efff,#c9dcf8);color:#245b9c;font-weight:700}
.profile-card-head strong{display:block;color:#20344e;font-size:13px}.profile-card-head span{display:block;margin-top:4px;color:#8a98aa;font-size:10px}
.profile-item{width:100%;height:39px;border:0;border-radius:9px;background:transparent;color:#4a5e76;display:flex;align-items:center;gap:10px;padding:0 10px;text-align:left;font-size:12px}
.profile-item:hover{background:#f1f6fd;color:#1769ff}.profile-item>span:last-child{margin-left:auto;padding:2px 6px;border-radius:5px;background:#edf5ff;color:#4f80bc;font-size:9px}.profile-item.danger{color:#cf4a51}
.personal-tabs{margin-bottom:14px}
.personal-panel{min-height:calc(100vh - 225px);border-radius:16px;box-shadow:0 10px 30px rgba(35,68,106,.055)}
.personal-toolbar{height:70px;gap:10px;padding:0 18px;background:#fff}
.upload-split{position:relative;display:flex}.upload-main{border-radius:10px 0 0 10px!important;padding-right:13px}.upload-caret{width:36px;padding:0!important;border-left:1px solid rgba(255,255,255,.25)!important;border-radius:0 10px 10px 0!important}
.upload-method-pop{position:absolute;z-index:80;left:0;top:47px;width:214px;padding:7px;border:1px solid #dce6f1;border-radius:12px;background:#fff;box-shadow:0 18px 44px rgba(24,51,84,.17)}
.upload-method-pop button{width:100%;min-height:45px;border:0;border-radius:9px;background:transparent;color:#40546e;display:grid;grid-template-columns:20px 1fr;grid-template-rows:auto auto;column-gap:9px;padding:7px 9px;text-align:left}
.upload-method-pop button:hover{background:#f0f6ff;color:#1769ff}.upload-method-pop button .icon{grid-row:1/3;align-self:center}.upload-method-pop button span{grid-column:2;color:#98a5b5;font-size:9px;margin-top:2px}
.personal-search{width:min(520px,42vw);margin-left:12px}
.personal-pathbar{height:45px}.personal-pathbar .path-hint{margin-left:8px;color:#a0acbc;font-size:11px}.personal-pathbar .path-hint:before{content:"/";margin-right:8px;color:#c1cad6}
.personal-file-table{table-layout:fixed}.personal-file-table col.personal-check-col{width:46px}.personal-file-table col.personal-name-col{width:auto}.personal-file-table col.personal-tag-col{width:130px}.personal-file-table col.personal-size-col{width:110px}.personal-file-table col.personal-time-col{width:176px}.personal-file-table col.personal-status-col{width:104px}.personal-file-table col.personal-op-col{width:58px}
.personal-file-table th,.personal-file-table td{padding-left:14px;padding-right:14px}.personal-file-table td{height:66px}.personal-file-table .file-name{gap:12px}.personal-file-table .file-name-title{font-size:13px;font-weight:620;color:#2a405b}
.personal-file-table .file-symbol{width:42px;height:44px;border-radius:11px;background:#f7f9fc;box-shadow:0 4px 10px rgba(35,68,106,.06),inset 0 1px rgba(255,255,255,.9)}
.personal-file-table .file-symbol iconify-icon{font-size:31px}.personal-file-table .file-symbol.folder{width:44px;height:42px;background:linear-gradient(145deg,#fffaf0,#fff3d5);border-color:#f0dca9}.personal-file-table .file-symbol.folder iconify-icon{font-size:34px}
.personal-tag{display:inline-flex;align-items:center;height:24px;padding:0 9px;border-radius:7px;background:#f1f6fd;color:#527aa8;font-size:10px;font-weight:600;white-space:nowrap}.favorite-note{color:#d6921e;font-size:10px}
.personal-file-table .more-btn{opacity:0}.personal-file-table tr:hover .more-btn,.personal-file-table tr.selected .more-btn{opacity:1}
.personal-file-menu{width:208px}.personal-file-menu .menu-item{height:37px}
.personal-panel .detail-pane{width:326px}.personal-panel .detail-actions{display:none}
@media(max-width:1260px){.personal-file-table col.personal-tag-col{width:105px}.personal-file-table col.personal-time-col{width:158px}.personal-search{width:340px}}
@media(max-width:1050px){.personal-file-table col.personal-tag-col{display:none}.personal-file-table th:nth-child(3),.personal-file-table td:nth-child(3){display:none}.personal-search{width:280px}}
'''

style_close = text.rfind("</style>")
if style_close == -1:
    raise RuntimeError("Missing </style>")
text = text[:style_close] + css + "\n" + text[style_close:]

if text == original:
    raise RuntimeError("No changes made")

path.write_text(text, encoding="utf-8")
print("Applied personal space refinement:", len(original), "->", len(text))
