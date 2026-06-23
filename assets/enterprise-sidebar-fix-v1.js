(function(){
  'use strict';
  if (window.__enterpriseSidebarFixV1) return;
  window.__enterpriseSidebarFixV1 = true;

  var style = document.createElement('style');
  style.id = 'enterprise-sidebar-fix-v1-style';
  style.textContent = [
    '.sidebar .enterprise-org-v7,.sidebar .enterprise-org-tree-v4{min-width:0!important;max-width:none!important;overflow:visible!important;box-sizing:border-box!important}',
    '.sidebar .enterprise-dept-list-v7,.sidebar .enterprise-dept-children-v4{min-width:0!important;max-width:none!important;overflow:visible!important;box-sizing:border-box!important}',
    '.sidebar .enterprise-dept-node-v7,.sidebar .enterprise-dept-nav-v4{display:flex!important;align-items:center!important;gap:8px!important;min-width:0!important;max-width:none!important;overflow:hidden!important;box-sizing:border-box!important}',
    '.sidebar .enterprise-dept-node-v7>span,.sidebar .enterprise-dept-nav-v4>strong{display:block!important;flex:1 1 auto!important;min-width:0!important;max-width:none!important;overflow:visible!important;text-overflow:clip!important;white-space:nowrap!important;word-break:keep-all!important}',
    '.sidebar .enterprise-dept-node-v7 iconify-icon,.sidebar .enterprise-dept-nav-v4 .icon-stack,.sidebar .enterprise-dept-nav-v4>.icon{width:16px!important;min-width:16px!important;flex:0 0 16px!important}'
  ].join('');
  document.head.appendChild(style);

  var frame = 0;
  function cleanLabel(value){
    return String(value || '')
      .replace(/^企业空间\s*\/\s*/,'')
      .replace(/（.*$/,'')
      .replace(/\s*公共资料库\s*$/,'')
      .trim();
  }

  function applyFix(){
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(function(){
      var sidebar = document.querySelector('.sidebar');
      if (!sidebar) return;
      var sidebarRect = sidebar.getBoundingClientRect();

      document.querySelectorAll('.enterprise-org-v7,.enterprise-org-tree-v4').forEach(function(tree){
        var left = tree.getBoundingClientRect().left;
        var width = Math.max(142, Math.floor(sidebarRect.right - left - 8));
        tree.style.setProperty('width', width + 'px', 'important');
        tree.style.setProperty('max-width', width + 'px', 'important');
        tree.style.setProperty('overflow', 'visible', 'important');
      });

      document.querySelectorAll('.enterprise-dept-list-v7,.enterprise-dept-children-v4').forEach(function(list){
        list.style.setProperty('width', '100%', 'important');
        list.style.setProperty('max-width', 'none', 'important');
        list.style.setProperty('overflow', 'visible', 'important');
      });

      document.querySelectorAll('.enterprise-dept-node-v7,.enterprise-dept-nav-v4').forEach(function(node){
        var label = node.querySelector(':scope > span') || node.querySelector(':scope > strong') || node.querySelector('span,strong');
        if (!label) return;

        var full = cleanLabel(node.getAttribute('title') || node.getAttribute('aria-label'));
        var shown = cleanLabel(label.textContent);
        if (full && (shown.length <= 2 || /[.…]{1,3}$/.test(shown))) {
          label.textContent = full;
        }

        var left = node.getBoundingClientRect().left;
        var width = Math.max(126, Math.floor(sidebarRect.right - left - 8));
        node.style.setProperty('display', 'flex', 'important');
        node.style.setProperty('width', width + 'px', 'important');
        node.style.setProperty('min-width', width + 'px', 'important');
        node.style.setProperty('max-width', width + 'px', 'important');
        node.style.setProperty('overflow', 'hidden', 'important');

        label.style.setProperty('display', 'block', 'important');
        label.style.setProperty('flex', '1 1 auto', 'important');
        label.style.setProperty('width', 'auto', 'important');
        label.style.setProperty('min-width', '0', 'important');
        label.style.setProperty('max-width', 'none', 'important');
        label.style.setProperty('overflow', 'visible', 'important');
        label.style.setProperty('text-overflow', 'clip', 'important');
        label.style.setProperty('white-space', 'nowrap', 'important');
      });
    });
  }

  var root = document.getElementById('app') || document.body;
  new MutationObserver(applyFix).observe(root, { childList: true, subtree: true });
  window.addEventListener('resize', applyFix);
  document.addEventListener('DOMContentLoaded', applyFix, { once: true });
  setTimeout(applyFix, 0);
  setTimeout(applyFix, 120);
  setTimeout(applyFix, 500);
})();
