import test from 'node:test';
import assert from 'node:assert/strict';
import {readdirSync,existsSync} from 'node:fs';
import {getSection,hasSection} from '../content/index.js';
import experiences from '../content/experience/index.js';
import awards from '../content/awards/index.js';
import {publications,ongoing} from '../content/research/index.js';
import {POSTS,ENGLISH_POSTS} from '../content/posts/index.js';
import {POST_DEMOS} from '../content/posts/demos.js';
import {getPostDemos} from '../blog/ui.js';
const folders=name=>readdirSync(new URL(`../content/${name}/`,import.meta.url),{withFileTypes:true}).filter(entry=>entry.isDirectory()).map(entry=>entry.name).sort();
test('Every content folder is registered once with complete locale sources',()=>{
 for(const [name,entries] of [['experience',experiences],['awards',awards],['research',[...publications,...ongoing]],['posts',POSTS]]){
  assert.deepEqual(entries.map(entry=>entry.slug).sort(),folders(name),name);
  assert.equal(new Set(entries.map(entry=>entry.slug)).size,entries.length,name);
  for(const entry of entries)for(const file of ['meta.js','en.js','ko.js','index.js'])assert.ok(existsSync(new URL(`../content/${name}/${entry.slug}/${file}`,import.meta.url)),`${entry.slug}/${file}`);
 }
});
test('Portfolio locales retain shared headings and complete career and research contents',()=>{
 for(const key of ['about','research','software','blog','contact']){
  assert.ok(hasSection(key));const en=getSection(key,'en'),ko=getSection(key,'ko');assert.equal(en.title,ko.title);assert.doesNotMatch(en.intro,/[가-힣]/);assert.match(ko.intro,/[가-힣]/);
  const headings=body=>[...body.matchAll(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/g)].map(match=>match[1]);assert.deepEqual(headings(en.body),headings(ko.body),key);
  assert.doesNotMatch(en.body,/\{\{\w+\}\}|undefined/);assert.doesNotMatch(ko.body,/\{\{\w+\}\}|undefined/);
 }
 assert.equal(hasSection('toString'),false);assert.equal(hasSection('experience'),false);
 assert.equal([...getSection('about','en').body.matchAll(/class="timeline-item"/g)].length,experiences.length);
 assert.equal([...getSection('about','en').body.matchAll(/class="award-entry"/g)].length,awards.length);
 assert.equal([...getSection('research','en').body.matchAll(/class="publication"/g)].length,publications.length);
 for(const entry of [...experiences,...awards,...publications,...ongoing]){assert.ok(entry.html.en.includes(entry.title.replaceAll('&','&amp;')));assert.match(entry.html.ko,/[가-힣]/);}
});
test('Every declared widget belongs to its post folder and has a working renderer registration',async()=>{
 const types=[];
 for(const post of POSTS){
  const {DEMOS}=await import(`../content/posts/${post.slug}/demo.js`);
  for(const {type} of getPostDemos(post)){assert.equal(typeof DEMOS[type],'function');assert.equal(typeof POST_DEMOS[type],'function');types.push(type);}
  assert.ok(ENGLISH_POSTS[post.slug]);
 }
 assert.deepEqual(types.sort(),Object.keys(POST_DEMOS).sort());
});

test('HBR-IE fields retain exact source spans with valid accessible controls in both locales',async()=>{
 const {EXAMPLE,evidenceFor}=await import('../content/research/historical-battle-records/example.js');
 for(const language of ['en','ko']){
  const sentence=EXAMPLE[language].parts.map(part=>part.text).join('');
  for(const field of EXAMPLE.fields){const record=evidenceFor(field,language);assert.ok(record.span);assert.ok(sentence.includes(record.span));assert.equal(record.source,EXAMPLE.id);assert.equal(record.evidence,EXAMPLE.evidence);}
  assert.equal(evidenceFor('event',language).value,'Land');
  const {getResearchPost,renderResearchArticle}=await import('../content/research/articles.js');
  const body=renderResearchArticle(getResearchPost('historical-battle-records',language));
  const ids=[...body.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);assert.equal(ids.length,new Set(ids).size);
  for(const [,target] of body.matchAll(/aria-controls="([^"]+)"/g))assert.ok(ids.includes(target));
 }
 assert.equal(evidenceFor('missing'),undefined);
});


