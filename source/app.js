let catalogPromise;
const getCatalog=()=>catalogPromise??=fetch('/assets/catalog.json').then(r=>{if(!r.ok)throw Error('Katalog nicht erreichbar');return r.json()}).catch(error=>{catalogPromise=null;throw error});
const dialog=document.querySelector('#preview-dialog');
const video=document.querySelector('#preview-video');
let previousFocus;
let requestVersion=0;
function showMediaError(message){let p=dialog.querySelector('.media-error');if(!p){p=document.createElement('p');p.className='media-error';p.setAttribute('role','status');video.after(p)}p.textContent=message}
document.addEventListener('click',async event=>{
 const button=event.target.closest('[data-preview]');if(!button)return;
 previousFocus=button;const version=++requestVersion;button.disabled=true;
 try{
  const items=await getCatalog();if(version!==requestVersion)return;
  const item=items.find(t=>t.slug===button.dataset.preview);if(!item)throw Error('Template nicht gefunden');
  dialog.querySelector('.media-error')?.remove();
  document.querySelector('#preview-title').textContent=item.name;
  const detail=document.querySelector('#preview-detail');detail.href=`/overlays/${item.slug}/`;
  document.querySelector('#preview-shop').href=item.shopUrl;
  video.poster=item.image;video.src=item.video;video.setAttribute('aria-label',`Originalvideo: ${item.name}`);
  dialog.showModal();document.body.classList.add('no-scroll');syncInlineVideos();
  // Playback starts only after an explicit preview click. Reduced-motion users get the still preview first.
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches)await video.play().catch(()=>{});
 }catch{if(!dialog.open){document.querySelector('#preview-title').textContent='Vorschau nicht verfügbar';video.removeAttribute('src');video.removeAttribute('poster');document.querySelector('#preview-detail').href=`/overlays/${button.dataset.preview}/`;document.querySelector('#preview-shop').href='https://chatstyle.gg/templates/creator/jesusteng';dialog.showModal();document.body.classList.add('no-scroll');syncInlineVideos()}showMediaError('Die Vorschau konnte nicht geladen werden. Versuche es erneut oder öffne das Template auf Chatstyle.');}
 finally{button.disabled=false;}
});
dialog.querySelector('[data-close]').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()}});
dialog.addEventListener('close',()=>{requestVersion++;video.pause();video.removeAttribute('src');video.load();document.body.classList.remove('no-scroll');previousFocus?.focus();syncInlineVideos()});
video.addEventListener('error',()=>{if(dialog.open&&video.getAttribute('src'))showMediaError('Das Video kann hier nicht abgespielt werden. Das Vorschaubild und der Link zu Chatstyle stehen weiterhin zur Verfügung.')});
document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();syncInlineVideos()});

