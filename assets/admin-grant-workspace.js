/* Administrator settings workspace 2026.06.24 — scoped to admin/grant; no gradients. */
(async()=>{
  try{
    const revision='778d0580ca085b52c0c4377540642a279dac3806';
    const names=[1,2,3,4,5,6].map(i=>`admin-grant-workspace-src.part${String(i).padStart(2,'0')}.txt`);
    const read=async name=>{
      const urls=[
        `https://cdn.jsdelivr.net/gh/KingjamesSummer/important@${revision}/assets/${name}`,
        `https://raw.githubusercontent.com/KingjamesSummer/important/${revision}/assets/${name}`
      ];
      for(const url of urls){
        try{
          const response=await fetch(url,{cache:'no-store'});
          if(response.ok)return response.text();
        }catch(error){}
      }
      throw new Error(`管理员设置资源加载失败：${name}`);
    };
    const parts=await Promise.all(names.map(read));
    const source=parts.join('')
      .replaceAll('window.state?.page','state?.page')
      .replace("typeof window.adminContent!=='function'||!window.state","typeof window.adminContent!=='function'||typeof state==='undefined'");
    const script=document.createElement('script');
    script.src=URL.createObjectURL(new Blob([source],{type:'text/javascript'}));
    script.onload=()=>URL.revokeObjectURL(script.src);
    script.onerror=()=>window.toast?.('管理员设置脚本执行失败，请刷新后重试','error');
    document.head.appendChild(script);
  }catch(error){
    console.error('管理员设置工作台加载失败',error);
    window.toast?.('管理员设置加载失败，请刷新后重试','error');
  }
})();
