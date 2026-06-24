/* Administrator settings workspace 2026.06.24 — scoped to admin/grant; no gradients. */
(async()=>{
  try{
    const fallbackRevision='778d0580ca085b52c0c4377540642a279dac3806';
    const names=[1,2,3,4,5,6].map(i=>`admin-grant-workspace-src.part${String(i).padStart(2,'0')}.txt`);
    const read=async name=>{
      const urls=[
        `assets/${name}?v=20260624-2`,
        `https://cdn.jsdelivr.net/gh/KingjamesSummer/important@main/assets/${name}?v=20260624-2`,
        `https://raw.githubusercontent.com/KingjamesSummer/important/main/assets/${name}`,
        `https://cdn.jsdelivr.net/gh/KingjamesSummer/important@${fallbackRevision}/assets/${name}`,
        `https://raw.githubusercontent.com/KingjamesSummer/important/${fallbackRevision}/assets/${name}`
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
    let source=parts.join('')
      .replaceAll('window.state?.page','state?.page')
      .replace("typeof window.adminContent!=='function'||!window.state","typeof window.adminContent!=='function'||typeof state==='undefined'");
    source=source.replace(
      "query(v){S.f.q=v;document.querySelector('.admin-content').innerHTML=page()}",
      "query(v){S.f.q=v;document.querySelector('.admin-content').innerHTML=page();requestAnimationFrame(()=>{const input=document.querySelector('#ag input[aria-label=\"搜索管理员\"]');if(input){input.focus();input.setSelectionRange(input.value.length,input.value.length)}})}"
    );
    source=source.replace(
      "if(w.step===4&&!w.ok)w.err='请确认授权边界和影响。';ov();",
      "if(w.step===4&&!w.ok)w.err='请确认授权边界和影响。';if(w.mode==='create'&&w.uid&&S.admins.some(a=>a.uid===w.uid&&a.type===w.type))w.err='该成员已拥有相同管理员授权。';ov();"
    );
    source=source.replace(
      `<dt>状态</dt><dd>\${w.status==='active'?'立即启用并刷新会话':'保存为停用状态'}</dd>`,
      `<dt>授权状态</dt><dd><button class="ag-child \${w.status==='active'?'on':''}" onclick="AdminGrant.toggleWizardStatus()">\${w.status==='active'?'立即启用':'保存为停用'}</button><div class="ag-help">权限变更后立即生效；停用不删除成员账号。</div></dd>`
    );
    source=source.replace(
      "confirm(){S.w.ok=!S.w.ok;S.w.err='';ov()},save(){",
      "confirm(){S.w.ok=!S.w.ok;S.w.err='';ov()},toggleWizardStatus(){S.w.status=S.w.status==='active'?'disabled':'active';S.w.err='';ov()},save(){"
    );
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
