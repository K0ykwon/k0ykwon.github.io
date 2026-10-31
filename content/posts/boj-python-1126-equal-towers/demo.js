import {options,grid,cellClass} from '../../../blog/demo-common.js?v=20261031-content-folders';
import {towerStages} from '../../../blog/algorithms.js?v=20261030-editorial';

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

export const DEMOS={'towers':towers};
