from pathlib import Path
import re

path = Path('web-prototype.html')
html = path.read_text(encoding='utf-8')
MARKER = 'personal-space-v5-stable-interaction'

if MARKER in html:
    print('v5 personal-space fix already applied')
    raise SystemExit(0)


def replace_function(source: str, name: str, next_name: str, replacement: str) -> str:
    pattern = rf"function {re.escape(name)}\([\s\S]*?(?=\nfunction {re.escape(next_name)}\()"
    updated, count = re.subn(pattern, replacement.rstrip(), source, count=1)
    if count != 1:
        raise RuntimeError(f'failed to replace {name}: {count}')
    return updated

# 1) Use online Iconify office-style icons directly, with a reliable fallback.
html = re.sub(
    r"const FILE_ICONIFY=\{[^\n]+\};",
    "const FILE_ICONIFY={folder:'fluent-color:folder-24',doc:'vscode-icons:file-type-word',pdf:'vscode-icons:file-type-pdf2',xls:'vscode-icons:file-type-excel',ppt:'vscode-icons:file-type-powerpoint',img:'fluent-color:image-24',zip:'vscode-icons:file-type-zip',mp4:'vscode-icons:file-type-video',md:'vscode-icons:file-type-markdown'};",
    html,
    count=1,
)
html = html.replace(
    "function fileVisual(f){const type=FILE_ICONIFY[f.type]?f.type:'doc';const label={folder:'▰',doc:'DOC',pdf:'PDF',xls:'XLS',ppt:'PPT',img:'IMG',zip:'ZIP',mp4:'MP4',md:'MD'}[type]||'FILE';return `<span class=\"file-symbol ${type}\"><iconify-icon class=\"online-file-icon\" icon=\"${FILE_ICONIFY[type]}\" aria-hidden=\"true\" onload=\"this.parentElement.classList.add('is-loaded')\"></iconify-icon><span class=\"file-fallback\">${label}</span></span>`}",
    "function fileVisual(f){const type=FILE_ICONIFY[f.type]?f.type:'doc';const label={folder:'▰',doc:'DOC',pdf:'PDF',xls:'XLS',ppt:'PPT',img:'IMG',zip:'ZIP',mp4:'MP4',md:'MD'}[type]||'FILE';return `<span class=\"file-symbol ${type}\"><iconify-icon class=\"online-file-icon\" icon=\"${FILE_ICONIFY[type]}\" aria-hidden=\"true\"></iconify-icon><span class=\"file-fallback\">${label}</span></span>`}",
    1,
)

# 2) Keep the bulk action bar permanently visible and stable.
selection_fn = r'''function selectionBar(space){const count=state.selected.length;const has=count>0;const one=count===1;const disabled=has?'':'disabled';const oneDisabled=one?'':'disabled';return `<div class="selection-bar static-selection-bar" data-space="${space}"><strong class="selection-count">${has?`已选择 ${count} 项`:'未选择文件'}</strong><button class="btn compact action-download" ${disabled} onclick="toast('已加入 '+state.selected.length+' 个下载任务')">${icon('download')}下载</button><button class="btn compact action-move" ${disabled} onclick="openModal('destination',{space,mode:'move'})">${icon('move')}移动</button><button class="btn compact action-copy" ${disabled} onclick="openModal('destination',{space,mode:'copy'})">${icon('copy')}复制到</button>${space==='personal'?`<button class="btn compact action-favorite" ${disabled} onclick="toggleFavoriteSelected()">${icon('star')}收藏</button><button class="btn compact action-tag" ${disabled} onclick="openModal('tag')">${icon('tag')}标签</button>`:''}<button class="btn compact action-delete" ${disabled} onclick="openModal('delete',{space})">${icon('trash')}删除</button><button class="btn compact action-detail" ${oneDisabled} onclick="showSelectedDetail()">${icon('info')}属性</button><div class="spacer"></div><button class="btn ghost icon-only compact action-clear" ${disabled} title="取消选择" onclick="clearSelection()">${icon('x')}</button></div>`}'''
html = replace_function(html, 'selectionBar', 'fileTable', selection_fn)

