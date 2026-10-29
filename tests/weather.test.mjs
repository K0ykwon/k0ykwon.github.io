import test from 'node:test';
import assert from 'node:assert/strict';
import {seoulParts,seasonFor,outsideFor,conditionFor,parseWeather,cachedScene} from '../weather.js';
test('Seoul date and hour cross the UTC date boundary',()=>{const p=seoulParts(new Date('2026-10-26T17:30:00Z'));assert.equal(p.day,27);assert.equal(p.hour,2);assert.equal(p.month,10);});
test('Seasons include year boundary and month changes',()=>{assert.equal(seasonFor(12),'winter');assert.equal(seasonFor(3),'spring');assert.equal(seasonFor(8),'summer');assert.equal(seasonFor(10),'autumn');});
test('Outside respects actual sunset even when local hour would suggest day',()=>{assert.equal(outsideFor(18,false),'night');assert.equal(outsideFor(18,true),'sunset');assert.equal(outsideFor(9,true),'day');assert.equal(outsideFor(2),'night');});
test('Wintry precipitation and storms map to the correct visual',()=>{assert.equal(conditionFor(85).kind,'snow');assert.equal(conditionFor(96).kind,'rain');assert.equal(conditionFor(48).kind,'cloud');});
test('Weather failures cannot be presented as fabricated live measurements',()=>{assert.throws(()=>parseWeather({current:{temperature_2m:null,weather_code:0,is_day:1}}));assert.throws(()=>parseWeather({current:{temperature_2m:12,weather_code:0,is_day:9}}));assert.deepEqual(parseWeather({current:{temperature_2m:12.6,weather_code:61,is_day:0}}),{temperature:13,isDay:false,kind:'rain',label:'Rain',icon:'☂'});});

test('Recent weather survives a return visit while solar metadata expires at the Seoul date boundary',()=>{
 const raw=JSON.stringify({kind:'rain',fetchedAt:Date.parse('2026-10-29T14:30:00Z'),date:'2026-10-29',solarTimes:{sunrise:400,sunset:1040}});
 assert.deepEqual(cachedScene(raw,new Date('2026-10-29T14:45:00Z')),{kind:'rain',solarTimes:{sunrise:400,sunset:1040}});
 assert.deepEqual(cachedScene(raw,new Date('2026-10-29T15:05:00Z')),{kind:'rain',solarTimes:{}});
 assert.equal(cachedScene(raw,new Date('2026-10-30T15:05:00Z')),null);
});
test('Missing, broken, future-dated or invalid cached weather safely falls back',()=>{
 const now=new Date('2026-10-29T03:00:00Z');
 for(const raw of [null,'broken','{}',JSON.stringify({kind:'rain',fetchedAt:now.getTime()+1000}),JSON.stringify({kind:'invalid',fetchedAt:now.getTime()})])assert.equal(cachedScene(raw,now),null);
});
