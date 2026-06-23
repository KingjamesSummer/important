(()=>{
  if(window.__collaborationSpaceV5Loaded)return;
  window.__collaborationSpaceV5Loaded=true;

  const PALETTES={
    sky:{label:'天空蓝',main:'#75a9e4',soft:'#edf5ff',fg:'#3974ad',line:'#d4e5f6'},
    orange:{label:'暖橙',main:'#e7a15a',soft:'#fff5e9',fg:'#a96828',line:'#f0dec6'},
    violet:{label:'柔紫',main:'#998be0',soft:'#f3f0ff',fg:'#675aa8',line:'#ded8f8'},
    green:{label:'青绿',main:'#70b596',soft:'#edf8f3',fg:'#3d7d63',line:'#d5eadf'},
    rose:{label:'玫瑰',main:'#dd8c9b',soft:'#fff0f3',fg:'#a95767',line:'#f2d4db'},
    amber:{label:'琥珀',main:'#d7b057',soft:'#fff9e8',fg:'#8d7024',line:'#eee1b7'}
  };

  const setPreviewColor=color=>{
    const palette=PALETTES[color]||PALETTES.sky;
    const preview=document.getElementById('collabCreatePreview');
    if(!preview)return;
    preview.dataset.color=color;
    preview.style.setProperty('--preview',palette.main);
    preview.style.setProperty('--preview-soft',palette.soft);
    preview.style.setProperty('--preview-fg',palette.fg);
    preview.style.setProperty('--preview-line',palette.line);
    const label=preview.querySelector('footer b');
    if(label)label.textContent=palette.label;
  };

  window.collabV3SelectColor=(color,button)=>{
    const normalized=PALETTES[color]?color:'sky';
    state.collabNewColor=normalized;
    document.querySelectorAll('.collab-v3-color-field button').forEach(item=>{
      item.classList.toggle('selected',item===button||item.classList.contains(`color-${normalized}`));
      item.setAttribute('aria-pressed',String(item===button||item.classList.contains(`color-${normalized}`)));
    });
    setPreviewColor(normalized);
  };

  const syncCreateModal=()=>{
    const modal=document.querySelector('.collab-v3-create-modal');
    if(!modal)return;
    const color=PALETTES[state.collabNewColor]?state.collabNewColor:'sky';
    const button=modal.querySelector(`.collab-v3-color-field .color-${color}`)||modal.querySelector('.collab-v3-color-field button');
    if(button)window.collabV3SelectColor(color,button);
  };

  const originalCreate=window.collabCreateSpace;
  if(typeof originalCreate==='function'){
    window.collabCreateSpace=(...args)=>{
      const result=originalCreate(...args);
      requestAnimationFrame(()=>requestAnimationFrame(syncCreateModal));
      return result;
    };
  }

  const observer=new MutationObserver(records=>{
    if(records.some(record=>[...record.addedNodes].some(node=>node.nodeType===1&&(node.matches?.('.collab-v3-layer')||node.querySelector?.('.collab-v3-create-modal'))))){
      requestAnimationFrame(syncCreateModal);
    }
  });
  observer.observe(document.body,{childList:true,subtree:true});
  syncCreateModal();
})();