from pathlib import Path
import re

path = Path('web-prototype.html')
html = path.read_text(encoding='utf-8')
MARKER = 'personal-space-v8-multitag-ownership-icons'

if MARKER in html:
    print('personal space v8 already applied')
    raise SystemExit(0)


def replace_function(source: str, name: str, next_name: str, replacement: str) -> str:
    pattern = rf"function {re.escape(name)}\([\s\S]*?(?=\nfunction {re.escape(next_name)}\()"
    updated, count = re.subn(pattern, replacement.rstrip(), source, count=1)
    if count != 1:
        raise RuntimeError(f'could not replace {name}: {count}')
    return updated


def must_replace(source: str, old: str, new: str, count: int = 1) -> str:
    if old not in source:
        raise RuntimeError(f'missing replacement target: {old[:120]}')
    return source.replace(old, new, count)

# Polished online command icons, while the existing SVG fallback remains available.
icon_pairs = {
    "upload:'lucide:cloud-upload'": "upload:'material-symbols:upload-rounded'",
    "folderPlus:'lucide:folder-plus'": "folderPlus:'material-symbols:create-new-folder-outline-rounded'",
    "folder:'lucide:folder'": "folder:'material-symbols:folder-outline-rounded'",
    "download:'lucide:download'": "download:'material-symbols:download-rounded'",
    "more:'lucide:ellipsis'": "more:'material-symbols:more-horiz'",
    "eye:'lucide:eye'": "eye:'material-symbols:visibility-outline-rounded'",
    "edit:'lucide:pencil-line'": "edit:'material-symbols:edit-outline-rounded'",
    "copy:'lucide:copy'": "copy:'material-symbols:content-copy-outline-rounded'",
    "move:'lucide:folder-input'": "move:'material-symbols:drive-file-move-outline-rounded'",
    "star:'lucide:star'": "star:'material-symbols:star-outline-rounded'",
    "tag:'lucide:tag'": "tag:'material-symbols:label-outline-rounded'",
    "trash:'lucide:trash-2'": "trash:'material-symbols:delete-outline-rounded'",
    "link:'lucide:link-2'": "link:'material-symbols:link-rounded'",
    "info:'lucide:circle-help'": "info:'material-symbols:info-outline-rounded'",
    "transfer:'lucide:circle-arrow-up-down'": "transfer:'material-symbols:swap-horiz-rounded'",
}
for old, new in icon_pairs.items():
    html = must_replace(html, old, new)
html = must_replace(html, "sort:'lucide:arrow-up-down'", "bulk:'material-symbols:checklist-rounded',grant:'material-symbols:group-add-outline-rounded',history:'material-symbols:history-rounded',sort:'lucide:arrow-up-down'")
html = html.replace("folder:'vscode-icons:default-folder'", "folder:'fluent-color:folder-24'", 1)

# Representative multi-tag content.
sample_pairs = {
    "{id:'p1',type:'folder',name:'我的项目资料',parent:'',modified:'2026-06-23 09:18',size:'—',favorite:true,tag:'项目',": "{id:'p1',type:'folder',name:'我的项目资料',parent:'',modified:'2026-06-23 09:18',size:'—',favorite:true,tag:'项目',tags:['项目','重点','待评审'],",
    "{id:'p3',type:'doc',name:'个人工作计划.docx',parent:'',modified:'2026-06-23 08:32',size:'328 KB',favorite:true,tag:'计划',": "{id:'p3',type:'doc',name:'个人工作计划.docx',parent:'',modified:'2026-06-23 08:32',size:'328 KB',favorite:true,tag:'计划',tags:['计划','本周'],",
    "{id:'p4',type:'pdf',name:'产品调研记录.pdf',parent:'',modified:'2026-06-22 16:45',size:'4.2 MB',favorite:false,tag:'调研',": "{id:'p4',type:'pdf',name:'产品调研记录.pdf',parent:'',modified:'2026-06-22 16:45',size:'4.2 MB',favorite:false,tag:'调研',tags:['调研','待归档'],",
    "{id:'p6',type:'ppt',name:'周例会汇报.pptx',parent:'',modified:'2026-06-20 17:08',size:'8.9 MB',favorite:false,tag:'汇报',": "{id:'p6',type:'ppt',name:'周例会汇报.pptx',parent:'',modified:'2026-06-20 17:08',size:'8.9 MB',favorite:false,tag:'汇报',tags:['汇报','例会'],",
}
for old, new in sample_pairs.items():
    html = must_replace(html, old, new)

