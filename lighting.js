// Continuous Seoul daylight: the site's manual colour theme is deliberately absent.
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a));return t*t*(3-2*t);};
export function solarMinute(value){const match=typeof value==='string'&&value.match(/T(\d{2}):(\d{2})/);return match?Number(match[1])*60+Number(match[2]):undefined;}
export function lightingAt(minute,{sunrise=420,sunset=1080,weather='clear'}={}){
  const daylight=smooth(sunrise-45,sunrise+45,minute)*(1-smooth(sunset-45,sunset+45,minute));
  const golden=Math.max(1-smooth(0,75,Math.abs(minute-sunrise)),1-smooth(0,75,Math.abs(minute-sunset)))*daylight;
  const overcast=['cloud','rain','snow'].includes(weather);
  const night=[162,183,209],day=overcast?[204,215,225]:[255,244,224],warm=[248,201,157];
  const rgb=night.map((n,i)=>Math.round((n+(day[i]-n)*daylight)*(1-(overcast?0:golden*.65))+warm[i]*(overcast?0:golden*.65)));
  return {color:`rgb(${rgb.join(' ')})`,opacity:.025+daylight*(overcast?.055:.09)+golden*(overcast?0:.025),brightness:.66+.34*daylight,saturation:.76+.24*daylight,warmth:overcast?0:golden*.22};
}
