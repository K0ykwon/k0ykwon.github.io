import {options,grid,cellClass} from '../../../blog/demo-common.js?v=20261031-content-folders';
import {factorialComparison} from '../../../blog/algorithms.js?v=20261030-editorial';

function factorial(root,signal){
 root.innerHTML=`<p>P와 N에 따라 앞쪽 구간(N개)과 뒤쪽 구간(P − N − 1개)의 길이가 달라진다. 테두리가 있는 쪽이 실제 코드에서 선택하는 구간이다.</p><div class="demo-controls"><label>소수 P <select data-prime>${options([7,11,17,31,97],11)}</select></label><label class="demo-range">N <input type="range" data-n min="0" max="10" value="8" step="1"><output data-n-label></output></label></div><div data-output></div>`;
 function render(){const p=+root.querySelector('[data-prime]').value,input=root.querySelector('[data-n]');input.max=p-1;if(+input.value>=p)input.value=p-1;const n=+input.value,result=factorialComparison(n,p);root.querySelector('[data-n-label]').textContent=n;
  root.querySelector('[data-output]').innerHTML=`<div class="factorial-paths"><div class="${result.chosen==='direct'?'is-chosen':''}"><span>앞에서 계산</span><strong>${n}개 인수</strong><code>N! mod P = ${result.direct}</code></div><div class="${result.chosen==='wilson'?'is-chosen':''}"><span>뒤에서 계산</span><strong>${result.tail}개 인수 + 역원</strong><code>L = ${p} − ${n} − 1 = ${result.tail}</code></div></div><div class="demo-factors">${Array.from({length:p-1},(_,i)=>`<span class="${i+1<=n?'factor-front':'factor-tail'}">${i+1}</span>`).join('')}</div><p class="demo-caption">짧은 쪽: <strong>${result.chosen==='direct'?'앞쪽 N!':'뒤쪽 L!'}</strong> · 뒤쪽 계산: L! ≡ ${result.tailFactorial}, 역원 ≡ ${result.inverse} (mod ${p})</p><div class="demo-answer"><span>두 계산의 결과</span><strong>${result.direct} = ${result.wilson}</strong></div>`;
 }
 root.addEventListener('input',render,{signal});render();
}

export const DEMOS={'factorial':factorial};
