import {renderEvidenceDemo} from './demo.js?v=20261031-research-posts';
const approach={
  "ko": "구조화된 필드마다 근거가 되는 원문 구절을 함께 기록합니다. 명칭과 날짜를 정규화하고 사건 유형을 구분해 기록을 검색할 수 있게 합니다. 아래 예시에서 추출된 필드를 선택하면 근거 구절을 확인할 수 있습니다.",
  "en": "Each structured field carries the text span that supports it. Normalization gives a consistent form to names and dates, while event types make records easier to query. The illustration lets readers select an extracted field and inspect its supporting passage."
};
export default {topic:"HISTORICAL INFORMATION EXTRACTION",approach,renderDemo:renderEvidenceDemo};
