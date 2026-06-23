from pathlib import Path
import re

path = Path('web-prototype.html')
html = path.read_text(encoding='utf-8')
MARKER = 'personal-space-v8-integrity-polish'

if MARKER in html:
    print('personal space v8 integrity polish already applied')
    raise SystemExit(0)


def replace_function(source: str, name: str, next_name: str, replacement: str) -> str:
    pattern = rf"function {re.escape(name)}\([\s\S]*?(?=\nfunction {re.escape(next_name)}\()"
    updated, count = re.subn(pattern, replacement.rstrip(), source, count=1)
    if count != 1:
        raise RuntimeError(f'could not replace {name}: {count}')
    return updated

# Keep the longer right-click menu inside the viewport.
open_menu = r'''function openMenu(e,id,space){e.preventDefault?.();const trigger=e.currentTarget||e.target;const rect=trigger.getBoundingClientRect();const width=232;const pointerX=e.clientX||rect.right;const pointerY=e.clientY||rect.bottom;const estimatedHeight=space==='personal'?610:430;const x=Math.max(10,Math.min(pointerX+4,innerWidth-width-10));const y=Math.max(10,Math.min(pointerY+4,innerHeight-estimatedHeight-10));if(!state.selected.includes(id))state.selected=[id];state.detail=null;state.menu={x,y,id,space,type:'file'};state.profileOpen=false;state.personalUploadOpen=false;if(space==='personal')syncPersonalSelection();renderOverlays()}'''
html = replace_function(html, 'openMenu', 'openCollabMenu', open_menu)

# Folder-aware deletion: a selected folder removes its complete subtree into recovery.
delete_fn = r'''function deleteSelected(space){let removed=[];if(space==='personal'){const selected=personalFiles.filter(x=>state.selected.includes(x.id));const roots=selected.filter(x=>x.type==='folder').map(x=>[x.parent,x.name].filter(Boolean).join('/'));removed=personalFiles.filter(x=>state.selected.includes(x.id)||roots.some(root=>{const parent=x.parent||'';return parent===root||parent.startsWith(root+'/')}));const ids=new Set(removed.map(x=>x.id));personalFiles=personalFiles.filter(x=>!ids.has(x.id))}else if(space==='enterprise'){removed=enterpriseFiles[state.dept].filter(x=>state.selected.includes(x.id));enterpriseFiles[state.dept]=enterpriseFiles[state.dept].filter(x=>!state.selected.includes(x.id))}removed.forEach(x=>recycle.unshift({id:'r'+Date.now()+Math.random(),name:x.name,path:space==='personal'?'个人空间'+(x.parent?' / '+x.parent:''):'企业空间 / '+state.dept,deleted:'2026-06-23 13:20',expire:'剩余 30 天',size:x.size||'—',type:x.type}));state.selected=[];state.detail=null;closeModal();toast(`已将 ${removed.length} 项移入误删恢复`);render()}'''
html = replace_function(html, 'deleteSelected', 'applyTag', delete_fn)

# Preserve folder hierarchy when renaming a personal folder.
rename_fn = r'''function renameItem(id,space){const f=findFile(id,space);const value=document.getElementById('renameValue')?.value.trim();if(!f||!value)return toast('请输入新的名称','warning');if(/[\\/:*?"<>|]/.test(value))return toast('名称包含不支持的字符','warning');if(space==='personal'&&f.type==='folder'){const oldPath=[f.parent,f.name].filter(Boolean).join('/');const newPath=[f.parent,value].filter(Boolean).join('/');personalFiles.forEach(child=>{const parent=child.parent||'';if(parent===oldPath||parent.startsWith(oldPath+'/'))child.parent=newPath+parent.slice(oldPath.length)})}f.name=value;f.modified='2026-06-23 13:20';f.activity='刚刚 · 重命名';closeModal();toast('名称已更新');render()}'''
html = replace_function(html, 'renameItem', 'copyItem', rename_fn)

# Grid view also exposes tags, not only access range.
grid_fn = r'''function personalGrid(files){return `<div class="grid-zone"><div class="file-grid">${files.map(f=>`<div data-file-id="${f.id}" class="file-card ${state.selected.includes(f.id)?'selected':''}" onclick="rowClick(event,'${f.id}','personal')" ondblclick="openFile('${f.id}','personal')" oncontextmenu="openMenu(event,'${f.id}','personal')"><input class="check" type="checkbox" ${state.selected.includes(f.id)?'checked':''} onclick="event.stopPropagation();toggleOne('${f.id}',this.checked)"><button class="more-btn" onclick="event.stopPropagation();openMenu(event,'${f.id}','personal')">${icon('more')}</button>${fileVisual(f)}<button class="file-card-name file-entry-link" onclick="event.stopPropagation();openFile('${f.id}','personal')">${safe(f.name)}</button><div class="file-card-meta"><span>${f.type==='folder'?personalFolderCount(f):safe(f.size||'—')}</span><span>${safe(f.modified.slice(5,10))}</span></div><div class="file-card-tags">${personalTag(f)}</div><div class="file-card-access">${personalAccess(f)}</div></div>`).join('')}</div></div>`}'''
html = replace_function(html, 'personalGrid', 'collaboration', grid_fn)

css = r'''
/* personal-space-v8-integrity-polish */
.upload-method-pop button{display:grid!important;grid-template-columns:42px minmax(0,1fr)!important;align-items:center!important}
.personal-file-table col.personal-tag-col{width:190px}.personal-file-table col.personal-activity-col{width:18%}.personal-file-table .personal-tags{max-width:180px}
.file-card-tags{width:100%;min-height:25px;margin-top:9px;display:flex;justify-content:center}.file-card-tags .personal-tags{justify-content:center}.file-card-tags .personal-tag{max-width:72px}
@media(max-width:1380px){.personal-file-table col.personal-tag-col{width:155px}.personal-file-table .personal-tag:nth-child(n+2){display:none}.personal-file-table .tag-more{display:inline-grid}}
'''
idx = html.rfind('</style>')
if idx < 0:
    raise RuntimeError('missing </style>')
html = html[:idx] + css + '\n' + html[idx:]

for item in [MARKER, 'estimatedHeight=space===\'personal\'?610:430', 'function deleteSelected(space)', 'function renameItem(id,space)', 'file-card-tags']:
    if item not in html:
        raise RuntimeError(f'missing integrity feature: {item}')

path.write_text(html, encoding='utf-8')
print('Applied personal space v8 integrity polish')
