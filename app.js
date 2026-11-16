const profiles = [
  {name:'晚风',image:'assets/avatar-1.webp',gender:'female',role:'头牌',games:['王者荣耀','原神']},
  {name:'月见',image:'assets/avatar-2.webp',gender:'female',role:'头牌',games:['原神','和平精英']},
  {name:'星野',image:'assets/avatar-3.webp',gender:'female',role:'头牌',games:['和平精英','王者荣耀']},
  {name:'小满',image:'assets/avatar-4.webp',gender:'female',role:'头牌',games:['王者荣耀','原神']}
];
// Illustrative profile records; replace with the club's approved profiles when connecting data.
const newcomers=[
  {name:'桃桃',image:'assets/newcomer-1.webp',gender:'female',role:'新人',games:['王者荣耀','原神']},
  {name:'阿澈',image:'assets/newcomer-2.webp',gender:'male',role:'新人',games:['和平精英','王者荣耀']},
  {name:'眠眠',image:'assets/newcomer-3.webp',gender:'female',role:'新人',games:['原神','王者荣耀']}
];
const allPeople=[...profiles,...newcomers];
const personalDemoAccount={nickname:'小满',avatar:'assets/avatar-4.webp',balance:'¥268.00'};
const chooseOrderSkuCatalog={
  '王者荣耀':[['一局','¥29.9',29.9],['半小时','¥39.9',39.9],['一小时','¥69.9',69.9],['4小时','¥239.9',239.9],['包天（8小时）','¥399.9',399.9]],
  '原神':[['一局','¥24.9',24.9],['半小时','¥34.9',34.9],['一小时','¥59.9',59.9],['4小时','¥199.9',199.9],['包天（8小时）','¥329.9',329.9]],
  '和平精英':[['一局','¥26.9',26.9],['半小时','¥36.9',36.9],['一小时','¥64.9',64.9],['4小时','¥219.9',219.9],['包天（8小时）','¥359.9',359.9]]
};
const shopProducts=[
  {id:'kingdom',game:'王者荣耀',title:'星耀上分包',label:'组队开黑',price:'¥30',intro:'王者荣耀星耀段位上分服务，目标为提升10颗星。',notice:'请确认当前段位为星耀，并在备注中写明区服和账号信息。',image:'assets/project-king.webp'},
  {id:'genshin',game:'原神',title:'原神陪玩',label:'世界探索',price:'¥59.9',intro:'陪你完成原神指定探索或任务目标。',notice:'请提前写明服务器、任务目标和需要配合的账号信息。',image:'assets/project-genshin.webp'},
  {id:'peace',game:'和平精英',title:'和平精英陪玩',label:'默契组队',price:'¥64.9',intro:'完成一组和平精英组队目标，按组合包约定执行。',notice:'请在备注中写明模式、目标和房间信息，具体内容以组合包约定为准。',image:'assets/project-peace.webp'},
  {id:'voice',game:'原神',title:'语音陪伴',label:'轻松聊天',price:'¥39.9',intro:'提供一段轻松的语音陪伴，按组合包内容完成服务。',notice:'请提前说明希望的陪伴方式，具体内容以组合包约定为准。',image:'assets/project-more.webp'},
  {id:'duo',game:'王者荣耀',title:'轻松开黑',label:'即时组队',price:'¥29.9',intro:'陪你完成一局王者荣耀组队对局。',notice:'请在备注中填写房间信息，服务内容以组合包约定为准。',image:'assets/entry-choose.webp'},
  {id:'day',game:'和平精英',title:'陪伴包天',label:'8小时陪伴',price:'¥399.9',intro:'按组合包约定提供完整的和平精英陪伴服务。',notice:'请提前写明模式、目标和房间信息，具体安排以双方确认内容为准。',image:'assets/entry-dispatch.webp'}
];
let shopFilters={query:'',service:''};
let shopOrderState={product:null,note:'',stage:'detail'};
let chooseOrderState={person:null,service:'',sku:'',timing:'now',appointment:'',note:''};
let chooseOrderReturnFocus=null;
function openCompanionProfile(person,openOrder=false){
  if(!person?.name)return;
  window.location.href=`companion-profile-preview.html?person=${encodeURIComponent(person.name)}${openOrder?'&order=1':''}&v=profile-route1`;
}
const notices=[
  {title:'系统派单，享项目8折',body:'由系统安排陪玩，按对应项目费用的8折计费。'},
  {title:'喜欢的 TA，可以直接指定',body:'我要点单支持指定陪玩，按对应项目全价计费。'},
  {title:'新人报道，认识新朋友',body:'在首页的新人报道中认识新加入的陪玩，点击小卡片即可选择项目。'}
];
const games=['王者荣耀','和平精英','原神'];
const durationCatalog=[
  {id:'match',label:'一局'},
  {id:'30m',label:'半小时'},
  {id:'1h',label:'一小时'},
  {id:'4h',label:'4小时'},
  {id:'day',label:'包天',detail:'8小时'}
];
const dispatchSkus=Object.fromEntries(games.map(game=>[game,durationCatalog.map(item=>({...item}))]));
const dispatchArtwork={'王者荣耀':'assets/project-king.webp','和平精英':'assets/project-peace.webp','原神':'assets/project-genshin.webp'};
const dispatchPrices=Object.fromEntries(games.map(game=>[game,{}]));
const $=s=>document.querySelector(s);
const icon=id=>`<svg aria-hidden="true"><use href="#i-${id}"/></svg>`;
const genderHTML=p=>`<span class="gender-badge" data-gender="${p.gender}" aria-label="${p.gender==='male'?'男':'女'}">${icon(p.gender)}</span>`;
const hero=$('.hero');
let heroFrame=0;
function updateHeroFade(){
  heroFrame=0;
  const progress=Math.min(1,Math.max(0,window.scrollY/Math.max(180,hero.offsetHeight*.78)));
  const opacity=1-progress;
  hero.style.setProperty('--hero-opacity',opacity.toFixed(3));
  hero.style.setProperty('--hero-art-opacity','1');
  hero.style.setProperty('--hero-wash-opacity',(progress*.42).toFixed(3));
  hero.classList.toggle('hero-hidden',opacity<=.01);
}
function scheduleHeroFade(){if(heroFrame)return;heroFrame=requestAnimationFrame(updateHeroFade);}
window.addEventListener('resize',()=>{ensureAnnouncementSpace();scheduleHeroFade();},{passive:true});
updateHeroFade();
let lastScrollY=window.scrollY,snapTimer=0,snapReleaseTimer=0,snapInProgress=false,snapTarget=0,snapDirection=0,introSnapPending=true,scrollLimit=0,lastTouchY=0;
function announcementOffset(){const announcement=$('.announcement');return Math.max(0,Math.round(announcement.getBoundingClientRect().top+window.scrollY));}
function ensureAnnouncementSpace(){
  const main=$('main');
  if(!main)return;
  const base=150,required=announcementOffset()+window.innerHeight-document.documentElement.scrollHeight;
  main.style.paddingBottom=`${base+Math.max(0,Math.ceil(required))}px`;
}
ensureAnnouncementSpace();
function snapScroll(target){
  if(snapInProgress)return;
  if(target===0)scrollLimit=0;
  snapTarget=target;introSnapPending=target===0;snapInProgress=true;window.scrollTo({top:target,behavior:reduced?.matches?'auto':'smooth'});
  clearTimeout(snapReleaseTimer);snapReleaseTimer=setTimeout(finishSnap,700);
}
function finishSnap(){
  if(!snapInProgress)return;
  snapInProgress=false;lastScrollY=window.scrollY;
  if(snapTarget>0&&Math.abs(lastScrollY-snapTarget)<=2)scrollLimit=snapTarget;
}
function settleScroll(){
  if(snapInProgress)return;
  const target=announcementOffset(),y=window.scrollY;
  if(y<=36)introSnapPending=true;
  if(snapDirection>0&&introSnapPending&&y>36&&target>0)snapScroll(target);
  else if(snapDirection<0&&!introSnapPending&&y>0&&y<target-36)snapScroll(0);
}
function handleScrollSnap(){
  let y=window.scrollY;
  if(scrollLimit&&y>scrollLimit+1){window.scrollTo({top:scrollLimit,behavior:'instant'});y=window.scrollY;}
  snapDirection=y-lastScrollY;lastScrollY=y;scheduleHeroFade();
  clearTimeout(snapTimer);snapTimer=setTimeout(settleScroll,110);
}
window.addEventListener('scroll',handleScrollSnap,{passive:true});
window.addEventListener('scrollend',()=>{if(snapInProgress)finishSnap();else settleScroll();},{passive:true});
window.addEventListener('wheel',e=>{if(scrollLimit&&window.scrollY>=scrollLimit-1&&e.deltaY>0)e.preventDefault();},{passive:false});
document.addEventListener('touchstart',e=>{lastTouchY=e.touches[0]?.clientY??0;},{passive:true});
document.addEventListener('touchmove',e=>{
  const touch=e.touches[0];if(!touch)return;
  const movingDown=touch.clientY<lastTouchY;lastTouchY=touch.clientY;
  if(scrollLimit&&window.scrollY>=scrollLimit-1&&movingDown&&!e.target.closest('.featured-card'))e.preventDefault();
},{passive:false});
document.addEventListener('keydown',e=>{
  if(!scrollLimit||window.scrollY<scrollLimit-1||e.target.closest('#deck,button,input,textarea,select,[contenteditable],[data-order-id]'))return;
  if(['ArrowDown','PageDown','End',' '].includes(e.key))e.preventDefault();
},true);
let current=0,busy=false,toastTimer,returnFocus,selectedGame='',selectedPerson=null,orderMode='dispatch';
let chooseFilters={service:'',role:'',query:''};
let dispatchOrder={service:'',gender:'不限',duration:'',peopleCount:'1',timing:'now',appointment:'',repeatScope:'all'};
let favorites=[];try{favorites=JSON.parse(localStorage.getItem('womeng-home-favorites')||'[]');if(!Array.isArray(favorites))favorites=[];}catch{}
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),2200);}
const deck=$('#deck'),template=$('#featuredCard');
const cardNodes=profiles.map((p,index)=>{
  const el=index===0?template:template.cloneNode(true);el.removeAttribute('id');el.dataset.person=p.name;
  const portrait=el.querySelector('.portrait-wrap img');portrait.src=p.image;portrait.alt=p.name;
  el.querySelector('.name-line h2').textContent=p.name;
  el.querySelector('.gender-badge').outerHTML=genderHTML(p);
  el.querySelector('.profile-tags').innerHTML=p.games.map(g=>`<span>${g}</span>`).join('');
  el.querySelector('.voice-button').setAttribute('aria-label',`试听${p.name}的声音`);
  el.querySelector('.specify-button').setAttribute('aria-label',`指定${p.name}`);
  el.setAttribute('aria-label',`头牌${p.name}`);
  if(index)deck.append(el);return el;
});
let cardOrder=[...cardNodes],drag=null,suppressCardClickUntil=0;
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const rotation=(x,y)=>reduced.matches?0:clamp(x*.065+y*.022,-24,24);
const pose=(x,y,angle=rotation(x,y))=>`translate3d(${x}px,${y}px,0) rotate(${angle}deg)`;
const layerPose=i=>i===0?'translate3d(0,0,0) rotate(0deg) scale(1)':`translate3d(${i%2?-2:2}px,${i*7}px,0) rotate(${i%2?-1.6:1.8}deg) scale(${1-i*.012})`;
function updateSaved(){for(const el of cardNodes){const name=el.dataset.person,saved=favorites.includes(name),b=el.querySelector('.save-person');b.setAttribute('aria-label',`${saved?'取消收藏':'收藏'}${name}`);b.setAttribute('aria-pressed',String(saved));b.querySelector('span').textContent=saved?'已藏':'收藏';}}
function arrangeCards(){
  cardOrder.forEach((el,i)=>{el.dataset.layer=String(i);el.style.zIndex=String(8-i);el.style.transform=layerPose(i);el.inert=i!==0;el.setAttribute('aria-hidden',String(i!==0));el.querySelectorAll('button').forEach(b=>b.tabIndex=i===0?0:-1);if(i===0)el.id='featuredCard';else el.removeAttribute('id');});
}
updateSaved();arrangeCards();
// Each complete card is rendered once; throwing only changes its layer and transform.
const deckReady=Promise.all(cardNodes.map(el=>el.querySelector('img').decode().catch(()=>{})));
async function throwCard(dx,dy,speed=.7){
  if(busy)return;busy=true;await deckReady;
  const card=cardOrder[0];card.classList.remove('is-dragging');card.classList.add('is-flying');
  const distance=Math.hypot(dx,dy)||1,ux=dx/distance,uy=dy/distance;
  const flight=Math.hypot($('.app').clientWidth,Math.min(innerHeight,1100))+280;
  const targetX=dx+ux*flight,targetY=dy+uy*flight+(Math.abs(uy)<.3?70:0);
  const angle=rotation(dx,dy),endAngle=clamp(angle+ux*32+uy*12,-65,65);
  const duration=reduced.matches?90:clamp(460-speed*75,300,440);
  const fly=card.animate(reduced.matches?[{opacity:1},{opacity:0}]:[{transform:pose(dx,dy,angle)},{transform:pose(targetX,targetY,endAngle)}],{duration,easing:'cubic-bezier(.22,.5,.65,1)',fill:'forwards'});
  const lifts=cardOrder.slice(1).map((el,i)=>el.animate(reduced.matches?[{opacity:1},{opacity:1}]:[{transform:layerPose(i+1)},{transform:layerPose(i)}],{duration:reduced.matches?90:300,easing:'cubic-bezier(.16,1,.3,1)',fill:'forwards'}));
  await Promise.all([fly,...lifts].map(a=>a.finished.catch(()=>{})));
  cardOrder.push(cardOrder.shift());current=profiles.findIndex(p=>p.name===cardOrder[0].dataset.person);
  arrangeCards();fly.cancel();lifts.forEach(a=>a.cancel());card.classList.remove('is-flying');busy=false;
  $('#cardAnnouncement').textContent=`${profiles[current].name}，${profiles[current].games.join('、')}`;
}
async function returnCard(card=cardOrder[0]){
  if(busy)return;busy=true;card.classList.remove('is-dragging');
  const reset=card.animate([{transform:getComputedStyle(card).transform},{transform:layerPose(0)}],{duration:reduced.matches?80:300,easing:'cubic-bezier(.16,1,.3,1)',fill:'forwards'});
  await reset.finished.catch(()=>{});card.style.transform=layerPose(0);reset.cancel();busy=false;
}
deck.addEventListener('pointerdown',e=>{
  const card=e.target.closest('.featured-card');
  if(card!==cardOrder[0]||busy||drag||e.isPrimary===false||e.target.closest('button')||(e.pointerType==='mouse'&&e.button!==0))return;
  drag={card,target:e.target,x:e.clientX,y:e.clientY,id:e.pointerId,dx:0,dy:0,moved:false,samples:[{x:e.clientX,y:e.clientY,t:performance.now()}]};
  card.setPointerCapture(e.pointerId);card.classList.add('is-dragging');deck.classList.add('pointer-focus');deck.focus({preventScroll:true});
});
deck.addEventListener('pointermove',e=>{
  if(!drag||e.pointerId!==drag.id)return;
  drag.dx=e.clientX-drag.x;drag.dy=e.clientY-drag.y;
  if(!drag.moved&&Math.hypot(drag.dx,drag.dy)<5)return;
  drag.moved=true;const now=performance.now();drag.samples.push({x:e.clientX,y:e.clientY,t:now});
  while(drag.samples.length>2&&now-drag.samples[0].t>100)drag.samples.shift();
  drag.card.style.transform=pose(drag.dx,drag.dy);e.preventDefault();
});
function endDrag(e,cancel=false){
  if(!drag||e.pointerId!==drag.id)return;
  const state=drag;drag=null;
  const distance=Math.hypot(state.dx,state.dy),first=state.samples[0],last=state.samples[state.samples.length-1];
  const speed=Math.hypot(last.x-first.x,last.y-first.y)/Math.max(1,performance.now()-first.t);
  if(state.moved)suppressCardClickUntil=performance.now()+500;
  if(!cancel&&!state.moved&&!state.target.closest('button')){state.card.classList.remove('is-dragging');openCompanionProfile(profiles.find(p=>p.name===state.card.dataset.person));return;}
  if(!cancel&&state.moved&&(distance>=64||(distance>15&&speed>.55)))throwCard(state.dx,state.dy,speed);else returnCard(state.card);
}
deck.addEventListener('pointerup',e=>endDrag(e));deck.addEventListener('pointercancel',e=>endDrag(e,true));deck.addEventListener('lostpointercapture',e=>{if(drag&&drag.id===e.pointerId)endDrag(e,true);});
deck.addEventListener('click',e=>{if(performance.now()<suppressCardClickUntil||busy){e.preventDefault();e.stopImmediatePropagation();}},true);
document.addEventListener('keydown',()=>deck.classList.remove('pointer-focus'),true);
deck.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&drag){const state=drag;drag=null;if(state.card.hasPointerCapture(state.id))state.card.releasePointerCapture(state.id);returnCard(state.card);return;}
  if(e.target.closest('button'))return;
  const vectors={ArrowLeft:[-110,-25],ArrowRight:[110,-25],ArrowUp:[25,-110],ArrowDown:[25,110],' ':[110,-65],Enter:[110,-65]};
  if(vectors[e.key]){e.preventDefault();if(!e.repeat&&!busy&&!drag)throwCard(...vectors[e.key]);}
});
deck.addEventListener('click',e=>{
  const el=e.target.closest('.featured-card');if(el!==cardOrder[0])return;
  const p=profiles.find(p=>p.name===el.dataset.person);
  if(!p)return;
  if(e.target.closest('.save-person')){favorites=favorites.includes(p.name)?favorites.filter(n=>n!==p.name):[...favorites,p.name];try{localStorage.setItem('womeng-home-favorites',JSON.stringify(favorites));}catch{}updateSaved();return;}
  if(e.target.closest('.voice-button')){toast('这位陪玩的语音还未上传');return;}
  if(e.target.closest('.specify-button')){openServices('choose',p);return;}
  if(!e.target.closest('button'))openCompanionProfile(p);
});
$('#newcomerGrid').innerHTML=newcomers.map(p=>`<button class="newcomer-card" data-person="${p.name}" aria-label="认识${p.name}"><img class="newcomer-portrait" src="${p.image}" width="320" height="320" alt="" loading="lazy"><span class="newcomer-name"><b>${p.name}</b>${genderHTML(p)}</span><span class="newcomer-game">${p.games[0]}</span></button>`).join('');

