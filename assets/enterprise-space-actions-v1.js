/* Enterprise space actions v1 — reuse personal-space interactions with enterprise rules. */
(()=>{
'use strict';
if(document.documentElement.dataset.enterpriseSpaceActionsV1)return;
document.documentElement.dataset.enterpriseSpaceActionsV1='1';
if(typeof state==='undefined'||typeof render!=='function'||typeof enterpriseFiles==='undefined')return;

Object.assign(window.ONLINE_ICONS||{}, {
  folderUpload:'lucide:folder-up',
  fileUpload:'lucide:file-up',
  history:'lucide:history',
  activity:'lucide:scroll-text',
  warning:'lucide:triangle-alert',
  shield:'lucide:shield-check'
});

const nowText=()=>{
  const d=new Date();
  const pad=value=>String(value).padStart(2,'0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const currentLibraryName=()=>state.dept==='集团资料库'?'企业资料库':`${state.dept}公共资料库`;
const currentPath=()=>state.folder.join('/');
const filesForDept=dept=>enterpriseFiles[dept]||(enterpriseFiles[dept]=[]);
const typeFromName=name=>{
  const ext=(String(name).split('.').pop()||'').toLowerCase();
  if(['doc','docx'].includes(ext))return'doc';
  if(ext==='pdf')return'pdf';
  if(['xls','xlsx','csv'].includes(ext))return'xls';
  if(['ppt','pptx'].includes(ext))return'ppt';
  if(['png','jpg','jpeg','gif','webp','svg'].includes(ext))return'img';
  if(['zip','rar','7z','tar','gz'].includes(ext))return'zip';
  if(['md','markdown','txt'].includes(ext))return'md';
  return'doc';
};
const formatSize=size=>{
  const value=Number(size)||0;
  if(value<1024)return`${value} B`;
  if(value<1024*1024)return`${(value/1024).toFixed(1)} KB`;
  if(value<1024*1024*1024)return`${(value/1024/1024).toFixed(1)} MB`;
  return`${(value/1024/1024/1024).toFixed(2)} GB`;
};
const safeText=value=>typeof safe==='function'?safe(value):String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const itemVisual=item=>typeof enterpriseFileVisual==='function'?enterpriseFileVisual(item):(typeof fileVisual==='function'?fileVisual(item):'');
const shell=(title,body,foot,extra='')=>typeof modalShell==='function'
  ?modalShell(title,body,foot,extra)
  :`<div class="modal-layer" onclick="if(event.target===this)closeModal()"><div class="modal ${extra}"><div class="modal-head">${title}<button class="btn ghost icon-only" onclick="closeModal()">${icon('x')}</button></div><div class="modal-body">${body}</div><div class="modal-foot">${foot}</div></div></div>`;

const style=document.createElement('style');
style.id='enterprise-space-actions-v1-style';
style.textContent=`
.enterprise-mode .enterprise-panel,.enterprise-mode .enterprise-panel *{background-image:none!important}
.enterprise-mode .enterprise-library-context-v4,.enterprise-mode .enterprise-library-context-v7{box-shadow:none!important}
.enterprise-mode .enterprise-context-copy-v4 strong,.enterprise-mode .enterprise-context-copy-v7 strong,.enterprise-mode .file-entry-link{color:#172b43}
.enterprise-mode .enterprise-context-copy-v4 span,.enterprise-mode .enterprise-context-copy-v7 span,.enterprise-mode .file-name-meta,.enterprise-mode .enterprise-activity-v4{color:#6d7f91}
.enterprise-mode .enterprise-file-table tbody tr:hover{background:#f7fbff}
.enterprise-mode .enterprise-file-table tbody tr.selected{background:#edf6ff!important}
.enterprise-operation-summary{display:flex;align-items:center;gap:12px;padding:12px;border:1px solid #dce6f2;border-radius:11px;background:#f8fbff;margin-bottom:14px}
.enterprise-operation-summary .file-symbol,.enterprise-operation-summary .enterprise-file-visual-v8{width:42px;height:42px;flex:none}
.enterprise-operation-summary strong{display:block;color:#23384d;font-size:13px}
.enterprise-operation-summary span{display:block;margin-top:4px;color:#75879a;font-size:10px;line-height:1.55}
.enterprise-risk-list{display:grid;gap:8px;margin:14px 0;padding:12px;border:1px solid #f0d8b5;border-radius:10px;background:#fffaf2;color:#72572f;font-size:10px;line-height:1.55}
.enterprise-risk-list div{display:flex;gap:7px;align-items:flex-start}.enterprise-risk-list .icon-stack{width:15px;height:15px;flex:none;margin-top:1px;color:#b37a27}
.enterprise-confirm{display:flex;align-items:flex-start;gap:8px;margin-top:13px;color:#52667a;font-size:11px;line-height:1.55}.enterprise-confirm .check{margin-top:2px}
.enterprise-upload-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.enterprise-upload-option{min-height:118px;padding:16px;border:1px solid #dce6f2;border-radius:12px;background:#fff;text-align:left;display:flex;flex-direction:column;align-items:flex-start;gap:8px;color:#29445f}
.enterprise-upload-option:hover{border-color:#8fbeef;background:#f7fbff}.enterprise-upload-option>.icon-stack{width:38px;height:38px;display:grid;place-items:center;border:1px solid #d8e7f7;border-radius:10px;background:#edf6ff;color:#1769ff}
.enterprise-upload-option strong{font-size:13px}.enterprise-upload-option span{color:#718397;font-size:10px;line-height:1.55}
.enterprise-upload-note{margin-top:13px;padding:10px 12px;border:1px solid #dce7f4;border-radius:9px;background:#f9fbfe;color:#65798e;font-size:10px;line-height:1.6}
.enterprise-destination-modal .destination-v9-layout{min-height:390px}.enterprise-destination-modal .destination-v9-spaces{width:190px}
.enterprise-destination-library{padding:9px 12px;color:#516a82;font-size:10px;font-weight:650;background:#f6f9fd;border-bottom:1px solid #e6edf5}
.enterprise-destination-empty{padding:28px;text-align:center;color:#8a99a9;font-size:11px}
.enterprise-info-tabs{display:flex;gap:6px;margin-bottom:14px;border-bottom:1px solid #e6edf4}.enterprise-info-tabs button{height:35px;padding:0 11px;border:0;border-bottom:2px solid transparent;background:transparent;color:#718398}.enterprise-info-tabs button.active{border-bottom-color:#1769ff;color:#1769ff;font-weight:650}
.enterprise-info-pane{display:grid;gap:10px}.enterprise-info-row{display:grid;grid-template-columns:90px minmax(0,1fr);gap:12px;padding:9px 0;border-bottom:1px solid #edf2f7;font-size:11px}.enterprise-info-row span:first-child{color:#8090a0}.enterprise-info-row span:last-child{color:#293e53}
.enterprise-audit-item{display:grid;grid-template-columns:30px minmax(0,1fr);gap:9px;padding:10px 0;border-bottom:1px solid #edf2f7}.enterprise-audit-icon{width:28px;height:28px;display:grid;place-items:center;border-radius:8px;background:#eef6ff;color:#1769ff}.enterprise-audit-copy strong{display:block;color:#2b4055;font-size:11px}.enterprise-audit-copy span{display:block;margin-top:3px;color:#8391a0;font-size:9px}
@media(max-width:900px){.enterprise-upload-grid{grid-template-columns:1fr}.enterprise-destination-modal .destination-v9-spaces{width:155px}}
`;
document.head.appendChild(style);

function directChildren(dept,parent=''){
  return filesForDept(dept).filter(item=>item.type==='folder'&&(item.parent||'')===parent);
}
function folderTree(dept,parent='',level=0,mode='move'){
  const selected=state.selected.map(id=>filesForDept(state.dept).find(item=>item.id===id)).filter(Boolean);
  const selectedRoots=selected.filter(item=>item.type==='folder').map(item=>[item.parent,item.name].filter(Boolean).join('/'));
  return directChildren(dept,parent).map(folder=>{
    const path=[parent,folder.name].filter(Boolean).join('/');
    const sourceSame=dept===state.dept;
    const blocked=(sourceSame&&path===currentPath())||(sourceSame&&selectedRoots.some(root=>path===root||path.startsWith(root+'/')));
    return `<div class="destination-v9-node"><label class="destination-v9-row ${blocked?'disabled':''}" style="--level:${level}"><input class="destination-v9-radio" type="radio" name="enterpriseDestination" value="${safeText(dept)}::${safeText(path)}" ${blocked?'disabled':''} onchange="selectEnterpriseDestination(this,'${mode}')">${icon('folder')}<span class="destination-v9-name">${safeText(folder.name)}</span><span class="destination-v9-state">${blocked?'不可选择':sourceSame?'同资料库':'跨部门资料库'}</span><span class="destination-v9-check">${icon('check')}</span></label>${folderTree(dept,path,level+1,mode)}</div>`;
  }).join('');
}
function destinationModal(payload){
  const mode=payload.mode||'move';
  const depts=Object.keys(enterpriseFiles);
  const libraries=depts.map(dept=>{
    const display=dept==='集团资料库'?'企业资料库':`${dept}公共资料库`;
    const rootBlocked=dept===state.dept&&currentPath()==='';
    return `<section class="enterprise-destination-section"><div class="enterprise-destination-library">${safeText(display)}</div><label class="destination-v9-row root ${rootBlocked?'disabled':''}" style="--level:0"><input class="destination-v9-radio" type="radio" name="enterpriseDestination" value="${safeText(dept)}::" ${rootBlocked?'disabled':''} onchange="selectEnterpriseDestination(this,'${mode}')">${icon(dept==='集团资料库'?'building':'folder')}<span class="destination-v9-name">资料库根目录</span><span class="destination-v9-state">${rootBlocked?'当前目录':dept===state.dept?'当前资料库':'需具备目标资料库写入权限'}</span><span class="destination-v9-check">${icon('check')}</span></label>${folderTree(dept,'',1,mode)}</section>`;
  }).join('');
  const body=`<div class="destination-v9-layout"><aside class="destination-v9-spaces"><div class="destination-v9-side-title">企业资料库</div>${depts.map((dept,index)=>`<button type="button" class="destination-space-item ${index===0?'active':''}" data-dept="${safeText(dept)}" onclick="showEnterpriseDestinationDept('${safeText(dept)}',this)">${icon(dept==='集团资料库'?'building':'folder')}<span>${safeText(dept==='集团资料库'?'企业资料库':dept)}</span></button>`).join('')}</aside><section class="destination-v9-browser"><div class="destination-v9-browser-head"><div><strong>选择目标文件夹</strong><span>仅显示当前账号可写入的企业资料库目录</span></div><div class="destination-v9-search">${icon('search')}<input placeholder="搜索文件夹" oninput="filterEnterpriseDestination(this.value)"></div></div><div class="destination-v9-tree">${libraries||'<div class="enterprise-destination-empty">暂无可写入的企业资料库</div>'}</div></section></div><div class="destination-v9-footer-note"><span>${icon('info')}${mode==='copy'?'复制到其他部门资料库会创建新的组织资产，并继承目标资料库权限。':'移动到其他部门资料库会改变文件的组织归属与权限来源。'}</span><strong>已选位置：<b id="enterpriseDestinationText">尚未选择</b></strong></div><label class="enterprise-confirm" id="enterpriseDestinationRisk" hidden><input class="check" id="enterpriseDestinationRiskCheck" type="checkbox" onchange="syncEnterpriseDestinationRisk()"><span>${mode==='copy'?'我已确认将在目标部门资料库创建副本。':'我已确认跨部门移动会改变组织归属和权限来源。'}</span></label>`;
  const foot=`<button class="btn" onclick="closeModal()">取消</button><button class="btn primary" id="enterpriseDestinationSubmit" disabled onclick="completeEnterpriseDestination('${mode}')">${mode==='copy'?'复制到此处':'移动到此处'}</button>`;
  return shell(mode==='copy'?'复制到':'移动到',body,foot,'wide destination-v9-modal enterprise-destination-modal');
}
window.showEnterpriseDestinationDept=function(dept,button){
  document.querySelectorAll('.enterprise-destination-modal .destination-space-item').forEach(item=>item.classList.toggle('active',item===button));
  document.querySelectorAll('.enterprise-destination-section').forEach(section=>{const label=section.querySelector('input')?.value.split('::')[0];section.hidden=label!==dept});
};
window.filterEnterpriseDestination=function(value){
  const q=String(value||'').trim().toLowerCase();
  const active=document.querySelector('.enterprise-destination-modal .destination-space-item.active')?.dataset.dept;
  document.querySelectorAll('.enterprise-destination-section').forEach(section=>{
    const dept=section.querySelector('input')?.value.split('::')[0];
    section.hidden=dept!==active;
    if(dept===active)section.querySelectorAll('.destination-v9-row').forEach(row=>{const name=row.querySelector('.destination-v9-name')?.textContent.toLowerCase()||'';row.hidden=!!q&&!name.includes(q)});
  });
};
window.selectEnterpriseDestination=function(input){
  document.querySelectorAll('.enterprise-destination-modal .destination-v9-row').forEach(row=>row.classList.toggle('selected',row.contains(input)&&input.checked));
  const [dept,path]=input.value.split('::');
  const display=dept==='集团资料库'?'企业资料库':`${dept}公共资料库`;
  const text=document.getElementById('enterpriseDestinationText');if(text)text.textContent=`${display}${path?' / '+path:''}`;
  const crossDept=dept!==state.dept;const risk=document.getElementById('enterpriseDestinationRisk');const check=document.getElementById('enterpriseDestinationRiskCheck');const submit=document.getElementById('enterpriseDestinationSubmit');
  if(risk)risk.hidden=!crossDept;if(check&&!crossDept)check.checked=false;if(submit)submit.disabled=crossDept&&!check?.checked;
};
window.syncEnterpriseDestinationRisk=function(){const submit=document.getElementById('enterpriseDestinationSubmit');const check=document.getElementById('enterpriseDestinationRiskCheck');if(submit)submit.disabled=!check?.checked};

function selectedRoots(){
  const selected=state.selected.map(id=>filesForDept(state.dept).find(item=>item.id===id)).filter(Boolean);
  return selected.filter(item=>!selected.some(other=>other!==item&&other.type==='folder'&&((item.parent||'')===[other.parent,other.name].filter(Boolean).join('/')||(item.parent||'').startsWith([other.parent,other.name].filter(Boolean).join('/')+'/'))));
}
function collectBranch(dept,root){
  const all=filesForDept(dept);if(root.type!=='folder')return[root];
  const rootPath=[root.parent,root.name].filter(Boolean).join('/');
  return all.filter(item=>item.id===root.id||(item.parent||'')===rootPath||(item.parent||'').startsWith(rootPath+'/'));
}
function uniqueName(dept,parent,name){
  const existing=new Set(filesForDept(dept).filter(item=>(item.parent||'')===parent).map(item=>item.name));
  if(!existing.has(name))return name;
  const dot=name.lastIndexOf('.');const stem=dot>0?name.slice(0,dot):name;const ext=dot>0?name.slice(dot):'';
  let index=1;while(existing.has(`${stem} (${index})${ext}`))index+=1;
  return `${stem} (${index})${ext}`;
}
window.completeEnterpriseDestination=function(mode){
  const target=document.querySelector('input[name="enterpriseDestination"]:checked');
  if(!target)return toast('请选择目标文件夹','warning');
  const [targetDept,targetParent='']=target.value.split('::');
  const sourceDept=state.dept;if(targetDept!==sourceDept&&!document.getElementById('enterpriseDestinationRiskCheck')?.checked)return toast('请确认跨部门操作影响','warning');const roots=selectedRoots();
  if(!roots.length)return toast('请选择要处理的文件或文件夹','warning');
  const targetItems=filesForDept(targetDept);const timestamp=nowText();let affected=0;
  roots.forEach(root=>{
    const branch=collectBranch(sourceDept,root);const oldRoot=[root.parent,root.name].filter(Boolean).join('/');const rootName=uniqueName(targetDept,targetParent,root.name);const newRoot=[targetParent,rootName].filter(Boolean).join('/');
    if(mode==='copy'){
      branch.forEach(item=>{const relative=item.id===root.id?'':(item.parent||'').slice(oldRoot.length).replace(/^\//,'');targetItems.push({...item,id:`enterprise-copy-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,name:item.id===root.id?rootName:item.name,parent:item.id===root.id?targetParent:[newRoot,relative].filter(Boolean).join('/'),modified:timestamp,owner:'当前用户',activity:'刚刚 · 复制'})});
    }else{
      branch.forEach(item=>{const relative=item.id===root.id?'':(item.parent||'').slice(oldRoot.length).replace(/^\//,'');item.name=item.id===root.id?rootName:item.name;item.parent=item.id===root.id?targetParent:[newRoot,relative].filter(Boolean).join('/');item.modified=timestamp;item.owner='当前用户';item.activity='刚刚 · 移动'});
      if(targetDept!==sourceDept){const ids=new Set(branch.map(item=>item.id));enterpriseFiles[sourceDept]=filesForDept(sourceDept).filter(item=>!ids.has(item.id));targetItems.push(...branch)}
    }
    affected+=branch.length;
  });
  state.enterprisePage=1;state.selected=[];state.detail=null;closeModal();toast(`${mode==='copy'?'复制':'移动'}完成，共处理 ${affected} 项${targetDept!==sourceDept?'；组织归属与权限来源已按目标资料库更新':''}`);render();
};

function uploadModal(){
  const body=`<div class="enterprise-upload-grid"><button type="button" class="enterprise-upload-option" onclick="pickEnterpriseUpload('file')">${icon('fileUpload')}<strong>上传文件</strong><span>支持多选；同名文件自动追加序号，单文件最大 5GB。</span></button><button type="button" class="enterprise-upload-option" onclick="pickEnterpriseUpload('folder')">${icon('folderUpload')}<strong>上传文件夹</strong><span>保留本地目录层级，文件夹及子文件统一进入当前目录。</span></button></div><div class="enterprise-upload-note">目标位置：${safeText(currentLibraryName())}${currentPath()?' / '+safeText(currentPath()):''}<br>上传内容属于组织资产，实际可用操作由当前资料库权限决定。</div>`;
  return shell('上传到企业空间',body,'<button class="btn" onclick="closeModal()">取消</button>','enterprise-upload-modal');
}
window.pickEnterpriseUpload=function(kind){
  const input=document.createElement('input');input.type='file';input.multiple=true;
  if(kind==='folder'){input.webkitdirectory=true;input.setAttribute('directory','')}
  input.onchange=()=>{
    const chosen=[...input.files];if(!chosen.length)return;
    const deptFiles=filesForDept(state.dept);const parent=currentPath();const timestamp=nowText();let added=0;
    if(kind==='folder'){
      chosen.forEach(file=>{const parts=(file.webkitRelativePath||file.name).split('/').filter(Boolean);for(let i=0;i<parts.length-1;i++){const folderParent=[parent,...parts.slice(0,i)].filter(Boolean).join('/');const folderName=parts[i];if(!deptFiles.some(item=>item.type==='folder'&&(item.parent||'')===folderParent&&item.name===folderName)){deptFiles.unshift({id:`enterprise-folder-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,type:'folder',name:folderName,parent:folderParent,modified:timestamp,owner:'当前用户',status:'正常',tag:'文件夹',activity:'刚刚 · 上传文件夹'});added++}}const fileParent=[parent,...parts.slice(0,-1)].filter(Boolean).join('/');deptFiles.unshift({id:`enterprise-file-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,type:typeFromName(file.name),name:uniqueName(state.dept,fileParent,file.name),parent:fileParent,size:formatSize(file.size),modified:timestamp,owner:'当前用户',status:'正常',tags:['新上传'],activity:'刚刚 · 上传'});added++});
    }else chosen.forEach(file=>{deptFiles.unshift({id:`enterprise-file-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,type:typeFromName(file.name),name:uniqueName(state.dept,parent,file.name),parent,size:formatSize(file.size),modified:timestamp,owner:'当前用户',status:'正常',tags:['新上传'],activity:'刚刚 · 上传'});added++});
    state.enterprisePage=1;closeModal();toast(`已上传 ${added} 项到${currentLibraryName()}`);render();
  };
  input.click();
};

function newFolderModal(){
  const body=`<div class="field"><label>文件夹名称</label><input class="input" id="folderName" maxlength="80" autofocus placeholder="请输入文件夹名称" onkeydown="if(event.key==='Enter')createFolder('enterprise')"></div><div class="enterprise-upload-note">创建位置：${safeText(currentLibraryName())}${currentPath()?' / '+safeText(currentPath()):''}<br>文件夹继承当前目录的组织归属和权限来源。</div>`;
  return shell('新建文件夹',body,'<button class="btn" onclick="closeModal()">取消</button><button class="btn primary" onclick="createFolder(\'enterprise\')">创建</button>');
}
function renameModal(payload){
  const file=findFile(payload.id,'enterprise');if(!file)return'';
  const body=`<div class="enterprise-operation-summary">${itemVisual(file)}<div><strong>${safeText(file.name)}</strong><span>${file.type==='folder'?'重命名文件夹后，子项路径会同步更新。':'仅修改业务文件名，不改变存储对象。'}</span></div></div><div class="field"><label>新名称</label><input class="input" id="renameValue" maxlength="120" value="${safeText(file.name)}" onkeydown="if(event.key==='Enter')renameItem('${file.id}','enterprise')"></div>`;
  return shell('重命名',body,`<button class="btn" onclick="closeModal()">取消</button><button class="btn primary" onclick="renameItem('${safeText(file.id)}','enterprise')">保存</button>`);
}
function deleteModal(){
  const roots=selectedRoots();const descendants=roots.reduce((sum,item)=>sum+collectBranch(state.dept,item).length,0);const names=roots.slice(0,3).map(item=>item.name).join('、');
  const body=`<div class="enterprise-operation-summary">${icon('trash')}<div><strong>将 ${roots.length} 个选中项移入误删恢复</strong><span>${safeText(names)}${roots.length>3?' 等':''}；共影响 ${descendants} 个文件或文件夹。</span></div></div><div class="enterprise-risk-list"><div>${icon('warning')}<span>所选内容及文件夹子项将从当前资料库移除，现有访问入口立即失效。</span></div><div>${icon('link')}<span>相关安全外链将停止访问；恢复文件后需重新确认外链状态。</span></div><div>${icon('activity')}<span>操作会写入审计记录，可在误删恢复中于保留期内恢复。</span></div></div><label class="enterprise-confirm"><input class="check" id="enterpriseDeleteConfirm" type="checkbox" onchange="document.getElementById('enterpriseDeleteSubmit').disabled=!this.checked"><span>我已确认删除范围和影响。</span></label>`;
  const foot=`<button class="btn" onclick="closeModal()">取消</button><button class="btn danger" id="enterpriseDeleteSubmit" disabled onclick="deleteSelected('enterprise')">移入误删恢复</button>`;
  return shell('确认删除',body,foot);
}
function infoModal(payload){
  const file=findFile(payload.id,'enterprise');if(!file)return'';const mode=payload.mode||'permission';
  const permission=`<div class="enterprise-info-pane"><div class="enterprise-info-row"><span>当前角色</span><span>操作者</span></div><div class="enterprise-info-row"><span>权限来源</span><span>${state.dept==='集团资料库'?'管理员授权范围':'部门默认权限与显式授权共同决定'}</span></div><div class="enterprise-info-row"><span>可执行操作</span><span>预览、下载、上传、修改、删除、分享</span></div><div class="enterprise-info-row"><span>所属资料库</span><span>${safeText(currentLibraryName())}</span></div></div>`;
  const versions=`<div class="enterprise-info-pane"><div class="enterprise-audit-item"><span class="enterprise-audit-icon">${icon('history')}</span><span class="enterprise-audit-copy"><strong>当前版本</strong><span>${safeText(file.modified)} · ${safeText(file.owner||'文件管理员')} 更新</span></span></div><div class="enterprise-audit-item"><span class="enterprise-audit-icon">${icon('info')}</span><span class="enterprise-audit-copy"><strong>历史版本能力保留</strong><span>当前原型展示入口；正式版本需接入文件版本服务。</span></span></div></div>`;
  const audit=`<div class="enterprise-info-pane"><div class="enterprise-audit-item"><span class="enterprise-audit-icon">${icon('activity')}</span><span class="enterprise-audit-copy"><strong>${safeText(file.activity||'最近查看')}</strong><span>${safeText(file.modified)} · ${safeText(file.owner||'文件管理员')}</span></span></div><div class="enterprise-audit-item"><span class="enterprise-audit-icon">${icon('shield')}</span><span class="enterprise-audit-copy"><strong>权限校验通过</strong><span>访问来源：${state.dept==='集团资料库'?'管理员授权范围':'部门关系 / 显式授权'}</span></span></div></div>`;
  const panes={permission,versions,audit};
  const body=`<div class="enterprise-operation-summary">${itemVisual(file)}<div><strong>${safeText(file.name)}</strong><span>${safeText(currentLibraryName())}${file.parent?' / '+safeText(file.parent):''}</span></div></div><div class="enterprise-info-tabs"><button class="${mode==='permission'?'active':''}" onclick="openModal('enterpriseInfo',{id:'${file.id}',mode:'permission'})">权限</button><button class="${mode==='versions'?'active':''}" onclick="openModal('enterpriseInfo',{id:'${file.id}',mode:'versions'})">版本</button><button class="${mode==='audit'?'active':''}" onclick="openModal('enterpriseInfo',{id:'${file.id}',mode:'audit'})">操作记录</button></div>${panes[mode]}`;
  return shell('文件信息',body,'<button class="btn primary" onclick="closeModal()">完成</button>','wide');
}

const baseStartUpload=startUpload;
startUpload=function(space){if(space!=='enterprise')return typeof baseStartUpload==='function'?baseStartUpload(space):undefined;openModal('enterpriseUpload',{space:'enterprise'})};

const baseOpenModal=openModal;
openModal=function(type,payload={}){
  if(type==='destination'&&payload?.space==='enterprise')type='enterpriseDestination';
  return baseOpenModal(type,payload);
};

const baseModalContent=modalContent;
modalContent=function(){
  if(!state.modal)return'';
  const {type,payload={}}=state.modal;
  if(type==='enterpriseUpload')return uploadModal();
  if(type==='enterpriseDestination')return destinationModal(payload);
  if(type==='enterpriseInfo')return infoModal(payload);
  if(type==='newFolder'&&payload.space==='enterprise')return newFolderModal();
  if(type==='rename'&&payload.space==='enterprise')return renameModal(payload);
  if(type==='delete'&&payload.space==='enterprise')return deleteModal();
  return baseModalContent();
};

const baseCreateFolder=createFolder;
createFolder=function(space){
  if(space!=='enterprise')return baseCreateFolder(space);
  const name=document.getElementById('folderName')?.value.trim();if(!name)return toast('请输入文件夹名称','warning');
  if(/[\\/:*?"<>|]/.test(name))return toast('文件夹名称包含不支持的字符','warning');
  const parent=currentPath();if(filesForDept(state.dept).some(item=>(item.parent||'')===parent&&item.name.toLowerCase()===name.toLowerCase()))return toast('当前目录已存在同名内容','warning');
  filesForDept(state.dept).unshift({id:`enterprise-folder-${Date.now()}`,type:'folder',name,parent,modified:nowText(),owner:'当前用户',status:'正常',tag:'文件夹',activity:'刚刚 · 新建文件夹'});
  state.enterprisePage=1;closeModal();toast(`已在${currentLibraryName()}创建文件夹`);render();
};

const baseRename=renameItem;
renameItem=function(id,space){
  if(space!=='enterprise')return baseRename(id,space);
  const file=findFile(id,'enterprise');const value=document.getElementById('renameValue')?.value.trim();if(!file||!value)return toast('请输入新的名称','warning');
  if(/[\\/:*?"<>|]/.test(value))return toast('名称包含不支持的字符','warning');
  if(filesForDept(state.dept).some(item=>item.id!==id&&(item.parent||'')===(file.parent||'')&&item.name.toLowerCase()===value.toLowerCase()))return toast('当前目录已存在同名内容','warning');
  if(file.type==='folder'){const oldPath=[file.parent,file.name].filter(Boolean).join('/');const newPath=[file.parent,value].filter(Boolean).join('/');filesForDept(state.dept).forEach(child=>{const parent=child.parent||'';if(parent===oldPath||parent.startsWith(oldPath+'/'))child.parent=newPath+parent.slice(oldPath.length)})}
  file.name=value;file.modified=nowText();file.owner='当前用户';file.activity='刚刚 · 重命名';closeModal();toast('名称已更新');render();
};

const baseDeleteSelected=deleteSelected;
deleteSelected=function(space){
  if(space!=='enterprise')return baseDeleteSelected(space);
  const roots=selectedRoots();const removed=roots.flatMap(root=>collectBranch(state.dept,root));const ids=new Set(removed.map(item=>item.id));enterpriseFiles[state.dept]=filesForDept(state.dept).filter(item=>!ids.has(item.id));
  removed.forEach(item=>recycle.unshift({id:`r${Date.now()}${Math.random()}`,name:item.name,path:`企业空间 / ${currentLibraryName()}${item.parent?' / '+item.parent:''}`,deleted:nowText(),expire:'剩余 30 天',size:item.size||'—',type:item.type}));
  state.selected=[];state.detail=null;closeModal();toast(`已将 ${removed.length} 项移入误删恢复；相关访问入口已失效`);render();
};

const baseApplyGrant=typeof applyGrant==='function'?applyGrant:null;
applyGrant=function(id,space){
  if(space!=='enterprise')return baseApplyGrant?baseApplyGrant(id,space):undefined;
  const member=document.getElementById('grantMember')?.value;const role=document.getElementById('grantRole')?.value;
  if(!member)return toast('请选择授权成员','warning');
  const file=findFile(id,'enterprise');if(!file)return toast('未找到授权对象','warning');
  file.access='shared';file.grants=[...(file.grants||[]),{member,role,created:nowText()}];file.modified=nowText();file.owner='当前用户';file.activity=`刚刚 · 授予${member.split(' · ')[0]}${role}权限`;
  closeModal();toast(`已授予${member.split(' · ')[0]}“${role}”权限；权限未超过当前操作者范围`);render();
};

const baseMenuContent=menuContent;
menuContent=function(){
  const menu=state.menu;if(menu?.space!=='enterprise')return baseMenuContent();
  const file=findFile(menu.id,'enterprise');if(!file)return'';const folder=file.type==='folder';
  return `<div class="menu-pop personal-file-menu" style="left:${menu.x}px;top:${menu.y}px"><button class="menu-item menu-emphasis" onclick="state.menu=null;${folder?`openFile('${file.id}','enterprise')`:`openModal('preview',{file:findFile('${file.id}','enterprise')})`}">${icon(folder?'folder':'eye')}<span>${folder?'打开文件夹':'预览'}</span></button><button class="menu-item" onclick="state.menu=null;toast('已创建企业文件下载任务')">${icon('download')}<span>下载</span></button><div class="menu-sep"></div><button class="menu-item" onclick="state.menu=null;openModal('share',{file:findFile('${file.id}','enterprise')})">${icon('link')}<span>创建安全外链</span></button><button class="menu-item" onclick="state.menu=null;openModal('grant',{id:'${file.id}',space:'enterprise'})">${icon('grant')}<span>共享授权</span></button><div class="menu-sep"></div><button class="menu-item" onclick="state.menu=null;openModal('rename',{id:'${file.id}',space:'enterprise'})">${icon('edit')}<span>重命名</span></button><button class="menu-item" onclick="state.selected=['${file.id}'];state.menu=null;openModal('destination',{space:'enterprise',mode:'move'})">${icon('move')}<span>移动到</span></button><button class="menu-item" onclick="state.selected=['${file.id}'];state.menu=null;openModal('destination',{space:'enterprise',mode:'copy'})">${icon('copy')}<span>复制到</span></button><div class="menu-sep"></div><button class="menu-item" onclick="state.menu=null;openModal('enterpriseInfo',{id:'${file.id}',mode:'permission'})">${icon('shield')}<span>权限信息</span></button><button class="menu-item" onclick="state.menu=null;openModal('enterpriseInfo',{id:'${file.id}',mode:'versions'})">${icon('history')}<span>历史版本</span></button><button class="menu-item" onclick="state.menu=null;openModal('enterpriseInfo',{id:'${file.id}',mode:'audit'})">${icon('activity')}<span>操作记录</span></button><button class="menu-item" onclick="state.menu=null;state.detail={id:'${file.id}',space:'enterprise'};render()">${icon('info')}<span>属性详情</span></button><div class="menu-sep"></div><button class="menu-item danger" onclick="state.selected=['${file.id}'];state.menu=null;openModal('delete',{space:'enterprise'})">${icon('trash')}<span>删除</span></button></div>`;
};

const baseRender=render;
render=function(){
  baseRender();
  if(state.page!=='enterprise')return;
  const root=document.querySelector('.enterprise-library-root-v4 strong,.enterprise-org-root-v7 span');if(root)root.textContent='企业资料库';
  document.querySelectorAll('.enterprise-destination-section').forEach((section,index)=>section.hidden=index!==0);
  const search=document.querySelector('.enterprise-panel .personal-search input');if(search){search.setAttribute('aria-label','搜索当前企业资料库');search.placeholder='搜索当前资料库中的文件或文件夹'}
};

render();
})();
