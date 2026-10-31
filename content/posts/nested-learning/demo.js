import {memorySchedule} from '../../../blog/review-models.js?v=20261031-content-folders';
function memory(root,signal){
 root.innerHTML=`<p>1·4·16 입력마다 갱신하는 세 모듈의 예시 일정이다. 각 칸은 입력 하나이며, 채워진 칸은 업데이트 시점이다. 메모리의 내용이나 기억 정확도를 시뮬레이션하지 않는다.</p><label class="demo-range">입력 진행 <input type="range" data-step min="0" max="32" value="16" step="1"><output data-step-label></output></label><div data-example></div>`;
 const render=()=>{const step=+root.querySelector('[data-step]').value,schedule=memorySchedule(step);root.querySelector('[data-step-label]').textContent=`${step} / 32`;root.querySelector('[data-example]').innerHTML=`<div class="review-memory">${schedule.map(({period,count,updates})=>`<div class="review-memory-row"><div><strong>주기 ${period}</strong><small>${count}회 갱신</small></div><div class="review-memory-track" aria-label="주기 ${period}, ${count}회 갱신">${updates.map((updated,i)=>`<span class="${updated?'is-update':i<step?'is-past':''}" title="입력 ${i+1}${updated?': 갱신':''}"></span>`).join('')}</div></div>`).join('')}</div><p class="demo-caption">동일한 ${step}개 입력이 들어와도 모듈마다 갱신 횟수가 다르다. 실제 CMS는 이 일정에 각 모듈의 학습 목적과 업데이트 규칙을 결합한다.</p>`;};root.addEventListener('input',render,{signal});render();
}

export const DEMOS={'review-memory':memory};
