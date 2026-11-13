import {renderTransmissionDemo} from './demo.js?v=20261031-research-posts';
const approach={
  "ko": "전송할 영역과 영역당 전송량을 따로 결정합니다. 먼저 예산에 맞춰 우선순위가 높은 패치를 고르고, 오토인코더의 병목 표현으로 선택한 패치의 전송량을 줄입니다. 아래 예시에서는 전송 예산에 따라 어느 영역이 먼저 선택되는지 볼 수 있습니다.",
  "en": "The pipeline has two decisions. Patch ranking decides which regions fit the transmission budget. An autoencoder bottleneck reduces the payload for each selected patch. The illustration varies the budget so readers can see which regions are sent first."
};
export default {topic:"HYPERSPECTRAL IMAGING",approach,renderDemo:renderTransmissionDemo};
