(()=>{const style=document.createElement('style');style.id='personal-space-v10-style';style.textContent="/* Personal space v10: align advanced dialogs with the existing white + blue system language */\n.share-v10-modal,.transfer-v10-modal{width:min(820px,calc(100vw - 36px))!important;max-width:none!important;border-radius:14px!important;overflow:hidden!important;background:#fff!important}\n.share-v10-modal .modal-head,.transfer-v10-modal .modal-head{height:58px!important;padding:0 20px!important;color:#22364b!important;background:#fff!important;border-bottom:1px solid #e8edf2!important;font-size:15px!important}\n.share-v10-modal .modal-body,.transfer-v10-modal .modal-body{padding:18px 20px!important;background:#f8fafc!important}\n.share-v10-modal .modal-foot,.transfer-v10-modal .modal-foot{padding:12px 20px!important;background:#fff!important;border-top:1px solid #e8edf2!important}\n.share-v10-file,.transfer-v10-file{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid #e3e9ef;border-radius:10px;background:#fff}\n.share-v10-file .file-symbol,.transfer-v10-file .file-symbol{width:40px;height:40px;box-shadow:none}\n.share-v10-file strong,.transfer-v10-file strong{display:block;color:#263b50;font-size:13px;font-weight:650}\n.share-v10-file span,.transfer-v10-file span{display:block;margin-top:4px;color:#8795a5;font-size:10px}\n.transfer-v10-file small{display:block;margin-top:4px;color:#9aa7b5;font-size:9px}\n.share-v10-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:14px}\n.share-v10-panel{padding:15px;border:1px solid #e3e9ef;border-radius:10px;background:#fff}\n.share-v10-panel h4{margin:0 0 13px;color:#30475d;font-size:12px;font-weight:700}\n.share-v10-panel .field{margin-top:11px}.share-v10-panel .field:first-of-type{margin-top:0}\n.share-v10-panel .field>label{color:#607286;font-size:10px}\n.share-v10-permissions{display:grid;grid-template-columns:1fr 1fr;gap:8px}\n.share-v10-permission{min-height:68px;padding:11px;border:1px solid #dfe6ed;border-radius:9px;background:#fff;color:#66798d;display:grid;grid-template-columns:18px minmax(0,1fr) 16px;gap:9px;text-align:left;transition:border-color .16s,background .16s,color .16s}\n.share-v10-permission:hover{border-color:#b9cee0;background:#fbfdff}\n.share-v10-permission.selected{border-color:#7fb1dd;background:#edf6ff;color:#1769aa}\n.share-v10-permission>.icon-stack{width:18px;height:18px}\n.share-v10-permission span strong{display:block;color:#3f556b;font-size:11px}.share-v10-permission span small{display:block;margin-top:4px;color:#96a3b0;font-size:9px;line-height:1.45}\n.share-v10-permission i{width:16px;height:16px;border-radius:50%;background:#2f7fd0;color:#fff;display:grid;place-items:center;opacity:0}.share-v10-permission.selected i{opacity:1}.share-v10-permission i .icon-stack{width:11px;height:11px}\n.share-v10-setting{display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:10px;align-items:center;min-height:50px}\n.share-v10-setting>div strong{display:block;color:#40566c;font-size:11px}.share-v10-setting>div small{display:block;margin-top:4px;color:#96a3b0;font-size:9px}\n.share-v10-status,.share-v10-fixed{font-size:9px;color:#4b6f92;white-space:nowrap}.share-v10-fixed{padding:4px 7px;border-radius:6px;background:#eef5fb;color:#3f6f99}\n.share-v10-code{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;margin:4px 0 10px}.share-v10-code.disabled{opacity:.42}\n.share-v10-policy{grid-template-columns:30px minmax(0,1fr) auto auto;padding:11px 0;border-top:1px solid #edf1f5}\n.share-v10-policy.fixed{grid-template-columns:30px minmax(0,1fr) auto}\n.share-v10-setting-icon{width:30px;height:30px;border-radius:8px;background:#eef5fb;color:#4f789d;display:grid;place-items:center}.share-v10-setting-icon .icon-stack{width:16px;height:16px}\n.share-v10-policy.disabled .share-v10-setting-icon{background:#f3f5f7;color:#9aa7b4}.share-v10-policy.disabled>div{opacity:.55}\n.system-switch{position:relative;width:36px;height:20px;display:inline-block;cursor:pointer;flex:none}.system-switch input{position:absolute;opacity:0;pointer-events:none}.system-switch span{position:absolute;inset:0;border-radius:999px;background:#cbd5df;transition:.18s}.system-switch span:after{content:\"\";position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(32,54,75,.22);transition:.18s}.system-switch input:checked+span{background:#2f7fd0}.system-switch input:checked+span:after{transform:translateX(16px)}.system-switch input:focus-visible+span{box-shadow:0 0 0 3px rgba(47,127,208,.16)}\n.share-v10-note{margin-top:12px;padding:10px 12px;border-radius:8px;background:#edf5fb;color:#5d748a;font-size:10px;line-height:1.55}\n.transfer-v10-picker{height:326px;margin-top:14px;display:grid;grid-template-columns:180px minmax(0,1fr);overflow:hidden;border:1px solid #e3e9ef;border-radius:10px;background:#fff}\n.transfer-v10-groups{padding:10px;border-right:1px solid #e8edf2;background:#f7f9fb}\n.transfer-v10-side-title{padding:2px 8px 9px;color:#96a3b0;font-size:10px}\n.transfer-v10-group{width:100%;height:38px;padding:0 9px;border:0;border-radius:8px;background:transparent;color:#607489;display:grid;grid-template-columns:17px minmax(0,1fr) auto;align-items:center;gap:8px;text-align:left}\n.transfer-v10-group:hover{background:#eef4f9}.transfer-v10-group.active{background:#eaf4ff;color:#1f6aa8;font-weight:650}.transfer-v10-group b{font-size:9px;color:#8fa0b0;font-weight:600}.transfer-v10-group .icon-stack{width:16px;height:16px}\n.transfer-v10-members{min-width:0;display:flex;flex-direction:column;background:#fff}.transfer-v10-members header{height:66px;padding:0 14px;border-bottom:1px solid #edf1f5;display:flex;align-items:center;gap:14px}.transfer-v10-members header>div{min-width:0}.transfer-v10-members header strong{display:block;color:#31495f;font-size:12px}.transfer-v10-members header span{display:block;margin-top:3px;color:#98a5b2;font-size:9px}\n.transfer-v10-search{margin-left:auto;width:230px;height:34px;border:1px solid #dfe6ed;border-radius:8px;background:#fff;display:flex;align-items:center;gap:7px;padding:0 9px;color:#8d9ba9}.transfer-v10-search:focus-within{border-color:#89b4da;box-shadow:0 0 0 3px rgba(47,127,208,.09)}.transfer-v10-search .icon-stack{width:15px;height:15px}.transfer-v10-search input{width:100%;border:0;outline:0;background:transparent;color:#42586d;font-size:10px}\n.transfer-v10-list{flex:1;min-height:0;overflow:auto;padding:8px}.transfer-v10-person{width:100%;min-height:51px;border:1px solid transparent;border-radius:8px;background:#fff;display:grid;grid-template-columns:34px minmax(0,1fr) 18px;align-items:center;gap:10px;padding:7px 10px;text-align:left}.transfer-v10-person:hover{background:#f7fafc}.transfer-v10-person.selected{border-color:#b8d4ea;background:#edf6ff}.transfer-v10-avatar{width:32px;height:32px;border-radius:8px;background:#edf4fa;color:#376d9b;display:grid;place-items:center;font-size:11px;font-weight:700}.transfer-v10-person.selected .transfer-v10-avatar{background:#dceeff;color:#1769aa}.transfer-v10-person-copy strong{display:block;color:#385066;font-size:11px}.transfer-v10-person-copy small{display:block;margin-top:4px;color:#96a3b0;font-size:9px}.transfer-v10-person i{width:18px;height:18px;color:#2f7fd0;display:grid;place-items:center;opacity:0}.transfer-v10-person.selected i{opacity:1}.transfer-v10-person i .icon-stack{width:14px;height:14px}\n.transfer-v10-selected{height:52px;margin-top:12px;padding:0 12px;border:1px solid #e3e9ef;border-radius:9px;background:#fff;display:flex;align-items:center;gap:12px}.transfer-v10-selected>span{color:#98a5b2;font-size:10px}.transfer-v10-selected>div{display:flex;align-items:center;gap:8px}.transfer-v10-selected em{font-style:normal;color:#9aa7b4;font-size:10px}.transfer-v10-selected .transfer-v10-avatar{width:28px;height:28px}.transfer-v10-selected strong{display:block;color:#3a5268;font-size:10px}.transfer-v10-selected small{display:block;margin-top:2px;color:#98a5b2;font-size:8px}\n.transfer-v10-confirm{display:flex;align-items:flex-start;gap:8px;margin-top:12px;color:#61768a;font-size:10px;line-height:1.55}.transfer-v10-confirm .check{margin-top:2px}.transfer-v10-warning{margin-top:10px!important;border-color:#ffd7d9!important;background:#fff5f5!important;color:#c84b53!important}.transfer-v10-modal .modal-foot .btn.danger:disabled{opacity:.42;cursor:not-allowed;box-shadow:none}\n@media(max-width:760px){.share-v10-grid{grid-template-columns:1fr}.transfer-v10-picker{height:auto;grid-template-columns:1fr}.transfer-v10-groups{display:flex;overflow:auto;border-right:0;border-bottom:1px solid #e8edf2}.transfer-v10-group{min-width:max-content}.transfer-v10-members{height:360px}.share-v10-modal,.transfer-v10-modal{width:calc(100vw - 20px)!important}.transfer-v10-search{width:180px}}\n";document.head.appendChild(style)})();
(()=>{
'use strict';
if(document.documentElement.dataset.personalSpaceV10)return;
document.documentElement.dataset.personalSpaceV10='1';

const directory=[
  {name:'周凯',dept:'研发中心',role:'技术架构',initial:'周'},
  {name:'刘浩',dept:'研发中心',role:'技术开发岗',initial:'刘'},
  {name:'许欣',dept:'产品设计部',role:'产品设计',initial:'许'},
  {name:'赵敏',dept:'质量保障部',role:'测试工程师',initial:'赵'},
  {name:'李晓华',dept:'综合管理部',role:'管理人员',initial:'李'},
  {name:'王璐',dept:'综合管理部',role:'文档管理员',initial:'王'},
  {name:'唐楠',dept:'运营管理部',role:'运营管理',initial:'唐'}
];
const groups=['全部成员','研发中心','产品设计部','质量保障部','综合管理部','运营管理部'];

function shell(title,body,foot,className=''){
  return `<div class="modal-layer" onclick="if(event.target===this)closeModal()"><div class="modal ${className}"><div class="modal-head">${title}<button class="btn ghost icon-only" onclick="closeModal()">${icon('x')}</button></div><div class="modal-body">${body}</div><div class="modal-foot">${foot}</div></div></div>`;
}

window.setSharePermissionV10=function(value,button){
  document.querySelectorAll('.share-v10-permission').forEach(card=>card.classList.toggle('selected',card===button));
  const input=document.getElementById('sharePermission');
  if(input)input.value=value;
};
window.toggleShareCodeV10=function(checked){
  const box=document.getElementById('shareCodeBox');
  const input=document.getElementById('shareCode');
  const status=document.getElementById('shareCodeStatus');
  if(box)box.classList.toggle('disabled',!checked);
  if(input)input.disabled=!checked;
  if(status)status.textContent=checked?'已开启':'已关闭';
};
window.toggleShareWatermarkV10=function(checked){
  const row=document.getElementById('shareWatermarkRow');
  const status=document.getElementById('shareWatermarkStatus');
  const hidden=document.getElementById('shareWatermark');
  if(row)row.classList.toggle('disabled',!checked);
  if(status)status.textContent=checked?'已开启':'已关闭';
  if(hidden)hidden.value=checked?'1':'0';
};
window.randomShareCodeV10=function(){
  const input=document.getElementById('shareCode');
  if(input)input.value=Math.random().toString(36).slice(2,6).toUpperCase();
};
window.createShareV10=function(name){
  const enabled=document.getElementById('shareCodeEnabled')?.checked;
  const input=document.getElementById('shareCode');
  if(enabled&&input&&!/^[A-Z0-9]{4}$/i.test(input.value.trim()))return toast('提取码需为 4 位字母或数字','warning');
  createShare(name);
};

function shareDialog(payload){
  const file=payload.file||personalFiles[2];
  const code=Math.random().toString(36).slice(2,6).toUpperCase();
  const body=`
    <div class="share-v10-file">${fileVisual(file)}<div><strong>${safe(file.name)}</strong><span>外链创建后可在“安全外链”中统一管理、停用和查看访问记录</span></div></div>
    <div class="share-v10-grid">
      <section class="share-v10-panel">
        <h4>基础设置</h4>
        <div class="field"><label>外链有效期</label><select class="select" id="shareExpire"><option>7 天</option><option>30 天</option><option>永久有效</option></select></div>
        <div class="field"><label>访问范围</label><select class="select" id="shareScope"><option>任何获得链接的人</option><option>仅企业成员</option></select></div>
        <div class="field"><label>访问权限</label><input id="sharePermission" type="hidden" value="预览和下载"><div class="share-v10-permissions"><button type="button" class="share-v10-permission" onclick="setSharePermissionV10('仅预览',this)">${icon('eye')}<span><strong>仅预览</strong><small>访问者只能在线查看</small></span><i>${icon('check')}</i></button><button type="button" class="share-v10-permission selected" onclick="setSharePermissionV10('预览和下载',this)">${icon('download')}<span><strong>预览和下载</strong><small>允许访问者下载原文件</small></span><i>${icon('check')}</i></button></div></div>
      </section>
      <section class="share-v10-panel">
        <h4>安全控制</h4>
        <div class="share-v10-setting">
          <div><strong>启用提取码</strong><small>访问链接时需要输入 4 位提取码</small></div>
          <span class="share-v10-status" id="shareCodeStatus">已开启</span>
          <label class="system-switch"><input id="shareCodeEnabled" type="checkbox" checked onchange="toggleShareCodeV10(this.checked)"><span></span></label>
        </div>
        <div class="share-v10-code" id="shareCodeBox"><input class="input" id="shareCode" maxlength="4" value="${code}"><button class="btn" type="button" onclick="randomShareCodeV10()">重新生成</button></div>
        <input id="shareWatermark" type="hidden" value="1">
        <div class="share-v10-setting share-v10-policy" id="shareWatermarkRow">
          <span class="share-v10-setting-icon">${icon('shield')}</span>
          <div><strong>预览水印</strong><small>显示姓名、账号与访问时间</small></div>
          <span class="share-v10-status" id="shareWatermarkStatus">已开启</span>
          <label class="system-switch"><input id="shareWatermarkEnabled" type="checkbox" checked onchange="toggleShareWatermarkV10(this.checked)"><span></span></label>
        </div>
        <div class="share-v10-setting share-v10-policy fixed">
          <span class="share-v10-setting-icon">${icon('history')}</span>
          <div><strong>访问审计</strong><small>记录访问、预览和下载行为</small></div>
          <span class="share-v10-fixed">系统记录</span>
        </div>
      </section>
    </div>
    <div class="share-v10-note">外链创建后立即生效；有效期和访问权限可在“安全外链”中继续调整。</div>`;
  const foot=`<button class="btn" onclick="closeModal()">取消</button><button class="btn primary" onclick="createShareV10('${safe(file.name)}')">创建外链</button>`;
  return shell('创建安全外链',body,foot,'wide share-v10-modal');
}

window.setTransferGroupV10=function(group,button){
  document.querySelectorAll('.transfer-v10-group').forEach(item=>item.classList.toggle('active',item===button));
  document.querySelectorAll('.transfer-v10-person').forEach(row=>{row.hidden=group!=='全部成员'&&row.dataset.dept!==group});
  const title=document.getElementById('transferV10GroupTitle');
  if(title)title.textContent=group;
  const search=document.getElementById('transferV10Search');
  if(search)search.value='';
};
window.filterTransferV10=function(value){
  const q=String(value||'').trim().toLowerCase();
  const group=document.querySelector('.transfer-v10-group.active')?.dataset.group||'全部成员';
  document.querySelectorAll('.transfer-v10-person').forEach(row=>{
    const inGroup=group==='全部成员'||row.dataset.dept===group;
    row.hidden=!(inGroup&&(!q||row.dataset.search.includes(q)));
  });
};
window.selectTransferV10=function(button){
  document.querySelectorAll('.transfer-v10-person').forEach(row=>row.classList.toggle('selected',row===button));
  const input=document.getElementById('transferMember');
  if(input)input.value=button.dataset.value;
  const summary=document.getElementById('transferV10Selected');
  if(summary)summary.innerHTML=`<span class="transfer-v10-avatar">${safe(button.dataset.initial)}</span><span><strong>${safe(button.dataset.name)}</strong><small>${safe(button.dataset.role)} · ${safe(button.dataset.dept)}</small></span>`;
  updateTransferV10State();
};
window.updateTransferV10State=function(){
  const member=document.getElementById('transferMember')?.value;
  const confirmed=document.getElementById('transferConfirm')?.checked;
  const submit=document.getElementById('transferV10Submit');
  if(submit)submit.disabled=!(member&&confirmed);
};

function transferDialog(payload){
  const file=personalFiles.find(x=>x.id===payload.id);
  const root=[file?.parent,file?.name].filter(Boolean).join('/');
  const descendants=file?personalFiles.filter(x=>{const parent=x.parent||'';return parent===root||parent.startsWith(root+'/')}):[];
  const groupHtml=groups.map((group,index)=>{const count=group==='全部成员'?directory.length:directory.filter(x=>x.dept===group).length;return `<button type="button" class="transfer-v10-group ${index===0?'active':''}" data-group="${safe(group)}" onclick="setTransferGroupV10('${safe(group)}',this)">${icon(group==='全部成员'?'users':'building')}<span>${safe(group)}</span><b>${count}</b></button>`}).join('');
  const peopleHtml=directory.map(person=>`<button type="button" class="transfer-v10-person" data-name="${safe(person.name)}" data-dept="${safe(person.dept)}" data-role="${safe(person.role)}" data-initial="${safe(person.initial)}" data-value="${safe(person.name+' · '+person.dept)}" data-search="${safe((person.name+' '+person.dept+' '+person.role).toLowerCase())}" onclick="selectTransferV10(this)"><span class="transfer-v10-avatar">${safe(person.initial)}</span><span class="transfer-v10-person-copy"><strong>${safe(person.name)}</strong><small>${safe(person.role)} · ${safe(person.dept)}</small></span><i>${icon('check')}</i></button>`).join('');
  const body=`
    <div class="transfer-v10-file">${fileVisual(file||{type:'folder'})}<div><strong>${safe(file?.name||'')}</strong><span>当前所有者：张明远（本人）</span><small>将同时转移 ${descendants.length} 个子项，目录结构保持不变</small></div></div>
    <input id="transferMember" type="hidden" value="">
    <div class="transfer-v10-picker">
      <aside class="transfer-v10-groups"><div class="transfer-v10-side-title">组织分组</div>${groupHtml}</aside>
      <section class="transfer-v10-members">
        <header><div><strong id="transferV10GroupTitle">全部成员</strong><span>选择一名在职成员作为新所有者</span></div><label class="transfer-v10-search">${icon('search')}<input id="transferV10Search" placeholder="搜索姓名、部门或岗位" oninput="filterTransferV10(this.value)"></label></header>
        <div class="transfer-v10-list">${peopleHtml}</div>
      </section>
    </div>
    <div class="transfer-v10-selected"><span>已选择</span><div id="transferV10Selected"><em>尚未选择接收成员</em></div></div>
    <label class="transfer-v10-confirm"><input class="check" id="transferConfirm" type="checkbox" onchange="updateTransferV10State()"><span>我已确认该文件夹及全部子项将转移至接收人的个人空间，原所有者将失去所有权。</span></label>
    <div class="notice danger-notice transfer-v10-warning">所有权转移不可直接撤销，该操作将记录到审计日志。</div>`;
  const foot=`<button class="btn" onclick="closeModal()">取消</button><button class="btn danger" id="transferV10Submit" disabled onclick="transferItem('${payload.id}')">确认转移</button>`;
  return shell('转移文件夹所有权',body,foot,'wide transfer-v10-modal');
}

const previousModalContent=modalContent;
modalContent=function(){
  if(!state.modal)return'';
  const {type,payload}=state.modal;
  if(type==='share')return shareDialog(payload);
  if(type==='transfer')return transferDialog(payload);
  return previousModalContent();
};
render();
})();
