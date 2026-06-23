from pathlib import Path
import re

path = Path('web-prototype.html')
html = path.read_text(encoding='utf-8')
MARKER = 'personal-space-v6-information-layout'

if MARKER in html:
    print('personal space v6 already applied')
    raise SystemExit(0)


def replace_function(source: str, name: str, next_name: str, replacement: str) -> str:
    pattern = rf"function {re.escape(name)}\([\s\S]*?(?=\nfunction {re.escape(next_name)}\()"
    updated, count = re.subn(pattern, replacement.rstrip(), source, count=1)
    if count != 1:
        raise RuntimeError(f'could not replace {name}: {count}')
    return updated

# Extend state with folder pagination without introducing a second state system.
html = html.replace(
    "personalUploadOpen:false};",
    "personalUploadOpen:false,personalPage:1,personalPageSize:10};",
    1,
)

# Use a known Iconify folder icon. Keep the existing local fallback.
html = html.replace("folder:'fluent-color:folder-24'", "folder:'vscode-icons:default-folder'", 1)

# Personal-space data now demonstrates real folder navigation and useful access/activity metadata.
personal_data = r'''let personalFiles=[
 {id:'p1',type:'folder',name:'我的项目资料',parent:'',modified:'2026-06-23 09:18',size:'—',favorite:true,tag:'项目',status:'正常',access:'private',activity:'今天 09:18 · 整理目录'},
 {id:'p2',type:'folder',name:'临时文件',parent:'',modified:'2026-06-22 18:04',size:'—',favorite:false,tag:'临时',status:'正常',access:'private',activity:'昨天 18:04 · 新增 2 项'},
 {id:'p3',type:'doc',name:'个人工作计划.docx',parent:'',modified:'2026-06-23 08:32',size:'328 KB',favorite:true,tag:'计划',status:'正常',access:'private',activity:'今天 08:32 · 编辑'},
 {id:'p4',type:'pdf',name:'产品调研记录.pdf',parent:'',modified:'2026-06-22 16:45',size:'4.2 MB',favorite:false,tag:'调研',status:'正常',access:'link',activity:'昨天 16:45 · 创建外链'},
 {id:'p5',type:'xls',name:'任务跟踪表.xlsx',parent:'',modified:'2026-06-21 14:20',size:'736 KB',favorite:true,tag:'任务',status:'正常',access:'private',activity:'06-21 14:20 · 更新'},
 {id:'p6',type:'ppt',name:'周例会汇报.pptx',parent:'',modified:'2026-06-20 17:08',size:'8.9 MB',favorite:false,tag:'汇报',status:'正常',access:'shared',activity:'06-20 17:08 · 共享给 2 人'},
 {id:'p7',type:'img',name:'原型评审批注.png',parent:'',modified:'2026-06-19 10:52',size:'2.3 MB',favorite:false,tag:'设计',status:'正常',access:'private',activity:'06-19 10:52 · 上传'},
 {id:'p8',type:'md',name:'技术备忘录.md',parent:'',modified:'2026-06-18 18:11',size:'84 KB',favorite:false,tag:'技术',status:'正常',access:'private',activity:'06-18 18:11 · 编辑'},
 {id:'p11',type:'folder',name:'需求文档',parent:'我的项目资料',modified:'2026-06-23 09:02',size:'—',favorite:false,tag:'需求',status:'正常',access:'private',activity:'今天 09:02 · 新增 2 项'},
 {id:'p12',type:'folder',name:'评审材料',parent:'我的项目资料',modified:'2026-06-22 17:36',size:'—',favorite:false,tag:'评审',status:'正常',access:'private',activity:'昨天 17:36 · 整理目录'},
 {id:'p13',type:'doc',name:'项目里程碑计划.docx',parent:'我的项目资料',modified:'2026-06-23 08:56',size:'426 KB',favorite:true,tag:'计划',status:'正常',access:'private',activity:'今天 08:56 · 编辑'},
 {id:'p14',type:'xls',name:'项目任务分解表.xlsx',parent:'我的项目资料',modified:'2026-06-22 16:18',size:'812 KB',favorite:false,tag:'任务',status:'正常',access:'shared',activity:'昨天 16:18 · 共享给 3 人'},
 {id:'p111',type:'doc',name:'个人空间需求说明.docx',parent:'我的项目资料/需求文档',modified:'2026-06-23 09:01',size:'1.2 MB',favorite:false,tag:'需求',status:'正常',access:'private',activity:'今天 09:01 · 编辑'},
 {id:'p112',type:'pdf',name:'交互流程确认稿.pdf',parent:'我的项目资料/需求文档',modified:'2026-06-22 19:32',size:'3.6 MB',favorite:false,tag:'评审',status:'正常',access:'link',activity:'昨天 19:32 · 创建外链'},
 {id:'p121',type:'ppt',name:'第一轮评审汇报.pptx',parent:'我的项目资料/评审材料',modified:'2026-06-22 17:30',size:'6.5 MB',favorite:false,tag:'汇报',status:'正常',access:'private',activity:'昨天 17:30 · 上传'},
 {id:'p21',type:'zip',name:'界面截图归档.zip',parent:'临时文件',modified:'2026-06-22 18:02',size:'36 MB',favorite:false,tag:'临时',status:'正常',access:'private',activity:'昨天 18:02 · 上传'},
 {id:'p22',type:'img',name:'临时评审批注.png',parent:'临时文件',modified:'2026-06-22 17:58',size:'1.8 MB',favorite:false,tag:'临时',status:'正常',access:'private',activity:'昨天 17:58 · 上传'}
];'''
html, count = re.subn(r"let personalFiles=\[[\s\S]*?\n\];", personal_data, html, count=1)
if count != 1:
    raise RuntimeError('personal data replacement failed')

