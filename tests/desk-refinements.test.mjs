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

test('Entrance is a non-blocking first-visit outline pass with a separate artwork dissolve',()=>{
 const html=read('index.html'), css=read('styles.css'), app=read('app.js');
 assert.match(html,/if\(!location.hash\)document\.documentElement\.dataset\.deskEntry="ink"/);
 assert.doesNotMatch(app,/deskEntry|desk-ink/);
 assert.match(html,/class="desk-ink-entry"[^>]+aria-hidden="true"\s+focusable="false"/);
 for(const id of ['lamp-shade','window','laptop','notebook','papers']){
   assert.match(html,new RegExp(`id="ink-${id}" pathLength="1"`));
   assert.match(html,new RegExp(`href="#ink-${id}"`));
 }
 assert.match(html,/<rect class="desk-ink-paper" width="950" height="416"\/>/);
 assert.doesNotMatch(html,/desk-ink-reveal/);
 assert.match(css,/\.desk-ink-entry\{display:none\}/);
 assert.match(css,/@media\(prefers-reduced-motion:no-preference\)\{\s+html\[data-desk-entry=ink\] \.desk-ink-entry\s*\{[^}]*pointer-events:none[^}]*1500ms/);
 assert.match(css,/stroke-dasharray:1;stroke-dashoffset:1/);
 const paper=css.match(/\.desk-ink-paper \{fill:var\(--paper\);animation:desk-ink-dissolve (\d+)ms (\d+)ms ease-in-out both\}/);
 assert.ok(paper);
 const strokeRules=[...css.matchAll(/animation:desk-ink-stroke (\d+)ms (\d+)ms/g)];
 const extraObjectDelays=[...css.matchAll(/\.ink-objects use:nth-child[^{}]*\{animation-delay:(\d+)ms/g)];
 assert.equal(strokeRules.length,3);
 assert.equal(extraObjectDelays.length,2);
 const latestStroke=Math.max(
   ...strokeRules.map(([,duration,delay])=>Number(duration)+Number(delay)),
   Number(strokeRules[1][1])+Math.max(...extraObjectDelays.map(([,delay])=>Number(delay)))
 );
 assert.ok(Number(paper[2])-latestStroke>=100,'Leave a visible pause after every outline has finished');
 assert.ok(Number(paper[1])+Number(paper[2])<=1500,'Complete the art reveal before the overlay is removed');
 const inkFade=css.match(/animation:desk-ink-dissolve (\d+)ms (\d+)ms ease-out both/);
 assert.ok(inkFade);
 assert.ok(Number(inkFade[2])>=Number(paper[2]),'Hold outline ink while the original artwork starts to emerge');
 assert.equal(Number(inkFade[1])+Number(inkFade[2]),1500,'Finish the sequence in exactly 1.5 seconds');
 assert.match(html,/<link rel="preload" as="image" href="assets\/desk-wide-v9\.webp" fetchpriority="high">/);
 assert.match(css,/@keyframes desk-ink-dissolve \{from \{opacity:1\}to \{opacity:0\}\}/);
});
