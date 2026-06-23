from pathlib import Path
import re

path = Path('web-prototype.html')
html = path.read_text(encoding='utf-8')
MARKER = 'personal-space-v5-1-scope-polish'

if MARKER in html:
    print('v5.1 already applied')
    raise SystemExit(0)

selection_fn = r'''function selectionBar(space){const count=state.selected.length;if(space!=='personal'){if(!count)return'';return `<div class="selection-bar"><strong>已选择 ${count} 项</strong><button class="btn compact" onclick="toast('已加入 '+count+' 个下载任务')">${icon('download')}下载</button><button class="btn compact" onclick="openModal('destination',{space,mode:'move'})">${icon('move')}移动</button><button class="btn compact" onclick="openModal('destination',{space,mode:'copy'})">${icon('copy')}复制到</button><button class="btn compact" onclick="openModal('delete',{space})">${icon('trash')}删除</button><button class="btn compact" onclick="showSelectedDetail()">${icon('info')}详情</button><div class="spacer"></div><button class="btn ghost icon-only compact" onclick="clearSelection()">${icon('x')}</button></div>`}const has=count>0;const one=count===1;const disabled=has?'':'disabled';const oneDisabled=one?'':'disabled';return `<div class="selection-bar static-selection-bar" data-space="personal"><strong class="selection-count">${has?`已选择 ${count} 项`:'未选择文件'}</strong><button class="btn compact action-download" ${disabled} onclick="toast('已加入 '+state.selected.length+' 个下载任务')">${icon('download')}下载</button><button class="btn compact action-move" ${disabled} onclick="openModal('destination',{space:'personal',mode:'move'})">${icon('move')}移动</button><button class="btn compact action-copy" ${disabled} onclick="openModal('destination',{space:'personal',mode:'copy'})">${icon('copy')}复制到</button><button class="btn compact action-favorite" ${disabled} onclick="toggleFavoriteSelected()">${icon('star')}收藏</button><button class="btn compact action-tag" ${disabled} onclick="openModal('tag')">${icon('tag')}标签</button><button class="btn compact action-delete" ${disabled} onclick="openModal('delete',{space:'personal'})">${icon('trash')}删除</button><button class="btn compact action-detail" ${oneDisabled} onclick="showSelectedDetail()">${icon('info')}详情</button><div class="spacer"></div><button class="btn ghost icon-only compact action-clear" ${disabled} title="取消选择" onclick="clearSelection()">${icon('x')}</button></div>`}'''
html, count = re.subn(
    r"function selectionBar\(space\)\{[\s\S]*?(?=\nfunction fileTable\()",
    selection_fn,
    html,
    count=1,
)
if count != 1:
    raise RuntimeError('selectionBar hotfix failed')

html = html.replace(
    '.profile-item:hover{background:#f1f6fd;color:#1769ff}.profile-item>span:last-child{',
    '.profile-item:hover{background:#f1f6fd;color:#1769ff}.profile-item.admin-entry>span:last-child{',
    1,
)

css = r'''
/* personal-space-v5-1-scope-polish */
.personal-panel>.filter-pop{top:72px;right:88px}
.upload-method-pop button>span{grid-column:auto!important;margin-top:0!important;font-size:inherit;color:inherit}
.upload-method-pop button>.icon-stack{padding:0!important;background:transparent!important}
.profile-item>.icon-stack{margin-left:0!important;padding:0!important;background:transparent!important;font-size:inherit!important;color:currentColor!important}
'''
style_end = html.rfind('</style>')
if style_end < 0:
    raise RuntimeError('missing style end')
html = html[:style_end] + css + '\n' + html[style_end:]

path.write_text(html, encoding='utf-8')
print('Applied personal space v5.1 scope polish')
