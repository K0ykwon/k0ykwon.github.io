export const SEOUL_TIMEZONE='Asia/Seoul';
export function seoulParts(date=new Date()) {
  const parts=new Intl.DateTimeFormat('en-US',{timeZone:SEOUL_TIMEZONE,year:'numeric',month:'numeric',day:'numeric',hour:'numeric',hourCycle:'h23'}).formatToParts(date);
  return Object.fromEntries(parts.filter(p=>p.type!=='literal').map(p=>[p.type,Number(p.value)]));
}
export function seasonFor(month){return month>=3&&month<=5?'spring':month>=6&&month<=8?'summer':month>=9&&month<=11?'autumn':'winter';}
export function outsideFor(hour,isDay){if(isDay===false)return 'night';if(hour>=17&&hour<19)return 'sunset';return hour>=7&&hour<19?'day':'night';}
export function conditionFor(code){if([0,1].includes(code))return {kind:'clear',label:'Clear',icon:'☼'};if([2,3,45,48].includes(code))return {kind:'cloud',label:'Cloudy',icon:'☁'};if([71,73,75,77,85,86].includes(code))return {kind:'snow',label:'Snow',icon:'❄'};if([51,53,55,56,57,61,63,65,66,67,80,81,82,95,96,99].includes(code))return {kind:'rain',label:'Rain',icon:'☂'};return {kind:'cloud',label:'Cloudy',icon:'☁'};}
export function parseWeather(data){const c=data?.current;if(!c||!Number.isFinite(c.temperature_2m)||!Number.isFinite(c.weather_code)||![0,1].includes(c.is_day))throw new Error('Invalid weather data');return {temperature:Math.round(c.temperature_2m),isDay:Boolean(c.is_day),...conditionFor(c.weather_code)};}
