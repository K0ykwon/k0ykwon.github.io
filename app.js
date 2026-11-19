import {getResearchPost,renderResearchArticle} from './content/research/articles.js?v=20261113-dbpia';
import {activateResearch} from './content/research/interactions.js?v=20261031-research-posts';
import {getSection,hasSection} from './content/index.js?v=20261113-dbpia';
import {localizePost} from './blog/localization.js?v=20261119-geo';
import {getLanguage,setLanguage,t,english,translateDOM,observeLanguage} from './i18n.js?v=20261031-content-folders';
import {getBlogPost,renderBlogIndex,renderBlogArticle,activateBlog} from './blog/ui.js?v=20261119-geo';
import {seoulParts} from './weather.js?v=20261029-scene-start';
const root=document.documentElement;
const pageView=document.getElementById('page-view');
const content=document.getElementById('page-content');
const siteHeader=document.querySelector('.site-header');
const sectionLabels={about:'About',research:'Research',software:'Software',blog:'Blog',contact:'Contact'};
const homeView=document.getElementById('portfolio-home');
const pageTitle=document.getElementById('page-title');
const measureHeader=()=>root.style.setProperty('--header-height',`${Math.ceil(siteHeader.getBoundingClientRect().height)}px`);
measureHeader();
if('ResizeObserver' in window)new ResizeObserver(measureHeader).observe(siteHeader);

