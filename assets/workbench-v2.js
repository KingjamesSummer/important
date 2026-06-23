/* Workbench-only interaction refinement. */
(function(){
  const routes=['personal','collaboration','related','links'];

  function enhanceWorkbench(){
    const title=document.querySelector('.page-title');
    const isWorkbench=(title?.textContent||'').trim()==='工作台';
    document.body.classList.toggle('workbench-v2',isWorkbench);
    if(!isWorkbench)return;

    const actions=document.querySelector('.page-head .page-actions');
    if(actions)actions.remove();

    document.querySelectorAll('.stats-grid .stat-card').forEach((card,index)=>{
      if(card.dataset.workbenchEnhanced==='true')return;
      card.dataset.workbenchEnhanced='true';
      card.tabIndex=0;
      card.setAttribute('role','button');
      card.setAttribute('aria-label',`打开${(card.querySelector('.stat-top span')?.textContent||'对应模块').trim()}`);
      card.addEventListener('click',()=>{
        if(typeof navigate==='function')navigate(routes[index]||'workbench');
      });
      card.addEventListener('keydown',event=>{
        if(event.key==='Enter'||event.key===' '){
          event.preventDefault();
          if(typeof navigate==='function')navigate(routes[index]||'workbench');
        }
      });
    });
  }

  const root=document.getElementById('app');
  if(root)new MutationObserver(enhanceWorkbench).observe(root,{childList:true,subtree:true});
  document.addEventListener('DOMContentLoaded',enhanceWorkbench,{once:true});
  enhanceWorkbench();
})();