current_files = r'''function currentFiles(space='enterprise'){let arr=space==='enterprise'?(enterpriseFiles[state.dept]||[]):personalFiles;if(space==='personal'){const currentPath=state.folder.join('/');arr=arr.filter(x=>(x.parent||'')===currentPath)}if(state.query){arr=arr.filter(x=>x.name.toLowerCase().includes(state.query.toLowerCase()))}if(space==='personal'){if(state.personalTab==='recent')arr=arr.slice().sort((a,b)=>b.modified.localeCompare(a.modified));if(state.personalTab==='favorites')arr=arr.filter(x=>x.favorite);if(state.filters.type!=='all')arr=arr.filter(x=>x.type===state.filters.type);if(state.filters.tag!=='all')arr=arr.filter(x=>personalTags(x).includes(state.filters.tag))}arr=arr.slice().sort((a,b)=>{let av=a[state.sort.key]||'',bv=b[state.sort.key]||'';return state.sort.dir==='asc'?String(av).localeCompare(String(bv),'zh-CN'):String(bv).localeCompare(String(av),'zh-CN')});return arr}'''
html = replace_function(html, 'currentFiles', 'enterprise', current_files)

helpers = r'''function personalTags(file){const raw=Array.isArray(file?.tags)?file.tags:(file?.tag?[file.tag]:[]);return [...new Set(raw.flatMap(x=>String(x).split(/[,，;；]/)).map(x=>x.trim()).filter(Boolean))]}
function allPersonalTags(){return [...new Set(personalFiles.flatMap(personalTags))].sort((a,b)=>a.localeCompare(b,'zh-CN'))}
function selectedTagSeed(){return [...new Set(state.selected.flatMap(id=>personalTags(personalFiles.find(x=>x.id===id))))]}
function tagTone(tag){const map={项目:'blue',计划:'cyan',临时:'gray',调研:'purple',任务:'green',汇报:'orange',设计:'pink',技术:'slate',需求:'blue',评审:'purple',资料:'cyan',模板:'slate',复盘:'green',归档:'gray',重点:'orange',待评审:'purple',待归档:'gray',本周:'green',例会:'orange'};return map[tag]||'slate'}
function personalTag(file){const tags=personalTags(file);if(!tags.length)return '<span class="tag-empty">未设置</span>';return `<div class="personal-tags">${tags.slice(0,2).map(tag=>`<button class="personal-tag tag-${tagTone(tag)}" title="筛选标签：${safe(tag)}" onclick="event.stopPropagation();filterPersonalByTag(this.dataset.tag)" data-tag="${safe(tag)}">${icon('tag')}<span>${safe(tag)}</span></button>`).join('')}${tags.length>2?`<span class="tag-more" title="${safe(tags.slice(2).join('、'))}">+${tags.length-2}</span>`:''}</div>`}
function toggleTagChoice(button){button.classList.toggle('selected');button.setAttribute('aria-pressed',button.classList.contains('selected')?'true':'false');updateTagSummary()}
function updateTagSummary(){const count=document.querySelectorAll('#tagChoiceGrid .tag-option.selected').length;const node=document.getElementById('tagSelectionSummary');if(node)node.textContent=`已选择 ${count} 个标签`}
function addCustomTagChoice(){const input=document.getElementById('customTagInput');if(!input)return;const values=input.value.split(/[,，;；]/).map(x=>x.trim()).filter(Boolean);const grid=document.getElementById('tagChoiceGrid');if(!grid||!values.length)return toast('请输入标签名称','warning');for(const value of values){if(value.length>12){toast(`标签“${value}”不能超过 12 个字符`,'warning');continue}let existing=[...grid.querySelectorAll('.tag-option')].find(x=>x.dataset.value===value);if(existing){existing.classList.add('selected');existing.setAttribute('aria-pressed','true');continue}if(grid.querySelectorAll('.tag-option').length>=24){toast('标签候选数量已达上限','warning');break}const button=document.createElement('button');button.type='button';button.className='tag-option selected';button.dataset.value=value;button.setAttribute('aria-pressed','true');button.innerHTML=`${icon('check')}<span></span>`;button.querySelector('span').textContent=value;button.onclick=()=>toggleTagChoice(button);grid.appendChild(button)}input.value='';updateTagSummary()}
function applyTags(){const tags=[...document.querySelectorAll('#tagChoiceGrid .tag-option.selected')].map(x=>x.dataset.value).filter(Boolean);if(tags.length>8)return toast('每个文件最多设置 8 个标签','warning');personalFiles.forEach(file=>{if(state.selected.includes(file.id)){file.tags=[...tags];file.tag=tags[0]||'';file.modified='2026-06-23 13:20';file.activity=tags.length?'刚刚 · 更新标签':'刚刚 · 清空标签'}});closeModal();toast(tags.length?`已设置 ${tags.length} 个标签`:'已清空标签');render()}'''
html = html.replace('\nfunction personalTag(file){', '\n' + helpers + '\nfunction personalTagLegacy(file){', 1)
html, n = re.subn(r"\nfunction personalTagLegacy\(file\)\{[\s\S]*?(?=\nfunction personalAccess\()", "", html, count=1)
if n != 1:
    raise RuntimeError('legacy personalTag removal failed')

