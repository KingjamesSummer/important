/* Department management v12 — personal-space aligned visual system and complete interactions. */
(function(){
  if(window.__adminDeptConsoleV12)return;
  window.__adminDeptConsoleV12=true;
  if(!window.state||typeof window.render!=='function')return;

  const previousAdminPage=window.adminPage;
  const icon=name=>typeof window.icon==='function'?window.icon(name):'';
  const esc=value=>typeof window.safe==='function'?window.safe(value):String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const clone=value=>JSON.parse(JSON.stringify(value));
  const toast=(message,type='success')=>typeof window.toast==='function'&&window.toast(message,type);

  const DEPARTMENT_SEED=[
    ['group',null,'贵安发展集团','GAJT','company','active','MDM 同步','操作者','共享企业剩余可用额度','active',['张明远','李晓华'],['周凯'],['张明远','李晓华']],
    ['general','group','综合管理部','ZHGL','department','active','MDM 同步','下载者','共享企业剩余可用额度','active',['李晓华'],['王璐'],[]],
    ['finance','group','财务管理部','CWGL','department','active','MDM 同步','预览者','指定额度 300 GB','active',['陈敏'],['许欣'],[]],
    ['investment','group','投资发展部','TZFZ','department','active','MDM 同步','下载者','共享企业剩余可用额度','active',['赵敏'],['唐楠'],[]],
    ['research','group','研发中心','YFZX','department','active','本地维护','操作者','指定额度 600 GB','active',['张明远','周凯'],['许欣','刘浩'],[]],
    ['platform','research','平台研发组','PTYF','department','active','本地维护','操作者','继承上级策略','active',['周凯'],['刘浩'],[]],
    ['application','research','应用研发组','YYYF','department','active','本地维护','编辑者','继承上级策略','active',['刘浩'],['周凯'],[]],
    ['product','research','产品设计组','CPSJ','department','active','本地维护','编辑者','继承上级策略','active',['许欣'],['赵敏'],[]],
    ['construction','group','建设管理部','JSGL','department','active','MDM 同步','下载者','共享企业剩余可用额度','active',['刘洁'],['赵敏'],[]],
    ['siteA','construction','项目一部','XMYB','department','active','MDM 同步','下载者','继承上级策略','active',['李工'],['王璐'],[]],
    ['siteB','construction','项目二部','XMEB','department','active','MDM 同步','下载者','继承上级策略','active',['周工'],['赵敏'],[]],
    ['strategy','group','战略研究室','ZLYJ','department','active','本地维护','预览者','不分配空间','none',[],[],[]],
    ['operations','group','运营管理部','YYGL','department','disabled','MDM 同步','预览者','不分配空间','disabled',['唐楠'],['王璐'],[]]
  ].map((item,index)=>({
    id:item[0],parent:item[1],name:item[2],code:item[3],kind:item[4],status:item[5],source:item[6],
    permission:item[7],quota:item[8],library:item[9],managers:item[10],fileAdmins:item[11],subAdmins:item[12],
    updated:index<5?'今天 08:46':'昨天 17:20'
  }));

  const MEMBER_SEED=[
    ['u1','张明远','000001','技术开发岗','138 8512 3101','active',['research'],'research',['group']],
    ['u2','周凯','000018','技术开发岗','139 8512 1148','active',['research','platform'],'research',[]],
    ['u3','许欣','000026','产品设计岗','137 8512 5126','active',['research','product'],'research',[]],
    ['u4','刘浩','000037','技术开发岗','136 8512 8037','active',['research','application'],'research',[]],
    ['u5','赵敏','000045','产品设计岗','135 8512 2045','active',['research','investment'],'investment',[]],
    ['u6','王璐','000052','测试工程师','188 8512 9052','active',['research','general'],'research',[]],
    ['u7','陈强','000063','后端开发岗','187 8512 7063','active',['platform'],'platform',[]],
    ['u8','林悦','000071','交互设计岗','186 8512 3071','active',['product'],'product',[]],
    ['u9','李晓华','000082','综合管理岗','185 8512 8082','active',['general'],'general',['group']],
    ['u10','陈敏','000093','财务管理岗','184 8512 2093','active',['finance'],'finance',[]],
    ['u11','何清','000104','岗位待定','183 8512 6104','active',[],null,[]],
    ['u12','孙琳','000116','前端开发岗','182 8512 3116','active',[],null,[]],
    ['u13','郭辰','000127','测试工程师','181 8512 7127','disabled',['general'],'general',[]],
    ['u14','吴桐','000138','产品运营岗','180 8512 2138','active',['operations'],'operations',[]]
  ].map(item=>({
    id:item[0],name:item[1],no:item[2],job:item[3],phone:item[4],status:item[5],departments:item[6],primary:item[7],subScopes:item[8]
  }));

  function model(){
    const dm=state.dm||(state.dm={});
    if(!dm.depts)dm.depts=clone(DEPARTMENT_SEED);
    if(!dm.members)dm.members=clone(MEMBER_SEED);
    dm.selected=dm.selected||'research';
    dm.expanded=Array.isArray(dm.expanded)?dm.expanded:['group','research','construction'];
    dm.tab=dm.tab||'overview';
    dm.treeQuery=dm.treeQuery||'';
    dm.memberQuery=dm.memberQuery||'';
    dm.role=dm.role||'all';
    dm.status=dm.status||'all';
    dm.sort=Array.isArray(dm.sort)?dm.sort:['name','asc'];
    dm.page=dm.page||1;
    dm.pageSize=6;
    dm.dialog=dm.dialog||null;
    dm.treeMenu=dm.treeMenu||null;
    dm.memberMenu=dm.memberMenu||null;
    dm.filterMenu=dm.filterMenu||null;
    return dm;
  }

  const departments=()=>model().depts;
  const members=()=>model().members;
  const department=id=>departments().find(item=>item.id===id);
  const member=id=>members().find(item=>item.id===id);
  const children=id=>departments().filter(item=>item.parent===id);
  const descendants=id=>children(id).flatMap(item=>[item,...descendants(item.id)]);
  const directMembers=id=>id==='unassigned'?members().filter(item=>!item.departments.length):members().filter(item=>item.departments.includes(id));
  const scopeDepartmentIds=id=>[id,...descendants(id).map(item=>item.id)];
  const scopeMembers=id=>{
    const ids=new Set(scopeDepartmentIds(id));
    return members().filter(item=>item.departments.some(deptId=>ids.has(deptId)));
  };
  const currentDepartment=()=>model().selected==='unassigned'?null:department(model().selected);
  const avatarText=name=>esc(String(name||'成员').slice(0,1));

  function departmentPath(item){
    const names=[];
    let cursor=item;
    while(cursor){names.unshift(cursor.name);cursor=department(cursor.parent)}
    return names.join(' / ');
  }

  function depth(item){
    let value=0;
    let cursor=item;
    while(cursor&&cursor.parent){value++;cursor=department(cursor.parent)}
    return value;
  }

  function owningCompany(item){
    let cursor=item;
    while(cursor){if(cursor.kind==='company')return cursor;cursor=department(cursor.parent)}
    return null;
  }

  function memberRoles(item,dept){
    const roles=[];
    if(dept?.managers?.includes(item.name))roles.push('部门负责人');
    if(dept?.fileAdmins?.includes(item.name))roles.push('文件管理员');
    const company=dept?owningCompany(dept):null;
    if(company&&item.subScopes.includes(company.id))roles.push('分级管理员');
    return roles;
  }

  function injectStyles(){
    if(document.getElementById('department-console-v12-style'))return;
    const style=document.createElement('style');
    style.id='department-console-v12-style';
    style.textContent=`
body.admin-console-v2 .main{padding:20px 22px 28px!important;background:#fff!important;background-image:none!important}
.dp,.dp *{box-sizing:border-box}.dp [hidden]{display:none!important}.dp{min-height:calc(100vh - 112px);color:#27384a;background:#fff}.dp button,.dp input{font:inherit}.dp .icon-stack{width:18px;height:18px}
.dp-page-head{display:flex;align-items:flex-start;gap:16px;margin-bottom:16px}.dp-page-title{margin:0;color:#1f3245;font-size:24px;line-height:1.25;letter-spacing:-.02em}.dp-page-subtitle{margin:6px 0 0;color:#7e8c9b;font-size:12px}.dp-page-scope{margin-left:auto;display:inline-flex;align-items:center;min-height:30px;padding:0 10px;border:1px solid #d9e6f2;border-radius:8px;background:#fff;color:#58728c;font-size:11px}
.dp-toolbar{min-height:54px;display:flex;align-items:center;gap:10px;margin-bottom:16px;padding:8px 10px 8px 14px;border:1px solid #e1e8ef;border-radius:12px;background:#fff;box-shadow:0 5px 18px rgba(37,60,83,.045)}.dp-sync{display:flex;align-items:center;gap:9px;color:#718294;font-size:11px}.dp-sync-dot{width:8px;height:8px;border:2px solid #d9eaff;border-radius:50%;background:#1769ff}.dp-spacer{flex:1}
.dp-btn{height:38px;display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:0 13px;border:1px solid #d8e2ec;border-radius:9px;background:#fff;color:#39566f;cursor:pointer;transition:border-color .16s,background .16s,color .16s}.dp-btn:hover:not(:disabled){border-color:#a8c9ed;background:#f7fbff;color:#1769ff}.dp-btn.primary{border-color:#1769ff;background:#1769ff;color:#fff}.dp-btn.primary:hover:not(:disabled){border-color:#0756d6;background:#0756d6;color:#fff}.dp-btn.ghost{border-color:transparent;background:transparent}.dp-btn.text{height:auto;padding:0;border:0;background:transparent;color:#1769ff}.dp-btn.icon{width:38px;padding:0}.dp-btn.small{height:32px;padding:0 10px;font-size:11px}.dp-btn.risk{border-color:#efcfd2;color:#b64a54}.dp-btn.risk:hover:not(:disabled){border-color:#e6aeb4;background:#fff7f8;color:#b43b48}.dp-btn:disabled{opacity:.45;cursor:not-allowed}
.dp-workspace{height:calc(100vh - 196px);min-height:600px;display:grid;grid-template-columns:318px minmax(0,1fr);gap:16px}.dp-surface{min-height:0;border:1px solid #e0e8f0;border-radius:14px;background:#fff;box-shadow:0 8px 24px rgba(35,58,82,.045)}
.dp-tree{display:flex;flex-direction:column;overflow:hidden}.dp-tree-head{padding:16px 14px 14px;border-bottom:1px solid #edf1f5}.dp-panel-title{display:flex;align-items:center;gap:8px;color:#2b4258;font-size:14px;font-weight:700}.dp-panel-title .icon-stack{color:#47789f}.dp-panel-meta{margin-left:auto;color:#98a4b0;font-size:10px;font-weight:500}.dp-tree-tools{display:flex;gap:8px;margin-top:14px}.dp-search{height:38px;min-width:0;display:flex;align-items:center;gap:8px;padding:0 11px;border:1px solid #dce5ee;border-radius:9px;background:#fff;color:#7890a5}.dp-search:focus-within,.dp-input:focus,.dp-select.open .dp-select-trigger,.dp-picker[open]{border-color:#9cc3ef;box-shadow:0 0 0 3px rgba(23,105,255,.06)}.dp-search input{width:100%;min-width:0;border:0;outline:0;background:transparent;color:#314c65;font-size:12px}.dp-tree-scroll{flex:1;min-height:0;overflow:auto;padding:10px 9px 18px}.dp-tree-section{padding:9px 9px 7px;color:#9aa6b2;font-size:10px;font-weight:650}.dp-tree-node{position:relative}.dp-tree-row{height:42px;display:flex;align-items:center;margin:1px 0;padding:0 5px;border:1px solid transparent;border-radius:9px;color:#466079}.dp-tree-row:hover{background:#f7fafc}.dp-tree-row.active{border-color:#c7ddf6;background:#edf6ff;color:#1769ff;box-shadow:inset 3px 0 #1769ff}.dp-tree-row.company{font-weight:650}.dp-tree-toggle,.dp-tree-more{width:28px;height:30px;display:grid;place-items:center;flex:0 0 28px;border:0;border-radius:7px;background:transparent;color:#7a8ea1;cursor:pointer}.dp-tree-toggle:hover,.dp-tree-more:hover{background:#eaf3fc;color:#1769ff}.dp-tree-toggle.empty{visibility:hidden}.dp-tree-toggle.closed .icon-stack{transform:rotate(-90deg)}.dp-tree-pick{height:40px;min-width:0;flex:1;display:flex;align-items:center;gap:9px;padding:0 4px;border:0;background:transparent;color:inherit;text-align:left;cursor:pointer}.dp-tree-pick>.icon-stack{width:17px;height:17px;color:#6285a4}.dp-tree-row.active .dp-tree-pick>.icon-stack{color:#1769ff}.dp-tree-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px}.dp-tree-status{width:7px;height:7px;flex:0 0 7px;border-radius:50%;background:#c97b83}.dp-tree-children{position:relative;margin-left:16px;padding-left:13px;border-left:1px solid #dbe6f0}.dp-tree-children.closed{display:none}.dp-tree-footer{margin:10px 9px 0;padding:11px 12px;border:1px solid #e5ebf1;border-radius:10px;background:#fafbfd;color:#798a9b;font-size:10px;line-height:1.55}
.dp-pop{position:absolute;right:4px;top:38px;z-index:180;width:218px;padding:7px;border:1px solid #d8e2ec;border-radius:11px;background:#fff;box-shadow:0 18px 46px rgba(26,51,77,.16)}.dp-pop button{width:100%;height:42px;display:flex;align-items:center;gap:9px;padding:0 8px;border:0;border-radius:8px;background:#fff;color:#425f79;text-align:left;font-size:12px;cursor:pointer}.dp-pop button>.icon-stack{width:30px;height:30px;display:grid;place-items:center;border-radius:8px;background:#f1f5f8;color:#5f7890}.dp-pop button:hover{background:#f7fafc;color:#1769ff}.dp-pop button:hover>.icon-stack{background:#e8f2fc;color:#1769ff}.dp-pop button.risk{color:#b14b55}.dp-pop button.risk>.icon-stack{background:#fff1f2;color:#c55560}.dp-pop button:disabled{color:#aab4be;cursor:not-allowed}.dp-pop button:disabled>.icon-stack{background:#f5f6f7;color:#b5bdc5}.dp-pop-sep{height:1px;margin:5px 4px;background:#edf1f5}
.dp-detail{display:flex;flex-direction:column;overflow:hidden}.dp-hero{padding:20px 20px 0}.dp-hero-main{display:flex;align-items:flex-start;gap:13px}.dp-hero-icon{width:44px;height:44px;display:grid;place-items:center;flex:0 0 44px;border:1px solid #d3e5f8;border-radius:12px;background:#f2f8ff;color:#1769ff}.dp-hero-icon .icon-stack{width:21px;height:21px}.dp-hero-copy{min-width:0}.dp-hero-copy h2{margin:0;color:#22384d;font-size:20px;line-height:1.3}.dp-hero-path{margin:4px 0 0;overflow:hidden;color:#8a98a7;font-size:11px;text-overflow:ellipsis;white-space:nowrap}.dp-hero-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}.dp-chip{display:inline-flex;align-items:center;min-height:24px;padding:0 8px;border:1px solid #dfe7ee;border-radius:7px;background:#fff;color:#708092;font-size:10px}.dp-chip.blue{border-color:#c9def6;background:#f3f8fe;color:#1769ff}.dp-chip.success{border-color:#cee6d7;background:#f6fbf7;color:#3c7b57}.dp-chip.off{border-color:#ead5d7;background:#fff8f8;color:#a6565e}.dp-hero-actions{margin-left:auto;display:flex;gap:8px}.dp-summary{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));margin-top:18px;border-top:1px solid #edf1f5}.dp-summary-item{min-width:0;padding:13px 14px 14px 0}.dp-summary-item+.dp-summary-item{padding-left:14px;border-left:1px solid #edf1f5}.dp-summary-item label{display:block;color:#98a5b1;font-size:10px}.dp-summary-item strong{display:block;margin-top:5px;overflow:hidden;color:#304b64;font-size:13px;font-weight:650;text-overflow:ellipsis;white-space:nowrap}.dp-tabs{height:52px;display:flex;gap:26px;padding:0 20px;border-top:1px solid #edf1f5;border-bottom:1px solid #e8edf2}.dp-tabs button{height:52px;position:relative;padding:0;border:0;background:transparent;color:#718295;font-size:13px;cursor:pointer}.dp-tabs button.active{color:#1769ff;font-weight:700}.dp-tabs button.active:after{content:'';position:absolute;left:0;right:0;bottom:-1px;height:2px;border-radius:2px;background:#1769ff}.dp-detail-body{flex:1;min-height:0;overflow:auto;padding:16px 18px 22px;background:#fff}
.dp-overview{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:16px}.dp-stack{display:grid;align-content:start;gap:16px}.dp-card{border:1px solid #e1e8ef;border-radius:12px;background:#fff}.dp-card-head{min-height:48px;display:flex;align-items:center;gap:8px;padding:0 15px;border-bottom:1px solid #edf1f5;color:#344d65;font-size:13px;font-weight:700}.dp-card-body{padding:15px}.dp-definition{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:26px}.dp-definition-item{min-height:62px;padding:10px 0;border-bottom:1px solid #f0f3f6}.dp-definition-item label{display:block;color:#9aa6b1;font-size:10px}.dp-definition-item span{display:block;margin-top:6px;color:#3a536b;font-size:12px}.dp-role-group+.dp-role-group{margin-top:18px;padding-top:18px;border-top:1px solid #eef2f5}.dp-role-title{display:flex;align-items:center;color:#536b82;font-size:12px;font-weight:650}.dp-role-title small{margin-left:auto;color:#9aa6b1;font-size:10px;font-weight:500}.dp-person-list{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}.dp-person{display:inline-flex;align-items:center;gap:7px;min-height:32px;padding:3px 9px 3px 4px;border:1px solid #dce6ef;border-radius:9px;background:#fff;color:#3f5d78;font-size:11px}.dp-avatar{width:30px;height:30px;display:grid;place-items:center;flex:0 0 30px;border:1px solid #c8def7;border-radius:50%;background:#edf6ff;color:#1769ff;font-size:11px;font-weight:700;line-height:1;text-align:center;overflow:hidden}.dp-person .dp-avatar{width:24px;height:24px;flex-basis:24px;font-size:9px}.dp-muted{color:#9aa6b2;font-size:11px}.dp-note{padding:11px 12px;border:1px solid #e2e9ef;border-radius:10px;background:#fafbfd;color:#718294;font-size:11px;line-height:1.65}.dp-note.blue{border-color:#d6e7f8;background:#f7fbff}.dp-note.warn{border-color:#ead9bb;background:#fffaf2;color:#86652f}.dp-note.risk{border-color:#efcfd2;background:#fff8f8;color:#9e4c55}.dp-library{display:flex;align-items:center;gap:12px;padding:13px;border:1px solid #e4eaf0;border-radius:10px;background:#fff}.dp-library-icon{width:38px;height:38px;display:grid;place-items:center;border-radius:10px;background:#f1f5f8;color:#55758f}.dp-library-copy{min-width:0}.dp-library-copy strong,.dp-library-copy span{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dp-library-copy strong{color:#334e67;font-size:12px}.dp-library-copy span{margin-top:4px;color:#95a2ae;font-size:10px}.dp-child-list{display:grid;gap:8px}.dp-child-row{min-height:52px;display:grid;grid-template-columns:minmax(160px,1fr) 90px 80px 130px 54px;align-items:center;gap:12px;padding:8px 12px;border:1px solid #e4eaf0;border-radius:10px;color:#597087;font-size:11px}.dp-child-name{display:flex;align-items:center;gap:8px;min-width:0;color:#38536d;font-weight:650}.dp-child-name span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dp-members{border:1px solid #e1e8ef;border-radius:12px;background:#fff;overflow:visible}.dp-members-toolbar{min-height:58px;display:flex;align-items:center;gap:9px;padding:9px 12px;border-bottom:1px solid #e8edf2}.dp-members-toolbar strong{color:#344d65;font-size:13px}.dp-members-toolbar .dp-search{width:270px;flex:none}.dp-filter{position:relative}.dp-filter>.dp-btn{min-width:108px;justify-content:space-between}.dp-filter-panel{position:absolute;right:0;top:44px;z-index:140;width:164px;padding:6px;border:1px solid #d8e2ec;border-radius:10px;background:#fff;box-shadow:0 16px 38px rgba(29,52,77,.15)}.dp-filter-panel button{width:100%;height:36px;padding:0 10px;border:0;border-radius:7px;background:#fff;color:#4b657d;text-align:left;font-size:11px}.dp-filter-panel button:hover,.dp-filter-panel button.active{background:#eef6ff;color:#1769ff}.dp-table-wrap{overflow:auto}.dp-table{width:100%;min-width:880px;border-collapse:collapse;table-layout:fixed}.dp-table th{height:42px;padding:0 13px;border-bottom:1px solid #e8edf2;background:#fafbfd;color:#8b99a7;font-size:10px;font-weight:600;text-align:left}.dp-table th button{padding:0;border:0;background:transparent;color:inherit;cursor:pointer}.dp-table td{height:66px;padding:8px 13px;border-bottom:1px solid #eef2f5;color:#50687f;font-size:11px;vertical-align:middle}.dp-table tbody tr:hover td{background:#fbfdff}.dp-member-cell{display:flex;align-items:center;gap:10px;min-width:0}.dp-member-copy{min-width:0}.dp-member-copy strong,.dp-member-copy small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dp-member-copy strong{color:#334d65;font-size:12px}.dp-member-copy small{margin-top:4px;color:#98a4b0;font-size:10px}.dp-role-tags{display:flex;flex-wrap:wrap;gap:5px}.dp-role-tag{display:inline-flex;align-items:center;min-height:24px;padding:0 7px;border:1px solid #d9e5f1;border-radius:7px;background:#f7fafc;color:#58728c;font-size:10px}.dp-status{display:inline-flex;align-items:center;gap:7px;color:#557087}.dp-status:before{content:'';width:7px;height:7px;border-radius:50%;background:#4a9a69}.dp-status.off:before{background:#bd7078}.dp-pagination{min-height:50px;display:flex;align-items:center;gap:6px;padding:8px 12px;color:#8493a1;font-size:10px}.dp-page{width:32px;height:32px;border:1px solid #dce5ee;border-radius:8px;background:#fff;color:#547087}.dp-page.active{border-color:#a9cbed;background:#eef6ff;color:#1769ff}.dp-page:disabled{opacity:.4}.dp-empty{min-height:280px;display:grid;place-items:center;align-content:center;gap:8px;color:#96a3af;text-align:center}.dp-empty>.icon-stack{width:28px;height:28px}.dp-empty strong{color:#65798c;font-size:13px}.dp-empty p{margin:0;font-size:10px}
.dp-modal-mask{position:fixed;inset:0;z-index:2800;display:grid;place-items:center;padding:22px;background:rgba(27,43,60,.38)}.dp-modal{width:min(720px,calc(100vw - 36px));max-height:calc(100vh - 44px);display:flex;flex-direction:column;border:1px solid #d8e1ea;border-radius:15px;background:#fff;box-shadow:0 28px 80px rgba(19,40,63,.23);overflow:hidden}.dp-modal.medium{width:min(620px,calc(100vw - 36px))}.dp-modal.small{width:min(500px,calc(100vw - 36px))}.dp-modal-head{min-height:58px;display:flex;align-items:center;padding:0 18px;border-bottom:1px solid #e8edf2;color:#2c445b;font-size:15px;font-weight:700}.dp-modal-body{overflow:auto;padding:18px}.dp-modal-foot{min-height:64px;display:flex;justify-content:flex-end;align-items:center;gap:9px;padding:11px 18px;border-top:1px solid #e8edf2;background:#fff}.dp-form{display:grid;gap:16px}.dp-form-row{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.dp-field{display:grid;gap:7px;color:#536b82;font-size:11px}.dp-field-label{display:flex;align-items:center;gap:4px;color:#536b82;font-size:11px}.dp-required{color:#c8545e}.dp-input{width:100%;height:40px;padding:0 11px;border:1px solid #d8e2eb;border-radius:9px;background:#fff;color:#314d67;outline:0;font-size:12px}.dp-help{margin:0;color:#98a4af;font-size:10px;line-height:1.55}.dp-select{position:relative}.dp-select-trigger{width:100%;height:40px;display:flex;align-items:center;justify-content:space-between;padding:0 11px;border:1px solid #d8e2eb;border-radius:9px;background:#fff;color:#3d5870;text-align:left;font-size:12px;cursor:pointer}.dp-select-panel{display:none;position:absolute;left:0;right:0;top:46px;z-index:210;max-height:252px;overflow:auto;padding:6px;border:1px solid #d5e0ea;border-radius:11px;background:#fff;box-shadow:0 18px 42px rgba(25,49,74,.16)}.dp-select.open .dp-select-panel{display:block}.dp-option{width:100%;min-height:38px;display:flex;align-items:center;gap:8px;padding:7px 10px;border:0;border-radius:8px;background:#fff;color:#49647c;text-align:left;font-size:11px;cursor:pointer}.dp-option:hover,.dp-option.selected{background:#eef6ff;color:#1769ff}.dp-option:disabled{color:#b1bbc4;cursor:not-allowed}.dp-option small{margin-left:auto;color:#9ba7b2}.dp-picker{border:1px solid #dbe4ec;border-radius:10px;background:#fff}.dp-picker>summary{min-height:42px;display:flex;align-items:center;gap:8px;padding:8px 10px;list-style:none;cursor:pointer}.dp-picker>summary::-webkit-details-marker{display:none}.dp-picker-summary{min-width:0;flex:1;display:flex;flex-wrap:wrap;gap:6px}.dp-picker-placeholder{color:#98a4b0}.dp-picker-count{color:#7d8d9d;font-size:10px}.dp-picker-panel{padding:10px;border-top:1px solid #edf1f4;background:#fbfcfd}.dp-picker-search{margin-bottom:8px}.dp-picker-list{max-height:214px;overflow:auto;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}.dp-person-choice{min-height:46px;display:flex;align-items:center;gap:8px;padding:6px 8px;border:1px solid #e0e7ed;border-radius:9px;background:#fff;color:#526b82;text-align:left;cursor:pointer}.dp-person-choice.selected{border-color:#a9cbed;background:#eef6ff;color:#1769ff}.dp-person-choice-copy{min-width:0}.dp-person-choice-copy strong,.dp-person-choice-copy small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dp-person-choice-copy strong{font-size:11px}.dp-person-choice-copy small{margin-top:3px;color:#96a3af;font-size:9px}.dp-check-mark{margin-left:auto;width:17px;height:17px;display:grid;place-items:center;border:1px solid #cbd7e1;border-radius:5px;color:transparent}.dp-person-choice.selected .dp-check-mark{border-color:#1769ff;background:#1769ff;color:#fff}.dp-switch{display:flex;align-items:flex-start;gap:10px;padding:12px;border:1px solid #e0e7ee;border-radius:10px}.dp-switch input{position:absolute;opacity:0}.dp-switch-control{width:34px;height:20px;position:relative;flex:0 0 34px;border-radius:12px;background:#cbd6e0}.dp-switch-control:after{content:'';position:absolute;left:3px;top:3px;width:14px;height:14px;border-radius:50%;background:#fff;transition:left .15s}.dp-switch input:checked+.dp-switch-control{background:#1769ff}.dp-switch input:checked+.dp-switch-control:after{left:17px}.dp-switch strong,.dp-switch small{display:block}.dp-switch strong{color:#3c566e;font-size:11px}.dp-switch small{margin-top:4px;color:#94a1ad;font-size:10px;line-height:1.5}.dp-impact{display:grid;gap:8px;margin-top:14px}.dp-impact-row{padding:10px 11px;border:1px solid #e1e8ee;border-radius:9px;color:#60798f;font-size:11px}.dp-impact-row.block{border-color:#efcfd2;background:#fff8f8;color:#a24d57}.dp-impact-row.ok{border-color:#d4e7da;background:#f8fcf9;color:#46785a}.dp-candidate-list{display:grid;gap:7px;max-height:310px;overflow:auto}.dp-candidate{min-height:56px;display:flex;align-items:center;gap:10px;padding:8px 10px;border:1px solid #e0e7ee;border-radius:10px;background:#fff;color:#4d667e;text-align:left;cursor:pointer}.dp-candidate.selected{border-color:#a6caef;background:#eef6ff}.dp-radio{width:17px;height:17px;flex:0 0 17px;border:1px solid #c4d1dc;border-radius:50%}.dp-candidate.selected .dp-radio{border:5px solid #1769ff}.dp-candidate-copy{min-width:0}.dp-candidate-copy strong,.dp-candidate-copy small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dp-candidate-copy strong{color:#3b566e;font-size:11px}.dp-candidate-copy small{margin-top:4px;color:#96a3af;font-size:10px}
@media(max-width:1240px){.dp-workspace{grid-template-columns:285px minmax(0,1fr)}.dp-overview{grid-template-columns:1fr}.dp-summary{grid-template-columns:repeat(3,minmax(0,1fr))}.dp-summary-item:nth-child(4){border-left:0;padding-left:0}.dp-picker-list{grid-template-columns:1fr}}
`;
    document.head.appendChild(style);
  }

  function button(label,action,className=''){
    return `<button class="dp-btn ${className}" onclick="${action}">${label}</button>`;
  }

  function renderPageHeader(){
    return `<div class="dp-page-head"><div><h1 class="dp-page-title">部门管理</h1><p class="dp-page-subtitle">维护公司与部门层级、成员归属、管理身份和部门公共资料库</p></div><span class="dp-page-scope">当前范围：贵安发展集团及全部下级组织</span></div>`;
  }

  function renderToolbar(){
    const selected=model().selected==='unassigned'?'group':model().selected;
    return `<div class="dp-toolbar"><span class="dp-sync"><i class="dp-sync-dot"></i>组织数据正常 · 最近同步 今天 08:46</span><span class="dp-spacer"></span>${button(icon('transfer')+'同步组织',"dmOpen('sync')")}${button(icon('plus')+'新建部门',`dmOpen('create',{parentId:'${selected}'})`,'primary')}</div>`;
  }

  function treeMatches(item,query){
    if(!query)return true;
    const text=[item.name,item.code,...descendants(item.id).map(child=>child.name)].join(' ').toLowerCase();
    return text.includes(query);
  }

  function renderTreeMenu(item){
    if(model().treeMenu!==item.id)return '';
    const companyRoot=item.kind==='company'&&!item.parent;
    return `<div class="dp-pop" onclick="event.stopPropagation()">
      <button onclick="dmOpen('create',{parentId:'${item.id}'})">${icon('plus')}<span>新建下级部门</span></button>
      <button onclick="dmOpen('edit')">${icon('edit')}<span>编辑组织信息</span></button>
      ${item.kind==='department'?`<button onclick="dmOpen('move')">${icon('move')}<span>调整上级部门</span></button>`:`<button ${companyRoot?'disabled':''} onclick="dmOpen('move')">${icon('move')}<span>${companyRoot?'根公司不可移动':'调整上级组织'}</span></button>`}
      <div class="dp-pop-sep"></div>
      <button onclick="dmOpen('status')">${icon(item.status==='active'?'lock':'check')}<span>${item.status==='active'?'停用当前节点':'启用当前节点'}</span></button>
      ${item.kind==='department'?`<button class="risk" onclick="dmOpen('delete')">${icon('trash')}<span>组织裁撤</span></button>`:`<button disabled>${icon('trash')}<span>公司节点不可直接裁撤</span></button>`}
    </div>`;
  }

  function renderTreeNode(item){
    const query=model().treeQuery.trim().toLowerCase();
    if(!treeMatches(item,query))return '';
    const childNodes=children(item.id).filter(child=>treeMatches(child,query));
    const expanded=Boolean(query)||model().expanded.includes(item.id);
    const selected=model().selected===item.id;
    return `<div class="dp-tree-node"><div class="dp-tree-row ${item.kind==='company'?'company':''} ${selected?'active':''}">
      <button class="dp-tree-toggle ${childNodes.length?'':'empty'} ${expanded?'':'closed'}" title="${expanded?'收起':'展开'}" onclick="event.stopPropagation();dmToggleNode('${item.id}')">${childNodes.length?icon('down'):''}</button>
      <button class="dp-tree-pick" onclick="dmSelect('${item.id}')">${icon(item.kind==='company'?'building':'folder')}<span class="dp-tree-name">${esc(item.name)}</span>${item.status==='disabled'?'<i class="dp-tree-status" title="已停用"></i>':''}</button>
      <button class="dp-tree-more" title="更多操作" onclick="event.stopPropagation();dmTreeMenu('${item.id}')">${icon('more')}</button>
      ${renderTreeMenu(item)}
    </div>${childNodes.length?`<div class="dp-tree-children ${expanded?'':'closed'}">${childNodes.map(renderTreeNode).join('')}</div>`:''}</div>`;
  }

  function renderTree(){
    const roots=departments().filter(item=>!item.parent);
    const selected=model().selected==='unassigned'?null:department(model().selected);
    const summary=selected?`${selected.kind==='company'?'公司节点':'普通部门'} · ${children(selected.id).length} 个直属下级 · ${directMembers(selected.id).length} 名直属成员`:`虚拟节点 · ${directMembers('unassigned').length} 名待分配成员`;
    return `<aside class="dp-surface dp-tree"><div class="dp-tree-head"><div class="dp-panel-title">${icon('building')}组织架构<span class="dp-panel-meta">${departments().length} 个正式节点</span></div><div class="dp-tree-tools"><label class="dp-search">${icon('search')}<input value="${esc(model().treeQuery)}" placeholder="搜索部门名称或编码" oninput="dmTreeSearch(this.value)"></label><button class="dp-btn icon" title="展开或收起全部" onclick="dmToggleAll()">${icon('down')}</button></div></div><div class="dp-tree-scroll"><div class="dp-tree-section">公司与部门</div>${roots.map(renderTreeNode).join('')||'<div class="dp-empty"><strong>未找到组织节点</strong></div>'}<div class="dp-tree-section">特殊节点</div><div class="dp-tree-row ${model().selected==='unassigned'?'active':''}"><span class="dp-tree-toggle empty"></span><button class="dp-tree-pick" onclick="dmSelect('unassigned')">${icon('users')}<span class="dp-tree-name">待分配人员池</span></button></div><div class="dp-tree-footer">当前选中：${esc(model().selected==='unassigned'?'待分配人员池':selected?.name||'未选择')}<br>${esc(summary)}</div></div></aside>`;
  }

  function people(items,emptyText){
    if(!items?.length)return `<span class="dp-muted">${esc(emptyText)}</span>`;
    return `<div class="dp-person-list">${items.map(name=>`<span class="dp-person"><i class="dp-avatar">${avatarText(name)}</i>${esc(name)}</span>`).join('')}</div>`;
  }

  function summaryItems(item){
    if(!item)return `<div class="dp-summary"><div class="dp-summary-item"><label>节点性质</label><strong>虚拟人员池</strong></div><div class="dp-summary-item"><label>待分配成员</label><strong>${directMembers('unassigned').length} 人</strong></div></div>`;
    return `<div class="dp-summary">
      <div class="dp-summary-item"><label>部门编码</label><strong>${esc(item.code)}</strong></div>
      <div class="dp-summary-item"><label>上级组织</label><strong>${esc(department(item.parent)?.name||'无')}</strong></div>
      <div class="dp-summary-item"><label>${item.kind==='company'?'范围成员':'部门成员'}</label><strong>${item.kind==='company'?scopeMembers(item.id).length:directMembers(item.id).length} 人</strong></div>
      <div class="dp-summary-item"><label>直属下级</label><strong>${children(item.id).length} 个</strong></div>
      <div class="dp-summary-item"><label>公共资料库</label><strong>${item.library==='none'?'未创建':item.library==='disabled'?'访问暂停':'已启用'}</strong></div>
    </div>`;
  }

  function renderHero(item){
    const virtual=!item;
    return `<div class="dp-hero"><div class="dp-hero-main"><span class="dp-hero-icon">${icon(virtual?'users':item.kind==='company'?'building':'folder')}</span><div class="dp-hero-copy"><h2>${esc(virtual?'待分配人员池':item.name)}</h2><p class="dp-hero-path">${esc(virtual?'系统虚拟节点，不参与正式组织变更':departmentPath(item))}</p><div class="dp-hero-tags">${virtual?'<span class="dp-chip blue">特殊节点</span>':`<span class="dp-chip ${item.status==='active'?'success':'off'}">${item.status==='active'?'已启用':'已停用'}</span><span class="dp-chip blue">${item.kind==='company'?'公司节点':'普通部门'}</span><span class="dp-chip">${esc(item.source)}</span>`}</div></div>${virtual?'':`<div class="dp-hero-actions">${button(icon('edit')+'编辑',"dmOpen('edit')")}${item.kind==='department'?button(icon('move')+'移动',"dmOpen('move')"):''}<span style="position:relative"><button class="dp-btn icon" title="更多操作" onclick="event.stopPropagation();dmHeaderMenu(event)">${icon('more')}</button></span></div>`}</div>${summaryItems(item)}</div>`;
  }

  function renderOverview(item){
    if(!item)return `<div class="dp-card"><div class="dp-card-head">待分配人员池说明</div><div class="dp-card-body"><div class="dp-note blue">该节点用于收纳已进入租户但尚未挂载正式部门的成员。成员分配到普通部门后，才会获得对应部门公共资料库的默认访问权限。</div></div></div>`;
    const scopedAdmins=owningCompany(item)?.subAdmins||[];
    return `<div class="dp-overview"><div class="dp-stack"><section class="dp-card"><div class="dp-card-head">部门信息<span class="dp-spacer"></span><button class="dp-btn text" onclick="dmOpen('edit')">编辑</button></div><div class="dp-card-body"><div class="dp-definition">${[
      ['节点类型',item.kind==='company'?'公司节点':'普通部门'],['上级组织',department(item.parent)?.name||'无'],['数据来源',item.source],['最近更新',item.updated],['空间策略',item.quota],['公共资料库成员权限',item.permission]
    ].map(row=>`<div class="dp-definition-item"><label>${row[0]}</label><span>${esc(row[1])}</span></div>`).join('')}</div></div></section><section class="dp-card"><div class="dp-card-head">部门公共资料库</div><div class="dp-card-body">${item.library==='none'?'<div class="dp-note">创建部门时选择了“暂不创建”。企业空间中的普通文件夹继续按独立权限管理。</div>':`<div class="dp-library"><span class="dp-library-icon">${icon('folder')}</span><div class="dp-library-copy"><strong>${esc(item.name)}公共资料库</strong><span>企业空间 / 部门公共资料库 / ${esc(item.name)}</span></div><span class="dp-spacer"></span><span class="dp-chip ${item.library==='disabled'?'off':'blue'}">${item.library==='disabled'?'普通成员暂停访问':'部门成员可访问'}</span></div><div class="dp-note blue" style="margin-top:10px">负责人和文件管理员拥有治理权限；成员归属变化会重新计算访问权限。负责人变更不会自动转移文件所有权。</div>`}</div></section><section class="dp-card"><div class="dp-card-head">直属下级部门<span class="dp-spacer"></span><button class="dp-btn text" onclick="dmTab('children')">查看全部</button></div><div class="dp-card-body"><div class="dp-child-list">${children(item.id).slice(0,4).map(child=>`<div class="dp-child-row"><div class="dp-child-name">${icon('folder')}<span>${esc(child.name)}</span></div><span>${esc(child.code)}</span><span>${directMembers(child.id).length} 人</span><span>${esc(child.managers[0]||'未设置负责人')}</span><button class="dp-btn text" onclick="dmSelect('${child.id}')">查看</button></div>`).join('')||'<span class="dp-muted">当前没有直属下级部门</span>'}</div></div></section></div><aside class="dp-stack"><section class="dp-card"><div class="dp-card-head">管理身份<span class="dp-spacer"></span><button class="dp-btn text" onclick="dmOpen('roles')">调整</button></div><div class="dp-card-body"><div class="dp-role-group"><div class="dp-role-title">部门负责人<small>${item.managers.length} 人</small></div>${people(item.managers,'暂未设置负责人')}</div><div class="dp-role-group"><div class="dp-role-title">文件管理员<small>${item.fileAdmins.length} 人</small></div>${people(item.fileAdmins,'暂未设置文件管理员')}</div><div class="dp-role-group"><div class="dp-role-title">${item.kind==='company'?'分级管理员':'覆盖当前部门的分级管理员'}<small>只读</small></div>${people(scopedAdmins,'当前范围未关联分级管理员')}</div><div class="dp-note" style="margin-top:16px">三类身份来自不同授权关系，互不自动转换。</div></div></section><section class="dp-card"><div class="dp-card-head">权限联动</div><div class="dp-card-body"><div class="dp-role-group"><div class="dp-role-title">成员默认权限</div><div class="dp-person-list"><span class="dp-chip blue">${esc(item.permission)}</span></div></div><div class="dp-role-group"><div class="dp-role-title">组织状态</div><div class="dp-note ${item.status==='active'?'blue':'warn'}">${item.status==='active'?'成员可按部门关系访问公共资料库。':'普通成员的部门资料库访问已暂停，授权管理员仍可治理历史资料。'}</div></div></div></section></aside></div>`;
  }

  function filterPanel(key,label,options){
    const opened=model().filterMenu===key;
    return `<div class="dp-filter"><button class="dp-btn" onclick="event.stopPropagation();dmFilterOpen('${key}')"><span>${esc(label)}</span>${icon('down')}</button>${opened?`<div class="dp-filter-panel" onclick="event.stopPropagation()">${options.map(option=>`<button class="${model()[key]===option[0]?'active':''}" onclick="dmSetFilter('${key}','${option[0]}')">${option[1]}</button>`).join('')}</div>`:''}</div>`;
  }

  function memberRowsFor(item){
    let rows=item?.kind==='company'?scopeMembers(item.id):item?directMembers(item.id):directMembers('unassigned');
    const query=model().memberQuery.trim().toLowerCase();
    if(query)rows=rows.filter(person=>`${person.name} ${person.no} ${person.job} ${person.phone}`.toLowerCase().includes(query));
    if(model().status!=='all')rows=rows.filter(person=>person.status===model().status);
    if(model().role!=='all')rows=rows.filter(person=>{
      const roles=item?memberRoles(person,item):[];
      return model().role==='member'?roles.length===0:roles.includes(model().role);
    });
    const [field,direction]=model().sort;
    return [...rows].sort((a,b)=>String(a[field]||'').localeCompare(String(b[field]||''),'zh-CN')*(direction==='asc'?1:-1));
  }

  function renderMemberMenu(person,item){
    if(model().memberMenu!==person.id)return '';
    if(!item)return `<div class="dp-pop"><button onclick="dmOpen('assign',{memberId:'${person.id}'})">${icon('move')}<span>分配到部门</span></button></div>`;
    if(item.kind==='company')return `<div class="dp-pop"><button disabled>${icon('info')}<span>请进入普通部门维护归属</span></button></div>`;
    return `<div class="dp-pop"><button onclick="dmOpen('memberRole',{memberId:'${person.id}'})">${icon('shield')}<span>设置部门身份</span></button><button onclick="dmOpen('transfer',{memberId:'${person.id}'})">${icon('move')}<span>转移到其他部门</span></button><div class="dp-pop-sep"></div><button class="risk" onclick="dmOpen('remove',{memberId:'${person.id}'})">${icon('x')}<span>移出当前部门</span></button></div>`;
  }

  function renderMembers(item){
    const allRows=memberRowsFor(item);
    const pages=Math.max(1,Math.ceil(allRows.length/model().pageSize));
    model().page=Math.min(model().page,pages);
    const rows=allRows.slice((model().page-1)*model().pageSize,model().page*model().pageSize);
    const roleOptions=[['all','全部身份'],['部门负责人','部门负责人'],['文件管理员','文件管理员'],['分级管理员','分级管理员'],['member','普通成员']];
    const statusOptions=[['all','全部状态'],['active','正常'],['disabled','停用']];
    const roleLabel=roleOptions.find(option=>option[0]===model().role)?.[1]||'全部身份';
    const statusLabel=statusOptions.find(option=>option[0]===model().status)?.[1]||'全部状态';
    const title=!item?'待分配成员':item.kind==='company'?'范围成员':'部门成员';
    const action=!item?'<span class="dp-muted">通过成员“更多”菜单完成分配</span>':item.kind==='company'?'<span class="dp-muted">公司节点只展示范围成员，请进入普通部门维护归属</span>':button(icon('plus')+'添加成员',"dmOpen('add')",'primary');
    return `<section class="dp-members"><div class="dp-members-toolbar"><strong>${title}</strong><label class="dp-search">${icon('search')}<input value="${esc(model().memberQuery)}" placeholder="搜索姓名、工号、岗位或手机号" oninput="dmMemberSearch(this.value)"></label>${filterPanel('role',roleLabel,roleOptions)}${filterPanel('status',statusLabel,statusOptions)}<span class="dp-spacer"></span>${action}</div>${rows.length?`<div class="dp-table-wrap"><table class="dp-table"><colgroup><col style="width:21%"><col style="width:14%"><col style="width:15%"><col style="width:14%"><col style="width:21%"><col style="width:9%"><col style="width:6%"></colgroup><thead><tr><th><button onclick="dmSort('name')">成员 ${model().sort[0]==='name'?(model().sort[1]==='asc'?'↑':'↓'):''}</button></th><th><button onclick="dmSort('job')">岗位 ${model().sort[0]==='job'?(model().sort[1]==='asc'?'↑':'↓'):''}</button></th><th>手机号</th><th>主部门</th><th>管理身份</th><th>状态</th><th>操作</th></tr></thead><tbody>${rows.map(person=>{
      const roles=item?memberRoles(person,item):[];
      return `<tr><td><div class="dp-member-cell"><span class="dp-avatar">${avatarText(person.name)}</span><div class="dp-member-copy"><strong>${esc(person.name)}</strong><small>工号 ${esc(person.no)}</small></div></div></td><td>${esc(person.job)}</td><td>${esc(person.phone)}</td><td>${esc(department(person.primary)?.name||'待分配')}</td><td><div class="dp-role-tags">${roles.length?roles.map(role=>`<span class="dp-role-tag">${role}</span>`).join(''):'<span class="dp-role-tag">普通成员</span>'}</div></td><td><span class="dp-status ${person.status==='active'?'':'off'}">${person.status==='active'?'正常':'停用'}</span></td><td><span style="position:relative"><button class="dp-btn icon small" title="成员操作" onclick="event.stopPropagation();dmMemberMenu('${person.id}')">${icon('more')}</button>${renderMemberMenu(person,item)}</span></td></tr>`;
    }).join('')}</tbody></table></div><div class="dp-pagination"><span>共 ${allRows.length} 条，第 ${model().page}/${pages} 页</span><span class="dp-spacer"></span><button class="dp-page" ${model().page<=1?'disabled':''} onclick="dmPage(${model().page-1})">‹</button>${Array.from({length:pages},(_,index)=>index+1).map(page=>`<button class="dp-page ${page===model().page?'active':''}" onclick="dmPage(${page})">${page}</button>`).join('')}<button class="dp-page" ${model().page>=pages?'disabled':''} onclick="dmPage(${model().page+1})">›</button></div>`:`<div class="dp-empty">${icon('users')}<strong>当前没有成员</strong><p>${!item?'暂无待分配人员':item.kind==='company'?'当前公司范围内暂无成员':'可从待分配人员池或其他部门添加成员'}</p></div>`}</section>`;
  }

  function renderChildren(item){
    const rows=children(item.id);
    return `<div class="dp-stack"><div class="dp-toolbar" style="margin:0"><strong style="font-size:13px;color:#344d65">直属下级部门 ${rows.length} 个</strong><span class="dp-spacer"></span>${button(icon('plus')+'新建下级部门',`dmOpen('create',{parentId:'${item.id}'})`,'primary')}</div><div class="dp-card"><div class="dp-card-body"><div class="dp-child-list">${rows.map(child=>`<div class="dp-child-row"><div class="dp-child-name">${icon('folder')}<span>${esc(child.name)}</span></div><span>${esc(child.code)}</span><span>${directMembers(child.id).length} 人</span><span>${esc(child.managers[0]||'未设置负责人')}</span><button class="dp-btn text" onclick="dmSelect('${child.id}')">查看</button></div>`).join('')||'<div class="dp-empty"><strong>当前没有下级部门</strong></div>'}</div></div></div></div>`;
  }

  function renderIdentities(item){
    const admins=owningCompany(item)?.subAdmins||[];
    return `<section class="dp-card"><div class="dp-card-head">组织管理身份<span class="dp-spacer"></span><button class="dp-btn" onclick="dmOpen('roles')">${icon('edit')}调整负责人和文件管理员</button></div><div class="dp-card-body"><div class="dp-role-group"><div class="dp-role-title">部门负责人<small>${item.managers.length} 人</small></div>${people(item.managers,'未设置负责人')}<div class="dp-note blue" style="margin-top:10px">更换后会解除原负责人身份，但不会自动转移任何文件所有权。</div></div><div class="dp-role-group"><div class="dp-role-title">文件管理员<small>${item.fileAdmins.length} 人</small></div>${people(item.fileAdmins,'未设置文件管理员')}<div class="dp-note" style="margin-top:10px">仅负责部门公共资料库内容和权限治理，不自动成为部门负责人。</div></div><div class="dp-role-group"><div class="dp-role-title">${item.kind==='company'?'分级管理员':'覆盖当前部门的分级管理员'}<small>只读 · 由管理员设置维护</small></div>${people(admins,'当前范围未关联分级管理员')}<div class="dp-note" style="margin-top:10px">分级管理员属于管理中心授权，与部门负责人、文件管理员使用不同授权关系。</div></div></div></section>`;
  }

  function renderDetail(){
    const item=currentDepartment();
    const virtual=model().selected==='unassigned';
    const tabs=virtual?[['overview','节点说明'],['members','成员列表']]:[['overview','部门概览'],['members','成员列表'],['children','下级部门'],['identities','管理身份']];
    if(!tabs.some(tab=>tab[0]===model().tab))model().tab='overview';
    const content=model().tab==='members'?renderMembers(item):model().tab==='children'?renderChildren(item):model().tab==='identities'?renderIdentities(item):renderOverview(item);
    return `<section class="dp-surface dp-detail">${renderHero(item)}<nav class="dp-tabs">${tabs.map(tab=>`<button class="${model().tab===tab[0]?'active':''}" onclick="dmTab('${tab[0]}')">${tab[1]}</button>`).join('')}</nav><div class="dp-detail-body">${content}</div></section>`;
  }

  function renderPage(){
    return `<div class="dp">${renderPageHeader()}${renderToolbar()}<div class="dp-workspace">${renderTree()}${renderDetail()}</div>${renderDialog()}</div>`;
  }

  function selectControl(id,label,options,value,help=''){
    const selected=options.find(option=>option[0]===value&&!option[2])||options.find(option=>!option[2]);
    return `<div class="dp-field"><div class="dp-field-label">${label}</div><div class="dp-select" id="${id}Wrap"><input type="hidden" id="${id}" value="${esc(selected?.[0]||'')}"><button type="button" class="dp-select-trigger" onclick="dmSelectOpen(event,'${id}Wrap')"><span id="${id}Text">${esc(selected?.[1]||'请选择')}</span>${icon('down')}</button><div class="dp-select-panel">${options.map(option=>`<button type="button" class="dp-option ${option[0]===selected?.[0]?'selected':''}" ${option[2]?'disabled':''} style="padding-left:${10+(option[3]||0)*18}px" onclick="dmChoose(event,'${id}','${esc(option[0])}','${esc(option[1])}')">${option[4]||''}<span>${esc(option[1])}</span><small>${option[2]?'不可选择':esc(option[5]||'')}</small></button>`).join('')}</div></div>${help?`<p class="dp-help">${esc(help)}</p>`:''}</div>`;
  }

  function treeSelect(id,label,value,exclude=[],onlyDepartments=false,help=''){
    const options=departments().filter(item=>!onlyDepartments||item.kind==='department'&&item.status==='active').map(item=>[
      item.id,item.name,exclude.includes(item.id),depth(item),icon(item.kind==='company'?'building':'folder'),item.code
    ]);
    return selectControl(id,`${label} <span class="dp-required">*</span>`,options,value,help);
  }

  function selectedPersonChips(names){
    return names.length?names.map(name=>`<span class="dp-person"><i class="dp-avatar">${avatarText(name)}</i>${esc(name)}</span>`).join(''):'<span class="dp-picker-placeholder">暂未选择</span>';
  }

  function peoplePicker(id,label,selectedNames,help){
    return `<div class="dp-field"><div class="dp-field-label">${label}</div><input type="hidden" id="${id}" value="${esc(selectedNames.join('|'))}"><details class="dp-picker"><summary><span class="dp-picker-summary" id="${id}Selected">${selectedPersonChips(selectedNames)}</span><span class="dp-picker-count" id="${id}Count">已选 ${selectedNames.length} 人</span>${icon('down')}</summary><div class="dp-picker-panel"><label class="dp-search dp-picker-search">${icon('search')}<input placeholder="搜索姓名、工号或岗位" oninput="dmFilterPeople('${id}',this.value)"></label><div class="dp-picker-list" id="${id}List">${members().filter(person=>person.status==='active').map(person=>`<button type="button" data-search="${esc(`${person.name} ${person.no} ${person.job}`.toLowerCase())}" data-name="${esc(person.name)}" class="dp-person-choice ${selectedNames.includes(person.name)?'selected':''}" onclick="dmPersonToggle('${id}',this)"><span class="dp-avatar">${avatarText(person.name)}</span><span class="dp-person-choice-copy"><strong>${esc(person.name)}</strong><small>${esc(person.no)} · ${esc(person.job)}</small></span><span class="dp-check-mark">${icon('check')}</span></button>`).join('')}</div></div></details><p class="dp-help">${esc(help)}</p></div>`;
  }

  function modal(title,body,footer,size=''){
    return `<div class="dp-modal ${size}"><div class="dp-modal-head">${title}<span class="dp-spacer"></span><button class="dp-btn icon" onclick="dmClose()">${icon('x')}</button></div><div class="dp-modal-body">${body}</div><div class="dp-modal-foot">${footer}</div></div>`;
  }

  function renderDepartmentForm(mode,payload){
    const editing=mode==='edit';
    const item=editing?currentDepartment():null;
    const target=item||{name:'',code:'',kind:'department',permission:'操作者',quota:'共享企业剩余可用额度',library:'active',managers:[],fileAdmins:[]};
    const rootCompany=Boolean(editing&&item.kind==='company'&&!item.parent);
    const parentValue=editing?item.parent:(payload?.parentId||model().selected||'group');
    const excluded=editing?[item.id,...descendants(item.id).map(child=>child.id)]:[];
    const parentField=rootCompany?`<div class="dp-field"><div class="dp-field-label">上级组织</div><input id="dmDeptParent" type="hidden" value=""><div class="dp-select-trigger">无（集团根公司）</div><p class="dp-help">根公司不可移动为下级节点。</p></div>`:treeSelect('dmDeptParent','上级组织',parentValue,excluded,false,'不能选择自身或自身下级节点。');
    const typeField=rootCompany?`<div class="dp-field"><div class="dp-field-label">节点类型</div><input id="dmDeptKind" type="hidden" value="company"><div class="dp-select-trigger">公司节点</div></div>`:selectControl('dmDeptKind','节点类型',[['department','普通部门'],['company','公司节点']],target.kind,'公司节点和普通部门必须明确区分。');
    return modal(editing?'编辑部门':'新建部门',`<div class="dp-form"><div class="dp-form-row"><label class="dp-field"><span class="dp-field-label">部门名称 <span class="dp-required">*</span></span><input class="dp-input" id="dmDeptName" value="${esc(target.name)}" maxlength="30" placeholder="请输入部门名称"><p class="dp-help">同一上级组织下不可重名。</p></label><label class="dp-field"><span class="dp-field-label">部门编码 <span class="dp-required">*</span></span><input class="dp-input" id="dmDeptCode" value="${esc(target.code)}" maxlength="16" placeholder="例如：YFZX"><p class="dp-help">2–16 位大写字母、数字、下划线或短横线。</p></label></div><div class="dp-form-row">${parentField}${typeField}</div><div class="dp-form-row">${selectControl('dmDeptPermission','公共资料库成员权限',['预览者','下载者','上传者','编辑者','操作者'].map(value=>[value,value]),target.permission)}${selectControl('dmDeptQuota','空间策略',['共享企业剩余可用额度','指定额度 300 GB','不分配空间'].map(value=>[value,value]),target.quota)}</div>${peoplePicker('dmManagers','部门负责人',target.managers,'可设置多人。移除原负责人只解除身份，不自动转移文件所有权。')}${peoplePicker('dmFileAdmins','文件管理员',target.fileAdmins,'负责部门公共资料库治理，不等同于部门负责人或分级管理员。')}<label class="dp-switch"><input id="dmLibrary" type="checkbox" ${target.library!=='none'?'checked':''} ${editing?'disabled':''}><span class="dp-switch-control"></span><span><strong>${editing?'部门公共资料库状态':'创建部门公共资料库'}</strong><small>${editing?'编辑部门时不会删除或补建资料库。':'创建后，当前部门全部成员均可访问。'}</small></span></label>${editing&&target.source==='MDM 同步'?'<div class="dp-note warn">该节点来自 MDM，名称、上级关系等主数据字段可能在后续同步中被覆盖。</div>':''}</div>`,`<button class="dp-btn" onclick="dmClose()">取消</button><button class="dp-btn primary" onclick="dmSaveDept('${mode}')">${editing?'保存修改':'创建部门'}</button>`);
  }

  function renderMoveDialog(item){
    const excluded=[item.id,...descendants(item.id).map(child=>child.id)];
    return modal('调整上级部门',`<div class="dp-definition"><div class="dp-definition-item"><label>当前部门</label><span>${esc(item.name)}</span></div><div class="dp-definition-item"><label>原上级部门</label><span>${esc(department(item.parent)?.name||'无')}</span></div></div>${treeSelect('dmMoveTarget','目标上级部门',item.parent,excluded,false,'当前部门及其全部下级节点均不可选择。')}<div class="dp-note warn" style="margin-top:14px">移动后会重新计算组织路径、管理范围继承和资料库访问，不会移动文件或转移文件所有权。</div>`,`<button class="dp-btn" onclick="dmClose()">取消</button><button class="dp-btn primary" onclick="dmMove()">确认调整</button>`,'medium');
  }

  function deletionRisks(item){
    return [
      ['公司节点不能按普通部门直接裁撤',item.kind==='company'],
      [`直属下级部门：${children(item.id).length} 个`,children(item.id).length>0],
      [`部门成员：${directMembers(item.id).length} 人`,directMembers(item.id).length>0],
      [`部门负责人：${item.managers.length} 人`,item.managers.length>0],
      [`分级管理员关联：${item.subAdmins.length} 人`,item.subAdmins.length>0],
      [`文件管理员：${item.fileAdmins.length} 人`,item.fileAdmins.length>0],
      [`部门公共资料库：${item.library==='none'?'未创建':'仍有关联'}`,item.library!=='none']
    ];
  }

  function renderDeleteDialog(item){
    const risks=deletionRisks(item);
    const blocked=risks.some(risk=>risk[1]);
    return modal(`组织裁撤：${esc(item.name)}`,`<div class="dp-note risk">组织裁撤不会删除成员账号。必须先处理下级组织、成员归属、管理身份和公共资料库。</div><div class="dp-impact">${risks.map(risk=>`<div class="dp-impact-row ${risk[1]?'block':'ok'}">${risk[1]?icon('x'):icon('check')}${esc(risk[0])}${risk[1]?'，请先处理':''}</div>`).join('')}</div>${blocked?'<div class="dp-note warn" style="margin-top:14px">当前条件不满足，确认裁撤按钮已禁用。</div>':`<label class="dp-field" style="margin-top:14px"><span class="dp-field-label">输入“${esc(item.name)}”确认</span><input class="dp-input" id="dmDeleteName" oninput="dmDeleteEnable(this.value,'${esc(item.name)}')"></label>`}`,`<button class="dp-btn" onclick="dmClose()">取消</button><button id="dmDeleteButton" class="dp-btn risk" disabled onclick="dmDelete()">确认裁撤</button>`,'medium');
  }

  function renderStatusDialog(item){
    const stopping=item.status==='active';
    return modal(stopping?'停用部门':'启用部门',`<div class="dp-note ${stopping?'warn':'blue'}">${stopping?'停用不是删除：组织节点、成员关系和资料库都会保留，但普通成员将暂停通过该部门访问公共资料库。':'启用后恢复部门成员对公共资料库的访问，并重新计算权限。'}</div><div class="dp-impact"><div class="dp-impact-row">影响成员：${item.kind==='company'?scopeMembers(item.id).length:directMembers(item.id).length} 人</div><div class="dp-impact-row">公共资料库：${item.library==='none'?'未创建':'保留并同步访问状态'}</div><div class="dp-impact-row">授权管理员仍可处理历史资料</div></div>`,`<button class="dp-btn" onclick="dmClose()">取消</button><button class="dp-btn ${stopping?'risk':'primary'}" onclick="dmStatus()">确认${stopping?'停用':'启用'}</button>`,'small');
  }

  function renderRolesDialog(item){
    return modal('调整部门管理身份',`<div class="dp-form">${peoplePicker('dmRoleManagers','部门负责人',item.managers,'未选中的原负责人会解除身份，但不会自动转移文件所有权。')}${peoplePicker('dmRoleFiles','文件管理员',item.fileAdmins,'文件管理员与负责人、分级管理员相互独立。')}<div class="dp-note">分级管理员由管理员设置模块维护，本弹窗只调整部门负责人和文件管理员。</div></div>`,`<button class="dp-btn" onclick="dmClose()">取消</button><button class="dp-btn primary" onclick="dmSaveRoles()">保存身份设置</button>`);
  }

  function memberDepartmentNames(person){
    return person.departments.length?person.departments.map(id=>department(id)?.name).filter(Boolean).join('、'):'待分配人员池';
  }

  function renderAddDialog(item){
    const candidates=members().filter(person=>!person.departments.includes(item.id));
    return modal(`添加成员到 ${esc(item.name)}`,`<label class="dp-search" style="margin-bottom:12px">${icon('search')}<input placeholder="搜索姓名、工号或岗位" oninput="dmCandidateSearch(this.value)"></label><input id="dmCandidate" type="hidden"><div class="dp-candidate-list" id="dmCandidateList">${candidates.map(person=>`<button type="button" class="dp-candidate" data-search="${esc(`${person.name} ${person.no} ${person.job}`.toLowerCase())}" onclick="dmCandidate(this,'${person.id}')"><span class="dp-radio"></span><span class="dp-avatar">${avatarText(person.name)}</span><span class="dp-candidate-copy"><strong>${esc(person.name)} · ${esc(person.job)}</strong><small>工号 ${esc(person.no)} · 当前：${esc(memberDepartmentNames(person))}</small></span></button>`).join('')}</div><label class="dp-switch" style="margin-top:14px"><input id="dmKeepDepartments" type="checkbox" checked><span class="dp-switch-control"></span><span><strong>保留成员原有部门</strong><small>开启后以兼岗方式加入；关闭后替换原部门并设为主部门。</small></span></label>`,`<button class="dp-btn" onclick="dmClose()">取消</button><button class="dp-btn primary" onclick="dmAddMember()">确认添加</button>`,'medium');
  }

  function renderTargetDialog(item,person,assign){
    const defaultTarget=departments().find(dept=>dept.kind==='department'&&dept.status==='active'&&dept.id!==item?.id)?.id||'';
    return modal(assign?'分配成员到部门':'转移成员部门',`<div class="dp-definition"><div class="dp-definition-item"><label>成员</label><span>${esc(person.name)}（${esc(person.no)}）</span></div><div class="dp-definition-item"><label>${assign?'当前归属':'原部门'}</label><span>${assign?'待分配人员池':esc(item.name)}</span></div></div>${treeSelect('dmMemberTarget','目标部门',defaultTarget,item?[item.id]:[],true,'只允许选择已启用的普通部门。')}<div class="dp-note blue" style="margin-top:14px">该操作只调整组织归属，不删除成员账号、个人空间或已有文件；资料库权限会重新计算。</div>`,`<button class="dp-btn" onclick="dmClose()">取消</button><button class="dp-btn primary" onclick="${assign?`dmAssign('${person.id}')`:`dmTransfer('${person.id}')`}">确认${assign?'分配':'转移'}</button>`,'medium');
  }

  function renderRemoveDialog(item,person){
    const blockingRoles=memberRoles(person,item).filter(role=>role!=='分级管理员');
    return modal('移出当前部门',`<div class="dp-note">移出部门不等于删除成员账号，也不会删除个人空间或文件。成员没有其他部门时，将进入待分配人员池。</div><div class="dp-impact"><div class="dp-impact-row">成员：${esc(person.name)}（${esc(person.no)}）</div><div class="dp-impact-row">移出部门：${esc(item.name)}</div>${blockingRoles.length?`<div class="dp-impact-row block">请先解除身份：${esc(blockingRoles.join('、'))}</div>`:'<div class="dp-impact-row ok">未发现负责人或文件管理员身份</div>'}</div>`,`<button class="dp-btn" onclick="dmClose()">取消</button><button class="dp-btn risk" ${blockingRoles.length?'disabled':''} onclick="dmRemove('${person.id}')">确认移出</button>`,'small');
  }

  function renderMemberRoleDialog(item,person){
    return modal(`设置 ${esc(person.name)} 的部门身份`,`<div class="dp-form"><label class="dp-switch"><input id="dmMemberManager" type="checkbox" ${item.managers.includes(person.name)?'checked':''}><span class="dp-switch-control"></span><span><strong>部门负责人</strong><small>取消后解除当前部门负责人身份，不转移文件所有权。</small></span></label><label class="dp-switch"><input id="dmMemberFileAdmin" type="checkbox" ${item.fileAdmins.includes(person.name)?'checked':''}><span class="dp-switch-control"></span><span><strong>文件管理员</strong><small>负责部门公共资料库治理，不自动成为负责人。</small></span></label><div class="dp-note">身份互不自动转换，分级管理员仍由管理员设置模块维护。</div></div>`,`<button class="dp-btn" onclick="dmClose()">取消</button><button class="dp-btn primary" onclick="dmSaveMemberRole('${person.id}')">保存</button>`,'small');
  }

  function renderDialog(){
    const dialog=model().dialog;
    if(!dialog)return '';
    const item=currentDepartment();
    const person=member(dialog.payload?.memberId);
    let content='';
    if(dialog.type==='create'||dialog.type==='edit')content=renderDepartmentForm(dialog.type,dialog.payload);
    else if(dialog.type==='move'&&item)content=renderMoveDialog(item);
    else if(dialog.type==='delete'&&item)content=renderDeleteDialog(item);
    else if(dialog.type==='status'&&item)content=renderStatusDialog(item);
    else if(dialog.type==='roles'&&item)content=renderRolesDialog(item);
    else if(dialog.type==='add'&&item?.kind==='department')content=renderAddDialog(item);
    else if(dialog.type==='assign'&&person)content=renderTargetDialog(null,person,true);
    else if(dialog.type==='transfer'&&item&&person)content=renderTargetDialog(item,person,false);
    else if(dialog.type==='remove'&&item&&person)content=renderRemoveDialog(item,person);
    else if(dialog.type==='memberRole'&&item&&person)content=renderMemberRoleDialog(item,person);
    else if(dialog.type==='sync')content=modal('同步组织数据','<div class="dp-note blue">同步外部主数据中的公司、部门和成员关系。本地维护字段不会被静默覆盖，冲突项进入待处理状态。</div>','<button class="dp-btn" onclick="dmClose()">取消</button><button class="dp-btn primary" onclick="dmSync()">开始同步</button>','small');
    return content?`<div class="dp-modal-mask" onclick="if(event.target===this)dmClose()">${content}</div>`:'';
  }

  window.adminPage=function(){
    model();
    if(state.adminTab==='dept')return renderPage();
    return typeof previousAdminPage==='function'?previousAdminPage():'';
  };

  window.dmSelect=id=>{model().selected=id;model().tab='overview';model().memberQuery='';model().role='all';model().status='all';model().page=1;model().treeMenu=null;model().memberMenu=null;render()};
  window.dmTab=tab=>{model().tab=tab;model().memberMenu=null;render()};
  window.dmToggleNode=id=>{const index=model().expanded.indexOf(id);if(index>=0)model().expanded.splice(index,1);else model().expanded.push(id);model().treeMenu=null;render()};
  window.dmToggleAll=()=>{const expandable=departments().filter(item=>children(item.id).length).map(item=>item.id);model().expanded=model().expanded.length>=expandable.length?[]:expandable;render()};

  let treeSearchTimer=0;
  let memberSearchTimer=0;
  window.dmTreeSearch=value=>{clearTimeout(treeSearchTimer);treeSearchTimer=setTimeout(()=>{model().treeQuery=value;render()},90)};
  window.dmMemberSearch=value=>{clearTimeout(memberSearchTimer);memberSearchTimer=setTimeout(()=>{model().memberQuery=value;model().page=1;render()},90)};

  window.dmTreeMenu=id=>{model().selected=id;model().treeMenu=model().treeMenu===id?null:id;model().memberMenu=null;render()};
  window.dmMemberMenu=id=>{model().memberMenu=model().memberMenu===id?null:id;model().treeMenu=null;render()};
  window.dmFilterOpen=key=>{model().filterMenu=model().filterMenu===key?null:key;render()};
  window.dmSetFilter=(key,value)=>{model()[key]=value;model().filterMenu=null;model().page=1;render()};
  window.dmSort=field=>{model().sort=model().sort[0]===field?[field,model().sort[1]==='asc'?'desc':'asc']:[field,'asc'];render()};
  window.dmPage=page=>{model().page=Math.max(1,page);render()};

  window.dmOpen=(type,payload)=>{model().dialog={type,payload:payload||null};model().treeMenu=null;model().memberMenu=null;model().filterMenu=null;render()};
  window.dmClose=()=>{model().dialog=null;render()};

  window.dmHeaderMenu=event=>{
    event.stopPropagation();
    const item=currentDepartment();
    const existing=document.getElementById('dpHeaderMenu');
    if(existing){existing.remove();return}
    const popup=document.createElement('div');
    popup.id='dpHeaderMenu';
    popup.className='dp-pop';
    popup.innerHTML=`<button onclick="dmOpen('status')">${icon(item.status==='active'?'lock':'check')}<span>${item.status==='active'?'停用当前节点':'启用当前节点'}</span></button><button onclick="dmOpen('roles')">${icon('shield')}<span>管理身份</span></button><div class="dp-pop-sep"></div>${item.kind==='company'?`<button disabled>${icon('trash')}<span>公司节点不可直接裁撤</span></button>`:`<button class="risk" onclick="dmOpen('delete')">${icon('trash')}<span>组织裁撤</span></button>`}`;
    event.currentTarget.parentElement.appendChild(popup);
  };

  window.dmSelectOpen=(event,id)=>{
    event.stopPropagation();
    document.querySelectorAll('.dp-select.open').forEach(node=>{if(node.id!==id)node.classList.remove('open')});
    document.getElementById(id)?.classList.toggle('open');
  };

  window.dmChoose=(event,id,value,label)=>{
    event.stopPropagation();
    const input=document.getElementById(id);
    const text=document.getElementById(id+'Text');
    if(input)input.value=value;
    if(text)text.textContent=label;
    document.getElementById(id+'Wrap')?.classList.remove('open');
  };

  window.dmFilterPeople=(id,value)=>{
    const query=String(value||'').trim().toLowerCase();
    document.querySelectorAll(`#${id}List .dp-person-choice`).forEach(node=>{node.hidden=Boolean(query)&&!String(node.dataset.search||'').includes(query)});
  };

  window.dmPersonToggle=(id,buttonNode)=>{
    buttonNode.classList.toggle('selected');
    const names=[...document.querySelectorAll(`#${id}List .dp-person-choice.selected`)].map(node=>node.dataset.name);
    const input=document.getElementById(id);
    if(input)input.value=names.join('|');
    const selected=document.getElementById(id+'Selected');
    if(selected)selected.innerHTML=selectedPersonChips(names);
    const count=document.getElementById(id+'Count');
    if(count)count.textContent=`已选 ${names.length} 人`;
  };

  const selectedNames=id=>String(document.getElementById(id)?.value||'').split('|').filter(Boolean);

  function validateDepartment(name,code,parentId,currentId){
    if(!name)return '请输入部门名称';
    if(!parentId&&!(currentId&&department(currentId)?.kind==='company'&&!department(currentId)?.parent))return '请选择有效的上级组织';
    if(parentId&&!department(parentId))return '请选择有效的上级组织';
    if(!/^[A-Z0-9_-]{2,16}$/.test(code))return '部门编码格式不正确';
    if(departments().some(item=>item.id!==currentId&&item.parent===(parentId||null)&&item.name===name))return '同一上级组织下已存在同名部门';
    if(departments().some(item=>item.id!==currentId&&item.code===code))return '部门编码已存在';
    if(parentId&&currentId&&[currentId,...descendants(currentId).map(item=>item.id)].includes(parentId))return '不能移动到自身或自身下级节点';
    return '';
  }

  window.dmSaveDept=mode=>{
    const editing=mode==='edit';
    const item=editing?currentDepartment():null;
    const name=String(document.getElementById('dmDeptName')?.value||'').trim();
    const code=String(document.getElementById('dmDeptCode')?.value||'').trim().toUpperCase();
    const parentId=document.getElementById('dmDeptParent')?.value||null;
    const error=validateDepartment(name,code,parentId,item?.id);
    if(error)return toast(error,'warning');
    const managers=selectedNames('dmManagers');
    const fileAdmins=selectedNames('dmFileAdmins');
    if(editing){
      const oldName=item.name;
      const removedManagers=item.managers.filter(person=>!managers.includes(person));
      Object.assign(item,{name,code,parent:parentId,kind:document.getElementById('dmDeptKind').value,permission:document.getElementById('dmDeptPermission').value,quota:document.getElementById('dmDeptQuota').value,managers,fileAdmins,updated:'刚刚'});
      model().dialog=null;
      render();
      toast(`部门已更新${oldName!==name&&item.library!=='none'?'；公共资料库已同步改名':''}${removedManagers.length?'；已解除 '+removedManagers.join('、')+' 的负责人身份':''}`);
    }else{
      const id='dept_'+Date.now();
      const library=document.getElementById('dmLibrary').checked?'active':'none';
      departments().push({id,parent:parentId,name,code,kind:document.getElementById('dmDeptKind').value,status:'active',source:'本地维护',permission:document.getElementById('dmDeptPermission').value,quota:document.getElementById('dmDeptQuota').value,library,managers,fileAdmins,subAdmins:[],updated:'刚刚'});
      model().selected=id;
      model().tab='overview';
      model().dialog=null;
      if(parentId&&!model().expanded.includes(parentId))model().expanded.push(parentId);
      render();
      toast(`部门“${name}”已创建${library==='active'?'，公共资料库已生成':''}`);
    }
  };

  window.dmMove=()=>{
    const item=currentDepartment();
    const targetId=document.getElementById('dmMoveTarget')?.value;
    if(!item||!targetId)return;
    if([item.id,...descendants(item.id).map(child=>child.id)].includes(targetId))return toast('目标上级不能是自身或自身下级','warning');
    if(targetId===item.parent)return toast('目标上级未发生变化','warning');
    const oldParent=department(item.parent)?.name||'无';
    item.parent=targetId;
    model().dialog=null;
    render();
    toast(`已将“${item.name}”从“${oldParent}”移动到“${department(targetId).name}”`);
  };

  window.dmDeleteEnable=(value,name)=>{const buttonNode=document.getElementById('dmDeleteButton');if(buttonNode)buttonNode.disabled=String(value).trim()!==name};
  window.dmDelete=()=>{
    const item=currentDepartment();
    if(!item||deletionRisks(item).some(risk=>risk[1]))return toast('仍存在关联内容，不能裁撤','warning');
    const parentId=item.parent;
    model().depts=departments().filter(dept=>dept.id!==item.id);
    model().selected=parentId||'group';
    model().dialog=null;
    render();
    toast(`部门“${item.name}”已裁撤，成员账号未删除`);
  };

  window.dmStatus=()=>{
    const item=currentDepartment();
    const stopping=item.status==='active';
    item.status=stopping?'disabled':'active';
    if(item.library!=='none')item.library=stopping?'disabled':'active';
    model().dialog=null;
    render();
    toast(`部门已${stopping?'停用，普通成员资料库访问已暂停':'启用，资料库权限已重新计算'}`);
  };

  window.dmSaveRoles=()=>{
    const item=currentDepartment();
    const oldManagers=[...item.managers];
    item.managers=selectedNames('dmRoleManagers');
    item.fileAdmins=selectedNames('dmRoleFiles');
    const removed=oldManagers.filter(name=>!item.managers.includes(name));
    model().dialog=null;
    render();
    toast(`管理身份已保存${removed.length?'；已解除 '+removed.join('、')+' 的原负责人身份':''}；未转移文件所有权`);
  };

  window.dmCandidateSearch=value=>{
    const query=String(value||'').trim().toLowerCase();
    document.querySelectorAll('#dmCandidateList .dp-candidate').forEach(node=>{node.hidden=Boolean(query)&&!String(node.dataset.search||'').includes(query)});
  };

  window.dmCandidate=(buttonNode,id)=>{
    document.querySelectorAll('#dmCandidateList .dp-candidate').forEach(node=>node.classList.remove('selected'));
    buttonNode.classList.add('selected');
    document.getElementById('dmCandidate').value=id;
  };

  window.dmAddMember=()=>{
    const item=currentDepartment();
    const person=member(document.getElementById('dmCandidate')?.value);
    if(!item||item.kind!=='department'||!person)return toast('请选择要添加的成员','warning');
    const keep=document.getElementById('dmKeepDepartments').checked;
    if(keep){if(!person.departments.includes(item.id))person.departments.push(item.id);person.primary=person.primary||item.id}
    else{person.departments=[item.id];person.primary=item.id}
    model().dialog=null;
    render();
    toast(`已将 ${person.name} 添加到 ${item.name}${keep?'，原部门关系已保留':''}`);
  };

  window.dmAssign=id=>{
    const person=member(id);
    const target=department(document.getElementById('dmMemberTarget')?.value);
    if(!person||person.departments.length||!target||target.kind!=='department'||target.status!=='active')return toast('请选择有效的目标部门','warning');
    person.departments=[target.id];
    person.primary=target.id;
    model().selected=target.id;
    model().tab='members';
    model().dialog=null;
    render();
    toast(`已将 ${person.name} 分配到 ${target.name}，成员账号保持不变`);
  };

  window.dmTransfer=id=>{
    const item=currentDepartment();
    const person=member(id);
    const target=department(document.getElementById('dmMemberTarget')?.value);
    if(!item||!person||!target||target.kind!=='department'||target.status!=='active'||target.id===item.id)return toast('请选择其他已启用的普通部门','warning');
    person.departments=person.departments.filter(deptId=>deptId!==item.id);
    if(!person.departments.includes(target.id))person.departments.push(target.id);
    if(person.primary===item.id||!person.primary)person.primary=target.id;
    model().dialog=null;
    render();
    toast(`已将 ${person.name} 从 ${item.name} 转移到 ${target.name}，账号和个人空间保持不变`);
  };

  window.dmRemove=id=>{
    const item=currentDepartment();
    const person=member(id);
    const blockingRoles=memberRoles(person,item).filter(role=>role!=='分级管理员');
    if(blockingRoles.length)return toast('请先解除负责人或文件管理员身份','warning');
    person.departments=person.departments.filter(deptId=>deptId!==item.id);
    if(person.primary===item.id)person.primary=person.departments[0]||null;
    model().dialog=null;
    render();
    toast(`${person.name} 已移出 ${item.name}${person.departments.length?'，其他部门关系已保留':'，现进入待分配人员池'}；成员账号未删除`);
  };

  window.dmSaveMemberRole=id=>{
    const item=currentDepartment();
    const person=member(id);
    item.managers=item.managers.filter(name=>name!==person.name);
    item.fileAdmins=item.fileAdmins.filter(name=>name!==person.name);
    if(document.getElementById('dmMemberManager').checked)item.managers.push(person.name);
    if(document.getElementById('dmMemberFileAdmin').checked)item.fileAdmins.push(person.name);
    model().dialog=null;
    render();
    toast(`${person.name} 的部门身份已更新；未转移文件所有权`);
  };

  window.dmSync=()=>{model().dialog=null;render();toast('组织同步完成：未发现结构冲突，本地维护字段未被覆盖')};

  document.addEventListener('click',event=>{
    if(!event.target.closest('.dp-filter')&&model().filterMenu){model().filterMenu=null;render();return}
    if(!event.target.closest('.dp-pop')&&!event.target.closest('.dp-tree-more')&&!event.target.closest('.dp-btn.icon')&&model().memberMenu){model().memberMenu=null;render();return}
    if(!event.target.closest('.dp-tree-node')&&model().treeMenu){model().treeMenu=null;render();return}
    if(!event.target.closest('.dp-select'))document.querySelectorAll('.dp-select.open').forEach(node=>node.classList.remove('open'));
    const headerMenu=document.getElementById('dpHeaderMenu');
    if(headerMenu&&!event.target.closest('#dpHeaderMenu'))headerMenu.remove();
  });

  document.addEventListener('keydown',event=>{
    if(event.key!=='Escape')return;
    if(model().dialog)dmClose();
    else document.querySelectorAll('.dp-select.open').forEach(node=>node.classList.remove('open'));
  });

  injectStyles();
  render();
})();
