/* Department management console — organization governance prototype. */
(function(){
  if(window.__adminDeptConsoleV1)return;
  window.__adminDeptConsoleV1=true;

  const css=`
body.admin-console-v1{background:#f5f8fc}
body.admin-console-v1 .app{--sidebar:244px;background:#f5f8fc}
body.admin-console-v1 .sidebar{background:#fff;border-right:1px solid #e3eaf1}
body.admin-console-v1 .brand{height:76px}
body.admin-console-v1 .nav-scroll{padding-top:10px}
body.admin-console-v1 .nav-title{padding-top:14px}
body.admin-console-v1 .nav-item{height:42px}
body.admin-console-v1 .topbar{background:rgba(255,255,255,.95)}
body.admin-console-v1 .main{padding:20px 22px 26px;background:linear-gradient(180deg,#f7faff,#f4f7fb)}
body.admin-console-v1 .page{max-width:1680px}
body.admin-console-v1 .page-head{margin-bottom:14px;min-height:52px}
body.admin-console-v1 .page-title{font-size:21px}
body.admin-console-v1 .page-subtitle{color:#7f8fa2}
.admin-console-scope{margin:10px 14px 8px;padding:12px;border:1px solid #dce5ee;border-radius:11px;background:linear-gradient(180deg,#fbfdff,#f7fafc)}
.admin-console-scope span{display:block;font-size:10px;color:#8c9aaa}
.admin-console-scope strong{display:block;margin-top:5px;color:#344a61;font-size:12px}
.admin-console-return{margin:0 14px 14px;width:calc(100% - 28px);height:38px;border:1px solid #dce5ee;border-radius:9px;background:#fff;color:#51657b;display:flex;align-items:center;justify-content:center;gap:8px}
.admin-console-return:hover{border-color:#b9cfdf;background:#f7fafc;color:#356e96}
.admin-dept-toolbar{display:flex;align-items:center;gap:8px;padding:12px 14px;border:1px solid #dfe7ef;border-radius:13px;background:#fff;box-shadow:0 3px 14px rgba(31,57,85,.035)}
.admin-dept-toolbar .sync-note{display:flex;align-items:center;gap:7px;margin-right:auto;color:#8392a3;font-size:11px}
.admin-dept-toolbar .sync-dot{width:7px;height:7px;border-radius:50%;background:#38a879;box-shadow:0 0 0 3px #e7f7f0}
.admin-dept-workspace{display:grid;grid-template-columns:292px minmax(0,1fr);gap:12px;min-height:calc(100vh - 205px);margin-top:12px}
.admin-org-panel,.admin-dept-detail{border:1px solid #dfe7ef;border-radius:14px;background:#fff;box-shadow:0 4px 16px rgba(32,57,84,.04);overflow:hidden}
.admin-org-panel{display:flex;flex-direction:column;min-height:0}
.admin-org-head{padding:15px 15px 12px;border-bottom:1px solid #edf1f5}
.admin-org-title{display:flex;align-items:center;gap:8px;color:#2c4158;font-weight:650}
.admin-org-title small{margin-left:auto;color:#98a5b4;font-weight:500;font-size:10px}
.admin-org-search{height:36px;margin-top:11px;border:1px solid #dce5ee;border-radius:9px;background:#f9fbfd;display:flex;align-items:center;gap:7px;padding:0 10px;color:#8a99aa}
.admin-org-search:focus-within{border-color:#9cbfd7;background:#fff;box-shadow:0 0 0 3px rgba(75,127,163,.08)}
.admin-org-search input{width:100%;border:0;outline:0;background:transparent;color:#43576c;font-size:12px}
.admin-org-tree{padding:9px 8px 12px;overflow:auto;flex:1}
.admin-tree-row{min-height:40px;border:0;border-radius:9px;background:transparent;width:100%;display:grid;grid-template-columns:18px 20px minmax(0,1fr) auto;align-items:center;gap:5px;padding:0 9px;color:#53667a;text-align:left;transition:.15s}
.admin-tree-row:hover{background:#f3f7fa;color:#34536e}
.admin-tree-row.active{background:#eaf3f8;color:#326d96;box-shadow:inset 0 0 0 1px #d9e8f1;font-weight:650}
.admin-tree-row.level-1{padding-left:23px}.admin-tree-row.level-2{padding-left:39px}
.admin-tree-toggle{width:18px;height:18px;border:0;background:transparent;padding:0;display:grid;place-items:center;color:#95a3b3}.admin-tree-toggle.empty{visibility:hidden}
.admin-tree-icon{color:#6f8ca2;display:grid;place-items:center}.admin-tree-row.active .admin-tree-icon{color:#3e7da7}
.admin-tree-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px}.admin-tree-count{font-size:10px;color:#9aa7b5;font-weight:500}
.admin-tree-divider{height:1px;background:#edf1f5;margin:8px 9px}.admin-tree-empty{padding:24px 12px;text-align:center;color:#95a2b0;font-size:12px}
.admin-dept-detail{display:flex;flex-direction:column;min-width:0}
.admin-dept-hero{padding:17px 18px 15px;border-bottom:1px solid #e9eef3;background:linear-gradient(180deg,#fff,#fbfdff)}
.admin-dept-title-row{display:flex;align-items:flex-start;gap:12px}.admin-dept-symbol{width:42px;height:42px;border-radius:11px;border:1px solid #d7e5ee;background:#edf5f9;color:#3f789e;display:grid;place-items:center;flex:none}
.admin-dept-name{min-width:0}.admin-dept-name h2{margin:1px 0 0;color:#24394e;font-size:18px;line-height:1.3}.admin-dept-name p{margin:5px 0 0;color:#8795a5;font-size:11px}
.admin-dept-tags{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}.admin-dept-tag{height:22px;padding:0 8px;border-radius:999px;background:#f1f5f8;color:#687a8d;display:inline-flex;align-items:center;font-size:10px}
.admin-dept-tag.good{background:#eaf7f1;color:#2c8664}.admin-dept-tag.off{background:#fff1f0;color:#bd5a52}.admin-dept-tag.source{background:#eef4fb;color:#52789a}
.admin-dept-hero-actions{margin-left:auto;display:flex;align-items:center;gap:7px}
.admin-dept-tabs{height:44px;padding:0 18px;border-bottom:1px solid #e9eef3;display:flex;align-items:center;gap:24px;background:#fff}.admin-dept-tabs button{height:44px;border:0;background:transparent;color:#6c7d90;position:relative}.admin-dept-tabs button.active{color:#376f97;font-weight:650}.admin-dept-tabs button.active:after{content:"";position:absolute;left:0;right:0;bottom:0;height:2px;background:#4b82a8}
.admin-dept-body{padding:14px;overflow:auto}.admin-metric-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
.admin-metric{min-height:84px;padding:13px 14px;border:1px solid #e0e7ee;border-radius:11px;background:#fff}.admin-metric span{display:block;color:#8c99a8;font-size:10px}.admin-metric strong{display:block;margin-top:10px;color:#273c51;font-size:22px;line-height:1;font-weight:700}.admin-metric small{display:block;margin-top:7px;color:#9aa6b3;font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.admin-dept-info-grid{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(290px,.85fr);gap:10px;margin-top:10px}.admin-info-card{border:1px solid #e0e7ee;border-radius:11px;background:#fff;overflow:hidden}
.admin-info-head{height:46px;padding:0 14px;border-bottom:1px solid #edf1f5;display:flex;align-items:center;color:#34495f;font-size:12px;font-weight:650}.admin-info-head .right{margin-left:auto}
.admin-info-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));padding:5px 14px 12px}.admin-info-item{padding:10px 0;border-bottom:1px solid #f0f3f6}.admin-info-item:nth-last-child(-n+2){border-bottom:0}.admin-info-item:nth-child(odd){padding-right:15px}.admin-info-item label{display:block;color:#98a4b2;font-size:10px;margin-bottom:5px}.admin-info-item div{color:#44586d;font-size:12px;line-height:1.45}
.admin-role-list{padding:8px 14px 12px}.admin-role-line{padding:9px 0;border-bottom:1px solid #f0f3f6}.admin-role-line:last-child{border-bottom:0}.admin-role-line label{display:block;color:#98a4b2;font-size:10px;margin-bottom:7px}
.admin-person-chips{display:flex;gap:6px;flex-wrap:wrap}.admin-person-chip{height:27px;padding:0 8px 0 4px;border:1px solid #dfe7ed;border-radius:999px;background:#fbfcfd;color:#506478;display:inline-flex;align-items:center;gap:5px;font-size:10px}.admin-person-chip i{width:20px;height:20px;border-radius:50%;background:#e3ebf1;color:#496982;display:grid;place-items:center;font-style:normal;font-weight:650}
.admin-library{display:flex;align-items:center;gap:10px;padding:11px;border:1px solid #e4eaf0;border-radius:9px;background:#fafcfd}.admin-library .lib-icon{width:34px;height:34px;border-radius:9px;background:#edf4f8;color:#527d99;display:grid;place-items:center}.admin-library .lib-main{min-width:0;flex:1}.admin-library .lib-main strong{display:block;color:#40546a;font-size:11px}.admin-library .lib-main span{display:block;margin-top:4px;color:#94a1ae;font-size:9px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.admin-member-card{margin-top:10px}.admin-member-tools{padding:10px 12px;border-bottom:1px solid #edf1f5;display:flex;gap:8px;align-items:center}.admin-member-tools .search-box{width:300px;height:36px}.admin-member-table{width:100%;border-collapse:collapse}.admin-member-table th{height:38px;padding:0 12px;background:#fafbfd;border-bottom:1px solid #e6ecf2;color:#77879a;font-size:10px;font-weight:600;text-align:left}.admin-member-table td{height:52px;padding:0 12px;border-bottom:1px solid #eff3f6;color:#526579;font-size:11px}.admin-member-table tr:last-child td{border-bottom:0}.admin-member-table tbody tr:hover{background:#f8fbfd}
.admin-member-person{display:flex;align-items:center;gap:8px}.admin-member-avatar{width:28px;height:28px;border-radius:50%;background:#e6edf3;color:#4b687f;display:grid;place-items:center;font-size:9px;font-weight:700}.admin-member-person strong{display:block;color:#3e5268;font-size:11px}.admin-member-person span{display:block;margin-top:2px;color:#9aa6b2;font-size:9px}
.admin-governance-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.admin-governance-item{padding:14px;border:1px solid #e0e7ee;border-radius:11px;background:#fff}.admin-governance-item strong{display:block;color:#344a60;font-size:12px}.admin-governance-item p{margin:7px 0 0;color:#7e8e9f;font-size:10px;line-height:1.65}
.admin-timeline{margin-top:10px;border:1px solid #e0e7ee;border-radius:11px;background:#fff;padding:4px 14px}.admin-timeline-row{display:grid;grid-template-columns:110px 12px minmax(0,1fr);gap:9px;padding:12px 0;border-bottom:1px solid #f0f3f6}.admin-timeline-row:last-child{border-bottom:0}.admin-timeline-row time{color:#98a5b2;font-size:9px}.admin-timeline-row i{width:8px;height:8px;margin-top:3px;border-radius:50%;background:#6f9dbb;box-shadow:0 0 0 3px #edf4f8}.admin-timeline-row div{color:#53667a;font-size:10px;line-height:1.55}
.admin-empty-detail{min-height:460px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#91a0af}.admin-empty-detail strong{margin-top:12px;color:#53677c}.admin-empty-detail p{font-size:11px}
.admin-dept-modal-layer{position:fixed;inset:0;z-index:1600;background:rgba(25,38,53,.42);display:flex;align-items:center;justify-content:center;padding:22px}.admin-dept-modal{width:620px;max-width:calc(100vw - 36px);max-height:calc(100vh - 44px);border-radius:14px;background:#fff;box-shadow:0 28px 70px rgba(18,35,55,.22);overflow:hidden;display:flex;flex-direction:column}.admin-dept-modal.wide{width:720px}.admin-dept-modal-head{height:58px;display:flex;align-items:center;padding:0 18px;border-bottom:1px solid #e5ebf0;color:#293e54;font-size:16px;font-weight:650}.admin-dept-modal-head button{margin-left:auto}.admin-dept-modal-body{padding:17px 18px;overflow:auto}.admin-dept-modal-foot{height:62px;display:flex;align-items:center;justify-content:flex-end;gap:8px;padding:0 18px;border-top:1px solid #e8edf2;background:#fafcfd}.admin-form-grid{display:grid;gap:13px}.admin-form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}.admin-switch-line{display:flex;align-items:flex-start;gap:9px;padding:11px;border:1px solid #e2e8ee;border-radius:9px;background:#fafcfd}.admin-switch-line input{margin-top:2px}.admin-switch-line strong{display:block;color:#43576c;font-size:11px}.admin-switch-line span{display:block;margin-top:4px;color:#8d9aa8;font-size:9px;line-height:1.55}.admin-impact-list{display:grid;gap:8px;margin-top:12px}.admin-impact-item{display:flex;align-items:center;gap:9px;padding:10px 11px;border:1px solid #e3e9ef;border-radius:9px;color:#5d6f82;font-size:11px}.admin-impact-item.blocked{border-color:#f2ceca;background:#fff7f6;color:#ad524b}.admin-impact-item .icon-stack{color:#7992a6}.admin-impact-item.blocked .icon-stack{color:#c65b53}
.admin-legacy-content{border:1px solid #dfe7ef;border-radius:14px;background:#fff;padding:16px;box-shadow:0 4px 16px rgba(32,57,84,.04)}
@media(max-width:1250px){.admin-dept-workspace{grid-template-columns:250px minmax(0,1fr)}.admin-metric-grid{grid-template-columns:repeat(2,1fr)}.admin-dept-info-grid{grid-template-columns:1fr}.admin-dept-info-grid .admin-info-card{min-width:0}}
@media(max-width:900px){body.admin-console-v1 .app{--sidebar:210px}.admin-dept-workspace{grid-template-columns:1fr}.admin-org-panel{max-height:330px}.admin-form-row{grid-template-columns:1fr}.admin-governance-grid{grid-template-columns:1fr}}
`;

  const style=document.createElement('style');
  style.id='admin-dept-console-v1-style';
  style.textContent=css;
  document.head.appendChild(style);

  const departments=[
    {id:'group',parent:null,name:'贵安发展集团',type:'公司节点',category:'sub1',status:'active',source:'MDM 同步',members:286,used:'2.48 TB',quota:'共享企业剩余可用额度',permission:'操作者',library:true,managers:['张明远','李晓华'],fileAdmins:['周凯'],subAdmins:['张明远'],updated:'2026-06-23 10:18'},
    {id:'general',parent:'group',name:'综合管理部',type:'普通部门',category:'dept',status:'active',source:'MDM 同步',members:31,used:'126 GB',quota:'共享企业剩余可用额度',permission:'下载者',library:true,managers:['李晓华'],fileAdmins:['王璐'],subAdmins:[],updated:'2026-06-22 17:35'},
    {id:'finance',parent:'group',name:'财务管理部',type:'普通部门',category:'dept',status:'active',source:'MDM 同步',members:24,used:'198 GB',quota:'指定额度 300 GB',permission:'预览者',library:true,managers:['陈敏'],fileAdmins:['许欣'],subAdmins:[],updated:'2026-06-22 15:20'},
    {id:'investment',parent:'group',name:'投资发展部',type:'普通部门',category:'dept',status:'active',source:'MDM 同步',members:37,used:'286 GB',quota:'共享企业剩余可用额度',permission:'下载者',library:true,managers:['赵敏'],fileAdmins:['唐楠'],subAdmins:[],updated:'2026-06-21 16:08'},
    {id:'research',parent:'group',name:'研发中心',type:'普通部门',category:'dept',status:'active',source:'本地维护',members:48,used:'412 GB',quota:'指定额度 600 GB',permission:'操作者',library:true,managers:['张明远','周凯'],fileAdmins:['许欣','刘浩','赵敏'],subAdmins:[],updated:'2026-06-23 09:42'},
    {id:'platform',parent:'research',name:'平台研发组',type:'普通部门',category:'dept',status:'active',source:'本地维护',members:21,used:'166 GB',quota:'继承上级策略',permission:'操作者',library:true,managers:['周凯'],fileAdmins:['刘浩'],subAdmins:[],updated:'2026-06-23 08:20'},
    {id:'product',parent:'research',name:'产品设计组',type:'普通部门',category:'dept',status:'active',source:'本地维护',members:12,used:'73 GB',quota:'继承上级策略',permission:'编辑者',library:true,managers:['许欣'],fileAdmins:['赵敏'],subAdmins:[],updated:'2026-06-22 18:10'},
    {id:'construction',parent:'group',name:'建设管理部',type:'普通部门',category:'dept',status:'active',source:'MDM 同步',members:55,used:'530 GB',quota:'共享企业剩余可用额度',permission:'下载者',library:true,managers:['刘洁'],fileAdmins:['赵敏'],subAdmins:[],updated:'2026-06-20 11:40'},
    {id:'operations',parent:'group',name:'运营管理部',type:'普通部门',category:'dept',status:'disabled',source:'MDM 同步',members:34,used:'194 GB',quota:'不分配空间',permission:'预览者',library:true,managers:['唐楠'],fileAdmins:['王璐'],subAdmins:[],updated:'2026-06-19 14:26'},
    {id:'unassigned',parent:null,name:'待分配人员池',type:'虚拟节点',category:'pool',status:'active',source:'系统内置',members:4,used:'—',quota:'不参与空间分配',permission:'无部门默认权限',library:false,managers:[],fileAdmins:[],subAdmins:[],updated:'2026-06-23 10:10'}
  ];

  const deptMembers=[
    {name:'张明远',no:'000001',job:'技术开发岗',role:'部门负责人',status:'正常',active:'今天 10:16'},
    {name:'周凯',no:'000018',job:'技术开发岗',role:'部门负责人',status:'正常',active:'今天 09:52'},
    {name:'许欣',no:'000026',job:'产品设计岗',role:'文件管理员',status:'正常',active:'昨天 17:46'},
    {name:'刘浩',no:'000037',job:'技术开发岗',role:'文件管理员',status:'正常',active:'昨天 16:23'},
    {name:'赵敏',no:'000045',job:'产品设计岗',role:'文件管理员',status:'正常',active:'06-21 14:08'},
    {name:'王璐',no:'000052',job:'测试工程师',role:'普通成员',status:'正常',active:'06-20 18:22'}
  ];

  const baseSidebar=window.sidebar;
  const baseBreadcrumb=window.breadcrumb;
  const baseTopbar=window.topbar;
  const baseAdminContent=window.adminContent;

  function ensureState(){
    if(!state.adminDeptSelected)state.adminDeptSelected='research';
    if(!Array.isArray(state.adminDeptExpanded))state.adminDeptExpanded=['group','research'];
    if(!state.adminDeptView)state.adminDeptView='overview';
    if(!state.adminDeptDialog)state.adminDeptDialog=null;
    if(!state.adminLastSync)state.adminLastSync='今天 10:18';
  }

  function esc(value){return typeof safe==='function'?safe(value):String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
  function deptById(id){return departments.find(item=>item.id===id);}
  function childrenOf(id){return departments.filter(item=>item.parent===id);}
  function deptPath(dept){const names=[];let current=dept;while(current){names.unshift(current.name);current=deptById(current.parent);}return names.join(' / ');}
  function iconHtml(name){return typeof icon==='function'?icon(name):'';}
  function initial(name){return esc(String(name||'').slice(0,1));}

  window.openAdminConsole=function(){
    const url=new URL(window.location.href);
    url.searchParams.set('console','admin');
    url.hash='dept';
    state.profileOpen=false;
    render();
    window.open(url.toString(),'_blank','noopener');
  };

  window.openUserConsole=function(){
    const url=new URL(window.location.href);
    url.searchParams.delete('console');
    url.hash='';
    window.open(url.toString(),'_blank','noopener');
  };

  window.setAdminTab=function(tab){
    state.adminTab=tab;
    state.profileOpen=false;
    if(tab==='dept')state.adminDeptView='overview';
    render();
  };

  window.profileMenu=function(){
    if(state.page!=='admin'){
      return `<div class="profile-pop" onclick="event.stopPropagation()"><div class="profile-card-head"><div class="profile-avatar">张</div><div><strong>张明远</strong><span>系统管理员 · 研发中心</span></div></div><div class="menu-sep"></div><button class="profile-item" onclick="state.profileOpen=false;toast('个人资料页正在完善')">${iconHtml('user')}个人资料</button><button class="profile-item" onclick="state.profileOpen=false;toast('账号与安全设置已打开')">${iconHtml('shield')}账号与安全</button><button class="profile-item admin-entry" onclick="openAdminConsole()">${iconHtml('settings')}管理中心<span>管理端</span></button><div class="menu-sep"></div><button class="profile-item danger" onclick="state.profileOpen=false;toast('已安全退出当前账号','warning')">${iconHtml('external')}退出登录</button></div>`;
    }
    return `<div class="profile-pop" onclick="event.stopPropagation()"><div class="profile-card-head"><div class="profile-avatar">张</div><div><strong>张明远</strong><span>系统管理员 · 全集团</span></div></div><div class="menu-sep"></div><button class="profile-item" onclick="openUserConsole()">${iconHtml('external')}打开用户端</button><button class="profile-item" onclick="state.profileOpen=false;toast('管理账号安全设置已打开')">${iconHtml('shield')}账号与安全</button><div class="menu-sep"></div><button class="profile-item danger" onclick="state.profileOpen=false;toast('已安全退出当前账号','warning')">${iconHtml('external')}退出登录</button></div>`;
  };

  window.sidebar=function(){
    if(state.page!=='admin')return baseSidebar();
    const groups=[
      {section:'组织与成员',items:[['dept','building','部门管理'],['member','users','成员管理'],['grant','shield','管理员设置']]},
      {section:'治理与审计',items:[['stats','chart','统计报表'],['security','lock','安全配置']]}
    ];
    return `<aside class="sidebar"><div class="brand"><div class="brand-mark"><iconify-icon icon="solar:cloud-file-bold-duotone" aria-hidden="true"></iconify-icon><span class="brand-fallback">知</span></div><div class="brand-copy"><strong>智汇云知</strong><span>智能知识库管理平台 · 管理端</span></div></div><div class="nav-scroll">${groups.map(group=>`<div class="nav-title">${group.section}</div>${group.items.map(item=>`<button class="nav-item ${state.adminTab===item[0]?'active':''}" onclick="setAdminTab('${item[0]}')">${iconHtml(item[1])}<span>${item[2]}</span></button>`).join('')}`).join('')}</div><div class="admin-console-scope"><span>当前管理范围</span><strong>贵安发展集团及全部下级组织</strong></div><button class="admin-console-return" onclick="openUserConsole()">${iconHtml('external')}打开用户端</button></aside>`;
  };

  window.breadcrumb=function(){
    if(state.page!=='admin')return baseBreadcrumb();
    const names={dept:'部门管理',member:'成员管理',grant:'管理员设置',stats:'统计报表',security:'安全配置'};
    return `<div class="breadcrumb"><span>智能知识库</span><span class="sep">/</span><span>管理中心</span><span class="sep">/</span><b>${names[state.adminTab]||'部门管理'}</b></div>`;
  };

  window.topbar=function(){
    if(state.page!=='admin')return baseTopbar();
    return `<header class="topbar">${breadcrumb()}<div class="top-spacer"></div><div class="global-search" onclick="document.getElementById('adminDeptSearch')?.focus()">${iconHtml('search')}<input placeholder="搜索部门、成员或管理功能" readonly><span class="kbd">Ctrl K</span></div><button class="top-icon" title="消息中心" onclick="toast('暂无新的管理通知')">${iconHtml('bell')}<i class="dot"></i></button><button class="top-icon" title="帮助" onclick="toast('管理中心帮助已打开')">${iconHtml('info')}</button><div class="profile-wrap"><button class="avatar profile-trigger" title="张明远" aria-expanded="${state.profileOpen}" onclick="event.stopPropagation();state.profileOpen=!state.profileOpen;state.menu=null;render()">张</button>${state.profileOpen?profileMenu():''}</div></header>`;
  };

  function treeRows(parent=null,level=0){
    const nodes=departments.filter(item=>item.parent===parent&&item.id!=='unassigned');
    return nodes.map(node=>{
      const children=childrenOf(node.id);
      const expanded=state.adminDeptExpanded.includes(node.id);
      const row=`<div class="admin-tree-wrap" data-parent="${node.parent||''}" data-name="${esc(node.name)}"><button class="admin-tree-row level-${Math.min(level,2)} ${state.adminDeptSelected===node.id?'active':''}" onclick="selectAdminDept('${node.id}')"><span class="admin-tree-toggle ${children.length?'':'empty'}" onclick="event.stopPropagation();toggleAdminDept('${node.id}')">${children.length?iconHtml(expanded?'down':'chevron'):''}</span><span class="admin-tree-icon">${iconHtml(node.type==='公司节点'?'building':'folder')}</span><span class="admin-tree-name">${esc(node.name)}</span><span class="admin-tree-count">${node.members}</span></button>${children.length&&expanded?`<div class="admin-tree-children">${treeRows(node.id,level+1)}</div>`:''}</div>`;
      return row;
    }).join('');
  }

  function orgTree(){
    const pool=deptById('unassigned');
    return `<aside class="admin-org-panel"><div class="admin-org-head"><div class="admin-org-title">${iconHtml('building')}组织架构<small>${departments.length-1} 个正式节点</small></div><label class="admin-org-search">${iconHtml('search')}<input id="adminDeptSearch" placeholder="搜索部门名称" oninput="filterAdminDeptTree(this.value)"></label></div><div class="admin-org-tree" id="adminOrgTree">${treeRows()}<div class="admin-tree-divider"></div><div class="admin-tree-wrap" data-name="${esc(pool.name)}"><button class="admin-tree-row ${state.adminDeptSelected==='unassigned'?'active':''}" onclick="selectAdminDept('unassigned')"><span class="admin-tree-toggle empty"></span><span class="admin-tree-icon">${iconHtml('users')}</span><span class="admin-tree-name">${esc(pool.name)}</span><span class="admin-tree-count">${pool.members}</span></button></div><div class="admin-tree-empty" id="adminTreeEmpty" hidden>未找到匹配的组织节点</div></div></aside>`;
  }

  window.filterAdminDeptTree=function(value){
    const query=String(value||'').trim().toLowerCase();
    const tree=document.getElementById('adminOrgTree');
    if(!tree)return;
    let visible=0;
    tree.querySelectorAll('.admin-tree-wrap').forEach(wrap=>{
      const matched=!query||(wrap.dataset.name||'').toLowerCase().includes(query);
      wrap.hidden=!matched;
      if(matched)visible++;
    });
    const empty=document.getElementById('adminTreeEmpty');
    if(empty)empty.hidden=visible>0;
  };

  window.toggleAdminDept=function(id){
    const index=state.adminDeptExpanded.indexOf(id);
    if(index>=0)state.adminDeptExpanded.splice(index,1);else state.adminDeptExpanded.push(id);
    render();
  };

  window.selectAdminDept=function(id){
    state.adminDeptSelected=id;
    state.adminDeptView='overview';
    state.adminDeptDialog=null;
    render();
  };

  window.setAdminDeptView=function(view){state.adminDeptView=view;render();};

  function peopleChips(items,empty='未设置'){
    if(!items||!items.length)return `<span style="color:#9aa7b5;font-size:10px">${empty}</span>`;
    return `<div class="admin-person-chips">${items.map(name=>`<span class="admin-person-chip"><i>${initial(name)}</i>${esc(name)}</span>`).join('')}</div>`;
  }

  function memberRows(){
    return deptMembers.map(member=>`<tr data-member="${esc(`${member.name} ${member.no} ${member.job}`)}"><td><div class="admin-member-person"><span class="admin-member-avatar">${initial(member.name)}</span><div><strong>${esc(member.name)}</strong><span>工号 ${esc(member.no)}</span></div></div></td><td>${esc(member.job)}</td><td><span class="badge ${member.role==='普通成员'?'':'blue'}">${esc(member.role)}</span></td><td><span class="status-dot green"></span>${esc(member.status)}</td><td>${esc(member.active)}</td><td class="right"><button class="btn ghost icon-only compact" onclick="toast('已打开成员详情')">${iconHtml('more')}</button></td></tr>`).join('');
  }

  window.filterAdminMembers=function(value){
    const query=String(value||'').trim().toLowerCase();
    document.querySelectorAll('#adminDeptMemberRows tr').forEach(row=>{row.hidden=query&&!String(row.dataset.member||'').toLowerCase().includes(query);});
  };

  function membersCard(full=false){
    return `<section class="admin-info-card admin-member-card"><div class="admin-info-head">${full?'部门成员':'成员概览'}<span class="right" style="color:#97a3b0;font-size:10px">共 ${deptMembers.length} 条示例记录</span></div><div class="admin-member-tools"><label class="search-box">${iconHtml('search')}<input placeholder="搜索姓名、工号或岗位" oninput="filterAdminMembers(this.value)"></label><button class="btn sm" onclick="toast('已打开成员管理并按当前部门筛选')">进入成员管理</button></div><div style="overflow:auto"><table class="admin-member-table"><thead><tr><th>成员</th><th>岗位</th><th>部门角色</th><th>状态</th><th>最近活跃</th><th class="right">操作</th></tr></thead><tbody id="adminDeptMemberRows">${memberRows()}</tbody></table></div></section>`;
  }

  function overview(dept){
    const subCount=childrenOf(dept.id).length;
    return `<div class="admin-metric-grid"><div class="admin-metric"><span>部门成员</span><strong>${dept.members}</strong><small>成员变化将联动资料库权限</small></div><div class="admin-metric"><span>直属子部门</span><strong>${subCount}</strong><small>${subCount?'删除前必须先处理子部门':'当前无直属子部门'}</small></div><div class="admin-metric"><span>部门已用容量</span><strong style="font-size:18px">${esc(dept.used)}</strong><small>${esc(dept.quota)}</small></div><div class="admin-metric"><span>默认文件权限</span><strong style="font-size:18px">${esc(dept.permission)}</strong><small>新成员加入后自动生效</small></div></div><div class="admin-dept-info-grid"><section class="admin-info-card"><div class="admin-info-head">组织节点信息<button class="btn text right" onclick="openDeptDialog('edit')">编辑</button></div><div class="admin-info-list"><div class="admin-info-item"><label>节点类型</label><div>${esc(dept.type)}</div></div><div class="admin-info-item"><label>上级组织</label><div>${esc(deptById(dept.parent)?.name||'无')}</div></div><div class="admin-info-item"><label>空间策略</label><div>${esc(dept.quota)}</div></div><div class="admin-info-item"><label>默认权限</label><div>${esc(dept.permission)}</div></div><div class="admin-info-item"><label>数据来源</label><div>${esc(dept.source)}</div></div><div class="admin-info-item"><label>最近更新</label><div>${esc(dept.updated)}</div></div></div></section><section class="admin-info-card"><div class="admin-info-head">管理身份</div><div class="admin-role-list"><div class="admin-role-line"><label>部门负责人</label>${peopleChips(dept.managers)}</div><div class="admin-role-line"><label>文件管理员</label>${peopleChips(dept.fileAdmins)}</div>${dept.type==='公司节点'?`<div class="admin-role-line"><label>公司分级管理员</label>${peopleChips(dept.subAdmins)}</div>`:''}</div></section></div><div class="admin-dept-info-grid"><section class="admin-info-card"><div class="admin-info-head">部门公共资料库<span class="right"><button class="btn text" onclick="openDeptLibrary()">进入资料库</button></span></div><div style="padding:12px 14px">${dept.library?`<div class="admin-library"><span class="lib-icon">${iconHtml('folder')}</span><div class="lib-main"><strong>${esc(dept.name)}公共资料库</strong><span>企业空间 / 部门公共资料库 / ${esc(dept.name)}</span></div><span class="badge green">已关联</span></div><p class="help">负责人和文件管理员自动拥有资料库管理权限；成员加入、移出或默认权限变化时同步重算。</p>`:`<div class="notice">当前组织节点未创建部门公共资料库。</div>`}</div></section><section class="admin-info-card"><div class="admin-info-head">权限联动状态</div><div class="admin-role-list"><div class="admin-impact-item">${iconHtml('check')}成员默认权限已同步</div><div class="admin-impact-item">${iconHtml('check')}负责人和文件管理员权限已同步</div><div class="admin-impact-item">${iconHtml('check')}部门状态与资料库访问一致</div></div></section></div>${membersCard(false)}`;
  }

  function governance(dept){
    return `<div class="admin-governance-grid"><div class="admin-governance-item"><strong>部门停用</strong><p>停用后保留组织节点、成员关系和资料库；普通成员失去通过该部门访问资料库的能力，授权管理员仍可处理历史资料。</p></div><div class="admin-governance-item"><strong>组织裁撤</strong><p>有子部门时禁止直接裁撤；成员必须迁移或移入待分配人员池；公共资料库转移为组织历史文件并记录审计日志。</p></div><div class="admin-governance-item"><strong>MDM 字段治理</strong><p>${dept.source==='MDM 同步'?'该节点来自 MDM。名称、上级关系等主数据字段应遵循同步覆盖策略。':'该节点由本地维护，可按当前管理员范围进行编辑。'}</p></div><div class="admin-governance-item"><strong>空间与权限</strong><p>当前采用“${esc(dept.quota)}”，成员默认权限为“${esc(dept.permission)}”。策略变化后应触发资料库权限重算。</p></div></div><div class="admin-timeline"><div class="admin-timeline-row"><time>今天 09:42</time><i></i><div>张明远更新了部门默认权限，资料库成员权限已重新计算。</div></div><div class="admin-timeline-row"><time>昨天 17:18</time><i></i><div>MDM 增量同步完成，未覆盖本地维护字段。</div></div><div class="admin-timeline-row"><time>06-21 14:06</time><i></i><div>许欣被设置为文件管理员，已获得部门公共资料库管理权限。</div></div></div>`;
  }

  function deptDetail(){
    const dept=deptById(state.adminDeptSelected);
    if(!dept)return `<section class="admin-dept-detail"><div class="admin-empty-detail">${iconHtml('building')}<strong>选择一个组织节点</strong><p>在左侧组织树中选择部门查看详情</p></div></section>`;
    const tabs=[['overview','部门概览'],['members','成员列表'],['governance','治理与审计']];
    const status=dept.status==='active';
    return `<section class="admin-dept-detail"><div class="admin-dept-hero"><div class="admin-dept-title-row"><span class="admin-dept-symbol">${iconHtml(dept.type==='公司节点'?'building':dept.id==='unassigned'?'users':'folder')}</span><div class="admin-dept-name"><h2>${esc(dept.name)}</h2><p>${esc(deptPath(dept))}</p><div class="admin-dept-tags"><span class="admin-dept-tag ${status?'good':'off'}">${status?'已启用':'已停用'}</span><span class="admin-dept-tag">${esc(dept.type)}</span><span class="admin-dept-tag source">${esc(dept.source)}</span></div></div><div class="admin-dept-hero-actions">${dept.id!=='unassigned'?`<button class="btn" onclick="openDeptDialog('edit')">${iconHtml('edit')}编辑</button><button class="btn" onclick="openDeptDialog('status')">${iconHtml(status?'lock':'check')}${status?'停用':'启用'}</button><button class="btn ghost icon-only" title="组织裁撤" onclick="openDeptDialog('decommission')">${iconHtml('more')}</button>`:''}</div></div></div><div class="admin-dept-tabs">${tabs.map(tab=>`<button class="${state.adminDeptView===tab[0]?'active':''}" onclick="setAdminDeptView('${tab[0]}')">${tab[1]}</button>`).join('')}</div><div class="admin-dept-body">${state.adminDeptView==='members'?membersCard(true):state.adminDeptView==='governance'?governance(dept):overview(dept)}</div></section>`;
  }

  function departmentPage(){
    ensureState();
    return `${pageHead('部门管理','维护组织节点、管理身份、空间策略与部门公共资料库',`<span class="badge blue">当前范围：全集团</span>`)}<div class="admin-dept-toolbar"><div class="sync-note"><span class="sync-dot"></span>组织数据正常 · 最近同步 ${esc(state.adminLastSync)}</div><button class="btn" onclick="syncAdminOrganization()">${iconHtml('transfer')}同步组织</button><button class="btn primary" onclick="openDeptDialog('create')">${iconHtml('plus')}新建部门</button></div><div class="admin-dept-workspace">${orgTree()}${deptDetail()}</div>${deptDialog()}`;
  }

  window.adminPage=function(){
    ensureState();
    if(state.adminTab==='dept')return departmentPage();
    const titles={member:['成员管理','管理成员进入、部门归属、状态与文件资产交接'],grant:['管理员设置','配置管理中心入口、管辖范围和菜单权限'],stats:['统计报表','查看空间、成员、流量和组织用量'],security:['安全配置','配置全局外链、回收站、水印和安全扫描策略']};
    const current=titles[state.adminTab]||titles.member;
    return `${pageHead(current[0],current[1])}<div class="admin-legacy-content">${baseAdminContent()}</div>`;
  };

  window.openDeptDialog=function(type){state.adminDeptDialog=type;state.profileOpen=false;render();};
  window.closeDeptDialog=function(){state.adminDeptDialog=null;render();};

  function selectOptions(selectedId){
    return departments.filter(item=>item.category!=='pool'&&item.id!==state.adminDeptSelected).map(item=>`<option value="${item.id}" ${item.id===selectedId?'selected':''}>${esc(deptPath(item))}</option>`).join('');
  }

  function deptDialog(){
    const type=state.adminDeptDialog;
    if(!type)return '';
    const dept=deptById(state.adminDeptSelected)||deptById('research');
    if(type==='create'||type==='edit'){
      const editing=type==='edit';
      const target=editing?dept:{name:'',parent:state.adminDeptSelected==='unassigned'?'group':state.adminDeptSelected,type:'普通部门',managers:[],fileAdmins:[],permission:'操作者',quota:'共享企业剩余可用额度',library:true};
      return `<div class="admin-dept-modal-layer" onclick="if(event.target===this)closeDeptDialog()"><div class="admin-dept-modal wide"><div class="admin-dept-modal-head">${editing?'编辑组织节点':'新建组织节点'}<button class="btn ghost icon-only" onclick="closeDeptDialog()">${iconHtml('x')}</button></div><div class="admin-dept-modal-body"><div class="admin-form-grid"><div class="admin-form-row"><div class="field"><label>部门名称 <span style="color:#d45b5f">*</span></label><input class="input" id="deptFormName" value="${esc(target.name)}" placeholder="请输入部门名称"></div><div class="field"><label>上级部门 <span style="color:#d45b5f">*</span></label><select class="select" id="deptFormParent">${selectOptions(target.parent)}</select></div></div><div class="admin-form-row"><div class="field"><label>节点类型 <span style="color:#d45b5f">*</span></label><select class="select" id="deptFormType"><option ${target.type==='普通部门'?'selected':''}>普通部门</option><option ${target.type==='公司节点'?'selected':''}>公司节点</option></select></div><div class="field"><label>默认文件权限</label><select class="select" id="deptFormPermission">${['预览者','下载者','上传者','编辑者','操作者'].map(item=>`<option ${target.permission===item?'selected':''}>${item}</option>`).join('')}</select></div></div><div class="admin-form-row"><div class="field"><label>部门负责人</label><input class="input" id="deptFormManagers" value="${esc((target.managers||[]).join('、'))}" placeholder="输入姓名，多个用顿号分隔"></div><div class="field"><label>文件管理员</label><input class="input" id="deptFormFileAdmins" value="${esc((target.fileAdmins||[]).join('、'))}" placeholder="输入姓名，多个用顿号分隔"></div></div><div class="field"><label>部门空间策略</label><select class="select" id="deptFormQuota"><option ${target.quota.includes('共享企业')?'selected':''}>共享企业剩余可用额度</option><option ${target.quota.includes('指定额度')?'selected':''}>指定额度 300 GB</option><option ${target.quota==='不分配空间'?'selected':''}>不分配空间</option></select></div><label class="admin-switch-line"><input type="checkbox" id="deptFormLibrary" ${target.library?'checked':''}><span><strong>创建或保留部门公共资料库</strong><span>资料库位于企业空间，负责人和文件管理员自动成为资料库管理员。</span></span></label>${editing&&dept.source==='MDM 同步'?`<div class="notice">该节点来自 MDM。原型允许演示编辑，但正式实现需按字段覆盖策略限制名称、上级组织等主数据字段。</div>`:''}</div></div><div class="admin-dept-modal-foot"><button class="btn" onclick="closeDeptDialog()">取消</button><button class="btn primary" onclick="saveDeptForm('${editing?'edit':'create'}')">${editing?'保存修改':'创建部门'}</button></div></div></div>`;
    }
    if(type==='status'){
      const active=dept.status==='active';
      return `<div class="admin-dept-modal-layer" onclick="if(event.target===this)closeDeptDialog()"><div class="admin-dept-modal"><div class="admin-dept-modal-head">${active?'停用部门':'启用部门'}<button class="btn ghost icon-only" onclick="closeDeptDialog()">${iconHtml('x')}</button></div><div class="admin-dept-modal-body"><div class="${active?'danger-notice':'notice'} notice">${active?'停用不是删除。组织节点、成员关系和资料库仍会保留，但普通成员将无法通过该部门访问公共资料库。':'启用后将恢复部门默认权限和普通成员对部门公共资料库的访问。'}</div><div class="admin-impact-list"><div class="admin-impact-item">${iconHtml('users')}影响成员：${dept.members} 人</div><div class="admin-impact-item">${iconHtml('folder')}公共资料库：${dept.library?'保留并同步访问状态':'未创建'}</div><div class="admin-impact-item">${iconHtml('shield')}超级管理员和授权范围内分级管理员仍可处理资料</div></div></div><div class="admin-dept-modal-foot"><button class="btn" onclick="closeDeptDialog()">取消</button><button class="btn ${active?'danger':'primary'}" onclick="confirmDeptStatus()">确认${active?'停用':'启用'}</button></div></div></div>`;
    }
    const childCount=childrenOf(dept.id).length;
    const blocked=childCount>0;
    return `<div class="admin-dept-modal-layer" onclick="if(event.target===this)closeDeptDialog()"><div class="admin-dept-modal wide"><div class="admin-dept-modal-head">组织裁撤：${esc(dept.name)}<button class="btn ghost icon-only" onclick="closeDeptDialog()">${iconHtml('x')}</button></div><div class="admin-dept-modal-body"><div class="danger-notice notice">组织裁撤属于高风险操作，不会直接删除成员和部门历史文件。系统需要先完成子部门、成员和资料库处置。</div><div class="admin-impact-list"><div class="admin-impact-item ${blocked?'blocked':''}">${iconHtml(blocked?'alert':'check')}直属子部门：${childCount} 个${blocked?'，必须先迁移或裁撤子部门':'，满足裁撤条件'}</div><div class="admin-impact-item">${iconHtml('users')}部门成员：${dept.members} 人，将移入待分配人员池</div><div class="admin-impact-item">${iconHtml('folder')}公共资料库：${dept.library?'转移为“'+esc(dept.name)+'历史文件”':'无需处理'}</div></div><div class="admin-form-grid" style="margin-top:13px"><div class="admin-form-row"><div class="field"><label>成员处置</label><select class="select" id="deptDecomMembers"><option>移入待分配人员池</option><option>迁移到上级部门</option></select></div><div class="field"><label>历史文件接收人</label><select class="select" id="deptDecomReceiver"><option>张明远（发起管理员）</option><option>李晓华（系统管理员）</option></select></div></div><label class="admin-switch-line"><input type="checkbox" id="deptDecomConfirm"><span><strong>我已确认影响范围</strong><span>裁撤动作将记录操作者、处置策略、资料库接收人和权限变化。</span></span></label></div></div><div class="admin-dept-modal-foot"><button class="btn" onclick="closeDeptDialog()">取消</button><button class="btn danger" ${blocked?'disabled':''} onclick="confirmDeptDecommission()">确认裁撤</button></div></div></div>`;
  }

  window.saveDeptForm=function(mode){
    const name=document.getElementById('deptFormName')?.value.trim();
    const parent=document.getElementById('deptFormParent')?.value;
    const nodeType=document.getElementById('deptFormType')?.value;
    if(!name)return toast('请输入部门名称','warning');
    if(!parent)return toast('请选择上级部门','warning');
    const duplicate=departments.some(item=>item.parent===parent&&item.name===name&&(mode!=='edit'||item.id!==state.adminDeptSelected));
    if(duplicate)return toast('同一上级部门下名称不能重复','warning');
    const managers=(document.getElementById('deptFormManagers')?.value||'').split(/[、,，]/).map(item=>item.trim()).filter(Boolean);
    const fileAdmins=(document.getElementById('deptFormFileAdmins')?.value||'').split(/[、,，]/).map(item=>item.trim()).filter(Boolean);
    const permission=document.getElementById('deptFormPermission')?.value||'操作者';
    const quota=document.getElementById('deptFormQuota')?.value||'共享企业剩余可用额度';
    const library=Boolean(document.getElementById('deptFormLibrary')?.checked);
    if(mode==='edit'){
      const dept=deptById(state.adminDeptSelected);
      const oldName=dept.name;
      Object.assign(dept,{name,parent,type:nodeType,category:nodeType==='公司节点'?'sub2':'dept',managers,fileAdmins,permission,quota,library,source:'本地维护',updated:'刚刚'});
      state.adminDeptDialog=null;
      toast(oldName!==name&&library?'部门与公共资料库已同步改名':'部门信息已保存');
      render();
      return;
    }
    const id='dept'+Date.now();
    departments.push({id,parent,name,type:nodeType,category:nodeType==='公司节点'?'sub2':'dept',status:'active',source:'本地维护',members:0,used:'0 GB',quota,permission,library,managers,fileAdmins,subAdmins:[],updated:'刚刚'});
    if(!state.adminDeptExpanded.includes(parent))state.adminDeptExpanded.push(parent);
    state.adminDeptSelected=id;
    state.adminDeptDialog=null;
    toast(library?'组织节点和部门公共资料库已创建':'组织节点已创建');
    render();
  };

  window.confirmDeptStatus=function(){
    const dept=deptById(state.adminDeptSelected);
    if(!dept)return;
    dept.status=dept.status==='active'?'disabled':'active';
    dept.updated='刚刚';
    state.adminDeptDialog=null;
    toast(dept.status==='active'?'部门已启用，资料库权限已恢复':'部门已停用，普通成员资料库访问已禁用',dept.status==='active'?'success':'warning');
    render();
  };

  window.confirmDeptDecommission=function(){
    const dept=deptById(state.adminDeptSelected);
    if(!dept)return;
    if(childrenOf(dept.id).length)return toast('请先处理直属子部门','warning');
    if(!document.getElementById('deptDecomConfirm')?.checked)return toast('请先确认影响范围','warning');
    const pool=deptById('unassigned');
    pool.members+=dept.members;
    dept.members=0;
    dept.status='disabled';
    dept.library=false;
    dept.updated='刚刚';
    state.adminDeptDialog=null;
    toast('组织裁撤已完成，成员与历史文件已按策略处理');
    render();
  };

  window.syncAdminOrganization=function(){
    state.adminLastSync='刚刚';
    toast('MDM 组织同步完成：新增 0、更新 2、停用 0');
    render();
  };

  window.openDeptLibrary=function(){toast('已打开“企业空间 / 部门公共资料库 / '+deptById(state.adminDeptSelected).name+'”');};

  function syncMode(){document.body.classList.toggle('admin-console-v1',state.page==='admin');}

  const root=document.getElementById('app');
  if(root)new MutationObserver(syncMode).observe(root,{childList:true,subtree:true});

  const params=new URLSearchParams(window.location.search);
  if(params.get('console')==='admin'){
    ensureState();
    state.page='admin';
    const requested=String(window.location.hash||'').replace('#','');
    state.adminTab=['dept','member','grant','stats','security'].includes(requested)?requested:'dept';
    render();
  }
  syncMode();
})();
