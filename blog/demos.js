import {getLanguage} from '../i18n.js?v=20261030-experience-art';
import {mountReviewDemo} from './review-demos.js?v=20261030-experience-art';
import {queensSolutions,bishopPlacement,towerStages,polygonCounts,factorialComparison} from './algorithms.js?v=20261030-editorial';
const sampleBishops=[[1,1,0,1,1],[0,1,0,0,0],[1,0,1,0,1],[1,0,0,0,0],[1,0,1,1,1]];
const options=(values,selected)=>values.map(value=>`<option value="${value}" ${value===selected?'selected':''}>${value}</option>`).join('');
const grid=(n,cells)=>`<div class="demo-board" style="--board-size:${n}" role="group" aria-label="${n} 곱하기 ${n} 체스판">${cells.join('')}</div>`;
const cellClass=(r,c)=>`board-square ${(r+c)%2?'board-dark':'board-light'}`;
function queens(root,signal){
 root.innerHTML=`<p>슬라이더는 퀸을 놓은 행 수를 조절한다. 붉은 칸은 다음 행에서 공격받는 위치이고, 화살표는 다른 해로 전환한다.</p><div class="demo-controls"><label>보드 크기 <select data-size>${options([4,5,6,7,8],4)}</select></label><div class="demo-solution"><button type="button" data-move="-1" aria-label="이전 해">←</button><output data-solution></output><button type="button" data-move="1" aria-label="다음 해">→</button></div><label class="demo-range">배치 단계 <input type="range" data-step min="0" max="4" value="2" step="1"><output data-step-label></output></label></div><div data-output></div>`;
 let n=4,solutions=queensSolutions(n),selected=0;
 function render(){const path=solutions[selected],step=+root.querySelector('[data-step]').value;const placed=path.slice(0,step);let available=0;
  const cells=[];for(let r=0;r<n;r++)for(let c=0;c<n;c++){
   const queen=r<step&&path[r]===c,attacked=r===step&&placed.some((column,row)=>column===c||Math.abs(column-c)===step-row);
   if(r===step&&!attacked)available|=1<<c;
   cells.push(`<span class="${cellClass(r,c)} ${queen?'board-placed':''} ${attacked?'board-attacked':''}" aria-label="${r+1}행 ${c+1}열${queen?' 퀸':attacked?' 공격받는 칸':''}">${queen?'♛':attacked?'·':''}</span>`);
  }
  root.querySelector('[data-solution]').textContent=`${selected+1} / ${solutions.length}개 해`;
  root.querySelector('[data-step-label]').textContent=`${step} / ${n}행`;
  root.querySelector('[data-output]').innerHTML=`<div class="demo-two-up">${grid(n,cells)}<div class="demo-readout"><strong>${step===n?'배치 완성':`다음은 ${step+1}번째 행`}</strong><p>${step===n?`${n}개의 퀸이 서로 공격하지 않습니다.`:'붉은 칸은 앞서 놓인 퀸에게 공격받습니다.'}</p>${step<n?`<span>다음 행의 available</span><code class="demo-bits">${Array.from({length:n},(_,c)=>(available>>c)&1).join(' ')}</code><small>왼쪽부터 열 1 … ${n}. 1인 칸에 놓을 수 있습니다.</small>`:''}</div></div>`;
 }
 root.addEventListener('input',e=>{if(e.target.matches('[data-size]')){n=+e.target.value;solutions=queensSolutions(n);selected=0;root.querySelector('[data-step]').max=n;root.querySelector('[data-step]').value=Math.min(2,n);}render();},{signal});
 root.addEventListener('click',e=>{const button=e.target.closest('[data-move]');if(button){selected=(selected+Number(button.dataset.move)+solutions.length)%solutions.length;render();}},{signal});render();
}
function bishops(root,signal){
 let board=sampleBishops.map(row=>[...row]);
 root.innerHTML=`<p>칸을 누르면 비숍을 놓을 수 있는 칸과 없는 칸(×)이 전환된다. 판이 바뀔 때마다 최대 배치 수를 다시 계산한다.</p><div class="demo-controls"><label>보드 크기 <select data-size>${options([4,5,6],5)}</select></label><button type="button" data-reset="sample">문제 예시</button><button type="button" data-reset="all">모든 칸 허용</button></div><div data-output></div>`;
 function render(focus){const n=board.length,result=bishopPlacement(board),chosen=new Set(result.positions.map(([r,c])=>`${r},${c}`)),cells=[];
  for(let r=0;r<n;r++)for(let c=0;c<n;c++){const placed=chosen.has(`${r},${c}`);cells.push(`<button type="button" data-cell="${r},${c}" class="${cellClass(r,c)} ${board[r][c]?'':'board-blocked'} ${placed?'board-placed':''}" aria-pressed="${!!board[r][c]}" aria-label="${r+1}행 ${c+1}열, ${board[r][c]?'배치 가능':'배치 불가'}, 클릭해 변경">${placed?'♝':board[r][c]?'':'×'}</button>`);}
  root.querySelector('[data-output]').innerHTML=`<div class="demo-two-up">${grid(n,cells)}<div class="demo-readout"><span>놓을 수 있는 비숍</span><strong class="demo-big-number">${result.count}</strong><p>짝수 색 ${result.black} + 홀수 색 ${result.white}</p><small>같은 색 칸끼리 대각선 충돌을 검사한다. × 칸을 지나가는 공격도 유효하다.</small></div></div>`;
  if(focus)root.querySelector(`[data-cell="${focus}"]`)?.focus({preventScroll:true});
 }
 root.addEventListener('change',e=>{if(e.target.matches('[data-size]')){const n=+e.target.value;board=Array.from({length:n},()=>Array(n).fill(1));render();}},{signal});
 root.addEventListener('click',e=>{const cell=e.target.closest('[data-cell]'),reset=e.target.closest('[data-reset]');if(cell){const [r,c]=cell.dataset.cell.split(',').map(Number);board[r][c]^=1;render(cell.dataset.cell);}else if(reset){if(reset.dataset.reset==='sample'){board=sampleBishops.map(row=>[...row]);root.querySelector('[data-size]').value=5;}else board=board.map(row=>row.map(()=>1));render();}},{signal});render();
}
function towerPicture(state,limit){
 const scale=175/Math.max(1,limit),colors=['#7c9688','#b7a080','#8299b2','#b08f8c'];let rectangles='';
 for(const [side,blocks] of [state.high,state.low].entries()){let y=215;blocks.forEach((h,i)=>{const height=h*scale;y-=height;rectangles+=`<rect x="${45+side*145}" y="${y}" width="90" height="${height}" fill="${colors[i%colors.length]}" stroke="var(--paper)"/><text x="${90+side*145}" y="${y+height/2+4}" text-anchor="middle" class="tower-label">${h}</text>`;});}
 return `<svg class="tower-picture" viewBox="0 0 330 250" role="img" aria-label="높은 탑 ${state.tall}, 낮은 탑 ${state.low.reduce((a,b)=>a+b,0)}"><path d="M25 216 H310" fill="none" stroke="currentColor"/>${rectangles}<text x="90" y="241" text-anchor="middle">높은 탑</text><text x="235" y="241" text-anchor="middle">낮은 탑</text></svg>`;
}
function towers(root,signal){
 let blocks=[1,2,3,4,6],stages=towerStages(blocks),difference=0;
 root.innerHTML=`<p>슬라이더는 처리한 블록 수를 조절한다. 표에서 높이 차이를 선택하면 해당 DP 상태의 두 탑이 표시된다.</p><form class="demo-controls" data-block-form><label>블록 높이 <input data-blocks value="1 2 3 4 6" aria-describedby="block-limit"></label><button type="submit">계산</button><small id="block-limit">최대 8개, 각각 1–30</small></form><p data-error role="alert"></p><label class="demo-range">처리한 블록 <input type="range" data-step min="0" max="5" value="5" step="1"><output data-step-label></output></label><div data-output></div>`;
 function render(){const step=+root.querySelector('[data-step]').value,states=stages[step];if(!states.has(difference))difference=0;const chosen=states.get(difference),limit=Math.floor(blocks.reduce((a,b)=>a+b,0)/2),rows=[...states].sort((a,b)=>a[0]-b[0]);
  root.querySelector('[data-step-label]').textContent=`${step} / ${blocks.length}`;
  root.querySelector('[data-output]').innerHTML=`<p class="demo-caption">처리 순서: ${blocks.map((h,i)=>`<span class="block-chip ${i<step?'is-used':''}">${h}</span>`).join(' ')} · ${states.size}개 상태</p><div class="demo-two-up"><div>${towerPicture(chosen,limit)}<p class="demo-caption">차이 ${difference}, 높은 탑 ${chosen.tall}, 낮은 탑 ${chosen.tall-difference}</p></div><div class="state-table-wrap"><table class="state-table"><thead><tr><th>차이 d</th><th>높은 탑 a</th><th>낮은 탑 a−d</th></tr></thead><tbody>${rows.slice(0,16).map(([d,s])=>`<tr ${d===difference?'class="is-selected"':''}><td><button type="button" data-difference="${d}" aria-pressed="${d===difference}">${d}</button></td><td>${s.tall}</td><td>${s.tall-d}</td></tr>`).join('')}</tbody></table>${rows.length>16?'<small>작은 차이부터 16개 상태를 표시합니다.</small>':''}</div></div><p class="demo-caption">현재 단계에서 가능한 같은 높이의 최대 탑: <strong>${states.get(0).tall||'아직 없음'}</strong></p>`;
 }
 root.addEventListener('submit',e=>{if(!e.target.matches('[data-block-form]'))return;e.preventDefault();const parsed=root.querySelector('[data-blocks]').value.trim().split(/[\s,]+/).map(Number);if(parsed.length<1||parsed.length>8||parsed.some(n=>!Number.isInteger(n)||n<1||n>30)){root.querySelector('[data-error]').textContent='1–30 사이 정수를 최대 8개 입력해 주세요.';return;}root.querySelector('[data-error]').textContent='';blocks=parsed.sort((a,b)=>a-b);stages=towerStages(blocks);difference=0;root.querySelector('[data-step]').max=blocks.length;root.querySelector('[data-step]').value=blocks.length;render();},{signal});
 root.addEventListener('input',e=>{if(e.target.matches('[data-step]'))render();},{signal});
 root.addEventListener('click',e=>{const b=e.target.closest('[data-difference]');if(b){difference=+b.dataset.difference;render();root.querySelector(`[data-difference="${difference}"]`)?.focus({preventScroll:true});}},{signal});render();
}
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
function factorial(root,signal){
 root.innerHTML=`<p>P와 N에 따라 앞쪽 구간(N개)과 뒤쪽 구간(P − N − 1개)의 길이가 달라진다. 테두리가 있는 쪽이 실제 코드에서 선택하는 구간이다.</p><div class="demo-controls"><label>소수 P <select data-prime>${options([7,11,17,31,97],11)}</select></label><label class="demo-range">N <input type="range" data-n min="0" max="10" value="8" step="1"><output data-n-label></output></label></div><div data-output></div>`;
 function render(){const p=+root.querySelector('[data-prime]').value,input=root.querySelector('[data-n]');input.max=p-1;if(+input.value>=p)input.value=p-1;const n=+input.value,result=factorialComparison(n,p);root.querySelector('[data-n-label]').textContent=n;
  root.querySelector('[data-output]').innerHTML=`<div class="factorial-paths"><div class="${result.chosen==='direct'?'is-chosen':''}"><span>앞에서 계산</span><strong>${n}개 인수</strong><code>N! mod P = ${result.direct}</code></div><div class="${result.chosen==='wilson'?'is-chosen':''}"><span>뒤에서 계산</span><strong>${result.tail}개 인수 + 역원</strong><code>L = ${p} − ${n} − 1 = ${result.tail}</code></div></div><div class="demo-factors">${Array.from({length:p-1},(_,i)=>`<span class="${i+1<=n?'factor-front':'factor-tail'}">${i+1}</span>`).join('')}</div><p class="demo-caption">짧은 쪽: <strong>${result.chosen==='direct'?'앞쪽 N!':'뒤쪽 L!'}</strong> · 뒤쪽 계산: L! ≡ ${result.tailFactorial}, 역원 ≡ ${result.inverse} (mod ${p})</p><div class="demo-answer"><span>두 계산의 결과</span><strong>${result.direct} = ${result.wilson}</strong></div>`;
 }
 root.addEventListener('input',render,{signal});render();
}
export function mountDemo(root,type,signal){if(type.startsWith('review-'))return mountReviewDemo(root,type,signal);({queens,bishops,towers,polygon,factorial}[type])(root,signal);}
