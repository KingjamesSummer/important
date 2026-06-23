(function(){
'use strict';
if(window.__gdgPublicShellHotfixV1)return;
window.__gdgPublicShellHotfixV1=true;

document.addEventListener('click',function(event){
  const thumb=event.target.closest('.gdg-thumb');
  if(!thumb)return;
  event.preventDefault();
  event.stopImmediatePropagation();
  const thumbs=Array.from(document.querySelectorAll('.gdg-thumb'));
  const target=thumbs.indexOf(thumb)+1;
  const current=Math.max(1,thumbs.findIndex(item=>item.classList.contains('active'))+1);
  if(target>0&&typeof window.gdgPage==='function')window.gdgPage(target-current);
},true);

document.addEventListener('dragover',function(event){
  const zone=event.target.closest('.gdg-drop');
  if(!zone)return;
  event.preventDefault();
  zone.style.borderColor='#1769ff';
  zone.style.background='#edf5ff';
});

document.addEventListener('dragleave',function(event){
  const zone=event.target.closest('.gdg-drop');
  if(!zone)return;
  zone.style.borderColor='';
  zone.style.background='';
});

document.addEventListener('drop',function(event){
  const zone=event.target.closest('.gdg-drop');
  if(!zone)return;
  event.preventDefault();
  event.stopPropagation();
  zone.style.borderColor='';
  zone.style.background='';
  const files=Array.from(event.dataTransfer&&event.dataTransfer.files||[]);
  const input=document.getElementById('fileInput');
  if(!files.length||!input)return;
  try{
    const transfer=new DataTransfer();
    files.forEach(file=>transfer.items.add(file));
    input.files=transfer.files;
    input.dispatchEvent(new Event('change',{bubbles:true}));
  }catch(error){
    if(typeof window.toast==='function')window.toast('当前浏览器不支持拖拽读取，请点击选择文件','warning');
  }
});
})();