let noticeIndex=0,noticePaused=reduced.matches,noticeTimer,noticeMoving=false,noticeHovered=false,noticeVisible=true,noticeAnimation;
const noticeRegion=$('.announcement'),noticeTrack=$('#noticeTrack');
noticeTrack.innerHTML=[...notices,notices[0]].map(n=>`<span class="notice-item">${n.title}</span>`).join('');
function setNoticeState(){
  $('#noticeOpen').setAttribute('aria-label',`查看公告：${notices[noticeIndex].title}`);
  [...noticeTrack.children].forEach((el,i)=>el.setAttribute('aria-hidden',String(i!==noticeIndex)));
}
function scheduleNotice(){clearTimeout(noticeTimer);if(noticePaused||noticeHovered||document.hidden||!noticeVisible||noticeRegion.contains(document.activeElement)||$('#entrySheet').open)return;noticeTimer=setTimeout(()=>advanceNotice(),4800);}
async function advanceNotice(){
  if(noticeMoving)return;noticeMoving=true;clearTimeout(noticeTimer);
  const next=noticeIndex+1;
  noticeAnimation=noticeTrack.animate([{transform:`translateY(${-noticeIndex*22}px)`},{transform:`translateY(${-next*22}px)`}],{duration:reduced.matches?1:340,easing:'cubic-bezier(.16,1,.3,1)',fill:'forwards'});
  await noticeAnimation.finished.catch(()=>{});noticeIndex=next%notices.length;noticeTrack.style.transform=`translateY(${-noticeIndex*22}px)`;noticeAnimation.cancel();noticeMoving=false;setNoticeState();scheduleNotice();
}
$('#noticeOpen').addEventListener('click',()=>openNotice());
noticeRegion.addEventListener('mouseenter',()=>{noticeHovered=true;scheduleNotice();});noticeRegion.addEventListener('mouseleave',()=>{noticeHovered=false;scheduleNotice();});
noticeRegion.addEventListener('focusin',()=>clearTimeout(noticeTimer));noticeRegion.addEventListener('focusout',()=>setTimeout(scheduleNotice,0));
document.addEventListener('visibilitychange',scheduleNotice);
new IntersectionObserver(([entry])=>{noticeVisible=entry.isIntersecting;scheduleNotice();}).observe(noticeRegion);
reduced.addEventListener('change',()=>{if(reduced.matches){noticePaused=true;setNoticeState();scheduleNotice();}});
function openNotice(){showSheet('团内公告',`<div class="notice-copy">${notices.map(n=>`<article><h3>${n.title}</h3><p>${n.body}</p></article>`).join('')}</div>`);}
setNoticeState();scheduleNotice();