current_files_fn = r'''function currentFiles(space='enterprise'){let arr=space==='enterprise'?(enterpriseFiles[state.dept]||[]):personalFiles;if(space==='personal'){const currentPath=state.folder.join('/');arr=arr.filter(x=>(x.parent||'')===currentPath)}if(state.query){arr=arr.filter(x=>x.name.toLowerCase().includes(state.query.toLowerCase()))}if(space==='personal'){if(state.personalTab==='recent')arr=arr.slice().sort((a,b)=>b.modified.localeCompare(a.modified));if(state.personalTab==='favorites')arr=arr.filter(x=>x.favorite);if(state.filters.type!=='all')arr=arr.filter(x=>x.type===state.filters.type);if(state.filters.tag!=='all')arr=arr.filter(x=>x.tag===state.filters.tag)}arr=arr.slice().sort((a,b)=>{let av=a[state.sort.key]||'',bv=b[state.sort.key]||'';return state.sort.dir==='asc'?String(av).localeCompare(String(bv),'zh-CN'):String(bv).localeCompare(String(av),'zh-CN')});return arr}'''
html = replace_function(html, 'currentFiles', 'enterprise', current_files_fn)

helpers = r'''function personalCurrentPath(){return state.folder.join('/')}
function personalFolderCount(file){const path=[file.parent,file.name].filter(Boolean).join('/');const children=personalFiles.filter(x=>(x.parent||'')===path);const folders=children.filter(x=>x.type==='folder').length;return children.length?`${children.length} 项${folders?` · ${folders} 个文件夹`:''}`:'空文件夹'}
function personalFileType(file){return {folder:'文件夹',doc:'Word 文档',pdf:'PDF 文档',xls:'Excel 表格',ppt:'演示文稿',img:'图片',zip:'压缩包',mp4:'视频',md:'Markdown'}[file.type]||'文件'}
function personalActivity(file){return file.type==='folder'?personalFolderCount(file):(file.activity||`${file.modified} · ${personalFileType(file)}`)}
function personalTag(file){const tone={项目:'blue',计划:'cyan',临时:'gray',调研:'purple',任务:'green',汇报:'orange',设计:'pink',技术:'slate',需求:'blue',评审:'purple'}[file.tag]||'gray';return `<span class="personal-tag tag-${tone}">${icon('tag')}<span>${safe(file.tag||'未设置')}</span></span>`}
function personalAccess(file){const type=file.access||'private';const map={private:['lock','仅本人','private'],link:['link','已外链','link'],shared:['share','已共享','shared']};const item=map[type]||map.private;return `<span class="access-pill access-${item[2]}">${icon(item[0])}<span>${item[1]}</span></span>`}
function personalPageFiles(files){const pages=Math.max(1,Math.ceil(files.length/state.personalPageSize));state.personalPage=Math.min(Math.max(1,state.personalPage),pages);const start=(state.personalPage-1)*state.personalPageSize;return files.slice(start,start+state.personalPageSize)}
function personalPagination(total){const pages=Math.max(1,Math.ceil(total/state.personalPageSize));const start=total?(state.personalPage-1)*state.personalPageSize+1:0;const end=Math.min(total,state.personalPage*state.personalPageSize);const nums=[];for(let i=1;i<=pages;i++)nums.push(`<button class="page-number ${state.personalPage===i?'active':''}" onclick="changePersonalPage(${i})">${i}</button>`);return `<footer class="personal-pagination"><div class="page-summary">共 ${total} 项 · 当前显示 ${start}-${end}</div><div class="page-size"><span>每页</span><select onchange="changePersonalPageSize(this.value)"><option value="10" ${state.personalPageSize===10?'selected':''}>10 条</option><option value="20" ${state.personalPageSize===20?'selected':''}>20 条</option><option value="50" ${state.personalPageSize===50?'selected':''}>50 条</option></select></div><div class="page-controls"><button class="page-arrow" ${state.personalPage<=1?'disabled':''} onclick="changePersonalPage(${state.personalPage-1})">${icon('left')}</button>${nums.join('')}<button class="page-arrow" ${state.personalPage>=pages?'disabled':''} onclick="changePersonalPage(${state.personalPage+1})">${icon('right')}</button></div></footer>`}
function changePersonalPage(page){const total=currentFiles('personal').length;const pages=Math.max(1,Math.ceil(total/state.personalPageSize));state.personalPage=Math.min(Math.max(1,page),pages);state.selected=[];state.detail=null;render()}
function changePersonalPageSize(size){state.personalPageSize=Number(size)||10;state.personalPage=1;state.selected=[];state.detail=null;render()}
function goPersonalFolder(level){state.folder=level<0?[]:state.folder.slice(0,level+1);state.personalPage=1;state.selected=[];state.detail=null;state.menu=null;render()}
function personalPathbar(total){return `<div class="pathbar personal-pathbar"><button onclick="goPersonalFolder(-1)">${icon('home')}个人空间</button>${state.folder.map((name,index)=>`<span class="path-sep">/</span><button class="${index===state.folder.length-1?'current':''}" onclick="goPersonalFolder(${index})">${safe(name)}</button>`).join('')}<span class="path-context">${state.folder.length?'当前文件夹':'根目录'}</span><span class="count">${total} 项</span></div>`}
function personalBulkControl(){const count=state.selected.length;return `<div class="personal-bulk-wrap"><button class="btn personal-bulk-trigger" ${count?'':'disabled'} onclick="togglePersonalBulkMenu(event)">${icon('layers')}<span class="personal-bulk-label">${count?`已选 ${count} 项`:'批量操作'}</span>${icon('down')}</button><div class="personal-bulk-menu" onclick="event.stopPropagation()"><button onclick="closePersonalBulkMenu();toast('已加入 '+state.selected.length+' 个下载任务')">${icon('download')}下载</button><button onclick="closePersonalBulkMenu();openModal('destination',{space:'personal',mode:'move'})">${icon('move')}移动到</button><button onclick="closePersonalBulkMenu();openModal('destination',{space:'personal',mode:'copy'})">${icon('copy')}复制到</button><div class="menu-sep"></div><button onclick="closePersonalBulkMenu();toggleFavoriteSelected()">${icon('star')}添加到收藏</button><button onclick="closePersonalBulkMenu();openModal('tag')">${icon('tag')}设置标签</button><div class="menu-sep"></div><button class="danger" onclick="closePersonalBulkMenu();openModal('delete',{space:'personal'})">${icon('trash')}删除</button></div></div>`}
function togglePersonalBulkMenu(event){event.stopPropagation();const wrap=event.currentTarget.closest('.personal-bulk-wrap');if(!wrap||event.currentTarget.disabled)return;document.querySelectorAll('.personal-bulk-wrap.open').forEach(x=>{if(x!==wrap)x.classList.remove('open')});wrap.classList.toggle('open')}
function closePersonalBulkMenu(){document.querySelectorAll('.personal-bulk-wrap.open').forEach(x=>x.classList.remove('open'))}'''
html = html.replace('\nfunction personalFileTable(files){', '\n' + helpers + '\nfunction personalFileTable(files){', 1)