// Hero loops load on visibility. Card loops load only on hover or keyboard focus.
// The still image remains visible until playback actually starts, including on failure.
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
let heroPaused=reducedMotion.matches;
const heroToggle=document.querySelector('#hero-motion');
const inlineRecords=[...document.querySelectorAll('[data-inline-video]')].map(media=>({
 media,kind:media.dataset.inlineVideo,
 container:media.closest(media.dataset.inlineVideo==='hero'?'[data-autoplay-preview]':'[data-hover-preview]'),
 inView:false,hovered:false,focused:false,requested:false,failed:false
}));
function wantsInlinePlayback(record){
 return record.inView&&!document.hidden&&!dialog.open&&!record.container.closest('[hidden]')&&!record.failed&&
  (record.kind==='hero'?!heroPaused:!reducedMotion.matches&&(record.hovered||record.focused));
}
function syncInlineVideos(){
 for(const record of inlineRecords){
  const {media,container}=record;
  if(!wantsInlinePlayback(record)){
   record.requested=false;media.pause();container.classList.remove('is-playing');continue;
  }
  if(record.requested)continue;
  record.requested=true;media.muted=true;
  if(!media.getAttribute('src'))media.src=media.dataset.src;
  media.play().then(()=>{
   if(wantsInlinePlayback(record)){container.classList.add('is-playing')}
   else{media.pause();container.classList.remove('is-playing')}
  }).catch(()=>{record.requested=false;if(media.paused)container.classList.remove('is-playing')});
 }
}
function updateHeroToggle(){
 if(!heroToggle)return;
 heroToggle.setAttribute('aria-pressed',String(heroPaused));
 heroToggle.innerHTML=`<span aria-hidden="true">${heroPaused?'▶':'Ⅱ'}</span> Videos ${heroPaused?'abspielen':'pausieren'}`;
}
heroToggle?.addEventListener('click',()=>{heroPaused=!heroPaused;updateHeroToggle();syncInlineVideos()});
reducedMotion.addEventListener('change',()=>{heroPaused=reducedMotion.matches;updateHeroToggle();syncInlineVideos()});
updateHeroToggle();
const inlineObserver=new IntersectionObserver(entries=>{
 for(const entry of entries){const record=inlineRecords.find(r=>r.container===entry.target);if(record)record.inView=entry.isIntersecting;}
 syncInlineVideos();
},{threshold:.12});
for(const record of inlineRecords){
 const {container,media}=record;
 media.addEventListener('error',()=>{record.failed=true;record.requested=false;container.classList.remove('is-playing')});
 media.addEventListener('pause',()=>container.classList.remove('is-playing'));
 inlineObserver.observe(container);
 if(record.kind!=='hover')continue;
 container.addEventListener('pointerenter',event=>{if(event.pointerType==='touch')return;record.hovered=true;syncInlineVideos()});
 container.addEventListener('pointerleave',()=>{record.hovered=false;syncInlineVideos()});
 container.addEventListener('focusin',()=>{record.focused=true;syncInlineVideos()});
 container.addEventListener('focusout',event=>{if(!container.contains(event.relatedTarget)){record.focused=false;syncInlineVideos()}});
}
const grid=document.querySelector('#template-grid');
if(grid){
 const cards=[...grid.querySelectorAll('[data-template]')];
 const search=document.querySelector('#template-search');
 const filter=document.querySelector('#template-filter');
 const more=document.querySelector('#load-more');
 const count=document.querySelector('#result-count');
 let active='all',limit=9;
 const normalize=value=>value.toLocaleLowerCase('de').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replaceAll('ß','ss');
 function render(){
  const words=normalize(search.value.trim()).split(/\s+/).filter(Boolean);
  const ordered=cards;
  let matches=0,visible=0;
  for(const card of ordered){const match=(active==='all'||card.dataset.category===active)&&words.every(w=>normalize(card.dataset.search).includes(w));card.hidden=!match||matches>=limit;if(match)matches++;if(!card.hidden)visible++;grid.append(card);}
  count.textContent=matches===0?'Keine Templates gefunden':`${visible} von ${matches} Templates`;
  more.hidden=visible>=matches;
  document.querySelector('#empty-state').hidden=matches>0;
  filter.value=active;
  syncInlineVideos();
 }
 function updateUrl(){const url=new URL(location.href);url.searchParams.delete('style');url.searchParams.delete('q');if(active!=='all')url.searchParams.set('style',active);if(search.value.trim())url.searchParams.set('q',search.value.trim());history.replaceState(null,'',url);}
 function readUrl(){const p=new URLSearchParams(location.search);active=[...filter.options].some(o=>o.value===p.get('style'))?p.get('style'):'all';search.value=p.get('q')??'';limit=9;render();}
 filter.addEventListener('change',()=>{active=filter.value;limit=9;render();updateUrl()});
 search.addEventListener('input',()=>{limit=9;render();updateUrl()});
 more.addEventListener('click',()=>{const previousVisible=cards.filter(c=>!c.hidden);limit+=9;render();const firstNew=[...grid.children].find(c=>!c.hidden&&!previousVisible.includes(c));firstNew?.querySelector('[data-preview]')?.focus({preventScroll:true})});
 document.querySelector('#reset-filters').addEventListener('click',()=>{active='all';search.value='';limit=9;render();updateUrl();search.focus()});
 document.addEventListener('keydown',e=>{if(e.key==='/'&&!dialog.open&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)&&!document.activeElement.isContentEditable){e.preventDefault();search.focus()}});
 addEventListener('popstate',readUrl);readUrl();
}

// Reveal content once as it enters the viewport; without JS all content stays visible.
const revealObserver=new IntersectionObserver(entries=>{
 for(const entry of entries){
  if(!entry.isIntersecting)continue;
  revealObserver.unobserve(entry.target);
  if(reducedMotion.matches)continue;
  entry.target.animate([{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'translateY(0)'}],{
   duration:650,delay:Number(entry.target.dataset.revealDelay||0),easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'
  });
 }
},{threshold:.08});
document.querySelectorAll('[data-reveal],.template-card,.guide h2').forEach((element,index)=>{
 if(element.matches('.template-card'))element.dataset.revealDelay=String(index%3*55);
 revealObserver.observe(element);
});
reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches)document.getAnimations().forEach(animation=>animation.cancel())});
