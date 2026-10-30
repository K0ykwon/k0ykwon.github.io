import test from 'node:test';
import assert from 'node:assert/strict';
import {POSTS} from '../blog/posts.js';
import {renderBlogArticle,getBlogPost,getPostDemos} from '../blog/ui.js';
import {positionalEncoding,twoModeEnergy,costMixerExample} from '../blog/extra-review-models.js';
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
test('Each article can place multiple independent demos at its relevant section with stable bilingual ids',()=>{
 for(const post of POSTS){
  const ko=getPostDemos(post),en=getPostDemos(localizePost(post,'en'));
  assert.deepEqual(ko.map(({id,type,after})=>({id,type,after})),en.map(({id,type,after})=>({id,type,after})));
  for(const demo of en){assert.doesNotMatch(demo.title,/[가-힣]/);assert.ok(post.sections.some(s=>s.id===demo.after));}
  const rendered=renderBlogArticle(post);assert.equal([...rendered.matchAll(/ data-demo="/g)].length,ko.length);
  for(const demo of ko)assert.match(rendered,new RegExp(`id="${post.slug}-${demo.id}"`));
 }
 assert.equal(getPostDemos(getBlogPost('cv-qaoa-continuous-problems')).length,2);
});
test('Sinusoidal encoding has unit-length pairs and position-shift invariant inner products',()=>{
 const dot=(a,b)=>a.reduce((sum,v,i)=>sum+v*b[i],0);
 for(let pos=0;pos<64;pos++){const pe=positionalEncoding(pos);for(let i=0;i<16;i+=2)near(pe[i]**2+pe[i+1]**2,1);}
 near(dot(positionalEncoding(2),positionalEncoding(7)),dot(positionalEncoding(15),positionalEncoding(20)));
});
test('Two-mode energy loss is minimized at the target mixture rather than the mean-only prediction',()=>{
 for(const a of [.5,1,2,4]){const best=twoModeEnergy(a,.5);near(best.mixtureLoss,a);near(best.pointLoss,2*a);for(const p of [0,.1,.25,.75,.9,1])assert.ok(twoModeEnergy(a,p).mixtureLoss>best.mixtureLoss);}
});
test('Cost and Fourier mixer preserve norm and match the analytic Gaussian quadratic update',()=>{
 for(const shape of ['quadratic','double-well'])for(const eta of [0,.8,2])for(const gamma of [0,.35,1.5]){
  const result=costMixerExample({eta,gamma,shape});near(result.norm,1);assert.ok(result.densityDrift<1e-14);
  if(gamma===0)result.afterMixer.forEach((p,i)=>near(p,result.density[i]));
 }
 const eta=.8,gamma=.35,result=costMixerExample({eta,gamma});
 const expectedVariance=(1-eta*gamma)**2*.8**2+gamma**2/(4*.8**2);
 near(result.finalCost,expectedVariance/2);
 const initial=costMixerExample({eta:0,gamma:0});initial.re.forEach((v,i)=>near(v,initial.initial[i]));
});

import {localizePost} from '../blog/localization.js';
test('Korean mode preserves English article titles and all headings while retaining Korean prose',()=>{
 for(const original of POSTS){
  const ko=localizePost(original,'ko'),en=localizePost(original,'en');
  assert.equal(ko.title,en.title);
  assert.deepEqual(ko.sections.map(s=>s.title),en.sections.map(s=>s.title));
  for(let i=0;i<ko.sections.length;i++){
   const headings=html=>[...html.matchAll(/<(h[2-6]|th)\b[^>]*>[\s\S]*?<\/\1>/g)].map(m=>m[0]);
   assert.deepEqual(headings(ko.sections[i].html),headings(en.sections[i].html));
  }
  assert.match(ko.sections.map(s=>s.html).join(''),/[가-힣]/);
  assert.deepEqual(getPostDemos(ko).map(d=>d.title),getPostDemos(en).map(d=>d.title));
 }
});
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
