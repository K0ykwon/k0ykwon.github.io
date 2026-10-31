import {publications} from './index.js?v=20261031-research-posts';
const escape=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
export function getResearchPost(slug,language='en'){
 const entry=publications.find(item=>item.slug===slug);if(!entry?.article)return undefined;
 language=language==='ko'?'ko':'en';const html=entry.html[language];
 return {...entry,...entry.article,language,summary:html.match(/<p class="publication-summary">([\s\S]*?)<\/p>/)?.[1]??'',authors:html.match(/<p class="publication-authors">[\s\S]*?<\/p>/)?.[0]??'',venue:html.match(/<p class="publication-venue"[^>]*>[\s\S]*?<\/p>/)?.[0]??''};
}
export function renderResearchArticle(post){
 const approach=`${post.slug}-approach`,illustration=`${post.slug}-illustration`;
 return `<article class="research-article" data-content-localized lang="${post.language}" aria-labelledby="page-title"><div class="post-meta"><a href="#research" data-section="research" data-post="">← Research</a><span>Study overview</span><span>${escape(post.topic)}</span></div><div class="paper-details">${post.authors}${post.venue}</div><div class="article-columns"><div class="article-prose"><section class="article-section" id="${approach}"><h2>Approach</h2><p>${escape(post.approach[post.language])}</p></section><section class="article-section research-illustration" id="${illustration}"><h2>Illustration</h2>${post.renderDemo(post.language)}</section><footer class="article-footer"><a href="#research" data-section="research" data-post="">All research →</a></footer></div><aside class="article-aside"><details class="article-toc" open><summary>Contents</summary><nav aria-label="Study contents"><button type="button" data-scroll-to="${approach}">Approach</button><button type="button" data-scroll-to="${illustration}">Illustration</button></nav></details></aside></div></article>`;
}
