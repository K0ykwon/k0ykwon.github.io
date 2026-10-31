import {renderEvidenceDemo} from './demo.js?v=20261031-research-posts';
const approach={
  "ko": "부대·장소·시간·사건 표현을 원문의 근거 위치와 함께 기록합니다. 표현의 정규화와 사건 유형 구분을 위한 규칙을 마련해, 후속 데이터베이스 구성과 시뮬레이션 전처리에 사용할 수 있도록 합니다.",
  "en": "Unit, place, time and event expressions are recorded with their locations in the source evidence. Rules for normalization and event typing make these records usable for subsequent database construction and simulation preprocessing."
};
export default {topic:"HISTORICAL INFORMATION EXTRACTION",approach,renderDemo:renderEvidenceDemo};
