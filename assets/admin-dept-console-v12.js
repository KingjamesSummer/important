/* Department management v12 — flat theme, stable member avatars and reliable tabs. */
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
`;
    document.head.appendChild(style);
  }

  function setAttributeIfChanged(node,name,value){
    if(node&&node.getAttribute(name)!==value)node.setAttribute(name,value);
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
    let left=Math.min(window.innerWidth-202,Math.max(12,rect.right-190));
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

  function enhance(){
    injectStyles();
    installFunctionOverrides();
    enhanceMemberRows();
    filterMemberRows();
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
