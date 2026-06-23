(()=>{
  if(document.documentElement.dataset.personalSpaceV11)return;
  document.documentElement.dataset.personalSpaceV11='1';

  const style=document.createElement('style');
  style.id='personal-space-v11-style';
  style.textContent=`
  /* Personal space v11: pure white surfaces + system-blue selection */
  .share-v10-modal,.transfer-v10-modal{--ps-blue:#1769ff;--ps-blue-soft:#edf5ff;--ps-blue-line:#9fc2f8;--ps-line:#dfe7f1;--ps-text:#2d4059;--ps-muted:#7f8fa3;background:#fff!important}
  .share-v10-modal .modal-head,.transfer-v10-modal .modal-head,
  .share-v10-modal .modal-body,.transfer-v10-modal .modal-body,
  .share-v10-modal .modal-foot,.transfer-v10-modal .modal-foot{background:#fff!important}
  .share-v10-file,.transfer-v10-file,.share-v10-panel,.transfer-v10-picker,
  .transfer-v10-groups,.transfer-v10-members,.transfer-v10-selected{background:#fff!important}
  .share-v10-grid,.transfer-v10-picker{gap:14px}
  .share-v10-panel,.share-v10-file,.transfer-v10-file,.transfer-v10-picker,.transfer-v10-selected{border-color:var(--ps-line)!important;box-shadow:none!important}
  .share-v10-note{background:#fff!important;border:1px solid #dbe8ff!important;border-left:3px solid var(--ps-blue)!important;color:#60758b!important;padding:10px 12px!important}
  .share-v10-permission{background:#fff!important;border-color:var(--ps-line)!important;color:#60758b!important}
  .share-v10-permission:hover{background:#fff!important;border-color:#b7cff5!important;box-shadow:0 0 0 3px rgba(23,105,255,.06)}
  .share-v10-permission.selected{background:var(--ps-blue-soft)!important;border-color:var(--ps-blue-line)!important;color:var(--ps-blue)!important;box-shadow:inset 0 0 0 1px rgba(23,105,255,.04)}
  .share-v10-permission.selected i{background:var(--ps-blue)!important}
  .share-v10-setting-icon{background:#fff!important;border:1px solid #dbe8ff!important;color:var(--ps-blue)!important}
  .share-v10-policy.disabled .share-v10-setting-icon{background:#fff!important;border-color:#e5eaf0!important;color:#9aa8b7!important}
  .share-v10-status{color:var(--ps-blue)!important}.share-v10-fixed{background:#fff!important;border:1px solid #dbe8ff!important;color:var(--ps-blue)!important}
  .system-switch span{background:#cbd5e1!important}.system-switch input:checked+span{background:var(--ps-blue)!important}
  .system-switch input:focus-visible+span{box-shadow:0 0 0 3px rgba(23,105,255,.15)!important}
  .transfer-v10-groups{border-right-color:var(--ps-line)!important}
  .transfer-v10-group{background:#fff!important;color:#5f7288!important}
  .transfer-v10-group:hover{background:#f8fbff!important;color:#315f8d!important}
  .transfer-v10-group.active{background:var(--ps-blue-soft)!important;color:var(--ps-blue)!important;box-shadow:inset 3px 0 var(--ps-blue)!important}
  .transfer-v10-person{background:#fff!important;border-color:transparent!important}
  .transfer-v10-person:hover{background:#f8fbff!important;border-color:#e5edf7!important}
  .transfer-v10-person.selected{background:var(--ps-blue-soft)!important;border-color:var(--ps-blue-line)!important;box-shadow:inset 3px 0 var(--ps-blue)!important}
  .transfer-v10-avatar{background:#fff!important;border:1px solid #cfe0ff!important;color:var(--ps-blue)!important}
  .transfer-v10-person.selected .transfer-v10-avatar{background:var(--ps-blue)!important;border-color:var(--ps-blue)!important;color:#fff!important}
  .transfer-v10-person i{color:var(--ps-blue)!important}
  .transfer-v10-search{background:#fff!important}.transfer-v10-search:focus-within{border-color:var(--ps-blue-line)!important;box-shadow:0 0 0 3px rgba(23,105,255,.08)!important}
  .transfer-v10-warning{background:#fff7f7!important;border:1px solid #ffd8dc!important;color:#c84b53!important}

  /* Always-visible folder artwork; no dependency on the online icon response */
  .file-symbol.folder{background:#fff!important;border-color:#e1e8f0!important;box-shadow:none!important}
  .file-symbol-folder-v11 svg{width:28px;height:28px;display:block}
  .file-symbol-folder-v11 .file-fallback{display:none!important}
  .share-v10-file .file-symbol-folder-v11 svg,.transfer-v10-file .file-symbol-folder-v11 svg{width:29px;height:29px}

  /* Access column: white chips, clear blue emphasis, no green tint */
  .access-pill{height:28px!important;min-width:84px!important;padding:0 10px!important;border:1px solid #dfe7f1!important;border-radius:8px!important;background:#fff!important;color:#65768a!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:6px!important;font-size:11px!important;font-weight:550!important;line-height:1!important;box-shadow:0 1px 2px rgba(35,68,106,.025)!important;white-space:nowrap!important}
  .access-pill .icon-stack,.access-pill>.icon{width:15px!important;height:15px!important}
  .access-pill.access-private{background:#fff!important;border-color:#e1e8f0!important;color:#68798c!important}
  .access-pill.access-link{background:#f7fbff!important;border-color:#bad4ff!important;color:var(--primary,#1769ff)!important}
  .access-pill.access-shared{background:#edf5ff!important;border-color:#a9c9ff!important;color:#1769ff!important}
  .access-pill:hover{border-color:#9fc2f8!important;box-shadow:0 4px 12px rgba(23,105,255,.07)!important}
  .file-card-access .access-pill{min-width:78px!important}

  @media(max-width:760px){.share-v10-modal .modal-body,.transfer-v10-modal .modal-body{background:#fff!important}}
  `;
  document.head.appendChild(style);

  const baseFileVisual=window.fileVisual||fileVisual;
  const folderVisual=()=>`<span class="file-symbol folder file-symbol-folder-v11" aria-label="文件夹"><svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#f3b63f" d="M3.5 8.6A2.6 2.6 0 0 1 6.1 6h7l2.35 2.5H25.9a2.6 2.6 0 0 1 2.6 2.6v1.2h-25z"/><path fill="#e4a42d" d="M3.5 11.4h25v12A2.6 2.6 0 0 1 25.9 26H6.1a2.6 2.6 0 0 1-2.6-2.6z"/><path fill="#ffd36f" d="M4.9 12.8h22.2v9.7a2 2 0 0 1-2 2H6.9a2 2 0 0 1-2-2z"/></svg><span class="file-fallback">文件夹</span></span>`;
  const nextFileVisual=function(file){return file?.type==='folder'?folderVisual():baseFileVisual(file)};
  window.fileVisual=nextFileVisual;
  try{fileVisual=nextFileVisual}catch(error){}

  if(typeof render==='function')render();
})();
