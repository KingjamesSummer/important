/* Administrator settings visual refinement v3: compact white-blue layout, fixed avatars, polished rows and summary cards. */
(function(){
  if(window.__adminGrantPolishV3)return;
  window.__adminGrantPolishV3=true;

  const mount=function(){
    if(document.getElementById('admin-grant-polish-v3-css'))return;
    const style=document.createElement('style');
    style.id='admin-grant-polish-v3-css';
    style.textContent=`
body.admin-grant-v2{
  --ag-blue:#0b6cff;
  --ag-blue-strong:#0756d6;
  --ag-blue-soft:#edf6ff;
  --ag-blue-pale:#f7fbff;
  --ag-line:#d6e7fa;
  --ag-line-strong:#bdd9f7;
  --ag-ink:#0d2f5e;
  --ag-text:#3f628a;
  --ag-muted:#7692b2;
  background:#f7fbff!important;
}
body.admin-grant-v2 .app,
body.admin-grant-v2 .main{
  background:linear-gradient(180deg,#ffffff 0%,#f7fbff 100%)!important;
}
body.admin-grant-v2 .main{
  padding:16px 20px 20px!important;
}
body.admin-grant-v2 .ag-page{
  width:100%!important;
  max-width:none!important;
  margin:0!important;
  padding:0!important;
  box-sizing:border-box!important;
}
body.admin-grant-v2 .ag-page .page-head{
  margin-bottom:10px!important;
}
body.admin-grant-v2 .ag-page .page-title{
  color:var(--ag-ink)!important;
  font-size:21px!important;
  letter-spacing:-.01em!important;
}
body.admin-grant-v2 .ag-page .page-subtitle{
  color:#6688ae!important;
}
body.admin-grant-v2 .ag-hero{
  min-height:86px!important;
  gap:16px!important;
  padding:15px 18px!important;
  border:1px solid #cfe3fb!important;
  border-radius:15px!important;
  background:linear-gradient(118deg,#eef7ff 0%,#f8fbff 60%,#ffffff 100%)!important;
  box-shadow:0 8px 22px rgba(15,86,170,.07)!important;
}
body.admin-grant-v2 .ag-hero:before{
  right:-88px!important;
  top:-126px!important;
  width:260px!important;
  height:260px!important;
  background:radial-gradient(circle,rgba(11,108,255,.17),rgba(11,108,255,.035) 55%,transparent 72%)!important;
}
body.admin-grant-v2 .ag-hero:after{
  right:135px!important;
  bottom:-94px!important;
  width:148px!important;
  height:148px!important;
  border-color:rgba(11,108,255,.10)!important;
}
body.admin-grant-v2 .ag-hero-icon{
  width:48px!important;
  height:48px!important;
  border-radius:14px!important;
  background:linear-gradient(145deg,#35a2ff,#0b6cff)!important;
  box-shadow:0 8px 18px rgba(11,108,255,.22)!important;
}
body.admin-grant-v2 .ag-hero-icon .icon-stack{
  width:23px!important;
  height:23px!important;
}
body.admin-grant-v2 .ag-hero-copy h2{
  color:#123b70!important;
  font-size:17px!important;
}
body.admin-grant-v2 .ag-hero-copy p{
  margin-top:5px!important;
  color:#6485aa!important;
  font-size:10.5px!important;
  line-height:1.55!important;
}
body.admin-grant-v2 .ag-hero-copy .ag-inline-tags{
  margin-top:7px!important;
  gap:6px!important;
}
body.admin-grant-v2 .ag-mini-tag{
  height:21px!important;
  padding:0 8px!important;
  border-color:#cfe3fb!important;
  background:#fff!important;
  color:#356da8!important;
  font-size:9px!important;
}
body.admin-grant-v2 .ag-mini-tag.risk{
  border-color:#f2d5a0!important;
  background:#fff9eb!important;
  color:#a56618!important;
}
body.admin-grant-v2 .ag-primary{
  height:38px!important;
  border-radius:10px!important;
  background:linear-gradient(135deg,#2389ff,#0b6cff)!important;
  border-color:#0b6cff!important;
  box-shadow:0 8px 18px rgba(11,108,255,.20)!important;
}
body.admin-grant-v2 .ag-stats{
  gap:10px!important;
  margin:10px 0!important;
}
body.admin-grant-v2 .ag-stat{
  min-height:78px!important;
  padding:12px 14px!important;
  border-color:#d7e7f8!important;
  border-radius:13px!important;
  background:linear-gradient(145deg,#ffffff,#f9fcff)!important;
  box-shadow:0 6px 16px rgba(18,78,145,.055)!important;
}
body.admin-grant-v2 .ag-stat:before{
  content:"";
  position:absolute;
  left:0;
  top:0;
  bottom:0;
  width:3px;
  background:#0b6cff;
  opacity:.88;
}
body.admin-grant-v2 .ag-stat:nth-child(2):before{background:#199ee7!important}
body.admin-grant-v2 .ag-stat:nth-child(3):before{background:#2b83ea!important}
body.admin-grant-v2 .ag-stat:nth-child(4):before{background:#1769ff!important}
body.admin-grant-v2 .ag-stat:hover{
  transform:translateY(-1px)!important;
  border-color:#a9cdf5!important;
  box-shadow:0 10px 23px rgba(18,78,145,.10)!important;
}
body.admin-grant-v2 .ag-stat:after,
body.admin-grant-v2 .ag-stat.green:after,
body.admin-grant-v2 .ag-stat.orange:after,
body.admin-grant-v2 .ag-stat.purple:after{
  right:-32px!important;
  top:-38px!important;
  width:94px!important;
  height:94px!important;
  background:radial-gradient(circle,rgba(11,108,255,.13),transparent 70%)!important;
}
body.admin-grant-v2 .ag-stat-top{
  color:#6686aa!important;
  font-size:10px!important;
}
body.admin-grant-v2 .ag-stat-icon,
body.admin-grant-v2 .ag-stat.green .ag-stat-icon,
body.admin-grant-v2 .ag-stat.orange .ag-stat-icon,
body.admin-grant-v2 .ag-stat.purple .ag-stat-icon{
  width:29px!important;
  height:29px!important;
  border-radius:9px!important;
  color:#0b6cff!important;
  background:#eaf4ff!important;
  box-shadow:inset 0 0 0 1px #d2e7ff!important;
}
body.admin-grant-v2 .ag-stat strong{
  margin-top:7px!important;
  color:#143d70!important;
  font-size:23px!important;
}
body.admin-grant-v2 .ag-stat small{
  margin-top:5px!important;
  color:#7b95b3!important;
  font-size:9px!important;
}
body.admin-grant-v2 .ag-card{
  border-color:#d4e5f8!important;
  border-radius:15px!important;
  background:#fff!important;
  box-shadow:0 8px 24px rgba(19,72,132,.07)!important;
}
body.admin-grant-v2 .ag-card-head{
  min-height:54px!important;
  padding:10px 12px!important;
  gap:8px!important;
  border-bottom-color:#e2edf9!important;
  background:#fbfdff!important;
}
body.admin-grant-v2 .ag-search{
  width:min(390px,38vw)!important;
  height:36px!important;
  border-color:#cfe0f3!important;
  border-radius:9px!important;
  background:#fff!important;
}
body.admin-grant-v2 .ag-select{
  height:36px!important;
  min-width:118px!important;
  border-color:#cfe0f3!important;
  border-radius:9px!important;
  background:#fff!important;
}
body.admin-grant-v2 .ag-count{
  color:#7893b1!important;
}
body.admin-grant-v2 .ag-table-wrap{
  padding:0 10px 10px!important;
  background:#f8fbff!important;
}
body.admin-grant-v2 .ag-table{
  border-collapse:separate!important;
  border-spacing:0 7px!important;
}
body.admin-grant-v2 .ag-table thead th{
  height:35px!important;
  padding:0 12px!important;
  border:0!important;
  background:transparent!important;
  color:#6683a4!important;
  font-size:9.5px!important;
}
body.admin-grant-v2 .ag-table tbody td{
  height:60px!important;
  padding:0 12px!important;
  border-top:1px solid #deebf8!important;
  border-bottom:1px solid #deebf8!important;
  background:#fff!important;
  color:#466684!important;
  font-size:10.5px!important;
  transition:border-color .16s ease,background .16s ease,box-shadow .16s ease!important;
}
body.admin-grant-v2 .ag-table tbody td:first-child{
  border-left:1px solid #deebf8!important;
  border-radius:11px 0 0 11px!important;
}
body.admin-grant-v2 .ag-table tbody td:last-child{
  border-right:1px solid #deebf8!important;
  border-radius:0 11px 11px 0!important;
}
body.admin-grant-v2 .ag-table tbody tr:hover{
  background:transparent!important;
  box-shadow:none!important;
}
body.admin-grant-v2 .ag-table tbody tr:hover td{
  border-color:#acd0f7!important;
  background:#f5faff!important;
  box-shadow:0 7px 18px rgba(15,86,170,.055)!important;
}
body.admin-grant-v2 .ag-table th:first-child,
body.admin-grant-v2 .ag-table td:first-child{
  min-width:215px!important;
}
body.admin-grant-v2 .ag-person{
  min-width:195px!important;
  gap:11px!important;
}
body.admin-grant-v2 .ag-person>.ag-avatar{
  width:38px!important;
  height:38px!important;
  flex:0 0 38px!important;
  display:grid!important;
  place-items:center!important;
  margin:0!important;
  padding:0!important;
  border:1px solid #b9d7f8!important;
  border-radius:12px!important;
  background:linear-gradient(145deg,#ffffff 0%,#deefff 100%)!important;
  color:#0b63ce!important;
  font-size:14px!important;
  font-weight:800!important;
  line-height:1!important;
  text-align:center!important;
  box-shadow:0 5px 13px rgba(11,108,255,.11),inset 0 1px 0 #fff!important;
  overflow:hidden!important;
}
body.admin-grant-v2 .ag-person>div{
  min-width:0!important;
}
body.admin-grant-v2 .ag-person>div>strong{
  color:#153b69!important;
  font-size:12px!important;
  font-weight:760!important;
}
body.admin-grant-v2 .ag-person>div>span{
  display:block!important;
  margin-top:4px!important;
  color:#7894b4!important;
  font-size:9px!important;
  line-height:1.25!important;
  white-space:nowrap!important;
}
body.admin-grant-v2 .ag-type{
  height:23px!important;
  border:1px solid #cfe2fb!important;
  border-radius:8px!important;
  background:#eef6ff!important;
  color:#0b63d6!important;
  font-size:9px!important;
}
body.admin-grant-v2 .ag-type.system{
  border-color:#bcd9fb!important;
  background:#e7f2ff!important;
  color:#0756c9!important;
}
body.admin-grant-v2 .ag-scope,
body.admin-grant-v2 .ag-perms{
  gap:5px!important;
}
body.admin-grant-v2 .ag-scope span{
  height:22px!important;
  border:1px solid #dce9f7!important;
  border-radius:7px!important;
  background:#f7fafc!important;
  color:#547493!important;
}
body.admin-grant-v2 .ag-perm{
  height:22px!important;
  border:1px solid #d3e6fb!important;
  border-radius:7px!important;
  background:#eef6ff!important;
  color:#276aa9!important;
}
body.admin-grant-v2 .ag-perm.risk{
  border-color:#f0d7a9!important;
  background:#fff9ec!important;
  color:#a76418!important;
}
body.admin-grant-v2 .ag-more-count{
  height:22px!important;
  border:1px solid #e1e8f0!important;
  background:#f7f9fb!important;
}
body.admin-grant-v2 .ag-status{
  min-width:64px!important;
  height:25px!important;
  justify-content:center!important;
  border:1px solid #ccebdc!important;
  border-radius:999px!important;
  background:#f1fbf6!important;
  color:#247554!important;
}
body.admin-grant-v2 .ag-status.off{
  border-color:#dbe3ec!important;
  background:#f6f8fa!important;
  color:#78889a!important;
}
body.admin-grant-v2 .ag-status i{
  width:7px!important;
  height:7px!important;
  box-shadow:none!important;
}
body.admin-grant-v2 .ag-action{
  height:30px!important;
  border-radius:8px!important;
  border-color:#cfe0f3!important;
  color:#456986!important;
}
body.admin-grant-v2 .ag-action.edit{
  border-color:#9fc7f7!important;
  background:#eef6ff!important;
  color:#075fd9!important;
}
body.admin-grant-v2 .ag-action:hover{
  border-color:#75b4f5!important;
  background:#edf6ff!important;
  color:#0756d6!important;
  box-shadow:0 5px 12px rgba(11,108,255,.08)!important;
}
@media(max-width:1180px){
  body.admin-grant-v2 .ag-table{min-width:1080px!important}
  body.admin-grant-v2 .ag-stats{grid-template-columns:repeat(2,minmax(0,1fr))!important}
}
@media(max-width:760px){
  body.admin-grant-v2 .main{padding:12px!important}
  body.admin-grant-v2 .ag-hero{padding:14px!important}
  body.admin-grant-v2 .ag-stats{grid-template-columns:1fr!important}
}
`;
    document.head.appendChild(style);
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});
  else mount();
})();