# 3) Single-chevron sorting, right-click context menu, and no detail panel on normal click.
personal_table_fn = r'''function personalFileTable(files){return `<table class="file-table personal-file-table"><colgroup><col class="personal-check-col"><col class="personal-name-col"><col class="personal-tag-col"><col class="personal-size-col"><col class="personal-time-col"><col class="personal-status-col"><col class="personal-op-col"></colgroup><thead><tr><th class="check-col"><input class="check" type="checkbox" ${state.selected.length&&state.selected.length===files.length?'checked':''} onchange="toggleAll(this.checked,${JSON.stringify(files.map(x=>x.id)).replace(/"/g,'&quot;')})"></th><th><span class="sort-head" onclick="sortBy('name')">名称${sortMark('name')}</span></th><th>标签</th><th><span class="sort-head" onclick="sortBy('size')">大小${sortMark('size')}</span></th><th><span class="sort-head" onclick="sortBy('modified')">修改时间${sortMark('modified')}</span></th><th>状态</th><th class="op-col"></th></tr></thead><tbody>${files.map(f=>`<tr data-file-id="${f.id}" class="${state.selected.includes(f.id)?'selected':''}" onclick="rowClick(event,'${f.id}','personal')" ondblclick="openFile('${f.id}','personal')" oncontextmenu="openMenu(event,'${f.id}','personal')"><td class="check-col"><input class="check" type="checkbox" ${state.selected.includes(f.id)?'checked':''} onclick="event.stopPropagation();toggleOne('${f.id}',this.checked)"></td><td><div class="file-name">${fileVisual(f)}<div class="file-name-copy"><div class="file-name-title">${safe(f.name)}</div>${f.favorite?'<div class="file-name-meta"><span class="favorite-note">★ 已收藏</span></div>':''}</div></div></td><td><span class="personal-tag">${safe(f.tag||'未分类')}</span></td><td>${f.type==='folder'?'—':safe(f.size||'—')}</td><td>${safe(f.modified)}</td><td><span class="status-dot ${f.status==='正常'?'green':f.status==='受控'?'orange':'red'}"></span>${safe(f.status||'正常')}</td><td class="op-col"><button class="more-btn" aria-label="更多操作" onclick="event.stopPropagation();openMenu(event,'${f.id}','personal')">${icon('more')}</button></td></tr>`).join('')||`<tr><td colspan="7"><div class="empty"><div class="empty-icon">${icon('search')}</div><strong>没有找到匹配内容</strong><p>尝试清除筛选条件或更换关键词</p></div></td></tr>`}</tbody></table>`}'''
html = replace_function(html, 'personalFileTable', 'personal', personal_table_fn)

html = html.replace(
    "function sortArrows(k){return `<span class=\"sort-arrows\"><i class=\"${state.sort.key===k&&state.sort.dir==='asc'?'on':''}\">▲</i><i class=\"${state.sort.key===k&&state.sort.dir==='desc'?'on':''}\">▼</i></span>`}",
    "function sortArrows(k){return sortMark(k)}\nfunction sortMark(k){const active=state.sort.key===k;return `<span class=\"sort-mark ${active?state.sort.dir:'idle'}\">${icon('down')}</span>`}",
    1,
)

row_click_fn = r'''function rowClick(e,id,space){if(e.target.closest('button,input'))return;if(space!=='personal'){state.detail={id,space};render();return}if(e.ctrlKey||e.metaKey){state.selected=state.selected.includes(id)?state.selected.filter(x=>x!==id):[...state.selected,id]}else{state.selected=[id]}state.detail=null;syncPersonalSelection()}'''
html = replace_function(html, 'rowClick', 'openFile', row_click_fn)

# Selection updates no longer rebuild the whole page.
toggle_one_fn = r'''function toggleOne(id,on){if(on&&!state.selected.includes(id))state.selected.push(id);if(!on)state.selected=state.selected.filter(x=>x!==id);if(state.page==='personal')syncPersonalSelection();else render()}'''
html = replace_function(html, 'toggleOne', 'toggleAll', toggle_one_fn)
toggle_all_fn = r'''function toggleAll(on,ids){state.selected=on?ids:[];if(state.page==='personal')syncPersonalSelection();else render()}'''
html = replace_function(html, 'toggleAll', 'clearSelection', toggle_all_fn)
clear_fn = r'''function clearSelection(){state.selected=[];state.detail=null;if(state.page==='personal')syncPersonalSelection();else render()}'''
html = replace_function(html, 'clearSelection', 'showSelectedDetail', clear_fn)

