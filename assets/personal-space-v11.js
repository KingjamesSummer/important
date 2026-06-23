(()=>{
  if(document.documentElement.dataset.personalSpaceV11)return;
  document.documentElement.dataset.personalSpaceV11='1';

  const style=document.createElement('style');
  style.id='personal-space-v11-style';
  style.textContent=`
  /* Personal space v11.2: pure white surfaces, vivid tags and clear permission states */
  :root{--ps-blue:#1769ff;--ps-blue-soft:#edf5ff;--ps-blue-line:#9fc2f8;--ps-violet:#6d5dfc;--ps-violet-soft:#f5f2ff;--ps-violet-line:#cfc7ff;--ps-line:#dfe7f1;--ps-text:#2d4059;--ps-muted:#7f8fa3}

  /* Advanced dialogs: remove every grey-green surface */
  .share-v10-modal,.transfer-v10-modal,.destination-v9-modal{background:#fff!important}
  .share-v10-modal .modal-head,.transfer-v10-modal .modal-head,.destination-v9-modal .modal-head,
  .share-v10-modal .modal-body,.transfer-v10-modal .modal-body,.destination-v9-modal .modal-body,
  .share-v10-modal .modal-foot,.transfer-v10-modal .modal-foot,.destination-v9-modal .modal-foot{background:#fff!important}
  .share-v10-file,.transfer-v10-file,.share-v10-panel,.transfer-v10-picker,
  .transfer-v10-groups,.transfer-v10-members,.transfer-v10-selected,
  .destination-v9-layout,.destination-v9-spaces,.destination-v9-browser{background:#fff!important}
  .share-v10-grid,.transfer-v10-picker{gap:14px}
  .share-v10-panel,.share-v10-file,.transfer-v10-file,.transfer-v10-picker,.transfer-v10-selected,
  .destination-v9-layout{border-color:var(--ps-line)!important;box-shadow:none!important}
  .share-v10-note,.destination-v9-footer-note{background:#fff!important;border:1px solid #d8e6ff!important;border-left:3px solid var(--ps-blue)!important;color:#60758b!important;padding:10px 12px!important}
  .destination-v9-footer-note>strong{color:#536b82!important}.destination-v9-footer-note b{color:var(--ps-blue)!important}

  /* External-link dialog */
  .share-v10-permission{background:#fff!important;border-color:var(--ps-line)!important;color:#60758b!important}
  .share-v10-permission:hover{background:#fff!important;border-color:#b7cff5!important;box-shadow:0 0 0 3px rgba(23,105,255,.06)}
  .share-v10-permission.selected{background:var(--ps-blue-soft)!important;border-color:var(--ps-blue-line)!important;color:var(--ps-blue)!important;box-shadow:inset 0 0 0 1px rgba(23,105,255,.04)}
  .share-v10-permission.selected i{background:var(--ps-blue)!important}
  .share-v10-setting-icon{background:#fff!important;border:1px solid #dbe8ff!important;color:var(--ps-blue)!important}
  .share-v10-policy.disabled .share-v10-setting-icon{background:#fff!important;border-color:#e5eaf0!important;color:#9aa8b7!important}
  .share-v10-status{color:var(--ps-blue)!important}.share-v10-fixed{background:#fff!important;border:1px solid #dbe8ff!important;color:var(--ps-blue)!important}
  .system-switch span{background:#cbd5e1!important}.system-switch input:checked+span{background:var(--ps-blue)!important}
  .system-switch input:focus-visible+span{box-shadow:0 0 0 3px rgba(23,105,255,.15)!important}

  /* Ownership member picker */
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

  /* Move / copy destination dialog */
  .destination-v9-spaces{border-right-color:var(--ps-line)!important}
  .destination-space-item{background:#fff!important;color:#5f7288!important}
  .destination-space-item:hover{background:#f8fbff!important;color:#315f8d!important}
  .destination-space-item.active{background:var(--ps-blue-soft)!important;color:var(--ps-blue)!important;box-shadow:inset 3px 0 var(--ps-blue)!important}
  .destination-v9-browser-head{background:#fff!important;border-bottom-color:#e8eef7!important}
  .destination-v9-search{background:#fff!important;border-color:#dce5ef!important}
  .destination-v9-search:focus-within{border-color:var(--ps-blue-line)!important;box-shadow:0 0 0 3px rgba(23,105,255,.08)!important}
  .destination-v9-tree,.destination-v9-pane{background:#fff!important}
  .destination-v9-row{background:#fff!important;color:#566b81!important}
  .destination-v9-row:hover{background:#f8fbff!important}
  .destination-v9-row.selected{background:var(--ps-blue-soft)!important;color:var(--ps-blue)!important;box-shadow:inset 3px 0 var(--ps-blue)!important}
  .destination-v9-row>.icon-stack{color:#5e7c9a!important}.destination-v9-row.selected>.icon-stack{color:var(--ps-blue)!important}
  .destination-v9-check{background:transparent!important;color:var(--ps-blue)!important;border-radius:0!important}

  /* Tag dialog: white body and brighter, more legible tags */
  .modal:has(.tag-editor),.modal:has(.tag-editor) .modal-head,.modal:has(.tag-editor) .modal-body,.modal:has(.tag-editor) .modal-foot{background:#fff!important}
  .tag-editor-head>span{background:#fff!important;border:1px solid #cfe0ff!important;color:var(--ps-blue)!important}
  .tag-option{background:#fff!important;border-color:#dce5ef!important;color:#607389!important;box-shadow:none!important}
  .tag-option:hover{border-color:#abc8f7!important;color:var(--ps-blue)!important;background:#f8fbff!important}
  .tag-option.selected{background:var(--ps-blue-soft)!important;border-color:var(--ps-blue-line)!important;color:var(--ps-blue)!important;box-shadow:inset 0 0 0 1px rgba(23,105,255,.04)!important}
  .tag-create-row .input{background:#fff!important;border-color:#dce5ef!important}.tag-create-row .input:focus{border-color:var(--ps-blue-line)!important;box-shadow:0 0 0 3px rgba(23,105,255,.08)!important}

  /* Vivid table tags; no grey-green palette */
  .personal-tag{height:25px!important;border-width:1px!important;border-style:solid!important;border-radius:7px!important;font-weight:600!important;box-shadow:0 1px 2px rgba(35,68,106,.025)!important}
  .personal-tag.tag-blue{background:#eaf2ff!important;border-color:#bdd3ff!important;color:#1769ff!important}
  .personal-tag.tag-cyan{background:#e7f9ff!important;border-color:#b4e8f7!important;color:#047f9f!important}
  .personal-tag.tag-gray{background:#f2f4f8!important;border-color:#dce2ea!important;color:#596a80!important}
  .personal-tag.tag-purple{background:#f3edff!important;border-color:#d9c7ff!important;color:#7c3aed!important}
  .personal-tag.tag-green{background:#e9fbff!important;border-color:#b3eaf3!important;color:#007f9f!important}
  .personal-tag.tag-orange{background:#fff1df!important;border-color:#ffd29a!important;color:#bf6500!important}
  .personal-tag.tag-pink{background:#ffeaf2!important;border-color:#ffc4d9!important;color:#d6336c!important}
  .personal-tag.tag-slate{background:#eef1ff!important;border-color:#ccd5ff!important;color:#4f5fd4!important}
  .tag-more{background:#fff!important;border:1px solid #dce5ef!important;color:#607389!important}

  /* File icons: consistent white rounded frame for folders and files */
  .personal-file-table .file-symbol,.file-card .file-symbol,
  .share-v10-file .file-symbol,.transfer-v10-file .file-symbol{width:40px!important;height:40px!important;border-radius:12px!important;background:#fff!important;border:1px solid #dce5ef!important;box-shadow:0 2px 8px rgba(35,68,106,.08),inset 0 1px #fff!important;display:grid!important;place-items:center!important;overflow:hidden!important}
  .personal-file-table .file-symbol iconify-icon,.file-card .file-symbol iconify-icon{font-size:27px!important}
  .file-symbol-folder-v11 svg{width:25px!important;height:25px!important;display:block}
  .file-symbol-folder-v11 .file-fallback{display:none!important}
  .share-v10-file .file-symbol-folder-v11 svg,.transfer-v10-file .file-symbol-folder-v11 svg{width:26px!important;height:26px!important}

  /* Access column: private, external link and member sharing are visibly different */
  .access-pill{height:28px!important;min-width:84px!important;padding:0 10px!important;border:1px solid var(--ps-line)!important;border-radius:8px!important;background:#fff!important;color:#65768a!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:6px!important;font-size:11px!important;font-weight:600!important;line-height:1!important;box-shadow:0 1px 3px rgba(35,68,106,.035)!important;white-space:nowrap!important}
  .access-pill .icon-stack,.access-pill>.icon{width:15px!important;height:15px!important}
  .access-pill.access-private{background:#fff!important;border-color:#dfe7f1!important;color:#66798d!important}
  .access-pill.access-link{background:#f6faff!important;border-color:#9fc2ff!important;color:#1769ff!important;box-shadow:inset 3px 0 #1769ff!important}
  .access-pill.access-shared{background:var(--ps-violet-soft)!important;border-color:var(--ps-violet-line)!important;color:var(--ps-violet)!important;box-shadow:inset 3px 0 var(--ps-violet)!important}
  .access-pill.access-link:hover{border-color:#72a8ff!important;box-shadow:inset 3px 0 #1769ff,0 4px 12px rgba(23,105,255,.08)!important}
  .access-pill.access-shared:hover{border-color:#aaa0ff!important;box-shadow:inset 3px 0 var(--ps-violet),0 4px 12px rgba(109,93,252,.09)!important}
  .file-card-access .access-pill{min-width:78px!important}

  /* Context and batch menus: white, compact and blue-focused */
  .personal-file-menu,.personal-bulk-menu{background:#fff!important;border:1px solid #dce5ef!important;box-shadow:0 20px 52px rgba(23,49,82,.16)!important}
  .personal-file-menu .menu-item,.personal-bulk-menu button{background:#fff!important;color:#4f6278!important}
  .personal-file-menu .menu-item>.icon-stack,.personal-bulk-menu button>.icon-stack{color:#3f6f9d!important}
  .personal-file-menu .menu-item:hover,.personal-bulk-menu button:hover{background:var(--ps-blue-soft)!important;color:var(--ps-blue)!important}
  .personal-file-menu .menu-item:hover>.icon-stack,.personal-bulk-menu button:hover>.icon-stack{color:var(--ps-blue)!important}
  .personal-file-menu .menu-emphasis{background:#f8fbff!important;color:#215f9b!important}
  .personal-file-menu .transfer-item,.personal-file-menu .transfer-item>.icon-stack{color:#7058d9!important}
  .personal-file-menu .transfer-item:hover{background:#f5f2ff!important;color:#6148d4!important}
  .personal-file-menu .menu-item.danger,.personal-file-menu .menu-item.danger>.icon-stack{color:#df4b56!important}
  .personal-file-menu .menu-item.danger:hover{background:#fff2f3!important}
  .personal-file-menu .menu-sep,.personal-bulk-menu .menu-sep{background:#edf1f6!important}

  @media(max-width:760px){.share-v10-modal .modal-body,.transfer-v10-modal .modal-body,.destination-v9-modal .modal-body{background:#fff!important}}
  `;
  document.head.appendChild(style);

  const baseFileVisual=window.fileVisual||fileVisual;
  const folderVisual=()=>`<span class="file-symbol folder file-symbol-folder-v11" aria-label="文件夹"><svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#f5b532" d="M3.5 8.6A2.6 2.6 0 0 1 6.1 6h7l2.35 2.5H25.9a2.6 2.6 0 0 1 2.6 2.6v1.2h-25z"/><path fill="#e5a022" d="M3.5 11.4h25v12A2.6 2.6 0 0 1 25.9 26H6.1a2.6 2.6 0 0 1-2.6-2.6z"/><path fill="#ffd66f" d="M4.9 12.8h22.2v9.7a2 2 0 0 1-2 2H6.9a2 2 0 0 1-2-2z"/></svg><span class="file-fallback">文件夹</span></span>`;
  const nextFileVisual=function(file){return file?.type==='folder'?folderVisual():baseFileVisual(file)};
  window.fileVisual=nextFileVisual;
  try{fileVisual=nextFileVisual}catch(error){}

  if(typeof render==='function')render();
})();
