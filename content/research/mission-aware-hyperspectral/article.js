import {renderTransmissionDemo} from './demo.js?v=20261031-research-posts';
const approach={
  "ko": "전송할 영역과 영역당 전송량을 따로 결정합니다. 먼저 예산에 맞춰 우선순위가 높은 패치를 고르고, 오토인코더의 병목 표현으로 선택한 패치의 전송량을 줄입니다. 아래 예시에서는 전송 예산에 따라 어느 영역이 먼저 선택되는지 볼 수 있습니다.",
  "en": "The pipeline has two decisions. Patch ranking decides which regions fit the transmission budget. An autoencoder bottleneck reduces the payload for each selected patch. The illustration varies the budget so readers can see which regions are sent first."
};
const results={en:"Across three seeds on KSC and Salinas, spectral-priority selection improved the precision and recall of important patches across multiple budgets. The autoencoder reduced latent payload bytes by approximately 613× and 710.5×, respectively; these figures describe the compared payloads, not end-to-end transmission.",ko:"KSC와 Salinas에서 세 시드로 실험한 결과, 스펙트럼 기반 우선순위는 여러 예산에서 중요 패치의 정밀도와 재현율을 높였습니다. 오토인코더의 잠재 표현 페이로드 바이트는 각각 약 613배와 710.5배 줄었습니다. 이 수치는 비교한 페이로드에 관한 것이며 전체 전송량을 뜻하지 않습니다."};
export default {results,source:"https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE12954313",topic:"HYPERSPECTRAL IMAGING",approach,renderDemo:renderTransmissionDemo};
