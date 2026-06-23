(()=>{
  if(window.__collaborationSpaceV4Loaded)return;
  window.__collaborationSpaceV4Loaded=true;

  const removeSummaryCards=()=>{
    document.querySelectorAll('.collab-v3-summary-grid').forEach(node=>node.remove());
  };

  removeSummaryCards();

  const root=document.querySelector('#app')||document.querySelector('main')||document.body;
  const observer=new MutationObserver(()=>removeSummaryCards());
  observer.observe(root,{childList:true,subtree:true});
})();