filter_pop = r'''function filterPop(){return `<div class="filter-pop"><div class="filter-title">搜索条件<button class="btn ghost icon-only" onclick="state.filterOpen=false;render()">${icon('x')}</button></div><div class="form-grid"><div class="field"><label>文件类型</label><select class="select" id="filterType"><option value="all" ${state.filters.type==='all'?'selected':''}>全部类型</option><option value="folder">文件夹</option><option value="doc">Word 文档</option><option value="pdf">PDF 文件</option><option value="xls">Excel 表格</option><option value="ppt">演示文稿</option><option value="img">图片</option><option value="zip">压缩包</option><option value="md">Markdown</option></select></div><div class="field"><label>标签</label><select class="select" id="filterTag"><option value="all">全部标签</option>${allPersonalTags().map(x=>`<option value="${safe(x)}" ${state.filters.tag===x?'selected':''}>${safe(x)}</option>`).join('')}</select></div><div class="field"><label>显示方式</label><div class="view-toggle" style="width:74px"><button class="${state.view==='list'?'active':''}" onclick="state.view='list';render()">${icon('list')}</button><button class="${state.view==='grid'?'active':''}" onclick="state.view='grid';render()">${icon('grid')}</button></div></div></div><div class="filter-actions"><button class="btn" onclick="clearFilters()">重置</button><button class="btn primary" onclick="applyFilters()">应用</button></div></div>`}'''
html = replace_function(html, 'filterPop', 'applyFilters', filter_pop)

