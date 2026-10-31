import {ENGLISH_POSTS} from './posts-en.js?v=20261031-content-folders';
export function preserveEnglishHeadings(html,englishHTML){
 const headings=[...englishHTML.matchAll(/<(h[2-6]|th)\b[^>]*>[\s\S]*?<\/\1>/g)].map(match=>match[0]);
 let index=0;
 return html.replace(/<(h[2-6]|th)\b[^>]*>[\s\S]*?<\/\1>/g,match=>headings[index++]??match);
}
export function localizePost(post,language){
 if(!post)return post;
 const translation=ENGLISH_POSTS[post.slug];
 if(!translation)return {...post,language:'ko'};
 if(language!=='en')return {...post,language:'ko',title:translation.title,
  demoTitle:translation.demoTitle??post.demoTitle,
  demos:post.demos?.map(demo=>({...demo,title:translation.demos?.find(item=>item.id===demo.id)?.title??demo.title})),
  sections:post.sections.map(section=>{const en=translation.sections.find(item=>item.id===section.id);return {...section,title:en?.title??section.title,html:en?preserveEnglishHeadings(section.html,en.html):section.html};}),
  sources:post.sources?.map((source,index)=>({...source,title:translation.sourceText?.[index]?.title??source.title}))};
 const {sourceText,...fields}=translation;
 return {...post,...fields,language:'en',sources:post.sources?.map((source,index)=>({...source,...sourceText?.[index]}))};
}
