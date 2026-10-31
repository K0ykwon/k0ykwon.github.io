export const options=(values,selected)=>values.map(value=>`<option value="${value}" ${value===selected?'selected':''}>${value}</option>`).join('');
export const grid=(n,cells)=>`<div class="demo-board" style="--board-size:${n}" role="group" aria-label="${n} 곱하기 ${n} 체스판">${cells.join('')}</div>`;
export const cellClass=(r,c)=>`board-square ${(r+c)%2?'board-dark':'board-light'}`;