let blogCleanup;let researchCleanup;
function scrollToSection(){
 pageTitle.focus({preventScroll:true});
 pageView.scrollIntoView({behavior:'instant',block:'start'});
}
function renderSection(key,{scroll=true,postSlug='',force=false,commentsRoot=null}={}) {
  const base=getSection(key,getLanguage());if(!base)return;
  const post=key==='blog'?localizePost(getBlogPost(postSlug),getLanguage()):undefined;
  const researchPost=key==='research'?getResearchPost(postSlug,getLanguage()):undefined;
  const activePost=post?.slug||researchPost?.slug||'';
  const page=post?{...base,object:post.kind==='review'?`PAPER REVIEW / ${post.paper.year}`:`${english(post.category)} / ${english(post.subcategory)}${post.code?` / BOJ ${post.id}`:''}`,title:post.title,intro:post.summary,body:renderBlogArticle(post)}:researchPost?{...base,object:`RESEARCH / ${researchPost.topic}`,title:researchPost.title,intro:researchPost.summary,body:renderResearchArticle(researchPost)}:key==='blog'?{...base,body:renderBlogIndex()}:base;
  if(!force&&pageView.dataset.section===key&&pageView.dataset.post===activePost&&!pageView.hidden){if(scroll)scrollToSection();return;}
  blogCleanup?.();blogCleanup=undefined;researchCleanup?.();researchCleanup=undefined;
  pageView.dataset.section=key;pageView.dataset.post=activePost;
  document.title=(post||researchPost)?`${page.title} — Youngkwon Ko`:`${sectionLabels[key]} — Youngkwon Ko`;
  document.getElementById('page-kicker').textContent=page.object;
  document.getElementById('page-index').textContent=page.index;
  const parent=document.getElementById('document-parent');
  parent.href=`#${key}`;parent.dataset.section=key;
  parent.textContent=(post||researchPost)?`← ${sectionLabels[key]}`:sectionLabels[key];
  parent.hidden=!(post||researchPost);
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
  homeView.hidden=true;
  pageView.hidden=false;
  if(key==='blog')blogCleanup=activateBlog(content,post);
  if(key==='research')researchCleanup=activateResearch(content);
  translateDOM(pageView);
  siteHeader.querySelectorAll('a[data-section]').forEach(el=>{if(el.dataset.section===key&&(!el.hasAttribute('data-post')||el.dataset.post===activePost))el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');});
  if(scroll)scrollToSection();
}
function home({scroll=true}={}) {
  blogCleanup?.();blogCleanup=undefined;researchCleanup?.();researchCleanup=undefined;
  pageView.hidden=true;homeView.hidden=false;
  document.title='Youngkwon Ko';
  siteHeader.querySelectorAll('[aria-current]').forEach(el=>el.removeAttribute('aria-current'));
  if(scroll){document.getElementById('home-title').focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});}
}
function syncHash({initial=false}={}){let [key,postSlug='']=location.hash.slice(1).split('/');if(key==='experience'||(key==='about'&&postSlug==='cv')){key='about';postSlug='';history.replaceState(null,'',`${location.pathname}${location.search}#about`);}if(hasSection(key))renderSection(key,{postSlug});else home({scroll:!initial&&!location.hash});}
function navigate(key,postSlug=''){if(!hasSection(key))return;const activePost=key==='blog'?getBlogPost(postSlug)?.slug||'':key==='research'?getResearchPost(postSlug)?.slug||'':'';if(pageView.dataset.section!==key||pageView.dataset.post!==activePost||pageView.hidden)history.pushState(null,'',`${location.pathname}${location.search}#${key}${activePost?'/'+activePost:''}`);renderSection(key,{postSlug:activePost});}
document.addEventListener('click',e=>{
  if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  if(e.target.closest('.skip-link')){
    e.preventDefault();
    const target=homeView.hidden?pageTitle:document.getElementById('home-title');
    target.focus({preventScroll:true});
    target.scrollIntoView({behavior:'instant',block:'start'});
    return;
  }
  const a=e.target.closest('a[data-section]');if(a){e.preventDefault();navigate(a.dataset.section,a.dataset.post||'');return;}
  if(e.target.closest('[data-home],.brand')){e.preventDefault();history.pushState(null,'',location.pathname+location.search);home();}
});
window.addEventListener('popstate',syncHash);window.addEventListener('hashchange',syncHash);
const themeToggle=document.getElementById('theme-toggle');
function setTheme(theme,persist=false){
 root.dataset.theme=theme;const dark=theme==='dark';
 themeToggle.setAttribute('aria-pressed',String(dark));
 themeToggle.setAttribute('aria-label',`Switch to ${dark?'light':'dark'} mode`);
 document.querySelector('.theme-icon').textContent=dark?'☾':'☼';
 document.querySelector('.theme-label').textContent=dark?'Dark':'Light';
 document.querySelector('meta[name="theme-color"]').content=dark?'#11100f':'#f6f2e9';
 if(persist)try{localStorage.setItem('desk-theme',theme);}catch{}
}
let savedTheme;try{savedTheme=localStorage.getItem('desk-theme');}catch{}
const initialHour=seoulParts(new Date()).hour;
setTheme(['light','dark'].includes(savedTheme)?savedTheme:initialHour>=6&&initialHour<18?'light':'dark');
themeToggle.addEventListener('click',()=>setTheme(root.dataset.theme==='dark'?'light':'dark',true));
document.addEventListener('click',async e=>{if(e.target.id!=='copy-email')return;const el=e.target;try{await navigator.clipboard.writeText('yko081524@yonsei.ac.kr');el.textContent='Copied ✓';document.getElementById('copy-status').textContent='Email address copied';}catch{el.textContent='Select the email address above to copy';}});
function renderHomeLocale(){
 document.querySelector('[data-home-intro]').textContent=getLanguage()==='ko'?'AI 연구 및 소프트웨어 개발':'AI research & software development';
}
document.getElementById('year').textContent=seoulParts(new Date()).year;
setLanguage(getLanguage());
renderHomeLocale();
document.querySelector('.language-switch').addEventListener('click',event=>{
 const button=event.target.closest('[data-language]');if(!button||button.dataset.language===getLanguage())return;
 const anchor=[...content.querySelectorAll('.article-section,.article-demo,.article-code,.hbr-demo,.research-demo')].find(el=>{const rect=el.getBoundingClientRect();return rect.bottom>80&&rect.top<window.innerHeight;});
 const anchorId=anchor?.id,anchorTop=anchor?.getBoundingClientRect().top;
 const commentsRoot=content.querySelector('.article-comments:has(iframe)');
 const demoControls=[...content.querySelectorAll('[data-demo] input,[data-demo] select,[data-research-demo] input,[data-research-demo] select')].map(el=>({value:el.value,checked:el.checked}));
 setLanguage(button.dataset.language);
 renderHomeLocale();
 if(!homeView.hidden)return;
 const key=pageView.dataset.section||'about',postSlug=pageView.dataset.post||'';
 renderSection(key,{scroll:false,postSlug,force:true,commentsRoot});
 const restoredControls=[...content.querySelectorAll('[data-demo] input,[data-demo] select,[data-research-demo] input,[data-research-demo] select')];
 demoControls.forEach((state,index)=>{const el=restoredControls[index];if(!el)return;el.value=state.value;if(el.type==='checkbox')el.checked=state.checked;el.dispatchEvent(new Event('input',{bubbles:true}));if(el.tagName==='SELECT')el.dispatchEvent(new Event('change',{bubbles:true}));if(el.matches('[data-blocks]'))el.form.requestSubmit();});
 if(anchorId){const translated=document.getElementById(anchorId);if(translated)window.scrollBy({top:translated.getBoundingClientRect().top-anchorTop,behavior:'instant'});}
});
observeLanguage();
syncHash({initial:true});
