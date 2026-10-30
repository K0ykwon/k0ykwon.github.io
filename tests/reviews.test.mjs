import test from 'node:test';
import assert from 'node:assert/strict';
import {POSTS} from '../blog/posts.js';
import {renderBlogArticle,getBlogPost} from '../blog/ui.js';
import {attentionExample,sparseDistribution,chunkBudget,memorySchedule} from '../blog/review-models.js';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-10,`${a} != ${b}`);
test('Five paper reviews render references and valid related articles without BOJ/code-only controls',()=>{
 const reviews=POSTS.filter(post=>post.kind==='review');assert.equal(reviews.length,5);
 for(const post of reviews){assert.equal(post.category,'Paper review');assert.ok(post.paper.authors);assert.equal(post.title,post.paper.title);assert.equal(localizePost(post,'en').title,post.paper.title);assert.equal(post.sections.at(-1).id,'summary');assert.ok(post.sections.length>=5);assert.ok(post.sources.length);const html=renderBlogArticle(post);assert.doesNotMatch(html,/undefined|acmicpc\.net|data-copy-code|#SOURCE/);const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);for(const match of html.matchAll(/data-scroll-to="([^"]+)"/g))assert.ok(ids.includes(match[1]),match[1]);for(const section of post.sections)for(const match of section.html.matchAll(/data-post="([^"]+)"/g))assert.ok(getBlogPost(match[1]));}
});
test('Attention weights normalize, respect the causal mask and produce the stated weighted sum',()=>{
 for(const causal of [false,true])for(const scale of [.5,1,3]){const result=attentionExample({causal,scale});result.weights.forEach((row,r)=>{near(row.reduce((a,b)=>a+b,0),1);row.forEach((w,c)=>{assert.ok(w>=0);if(causal&&c>r)assert.equal(w,0);});for(let d=0;d<2;d++)near(result.outputs[r][d],row.reduce((s,w,c)=>s+w*result.values[c][d],0));});}
 assert.deepEqual(attentionExample({causal:true}).weights[0],[1,0,0]);
});
test('Sparse labels retain the top entries, share residual probability, and recover the dense endpoint',()=>{
 const p=[.05,.6,.1,.2,.02,.03];for(let k=1;k<=p.length;k++){const restored=sparseDistribution(p,k);near(restored.reduce((a,b)=>a+b,0),1);const order=p.map((v,i)=>[v,i]).sort((a,b)=>b[0]-a[0]);for(const [v,i] of order.slice(0,k))near(restored[i],v);const tail=order.slice(k);for(const [,i] of tail)near(restored[i],restored[tail[0][1]]);}
 assert.deepEqual(sparseDistribution(p,p.length),p);assert.throws(()=>sparseDistribution(p,0),RangeError);
});
test('Chunk calculator accounts for incomplete final chunks and per-chunk overhead',()=>{
 assert.deepEqual(chunkBudget(24,4,.5),{steps:6,cost:9,relative:24/9});assert.equal(chunkBudget(12,8,0).steps,2);assert.equal(chunkBudget(24,1,0).relative,1);assert.ok(chunkBudget(24,4,5).relative<1);assert.throws(()=>chunkBudget(0,4,1),RangeError);
});
test('Memory timeline advances only at each scheduled update and resets at zero',()=>{
 for(let step=0;step<=32;step++)for(const item of memorySchedule(step)){assert.equal(item.count,item.updates.filter(Boolean).length);item.updates.forEach((active,index)=>assert.equal(active,index<step&&(index+1)%item.period===0));}
 assert.deepEqual(memorySchedule(16).map(m=>m.count),[16,4,1]);
});

import {localizePost} from '../blog/localization.js';
import {ENGLISH_POSTS} from '../blog/posts-en.js';
import {renderMath} from '../blog/math.js';
test('Every authored formula renders in both languages with accessible math and no TeX errors',()=>{
 for(const post of POSTS)for(const language of ['ko','en']){
  const localized=localizePost(post,language);let count=0;
  for(const section of localized.sections){
   const expected=[...section.html.matchAll(/data-math="(?:inline|display)"/g)].length;
   const html=renderMath(section.html);count+=expected;
   assert.equal([...html.matchAll(/class="katex-mathml"/g)].length,expected);
   assert.doesNotMatch(html,/katex-error|data-math=/);
   if(expected)assert.match(html,/<math[^>]*xmlns=/);
  }
  if(post.kind==='review')assert.ok(count>=2,post.slug);
 }
});
test('Math rendering decodes HTML safely and leaves code and ordinary text unchanged',()=>{
 const code='<pre><code>a &lt; b \\sum_i x_i</code></pre>';
 assert.equal(renderMath(code),code);
 assert.match(renderMath('<span data-math="inline">a &lt; b</span>'),/<mo>&lt;<\/mo>/);
 assert.match(renderMath('<div data-math="display">\\begin{aligned}a&amp;=b\\\\c&amp;=d\\end{aligned}</div>'),/katex-display/);
 assert.throws(()=>renderMath('<span data-math="inline">\\notARealCommand</span>'));
});
test('All ten articles have complete English counterparts with stable sections, code and references',()=>{
 assert.equal(POSTS.length,10);assert.equal(Object.keys(ENGLISH_POSTS).length,10);
 for(const original of POSTS){const en=localizePost(original,'en'),ko=localizePost(original,'ko');assert.equal(en.language,'en');assert.equal(ko.language,'ko');for(const key of ['id','slug','category','subcategory','code','codePath'])assert.equal(en[key],original[key]);assert.deepEqual(en.sections.map(s=>s.id),ko.sections.map(s=>s.id));assert.deepEqual(en.sources?.map(s=>s.url),ko.sources?.map(s=>s.url));for(const text of [en.title,en.summary,...(original.demo?[en.demoTitle]:[]),...en.sections.flatMap(s=>[s.title,s.html]),...(en.sources||[]).flatMap(s=>[s.title,s.detail])]){assert.ok(text);assert.doesNotMatch(text,/[가-힣]|undefined/);}}
});
