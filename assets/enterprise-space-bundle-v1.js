/* Load the existing enterprise semantic layer before the action layer. */
(()=>{
  if(window.__enterpriseSpaceBundleV1)return;
  window.__enterpriseSpaceBundleV1=true;
  const load=src=>new Promise((resolve,reject)=>{
    const script=document.createElement('script');
    script.src=src;
    script.async=false;
    script.onload=resolve;
    script.onerror=()=>reject(new Error(`企业空间脚本加载失败：${src}`));
    document.head.appendChild(script);
  });
  load('assets/enterprise-space-v2.js?v=2')
    .then(()=>load('assets/enterprise-space-actions-v1.js?v=1'))
    .catch(error=>{
      console.error(error);
      if(typeof toast==='function')toast('企业空间交互加载失败，请刷新重试','warning');
    });
})();