bulk = r'''function personalBulkControl(){const count=state.selected.length;const selected=state.selected.map(id=>personalFiles.find(x=>x.id===id)).filter(Boolean);const transferable=count===1&&selected[0]?.type==='folder';return `<div class="personal-bulk-wrap"><button class="btn personal-bulk-trigger" ${count?'':'disabled'} onclick="togglePersonalBulkMenu(event)">${icon('bulk')}<span class="personal-bulk-label">${count?`已选 ${count} 项`:'批量操作'}</span>${icon('down')}</button><div class="personal-bulk-menu" onclick="event.stopPropagation()"><button onclick="closePersonalBulkMenu();toast('已加入 '+state.selected.length+' 个下载任务')">${icon('download')}<span>下载</span></button><button onclick="closePersonalBulkMenu();openModal('destination',{space:'personal',mode:'move'})">${icon('move')}<span>移动到</span></button><button onclick="closePersonalBulkMenu();openModal('destination',{space:'personal',mode:'copy'})">${icon('copy')}<span>复制到</span></button><div class="menu-sep"></div><button onclick="closePersonalBulkMenu();toggleFavoriteSelected()">${icon('star')}<span>添加到收藏</span></button><button onclick="closePersonalBulkMenu();openModal('tag')">${icon('tag')}<span>设置多标签</span></button><button class="ownership-action" ${transferable?'':'disabled'} title="${transferable?'转移当前文件夹及全部子项':'仅选择一个文件夹时可用'}" onclick="closePersonalBulkMenu();openModal('transfer',{id:'${transferable?selected[0].id:''}'})">${icon('transfer')}<span>转移所有权</span></button><div class="menu-sep"></div><button class="danger" onclick="closePersonalBulkMenu();openModal('delete',{space:'personal'})">${icon('trash')}<span>删除</span></button></div></div>`}'''
html = replace_function(html, 'personalBulkControl', 'togglePersonalBulkMenu', bulk)

sync = r'''function syncPersonalSelection(){const ids=new Set(state.selected);document.querySelectorAll('.personal-file-table tbody tr[data-file-id],.file-card[data-file-id]').forEach(el=>{const selected=ids.has(el.dataset.fileId);el.classList.toggle('selected',selected);const check=el.querySelector('.check');if(check)check.checked=selected});const all=document.querySelector('.personal-file-table thead .check');if(all){const rows=[...document.querySelectorAll('.personal-file-table tbody tr[data-file-id]')];all.checked=rows.length>0&&rows.every(row=>ids.has(row.dataset.fileId));all.indeterminate=ids.size>0&&!all.checked}const trigger=document.querySelector('.personal-bulk-trigger');const label=document.querySelector('.personal-bulk-label');if(trigger){trigger.disabled=ids.size===0;if(label)label.textContent=ids.size?`已选 ${ids.size} 项`:'批量操作'}const selected=[...ids].map(id=>personalFiles.find(x=>x.id===id)).filter(Boolean);const transfer=document.querySelector('.ownership-action');if(transfer){const enabled=selected.length===1&&selected[0].type==='folder';transfer.disabled=!enabled;transfer.title=enabled?'转移当前文件夹及全部子项':'仅选择一个文件夹时可用';transfer.onclick=enabled?()=>{closePersonalBulkMenu();openModal('transfer',{id:selected[0].id})}:null}if(!ids.size)closePersonalBulkMenu()}'''
html = replace_function(html, 'syncPersonalSelection', 'showSelectedDetail', sync)

# Improve upload option icon containers.
html = must_replace(html, "${icon('upload')}<span class=\"upload-option-copy\"><strong>上传文件</strong><small>支持多选</small></span>", "<span class=\"upload-menu-icon upload-file-icon\">${icon('upload')}</span><span class=\"upload-option-copy\"><strong>上传文件</strong><small>支持多选，单文件最大 5GB</small></span>")
html = must_replace(html, "${icon('folder')}<span class=\"upload-option-copy\"><strong>上传文件夹</strong><small>保留目录结构</small></span>", "<span class=\"upload-menu-icon upload-folder-icon\">${icon('folder')}</span><span class=\"upload-option-copy\"><strong>上传文件夹</strong><small>保留原始目录层级</small></span>")