test('All three publications have separate bilingual article routes and their own visualization',async()=>{
 const {getResearchPost,renderResearchArticle}=await import('../content/research/articles.js');
 const expected={'mission-aware-hyperspectral':'hyperspectral','historical-battle-records':'hbr-ie','ship-fire-smoke':'cctv'};
 for(const language of ['en','ko']){
  const listing=getSection('research',language).body;assert.doesNotMatch(listing,/data-research-demo=/);
  for(const [slug,demo] of Object.entries(expected)){
   assert.ok(listing.includes(`href="#research/${slug}"`));
   const post=getResearchPost(slug,language);assert.equal(post.slug,slug);assert.equal(post.language,language);assert.equal(post.title,getResearchPost(slug,'en').title);assert.ok(post.summary);
   const article=renderResearchArticle(post);assert.match(article,/class="research-article"/);assert.ok(article.includes(`data-research-demo="${demo}"`));assert.equal([...article.matchAll(/data-research-demo=/g)].length,1);assert.doesNotMatch(article,/undefined|\{\{\w+\}\}/);
   const ids=[...article.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);assert.equal(ids.length,new Set(ids).size);for(const [,target] of article.matchAll(/data-scroll-to="([^"]+)"/g))assert.ok(ids.includes(target));
  }
 }
 assert.equal(getResearchPost('missing'),undefined);assert.equal(getResearchPost('pact'),undefined);
});
test('Illustrative transmission budgets select nested priorities and CCTV filters a transient candidate',async()=>{
 const {PATCHES,selectPatches}=await import('../content/research/mission-aware-hyperspectral/demo.js');
 assert.equal(PATCHES.length,48);let previous=new Set();
 for(let budget=1;budget<=48;budget++){const chosen=selectPatches(budget);assert.equal(chosen.length,budget);const ids=new Set(chosen.map(p=>p.id));assert.equal(ids.size,budget);for(const id of previous)assert.ok(ids.has(id));for(let i=1;i<chosen.length;i++)assert.ok(chosen[i-1].score>=chosen[i].score);previous=ids;}
 for(const invalid of [0,49,1.5,NaN])assert.throws(()=>selectPatches(invalid),RangeError);
 const {CAMERA_EVIDENCE,confirmedCameras}=await import('../content/research/ship-fire-smoke/demo.js');
 assert.equal(CAMERA_EVIDENCE.length,4);assert.deepEqual(confirmedCameras().map(c=>c.id),['02']);assert.equal(CAMERA_EVIDENCE.find(c=>c.kind==='reflection').frames.filter(Boolean).length,1);
});

test('About ends with direct CV downloads',async()=>{
 const {readFileSync}=await import('node:fs');
 const {default:manifest}=await import('../assets/cv/manifest.js');
 const file=path=>new URL('../'+path.split('?')[0],import.meta.url);
 assert.equal(readFileSync(file(manifest.pdf)).subarray(0,5).toString(),'%PDF-');
 for(const language of ['en','ko']){
  const body=getSection('about',language).body;
  assert.match(body,/<article class="cv-entry" id="about-cv"/);
  assert.ok(body.includes(`href="${manifest.pdf}" download=`));
  assert.ok(body.includes(`href="${manifest.source}" download=`));
  assert.ok(body.lastIndexOf('id="about-cv"')>body.lastIndexOf('GET IN TOUCH'));
  assert.doesNotMatch(body,/#about\/cv|cv-preview/);
  assert.doesNotMatch(body.slice(body.lastIndexOf('id="about-cv"')),/target=/);
 }
});