personal_table_fn = r'''function personalFileTable(files){return `<table class="file-table personal-file-table"><colgroup><col class="personal-check-col"><col class="personal-name-col"><col class="personal-activity-col"><col class="personal-tag-col"><col class="personal-size-col"><col class="personal-time-col"><col class="personal-status-col"><col class="personal-op-col"></colgroup><thead><tr><th class="check-col"><input class="check" type="checkbox" ${state.selected.length&&state.selected.length===files.length?'checked':''} onchange="toggleAll(this.checked,${JSON.stringify(files.map(x=>x.id)).replace(/"/g,'&quot;')})"></th><th><span class="sort-head" onclick="sortBy('name')">名称${sortMark('name')}</span></th><th>最近活动</th><th>标签</th><th><span class="sort-head" onclick="sortBy('size')">大小${sortMark('size')}</span></th><th><span class="sort-head" onclick="sortBy('modified')">修改时间${sortMark('modified')}</span></th><th>访问状态</th><th class="op-col"></th></tr></thead><tbody>${files.map(f=>`<tr data-file-id="${f.id}" class="${state.selected.includes(f.id)?'selected':''}" onclick="rowClick(event,'${f.id}','personal')" ondblclick="openFile('${f.id}','personal')" oncontextmenu="openMenu(event,'${f.id}','personal')"><td class="check-col"><input class="check" type="checkbox" ${state.selected.includes(f.id)?'checked':''} onclick="event.stopPropagation();toggleOne('${f.id}',this.checked)"></td><td><div class="file-name">${fileVisual(f)}<div class="file-name-copy"><button class="file-entry-link" onclick="event.stopPropagation();openFile('${f.id}','personal')">${safe(f.name)}</button><div class="file-name-meta"><span>${personalFileType(f)}</span>${f.favorite?'<span class="favorite-note">★ 已收藏</span>':''}</div></div></div></td><td><div class="activity-cell">${icon('clock')}<span>${safe(personalActivity(f))}</span></div></td><td>${personalTag(f)}</td><td>${f.type==='folder'?'—':safe(f.size||'—')}</td><td>${safe(f.modified)}</td><td>${personalAccess(f)}</td><td class="op-col"><button class="more-btn" aria-label="更多操作" onclick="event.stopPropagation();openMenu(event,'${f.id}','personal')">${icon('more')}</button></td></tr>`).join('')||`<tr><td colspan="8"><div class="empty"><div class="empty-icon">${icon('search')}</div><strong>当前目录暂无内容</strong><p>可以上传文件或新建文件夹开始整理</p></div></td></tr>`}</tbody></table>`}'''
html = replace_function(html, 'personalFileTable', 'personal', personal_table_fn)

