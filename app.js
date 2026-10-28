import {lightingAt,solarMinute} from './lighting.js?v=20261028-live-clock';
import {seoulParts,seasonFor,outsideFor,parseWeather} from './weather.js';
const root=document.documentElement;
const pageView=document.getElementById('page-view');
const content=document.getElementById('page-content');
const shelf=document.getElementById('selected-work');
const reducedMotion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const sections={
  about:{index:'01',object:'THE OPEN NOTEBOOK',title:'Hello, I’m Youngkwon.',intro:'I work at the intersection of machine learning, quantum algorithms, and software. I’m interested in ideas that can become useful systems.',body:`<div class="profile-mark"><div><strong>Youngkwon Ko</strong><small>Yonsei University · Artificial intelligence</small></div></div><article class="panel-entry"><span class="entry-meta">RESEARCH & ENGINEERING</span><h3>From a question to a working system.</h3><p>My work spans continuous-variable quantum optimization, information representation, and language-based systems. I also build software to explore models and work with documents.</p><div class="entry-tags"><span>Machine learning</span><span>Quantum algorithms</span><span>Software</span></div></article><article class="panel-entry"><span class="entry-meta">AROUND THIS DESK</span><h3>A few ways in.</h3><p>The papers hold research, the laptop holds software, and the books leave room for writing. Outside the window is Seoul. The lamp is yours to switch.</p><a href="#contact" data-section="contact">Say hello <span>↗</span></a></article>`},
  research:{index:'02',object:'PAPERS ON THE DESK',title:'Research.',intro:'Questions about computation, information, and the representations that connect them.',body:`<article class="panel-entry"><span class="entry-meta">QUANTUM OPTIMIZATION · MANUSCRIPT IN PROGRESS</span><h3>PACT</h3><p>Phase-Aware Compression and Transfer for Continuous-Variable QAOA.</p><p>Continuing optimization through short coherent blocks, connected by homodyne characterization, Gaussian reconstruction, and state preparation. The representation transfers amplitude and phase information into the next block.</p><div class="entry-tags"><span>CV-QAOA</span><span>Gaussian states</span><span>Phase-aware transfer</span></div></article><article class="panel-entry"><span class="entry-meta">MACHINE LEARNING · REMOTE SENSING</span><h3>Hyperspectral compression</h3><p>Exploring mission-aware representations for hyperspectral drone imagery, connecting compact data with downstream tasks.</p></article><article class="panel-entry"><span class="entry-meta">LANGUAGE · ENTITY RELATIONSHIPS</span><h3>Lineage</h3><p>Resolving parent relationships between entities using passage evidence, with attention to both the decision and its supporting quotation.</p></article><article class="panel-entry"><span class="entry-meta">INFORMATION EXTRACTION</span><h3>Historical record extraction</h3><p>Structured information extraction from historical battle records.</p><a href="mailto:yko081524@yonsei.ac.kr?subject=Research%20inquiry">Ask about the research <span>↗</span></a></article>`},
  software:{index:'03',object:'ON THE LAPTOP',title:'Built with curiosity.',intro:'Tools for exploring models, working with information, and turning experiments into software.',body:`<article class="panel-entry"><span class="entry-meta">PYTHON · PYTORCH</span><h3>P2I</h3><p>PyTorch tracing and model exploration, with observed Model IR, editable ArchitectureIR, a harness, and a skill registry.</p><a href="https://github.com/PtwoI/p2i-core" target="_blank" rel="noopener noreferrer">Explore repository <span>↗</span></a></article><article class="panel-entry"><span class="entry-meta">PYTHON · DOCUMENT TOOLS</span><h3>MINEY</h3><p>A software project for AI-assisted document workflows.</p><a href="https://github.com/K0ykwon/MINEY" target="_blank" rel="noopener noreferrer">Explore repository <span>↗</span></a></article><article class="panel-entry"><span class="entry-meta">AI · INFORMATION RETRIEVAL</span><h3>AI Document Assistant</h3><p>Document processing, retrieval, and question answering in a practical assistant workflow.</p><a href="https://github.com/K0ykwon/AI-Document-Assistant" target="_blank" rel="noopener noreferrer">Explore repository <span>↗</span></a></article><article class="panel-entry"><a href="https://github.com/K0ykwon" target="_blank" rel="noopener noreferrer">More on GitHub <span>↗</span></a></article>`},
  blog:{index:'04',object:'BETWEEN THE BOOKS',title:'Field notes.',intro:'A place for experiments, questions, and things learned along the way.',body:`<article class="panel-entry"><span class="entry-meta">A NEW NOTEBOOK</span><h3>Writing is on the way.</h3><p>This space will collect notes on machine learning, quantum computing, and building software. There are no published posts here yet.</p><div class="entry-tags"><span>Machine learning</span><span>Quantum computing</span><span>Build logs</span></div></article><article class="panel-entry"><h3>Meanwhile, explore the work.</h3><a href="#software" data-section="software">Open the laptop <span>↗</span></a></article>`},
  experience:{index:'05',object:'INSIDE THE FOLDER',title:'Experience.',intro:'Learning through research, collaboration, and building things.',body:`<article class="panel-entry"><span class="entry-meta">EDUCATION & RESEARCH</span><h3>Yonsei University</h3><p>Artificial intelligence studies and research, with interests in machine learning, quantum optimization, and practical AI systems.</p></article><article class="panel-entry"><span class="entry-meta">COLLABORATION</span><h3>Research and software.</h3><p>My current projects range from phase-aware transfer for quantum optimization to language-based information extraction and developer tools.</p><a href="#research" data-section="research">Explore the research <span>↗</span></a></article><article class="panel-entry"><span class="entry-meta">GET IN TOUCH</span><h3>Looking for a CV?</h3><p>For a current CV or details about my work, please get in touch.</p><a href="mailto:yko081524@yonsei.ac.kr?subject=CV%20request">Request a CV <span>↗</span></a></article>`},
  contact:{index:'06',object:'A LETTER FROM THE DESK',title:'Let’s talk.',intro:'For research conversations, collaboration, or a simple hello.',body:`<article class="panel-entry"><span class="entry-meta">EMAIL</span><a class="contact-link" href="mailto:yko081524@yonsei.ac.kr">yko081524@yonsei.ac.kr <span>↗</span></a><button class="copy-button" id="copy-email">Copy email address</button><span class="sr-only" id="copy-status" role="status"></span></article><article class="panel-entry"><span class="entry-meta">CODE & PROJECTS</span><h3>GitHub</h3><a href="https://github.com/K0ykwon" target="_blank" rel="noopener noreferrer">@K0ykwon <span>↗</span></a></article>`}
};
function renderSection(key,{scroll=true}={}) {
  const page=sections[key];if(!page)return;
  document.getElementById('page-kicker').textContent=page.object;
  document.getElementById('page-index').textContent=`${page.index} / From the desk`;
  document.getElementById('page-title').textContent=page.title;
  document.getElementById('page-intro').textContent=page.intro;
  content.innerHTML=page.body;
  pageView.hidden=false;shelf.hidden=true;
  document.querySelectorAll('[data-section]').forEach(el=>{if(el.dataset.section===key)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');});
  if(scroll){document.getElementById('page-title').focus({preventScroll:true});requestAnimationFrame(()=>pageView.scrollIntoView({behavior:reducedMotion()?'instant':'smooth',block:'start'}));}
}
function home({scroll=true}={}) {
  pageView.hidden=true;shelf.hidden=false;
  document.querySelectorAll('[data-section][aria-current]').forEach(el=>el.removeAttribute('aria-current'));
  if(scroll){document.querySelector('.brand').focus({preventScroll:true});window.scrollTo({top:0,behavior:reducedMotion()?'instant':'smooth'});}
}
function syncHash({initial=false}={}){const key=location.hash.slice(1);if(sections[key])renderSection(key);else home({scroll:!initial&&!location.hash});}
function navigate(key){history.pushState(null,'',`${location.pathname}${location.search}#${key}`);renderSection(key);}
document.addEventListener('click',e=>{
  if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  const a=e.target.closest('[data-section]');if(a){e.preventDefault();navigate(a.dataset.section);return;}
  if(e.target.closest('[data-home],.brand')){e.preventDefault();history.pushState(null,'',location.pathname+location.search);home();}
});
window.addEventListener('popstate',syncHash);window.addEventListener('hashchange',syncHash);
function setTheme(theme){root.dataset.theme=theme;const dark=theme==='dark';for(const id of ['theme-toggle','lamp-toggle']){const el=document.getElementById(id);el.setAttribute('aria-pressed',String(dark));el.setAttribute('aria-label',`${id==='lamp-toggle'?'Desk lamp: ':''}switch to ${dark?'light':'dark'} mode`);}document.querySelector('.theme-icon').textContent=dark?'☾':'☼';document.querySelector('.theme-label').textContent=dark?'Dark':'Light';document.querySelector('meta[name="theme-color"]').content=dark?'#1c201f':'#f8f7f3';try{localStorage.setItem('desk-theme',theme);}catch{}}
let savedTheme;try{savedTheme=localStorage.getItem('desk-theme');}catch{}setTheme(savedTheme==='dark'?'dark':'light');requestAnimationFrame(()=>requestAnimationFrame(()=>root.classList.add('theme-ready')));for(const id of ['theme-toggle','lamp-toggle'])document.getElementById(id).addEventListener('click',()=>setTheme(root.dataset.theme==='dark'?'light':'dark'));
document.addEventListener('click',async e=>{if(e.target.id!=='copy-email')return;const el=e.target;try{await navigator.clipboard.writeText('yko081524@yonsei.ac.kr');el.textContent='Copied ✓';document.getElementById('copy-status').textContent='Email address copied';}catch{el.textContent='Select the email address above to copy';}});
let weatherIsDay;let weatherFetchedAt=0;let solarTimes={};let weatherPending=false;let weatherAttemptedAt=0;let weatherDate='';
const weatherInterval=5*60*1000;
const clockFormat=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Seoul',weekday:'short',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true});
const seoulDate=now=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
function updateLighting(now){const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Seoul',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(now);const t=Object.fromEntries(parts.filter(p=>p.type!=='literal').map(p=>[p.type,Number(p.value)]));const l=lightingAt(t.hour*60+t.minute+t.second/60,{...solarTimes,weather:root.dataset.weather});for(const [key,value] of Object.entries({'--spill-color':l.color,'--spill-opacity':l.opacity,'--sky-brightness':l.brightness,'--sky-saturation':l.saturation,'--sky-warmth':l.warmth,'--room-darkness':l.roomDarkness,'--lamp-power':l.lamp,'--lamp-shade':l.lampShade,'--lamp-radius':`${l.lampRadius}%`,'--lamp-radius-y':`${l.lampRadiusY}%`,'--lamp-tint':l.lampTint,'--screen-power':l.screenPower,'--weather-ink':l.weatherInk}))root.style.setProperty(key,String(value));document.querySelectorAll('.scene-image').forEach(img=>img.style.opacity=String(l.weights[img.dataset.scene]||0));}
function updateClock(now=new Date()){
 document.getElementById('seoul-clock').textContent=`${clockFormat.format(now)} KST`;
 document.getElementById('year').textContent=seoulParts(now).year;
}
function updateScene(now=new Date()){
 const p=seoulParts(now);root.dataset.season=seasonFor(p.month);
 const fresh=Date.now()-weatherFetchedAt<20*60*1000;
 root.dataset.outside=outsideFor(p.hour,fresh?weatherIsDay:undefined);
 updateLighting(now);
}
async function updateWeather(){if(weatherPending)return;weatherPending=true;weatherAttemptedAt=Date.now();const requestedDate=seoulDate(new Date());const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),8000);try{const response=await fetch('https://api.open-meteo.com/v1/forecast?latitude=37.5665&longitude=126.9780&current=temperature_2m,weather_code,is_day&daily=sunrise,sunset&forecast_days=1&timezone=Asia%2FSeoul',{signal:controller.signal,cache:'no-store'});if(!response.ok)throw new Error('Weather unavailable');const data=await response.json();const w=parseWeather(data);solarTimes={sunrise:solarMinute(data.daily?.sunrise?.[0]),sunset:solarMinute(data.daily?.sunset?.[0])};solarTimes=Object.fromEntries(Object.entries(solarTimes).filter(([,v])=>Number.isFinite(v)));root.dataset.weather=w.kind;weatherIsDay=w.isDay;weatherFetchedAt=Date.now();weatherDate=requestedDate;document.getElementById('temperature').textContent=`${w.temperature}°C`;document.getElementById('weather-icon').textContent=w.isDay?w.icon:(w.kind==='clear'?'☾':w.icon);document.getElementById('weather-detail').textContent=`${w.label} · Live weather`;document.querySelector('.live-dot').classList.remove('offline');updateScene();}catch{root.dataset.weather='clear';weatherIsDay=undefined;weatherFetchedAt=0;document.getElementById('temperature').textContent='—°';document.getElementById('weather-detail').textContent='Weather unavailable · Seoul local time';document.getElementById('weather-icon').textContent='◌';document.querySelector('.live-dot').classList.add('offline');updateScene();}finally{clearTimeout(timeout);weatherPending=false;}}
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
updateClock();updateScene();updateWeather();syncHash({initial:true});clockTick();
document.addEventListener('visibilitychange',()=>{if(document.hidden){clearTimeout(clockTimer);}else resumeLive();});
window.addEventListener('pageshow',()=>resumeLive());
window.addEventListener('focus',()=>resumeLive());
window.addEventListener('online',()=>resumeLive({forceWeather:true}));
