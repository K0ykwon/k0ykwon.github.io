import test from 'node:test';
import assert from 'node:assert/strict';
import {lightingAt,solarMinute,SCENE_TIMES,SCENE_WEATHERS} from '../lighting.js';
test('Light is continuous at hour and dawn/dusk boundaries',()=>{
 for(const minute of [375,420,465,1020,1080,1125,1140]){
 const a=lightingAt(minute-.01),b=lightingAt(minute+.01);
 assert.ok(Math.abs(a.opacity-b.opacity)<.001);
 assert.ok(Math.abs(a.brightness-b.brightness)<.001);
 }
});
test('Cloud and rain suppress golden light without depending on site theme',()=>{
 const sun=lightingAt(1050),rain=lightingAt(1050,{weather:'rain'});
 assert.ok(rain.opacity<sun.opacity);assert.equal(rain.warmth,0);assert.ok(rain.lamp>sun.lamp);
 assert.deepEqual(lightingAt(800,{theme:'dark'}),lightingAt(800,{theme:'light'}));
});
test('Solar timestamps parse in Seoul local time, invalid metadata uses fallback',()=>{
 assert.equal(solarMinute('2026-10-28T06:53'),413);
 assert.equal(solarMinute(null),undefined);
 for(let m=0;m<1440;m++){
 const l=lightingAt(m);assert.ok(Number.isFinite(l.opacity));assert.ok(l.opacity>=0&&l.opacity<.45);assert.ok(l.brightness>=.66&&l.brightness<=1);
 }
});

test('Night has a darker room and a stronger, wider lamp pool than noon',()=>{
 const day=lightingAt(720),night=lightingAt(1320);
 assert.ok(night.roomDarkness>day.roomDarkness+.6);
 assert.ok(night.lamp>day.lamp+.8);assert.ok(night.lampRadius>day.lampRadius+20);
});
test('Solar phases and weather image weights are bounded and normalised',()=>{
 for(const weather of ['clear','cloud','rain','snow'])for(let m=0;m<1440;m++){
 const l=lightingAt(m,{weather});assert.ok(Math.abs(Object.values(l.weights).reduce((a,b)=>a+b,0)-1)<1e-8);
 assert.ok(Object.values(l.weights).every(v=>v>=0&&v<=1));
 }
 assert.equal(lightingAt(720).weights.day,1);assert.equal(lightingAt(1320).weights.night,1);
 assert.ok(lightingAt(380).weights.dawn>.9);assert.ok(lightingAt(1080).weights.sunset>.5);
});

test('All sixteen scene combinations resolve to a distinct, matching-weather asset',async()=>{
 const {readFile,stat}=await import('node:fs/promises');
 const manifest=JSON.parse(await readFile(new URL('../assets/scenes/manifest.json',import.meta.url),'utf8'));
 assert.equal(manifest.scenes.length,16);assert.equal(new Set(manifest.scenes.map(s=>s.sha256)).size,16);
 const minutes={night:1320,dawn:380,day:720,sunset:1080};
 for(const time of SCENE_TIMES)for(const weather of SCENE_WEATHERS){
  const key=`${time}-${weather}`,l=lightingAt(minutes[time],{weather});
  const active=Object.entries(l.scenes).filter(([,weight])=>weight>0);
  assert.equal(active.length,1);assert.equal(active[0][0],key);assert.equal(active[0][1],1);
  const asset=manifest.scenes.find(s=>s.key===key);assert.ok(asset);
  assert.ok((await stat(new URL('../'+asset.file,import.meta.url))).size>10000);
 }
});
test('Solar transitions blend only adjacent phases of the current weather',()=>{
 for(const weather of SCENE_WEATHERS)for(let m=0;m<1440;m++){
  const l=lightingAt(m,{weather}),entries=Object.entries(l.scenes);
  assert.ok(Math.abs(entries.reduce((sum,[,v])=>sum+v,0)-1)<1e-8);
  assert.ok(entries.filter(([,v])=>v>0).every(([key])=>key.endsWith('-'+weather)));
  assert.ok(entries.filter(([,v])=>v>0).length<=2);
 }
});
