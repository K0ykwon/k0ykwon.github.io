import {options,grid,cellClass} from '../../../blog/demo-common.js?v=20261031-content-folders';
import {polygonCounts} from '../../../blog/algorithms.js?v=20261030-editorial';
import {getLanguage} from '../../../i18n.js?v=20261031-content-folders';

function polygon(root,signal){
 root.innerHTML=`<p>굵은 변에 붙은 삼각형이나 사각형을 고정한 상태다. 꼭짓점을 바꾸면 남은 영역과 그 배치의 분할 수가 달라진다.</p><div class="demo-controls"><label>꼭짓점 수 <input type="range" data-size min="3" max="12" value="6" step="1"><output data-size-label></output></label><label>분할 <select data-mode><option value="triangle">삼각형</option><option value="quad">사각형</option></select></label><label>기준 변에 붙은 꼭짓점 <select data-pivot></select></label></div><div data-output></div>`;
 function render(reset=false){const n=+root.querySelector('[data-size]').value,quad=root.querySelector('[data-mode]').value==='quad',pivot=root.querySelector('[data-pivot]');root.querySelector('[data-size-label]').textContent=`${n}각형`;
  if(reset){const choices=[];if(!quad){for(let k=1;k<n-1;k++)choices.push([String(k),`꼭짓점 ${k}`]);}else if(n%2===0){for(let a=1;a<n-1;a+=2)for(let b=a+1;b<n-1;b+=2)choices.push([`${a},${b}`,`${a}, ${b}`]);}pivot.innerHTML=choices.map(([v,t])=>`<option value="${v}">${t}</option>`).join('');pivot.disabled=!choices.length;}
  const counts=polygonCounts(n),points=Array.from({length:n},(_,i)=>{const a=-Math.PI/2+i*2*Math.PI/n;return [180+136*Math.cos(a),165+136*Math.sin(a)];}),coords=indices=>indices.map(i=>points[i].join(',')).join(' ');let parts=[],face=[],contribution=0n,formula='';
  if(!quad){const k=+pivot.value;face=[0,k,n-1];parts=[Array.from({length:k+1},(_,i)=>i),Array.from({length:n-k},(_,i)=>i+k)];contribution=counts.triangles[k+1]*counts.triangles[n-k];formula=`T[${k+1}] × T[${n-k}]`;}
  else if(n%2===0){const [a,b]=pivot.value.split(',').map(Number);face=[0,a,b,n-1];parts=[Array.from({length:a+1},(_,i)=>i),Array.from({length:b-a+1},(_,i)=>i+a),Array.from({length:n-b},(_,i)=>i+b)];contribution=counts.quadrangles[a+1]*counts.quadrangles[b-a+1]*counts.quadrangles[n-b];formula=getLanguage()==='en'?`Q(${a+1}-gon) × Q(${b-a+1}-gon) × Q(${n-b}-gon)`:`Q(${a+1}각형) × Q(${b-a+1}각형) × Q(${n-b}각형)`;}
  const colors=['#7c968855','#8299b255','#b7a08055'];const total=quad?counts.quadrangles[n]:counts.triangles[n];
  root.querySelector('[data-output]').innerHTML=`<div class="demo-two-up"><svg class="polygon-picture" viewBox="0 0 360 330" role="img" aria-label="${n}각형의 ${quad?'사각':'삼각'}분할"><polygon points="${coords(points.map((_,i)=>i))}" fill="var(--paper)" stroke="currentColor"/>${parts.map((indices,i)=>`<polygon points="${coords(indices)}" fill="${colors[i]}" stroke="currentColor" stroke-width="1"/>`).join('')}${face.length?`<polygon points="${coords(face)}" fill="#d7b47255" stroke="currentColor" stroke-width="1.8"/>`:''}<path d="M${points[0].join(' ')} L${points[n-1].join(' ')}" stroke="currentColor" stroke-width="4"/>${points.map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="4" fill="currentColor"/><text x="${180+(x-180)*1.12}" y="${170+(y-165)*1.12}" text-anchor="middle">${i}</text>`).join('')}</svg><div class="demo-readout"><span>전체 ${quad?'사각':'삼각'}분할</span><strong class="demo-big-number">${total}</strong>${quad&&n%2?'<p>홀수 개 꼭짓점은 전부 사각형으로 나눌 수 없습니다.</p>':`<p>선택한 기준 도형의 기여</p><code>${formula}</code><strong>${contribution}</strong><small>각 영역의 경우의 수를 곱하고, 모든 기준 도형 선택을 더합니다.</small>`}</div></div>`;
 }
 root.addEventListener('input',e=>render(e.target.matches('[data-size],[data-mode]')),{signal});render(true);
}

export const DEMOS={'polygon':polygon};