const sheet=$('#entrySheet');
const tabPage=$('#tabPage');
let tabReturnFocus=null;
let orderStatus='processing';
// Illustrative order records requested for the visual prototype; connect these slots to real orders later.
const orderExamples={
  processing:{id:'WM-20261116-0001',status:'派单中',initialStatus:'派单中',mode:'系统派单',service:'王者荣耀',sku:'一局',companions:[],peopleCount:2,price:'¥30',time:'今天 19:30',startTime:'今天 19:30',image:'assets/project-king.webp'},
  completed:{id:'WM-20261115-0027',status:'已完成',initialStatus:'派单中',mode:'陪玩点单',service:'原神',sku:'一小时',companions:['眠眠'],peopleCount:1,price:'¥59.9',time:'11月15日 20:00',startTime:'11月15日 20:00',image:'assets/project-genshin.webp'}
};
let reopenShopAfterClose=false;
function showSheet(title,body){sheet.classList.remove('order-flow','choose-flow','shop-flow','shop-order-flow');$('#sheetTitle').textContent=title;$('#sheetBody').innerHTML=body;if(!sheet.open){returnFocus=document.activeElement;sheet.showModal();document.body.style.overflow='hidden';}sheet.scrollTop=0;clearTimeout(noticeTimer);}
function closeSheet(){sheet.close();}
sheet.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();if($('#chooseOrderDialog:not([hidden])')){if(document.querySelector('[data-choose-order-select-wrap].is-open')){closeChooseOrderSelect(true);return;}closeChooseOrder();return;}closeSheet();}});
$('#closeSheet').addEventListener('click',closeSheet);sheet.addEventListener('click',e=>{if(e.target===sheet){const r=sheet.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeSheet();}});sheet.addEventListener('close',()=>{const returnToShop=reopenShopAfterClose;reopenShopAfterClose=false;sheet.classList.remove('order-flow','choose-flow','shop-flow','shop-order-flow');returnFocus?.focus({preventScroll:true});scheduleNotice();if(returnToShop){document.body.style.overflow='';openShopPage();return;}if(tabPage&&!tabPage.hidden){document.body.style.overflow='hidden';return;}document.body.style.overflow='';setNavActive('home');});
function setNavActive(type){
  const target=type==='mine'?document.querySelector('.nav-item[data-open="mine"]'):type==='orders'?document.querySelector('.nav-item[data-open="orders"]'):type==='choose'?document.querySelector('.nav-item[data-open="choose"]'):type==='shop'?document.querySelector('.nav-item[data-open="shop"]'):$('#homeNav');
  document.querySelectorAll('.bottom-nav .nav-item').forEach(item=>{const active=item===target;item.classList.toggle('active',active);if(active)item.setAttribute('aria-current','page');else item.removeAttribute('aria-current');});
}
function personalFavoritePreview(){
  const saved=allPeople.filter(p=>favorites.includes(p.name));
  if(!saved.length)return `<div class="personal-empty"><span class="personal-empty-icon">${icon('heart')}</span><div><strong>还没有收藏陪玩</strong><small>看到喜欢的 TA，可以先收藏起来</small></div><button type="button" data-personal-action="discover">去看看</button></div>`;
  return `<div class="personal-favorite-list">${saved.slice(0,3).map(p=>`<button type="button" class="personal-favorite" data-person="${p.name}"><img src="${p.image}" alt="${p.name}"><span><b>${p.name}</b><small>${p.games.join(' · ')}</small></span>${icon('chevron')}</button>`).join('')}</div>`;
}
function renderPersonalCenter(){
  return `<div class="personal-page">
    <div class="personal-scroll">
      <section class="personal-card-stage" aria-label="个人闪卡"><button type="button" class="personal-holo-card" id="personalHoloCard" aria-label="个人闪卡，拖动查看角度，双击浮起" aria-pressed="false"><img src="assets/hero.webp" alt=""></button></section>
      <section class="personal-profile" aria-labelledby="personalName">
        <div class="personal-avatar"><img src="${personalDemoAccount.avatar}" alt=""></div>
        <div class="personal-profile-copy"><h1 id="personalName">${personalDemoAccount.nickname}</h1></div>
      </section>
      <section class="personal-wallet" aria-labelledby="walletTitle">
        <div class="personal-section-heading"><h2 id="walletTitle">钱包余额</h2><button type="button" class="personal-link-button" data-personal-action="wallet">明细${icon('chevron')}</button></div>
        <div class="personal-wallet-value"><strong>${personalDemoAccount.balance}</strong><span>可用余额</span></div>
        <div class="personal-wallet-actions"><button type="button" data-personal-action="recharge"><span>${icon('wallet')}</span>充值</button><button type="button" data-personal-action="gift-record"><span>${icon('gift')}</span>礼物记录</button></div>
      </section>
      <section class="personal-orders" aria-labelledby="ordersTitle">
        <div class="personal-section-heading"><h2 id="ordersTitle">我的订单</h2><button type="button" class="personal-link-button" data-personal-action="orders">全部订单${icon('chevron')}</button></div>
        <div class="personal-order-grid"><button type="button" data-personal-action="orders"><strong>1</strong><span>进行中</span></button><button type="button" data-personal-action="orders"><strong>0</strong><span>待评价</span></button><button type="button" data-personal-action="orders"><strong>1</strong><span>已完成</span></button></div>
      </section>
      <section class="personal-favorites" aria-labelledby="favoritesTitle">
        <div class="personal-section-heading"><h2 id="favoritesTitle">我的收藏</h2><button type="button" class="personal-link-button" data-personal-action="favorites">查看全部${icon('chevron')}</button></div>
        ${personalFavoritePreview()}
      </section>
      <section class="personal-tools" aria-labelledby="toolsTitle">
        <div class="personal-section-heading"><h2 id="toolsTitle">常用功能</h2></div>
        <div class="personal-tool-grid"><button type="button" data-personal-action="messages"><span>${icon('message')}</span><b>消息通知</b><small>暂无新消息</small></button><button type="button" data-personal-action="gift-record"><span>${icon('gift')}</span><b>礼物记录</b><small>查看收送记录</small></button><button type="button" data-personal-action="help"><span>${icon('help')}</span><b>帮助与反馈</b><small>常见问题</small></button><button type="button" data-personal-action="settings"><span>${icon('settings')}</span><b>设置</b><small>账号与偏好</small></button></div>
      </section>
    </div>
  </div>`;
}
function initPersonalFlashCard(){
  const card=$('#personalHoloCard');
  if(!card)return;
  let drag=null,lastTouchTap=0,suppressDoubleClickUntil=0,keyboardTilt={x:0,y:0};
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
  const setTilt=(x,y)=>{card.style.setProperty('--card-tilt-x',`${x}deg`);card.style.setProperty('--card-tilt-y',`${y}deg`);};
  const toggleFloating=()=>{const floating=!card.classList.contains('is-floating');card.classList.toggle('is-floating',floating);card.setAttribute('aria-pressed',String(floating));};
  card.addEventListener('pointerdown',event=>{
    if(event.isPrimary===false||(event.pointerType==='mouse'&&event.button!==0))return;
    drag={id:event.pointerId,x:event.clientX,y:event.clientY,moved:false};
    card.setPointerCapture(event.pointerId);card.classList.add('is-tilting');event.preventDefault();
  });
  card.addEventListener('pointermove',event=>{
    if(!drag||event.pointerId!==drag.id)return;
    const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
    if(Math.hypot(dx,dy)>5)drag.moved=true;
    setTilt(clamp(-dy*.18,-16,16),clamp(dx*.18,-16,16));event.preventDefault();
  });
  function finishDrag(event,cancelled=false){
    if(!drag||event.pointerId!==drag.id)return;
    const moved=drag.moved;drag=null;
    if(card.hasPointerCapture(event.pointerId))card.releasePointerCapture(event.pointerId);
    card.classList.remove('is-tilting');setTilt(0,0);keyboardTilt={x:0,y:0};
    if(moved){suppressDoubleClickUntil=performance.now()+450;return;}
    if(!cancelled&&event.pointerType==='touch'){
      const now=performance.now();
      if(now-lastTouchTap<360){toggleFloating();lastTouchTap=0;suppressDoubleClickUntil=now+450;}
      else lastTouchTap=now;
    }
  }
  card.addEventListener('pointerup',event=>finishDrag(event));
  card.addEventListener('pointercancel',event=>finishDrag(event,true));
  card.addEventListener('dblclick',event=>{if(performance.now()<suppressDoubleClickUntil){event.preventDefault();return;}toggleFloating();});
  card.addEventListener('keydown',event=>{
    const steps={ArrowUp:[-3,0],ArrowDown:[3,0],ArrowLeft:[0,-3],ArrowRight:[0,3]};
    if(steps[event.key]){
      event.preventDefault();keyboardTilt.x=clamp(keyboardTilt.x+steps[event.key][0],-16,16);keyboardTilt.y=clamp(keyboardTilt.y+steps[event.key][1],-16,16);setTilt(keyboardTilt.x,keyboardTilt.y);return;
    }
    if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleFloating();}
    if(event.key==='Escape'){card.classList.remove('is-floating');card.setAttribute('aria-pressed','false');keyboardTilt={x:0,y:0};setTilt(0,0);}
  });
}
function openPersonalCenter(){
  if(sheet.open)closeSheet();
  setNavActive('mine');
  tabReturnFocus=document.activeElement;
  if(tabPage){tabPage.innerHTML=renderPersonalCenter();tabPage.hidden=false;initPersonalFlashCard();}
  document.body.style.overflow='hidden';
  clearTimeout(noticeTimer);
}
function durationName(id){return (dispatchSkus[dispatchOrder.service]||[]).find(item=>item.id===id)?.label||'';}
function dispatchPrice(){return dispatchPrices[dispatchOrder.service]?.[dispatchOrder.duration]??null;}
function localDateTimeMinute(){return new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,16);}
function dispatchStartSummary(){
  if(dispatchOrder.timing!=='schedule')return '现在开始';
  if(!dispatchOrder.appointment)return '待选择';
  const [date,time='']=dispatchOrder.appointment.split('T');
  const [,month,day]=date.split('-');
  return `${Number(month)}/${Number(day)} ${time}`;
}
function dispatchDropdown(id,label,value,options,artwork=''){
  const selected=options.find(option=>option.value===value);
  const optionMarkup=options.map((option,index)=>`<button type="button" class="dispatch-option" id="${id}-option-${index}" role="option" aria-selected="${option.value===value}" data-dispatch-option="${id}" data-value="${option.value}" tabindex="-1"><span class="dispatch-option-copy">${option.icon?`<span class="dispatch-option-symbol">${icon(option.icon)}</span>`:''}<span>${option.label}</span></span><span class="dispatch-option-check">${icon('check')}</span></button>`).join('');
  const serviceMark=id==='dispatchServiceSelect'?`<span class="dispatch-service-mark">${artwork?`<img src="${artwork}" alt="">`:icon('gamepad')}</span>`:'';
  return `<span class="dispatch-select-wrap${id==='dispatchServiceSelect'?' dispatch-service-select':''}" data-dispatch-select-wrap>${serviceMark}<button type="button" class="dispatch-select-trigger" id="${id}" data-dispatch-trigger="true" role="combobox" aria-label="${label}" aria-haspopup="listbox" aria-expanded="false" aria-controls="${id}Options" ${id==='dispatchDurationSelect'&&!dispatchOrder.service?'disabled':''}><span class="dispatch-select-value">${selected?.label||''}</span><svg class="dispatch-select-chevron" aria-hidden="true"><use href="#i-chevron"/></svg></button><span class="dispatch-options${id==='dispatchDurationSelect'?' dispatch-duration-options':''}${id==='dispatchTimingSelect'?' dispatch-timing-options':''}" id="${id}Options" role="listbox" aria-label="${label}选项" hidden>${optionMarkup}</span></span>`;
}
function closeDispatchSelect(restoreFocus=false){
  document.querySelectorAll('.dispatch-select-wrap.is-open').forEach(wrap=>{
    const trigger=wrap.querySelector('.dispatch-select-trigger');
    trigger?.setAttribute('aria-expanded','false');
    trigger?.removeAttribute('aria-activedescendant');
    const panel=wrap.querySelector('.dispatch-options');
    if(panel)panel.hidden=true;
    wrap.classList.remove('is-open','opens-up');
    wrap.closest('.dispatch-field')?.classList.remove('is-open');
    if(restoreFocus)trigger?.focus({preventScroll:true});
  });
}
function setDispatchActiveOption(trigger,option){
  if(!option)return;
  const panel=trigger.closest('.dispatch-select-wrap').querySelector('.dispatch-options');
  panel.querySelectorAll('.dispatch-option').forEach(item=>item.classList.toggle('is-active',item===option));
  trigger.setAttribute('aria-activedescendant',option.id);
}
function openDispatchSelect(trigger){
  const wrap=trigger.closest('.dispatch-select-wrap');
  const panel=wrap.querySelector('.dispatch-options');
  const field=wrap.closest('.dispatch-field');
  const scroll=wrap.closest('.dispatch-scroll');
  panel.hidden=false;
  const spaceBelow=scroll.getBoundingClientRect().bottom-field.getBoundingClientRect().bottom;
  wrap.classList.toggle('opens-up',spaceBelow<Math.min(panel.scrollHeight,248)+10);
  wrap.classList.add('is-open');
  field.classList.add('is-open');
  trigger.setAttribute('aria-expanded','true');
  setDispatchActiveOption(trigger,panel.querySelector('[aria-selected="true"]')||panel.querySelector('.dispatch-option'));
}
function renderDispatchOrder(){
  const durationOptions=dispatchSkus[dispatchOrder.service]||[];
  const durationSelected=durationOptions.some(item=>item.id===dispatchOrder.duration);
  const price=durationSelected?dispatchPrice():null;
  const priceLabel=!durationSelected?'选择时长后确定':price===null?'待配置':`¥${(price*.8).toFixed(2)}`;
  const selectedDuration=durationName(dispatchOrder.duration);
  const minDate=localDateTimeMinute();
  const appointmentReady=dispatchOrder.timing!=='schedule'||Boolean(dispatchOrder.appointment&&dispatchOrder.appointment>=minDate);
  const orderReady=Boolean(dispatchOrder.service&&dispatchOrder.gender&&durationSelected&&dispatchOrder.peopleCount&&dispatchOrder.timing&&dispatchOrder.repeatScope)&&appointmentReady;
  const summaryItems=[
    ['服务',dispatchOrder.service||'待选择'],
    ['性别',dispatchOrder.gender==='不限'?'不限':`${dispatchOrder.gender}陪玩`],
    ['服务时长',selectedDuration||'待选择'],
    ['陪玩人数',`${dispatchOrder.peopleCount}位`],
    ['开始时间',dispatchStartSummary(),'dispatchSummaryStart'],
    ['接单范围',dispatchOrder.repeatScope==='new'?'仅未接过我的单':'可重复接单']
  ];
  const serviceOptions=[{value:'',label:'请选择服务'},...games.map(game=>({value:game,label:game}))];
  const durationOptionsWithPlaceholder=[{value:'',label:'请选择时长'},...durationOptions.map(item=>({value:item.id,label:`${item.label}${item.detail?`（${item.detail}）`:''}`}))];
  $('#sheetBody').innerHTML=`
    <div class="dispatch-page">
      <header class="dispatch-header"><button class="dispatch-back" type="button" data-order-action="back" aria-label="返回"><svg aria-hidden="true"><use href="#i-chevron"/></svg></button><h2>系统派单</h2><span class="dispatch-header-spacer" aria-hidden="true"></span></header>
      <div class="dispatch-scroll">
        <div class="dispatch-content">
          <div class="dispatch-form" role="group" aria-label="系统派单条件">
            <label class="dispatch-field"><span class="dispatch-field-label"><svg aria-hidden="true"><use href="#i-gamepad"/></svg>服务选择</span>${dispatchDropdown('dispatchServiceSelect','服务选择',dispatchOrder.service,serviceOptions,dispatchOrder.service?dispatchArtwork[dispatchOrder.service]:'')}</label>
            <label class="dispatch-field"><span class="dispatch-field-label"><svg aria-hidden="true"><use href="#i-people"/></svg>性别</span>${dispatchDropdown('dispatchGenderSelect','性别',dispatchOrder.gender,[{value:'不限',label:'不限'},{value:'女',label:'女陪玩'},{value:'男',label:'男陪玩'}])}</label>
            <label class="dispatch-field"><span class="dispatch-field-label"><svg aria-hidden="true"><use href="#i-clock"/></svg>服务时长</span>${dispatchDropdown('dispatchDurationSelect','服务时长',dispatchOrder.duration,durationOptionsWithPlaceholder)}</label>
            <label class="dispatch-field"><span class="dispatch-field-label"><svg aria-hidden="true"><use href="#i-people"/></svg>陪玩人数</span>${dispatchDropdown('dispatchPeopleCountSelect','陪玩人数',dispatchOrder.peopleCount,[1,2,3,4,5].map(count=>({value:String(count),label:`${count}位陪玩`})) )}</label>
            <label class="dispatch-field"><span class="dispatch-field-label"><svg aria-hidden="true"><use href="#i-calendar"/></svg>开始时间</span>${dispatchDropdown('dispatchTimingSelect','开始时间',dispatchOrder.timing,[{value:'now',label:'现在开始',icon:'clock'},{value:'schedule',label:'预约时间',icon:'calendar'}])}</label>
            <label class="dispatch-field"><span class="dispatch-field-label"><svg aria-hidden="true"><use href="#i-people"/></svg>接单范围</span>${dispatchDropdown('dispatchScopeSelect','接单范围',dispatchOrder.repeatScope,[{value:'all',label:'不限，接过我的单也可接'},{value:'new',label:'只安排没接过我的单'}])}</label>
            ${dispatchOrder.timing==='schedule'?`<label class="dispatch-field dispatch-date-field"><span class="dispatch-field-label"><svg aria-hidden="true"><use href="#i-calendar"/></svg>预约时间</span><input id="dispatchAppointment" type="datetime-local" min="${minDate}" value="${dispatchOrder.appointment}" aria-label="预约时间"></label>`:''}
          </div>
        </div>
      </div>
      <footer class="dispatch-footer"><dl class="dispatch-summary" aria-label="已选信息">${summaryItems.map(([label,value,id])=>`<div><dt>${label}</dt><dd${id?` id="${id}"`:''}>${value}</dd></div>`).join('')}</dl><p class="dispatch-note" role="note">系统派单一律享8折优惠，不支持指定个人。请确认服务、性别、人数、时长和开始时间。</p><div class="dispatch-total"><span>${selectedDuration?`${selectedDuration} · 优惠后`:'本单金额'}</span><strong>${priceLabel}</strong></div><div class="dispatch-footer-actions"><button type="button" class="dispatch-submit" data-order-action="submit" ${!orderReady?'disabled':''}>下单</button></div></footer>
    </div>`;
  const appointment=$('#dispatchAppointment');
  if(appointment)appointment.addEventListener('input',()=>{
    dispatchOrder.appointment=appointment.value;
    const ready=Boolean(dispatchOrder.service&&dispatchOrder.gender&&dispatchOrder.duration&&dispatchOrder.timing==='schedule'&&dispatchOrder.repeatScope&&dispatchOrder.appointment>=minDate);
    $('#dispatchSummaryStart').textContent=dispatchStartSummary();
    $('#sheetBody [data-order-action="submit"]').disabled=!ready;
  });
}
function openDispatchOrder(project=''){
  dispatchOrder={service:games.includes(project)?project:'',gender:'不限',duration:'',peopleCount:'1',timing:'now',appointment:'',repeatScope:'all'};
  orderMode='dispatch';selectedPerson=null;selectedGame=dispatchOrder.service;
  sheet.classList.add('order-flow');$('#sheetTitle').textContent='系统派单';renderDispatchOrder();
  if(!sheet.open){returnFocus=document.activeElement;sheet.showModal();document.body.style.overflow='hidden';}
  clearTimeout(noticeTimer);
}
function openServices(mode,person=null,project=''){orderMode=mode;selectedPerson=person;selectedGame=project;if(mode==='dispatch')return openDispatchOrder(project);const available=person?person.games:games;const note=person?`<div class="selected-person"><img src="${person.image}" alt=""><p><b>${person.name}</b><span>全价指定陪玩</span></p></div>`:`<p class="sheet-note">全价指定 · 选喜欢的 TA</p>`;showSheet(person?'指定 TA':'我要点单',note+`<div class="service-options">${available.map(g=>`<button class="service-option ${selectedGame===g?'selected':''}" data-service="${g}" aria-pressed="${selectedGame===g}"><span>${g}</span>${icon(selectedGame===g?'check':'chevron')}</button>`).join('')}</div><button class="sheet-confirm" id="confirmService" ${selectedGame?'':'disabled'}>选好了</button>`);}
function personRows(list){return list.map(p=>`<button class="person-row" data-person="${p.name}"><img src="${p.image}" width="54" height="54" alt=""><span><b>${p.name}</b><small>${p.games.join(' · ')}</small></span>${icon('chevron')}</button>`).join('');}
function chooseRole(person){return person.role||'常驻'}
function chooseFilterOptions(filter){if(filter==='service')return [{value:'',label:'全部服务'},...games.map(game=>({value:game,label:game}))];return [{value:'',label:'全部身份'},{value:'头牌',label:'头牌'},{value:'新人',label:'新人'},{value:'常驻',label:'常驻'}]}
function chooseFilterDropdown(filter,label,value){const options=chooseFilterOptions(filter);const selected=options.find(option=>option.value===value)||options[0];const prefix=filter[0].toUpperCase()+filter.slice(1);return `<span class="choose-filter-select" data-choose-select-wrap><button type="button" class="choose-filter-trigger" id="choose${prefix}Filter" data-choose-trigger="true" role="combobox" aria-label="${label}" aria-haspopup="listbox" aria-expanded="false" aria-controls="choose${prefix}Options"><span class="choose-filter-value">${selected.label}</span><svg class="choose-filter-chevron" aria-hidden="true"><use href="#i-chevron"/></svg></button><span class="choose-filter-options" id="choose${prefix}Options" role="listbox" aria-label="${label}选项" hidden>${options.map((option,index)=>`<button type="button" class="choose-filter-option" id="choose${prefix}Option${index}" role="option" aria-selected="${option.value===selected.value}" data-choose-option="${filter}" data-value="${option.value}" data-label="${option.label}" tabindex="-1"><span>${option.label}</span><span class="choose-filter-check">${icon('check')}</span></button>`).join('')}</span></span>`}
function chooseOrderSkus(service){return (chooseOrderSkuCatalog[service]||chooseOrderSkuCatalog['王者荣耀']).map(([label,display,price])=>({value:label,label,display,price}))}
function chooseOrderText(option){return option?.display?`${option.label} · ${option.display}`:(option?.label||'')}
function chooseOrderDropdown(id,label,options,value,withMark=false){const selected=options.find(option=>option.value===value)||options[0];const panelId=`${id}Options`;return `<span class="choose-order-select-wrap" data-choose-order-select-wrap><button type="button" class="choose-order-select-trigger${withMark?' choose-order-service-trigger':''}" id="${id}" data-choose-order-trigger="true" role="combobox" aria-label="${label}" aria-haspopup="listbox" aria-expanded="false" aria-controls="${panelId}">${withMark?`<span class="choose-order-select-mark">${icon('gamepad')}</span>`:''}<span class="choose-order-select-value">${chooseOrderText(selected)}</span><svg class="choose-order-select-chevron" aria-hidden="true"><use href="#i-chevron"/></svg></button><span class="choose-order-options" id="${panelId}" role="listbox" aria-label="${label}选项" hidden>${options.map((option,index)=>`<button type="button" class="choose-order-option" id="${id}Option${index}" role="option" aria-selected="${option.value===selected?.value}" data-choose-order-option="${id}" data-value="${option.value}" data-label="${option.label}" data-display="${option.display||''}" data-price="${option.price??''}" tabindex="-1"><span class="choose-order-option-copy">${chooseOrderText(option)}</span><span class="choose-order-option-check">${icon('check')}</span></button>`).join('')}</span></span>`}
function chooseOrderStartSummary(){if(chooseOrderState.timing!=='schedule')return '现在开始';if(!chooseOrderState.appointment)return '待选择';const [date,time='']=chooseOrderState.appointment.split('T');const [,month,day]=date.split('-');return `${Number(month)}/${Number(day)} ${time}`}
function chooseOrderSelectedSku(){return chooseOrderSkus(chooseOrderState.service).find(option=>option.value===chooseOrderState.sku)||chooseOrderSkus(chooseOrderState.service)[0]}
function syncChooseOrderSummary(){const sku=chooseOrderSelectedSku();const serviceNode=$('#chooseOrderSummaryService');const skuNode=$('#chooseOrderSummarySku');const priceNode=$('#chooseOrderSummaryPrice');const startNode=$('#chooseOrderSummaryStart');if(serviceNode)serviceNode.textContent=chooseOrderState.service||'待选择';if(skuNode)skuNode.textContent=sku?.label||'待选择';if(priceNode)priceNode.textContent=sku?sku.display:'待配置';if(startNode)startNode.textContent=chooseOrderStartSummary()}
function renderChooseOrderSkuOptions(){const trigger=$('#chooseOrderSku');const panel=$('#chooseOrderSkuOptions');if(!trigger||!panel)return;const options=chooseOrderSkus(chooseOrderState.service);const selected=options.find(option=>option.value===chooseOrderState.sku)||options[0];chooseOrderState.sku=selected?.value||'';trigger.dataset.value=selected?.value||'';trigger.dataset.label=selected?.label||'';trigger.dataset.display=chooseOrderText(selected);trigger.dataset.price=selected?.price??'';trigger.querySelector('.choose-order-select-value').textContent=chooseOrderText(selected);panel.innerHTML=options.map((option,index)=>`<button type="button" class="choose-order-option" id="chooseOrderSkuOption${index}" role="option" aria-selected="${option.value===selected?.value}" data-choose-order-option="chooseOrderSku" data-value="${option.value}" data-label="${option.label}" data-display="${option.display||''}" data-price="${option.price??''}" tabindex="-1"><span class="choose-order-option-copy">${chooseOrderText(option)}</span><span class="choose-order-option-check">${icon('check')}</span></button>`).join('');syncChooseOrderSummary()}
function renderChooseOrderDialog(){const person=chooseOrderState.person;if(!person)return;const services=person.games.map(game=>({value:game,label:game}));const service=services.find(option=>option.value===chooseOrderState.service)||services[0];chooseOrderState.service=service?.value||'';const sku=chooseOrderSelectedSku();chooseOrderState.sku=sku?.value||'';const minDate=localDateTimeMinute();const noteValue=chooseOrderState.note.replace(/&/g,'&amp;').replace(/</g,'&lt;');const dialog=$('#chooseOrderDialog');if(!dialog)return;dialog.innerHTML=`<div class="choose-order-panel" role="dialog" aria-modal="true" aria-labelledby="chooseOrderTitle"><button class="choose-order-close" type="button" data-choose-order-action="close" aria-label="关闭选中陪玩"><svg aria-hidden="true"><use href="#i-close"/></svg></button><div class="choose-order-head"><div class="choose-order-identity"><img src="${person.image}" alt="${person.name}头像"><div><p class="choose-order-kicker">选中陪玩</p><h2 id="chooseOrderTitle">${person.name}</h2></div></div><span class="choose-order-online">在线</span></div><form class="choose-order-form" id="chooseOrderForm" novalidate><label class="choose-order-field"><span>服务</span>${chooseOrderDropdown('chooseOrderService','服务',services,chooseOrderState.service,true)}</label><label class="choose-order-field"><span>SKU / 时长</span>${chooseOrderDropdown('chooseOrderSku','SKU / 时长',chooseOrderSkus(chooseOrderState.service),chooseOrderState.sku)}</label><label class="choose-order-field"><span>备注</span><textarea class="choose-order-note" id="chooseOrderNote" placeholder="填写房间号（选填）">${noteValue}</textarea></label><fieldset class="choose-order-mode-field"><legend>开始时间</legend><div class="choose-order-mode"><label class="choose-order-mode-option"><input type="radio" name="chooseOrderMode" value="now" ${chooseOrderState.timing==='now'?'checked':''}><span>立即开始</span></label><label class="choose-order-mode-option"><input type="radio" name="chooseOrderMode" value="schedule" ${chooseOrderState.timing==='schedule'?'checked':''}><span>预约时间</span></label></div><div class="choose-order-schedule-wrap" id="chooseOrderScheduleWrap" ${chooseOrderState.timing==='schedule'?'':'hidden'}><input class="choose-order-schedule" id="chooseOrderAppointment" type="datetime-local" min="${minDate}" value="${chooseOrderState.appointment}" aria-label="预约时间"></div></fieldset><div class="choose-order-summary"><div><strong id="chooseOrderSummaryService">${chooseOrderState.service}</strong><small id="chooseOrderSummarySku">${sku?.label||'一局'}</small><small>开始：<span id="chooseOrderSummaryStart">${chooseOrderStartSummary()}</span></small></div><strong id="chooseOrderSummaryPrice">${sku?.display||'待配置'}</strong></div><button class="choose-order-submit" id="chooseOrderSubmit" type="submit">确认下单</button></form></div>`;dialog.hidden=false;syncChooseOrderSummary()}
function openChooseOrder(person){if(!person?.name)return;chooseOrderReturnFocus=document.activeElement;chooseOrderState={person,service:person.games[0]||games[0],sku:'',timing:'now',appointment:'',note:''};renderChooseOrderDialog()}
function closeChooseOrder(){const dialog=$('#chooseOrderDialog');if(!dialog)return;closeChooseOrderSelect();dialog.hidden=true;dialog.innerHTML='';chooseOrderReturnFocus?.focus({preventScroll:true});chooseOrderReturnFocus=null}
function closeChooseOrderSelect(restoreFocus=false){document.querySelectorAll('[data-choose-order-select-wrap].is-open').forEach(wrap=>{const trigger=wrap.querySelector('[data-choose-order-trigger]');trigger?.setAttribute('aria-expanded','false');trigger?.removeAttribute('aria-activedescendant');const panel=wrap.querySelector('.choose-order-options');if(panel)panel.hidden=true;wrap.classList.remove('is-open','opens-up');if(restoreFocus)trigger?.focus({preventScroll:true})})}
function setChooseOrderActiveOption(trigger,option){if(!option)return;const panel=trigger.closest('[data-choose-order-select-wrap]').querySelector('.choose-order-options');panel.querySelectorAll('.choose-order-option').forEach(item=>item.classList.toggle('is-active',item===option));trigger.setAttribute('aria-activedescendant',option.id)}
function openChooseOrderSelect(trigger){closeChooseOrderSelect();const wrap=trigger.closest('[data-choose-order-select-wrap]');const panel=wrap.querySelector('.choose-order-options');const host=$('#chooseOrderDialog .choose-order-panel');panel.hidden=false;const spaceBelow=host.getBoundingClientRect().bottom-wrap.getBoundingClientRect().bottom;wrap.classList.toggle('opens-up',spaceBelow<Math.min(panel.scrollHeight,248)+10);wrap.classList.add('is-open');trigger.setAttribute('aria-expanded','true');setChooseOrderActiveOption(trigger,panel.querySelector('[aria-selected="true"]')||panel.querySelector('.choose-order-option'))}
function chooseOrderOption(option){const trigger=$(`#${option.dataset.chooseOrderOption}`);if(!trigger)return;const panel=trigger.closest('[data-choose-order-select-wrap]').querySelector('.choose-order-options');panel.querySelectorAll('.choose-order-option').forEach(item=>item.setAttribute('aria-selected',String(item===option)));trigger.dataset.value=option.dataset.value;trigger.dataset.label=option.dataset.label||'';trigger.dataset.display=option.dataset.display||option.dataset.label||'';trigger.dataset.price=option.dataset.price||'';trigger.querySelector('.choose-order-select-value').textContent=trigger.dataset.display;closeChooseOrderSelect();trigger.focus({preventScroll:true});if(trigger.id==='chooseOrderService'){chooseOrderState.service=option.dataset.value;chooseOrderState.sku='';renderChooseOrderSkuOptions();}else{chooseOrderState.sku=option.dataset.value;syncChooseOrderSummary()}}
function shopPrice(product){return product.price||'待配置'}
function renderShopOrder(){
  const product=shopOrderState.product;if(!product)return;
  if(shopOrderState.stage==='payment'){renderShopPayment();return;}
  const detailImage=product.detailImage??product.image;
  $('#sheetBody').innerHTML=`<div class="shop-order-page shop-order-detail"><button type="button" class="shop-order-back" data-shop-order-action="back" aria-label="返回橱窗"><svg aria-hidden="true"><use href="#i-chevron"/></svg><span>橱窗</span></button><div class="shop-order-package"><div><h2>${product.title}</h2><p>${product.game}</p></div><strong>${product.price}</strong></div>${detailImage?`<img class="shop-order-main-image" src="${detailImage}" alt="${product.title}">`:''}<div class="shop-order-info"><section class="shop-order-info-card"><h3 class="shop-order-info-title">详情</h3><p>${product.intro}</p></section><section class="shop-order-info-card is-notice"><h3 class="shop-order-info-title">注意事项</h3><p>${product.notice}</p></section></div><button type="button" class="shop-order-submit shop-order-detail-submit" data-shop-order-action="pay">立即下单</button></div>`;
}
function renderShopPayment(){
  const product=shopOrderState.product;if(!product)return;
  const noteValue=shopOrderState.note.replace(/&/g,'&amp;').replace(/</g,'&lt;');
  $('#sheetBody').innerHTML=`<div class="shop-order-page shop-payment-page"><button type="button" class="shop-order-back" data-shop-order-action="detail" aria-label="返回详情"><svg aria-hidden="true"><use href="#i-chevron"/></svg><span>详情</span></button><h2 class="shop-payment-title">确认订单</h2><div class="shop-payment-product">${product.image?`<img src="${product.image}" alt="">`:''}<div><strong>${product.title}</strong><span>${product.game}</span></div><b>${product.price}</b></div><label class="shop-order-field shop-payment-note"><span>备注</span><textarea id="shopPaymentNote">${noteValue}</textarea></label><div class="shop-payment-total"><span>支付金额</span><strong>${product.price}</strong></div><button type="button" class="shop-order-submit" data-shop-order-action="confirm-payment">确认支付</button></div>`;
  $('#shopPaymentNote')?.addEventListener('input',e=>{shopOrderState.note=e.target.value;});
}
function openShopOrder(product){
  if(!product)return;
  if(tabPage&&!tabPage.hidden)closeTabPage(false,false);
  shopOrderState={product,note:'',stage:'detail'};
  orderMode='dispatch';selectedPerson=null;selectedGame=product.game;
  showSheet(product.title,'');
  sheet.classList.add('shop-order-flow');
  renderShopOrder();
}
function shopFilteredProducts(){
  const query=shopFilters.query.trim().toLowerCase();
  return shopProducts.filter(product=>{
    const matchesService=!shopFilters.service||product.game===shopFilters.service;
    const searchable=`${product.title}${product.label}${product.game}`.toLowerCase();
    return matchesService&&(!query||searchable.includes(query));
  });
}
function shopProductCard(product,index){return `<article class="shop-product-card">
    <button type="button" class="shop-product-media shop-product-media-${index%4}" data-shop-product="${product.id}" aria-label="立即下单${product.title}">
      <img src="${product.image}" width="768" height="512" alt="">
      <span class="shop-product-number">${String(index+1).padStart(2,'0')}</span>
    </button>
    <div class="shop-product-body">
      <div class="shop-product-meta"><span>${product.game}</span></div>
      <h3>${product.title}</h3>
      <div class="shop-product-footer"><strong>${shopPrice(product)}</strong><button type="button" class="shop-product-action" data-shop-product="${product.id}">立即下单${icon('arrow')}</button></div>
    </div>
  </article>`}
