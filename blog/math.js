import katex from '../assets/vendor/katex/katex.mjs';

// Only explicit, authored math nodes are rendered; code and ordinary prose stay intact.
const cache=new Map();
const decode=value=>value.replace(/&(?:amp|lt|gt|quot|#39);/g,entity=>({'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&#39;':"'"}[entity]));
export function renderMath(html){
 return html.replace(/<(span|div) data-math="(inline|display)">([\s\S]*?)<\/\1>/g,(_,tag,mode,source)=>{
  const tex=decode(source),key=mode+'\0'+tex;
  if(!cache.has(key))cache.set(key,katex.renderToString(tex,{displayMode:mode==='display',output:'htmlAndMathml',throwOnError:true,trust:false,strict:'error'}));
  return `<${tag} class="${mode==='display'?'article-equation':'math-inline'}"${mode==='display'?' tabindex="0"':''}>${cache.get(key)}</${tag}>`;
 });
}
