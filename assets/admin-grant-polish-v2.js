/* Administrator settings polish v2 — interactive edit/add flows and richer system-blue visuals. */
(function(){
  if(window.__adminGrantPolishV2)return;
  window.__adminGrantPolishV2=true;
  if(typeof state==='undefined'||typeof render!=='function'||typeof pageHead!=='function')return;

  const baseAdminPage=window.adminPage;
  const esc=value=>typeof safe==='function'?safe(value):String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const ico=name=>typeof icon==='function'?icon(name):'';

  const permissionCatalog=[
    {key:'org',label:'组织管理',desc:'维护公司和部门节点'},
    {key:'member',label:'成员管理',desc:'新增、编辑、停用成员'},
    {key:'library',label:'资料库管理',desc:'治理授权范围内企业资料'},
    {key:'report',label:'统计报表',desc:'查看空间和成员统计'},
    {key:'audit',label:'审计日志',desc:'查看授权范围内日志'},
    {key:'admin',label:'管理员设置',desc:'委派下级分级管理员',risk:true},
    {key:'security',label:'安全配置',desc:'管理安全策略和风险文件',risk:true}
  ];

  const initialAdmins=[
    {id:'grant-1',name:'李晓华',no:'000082',job:'综合管理岗',type:'SYSTEM',scopes:['全集团'],permissions:['org','member','library','report','audit','admin','security'],status:'active',remark:'负责全集团网盘治理与安全策略。',updated:'今天 10:12'},
    {id:'grant-2',name:'周凯',no:'000018',job:'技术开发岗',type:'COMPANY',scopes:['研发中心','产品设计部'],permissions:['member','library','report','audit'],status:'active',remark:'负责研发体系成员、资料库与报表管理。',updated:'昨天 17:36'},
    {id:'grant-3',name:'陈敏',no:'000093',job:'财务管理岗',type:'COMPANY',scopes:['财务管理部'],permissions:['org','member','library','audit'],status:'active',remark:'负责财务管理部组织和资料治理。',updated:'06-22 15:20'},
    {id:'grant-4',name:'唐楠',no:'000127',job:'产品运营岗',type:'COMPANY',scopes:['运营管理部'],permissions:['member','library'],status:'disabled',remark:'岗位调整期间临时停用。',updated:'06-21 09:18'}
  ];

  function ensureState(){
    if(!Array.isArray(state.adminGrantItems))state.adminGrantItems=initialAdmins.map(item=>({...item,scopes:[...item.scopes],permissions:[...item.permissions]}));
    if(!state.adminGrantDialog)state.adminGrantDialog=null;
  }

  function injectStyles(){
    if(document.getElementById('admin-grant-polish-v2-css'))return;
    const style=document.createElement('style');
    style.id='admin-grant-polish-v2-css';
    style.textContent=`
body.admin-grant-v2{--ag-blue:#1769ff;--ag-blue-strong:#0f56dd;--ag-blue-soft:#eaf3ff;--ag-line:#d8e5f5;--ag-ink:#172b4d;--ag-text:#4d627d;--ag-muted:#7d90aa}
body.admin-grant-v2 .main{background:radial-gradient(circle at 77% -12%,rgba(23,105,255,.16),transparent 31%),radial-gradient(circle at 35% 0,rgba(93,164,255,.10),transparent 24%),linear-gradient(180deg,#f8fbff 0%,#f2f7fd 100%)!important}
.ag-page{max-width:1540px;margin:0 auto}.ag-page .page-head{margin-bottom:16px}.ag-page .page-title{font-size:23px!important;color:var(--ag-ink)!important}.ag-page .page-subtitle{color:#7186a2!important}
.ag-hero{position:relative;overflow:hidden;display:flex;align-items:center;gap:24px;min-height:112px;padding:22px 24px;border:1px solid #cfe0f7;border-radius:18px;background:linear-gradient(118deg,#e9f3ff 0%,#f7fbff 52%,#ffffff 100%);box-shadow:0 16px 36px rgba(30,80,145,.09)}
.ag-hero:before{content:"";position:absolute;right:-70px;top:-94px;width:250px;height:250px;border-radius:50%;background:radial-gradient(circle,rgba(23,105,255,.24),rgba(23,105,255,.05) 54%,transparent 70%)}
.ag-hero:after{content:"";position:absolute;right:158px;bottom:-66px;width:150px;height:150px;border:1px solid rgba(23,105,255,.13);border-radius:50%}
.ag-hero-icon{position:relative;z-index:1;width:58px;height:58px;border-radius:17px;display:grid;place-items:center;color:#fff;background:linear-gradient(145deg,#4386ff,#1769ff);box-shadow:0 12px 26px rgba(23,105,255,.26)}.ag-hero-icon .icon-stack{width:27px;height:27px}
.ag-hero-copy{position:relative;z-index:1;min-width:0}.ag-hero-copy h2{margin:0;color:#17345d;font-size:19px}.ag-hero-copy p{margin:8px 0 0;color:#637d9f;font-size:12px;line-height:1.7}.ag-hero-copy .ag-inline-tags{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px}
.ag-mini-tag{height:24px;padding:0 9px;border-radius:999px;display:inline-flex;align-items:center;background:rgba(255,255,255,.72);border:1px solid #d5e5f8;color:#426b9f;font-size:10px;font-weight:650}.ag-mini-tag.risk{color:#a85b14;background:#fff8e8;border-color:#f2d59c}
.ag-hero-actions{position:relative;z-index:1;margin-left:auto;display:flex;gap:9px}.ag-primary{height:42px!important;padding:0 17px!important;border-radius:11px!important;background:linear-gradient(135deg,#2d75ff,#1769ff)!important;border-color:#1769ff!important;color:#fff!important;box-shadow:0 10px 22px rgba(23,105,255,.24)!important}.ag-primary:hover{background:linear-gradient(135deg,#236beb,#0f56dd)!important;transform:translateY(-1px);box-shadow:0 13px 26px rgba(23,105,255,.30)!important}
.ag-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin:14px 0}.ag-stat{position:relative;overflow:hidden;min-height:102px;padding:16px 17px;border:1px solid var(--ag-line);border-radius:15px;background:#fff;box-shadow:0 8px 22px rgba(35,74,124,.06);transition:.18s ease}.ag-stat:hover{transform:translateY(-2px);border-color:#b9d2f4;box-shadow:0 13px 28px rgba(35,74,124,.11)}
.ag-stat:after{content:"";position:absolute;right:-26px;top:-31px;width:90px;height:90px;border-radius:50%;background:radial-gradient(circle,rgba(23,105,255,.18),transparent 70%)}.ag-stat.green:after{background:radial-gradient(circle,rgba(16,185,129,.20),transparent 70%)}.ag-stat.orange:after{background:radial-gradient(circle,rgba(245,158,11,.22),transparent 70%)}.ag-stat.purple:after{background:radial-gradient(circle,rgba(124,58,237,.18),transparent 70%)}
.ag-stat-top{display:flex;align-items:center;justify-content:space-between;color:#7186a0;font-size:11px}.ag-stat-icon{width:32px;height:32px;border-radius:10px;display:grid;place-items:center;color:#1769ff;background:#edf5ff}.ag-stat.green .ag-stat-icon{color:#07966f;background:#e9fbf5}.ag-stat.orange .ag-stat-icon{color:#d97a06;background:#fff6e5}.ag-stat.purple .ag-stat-icon{color:#6d3fd1;background:#f3edff}.ag-stat strong{display:block;margin-top:11px;color:#1b3558;font-size:26px;line-height:1}.ag-stat small{display:block;margin-top:7px;color:#8a9aaf;font-size:10px}
.ag-card{border:1px solid #d6e3f3;border-radius:17px;background:#fff;box-shadow:0 15px 38px rgba(31,67,114,.08);overflow:hidden}.ag-card-head{min-height:68px;padding:14px 16px;display:flex;align-items:center;gap:10px;border-bottom:1px solid #e7eef7;background:linear-gradient(180deg,#fff,#fbfdff)}
.ag-search{width:min(360px,35vw);height:38px;border:1px solid #d5e1ef;border-radius:10px;background:#f8fbff;display:flex;align-items:center;gap:8px;padding:0 11px;color:#8191a6}.ag-search:focus-within{background:#fff;border-color:#8bb8f5;box-shadow:0 0 0 3px rgba(23,105,255,.09)}.ag-search input{width:100%;border:0;outline:0;background:transparent;color:#344d6e;font-size:12px}
.ag-select{height:38px;min-width:126px;padding:0 30px 0 11px;border:1px solid #d5e1ef;border-radius:10px;background:#fff;color:#536983;font-size:11px;outline:0}.ag-select:focus{border-color:#8bb8f5;box-shadow:0 0 0 3px rgba(23,105,255,.08)}.ag-count{margin-left:auto;color:#8697ac;font-size:10px}
.ag-table-wrap{overflow:auto}.ag-table{width:100%;border-collapse:separate;border-spacing:0}.ag-table th{height:43px;padding:0 15px;background:#f6f9fd;border-bottom:1px solid #dfe8f3;color:#687d97;font-size:10px;font-weight:700;text-align:left;white-space:nowrap}.ag-table td{height:72px;padding:0 15px;border-bottom:1px solid #edf2f7;color:#52677f;font-size:11px;vertical-align:middle}.ag-table tbody tr{transition:.16s ease}.ag-table tbody tr:hover{background:#f3f8ff;box-shadow:inset 3px 0 #8db9f7}.ag-table tbody tr:last-child td{border-bottom:0}
.ag-person{display:flex;align-items:center;gap:10px;min-width:170px}.ag-avatar{width:36px;height:36px;border-radius:12px;display:grid;place-items:center;color:#1f60b7;background:linear-gradient(145deg,#e7f2ff,#d5e8ff);border:1px solid #c9def8;font-weight:750;box-shadow:0 5px 13px rgba(23,105,255,.11)}.ag-person strong{display:block;color:#233e61;font-size:12px}.ag-person span{display:block;margin-top:3px;color:#91a0b2;font-size:9px}
.ag-type{height:24px;padding:0 8px;border-radius:999px;display:inline-flex;align-items:center;font-size:9px;font-weight:700;background:#eef5ff;color:#2563eb}.ag-type.system{background:#ede9fe;color:#6d3fd1}.ag-scope{max-width:270px;display:flex;gap:5px;flex-wrap:wrap}.ag-scope span{height:23px;padding:0 7px;border-radius:7px;display:inline-flex;align-items:center;background:#f0f5fb;color:#58718f;font-size:9px}.ag-perms{max-width:355px;display:flex;gap:5px;flex-wrap:wrap}.ag-perm{height:23px;padding:0 7px;border-radius:7px;display:inline-flex;align-items:center;background:#edf5ff;color:#356eb5;font-size:9px}.ag-perm.risk{background:#fff4df;color:#b46711}.ag-more-count{height:23px;padding:0 7px;border-radius:7px;display:inline-flex;align-items:center;background:#f3f5f8;color:#8290a1;font-size:9px}
.ag-status{display:inline-flex;align-items:center;gap:7px;color:#52677f;font-size:10px}.ag-status i{width:8px;height:8px;border-radius:50%;background:#10b981;box-shadow:0 0 0 3px #e8fbf4}.ag-status.off i{background:#94a3b8;box-shadow:0 0 0 3px #f0f3f6}.ag-actions{display:flex;justify-content:flex-end;gap:7px;white-space:nowrap}.ag-action{height:31px;padding:0 10px;border:1px solid #d5e2f1;border-radius:9px;background:#fff;color:#4e6682;font-size:10px;transition:.16s ease}.ag-action:hover{border-color:#9cc1f3;background:#f4f8ff;color:#1769ff;transform:translateY(-1px);box-shadow:0 6px 12px rgba(23,105,255,.09)}.ag-action.edit{border-color:#bcd4f7;background:#eef5ff;color:#1769ff;font-weight:650}.ag-action.warn:hover{border-color:#f0c16d;background:#fff8e8;color:#b86a0a}
.ag-empty{padding:48px;text-align:center;color:#8b9bae}.ag-empty strong{display:block;margin-top:8px;color:#536a85}
.ag-modal-layer{position:fixed;inset:0;z-index:2200;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(17,38,70,.45);backdrop-filter:blur(5px)}.ag-modal{width:760px;max-width:calc(100vw - 40px);max-height:calc(100vh - 48px);display:flex;flex-direction:column;border:1px solid #d2e0f2;border-radius:19px;background:#fff;box-shadow:0 34px 90px rgba(15,42,80,.28);overflow:hidden}.ag-modal-head{height:66px;padding:0 20px;display:flex;align-items:center;gap:12px;border-bottom:1px solid #e2eaf5;background:linear-gradient(180deg,#fff,#f8fbff)}.ag-modal-head-icon{width:36px;height:36px;border-radius:11px;display:grid;place-items:center;background:#eaf3ff;color:#1769ff}.ag-modal-title strong{display:block;color:#213d63;font-size:15px}.ag-modal-title span{display:block;margin-top:3px;color:#8a99ab;font-size:9px}.ag-modal-close{margin-left:auto}.ag-modal-body{padding:18px 20px;overflow:auto}.ag-form-grid{display:grid;gap:14px}.ag-form-row{display:grid;grid-template-columns:1fr 1fr;gap:13px}.ag-field label{display:block;margin-bottom:7px;color:#5d728d;font-size:10px;font-weight:650}.ag-input,.ag-textarea,.ag-form-select{width:100%;box-sizing:border-box;border:1px solid #d5e1ef;border-radius:10px;background:#fff;color:#344d6c;outline:0}.ag-input,.ag-form-select{height:40px;padding:0 11px}.ag-textarea{min-height:72px;padding:10px 11px;resize:vertical}.ag-input:focus,.ag-textarea:focus,.ag-form-select:focus{border-color:#83b1f3;box-shadow:0 0 0 3px rgba(23,105,255,.09)}
.ag-choice-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.ag-choice{display:flex;align-items:flex-start;gap:9px;padding:10px 11px;border:1px solid #dce6f1;border-radius:10px;background:#fbfdff}.ag-choice:hover{border-color:#bcd3f3;background:#f7fbff}.ag-choice input{margin-top:2px;accent-color:#1769ff}.ag-choice strong{display:block;color:#435b79;font-size:10px}.ag-choice small{display:block;margin-top:3px;color:#91a0b1;font-size:9px;line-height:1.45}.ag-choice.risk{border-color:#f2d9aa;background:#fffbf3}.ag-choice.risk strong{color:#9c6119}.ag-scope-note{padding:10px 11px;border-radius:10px;background:#edf5ff;color:#5375a0;font-size:10px;line-height:1.6}.ag-form-status{display:flex;align-items:center;gap:9px;padding:11px;border:1px solid #dce6f1;border-radius:10px;background:#fbfdff}.ag-form-status input{accent-color:#1769ff}.ag-modal-foot{min-height:68px;padding:13px 20px;display:flex;align-items:center;justify-content:flex-end;gap:9px;border-top:1px solid #e2eaf5;background:#f8fbff}
@media(max-width:1100px){.ag-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.ag-card-head{flex-wrap:wrap}.ag-count{margin-left:0}.ag-search{width:100%}.ag-table{min-width:1120px}}
@media(max-width:720px){.ag-hero{align-items:flex-start;flex-wrap:wrap}.ag-hero-actions{width:100%;margin-left:0}.ag-stats{grid-template-columns:1fr}.ag-form-row,.ag-choice-grid{grid-template-columns:1fr}}
`;
    document.head.appendChild(style);
  }

  function typeLabel(item){return item.type==='SYSTEM'?'系统管理员':'分级管理员';}
  function permissionLabel(key){return permissionCatalog.find(item=>item.key===key)?.label||key;}
  function permissionIsRisk(key){return Boolean(permissionCatalog.find(item=>item.key===key)?.risk);}

  function stats(){
    const items=state.adminGrantItems;
    const enabled=items.filter(item=>item.status==='active').length;
    const covered=new Set(items.filter(item=>item.type==='COMPANY'&&item.status==='active').flatMap(item=>item.scopes)).size;
    const highRisk=items.filter(item=>item.status==='active'&&item.permissions.some(permissionIsRisk)).length;
    return `<div class="ag-stats"><article class="ag-stat"><div class="ag-stat-top"><span>管理员总数</span><span class="ag-stat-icon">${ico('users')}</span></div><strong>${items.length}</strong><small>包含系统管理员和分级管理员</small></article><article class="ag-stat green"><div class="ag-stat-top"><span>当前生效</span><span class="ag-stat-icon">${ico('check')}</span></div><strong>${enabled}</strong><small>${items.length-enabled} 个授权已停用</small></article><article class="ag-stat orange"><div class="ag-stat-top"><span>公司覆盖</span><span class="ag-stat-icon">${ico('building')}</span></div><strong>${covered}</strong><small>已配置分级管理员的组织范围</small></article><article class="ag-stat purple"><div class="ag-stat-top"><span>高权限账号</span><span class="ag-stat-icon">${ico('shield')}</span></div><strong>${highRisk}</strong><small>拥有管理员设置或安全配置</small></article></div>`;
  }

  function permissionChips(item){
    const visible=item.permissions.slice(0,4);
    const rest=item.permissions.length-visible.length;
    return `<div class="ag-perms">${visible.map(key=>`<span class="ag-perm ${permissionIsRisk(key)?'risk':''}">${esc(permissionLabel(key))}</span>`).join('')}${rest?`<span class="ag-more-count">+${rest}</span>`:''}</div>`;
  }

  function rows(){
    if(!state.adminGrantItems.length)return `<tr><td colspan="7"><div class="ag-empty">${ico('shield')}<strong>暂无管理员授权</strong><p>点击右上角“添加管理员”创建第一条授权。</p></div></td></tr>`;
    return state.adminGrantItems.map(item=>`<tr data-grant-row data-type="${item.type}" data-status="${item.status}" data-search="${esc(`${item.name} ${item.no} ${item.job} ${typeLabel(item)} ${item.scopes.join(' ')} ${item.permissions.map(permissionLabel).join(' ')}`.toLowerCase())}"><td><div class="ag-person"><span class="ag-avatar">${esc(item.name.slice(0,1))}</span><div><strong>${esc(item.name)}</strong><span>工号 ${esc(item.no)} · ${esc(item.job)}</span></div></div></td><td><span class="ag-type ${item.type==='SYSTEM'?'system':''}">${typeLabel(item)}</span></td><td><div class="ag-scope">${item.scopes.map(scope=>`<span>${esc(scope)}</span>`).join('')}</div></td><td>${permissionChips(item)}</td><td><span class="ag-status ${item.status==='active'?'':'off'}"><i></i>${item.status==='active'?'生效':'已停用'}</span></td><td>${esc(item.updated)}</td><td><div class="ag-actions"><button class="ag-action edit" onclick="openAdminGrantDialog('edit','${item.id}')">编辑</button><button class="ag-action warn" onclick="toggleAdminGrantStatus('${item.id}')">${item.status==='active'?'停用':'启用'}</button></div></td></tr>`).join('');
  }

  function page(){
    ensureState();
    const enabled=state.adminGrantItems.filter(item=>item.status==='active').length;
    return `<div class="ag-page">${pageHead('管理员设置','配置管理中心入口、管辖范围和菜单权限',`<span class="badge blue">当前范围：全集团</span>`)}<section class="ag-hero"><span class="ag-hero-icon">${ico('shield')}</span><div class="ag-hero-copy"><h2>分层授权，范围与能力清晰可控</h2><p>系统管理员负责全集团治理；分级管理员只管理指定公司及下级组织。授权变更后立即刷新管理中心权限。</p><div class="ag-inline-tags"><span class="ag-mini-tag">${state.adminGrantItems.length} 位管理员</span><span class="ag-mini-tag">${enabled} 个生效授权</span><span class="ag-mini-tag risk">高风险权限单独标识</span></div></div><div class="ag-hero-actions"><button class="btn ag-primary" onclick="openAdminGrantDialog('create')">${ico('plus')}添加管理员</button></div></section>${stats()}<section class="ag-card"><div class="ag-card-head"><label class="ag-search">${ico('search')}<input id="agSearch" placeholder="搜索姓名、工号、公司或权限" oninput="filterAdminGrantRows()"></label><select class="ag-select" id="agType" onchange="filterAdminGrantRows()"><option value="all">全部类型</option><option value="SYSTEM">系统管理员</option><option value="COMPANY">分级管理员</option></select><select class="ag-select" id="agStatus" onchange="filterAdminGrantRows()"><option value="all">全部状态</option><option value="active">生效</option><option value="disabled">已停用</option></select><span class="ag-count" id="agCount">共 ${state.adminGrantItems.length} 条授权</span></div><div class="ag-table-wrap"><table class="ag-table"><thead><tr><th>管理员</th><th>管理员类型</th><th>管辖范围</th><th>授权能力</th><th>状态</th><th>最近更新</th><th style="text-align:right">操作</th></tr></thead><tbody>${rows()}</tbody></table></div></section>${dialog()}</div>`;
  }

  function scopeChoices(selected,type){
    const options=['贵安发展集团','研发中心','产品设计部','财务管理部','建设管理部','运营管理部'];
    if(type==='SYSTEM')return `<div class="ag-scope-note">系统管理员默认管理全集团，不需要再选择公司范围。</div>`;
    return `<div class="ag-choice-grid">${options.map(scope=>`<label class="ag-choice"><input type="checkbox" name="agScope" value="${esc(scope)}" ${selected.includes(scope)?'checked':''}><span><strong>${esc(scope)}</strong><small>包含该组织及全部下级部门</small></span></label>`).join('')}</div>`;
  }

  function dialog(){
    const payload=state.adminGrantDialog;
    if(!payload)return '';
    const editing=payload.type==='edit';
    const current=editing?state.adminGrantItems.find(item=>item.id===payload.id):null;
    const target=current||{name:'',no:'',job:'',type:'COMPANY',scopes:[],permissions:['member','library'],status:'active',remark:''};
    return `<div class="ag-modal-layer" onclick="if(event.target===this)closeAdminGrantDialog()"><div class="ag-modal"><div class="ag-modal-head"><span class="ag-modal-head-icon">${ico(editing?'edit':'plus')}</span><div class="ag-modal-title"><strong>${editing?'编辑管理员授权':'添加管理员'}</strong><span>${editing?'修改管辖范围、授权能力和状态':'选择成员并配置管理中心权限'}</span></div><button class="btn ghost icon-only ag-modal-close" onclick="closeAdminGrantDialog()">${ico('x')}</button></div><div class="ag-modal-body"><div class="ag-form-grid"><div class="ag-form-row"><div class="ag-field"><label>成员姓名 <span style="color:#dc4c55">*</span></label><input class="ag-input" id="agName" value="${esc(target.name)}" placeholder="请输入成员姓名"></div><div class="ag-field"><label>工号 / 账号 <span style="color:#dc4c55">*</span></label><input class="ag-input" id="agNo" value="${esc(target.no)}" placeholder="例如：000128"></div></div><div class="ag-form-row"><div class="ag-field"><label>岗位</label><input class="ag-input" id="agJob" value="${esc(target.job)}" placeholder="例如：技术开发岗"></div><div class="ag-field"><label>管理员类型</label><select class="ag-form-select" id="agFormType" onchange="refreshAdminGrantScope()"><option value="COMPANY" ${target.type==='COMPANY'?'selected':''}>分级管理员</option><option value="SYSTEM" ${target.type==='SYSTEM'?'selected':''}>系统管理员</option></select></div></div><div class="ag-field"><label>管辖范围</label><div id="agScopeArea">${scopeChoices(target.scopes,target.type)}</div></div><div class="ag-field"><label>控制台权限</label><div class="ag-choice-grid">${permissionCatalog.map(permission=>`<label class="ag-choice ${permission.risk?'risk':''}"><input type="checkbox" name="agPermission" value="${permission.key}" ${target.permissions.includes(permission.key)?'checked':''}><span><strong>${esc(permission.label)}${permission.risk?' · 高风险':''}</strong><small>${esc(permission.desc)}</small></span></label>`).join('')}</div></div><div class="ag-form-row"><label class="ag-form-status"><input type="checkbox" id="agEnabled" ${target.status==='active'?'checked':''}><span><strong style="display:block;color:#415a78;font-size:10px">授权立即生效</strong><small style="display:block;margin-top:3px;color:#91a0b2;font-size:9px">停用后保留历史记录，但权限立即失效</small></span></label><div class="ag-field"><label>备注</label><textarea class="ag-textarea" id="agRemark" placeholder="填写授权原因或职责说明">${esc(target.remark)}</textarea></div></div></div></div><div class="ag-modal-foot"><button class="btn" onclick="closeAdminGrantDialog()">取消</button><button class="btn ag-primary" onclick="saveAdminGrant('${editing?'edit':'create'}','${editing?target.id:''}')">${editing?'保存修改':'确认添加'}</button></div></div></div>`;
  }

  window.openAdminGrantDialog=function(type,id){ensureState();state.adminGrantDialog={type,id};render();};
  window.closeAdminGrantDialog=function(){state.adminGrantDialog=null;render();};

  window.refreshAdminGrantScope=function(){
    const type=document.getElementById('agFormType')?.value||'COMPANY';
    const area=document.getElementById('agScopeArea');
    if(area)area.innerHTML=scopeChoices([],type);
  };

  window.filterAdminGrantRows=function(){
    const query=String(document.getElementById('agSearch')?.value||'').trim().toLowerCase();
    const type=document.getElementById('agType')?.value||'all';
    const status=document.getElementById('agStatus')?.value||'all';
    let visible=0;
    document.querySelectorAll('[data-grant-row]').forEach(row=>{
      const matched=(!query||(row.dataset.search||'').includes(query))&&(type==='all'||row.dataset.type===type)&&(status==='all'||row.dataset.status===status);
      row.hidden=!matched;if(matched)visible++;
    });
    const count=document.getElementById('agCount');
    if(count)count.textContent=`显示 ${visible} / ${state.adminGrantItems.length} 条授权`;
  };

  window.saveAdminGrant=function(mode,id){
    ensureState();
    const name=document.getElementById('agName')?.value.trim();
    const no=document.getElementById('agNo')?.value.trim();
    const job=document.getElementById('agJob')?.value.trim()||'未填写岗位';
    const type=document.getElementById('agFormType')?.value||'COMPANY';
    const permissions=[...document.querySelectorAll('input[name="agPermission"]:checked')].map(input=>input.value);
    const scopes=type==='SYSTEM'?['全集团']:[...document.querySelectorAll('input[name="agScope"]:checked')].map(input=>input.value);
    if(!name)return toast('请输入成员姓名','warning');
    if(!no)return toast('请输入工号或账号','warning');
    if(type==='COMPANY'&&!scopes.length)return toast('请至少选择一个管辖范围','warning');
    if(!permissions.length)return toast('请至少选择一项控制台权限','warning');
    const data={name,no,job,type,permissions,scopes,status:document.getElementById('agEnabled')?.checked?'active':'disabled',remark:document.getElementById('agRemark')?.value.trim()||'',updated:'刚刚'};
    if(mode==='edit'){
      const item=state.adminGrantItems.find(entry=>entry.id===id);
      if(!item)return toast('未找到管理员授权','warning');
      Object.assign(item,data);
      toast('管理员授权已更新，在线权限将立即刷新');
    }else{
      state.adminGrantItems.unshift({id:'grant-'+Date.now(),...data});
      toast('管理员已添加并获得管理中心入口');
    }
    state.adminGrantDialog=null;
    render();
  };

  window.toggleAdminGrantStatus=function(id){
    ensureState();
    const item=state.adminGrantItems.find(entry=>entry.id===id);
    if(!item)return;
    item.status=item.status==='active'?'disabled':'active';
    item.updated='刚刚';
    toast(item.status==='active'?`${item.name} 的管理员授权已启用`:`${item.name} 的管理员授权已停用`,item.status==='active'?'success':'warning');
    render();
  };

  injectStyles();
  window.adminPage=function(){
    ensureState();
    if(state.adminTab==='grant'){
      document.body.classList.add('admin-grant-v2');
      return page();
    }
    document.body.classList.remove('admin-grant-v2');
    state.adminGrantDialog=null;
    return typeof baseAdminPage==='function'?baseAdminPage():'';
  };

  if(state.page==='admin'&&state.adminTab==='grant')render();
})();
