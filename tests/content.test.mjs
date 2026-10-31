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
