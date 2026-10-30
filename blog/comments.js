import {COMMENTS_CONFIG} from './comments-config.js?v=20261030-language-comments';
import {getLanguage,t} from '../i18n.js?v=20261030-paper-sections';
export function commentAttributes(post,config=COMMENTS_CONFIG){
 if(!config.categoryId)return null;
 return {'data-repo':config.repo,'data-repo-id':config.repoId,'data-category':config.category,'data-category-id':config.categoryId,'data-mapping':'specific','data-term':`blog/${post.slug}`,'data-strict':'1','data-reactions-enabled':'1','data-emit-metadata':'0','data-input-position':'top','data-loading':'lazy','data-theme':document.documentElement.dataset.theme==='dark'?'dark_dimmed':'light','data-lang':getLanguage()};
}
export function mountComments(root,post,signal){
 const attributes=commentAttributes(post);
 if(!attributes){root.querySelector('[data-comments-status]').textContent=t('Comments are not available yet.');return;}
 root.querySelector('[data-comments-status]').textContent='';
 const script=document.createElement('script');script.src='https://giscus.app/client.js';script.crossOrigin='anonymous';script.async=true;
 for(const [key,value] of Object.entries(attributes))script.setAttribute(key,value);
 const update=()=>root.querySelector('iframe.giscus-frame')?.contentWindow?.postMessage({giscus:{setConfig:{lang:getLanguage(),theme:document.documentElement.dataset.theme==='dark'?'dark_dimmed':'light'}}},'https://giscus.app');
 const observer=new MutationObserver(update);observer.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme','lang']});
 if(root.querySelector('iframe.giscus-frame')){update();signal.addEventListener('abort',()=>observer.disconnect(),{once:true});return;}
 script.addEventListener('error',()=>{if(!signal.aborted)root.querySelector('[data-comments-status]').textContent=t('Comments could not be loaded.');},{signal});
 signal.addEventListener('abort',()=>{observer.disconnect();script.remove();},{once:true});root.querySelector('.giscus').append(script);
}
