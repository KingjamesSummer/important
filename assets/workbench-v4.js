/* Workbench v4 — scoped interactions and layout hooks. */
(function(){
  const routes={最近访问:'personal',协作空间:'collaboration',待我处理:'related',有效外链:'links'};

  function syncWorkbench(){
    const title=(document.querySelector('.page-title')?.textContent||'').trim();
    const active=title==='工作台';
    document.body.classList.toggle('workbench-v4',active);
    if(!active)return;

    document.querySelector('.page-head .page-actions')?.remove();

    document.querySelectorAll('.stats-grid .stat-card').forEach(card=>{
      const label=(card.querySelector('.stat-top span')?.textContent||'').trim();
      const route=routes[label];
      if(!route||card.dataset.workbenchV4==='true')return;

      card.dataset.workbenchV4='true';
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
    });
  }

  const root=document.getElementById('app');
  if(root)new MutationObserver(syncWorkbench).observe(root,{childList:true,subtree:true});
  syncWorkbench();
})();
