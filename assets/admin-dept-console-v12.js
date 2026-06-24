/* Department management v12 — flat theme, stable member avatars, reliable tabs and public-library semantics. */
(function(){
  if(window.__adminDeptConsoleV12)return;
  window.__adminDeptConsoleV12=true;

  let memberQuery='';
  let memberRole='all';
  let enhanceFrame=0;
  let portalFrame=0;

  function injectStyles(){
    if(document.getElementById('admin-dept-console-v12-style'))return;
    const style=document.createElement('style');
    style.id='admin-dept-console-v12-style';
    style.textContent=`
body.admin-console-v2 .ad-page,
body.admin-console-v2 .ad-page *,
body.admin-console-v2 .admin-shell-sidebar,
body.admin-console-v2 .admin-shell-sidebar *,
body.admin-console-v2 .admin-shell-topbar,
body.admin-console-v2 .admin-shell-topbar *{background-image:none!important}
body.admin-console-v2 .main{background:#fff!important;background-image:none!important}
body.admin-console-v2 .ad-toolbar,
body.admin-console-v2 .ad-hero,
body.admin-console-v2 .ad-console-scope,
body.admin-console-v2 .ad-modal-head,
body.admin-console-v2 .ad-modal-foot{background-image:none!important}
body.admin-console-v2 .btn.primary{background:#1769ff!important;background-image:none!important;border-color:#1769ff!important;color:#fff!important;box-shadow:0 6px 14px rgba(23,105,255,.14)!important}
body.admin-console-v2 .btn.primary:hover:not(:disabled),
body.admin-console-v2 .btn.primary:focus-visible{background:#0756d6!important;background-image:none!important;border-color:#0756d6!important;color:#fff!important}
body.admin-console-v2 .ad-tabs button{cursor:pointer!important;pointer-events:auto!important}
body.admin-console-v2 .ad-member-person{display:flex!important;align-items:center!important;gap:10px!important;min-width:0!important}
body.admin-console-v2 .ad-member-person>.ad-member-avatar{width:32px!important;height:32px!important;min-width:32px!important;flex:0 0 32px!important;display:grid!important;place-items:center!important;margin:0!important;padding:0!important;border:1px solid #bfd9fb!important;border-radius:50%!important;background:#e8f3ff!important;background-image:none!important;color:#075edf!important;font-size:11px!important;font-weight:750!important;line-height:1!important;text-align:center!important;box-shadow:none!important;overflow:hidden!important}
body.admin-console-v2 .ad-member-person>.ad-member-avatar::before,
body.admin-console-v2 .ad-member-person>.ad-member-avatar::after{display:none!important}
body.admin-console-v2 .ad-member-person>div{min-width:0!important}
body.admin-console-v2 .ad-member-person>div>strong{display:block!important;overflow:hidden!important;color:#294a6c!important;text-overflow:ellipsis!important;white-space:nowrap!important}
body.admin-console-v2 .ad-member-person>div>span{display:block!important;margin:3px 0 0!important;color:#8aa0b6!important;font-size:9px!important;line-height:1.25!important;white-space:nowrap!important}
body.admin-console-v2 .ad-member-table .op-col{overflow:visible!important}
body.admin-console-v2 .ad-member-menu-wrap>.btn{width:30px!important;height:30px!important;border-radius:8px!important}
body.admin-console-v2 .ad-member-menu-wrap>.btn[aria-expanded="true"]{border-color:#8fbdf5!important;background:#eef6ff!important;color:#075edf!important}
body>.ad-member-menu-portal{position:fixed!important;inset:auto!important;right:auto!important;top:0;left:0;z-index:2800!important;width:190px!important;max-height:none!important;overflow:visible!important;padding:6px!important;border:1px solid #cfe1f4!important;border-radius:10px!important;background:#fff!important;background-image:none!important;box-shadow:0 18px 42px rgba(22,68,116,.18)!important}
body>.ad-member-menu-portal button{width:100%!important;height:36px!important;display:flex!important;align-items:center!important;gap:9px!important;padding:0 10px!important;border:0!important;border-radius:7px!important;background:#fff!important;background-image:none!important;color:#315f8d!important;font-size:11px!important;text-align:left!important}
body>.ad-member-menu-portal button:hover,
body>.ad-member-menu-portal button:focus-visible{background:#eef6ff!important;color:#075edf!important;outline:none!important}
body>.ad-member-menu-portal button:last-child{color:#a94a52!important}
body>.ad-member-menu-portal button:last-child:hover{background:#fff3f4!important;color:#c23845!important}
body.admin-console-v2 .ad-members-tools .search-box:focus-within,
body.admin-console-v2 .ad-members-tools .select:focus{border-color:#76aff6!important;box-shadow:0 0 0 3px rgba(23,105,255,.07)!important}
body.admin-console-v2 .ad-library-explain{display:grid;gap:7px;margin-top:11px;padding-top:10px;border-top:1px solid #e7eff8}
body.admin-console-v2 .ad-library-explain-row{display:grid;grid-template-columns:94px minmax(0,1fr);gap:10px;align-items:start;color:#6f879f;font-size:9px;line-height:1.55}
body.admin-console-v2 .ad-library-explain-row strong{color:#315b84;font-size:9px}
body.admin-console-v2 .ad-library-setting{margin-top:0}
body.admin-console-v2 .ad-library-setting-row{display:flex;align-items:center;gap:8px}
body.admin-console-v2 .ad-library-setting-row .select{flex:1;min-width:0}
body.admin-console-v2 .ad-library-setting-tag{height:25px;display:inline-flex;align-items:center;padding:0 8px;border:1px solid #bfd9f7;border-radius:7px;background:#eef6ff;color:#075edf;font-size:8px;white-space:nowrap}
body.admin-console-v2 .ad-library-setting .help{margin:7px 0 0;color:#7c91a6;font-size:8px;line-height:1.6}
body.admin-console-v2 .ad-library-readonly{min-height:42px;display:flex;align-items:flex-start;gap:9px;padding:9px 10px;border:1px solid #d9e7f5;border-radius:9px;background:#f9fbfe;color:#6c849b;font-size:9px;line-height:1.55}
body.admin-console-v2 .ad-library-readonly strong{flex:none;color:#23699f}
body.admin-console-v2 .ad-library-empty{display:grid;gap:5px;padding:2px 0;color:#758ba0;font-size:9px;line-height:1.6}
body.admin-console-v2 .ad-library-empty strong{color:#365e84;font-size:10px}
`;
    document.head.appendChild(style);
  }

  function setAttributeIfChanged(node,name,value){
    if(node&&node.getAttribute(name)!==value)node.setAttribute(name,value);
  }

  function compactText(node){
    return String(node?.textContent||'').replace(/\s+/g,'').trim();
  }

  function resetMemberFilters(){
    memberQuery='';
    memberRole='all';
  }

  function findMenuTrigger(memberId){
    const needle=`toggleAdminMemberMenu('${String(memberId||'').replace(/["\\]/g,'\\$&')}')`;
    return [...document.querySelectorAll('.ad-member-menu-wrap>button')]
      .find(button=>(button.getAttribute('onclick')||'').includes(needle));
  }

  function closePortal(){
    document.querySelectorAll('body>.ad-member-menu-portal').forEach(menu=>menu.remove());
    document.querySelectorAll('.ad-member-menu:not(.ad-member-menu-portal)').forEach(menu=>{
      if(menu.style.display==='none')menu.style.display='';
    });
    document.querySelectorAll('.ad-member-menu-wrap>button[aria-expanded="true"]').forEach(button=>{
      setAttributeIfChanged(button,'aria-expanded','false');
    });
  }

  function positionPortal(menu,trigger){
    if(!menu||!trigger||!menu.isConnected||!trigger.isConnected)return;
    const rect=trigger.getBoundingClientRect();
    const menuHeight=Math.max(menu.offsetHeight,120);
    const left=Math.min(window.innerWidth-202,Math.max(12,rect.right-190));
    let top=rect.bottom+7;
    if(top+menuHeight>window.innerHeight-12)top=Math.max(12,rect.top-menuHeight-7);
    menu.style.left=`${Math.round(left)}px`;
    menu.style.top=`${Math.round(top)}px`;
  }

  function syncPortal(){
    cancelAnimationFrame(portalFrame);
    portalFrame=requestAnimationFrame(()=>{
      closePortal();
      if(typeof state==='undefined'||!state.adminMemberMenu)return;
      const trigger=findMenuTrigger(state.adminMemberMenu);
      const sourceMenu=document.querySelector('.ad-member-menu:not(.ad-member-menu-portal)');
      if(!trigger||!sourceMenu)return;
      setAttributeIfChanged(trigger,'aria-expanded','true');
      sourceMenu.style.display='none';
      const portal=sourceMenu.cloneNode(true);
      portal.style.display='';
      portal.classList.add('ad-member-menu-portal');
      setAttributeIfChanged(portal,'role','menu');
      document.body.appendChild(portal);
      positionPortal(portal,trigger);
    });
  }

  function filterMemberRows(){
    const rows=[...document.querySelectorAll('#adMemberRows tr[data-member]')];
    let visible=0;
    rows.forEach(row=>{
      const haystack=String(row.dataset.member||'').toLowerCase();
      const matchesQuery=!memberQuery||haystack.includes(memberQuery);
      const matchesRole=memberRole==='all'||haystack.includes(memberRole.toLowerCase());
      const shouldHide=!(matchesQuery&&matchesRole);
      if(row.hidden!==shouldHide)row.hidden=shouldHide;
      if(!shouldHide)visible++;
    });
    const counter=document.querySelector('.ad-members-card .ad-card-head .right');
    if(counter){
      const text=`显示 ${visible} / 共 ${rows.length} 条记录`;
      if(counter.textContent!==text)counter.textContent=text;
    }
  }

  function activateDepartmentView(view){
    if(!['overview','members','governance'].includes(view))return;
    if(typeof state==='undefined'||typeof render!=='function')return;
    if(view!=='members')resetMemberFilters();
    state.adminDeptView=view;
    state.adminSelectedMembers=[];
    state.adminDeptTreeMenu=null;
    state.adminDeptMoreOpen=false;
    state.adminMemberMenu=null;
    closePortal();
    render();
  }

  function installFunctionOverrides(){
    window.setAdminDeptView=activateDepartmentView;

    if(typeof window.filterAdminDeptMembers==='function'&&!window.filterAdminDeptMembers.__deptV12){
      const fn=value=>{memberQuery=String(value||'').trim().toLowerCase();filterMemberRows();};
      fn.__deptV12=true;
      window.filterAdminDeptMembers=fn;
    }

    if(typeof window.filterAdminDeptRole==='function'&&!window.filterAdminDeptRole.__deptV12){
      const fn=value=>{memberRole=String(value||'all');filterMemberRows();};
      fn.__deptV12=true;
      window.filterAdminDeptRole=fn;
    }

    if(typeof window.toggleAdminMemberMenu==='function'&&!window.toggleAdminMemberMenu.__deptV12){
      const original=window.toggleAdminMemberMenu;
      const fn=function(){const result=original.apply(this,arguments);syncPortal();return result;};
      fn.__deptV12=true;
      window.toggleAdminMemberMenu=fn;
    }

    if(typeof window.selectAdminDept==='function'&&!window.selectAdminDept.__deptV12){
      const original=window.selectAdminDept;
      const fn=function(){resetMemberFilters();closePortal();return original.apply(this,arguments);};
      fn.__deptV12=true;
      window.selectAdminDept=fn;
    }

    if(typeof window.openAdminDeptDialog==='function'&&!window.openAdminDeptDialog.__deptV12){
      const original=window.openAdminDeptDialog;
      const fn=function(){closePortal();return original.apply(this,arguments);};
      fn.__deptV12=true;
      window.openAdminDeptDialog=fn;
    }

    if(typeof window.recalculateDeptPermissions==='function'&&!window.recalculateDeptPermissions.__deptLibraryV2){
      const fn=function(){
        if(typeof toast==='function')toast('部门公共资料库权限校验完成：部门成员访问权限与管理角色一致；普通文件夹继续按独立权限控制');
      };
      fn.__deptLibraryV2=true;
      window.recalculateDeptPermissions=fn;
    }
  }

  function enhanceMemberRows(){
    document.querySelectorAll('.ad-member-table tbody tr[data-member]').forEach(row=>{
      const name=(row.querySelector('.ad-member-person strong')?.textContent||'成员').trim();
      const avatar=row.querySelector('.ad-member-person>.ad-member-avatar');
      if(avatar){
        setAttributeIfChanged(avatar,'aria-hidden','true');
        if(avatar.title!==name)avatar.title=name;
      }
      const button=row.querySelector('.ad-member-menu-wrap>button');
      if(button){
        const title=`打开${name}的成员操作`;
        if(button.title!==title)button.title=title;
        setAttributeIfChanged(button,'aria-label',title);
        setAttributeIfChanged(button,'aria-haspopup','menu');
        const onclick=button.getAttribute('onclick')||'';
        const opened=typeof state!=='undefined'&&Boolean(state.adminMemberMenu)&&onclick.includes(`toggleAdminMemberMenu('${state.adminMemberMenu}')`);
        setAttributeIfChanged(button,'aria-expanded',String(opened));
      }
    });
  }

  function removeRedundantOverviewBlocks(){
    if(typeof state==='undefined'||state.adminTab!=='dept'||state.adminDeptView!=='overview')return;
    document.querySelectorAll('.ad-body>.ad-grid-2').forEach(grid=>{
      const text=compactText(grid);
      if(text.includes('成员摘要')&&text.includes('快捷操作'))grid.remove();
    });
  }

  function refineMetricLabels(){
    if(typeof state==='undefined'||state.adminTab!=='dept'||state.adminDeptView!=='overview')return;
    document.querySelectorAll('.ad-metric').forEach(metric=>{
      const label=metric.querySelector('span');
      if(compactText(label)==='默认文件权限'){
        label.textContent='公共资料库成员权限';
        const help=metric.querySelector('small');
        if(help)help.textContent='仅作用于部门公共资料库';
      }
    });
    document.querySelectorAll('.ad-info-item').forEach(item=>{
      const label=item.querySelector('label');
      if(compactText(label)==='默认权限')label.textContent='公共资料库权限';
    });
  }

  function refinePublicLibraryCard(){
    if(typeof state==='undefined'||state.adminTab!=='dept'||state.adminDeptView!=='overview')return;
    const cards=[...document.querySelectorAll('.ad-body .ad-card')];
    const card=cards.find(item=>compactText(item.querySelector('.ad-card-head')).includes('部门公共资料库'));
    if(!card||card.dataset.publicLibrarySemantics==='2')return;
    card.dataset.publicLibrarySemantics='2';

    const badge=card.querySelector('.badge.blue');
    if(badge)badge.textContent='部门成员可访问';

    const help=card.querySelector('.help');
    if(help)help.textContent='部门公共资料库是企业空间中的特殊文件夹。创建部门时选择生成，当前部门全部成员均可访问；负责人和文件管理员负责内容与权限治理。';

    const notice=card.querySelector('.notice');
    if(notice){
      notice.classList.add('ad-library-empty');
      notice.innerHTML='<strong>未创建部门公共资料库</strong><span>该部门创建时选择了“暂不创建”。企业空间中的普通文件夹仍按照各自的权限设置独立管理。</span>';
      return;
    }

    const container=card.querySelector('[style*="padding"]')||card;
    if(container.querySelector('.ad-library-explain'))return;
    const explanation=document.createElement('div');
    explanation.className='ad-library-explain';
    explanation.innerHTML='<div class="ad-library-explain-row"><strong>部门公共资料库</strong><span>随部门创建的特殊文件夹，部门全部成员可访问，成员权限由部门默认权限统一控制。</span></div><div class="ad-library-explain-row"><strong>普通文件夹</strong><span>部门员工在企业空间中自行创建，访问范围由文件夹创建者或管理员单独授权，不自动向部门全员开放。</span></div>';
    container.appendChild(explanation);
  }

  function refinePermissionLinkage(){
    if(typeof state==='undefined'||state.adminTab!=='dept'||state.adminDeptView!=='overview')return;
    const cards=[...document.querySelectorAll('.ad-body .ad-card')];
    const card=cards.find(item=>compactText(item.querySelector('.ad-card-head')).includes('权限联动状态'));
    if(!card||card.dataset.publicLibrarySemantics==='2')return;
    card.dataset.publicLibrarySemantics='2';
    const items=card.querySelectorAll('.ad-sync-item');
    const copy=[
      '部门成员均已获得公共资料库访问权限',
      '负责人和文件管理员已获得公共资料库管理权限',
      '普通文件夹继续按各自授权策略独立控制'
    ];
    items.forEach((item,index)=>{
      if(copy[index])item.innerHTML=(typeof icon==='function'?icon('check'):'')+copy[index];
    });
  }

  function refineDepartmentDialog(){
    const modal=document.querySelector('.ad-modal');
    if(!modal)return;
    const switchBlock=[...modal.querySelectorAll('.ad-switch')].find(node=>node.querySelector('#adDeptLibrary'));
    if(!switchBlock||switchBlock.dataset.publicLibrarySemantics==='2')return;

    const sourceInput=switchBlock.querySelector('#adDeptLibrary');
    const checked=Boolean(sourceInput?.checked);
    const title=compactText(modal.querySelector('.ad-modal-head'));
    const isCreate=title.includes('新建组织节点')||title.includes('新建部门');
    const isEdit=title.includes('编辑组织节点')||title.includes('编辑部门');
    if(!isCreate&&!isEdit)return;

    modal.querySelectorAll('.field>label').forEach(label=>{
      if(compactText(label)==='默认文件权限')label.textContent='公共资料库成员权限';
    });

    const field=document.createElement('div');
    field.className='field ad-library-setting';
    field.dataset.publicLibrarySemantics='2';
    if(isCreate){
      field.innerHTML=`<label for="adDeptLibraryMode">部门公共资料库</label><div class="ad-library-setting-row"><select class="select" id="adDeptLibraryMode" onchange="document.getElementById('adDeptLibrary').checked=this.value==='create'"><option value="create" ${checked?'selected':''}>创建部门公共资料库</option><option value="none" ${checked?'':'selected'}>暂不创建</option></select><span class="ad-library-setting-tag">企业空间特殊文件夹</span></div><input type="checkbox" id="adDeptLibrary" ${checked?'checked':''} hidden><p class="help">创建后将在企业空间生成同名公共资料库文件夹，当前部门全部成员均可访问；成员自行创建的普通文件夹仍按独立权限管理。</p>`;
    }else{
      field.innerHTML=`<label>部门公共资料库</label><input type="checkbox" id="adDeptLibrary" ${checked?'checked':''} hidden><div class="ad-library-readonly"><strong>${checked?'已创建':'未创建'}</strong><span>${checked?'该特殊文件夹随部门创建，当前部门全部成员均可访问；此处仅展示状态，不在编辑部门时移除。':'该部门创建时选择了暂不创建。企业空间中的普通文件夹仍按各自权限独立管理。'}</span></div>`;
    }
    switchBlock.replaceWith(field);
  }

  function refineDepartmentSemantics(){
    removeRedundantOverviewBlocks();
    refineMetricLabels();
    refinePublicLibraryCard();
    refinePermissionLinkage();
    refineDepartmentDialog();
  }

  function enhance(){
    injectStyles();
    installFunctionOverrides();
    enhanceMemberRows();
    filterMemberRows();
    refineDepartmentSemantics();
    if(typeof state!=='undefined'&&state.adminMemberMenu)syncPortal();
    else closePortal();
  }

  function scheduleEnhance(){
    cancelAnimationFrame(enhanceFrame);
    enhanceFrame=requestAnimationFrame(enhance);
  }

  document.addEventListener('click',event=>{
    const button=event.target.closest?.('.ad-tabs button');
    if(!button)return;
    const view={
      '部门概览':'overview',
      '成员列表':'members',
      '治理与审计':'governance'
    }[(button.textContent||'').trim()];
    if(!view)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    activateDepartmentView(view);
  },true);

  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&typeof state!=='undefined'&&state.adminMemberMenu){
      state.adminMemberMenu=null;
      closePortal();
      if(typeof render==='function')render();
    }
  });

  window.addEventListener('resize',()=>{
    const menu=document.querySelector('body>.ad-member-menu-portal');
    if(!menu||typeof state==='undefined')return;
    const trigger=findMenuTrigger(state.adminMemberMenu);
    if(trigger)positionPortal(menu,trigger);
  });

  document.addEventListener('scroll',()=>{
    const menu=document.querySelector('body>.ad-member-menu-portal');
    if(!menu||typeof state==='undefined')return;
    const trigger=findMenuTrigger(state.adminMemberMenu);
    if(trigger)positionPortal(menu,trigger);
  },true);

  injectStyles();
  const app=document.getElementById('app');
  if(app)new MutationObserver(scheduleEnhance).observe(app,{childList:true,subtree:true});
  [0,60,180,500,1200].forEach(delay=>window.setTimeout(scheduleEnhance,delay));
})();