personal_fn = r'''function personal(){const allFiles=currentFiles('personal');const files=personalPageFiles(allFiles);const filtersActive=state.filters.type!=='all'||state.filters.tag!=='all';return `${pageHead('个人空间','存放个人工作文件与临时资料，默认仅本人可见','',`<span class="badge blue">${icon('lock','icon')}本人可见</span>`)}<div class="tabs personal-tabs"><button class="tab ${state.personalTab==='all'?'active':''}" onclick="setPersonalTab('all')">全部文件</button><button class="tab ${state.personalTab==='recent'?'active':''}" onclick="setPersonalTab('recent')">最近使用</button><button class="tab ${state.personalTab==='favorites'?'active':''}" onclick="setPersonalTab('favorites')">我的收藏</button></div><div class="panel personal-panel" style="position:relative"><div class="personal-toolbar"><div class="upload-split"><button class="btn primary upload-main" onclick="startUpload('personal')">${icon('upload')}上传文件</button><button class="btn primary upload-caret" aria-label="更多上传方式" aria-expanded="${state.personalUploadOpen}" onclick="event.stopPropagation();state.personalUploadOpen=!state.personalUploadOpen;state.profileOpen=false;render()">${icon('down')}</button>${state.personalUploadOpen?`<div class="upload-method-pop" onclick="event.stopPropagation()"><button onclick="state.personalUploadOpen=false;startUpload('personal')">${icon('upload')}<span class="upload-option-copy"><strong>上传文件</strong><small>支持多选</small></span></button><button onclick="state.personalUploadOpen=false;startFolderUpload()">${icon('folder')}<span class="upload-option-copy"><strong>上传文件夹</strong><small>保留目录结构</small></span></button></div>`:''}</div><button class="btn" onclick="openModal('newFolder',{space:'personal'})">${icon('folderPlus')}新建文件夹</button>${personalBulkControl()}<div class="search-box personal-search">${icon('search')}<input value="${safe(state.query)}" placeholder="搜索当前目录" onkeydown="if(event.key==='Enter'){state.query=this.value;state.personalPage=1;render()}"><button class="btn ghost icon-only" style="width:26px;height:26px" onclick="state.filterOpen=!state.filterOpen;state.personalUploadOpen=false;render()" title="筛选条件">${icon('filter')}</button></div><div class="spacer"></div><div class="view-toggle"><button class="${state.view==='list'?'active':''}" onclick="state.view='list';render()" title="列表视图">${icon('list')}</button><button class="${state.view==='grid'?'active':''}" onclick="state.view='grid';render()" title="网格视图">${icon('grid')}</button></div></div>${state.filterOpen?filterPop():''}${filtersActive?`<div class="filter-summary">当前筛选：${state.filters.type!=='all'?`<span class="filter-chip">${state.filters.type.toUpperCase()} <b onclick="state.filters.type='all';state.personalPage=1;render()">×</b></span>`:''}${state.filters.tag!=='all'?`<span class="filter-chip">${state.filters.tag} <b onclick="state.filters.tag='all';state.personalPage=1;render()">×</b></span>`:''}<button class="btn text" style="margin-left:auto" onclick="clearFilters()">清除筛选</button></div>`:''}${personalPathbar(allFiles.length)}<div class="file-content personal-file-content">${state.view==='list'?`<div class="table-zone">${personalFileTable(files)}</div>`:personalGrid(files)}${detailPane()}</div>${personalPagination(allFiles.length)}</div>`}'''
html = replace_function(html, 'personal', 'setPersonalTab', personal_fn)

