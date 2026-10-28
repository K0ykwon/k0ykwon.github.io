// The two scene lights follow external daylight, independently of the interface theme.
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a));return t*t*(3-2*t);};
export function solarMinute(value){const match=typeof value==='string'&&value.match(/T(\d{2}):(\d{2})/);return match?Number(match[1])*60+Number(match[2]):undefined;}
export function lightingAt(minute,{sunrise=420,sunset=1080,weather='clear'}={}){
 const day=smooth(sunrise,sunrise+45,minute)*(1-smooth(sunset-75,sunset-20,minute));
 const dawn=smooth(sunrise-90,sunrise-40,minute)*(1-smooth(sunrise,sunrise+45,minute));
 const dusk=smooth(sunset-75,sunset-20,minute)*(1-smooth(sunset+15,sunset+65,minute));
 const night=clamp(1-day-dawn-dusk);
 const daylight=smooth(sunrise-40,sunrise+45,minute)*(1-smooth(sunset-25,sunset+60,minute));
 const transmission={clear:1,cloud:.52,rain:.28,snow:.62}[weather]??.52;
 const external=daylight*transmission;
 const lamp=1-external;
 const golden=dusk*(weather==='clear'?1:.15);
 const weights={day,dawn,sunset:dusk,night,cloud:0,rain:0,snow:0};
 if(weather!=='clear'&&weather in weights){const w=.9*day+.7*(dawn+dusk)+.12*night;for(const k of ['day','dawn','sunset','night'])weights[k]*=1-w;weights[weather]=w;}
 const rgb=[255,Math.round(244-49*golden),Math.round(224-72*golden)];
 return {color:`rgb(${rgb.join(' ')})`,opacity:.015+external*.14+golden*.14,brightness:1,saturation:1,warmth:0,
  weatherInk:`rgb(${Math.round(32+195*(1-daylight))} ${Math.round(36+192*(1-daylight))} ${Math.round(33+191*(1-daylight))})`,roomDarkness:.1+.74*lamp,lamp,lampShade:.1+.035*lamp,lampRadius:28+24*lamp,lampRadiusY:48+38*lamp,lampTint:.48*lamp,weights};
}