sync_helper = r'''function syncPersonalSelection(){const ids=new Set(state.selected);document.querySelectorAll('.personal-file-table tbody tr[data-file-id],.file-card[data-file-id]').forEach(el=>{const selected=ids.has(el.dataset.fileId);el.classList.toggle('selected',selected);const check=el.querySelector('.check');if(check)check.checked=selected});const all=document.querySelector('.personal-file-table thead .check');if(all){const rows=[...document.querySelectorAll('.personal-file-table tbody tr[data-file-id]')];all.checked=rows.length>0&&rows.every(row=>ids.has(row.dataset.fileId));all.indeterminate=ids.size>0&&!all.checked}const bar=document.querySelector('.static-selection-bar');if(!bar)return;const count=ids.size;const label=bar.querySelector('.selection-count');if(label)label.textContent=count?`已选择 ${count} 项`:'未选择文件';bar.querySelectorAll('.action-download,.action-move,.action-copy,.action-favorite,.action-tag,.action-delete,.action-clear').forEach(btn=>btn.disabled=count===0);const detail=bar.querySelector('.action-detail');if(detail)detail.disabled=count!==1}'''
html = html.replace('function showSelectedDetail(){', sync_helper + '\nfunction showSelectedDetail(){', 1)

# 4) Fix upload menu structure and make file cards use selection/context-menu behavior.
personal_fn_match = re.search(r"function personal\(\)\{[\s\S]*?(?=\nfunction setPersonalTab\()", html)
if not personal_fn_match:
    raise RuntimeError('personal function not found')
personal_fn = personal_fn_match.group(0)
personal_fn = personal_fn.replace(
    "${icon('upload')}上传文件<span>支持多选</span>",
    "${icon('upload')}<span class=\"upload-option-copy\"><strong>上传文件</strong><small>支持多选</small></span>",
)
personal_fn = personal_fn.replace(
    "${icon('folder')}上传文件夹<span>保留目录结构</span>",
    "${icon('folder')}<span class=\"upload-option-copy\"><strong>上传文件夹</strong><small>保留目录结构</small></span>",
)
html = html[:personal_fn_match.start()] + personal_fn + html[personal_fn_match.end():]

personal_grid_fn = r'''function personalGrid(files){return `<div class="grid-zone"><div class="file-grid">${files.map(f=>`<div data-file-id="${f.id}" class="file-card ${state.selected.includes(f.id)?'selected':''}" onclick="rowClick(event,'${f.id}','personal')" ondblclick="openFile('${f.id}','personal')" oncontextmenu="openMenu(event,'${f.id}','personal')"><input class="check" type="checkbox" ${state.selected.includes(f.id)?'checked':''} onclick="event.stopPropagation();toggleOne('${f.id}',this.checked)"><button class="more-btn" onclick="event.stopPropagation();openMenu(event,'${f.id}','personal')">${icon('more')}</button>${fileVisual(f)}<div class="file-card-name">${safe(f.name)}</div><div class="file-card-meta"><span>${safe(f.size||'—')}</span><span>${safe(f.modified.slice(5,10))}</span></div></div>`).join('')}</div></div>`}'''
html = replace_function(html, 'personalGrid', 'collaboration', personal_grid_fn)

# 5) Right-click selects the target without a full-page render and positions the context menu beside the pointer.
open_menu_fn = r'''function openMenu(e,id,space){e.preventDefault?.();const trigger=e.currentTarget||e.target;const rect=trigger.getBoundingClientRect();const width=208;const pointerX=e.clientX||rect.right;const pointerY=e.clientY||rect.bottom;const x=Math.max(10,Math.min(pointerX+4,innerWidth-width-10));const y=Math.max(10,Math.min(pointerY+4,innerHeight-430));if(!state.selected.includes(id))state.selected=[id];state.detail=null;state.menu={x,y,id,space,type:'file'};state.profileOpen=false;state.personalUploadOpen=false;if(space==='personal')syncPersonalSelection();renderOverlays()}'''
html = replace_function(html, 'openMenu', 'openCollabMenu', open_menu_fn)

