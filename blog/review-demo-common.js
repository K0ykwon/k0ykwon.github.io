import {getLanguage} from '../i18n.js?v=20261031-content-folders';
export const text=(ko,en)=>en;
export const prose=(ko,en)=>getLanguage()==='ko'?ko:en;
export const number=value=>Math.abs(value)<1e-10?'0.000':value.toFixed(3);
export function plot(series,{min=0,max=1,left='0',right='63',label='',cursor=null }={}){
 const w=600,h=180,pad=24,toY=y=>h-pad-(y-min)/(max-min)*(h-2*pad),zero=Math.max(pad,Math.min(h-pad,toY(0)));
 return `<figure class="review-plot"><svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}"><line x1="${pad}" y1="${zero}" x2="${w-pad}" y2="${zero}" class="plot-axis"/>${series.map((s,k)=>`<polyline class="plot-line plot-series-${k}" points="${s.values.map((v,i)=>`${pad+i*(w-2*pad)/(s.values.length-1)},${toY(v)}`).join(' ')}"/>`).join('')}${cursor===null?'':`<line class="plot-cursor" x1="${pad+cursor*(w-2*pad)/(series[0].values.length-1)}" x2="${pad+cursor*(w-2*pad)/(series[0].values.length-1)}" y1="${pad}" y2="${h-pad}"/>`}<text x="${pad}" y="${h-3}">${left}</text><text x="${w-pad}" y="${h-3}" text-anchor="end">${right}</text><text x="${pad}" y="14">${number(max)}</text></svg><figcaption>${series.map((s,k)=>`<span class="plot-key-${k}">${s.label}</span>`).join('')}</figcaption></figure>`;
}
export function range(label,attribute,min,max,step,value){return `<label class="demo-range">${label}<input type="range" ${attribute} min="${min}" max="${max}" step="${step}" value="${value}"><output></output></label>`;}
export function attach(root,signal,render){
 root.classList.add('localized-demo');
 const update=()=>{for(const input of root.querySelectorAll('input[type=range]'))input.nextElementSibling.textContent=input.value;render();};
 root.addEventListener('input',update,{signal});root.addEventListener('change',update,{signal});update();
}
