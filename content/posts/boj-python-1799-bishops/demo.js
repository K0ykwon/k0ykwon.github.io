import {options,grid,cellClass} from '../../../blog/demo-common.js?v=20261031-content-folders';
import {bishopPlacement} from '../../../blog/algorithms.js?v=20261030-editorial';

const sampleBishops=[[1,1,0,1,1],[0,1,0,0,0],[1,0,1,0,1],[1,0,0,0,0],[1,0,1,1,1]];
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

export const DEMOS={'bishops':bishops};
