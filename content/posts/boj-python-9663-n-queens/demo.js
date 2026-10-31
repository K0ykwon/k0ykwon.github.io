import {options,grid,cellClass} from '../../../blog/demo-common.js?v=20261031-content-folders';
import {queensSolutions} from '../../../blog/algorithms.js?v=20261030-editorial';

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

export const DEMOS={'queens':queens};
