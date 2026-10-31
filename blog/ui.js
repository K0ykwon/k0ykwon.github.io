import {getLanguage,t,english} from '../i18n.js?v=20261031-content-folders';
import {localizePost} from './localization.js?v=20261031-content-folders';
import {mountComments} from './comments.js?v=20261031-content-folders';
import {POSTS} from './posts.js?v=20261031-content-folders';
import {mountDemo} from './demos.js?v=20261031-content-folders';
import {renderMath} from './math.js?v=20261031-content-folders';
export const escapeHTML=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const getBlogPost=slug=>POSTS.find(post=>post.slug===slug);
const link=post=>`#blog/${post.slug}`;
const date=value=>value.replaceAll('-','.');
let selectedCategory='알고리즘';
export function getPostDemos(post){
 return post.demos??(post.demo?[{id:'demo',type:post.demo,title:post.demoTitle,after:post.demoAfter??post.sections[1]?.id}]:[]);
}
function highlightPython(code){
 const pattern=/#[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:def|return|if|else|elif|for|while|in|from|import|as|and|or|not|None|True|False|with|class)\b|\b\d[\d_]*(?:\.\d+)?\b/g;
 let result='',offset=0;
 for(const match of code.matchAll(pattern)){const token=match[0];const kind=token.startsWith('#')?'comment':/^["']/.test(token)?'string':/^\d/.test(token)?'number':'keyword';result+=escapeHTML(code.slice(offset,match.index))+`<span class="token-${kind}">${escapeHTML(token)}</span>`;offset=match.index+token.length;}
 return result+escapeHTML(code.slice(offset));
}
export function renderBlogIndex(){
 return `<div class="blog-index"><div class="blog-tools"><label class="blog-search"><span>글 찾기</span><input type="search" data-blog-search placeholder="제목, 주제, 문제 번호" autocomplete="off"></label><div class="blog-categories"><div class="blog-category-list" role="group" aria-label="글 분류">${['알고리즘','Devlog','연구노트','Paper review'].map(category=>`<button type="button" data-blog-category="${category}" aria-pressed="${category==='알고리즘'}">${category}<span>${POSTS.filter(post=>post.category===category).length}</span></button>`).join('')}</div><div class="blog-filters" role="group" aria-label="알고리즘 소분류">${['전체','비트마스크','DP','수론'].map((tag,i)=>`<button type="button" data-blog-filter="${tag}" aria-pressed="${i===0}">${tag}</button>`).join('')}</div></div><div class="blog-list-meta"><span data-blog-count role="status">${POSTS.length}개의 글</span></div></div><ol class="blog-list">${POSTS.map((original,index)=>{const post=localizePost(original,getLanguage());return `<li data-post-card="${post.slug}"><a href="${link(post)}" data-section="blog" data-post="${post.slug}" class="blog-card"><span class="blog-card-number">${String(POSTS.slice(0,index+1).filter(item=>item.category===post.category).length).padStart(2,'0')}</span><div><div class="blog-card-meta"><time datetime="${post.published}">${date(post.published)}</time><span>${post.kind==='review'?escapeHTML(post.paper.venue):'Python'}</span></div><h3>${escapeHTML(post.title)}</h3><p>${escapeHTML(post.summary)}</p><div class="blog-tags">${post.tags.map(tag=>`<span>${tag}</span>`).join('')}</div></div><span class="blog-card-arrow" aria-hidden="true">↗</span></a></li>`;}).join('')}</ol><p class="blog-no-results" data-blog-empty hidden>검색 결과가 없습니다.</p></div>`;
}
export function renderBlogArticle(original){
 const post=localizePost(original,getLanguage());
 const id=name=>`${post.slug}-${name}`;
 const demos=getPostDemos(post);
 const code=post.code?`<section class="article-code" id="${id('code')}"><h2>Python code</h2><div class="code-toolbar"><span>Python · BOJ ${post.id}</span><div><a href="${post.codePath}" download>다운로드</a><button type="button" data-copy-code>코드 복사</button></div></div><pre tabindex="0" aria-label="Python 풀이 코드"><code>${highlightPython(post.code)}</code></pre><p class="code-status" role="status" data-code-status></p></section>`:'';
 const toc=[];
 const body=post.sections.map((section,index)=>{
  toc.push([section.id,section.title]);
  let html=renderMath(section.html).replace(/#SOURCE(\d+)/g,(_,n)=>`#${id('source-'+n)}`).replace(/data-review-ref="(\d+)"/g,(_,n)=>`data-scroll-to="${id('source-'+n)}"`);
  let result=`<section class="article-section" id="${id(section.id)}"><h2>${section.title}</h2>${html}</section>`;
  for(const demo of demos.filter(demo=>demo.after===section.id)){toc.push([demo.id,demo.title]);result+=`<section class="article-demo" id="${id(demo.id)}"><h2>${escapeHTML(demo.title)}</h2><div data-demo="${demo.type}" data-demo-id="${demo.id}"></div></section>`;}
  if(index===post.sections.length-2&&code){toc.push(['code','Python code']);result+=code;}
  return result;
 }).join('');
 const references=post.sources?`<section class="article-section review-sources" id="${id('references')}"><h2>References</h2><ol>${post.sources.map((source,index)=>`<li id="${id('source-'+(index+1))}"><a href="${escapeHTML(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(source.title)} ↗</a><p>${escapeHTML(source.detail)}</p></li>`).join('')}</ol></section>`:'';
 if(post.sources)toc.push(['references','References']);
 const paper=post.paper?`<div class="paper-details"><span class="entry-meta">${escapeHTML(post.paper.venue)} · ${post.paper.year}</span><p>${escapeHTML(post.paper.authors)}</p></div>`:'';
 return `<article class="blog-article" lang="${post.language}" aria-labelledby="page-title"><div class="post-meta"><a href="#blog" data-section="blog" data-post="">← 글 목록</a><span>Youngkwon Ko</span><span>${escapeHTML(english(post.category))} / ${escapeHTML(english(post.subcategory))}</span><time datetime="${post.published}">작성 ${date(post.published)}</time><span>수정 ${date(post.updated)}</span></div>${paper}<div class="article-columns"><div class="article-prose">${body}${references}<footer class="article-footer"><div>${post.kind==='review'?'':`<a href="https://www.acmicpc.net/problem/${post.id}" target="_blank" rel="noopener noreferrer">BOJ ${post.id} ↗</a>`}<a href="#blog" data-section="blog" data-post="">모든 글 보기 →</a></div></footer><section class="article-comments" aria-labelledby="comments-title"><h2 id="comments-title">Comments</h2><p role="status" data-comments-status></p><div class="giscus"></div></section></div><aside class="article-aside"><details class="article-toc" open><summary>목차</summary><nav aria-label="글 목차">${toc.map(([target,title])=>`<button type="button" data-scroll-to="${id(target)}">${title}</button>`).join('')}</nav></details></aside></div></article>`;
}
export function activateBlog(container,post){
 const controller=new AbortController(),signal=controller.signal;
 if(!post){
  let category=selectedCategory,filter='전체';
  const refresh=()=>{container.querySelectorAll('[data-blog-category]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.blogCategory===category)));container.querySelector('.blog-filters').hidden=category!=='알고리즘';const query=container.querySelector('[data-blog-search]').value.trim().toLocaleLowerCase();let count=0;
   for(const card of container.querySelectorAll('[data-post-card]')){const item=getBlogPost(card.dataset.postCard);const match=item.category===category&&(filter==='전체'||item.subcategory===filter)&&[item.title,item.summary,item.id,item.category,item.subcategory,...item.tags,localizePost(item,getLanguage()).title,localizePost(item,getLanguage()).summary].join(' ').toLocaleLowerCase().includes(query);card.hidden=!match;if(match)count++;}
   container.querySelector('[data-blog-count]').textContent=`${count}개의 글`;const empty=container.querySelector('[data-blog-empty]');empty.hidden=count!==0;empty.textContent=POSTS.some(item=>item.category===category)?'검색 결과가 없습니다.':'아직 작성한 글이 없습니다.';
  };
  refresh();
  container.addEventListener('input',e=>{if(e.target.matches('[data-blog-search]'))refresh();},{signal});
  container.addEventListener('click',e=>{const categoryButton=e.target.closest('[data-blog-category]');if(categoryButton){category=categoryButton.dataset.blogCategory;selectedCategory=category;filter='전체';container.querySelectorAll('[data-blog-category]').forEach(b=>b.setAttribute('aria-pressed',String(b===categoryButton)));container.querySelector('.blog-filters').hidden=category!=='알고리즘';container.querySelectorAll('[data-blog-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.blogFilter==='전체')));refresh();return;}const button=e.target.closest('[data-blog-filter]');if(!button)return;filter=button.dataset.blogFilter;container.querySelectorAll('[data-blog-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));refresh();},{signal});
 }else{
  selectedCategory=post.category;
  container.querySelectorAll('[data-demo]').forEach(root=>mountDemo(root,root.dataset.demo,signal));
  mountComments(container.querySelector('.article-comments'),post,signal);
  container.addEventListener('click',async e=>{
   const toc=e.target.closest('[data-scroll-to]');if(toc){e.preventDefault();document.getElementById(toc.dataset.scrollTo)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'start'});return;}
   if(e.target.closest('[data-copy-code]')){const status=container.querySelector('[data-code-status]');try{await navigator.clipboard.writeText(post.code);if(!signal.aborted)status.textContent='코드를 복사했습니다.';}catch{if(!signal.aborted)status.textContent='복사에 실패했습니다. 코드를 선택해 복사하거나 파일을 다운로드할 수 있습니다.';}}
  },{signal});
 }
 return ()=>controller.abort();
}