# Tag editor modal.
tag_branch = r'''else if(type==='tag'){const seed=selectedTagSeed();const presets=[...new Set(['重点','待评审','项目','计划','设计','交付','归档','本周',...allPersonalTags(),...seed])];title='设置多标签';body=`<div class="tag-editor"><div class="tag-editor-head"><div><strong>为 ${state.selected.length} 项内容设置标签</strong><span>可同时选择多个标签，保存后统一覆盖所选内容</span></div><span id="tagSelectionSummary">已选择 ${seed.length} 个标签</span></div><div class="tag-choice-grid" id="tagChoiceGrid">${presets.map(tag=>`<button type="button" class="tag-option ${seed.includes(tag)?'selected':''}" data-value="${safe(tag)}" aria-pressed="${seed.includes(tag)}" onclick="toggleTagChoice(this)">${icon('check')}<span>${safe(tag)}</span></button>`).join('')}</div><div class="tag-create-row"><input class="input" id="customTagInput" maxlength="80" placeholder="输入新标签；多个标签可用逗号分隔" onkeydown="if(event.key==='Enter'){event.preventDefault();addCustomTagChoice()}"><button class="btn" type="button" onclick="addCustomTagChoice()">${icon('plus')}添加</button></div><p class="help">每个文件最多 8 个标签，单个标签不超过 12 个字符。取消全部选中后保存，可清空标签。</p></div>`;foot=`<button class="btn" onclick="closeModal()">取消</button><button class="btn primary" onclick="applyTags()">保存标签</button>`}else if(type==='destination'){'''
html, n = re.subn(r"else if\(type==='tag'\)\{[\s\S]*?\}else if\(type==='destination'\)\{", tag_branch, html, count=1)
if n != 1:
    raise RuntimeError('tag modal replacement failed')

# Strong ownership transfer confirmation.
transfer_branch = r'''else if(type==='transfer'){const f=personalFiles.find(x=>x.id===payload.id);const root=[f?.parent,f?.name].filter(Boolean).join('/');const children=f?personalFiles.filter(x=>{const p=x.parent||'';return p===root||p.startsWith(root+'/')}).length:0;title='转移文件夹所有权';body=`<div class="transfer-summary">${fileVisual(f||{type:'folder'})}<div><strong>${safe(f?.name||'')}</strong><span>包含 ${children} 个子项；转移后原所有者失去该文件夹及全部子项的所有权</span></div></div><div class="field"><label>接收成员</label><select class="select" id="transferMember"><option value="">请选择接收成员</option><option>李晓华 · 综合管理部</option><option>周凯 · 研发中心</option><option>许欣 · 产品设计部</option><option>王璐 · 综合管理部</option></select></div><label class="transfer-confirm"><input class="check" id="transferConfirm" type="checkbox"><span>我已确认该文件夹及全部子项将转移到接收人的个人空间</span></label><div class="notice danger-notice">所有权转移不可直接撤销，后续需要由新所有者再次转移。</div>`;foot=`<button class="btn" onclick="closeModal()">取消</button><button class="btn danger" onclick="transferItem('${payload.id}')">确认转移</button>`}else if(type==='share'){'''
html, n = re.subn(r"else if\(type==='transfer'\)\{[\s\S]*?\}else if\(type==='share'\)\{", transfer_branch, html, count=1)
if n != 1:
    raise RuntimeError('transfer modal replacement failed')

transfer_fn = r'''function transferItem(id){const f=personalFiles.find(x=>x.id===id);const member=document.getElementById('transferMember')?.value;const confirmed=document.getElementById('transferConfirm')?.checked;if(!f||f.type!=='folder')return toast('仅个人空间文件夹支持转移所有权','warning');if(!member)return toast('请选择接收成员','warning');if(!confirmed)return toast('请确认所有权转移范围','warning');const root=[f.parent,f.name].filter(Boolean).join('/');const moved=personalFiles.filter(x=>x.id===id||((x.parent||'')===root||(x.parent||'').startsWith(root+'/')));const ids=new Set(moved.map(x=>x.id));personalFiles=personalFiles.filter(x=>!ids.has(x.id));state.selected=[];state.detail=null;closeModal();toast(`“${f.name}”及 ${Math.max(0,moved.length-1)} 个子项已转移给${member.split(' · ')[0]}`);render()}'''
html = replace_function(html, 'transferItem', 'startUpload', transfer_fn)

