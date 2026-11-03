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
  dialog.showModal();document.body.classList.add('no-scroll');
  // Playback starts only after an explicit preview click. Reduced-motion users get the still preview first.
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches)await video.play().catch(()=>{});
 }catch{if(!dialog.open){document.querySelector('#preview-title').textContent='Vorschau nicht verfügbar';video.removeAttribute('src');video.removeAttribute('poster');document.querySelector('#preview-detail').href=`/overlays/${button.dataset.preview}/`;document.querySelector('#preview-shop').href='https://chatstyle.gg/templates/creator/jesusteng';dialog.showModal();document.body.classList.add('no-scroll')}showMediaError('Die Vorschau konnte nicht geladen werden. Versuche es erneut oder öffne das Template auf Chatstyle.');}
 finally{button.disabled=false;}
});
dialog.querySelector('[data-close]').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()}});
dialog.addEventListener('close',()=>{requestVersion++;video.pause();video.removeAttribute('src');video.load();document.body.classList.remove('no-scroll');previousFocus?.focus()});
video.addEventListener('error',()=>{if(dialog.open&&video.getAttribute('src'))showMediaError('Das Video kann hier nicht abgespielt werden. Das Vorschaubild und der Link zu Chatstyle stehen weiterhin zur Verfügung.')});
document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause()});
const grid=document.querySelector('#template-grid');
if(grid){
 const cards=[...grid.querySelectorAll('[data-template]')];
 const search=document.querySelector('#template-search');
 const sort=document.querySelector('#template-sort');
 const filters=[...document.querySelectorAll('[data-filter]')];
 const more=document.querySelector('#load-more');
 const count=document.querySelector('#result-count');
 let active='all',limit=12;
 const normalize=value=>value.toLocaleLowerCase('de').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replaceAll('ß','ss');
 function render(){
  const words=normalize(search.value.trim()).split(/\s+/).filter(Boolean);
  const ordered=[...cards].sort((a,b)=>sort.value==='az'?a.dataset.name.localeCompare(b.dataset.name,'de'):sort.value==='za'?b.dataset.name.localeCompare(a.dataset.name,'de'):Number(a.dataset.order)-Number(b.dataset.order));
  let matches=0,visible=0;
  for(const card of ordered){const match=(active==='all'||card.dataset.category===active)&&words.every(w=>normalize(card.dataset.search).includes(w));card.hidden=!match||matches>=limit;if(match)matches++;if(!card.hidden)visible++;grid.append(card);}
  count.textContent=matches===0?'Keine Templates gefunden':`${visible} von ${matches} Templates`;
  more.hidden=visible>=matches;
  document.querySelector('#empty-state').hidden=matches>0;
  filters.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===active)));
 }
 function updateUrl(){const url=new URL(location.href);url.searchParams.delete('style');url.searchParams.delete('q');if(active!=='all')url.searchParams.set('style',active);if(search.value.trim())url.searchParams.set('q',search.value.trim());history.replaceState(null,'',url);}
 function readUrl(){const p=new URLSearchParams(location.search);active=filters.some(b=>b.dataset.filter===p.get('style'))?p.get('style'):'all';search.value=p.get('q')??'';limit=12;render();}
 filters.forEach(b=>b.addEventListener('click',()=>{active=b.dataset.filter;limit=12;render();updateUrl()}));
 search.addEventListener('input',()=>{limit=12;render();updateUrl()});
 sort.addEventListener('change',render);
 more.addEventListener('click',()=>{const previousVisible=cards.filter(c=>!c.hidden);limit+=12;render();const firstNew=[...grid.children].find(c=>!c.hidden&&!previousVisible.includes(c));firstNew?.querySelector('a')?.focus({preventScroll:true})});
 document.querySelector('#reset-filters').addEventListener('click',()=>{active='all';search.value='';limit=12;render();updateUrl();search.focus()});
 document.addEventListener('keydown',e=>{if(e.key==='/'&&!dialog.open&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)&&!document.activeElement.isContentEditable){e.preventDefault();search.focus()}});
 addEventListener('popstate',readUrl);readUrl();
}