set_tab_fn = r'''function setPersonalTab(t){state.personalTab=t;state.personalPage=1;state.selected=[];state.detail=null;render()}'''
html = replace_function(html, 'setPersonalTab', 'filterPop', set_tab_fn)

apply_filters_fn = r'''function applyFilters(){state.filters.type=document.getElementById('filterType').value;state.filters.tag=document.getElementById('filterTag').value;state.filterOpen=false;state.personalPage=1;state.selected=[];render()}'''
html = replace_function(html, 'applyFilters', 'clearFilters', apply_filters_fn)
clear_filters_fn = r'''function clearFilters(){state.filters={type:'all',tag:'all'};state.filterOpen=false;state.personalPage=1;state.selected=[];render()}'''
html = replace_function(html, 'clearFilters', 'personalGrid', clear_filters_fn)

personal_grid_fn = r'''function personalGrid(files){return `<div class="grid-zone"><div class="file-grid">${files.map(f=>`<div data-file-id="${f.id}" class="file-card ${state.selected.includes(f.id)?'selected':''}" onclick="rowClick(event,'${f.id}','personal')" ondblclick="openFile('${f.id}','personal')" oncontextmenu="openMenu(event,'${f.id}','personal')"><input class="check" type="checkbox" ${state.selected.includes(f.id)?'checked':''} onclick="event.stopPropagation();toggleOne('${f.id}',this.checked)"><button class="more-btn" onclick="event.stopPropagation();openMenu(event,'${f.id}','personal')">${icon('more')}</button>${fileVisual(f)}<button class="file-card-name file-entry-link" onclick="event.stopPropagation();openFile('${f.id}','personal')">${safe(f.name)}</button><div class="file-card-meta"><span>${f.type==='folder'?personalFolderCount(f):safe(f.size||'—')}</span><span>${safe(f.modified.slice(5,10))}</span></div><div class="file-card-access">${personalAccess(f)}</div></div>`).join('')}</div></div>`}'''
html = replace_function(html, 'personalGrid', 'collaboration', personal_grid_fn)

