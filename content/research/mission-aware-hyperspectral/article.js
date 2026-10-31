import {renderTransmissionDemo} from './demo.js?v=20261031-research-posts';
const approach={
  "ko": "초분광 영상을 공간 패치로 나누고, 제한된 전송 예산 안에서 정보성이 높은 영역을 먼저 선택합니다. 선택한 패치의 잠재 표현을 전송해 영상 전체를 동일한 우선순위로 보내는 부담을 줄이는 구조입니다.",
  "en": "The image is divided into spatial patches, and informative regions are prioritized within a transmission budget. Sending latent representations of the selected patches reduces the burden of treating every region as equally urgent."
};
export default {topic:"HYPERSPECTRAL IMAGING",approach,renderDemo:renderTransmissionDemo};