# Internal sharing authorization, which is distinct from an external link.
grant_branch = r'''else if(type==='grant'){const f=findFile(payload.id,payload.space);title='共享授权';body=`<div class="transfer-summary">${fileVisual(f||{type:'doc'})}<div><strong>${safe(f?.name||'')}</strong><span>授权后，成员将在“与我相关”中看到该内容</span></div></div><div class="form-grid"><div class="field"><label>授权成员</label><select class="select" id="grantMember"><option value="">请选择成员</option><option>李晓华 · 综合管理部</option><option>周凯 · 研发中心</option><option>许欣 · 产品设计部</option><option>王璐 · 综合管理部</option></select></div><div class="field"><label>文件角色</label><select class="select" id="grantRole"><option>预览者</option><option>下载者</option><option>上传者</option><option>编辑者</option></select></div><div class="notice">成员权限不能超过当前操作者已有权限；共享授权与安全外链相互独立。</div></div>`;foot=`<button class="btn" onclick="closeModal()">取消</button><button class="btn primary" onclick="applyGrant('${payload.id}','${payload.space}')">确认授权</button>`}else if(type==='destination'){'''
html, n = re.subn(r"else if\(type==='destination'\)\{", grant_branch, html, count=1)
if n != 1:
    raise RuntimeError('grant modal insertion failed')

apply_grant = r'''function applyGrant(id,space){const member=document.getElementById('grantMember')?.value;const role=document.getElementById('grantRole')?.value;if(!member)return toast('请选择授权成员','warning');const f=findFile(id,space);if(f&&space==='personal'){f.access='shared';f.activity=`刚刚 · 共享给${member.split(' · ')[0]}`;f.modified='2026-06-23 13:20'}closeModal();toast(`已授予${member.split(' · ')[0]}“${role}”权限`);render()}'''
html = html.replace('\nfunction createShare(name){', '\n' + apply_grant + '\nfunction createShare(name){', 1)

# Single-item menu wording and missing internal authorization.
html = html.replace("${icon('link')}创建安全外链</button><div class=\"menu-sep\"></div>", "${icon('link')}创建安全外链</button>${m.space==='personal'?`<button class=\"menu-item\" onclick=\"state.menu=null;openModal('grant',{id:'${m.id}',space:'${m.space}'})\">${icon('grant')}共享授权</button>`:''}<div class=\"menu-sep\"></div>", 1)
html = html.replace("${icon('tag')}设置标签</button>", "${icon('tag')}设置多标签</button>", 1)
html = html.replace("<button class=\"menu-item\" onclick=\"state.menu=null;openModal('transfer'", "<button class=\"menu-item transfer-item\" onclick=\"state.menu=null;openModal('transfer'", 1)

# All tags appear in detail views when present.
html = html.replace("${safe(f.tag||'暂无')}", "${safe(personalTags(f).join('、')||'暂无')}")

