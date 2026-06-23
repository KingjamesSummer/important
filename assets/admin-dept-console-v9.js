/* Department management v9 — stable original tree + pure blue-white theme. */
(function(){
  if(window.__adminDeptConsoleV9)return;
  window.__adminDeptConsoleV9=true;
  if(typeof state==='undefined'||typeof render!=='function')return;

  function installCss(){
    ['admin-dept-console-v4-theme','admin-dept-console-v5-theme','admin-dept-console-v6-css','admin-dept-console-v6-theme','admin-dept-console-v7-style','admin-dept-console-v8-css'].forEach(id=>document.getElementById(id)?.remove());
    if(document.getElementById('admin-dept-console-v9-css'))return;
    const link=document.createElement('link');
    link.id='admin-dept-console-v9-css';
    link.rel='stylesheet';
    link.href='assets/admin-dept-console-v9.css?v=1';
    document.head.appendChild(link);
  }

  function normalizeTree(){
    const tree=document.getElementById('adTreeScroll');
    if(!tree)return;
    tree.querySelectorAll('.ad-tree-count').forEach(node=>node.remove());
    tree.querySelectorAll('.ad-tree-node').forEach(node=>{
      node.style.removeProperty('height');
      node.style.removeProperty('min-height');
      node.style.removeProperty('max-height');
      node.style.removeProperty('margin');
      node.style.removeProperty('padding');
    });
    tree.querySelectorAll('.ad-tree-children').forEach(node=>{
      node.style.removeProperty('height');
      node.style.removeProperty('min-height');
      node.style.removeProperty('max-height');
    });
  }

  function cleanLegacyDecorations(){
    document.querySelector('.dept7-page-hero')?.remove();
    document.querySelectorAll('.dept7-metric-icon,.dept8-metric-icon').forEach(node=>node.remove());
  }

  let queued=false;
  function enhance(){
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{
      queued=false;
      const active=state.page==='admin'&&state.adminTab==='dept';
      document.body.classList.toggle('admin-console-v9',active);
      document.body.classList.remove('admin-console-v7','admin-console-v8');
      if(!active)return;
      installCss();
      cleanLegacyDecorations();
      normalizeTree();
    });
  }

  installCss();
  const app=document.getElementById('app');
  if(app)new MutationObserver(enhance).observe(app,{childList:true,subtree:true});
  enhance();
})();
