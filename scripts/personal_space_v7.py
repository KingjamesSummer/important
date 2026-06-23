from pathlib import Path
import re

path = Path('web-prototype.html')
html = path.read_text(encoding='utf-8')
MARKER = 'personal-space-v7-functional-polish'

if MARKER in html:
    print('personal space v7 already applied')
    raise SystemExit(0)


def replace_function(source: str, name: str, next_name: str, replacement: str) -> str:
    pattern = rf"function {re.escape(name)}\([\s\S]*?(?=\nfunction {re.escape(next_name)}\()"
    updated, count = re.subn(pattern, replacement.rstrip(), source, count=1)
    if count != 1:
        raise RuntimeError(f'could not replace {name}: {count}')
    return updated

# Make pagination visible in the demo with a practical dense default.
html = html.replace('personalPageSize:10', 'personalPageSize:8', 1)
html = html.replace(
    " {id:'p8',type:'md',name:'技术备忘录.md',parent:'',modified:'2026-06-18 18:11',size:'84 KB',favorite:false,tag:'技术',status:'正常',access:'private',activity:'06-18 18:11 · 编辑'},",
    " {id:'p8',type:'md',name:'技术备忘录.md',parent:'',modified:'2026-06-18 18:11',size:'84 KB',favorite:false,tag:'技术',status:'正常',access:'private',activity:'06-18 18:11 · 编辑'},\n {id:'p9',type:'pdf',name:'培训资料清单.pdf',parent:'',modified:'2026-06-17 15:42',size:'1.8 MB',favorite:false,tag:'资料',status:'正常',access:'private',activity:'06-17 15:42 · 上传'},\n {id:'p10',type:'doc',name:'会议纪要模板.docx',parent:'',modified:'2026-06-16 11:26',size:'246 KB',favorite:false,tag:'模板',status:'正常',access:'shared',activity:'06-16 11:26 · 共享给 4 人'},\n {id:'p15',type:'md',name:'个人任务复盘.md',parent:'',modified:'2026-06-15 19:08',size:'56 KB',favorite:true,tag:'复盘',status:'正常',access:'private',activity:'06-15 19:08 · 编辑'},\n {id:'p16',type:'zip',name:'差旅票据归档.zip',parent:'',modified:'2026-06-14 14:10',size:'18.6 MB',favorite:false,tag:'归档',status:'正常',access:'private',activity:'06-14 14:10 · 上传'},",
    1,
)

# Upgrade helper semantics: clickable tags, clearer access ranges and better path navigation.
personal_tag_fn = r'''function personalTag(file){const tone={项目:'blue',计划:'cyan',临时:'gray',调研:'purple',任务:'green',汇报:'orange',设计:'pink',技术:'slate',需求:'blue',评审:'purple',资料:'cyan',模板:'slate',复盘:'green',归档:'gray'}[file.tag]||'gray';return `<button class="personal-tag tag-${tone}" title="筛选标签：${safe(file.tag||'未设置')}" onclick="event.stopPropagation();filterPersonalByTag('${safe(file.tag||'未设置')}')">${icon('tag')}<span>${safe(file.tag||'未设置')}</span></button>`}'''
html = replace_function(html, 'personalTag', 'personalAccess', personal_tag_fn)

personal_access_fn = r'''function personalAccess(file){const type=file.access||'private';const map={private:['lock','仅本人','private'],link:['link','安全外链','link'],shared:['share','共享成员','shared']};const item=map[type]||map.private;return `<span class="access-pill access-${item[2]}" title="${item[1]}">${icon(item[0])}<span>${item[1]}</span></span>`}'''
html = replace_function(html, 'personalAccess', 'personalPageFiles', personal_access_fn)

filter_tag_fn = r'''function filterPersonalByTag(tag){state.filters.tag=tag;state.personalPage=1;state.selected=[];state.detail=null;render()}'''
html = html.replace('\nfunction personalPageFiles(files){', '\n' + filter_tag_fn + '\nfunction personalPageFiles(files){', 1)

# Replace the paginator options while keeping the same compact footer.
html = html.replace("<option value=\"10\" ${state.personalPageSize===10?'selected':''}>10 条</option><option value=\"20\" ${state.personalPageSize===20?'selected':''}>20 条</option><option value=\"50\" ${state.personalPageSize===50?'selected':''}>50 条</option>", "<option value=\"8\" ${state.personalPageSize===8?'selected':''}>8 条</option><option value=\"16\" ${state.personalPageSize===16?'selected':''}>16 条</option><option value=\"32\" ${state.personalPageSize===32?'selected':''}>32 条</option>", 1)