open_file_fn = r'''function openFile(id,space){const f=findFile(id,space);if(!f)return;if(f.type==='folder'){if(space==='personal'){state.folder.push(f.name);state.personalPage=1;state.selected=[];state.detail=null;state.menu=null;render()}else{state.folder.push(f.name);toast(`已进入文件夹「${f.name}」`);render()}}else openModal('preview',{file:f})}'''
html = replace_function(html, 'openFile', 'findFile', open_file_fn)

sync_fn = r'''function syncPersonalSelection(){const ids=new Set(state.selected);document.querySelectorAll('.personal-file-table tbody tr[data-file-id],.file-card[data-file-id]').forEach(el=>{const selected=ids.has(el.dataset.fileId);el.classList.toggle('selected',selected);const check=el.querySelector('.check');if(check)check.checked=selected});const all=document.querySelector('.personal-file-table thead .check');if(all){const rows=[...document.querySelectorAll('.personal-file-table tbody tr[data-file-id]')];all.checked=rows.length>0&&rows.every(row=>ids.has(row.dataset.fileId));all.indeterminate=ids.size>0&&!all.checked}const trigger=document.querySelector('.personal-bulk-trigger');const label=document.querySelector('.personal-bulk-label');if(trigger){trigger.disabled=ids.size===0;if(label)label.textContent=ids.size?`已选 ${ids.size} 项`:'批量操作'}if(!ids.size)closePersonalBulkMenu()}'''
html = replace_function(html, 'syncPersonalSelection', 'showSelectedDetail', sync_fn)

# New folders are created in the current personal directory.
html = html.replace(
    "const f={id:'new'+Date.now(),type:'folder',name,modified:'2026-06-23 10:30',owner:'张明远',status:'正常',tag:''};",
    "const f={id:'new'+Date.now(),type:'folder',name,modified:'2026-06-23 10:30',owner:'张明远',status:'正常',tag:'未分类',access:'private',activity:'刚刚 · 新建文件夹',parent:space==='personal'?personalCurrentPath():''};",
    1,
)

# Per-row menu remains the single-item command center. Move/copy now both use the hierarchy picker.
html = html.replace(
    "openModal('move',{space:'${m.space}'})",
    "openModal('destination',{space:'${m.space}',mode:'move'})",
    1,
)
html = html.replace(
    "${icon('copy')}复制</button>${m.space==='personal'?",
    "${icon('copy')}复制到</button>${m.space==='personal'?",
    1,
)
html = html.replace(
    "onclick=\"state.menu=null;copyItem('${m.id}','${m.space}')\"",
    "onclick=\"state.selected=['${m.id}'];state.menu=null;openModal('destination',{space:'${m.space}',mode:'copy'})\"",
    1,
)

