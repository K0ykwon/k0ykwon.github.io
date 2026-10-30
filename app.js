import {localizePost} from './blog/localization.js?v=20261030-body-language';
import {getLanguage,setLanguage,t,english,translateDOM,observeLanguage} from './i18n.js?v=20261030-body-language';
import {getBlogPost,renderBlogIndex,renderBlogArticle,activateBlog} from './blog/ui.js?v=20261030-body-language';
import {lightingAt,solarMinute} from './lighting.js?v=20261029-scenes-16';
import {seoulParts,seasonFor,outsideFor,parseWeather,cachedScene} from './weather.js?v=20261029-scene-start';
const root=document.documentElement;
const pageView=document.getElementById('page-view');
const content=document.getElementById('page-content');
const reducedMotion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const sections={
  about:{index:'01',object:'THE OPEN NOTEBOOK',title:'Hello, I’m Youngkwon Ko.',intro:'I’m an Artificial Intelligence undergraduate at Yonsei University, currently on leave while serving as an AI Specialist in the Republic of Korea Navy. I work across applied AI research and software development.',body:`<div class="profile-mark"><img class="profile-photo" src="assets/youngkwon-ko.jpg" alt="Portrait of Youngkwon Ko" width="1536" height="1536" decoding="async"><div><strong>Youngkwon Ko</strong><small>AI / ML research & software development</small><nav class="profile-links" aria-label="Personal profiles"><a href="mailto:yko081524@yonsei.ac.kr">Email <span>↗</span></a><a href="https://github.com/K0ykwon" target="_blank" rel="noopener noreferrer">GitHub <span>↗</span></a><a href="https://www.linkedin.com/in/youngkwon-ko-355984390/" target="_blank" rel="noopener noreferrer">LinkedIn <span>↗</span></a><a href="https://orcid.org/0009-0002-2721-1329" target="_blank" rel="noopener noreferrer">ORCID <span>↗</span></a></nav></div></div><article class="panel-entry"><span class="entry-meta">EDUCATION · MAR 2023–PRESENT</span><h3>Yonsei University</h3><p>B.S. in Artificial Intelligence — in progress.</p><p>Seoul, Republic of Korea. Currently on a leave of absence.</p></article><article class="panel-entry"><span class="entry-meta">INTERESTS</span><h3>How we represent and use information.</h3><p>I’m interested in representation learning, computer vision, and efficient AI systems. My research also explores quantum optimization.</p><div class="entry-tags"><span>Representation learning</span><span>Computer vision</span><span>Efficient AI</span><span>Quantum optimization</span></div></article><article class="panel-entry"><span class="entry-meta">HOW I WORK</span><h3>From questions to working tools.</h3><p>I like connecting research with implementation: exploring an idea, testing it in code, and turning what I learn into tools that help with real tasks.</p><p>Python and PyTorch are central to my machine learning work; I also build the interfaces and services around it.</p><a href="#software" data-section="software">Explore my software <span>↗</span></a></article><article class="panel-entry"><span class="entry-meta">TECHNICAL SKILLS</span><h3>Tools I work with.</h3><p><strong>Programming</strong><br>Python, TypeScript, C++, JavaScript</p><p><strong>Machine learning</strong><br>PyTorch, TensorFlow, OpenCV</p><p><strong>Development</strong><br>React, Next.js, Git, Linux</p></article><article class="panel-entry"><span class="entry-meta">GET IN TOUCH</span><h3>Let’s compare notes.</h3><p>For research conversations, software projects, or collaboration, feel free to reach out.</p><a href="mailto:yko081524@yonsei.ac.kr">yko081524@yonsei.ac.kr <span>↗</span></a></article>`},
  research:{index:'02',object:'PAPERS ON THE DESK',title:'Research.',intro:'Selected publications in applied AI and information representation, followed by a short overview of ongoing work.',body:`<div class="research-overview"><section class="publications-section" aria-labelledby="publications-title"><header class="research-section-heading"><span class="entry-meta">01 / SELECTED PUBLICATIONS</span><h2 id="publications-title">Publications</h2></header><article class="publication"><div class="publication-index"><span>01</span><time datetime="2026">2026</time></div><div class="publication-content"><span class="entry-meta">MARINE SCIENCE &amp; TECHNOLOGY</span><h3>A Mission-Aware Autoencoder Bottleneck Compression Framework for Drone-Based Hyperspectral Image Transmission.</h3><p class="publication-authors"><strong>Youngkwon Ko</strong>, Yunbo Shim, Doun Lee, and Seayul Choi.</p><p class="publication-venue"><em>Marine Science &amp; Technology</em>, 2026.</p><p class="publication-summary">An autoencoder-based transmission framework combining latent compression with spectral patch prioritization. On KSC and Salinas, it achieves approximately 613× and 710.5× latent-payload reductions, respectively, while outperforming random and edge-based selection on important-region retrieval.</p><div class="entry-tags"><span>Hyperspectral imaging</span><span>Compression</span><span>Mission-aware AI</span></div></div></article><article class="publication"><div class="publication-index"><span>02</span><time datetime="2026">2026</time></div><div class="publication-content"><span class="entry-meta">KOREA COMPUTER CONGRESS</span><h3>Provenance-Preserving Schema and Resource Construction for Information Extraction from Historical Battle Records: A Corpus Study of the Inchon Landing.</h3><p class="publication-authors">Yunbo Shim, <strong>Youngkwon Ko</strong>, et al.</p><p class="publication-venue"><em>Proceedings of the Korea Computer Congress (KCC 2026)</em>, 2026.</p><p class="publication-summary">A corpus study of the Inchon Landing that develops a provenance-preserving schema and resources for extracting structured information from historical battle records.</p><div class="entry-tags"><span>Information extraction</span><span>Corpus construction</span><span>Provenance</span></div></div></article><article class="publication"><div class="publication-index"><span>03</span></div><div class="publication-content"><span class="entry-meta">MULTI-CCTV · FIRE &amp; SMOKE DETECTION</span><h3>Design and Preliminary Validation of a Public-Data-Based Ship-Like Multi-CCTV Fire and Smoke Early Warning System</h3><p class="publication-authors">Yunbo Shim, <strong>Youngkwon Ko</strong>, Doun Lee, Seayul Choi, and Muhyeon Park.</p><p class="publication-venue" lang="ko">공개자료 기반 함정형 다중 CCTV 화재·연기 조기경보 시스템의 설계와 예비 검증</p><p class="publication-summary">A public-data-based framework combining fire/smoke donor crops, ship-like background and confuser images, and synthetic positive proxies. The prototype connects detection, temporal verification, and alert evidence capture across multiple camera channels.</p><p class="publication-summary">A four-stream MP4 NVR emulator processed 240 sampled frames at 27.80 analyzed FPS, providing preliminary validation of the end-to-end processing pipeline.</p><div class="entry-tags"><span>Fire &amp; smoke detection</span><span>Multi-CCTV</span><span>Public data</span><span>ONNX Runtime</span></div></div></article></section><section class="ongoing-section" aria-labelledby="ongoing-title"><header class="research-section-heading"><span class="entry-meta">02 / IN PROGRESS</span><h2 id="ongoing-title">Ongoing work</h2></header><div class="ongoing-entry"><h3>PACT</h3><p>Phase-aware compression and transfer for continuing CV-QAOA optimization through short coherent blocks.</p></div><div class="ongoing-entry"><h3>Lineage</h3><p>Resolving parent relationships between entities using passage evidence.</p></div></section></div>`},
  software:{index:'03',object:'ON THE LAPTOP',title:'Built with curiosity.',intro:'Tools for exploring models, working with information, and turning experiments into software.',body:`<article class="panel-entry"><span class="entry-meta">PYTHON · PYTORCH</span><h3>P2I</h3><p>PyTorch tracing and model exploration, with observed Model IR, editable ArchitectureIR, a harness, and a skill registry.</p><a href="https://github.com/PtwoI/p2i-core" target="_blank" rel="noopener noreferrer">Explore repository <span>↗</span></a></article><article class="panel-entry"><span class="entry-meta">PYTHON · DOCUMENT TOOLS</span><h3>MINEY</h3><p>A legal document analysis and case-retrieval system developed through Creai+it.</p><a href="https://github.com/K0ykwon/MINEY" target="_blank" rel="noopener noreferrer">Explore repository <span>↗</span></a></article><article class="panel-entry"><span class="entry-meta">AI · INFORMATION RETRIEVAL</span><h3>AI Document Assistant</h3><p>Document processing, retrieval, and question answering in a practical assistant workflow.</p><a href="https://github.com/K0ykwon/AI-Document-Assistant" target="_blank" rel="noopener noreferrer">Explore repository <span>↗</span></a></article><article class="panel-entry"><a href="https://github.com/K0ykwon" target="_blank" rel="noopener noreferrer">More on GitHub <span>↗</span></a></article>`},
  blog:{index:'04',object:'BETWEEN THE BOOKS',title:'Blog.',intro:'논문 리뷰와 알고리즘 문제 풀이.',body:renderBlogIndex()},
  experience:{index:'05',object:'RIGHT NOTEBOOK PAGE',title:'Experience.',intro:'Research, product development, and the people I’ve built with.',body:`<div class="experience-overview"><section class="career-section" aria-labelledby="career-title"><div class="experience-section-heading"><span class="entry-meta">01 / CAREER</span><h2 id="career-title">Research &amp; professional experience</h2></div><ol class="career-timeline"><li class="timeline-item"><div class="timeline-date">DEC 2025–PRESENT<span class="timeline-status">Current</span></div><article class="timeline-entry"><h3>Republic of Korea Navy</h3><p><strong>Artificial Intelligence Specialist</strong><br>Expected service completion: August 2027.</p><p>Applied AI research and development as an AI-specialized enlisted service member, including a mission-aware hyperspectral image transmission framework using autoencoder compression and spectral patch prioritization.</p><p>Participating in technical research and discussions on hyperspectral satellite systems in collaboration with the Agency for Defense Development (ADD).</p><a href="#research" data-section="research">Explore the research <span>↗</span></a></article></li><li class="timeline-item"><div class="timeline-date">SEP–DEC 2025</div><article class="timeline-entry"><h3>Root Education</h3><p><strong>Co-Founder</strong></p><p>Co-founded an AI-powered education platform organizing admissions-focused influencer content into a structured learning environment.</p><p>Developed AI-assisted learning features and contributed to product design and frontend development with Next.js and TypeScript.</p></article></li><li class="timeline-item"><div class="timeline-date">SEP–OCT 2025</div><article class="timeline-entry"><h3>Little Samo</h3><p><strong>Contract Software Developer</strong></p><p>Developed SamoAI-InstagramTracker, an AI-powered Instagram influencer discovery and data collection application built on the SamoAI multi-agent framework.</p><p>Contributed to maintenance of the SamoAI engine and its CLI-based agent chat interface.</p></article></li><li class="timeline-item"><div class="timeline-date">JAN–JUN 2025</div><article class="timeline-entry"><h3>Yonsei Medisys Lab</h3><p><strong>Research Intern</strong></p><p>Researched low-dose CT image quality assessment with 11,200 MOS-annotated images, training and evaluating EfficientNet, ViT, TinyViT, and ManiQA.</p><p>Investigated CT denoising fine-tuning with an image quality assessment model as a reward signal.</p></article></li><li class="timeline-item"><div class="timeline-date">SEP 2024–DEC 2025</div><article class="timeline-entry"><h3>Creai+it</h3><p><strong>Co-Leader · AI Startup Club</strong></p><p>Led AI product development across document intelligence, legal AI, assistive technology, and generative AI. Projects included Somni, an AI-assisted narrative development system, and Miney, a legal document analysis and case-retrieval system.</p><p>Collaborated with Upstage on a Solar-based intelligent document processing system and participated in the 2025 AGI Agent Hackathon.</p></article></li></ol></section><aside class="honors-section" aria-labelledby="honors-title"><div class="experience-section-heading"><span class="entry-meta">02 / RECOGNITION</span><h2 id="honors-title">Awards &amp; honors</h2></div><article class="award-entry"><span class="entry-meta">AWARD · 2026</span><h3>1st Place</h3><p>Navy &amp; Marine Corps Artificial Intelligence Competition.</p></article><article class="award-entry"><span class="entry-meta">AWARD · JUN 2025</span><h3>RED S Design Award</h3><p>1st Prize · Interactive Media Design, Yonsei University.</p></article><article class="cv-entry"><span class="entry-meta">GET IN TOUCH</span><h3>Looking for a CV?</h3><p>For a current CV or more details about my work, please get in touch.</p><a href="mailto:yko081524@yonsei.ac.kr?subject=CV%20request">Request a CV <span>↗</span></a></article></aside></div>`},
  contact:{index:'06',object:'A LETTER FROM THE DESK',title:'Let’s talk.',intro:'For research conversations, collaboration, or a simple hello.',body:`<article class="panel-entry"><span class="entry-meta">EMAIL</span><a class="contact-link" href="mailto:yko081524@yonsei.ac.kr">yko081524@yonsei.ac.kr <span>↗</span></a><button class="copy-button" id="copy-email">Copy email address</button><span class="sr-only" id="copy-status" role="status"></span></article><article class="panel-entry"><span class="entry-meta">CODE & PROJECTS</span><h3>GitHub</h3><a href="https://github.com/K0ykwon" target="_blank" rel="noopener noreferrer">@K0ykwon <span>↗</span></a></article><article class="panel-entry"><span class="entry-meta">PROFILE & CONNECTIONS</span><h3>LinkedIn</h3><a href="https://www.linkedin.com/in/youngkwon-ko-355984390/" target="_blank" rel="noopener noreferrer">Youngkwon Ko <span>↗</span></a></article><article class="panel-entry"><span class="entry-meta">RESEARCH IDENTIFIER</span><h3>ORCID</h3><a href="https://orcid.org/0009-0002-2721-1329" target="_blank" rel="noopener noreferrer">0009-0002-2721-1329 <span>↗</span></a></article>`}
};
let sectionObserver;let entranceFrame;let blogCleanup;
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
  const base=sections[key];if(!base)return;
  const post=key==='blog'?localizePost(getBlogPost(postSlug),getLanguage()):undefined;
  const activePost=post?.slug||'';
  const page=post?{...base,object:post.kind==='review'?`PAPER REVIEW / ${post.paper.year}`:`${english(post.category)} / ${english(post.subcategory)} / BOJ ${post.id}`,title:post.title,intro:post.summary,body:renderBlogArticle(post)}:key==='blog'?{...base,body:renderBlogIndex()}:base;
  if(!force&&pageView.dataset.section===key&&pageView.dataset.post===activePost&&!pageView.hidden){if(scroll)scrollToSection();return;}
  blogCleanup?.();blogCleanup=undefined;
  sectionObserver?.disconnect();cancelAnimationFrame(entranceFrame);pageView.classList.remove('section-enter','section-playing');
  document.getElementById('page-title').removeAttribute('aria-label');
  for(const id of ['page-kicker','page-index','page-title','page-intro']){const el=document.getElementById(id);el.classList.remove('section-rise');el.style.removeProperty('--entrance-delay');}
  // Commit the cleared animation styles before reusing the heading elements.
  if(!pageView.hidden)void pageView.offsetWidth;
  pageView.dataset.section=key;pageView.dataset.post=activePost;
  document.title=post?`${post.title} — Youngkwon Ko`:key==='blog'?'Blog — Youngkwon Ko':'Youngkwon Ko — A desk of ideas';
  document.getElementById('page-kicker').textContent=page.object;
  document.getElementById('page-index').textContent=`${page.index} / From the desk`;
  document.getElementById('page-title').textContent=english(page.title);
  document.getElementById('page-intro').textContent=page.intro;
  content.innerHTML=page.body;
  if(commentsRoot)content.querySelector('.article-comments')?.replaceWith(commentsRoot);
  if(key==='research'){
    const publications=content.querySelector('.publications-section');
    const firstAuthor=paper=>paper.querySelector('.publication-authors')?.textContent.split(',')[0].trim()==='Youngkwon Ko';
    const papers=[...publications.querySelectorAll('.publication')].sort((a,b)=>Number(firstAuthor(b))-Number(firstAuthor(a)));
    papers.forEach((paper,index)=>{paper.querySelector('.publication-index>span').textContent=String(index+1).padStart(2,'0');publications.append(paper);});
  }
  pageView.hidden=false;
  if(key==='blog')blogCleanup=activateBlog(content,post);
  translateDOM(pageView);
  if(animate)prepareSectionEntrance(english(page.title),key,{typing:key==='about'});
  document.querySelectorAll('a[data-section]').forEach(el=>{if(el.dataset.section===key&&(!el.hasAttribute('data-post')||el.dataset.post===activePost))el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');});
  if(scroll)scrollToSection();
}
function home({scroll=true}={}) {
  renderSection('about',{scroll:false});
  if(scroll){document.querySelector('.brand').focus({preventScroll:true});window.scrollTo({top:0,behavior:reducedMotion()?'instant':'smooth'});}
}
function syncHash({initial=false}={}){const [key,postSlug='']=location.hash.slice(1).split('/');if(sections[key])renderSection(key,{postSlug});else home({scroll:!initial&&!location.hash});}
function navigate(key,postSlug=''){if(!sections[key])return;const activePost=key==='blog'?getBlogPost(postSlug)?.slug||'':'';if(pageView.dataset.section!==key||pageView.dataset.post!==activePost||pageView.hidden)history.pushState(null,'',`${location.pathname}${location.search}#${key}${activePost?'/'+activePost:''}`);renderSection(key,{postSlug:activePost});}
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
 const anchor=[...content.querySelectorAll('.article-section,.article-demo,.article-code')].find(el=>{const rect=el.getBoundingClientRect();return rect.bottom>80&&rect.top<window.innerHeight;});
 const anchorId=anchor?.id,anchorTop=anchor?.getBoundingClientRect().top;
 const commentsRoot=content.querySelector('.article-comments:has(iframe)');
 const demoControls=[...content.querySelectorAll('[data-demo] input,[data-demo] select')].map(el=>({value:el.value,checked:el.checked}));
 setLanguage(button.dataset.language);
 const key=pageView.dataset.section||'about',postSlug=pageView.dataset.post||'';
 renderSection(key,{scroll:false,postSlug,force:true,animate:false,commentsRoot});
 const restoredControls=[...content.querySelectorAll('[data-demo] input,[data-demo] select')];
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
