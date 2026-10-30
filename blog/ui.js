import {POSTS} from './posts.js?v=20261030-blog';
import {mountDemo} from './demos.js?v=20261030-blog';
export const escapeHTML=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const getBlogPost=slug=>POSTS.find(post=>post.slug===slug);
const link=post=>`#blog/${post.slug}`;
const date=value=>value.replaceAll('-','.');
function highlightPython(code){
 const pattern=/#[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:def|return|if|else|elif|for|while|in|from|import|as|and|or|not|None|True|False|with|class)\b|\b\d[\d_]*(?:\.\d+)?\b/g;
 let result='',offset=0;
 for(const match of code.matchAll(pattern)){const token=match[0];const kind=token.startsWith('#')?'comment':/^["']/.test(token)?'string':/^\d/.test(token)?'number':'keyword';result+=escapeHTML(code.slice(offset,match.index))+`<span class="token-${kind}">${escapeHTML(token)}</span>`;offset=match.index+token.length;}
 return result+escapeHTML(code.slice(offset));
}
export function renderBlogIndex(){
 return `<div class="blog-index"><div class="blog-tools"><label class="blog-search"><span>글 찾기</span><input type="search" data-blog-search placeholder="제목, 알고리즘, 문제 번호" autocomplete="off"></label><div class="blog-filters" role="group" aria-label="글 분류">${['전체','비트마스크','DP','수론'].map((tag,i)=>`<button type="button" data-blog-filter="${tag}" aria-pressed="${i===0}">${tag}</button>`).join('')}</div><div class="blog-list-meta"><span data-blog-count role="status">${POSTS.length}개의 글</span><a href="https://alpha.velog.io/@koykwon/posts" target="_blank" rel="noopener noreferrer">Velog ↗</a></div></div><ol class="blog-list">${POSTS.map((post,index)=>`<li data-post-card="${post.slug}"><a href="${link(post)}" data-section="blog" data-post="${post.slug}" class="blog-card"><span class="blog-card-number">${String(index+1).padStart(2,'0')}</span><div><div class="blog-card-meta"><time datetime="${post.published}">${date(post.published)}</time><span>${post.minutes}분 읽기</span><span>Python</span></div><h3>${escapeHTML(post.title)}</h3><p>${escapeHTML(post.summary)}</p><div class="blog-tags">${post.tags.map(tag=>`<span>${tag}</span>`).join('')}<span class="playground-tag">직접 살펴보기</span></div></div><span class="blog-card-arrow" aria-hidden="true">↗</span></a></li>`).join('')}</ol><p class="blog-no-results" data-blog-empty hidden>찾는 글이 없습니다. 다른 검색어나 분류를 선택해 보세요.</p></div>`;
}
export function renderBlogArticle(post){
 const id=name=>`${post.slug}-${name}`;
 const code=`<section class="article-code" id="${id('code')}"><h2>Python 코드</h2><div class="code-toolbar"><span>Python · BOJ ${post.id}</span><div><a href="${post.codePath}" download>다운로드</a><button type="button" data-copy-code>코드 복사</button></div></div><pre tabindex="0" aria-label="Python 풀이 코드"><code>${highlightPython(post.code)}</code></pre><p class="code-status" role="status" data-code-status></p></section>`;
 const toc=[...post.sections.slice(0,2).map(s=>[s.id,s.title]),['demo','직접 살펴보기'],...post.sections.slice(2,-1).map(s=>[s.id,s.title]),['code','Python 코드'],[post.sections.at(-1).id,post.sections.at(-1).title]];
 const body=post.sections.map((section,index)=>`<section class="article-section" id="${id(section.id)}"><h2>${section.title}</h2>${section.html}</section>${index===1?`<section class="article-demo" id="${id('demo')}"><div class="demo-kicker">INTERACTIVE NOTE</div><h2>직접 살펴보기</h2><div data-demo="${post.demo}"></div></section>`:''}${index===post.sections.length-2?code:''}`).join('');
 return `<article class="blog-article" lang="ko" aria-labelledby="page-title"><div class="post-meta"><a href="#blog" data-section="blog" data-post="">← 글 목록</a><span>Youngkwon Ko</span><time datetime="${post.published}">원문 ${date(post.published)}</time><span>다듬은 날짜 ${date(post.updated)}</span><span>${post.minutes}분 읽기</span></div><div class="article-columns"><div class="article-prose">${body}<footer class="article-footer"><p>Velog에 작성했던 풀이를 바탕으로 설명과 코드 가독성을 다듬고, 브라우저에서 조작할 수 있는 예제를 추가했습니다.</p><div><a href="${post.source}" target="_blank" rel="noopener noreferrer">Velog 원문 ↗</a><a href="https://www.acmicpc.net/problem/${post.id}" target="_blank" rel="noopener noreferrer">BOJ ${post.id} ↗</a><a href="#blog" data-section="blog" data-post="">모든 글 보기 →</a></div></footer></div><aside class="article-aside"><details class="article-toc" open><summary>이 글의 흐름</summary><nav aria-label="글 목차">${toc.map(([target,title])=>`<button type="button" data-scroll-to="${id(target)}">${title}</button>`).join('')}</nav></details></aside></div></article>`;
}
export function activateBlog(container,post){
 const controller=new AbortController(),signal=controller.signal;
 if(!post){
  let filter='전체';
  const refresh=()=>{const query=container.querySelector('[data-blog-search]').value.trim().toLocaleLowerCase();let count=0;
   for(const card of container.querySelectorAll('[data-post-card]')){const item=getBlogPost(card.dataset.postCard);const match=(filter==='전체'||item.category===filter)&&[item.title,item.summary,item.id,...item.tags].join(' ').toLocaleLowerCase().includes(query);card.hidden=!match;if(match)count++;}
   container.querySelector('[data-blog-count]').textContent=`${count}개의 글`;container.querySelector('[data-blog-empty]').hidden=count!==0;
  };
  container.addEventListener('input',e=>{if(e.target.matches('[data-blog-search]'))refresh();},{signal});
  container.addEventListener('click',e=>{const button=e.target.closest('[data-blog-filter]');if(!button)return;filter=button.dataset.blogFilter;container.querySelectorAll('[data-blog-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));refresh();},{signal});
 }else{
  mountDemo(container.querySelector('[data-demo]'),post.demo,signal);
  container.addEventListener('click',async e=>{
   const toc=e.target.closest('[data-scroll-to]');if(toc){document.getElementById(toc.dataset.scrollTo)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'start'});return;}
   if(e.target.closest('[data-copy-code]')){const status=container.querySelector('[data-code-status]');try{await navigator.clipboard.writeText(post.code);if(!signal.aborted)status.textContent='코드를 복사했습니다.';}catch{if(!signal.aborted)status.textContent='복사할 수 없습니다. 코드 영역에서 직접 선택하거나 파일을 다운로드해 주세요.';}}
  },{signal});
 }
 return ()=>controller.abort();
}
