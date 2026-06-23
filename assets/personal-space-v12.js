(()=>{
'use strict';
if(document.documentElement.dataset.personalSpaceV12)return;
document.documentElement.dataset.personalSpaceV12='1';

const defaultOrg={
  id:'group',name:'贵安发展集团',type:'company',children:[
    {id:'rd',name:'研发中心',type:'center',children:[
      {id:'rd-platform',name:'平台研发部',type:'department',children:[
        {id:'rd-platform-fe',name:'前端研发组',type:'team'},
        {id:'rd-platform-be',name:'后端研发组',type:'team'}
      ]},
      {id:'rd-data',name:'数据智能部',type:'department',children:[
        {id:'rd-data-ai',name:'智能应用组',type:'team'},
        {id:'rd-data-governance',name:'数据治理组',type:'team'}
      ]}
    ]},
    {id:'product',name:'产品设计部',type:'center',children:[
      {id:'product-pm',name:'产品管理组',type:'team'},
      {id:'product-ux',name:'体验设计组',type:'team'}
    ]},
    {id:'quality',name:'质量保障部',type:'center',children:[
      {id:'quality-test',name:'测试组',type:'team'},
      {id:'quality-security',name:'安全与合规组',type:'team'}
    ]},
    {id:'management',name:'综合管理部',type:'center'},
    {id:'operation',name:'运营管理部',type:'center'}
  ]
};

const defaultMembers=[
  {name:'周凯',nodeId:'rd-platform-fe',role:'前端架构师',initial:'周'},
  {name:'刘浩',nodeId:'rd-platform-be',role:'技术开发岗',initial:'刘'},
  {name:'陈宇',nodeId:'rd-platform-be',role:'后端工程师',initial:'陈'},
  {name:'赵敏',nodeId:'rd-data-ai',role:'算法工程师',initial:'赵'},
  {name:'唐楠',nodeId:'rd-data-governance',role:'数据治理工程师',initial:'唐'},
  {name:'许欣',nodeId:'product-ux',role:'交互设计师',initial:'许'},
  {name:'王璐',nodeId:'product-pm',role:'产品经理',initial:'王'},
  {name:'李晓华',nodeId:'management',role:'综合管理员',initial:'李'},
  {name:'孙悦',nodeId:'quality-test',role:'测试工程师',initial:'孙'},
  {name:'罗宁',nodeId:'quality-security',role:'安全管理员',initial:'罗'},
  {name:'郑欣',nodeId:'operation',role:'运营专员',initial:'郑'}
];

const orgModel=window.personalTransferOrg||{tree:defaultOrg,members:defaultMembers};
window.personalTransferOrg=orgModel;

const style=document.createElement('style');
style.id='personal-space-v12-style';
style.textContent=`
.transfer-v12-modal{width:min(920px,calc(100vw - 36px))!important;max-width:none!important;border-radius:14px!important;overflow:hidden!important;background:#fff!important}
.transfer-v12-modal .modal-head{height:58px!important;padding:0 20px!important;background:#fff!important;border-bottom:1px solid #e7edf5!important;color:#22364b!important;font-size:15px!important}
.transfer-v12-modal .modal-body{padding:16px 20px!important;background:#fff!important}
.transfer-v12-modal .modal-foot{padding:12px 20px!important;background:#fff!important;border-top:1px solid #e7edf5!important}
.transfer-v12-summary{display:flex;align-items:center;gap:12px;padding:11px 13px;border:1px solid #e1e8f1;border-radius:11px;background:#fff}
.transfer-v12-summary .file-symbol{width:40px!important;height:40px!important;border-radius:11px!important;background:#fff!important;border:1px solid #dce5ef!important;box-shadow:0 2px 8px rgba(35,68,106,.08)!important}
.transfer-v12-summary strong{display:block;color:#2d435a;font-size:13px;font-weight:680}.transfer-v12-summary span,.transfer-v12-summary small{display:block;margin-top:3px;color:#8a99aa;font-size:9px}.transfer-v12-summary small{color:#9ca8b5}
.transfer-v12-picker{height:356px;margin-top:13px;display:grid;grid-template-columns:248px minmax(0,1fr);overflow:hidden;border:1px solid #e1e8f1;border-radius:11px;background:#fff}
.transfer-v12-org{display:flex;flex-direction:column;min-height:0;border-right:1px solid #e7edf5;background:#fff}
.transfer-v12-org-head{height:48px;padding:0 14px;border-bottom:1px solid #edf1f6;display:flex;align-items:center;justify-content:space-between}.transfer-v12-org-head strong{color:#425970;font-size:11px}.transfer-v12-org-head span{color:#97a5b4;font-size:9px}
.transfer-v12-tree{flex:1;min-height:0;overflow:auto;padding:8px 8px 12px}
.transfer-v12-all,.transfer-v12-node-main{height:38px;width:100%;border:0;border-radius:8px;background:#fff;color:#5f7287;display:grid;align-items:center;text-align:left;transition:.15s}
.transfer-v12-all{grid-template-columns:28px minmax(0,1fr);gap:7px;padding:0 9px;margin-bottom:5px}.transfer-v12-all:hover,.transfer-v12-node-main:hover{background:#f7faff;color:#315f8d}.transfer-v12-all.active,.transfer-v12-node-main.active{background:#eaf3ff;color:#1769ff;font-weight:650}
.transfer-v12-all>.icon-stack{width:17px;height:17px}.transfer-v12-count{display:none!important}.active>.transfer-v12-count{display:none!important}
.transfer-v12-node{position:relative}.transfer-v12-node-row{display:grid;grid-template-columns:24px minmax(0,1fr);align-items:center;padding-left:calc(var(--depth) * 14px)}.transfer-v12-toggle{width:24px;height:30px;border:0;border-radius:6px;background:transparent;color:#8b9aab;display:grid;place-items:center;transition:.15s}.transfer-v12-toggle:hover{background:#f2f6fb;color:#1769ff}.transfer-v12-toggle .icon-stack{width:13px;height:13px;transition:transform .16s}.transfer-v12-node.collapsed>.transfer-v12-node-row .transfer-v12-toggle .icon-stack{transform:rotate(-90deg)}.transfer-v12-toggle.placeholder{visibility:hidden}
.transfer-v12-node-main{grid-template-columns:20px minmax(0,1fr);gap:7px;padding:0 8px}.transfer-v12-node-main>.icon-stack{width:16px;height:16px}.transfer-v12-node-main span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px}.transfer-v12-children{display:block}.transfer-v12-node.collapsed>.transfer-v12-children{display:none}
.transfer-v12-members{min-width:0;display:flex;flex-direction:column;background:#fff}.transfer-v12-members-head{height:65px;padding:0 14px;border-bottom:1px solid #edf1f6;display:flex;align-items:center;gap:12px}.transfer-v12-members-copy{min-width:0}.transfer-v12-members-copy strong{display:block;color:#30475e;font-size:12px}.transfer-v12-members-copy span{display:block;max-width:300px;margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#96a3b1;font-size:9px}
.transfer-v12-search{margin-left:auto;width:248px;height:34px;border:1px solid #dce5ef;border-radius:8px;background:#fff;display:flex;align-items:center;gap:7px;padding:0 9px;color:#8c9baa}.transfer-v12-search:focus-within{border-color:#9fc2f8;box-shadow:0 0 0 3px rgba(23,105,255,.08)}.transfer-v12-search .icon-stack{width:15px;height:15px}.transfer-v12-search input{width:100%;border:0;outline:0;background:transparent;color:#42586d;font-size:10px}
.transfer-v12-list{flex:1;min-height:0;overflow:auto;padding:8px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));align-content:start;gap:6px}.transfer-v12-person{min-height:58px;width:100%;border:1px solid transparent;border-radius:9px;background:#fff;display:grid;grid-template-columns:38px minmax(0,1fr) 18px;align-items:center;gap:9px;padding:7px 9px;text-align:left;transition:.15s}.transfer-v12-person:hover{background:#f8fbff;border-color:#e3ebf5}.transfer-v12-person.selected{background:#edf5ff;border-color:#a9c8f8}.transfer-v12-person[hidden]{display:none!important}
.transfer-v12-avatar{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;color:#fff;font-size:11px;font-weight:700;border:2px solid #fff;box-shadow:0 0 0 1px rgba(35,68,106,.12),0 3px 8px rgba(35,68,106,.11)}.transfer-v12-person:nth-child(8n+1) .transfer-v12-avatar{background:#1677ff}.transfer-v12-person:nth-child(8n+2) .transfer-v12-avatar{background:#7c3aed}.transfer-v12-person:nth-child(8n+3) .transfer-v12-avatar{background:#db2777}.transfer-v12-person:nth-child(8n+4) .transfer-v12-avatar{background:#ea580c}.transfer-v12-person:nth-child(8n+5) .transfer-v12-avatar{background:#0891b2}.transfer-v12-person:nth-child(8n+6) .transfer-v12-avatar{background:#4f46e5}.transfer-v12-person:nth-child(8n+7) .transfer-v12-avatar{background:#c026d3}.transfer-v12-person:nth-child(8n+8) .transfer-v12-avatar{background:#0f9f6e}.transfer-v12-person.selected .transfer-v12-avatar{box-shadow:0 0 0 2px #1769ff,0 4px 10px rgba(23,105,255,.18)}
.transfer-v12-person-copy{min-width:0}.transfer-v12-person-copy strong{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#385066;font-size:11px}.transfer-v12-person-copy small{display:block;margin-top:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#96a3b0;font-size:9px}.transfer-v12-person i{width:18px;height:18px;color:#1769ff;display:grid;place-items:center;opacity:0}.transfer-v12-person.selected i{opacity:1}.transfer-v12-person i .icon-stack{width:14px;height:14px}
.transfer-v12-empty{grid-column:1/-1;padding:50px 20px;text-align:center;color:#98a5b2;font-size:10px}
.transfer-v12-selected{height:48px;margin-top:11px;padding:0 12px;border:1px solid #e1e8f1;border-radius:9px;background:#fff;display:flex;align-items:center;gap:12px}.transfer-v12-selected>span{color:#98a5b2;font-size:10px}.transfer-v12-selected>div{display:flex;align-items:center;gap:8px}.transfer-v12-selected em{font-style:normal;color:#9aa7b4;font-size:10px}.transfer-v12-selected .transfer-v12-avatar{width:28px;height:28px;background:#1677ff}.transfer-v12-selected strong{display:block;color:#3a5268;font-size:10px}.transfer-v12-selected small{display:block;margin-top:2px;color:#98a5b2;font-size:8px}
.transfer-v12-confirm{display:flex;align-items:flex-start;gap:8px;margin-top:11px;color:#61768a;font-size:10px;line-height:1.55}.transfer-v12-confirm .check{margin-top:2px}.transfer-v12-warning{margin-top:9px!important;border:1px solid #ffd7dc!important;background:#fff7f7!important;color:#c84b53!important}
.transfer-v12-modal .modal-foot .btn.danger:disabled{opacity:.42;cursor:not-allowed;box-shadow:none}
@media(max-width:820px){.transfer-v12-picker{height:auto;grid-template-columns:1fr}.transfer-v12-org{max-height:250px;border-right:0;border-bottom:1px solid #e7edf5}.transfer-v12-members{height:390px}.transfer-v12-list{grid-template-columns:1fr}.transfer-v12-search{width:200px}}
`;
document.head.appendChild(style);

function flattenTree(node,parentId=null,path=[]){
  const current={...node,parentId,path:[...path,node.name]};
  const children=Array.isArray(node.children)?node.children:[];
  return [current,...children.flatMap(child=>flattenTree(child,node.id,current.path))];
}
function model(){
  const tree=window.personalTransferOrg?.tree||defaultOrg;
  const members=Array.isArray(window.personalTransferOrg?.members)?window.personalTransferOrg.members:defaultMembers;
  const nodes=flattenTree(tree);
  const map=new Map(nodes.map(node=>[node.id,node]));
  return {tree,members,nodes,map};
}
function descendantIds(id,map){
  const result=new Set([id]);
  let changed=true;
  while(changed){changed=false;for(const node of map.values()){if(node.parentId&&result.has(node.parentId)&&!result.has(node.id)){result.add(node.id);changed=true}}}
  return result;
}
function countFor(id,data){const ids=descendantIds(id,data.map);return data.members.filter(member=>ids.has(member.nodeId)).length}
function nodeIcon(type){return type==='team'?'users':type==='company'?'building':'folder'}
function shell(title,body,foot){return `<div class="modal-layer" onclick="if(event.target===this)closeModal()"><div class="modal transfer-v12-modal"><div class="modal-head">${title}<button class="btn ghost icon-only" onclick="closeModal()">${icon('x')}</button></div><div class="modal-body">${body}</div><div class="modal-foot">${foot}</div></div></div>`}
function renderNode(node,data,depth=0,expanded=new Set()){
  const children=Array.isArray(node.children)?node.children:[];
  const hasChildren=children.length>0;
  const isExpanded=expanded.has(node.id);
  return `<div class="transfer-v12-node ${hasChildren&&!isExpanded?'collapsed':''}" data-node-id="${safe(node.id)}"><div class="transfer-v12-node-row" style="--depth:${depth}"><button type="button" class="transfer-v12-toggle ${hasChildren?'':'placeholder'}" onclick="event.stopPropagation();toggleTransferOrgNodeV12('${safe(node.id)}',this)" aria-label="${isExpanded?'收起':'展开'}${safe(node.name)}">${icon('down')}</button><button type="button" class="transfer-v12-node-main" data-node-id="${safe(node.id)}" onclick="selectTransferOrgNodeV12('${safe(node.id)}')">${icon(nodeIcon(node.type))}<span title="${safe(node.name)}">${safe(node.name)}</span><i class="transfer-v12-count">${countFor(node.id,data)}</i></button></div>${hasChildren?`<div class="transfer-v12-children">${children.map(child=>renderNode(child,data,depth+1,expanded)).join('')}</div>`:''}</div>`;
}
function resetRuntime(){
  const data=model();
  const expanded=new Set([data.tree.id]);
  const first=Array.isArray(data.tree.children)?data.tree.children[0]:null;
  if(first)expanded.add(first.id);
  window.__transferOrgV12={data,expanded,selectedNode:'all',query:''};
  return window.__transferOrgV12;
}
function scopeIds(runtime){return runtime.selectedNode==='all'?new Set(runtime.data.map.keys()):descendantIds(runtime.selectedNode,runtime.data.map)}
function refreshMembers(){
  const runtime=window.__transferOrgV12;if(!runtime)return;
  const ids=scopeIds(runtime);const query=String(runtime.query||'').trim().toLowerCase();let visible=0;
  document.querySelectorAll('.transfer-v12-person').forEach(row=>{const inScope=ids.has(row.dataset.nodeId);const match=!query||row.dataset.search.includes(query);row.hidden=!(inScope&&match);if(!row.hidden)visible++});
  const empty=document.getElementById('transferV12Empty');if(empty)empty.hidden=visible>0;
  const count=document.getElementById('transferV12MemberCount');if(count)count.textContent=`${visible} 名成员`;
}
window.toggleTransferOrgNodeV12=function(id,button){
  const runtime=window.__transferOrgV12;if(!runtime)return;
  const node=button.closest('.transfer-v12-node');if(!node)return;
  const willCollapse=!node.classList.contains('collapsed');node.classList.toggle('collapsed',willCollapse);
  if(willCollapse)runtime.expanded.delete(id);else runtime.expanded.add(id);
};
window.selectTransferOrgNodeV12=function(id){
  const runtime=window.__transferOrgV12;if(!runtime)return;runtime.selectedNode=id;
  document.querySelectorAll('.transfer-v12-all,.transfer-v12-node-main').forEach(button=>button.classList.toggle('active',button.dataset.nodeId===id));
  const node=id==='all'?null:runtime.data.map.get(id);const title=document.getElementById('transferV12ScopeTitle');const path=document.getElementById('transferV12ScopePath');
  if(title)title.textContent=node?.name||'全部成员';if(path)path.textContent=node?.path?.join(' / ')||'全组织范围';
  refreshMembers();
};
window.filterTransferOrgV12=function(value){const runtime=window.__transferOrgV12;if(!runtime)return;runtime.query=value;refreshMembers()};
window.selectTransferMemberV12=function(button){
  document.querySelectorAll('.transfer-v12-person').forEach(row=>row.classList.toggle('selected',row===button));
  const input=document.getElementById('transferMember');if(input)input.value=button.dataset.value;
  const summary=document.getElementById('transferV12Selected');if(summary)summary.innerHTML=`<span class="transfer-v12-avatar" style="background:${safe(button.dataset.color)}">${safe(button.dataset.initial)}</span><span><strong>${safe(button.dataset.name)}</strong><small>${safe(button.dataset.role)} · ${safe(button.dataset.path)}</small></span>`;
  updateTransferSubmitV12();
};
window.updateTransferSubmitV12=function(){const member=document.getElementById('transferMember')?.value;const confirmed=document.getElementById('transferConfirm')?.checked;const submit=document.getElementById('transferV12Submit');if(submit)submit.disabled=!(member&&confirmed)};

function transferDialog(payload){
  const runtime=resetRuntime();const data=runtime.data;
  const file=personalFiles.find(item=>item.id===payload.id);const root=[file?.parent,file?.name].filter(Boolean).join('/');const descendants=file?personalFiles.filter(item=>{const parent=item.parent||'';return parent===root||parent.startsWith(root+'/')}):[];
  const palettes=['#1677ff','#7c3aed','#db2777','#ea580c','#0891b2','#4f46e5','#c026d3','#0f9f6e'];
  const people=data.members.map((person,index)=>{const node=data.map.get(person.nodeId);const path=node?.path?.join(' / ')||'未分组';const color=palettes[index%palettes.length];return `<button type="button" class="transfer-v12-person" data-node-id="${safe(person.nodeId)}" data-name="${safe(person.name)}" data-role="${safe(person.role)}" data-path="${safe(path)}" data-initial="${safe(person.initial||person.name.slice(0,1))}" data-color="${color}" data-value="${safe(person.name+' · '+path)}" data-search="${safe((person.name+' '+person.role+' '+path).toLowerCase())}" onclick="selectTransferMemberV12(this)"><span class="transfer-v12-avatar">${safe(person.initial||person.name.slice(0,1))}</span><span class="transfer-v12-person-copy"><strong>${safe(person.name)}</strong><small>${safe(person.role)} · ${safe(node?.name||'未分组')}</small></span><i>${icon('check')}</i></button>`}).join('');
  const body=`<div class="transfer-v12-summary">${fileVisual(file||{type:'folder'})}<div><strong>${safe(file?.name||'')}</strong><span>当前所有者：张明远（本人）</span><small>将同时转移 ${descendants.length} 个子项，目录结构保持不变</small></div></div><input id="transferMember" type="hidden" value=""><div class="transfer-v12-picker"><aside class="transfer-v12-org"><div class="transfer-v12-org-head"><strong>组织架构</strong><span>支持多级展开</span></div><div class="transfer-v12-tree"><button type="button" class="transfer-v12-all active" data-node-id="all" onclick="selectTransferOrgNodeV12('all')">${icon('users')}<span>全部成员</span><i class="transfer-v12-count">${data.members.length}</i></button>${renderNode(data.tree,data,0,runtime.expanded)}</div></aside><section class="transfer-v12-members"><header class="transfer-v12-members-head"><div class="transfer-v12-members-copy"><strong id="transferV12ScopeTitle">全部成员</strong><span id="transferV12ScopePath">全组织范围</span></div><label class="transfer-v12-search">${icon('search')}<input placeholder="搜索姓名、部门或岗位" oninput="filterTransferOrgV12(this.value)"></label></header><div class="transfer-v12-list">${people}<div class="transfer-v12-empty" id="transferV12Empty" hidden>当前范围内没有匹配成员</div></div></section></div><div class="transfer-v12-selected"><span>已选择</span><div id="transferV12Selected"><em>尚未选择接收成员</em></div><span id="transferV12MemberCount" style="margin-left:auto">${data.members.length} 名成员</span></div><label class="transfer-v12-confirm"><input class="check" id="transferConfirm" type="checkbox" onchange="updateTransferSubmitV12()"><span>我已确认该文件夹及全部子项将转移至接收人的个人空间，原所有者将失去所有权。</span></label><div class="notice danger-notice transfer-v12-warning">所有权转移不可直接撤销，该操作将记录到审计日志。</div>`;
  const foot=`<button class="btn" onclick="closeModal()">取消</button><button class="btn danger" id="transferV12Submit" disabled onclick="transferItem('${safe(payload.id)}')">确认转移</button>`;
  return shell('转移文件夹所有权',body,foot);
}

const previousModalContent=modalContent;
modalContent=function(){if(state.modal?.type==='transfer')return transferDialog(state.modal.payload||{});return previousModalContent()};
render();
})();
