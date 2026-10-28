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
 assert.ok(rain.opacity<sun.opacity);assert.equal(rain.warmth,0);assert.ok(rain.lamp>sun.lamp);
 assert.deepEqual(lightingAt(800,{theme:'dark'}),lightingAt(800,{theme:'light'}));
});
test('Solar timestamps parse in Seoul local time, invalid metadata uses fallback',()=>{
 assert.equal(solarMinute('2026-10-28T06:53'),413);
 assert.equal(solarMinute(null),undefined);
 for(let m=0;m<1440;m++){
 const l=lightingAt(m);assert.ok(Number.isFinite(l.opacity));assert.ok(l.opacity>=0&&l.opacity<.31);assert.ok(l.brightness>=.66&&l.brightness<=1);
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

test('Laptop emission is off in daylight, including morning and daytime weather',()=>{
 for(const weather of ['clear','cloud','rain','snow']){
  assert.equal(lightingAt(480,{sunrise:412,sunset:1058,weather}).screenPower,0);
  assert.equal(lightingAt(720,{sunrise:412,sunset:1058,weather}).screenPower,0);
 }
 assert.equal(lightingAt(1320).screenPower,1);
 for(let m=0;m<1440;m++){
  const a=lightingAt(m).screenPower,b=lightingAt(m+.01).screenPower;
  assert.ok(a>=0&&a<=1);assert.ok(Math.abs(a-b)<.001);
 }
});