personal_path_fn = r'''function personalPathbar(total){return `<div class="pathbar personal-pathbar">${state.folder.length?`<button class="path-back" onclick="goPersonalFolder(${state.folder.length-2})">${icon('arrowLeft')}返回上一级</button><span class="path-divider"></span>`:''}<button onclick="goPersonalFolder(-1)">${icon('home')}个人空间</button>${state.folder.map((name,index)=>`<span class="path-sep">/</span><button class="${index===state.folder.length-1?'current':''}" onclick="goPersonalFolder(${index})">${safe(name)}</button>`).join('')}<span class="path-context">${state.folder.length?'当前文件夹':'根目录'}</span><span class="count">${total} 项</span></div>`}'''
html = replace_function(html, 'personalPathbar', 'personalBulkControl', personal_path_fn)

# Use system-document concepts: activity + access range instead of a visually empty table.
html = html.replace('<th>访问状态</th>', '<th>访问范围</th>', 1)

# Build the destination tree from the actual personal folder hierarchy and make move/copy functional.
destination_tree_fn = r'''function personalDestinationNodes(parent='',level=0,mode='move'){const current=personalCurrentPath();const selectedFolders=state.selected.map(id=>personalFiles.find(x=>x.id===id)).filter(x=>x?.type==='folder').map(x=>[x.parent,x.name].filter(Boolean).join('/'));return personalFiles.filter(x=>x.type==='folder'&&(x.parent||'')===parent).map(folder=>{const path=[parent,folder.name].filter(Boolean).join('/');const blocked=(mode==='move'&&path===current)||selectedFolders.some(source=>path===source||path.startsWith(source+'/'));const children=personalDestinationNodes(path,level+1,mode);return `<div class="destination-node"><label class="destination-row level-${Math.min(level+1,4)} ${blocked?'is-disabled':''}"><input type="radio" name="destinationTarget" value="personal::${safe(path)}" ${blocked?'disabled':''}><span class="tree-caret ${children?'open':'empty'}">${children?icon('down'):''}</span>${icon('folder')}<span>${safe(folder.name)}</span>${blocked?'<small>不可选择</small>':''}</label>${children?`<div class="destination-children">${children}</div>`:''}</div>`}).join('')}
function destinationTree(mode='move'){const current=personalCurrentPath();const rootBlocked=mode==='move'&&current==='';const personalRoot=`<div class="destination-node"><label class="destination-row level-0 ${rootBlocked?'is-disabled':''}"><input type="radio" name="destinationTarget" value="personal::" ${rootBlocked?'disabled':''}><span class="tree-caret open">${icon('down')}</span>${icon('home')}<span>个人空间</span>${rootBlocked?'<small>当前目录</small>':''}</label><div class="destination-children">${personalDestinationNodes('',0,mode)}</div></div>`;const enterpriseRoot=`<div class="destination-node"><label class="destination-row level-0"><input type="radio" name="destinationTarget" value="enterprise::研发中心"><span class="tree-caret open">${icon('down')}</span>${icon('building')}<span>企业空间</span></label><div class="destination-children"><label class="destination-row level-1"><input type="radio" name="destinationTarget" value="enterprise::研发中心/技术方案"><span class="tree-caret empty"></span>${icon('folder')}<span>研发中心 / 技术方案</span></label><label class="destination-row level-1"><input type="radio" name="destinationTarget" value="enterprise::研发中心/交付文档"><span class="tree-caret empty"></span>${icon('folder')}<span>研发中心 / 交付文档</span></label></div></div>`;const collabRoot=`<div class="destination-node"><label class="destination-row level-0"><input type="radio" name="destinationTarget" value="collab::智能知识库一期项目"><span class="tree-caret empty"></span>${icon('users')}<span>协作空间 / 智能知识库一期项目</span></label></div>`;return `<div class="destination-tree">${personalRoot}${enterpriseRoot}${collabRoot}</div>`}'''
html = replace_function(html, 'destinationTree', 'completeDestination', destination_tree_fn)

