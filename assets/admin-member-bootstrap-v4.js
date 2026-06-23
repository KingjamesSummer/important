/* Loads the stable prototype and applies member-management theme and hierarchy assets. */
(async function(){
  const revision='1ac99de78e4af6875f73cf446f8659b074b0f68d';
  const sources=[
    `https://cdn.jsdelivr.net/gh/KingjamesSummer/important@${revision}/web-prototype.html`,
    `https://raw.githubusercontent.com/KingjamesSummer/important/${revision}/web-prototype.html`
  ];
  let source='';
  for(const url of sources){
    try{
      const response=await fetch(url,{cache:'no-store'});
      if(response.ok){source=await response.text();break;}
    }catch(error){}
  }
  if(!source)throw new Error('成员管理基础版本加载失败');

  const systemBlueTheme=`<style id="member-system-blue-v4">
body.admin-console-v1{background:#f6f9fd!important}
body.admin-console-v1 .app{background:#f6f9fd!important}
body.admin-console-v1 .main{background:linear-gradient(180deg,#f8fbff 0%,#f3f7fd 100%)!important}
body.admin-console-v1 .sidebar{border-right-color:#e1e9f5!important}
body.admin-console-v1 .nav-item:hover{background:#f4f8ff!important;color:#356ca8!important}
body.admin-console-v1 .nav-item.active{background:#eef5ff!important;color:#2563eb!important;border-color:#dbeafe!important}
body.admin-console-v1 .nav-item.active:before{background:#2563eb!important;box-shadow:none!important}
body.admin-console-v1 .admin-console-scope{border-color:#dbe7f5!important;background:#f8fbff!important}
body.admin-console-v1 .admin-console-scope strong{color:#334e71!important}
body.admin-console-v1 .admin-console-return:hover{border-color:#bfd6f5!important;background:#f5f9ff!important;color:#2563eb!important}
body.admin-console-v1 .btn.primary{background:#2563eb!important;border-color:#2563eb!important;box-shadow:0 6px 16px rgba(37,99,235,.16)!important}
body.admin-console-v1 .btn.primary:hover{background:#1d4ed8!important;border-color:#1d4ed8!important}
body.admin-console-v1 .badge.blue{background:#eff6ff!important;color:#2563eb!important}
body.admin-console-v1 .search-box:focus-within,body.admin-console-v1 .global-search:focus-within{border-color:#93c5fd!important;box-shadow:0 0 0 3px rgba(37,99,235,.08)!important}
body.admin-console-v1 .page-title,body.admin-console-v1 .admin-head h3{color:#172b4d!important}
</style>`;
  const polishCss='<link rel="stylesheet" href="assets/admin-member-polish-v2.css?v=4">';
  const styleNeedle="  const memberStyles=memberPatch.slice(0,splitAt);";
  const styleReplacement="  const memberStyles=memberPatch.slice(0,splitAt)+"+JSON.stringify(systemBlueTheme+polishCss)+";";
  if(!source.includes(styleNeedle))throw new Error('成员管理样式补丁结构不兼容');
  source=source.replace(styleNeedle,styleReplacement);

  const oldOrder="    \"  html=html.replace('</body>','<scr'+'ipt src=\\\"assets/admin-dept-console-v1.js?v=1\\\"></scr'+'ipt>'+memberAdminScript+'</body>');\\n\";";
  const newOrder="    \"  html=html.replace('</body>',memberAdminScript+'<scr'+'ipt src=\\\"assets/admin-dept-console-v1.js?v=1\\\"></scr'+'ipt><scr'+'ipt src=\\\"assets/admin-member-polish-v3.js?v=4\\\"></scr'+'ipt></body>');\\n\";";
  if(!source.includes(oldOrder))throw new Error('成员管理脚本顺序补丁结构不兼容');
  source=source.replace(oldOrder,newOrder);

  document.open();
  document.write(source);
  document.close();
})().catch(function(error){
  document.body.innerHTML='<div class="loader"><strong>原型载入失败</strong><small>'+String(error.message||error)+'</small></div>';
});
