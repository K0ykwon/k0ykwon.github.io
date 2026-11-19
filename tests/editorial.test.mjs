import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {getSection} from '../content/index.js';
import {getBlogPost} from '../blog/ui.js';
import {getResearchPost} from '../content/research/articles.js';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('Editorial shell has one home heading, reachable sections, and no desk-image dependency',()=>{
 const html=read('index.html');
 assert.match(html,/<h1 id="home-title"/);
 assert.match(html,/id="page-view"[^>]+\bhidden/);
 assert.match(html,/<main id="main-content" tabindex="-1">/);
 assert.doesNotMatch(html,/desk-art|desk-wide|weather-widget|lamp-toggle/);
 for(const section of ['about','research','software','blog','contact']){
   assert.match(html,new RegExp(`href="#${section}" data-section="${section}"`));
   for(const lang of ['en','ko'])assert.ok(getSection(section,lang)?.title);
 }
});

test('Home feature routes and existing linked content remain available',()=>{
 const html=read('index.html');
 assert.ok(getResearchPost('mission-aware-hyperspectral','en'));
 assert.ok(getBlogPost('geo-harness'));
 assert.ok(getBlogPost('weight-space-programming'));
 assert.match(html,/#research\/mission-aware-hyperspectral/);
 assert.match(html,/#blog\/geo-harness/);
 assert.match(getSection('software','en').body,/apps\/p2imap/);
 for(const path of ['apps/newsletter/index.html','apps/p2imap/index.html','assets/cv/youngkwon-ko-cv.pdf']){
  assert.ok(readFileSync(new URL('../'+path,import.meta.url)).length);
 }
});
