import {renderCCTVDemo} from './demo.js?v=20261031-research-posts';
const approach={
  "ko": "탐지 후보가 여러 프레임에서 지속되는지 확인한 뒤 경보를 내고 근거 프레임을 함께 저장합니다. 아래 예시는 지속적으로 보이는 후보와 짧게 나타나는 반사를 비교해 시간축 검증이 경보에 미치는 영향을 보여줍니다.",
  "en": "The pipeline checks whether a candidate persists across frames before raising an alert, then stores the evidence with the alert. The illustration compares a persistent candidate with a brief reflection to show how the temporal check affects the decision."
};
export default {topic:"MULTI-CAMERA FIRE AND SMOKE DETECTION",approach,renderDemo:renderCCTVDemo};
