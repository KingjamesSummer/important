function clone(v){return JSON.parse(JSON.stringify(v))}
function loadData(){try{const x=JSON.parse(localStorage.getItem(STORAGE_KEY));return x&&x.spaces?x:clone(defaults)}catch{return clone(defaults)}}
function saveData(){localStorage.setItem(STORAGE_KEY,JSON.stringify(data))}
function currentSpace(){return data.spaces.find(x=>x.id===state.spaceId)}
function members(spaceId=state.spaceId){return data.members[spaceId]||[]}
function files(spaceId=state.spaceId){return data.files[spaceId]||[]}
function activities(spaceId=state.spaceId){return data.activities[spaceId]||[]}
function nowText(){return new Date().toLocaleString('zh-CN',{hour12:false}).replaceAll('/','-')}
function uid(prefix='id'){return prefix+Date.now()+Math.floor(Math.random()*1000)}
function fileType(name=''){const ext=name.split('.').pop().toLowerCase();return ({doc:'doc',docx:'doc',pdf:'pdf',xls:'xls',xlsx:'xls',ppt:'ppt',pptx:'ppt',png:'img',jpg:'img',jpeg:'img',webp:'img',zip:'zip',rar:'zip'})[ext]||'doc'}
function fileLabel(type){return ({folder:'▰',doc:'DOC',pdf:'PDF',xls:'XLS',ppt:'PPT',img:'IMG',zip:'ZIP'})[type]||'FILE'}
function fileIcon(file){return `<span class="file-icon ${file.type}">${fileLabel(file.type)}</span>`}
