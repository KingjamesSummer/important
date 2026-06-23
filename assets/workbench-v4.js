/* Workbench v4 — scoped interactions and premium card motion. */
(function(){
  const routes={最近访问:'personal',协作空间:'collaboration',待我处理:'related',有效外链:'links'};
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function ensurePremiumMotionStyles(){
    if(!document.getElementById('workbench-v4-premium-motion')){
      const link=document.createElement('link');
      link.id='workbench-v4-premium-motion';
      link.rel='stylesheet';
      link.href='assets/workbench-v4-premium-motion.css?v=1';
      document.head.appendChild(link);
    }

    let avatars=document.getElementById('workbench-v4-avatars-v2');
    if(!avatars){
      avatars=document.createElement('link');
      avatars.id='workbench-v4-avatars-v2';
      avatars.rel='stylesheet';
      document.head.appendChild(avatars);
    }
    if(!avatars.href.endsWith('assets/workbench-v4-avatars.css?v=2')){
      avatars.href='assets/workbench-v4-avatars.css?v=2';
    }
  }

  function ensureAdminDeptV3(attempt=0){
    if(window.__adminDeptConsoleV3||document.getElementById('admin-dept-console-v3-script'))return;
    if(!window.__adminDeptConsoleV2){
      if(attempt<160)window.setTimeout(()=>ensureAdminDeptV3(attempt+1),50);
      return;
    }
    const script=document.createElement('script');
    script.id='admin-dept-console-v3-script';
    script.src='assets/admin-dept-console-v3.js?v=3';
    script.async=false;
    document.body.appendChild(script);
  }

  function ensureAdminDeptV8(attempt=0){
    if(window.__adminDeptConsoleV8||document.getElementById('admin-dept-console-v8-script'))return;
    if(!window.__adminDeptConsoleV3){
      if(attempt<180)window.setTimeout(()=>ensureAdminDeptV8(attempt+1),50);
      return;
    }
    const script=document.createElement('script');
    script.id='admin-dept-console-v8-script';
    script.src='assets/admin-dept-console-v8.js?v=1';
    script.async=false;
    document.body.appendChild(script);
  }

  function animateNumber(node){
    if(!node||node.dataset.counted==='true'||reduceMotion)return;
    const target=Number((node.textContent||'').replace(/[^0-9.]/g,''));
    if(!Number.isFinite(target))return;
    node.dataset.counted='true';
    const start=performance.now();
    const duration=520;
    const tick=now=>{
      const progress=Math.min(1,(now-start)/duration);
      const eased=1-Math.pow(1-progress,3);
      node.textContent=String(Math.round(target*eased));
      if(progress<1)requestAnimationFrame(tick);
      else node.textContent=String(target);
    };
    requestAnimationFrame(tick);
  }

  function attachMotion(card){
    if(reduceMotion)return;
    let frame=0;
    card.addEventListener('pointermove',event=>{
      if(event.pointerType==='touch')return;
      cancelAnimationFrame(frame);
      frame=requestAnimationFrame(()=>{
        const rect=card.getBoundingClientRect();
        const x=(event.clientX-rect.left)/rect.width;
        const y=(event.clientY-rect.top)/rect.height;
        const rotateY=(x-.5)*3.2;
        const rotateX=(.5-y)*2.6;
        card.style.setProperty('--mx',(x*100).toFixed(1)+'%');
        card.style.setProperty('--my',(y*100).toFixed(1)+'%');
        card.style.setProperty('--rx',rotateX.toFixed(2)+'deg');
        card.style.setProperty('--ry',rotateY.toFixed(2)+'deg');
      });
    });
    card.addEventListener('pointerleave',()=>{
      cancelAnimationFrame(frame);
      card.style.setProperty('--mx','78%');
      card.style.setProperty('--my','20%');
      card.style.setProperty('--rx','0deg');
      card.style.setProperty('--ry','0deg');
    });
  }

  function enhanceRecentTable(){
    const panel=[...document.querySelectorAll('.list-panel')].find(item=>
      (item.querySelector('.panel-title')?.textContent||'').trim()==='最近访问'
    );
    if(!panel||panel.dataset.workbenchRecent==='true')return;

    const table=panel.querySelector('.file-table');
    if(!table)return;

    const sourceHead=table.querySelector('th.owner-col');
    if(sourceHead)sourceHead.textContent='来源';

    table.querySelectorAll('tbody tr').forEach((row,index)=>{
      const sourceCell=row.querySelector('td.owner-col');
      if(!sourceCell)return;
      const fileName=(row.querySelector('.file-name-title')?.textContent||'').trim();
      const enterprise=/智能知识库总体架构方案|架构方案/.test(fileName)||index>=3;
      sourceCell.innerHTML=`<span class="wb-source-pill ${enterprise?'enterprise':''}">${enterprise?'企业空间':'个人空间'}</span>`;
    });

    panel.dataset.workbenchRecent='true';
  }

  function syncWorkbench(){
    const title=(document.querySelector('.page-title')?.textContent||'').trim();
    const active=title==='工作台';
    document.body.classList.toggle('workbench-v4',active);
    if(!active)return;

    ensurePremiumMotionStyles();
    document.querySelector('.page-head .page-actions')?.remove();
    enhanceRecentTable();

    document.querySelectorAll('.stats-grid .stat-card').forEach((card,index)=>{
      const label=(card.querySelector('.stat-top span')?.textContent||'').trim();
      const route=routes[label];
      if(!route||card.dataset.workbenchV4==='true')return;

      card.dataset.workbenchV4='true';
      card.style.setProperty('--card-index',String(index));
      card.classList.add('wb-stat-enter');
      card.tabIndex=0;
      card.setAttribute('role','button');
      card.setAttribute('aria-label','打开'+label);

      const open=()=>{
        if(typeof window.navigate==='function')window.navigate(route);
      };
      card.addEventListener('click',open);
      card.addEventListener('keydown',event=>{
        if(event.key==='Enter'||event.key===' '){
          event.preventDefault();
          open();
        }
      });

      attachMotion(card);
      animateNumber(card.querySelector('.stat-number'));
    });
  }

  const root=document.getElementById('app');
  if(root)new MutationObserver(syncWorkbench).observe(root,{childList:true,subtree:true});
  ensureAdminDeptV3();
  ensureAdminDeptV8();
  syncWorkbench();
})();