# 6) Hierarchical destination picker for both move and copy-to actions.
destination_helpers = r'''function destinationTree(){const node=(value,label,level=0,kind='folder',children='')=>`<div class="destination-node"><label class="destination-row level-${level}"><input type="radio" name="destinationTarget" value="${safe(value)}"><span class="tree-caret ${children?'open':'empty'}">${children?icon('down'):''}</span>${icon(kind)}<span>${safe(label)}</span></label>${children?`<div class="destination-children">${children}</div>`:''}</div>`;const personal=node('个人空间 / 我的项目资料 / 需求文档','需求文档',2)+node('个人空间 / 我的项目资料 / 评审材料','评审材料',2);const project=node('个人空间 / 我的项目资料','我的项目资料',1,'folder',personal);const personalRoot=node('个人空间','个人空间',0,'home',project+node('个人空间 / 临时文件','临时文件',1));const enterprise=node('企业空间 / 研发中心 / 技术方案','技术方案',2)+node('企业空间 / 研发中心 / 交付文档','交付文档',2);const enterpriseRoot=node('企业空间','企业空间',0,'building',node('企业空间 / 研发中心','研发中心',1,'folder',enterprise));const collabRoot=node('协作空间','协作空间',0,'users',node('协作空间 / 智能知识库一期项目','智能知识库一期项目',1));return `<div class="destination-tree">${personalRoot}${enterpriseRoot}${collabRoot}</div>`}
function completeDestination(mode,space){const target=document.querySelector('input[name="destinationTarget"]:checked')?.value;if(!target)return toast('请选择目标文件夹','warning');const count=state.selected.length;if(mode==='copy')copySelectedToTarget(space,target);else{state.selected=[];closeModal();syncPersonalSelection();toast(`已将 ${count} 项移动到“${target}”`)} }
function copySelectedToTarget(space,target){const count=state.selected.length;state.selected=[];closeModal();syncPersonalSelection();toast(`已将 ${count} 项复制到“${target}”`)}'''
html = html.replace('function openModal(type,payload={}){', destination_helpers + '\nfunction openModal(type,payload={}){', 1)

# Replace legacy move modal branch with the new destination branch.
pattern = r"else if\(type==='move'\)\{[\s\S]*?(?=else if\(type==='createCollect'\))"
replacement = r'''else if(type==='destination'){const mode=payload.mode||'move';title=mode==='copy'?'复制到':'移动到';body=`<div class="destination-picker-head"><span>选择目标文件夹</span><small>${state.selected.length} 项内容</small></div>${destinationTree()}<div class="notice destination-notice">仅显示你有权限写入的目录；当前目录及其子目录不可作为移动目标。</div>`;foot=`<button class="btn" onclick="closeModal()">取消</button><button class="btn primary" onclick="completeDestination('${mode}','${payload.space||'personal'}')">${mode==='copy'?'复制到此处':'移动到此处'}</button>`}'''
html, count = re.subn(pattern, replacement, html, count=1)
if count != 1:
    raise RuntimeError('legacy move modal branch not replaced')

# 7) Remove repeated page entrance animation and file-card press animation to stop visible shaking.
html = html.replace(
    "function render(){document.getElementById('app').innerHTML=`<div class=\"app\">${sidebar()}<section class=\"shell\">${topbar()}<main class=\"main\"><div class=\"page\">${pageContent()}</div></main></section></div><div id=\"overlayRoot\"></div>`;renderOverlays();animatePage()}",
    "function render(){document.getElementById('app').innerHTML=`<div class=\"app\">${sidebar()}<section class=\"shell\">${topbar()}<main class=\"main\"><div class=\"page\">${pageContent()}</div></main></section></div><div id=\"overlayRoot\"></div>`;renderOverlays()}",
    1,
)
html = html.replace(
    "const el=e.target.closest('.btn,.quick,.nav-item,.file-card,.collab-card');",
    "const el=e.target.closest('.btn,.quick,.nav-item,.collab-card');",
    1,
)

