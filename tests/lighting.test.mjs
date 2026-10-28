import test from 'node:test';
import assert from 'node:assert/strict';
import {lightingAt,solarMinute} from '../lighting.js';
test('Light is continuous at hour and dawn/dusk boundaries',()=>{
 for(const minute of [375,420,465,1020,1080,1125,1140]){
 const a=lightingAt(minute-.01),b=lightingAt(minute+.01);
 assert.ok(Math.abs(a.opacity-b.opacity)<.001);
 assert.ok(Math.abs(a.brightness-b.brightness)<.001);
 }
});
test('Cloud and rain suppress golden light without depending on site theme',()=>{
 const sun=lightingAt(1050),rain=lightingAt(1050,{weather:'rain'});
 assert.ok(rain.opacity<sun.opacity);assert.equal(rain.warmth,0);
 assert.deepEqual(lightingAt(800,{theme:'dark'}),lightingAt(800,{theme:'light'}));
});
test('Solar timestamps parse in Seoul local time, invalid metadata uses fallback',()=>{
 assert.equal(solarMinute('2026-10-28T06:53'),413);
 assert.equal(solarMinute(null),undefined);
 for(let m=0;m<1440;m++){
 const l=lightingAt(m);assert.ok(Number.isFinite(l.opacity));assert.ok(l.opacity>=0&&l.opacity<.2);assert.ok(l.brightness>=.66&&l.brightness<=1);
 }
});