# Close the compact batch popover without rebuilding the page.
old_click = "document.addEventListener('click',e=>{let changed=false;if(state.menu&&!e.target.closest('.menu-pop')&&!e.target.closest('.more-btn')){state.menu=null;changed=true}if(state.profileOpen&&!e.target.closest('.profile-wrap')){state.profileOpen=false;changed=true}if(state.personalUploadOpen&&!e.target.closest('.upload-split')){state.personalUploadOpen=false;changed=true}if(changed)render()});"
new_click = "document.addEventListener('click',e=>{if(!e.target.closest('.personal-bulk-wrap'))closePersonalBulkMenu();let changed=false;if(state.menu&&!e.target.closest('.menu-pop')&&!e.target.closest('.more-btn')){state.menu=null;changed=true}if(state.profileOpen&&!e.target.closest('.profile-wrap')){state.profileOpen=false;changed=true}if(state.personalUploadOpen&&!e.target.closest('.upload-split')){state.personalUploadOpen=false;changed=true}if(changed)render()});"
if old_click not in html:
    raise RuntimeError('outside click handler not found')
html = html.replace(old_click, new_click, 1)

css = r'''
/* personal-space-v6-information-layout */
.personal-panel{display:flex;flex-direction:column;min-height:calc(100vh - 225px);overflow:visible}
.personal-toolbar{position:relative;z-index:24;flex:none}.personal-search{width:min(420px,31vw);margin-left:4px}
.personal-bulk-wrap{position:relative;flex:none}.personal-bulk-trigger{min-width:118px;justify-content:space-between}.personal-bulk-trigger>.icon-stack:first-child{color:#607a99}.personal-bulk-trigger:disabled{opacity:.58;background:#f8fafc;color:#8998aa}.personal-bulk-menu{position:absolute;z-index:110;left:0;top:46px;width:190px;padding:7px;border:1px solid #dce6f1;border-radius:12px;background:#fff;box-shadow:0 18px 44px rgba(24,51,84,.17);opacity:0;visibility:hidden;transform:translateY(-5px);transition:.14s ease}.personal-bulk-wrap.open .personal-bulk-menu{opacity:1;visibility:visible;transform:none}.personal-bulk-menu button{width:100%;height:36px;border:0;border-radius:8px;background:transparent;color:#445a74;display:flex;align-items:center;gap:9px;padding:0 10px;text-align:left;font-size:12px}.personal-bulk-menu button:hover{background:#f1f6fd;color:#1769ff}.personal-bulk-menu button.danger{color:#d84a50}.personal-bulk-menu button.danger:hover{background:#fff1f2;color:#c83b42}
.personal-pathbar{flex:none}.personal-pathbar button{display:inline-flex;align-items:center;gap:5px}.personal-pathbar button.current{color:#344b65;font-weight:620}.personal-pathbar .path-sep{padding:0 2px;color:#bdc7d3}.personal-pathbar .path-context{margin-left:10px;padding-left:10px;border-left:1px solid #e6edf5;color:#9aa7b7;font-size:10px}
.personal-file-content{flex:1;min-height:0;align-items:stretch}.personal-file-content>.table-zone,.personal-file-content>.grid-zone{min-height:0}
.personal-file-table{table-layout:fixed}.personal-file-table col.personal-check-col{width:46px}.personal-file-table col.personal-name-col{width:29%}.personal-file-table col.personal-activity-col{width:20%}.personal-file-table col.personal-tag-col{width:118px}.personal-file-table col.personal-size-col{width:92px}.personal-file-table col.personal-time-col{width:168px}.personal-file-table col.personal-status-col{width:118px}.personal-file-table col.personal-op-col{width:56px}.personal-file-table td{height:66px}.personal-file-table th,.personal-file-table td{padding-left:12px;padding-right:12px}.personal-file-table .file-name{gap:11px}.personal-file-table .file-name-copy{min-width:0}.file-entry-link{border:0;background:transparent;color:#2b405a;padding:0;font:inherit;font-weight:650;text-align:left;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}.file-entry-link:hover{color:#1769ff;text-decoration:underline;text-underline-offset:3px}.file-name-meta{display:flex;align-items:center;gap:7px;margin-top:5px;color:#95a2b2;font-size:10px}.activity-cell{display:flex;align-items:center;gap:7px;color:#71839a;min-width:0;font-size:11px}.activity-cell>.icon-stack{color:#9aa9ba}.activity-cell span:last-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.personal-tag{display:inline-flex;align-items:center;gap:5px;max-width:100%;height:25px;padding:0 8px;border:1px solid transparent;border-radius:7px;font-size:10px;font-weight:600;white-space:nowrap}.personal-tag>.icon-stack{width:13px;height:13px}.personal-tag.tag-blue{background:#eef5ff;color:#4b7fbf;border-color:#deebfb}.personal-tag.tag-cyan{background:#eef9fb;color:#3f8391;border-color:#dceff2}.personal-tag.tag-gray{background:#f3f5f7;color:#758397;border-color:#e7ebef}.personal-tag.tag-purple{background:#f5f1fb;color:#765da0;border-color:#e9e0f5}.personal-tag.tag-green{background:#edf8f3;color:#4f866d;border-color:#daeee4}.personal-tag.tag-orange{background:#fff5e9;color:#a87335;border-color:#f4e5cf}.personal-tag.tag-pink{background:#fff1f5;color:#a85e77;border-color:#f5dee6}.personal-tag.tag-slate{background:#f0f3f7;color:#5f7188;border-color:#e1e7ee}
.access-pill{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 8px;border-radius:8px;font-size:10px;font-weight:600;white-space:nowrap}.access-pill>.icon-stack{width:13px;height:13px}.access-private{background:#f2f5f8;color:#6c7d91}.access-link{background:#eef5ff;color:#3977be}.access-shared{background:#edf8f3;color:#43836a}
.personal-file-table .file-symbol.folder{background:transparent!important;border-color:transparent!important;box-shadow:none!important}.personal-file-table .file-symbol.folder>.online-file-icon{width:38px!important;height:38px!important}.file-card .file-symbol.folder{background:transparent!important;border-color:transparent!important;box-shadow:none!important}.file-card .file-symbol.folder>.online-file-icon{width:48px!important;height:48px!important}
.personal-pagination{height:56px;min-height:56px;display:flex;align-items:center;gap:18px;padding:0 16px;border-top:1px solid #e7edf4;background:#fbfcfe;border-radius:0 0 15px 15px;color:#7e8da0;font-size:11px;flex:none}.page-summary{margin-right:auto}.page-size{display:flex;align-items:center;gap:7px}.page-size select{height:30px;border:1px solid #dce5ef;border-radius:7px;background:#fff;color:#53677f;padding:0 25px 0 9px;outline:0}.page-controls{display:flex;align-items:center;gap:5px}.page-number,.page-arrow{width:30px;height:30px;border:1px solid #dfe7f0;border-radius:7px;background:#fff;color:#60728a;display:grid;place-items:center}.page-number:hover,.page-arrow:hover:not(:disabled){border-color:#b9d1ef;color:#1769ff}.page-number.active{border-color:#1769ff;background:#1769ff;color:#fff}.page-arrow:disabled{opacity:.4;cursor:not-allowed}.page-arrow .icon-stack{width:14px;height:14px}
.file-card-access{margin-top:10px}.file-card .file-entry-link{display:block;width:100%;text-align:center}.file-card .access-pill{height:23px}
@media(max-width:1370px){.personal-file-table col.personal-name-col{width:27%}.personal-file-table col.personal-activity-col{width:18%}.personal-search{width:330px}.personal-file-table col.personal-time-col{width:150px}}
@media(max-width:1160px){.personal-file-table col.personal-activity-col{display:none}.personal-file-table th:nth-child(3),.personal-file-table td:nth-child(3){display:none}.personal-search{width:260px}.personal-bulk-trigger{min-width:104px}}
'''
style_end = html.rfind('</style>')
if style_end < 0:
    raise RuntimeError('missing </style>')
html = html[:style_end] + css + '\n' + html[style_end:]

path.write_text(html, encoding='utf-8')
print('Applied personal space v6 information layout')