css = r'''
/* personal-space-v8-multitag-ownership-icons */
.personal-toolbar .btn>.icon-stack,.personal-bulk-menu button>.icon-stack,.personal-file-menu .menu-item>.icon-stack{width:30px;height:30px;border-radius:8px;display:grid;place-items:center;flex:none;background:#f1f5f9;color:#58728f}.personal-toolbar .btn.primary>.icon-stack{width:20px;height:20px;background:transparent;color:currentColor}.personal-toolbar .btn>.icon-stack .online-icon,.personal-bulk-menu button>.icon-stack .online-icon,.personal-file-menu .menu-item>.icon-stack .online-icon{font-size:18px}
.personal-bulk-menu{width:212px;padding:8px}.personal-bulk-menu button{height:40px;gap:9px;padding:0 8px}.personal-bulk-menu button:hover>.icon-stack,.personal-file-menu .menu-item:hover>.icon-stack{background:#e7f1fb;color:#356f99}.personal-bulk-menu button.danger>.icon-stack,.personal-file-menu .menu-item.danger>.icon-stack{background:#fff1f1;color:#d8565b}.personal-bulk-menu button:disabled{opacity:.42;cursor:not-allowed}.personal-bulk-menu button:disabled:hover{background:transparent;color:#445a74}.personal-bulk-menu button:disabled:hover>.icon-stack{background:#f1f5f9;color:#58728f}
.personal-file-menu{width:232px;padding:8px;max-height:calc(100vh - 20px);overflow:auto}.personal-file-menu .menu-item{height:40px;gap:9px;padding:0 8px}.personal-file-menu .transfer-item{color:#8a672d}.personal-file-menu .transfer-item>.icon-stack{background:#fff7e8;color:#b47b26}
.upload-method-pop{width:270px}.upload-method-pop button{grid-template-columns:42px minmax(0,1fr)!important}.upload-menu-icon{width:38px;height:38px;border-radius:10px;display:grid;place-items:center;background:#edf5fa;color:#3c739c;border:1px solid #dbe9f1}.upload-folder-icon{background:#fff7e6;color:#b9822d;border-color:#f3e1ba}.upload-menu-icon>.icon-stack{width:22px!important;height:22px!important;background:transparent!important}.upload-menu-icon .online-icon{font-size:22px!important}
.personal-tags{display:flex;align-items:center;gap:5px;min-width:0;flex-wrap:nowrap}.personal-tag{max-width:78px}.tag-more{height:24px;min-width:27px;padding:0 6px;border-radius:7px;background:#f1f4f7;color:#718196;display:inline-grid;place-items:center;font-size:10px}.tag-empty{color:#a5b0bc;font-size:10px}
.tag-editor{display:flex;flex-direction:column;gap:15px}.tag-editor-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}.tag-editor-head strong{display:block;color:#273c50;font-size:13px}.tag-editor-head div>span{display:block;color:#8a98a7;font-size:10px;margin-top:5px}.tag-editor-head>span{padding:5px 8px;border-radius:7px;background:#eef4f8;color:#54728c;font-size:10px;white-space:nowrap}.tag-choice-grid{display:flex;flex-wrap:wrap;gap:8px;max-height:188px;overflow:auto;padding:2px}.tag-option{height:31px;border:1px solid #dfe7ed;border-radius:8px;background:#fff;color:#687b8e;padding:0 10px;display:inline-flex;align-items:center;gap:5px}.tag-option>.icon-stack{width:14px;height:14px;opacity:0}.tag-option.selected{background:#edf5fa;border-color:#c9ddea;color:#356f99}.tag-option.selected>.icon-stack{opacity:1}.tag-create-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px}
.transfer-summary{display:flex;align-items:center;gap:12px;padding:12px;border:1px solid #e1e8ee;border-radius:11px;background:#f8fafc;margin-bottom:15px}.transfer-summary .file-symbol{width:42px;height:42px}.transfer-summary strong{display:block;color:#283e52}.transfer-summary span{display:block;color:#8795a4;font-size:10px;line-height:1.5;margin-top:4px}.transfer-confirm{display:flex;align-items:flex-start;gap:8px;padding:12px 0;color:#5f7184;font-size:11px;line-height:1.55}.transfer-confirm .check{margin-top:2px}
'''
idx = html.rfind('</style>')
if idx < 0:
    raise RuntimeError('missing </style>')
html = html[:idx] + css + '\n' + html[idx:]

required = [MARKER, 'function personalTags(file)', 'function applyTags()', 'function applyGrant(id,space)', '转移所有权', '设置多标签', 'fluent-color:folder-24']
for item in required:
    if item not in html:
        raise RuntimeError(f'missing generated feature: {item}')

path.write_text(html, encoding='utf-8')
print('Applied personal space v8')