# 8) CSS overrides are scoped to the personal-space refinement.
css = r'''
/* personal-space-v5-stable-interaction */
.page{animation:none!important}.personal-panel{contain:layout paint}.personal-panel .detail-pane{animation:none!important}
.static-selection-bar{height:52px;min-height:52px;padding:0 14px;border-bottom:1px solid var(--line-soft);background:#f8fbff;display:flex;align-items:center;gap:7px;flex:none}
.static-selection-bar .selection-count{min-width:82px;color:#3d5570;font-size:12px}.static-selection-bar .btn{height:32px;background:#fff}.static-selection-bar .btn:disabled{opacity:.42;cursor:not-allowed;transform:none;box-shadow:none;color:#8796a8;background:#f7f9fc;border-color:#e3e9f0}
.sort-mark{width:15px;height:15px;display:inline-flex;align-items:center;justify-content:center;color:#a7b4c4;transition:transform .15s,color .15s}.sort-mark .icon{width:13px;height:13px}.sort-mark.asc{transform:rotate(180deg);color:#1769ff}.sort-mark.desc{transform:none;color:#1769ff}.sort-mark.idle{opacity:.45}
.upload-method-pop{width:228px}.upload-method-pop button{display:flex!important;align-items:center;gap:11px;min-height:54px!important;padding:8px 10px!important}.upload-method-pop button>.icon-stack{width:20px;height:20px;flex:none}.upload-option-copy{display:flex!important;flex-direction:column;align-items:flex-start;gap:3px;min-width:0}.upload-option-copy strong{font-size:12px;font-weight:600;color:#40546e}.upload-option-copy small{font-size:10px;color:#98a5b5}.upload-method-pop button:hover .upload-option-copy strong{color:#1769ff}
.file-symbol>.online-file-icon{display:none!important;width:31px;height:31px}.file-symbol>.file-fallback{display:grid!important}.iconify-ready .file-symbol>.online-file-icon{display:inline-flex!important}.iconify-ready .file-symbol>.file-fallback{display:none!important}.personal-file-table .file-symbol>.online-file-icon{width:32px;height:32px}.file-card .file-symbol>.online-file-icon{width:40px;height:40px}
.personal-file-table tbody tr{cursor:default}.personal-file-table tbody tr.selected{background:#edf5ff;box-shadow:inset 3px 0 #1769ff}.personal-file-table tbody tr:focus-within{outline:none}
.destination-picker-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;color:#354a63;font-size:12px}.destination-picker-head small{color:#94a3b8}
.destination-tree{height:320px;overflow:auto;border:1px solid #dfe7f1;border-radius:12px;background:#fbfdff;padding:8px}.destination-node{display:block}.destination-row{height:39px;border-radius:8px;display:flex;align-items:center;gap:7px;padding-right:10px;color:#4b6078;cursor:pointer;user-select:none}.destination-row:hover{background:#f0f6ff;color:#1769ff}.destination-row:has(input:checked){background:#eaf3ff;color:#1769ff;font-weight:600}.destination-row.level-0{padding-left:8px}.destination-row.level-1{padding-left:30px}.destination-row.level-2{padding-left:52px}.destination-row input{accent-color:#1769ff}.destination-row .icon{width:17px;height:17px}.tree-caret{width:15px;height:15px;display:grid;place-items:center;color:#8ea0b5}.tree-caret.empty{visibility:hidden}.tree-caret .icon{width:13px;height:13px}.destination-children{display:block}.destination-notice{margin-top:12px}
@media(max-width:1120px){.static-selection-bar{overflow-x:auto}.static-selection-bar .spacer{min-width:4px}.static-selection-bar .btn{flex:none}}
'''
style_end = html.rfind('</style>')
if style_end < 0:
    raise RuntimeError('style end not found')
html = html[:style_end] + css + '\n' + html[style_end:]

# Add Iconify readiness hook once; online icons show when the web component is defined.
ready_hook = "if(window.customElements){customElements.whenDefined('iconify-icon').then(()=>document.documentElement.classList.add('iconify-ready'))}"
html = html.replace("document.getElementById('fileInput').addEventListener", ready_hook + ";\ndocument.getElementById('fileInput').addEventListener", 1)

path.write_text(html, encoding='utf-8')
print('Applied v5 personal-space stability and interaction fixes')
