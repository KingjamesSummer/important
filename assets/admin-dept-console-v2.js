/* Department management console v2 — deep hierarchy, complete interactions, system-blue theme. */
(function(){
  if(window.__adminDeptConsoleV2)return;
  window.__adminDeptConsoleV2=true;
  if(typeof state==='undefined'||typeof render!=='function'||typeof pageHead!=='function')return;

  const baseSidebar=window.sidebar;
  const baseBreadcrumb=window.breadcrumb;
  const baseTopbar=window.topbar;
  const baseAdminContent=window.adminContent;

  const departments=[
    {id:'group',parent:null,name:'贵安发展集团',type:'公司节点',status:'active',source:'MDM 同步',members:286,used:'2.48 TB',quota:'共享企业剩余可用额度',permission:'操作者',library:true,managers:['张明远','李晓华'],fileAdmins:['周凯'],subAdmins:['张明远'],updated:'2026-06-23 10:18'},
    {id:'general',parent:'group',name:'综合管理部',type:'普通部门',status:'active',source:'MDM 同步',members:31,used:'126 GB',quota:'共享企业剩余可用额度',permission:'下载者',library:true,managers:['李晓华'],fileAdmins:['王璐'],subAdmins:[],updated:'2026-06-22 17:35'},
    {id:'finance',parent:'group',name:'财务管理部',type:'普通部门',status:'active',source:'MDM 同步',members:24,used:'198 GB',quota:'指定额度 300 GB',permission:'预览者',library:true,managers:['陈敏'],fileAdmins:['许欣'],subAdmins:[],updated:'2026-06-22 15:20'},
    {id:'investment',parent:'group',name:'投资发展部',type:'普通部门',status:'active',source:'MDM 同步',members:37,used:'286 GB',quota:'共享企业剩余可用额度',permission:'下载者',library:true,managers:['赵敏'],fileAdmins:['唐楠'],subAdmins:[],updated:'2026-06-21 16:08'},
    {id:'research',parent:'group',name:'研发中心',type:'普通部门',status:'active',source:'本地维护',members:48,used:'412 GB',quota:'指定额度 600 GB',permission:'操作者',library:true,managers:['张明远','周凯'],fileAdmins:['许欣','刘浩','赵敏'],subAdmins:[],updated:'2026-06-23 09:42'},
    {id:'platform',parent:'research',name:'平台研发组',type:'普通部门',status:'active',source:'本地维护',members:21,used:'166 GB',quota:'继承上级策略',permission:'操作者',library:true,managers:['周凯'],fileAdmins:['刘浩'],subAdmins:[],updated:'2026-06-23 08:20'},
    {id:'application',parent:'research',name:'应用研发组',type:'普通部门',status:'active',source:'本地维护',members:15,used:'102 GB',quota:'继承上级策略',permission:'编辑者',library:true,managers:['刘浩'],fileAdmins:['周凯'],subAdmins:[],updated:'2026-06-22 18:32'},
    {id:'product',parent:'research',name:'产品设计组',type:'普通部门',status:'active',source:'本地维护',members:12,used:'73 GB',quota:'继承上级策略',permission:'编辑者',library:true,managers:['许欣'],fileAdmins:['赵敏'],subAdmins:[],updated:'2026-06-22 18:10'},
    {id:'construction',parent:'group',name:'建设管理部',type:'普通部门',status:'active',source:'MDM 同步',members:55,used:'530 GB',quota:'共享企业剩余可用额度',permission:'下载者',library:true,managers:['刘洁'],fileAdmins:['赵敏'],subAdmins:[],updated:'2026-06-20 11:40'},
    {id:'siteA',parent:'construction',name:'项目一部',type:'普通部门',status:'active',source:'MDM 同步',members:22,used:'186 GB',quota:'继承上级策略',permission:'下载者',library:true,managers:['李工'],fileAdmins:['王璐'],subAdmins:[],updated:'2026-06-20 10:08'},
    {id:'siteB',parent:'construction',name:'项目二部',type:'普通部门',status:'active',source:'MDM 同步',members:18,used:'143 GB',quota:'继承上级策略',permission:'下载者',library:true,managers:['周工'],fileAdmins:['赵敏'],subAdmins:[],updated:'2026-06-19 16:25'},
    {id:'operations',parent:'group',name:'运营管理部',type:'普通部门',status:'disabled',source:'MDM 同步',members:34,used:'194 GB',quota:'不分配空间',permission:'预览者',library:true,managers:['唐楠'],fileAdmins:['王璐'],subAdmins:[],updated:'2026-06-19 14:26'},
    {id:'unassigned',parent:null,name:'待分配人员池',type:'虚拟节点',status:'active',source:'系统内置',members:4,used:'—',quota:'不参与空间分配',permission:'无部门默认权限',library:false,managers:[],fileAdmins:[],subAdmins:[],updated:'2026-06-23 10:10'}
  ];

  const departmentMembers=[
    {id:'u1',dept:'research',name:'张明远',no:'000001',job:'技术开发岗',role:'部门负责人',status:'正常',active:'今天 10:16'},
    {id:'u2',dept:'research',name:'周凯',no:'000018',job:'技术开发岗',role:'部门负责人',status:'正常',active:'今天 09:52'},
    {id:'u3',dept:'research',name:'许欣',no:'000026',job:'产品设计岗',role:'文件管理员',status:'正常',active:'昨天 17:46'},
    {id:'u4',dept:'research',name:'刘浩',no:'000037',job:'技术开发岗',role:'文件管理员',status:'正常',active:'昨天 16:23'},
    {id:'u5',dept:'research',name:'赵敏',no:'000045',job:'产品设计岗',role:'文件管理员',status:'正常',active:'06-21 14:08'},
    {id:'u6',dept:'research',name:'王璐',no:'000052',job:'测试工程师',role:'普通成员',status:'正常',active:'06-20 18:22'},
    {id:'u7',dept:'platform',name:'陈强',no:'000063',job:'后端开发岗',role:'普通成员',status:'正常',active:'今天 09:28'},
    {id:'u8',dept:'product',name:'林悦',no:'000071',job:'交互设计岗',role:'普通成员',status:'正常',active:'昨天 18:09'},
    {id:'u9',dept:'general',name:'李晓华',no:'000082',job:'综合管理岗',role:'部门负责人',status:'正常',active:'今天 08:42'},
    {id:'u10',dept:'finance',name:'陈敏',no:'000093',job:'财务管理岗',role:'部门负责人',status:'正常',active:'昨天 17:20'},
    {id:'u11',dept:'unassigned',name:'何清',no:'000104',job:'待定',role:'普通成员',status:'待分配',active:'06-18 11:26'}
  ];

  const candidateMembers=[
    {id:'c1',name:'孙琳',no:'000116',job:'前端开发岗',current:'待分配人员池'},
    {id:'c2',name:'郭辰',no:'000127',job:'测试工程师',current:'综合管理部'},
    {id:'c3',name:'吴桐',no:'000138',job:'产品运营岗',current:'运营管理部'}
  ];

  function ensureState(){
    state.adminDeptSelected=state.adminDeptSelected||'research';
    state.adminDeptExpanded=Array.isArray(state.adminDeptExpanded)?state.adminDeptExpanded:['group','research','construction'];
    state.adminDeptView=state.adminDeptView||'overview';
    state.adminDeptDialog=state.adminDeptDialog||null;
    state.adminDeptTreeMenu=state.adminDeptTreeMenu||null;
    state.adminDeptMoreOpen=Boolean(state.adminDeptMoreOpen);
    state.adminMemberMenu=state.adminMemberMenu||null;
    state.adminSelectedMembers=Array.isArray(state.adminSelectedMembers)?state.adminSelectedMembers:[];
    state.adminLastSync=state.adminLastSync||'今天 10:18';
  }

  function esc(value){return typeof safe==='function'?safe(value):String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
  function ico(name){return typeof icon==='function'?icon(name):'';}
  function deptById(id){return departments.find(item=>item.id===id);}
  function childrenOf(id){return departments.filter(item=>item.parent===id);}
  function memberRowsFor(id){return departmentMembers.filter(item=>item.dept===id);}
  function initial(name){return esc(String(name||'').slice(0,1));}
  function pathOf(dept){const names=[];let current=dept;while(current){names.unshift(current.name);current=deptById(current.parent);}return names.join(' / ');}
  function descendants(id){return childrenOf(id).flatMap(child=>[child,...descendants(child.id)]);}
  function searchIndex(dept){return [dept.name,...descendants(dept.id).map(item=>item.name)].join(' ').toLowerCase();}
  function closeMenus(){state.adminDeptTreeMenu=null;state.adminDeptMoreOpen=false;state.adminMemberMenu=null;}

  function ensureStyles(){
    if(document.getElementById('admin-dept-console-v2-css'))return;
    const link=document.createElement('link');
    link.id='admin-dept-console-v2-css';
    link.rel='stylesheet';
    link.href='assets/admin-dept-console-v2.css?v=1';
    document.head.appendChild(link);
  }

  window.openAdminConsole=function(){
    const url=new URL(window.location.href);
    url.searchParams.set('console','admin');
    url.hash='dept';
    state.profileOpen=false;
    render();
    window.open(url.toString(),'_blank','noopener');
  };

  window.openUserConsole=function(entry,deptName){
    const url=new URL(window.location.href);
    url.searchParams.delete('console');
    if(entry)url.searchParams.set('entry',entry);else url.searchParams.delete('entry');
    if(deptName)url.searchParams.set('dept',deptName);else url.searchParams.delete('dept');
    url.hash='';
    window.open(url.toString(),'_blank','noopener');
  };

  window.setAdminTab=function(tab){
    state.adminTab=tab;
    state.profileOpen=false;
    closeMenus();
    render();
  };

  window.profileMenu=function(){
    if(state.page!=='admin'){
      return `<div class="profile-pop" onclick="event.stopPropagation()"><div class="profile-card-head"><div class="profile-avatar">张</div><div><strong>张明远</strong><span>系统管理员 · 研发中心</span></div></div><div class="menu-sep"></div><button class="profile-item" onclick="state.profileOpen=false;toast('个人资料页正在完善')">${ico('user')}个人资料</button><button class="profile-item" onclick="state.profileOpen=false;toast('账号与安全设置已打开')">${ico('shield')}账号与安全</button><button class="profile-item admin-entry" onclick="openAdminConsole()">${ico('settings')}管理中心<span>管理端</span></button><div class="menu-sep"></div><button class="profile-item danger" onclick="state.profileOpen=false;toast('已安全退出当前账号','warning')">${ico('external')}退出登录</button></div>`;
    }
    return `<div class="profile-pop" onclick="event.stopPropagation()"><div class="profile-card-head"><div class="profile-avatar">张</div><div><strong>张明远</strong><span>系统管理员 · 全集团</span></div></div><div class="menu-sep"></div><button class="profile-item" onclick="openUserConsole()">${ico('external')}打开用户端</button><button class="profile-item" onclick="state.profileOpen=false;toast('管理账号安全设置已打开')">${ico('shield')}账号与安全</button><div class="menu-sep"></div><button class="profile-item danger" onclick="state.profileOpen=false;toast('已安全退出当前账号','warning')">${ico('external')}退出登录</button></div>`;
  };

  window.sidebar=function(){
    if(state.page!=='admin')return baseSidebar();
    const groups=[
      {section:'组织与成员',items:[['dept','building','部门管理'],['member','users','成员管理'],['grant','shield','管理员设置']]},
      {section:'治理与审计',items:[['stats','chart','统计报表'],['security','lock','安全配置']]}
    ];
    return `<aside class="sidebar"><div class="brand"><div class="brand-mark"><iconify-icon icon="solar:cloud-file-bold-duotone" aria-hidden="true"></iconify-icon><span class="brand-fallback">知</span></div><div class="brand-copy"><strong>智汇云知</strong><span>智能知识库管理平台 · 管理端</span></div></div><div class="nav-scroll">${groups.map(group=>`<div class="nav-title">${group.section}</div>${group.items.map(item=>`<button class="nav-item ${state.adminTab===item[0]?'active':''}" onclick="setAdminTab('${item[0]}')">${ico(item[1])}<span>${item[2]}</span></button>`).join('')}`).join('')}</div><div class="ad-console-scope"><span>当前管理范围</span><strong>贵安发展集团及全部下级组织</strong></div><button class="ad-console-return" onclick="openUserConsole()">${ico('external')}打开用户端</button></aside>`;
  };

  window.breadcrumb=function(){
    if(state.page!=='admin')return baseBreadcrumb();
    const names={dept:'部门管理',member:'成员管理',grant:'管理员设置',stats:'统计报表',security:'安全配置'};
    return `<div class="breadcrumb"><span>智能知识库</span><span class="sep">/</span><span>管理中心</span><span class="sep">/</span><b>${names[state.adminTab]||'部门管理'}</b></div>`;
  };

  window.topbar=function(){
    if(state.page!=='admin')return baseTopbar();
    return `<header class="topbar">${breadcrumb()}<div class="top-spacer"></div><div class="global-search" onclick="document.getElementById('adDeptSearch')?.focus()">${ico('search')}<input placeholder="搜索部门、成员或管理功能" readonly><span class="kbd">Ctrl K</span></div><button class="top-icon" title="管理通知" onclick="toast('暂无新的管理通知')">${ico('bell')}<i class="dot"></i></button><button class="top-icon" title="帮助" onclick="toast('管理中心帮助已打开')">${ico('info')}</button><div class="profile-wrap"><button class="avatar profile-trigger" title="张明远" aria-expanded="${state.profileOpen}" onclick="event.stopPropagation();state.profileOpen=!state.profileOpen;closeAdminDeptMenus();render()">张</button>${state.profileOpen?profileMenu():''}</div></header>`;
  };

  window.closeAdminDeptMenus=function(){closeMenus();};

  function treeMenu(node){
    if(state.adminDeptTreeMenu!==node.id)return '';
    return `<div class="ad-tree-menu" onclick="event.stopPropagation()"><button onclick="openAdminDeptDialog('create','${node.id}')">${ico('plus')}新建下级部门</button><button onclick="selectAdminDept('${node.id}');openAdminDeptDialog('edit')">${ico('edit')}编辑部门</button><button onclick="selectAdminDept('${node.id}');openAdminDeptDialog('move')">${ico('move')}调整上级部门</button><button class="danger" onclick="selectAdminDept('${node.id}');openAdminDeptDialog('decommission')">${ico('trash')}组织裁撤</button></div>`;
  }

  function treeNodes(parent=null){
    return departments.filter(item=>item.parent===parent&&item.id!=='unassigned').map(node=>{
      const children=childrenOf(node.id);
      const expanded=state.adminDeptExpanded.includes(node.id);
      return `<div class="ad-tree-node" data-search="${esc(searchIndex(node))}"><div class="ad-tree-line ${state.adminDeptSelected===node.id?'active':''}"><button class="ad-tree-toggle ${children.length?'':'empty'} ${expanded?'':'collapsed'}" title="${expanded?'收起':'展开'}" onclick="event.stopPropagation();toggleAdminDept('${node.id}')">${children.length?ico('down'):''}</button><button class="ad-tree-select" onclick="selectAdminDept('${node.id}')">${ico(node.type==='公司节点'?'building':'folder')}<span class="ad-tree-name">${esc(node.name)}</span></button><span class="ad-tree-count">${node.members}</span><button class="ad-tree-more" title="更多操作" onclick="event.stopPropagation();toggleAdminDeptTreeMenu('${node.id}')">${ico('more')}</button>${treeMenu(node)}</div>${children.length?`<div class="ad-tree-children ${expanded?'':'collapsed'}">${treeNodes(node.id)}</div>`:''}</div>`;
    }).join('');
  }

  function organizationTree(){
    const pool=deptById('unassigned');
    return `<aside class="ad-tree-panel"><div class="ad-tree-head"><div class="ad-tree-title-row">${ico('building')}组织架构<small>${departments.length-1} 个正式节点</small></div><div class="ad-tree-tools"><label class="ad-tree-search">${ico('search')}<input id="adDeptSearch" placeholder="搜索部门名称" oninput="filterAdminDeptTree(this.value)"></label><button class="ad-tree-expand" title="展开或收起全部" onclick="toggleAdminDeptAll()">${ico('down')}</button></div></div><div class="ad-tree-scroll" id="adTreeScroll"><div class="ad-tree-section">正式组织</div>${treeNodes()}<div class="ad-tree-section">特殊节点</div><div class="ad-tree-node" data-search="${esc(pool.name.toLowerCase())}"><div class="ad-tree-line ${state.adminDeptSelected==='unassigned'?'active':''}"><span class="ad-tree-toggle empty"></span><button class="ad-tree-select" onclick="selectAdminDept('unassigned')">${ico('users')}<span class="ad-tree-name">${esc(pool.name)}</span></button><span class="ad-tree-count">${pool.members}</span><span></span></div></div><div class="ad-tree-empty" id="adTreeEmpty" hidden>未找到匹配的组织节点</div></div></aside>`;
  }

  window.toggleAdminDept=function(id){
    const index=state.adminDeptExpanded.indexOf(id);
    if(index>=0)state.adminDeptExpanded.splice(index,1);else state.adminDeptExpanded.push(id);
    closeMenus();render();
  };

  window.toggleAdminDeptAll=function(){
    const expandable=departments.filter(item=>childrenOf(item.id).length).map(item=>item.id);
    state.adminDeptExpanded=state.adminDeptExpanded.length>=expandable.length?[]:expandable;
    closeMenus();render();
  };

  window.filterAdminDeptTree=function(value){
    const query=String(value||'').trim().toLowerCase();
    const scroll=document.getElementById('adTreeScroll');
    if(!scroll)return;
    scroll.classList.toggle('searching',Boolean(query));
    let visible=0;
    scroll.querySelectorAll('.ad-tree-node').forEach(node=>{
      const matched=!query||(node.dataset.search||'').includes(query);
      node.hidden=!matched;
      if(matched)visible++;
    });
    const empty=document.getElementById('adTreeEmpty');
    if(empty)empty.hidden=visible>0;
  };

  window.toggleAdminDeptTreeMenu=function(id){
    state.adminDeptTreeMenu=state.adminDeptTreeMenu===id?null:id;
    state.adminDeptMoreOpen=false;state.adminMemberMenu=null;
    render();
  };

  window.selectAdminDept=function(id){
    state.adminDeptSelected=id;state.adminDeptView='overview';state.adminSelectedMembers=[];closeMenus();render();
  };

  window.setAdminDeptView=function(view){state.adminDeptView=view;state.adminSelectedMembers=[];closeMenus();render();};

  function people(items,empty='未设置'){
    if(!items||!items.length)return `<span style="color:#98a6b7;font-size:10px">${empty}</span>`;
    return `<div class="ad-person-list">${items.map(name=>`<span class="ad-person"><i>${initial(name)}</i>${esc(name)}</span>`).join('')}</div>`;
  }

  function metrics(dept){
    return `<div class="ad-metrics"><div class="ad-metric"><span>部门成员</span><strong>${dept.members}</strong><small>成员变更自动重算资料库权限</small></div><div class="ad-metric"><span>直属子部门</span><strong>${childrenOf(dept.id).length}</strong><small>${childrenOf(dept.id).length?'删除前必须先处理子部门':'当前无直属子部门'}</small></div><div class="ad-metric"><span>部门已用容量</span><strong style="font-size:18px">${esc(dept.used)}</strong><small>${esc(dept.quota)}</small></div><div class="ad-metric"><span>默认文件权限</span><strong style="font-size:18px">${esc(dept.permission)}</strong><small>新成员加入后自动生效</small></div></div>`;
  }

  function memberSummary(dept){
    const rows=memberRowsFor(dept.id);
    const previews=rows.slice(0,5);
    return `<section class="ad-card"><div class="ad-card-head">成员摘要<button class="btn text right" onclick="setAdminDeptView('members')">查看全部</button></div><div class="ad-member-summary"><div class="ad-member-stack">${previews.length?previews.map(item=>`<span title="${esc(item.name)}">${initial(item.name)}</span>`).join(''):'<span>空</span>'}</div><div class="ad-member-summary-copy">当前示例展示 ${rows.length} 名成员，其中部门负责人 ${rows.filter(item=>item.role==='部门负责人').length} 名、文件管理员 ${rows.filter(item=>item.role==='文件管理员').length} 名。完整成员维护集中在“成员列表”页签，避免概览与列表重复。</div><button class="btn sm" style="margin-top:10px" onclick="openAdminDeptDialog('addMember')">${ico('plus')}添加成员</button></div></section>`;
  }

  function overview(dept){
    return `${metrics(dept)}<div class="ad-grid-2"><section class="ad-card"><div class="ad-card-head">组织节点信息<button class="btn text right" onclick="openAdminDeptDialog('edit')">编辑</button></div><div class="ad-info-grid"><div class="ad-info-item"><label>节点类型</label><div>${esc(dept.type)}</div></div><div class="ad-info-item"><label>上级组织</label><div>${esc(deptById(dept.parent)?.name||'无')}</div></div><div class="ad-info-item"><label>空间策略</label><div>${esc(dept.quota)}</div></div><div class="ad-info-item"><label>默认权限</label><div>${esc(dept.permission)}</div></div><div class="ad-info-item"><label>数据来源</label><div>${esc(dept.source)}</div></div><div class="ad-info-item"><label>最近更新</label><div>${esc(dept.updated)}</div></div></div></section><section class="ad-card"><div class="ad-card-head">管理身份<button class="btn text right" onclick="openAdminDeptDialog('roles')">调整</button></div><div class="ad-role-list"><div class="ad-role-row"><label>部门负责人</label>${people(dept.managers)}</div><div class="ad-role-row"><label>文件管理员</label>${people(dept.fileAdmins)}</div>${dept.type==='公司节点'?`<div class="ad-role-row"><label>公司分级管理员</label>${people(dept.subAdmins)}</div>`:''}</div></section></div><div class="ad-grid-2"><section class="ad-card"><div class="ad-card-head">部门公共资料库<button class="btn text right" onclick="openDeptLibrary()">进入资料库</button></div><div style="padding:12px 14px">${dept.library?`<div class="ad-library"><span class="ad-library-icon">${ico('folder')}</span><div class="ad-library-main"><strong>${esc(dept.name)}公共资料库</strong><span>企业空间 / 部门公共资料库 / ${esc(dept.name)}</span></div><span class="badge blue">已关联</span></div><p class="help">负责人和文件管理员自动拥有资料库管理权限；成员加入、移出或默认权限变化时同步重算。</p>`:`<div class="notice">当前节点未创建部门公共资料库。<button class="btn text" onclick="createDeptLibrary()">立即创建</button></div>`}</div></section><section class="ad-card"><div class="ad-card-head">权限联动状态<button class="btn text right" onclick="recalculateDeptPermissions()">重新校验</button></div><div class="ad-sync-list"><div class="ad-sync-item">${ico('check')}成员默认权限已同步</div><div class="ad-sync-item">${ico('check')}负责人和文件管理员权限已同步</div><div class="ad-sync-item">${ico('check')}部门状态与资料库访问一致</div></div></section></div><div class="ad-grid-2">${memberSummary(dept)}<section class="ad-card"><div class="ad-card-head">快捷操作</div><div class="ad-sync-list"><div class="ad-sync-item">${ico('users')}维护当前部门成员<button class="btn sm" onclick="setAdminDeptView('members')">打开列表</button></div><div class="ad-sync-item">${ico('shield')}查看组织治理规则<button class="btn sm" onclick="setAdminDeptView('governance')">查看规则</button></div><div class="ad-sync-item">${ico('chart')}查看部门用量报表<button class="btn sm" onclick="openAdminDeptStats()">打开报表</button></div></div></section></div>`;
  }

  function roleClass(role){return role==='部门负责人'?'owner':role==='文件管理员'?'file':'';}
  function memberMenu(member){
    if(state.adminMemberMenu!==member.id)return '';
    return `<div class="ad-member-menu" onclick="event.stopPropagation()"><button onclick="openAdminDeptDialog('memberRole','${member.id}')">${ico('shield')}设置部门角色</button><button onclick="viewMemberPermissions('${member.id}')">${ico('eye')}查看文件权限</button><button onclick="openAdminDeptDialog('removeMember','${member.id}')">${ico('move')}移出当前部门</button></div>`;
  }

  function memberTableRows(dept){
    const rows=memberRowsFor(dept.id);
    if(!rows.length)return `<tr><td colspan="7"><div class="ad-empty" style="min-height:260px">${ico('users')}<strong>当前部门暂无示例成员</strong><p>点击“添加成员”从待分配人员池或其他部门调入成员</p></div></td></tr>`;
    return rows.map(member=>`<tr class="${state.adminSelectedMembers.includes(member.id)?'selected':''}" data-member="${esc(`${member.name} ${member.no} ${member.job} ${member.role}`.toLowerCase())}"><td class="check-col"><input class="check" type="checkbox" ${state.adminSelectedMembers.includes(member.id)?'checked':''} onchange="toggleAdminMemberSelection('${member.id}',this.checked)"></td><td><div class="ad-member-person"><span class="ad-member-avatar">${initial(member.name)}</span><div><strong>${esc(member.name)}</strong><span>工号 ${esc(member.no)}</span></div></div></td><td>${esc(member.job)}</td><td class="role-col"><span class="ad-role-badge ${roleClass(member.role)}">${esc(member.role)}</span></td><td class="status-col"><span class="status-dot ${member.status==='正常'?'green':'orange'}"></span>${esc(member.status)}</td><td class="active-col">${esc(member.active)}</td><td class="op-col"><span class="ad-member-menu-wrap"><button class="btn ghost icon-only compact" onclick="event.stopPropagation();toggleAdminMemberMenu('${member.id}')">${ico('more')}</button>${memberMenu(member)}</span></td></tr>`).join('');
  }

  function selectedMemberBar(){
    if(!state.adminSelectedMembers.length)return '';
    return `<div class="ad-selected-bar"><strong>已选择 ${state.adminSelectedMembers.length} 人</strong><button class="btn compact" onclick="openAdminDeptDialog('bulkRole')">${ico('shield')}批量设置角色</button><button class="btn compact" onclick="bulkMoveMembers()">${ico('move')}批量调动</button><span class="spacer"></span><button class="btn ghost icon-only compact" onclick="clearAdminMemberSelection()">${ico('x')}</button></div>`;
  }

  function membersView(dept){
    return `<section class="ad-members-card"><div class="ad-card-head">部门成员<span class="right" style="color:#92a1b3;font-size:9px">当前展示 ${memberRowsFor(dept.id).length} 条示例记录</span></div><div class="ad-members-tools"><label class="search-box">${ico('search')}<input placeholder="搜索姓名、工号、岗位或角色" oninput="filterAdminDeptMembers(this.value)"></label><select class="select" style="width:128px;height:37px" onchange="filterAdminDeptRole(this.value)"><option value="all">全部角色</option><option>部门负责人</option><option>文件管理员</option><option>普通成员</option></select><span class="spacer"></span><button class="btn" onclick="goAdminMemberManagement()">进入成员管理</button><button class="btn primary" onclick="openAdminDeptDialog('addMember')">${ico('plus')}添加成员</button></div>${selectedMemberBar()}<div class="ad-member-table-wrap"><table class="ad-member-table"><thead><tr><th class="check-col"><input class="check" type="checkbox" onchange="toggleAllAdminMembers(this.checked)"></th><th>成员</th><th>岗位</th><th class="role-col">部门角色</th><th class="status-col">状态</th><th class="active-col">最近活跃</th><th class="op-col">操作</th></tr></thead><tbody id="adMemberRows">${memberTableRows(dept)}</tbody></table></div></section>`;
  }

  window.filterAdminDeptMembers=function(value){
    const query=String(value||'').trim().toLowerCase();
    document.querySelectorAll('#adMemberRows tr[data-member]').forEach(row=>{row.hidden=query&&!String(row.dataset.member||'').includes(query);});
  };

  window.filterAdminDeptRole=function(role){
    document.querySelectorAll('#adMemberRows tr[data-member]').forEach(row=>{row.hidden=role!=='all'&&!String(row.dataset.member||'').includes(String(role).toLowerCase());});
  };

  window.toggleAdminMemberSelection=function(id,checked){
    if(checked&&!state.adminSelectedMembers.includes(id))state.adminSelectedMembers.push(id);
    if(!checked)state.adminSelectedMembers=state.adminSelectedMembers.filter(item=>item!==id);
    closeMenus();render();
  };

  window.toggleAllAdminMembers=function(checked){
    const ids=memberRowsFor(state.adminDeptSelected).map(item=>item.id);
    state.adminSelectedMembers=checked?ids:[];closeMenus();render();
  };

  window.clearAdminMemberSelection=function(){state.adminSelectedMembers=[];render();};
  window.toggleAdminMemberMenu=function(id){state.adminMemberMenu=state.adminMemberMenu===id?null:id;state.adminDeptTreeMenu=null;state.adminDeptMoreOpen=false;render();};

  function governance(dept){
    return `<div class="ad-govern-grid"><article class="ad-govern-card"><div class="top">${ico('lock')}部门停用</div><p>停用保留组织节点、成员关系和资料库。普通成员暂停通过该部门访问资料库，授权管理员仍可处理历史资料。</p><button class="btn sm" onclick="openAdminDeptDialog('status')">${dept.status==='active'?'停用部门':'启用部门'}</button></article><article class="ad-govern-card"><div class="top">${ico('trash')}组织裁撤</div><p>有子部门时禁止直接裁撤。成员需迁移或进入待分配人员池，公共资料库转移为组织历史文件。</p><button class="btn sm" onclick="openAdminDeptDialog('decommission')">检查裁撤条件</button></article><article class="ad-govern-card"><div class="top">${ico('transfer')}MDM 字段治理</div><p>${dept.source==='MDM 同步'?'该节点来自 MDM，名称、上级关系等主数据字段按同步覆盖策略治理。':'该节点为本地维护，可在当前管理员范围内修改组织属性。'}</p><button class="btn sm" onclick="openAdminDeptDialog('sync')">查看同步状态</button></article><article class="ad-govern-card"><div class="top">${ico('shield')}空间与权限</div><p>当前采用“${esc(dept.quota)}”，默认文件权限为“${esc(dept.permission)}”。策略变化后触发资料库权限重算。</p><button class="btn sm" onclick="recalculateDeptPermissions()">立即校验</button></article></div><section class="ad-audit"><div class="ad-audit-head">最近治理记录<button class="btn text" onclick="toast('完整审计日志已打开')">查看完整审计</button></div><div class="ad-audit-list"><div class="ad-audit-row"><time>今天 09:42</time><i></i><div>张明远更新了部门默认权限，资料库成员权限已重新计算。</div></div><div class="ad-audit-row"><time>昨天 17:18</time><i></i><div>MDM 增量同步完成，未覆盖本地维护字段。</div></div><div class="ad-audit-row"><time>06-21 14:06</time><i></i><div>许欣被设置为文件管理员，已获得部门公共资料库管理权限。</div></div></div></section>`;
  }

  function headerMore(dept){
    if(!state.adminDeptMoreOpen)return '';
    return `<div class="ad-more-pop" onclick="event.stopPropagation()"><button onclick="openAdminDeptDialog('create','${dept.id}')">${ico('plus')}新建下级部门</button><button onclick="openAdminDeptDialog('move')">${ico('move')}调整上级部门</button><button onclick="duplicateDeptPolicy()">${ico('copy')}复制部门策略</button><button class="danger" onclick="openAdminDeptDialog('decommission')">${ico('trash')}组织裁撤</button></div>`;
  }

  function detailPanel(){
    const dept=deptById(state.adminDeptSelected);
    if(!dept)return `<section class="ad-detail-panel"><div class="ad-empty">${ico('building')}<strong>选择一个组织节点</strong><p>从左侧组织树选择部门查看详情</p></div></section>`;
    const status=dept.status==='active';
    const tabs=[['overview','部门概览'],['members','成员列表'],['governance','治理与审计']];
    return `<section class="ad-detail-panel"><div class="ad-hero"><div class="ad-hero-row"><span class="ad-dept-icon">${ico(dept.type==='公司节点'?'building':dept.id==='unassigned'?'users':'folder')}</span><div class="ad-dept-copy"><h2>${esc(dept.name)}</h2><p>${esc(pathOf(dept))}</p><div class="ad-tags"><span class="ad-tag ${status?'success':'off'}">${status?'已启用':'已停用'}</span><span class="ad-tag primary">${esc(dept.type)}</span><span class="ad-tag">${esc(dept.source)}</span></div></div>${dept.id!=='unassigned'?`<div class="ad-hero-actions"><button class="btn" onclick="openAdminDeptDialog('edit')">${ico('edit')}编辑</button><button class="btn" onclick="openAdminDeptDialog('status')">${ico(status?'lock':'check')}${status?'停用':'启用'}</button><span class="ad-more-wrap"><button class="btn ghost icon-only" onclick="toggleAdminDeptMore()">${ico('more')}</button>${headerMore(dept)}</span></div>`:''}</div></div><nav class="ad-tabs">${tabs.map(tab=>`<button class="${state.adminDeptView===tab[0]?'active':''}" onclick="setAdminDeptView('${tab[0]}')">${tab[1]}</button>`).join('')}</nav><div class="ad-body">${state.adminDeptView==='members'?membersView(dept):state.adminDeptView==='governance'?governance(dept):overview(dept)}</div></section>`;
  }

  window.toggleAdminDeptMore=function(){state.adminDeptMoreOpen=!state.adminDeptMoreOpen;state.adminDeptTreeMenu=null;state.adminMemberMenu=null;render();};

  function departmentPage(){
    ensureState();
    return `<div class="ad-page">${pageHead('部门管理','维护组织层级、管理身份、空间策略与部门公共资料库',`<span class="badge blue">当前范围：全集团</span>`)}<div class="ad-toolbar"><div class="ad-sync-note"><span class="ad-sync-pulse"></span>组织数据正常 · 最近同步 ${esc(state.adminLastSync)}</div><button class="btn" onclick="openAdminDeptDialog('sync')">${ico('transfer')}同步组织</button><button class="btn primary" onclick="openAdminDeptDialog('create','${state.adminDeptSelected==='unassigned'?'group':state.adminDeptSelected}')">${ico('plus')}新建部门</button></div><div class="ad-workspace">${organizationTree()}${detailPanel()}</div>${dialog()}</div>`;
  }

  window.adminPage=function(){
    ensureState();
    if(state.adminTab==='dept')return departmentPage();
    const titles={member:['成员管理','管理成员进入、部门归属、状态与文件资产交接'],grant:['管理员设置','配置管理中心入口、管辖范围和菜单权限'],stats:['统计报表','查看空间、成员、流量和组织用量'],security:['安全配置','配置全局外链、回收站、水印和安全扫描策略']};
    const current=titles[state.adminTab]||titles.member;
    const filter=state.adminMemberDeptFilter&&state.adminTab==='member'?`<div class="notice" style="margin-bottom:12px">已从部门管理跳转，当前筛选：${esc(deptById(state.adminMemberDeptFilter)?.name||'全部部门')}。<button class="btn text" onclick="state.adminMemberDeptFilter=null;render()">清除筛选</button></div>`:'';
    return `${pageHead(current[0],current[1])}${filter}<div class="ad-legacy">${baseAdminContent()}</div>`;
  };

  window.openAdminDeptDialog=function(type,arg){state.adminDeptDialog={type,arg};closeMenus();render();};
  window.closeAdminDeptDialog=function(){state.adminDeptDialog=null;render();};

  function parentOptions(currentParent,excludeId){
    return departments.filter(item=>item.id!=='unassigned'&&item.id!==excludeId&&!descendants(excludeId||'__none__').some(child=>child.id===item.id)).map(item=>`<option value="${item.id}" ${item.id===currentParent?'selected':''}>${esc(pathOf(item))}</option>`).join('');
  }

  function formDialog(type,arg){
    const editing=type==='edit';
    const dept=editing?deptById(state.adminDeptSelected):null;
    const target=dept||{name:'',parent:arg||state.adminDeptSelected,type:'普通部门',permission:'操作者',quota:'共享企业剩余可用额度',library:true,managers:[],fileAdmins:[]};
    return `<div class="ad-modal wide"><div class="ad-modal-head">${editing?'编辑组织节点':'新建组织节点'}<button class="btn ghost icon-only" onclick="closeAdminDeptDialog()">${ico('x')}</button></div><div class="ad-modal-body"><div class="ad-form"><div class="ad-form-row"><div class="field"><label>部门名称 <span style="color:#d34d55">*</span></label><input class="input" id="adDeptName" value="${esc(target.name)}" placeholder="请输入部门名称"></div><div class="field"><label>上级部门 <span style="color:#d34d55">*</span></label><select class="select" id="adDeptParent">${parentOptions(target.parent,editing?target.id:null)}</select></div></div><div class="ad-form-row"><div class="field"><label>节点类型</label><select class="select" id="adDeptType"><option ${target.type==='普通部门'?'selected':''}>普通部门</option><option ${target.type==='公司节点'?'selected':''}>公司节点</option></select></div><div class="field"><label>默认文件权限</label><select class="select" id="adDeptPermission">${['预览者','下载者','上传者','编辑者','操作者'].map(item=>`<option ${target.permission===item?'selected':''}>${item}</option>`).join('')}</select></div></div><div class="ad-form-row"><div class="field"><label>部门负责人</label><input class="input" id="adDeptManagers" value="${esc((target.managers||[]).join('、'))}" placeholder="多个姓名用顿号分隔"></div><div class="field"><label>文件管理员</label><input class="input" id="adDeptFileAdmins" value="${esc((target.fileAdmins||[]).join('、'))}" placeholder="多个姓名用顿号分隔"></div></div><div class="field"><label>空间策略</label><select class="select" id="adDeptQuota"><option ${target.quota.includes('共享企业')?'selected':''}>共享企业剩余可用额度</option><option ${target.quota.includes('指定额度')?'selected':''}>指定额度 300 GB</option><option ${target.quota==='不分配空间'?'selected':''}>不分配空间</option></select></div><label class="ad-switch"><input type="checkbox" id="adDeptLibrary" ${target.library?'checked':''}><span><strong>创建或保留部门公共资料库</strong><span>资料库位于企业空间，负责人和文件管理员自动拥有管理权限。</span></span></label>${editing&&target.source==='MDM 同步'?`<div class="notice">该节点来自 MDM。正式实现应按字段覆盖策略限制主数据字段，本原型保留完整交互演示。</div>`:''}</div></div><div class="ad-modal-foot"><button class="btn" onclick="closeAdminDeptDialog()">取消</button><button class="btn primary" onclick="saveAdminDept('${editing?'edit':'create'}')">${editing?'保存修改':'创建部门'}</button></div></div>`;
  }

  function statusDialog(dept){
    const active=dept.status==='active';
    return `<div class="ad-modal"><div class="ad-modal-head">${active?'停用部门':'启用部门'}<button class="btn ghost icon-only" onclick="closeAdminDeptDialog()">${ico('x')}</button></div><div class="ad-modal-body"><div class="notice ${active?'danger-notice':''}">${active?'停用不是删除。组织节点、成员关系和资料库会保留，但普通成员暂停通过该部门访问公共资料库。':'启用后恢复部门默认权限和普通成员对部门公共资料库的访问。'}</div><div class="ad-impact"><div class="ad-impact-row">${ico('users')}影响成员：${dept.members} 人</div><div class="ad-impact-row">${ico('folder')}公共资料库：${dept.library?'保留并同步访问状态':'未创建'}</div><div class="ad-impact-row">${ico('shield')}授权管理员仍可处理历史资料</div></div></div><div class="ad-modal-foot"><button class="btn" onclick="closeAdminDeptDialog()">取消</button><button class="btn ${active?'danger':'primary'}" onclick="confirmAdminDeptStatus()">确认${active?'停用':'启用'}</button></div></div>`;
  }

  function moveDialog(dept){
    return `<div class="ad-modal"><div class="ad-modal-head">调整上级部门<button class="btn ghost icon-only" onclick="closeAdminDeptDialog()">${ico('x')}</button></div><div class="ad-modal-body"><div class="field"><label>新的上级部门</label><select class="select" id="adMoveParent">${parentOptions(dept.parent,dept.id)}</select></div><div class="notice" style="margin-top:12px">调整后将重新计算组织路径、管理范围继承和部门公共资料库权限，不移动资料库文件本身。</div></div><div class="ad-modal-foot"><button class="btn" onclick="closeAdminDeptDialog()">取消</button><button class="btn primary" onclick="confirmAdminDeptMove()">确认调整</button></div></div>`;
  }

  function decommissionDialog(dept){
    const count=childrenOf(dept.id).length;
    const blocked=count>0;
    return `<div class="ad-modal wide"><div class="ad-modal-head">组织裁撤：${esc(dept.name)}<button class="btn ghost icon-only" onclick="closeAdminDeptDialog()">${ico('x')}</button></div><div class="ad-modal-body"><div class="danger-notice notice">组织裁撤属于高风险操作，不会直接删除成员和历史文件。系统需要先完成子部门、成员和资料库处置。</div><div class="ad-impact"><div class="ad-impact-row ${blocked?'blocked':''}">${ico(blocked?'alert':'check')}直属子部门：${count} 个${blocked?'，必须先迁移或裁撤':'，满足裁撤条件'}</div><div class="ad-impact-row">${ico('users')}部门成员：${dept.members} 人，将移入待分配人员池</div><div class="ad-impact-row">${ico('folder')}公共资料库：${dept.library?'转移为“'+esc(dept.name)+'历史文件”':'无需处理'}</div></div><div class="ad-form" style="margin-top:13px"><div class="ad-form-row"><div class="field"><label>成员处置</label><select class="select"><option>移入待分配人员池</option><option>迁移到上级部门</option></select></div><div class="field"><label>历史文件接收人</label><select class="select"><option>张明远（发起管理员）</option><option>李晓华（系统管理员）</option></select></div></div><label class="ad-switch"><input type="checkbox" id="adDecommissionConfirm"><span><strong>我已确认影响范围</strong><span>裁撤动作将记录操作者、成员处置、资料库接收人与权限变化。</span></span></label></div></div><div class="ad-modal-foot"><button class="btn" onclick="closeAdminDeptDialog()">取消</button><button class="btn danger" ${blocked?'disabled':''} onclick="confirmAdminDeptDecommission()">确认裁撤</button></div></div>`;
  }

  function syncDialog(){
    return `<div class="ad-modal"><div class="ad-modal-head">同步组织架构<button class="btn ghost icon-only" onclick="closeAdminDeptDialog()">${ico('x')}</button></div><div class="ad-modal-body"><div class="notice">将从 MDM 拉取组织与人员增量。标记为“本地维护”的字段不会被静默覆盖，冲突记录进入待确认队列。</div><div class="ad-impact"><div class="ad-impact-row">${ico('building')}预计检查 12 个组织节点</div><div class="ad-impact-row">${ico('users')}预计检查 286 名成员</div><div class="ad-impact-row">${ico('shield')}同步后自动校验资料库权限</div></div></div><div class="ad-modal-foot"><button class="btn" onclick="closeAdminDeptDialog()">取消</button><button class="btn primary" onclick="confirmAdminOrgSync()">开始同步</button></div></div>`;
  }

  function addMemberDialog(dept){
    return `<div class="ad-modal"><div class="ad-modal-head">添加成员到 ${esc(dept.name)}<button class="btn ghost icon-only" onclick="closeAdminDeptDialog()">${ico('x')}</button></div><div class="ad-modal-body"><div class="ad-candidate-list">${candidateMembers.map((member,index)=>`<label class="ad-candidate"><input type="radio" name="adCandidate" value="${member.id}" ${index===0?'checked':''}><div class="ad-member-person"><span class="ad-member-avatar">${initial(member.name)}</span><div><strong>${esc(member.name)}</strong><span>工号 ${esc(member.no)} · ${esc(member.job)}</span></div></div><span class="badge">${esc(member.current)}</span></label>`).join('')}</div><div class="field" style="margin-top:13px"><label>加入后的部门角色</label><select class="select" id="adNewMemberRole"><option>普通成员</option><option>文件管理员</option><option>部门负责人</option></select></div><div class="notice" style="margin-top:12px">成员加入后将自动获得当前部门默认文件权限；设置为负责人或文件管理员时同步获得公共资料库管理权限。</div></div><div class="ad-modal-foot"><button class="btn" onclick="closeAdminDeptDialog()">取消</button><button class="btn primary" onclick="confirmAddAdminMember()">确认添加</button></div></div>`;
  }

  function memberRoleDialog(member,bulk=false){
    return `<div class="ad-modal"><div class="ad-modal-head">${bulk?'批量设置部门角色':'设置部门角色'}<button class="btn ghost icon-only" onclick="closeAdminDeptDialog()">${ico('x')}</button></div><div class="ad-modal-body">${bulk?`<div class="notice">将为已选择的 ${state.adminSelectedMembers.length} 名成员统一设置部门角色。</div>`:`<div class="ad-member-person"><span class="ad-member-avatar">${initial(member.name)}</span><div><strong>${esc(member.name)}</strong><span>${esc(member.job)} · 工号 ${esc(member.no)}</span></div></div>`}<div class="field" style="margin-top:14px"><label>部门角色</label><select class="select" id="adRoleValue">${['普通成员','文件管理员','部门负责人'].map(role=>`<option ${!bulk&&member.role===role?'selected':''}>${role}</option>`).join('')}</select></div><div class="notice" style="margin-top:12px">角色变化会联动部门公共资料库管理权限，并写入管理员操作审计。</div></div><div class="ad-modal-foot"><button class="btn" onclick="closeAdminDeptDialog()">取消</button><button class="btn primary" onclick="confirmAdminMemberRole('${bulk?'bulk':member.id}')">保存角色</button></div></div>`;
  }

  function rolesDialog(dept){
    return `<div class="ad-modal wide"><div class="ad-modal-head">调整管理身份<button class="btn ghost icon-only" onclick="closeAdminDeptDialog()">${ico('x')}</button></div><div class="ad-modal-body"><div class="ad-form"><div class="field"><label>部门负责人</label><input class="input" id="adRoleManagers" value="${esc(dept.managers.join('、'))}" placeholder="多个姓名用顿号分隔"></div><div class="field"><label>文件管理员</label><input class="input" id="adRoleFileAdmins" value="${esc(dept.fileAdmins.join('、'))}" placeholder="多个姓名用顿号分隔"></div>${dept.type==='公司节点'?`<div class="field"><label>公司分级管理员</label><input class="input" id="adRoleSubAdmins" value="${esc(dept.subAdmins.join('、'))}" placeholder="多个姓名用顿号分隔"></div>`:''}<div class="notice">部门负责人和文件管理员会自动获得公共资料库管理权限；公司分级管理员仅能治理授权公司范围。</div></div></div><div class="ad-modal-foot"><button class="btn" onclick="closeAdminDeptDialog()">取消</button><button class="btn primary" onclick="saveAdminDeptRoles()">保存身份</button></div></div>`;
  }

  function removeMemberDialog(member){
    return `<div class="ad-modal"><div class="ad-modal-head">移出当前部门<button class="btn ghost icon-only" onclick="closeAdminDeptDialog()">${ico('x')}</button></div><div class="ad-modal-body"><div class="notice danger-notice">${esc(member.name)} 将从当前部门移出并进入待分配人员池，其部门继承权限立即失效，个人空间不受影响。</div><div class="field" style="margin-top:13px"><label>文件责任处置</label><select class="select"><option>保留个人文件所有权</option><option>交接给部门负责人</option></select></div></div><div class="ad-modal-foot"><button class="btn" onclick="closeAdminDeptDialog()">取消</button><button class="btn danger" onclick="confirmRemoveAdminMember('${member.id}')">确认移出</button></div></div>`;
  }

  function dialog(){
    const current=state.adminDeptDialog;
    if(!current)return '';
    const dept=deptById(state.adminDeptSelected)||deptById('research');
    let content='';
    if(current.type==='create'||current.type==='edit')content=formDialog(current.type,current.arg);
    else if(current.type==='status')content=statusDialog(dept);
    else if(current.type==='move')content=moveDialog(dept);
    else if(current.type==='decommission')content=decommissionDialog(dept);
    else if(current.type==='sync')content=syncDialog();
    else if(current.type==='addMember')content=addMemberDialog(dept);
    else if(current.type==='memberRole')content=memberRoleDialog(departmentMembers.find(item=>item.id===current.arg));
    else if(current.type==='bulkRole')content=memberRoleDialog(null,true);
    else if(current.type==='roles')content=rolesDialog(dept);
    else if(current.type==='removeMember')content=removeMemberDialog(departmentMembers.find(item=>item.id===current.arg));
    if(!content)return '';
    return `<div class="ad-modal-layer" onclick="if(event.target===this)closeAdminDeptDialog()">${content}</div>`;
  }

  window.saveAdminDept=function(mode){
    const name=document.getElementById('adDeptName')?.value.trim();
    const parent=document.getElementById('adDeptParent')?.value;
    if(!name)return toast('请输入部门名称','warning');
    if(!parent)return toast('请选择上级部门','warning');
    const duplicate=departments.some(item=>item.parent===parent&&item.name===name&&(mode!=='edit'||item.id!==state.adminDeptSelected));
    if(duplicate)return toast('同一上级部门下名称不能重复','warning');
    const managers=(document.getElementById('adDeptManagers')?.value||'').split(/[、,，]/).map(item=>item.trim()).filter(Boolean);
    const fileAdmins=(document.getElementById('adDeptFileAdmins')?.value||'').split(/[、,，]/).map(item=>item.trim()).filter(Boolean);
    const type=document.getElementById('adDeptType')?.value||'普通部门';
    const permission=document.getElementById('adDeptPermission')?.value||'操作者';
    const quota=document.getElementById('adDeptQuota')?.value||'共享企业剩余可用额度';
    const library=Boolean(document.getElementById('adDeptLibrary')?.checked);
    if(mode==='edit'){
      const dept=deptById(state.adminDeptSelected);const renamed=dept.name!==name;
      Object.assign(dept,{name,parent,type,permission,quota,library,managers,fileAdmins,source:'本地维护',updated:'刚刚'});
      state.adminDeptDialog=null;toast(renamed&&library?'部门与公共资料库已同步改名':'部门信息已保存');render();return;
    }
    const id='dept'+Date.now();
    departments.push({id,parent,name,type,status:'active',source:'本地维护',members:0,used:'0 GB',quota,permission,library,managers,fileAdmins,subAdmins:[],updated:'刚刚'});
    if(!state.adminDeptExpanded.includes(parent))state.adminDeptExpanded.push(parent);
    state.adminDeptSelected=id;state.adminDeptDialog=null;toast(library?'组织节点和公共资料库已创建':'组织节点已创建');render();
  };

  window.confirmAdminDeptStatus=function(){
    const dept=deptById(state.adminDeptSelected);if(!dept)return;
    dept.status=dept.status==='active'?'disabled':'active';dept.updated='刚刚';state.adminDeptDialog=null;
    toast(dept.status==='active'?'部门已启用，资料库权限已恢复':'部门已停用，普通成员资料库访问已暂停',dept.status==='active'?'success':'warning');render();
  };

  window.confirmAdminDeptMove=function(){
    const dept=deptById(state.adminDeptSelected);const parent=document.getElementById('adMoveParent')?.value;
    if(!dept||!parent)return;dept.parent=parent;dept.source='本地维护';dept.updated='刚刚';
    if(!state.adminDeptExpanded.includes(parent))state.adminDeptExpanded.push(parent);
    state.adminDeptDialog=null;toast('上级部门已调整，组织路径与权限继承已重新计算');render();
  };

  window.confirmAdminDeptDecommission=function(){
    const dept=deptById(state.adminDeptSelected);if(!dept)return;
    if(childrenOf(dept.id).length)return toast('请先处理直属子部门','warning');
    if(!document.getElementById('adDecommissionConfirm')?.checked)return toast('请先确认影响范围','warning');
    const pool=deptById('unassigned');pool.members+=dept.members;
    departmentMembers.filter(item=>item.dept===dept.id).forEach(item=>{item.dept='unassigned';item.status='待分配';item.role='普通成员';});
    dept.members=0;dept.status='disabled';dept.library=false;dept.updated='刚刚';state.adminDeptDialog=null;
    toast('组织裁撤已完成，成员和历史文件已按策略处理');render();
  };

  window.confirmAdminOrgSync=function(){state.adminLastSync='刚刚';state.adminDeptDialog=null;toast('MDM 同步完成：新增 0、更新 2、停用 0，权限校验通过');render();};

  window.confirmAddAdminMember=function(){
    const selected=document.querySelector('input[name="adCandidate"]:checked')?.value;
    const candidate=candidateMembers.find(item=>item.id===selected);if(!candidate)return toast('请选择成员','warning');
    const role=document.getElementById('adNewMemberRole')?.value||'普通成员';const dept=deptById(state.adminDeptSelected);
    departmentMembers.push({id:'u'+Date.now(),dept:dept.id,name:candidate.name,no:candidate.no,job:candidate.job,role,status:'正常',active:'刚刚'});
    dept.members+=1;state.adminDeptDialog=null;toast('成员已加入部门，默认文件权限已同步');render();
  };

  window.confirmAdminMemberRole=function(target){
    const role=document.getElementById('adRoleValue')?.value||'普通成员';
    const ids=target==='bulk'?state.adminSelectedMembers:[target];
    departmentMembers.filter(item=>ids.includes(item.id)).forEach(item=>{item.role=role;});
    state.adminSelectedMembers=[];state.adminDeptDialog=null;toast('部门角色已更新，公共资料库权限已同步');render();
  };

  window.saveAdminDeptRoles=function(){
    const dept=deptById(state.adminDeptSelected);if(!dept)return;
    const parse=id=>(document.getElementById(id)?.value||'').split(/[、,，]/).map(item=>item.trim()).filter(Boolean);
    dept.managers=parse('adRoleManagers');dept.fileAdmins=parse('adRoleFileAdmins');if(dept.type==='公司节点')dept.subAdmins=parse('adRoleSubAdmins');dept.updated='刚刚';
    state.adminDeptDialog=null;toast('管理身份已保存，资料库管理权限已同步');render();
  };

  window.confirmRemoveAdminMember=function(id){
    const member=departmentMembers.find(item=>item.id===id);const dept=deptById(state.adminDeptSelected);if(!member||!dept)return;
    member.dept='unassigned';member.role='普通成员';member.status='待分配';dept.members=Math.max(0,dept.members-1);deptById('unassigned').members+=1;
    state.adminDeptDialog=null;toast('成员已移入待分配人员池，部门继承权限已撤销','warning');render();
  };

  window.goAdminMemberManagement=function(){state.adminMemberDeptFilter=state.adminDeptSelected;state.adminTab='member';closeMenus();render();};
  window.viewMemberPermissions=function(id){const member=departmentMembers.find(item=>item.id===id);state.adminMemberMenu=null;toast((member?.name||'成员')+'的文件权限详情已打开');render();};
  window.bulkMoveMembers=function(){toast('批量调动将在成员管理模块中完成');goAdminMemberManagement();};
  window.openDeptLibrary=function(){const dept=deptById(state.adminDeptSelected);openUserConsole('enterprise',dept?.name);};
  window.createDeptLibrary=function(){const dept=deptById(state.adminDeptSelected);if(!dept)return;dept.library=true;dept.updated='刚刚';toast('部门公共资料库已创建，管理权限已同步');render();};
  window.recalculateDeptPermissions=function(){toast('权限校验完成：成员、负责人、文件管理员与资料库状态一致');};
  window.openAdminDeptStats=function(){state.adminTab='stats';closeMenus();render();};
  window.duplicateDeptPolicy=function(){state.adminDeptMoreOpen=false;toast('部门空间与权限策略已复制，可在新建部门时复用');render();};

  const params=new URLSearchParams(window.location.search);
  function syncMode(){document.body.classList.toggle('admin-console-v2',state.page==='admin');}
  const root=document.getElementById('app');
  if(root)new MutationObserver(syncMode).observe(root,{childList:true,subtree:true});
  document.addEventListener('click',event=>{
    if(!event.target.closest('.ad-tree-menu,.ad-tree-more,.ad-more-pop,.ad-more-wrap,.ad-member-menu,.ad-member-menu-wrap')&&(state.adminDeptTreeMenu||state.adminDeptMoreOpen||state.adminMemberMenu)){
      closeMenus();render();
    }
  });

  ensureStyles();ensureState();
  if(params.get('console')==='admin'){
    state.page='admin';
    const requested=String(window.location.hash||'').replace('#','');
    state.adminTab=['dept','member','grant','stats','security'].includes(requested)?requested:'dept';
    render();
  }else if(params.get('entry')==='enterprise'){
    state.page='enterprise';
    const deptName=params.get('dept');
    if(deptName&&Array.isArray(window.depts||depts)&&depts.includes(deptName))state.dept=deptName;
    render();
  }
  syncMode();
})();
