import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';

const read = file=>readFileSync(new URL('../'+file,import.meta.url),'utf8');

test('Short desktop layout scales the original scene and all hotspots proportionally',()=>{
 const html=read('index.html'),css=read('styles.css'),pages=read('desk-pages.css');
 const desk=html.match(/class="desk-art"[^>]+src="assets\/desk-wide-v9\.webp"[^>]+width="(\d+)" height="(\d+)"/);
 assert.ok(desk);
 assert.match(css,/\.desk-art\{object-fit:contain\}/);
 const rule=pages.match(/@media \(min-width: 801px\) and \(max-height: 820px\) \{[\s\S]*?\.desk \{ width: min\(100%, calc\(max\(220px, 100svh - var\(--header-height\) - (\d+)px\) \* ([\d.]+)\)\); \}/);
 assert.ok(rule);
 const [,,widthRatio]=rule;
 assert.ok(Math.abs(Number(widthRatio)-Number(desk[1])/Number(desk[2]))<1e-6);
 assert.ok(Number(rule[1])>=250);
 assert.match(css,/@media\(max-width:800px\)\{\.desk\{width:100%\}/);
 for(const slug of ['about','research','software','blog','contact']){
   assert.match(html,new RegExp(`class="hotspot hotspot-${slug}" href="#${slug}"`));
 }
 assert.match(html,/id="lamp-toggle"/);
 assert.match(html,/id="seoul-clock"/);
});

test('Section entrances never hide rendered content and retain reduced-motion scroll behavior',()=>{
 const app=read('app.js'),css=read('styles.css');
 assert.doesNotMatch(app,/prepareSectionEntrance|section-enter|entrance-delay|animate:false/);
 assert.doesNotMatch(css,/section-enter|section-rise|stream-char/);
 assert.match(app,/document\.getElementById\('page-title'\)\.textContent=english\(page.title\)/);
 assert.match(app,/content\.innerHTML=page\.body/);
 assert.match(app,/scrollIntoView\(\{behavior:reducedMotion\(\)\?'instant':'smooth'/);
});
