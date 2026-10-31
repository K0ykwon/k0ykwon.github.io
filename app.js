import {getResearchPost,renderResearchArticle} from './content/research/articles.js?v=20261031-research-posts';
import {activateResearch} from './content/research/interactions.js?v=20261031-research-posts';
import {getSection,hasSection} from './content/index.js?v=20261031-research-posts';
import {localizePost} from './blog/localization.js?v=20261031-content-folders';
import {getLanguage,setLanguage,t,english,translateDOM,observeLanguage} from './i18n.js?v=20261031-content-folders';
import {getBlogPost,renderBlogIndex,renderBlogArticle,activateBlog} from './blog/ui.js?v=20261031-content-folders';
import {lightingAt,solarMinute} from './lighting.js?v=20261029-scenes-16';
import {seoulParts,seasonFor,outsideFor,parseWeather,cachedScene} from './weather.js?v=20261029-scene-start';
const root=document.documentElement;
const pageView=document.getElementById('page-view');
const content=document.getElementById('page-content');
const reducedMotion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;

let sectionObserver;let entranceFrame;let blogCleanup;let researchCleanup;
function prepareSectionEntrance(titleText,key,{typing=true}={}){
 if(reducedMotion())return;
 const title=document.getElementById('page-title');
 title.setAttribute('aria-label',titleText);
 const line=typing?document.createElement('span'):null;
 if(typing){line.setAttribute('aria-hidden','true');
 [...titleText].forEach((char,index)=>{const span=document.createElement('span');span.className='stream-char';span.textContent=char;span.style.setProperty('--stream-delay',`${index*32}ms`);line.append(span);});
 title.replaceChildren(line);}
 const items=[document.getElementById('page-kicker'),document.getElementById('page-index'),...(!typing?[title]:[]),document.getElementById('page-intro'),...content.querySelectorAll('.profile-photo,.profile-mark>div,.panel-entry,.research-section-heading,.publication,.ongoing-entry,.experience-section-heading,.timeline-item,.award-entry,.cv-entry,.blog-tools,.blog-list>li,.post-meta,.paper-details,.article-toc,.article-section,.article-demo,.article-code,.article-footer,.article-comments')].filter(Boolean);
 const streamDuration=typing?titleText.length*32:0;
 items.forEach((el,index)=>{el.classList.add('section-rise');el.style.setProperty('--entrance-delay',`${streamDuration+Math.min(index*90,1100)}ms`);});
 pageView.classList.add('section-enter');
 const play=()=>{
  if(!title.isConnected||pageView.dataset.section!==key)return;
  pageView.classList.add('section-playing');sectionObserver?.disconnect();
  if(!typing)return;
  const chars=[...line.children];const start=performance.now();let head;line.classList.add('is-streaming');
  const follow=now=>{
   if(!line.isConnected||pageView.dataset.section!==key)return;
   const elapsed=Math.max(0,now-start);
   if(elapsed>=streamDuration){head?.classList.remove('is-stream-head');line.classList.remove('is-streaming');return;}
   const index=Math.min(chars.length-1,Math.floor(elapsed/32));
   if(head!==chars[index]){head?.classList.remove('is-stream-head');head=chars[index];head.classList.add('is-stream-head');}
   entranceFrame=requestAnimationFrame(follow);
  };
  follow(start);
 };
 if(!('IntersectionObserver' in window)){play();return;}
 sectionObserver=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting))play();},{threshold:typing ? .35 : 0});
 sectionObserver.observe(typing?title:pageView);
}
function scrollToSection(){
 document.getElementById('page-title').focus({preventScroll:true});
 requestAnimationFrame(()=>pageView.scrollIntoView({behavior:reducedMotion()?'instant':'smooth',block:'start'}));
}
function renderSection(key,{scroll=true,postSlug='',force=false,animate=true,commentsRoot=null}={}) {
  const base=getSection(key,getLanguage());if(!base)return;
  const post=key==='blog'?localizePost(getBlogPost(postSlug),getLanguage()):undefined;
  const researchPost=key==='research'?getResearchPost(postSlug,getLanguage()):undefined;
  const activePost=post?.slug||researchPost?.slug||'';
  const page=post?{...base,object:post.kind==='review'?`PAPER REVIEW / ${post.paper.year}`:`${english(post.category)} / ${english(post.subcategory)} / BOJ ${post.id}`,title:post.title,intro:post.summary,body:renderBlogArticle(post)}:researchPost?{...base,object:`RESEARCH / ${researchPost.topic}`,title:researchPost.title,intro:researchPost.summary,body:renderResearchArticle(researchPost)}:key==='blog'?{...base,body:renderBlogIndex()}:base;
  if(!force&&pageView.dataset.section===key&&pageView.dataset.post===activePost&&!pageView.hidden){if(scroll)scrollToSection();return;}
  blogCleanup?.();blogCleanup=undefined;researchCleanup?.();researchCleanup=undefined;
  sectionObserver?.disconnect();cancelAnimationFrame(entranceFrame);pageView.classList.remove('section-enter','section-playing');
  document.getElementById('page-title').removeAttribute('aria-label');
  for(const id of ['page-kicker','page-index','page-title','page-intro']){const el=document.getElementById(id);el.classList.remove('section-rise');el.style.removeProperty('--entrance-delay');}
  // Commit the cleared animation styles before reusing the heading elements.
  if(!pageView.hidden)void pageView.offsetWidth;
  pageView.dataset.section=key;pageView.dataset.post=activePost;
  document.title=(post||researchPost)?`${page.title} — Youngkwon Ko`:key==='blog'?'Blog — Youngkwon Ko':'Youngkwon Ko — A desk of ideas';
  document.getElementById('page-kicker').textContent=page.object;
  document.getElementById('page-index').textContent=`${page.index} / From the desk`;
  document.getElementById('page-title').textContent=english(page.title);
  document.getElementById('page-intro').textContent=page.intro;
  content.innerHTML=page.body;
  if(commentsRoot)content.querySelector('.article-comments')?.replaceWith(commentsRoot);
  if(key==='research'&&!researchPost){
    const publications=content.querySelector('.publications-section');
    const firstAuthor=paper=>paper.querySelector('.publication-authors')?.textContent.split(',')[0].trim()==='Youngkwon Ko';
    const papers=[...publications.querySelectorAll('.publication')].sort((a,b)=>Number(firstAuthor(b))-Number(firstAuthor(a)));
    papers.forEach((paper,index)=>{paper.querySelector('.publication-index>span').textContent=String(index+1).padStart(2,'0');publications.append(paper);});
  }
  pageView.hidden=false;
  if(key==='blog')blogCleanup=activateBlog(content,post);
  if(key==='research')researchCleanup=activateResearch(content);
  translateDOM(pageView);
  if(animate)prepareSectionEntrance(english(page.title),key,{typing:key==='about'});
  document.querySelectorAll('a[data-section]').forEach(el=>{if(el.dataset.section===key&&(!el.hasAttribute('data-post')||el.dataset.post===activePost))el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');});
  if(scroll)scrollToSection();
}
function home({scroll=true}={}) {
  renderSection('about',{scroll:false});
  if(scroll){document.querySelector('.brand').focus({preventScroll:true});window.scrollTo({top:0,behavior:reducedMotion()?'instant':'smooth'});}
}
function syncHash({initial=false}={}){let [key,postSlug='']=location.hash.slice(1).split('/');if(key==='experience'){key='about';history.replaceState(null,'',`${location.pathname}${location.search}#about`);}if(hasSection(key))renderSection(key,{postSlug});else home({scroll:!initial&&!location.hash});}
function navigate(key,postSlug=''){if(!hasSection(key))return;const activePost=key==='blog'?getBlogPost(postSlug)?.slug||'':key==='research'?getResearchPost(postSlug)?.slug||'':'';if(pageView.dataset.section!==key||pageView.dataset.post!==activePost||pageView.hidden)history.pushState(null,'',`${location.pathname}${location.search}#${key}${activePost?'/'+activePost:''}`);renderSection(key,{postSlug:activePost});}
document.addEventListener('click',e=>{
  if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  const a=e.target.closest('a[data-section]');if(a){e.preventDefault();navigate(a.dataset.section,a.dataset.post||'');return;}
  if(e.target.closest('[data-home],.brand')){e.preventDefault();history.pushState(null,'',location.pathname+location.search);home();}
});
window.addEventListener('popstate',syncHash);window.addEventListener('hashchange',syncHash);
function setTheme(theme){root.dataset.theme=theme;const dark=theme==='dark';for(const id of ['theme-toggle','lamp-toggle']){const el=document.getElementById(id);el.setAttribute('aria-pressed',String(dark));el.setAttribute('aria-label',`${id==='lamp-toggle'?'Desk lamp: ':''}switch to ${dark?'light':'dark'} mode`);}document.querySelector('.theme-icon').textContent=dark?'☾':'☼';document.querySelector('.theme-label').textContent=dark?'Dark':'Light';document.querySelector('meta[name="theme-color"]').content=dark?'#1c201f':'#f8f7f3';try{localStorage.setItem('desk-theme',theme);}catch{}}
let savedTheme;try{savedTheme=localStorage.getItem('desk-theme');}catch{}setTheme(savedTheme==='dark'?'dark':'light');requestAnimationFrame(()=>requestAnimationFrame(()=>root.classList.add('theme-ready')));for(const id of ['theme-toggle','lamp-toggle'])document.getElementById(id).addEventListener('click',()=>setTheme(root.dataset.theme==='dark'?'light':'dark'));
document.addEventListener('click',async e=>{if(e.target.id!=='copy-email')return;const el=e.target;try{await navigator.clipboard.writeText('yko081524@yonsei.ac.kr');el.textContent='Copied ✓';document.getElementById('copy-status').textContent='Email address copied';}catch{el.textContent='Select the email address above to copy';}});
let weatherIsDay;let weatherFetchedAt=0;let solarTimes={};let weatherPending=false;let weatherAttemptedAt=0;let weatherDate='';
const weatherInterval=5*60*1000;
try{const cached=cachedScene(localStorage.getItem('desk-weather'),new Date());if(cached){root.dataset.weather=cached.kind;solarTimes=cached.solarTimes;}}catch{}

const clockFormats=Object.fromEntries(['ko','en'].map(language=>[language,new Intl.DateTimeFormat(language==='ko'?'ko-KR':'en-US',{timeZone:'Asia/Seoul',weekday:'short',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:true})]));
const seoulDate=now=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
// Decode only the active time/weather combination before crossfading; keep the last image on load failure.
const sceneLayers=[...document.querySelectorAll('.scene-image')];
let sceneRevision=0;let sceneSignature='';
async function updateScenery(weights){
 const signature=JSON.stringify(weights);if(signature===sceneSignature)return;
 sceneSignature=signature;const revision=++sceneRevision;
 const active=sceneLayers.filter(img=>weights[img.dataset.scene]>0);
 try{
  await Promise.all(active.map(async img=>{
   if(!img.getAttribute('src'))img.src=img.dataset.src;
   await img.decode();
  }));
  if(revision!==sceneRevision)return;
  sceneLayers.forEach(img=>img.style.opacity=String(weights[img.dataset.scene]||0));
  const landscape=document.querySelector('.window-landscape');
  if(!landscape.hasAttribute('data-ready'))requestAnimationFrame(()=>requestAnimationFrame(()=>landscape.setAttribute('data-ready','')));
  landscape.dataset.scene=active.reduce((a,b)=>weights[a.dataset.scene]>=weights[b.dataset.scene]?a:b).dataset.scene;
 }catch{if(revision===sceneRevision)sceneSignature='';}
}
function updateLighting(now){const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Seoul',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(now);const t=Object.fromEntries(parts.filter(p=>p.type!=='literal').map(p=>[p.type,Number(p.value)]));const l=lightingAt(t.hour*60+t.minute+t.second/60,{...solarTimes,weather:root.dataset.weather});for(const [key,value] of Object.entries({'--spill-color':l.color,'--spill-opacity':l.opacity,'--sky-brightness':l.brightness,'--sky-saturation':l.saturation,'--sky-warmth':l.warmth,'--room-darkness':l.roomDarkness,'--lamp-power':l.lamp,'--lamp-shade':l.lampShade,'--lamp-radius':`${l.lampRadius}%`,'--lamp-radius-y':`${l.lampRadiusY}%`,'--lamp-tint':l.lampTint,'--weather-ink':l.weatherInk}))root.style.setProperty(key,String(value));updateScenery(l.scenes);}
function updateClock(now=new Date()){
 const clock=document.getElementById('seoul-clock');const label=`${clockFormats.en.format(now)} KST`;
 if(clock.textContent!==label)clock.textContent=label;
 document.getElementById('year').textContent=seoulParts(now).year;
}
function updateScene(now=new Date()){
 const p=seoulParts(now);root.dataset.season=seasonFor(p.month);
 const fresh=Date.now()-weatherFetchedAt<20*60*1000;
 root.dataset.outside=outsideFor(p.hour,fresh?weatherIsDay:undefined);
 updateLighting(now);
}
async function updateWeather(){if(weatherPending)return;weatherPending=true;weatherAttemptedAt=Date.now();const requestedDate=seoulDate(new Date());const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),8000);try{const response=await fetch('https://api.open-meteo.com/v1/forecast?latitude=37.5665&longitude=126.9780&current=temperature_2m,weather_code,is_day&daily=sunrise,sunset&forecast_days=1&timezone=Asia%2FSeoul',{signal:controller.signal,cache:'no-store'});if(!response.ok)throw new Error('Weather unavailable');const data=await response.json();const w=parseWeather(data);solarTimes={sunrise:solarMinute(data.daily?.sunrise?.[0]),sunset:solarMinute(data.daily?.sunset?.[0])};solarTimes=Object.fromEntries(Object.entries(solarTimes).filter(([,v])=>Number.isFinite(v)));root.dataset.weather=w.kind;weatherIsDay=w.isDay;weatherFetchedAt=Date.now();weatherDate=requestedDate;try{localStorage.setItem('desk-weather',JSON.stringify({kind:w.kind,fetchedAt:weatherFetchedAt,date:weatherDate,solarTimes}));}catch{}document.getElementById('temperature').textContent=`${w.temperature}°C`;document.getElementById('weather-icon').textContent=w.isDay?w.icon:(w.kind==='clear'?'☾':w.icon);document.getElementById('weather-detail').textContent=`${w.label} · Live weather`;document.querySelector('.live-dot').classList.remove('offline');updateScene();}catch{weatherIsDay=undefined;weatherFetchedAt=0;document.getElementById('temperature').textContent='—°';document.getElementById('weather-detail').textContent='Weather unavailable · Seoul local time';document.getElementById('weather-icon').textContent='◌';document.querySelector('.live-dot').classList.add('offline');updateScene();}finally{clearTimeout(timeout);weatherPending=false;}}
// Wall-clock based ticks recover immediately after browser timer throttling.
let clockTimer;let sceneUpdatedAt=0;
function refreshLive({forceWeather=false}={}){
 const now=new Date();const stamp=now.getTime();
 updateClock(now);
 if(!sceneUpdatedAt||stamp-sceneUpdatedAt>=30000){updateScene(now);sceneUpdatedAt=stamp;}
 const due=!weatherFetchedAt||stamp-weatherFetchedAt>=weatherInterval||weatherDate!==seoulDate(now);
 if(!weatherPending&&(forceWeather||(due&&stamp-weatherAttemptedAt>=60000)))updateWeather();
}
function clockTick(){clearTimeout(clockTimer);if(!document.hidden)refreshLive();clockTimer=setTimeout(clockTick,1000-Date.now()%1000);}
function resumeLive({forceWeather=false}={}){if(document.hidden)return;sceneUpdatedAt=0;refreshLive({forceWeather});clockTick();}
setLanguage(getLanguage());
document.querySelector('.language-switch').addEventListener('click',event=>{
 const button=event.target.closest('[data-language]');if(!button||button.dataset.language===getLanguage())return;
 const anchor=[...content.querySelectorAll('.article-section,.article-demo,.article-code,.hbr-demo,.research-demo')].find(el=>{const rect=el.getBoundingClientRect();return rect.bottom>80&&rect.top<window.innerHeight;});
 const anchorId=anchor?.id,anchorTop=anchor?.getBoundingClientRect().top;
 const commentsRoot=content.querySelector('.article-comments:has(iframe)');
 const demoControls=[...content.querySelectorAll('[data-demo] input,[data-demo] select,[data-research-demo] input,[data-research-demo] select')].map(el=>({value:el.value,checked:el.checked}));
 setLanguage(button.dataset.language);
 const key=pageView.dataset.section||'about',postSlug=pageView.dataset.post||'';
 renderSection(key,{scroll:false,postSlug,force:true,animate:false,commentsRoot});
 const restoredControls=[...content.querySelectorAll('[data-demo] input,[data-demo] select,[data-research-demo] input,[data-research-demo] select')];
 demoControls.forEach((state,index)=>{const el=restoredControls[index];if(!el)return;el.value=state.value;if(el.type==='checkbox')el.checked=state.checked;el.dispatchEvent(new Event('input',{bubbles:true}));if(el.tagName==='SELECT')el.dispatchEvent(new Event('change',{bubbles:true}));if(el.matches('[data-blocks]'))el.form.requestSubmit();});
 if(anchorId){const translated=document.getElementById(anchorId);if(translated)window.scrollBy({top:translated.getBoundingClientRect().top-anchorTop,behavior:'instant'});}
 updateClock();
});
observeLanguage();
updateClock();updateScene();updateWeather();syncHash({initial:true});clockTick();
document.addEventListener('visibilitychange',()=>{if(document.hidden){clearTimeout(clockTimer);}else resumeLive();});
window.addEventListener('pageshow',()=>resumeLive());
window.addEventListener('focus',()=>resumeLive());
window.addEventListener('online',()=>resumeLive({forceWeather:true}));