complete_fn = r'''function copyPersonalEntry(entry,targetParent,nameOverride=''){const originalPath=[entry.parent,entry.name].filter(Boolean).join('/');const copiedName=nameOverride||entry.name;const copy={...entry,id:'copy'+Date.now()+Math.random().toString(36).slice(2,7),name:copiedName,parent:targetParent,modified:'2026-06-23 12:08',favorite:false,activity:'刚刚 · 复制'};personalFiles.push(copy);if(entry.type==='folder'){const copyPath=[targetParent,copiedName].filter(Boolean).join('/');personalFiles.filter(x=>(x.parent||'')===originalPath).slice().forEach(child=>copyPersonalEntry(child,copyPath))}}
function movePersonalEntries(targetParent){const selected=state.selected.map(id=>personalFiles.find(x=>x.id===id)).filter(Boolean);selected.forEach(entry=>{const oldPath=[entry.parent,entry.name].filter(Boolean).join('/');const newPath=[targetParent,entry.name].filter(Boolean).join('/');if(entry.type==='folder'){personalFiles.forEach(child=>{const parent=child.parent||'';if(parent===oldPath||parent.startsWith(oldPath+'/'))child.parent=newPath+parent.slice(oldPath.length)})}entry.parent=targetParent;entry.modified='2026-06-23 12:08';entry.activity='刚刚 · 移动'})}
function completeDestination(mode,space){const raw=document.querySelector('input[name="destinationTarget"]:checked')?.value;if(!raw)return toast('请选择目标文件夹','warning');const [targetSpace,targetPath='']=raw.split('::');const count=state.selected.length;if(space==='personal'&&targetSpace==='personal'){const selected=state.selected.map(id=>personalFiles.find(x=>x.id===id)).filter(Boolean);if(mode==='copy')selected.forEach(entry=>copyPersonalEntry(entry,targetPath,entry.type==='folder'?entry.name+' - 副本':entry.name.replace(/(\.[^.]+)?$/,m=>` - 副本${m||''}`)));else movePersonalEntries(targetPath);state.selected=[];state.detail=null;closeModal();toast(`已将 ${count} 项${mode==='copy'?'复制':'移动'}到“${targetPath||'个人空间'}”`);render();return}state.selected=[];state.detail=null;closeModal();toast(`已将 ${count} 项${mode==='copy'?'复制':'移动'}到“${targetPath}”`);render()}'''
html = replace_function(html, 'completeDestination', 'copySelectedToTarget', complete_fn)

# Keep legacy helper harmless but route it through the same completed behavior.
copy_target_fn = r'''function copySelectedToTarget(space,target){const count=state.selected.length;state.selected=[];closeModal();toast(`已将 ${count} 项复制到“${target}”`);render()}'''
html = replace_function(html, 'copySelectedToTarget', 'openModal', copy_target_fn)

html = html.replace('${destinationTree()}', '${destinationTree(mode)}', 1)

# Extend filter options to cover the new useful tags and folders.
html = html.replace('<option value="doc">Word 文档</option>', '<option value="folder">文件夹</option><option value="doc">Word 文档</option>', 1)
html = html.replace("['项目','计划','调研','任务','汇报','设计','技术','临时']", "['项目','计划','调研','任务','汇报','设计','技术','临时','需求','评审','资料','模板','复盘','归档']", 1)

css = r'''
/* personal-space-v7-functional-polish */
.personal-pathbar .path-back{height:28px;padding:0 8px;border:1px solid #dfe7f0;border-radius:7px;background:#fff;color:#536981}.personal-pathbar .path-back:hover{border-color:#bad1ed;color:#1769ff}.personal-pathbar .path-divider{width:1px;height:18px;margin:0 5px;background:#e5ebf2}
.personal-tag{border:1px solid transparent;cursor:pointer}.personal-tag:hover{filter:brightness(.98);box-shadow:0 2px 7px rgba(43,70,102,.08);transform:translateY(-1px)}
.destination-row small{margin-left:auto;color:#a0acba;font-size:9px;font-weight:500}.destination-row.is-disabled{opacity:.48;cursor:not-allowed}.destination-row.is-disabled:hover{background:transparent;color:#4b6078}.destination-row.level-3{padding-left:74px}.destination-row.level-4{padding-left:96px}
.personal-pagination{box-shadow:0 -1px 0 rgba(226,232,240,.5)}
'''
style_end = html.rfind('</style>')
if style_end < 0:
    raise RuntimeError('missing </style>')
html = html[:style_end] + css + '\n' + html[style_end:]

path.write_text(html, encoding='utf-8')
print('Applied personal space v7 functional polish')