function renderShopProducts(){
  const grid=$('#shopProductGrid');
  if(!grid)return;
  const products=shopFilteredProducts();
  grid.innerHTML=products.length?products.map(shopProductCard).join(''):'<div class="shop-empty">没有匹配项目</div>';
  document.querySelectorAll('[data-shop-filter]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.shopFilter===shopFilters.service)));
}
function renderShopPage(){
  if(tabPage)tabPage.innerHTML=`<div class="shop-page"><div class="shop-scroll"><div class="shop-controls"><label class="shop-search"><svg aria-hidden="true"><use href="#i-search"/></svg><input id="shopSearch" type="search" placeholder="搜索项目" autocomplete="off" aria-label="搜索项目"></label><div class="shop-filter-strip" role="group" aria-label="服务筛选">${['','王者荣耀','和平精英','原神'].map((service,index)=>`<button type="button" data-shop-filter="${service}" aria-pressed="${index===0}" ${index===0?'class="is-active"':''}>${service||'全部服务'}</button>`).join('')}</div></div><div class="shop-grid" id="shopProductGrid"></div></div></div>`;
  renderShopProducts();
}
function openShopPage(){
  if(sheet.open)closeSheet();
  setNavActive('shop');
  tabReturnFocus=document.activeElement;
  renderShopPage();
  if(tabPage)tabPage.hidden=false;
  document.body.style.overflow='hidden';
  clearTimeout(noticeTimer);
}
function renderOrdersContent(){
  const content=$('#ordersContent');
  if(!content)return;
  document.querySelectorAll('[data-order-status]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.orderStatus===orderStatus)));
  const order=orderExamples[orderStatus];
  content.classList.toggle('has-orders',Boolean(order));
  if(!order){content.innerHTML='';return;}
  const active=orderStatus==='processing';
  const companions=order.companions.length?order.companions.join('、'):`待系统安排（${order.peopleCount}位）`;
  content.innerHTML=`<div class="orders-list"><article class="order-card ${active?'is-processing':'is-completed'}" role="button" tabindex="0" data-order-id="${order.id}" aria-label="${order.mode}，${order.service}，${order.sku}，查看订单详情"><header class="order-card-head"><span class="order-card-status-group"><span class="order-status">${order.status}</span><span class="order-mode">${order.mode}</span></span><time>${order.time}</time></header><div class="order-product"><img src="${order.image}" alt=""><div class="order-product-copy"><h2>${order.service}</h2><p class="order-sku">${order.sku}</p><p>陪玩：<strong>${companions}</strong></p></div></div><footer class="order-card-foot"><span>订单金额</span><strong>${order.price}</strong><span class="order-card-more">查看详情 ${icon('chevron')}</span></footer></article></div>`;
}
function renderOrderDetail(orderId){
  const order=Object.values(orderExamples).find(item=>item.id===orderId);
  if(!order||!tabPage)return;
  const isDispatch=order.mode==='系统派单';
  const companionText=order.companions.length?order.companions.join('、'):`等待系统匹配（${order.peopleCount}位）`;
  const details=[
    ['开始时间',order.startTime],
    ...(order.endTime?[['结束时间',order.endTime]]:[]),
    ['陪玩人数',`${order.peopleCount}位`],
    ['陪玩',companionText],
    ['订单号',order.id]
  ];
  tabPage.innerHTML=`<div class="orders-detail-page"><header class="orders-detail-header"><button type="button" class="orders-detail-back" data-order-detail-back aria-label="返回订单"><svg aria-hidden="true"><use href="#i-chevron"/></svg></button><h1>订单详情</h1><span aria-hidden="true"></span></header><div class="orders-detail-scroll"><section class="order-detail-status ${isDispatch?'is-dispatch':'is-done'}"><span class="order-detail-status-icon">${icon(isDispatch?'clock':'check')}</span><div><strong>${order.status}</strong><p>${isDispatch?'正在联系陪玩':'服务已完成'}</p></div><span class="order-detail-mode">${order.mode}</span></section><section class="order-detail-product"><img src="${order.image}" alt=""><div><span>服务</span><h2>${order.service}</h2><p>${order.sku}</p></div><strong>${order.price}</strong></section><dl class="order-detail-list">${details.map(([label,value])=>`<div><dt>${label}</dt><dd>${value}</dd></div>`).join('')}</dl></div></div>`;
}
function renderOrdersPage(){
  if(!tabPage)return;
  tabPage.innerHTML=`<div class="orders-page"><header class="orders-header"><h1>订单</h1></header><div class="orders-tabs" role="group" aria-label="订单分类"><button type="button" data-order-status="processing" aria-pressed="${orderStatus==='processing'}">进行中</button><button type="button" data-order-status="completed" aria-pressed="${orderStatus==='completed'}">已完成</button></div><section class="orders-content" id="ordersContent" aria-live="polite" aria-atomic="true"></section></div>`;
  renderOrdersContent();
}
function returnToOrders(){renderOrdersPage();}
function openOrdersPage(){
  if(sheet.open)closeSheet();
  setNavActive('orders');
  tabReturnFocus=document.activeElement;
  renderOrdersPage();
  if(tabPage)tabPage.hidden=false;
  document.body.style.overflow='hidden';
  clearTimeout(noticeTimer);
}
function closeTabPage(setHome=true,restoreFocus=true){
  if(!tabPage||tabPage.hidden)return;
  tabPage.hidden=true;
  tabPage.innerHTML='';
  document.body.style.overflow='';
  if(setHome)setNavActive('home');
  if(restoreFocus)tabReturnFocus?.focus({preventScroll:true});
  tabReturnFocus=null;
}
 function choosePersonRow(person){const role=chooseRole(person);const roleClass=role==='头牌'?'featured':role==='新人'?'new':'regular';const avatarFrame=role==='头牌'?`<span class="choose-crown-frame" aria-label="头牌"><svg aria-hidden="true"><use href="#i-crown"/></svg></span>`:'';const roleBadge=role==='头牌'?'':`<em class="choose-role choose-role-${roleClass}">${role}</em>`;return `<article class="choose-person-row"><button type="button" class="choose-person-avatar ${role==='头牌'?'is-featured':''}" data-person-open="${person.name}" aria-label="查看${person.name}主页"><img src="${person.image}" width="58" height="58" alt="${person.name}">${avatarFrame}</button><div class="choose-person-info"><button type="button" class="choose-person-open" data-person-open="${person.name}"><span class="choose-person-name"><b>${person.name}</b>${genderHTML(person)}${roleBadge}</span><span class="choose-person-tags">${person.games.map(game=>`<span>${game}</span>`).join('')}</span></button><button type="button" class="choose-voice voice-button" data-person-voice="${person.name}" aria-label="试听${person.name}的声音"><span class="voice-play"><svg aria-hidden="true"><use href="#i-play"/></svg></span><span class="waveform" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span><span class="voice-label">试听</span></button></div><button type="button" class="choose-order" data-person-order="${person.name}">下单${icon('arrow')}</button></article>`}
function renderChooseList(){const query=chooseFilters.query.trim().toLowerCase();const list=allPeople.filter(person=>{const matchesService=!chooseFilters.service||person.games.includes(chooseFilters.service);const matchesRole=!chooseFilters.role||chooseRole(person)===chooseFilters.role;const searchable=`${person.name}${person.games.join('')}${chooseRole(person)}`.toLowerCase();return matchesService&&matchesRole&&(!query||searchable.includes(query))});const listNode=$('#personList');if(!listNode)return;listNode.innerHTML=list.length?list.map(choosePersonRow).join(''):'<div class="choose-empty">没有找到合适的陪玩</div>';$('#chooseCount').textContent=`${list.length}位`}
function renderChoosePage(){const searchValue=chooseFilters.query.replace(/"/g,'&quot;');$('#sheetBody').innerHTML=`<div class="choose-page"><header class="choose-header"><button class="choose-back" type="button" data-order-action="back" aria-label="返回"><svg aria-hidden="true"><use href="#i-chevron"/></svg></button><h2>我要点单</h2><span class="choose-header-count" id="chooseCount"></span></header><div class="choose-scroll"><div class="choose-content"><label class="choose-search"><svg aria-hidden="true"><use href="#i-search"/></svg><input id="personSearch" type="search" placeholder="搜索昵称或游戏" autocomplete="off" aria-label="搜索昵称或游戏" value="${searchValue}"></label><div class="choose-filter-row"><div class="choose-filter-cell"><span>服务</span>${chooseFilterDropdown('service','服务',chooseFilters.service)}</div><div class="choose-filter-cell"><span>身份</span>${chooseFilterDropdown('role','身份',chooseFilters.role)}</div></div><div class="choose-person-list" id="personList"></div></div></div><section class="choose-order-dialog" id="chooseOrderDialog" hidden></section></div>`;renderChooseList()}
function showChoosePage(project=''){if(tabPage&&!tabPage.hidden)closeTabPage(false,false);selectedGame=project;chooseFilters={service:games.includes(project)?project:'',role:'',query:''};setNavActive('choose');sheet.classList.remove('order-flow','shop-flow');sheet.classList.add('choose-flow');$('#sheetTitle').textContent='我要点单';renderChoosePage();if(!sheet.open){returnFocus=document.activeElement;sheet.showModal();document.body.style.overflow='hidden';}sheet.scrollTop=0;clearTimeout(noticeTimer)}
function closeChooseFilter(restoreFocus=false){document.querySelectorAll('[data-choose-select-wrap].is-open').forEach(wrap=>{const trigger=wrap.querySelector('[data-choose-trigger]');trigger?.setAttribute('aria-expanded','false');trigger?.removeAttribute('aria-activedescendant');const panel=wrap.querySelector('.choose-filter-options');if(panel)panel.hidden=true;wrap.classList.remove('is-open','opens-up');if(restoreFocus)trigger?.focus({preventScroll:true})})}
function setChooseActiveOption(trigger,option){if(!option)return;const panel=trigger.closest('[data-choose-select-wrap]').querySelector('.choose-filter-options');panel.querySelectorAll('.choose-filter-option').forEach(item=>item.classList.toggle('is-active',item===option));trigger.setAttribute('aria-activedescendant',option.id)}
function openChooseFilter(trigger){closeChooseFilter();const wrap=trigger.closest('[data-choose-select-wrap]');const panel=wrap.querySelector('.choose-filter-options');const host=sheet.querySelector('.choose-scroll');panel.hidden=false;const spaceBelow=host.getBoundingClientRect().bottom-wrap.getBoundingClientRect().bottom;wrap.classList.toggle('opens-up',spaceBelow<Math.min(panel.scrollHeight,248)+10);wrap.classList.add('is-open');trigger.setAttribute('aria-expanded','true');setChooseActiveOption(trigger,panel.querySelector('[aria-selected="true"]')||panel.querySelector('.choose-filter-option'))}
function chooseFilterValue(option){const trigger=option.closest('[data-choose-select-wrap]').querySelector('[data-choose-trigger]');const filter=option.dataset.chooseOption;chooseFilters[filter]=option.dataset.value;option.closest('.choose-filter-options').querySelectorAll('.choose-filter-option').forEach(item=>item.setAttribute('aria-selected',String(item===option)));trigger.querySelector('.choose-filter-value').textContent=option.dataset.label;closeChooseFilter();trigger.focus({preventScroll:true});renderChooseList()}
function openPeople(search=false,project=''){showChoosePage(project)}
function chooseProject(project){selectedGame=project;showSheet(project,`<div class="mode-choice"><button data-mode="dispatch">系统派单<small>项目8折 · 不指定陪玩</small></button><button data-mode="choose">我要点单<small>项目全价 · 指定陪玩</small></button></div>`);}
function openPage(type){if(type==='shop'){if(tabPage&&!tabPage.hidden)closeTabPage(false,false);return openShopPage();}if(type==='orders'){if(tabPage&&!tabPage.hidden)closeTabPage(false,false);return openOrdersPage();}if(type==='mine')return openPersonalCenter();if(type==='messages')return showSheet('消息',`<div class="empty-state">${icon('message')}暂时没有新消息</div>`);if(tabPage&&!tabPage.hidden)closeTabPage(false,false);if(type==='notice')return openNotice();if(type==='newcomers')return showSheet('新人报道',`<div class=person-list>${personRows(newcomers)}</div>`);if(type==='dispatch')return openServices('dispatch');if(type==='choose')return openPeople();if(type==='search')return openPeople(true);if(type==='projects')return showSheet('陪玩项目',`<div class="service-options">${games.map(g=>`<button class="service-option" data-project="${g}">${g}${icon('chevron')}</button>`).join('')}</div>`);}
document.addEventListener('keydown',e=>{
  const trigger=e.target.closest('.dispatch-select-trigger');
  if(!trigger)return;
  const wrap=trigger.closest('.dispatch-select-wrap');
  const options=[...wrap.querySelectorAll('.dispatch-option')];
  const activeIndex=options.findIndex(option=>option.id===trigger.getAttribute('aria-activedescendant'));
  if(e.key==='Escape'&&trigger.getAttribute('aria-expanded')==='true'){
    e.preventDefault();closeDispatchSelect(true);return;
  }
  if(e.key==='ArrowDown'||e.key==='ArrowUp'){
    e.preventDefault();
    if(trigger.getAttribute('aria-expanded')!=='true')openDispatchSelect(trigger);
    else{
      const delta=e.key==='ArrowDown'?1:-1;
      const next=options[(Math.max(activeIndex,0)+delta+options.length)%options.length];
      setDispatchActiveOption(trigger,next);
    }
  }else if(trigger.getAttribute('aria-expanded')==='true'&&(e.key==='Home'||e.key==='End')){
    e.preventDefault();setDispatchActiveOption(trigger,e.key==='Home'?options[0]:options[options.length-1]);
  }else if(trigger.getAttribute('aria-expanded')==='true'&&e.key==='Enter'){
    e.preventDefault();options[activeIndex]?.click();
  }
});
document.addEventListener('keydown',e=>{
  const trigger=e.target.closest('[data-choose-trigger]');
  if(!trigger)return;
  const wrap=trigger.closest('[data-choose-select-wrap]');
  const options=[...wrap.querySelectorAll('.choose-filter-option')];
  const activeIndex=options.findIndex(option=>option.id===trigger.getAttribute('aria-activedescendant'));
  if(e.key==='ArrowDown'||e.key==='ArrowUp'){
    e.preventDefault();
    if(trigger.getAttribute('aria-expanded')!=='true')openChooseFilter(trigger);
    else{const delta=e.key==='ArrowDown'?1:-1;setChooseActiveOption(trigger,options[(Math.max(activeIndex,0)+delta+options.length)%options.length]);}
  }else if(trigger.getAttribute('aria-expanded')==='true'&&(e.key==='Home'||e.key==='End')){
    e.preventDefault();setChooseActiveOption(trigger,e.key==='Home'?options[0]:options[options.length-1]);
  }else if(trigger.getAttribute('aria-expanded')==='true'&&e.key==='Enter'){
    e.preventDefault();if(options[activeIndex])chooseFilterValue(options[activeIndex]);
  }
});
 document.addEventListener('keydown',e=>{
   const trigger=e.target.closest('[data-choose-order-trigger]');
   if(!trigger)return;
   const wrap=trigger.closest('[data-choose-order-select-wrap]');
   const options=[...wrap.querySelectorAll('.choose-order-option')];
   const activeIndex=options.findIndex(option=>option.id===trigger.getAttribute('aria-activedescendant'));
   if(e.key==='ArrowDown'||e.key==='ArrowUp'){
     e.preventDefault();
     if(trigger.getAttribute('aria-expanded')!=='true')openChooseOrderSelect(trigger);
     else{const delta=e.key==='ArrowDown'?1:-1;setChooseOrderActiveOption(trigger,options[(Math.max(activeIndex,0)+delta+options.length)%options.length]);}
   }else if(trigger.getAttribute('aria-expanded')==='true'&&(e.key==='Home'||e.key==='End')){
     e.preventDefault();setChooseOrderActiveOption(trigger,e.key==='Home'?options[0]:options[options.length-1]);
   }else if(trigger.getAttribute('aria-expanded')==='true'&&e.key==='Enter'){
     e.preventDefault();if(options[activeIndex])chooseOrderOption(options[activeIndex]);
   }
 });
document.addEventListener('keydown',e=>{
  const card=e.target.closest('[data-order-id]');
  if(!card||!['Enter',' '].includes(e.key))return;
  e.preventDefault();renderOrderDetail(card.dataset.orderId);
});
document.addEventListener('click',e=>{
  if(!e.target.closest('.dispatch-select-wrap'))closeDispatchSelect();
  if(!e.target.closest('[data-choose-select-wrap]'))closeChooseFilter();
   if(e.target.id==='chooseOrderDialog'){closeChooseOrder();return;}
  const orderCard=e.target.closest('[data-order-id]');
  if(orderCard){renderOrderDetail(orderCard.dataset.orderId);return;}
  const b=e.target.closest('button');if(!b)return;
  if(b.hasAttribute('data-order-detail-back')){returnToOrders();return;}
  if(b.dataset.orderStatus){orderStatus=b.dataset.orderStatus;renderOrdersContent();return;}
  if(b.dataset.personalAction){
    const action=b.dataset.personalAction;
    if(action==='discover'){closeSheet();returnToHero();return;}
    if(action==='favorites'){showSheet('我的收藏',favorites.length?`<div class="person-list">${personRows(allPeople.filter(p=>favorites.includes(p.name)))}</div>`:`<div class="empty-state">${icon('heart')}还没有收藏的陪玩</div>`);return;}
    if(action==='orders'){closeSheet();openPage('orders');return;}
    if(action==='messages'){closeSheet();openPage('messages');return;}
    if(action==='login'){toast('登录入口待接入');return;}
    if(action==='wallet'){toast('钱包明细入口待接入');return;}
    if(action==='recharge'){toast('充值入口待接入');return;}
    if(action==='gift-record'){toast('礼物记录待接入');return;}
    if(action==='help'){toast('帮助中心待接入');return;}
    if(action==='settings'){toast('设置入口待接入');return;}
  }
  if(b.dataset.dispatchTrigger){
    if(b.getAttribute('aria-expanded')==='true')closeDispatchSelect();
    else{closeDispatchSelect();openDispatchSelect(b);}
    return;
  }
  if(b.dataset.dispatchOption){
    const id=b.dataset.dispatchOption,value=b.dataset.value;
    if(id==='dispatchServiceSelect'){dispatchOrder.service=value;dispatchOrder.duration='';}
    if(id==='dispatchGenderSelect')dispatchOrder.gender=value;
    if(id==='dispatchDurationSelect')dispatchOrder.duration=value;
    if(id==='dispatchPeopleCountSelect')dispatchOrder.peopleCount=value;
    if(id==='dispatchTimingSelect')dispatchOrder.timing=value;
    if(id==='dispatchScopeSelect')dispatchOrder.repeatScope=value;
    renderDispatchOrder();document.getElementById(id)?.focus({preventScroll:true});return;
  }
  if(b.dataset.chooseTrigger){
    if(b.getAttribute('aria-expanded')==='true')closeChooseFilter();
    else{closeChooseFilter();openChooseFilter(b);}
    return;
  }
  if(b.dataset.chooseOption){chooseFilterValue(b);return;}
   if(b.dataset.chooseOrderAction){if(b.dataset.chooseOrderAction==='close')closeChooseOrder();return;}
   if(b.dataset.chooseOrderTrigger){if(b.getAttribute('aria-expanded')==='true')closeChooseOrderSelect();else{closeChooseOrderSelect();openChooseOrderSelect(b);}return;}
   if(b.dataset.chooseOrderOption){chooseOrderOption(b);return;}
  if(b.dataset.shopOrderAction==='back'){reopenShopAfterClose=true;closeSheet();return;}
  if(b.dataset.shopOrderAction==='pay'){shopOrderState.stage='payment';renderShopPayment();return;}
  if(b.dataset.shopOrderAction==='detail'){shopOrderState.stage='detail';renderShopOrder();return;}
  if(b.dataset.shopOrderAction==='confirm-payment'){toast(`订单已提交：${shopOrderState.product?.title||''} · ${shopOrderState.product?.price||''}（本地演示）`);closeSheet();return;}
  if(b.dataset.shopFilter!==undefined){shopFilters.service=b.dataset.shopFilter;renderShopProducts();return;}
  if(b.dataset.shopProduct){const product=shopProducts.find(item=>item.id===b.dataset.shopProduct);if(product)openShopOrder(product);return;}
  if(b.dataset.open)openPage(b.dataset.open);
  if(b.dataset.project)chooseProject(b.dataset.project);
  if(b.dataset.personVoice){toast('这位陪玩的语音还未上传');return;}
   if(b.dataset.personOrder){const p=allPeople.find(person=>person.name===b.dataset.personOrder);if(p)openChooseOrder(p);return;}
  if(b.dataset.personOpen){const p=allPeople.find(person=>person.name===b.dataset.personOpen);if(p)openCompanionProfile(p);return;}
  if(b.dataset.person){const p=allPeople.find(p=>p.name===b.dataset.person);if(p)openCompanionProfile(p);return;}
  if(b.dataset.mode){if(b.dataset.mode==='dispatch')openDispatchOrder(selectedGame);else openPeople(false,selectedGame);}
   if(b.dataset.orderAction==='back'){if(b.closest('#tabPage'))closeTabPage();else closeSheet();return;}
  if(b.dataset.orderAction==='submit'){
    const price=dispatchPrice();
    if(!dispatchOrder.service||!dispatchOrder.gender||!dispatchOrder.duration||!dispatchOrder.peopleCount||!dispatchOrder.timing||!dispatchOrder.repeatScope)return;
    if(price===null){toast('该服务与时长的价格尚未配置');return;}
    if(dispatchOrder.timing==='schedule'&&(!dispatchOrder.appointment||dispatchOrder.appointment<localDateTimeMinute())){toast('请选择不早于当前时间的预约时间');return;}
    toast(`${dispatchOrder.service} · ${durationName(dispatchOrder.duration)} · 本地演示`);closeSheet();
  }
  if(b.dataset.service){selectedGame=b.dataset.service;openServices(orderMode,selectedPerson,selectedGame);}
  if(b.id==='confirmService'){closeSheet();toast(`${selectedGame} · 指定${selectedPerson?.name||''}`);}
});
 document.addEventListener('input',e=>{if(e.target.id==='personSearch'){chooseFilters.query=e.target.value;renderChooseList();return;}if(e.target.id==='shopSearch'){shopFilters.query=e.target.value;renderShopProducts();return;}if(e.target.id==='chooseOrderNote'){chooseOrderState.note=e.target.value;return;}if(e.target.id==='chooseOrderAppointment'){chooseOrderState.appointment=e.target.value;syncChooseOrderSummary();}});
 document.addEventListener('change',e=>{if(e.target.name==='chooseOrderMode'){chooseOrderState.timing=e.target.value;const wrap=$('#chooseOrderScheduleWrap');const scheduled=e.target.value==='schedule';if(wrap)wrap.hidden=!scheduled;const appointment=$('#chooseOrderAppointment');if(appointment){appointment.required=scheduled;if(scheduled)appointment.min=localDateTimeMinute();}syncChooseOrderSummary();}});
 document.addEventListener('submit',e=>{if(e.target.id!=='chooseOrderForm')return;e.preventDefault();if(!chooseOrderState.person)return;const scheduled=chooseOrderState.timing==='schedule';if(scheduled&&(!chooseOrderState.appointment||chooseOrderState.appointment<localDateTimeMinute())){toast('请选择不早于当前时间的预约时间');return;}const sku=chooseOrderSelectedSku();toast(`已选中${chooseOrderState.person.name} · ${chooseOrderState.service} · ${sku?.label||'一局'}`);closeChooseOrder();});
function returnToHero(){if(tabPage&&!tabPage.hidden){closeTabPage();return;}scrollLimit=0;introSnapPending=true;window.scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'});}
$('#homeNav').addEventListener('click',returnToHero);
document.querySelector('.brand').addEventListener('click',e=>{e.preventDefault();returnToHero();});
