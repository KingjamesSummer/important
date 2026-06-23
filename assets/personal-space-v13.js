(()=>{
'use strict';
if(document.documentElement.dataset.personalDropdownV13)return;
document.documentElement.dataset.personalDropdownV13='1';

const style=document.createElement('style');
style.id='personal-dropdown-v13-style';
style.textContent=`
/* Personal space v13: refined white + theme-blue dropdown system */
.smart-select-v13{position:relative;width:100%;min-width:0}
.smart-select-native-v13{position:absolute!important;inset:auto!important;width:1px!important;height:1px!important;opacity:0!important;pointer-events:none!important;margin:0!important;padding:0!important;border:0!important}
.smart-select-trigger-v13{width:100%;height:38px;padding:0 11px;border:1px solid #dce5ef;border-radius:8px;background:#fff;color:#33495f;display:grid;grid-template-columns:minmax(0,1fr) 18px;align-items:center;gap:9px;text-align:left;font-size:12px;line-height:1;box-shadow:0 1px 2px rgba(35,68,106,.025);transition:border-color .16s,box-shadow .16s,background .16s}
.smart-select-trigger-v13:hover{border-color:#b9cef0;background:#fff}
.smart-select-trigger-v13:focus-visible,.smart-select-v13.open .smart-select-trigger-v13{outline:0;border-color:#8fb8f7;box-shadow:0 0 0 3px rgba(23,105,255,.09)}
.smart-select-trigger-v13:disabled{background:#f8fafc;color:#a0adba;border-color:#e6ebf1;cursor:not-allowed}
.smart-select-label-v13{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.smart-select-chevron-v13{width:18px;height:18px;display:grid;place-items:center;color:#71849a;transition:transform .16s,color .16s}
.smart-select-v13.open .smart-select-chevron-v13{transform:rotate(180deg);color:#1769ff}
.smart-select-panel-v13{position:fixed;z-index:99999;min-width:180px;max-height:270px;padding:6px;border:1px solid #dbe5f0;border-radius:11px;background:#fff;box-shadow:0 18px 48px rgba(27,51,82,.17),0 3px 10px rgba(27,51,82,.06);overflow:auto;opacity:0;transform:translateY(-4px) scale(.985);transform-origin:top;transition:opacity .13s ease,transform .13s ease}
.smart-select-panel-v13.open{opacity:1;transform:none}
.smart-select-panel-v13.above{transform-origin:bottom}
.smart-select-option-v13{width:100%;min-height:38px;padding:0 9px;border:0;border-radius:8px;background:#fff;color:#52667c;display:grid;grid-template-columns:minmax(0,1fr) 18px;align-items:center;gap:9px;text-align:left;font-size:11px;transition:background .13s,color .13s}
.smart-select-option-v13:hover,.smart-select-option-v13.keyboard{background:#f4f8ff;color:#315f8d}
.smart-select-option-v13.selected{background:#edf5ff;color:#1769ff;font-weight:650}
.smart-select-option-v13:disabled{opacity:.42;cursor:not-allowed;background:#fff;color:#9ba8b5}
.smart-select-option-v13 span:first-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.smart-select-check-v13{width:18px;height:18px;border-radius:50%;background:#1769ff;color:#fff;display:grid;place-items:center;opacity:0;transform:scale(.82);transition:.13s}
.smart-select-option-v13.selected .smart-select-check-v13{opacity:1;transform:none}
.smart-select-check-v13 svg,.smart-select-chevron-v13 svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.smart-select-empty-v13{padding:18px 12px;text-align:center;color:#9aa7b4;font-size:11px}

/* Fallback styling before enhancement */
select.select{appearance:none;background-color:#fff!important;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23697d93' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")!important;background-repeat:no-repeat!important;background-position:right 10px center!important;padding-right:34px!important;border-color:#dce5ef!important;border-radius:8px!important}
select.select:hover{border-color:#b9cef0!important}

/* Existing personal-space dropdown menus */
.upload-method-pop,.personal-bulk-menu,.personal-file-menu{border:1px solid #dbe5f0!important;border-radius:12px!important;background:#fff!important;box-shadow:0 18px 48px rgba(27,51,82,.16),0 3px 10px rgba(27,51,82,.05)!important;padding:7px!important;overflow:hidden!important}
.upload-method-pop{width:284px!important}
.upload-method-pop button,.personal-bulk-menu button,.personal-file-menu .menu-item{border-radius:9px!important;background:#fff!important;color:#52667c!important;transition:background .13s,color .13s,border-color .13s!important}
.upload-method-pop button:hover,.personal-bulk-menu button:hover,.personal-file-menu .menu-item:hover{background:#edf5ff!important;color:#1769ff!important}
.upload-method-pop button+button,.personal-bulk-menu button+button{margin-top:2px}
.upload-method-pop button>.icon-stack{width:34px!important;height:34px!important;border-radius:9px!important;background:#f4f8ff!important;border:1px solid #dbe8ff!important;color:#1769ff!important}
.upload-method-pop button:nth-child(2)>.icon-stack{background:#fff8ef!important;border-color:#ffe0b5!important;color:#d97706!important}
.upload-method-pop button:hover>.icon-stack{background:#fff!important;border-color:#b8d0f8!important;color:#1769ff!important}
.upload-method-pop button:nth-child(2):hover>.icon-stack{background:#fff!important;border-color:#ffc978!important;color:#c96a00!important}
.personal-bulk-menu button>.icon-stack,.personal-file-menu .menu-item>.icon-stack{background:#f6f9fd!important;color:#52708f!important;border:1px solid #e3eaf2!important}
.personal-bulk-menu button:hover>.icon-stack,.personal-file-menu .menu-item:hover>.icon-stack{background:#fff!important;color:#1769ff!important;border-color:#bfd3f8!important}
.personal-bulk-menu button.danger:hover,.personal-file-menu .menu-item.danger:hover{background:#fff3f4!important;color:#d94b58!important}
.personal-bulk-menu button.danger>.icon-stack,.personal-file-menu .menu-item.danger>.icon-stack{background:#fff7f7!important;border-color:#ffd9dd!important;color:#d94b58!important}
.personal-bulk-menu .menu-sep,.personal-file-menu .menu-sep{height:1px!important;margin:6px 4px!important;background:#edf1f6!important}

@media(max-width:760px){.smart-select-panel-v13{max-width:calc(100vw - 20px)}}
`;
document.head.appendChild(style);

const chevron=`<span class="smart-select-chevron-v13" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m7 10 5 5 5-5"/></svg></span>`;
const check=`<span class="smart-select-check-v13" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m7 12 3 3 7-7"/></svg></span>`;
let active=null;

function eligible(select){
  if(!(select instanceof HTMLSelectElement)||select.dataset.smartSelectV13==='1')return false;
  if(!select.matches('select.select,.personal-panel select,.filter-pop select,.share-v10-modal select,.share-v9-modal select'))return false;
  return true;
}
function selectedOption(select){return select.options[select.selectedIndex]||select.options[0]||null}
function syncControl(select){
  const wrap=select.closest('.smart-select-v13');
  const trigger=wrap?.querySelector('.smart-select-trigger-v13');
  const label=trigger?.querySelector('.smart-select-label-v13');
  const option=selectedOption(select);
  if(label)label.textContent=option?.textContent?.trim()||'请选择';
  if(trigger){trigger.disabled=select.disabled;trigger.title=label?.textContent||''}
}
function closeDropdown(focus=false){
  if(!active)return;
  const {wrap,trigger,panel}=active;
  wrap?.classList.remove('open');
  trigger?.setAttribute('aria-expanded','false');
  panel?.classList.remove('open');
  const remove=()=>panel?.remove();
  window.setTimeout(remove,130);
  if(focus&&trigger?.isConnected)trigger.focus();
  active=null;
}
function positionPanel(trigger,panel){
  if(!trigger.isConnected)return closeDropdown();
  const rect=trigger.getBoundingClientRect();
  const gap=6;
  const width=Math.max(rect.width,180);
  panel.style.width=`${Math.min(width,window.innerWidth-20)}px`;
  panel.style.left=`${Math.max(10,Math.min(rect.left,window.innerWidth-Math.min(width,window.innerWidth-20)-10))}px`;
  panel.style.maxHeight=`${Math.min(270,window.innerHeight-24)}px`;
  const estimated=Math.min(panel.scrollHeight||220,270);
  const below=window.innerHeight-rect.bottom-gap;
  const above=rect.top-gap;
  const openAbove=below<Math.min(estimated,170)&&above>below;
  panel.classList.toggle('above',openAbove);
  panel.style.top=openAbove?`${Math.max(10,rect.top-estimated-gap)}px`:`${Math.min(window.innerHeight-estimated-10,rect.bottom+gap)}px`;
}
function markKeyboard(panel,index){
  const options=[...panel.querySelectorAll('.smart-select-option-v13:not(:disabled)')];
  options.forEach((node,i)=>node.classList.toggle('keyboard',i===index));
  options[index]?.scrollIntoView({block:'nearest'});
  return options;
}
function choose(select,value){
  if(select.value!==value){select.value=value;select.dispatchEvent(new Event('change',{bubbles:true}))}
  syncControl(select);
  closeDropdown(true);
}
function openDropdown(select,wrap,trigger){
  if(select.disabled)return;
  if(active?.select===select)return closeDropdown(true);
  closeDropdown();
  const panel=document.createElement('div');
  panel.className='smart-select-panel-v13';
  panel.setAttribute('role','listbox');
  panel.setAttribute('aria-label',select.getAttribute('aria-label')||select.closest('.field')?.querySelector('label')?.textContent?.trim()||'下拉选项');
  const options=[...select.options];
  if(!options.length)panel.innerHTML='<div class="smart-select-empty-v13">暂无可选项</div>';
  else panel.innerHTML=options.map(option=>`<button type="button" class="smart-select-option-v13 ${option.selected?'selected':''}" role="option" aria-selected="${option.selected?'true':'false'}" data-value="${String(option.value).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}" ${option.disabled?'disabled':''}><span>${String(option.textContent||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</span>${check}</button>`).join('');
  document.body.appendChild(panel);
  active={select,wrap,trigger,panel,index:Math.max(0,options.findIndex(option=>option.selected))};
  wrap.classList.add('open');
  trigger.setAttribute('aria-expanded','true');
  panel.querySelectorAll('.smart-select-option-v13').forEach(button=>button.addEventListener('click',event=>{event.stopPropagation();choose(select,button.dataset.value)}));
  positionPanel(trigger,panel);
  requestAnimationFrame(()=>panel.classList.add('open'));
  const current=panel.querySelector('.smart-select-option-v13.selected');
  current?.scrollIntoView({block:'nearest'});
}
function enhance(select){
  if(!eligible(select))return;
  select.dataset.smartSelectV13='1';
  const wrap=document.createElement('div');
  wrap.className='smart-select-v13';
  select.parentNode.insertBefore(wrap,select);
  wrap.appendChild(select);
  select.classList.add('smart-select-native-v13');
  const trigger=document.createElement('button');
  trigger.type='button';
  trigger.className='smart-select-trigger-v13';
  trigger.setAttribute('aria-haspopup','listbox');
  trigger.setAttribute('aria-expanded','false');
  trigger.innerHTML=`<span class="smart-select-label-v13"></span>${chevron}`;
  wrap.appendChild(trigger);
  syncControl(select);
  trigger.addEventListener('click',event=>{event.stopPropagation();openDropdown(select,wrap,trigger)});
  trigger.addEventListener('keydown',event=>{
    if(['Enter',' ','ArrowDown','ArrowUp'].includes(event.key)&&!active){event.preventDefault();openDropdown(select,wrap,trigger);return}
    if(!active||active.select!==select)return;
    const enabled=[...active.panel.querySelectorAll('.smart-select-option-v13:not(:disabled)')];
    if(event.key==='Escape'){event.preventDefault();closeDropdown(true);return}
    if(event.key==='ArrowDown'||event.key==='ArrowUp'){
      event.preventDefault();
      const current=enabled.findIndex(node=>node.classList.contains('keyboard'));
      const selected=enabled.findIndex(node=>node.classList.contains('selected'));
      const base=current>=0?current:selected>=0?selected:0;
      active.index=(base+(event.key==='ArrowDown'?1:-1)+enabled.length)%enabled.length;
      markKeyboard(active.panel,active.index);
    }else if(event.key==='Enter'){
      event.preventDefault();
      const target=enabled.find(node=>node.classList.contains('keyboard'))||enabled.find(node=>node.classList.contains('selected'))||enabled[0];
      if(target)choose(select,target.dataset.value);
    }
  });
  select.addEventListener('change',()=>syncControl(select));
}
function scan(root=document){root.querySelectorAll?.('select').forEach(enhance)}

document.addEventListener('click',event=>{if(active&&!active.panel.contains(event.target)&&!active.trigger.contains(event.target))closeDropdown()});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&active)closeDropdown(true)});
window.addEventListener('resize',()=>active&&positionPanel(active.trigger,active.panel));
window.addEventListener('scroll',()=>active&&closeDropdown(),true);

const app=document.getElementById('app')||document.body;
new MutationObserver(records=>{
  records.forEach(record=>record.addedNodes.forEach(node=>{if(node.nodeType===1){enhance(node);scan(node)}}));
  if(active&&!active.trigger.isConnected)closeDropdown();
}).observe(app,{childList:true,subtree:true});
scan(document);
})();
