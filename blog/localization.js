import {ENGLISH_POSTS} from './posts-en.js?v=20261030-desk-experience';
export function localizePost(post,language){
 if(!post)return post;
 if(language!=='en')return {...post,language:'ko'};
 const translation=ENGLISH_POSTS[post.slug];
 if(!translation)return {...post,language:'ko'};
 const {sourceText,...fields}=translation;
 return {...post,...fields,language:'en',sources:post.sources?.map((source,index)=>({...source,...sourceText?.[index]}))};
}
