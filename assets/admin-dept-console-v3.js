/* Department management console v3 — visual polish, corrected tree hierarchy, full permission inspection. */
(function(){
  if(window.__adminDeptConsoleV3)return;
  window.__adminDeptConsoleV3=true;
  if(typeof state==='undefined'||typeof render!=='function')return;

  const memberProfiles={
    u1:{name:'张明远',no:'000001',job:'技术开发岗',role:'部门负责人',dept:'研发中心',avatar:'张'},
    u2:{name:'周凯',no:'000018',job:'技术开发岗',role:'部门负责人',dept:'研发中心',avatar:'周'},
    u3:{name:'许欣',no:'000026',job:'产品设计岗',role:'文件管理员',dept:'研发中心',avatar:'许'},
    u4:{name:'刘浩',no:'000037',job:'技术开发岗',role:'文件管理员',dept:'研发中心',avatar:'刘'},
    u5:{name:'赵敏',no:'000045',job:'产品设计岗',role:'文件管理员',dept:'研发中心',avatar:'赵'},
    u6:{name:'王璐',no:'000052',job:'测试工程师',role:'普通成员',dept:'研发中心',avatar:'王'}
  };

  const permissionStore={
    u1:{highest:'操作者',special:1,scopes:[
      {scope:'研发中心公共资料库',path:'企业空间 / 部门公共资料库 / 研发中心',level:'操作者',source:'部门负责人',kind:'role',expire:'长期有效'},
      {scope:'技术方案',path:'研发中心公共资料库 / 技术方案',level:'操作者',source:'继承上级资料库',kind:'inherit',expire:'长期有效'},
      {scope:'集团制度库',path:'企业空间 / 集团资料库 / 制度文件',level:'下载者',source:'公司成员默认权限',kind:'inherit',expire:'长期有效'},
      {scope:'项目复盘材料',path:'协作空间 / 智能知识库一期项目',level:'编辑者',source:'单独授权',kind:'special',expire:'2026-12-31'}
    ]},
    u2:{highest:'操作者',special:0,scopes:[
      {scope:'研发中心公共资料库',path:'企业空间 / 部门公共资料库 / 研发中心',level:'操作者',source:'部门负责人',kind:'role',expire:'长期有效'},
      {scope:'平台研发组资料',path:'研发中心公共资料库 / 平台研发组',level:'操作者',source:'继承上级资料库',kind:'inherit',expire:'长期有效'},
      {scope:'集团制度库',path:'企业空间 / 集团资料库 / 制度文件',level:'下载者',source:'公司成员默认权限',kind:'inherit',expire:'长期有效'}
    ]},
    u3:{highest:'操作者',special:1,scopes:[
      {scope:'研发中心公共资料库',path:'企业空间 / 部门公共资料库 / 研发中心',level:'操作者',source:'文件管理员',kind:'role',expire:'长期有效'},
      {scope:'产品设计组资料',path:'研发中心公共资料库 / 产品设计组',level:'编辑者',source:'部门默认权限',kind:'inherit',expire:'长期有效'},
      {scope:'品牌素材归档',path:'企业空间 / 品牌素材归档',level:'下载者',source:'单独授权',kind:'special',expire:'2026-09-30'}
    ]},
    u4:{highest:'操作者',special:0,scopes:[
      {scope:'研发中心公共资料库',path:'企业空间 / 部门公共资料库 / 研发中心',level:'操作者',source:'文件管理员',kind:'role',expire:'长期有效'},
      {scope:'平台研发组资料',path:'研发中心公共资料库 / 平台研发组',level:'编辑者',source:'部门默认权限',kind:'inherit',expire:'长期有效'},
      {scope:'集团制度库',path:'企业空间 / 集团资料库 / 制度文件',level:'下载者',source:'公司成员默认权限',kind:'inherit',expire:'长期有效'}
    ]},
    u5:{highest:'操作者',special:1,scopes:[
      {scope:'研发中心公共资料库',path:'企业空间 / 部门公共资料库 / 研发中心',level:'操作者',source:'文件管理员',kind:'role',expire:'长期有效'},
      {scope:'产品设计组资料',path:'研发中心公共资料库 / 产品设计组',level:'编辑者',source:'部门默认权限',kind:'inherit',expire:'长期有效'},
      {scope:'外部评审材料',path:'协作空间 / 产品评审会',level:'预览者',source:'单独授权',kind:'special',expire:'2026-07-31'}
    ]},
    u6:{highest:'操作者',special:0,scopes:[
      {scope:'研发中心公共资料库',path:'企业空间 / 部门公共资料库 / 研发中心',level:'操作者',source:'部门默认权限',kind:'inherit',expire:'长期有效'},
      {scope:'测试交付资料',path:'研发中心公共资料库 / 测试交付',level:'编辑者',source:'继承上级资料库',kind:'inherit',expire:'长期有效'},
      {scope:'集团制度库',path:'企业空间 / 集团资料库 / 制度文件',level:'下载者',source:'公司成员默认权限',kind:'inherit',expire:'长期有效'}
    ]}
  };

  const permissionAudit={
    u1:[['今天 09:42','因设置为部门负责人，自动获得研发中心公共资料库“操作者”权限。'],['昨天 17:18','组织同步完成，部门继承权限校验通过。'],['06-21 14:06','获得“项目复盘材料”编辑权限，有效期至 2026-12-31。']],
    u2:[['今天 09:52','最近访问平台研发组资料，权限校验通过。'],['06-22 16:30','设置为部门负责人，资料库管理权限自动生效。']],
    u3:[['昨天 17:46','文件管理员权限复核通过。'],['06-21 11:28','新增品牌素材归档下载权限。']],
    u4:[['昨天 16:23','文件管理员权限复核通过。'],['06-20 10:12','继承平台研发组编辑权限。']],
    u5:[['06-21 14:08','新增产品评审会预览权限。'],['06-19 15:04','设置为文件管理员。']],
    u6:[['06-20 18:22','加入研发中心，自动获得部门默认权限。']]
  };

  function ico(name){return typeof icon==='function'?icon(name):'';}
  function esc(value){return typeof safe==='function'?safe(value):String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}

  function ensureCss(){
    if(document.getElementById('admin-dept-console-v3-css'))return;
    const link=document.createElement('link');
    link.id='admin-dept-console-v3-css';
    link.rel='stylesheet';
    link.href='assets/admin-dept-console-v3.css?v=1';
    document.head.appendChild(link);
  }

  function markTreeDepth(){
    const root=document.getElementById('adTreeScroll');
    if(!root)return;
    const visit=(container,depth)=>{
      [...container.children].forEach(child=>{
        if(!child.classList?.contains('ad-tree-node'))return;
        child.dataset.depth=String(depth);
        const children=[...child.children].find(node=>node.classList?.contains('ad-tree-children'));
        if(children)visit(children,depth+1);
      });
    };
    visit(root,0);
    root.querySelectorAll('.ad-tree-count').forEach(node=>node.remove());
  }

  function enhanceAdmin(){
    document.body.classList.toggle('admin-console-v3',state.page==='admin');
    markTreeDepth();
  }

  function permissionData(memberId){
    const member=memberProfiles[memberId]||{name:'成员',no:'—',job:'—',role:'普通成员',dept:'研发中心',avatar:'员'};
    const data=permissionStore[memberId]||{highest:'操作者',special:0,scopes:[]};
    return {member,data};
  }

  function permissionLevelClass(level,kind){
    if(kind==='special')return 'special';
    if(level==='下载者'||level==='预览者')return 'read';
    return '';
  }

  function permissionRows(memberId,query='all'){
    const {data}=permissionData(memberId);
    const rows=data.scopes.filter(item=>query==='all'||item.kind===query);
    if(!rows.length)return `<tr><td colspan="6" style="height:120px;text-align:center;color:#8fa0b4">当前筛选条件下没有权限记录</td></tr>`;
    return rows.map((item,index)=>`<tr data-perm-kind="${item.kind}"><td><div class="ad-perm-scope">${ico(item.kind==='special'?'link':'folder')}<div><strong>${esc(item.scope)}</strong><div style="margin-top:4px;color:#8a9aad;font-size:8px">${esc(item.path)}</div></div></div></td><td><span class="ad-perm-level ${permissionLevelClass(item.level,item.kind)}">${esc(item.level)}</span></td><td><span class="ad-perm-source">${esc(item.source)}</span></td><td>${item.kind==='special'?'直接授权':'自动继承'}</td><td>${esc(item.expire)}</td><td class="right">${item.kind==='special'?`<button class="btn text compact" onclick="revokeAdminPermission('${memberId}',${index})">撤销</button>`:`<button class="btn text compact" onclick="locateAdminPermission('${memberId}',${index})">定位</button>`}</td></tr>`).join('');
  }

  function permissionOrigins(memberId){
    const {member,data}=permissionData(memberId);
    const roleText=member.role==='普通成员'?'部门默认权限':member.role;
    return `<div class="ad-perm-origin-list"><div class="ad-perm-origin"><span class="ad-perm-origin-icon">${ico('building')}</span><div><strong>部门继承：${esc(member.dept)}</strong><p>成员属于 ${esc(member.dept)}，自动继承部门默认文件权限和公司成员基础权限。</p></div><time>持续生效</time></div><div class="ad-perm-origin"><span class="ad-perm-origin-icon">${ico('shield')}</span><div><strong>部门角色：${esc(roleText)}</strong><p>${member.role==='部门负责人'||member.role==='文件管理员'?'该角色自动获得部门公共资料库管理能力。':'当前没有额外的部门管理身份。'}</p></div><time>角色联动</time></div>${data.scopes.filter(item=>item.kind==='special').map(item=>`<div class="ad-perm-origin"><span class="ad-perm-origin-icon">${ico('link')}</span><div><strong>单独授权：${esc(item.scope)}</strong><p>${esc(item.level)} · ${esc(item.path)}</p></div><time>${esc(item.expire)}</time></div>`).join('')}</div>`;
  }

  function permissionAudits(memberId){
    const rows=permissionAudit[memberId]||[['今天','权限详情已完成一次管理员查看。']];
    return `<div class="ad-perm-audit">${rows.map(row=>`<div class="ad-perm-audit-row"><time>${esc(row[0])}</time><i></i><div>${esc(row[1])}</div></div>`).join('')}</div>`;
  }

  function permissionContent(memberId,tab='effective'){
    if(tab==='origin')return permissionOrigins(memberId);
    if(tab==='audit')return permissionAudits(memberId);
    return `<div class="ad-perm-toolbar"><label class="search-box">${ico('search')}<input placeholder="搜索资料库或目录" oninput="filterPermissionScopes(this.value)"></label><select class="select" id="adPermissionFilter" style="width:136px;height:37px" onchange="filterPermissionKind(this.value)"><option value="all">全部来源</option><option value="role">部门角色</option><option value="inherit">自动继承</option><option value="special">单独授权</option></select><span class="spacer"></span><button class="btn" onclick="openAdminPermissionEditor('${memberId}')">${ico('plus')}新增单独授权</button></div><table class="ad-perm-table"><thead><tr><th>资源范围</th><th>有效权限</th><th>权限来源</th><th>生效方式</th><th>有效期</th><th class="right">操作</th></tr></thead><tbody id="adPermissionRows">${permissionRows(memberId)}</tbody></table>`;
  }

  function permissionModal(memberId){
    const {member,data}=permissionData(memberId);
    const inherited=data.scopes.filter(item=>item.kind!=='special').length;
    return `<div class="ad-modal-layer" id="adPermissionLayer" onclick="if(event.target===this)closeAdminPermissionDetail()"><div class="ad-modal ad-perm-modal"><div class="ad-modal-head">成员文件权限详情<button class="btn ghost icon-only" onclick="closeAdminPermissionDetail()">${ico('x')}</button></div><div class="ad-modal-body"><div class="ad-perm-hero"><div class="ad-perm-person"><span class="ad-perm-avatar">${esc(member.avatar)}</span><div><strong>${esc(member.name)}</strong><span>工号 ${esc(member.no)} · ${esc(member.job)} · ${esc(member.dept)}</span><div style="margin-top:7px"><span class="ad-role-badge ${member.role==='部门负责人'?'owner':member.role==='文件管理员'?'file':''}">${esc(member.role)}</span></div></div></div><div class="ad-perm-stat"><label>最高有效权限</label><strong>${esc(data.highest)}</strong><small>按资源分别计算</small></div><div class="ad-perm-stat"><label>覆盖资源范围</label><strong>${data.scopes.length} 项</strong><small>${inherited} 项自动继承</small></div><div class="ad-perm-stat"><label>单独授权</label><strong>${data.special} 项</strong><small>${data.special?'需要定期复核':'暂无例外授权'}</small></div></div><div class="ad-perm-tabs"><button class="active" data-tab="effective" onclick="switchAdminPermissionTab('${memberId}','effective',this)">有效权限</button><button data-tab="origin" onclick="switchAdminPermissionTab('${memberId}','origin',this)">权限来源</button><button data-tab="audit" onclick="switchAdminPermissionTab('${memberId}','audit',this)">最近变更</button></div><div id="adPermissionContent">${permissionContent(memberId)}</div></div><div class="ad-modal-foot"><button class="btn" onclick="exportAdminPermissionReport('${memberId}')">${ico('chart')}导出权限清单</button><span style="flex:1"></span><button class="btn" onclick="closeAdminPermissionDetail()">关闭</button><button class="btn primary" onclick="openAdminPermissionEditor('${memberId}')">调整权限</button></div></div></div>`;
  }

  function editorHtml(memberId){
    const {member}=permissionData(memberId);
    return `<div class="ad-modal-layer" id="adPermissionEditorLayer" onclick="if(event.target===this)closeAdminPermissionEditor()"><div class="ad-modal"><div class="ad-modal-head">新增单独授权<button class="btn ghost icon-only" onclick="closeAdminPermissionEditor()">${ico('x')}</button></div><div class="ad-modal-body"><div class="ad-perm-editor"><div class="ad-perm-editor-head">${ico('shield')}为 ${esc(member.name)} 配置例外权限</div><div class="ad-form-row"><div class="field"><label>授权资源</label><select class="select" id="adPermScope"><option>项目交付材料</option><option>合同归档资料</option><option>外部评审材料</option><option>品牌素材归档</option></select></div><div class="field"><label>权限级别</label><select class="select" id="adPermLevel"><option>预览者</option><option>下载者</option><option>编辑者</option><option>操作者</option></select></div></div><div class="ad-form-row"><div class="field"><label>有效期</label><select class="select" id="adPermExpire"><option>30 天</option><option>90 天</option><option>至 2026-12-31</option><option>长期有效</option></select></div><div class="field"><label>授权原因</label><input class="input" id="adPermReason" value="项目协作需要" placeholder="请输入授权原因"></div></div><div class="notice">单独授权高于部门默认权限时会形成例外权限，并进入管理员审计与定期复核清单。</div></div></div><div class="ad-modal-foot"><button class="btn" onclick="closeAdminPermissionEditor()">取消</button><button class="btn primary" onclick="saveAdminExplicitPermission('${memberId}')">保存授权</button></div></div></div>`;
  }

  window.viewMemberPermissions=function(memberId){
    state.adminMemberMenu=null;
    document.getElementById('adPermissionLayer')?.remove();
    document.body.insertAdjacentHTML('beforeend',permissionModal(memberId));
  };

  window.closeAdminPermissionDetail=function(){document.getElementById('adPermissionLayer')?.remove();document.getElementById('adPermissionEditorLayer')?.remove();};
  window.switchAdminPermissionTab=function(memberId,tab,button){
    button.parentElement.querySelectorAll('button').forEach(item=>item.classList.toggle('active',item===button));
    const content=document.getElementById('adPermissionContent');
    if(content)content.innerHTML=permissionContent(memberId,tab);
  };
  window.filterPermissionScopes=function(value){
    const query=String(value||'').trim().toLowerCase();
    document.querySelectorAll('#adPermissionRows tr').forEach(row=>{row.hidden=query&&!row.textContent.toLowerCase().includes(query);});
  };
  window.filterPermissionKind=function(kind){
    document.querySelectorAll('#adPermissionRows tr[data-perm-kind]').forEach(row=>{row.hidden=kind!=='all'&&row.dataset.permKind!==kind;});
  };
  window.openAdminPermissionEditor=function(memberId){document.getElementById('adPermissionEditorLayer')?.remove();document.body.insertAdjacentHTML('beforeend',editorHtml(memberId));};
  window.closeAdminPermissionEditor=function(){document.getElementById('adPermissionEditorLayer')?.remove();};
  window.saveAdminExplicitPermission=function(memberId){
    const data=permissionStore[memberId]||(permissionStore[memberId]={highest:'操作者',special:0,scopes:[]});
    const scope=document.getElementById('adPermScope')?.value||'项目交付材料';
    const level=document.getElementById('adPermLevel')?.value||'预览者';
    const expire=document.getElementById('adPermExpire')?.value||'30 天';
    const reason=document.getElementById('adPermReason')?.value.trim();
    if(!reason)return toast('请填写授权原因','warning');
    data.scopes.push({scope,path:'企业空间 / 单独授权 / '+scope,level,source:'单独授权',kind:'special',expire});
    data.special=data.scopes.filter(item=>item.kind==='special').length;
    (permissionAudit[memberId]||(permissionAudit[memberId]=[])).unshift(['刚刚',`管理员新增“${scope}”${level}权限，原因：${reason}。`]);
    closeAdminPermissionEditor();
    closeAdminPermissionDetail();
    viewMemberPermissions(memberId);
    toast('单独授权已保存并写入审计日志');
  };
  window.revokeAdminPermission=function(memberId,index){
    const data=permissionStore[memberId];if(!data)return;
    const specials=data.scopes.filter(item=>item.kind==='special');
    const target=specials[index]||data.scopes[index];
    const actual=data.scopes.indexOf(target);
    if(actual<0)return;
    data.scopes.splice(actual,1);data.special=data.scopes.filter(item=>item.kind==='special').length;
    (permissionAudit[memberId]||(permissionAudit[memberId]=[])).unshift(['刚刚',`管理员撤销“${target.scope}”的单独授权。`]);
    closeAdminPermissionDetail();viewMemberPermissions(memberId);toast('单独授权已撤销','warning');
  };
  window.locateAdminPermission=function(memberId,index){
    const item=permissionStore[memberId]?.scopes[index];
    toast('已定位到：'+(item?.path||'对应资料库'));
  };
  window.exportAdminPermissionReport=function(memberId){const {member}=permissionData(memberId);toast(member.name+'的权限清单已生成');};

  ensureCss();
  const root=document.getElementById('app');
  if(root)new MutationObserver(enhanceAdmin).observe(root,{childList:true,subtree:true});
  enhanceAdmin();
})();
