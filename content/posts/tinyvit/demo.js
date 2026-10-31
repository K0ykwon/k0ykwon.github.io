import {sparseDistribution} from '../../../blog/review-models.js?v=20261031-content-folders';
function distillation(root,signal){
 const original=[.6,.2,.1,.05,.03,.02];
 root.innerHTML=`<p>6개 클래스에 대한 예시 확률 [0.60, 0.20, 0.10, 0.05, 0.03, 0.02]을 사용한다. k를 바꾸면 저장하지 않은 확률들이 균등한 값으로 복원된다.</p><label class="demo-range">저장할 상위 k개 <input type="range" data-k min="1" max="6" value="2" step="1"><output data-k-label></output></label><div data-example></div>`;
 const render=()=>{const k=+root.querySelector('[data-k]').value,restored=sparseDistribution(original,k);root.querySelector('[data-k-label]').textContent=k;root.querySelector('[data-example]').innerHTML=`<div class="review-bars"><div class="review-bar-key"><span>원래 확률</span><span>복원 확률</span></div>${original.map((p,i)=>`<div class="review-bar-row"><span>C${i+1}</span><div><i style="width:${p*100}%"></i><b style="width:${restored[i]*100}%"></b></div><span>${p.toFixed(3)} / ${restored[i].toFixed(3)}</span></div>`).join('')}</div><p class="demo-caption">복원 확률의 합 ${restored.reduce((a,b)=>a+b,0).toFixed(3)} · 상위 값 ${k}개와 해당 인덱스를 저장한다. 그래프는 저장 바이트 수나 정확도 개선을 측정한 결과가 아니다.</p>`;};root.addEventListener('input',render,{signal});render();
}

export const DEMOS={'review-distillation':distillation};
