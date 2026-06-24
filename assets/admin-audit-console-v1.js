/* Independent audit log console — system-wide operation trail for the admin center. */
(function(){
  if(window.__adminAuditConsoleV1)return;
  window.__adminAuditConsoleV1=true;
  if(typeof state==='undefined'||typeof render!=='function')return;

  const baseSidebar=window.sidebar;
  const baseAdminPage=window.adminPage;
  const baseSetAdminTab=window.setAdminTab;
  const esc=value=>typeof safe==='function'?safe(value):String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const ico=name=>typeof icon==='function'?icon(name):'';
  const departmentNames={group:'贵安发展集团',general:'综合管理部',finance:'财务管理部',investment:'投资发展部',research:'研发中心',platform:'平台研发组',application:'应用研发组',product:'产品设计组',construction:'建设管理部',siteA:'项目一部',siteB:'项目二部',operations:'运营管理部',unassigned:'待分配人员池'};

  const auditLogs=[
    {id:'AUD-260624-001',time:'2026-06-24 10:18:42',actor:'张明远',account:'000001',role:'系统管理员',category:'组织与成员',action:'修改部门默认权限',target:'研发中心',department:'研发中心',result:'成功',ip:'10.18.3.24',terminal:'Chrome 149 · Windows',risk:'中风险',detail:'将研发中心默认文件权限由“编辑者”调整为“操作者”，并触发公共资料库成员权限重算。',before:'默认权限：编辑者',after:'默认权限：操作者'},
    {id:'AUD-260624-002',time:'2026-06-24 10:16:07',actor:'张明远',account:'000001',role:'系统管理员',category:'登录与安全',action:'登录管理中心',target:'管理中心',department:'全集团',result:'成功',ip:'10.18.3.24',terminal:'Chrome 149 · Windows',risk:'低风险',detail:'通过账号密码与动态验证码登录管理中心。',before:'会话状态：未登录',after:'会话状态：已登录'},
    {id:'AUD-260624-003',time:'2026-06-24 10:09:31',actor:'许欣',account:'000026',role:'文件管理员',category:'文件与文件夹',action:'下载文件',target:'产品需求规格说明书V3.docx',department:'研发中心',result:'成功',ip:'10.18.7.16',terminal:'客户端 3.8.2 · Windows',risk:'低风险',detail:'从研发中心公共资料库下载文件，文件大小 8.4 MB。',before:'—',after:'下载完成'},
    {id:'AUD-260624-004',time:'2026-06-24 09:58:15',actor:'周凯',account:'000018',role:'部门负责人',category:'分享与外链',action:'创建分享链接',target:'研发周报/2026年第25周',department:'研发中心',result:'成功',ip:'10.18.7.21',terminal:'Edge 149 · Windows',risk:'中风险',detail:'创建组织内分享链接，有效期 7 天，禁止转存，允许预览与下载。',before:'无分享链接',after:'组织内分享 · 7天有效'},
    {id:'AUD-260624-005',time:'2026-06-24 09:42:03',actor:'系统同步服务',account:'MDM-SERVICE',role:'系统服务',category:'组织与成员',action:'MDM 增量同步',target:'贵安发展集团组织架构',department:'全集团',result:'成功',ip:'10.18.0.8',terminal:'MDM Connector',risk:'低风险',detail:'同步新增成员 3 人、更新成员 12 人、调整部门归属 2 人，未覆盖本地维护字段。',before:'组织版本：2026062408',after:'组织版本：2026062409'},
    {id:'AUD-260624-006',time:'2026-06-24 09:31:28',actor:'陈敏',account:'000093',role:'部门负责人',category:'文件与文件夹',action:'上传文件',target:'2026年6月资金计划.xlsx',department:'财务管理部',result:'成功',ip:'10.18.5.33',terminal:'客户端 3.8.2 · Windows',risk:'低风险',detail:'上传至财务管理部公共资料库/资金计划，文件大小 2.1 MB。',before:'文件不存在',after:'版本 V1'},
    {id:'AUD-260624-007',time:'2026-06-24 09:22:44',actor:'未知账号',account:'000188',role:'普通成员',category:'登录与安全',action:'登录失败',target:'用户端',department:'建设管理部',result:'失败',ip:'203.0.113.42',terminal:'Chrome · macOS',risk:'高风险',detail:'连续第 4 次密码校验失败，账号已触发 15 分钟临时锁定。',before:'失败次数：3',after:'失败次数：4 · 临时锁定'},
    {id:'AUD-260624-008',time:'2026-06-24 09:14:06',actor:'张明远',account:'000001',role:'系统管理员',category:'管理员与权限',action:'设置文件管理员',target:'许欣',department:'研发中心',result:'成功',ip:'10.18.3.24',terminal:'Chrome 149 · Windows',risk:'中风险',detail:'将许欣设置为研发中心文件管理员，自动获得公共资料库管理权限。',before:'部门角色：普通成员',after:'部门角色：文件管理员'},
    {id:'AUD-260624-009',time:'2026-06-24 09:03:52',actor:'刘浩',account:'000037',role:'文件管理员',category:'文件与文件夹',action:'移动文件夹',target:'接口文档',department:'研发中心',result:'成功',ip:'10.18.7.19',terminal:'客户端 3.8.2 · Windows',risk:'中风险',detail:'将“接口文档”从“应用研发组/临时资料”移动至“研发中心/技术文档”。',before:'应用研发组/临时资料/接口文档',after:'研发中心/技术文档/接口文档'},
    {id:'AUD-260624-010',time:'2026-06-24 08:56:20',actor:'赵敏',account:'000045',role:'文件管理员',category:'回收站',action:'恢复文件',target:'交互原型评审.pptx',department:'研发中心',result:'成功',ip:'10.18.7.27',terminal:'Chrome 149 · Windows',risk:'低风险',detail:'从部门回收站恢复文件至原目录。',before:'回收站/交互原型评审.pptx',after:'产品设计组/评审资料/交互原型评审.pptx'},
    {id:'AUD-260624-011',time:'2026-06-24 08:42:19',actor:'李晓华',account:'000082',role:'部门负责人',category:'组织与成员',action:'添加部门成员',target:'郭辰',department:'综合管理部',result:'成功',ip:'10.18.2.18',terminal:'Edge 149 · Windows',risk:'低风险',detail:'将郭辰从待分配人员池加入综合管理部。',before:'部门：待分配人员池',after:'部门：综合管理部'},
    {id:'AUD-260623-012',time:'2026-06-23 18:36:04',actor:'张明远',account:'000001',role:'系统管理员',category:'安全配置',action:'修改外链策略',target:'企业全局安全策略',department:'全集团',result:'成功',ip:'10.18.3.24',terminal:'Chrome 149 · Windows',risk:'高风险',detail:'禁止普通成员创建公开外链，保留部门负责人和系统管理员创建权限。',before:'普通成员：允许创建公开外链',after:'普通成员：禁止创建公开外链'},
    {id:'AUD-260623-013',time:'2026-06-23 18:12:17',actor:'周凯',account:'000018',role:'部门负责人',category:'文件与文件夹',action:'重命名文件',target:'研发中心季度总结.docx',department:'研发中心',result:'成功',ip:'10.18.7.21',terminal:'客户端 3.8.2 · Windows',risk:'低风险',detail:'修改文件名称，文件内容与权限未变化。',before:'季度总结-草稿.docx',after:'研发中心季度总结.docx'},
    {id:'AUD-260623-014',time:'2026-06-23 17:58:50',actor:'王璐',account:'000052',role:'普通成员',category:'文件与文件夹',action:'删除文件',target:'测试数据.zip',department:'研发中心',result:'成功',ip:'10.18.7.28',terminal:'客户端 3.8.2 · Windows',risk:'中风险',detail:'文件进入个人回收站，保留 30 天。',before:'平台研发组/测试数据.zip',after:'个人回收站/测试数据.zip'},
    {id:'AUD-260623-015',time:'2026-06-23 17:41:08',actor:'张明远',account:'000001',role:'系统管理员',category:'空间与配额',action:'调整部门空间额度',target:'研发中心',department:'研发中心',result:'成功',ip:'10.18.3.24',terminal:'Chrome 149 · Windows',risk:'中风险',detail:'将研发中心指定空间额度从 500 GB 调整为 600 GB。',before:'指定额度：500 GB',after:'指定额度：600 GB'},
    {id:'AUD-260623-016',time:'2026-06-23 17:18:33',actor:'系统同步服务',account:'MDM-SERVICE',role:'系统服务',category:'组织与成员',action:'MDM 增量同步',target:'研发中心',department:'研发中心',result:'成功',ip:'10.18.0.8',terminal:'MDM Connector',risk:'低风险',detail:'更新成员岗位 4 条，未覆盖本地维护的文件管理员字段。',before:'同步队列：4',after:'同步完成：4'},
    {id:'AUD-260623-017',time:'2026-06-23 16:54:11',actor:'许欣',account:'000026',role:'文件管理员',category:'权限与所有权',action:'转移文件夹所有权',target:'产品设计组/历史原型',department:'研发中心',result:'成功',ip:'10.18.7.16',terminal:'Chrome 149 · Windows',risk:'高风险',detail:'将文件夹所有权由离职成员林悦转移给赵敏，原成员权限降为无访问权限。',before:'所有者：林悦',after:'所有者：赵敏'},
    {id:'AUD-260623-018',time:'2026-06-23 16:36:42',actor:'唐楠',account:'000131',role:'文件管理员',category:'分享与外链',action:'关闭分享链接',target:'投资项目尽调资料',department:'投资发展部',result:'成功',ip:'10.18.6.20',terminal:'Edge 149 · Windows',risk:'中风险',detail:'手动关闭外部分享链接，历史访问记录保留。',before:'外链状态：有效',after:'外链状态：已关闭'},
    {id:'AUD-260623-019',time:'2026-06-23 15:48:05',actor:'张明远',account:'000001',role:'系统管理员',category:'管理员与权限',action:'调整管理员管辖范围',target:'周凯',department:'全集团',result:'成功',ip:'10.18.3.24',terminal:'Chrome 149 · Windows',risk:'高风险',detail:'将分级管理员周凯的管辖范围由研发中心扩展至研发中心及全部下级组织。',before:'管辖范围：研发中心',after:'管辖范围：研发中心及全部下级组织'},
    {id:'AUD-260623-020',time:'2026-06-23 15:20:19',actor:'陈敏',account:'000093',role:'部门负责人',category:'文件与文件夹',action:'预览文件',target:'财务管理制度.pdf',department:'财务管理部',result:'成功',ip:'10.18.5.33',terminal:'Chrome 149 · Windows',risk:'低风险',detail:'在线预览文件第 1—12 页，已叠加姓名与工号水印。',before:'—',after:'预览完成'},
    {id:'AUD-260622-021',time:'2026-06-22 17:35:46',actor:'张明远',account:'000001',role:'系统管理员',category:'组织与成员',action:'编辑部门信息',target:'综合管理部',department:'综合管理部',result:'成功',ip:'10.18.3.24',terminal:'Chrome 149 · Windows',risk:'低风险',detail:'更新部门负责人和公共资料库默认权限。',before:'负责人：王璐；默认权限：预览者',after:'负责人：李晓华；默认权限：下载者'},
    {id:'AUD-260622-022',time:'2026-06-22 16:18:03',actor:'系统管理员',account:'000001',role:'系统管理员',category:'成员与账号',action:'批量导入成员',target:'成员导入模板.xlsx',department:'全集团',result:'部分成功',ip:'10.18.3.24',terminal:'Chrome 149 · Windows',risk:'中风险',detail:'共导入 52 条，成功 49 条，失败 3 条；失败原因为工号重复和部门不存在。',before:'待导入：52',after:'成功：49；失败：3'},
    {id:'AUD-260622-023',time:'2026-06-22 14:32:27',actor:'刘洁',account:'000146',role:'部门负责人',category:'组织与成员',action:'调整成员部门',target:'李工',department:'建设管理部',result:'成功',ip:'10.18.8.11',terminal:'Edge 149 · Windows',risk:'中风险',detail:'将李工从建设管理部调整至项目一部，继承目标部门默认权限。',before:'部门：建设管理部',after:'部门：项目一部'},
    {id:'AUD-260621-024',time:'2026-06-21 14:06:55',actor:'张明远',account:'000001',role:'系统管理员',category:'管理员与权限',action:'设置文件管理员',target:'许欣',department:'研发中心',result:'成功',ip:'10.18.3.24',terminal:'Chrome 149 · Windows',risk:'中风险',detail:'授予许欣研发中心公共资料库管理权限。',before:'角色：普通成员',after:'角色：文件管理员'},
    {id:'AUD-260621-025',time:'2026-06-21 11:24:10',actor:'赵敏',account:'000045',role:'文件管理员',category:'回收站',action:'彻底删除文件',target:'废弃原型素材.zip',department:'研发中心',result:'成功',ip:'10.18.7.27',terminal:'客户端 3.8.2 · Windows',risk:'高风险',detail:'从部门回收站彻底删除文件，操作不可恢复。',before:'部门回收站/废弃原型素材.zip',after:'已永久删除'},
    {id:'AUD-260620-026',time:'2026-06-20 16:42:38',actor:'张明远',account:'000001',role:'系统管理员',category:'安全配置',action:'启用下载水印',target:'企业全局水印策略',department:'全集团',result:'成功',ip:'10.18.3.24',terminal:'Chrome 149 · Windows',risk:'中风险',detail:'启用敏感资料下载水印，水印包含姓名、工号、时间与追踪码。',before:'下载水印：关闭',after:'下载水印：开启'},
    {id:'AUD-260620-027',time:'2026-06-20 10:08:21',actor:'张明远',account:'000001',role:'系统管理员',category:'组织与成员',action:'新建部门',target:'项目一部',department:'建设管理部',result:'成功',ip:'10.18.3.24',terminal:'Chrome 149 · Windows',risk:'低风险',detail:'在建设管理部下新建项目一部，并创建部门公共资料库。',before:'部门不存在',after:'部门：项目一部；资料库：已创建'},
    {id:'AUD-260619-028',time:'2026-06-19 14:26:40',actor:'张明远',account:'000001',role:'系统管理员',category:'组织与成员',action:'停用部门',target:'运营管理部',department:'运营管理部',result:'成功',ip:'10.18.3.24',terminal:'Chrome 149 · Windows',risk:'高风险',detail:'停用运营管理部，保留组织节点、成员关系和历史资料库。',before:'部门状态：已启用',after:'部门状态：已停用'}
  ];

  function ensureAuditState(){
    state.adminAuditFilters=state.adminAuditFilters||{range:'7',category:'all',result:'all',risk:'all',query:'',department:''};
    state.adminAuditDetail=state.adminAuditDetail||null;
  }

  function injectAuditStyles(){
    if(document.getElementById('admin-audit-console-v1-style'))return;
    const style=document.createElement('style');
    style.id='admin-audit-console-v1-style';
    style.textContent=`
body.admin-console-v2 .aa-page,body.admin-console-v2 .aa-page *{box-sizing:border-box;background-image:none!important}
.aa-page{display:flex;flex-direction:column;gap:12px;min-height:0}.aa-assurance{display:flex;align-items:center;gap:8px;color:#4f7398;font-size:10px}.aa-assurance strong{color:#075edf}.aa-summary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.aa-summary-card{min-height:86px;padding:15px 16px;border:1px solid #d7e7f8;border-radius:12px;background:#fff;box-shadow:0 5px 16px rgba(20,80,140,.04)}.aa-summary-card span{display:block;color:#748ca5;font-size:9px}.aa-summary-card strong{display:block;margin-top:7px;color:#183f69;font-size:23px;line-height:1}.aa-summary-card small{display:block;margin-top:8px;color:#8fa3b6;font-size:8px}.aa-summary-card.warn strong{color:#c26b16}.aa-summary-card.danger strong{color:#c13d4d}.aa-panel{border:1px solid #d6e6f7;border-radius:13px;background:#fff;overflow:hidden;box-shadow:0 7px 22px rgba(20,80,140,.045)}.aa-toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:12px 13px;border-bottom:1px solid #e6eff8;background:#fff}.aa-search{height:36px;min-width:220px;flex:1;display:flex;align-items:center;gap:7px;padding:0 10px;border:1px solid #d2e3f5;border-radius:9px;background:#f8fbff;color:#53789c}.aa-search:focus-within{border-color:#78b1f4;background:#fff;box-shadow:0 0 0 3px rgba(23,105,255,.07)}.aa-search input{width:100%;min-width:0;border:0;outline:0;background:transparent;color:#294e73;font-size:10px}.aa-select{height:36px;min-width:118px;padding:0 28px 0 10px;border:1px solid #d2e3f5;border-radius:9px;background:#fff;color:#315b84;font-size:10px;outline:0}.aa-select:focus{border-color:#78b1f4;box-shadow:0 0 0 3px rgba(23,105,255,.07)}.aa-categories{display:flex;align-items:center;gap:6px;overflow:auto;padding:10px 13px;border-bottom:1px solid #e9f0f7;background:#fbfdff}.aa-chip{height:29px;flex:none;padding:0 11px;border:1px solid #d7e5f3;border-radius:8px;background:#fff;color:#537492;font-size:9px}.aa-chip:hover{border-color:#9dc6f3;color:#075edf}.aa-chip.active{border-color:#9bc4f4;background:#eaf4ff;color:#075edf;font-weight:700}.aa-table-wrap{overflow:auto}.aa-table{width:100%;min-width:1040px;border-collapse:collapse}.aa-table th{height:38px;padding:0 11px;border-bottom:1px solid #e6eef7;background:#f8fbfe;color:#68829d;font-size:9px;font-weight:650;text-align:left;white-space:nowrap}.aa-table td{height:55px;padding:8px 11px;border-bottom:1px solid #edf2f7;color:#365a7d;font-size:9px;vertical-align:middle}.aa-table tbody tr:hover{background:#f8fbff}.aa-table tbody tr:last-child td{border-bottom:0}.aa-actor{display:flex;align-items:center;gap:8px}.aa-avatar{width:28px;height:28px;flex:0 0 28px;display:grid;place-items:center;border:1px solid #c9dff7;border-radius:50%;background:#edf6ff;color:#075edf;font-size:9px;font-weight:750}.aa-actor strong,.aa-target strong{display:block;color:#244b71;font-size:10px}.aa-actor span,.aa-target span{display:block;margin-top:2px;color:#8a9fb3;font-size:8px}.aa-category{display:inline-flex;align-items:center;height:23px;padding:0 7px;border:1px solid #d4e4f5;border-radius:6px;background:#f8fbff;color:#426b92;white-space:nowrap}.aa-result,.aa-risk{display:inline-flex;align-items:center;gap:4px;height:23px;padding:0 7px;border-radius:6px;white-space:nowrap}.aa-result.success{background:#ebf8f1;color:#22855b}.aa-result.partial{background:#fff7e8;color:#ad6b17}.aa-result.failed{background:#fff0f2;color:#bd3d4b}.aa-risk.low{background:#f1f6fb;color:#5c7892}.aa-risk.medium{background:#fff7e8;color:#ad6b17}.aa-risk.high{background:#fff0f2;color:#bd3d4b}.aa-table .btn.text{padding:0 5px;color:#075edf}.aa-footer{display:flex;align-items:center;gap:8px;padding:10px 13px;border-top:1px solid #e6eef7;color:#7c93a9;font-size:9px}.aa-footer .spacer{flex:1}.aa-page-btn{width:29px;height:29px;border:1px solid #d6e5f4;border-radius:7px;background:#fff;color:#557795}.aa-page-btn.active{border-color:#87b9f5;background:#eaf4ff;color:#075edf}.aa-empty{padding:55px 20px;text-align:center;color:#7790a8}.aa-drawer-mask{position:fixed;inset:0;z-index:3200;background:rgba(24,52,82,.24)}.aa-drawer{position:fixed;top:0;right:0;z-index:3201;width:min(520px,92vw);height:100vh;display:flex;flex-direction:column;border-left:1px solid #cee0f2;background:#fff;box-shadow:-20px 0 48px rgba(18,55,94,.18)}.aa-drawer-head{height:64px;display:flex;align-items:center;gap:10px;padding:0 18px;border-bottom:1px solid #e3edf7}.aa-drawer-head strong{color:#183f69;font-size:15px}.aa-drawer-head span{color:#8095aa;font-size:9px}.aa-drawer-head .spacer{flex:1}.aa-drawer-body{flex:1;overflow:auto;padding:16px 18px 28px}.aa-detail-grid{display:grid;grid-template-columns:110px 1fr;border:1px solid #dce8f4;border-radius:10px;overflow:hidden}.aa-detail-grid dt,.aa-detail-grid dd{min-height:39px;margin:0;padding:10px 11px;border-bottom:1px solid #e9f0f7;font-size:9px}.aa-detail-grid dt{background:#f8fbfe;color:#7289a0}.aa-detail-grid dd{color:#31597e;word-break:break-word}.aa-detail-grid dt:nth-last-of-type(1),.aa-detail-grid dd:last-child{border-bottom:0}.aa-change{margin-top:14px}.aa-change h4{margin:0 0 8px;color:#244b71;font-size:11px}.aa-change-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}.aa-change-box{min-height:82px;padding:11px;border:1px solid #dce8f4;border-radius:9px;background:#fafcff}.aa-change-box span{display:block;margin-bottom:7px;color:#8297ab;font-size:8px}.aa-change-box strong{color:#31597e;font-size:9px;line-height:1.6}.aa-note{margin-top:14px;padding:11px;border:1px solid #cfe2f6;border-radius:9px;background:#f3f9ff;color:#52789e;font-size:9px;line-height:1.7}@media(max-width:1100px){.aa-summary{grid-template-columns:repeat(2,minmax(0,1fr))}}
`;
    document.head.appendChild(style);
  }

  function sidebarWithAudit(){
    const html=typeof baseSidebar==='function'?baseSidebar():'';
    if(state.page!=='admin'||html.includes("setAdminTab('audit')"))return html;
    const marker="onclick=\"setAdminTab('security')\"";
    const markerIndex=html.indexOf(marker);
    if(markerIndex<0)return html;
    const buttonStart=html.lastIndexOf('<button',markerIndex);
    if(buttonStart<0)return html;
    const active=state.adminTab==='audit'?'active':'';
    const item=`<button class="nav-item ${active}" onclick="setAdminTab('audit')">${ico('file')}<span>日志审计</span></button>`;
    return html.slice(0,buttonStart)+item+html.slice(buttonStart);
  }

  function filterLogs(){
    ensureAuditState();
    const f=state.adminAuditFilters;
    const query=String(f.query||'').trim().toLowerCase();
    const rangeDays=Number(f.range||0);
    const anchor=new Date('2026-06-24T23:59:59');
    return auditLogs.filter(log=>{
      if(rangeDays){
        const delta=(anchor-new Date(log.time.replace(' ','T')))/86400000;
        if(delta>rangeDays)return false;
      }
      if(f.category!=='all'&&log.category!==f.category)return false;
      if(f.result!=='all'&&log.result!==f.result)return false;
      if(f.risk!=='all'&&log.risk!==f.risk)return false;
      if(f.department&&log.department!==f.department&&log.department!=='全集团')return false;
      if(query&&!`${log.actor} ${log.account} ${log.action} ${log.target} ${log.department} ${log.ip} ${log.id}`.toLowerCase().includes(query))return false;
      return true;
    });
  }

  function resultClass(result){return result==='成功'?'success':result==='部分成功'?'partial':'failed';}
  function riskClass(risk){return risk==='高风险'?'high':risk==='中风险'?'medium':'low';}
  function auditSummary(rows){
    const today=rows.filter(row=>row.time.startsWith('2026-06-24')).length;
    const high=rows.filter(row=>row.risk==='高风险').length;
    const failed=rows.filter(row=>row.result==='失败').length;
    const actors=new Set(rows.map(row=>row.account)).size;
    return `<div class="aa-summary"><article class="aa-summary-card"><span>今日记录</span><strong>${today}</strong><small>所有操作实时写入，不允许手工删除</small></article><article class="aa-summary-card danger"><span>高风险操作</span><strong>${high}</strong><small>权限、外链、永久删除及账号安全</small></article><article class="aa-summary-card warn"><span>失败操作</span><strong>${failed}</strong><small>登录失败和权限校验失败需重点关注</small></article><article class="aa-summary-card"><span>涉及操作主体</span><strong>${actors}</strong><small>成员、管理员、系统服务统一留痕</small></article></div>`;
  }

  function auditRows(rows){
    if(!rows.length)return `<tr><td colspan="9"><div class="aa-empty"><strong>没有匹配的审计记录</strong><p>请调整时间范围、分类或搜索条件</p></div></td></tr>`;
    return rows.slice(0,20).map(log=>`<tr><td><div class="aa-target"><strong>${esc(log.time.slice(5,16))}</strong><span>${esc(log.id)}</span></div></td><td><div class="aa-actor"><span class="aa-avatar">${esc(log.actor.slice(0,1))}</span><div><strong>${esc(log.actor)}</strong><span>${esc(log.account)} · ${esc(log.role)}</span></div></div></td><td><span class="aa-category">${esc(log.category)}</span></td><td><div class="aa-target"><strong>${esc(log.action)}</strong><span>${esc(log.department)}</span></div></td><td><div class="aa-target"><strong>${esc(log.target)}</strong><span>${esc(log.detail.slice(0,34))}${log.detail.length>34?'…':''}</span></div></td><td><span class="aa-result ${resultClass(log.result)}">${esc(log.result)}</span></td><td><span class="aa-risk ${riskClass(log.risk)}">${esc(log.risk)}</span></td><td><div class="aa-target"><strong>${esc(log.ip)}</strong><span>${esc(log.terminal)}</span></div></td><td><button class="btn text" onclick="openAdminAuditDetail('${log.id}')">详情</button></td></tr>`).join('');
  }

  function detailDrawer(){
    const id=state.adminAuditDetail;
    if(!id)return '';
    const log=auditLogs.find(item=>item.id===id);
    if(!log)return '';
    return `<div class="aa-drawer-mask" onclick="closeAdminAuditDetail()"></div><aside class="aa-drawer"><div class="aa-drawer-head"><div><strong>操作详情</strong><span>${esc(log.id)}</span></div><span class="spacer"></span><button class="btn ghost icon-only" onclick="closeAdminAuditDetail()">${ico('x')}</button></div><div class="aa-drawer-body"><dl class="aa-detail-grid"><dt>操作时间</dt><dd>${esc(log.time)}</dd><dt>操作主体</dt><dd>${esc(log.actor)}（${esc(log.account)} · ${esc(log.role)}）</dd><dt>操作分类</dt><dd>${esc(log.category)} / ${esc(log.action)}</dd><dt>作用对象</dt><dd>${esc(log.target)}</dd><dt>所属组织</dt><dd>${esc(log.department)}</dd><dt>执行结果</dt><dd><span class="aa-result ${resultClass(log.result)}">${esc(log.result)}</span> <span class="aa-risk ${riskClass(log.risk)}">${esc(log.risk)}</span></dd><dt>来源地址</dt><dd>${esc(log.ip)}</dd><dt>终端信息</dt><dd>${esc(log.terminal)}</dd><dt>操作说明</dt><dd>${esc(log.detail)}</dd></dl><section class="aa-change"><h4>变更前后对比</h4><div class="aa-change-grid"><div class="aa-change-box"><span>变更前</span><strong>${esc(log.before)}</strong></div><div class="aa-change-box"><span>变更后</span><strong>${esc(log.after)}</strong></div></div></section><div class="aa-note">审计记录由系统自动生成，包含操作者、时间、来源 IP、终端、作用对象和变更结果。正式系统中应采用只追加存储并限制任何人员修改或删除。</div></div></aside>`;
  }

  function auditPage(){
    ensureAuditState();
    injectAuditStyles();
    const rows=filterLogs();
    const f=state.adminAuditFilters;
    const categories=['all','登录与安全','组织与成员','成员与账号','管理员与权限','文件与文件夹','分享与外链','权限与所有权','回收站','空间与配额','安全配置'];
    const departmentNote=f.department?`当前从“${esc(f.department)}”治理页进入，已优先展示该组织及全局日志。`:'';
    return `<div class="aa-page">${typeof pageHead==='function'?pageHead('日志审计','记录用户端、管理端、客户端与系统服务的关键操作，支持安全追溯和责任审计',`<div class="aa-assurance">${ico('shield')}<span><strong>日志不可篡改</strong> · 建议留存不少于 180 天</span></div>`):''}${departmentNote?`<div class="notice">${departmentNote}<button class="btn text" onclick="clearAdminAuditDepartment()">查看全部组织</button></div>`:''}${auditSummary(rows)}<section class="aa-panel"><div class="aa-toolbar"><label class="aa-search">${ico('search')}<input value="${esc(f.query)}" placeholder="搜索操作人、工号、操作、对象、IP 或日志编号" oninput="setAdminAuditFilter('query',this.value)"></label><select class="aa-select" onchange="setAdminAuditFilter('range',this.value)"><option value="1" ${f.range==='1'?'selected':''}>近 24 小时</option><option value="7" ${f.range==='7'?'selected':''}>近 7 天</option><option value="30" ${f.range==='30'?'selected':''}>近 30 天</option><option value="0" ${f.range==='0'?'selected':''}>全部时间</option></select><select class="aa-select" onchange="setAdminAuditFilter('result',this.value)"><option value="all">全部结果</option><option ${f.result==='成功'?'selected':''}>成功</option><option ${f.result==='部分成功'?'selected':''}>部分成功</option><option ${f.result==='失败'?'selected':''}>失败</option></select><select class="aa-select" onchange="setAdminAuditFilter('risk',this.value)"><option value="all">全部风险</option><option ${f.risk==='高风险'?'selected':''}>高风险</option><option ${f.risk==='中风险'?'selected':''}>中风险</option><option ${f.risk==='低风险'?'selected':''}>低风险</option></select><button class="btn" onclick="resetAdminAuditFilters()">重置</button><button class="btn primary" onclick="exportAdminAuditLogs()">${ico('download')}导出日志</button></div><div class="aa-categories">${categories.map(category=>`<button class="aa-chip ${f.category===category?'active':''}" onclick="setAdminAuditFilter('category','${category}')">${category==='all'?'全部操作':category}</button>`).join('')}</div><div class="aa-table-wrap"><table class="aa-table"><thead><tr><th>时间 / 编号</th><th>操作主体</th><th>分类</th><th>操作</th><th>作用对象</th><th>结果</th><th>风险</th><th>来源</th><th>操作</th></tr></thead><tbody>${auditRows(rows)}</tbody></table></div><div class="aa-footer"><span>共 ${rows.length} 条匹配记录 · 当前展示前 ${Math.min(rows.length,20)} 条</span><span class="spacer"></span><button class="aa-page-btn active">1</button><button class="aa-page-btn">2</button><button class="aa-page-btn">3</button></div></section>${detailDrawer()}</div>`;
  }

  window.sidebar=sidebarWithAudit;
  window.setAdminTab=function(tab){
    if(tab==='audit'){
      ensureAuditState();
      state.adminTab='audit';
      state.profileOpen=false;
      state.adminAuditDetail=null;
      render();
      return;
    }
    if(typeof baseSetAdminTab==='function')return baseSetAdminTab(tab);
    state.adminTab=tab;render();
  };
  window.adminPage=function(){return state.adminTab==='audit'?auditPage():(typeof baseAdminPage==='function'?baseAdminPage():'');};
  window.openAdminAudit=function(department){
    ensureAuditState();
    const resolved=departmentNames[department]||department||'';
    state.adminAuditFilters.department=resolved;
    state.adminAuditFilters.category='all';
    state.adminAuditDetail=null;
    state.adminTab='audit';
    state.profileOpen=false;
    render();
  };
  window.setAdminAuditFilter=function(key,value){ensureAuditState();state.adminAuditFilters[key]=value;state.adminAuditDetail=null;render();};
  window.resetAdminAuditFilters=function(){state.adminAuditFilters={range:'7',category:'all',result:'all',risk:'all',query:'',department:state.adminAuditFilters?.department||''};render();};
  window.clearAdminAuditDepartment=function(){ensureAuditState();state.adminAuditFilters.department='';render();};
  window.openAdminAuditDetail=function(id){state.adminAuditDetail=id;render();};
  window.closeAdminAuditDetail=function(){state.adminAuditDetail=null;render();};
  window.exportAdminAuditLogs=function(){const count=filterLogs().length;if(typeof toast==='function')toast(`已生成 ${count} 条审计日志导出任务`);};

  document.addEventListener('click',event=>{
    const button=event.target.closest?.('button');
    if(!button||(button.textContent||'').trim()!=='查看完整审计')return;
    event.preventDefault();
    event.stopImmediatePropagation();
    openAdminAudit(state.adminDeptSelected||'');
  },true);

  injectAuditStyles();
})();
